# NexCredit AI   Product Vision & Roadmap

> How to *sell* this project: the problem we address, what we built, and where it goes as a
> production SaaS. Written to support the pitch, README, and demo narrative.

## 1. Problem statement (the "why")

Traditional credit underwriting leans on a single signal   the bureau/legacy credit score   and
struggles with **New-to-Credit (NTC)** and **thin-file** applicants who lack that history. The
result is structural exclusion: creditworthy people are filtered out by default instead of being
assessed.

This is not a hypothetical gap. Synchrony's own PRISM platform was built precisely because
"traditional models often rely too heavily on a single number" and "even financially responsible
individuals can be left out if underwriting systems don't evolve" (Synchrony, *Building Smarter
Credit for All Americans*). PRISM "goes beyond the traditional score by incorporating a wide range
of alternative data like cash flow, rent payments, [and] partner data," and through OCC's Project
REACh it approved **65,000+ first-time credit lines**, with 60%+ reaching prime within a year.

In India the same dynamic is sharper: bureau-only underwriting "was never built to say 'yes' to
unfamiliar profiles" (FinBox, *Thin-File Underwriting in India*). The addressable population is
large, and any alternative-data approach must sit inside **RBI Digital Lending Guidelines** and the
**DPDP Act 2023** (explicit, purpose-limited consent).

**Synchrony Hackathon PB-3**   *Next-Gen Credit Intelligence: Building a Real-Time, Multi-Modal
Underwriting Engine*   asks exactly this: move from static historical scoring to real-time,
contextual, multi-signal credit decisioning while staying transparent and fraud-aware.

## 2. What NexCredit solves (our work)

NexCredit is a **governed underwriting workbench**, not an autonomous approval bot. It:

- Scores NTC / thin-file applicants from **consented alternative signals** (mobile usage,
  transaction behaviour, social signals, income, employment) via a transparent policy.
- Surfaces a **decision, confidence, fraud-risk label, and stage trace** so every outcome is
  inspectable.
- Applies an **age-sensitive bias guardrail** that escalates rejected under-21 applicants to human
  review instead of auto-declining.
- Provides a **human-review queue** and **per-decision audit log** for accountability.
- Lets underwriters **upload documents** (Apache Tika extraction) and run **pgvector semantic
  search** across evidence.
- Offers an **LLM explanation assistant** (optional OpenAI-compatible API and deterministic local
  fallback, with guardrails) that explains any decision in plain language.
- Secures the API with **JWT auth and roles** (applicant / underwriter / admin).

All of this runs on a standard Spring Boot 3 and React 18 and PostgreSQL/pgvector stack, with 14/14
tests green.

## 3. How it maps to Synchrony PRISM (the sell)

PRISM is Synchrony's next-generation decisioning system that "looks beyond the traditional credit
score" using alternative data and "identifies potential risky behaviors a traditional 'high' credit
score might otherwise mask" (*Healthcare Business Today*). NexCredit should be positioned as a
**prototype of the underwriter decision workspace around such a platform**   the human-in-the-loop
surface where alternative signals become an explainable, reviewable decision. That frames us as
*complementary* to Synchrony's systems, not as a claim to replace them.

## 4. SaaS expansion   external features & integrations

To turn the prototype into a production SaaS, the underwriting policy would stay the final control
while these external capabilities are wired in (research-grounded, India and US contexts):

| Layer | What a production system needs | Example integrations |
| --- | --- | --- |
| **Consent & compliance** | Consent-led data capture, purpose limitation, audit of consent (DPDP Act 2023 / RBI Digital Lending Guidelines) | Consent ledger, Key Fact Statement generation |
| **Identity / KYC** | Verified identity before scoring | Aadhaar eKYC / V-CIP, CKYC (CERSAI), IDfy, Signzy |
| **Bureau** | Traditional score as one input, not the gate | CIBIL, Experian, Equifax, CRIF |
| **Cash-flow & affordability** | Consented bank-statement / transaction analysis | Account Aggregator (Sahamati), Perfios, ULI |
| **Device & behavioural intelligence** | Smartphone/app signals for credit *and* fraud | FinBox DeviceConnect-style device intelligence |
| **Decisioning orchestration** | Combine sources into one policy and reason codes | Scienaptic-style decisioning layer |
| **Model ops** | Monitoring, drift, fairness dashboards, explainability logging for regulators | Model registry, SHAP-style reason codes |
| **Distribution & tenancy** | Multi-tenant, RBAC/SSO, regulatory reporting | OCEN for loan distribution, SSO, audit exports |

Key principle from the research: **no single vendor covers the stack**   KYC ≠ bank-statement
aggregator ≠ decisioning engine. NexCredit's clean API boundary makes it the natural *orchestration*
layer that sits on top of these providers.

## 5. Frontend exploration & improvements

The current UI is a single underwriter workbench. To make it a compelling product demo and SaaS:

- **Role-based surfaces:** separate **applicant self-service portal** (apply, track status, see
  explanation) from the **underwriter workbench** (review, evidence, audit).
- **What-if simulator:** let an underwriter tweak signals and watch the decision/confidence move.
- **Fairness & impact dashboard:** visualise approval rate, guardrail escalations, and the
  inclusion impact (builds on the existing `ImpactMetrics` panel).
- **Richer evidence viewer:** inline document preview and highlighted semantic matches from
  pgvector, not just a raw text snippet.
- **Real-time feel:** optimistic UI updates when a review/audit event lands.
- **Polish:** responsive/mobile layout, dark mode, accessible components, explicit empty/error
  states, and a guided first-run tour.

## 6. Demo video plan (features to showcase)

~6–8 min, one continuous recording. Emphasise the three things judges weight: **explainability,
human review, and auditability**.

1. **Landing**   problem statement and "contextual underwriting" pitch.
2. **Login** as underwriter (demo creds auto-filled).
3. **New application**   fill a sample NTC applicant, hit *Analyze*; show the decision and confidence
 and fraud-risk and stage trace.
4. **Bias guardrail**   submit a low-score under-21 applicant; show the `BIAS GUARDRAIL` note and
   that it routes to **Pending Review**, not an auto-decline.
5. **Document upload and semantic search**   upload an income-evidence file, then run a semantic
   search and show the retrieved passage (pgvector working).
6. **Review queue**   open the escalated case, *Approve/Reject* with notes.
7. **Audit trail**   show the new audit entry appears instantly.
8. **Explanation assistant**   open the explanation for a decision; show plain-language reasoning
   (`aiPowered` flag honest about offline mode).
9. **Close**   recap: explainable, human-in-the-loop, audit-ready.

> Keep the architecture diagram and the responsible-AI slide visually prominent.
