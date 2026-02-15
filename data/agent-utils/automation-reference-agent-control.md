# automation-reference-agent-control

**Source:** https://xgodo.com/docs/automation/reference/agent/control

**Scraped:** 2025-01-31T19:38:00.000Z

---

# AgentControl

Interface

Control automation execution

Access control methods through `agent.control`. Provides methods to control the automation execution flow.

AgentControl Interface

TypeScriptCopy

```
interface AgentControl {
  stopCurrentAutomation(): void;
}
```

## Methods

### `stopCurrentAutomation()`

TypeScriptCopy

```
stopCurrentAutomation(): void
```

Immediately stops the current automation execution. Use this to gracefully terminate an automation when a condition is met or an error occurs.

#### Examples

Stop on error

TypeScriptCopy

```
try {
  await performCriticalAction();
} catch (error) {
  console.log("Critical error, stopping automation");
  agent.control.stopCurrentAutomation();
}
```

Stop when goal is achieved

TypeScriptCopy

```
const screen = await agent.actions.screenContent();
const successMessage = screen.findTextOne("Order Confirmed");

if (successMessage) {
  console.log("Task completed successfully!");
  agent.control.stopCurrentAutomation();
}
```

Stop with cleanup

TypeScriptCopy

```
function cleanup() {
  // Save state, close resources, etc.
  console.log("Cleaning up...");
}

// On critical failure
cleanup();
agent.control.stopCurrentAutomation();
```

### Note

When `stopCurrentAutomation()` is called, any code after the call will not execute. The automation terminates immediately.