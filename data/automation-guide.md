# automation-guide

**Source:** https://xgodo.com/docs/automation/guide

**Scraped:** 2025-01-31T13:43:40.000Z

---

# Xgodo Automation Guide

Complete documentation for building Android automations with the Xgodo platform.

## Quick Overview

This guide covers everything from setting up your first project to building production-ready automations.

## Recommended Project Structure

### Simple Structure (Small Automations)

For smaller automations with few stages:

```
my-automation/
├── main.ts           # Entry point & main loop
├── stages.ts         # Stage enum
├── screenStates.ts   # ScreenState enum
├── detection.ts      # Screen detection logic
├── handlers.ts       # Stage handlers
└── utils.ts          # Shared utilities
```

### Modular Structure (Recommended for Scaling)

For larger automations, organize stages into separate files:

```
my-automation/
├── main.ts           # Entry point & main loop
├── Stage.ts          # Stage management system
├── stages/           # Stage implementations
│   ├── index.ts      # Export all stages
│   ├── InitStage.ts
│   ├── LoginStage.ts
│   ├── ProcessStage.ts
│   └── CompleteStage.ts
├── screens/          # Screen detection (optional)
│   ├── index.ts
│   ├── login.ts
│   └── home.ts
├── config.ts         # Constants & configuration
├── util.ts           # Shared utilities
└── global.d.ts       # Type definitions
```

### Stage Object Pattern

Each stage is an object with a consistent interface:

```typescript
// stages/LoginStage.ts
export const LoginStage = {
  name: "Login",
  maxSteps: 20,
  screens: {
    INITIAL: "INITIAL",
    ENTERING_EMAIL: "ENTERING_EMAIL",
    ENTERING_PASSWORD: "ENTERING_PASSWORD",
    LOGGED_IN: "LOGGED_IN",
  } as const,

  async execute(): Promise<boolean> {
    // Stage logic here
    // Return true on success, false on failure
  },
};
```

### Stage Management System

```typescript
// Stage.ts
import { InitStage, LoginStage, ProcessStage, CompleteStage } from "./stages/index";

export const stages = [
  InitStage,
  LoginStage,
  ProcessStage,
  CompleteStage,
] as const;

export const Stage = Object.fromEntries(
  stages.map((stage) => [stage.name, stage.name]),
) as { [K in (typeof stages)[number]["name"]]: K };

export let currentStage: keyof typeof Stage = Stage.Init;
export let steps = stages.find((s) => s.name === currentStage)!.maxSteps;

export async function setStage(newStage: keyof typeof Stage) {
  const stageObj = stages.find((s) => s.name === newStage)!;
  console.log(`Transitioning to: ${newStage} | Max steps: ${stageObj.maxSteps}`);
  currentStage = newStage;
  steps = stageObj.maxSteps;
}

export function getStageObject() {
  return stages.find((s) => s.name === currentStage)!;
}
```

### Main Entry Point Pattern

```typescript
// main.ts
import { stages, currentStage, steps, setStage, getStageObject, decrementSteps } from "./Stage";

async function main() {
  while (steps > 0) {
    const stage = getStageObject();
    const success = await stage.execute();
    
    if (!success) {
      // Handle failure
      await agent.utils.job.submitTask("failed", { stage: currentStage }, true);
      return;
    }
    
    decrementSteps();
  }
  
  // Out of steps
  await agent.utils.outOfSteps.submit("outOfSteps");
}

main();
```

## Key Concepts

### 1. Project Structure
- Entry point: `main.ts`
- Organize code with ES6 imports across multiple files
- Use stages, screen states, and handlers for clean architecture
- Split into `stages/` folder for larger projects

### 2. Core Patterns
- **Stages**: Organize automation into logical phases with step limits
- **Screen States**: Detect and respond to different UI states
- **Error Handling**: Handle crashes, dialogs, network issues gracefully
- **Task Management**: Submit results and coordinate between job tasks

### 3. The Agent Object
All automation functionality is accessed through the global `agent` object:
- `agent.actions` - Device interactions (tap, swipe, type, etc.)
- `agent.utils` - Utilities (files, job management, callbacks)
- `agent.constants` - Accessibility action constants

## Available Documentation

Use these MCP tools to access specific documentation:

- `xgodo_list_documents` - See all available docs
- `xgodo_list_agent_actions` - See all agent.actions methods
- `xgodo_list_agent_utils` - See all agent.utils methods
- `xgodo_read_document` - Read specific documentation
- `xgodo_search_documents` - Search across all docs

## Full Tutorial

For a complete working example, see `automation-guide-tutorial.md` - it includes:
- Complete MySocial auto-responder automation
- Stage-based organization
- Screen state detection
- Error handling patterns
- Data collection and submission