# automation-reference-agent-actions-navigation

**Source:** https://xgodo.com/docs/automation/reference/agent/actions/navigation

**Scraped:** 2025-01-31T19:19:00.000Z

---

# Navigation Actions

Actions

Device navigation and system button actions

Access these methods through `agent.actions`. Navigate between screens and interact with system buttons.

### `goHome()`

TypeScriptCopy

```
goHome(): Promise<void>
```

Returns to the home screen.

#### Returns

`Promise<void>`Resolves when navigation is complete

#### Examples

TypeScriptCopy

```
await agent.actions.goHome();
```

### `goBack()`

TypeScriptCopy

```
goBack(): Promise<void>
```

Presses the system back button.

#### Returns

`Promise<void>`Resolves when back action is complete

#### Examples

TypeScriptCopy

```
await agent.actions.goBack();
```

### `recents()`

TypeScriptCopy

```
recents(): Promise<void>
```

Opens the recent apps screen.

#### Returns

`Promise<void>`Resolves when recent apps screen is shown

#### Examples

TypeScriptCopy

```
await agent.actions.recents();
```

### `dpad()`

TypeScriptCopy

```
dpad(direction: "up" | "down" | "left" | "right" | "center"): Promise<void>
```

Sends a D-pad navigation event. Useful for navigating lists and menus. Requires Android 13+ (SDK level 33+).

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `direction` | `"up" | "down" | "left" | "right" | "center"` | Direction to navigate |

#### Returns

`Promise<void>`Resolves when navigation is complete

#### Examples

TypeScriptCopy

```
await agent.actions.dpad("down");
```

TypeScriptCopy

```
await agent.actions.dpad("center"); // Select/Enter
```

**Note:**`dpad()` requires Android 13+ (SDK level 33+). Check the device SDK version using `agent.info.getDeviceInfo().sdkVersion`.