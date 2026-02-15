# automation-reference-agent-utils-helpers

**Source:** https://xgodo.com/docs/automation/reference/agent/utils/helpers

**Scraped:** 2025-01-31T19:32:00.000Z

---

# Helper Utilities

Utils

Random gesture helpers, server connectivity, and node waiting utilities

Access these methods through `agent.utils`. Utility methods for human-like interactions, server connectivity, and waiting for UI elements.

### `randomClick()`

TypeScriptCopy

```
randomClick(x1: number, y1: number, x2: number, y2: number): void
```

Performs a tap at a random position within the specified rectangle. Useful for making automations appear more human-like.

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `x1` | `number` | Left boundary |
| `y1` | `number` | Top boundary |
| `x2` | `number` | Right boundary |
| `y2` | `number` | Bottom boundary |

#### Examples

Using node.randomClick (preferred)

TypeScriptCopy

```
const button = screen.findTextOne("Submit");
if (button) {
  button.randomClick();
}
```

Using agent.utils.randomClick (legacy)

TypeScriptCopy

```
const { left, top, right, bottom } = button.boundsInScreen;
agent.utils.randomClick(left, top, right, bottom);
```

### `randomSwipe()`

TypeScriptCopy

```
randomSwipe(x1: number, y1: number, x2: number, y2: number, direction: "up" | "down" | "left" | "right"): void
```

Performs a swipe starting from a random position within the rectangle, moving in the specified direction.

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `x1` | `number` | Left boundary |
| `y1` | `number` | Top boundary |
| `x2` | `number` | Right boundary |
| `y2` | `number` | Bottom boundary |
| `direction` | `"up" | "down" | "left" | "right"` | Swipe direction |

#### Examples

Using node.randomSwipe (preferred)

TypeScriptCopy

```
const scrollView = screen.findAdvanced(f => f.isScrollable());
if (scrollView) {
  scrollView.randomSwipe("up");
}
```

Using agent.utils.randomSwipe (legacy)

TypeScriptCopy

```
agent.utils.randomSwipe(100, 500, 900, 1500, "up");
```

### `isServerReachable()`

TypeScriptCopy

```
isServerReachable(): Promise<{ reachable: true } | { reachable: false; error: string }>
```

Checks if the server is reachable. Useful for verifying connectivity before performing server-dependent operations.

#### Returns

`{ reachable: true } | { reachable: false; error: string }`Object indicating server reachability status

#### Examples

TypeScriptCopy

```
const status = await agent.utils.isServerReachable();
if (status.reachable) {
  console.log("Server is reachable");
  // Proceed with server operations
} else {
  console.log("Server unreachable:", status.error);
  // Handle offline scenario
}
```

### `waitForNode()`

TypeScriptCopy

```
waitForNode(condition: (node: AndroidNode) => boolean, durationMs?: number, intervalMs?: number): Promise<boolean>
```

Waits for a node matching the condition to appear on screen. Polls the screen at regular intervals until the condition is met or timeout is reached.

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `condition` | `(node: AndroidNode) => boolean` | Function that returns true when the desired node is found |
| `durationMs?` | `number` | Maximum time to wait in milliseconds(default: `30000`) |
| `intervalMs?` | `number` | Polling interval in milliseconds(default: `500`) |

#### Returns

`boolean`true if the node was found, false if timeout was reached

#### Examples

Wait for a button to appear

TypeScriptCopy

```
const found = await agent.utils.waitForNode(
  node => node.text === "Continue" && node.isClickable,
  10000, // 10 second timeout
  500    // Check every 500ms
);

if (found) {
  const screen = await agent.actions.screenContent();
  screen.findTextOne("Continue")?.click();
}
```

Wait for loading to complete

TypeScriptCopy

```
// Wait for progress indicator to disappear and content to load
const contentLoaded = await agent.utils.waitForNode(
  node => node.contentDescription?.includes("Main content"),
  15000
);

if (!contentLoaded) {
  console.log("Timeout waiting for content to load");
}
```

### `waitForNodeGone()`

TypeScriptCopy

```
waitForNodeGone(condition: (node: AndroidNode) => boolean, durationMs?: number, intervalMs?: number): Promise<boolean>
```

Waits for a node matching the condition to disappear from screen. Polls the screen at regular intervals until the node is gone or timeout is reached.

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `condition` | `(node: AndroidNode) => boolean` | Function that identifies the node to wait for disappearance |
| `durationMs?` | `number` | Maximum time to wait in milliseconds(default: `30000`) |
| `intervalMs?` | `number` | Polling interval in milliseconds(default: `500`) |

#### Returns

`boolean`true if the node disappeared, false if timeout was reached

#### Examples

Wait for loading spinner to disappear

TypeScriptCopy

```
const spinnerGone = await agent.utils.waitForNodeGone(
  node => node.className?.includes("ProgressBar"),
  20000 // 20 second timeout
);

if (spinnerGone) {
  console.log("Loading complete");
} else {
  console.log("Loading took too long");
}
```

Wait for dialog to close

TypeScriptCopy

```
// Click dismiss and wait for dialog to close
screen.findTextOne("Dismiss")?.click();

const dialogClosed = await agent.utils.waitForNodeGone(
  node => node.text === "Are you sure?",
  5000
);
```