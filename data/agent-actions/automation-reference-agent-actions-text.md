# automation-reference-agent-actions-text

**Source:** https://xgodo.com/docs/automation/reference/agent/actions/text

**Scraped:** 2025-01-31T19:19:00.000Z

---

# Text Input Actions

Actions

Keyboard input and clipboard operations

Access these methods through `agent.actions`. Type text, manage clipboard, and handle keyboard interactions.

### `writeText()`

TypeScriptCopy

```
writeText(text: string): Promise<void>
```

Types text using keyboard input. The keyboard must be visible.

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `text` | `string` | Text to type |

#### Returns

`Promise<void>`Resolves when text is typed

#### Examples

TypeScriptCopy

```
await agent.actions.writeText("Hello World");
```

### `copyText()`

TypeScriptCopy

```
copyText(text: string): Promise<void>
```

Copies the specified text to the system clipboard.

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `text` | `string` | Text to copy to clipboard |

#### Returns

`Promise<void>`Resolves when copy is complete

#### Examples

TypeScriptCopy

```
await agent.actions.copyText("Text to copy");
```

### `paste()`

TypeScriptCopy

```
paste(): Promise<void>
```

Pastes content from the clipboard at the current cursor position.

#### Returns

`Promise<void>`Resolves when paste is complete

#### Examples

TypeScriptCopy

```
await agent.actions.paste();
```

### `reverseCopy()`

TypeScriptCopy

```
reverseCopy(): Promise<{text: string, data?: any, files?: {uri: string, mimeType: string, name: string, dataBase64: string}[]}>
```

Gets the current clipboard content including text, data, and files.

#### Returns

`{text, data?, files?}`Clipboard content with text and optional binary data/files

#### Examples

TypeScriptCopy

```
const clipboard = await agent.actions.reverseCopy();
console.log(clipboard.text);
if (clipboard.files) {
  console.log("Files:", clipboard.files.map(f => f.name));
}
```

### `hideKeyboard()`

TypeScriptCopy

```
hideKeyboard(): Promise<void>
```

Hides the software keyboard if it's currently visible.

#### Returns

`Promise<void>`Resolves when keyboard is hidden

#### Examples

TypeScriptCopy

```
await agent.actions.hideKeyboard();
```

### `inputKey()`

TypeScriptCopy

```
inputKey(keyCode: number, duration?: number, state?: "down" | "up" | null): Promise<void>
```

Sends a raw key event by Android KeyEvent code. Requires Android 13+ (SDK level 33+) and only works when the on-screen keyboard is visible.

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `keyCode` | `number` | Android KeyEvent code (e.g., 66 for ENTER) |
| `duration?` | `number` | Press duration in ms |
| `state?` | `"down" | "up" | null` | "down" for press, "up" for release, null for full press |

#### Returns

`Promise<void>`Resolves when key event is sent

#### Examples

Press Enter

TypeScriptCopy

```
await agent.actions.inputKey(66);
```

Press and hold

TypeScriptCopy

```
await agent.actions.inputKey(66, 500, "down");
```

**Note:**`inputKey()` requires Android 13+ (SDK level 33+) and will only work when the on-screen keyboard is visible. Tap on an input field first to show the keyboard.