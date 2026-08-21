# NexCredit Underwriting Workbench Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a premium responsive underwriting-workbench UI without changing existing API behaviour.

**Architecture:** Keep `App.js` as the dashboard composition root. Retain existing API consumers and feature components; reorganise them inside a compact command bar, operational hero, three-column workbench grid, and paired operational panels. CSS supplies the token system and responsive layout.

**Tech Stack:** React, Ant Design, existing NexCredit components, CSS.

## Global Constraints

- Preserve all API endpoints and existing application submission behaviour.
- Do not add dependencies.
- Keep prototype visualisations honestly labelled.
- Test before visual production changes; commit only relevant files.

---

### Task 1: Workbench composition

**Files:**
- Modify: `src/frontend/src/App.test.js`
- Modify: `src/frontend/src/App.js`

- [ ] Write a failing test asserting `Decision trace` and `Underwriting pulse` are visible.
- [ ] Run `CI=true npm test -- --watchAll=false`; expect the new assertions to fail.
- [ ] Recompose `App.js` into command bar, portfolio, decision trace, pulse, review queue, and audit panels while retaining `getCreditApplications`, `getAuditLogs`, and `CreditApplicationForm`.
- [ ] Run the test again; expect PASS.

### Task 2: Premium visual system

**Files:**
- Modify: `src/frontend/src/App.css`

- [ ] Apply the design tokens, card spacing, compact navigation, desktop grid, hover/focus styles, and mobile stacking from the design spec.
- [ ] Run `npm run build`; expect a successful production build.

### Task 3: Verify and commit

**Files:**
- Modify: `src/frontend/src/App.js`, `src/frontend/src/App.css`, `src/frontend/src/App.test.js`

- [ ] Run `CI=true npm test -- --watchAll=false`.
- [ ] Open `http://localhost:3001`; confirm the workbench loads and New application opens.
- [ ] Commit with `git add src/frontend/src/App.js src/frontend/src/App.css src/frontend/src/App.test.js` and `git commit -m "feat: redesign underwriting workbench"`.
