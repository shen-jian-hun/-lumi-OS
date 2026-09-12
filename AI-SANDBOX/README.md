# AI Sandbox

## Purpose

This directory is the external control-plane workspace for AI-assisted development and continuity.

GitHub provides persistent storage, version control, search, and state anchoring. A separate runtime executes code and tools.

## Operating Loop

1. Search GitHub for the current anchor and relevant knowledge.
2. Load the required project and state into a runtime sandbox.
3. Execute code, tests, data processing, or tools in the sandbox.
4. Preserve important results and state back into GitHub.
5. Resume future sessions from the persisted state.

## Structure

- `CORE/` - anchors and session state
- `KNOWLEDGE/` - durable knowledge
- `PROJECTS/` - active projects
- `INPUT/` - incoming working material
- `OUTPUT/` - generated results
- `TOOLS/` - reusable tooling
- `runtime/` - runtime and sandbox configuration

## Principle

External services such as Granola are optional data sources, not the primary continuity layer.

The objective is a portable, versioned, traceable, recoverable AI workspace controlled through the user's GitHub knowledge base.
