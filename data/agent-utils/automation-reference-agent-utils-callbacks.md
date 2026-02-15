# automation-reference-agent-utils-callbacks

**Source:** https://xgodo.com/docs/automation/reference/agent/utils/callbacks

**Scraped:** 2025-01-31T19:32:00.000Z

---

# Event Callbacks

Utils

Network and toast event handlers

Access these methods through `agent.utils`. Register callbacks to receive system events during automation.

**Note:** For notification callbacks, see [agent.notifications](https://xgodo.com/docs/automation/reference/agent/notifications).

### `setNetworkCallback()`

TypeScriptCopy

```
setNetworkCallback(callback: NetworkCallback | null): void
```

Registers a callback to receive network state changes. Pass null to unregister.

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `callback` | `(networkAvailable: boolean) => void` | Callback function or null to unregister |

#### Examples

TypeScriptCopy

```
agent.utils.setNetworkCallback((networkAvailable) => {
  if (!networkAvailable) {
    console.log("Network disconnected!");
  }
});
```

### `toastCallback`

TypeScriptCopy

```
toastCallback: ((packageName: string, data: { message: string }) => void) | null
```

Set this property to receive toast messages shown by apps.

Example

TypeScriptCopy

```
agent.utils.toastCallback = (packageName, data) => {
  console.log("Toast from", packageName + ":", data.message);
};
```

## Callback Types

### NetworkCallback

TypeScriptCopy

```
type NetworkCallback = (networkAvailable: boolean) => void;
```

### ToastCallback

TypeScriptCopy

```
type ToastCallback = (
  packageName: string,
  data: { message: string }
) => void;
```