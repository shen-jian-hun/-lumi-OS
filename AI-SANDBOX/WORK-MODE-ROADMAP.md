# LumiOS Work Mode Roadmap

## North Star

Build a lawful, open, user-controlled loop:

```text
Open Call (Android)
  -> normal user login / authorized AI capability
  -> GitHub knowledge + task state
  -> Workbench Bridge
  -> OpenClaw / other open-source work engine
  -> local execution
  -> result back to GitHub
  -> AI continues from the latest anchor
```

The system must not bypass subscription limits, access controls, or service protections. Free services are used as free services; paid capabilities are used only when the user is normally entitled to them.

## Build order

1. Open Call Android foundation
   - Compose-first native UI
   - Gateway configuration
   - secure local credential storage
   - connection state and error handling
   - WebSocket transport abstraction
   - task/result conversation flow

2. Workbench Bridge
   - localhost-only boundary
   - authenticated API
   - allowlisted operations
   - GitHub sync
   - task claiming
   - result writeback
   - offline/pending-write queue

3. OpenClaw adapter
   - upstream OpenClaw remains an external open-source dependency
   - LumiOS owns only the adapter/contract
   - fixed operation mapping
   - no arbitrary shell from GitHub task payloads

4. GitHub continuity loop
   - TASKS -> local execution -> RESULTS -> Session State -> LATEST
   - preserve history
   - explicit confirmed/inference/hypothesis/pending evidence

5. Hourly Work Mode self-check
   - inspect project state
   - inspect recent changes
   - detect blockers
   - ask: "现在距离真正的 Work 模式还缺什么？"
   - select one highest-value next iteration
   - write the result back to GitHub

## Source policy

GitHub is the primary project knowledge source. Public Android documentation, Android open-source repositories, and open-source GitHub projects may be researched for implementation patterns. Do not use the user's phone or computer as a project knowledge source unless the task explicitly requires runtime/device state.

## Current state

- GitHub AI-SANDBOX: established
- Conversation distillation: established
- Workbench Bridge: scaffolded
- OpenClaw role: defined as candidate work engine
- Open Call Android: scaffolded
- Hourly self-check task contract: defined
- Actual local Workbench Bridge execution: still requires the user's local environment to start it
- Actual OpenClaw Gateway connection: not yet verified locally

## Definition of done for Open Call v0.1

- Android project builds successfully
- clean Material 3 Compose UI
- gateway URL can be configured and persisted locally
- connection lifecycle is observable
- WebSocket transport is isolated behind an interface
- user can submit a work request
- response/result can be displayed
- no secrets committed to GitHub
- tests cover connection state and message handling
- README contains setup and lawful capability boundaries

## Definition of done for Work Mode v0.1

- GitHub task can be claimed locally
- Workbench Bridge can execute only approved operations
- OpenClaw adapter can report gateway status and submit a fixed-format task
- result is written back to GitHub
- next Session State and LATEST are updated
- failure leaves an explicit recoverable pending state
