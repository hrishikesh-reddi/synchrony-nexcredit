# Enterprise Underwriting Workspace Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build five functional finance-operations pages from the existing verified React components and state.

**Architecture:** Add a focused `WorkspacePages` switch that receives the existing state and handlers from `App`. Change primary navigation from scroll targets to page selection. Retain the application drawer and all backend calls in `App`.

**Tech Stack:** React 18, Ant Design 5, existing CSS, Jest, React Testing Library.

## Global Constraints

- No backend, dependency, schema, or Docker changes.
- No fake action or hidden roadmap execution.
- Only implemented workflows receive buttons.
- Preserve application analysis, evidence search, review, and audit behaviour.

---

### Task 1: Multi-page workspace

**Files:**
- Create: `src/frontend/src/WorkspacePages.js`
- Modify: `src/frontend/src/OperationsBriefing.js`
- Modify: `src/frontend/src/App.js`
- Modify: `src/frontend/src/App.css`
- Test: `src/frontend/src/App.test.js`

**Interfaces:**
- Consumes: `activePage`, `applications`, `auditLogs`, `apiStatus`, `authUser`, `loading`, and handlers for navigation, refresh, review, and opening the application drawer.
- Produces: one of `CommandCenterPage`, `UnderwritingStudioPage`, `EvidenceIntelligencePage`, `GovernancePage`, or `ArchitecturePage`.

- [ ] **Step 1: Add failing navigation assertions**

Assert Command Center appears after opening the workbench, click each named navigation button, assert its unique heading, and assert `NOT LIVE` is absent.

- [ ] **Step 2: Verify red**

Run `CI=true npm test -- --runInBand`; expect failure because the new navigation labels and pages do not exist.

- [ ] **Step 3: Implement `WorkspacePages.js`**

Compose existing components into five distinct pages. Calculate decision mix and employment mix from `applications`. Use working handlers for portfolio refresh, review actions, audit refresh, and new application.

- [ ] **Step 4: Replace the navigation and single-scroll composition**

Update `App.js` so primary navigation selects a page and renders `WorkspacePages`. Preserve login and application drawers.

- [ ] **Step 5: Apply enterprise page styling**

Add page shells, headers, metric grids, distribution bars, recent-decision rows, evidence pipeline, architecture topology, and responsive page transitions. Remove the orchestration-preview styling and disclosure.

- [ ] **Step 6: Verify green**

Run `CI=true npm test -- --runInBand` and `npm run build`; expect all tests and build to pass.

- [ ] **Step 7: Update README and commit**

Document the five-page workspace, then commit the component, integration, styles, tests, and documentation.
