# automation-reference-agent-utils

**Source:** https://xgodo.com/docs/automation/reference/agent/utils

**Scraped:** 2025-01-31T19:32:00.000Z

---

# AgentUtils

Interface

Utility functions, job management, and file operations

Access these utilities through`agent.utils`. Includes random gesture helpers, event callbacks, job task management, server connectivity, and comprehensive file operations.

AgentUtils Interface Overview

TypeScriptCopy

```
interface AgentUtils {
  // Gesture helpers
  randomClick(x1: number, y1: number, x2: number, y2: number): void;
  randomSwipe(x1: number, y1: number, x2: number, y2: number, direction: Direction): void;

  // Server connectivity
  isServerReachable(): Promise<{ reachable: true } | { reachable: false; error: string }>;

  // Event callbacks (for notifications, see agent.notifications)
  setNetworkCallback(callback: NetworkCallback | null): void;
  toastCallback: ToastCallback | null;

  // Step tracking & debugging
  outOfSteps: {
    storeScreen(screen: AndroidNode, stage: string, screenState: string, remainingSteps: number, screenshotRecord: ScreenshotRecord): Promise<void>;
    submit(type: "outOfSteps" | "timeout" | "debug"): Promise<SubmitResult>;
  };

  // Job task management
  job: {
    submitTask(status: AutomationStatus, data: Record<string, any>, finish: boolean, files: File[]): Promise<TaskResult>;
    useAnotherTask(): Promise<TaskInfo | null>;
    getCurrentTask(): Promise<CurrentTaskResult>;
  };

  // File operations
  files: AgentFiles;
}
```

## Utility Categories

[**Helper Utilities**\\
\\
randomClick, randomSwipe, isServerReachable](https://xgodo.com/docs/automation/reference/agent/utils/helpers) [**Event Callbacks**\\
\\
setNetworkCallback, toastCallback](https://xgodo.com/docs/automation/reference/agent/utils/callbacks) [**Job Task Management**\\
\\
submitTask, useAnotherTask, getCurrentTask](https://xgodo.com/docs/automation/reference/agent/utils/job) [**Step Tracking & Debugging**\\
\\
storeScreen, submit - debug automation failures](https://xgodo.com/docs/automation/reference/agent/utils/out-of-steps) [**File Operations**\\
\\
exists, readFullFile, list, getHashes, and more](https://xgodo.com/docs/automation/reference/agent/utils/files)

**Note:** For notification callbacks, see [agent.notifications](https://xgodo.com/docs/automation/reference/agent/notifications).

## Quick Examples

Human-like Interactions

TypeScriptCopy

```
// Random tap within a button area (more human-like)
const button = screen.findTextOne("Submit");
if (button) {
  button.randomClick();
}
```

Job Task Processing

TypeScriptCopy

```
// Get current task and submit results
const task = await agent.utils.job.getCurrentTask();
if (task.success) {
  const proof = task.job_proof;

  // ... perform automation ...

  await agent.utils.job.submitTask(
    "success",
    { orderId: "12345", completed: true },
    true, // Final submission
    []
  );
}
```

File Operations

TypeScriptCopy

```
// Read and process files
const files = agent.utils.files.list("/sdcard/Download");
for (const file of files) {
  if (file.name.endsWith(".json")) {
    const content = agent.utils.files.readFullFile(file.path);
    const data = JSON.parse(content);
    console.log(data);
  }
}
```