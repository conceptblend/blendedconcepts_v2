---
title: "Agents and LLMs: Usefule References"
description: ""
date: "2026-03-14"
pinned: false
---

## [Writing a good Claude/Agents.md file](https://www.humanlayer.dev/blog/writing-a-good-claude-md)

By [Kyle Mistele](https://x.com/0xblacklight) · November 25, 2025

Snippet c/o source. All credit goes to original author.

1. CLAUDE.md is for onboarding Claude into your codebase. It should define your project's **WHY**, **WHAT**, and **HOW**.
2. **Less (instructions) is more**. While you shouldn't omit necessary instructions, you should include as few instructions as reasonably possible in the file.
3. Keep the contents of your CLAUDE.md **concise and universally applicable**.
4. **Use Progressive Disclosure** - don't tell Claude all the information you could possibly want it to know. Rather, tell it how to find important information so that it can find and use it, but only when it needs to to avoid bloating your context window or instruction count.
5. **Claude is not a linter**. Use linters and code formatters, and use other features like Hooks and Slash Commands as necessary.
6. CLAUDE.md is the highest leverage point of the harness, so **avoid auto-generating** it. You should carefully craft its contents for best results.

## Boris Cherny's Workflow Orchestration file (maybe?!?)

With all the engagement-bait people share these days.... [This one on ~~Twitter~~ X claims to describe the workflow orchestration used by Claude Code's creator, Boris Cherny](https://x.com/NainsiDwiv50980/status/2032835888070500801). Not verified, just recorded for consideration.

```md
## Workflow Orchestration

### 1. Plan Node Default

- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately — don't keep pushing
- Use plan mode for verification steps, not just building
- Write detailed specs upfront to reduce ambiguity

### 2. Subagent Strategy

- Use subagents liberally to keep main context window clean
- Offload research, exploration, and parallel analysis to subagents
- For complex problems, throw more compute at it via subagents
- One task per subagent for focused execution

### 3. Self-Improvement Loop

- After ANY correction from the user: update `tasks/lessons.md` with the pattern
- Write rules for yourself that prevent the same mistake
- Ruthlessly iterate on these lessons until mistake rate drops
- Review lessons at session start for relevant project

### 4. Verification Before Done

- Never mark a task complete without proving it works
- Diff behavior between main and your changes when relevant
- Ask yourself: "Would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness

### 5. Demand Elegance (Balanced)

- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
- Skip this for simple, obvious fixes — don't over-engineer
- Challenge your own work before presenting it

### 6. Autonomous Bug Fixing

- When given a bug report: just fix it. Don't ask for hand-holding
- Point at logs, errors, failing tests — then resolve them
- Zero context switching required from the user
- Go fix failing CI tests without being told how

---

## Task Management

1. **Plan First**: Write plan to `tasks/todo.md` with checkable items
2. **Verify Plan**: Check in before starting implementation
3. **Track Progress**: Mark items complete as you go
4. **Explain Changes**: High-level summary at each step
5. **Document Results**: Add review section to `tasks/todo.md`
6. **Capture Lessons**: Update `tasks/lessons.md` after corrections

---

## Core Principles

- **Simplicity First**: Make every change as simple as possible. Impact minimal code.
- **No Laziness**: Find root causes. No temporary fixes. Senior developer standards.
- **Minimal Impact**: Changes should only touch what's necessary. Avoid introducing bugs.
```
