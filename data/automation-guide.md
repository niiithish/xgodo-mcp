# automation-guide

**Source:** https://xgodo.com/docs/automation/guide

**Scraped:** 2025-01-31T13:43:40.000Z

---

# Xgodo Automation Guide

Complete documentation for building Android automations with the Xgodo platform.

## Quick Overview

This guide covers everything from setting up your first project to building production-ready automations.

## Key Concepts

### 1. Project Structure
- Entry point: `main.ts`
- Organize code with ES6 imports across multiple files
- Use stages, screen states, and handlers for clean architecture

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

- `list_documents` - See all available docs
- `list_agent_actions` - See all agent.actions methods
- `list_agent_utils` - See all agent.utils methods
- `read_document` - Read specific documentation
- `search_documents` - Search across all docs

## Full Tutorial

For a complete working example, see `automation-guide-tutorial.md` - it includes:
- Complete MySocial auto-responder automation
- Stage-based organization
- Screen state detection
- Error handling patterns
- Data collection and submission