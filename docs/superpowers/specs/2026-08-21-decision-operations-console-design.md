# Decision Operations Console - deadline-safe UI design

## Objective

Make the existing workbench read as a regulated financial decision-operations product while preserving every verified demo path. The redesign must increase visible engineering depth without presenting roadmap concepts as implemented functionality.

## Approaches considered

### A. Regulated decision-operations console - selected

Replace the generic greeting with an operations briefing, expose real service and governance status, add direct navigation to existing workflows, and include a clearly labelled production-orchestration concept panel. This has high presentation impact with low regression risk.

### B. Feature-dense retail banking portal

Add accounts, cards, payments, settings, notifications, and multiple inactive controls. This would create visual density but would not serve the underwriting problem statement and could look deceptive.

### C. Complete workbench redesign

Replace the current layout, navigation, tables, and decision components. This offers the highest visual ceiling but is too risky immediately before recording.

## Selected experience

### Workbench briefing

Replace “Good morning, analyst” with “Credit decision operations”. The supporting text explains that the screen coordinates contextual underwriting, evidence review, human escalation, and decision lineage.

### Operating-state strip

Show four compact, professional status cells using existing state where possible:

- API service: live, checking, or offline from the real health request.
- Decision policy: deterministic policy active.
- Reviewer access: current authenticated role.
- Evidence mode: pgvector-ready with resilient text fallback.

These are status explanations, not new integrations.

### Existing workflow actions

Provide clear controls that navigate to the existing application portfolio, review queue, evidence search, and audit trail. Do not add dead controls.

### Production orchestration concept

Add a visually rich panel labelled “CONCEPT PREVIEW - PRODUCTION ROADMAP”. It illustrates the intended sequence:

1. Signal ingestion
2. Credit policy
3. Fraud assessment
4. Explanation assistance
5. Human approval and audit

The panel states that the current prototype uses deterministic policy and that Bedrock-assisted explanations, streaming connectors, policy versioning, and production vector retrieval are roadmap integrations. It contains no button that pretends to run these services.

## Visual direction

- Palette: ledger navy `#102A43`, institutional blue `#1F4E78`, governance teal `#0F7C83`, cloud white `#FFFFFF`, cool slate `#526477`, alert amber `#C58A20`.
- Typography: preserve the current product type system; use tabular, uppercase utility labels for operational metadata.
- Layout: structured operations header, compact status ledger, then the existing application and decision workspace.
- Signature element: a horizontal decision-lineage rail connecting evidence, policy, guardrail, human review, and audit.
- Avoid retail-banking widgets because this product is an underwriting operations console, not a consumer bank account.

## Data and behaviour

- No backend schema or API changes.
- Existing navigation, application form, underwriting, upload, review, explanation, and audit behaviours remain unchanged.
- API health and reviewer identity remain derived from current application state.
- Roadmap content is static and explicitly identified as a concept.

## Error handling

- An unavailable API remains visibly offline.
- Missing authentication displays “Reviewer sign-in required”.
- The concept panel never changes the live system status.

## Tests

- Add a frontend test asserting that “Credit decision operations” renders after opening the workbench.
- Assert that the orchestration panel contains the visible “CONCEPT PREVIEW” disclosure.
- Preserve existing health-status and landing-page tests.
- Run the full frontend test suite and production build.

## Scope exclusions

- No fake LLM call.
- No fake autonomous agent execution.
- No banking accounts, cards, payments, or unrelated settings.
- No backend refactor, Docker work, or new dependency.
