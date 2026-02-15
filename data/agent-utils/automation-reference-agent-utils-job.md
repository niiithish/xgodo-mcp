# automation-reference-agent-utils-job

**Source:** https://xgodo.com/docs/automation/reference/agent/utils/job

**Scraped:** 2025-01-31T19:32:00.000Z

---

# Job Task Management

Utils

Manage job tasks, submit results, and request new tasks

Access job management through`agent.utils.job`. Used for managing job tasks, submitting results, and requesting new tasks.

JobUtils Interface

TypeScriptCopy

```
interface JobUtils {
  submitTask(
    automationStatus: "running" | "success" | "failed" | "declined",
    data: Record<string, any>,
    finish: boolean,
    files: { name: string; extension: string; base64Data: string }[]
  ): Promise<{ success: false; error: string } | { success: true }>;

  useAnotherTask(): Promise<{ job_task_id: string; job_proof: string } | null>;

  getCurrentTask(): Promise<
    { success: false; error: string } |
    { success: true; parent_task_id: string; job_proof: any, timeout: number }
  >;
}

// On agent.utils (for task coordination)
interface AgentUtils {
  setAutomationVariables(variables: object): Promise<
    { success: false; error: string } |
    { success: true; automation_variables: any }
  >;

  getAutomationVariables(): Promise<
    { success: false; error: string } |
    { success: true; automation_variables: any }
  >;
}
```

### `submitTask()`

TypeScriptCopy

```
submitTask(automationStatus: "running" | "success" | "failed" | "declined", data: Record<string, any>, finish: boolean, files: { name: string; extension: string; base64Data: string }[]): Promise<{ success: false; error: string } | { success: true }>
```

Submits the current task result to the server. Use this to report progress, success, or failure of job tasks. Note: Once you call submitTask with finish=true, you cannot submit again for the same task. The files parameter is ignored when finish=false.

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `automationStatus` | `"running" | "success" | "failed" | "declined"` | Current status of the task |
| `data` | `Record<string, any>` | Task result data as key-value pairs |
| `finish` | `boolean` | Whether this is the final submission for this task. Once true, no more submissions are allowed for this task. |
| `files` | `{ name, extension, base64Data }[]` | Array of files to upload with the task. Ignored when finish=false. |

#### Returns

`{ success: true } | { success: false; error: string }`Success status or error message

#### Examples

Submit successful task with data

TypeScriptCopy

```
const result = await agent.utils.job.submitTask(
  "success",
  {
    orderId: "12345",
    totalAmount: 99.99,
    itemsProcessed: 3
  },
  true, // Final submission
  []    // No files
);

if (result.success) {
  console.log("Task submitted successfully");
}
```

Submit task with files

TypeScriptCopy

```
const screenshot = await agent.actions.screenshot(1080, 1920, 80);

const result = await agent.utils.job.submitTask(
  "success",
  { status: "completed" },
  true, // Final submission
  [{\
    name: "confirmation",\
    extension: "jpg",\
    base64Data: screenshot.screenshot || ""\
  }]
);
```

Report progress (not finished)

TypeScriptCopy

```
// Note: files parameter is ignored when finish=false
await agent.utils.job.submitTask(
  "running",
  { currentStep: 3, totalSteps: 10 },
  false, // More submissions coming
  []     // Files ignored for progress updates
);
```

Decline a task

TypeScriptCopy

```
await agent.utils.job.submitTask(
  "declined",
  { reason: "Item out of stock" },
  true, // Final submission
  []
);
```

### `useAnotherTask()`

TypeScriptCopy

```
useAnotherTask(): Promise<{ job_task_id: string; job_proof: string } | null>
```

Accesses another task's data from the same job. This allows one job task to retrieve and use data from another task within the same job. The target task must have set its automation variables with waiting: true using setAutomationVariables to be discoverable. Returns the task details or null if no waiting task is available.

#### Returns

`{ job_task_id: string; job_proof: string } | null`Task details from another waiting task, or null if no task is available

#### Examples

Access data from another task in the same job

TypeScriptCopy

```
// First, the other task must mark itself as waiting:
// await agent.utils.setAutomationVariables({ waiting: true });

// Then this task can access it:
const otherTask = await agent.utils.job.useAnotherTask();

if (otherTask) {
  console.log("Found waiting task:", otherTask.job_task_id);
  const proof = JSON.parse(otherTask.job_proof);

  // Use data from the other task
  const sharedData = proof.someSharedField;

  // Process with the shared data...
} else {
  console.log("No waiting task available");
}
```

Coordinate between multiple tasks

TypeScriptCopy

```
// Task A: Set up data and wait
await agent.utils.job.submitTask(
  "running",
  { preparedData: "value", step: "waiting" },
  false,
  []
);
await agent.utils.setAutomationVariables({ waiting: true });

// Task B: Access Task A's data
const taskA = await agent.utils.job.useAnotherTask();
if (taskA) {
  const taskAData = JSON.parse(taskA.job_proof);
  console.log("Got data from Task A:", taskAData.preparedData);
}
```

### `getCurrentTask()`

TypeScriptCopy

```
getCurrentTask(): Promise<{ success: false; error: string } | { success: true; parent_task_id: string; job_proof: any, timeout: number }>
```

Gets information about the currently assigned task, including the parent task ID and job proof data.

#### Returns

`{ success: true; parent_task_id: string; job_proof: any, timeout: number } | { success: false; error: string }`Current task details or error

#### Examples

TypeScriptCopy

```
const task = await agent.utils.job.getCurrentTask();

if (task.success) {
  console.log("Current task ID:", task.parent_task_id);
  console.log("Job proof:", task.job_proof);

  // Access job proof data
  const targetUrl = task.job_proof.url;
  const credentials = task.job_proof.credentials;
} else {
  console.log("Error getting task:", task.error);
}
```

### Automation Variables

These methods are accessed via`agent.utils`(not agent.utils.job) but are used for coordinating between job tasks.

### `setAutomationVariables()`

TypeScriptCopy

```
setAutomationVariables(variables: object): Promise<{ success: false; error: string } | { success: true; automation_variables: any }>
```

Sets automation variables for the current job task. These variables can be used to coordinate between tasks in the same job. Set { waiting: true } to make the current task's data available to other tasks via useAnotherTask().

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `variables` | `object` | An object containing the variables to set. Use { waiting: true } to mark this task as available for other tasks to access. |

#### Returns

`{ success: true; automation_variables: any } | { success: false; error: string }`Success status with the stored variables, or error message

#### Examples

Mark task as waiting for another task

TypeScriptCopy

```
// Make this task's data available for another task to use
await agent.utils.setAutomationVariables({ waiting: true });

// Now another task in the same job can call useAnotherTask()
// to access this task's job_proof data
```

Store custom variables for task coordination

TypeScriptCopy

```
// Store state that can be retrieved later
const result = await agent.utils.setAutomationVariables({
  waiting: true,
  stage: "data_prepared",
  timestamp: Date.now()
});

if (result.success) {
  console.log("Variables set:", result.automation_variables);
} else {
  console.error("Failed to set variables:", result.error);
}
```

### `getAutomationVariables()`

TypeScriptCopy

```
getAutomationVariables(): Promise<{ success: false; error: string } | { success: true; automation_variables: any }>
```

Retrieves the automation variables previously set for the current job task. Use this to check the current state of task coordination variables.

#### Returns

`{ success: true; automation_variables: any } | { success: false; error: string }`Success status with the stored variables, or error message

#### Examples

Check current automation variables

TypeScriptCopy

```
const result = await agent.utils.getAutomationVariables();

if (result.success) {
  console.log("Current variables:", result.automation_variables);

  if (result.automation_variables?.waiting) {
    console.log("This task is marked as waiting");
  }
} else {
  console.error("Failed to get variables:", result.error);
}
```

Retrieve stored coordination state

TypeScriptCopy

```
const result = await agent.utils.getAutomationVariables();

if (result.success && result.automation_variables) {
  const { stage, timestamp } = result.automation_variables;
  console.log(`Task is at stage: ${stage}, set at: ${timestamp}`);
}
```