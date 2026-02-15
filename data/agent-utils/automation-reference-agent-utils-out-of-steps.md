# automation-reference-agent-utils-out-of-steps

**Source:** https://xgodo.com/docs/automation/reference/agent/utils/out-of-steps

**Scraped:** 2025-01-31T19:32:00.000Z

---

# Step Tracking & Debugging

Utils

Track automation progress and debug failures

Access step tracking through `agent.utils.outOfSteps`. Used for tracking automation progress and debugging when automations run out of steps or timeout.

OutOfStepsUtils Interface

TypeScriptCopy

```
interface OutOfStepsUtils {
  storeScreen(
    screen: AndroidNode,
    stage: string,
    screenState: string,
    remainingSteps: number,
    screenshotRecord: ScreenshotRecord
  ): Promise<void>;

  submit(
    type: "outOfSteps" | "timeout" | "debug"
  ): Promise<{ success: false; error: string } | { success: true; id: string }>;
}
```

### `storeScreen()`

TypeScriptCopy

```
storeScreen(screen: AndroidNode, stage: string, screenState: string, remainingSteps: number, screenshotRecord: ScreenshotRecord): Promise<void>
```

Stores the current screen state for debugging purposes. Call this periodically during automation to track progress and help diagnose issues when automations fail.

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `screen` | `AndroidNode` | The current screen content from screenContent() |
| `stage` | `string` | Current stage/phase of the automation (e.g., 'login', 'checkout') |
| `screenState` | `string` | Description of the current screen state |
| `remainingSteps` | `number` | Number of steps remaining in the automation |
| `screenshotRecord` | `ScreenshotRecord` | Screenshot quality setting |

#### Examples

TypeScriptCopy

```
const screen = await agent.actions.screenContent();

// Store screen state for debugging
await agent.utils.outOfSteps.storeScreen(
  screen,
  "login",
  "waiting_for_credentials",
  50,
  ScreenshotRecord.LOW_QUALITY
);
```

### `submit()`

TypeScriptCopy

```
submit(type: "outOfSteps" | "timeout" | "debug"): Promise<{ success: false; error: string } | { success: true; id: string }>
```

Submits the collected screen states for analysis. Call this when the automation ends unexpectedly or for debugging.

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `type` | `"outOfSteps" | "timeout" | "debug"` | Reason for submission |

#### Returns

`{ success: true; id: string } | { success: false; error: string }`Result with submission ID on success or error message on failure

#### Examples

Submit on timeout

TypeScriptCopy

```
const result = await agent.utils.outOfSteps.submit("timeout");
if (result.success) {
  console.log("Debug data submitted with ID:", result.id);
} else {
  console.log("Failed to submit:", result.error);
}
```

Submit for debugging

TypeScriptCopy

```
// Collect screens during automation
await agent.utils.outOfSteps.storeScreen(screen1, "step1", "initial", 100, ScreenshotRecord.HIGH_QUALITY);
await agent.utils.outOfSteps.storeScreen(screen2, "step2", "processing", 80, ScreenshotRecord.LOW_QUALITY);

// Submit for analysis
await agent.utils.outOfSteps.submit("debug");
```

## Supporting Types

### ScreenshotRecord

Enum for screenshot quality settings.

TypeScriptCopy

```
enum ScreenshotRecord {
  HIGH_QUALITY,  // Full quality screenshot
  LOW_QUALITY,   // Compressed screenshot (faster, smaller)
  NONE           // No screenshot
}
```

## Usage Pattern

Complete Debugging Flow

TypeScriptCopy

```
async function runAutomation() {
  let remainingSteps = 100;

  while (remainingSteps > 0) {
    const screen = await agent.actions.screenContent();

    // Store screen state periodically
    await agent.utils.outOfSteps.storeScreen(
      screen,
      getCurrentStage(),
      describeScreen(screen),
      remainingSteps,
      ScreenshotRecord.LOW_QUALITY
    );

    // Perform automation step
    const result = await performStep(screen);
    if (!result.success) {
      // Submit debug data on failure
      await agent.utils.outOfSteps.submit("outOfSteps");
      throw new Error("Automation failed");
    }

    remainingSteps--;
  }

  // Submit on timeout if loop exits without success
  await agent.utils.outOfSteps.submit("timeout");
}
```