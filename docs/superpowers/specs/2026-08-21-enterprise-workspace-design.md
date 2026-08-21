# Enterprise Underwriting Workspace Design

## Objective

Convert the single scrolling workbench into a multi-page financial-operations product without changing the verified backend. Each primary navigation item must reveal a distinct working area, use existing application state, and support the PB-3 underwriting story.

## Product pages

1. **Command Center** - portfolio totals, decision mix, review workload, NTC access indicators, and recent decisions.
2. **Underwriting Studio** - application creation, portfolio table, decision trace, portfolio pulse, and traditional-versus-contextual comparison.
3. **Evidence Intelligence** - working evidence search, document-processing pipeline explanation, evidence coverage, and upload entry point through the application workflow.
4. **Review & Governance** - responsible-AI guardrail, working human-review actions, and working audit history.
5. **Platform Architecture** - actual React/Spring Boot/PostgreSQL/Tika/security topology, implemented capability boundaries, and production evolution as documentation.

## Interaction design

- Primary navigation changes the visible product page rather than scrolling one long document.
- Page headings and section codes establish place and purpose.
- Existing application, evidence, review, and audit actions remain functional.
- Architecture cards explain the system but do not pretend to execute integrations.
- No “NOT LIVE” badge, blinking status light, inactive button, retail-account widget, or unrelated banking setting.

## Visual direction

- Institutional navy, financial blue, restrained teal, white, cool slate, and amber for review attention.
- Dense but calm data presentation: ledger rules, compact metric cells, tables, and horizontal distribution bars.
- Minimal animation: page fade/translate on navigation and card hover elevation, disabled under reduced-motion preference.
- The product should resemble an internal underwriting platform, not a consumer bank or generic AI dashboard.

## Data boundaries

- Pages consume the existing `applications`, `auditLogs`, `apiStatus`, and `authUser` state.
- No new API, dependency, schema, or database migration.
- Future capabilities appear only as explanatory architecture copy.

## Tests

- Opening the workbench renders Command Center.
- Each navigation control renders its corresponding page heading.
- The prior “Good morning” and “NOT LIVE” copy is absent.
- Existing API-health disclosure remains truthful.
- Frontend tests and production build pass.
