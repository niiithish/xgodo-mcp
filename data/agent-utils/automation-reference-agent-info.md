# automation-reference-agent-info

**Source:** https://xgodo.com/docs/automation/reference/agent/info

**Scraped:** 2025-01-31T19:38:00.000Z

---

# AgentInfo

Interface

Get automation and device metadata

Access these methods through`agent.info`. Provides information about the current automation and the device it's running on.

AgentInfo Interface

TypeScriptCopy

```
interface AgentInfo {
  getAutomationInfo(): AutomationInfo;
  getDeviceInfo(): DeviceInfo;
}
```

## Methods

### `getAutomationInfo()`

TypeScriptCopy

```
getAutomationInfo(): AutomationInfo
```

Returns metadata about the currently running automation.

#### Returns

`AutomationInfo`Automation metadata

#### Examples

TypeScriptCopy

```
const info = agent.info.getAutomationInfo();
console.log("Running:", info.name);
console.log("Launch ID:", info.launchId);
console.log("Server:", info.serverBaseUrl);
```

### `getDeviceInfo()`

TypeScriptCopy

```
getDeviceInfo(): DeviceInfo
```

Returns information about the device hardware and configuration.

#### Returns

`DeviceInfo`Device specifications

#### Examples

TypeScriptCopy

```
const device = agent.info.getDeviceInfo();
console.log("Device:", device.brand, device.model);
console.log("Screen:", device.width, "x", device.height);
console.log("Android SDK:", device.sdkVersion);
console.log("Is Emulator:", device.isEmulator);
```

## Types

### AutomationInfo

Contains metadata about the running automation.

TypeScriptCopy

```
interface AutomationInfo {
  name: string;        // Automation name
  description: string; // Automation description
  launchId: string;    // Unique ID for this launch
  agent?: {            // Optional agent details
    id: string;
    commitId: string;
    token: string;
    jobTaskId: string;
  };
  serverBaseUrl: string; // Server URL for API calls
  timeout?: number;    // Optional timeout in minutes available since app v2.123 (135)
}
```

### AutomationInfo Properties

| Property | Type | Description |
| --- | --- | --- |
| `name` | `string` | The name of the automation |
| `description` | `string` | Description of what the automation does |
| `launchId` | `string` | Unique identifier for this execution |
| `agent?` | `object` | Agent details when running in agent mode (id, commitId, token, jobTaskId) |
| `serverBaseUrl` | `string` | Base URL of the server for API calls |
| `timeout?` | `number` | Optional timeout for the automation in minutes (since v2.123 (135)) |

### DeviceInfo

Contains hardware and configuration information about the device.

TypeScriptCopy

```
interface DeviceInfo {
  id: string;           // Unique device ID
  brand: string;        // Device brand (e.g., "Samsung")
  model: string;        // Device model (e.g., "SM-G991B")
  sdkVersion: number;   // Android SDK version (e.g., 33)
  processor: string;    // CPU info
  numberOfCores: number; // CPU core count
  ramMb: number;        // RAM in megabytes
  country: string;      // Device country
  isEmulator: boolean;  // true if running on emulator
  width: number;        // Screen width in pixels
  height: number;       // Screen height in pixels
}
```

### DeviceInfo Properties

| Property | Type | Description |
| --- | --- | --- |
| `id` | `string` | Unique identifier for the device |
| `brand` | `string` | Device manufacturer (e.g., 'Samsung', 'Google') |
| `model` | `string` | Device model name |
| `sdkVersion` | `number` | Android SDK API level (e.g., 33 for Android 13) |
| `processor` | `string` | CPU/processor information |
| `numberOfCores` | `number` | Number of CPU cores |
| `ramMb` | `number` | Total RAM in megabytes |
| `country` | `string` | Device country/region setting |
| `isEmulator` | `boolean` | Whether the device is an emulator |
| `width` | `number` | Screen width in pixels |
| `height` | `number` | Screen height in pixels |

## Usage Example

TypeScriptCopy

```
// Adapt automation to device capabilities
const device = agent.info.getDeviceInfo();

// Calculate center of screen
const centerX = device.width / 2;
const centerY = device.height / 2;

// Check Android version for feature availability
if (device.sdkVersion >= 33) {
  // Use Android 13+ features
}

// Log automation context
const automation = agent.info.getAutomationInfo();
console.log(`Running "${automation.name}" on ${device.brand} ${device.model}`);
```