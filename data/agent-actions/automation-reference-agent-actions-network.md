# automation-reference-agent-actions-network

**Source:** https://xgodo.com/docs/automation/reference/agent/actions/network

**Scraped:** 2025-01-31T19:19:00.000Z

---

# Network Actions

Actions

Network and connectivity operations

Access these methods through `agent.actions`. Manage network connectivity and IP address changes.

### `airplane()`

TypeScriptCopy

```
airplane(): Promise<void>
```

Toggles airplane mode on and off to refresh the mobile network connection. This method turns airplane mode ON, waits briefly, then turns it OFF. Primarily used for changing IP address when connected to a mobile/cellular network.

#### Returns

`Promise<void>`Resolves after airplane mode cycle completes

#### Examples

Change IP address on mobile network

TypeScriptCopy

```
// Refresh mobile network to get a new IP
await agent.actions.airplane();
console.log("Mobile network refreshed with new IP");
```

Retry with new IP on failure

TypeScriptCopy

```
async function fetchWithIPRefresh(url: string) {
  try {
    // First attempt
    return await fetch(url);
  } catch (error) {
    // Refresh IP and retry
    await agent.actions.airplane();
    await agent.control.wait(2000); // Wait for network to stabilize
    return await fetch(url);
  }
}
```

### Important Notes

- Only works when the device is connected to a mobile/cellular network
- Wi-Fi connections are not affected by this method
- The new IP address is assigned by your mobile carrier
- There may be a brief period of no connectivity during the toggle

Use Case: Rate Limit Bypass

TypeScriptCopy

```
// When rate limited, get new IP and continue
async function handleRateLimit() {
  console.log("Rate limited, refreshing IP...");
  await agent.actions.airplane();

  // Wait for network to fully reconnect
  const status = await agent.utils.isServerReachable();
  if (!status.reachable) {
    await agent.control.wait(3000);
  }

  console.log("IP refreshed, continuing automation");
}
```