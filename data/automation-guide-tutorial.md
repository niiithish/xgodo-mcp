# automation-guide-tutorial

**Source:** https://xgodo.com/docs/automation/guide/tutorial

**Scraped:** 2025-01-31T13:43:40.000Z

---

# Full Tutorial: MySocial Auto-Responder

Complete Example

Build a complete automation from scratch

This tutorial walks through building a complete automation for a fictional social media app called "MySocial". The automation will:

- Launch the app and verify login state
- Navigate to the Messages section
- Process unread conversations
- Send automated responses
- Like posts in the feed
- Log all interactions to task data

### Project Structure

This example uses ES6 imports to organize code across multiple files:

```
mysocial-responder/
├── main.ts           # Entry point & main loop
├── stages.ts         # Stage enum
├── screenStates.ts   # ScreenState enum
├── detection.ts      # Screen detection logic
├── handlers.ts       # Stage handlers
└── utils.ts          # Shared utilities
```

## Step 1: Define Stages

First, define the automation stages:

stages.ts

TypeScriptCopy

```
// Define all automation stages
export enum Stage {
  Initialize = "Initialize",
  LaunchApp = "LaunchApp",
  HandleLogin = "HandleLogin",
  NavigateToMessages = "NavigateToMessages",
  SelectUnreadChat = "SelectUnreadChat",
  ProcessMessages = "ProcessMessages",
  NavigateToFeed = "NavigateToFeed",
  LikePosts = "LikePosts",
  Complete = "Complete",
}
```

## Step 2: Define Screen States

Define all possible screen states:

screenStates.ts

TypeScriptCopy

```
// System states (can appear anytime)
export enum ScreenState {
  Unknown = "Unknown",
  Crash = "Crash",
  PhoneDialog = "PhoneDialog",
  NoInternet = "NoInternet",
  Loading = "Loading",

  // Login states
  SplashScreen = "SplashScreen",
  LoginScreen = "LoginScreen",
  LoginEnterPassword = "LoginEnterPassword",
  LoginTwoFactor = "LoginTwoFactor",
  LoginError = "LoginError",

  // Main app states
  HomeTab = "HomeTab",
  SearchTab = "SearchTab",
  MessagesTab = "MessagesTab",
  NotificationsTab = "NotificationsTab",
  ProfileTab = "ProfileTab",

  // Message states
  ChatList = "ChatList",
  ChatListEmpty = "ChatListEmpty",
  ChatConversation = "ChatConversation",
  NewMessageDialog = "NewMessageDialog",

  // Feed states
  PostDetail = "PostDetail",
  CommentSheet = "CommentSheet",

  // Dialog states
  PermissionDialog = "PermissionDialog",
  UpdateRequired = "UpdateRequired",
  RateLimited = "RateLimited",
  ErrorDialog = "ErrorDialog",
}
```

## Step 3: Utility Functions

Create shared utility functions:

utils.ts

TypeScriptCopy

```
// App package name
export const APP_PACKAGE = "com.mysocial.app";

// Sleep with optional random range
export function sleep(min: number, max?: number): Promise<void> {
  const ms = max ? Math.floor(Math.random() * (max - min) + min) : min;
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Random number in range
export function randomRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min);
}

// Collected data storage
export const collectedData: {
  messagesResponded: number;
  postsLiked: number;
  errors: string[];
  stages: { stage: string; timestamp: number }[];
} = {
  messagesResponded: 0,
  postsLiked: 0,
  errors: [],
  stages: []
};

export function recordStage(stage: string) {
  collectedData.stages.push({ stage, timestamp: Date.now() });
}

export function recordError(error: string) {
  collectedData.errors.push(error);
  console.error(error);
}
```

## Step 4: Screen Detection

Implement screen state detection:

detection.ts

TypeScriptCopy

```
import { ScreenState } from "./screenStates.js";
import { APP_PACKAGE } from "./utils.js";

export function detectScreenState(screen: AndroidNode): ScreenState {
  const allNodes = getAllNodes(screen);

  // === SYSTEM STATES (check first) ===

  // Crash dialog
  if (findNodesById(screen, "android:id/aerr_close").find(n => n.clickable)) {
    return ScreenState.Crash;
  }

  // Phone dialog
  if (allNodes.every(n => n.packageName === "com.android.phone")) {
    return ScreenState.PhoneDialog;
  }

  // No internet
  if (allNodes.find(n =>
    n.text?.toLowerCase()?.includes("no internet") ||
    n.text?.toLowerCase()?.includes("offline")
  )) {
    return ScreenState.NoInternet;
  }

  // Loading screen (minimal nodes with progress indicator)
  if (allNodes.length <= 5 && allNodes.find(n =>
    n.className?.includes("ProgressBar")
  )) {
    return ScreenState.Loading;
  }

  // Permission dialog
  if (allNodes.find(n =>
    n.packageName === "com.android.permissioncontroller"
  )) {
    return ScreenState.PermissionDialog;
  }

  // === APP STATES ===
  const appNodes = allNodes.filter(n => n.packageName === APP_PACKAGE);

  // Splash screen
  if (appNodes.find(n =>
    n.viewId === `${APP_PACKAGE}:id/splash_logo`
  )) {
    return ScreenState.SplashScreen;
  }

  // Login screen (email field)
  if (appNodes.find(n =>
    n.className === "android.widget.EditText" &&
    (n.hintText?.toLowerCase()?.includes("email") ||
     n.hintText?.toLowerCase()?.includes("username"))
  )) {
    return ScreenState.LoginScreen;
  }

  // Password screen
  if (appNodes.find(n => n.isPassword)) {
    return ScreenState.LoginEnterPassword;
  }

  // Two-factor screen
  if (appNodes.find(n =>
    n.text?.toLowerCase()?.includes("verification code") ||
    n.text?.toLowerCase()?.includes("2fa")
  )) {
    return ScreenState.LoginTwoFactor;
  }

  // Check bottom navigation tabs
  const homeTab = appNodes.find(n =>
    n.description === "Home" && n.className === "android.widget.Button"
  );
  const messagesTab = appNodes.find(n =>
    n.description === "Messages" && n.className === "android.widget.Button"
  );

  // Messages tab selected
  if (messagesTab?.isSelected) {
    // Chat conversation (has message input)
    if (appNodes.find(n =>
      n.hintText?.toLowerCase()?.includes("message") &&
      n.className === "android.widget.EditText"
    )) {
      return ScreenState.ChatConversation;
    }

    // Chat list (has conversation items)
    if (appNodes.find(n =>
      n.viewId === `${APP_PACKAGE}:id/chat_list`
    )) {
      const hasUnread = appNodes.find(n =>
        n.viewId === `${APP_PACKAGE}:id/unread_badge`
      );
      return hasUnread ? ScreenState.ChatList : ScreenState.ChatListEmpty;
    }

    return ScreenState.MessagesTab;
  }

  // Home tab selected
  if (homeTab?.isSelected) {
    return ScreenState.HomeTab;
  }

  // Profile tab
  if (appNodes.find(n =>
    n.description === "Profile" && n.isSelected
  )) {
    return ScreenState.ProfileTab;
  }

  // Error dialog
  if (appNodes.find(n =>
    n.text?.toLowerCase()?.includes("error") ||
    n.text?.toLowerCase()?.includes("something went wrong")
  ) && appNodes.find(n =>
    n.text?.toLowerCase() === "ok" && n.clickable
  )) {
    return ScreenState.ErrorDialog;
  }

  // Rate limited
  if (appNodes.find(n =>
    n.text?.toLowerCase()?.includes("rate limit") ||
    n.text?.toLowerCase()?.includes("try again later")
  )) {
    return ScreenState.RateLimited;
  }

  return ScreenState.Unknown;
}
```

## Step 5: Stage Handlers

Implement handlers for each stage:

handlers.ts

TypeScriptCopy

```
import { Stage } from "./stages.js";
import { ScreenState } from "./screenStates.js";
import { APP_PACKAGE, sleep, collectedData, recordError } from "./utils.js";

// State variables
let currentStage: Stage = Stage.Initialize;
let maxSteps = 48;
let isNetworkAvailable = true;

export function getCurrentStage() { return currentStage; }
export function getMaxSteps() { return maxSteps; }

export async function setCurrentStage(newStage: Stage) {
  currentStage = newStage;
  maxSteps = 48; // Reset step counter

  console.log(`=== Stage: ${newStage} ===`);

  await agent.utils.job.submitTask(
    "running",
    { stage: newStage, ...collectedData },
    false  // Don't finish the task
  );
}

// Network callback
agent.utils.setNetworkCallback((available) => {
  isNetworkAvailable = available;
  if (!available) {
    recordError("Network disconnected");
  }
});

// === SYSTEM HANDLERS ===

export async function handleCrash(screen: AndroidNode): Promise<boolean> {
  const closeBtn = findNodesById(screen, "android:id/aerr_close")
    .find(n => n.clickable);

  if (closeBtn) {
    console.log("Closing crash dialog...");
    await closeBtn.performAction(agent.constants.ACTION_CLICK);
    await sleep(2000);
    return true;
  }
  return false;
}

export async function handlePhoneDialog(screen: AndroidNode): Promise<boolean> {
  const allNodes = getAllNodes(screen);
  const dismissBtn = allNodes.find(n =>
    n.viewId?.includes("dismiss") || n.viewId?.includes("decline")
  );

  if (dismissBtn) {
    console.log("Dismissing phone dialog...");
    dismissBtn.randomClick();
    await sleep(2000);
    return true;
  }
  return false;
}

export async function handlePermissionDialog(screen: AndroidNode): Promise<boolean> {
  const allNodes = getAllNodes(screen);
  const allowBtn = allNodes.find(n =>
    n.text?.toLowerCase()?.includes("allow") && n.clickable
  );

  if (allowBtn) {
    console.log("Granting permission...");
    await allowBtn.performAction(agent.constants.ACTION_CLICK);
    await sleep(1000);
    return true;
  }
  return false;
}

export async function handleErrorDialog(screen: AndroidNode): Promise<boolean> {
  const allNodes = getAllNodes(screen);
  const okBtn = allNodes.find(n =>
    n.text?.toLowerCase() === "ok" && n.clickable
  );

  if (okBtn) {
    console.log("Dismissing error dialog...");
    await okBtn.performAction(agent.constants.ACTION_CLICK);
    await sleep(1000);
    return true;
  }
  return false;
}

// === STAGE HANDLERS ===

export async function handleInitialize() {
  // Verify app is installed
  const apps = await agent.actions.listApps();
  if (!apps[APP_PACKAGE]) {
    throw new Error("MySocial app not installed");
  }

  console.log("App installed, proceeding...");
  await setCurrentStage(Stage.LaunchApp);
}

export async function handleLaunchApp(
  state: ScreenState,
  screen: AndroidNode
) {
  if (state === ScreenState.HomeTab || state === ScreenState.MessagesTab) {
    // Already in app
    await setCurrentStage(Stage.NavigateToMessages);
    return;
  }

  if (state === ScreenState.LoginScreen ||
      state === ScreenState.LoginEnterPassword) {
    await setCurrentStage(Stage.HandleLogin);
    return;
  }

  if (state === ScreenState.SplashScreen || state === ScreenState.Loading) {
    await sleep(2000, 3000);
    return;
  }

  // Launch the app
  console.log("Launching MySocial...");
  await agent.actions.launchApp(APP_PACKAGE);
  await sleep(3000);
}

export async function handleLogin(
  state: ScreenState,
  screen: AndroidNode
) {
  const allNodes = getAllNodes(screen);
  const { email, password } = agent.arguments.jobVariables;

  if (state === ScreenState.LoginScreen) {
    // Enter email
    const emailField = allNodes.find(n =>
      n.className === "android.widget.EditText" &&
      n.hintText?.toLowerCase()?.includes("email")
    );

    if (emailField) {
      await emailField.performAction(agent.constants.ACTION_FOCUS);
      await sleep(500);
      await agent.actions.writeText(email);
      await sleep(500);

      // Click next/continue
      const nextBtn = allNodes.find(n =>
        n.clickable &&
        (n.text?.toLowerCase() === "next" ||
         n.text?.toLowerCase() === "continue")
      );
      if (nextBtn) {
        await nextBtn.performAction(agent.constants.ACTION_CLICK);
      }
      await sleep(2000);
    }
    return;
  }

  if (state === ScreenState.LoginEnterPassword) {
    // Enter password
    const passwordField = allNodes.find(n => n.isPassword);

    if (passwordField) {
      await passwordField.performAction(agent.constants.ACTION_FOCUS);
      await sleep(500);
      await agent.actions.writeText(password);
      await sleep(500);
      await agent.actions.hideKeyboard();

      // Click login
      const loginBtn = allNodes.find(n =>
        n.clickable &&
        (n.text?.toLowerCase() === "login" ||
         n.text?.toLowerCase() === "sign in")
      );
      if (loginBtn) {
        await loginBtn.performAction(agent.constants.ACTION_CLICK);
      }
      await sleep(3000);
    }
    return;
  }

  if (state === ScreenState.HomeTab || state === ScreenState.MessagesTab) {
    console.log("Login successful!");
    await setCurrentStage(Stage.NavigateToMessages);
  }
}

export async function handleNavigateToMessages(
  state: ScreenState,
  screen: AndroidNode
) {
  if (state === ScreenState.MessagesTab || state === ScreenState.ChatList) {
    await setCurrentStage(Stage.SelectUnreadChat);
    return;
  }

  // Click messages tab
  const allNodes = getAllNodes(screen);
  const messagesTab = allNodes.find(n =>
    n.description === "Messages" &&
    n.className === "android.widget.Button" &&
    n.clickable
  );

  if (messagesTab) {
    console.log("Navigating to messages...");
    await messagesTab.performAction(agent.constants.ACTION_CLICK);
    await sleep(2000);
  }
}

export async function handleSelectUnreadChat(
  state: ScreenState,
  screen: AndroidNode
) {
  if (state === ScreenState.ChatConversation) {
    await setCurrentStage(Stage.ProcessMessages);
    return;
  }

  if (state === ScreenState.ChatListEmpty) {
    console.log("No unread messages, moving to feed...");
    await setCurrentStage(Stage.NavigateToFeed);
    return;
  }

  const allNodes = getAllNodes(screen);

  // Find unread chat
  const unreadChat = allNodes.find(n =>
    n.viewId === `${APP_PACKAGE}:id/chat_item` &&
    getAllNodes(n).find(child =>
      child.viewId === `${APP_PACKAGE}:id/unread_badge`
    )
  );

  if (unreadChat) {
    console.log("Opening unread chat...");
    unreadChat.randomClick();
    await sleep(2000);
  } else {
    // No more unread, move to feed
    console.log("No more unread chats, moving to feed...");
    await setCurrentStage(Stage.NavigateToFeed);
  }
}

export async function handleProcessMessages(
  state: ScreenState,
  screen: AndroidNode
) {
  const allNodes = getAllNodes(screen);
  const { responseMessage } = agent.arguments.automationParameters;

  // Find message input
  const messageInput = allNodes.find(n =>
    n.hintText?.toLowerCase()?.includes("message") &&
    n.className === "android.widget.EditText"
  );

  if (messageInput) {
    // Type response
    await messageInput.performAction(agent.constants.ACTION_FOCUS);
    await sleep(500);
    await agent.actions.writeText(responseMessage || "Thanks for your message!");
    await sleep(500);

    // Send message
    const sendBtn = allNodes.find(n =>
      (n.description?.toLowerCase() === "send" ||
       n.viewId?.includes("send")) &&
      n.clickable
    );

    if (sendBtn) {
      await sendBtn.performAction(agent.constants.ACTION_CLICK);
      collectedData.messagesResponded++;
      console.log(`Message sent! Total: ${collectedData.messagesResponded}`);
      await sleep(1500);
    }
  }

  // Go back to chat list
  await agent.actions.goBack();
  await sleep(1000);
  await setCurrentStage(Stage.SelectUnreadChat);
}

export async function handleNavigateToFeed(
  state: ScreenState,
  screen: AndroidNode
) {
  if (state === ScreenState.HomeTab) {
    await setCurrentStage(Stage.LikePosts);
    return;
  }

  const allNodes = getAllNodes(screen);
  const homeTab = allNodes.find(n =>
    n.description === "Home" &&
    n.className === "android.widget.Button" &&
    n.clickable
  );

  if (homeTab) {
    console.log("Navigating to feed...");
    await homeTab.performAction(agent.constants.ACTION_CLICK);
    await sleep(2000);
  }
}

export async function handleLikePosts(
  state: ScreenState,
  screen: AndroidNode
) {
  const { maxLikes } = agent.arguments.automationParameters;

  if (collectedData.postsLiked >= (maxLikes || 5)) {
    console.log("Reached max likes, completing...");
    await setCurrentStage(Stage.Complete);
    return;
  }

  const allNodes = getAllNodes(screen);

  // Find like button (not already liked)
  const likeBtn = allNodes.find(n =>
    n.viewId === `${APP_PACKAGE}:id/like_button` &&
    n.description !== "Unlike" &&
    n.clickable
  );

  if (likeBtn) {
    console.log("Liking post...");
    await likeBtn.performAction(agent.constants.ACTION_CLICK);
    collectedData.postsLiked++;
    await sleep(1000, 2000);

    // Scroll to next post
    await agent.actions.swipe(540, 1500, 540, 800, 500);
    await sleep(1000);
  } else {
    // Scroll to find more posts
    await agent.actions.swipe(540, 1500, 540, 500, 500);
    await sleep(1500);
  }
}
```

## Step 6: Main Entry Point

Finally, create the main entry point that ties everything together:

main.ts

TypeScriptCopy

```
import { Stage } from "./stages.js";
import { ScreenState } from "./screenStates.js";
import { detectScreenState } from "./detection.js";
import {
  getCurrentStage,
  getMaxSteps,
  setCurrentStage,
  handleCrash,
  handlePhoneDialog,
  handlePermissionDialog,
  handleErrorDialog,
  handleInitialize,
  handleLaunchApp,
  handleLogin,
  handleNavigateToMessages,
  handleSelectUnreadChat,
  handleProcessMessages,
  handleNavigateToFeed,
  handleLikePosts
} from "./handlers.js";
import { sleep, collectedData, recordError } from "./utils.js";

// File storage for screenshots
const files: { name: string; extension: string; base64Data: string }[] = [];

// Dismiss notification shade if visible
async function dismissNotifications(): Promise<boolean> {
  const screens = await agent.actions.allScreensContent();
  const allNodes = screens.flatMap(s => getAllNodes(s));

  const notif = allNodes.find(n =>
    n.viewId === "com.android.systemui:id/expandableNotificationRow" &&
    n.actions.includes(agent.constants.ACTION_DISMISS)
  );

  if (notif) {
    await notif.performAction(agent.constants.ACTION_DISMISS);
    await sleep(500);
    return true;
  }

  return false;
}

// Handle system-level interruptions
async function handleSystemStates(
  state: ScreenState,
  screen: AndroidNode
): Promise<boolean> {
  // First check notifications
  if (await dismissNotifications()) {
    return true;
  }

  switch (state) {
    case ScreenState.Crash:
      return await handleCrash(screen);

    case ScreenState.PhoneDialog:
      return await handlePhoneDialog(screen);

    case ScreenState.PermissionDialog:
      return await handlePermissionDialog(screen);

    case ScreenState.ErrorDialog:
      return await handleErrorDialog(screen);

    case ScreenState.NoInternet:
      console.log("Waiting for network...");
      await sleep(5000);
      return true;

    case ScreenState.Loading:
      await sleep(2000);
      return true;

    case ScreenState.RateLimited:
      console.log("Rate limited, waiting 60 seconds...");
      await sleep(60000);
      return true;
  }

  return false;
}

// Main screen state handler
async function handleScreenState(
  state: ScreenState,
  screen: AndroidNode
) {
  // Handle system states first
  if (await handleSystemStates(state, screen)) {
    return;
  }

  const currentStage = getCurrentStage();

  switch (currentStage) {
    case Stage.Initialize:
      await handleInitialize();
      break;

    case Stage.LaunchApp:
      await handleLaunchApp(state, screen);
      break;

    case Stage.HandleLogin:
      await handleLogin(state, screen);
      break;

    case Stage.NavigateToMessages:
      await handleNavigateToMessages(state, screen);
      break;

    case Stage.SelectUnreadChat:
      await handleSelectUnreadChat(state, screen);
      break;

    case Stage.ProcessMessages:
      await handleProcessMessages(state, screen);
      break;

    case Stage.NavigateToFeed:
      await handleNavigateToFeed(state, screen);
      break;

    case Stage.LikePosts:
      await handleLikePosts(state, screen);
      break;
  }
}

// Main automation function
async function main() {
  console.log("=== MySocial Auto-Responder Starting ===");

  try {
    await setCurrentStage(Stage.Initialize);
    let maxSteps = 48;
    let sameStateCount = 0;
    let lastState: ScreenState | null = null;

    while (maxSteps-- > 0) {
      // Get current screen
      const screen = await agent.actions.screenContent();
      const state = detectScreenState(screen);

      console.log(`[Step ${48 - maxSteps}] State: ${state}, Stage: ${getCurrentStage()}`);

      // Store screen for debugging
      await agent.utils.outOfSteps.storeScreen(
        screen,
        getCurrentStage(),
        state,
        maxSteps,
        state === ScreenState.Unknown
          ? ScreenshotRecord.HIGH_QUALITY
          : ScreenshotRecord.LOW_QUALITY
      );

      // Check for stuck state
      if (state === lastState) {
        sameStateCount++;
        if (sameStateCount >= 5) {
          console.warn(`Stuck on ${state}, attempting recovery...`);
          await agent.actions.goBack();
          await sleep(1000);
          sameStateCount = 0;
        }
      } else {
        lastState = state;
        sameStateCount = 0;
      }

      // Handle the screen state
      await handleScreenState(state, screen);

      // Check if complete
      if (getCurrentStage() === Stage.Complete) {
        break;
      }

      // Delay between iterations
      await sleep(500, 1000);
    }

    // Check completion status
    if (getCurrentStage() === Stage.Complete) {
      console.log("=== Automation Complete! ===");
      console.log(`Messages responded: ${collectedData.messagesResponded}`);
      console.log(`Posts liked: ${collectedData.postsLiked}`);

      await agent.utils.job.submitTask("success", {
        ...collectedData,
        completedAt: new Date().toISOString()
      }, true, files);
    } else {
      // Out of steps
      console.warn("Out of steps!");
      const result = await agent.utils.outOfSteps.submit("outOfSteps");

      await agent.utils.job.submitTask("failed", {
        ...collectedData,
        error: "OUT_OF_STEPS",
        outOfStepsId: result.success ? result.id : null
      }, true, files);
    }

  } catch (error) {
    console.error("Automation error:", error);

    // Capture error screenshot
    try {
      const screenshot = await agent.actions.screenshot(1080, 1920, 80);
      files.push({
        name: "error_screenshot",
        extension: "jpg",
        base64Data: screenshot.base64
      });
    } catch (e) {
      // Ignore screenshot errors
    }

    await agent.utils.job.submitTask("failed", {
      ...collectedData,
      error: String(error),
      stage: getCurrentStage()
    }, true, files);

  } finally {
    // Always stop the automation
    stopCurrentAutomation();
  }
}

// Start the automation
main();
```

## Configuration Schema

Configure the automation parameters and job variables in the Options panel:

Automation Parameters Schema

TypeScriptCopy

```
{
  "fields": [\
    {\
      "name": "responseMessage",\
      "type": "string",\
      "required": false,\
      "description": "Message to send as response",\
      "defaultValue": "Thanks for reaching out!"\
    },\
    {\
      "name": "maxLikes",\
      "type": "number",\
      "required": false,\
      "description": "Maximum posts to like",\
      "defaultValue": 5,\
      "min": 1,\
      "max": 20\
    }\
  ]
}
```

Job Variables Schema

TypeScriptCopy

```
{
  "fields": [\
    {\
      "name": "email",\
      "type": "string",\
      "required": true,\
      "description": "MySocial account email"\
    },\
    {\
      "name": "password",\
      "type": "string",\
      "required": true,\
      "description": "MySocial account password"\
    }\
  ]
}
```

## Key Patterns Used

### Stage-Based Organization

The automation is divided into clear stages (Initialize, LaunchApp, HandleLogin, etc.) with step counters reset at each transition.

### Comprehensive Screen Detection

Detection handles system states (crash, phone, permissions) before app states, using multiple conditions for reliable identification.

### Error Recovery

Stuck state detection with automatic recovery (go back), notification dismissal, and network monitoring throughout execution.

### Data Collection

Progress is submitted throughout with`submitTask("running", ...)`, and final results include all collected metrics.

### Out-of-Steps Handling

Screens are stored continuously with`storeScreen()`, and out-of-steps reports are submitted for debugging.

### ES6 Module Organization

Code is organized into separate files with clean imports, making it easy to maintain and test individual components.

## Running the Automation

1. Save all files in the IDE
2. Configure automation parameters and job variables schemas
3. Go to Devices → Automation Runner
4. Select your automation and target device(s)
5. Fill in parameters (response message, max likes)
6. Fill in job variables (email, password)
7. Click Start and monitor progress

### Congratulations!

You've built a complete automation with all the essential patterns. Use this as a template for your own automations, adapting the stages, screen states, and handlers for your target app.

## Next Steps

[**API Reference →** \\
Explore all available methods and types](https://xgodo.com/docs/automation/reference) [**Actions Reference →** \\
All touch, navigation, and input actions](https://xgodo.com/docs/automation/reference/agent/actions) [**AndroidNode Reference →** \\
Screen content structure and filtering](https://xgodo.com/docs/automation/reference/android-node)