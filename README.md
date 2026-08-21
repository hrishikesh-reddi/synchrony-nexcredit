# NexCredit AI

NexCredit AI is a real-time credit-underwriting prototype for New-to-Credit (NTC) and thin-file applicants. It shows how alternative signals—mobile engagement, transaction behaviour, social signals, declared income, and optional documents—can support an explainable credit workflow instead of relying solely on conventional history.

Built for the Synchrony Hackathon problem statement: **Next-Gen Credit Intelligence: Building a Real-Time, Multi-Modal Underwriting Engine**.

## What the prototype demonstrates

- Alternative-data decisioning with confidence and fraud-risk signals.
- An age-sensitive bias guardrail that routes a rejected under-21 applicant to review.
- Human-review queue and per-decision audit record.
- Optional document upload with Apache Tika text extraction, a bounded evidence preview, and a clearly labelled visual scan-preview simulation.
- A visible decision trace: creditworthiness, fraud, decision, explanation, and audit stages.
- NTC inclusion metrics and an illustrative conventional-model comparison.

The decision engine is deterministic and rule-based. This is not a production lending model and does not use live CIBIL, device, location, or external AI services. Supporting-document text is extracted locally for reviewer evidence; it does not automatically change credit eligibility.

## Architecture

```text
React + Ant Design dashboard (role-aware UI)
          |  HTTPS + JWT Bearer
          v
Spring Security (JWT authz, roles: APPLICANT/UNDERWRITER/ADMIN)
Spring Boot REST API
  |        |         |                   |
  |        |         |                   +-- AI layer
  |        |         |                        ExplanationService (LLM, guarded, fallback)
  |        |         |                        EmbeddingService + VectorStore (pgvector semantic search)
  |        |         +-- Audit trail + human review queue
  |        +------------ Underwriting rules + bias guardrail
  +--------------------- PostgreSQL (credit applications) + pgvector (evidence embeddings)
```

## Security & AI layers (implemented)

**Authentication / authorization** — Spring Security with JWT (`security/*`). Stateless,
role-based access: `APPLICANT`, `UNDERWRITER`, `ADMIN`. Review/upload endpoints require
`UNDERWRITER`/`ADMIN`; analysis/evidence/explanation are permitted for the demo. Login via
`POST /api/auth/login` returns a bearer token.

**Semantic evidence search** — `ai/VectorStore.java` enables the PostgreSQL `vector` extension,
stores document-evidence embeddings, and serves cosine-similarity search with a text fallback.

**LLM explanation (responsible AI)** — `ai/ExplanationService.java` calls an OpenAI-compatible
chat endpoint (configurable to AWS Bedrock via `base-url`/model) with a fixed system prompt and
guardrails (`guardrailOk` + `sanitize`). On any failure or guardrail trip it falls back to a
deterministic, transparent explanation. The AI layer is **offline by default** (`nexcredit.ai.enabled=false`);
no key is committed.

## Run locally

Prerequisites: Java 17+, Node/npm, and PostgreSQL **with the `vector` extension** (for semantic search).

Start PostgreSQL and create `creditdb`, then from the repo root:

```bash
SERVER_PORT=8081 \
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/creditdb \
SPRING_DATASOURCE_USERNAME="$USER" \
SPRING_JPA_HIBERNATE_DDL_AUTO=update \
./mvnw -P'!bundle-backend-and-frontend' spring-boot:run
```

In a second terminal:

```bash
cd src/frontend
npm install
PORT=3001 npm start
```

Open `http://localhost:3001`. The development proxy targets `8081`, avoiding a local service already using `8080`.

## Docker

When Docker Desktop is healthy:

```bash
cp .env.example .env
docker compose up --build
```

Frontend: `http://localhost:3000`; backend: `http://localhost:8080`; PostgreSQL + pgvector: `localhost:5433`.

## API surface

| Endpoint | Purpose | Role |
| --- | --- | --- |
| `POST /api/auth/login` | Exchange credentials for a JWT | Public |
| `GET /api/credit/applications` | Application portfolio | Any |
| `POST /api/credit/analyze` | Persist, evaluate, and audit one application | Any |
| `GET /api/credit/pending-review` | Cases requiring a human review | Any |
| `POST /api/credit/review/{applicationId}` | Mark a queued case reviewed and store notes | UNDERWRITER/ADMIN |
| `POST /api/credit/upload?applicationId={id}` | Save an optional supporting document | UNDERWRITER/ADMIN |
| `GET /api/credit/evidence/{applicationId}` | Retrieve the latest extracted supporting-document evidence | Any |
| `POST /api/credit/explanation` | LLM explanation of a decision (guarded, with fallback) | Any |
| `POST /api/credit/evidence/search` | Semantic search across document evidence (pgvector) | Any |
| `GET /api/audit/logs` | Decision audit history | Any |
| `GET /api/health` | Lightweight service readiness check | Public |

## Verification

```bash
./mvnw -P'!bundle-backend-and-frontend' -Dtest=CreditUnderwritingServiceTest,CreditUnderwritingBiasGuardrailTest,CreditControllerTest,CreditSeedDataTest test
cd src/frontend
CI=true npm test -- --watchAll=false
npm run build
```

## Responsible-AI posture

This is a student prototype, not a real-world lending system. Prototype/simulation status is made explicit for visual fraud signals, document scan preview, and conventional-model comparison. A production implementation would require consented data collection, fairness evaluation, security controls, model monitoring, regulatory review, and human accountability.
