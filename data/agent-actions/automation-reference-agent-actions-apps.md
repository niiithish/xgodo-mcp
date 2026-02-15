# automation-reference-agent-actions-apps

**Source:** https://xgodo.com/docs/automation/reference/agent/actions/apps

**Scraped:** 2025-01-31T19:19:00.000Z

---

# App Management

Actions

Launch apps, manage intents, and browse URLs

Access these methods through`agent.actions`. Launch and manage applications on the device.

### `launchApp()`

TypeScriptCopy

```
launchApp(packageName: string, clearExisting?: boolean): Promise<void>
```

Launches an app by its package name.

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `packageName` | `string` | The app's package name (e.g., 'com.android.settings') |
| `clearExisting?` | `boolean` | Close the existing app before launching(default: `false`) |

#### Returns

`Promise<void>`Resolves when app is launched

#### Examples

TypeScriptCopy

```
await agent.actions.launchApp("com.android.settings");
```

Launch with fresh data

TypeScriptCopy

```
await agent.actions.launchApp("com.example.app", true);
```

### `launchIntent()`

TypeScriptCopy

```
launchIntent(intentName: string, packageName: string | null, data: string | null, type: string | null, extras: object | null, flags: number, component: "activity" | "service" | "broadcast", isDataLocal?: boolean): Promise<void>
```

Launches an Android Intent with full configuration options.

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `intentName` | `string` | Action name (e.g., "android.intent.action.VIEW") |
| `packageName` | `string | null` | Target package name |
| `data` | `string | null` | Intent data URI |
| `type` | `string | null` | MIME type |
| `extras` | `object | null` | Extra data as key-value pairs |
| `flags` | `number` | Intent flags |
| `component` | `"activity" | "service" | "broadcast"` | Component type to launch |
| `isDataLocal?` | `boolean` | If true, data is a local file path |

#### Returns

`Promise<void>`Resolves when intent is launched

#### Examples

Open a URL

TypeScriptCopy

```
await agent.actions.launchIntent(
  "android.intent.action.VIEW",
  null,
  "https://example.com",
  null, null, 0, "activity"
);
```

### `listApps()`

TypeScriptCopy

```
listApps(): Promise<{[packageName: string]: string}>
```

Gets a list of all installed apps.

#### Returns

`{[packageName: string]: string}`Object mapping package names to app display names

#### Examples

TypeScriptCopy

```
const apps = await agent.actions.listApps();
console.log(apps["com.android.chrome"]); // "Chrome"
```

### `browse()`

TypeScriptCopy

```
browse(url: string, clearExistingData?: boolean): Promise<void>
```

Opens a URL in the default browser.

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `url` | `string` | URL to open |
| `clearExistingData?` | `boolean` | Clear browser data before opening |

#### Returns

`Promise<void>`Resolves when browser is launched

#### Examples

TypeScriptCopy

```
await agent.actions.browse("https://example.com");
```