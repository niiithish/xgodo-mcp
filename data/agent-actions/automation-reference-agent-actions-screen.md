# automation-reference-agent-actions-screen

**Source:** https://xgodo.com/docs/automation/reference/agent/actions/screen

**Scraped:** 2025-01-31T19:19:00.000Z

---

# Screen Actions

Actions

Screen content, screenshots, and node interactions

Access these methods through `agent.actions`. Get screen content, take screenshots, and interact with UI nodes.

### `screenContent()`

TypeScriptCopy

```
screenContent(): Promise<AndroidNode>
```

Gets the accessibility tree of the currently focused window. Returns an AndroidNode representing the root of the UI hierarchy.

#### Returns

`Promise<AndroidNode>`Root node of the accessibility tree

#### Examples

TypeScriptCopy

```
const screen = await agent.actions.screenContent();

// Find elements
const button = screen.findTextOne("Submit");
const allButtons = screen.filterAdvanced(f => f.isButton());
const input = screen.findAdvanced(f => f.isEditText().isEditable());
```

### `allScreensContent()`

TypeScriptCopy

```
allScreensContent(): Promise<AndroidNode[]>
```

Gets the accessibility trees from all visible windows (useful for dialogs, overlays).

#### Returns

`Promise<AndroidNode[]>`Array of root nodes for each window

#### Examples

TypeScriptCopy

```
const screens = await agent.actions.allScreensContent();
for (const screen of screens) {
  const dialog = screen.findTextOne("OK");
  if (dialog) break;
}
```

### `screenshot()`

TypeScriptCopy

```
screenshot(maxWidth: number, maxHeight: number, quality: number, cropX1?: number, cropY1?: number, cropX2?: number, cropY2?: number): Promise<{screenshot: string | null, compressedWidth: number, compressedHeight: number, originalWidth: number, originalHeight: number}>
```

Takes a screenshot with optional scaling and cropping.

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `maxWidth` | `number` | Maximum width to scale to |
| `maxHeight` | `number` | Maximum height to scale to |
| `quality` | `number` | JPEG quality (1-100) |
| `cropX1?` | `number` | Crop region left |
| `cropY1?` | `number` | Crop region top |
| `cropX2?` | `number` | Crop region right |
| `cropY2?` | `number` | Crop region bottom |

#### Returns

`{screenshot, compressedWidth, compressedHeight, originalWidth, originalHeight}`Screenshot data as base64 string with dimensions

#### Examples

Full screenshot

TypeScriptCopy

```
const result = await agent.actions.screenshot(1080, 1920, 80);
```

Cropped screenshot

TypeScriptCopy

```
const result = await agent.actions.screenshot(500, 500, 90, 100, 100, 600, 600);
```

### `nodeAction()`

TypeScriptCopy

```
nodeAction(node: AndroidNode | object, actionInt: number, data?: object, fieldsToIgnore?: string[]): Promise<{actionPerformed: boolean}>
```

Performs an accessibility action on a node.

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `node` | `AndroidNode | object` | The node to perform action on |
| `actionInt` | `number` | Action constant (use agent.constants.ACTION\_\*) |
| `data?` | `object` | Additional action data |
| `fieldsToIgnore?` | `string[]` | Node fields to ignore when matching |

#### Returns

`{actionPerformed: boolean}`Whether the action was successfully performed

#### Examples

Using node.performAction (preferred)

TypeScriptCopy

```
const screen = await agent.actions.screenContent();
const button = screen.findTextOne("Submit");

if (button) {
  const result = await button.performAction(agent.constants.ACTION_CLICK);
  console.log("Clicked:", result.actionPerformed);
}
```

Using agent.actions.nodeAction (legacy)

TypeScriptCopy

```
const result = await agent.actions.nodeAction(
  button,
  agent.constants.ACTION_CLICK
);
```

### `showNotification()`

TypeScriptCopy

```
showNotification(title: string, message: string): Promise<void>
```

Shows a system notification.

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `title` | `string` | Notification title |
| `message` | `string` | Notification message |

#### Returns

`Promise<void>`Resolves when notification is shown

#### Examples

TypeScriptCopy

```
await agent.actions.showNotification("Task Complete", "Your automation has finished.");
```