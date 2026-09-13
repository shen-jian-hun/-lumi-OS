# OpenClaw Work Mode Adapter

Purpose: make OpenClaw the candidate execution/agent layer for LumiOS Work Mode, while GitHub remains the persistent state and task layer and Workbench Bridge remains the local control boundary.

## Architecture

```text
Chat / Voice
    ↓
LumiOS Work Mode
    ↓
GitHub AI-SANDBOX
    ├── sessions/
    ├── TASKS/
    └── state/
    ↓
Workbench Bridge
    ↓
OpenClaw Gateway / Agent
    ↓
Local tools / workspace
    ↓
Results
    ↓
GitHub
```

## Role separation

- GitHub: persistent state, tasks, history, recovery anchors.
- Workbench Bridge: localhost security boundary and execution adapter.
- OpenClaw: candidate local agent/work layer.
- Model provider: replaceable intelligence provider. Do not hard-code a provider into this adapter.

OpenClaw is an independent open-source project. This adapter does not copy or vendor its source code. The local installation should use the upstream project and its license.

## Initial integration contract

The bridge should eventually expose these logical operations:

- `work.status`
- `work.start`
- `work.run_task`
- `work.stop`
- `work.result`

The first implementation must remain allowlisted. Never accept an arbitrary shell command from GitHub or chat.

## Upstream

OpenClaw source: https://github.com/openclaw/openclaw

Upstream installation currently uses Node.js and provides an `openclaw` CLI/Gateway. Verify the current upstream installation instructions before installing or pinning a version.

## Current status

- OpenClaw selected as the Work Mode candidate.
- GitHub state layer exists.
- Workbench Bridge exists.
- Adapter contract is now recorded.
- Actual local OpenClaw installation and bridge wiring are not yet claimed as complete.
