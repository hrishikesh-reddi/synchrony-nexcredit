# NexCredit Engineering Roadmap

## Product thesis

NexCredit is not an autonomous loan-approval chatbot. It is a governed underwriting workbench for **New-to-Credit and thin-file applicants**: it combines permitted alternative signals with a transparent decision policy, identifies uncertainty or risk, and gives a trained reviewer the evidence needed to make the final call.

This is a practical response to Hackathon Problem Statement 3: move from static historical scoring to real-time, contextual credit decisioning while mitigating fraud and remaining transparent.

Synchrony describes its PRISM platform as using data and analytics to form a more comprehensive view of creditworthiness beyond a traditional score, while helping protect customers from overextension and fraud. NexCredit should therefore be positioned as a prototype of the **underwriter decision workspace around such a platform**, rather than a claim that it replaces Synchrony's decision systems.

## The business problem worth solving

The valuable question is not “can an AI approve a loan?” It is:

> How can an underwriter safely give a promising thin-file applicant a second look without weakening fraud controls, fairness, or auditability?

The existing prototype already demonstrates the workflow foundation:

1. Capture a credit application and alternative indicators.
2. Produce an explainable policy outcome with confidence and fraud risk.
3. Route uncertain, high-risk, or policy-sensitive applications to human review.
4. Keep the reviewer outcome and evidence in an audit trail.

This is the right starting point because NIST's AI RMF identifies explainability, accountability, privacy, fairness, and human intervention as core trustworthiness concerns. A generative model must assist an accountable workflow; it should not silently make a credit decision.

## Current capability truth table

| Capability | Status | Proof in repository |
| --- | --- | --- |
| React underwriting workbench | Implemented | `src/frontend` |
| Spring Boot decision API | Implemented | credit controller and services |
| PostgreSQL application and audit records | Implemented | JPA entities and repositories |
| Deterministic decision policy | Implemented | `CreditUnderwritingService` |
| Bias guardrail and human-review route | Implemented | review status, review APIs, audit history |
| Uploaded-file storage and bounded text evidence | Implemented | Apache Tika extraction, persisted status/preview, reviewer-only evidence API |
| Trained ML model | Not implemented | roadmap item |
| LLM / Bedrock | Not implemented | roadmap item; UI simulations are labelled |
| Semantic document retrieval / pgvector | Not implemented | roadmap item |
| IAM, authentication, deployed monitoring | Not implemented | roadmap item |

Never present roadmap functionality as live functionality.

## Differentiated target architecture

```text
Applicant / Underwriter
        │
        ▼
React decision workbench
        │  HTTPS and authenticated API (production)
        ▼
Spring Boot orchestration API
 ├── Policy decision service         to  deterministic eligibility rules
 ├── Model-scoring adapter           to  calibrated ML probability
 ├── Fraud and data-quality checks   to  anomalies / missing consent / conflicts
 ├── Explanation service             to  signal contributions; optional LLM wording
 ├── Review routing service           to  thresholds, reasons, reviewer SLA
 └── Evidence/audit service           to  immutable event history
        │
        ├── PostgreSQL: applications, decisions, review cases, audit events
        ├── Object storage: consented documents
        ├── pgvector: approved document/evidence retrieval (future)
        └── Monitoring: latency, policy outcomes, model drift, reviewer overrides
```

The design deliberately separates **policy**, **prediction**, **explanation**, and **final action**. That separation is the engineering difference between a demo UI and a risk system someone can review.

## Highest-value implementation sequence

### P0   Make the decision measurable

Implement a `DecisionEvidence` object for every analysis. It must record:

- policy version and rule identifiers applied;
- input-signal snapshot and consent status;
- score contributions and confidence components;
- fraud/data-quality flags;
- route reason: auto-approved, auto-rejected, or manual review;
- timestamp, correlation ID, reviewer decision, and reviewer rationale.

**Why it matters:** it upgrades the audit log from a display feature into decision provenance.

**Demo acceptance test:** open any application, see exactly which signals and policy version created the result, then complete a reviewer action and see the linked event.

### P1   Add real ML, but keep it advisory

Train a compact, reproducible baseline model using a public credit-risk dataset. Serve it through a separate Python/FastAPI service or a serialized model adapter. The model returns `riskProbability`, `modelVersion`, and feature contributions; the Spring Boot policy remains the final routing control.

Required engineering assets:

- `data/README.md`: source, licence, allowed use, features excluded, preprocessing;
- `notebooks/` or `training/`: deterministic training script and fixed seed;
- `model-card.md`: intended use, out-of-scope use, metrics, limitations, fairness checks;
- holdout evaluation: AUC/ROC, precision-recall, calibration, and subgroup comparison;
- model registry metadata: version, checksum, training date, approval status.

**Do not:** train on scraped personal data, use protected attributes for eligibility, or claim production accuracy from a public demo dataset.

**Demo acceptance test:** show the policy result beside the advisory risk probability and explain why a disagreement is routed to a reviewer.

### P2   Build an evidence-aware fraud and data-quality gate

Create a `RiskFlag` entity and service. Start with transparent signals, not fabricated “AI detection”:

- suspicious score combination or missing required input;
- document/application mismatch after real extraction is available;
- duplicate mobile/email/device identifier only when consented sample data exists;
- repeated rapid submissions in the prototype;
- rule conflict or low-quality input.

Each flag needs a severity, evidence, rule ID, created time, and resolution. High-severity flags must force manual review.

**Demo acceptance test:** submit a deliberately inconsistent application; show the flag, the review route, and the audit event.

### P3   Extend document evidence beyond extraction

NexCredit now extracts a bounded local text preview from uploaded documents using Apache Tika and persists an extraction status. Next, extract named fields with confidence, show them to the reviewer, and require reviewer confirmation before any extracted value affects an application. Store only consented documents and a content hash.

Later, add embeddings and pgvector only for approved evidence retrieval. The system should retrieve evidence snippets for a reviewer; it must not allow a vector search or LLM to make eligibility decisions.

**Demo acceptance test:** upload a sample bank statement, display extracted income evidence, accept or reject the evidence, and show that action in the audit trail.

### P4   Add LLM assistance with bounded responsibility

Use Bedrock only for a constrained `ExplanationAssistant`:

- Input: structured, policy-approved facts and permitted evidence excerpts.
- Output: plain-language explanation, missing-evidence checklist, and reviewer-summary draft.
- Guardrails: JSON schema validation, PII minimisation, prompt-injection-resistant document handling, no autonomous decision field, fallback template if unavailable.
- Logging: prompt template version, model ID, latency, redacted request/response metadata, reviewer acceptance/edit/rejection.

This makes GenAI useful without letting it become an ungoverned decision maker. NIST's GenAI profile specifically emphasises added oversight, tracking, documentation, data protection, and risk-based controls.

**Demo acceptance test:** a reviewer requests a plain-language explanation; the UI shows that the policy/model result already existed and that the reviewer controls the final action.

### P5   Production-ready controls

1. Add authentication and role-based access: applicant, underwriter, supervisor, auditor.
2. Replace local upload storage with encrypted object storage and signed URLs.
3. Add request IDs, structured logs, error handling, rate limits, and monitoring dashboards.
4. Add CI: backend tests, frontend tests, dependency scanning, secret scanning, Docker image build.
5. Add model/policy monitoring: approval rate, manual-review rate, override rate, decision latency, calibration drift, and subgroup fairness indicators.

## What makes NexCredit stand out

| Common hackathon version | NexCredit target |
| --- | --- |
| One form returns approved/rejected | A decision is evidence-backed, versioned, and reviewable |
| “AI” is a black-box score or animation | ML is advisory; policy and human controls remain explicit |
| Audit log is a history list | Decision provenance links inputs, policy, flags, reviewer, and result |
| File upload is cosmetic | Extracted evidence is confirmed before it can influence a decision |
| LLM makes a lending outcome | LLM only helps communicate approved facts and identify missing evidence |
| Dashboard shows metrics | Monitoring measures safety, quality, fairness, and reviewer overrides |

## Pitch language

> NexCredit is a governed underwriting workbench for thin-file customers. Instead of replacing a lender's credit decision platform, it operationalises the difficult layer around it: combining permitted alternative signals, policy controls, fraud/data-quality checks, human escalation, and an evidence trail. The result is not just a decision it is a decision an underwriter, auditor, and customer-facing team can understand and challenge.

## Submission priorities

If time is limited, do not attempt every cloud or AI integration. Deliver these four artifacts well:

1. A working decision-provenance screen and reviewer flow.
2. One real technical addition: advisory ML scoring **or** document extraction, not both if they cannot be tested.
3. A one-page model card / policy card showing assumptions, limits, and fairness controls.
4. A README and demo that explicitly distinguishes implemented features from the production roadmap.

## Research sources

- Synchrony describes PRISM as an advanced credit-decision platform using data and analytics beyond a traditional credit score, with fraud and overextension protections: [Synchrony 2025 filing](https://investors.synchrony.com/filings-regulatory/sec-filings/all-sec-filings/content/0001601712-25-000149/syf-20250425.htm).
- Synchrony's 2025 annual filing notes governance of risks related to generative AI: [Synchrony 2025 Annual Report](https://investors.synchrony.com/filings-regulatory/sec-filings/all-sec-filings/content/0001601712-26-000006/syf-20251231.htm).
- NIST describes explainability, accountability, privacy, fairness, and human intervention as trustworthiness considerations: [NIST AI RMF resources](https://airc.nist.gov/airmf-resources/airmf/3-sec-characteristics/).
- NIST's GenAI profile calls for additional oversight, documentation, data protection, monitoring, and risk-based controls where GenAI is used: [NIST AI 600-1](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf).
