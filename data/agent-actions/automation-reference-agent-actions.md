# automation-reference-agent-actions

**Source:** https://xgodo.com/docs/automation/reference/agent/actions

**Scraped:** 2025-01-31T13:43:40.000Z

---

# AgentActions

Interface

All automation actions for device interaction

Access these methods through `agent.actions`. All action methods are asynchronous and return Promises.

AgentActions Interface Overview

TypeScriptCopy

```
interface AgentActions {
  // Touch Gestures
  tap(x: number, y: number): Promise<void>;
  swipe(x1: number, y1: number, x2: number, y2: number, duration: number): Promise<void>;
  hold(x: number, y: number, duration: number): Promise<void>;
  doubleTap(x: number, y: number, interval: number): Promise<void>;
  multiTap(sequence: MultiTapSequenceItem[]): Promise<void>;
  swipePoly(startX: number, startY: number, sequence: Point[], duration: number, bezier?: boolean): Promise<void>;

  // Navigation (dpad requires Android 13+)
  goHome(): Promise<void>;
  goBack(): Promise<void>;
  recents(): Promise<void>;
  dpad(direction: "up" | "down" | "left" | "right" | "center"): Promise<void>;

  // Text Input (inputKey requires Android 13+)
  writeText(text: string): Promise<void>;
  copyText(text: string): Promise<void>;
  paste(): Promise<void>;
  reverseCopy(): Promise<ClipboardContent>;
  hideKeyboard(): Promise<void>;
  inputKey(keyCode: number, duration?: number, state?: "down" | "up" | null): Promise<void>;

  // App Management
  launchApp(packageName: string, clearExisting?: boolean): Promise<void>;
  launchIntent(...): Promise<void>;
  listApps(): Promise<{[packageName: string]: string}>;
  browse(url: string, clearExistingData?: boolean): Promise<void>;

  // Screen Operations
  screenContent(): Promise<AndroidNode>;
  allScreensContent(): Promise<AndroidNode[]>;
  screenshot(maxWidth: number, maxHeight: number, quality: number, ...): Promise<ScreenshotResult>;
  nodeAction(node: AndroidNode, actionInt: number, data?: object): Promise<{actionPerformed: boolean}>;
  showNotification(title: string, message: string): Promise<void>;

  // File Operations
  saveFile(fileName: string, data: string, base64?: boolean): Promise<void>;

  // Network
  airplane(): Promise<void>;

  // Image Recognition
  recognizeText(imageBase64: string): Promise<TextJSON>;
}
```

## Action Categories

[**Touch Actions**\\
\\
tap, swipe, hold, doubleTap, multiTap, swipePoly](https://xgodo.com/docs/automation/reference/agent/actions/touch) [**Navigation**\\
\\
goHome, goBack, recents, dpad (Android 13+)](https://xgodo.com/docs/automation/reference/agent/actions/navigation) [**Text Input**\\
\\
writeText, copyText, paste, reverseCopy, hideKeyboard, inputKey (Android 13+)](https://xgodo.com/docs/automation/reference/agent/actions/text) [**App Management**\\
\\
launchApp, launchIntent, listApps, browse](https://xgodo.com/docs/automation/reference/agent/actions/apps) [**Screen Operations**\\
\\
screenContent, allScreensContent, screenshot, nodeAction, showNotification](https://xgodo.com/docs/automation/reference/agent/actions/screen) [**File Operations**\\
\\
saveFile - save files to device storage](https://xgodo.com/docs/automation/reference/agent/actions/files) [**Network**\\
\\
airplane - toggle airplane mode to refresh IP on mobile network](https://xgodo.com/docs/automation/reference/agent/actions/network) [**Image Recognition**\\
\\
recognizeText - OCR using ML Kit](https://xgodo.com/docs/automation/reference/agent/actions/recognition)

## Quick Example

TypeScriptCopy

```
// Get the current screen content
const screen = await agent.actions.screenContent();

// Find a button with text "Submit"
const submitBtn = screen.findTextOne("Submit");

// Tap the button
if (submitBtn) {
  const { left, top, right, bottom } = submitBtn.boundsInScreen;
  await agent.actions.tap((left + right) / 2, (top + bottom) / 2);
}

// Or use performAction for accessibility-based click
await submitBtn.performAction(agent.constants.ACTION_CLICK);
```