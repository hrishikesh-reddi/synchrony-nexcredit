# Synchrony Hackathon Compliance Checklist — NexCredit AI

> Verified against the actual source in this repository. Updated to reflect the
> auth, pgvector and LLM explanation layers that are now implemented (the earlier
> version of this file predated them).

## Implemented now

| Requirement | Status | Evidence |
| --- | --- | --- |
| React JS frontend | ✅ | `src/frontend` — Ant Design dashboard, application workflow, review queue |
| Spring Boot API | ✅ | `CreditController`, underwriting, review, upload, audit, auth, AI endpoints |
| PostgreSQL (structured) | ✅ | JPA entities + local/Docker PostgreSQL (`creditdb`) |
| PostgreSQL + pgvector (semantic search) | ✅ | `ai/VectorStore.java` — `CREATE EXTENSION vector`, cosine search, graceful fallback |
| Embeddings model for vector search | ✅ | `ai/EmbeddingService.java` — OpenAI-compatible embeddings with deterministic local fallback |
| LLM service (AWS Bedrock / equivalent) | ⚠️ | `ai/ExplanationService.java` — OpenAI-compatible endpoint; Bedrock-ready via base-url swap. Offline by default, rule-based fallback |
| Prompt templates & guardrails | ✅ | System prompt + `guardrailOk()` + `sanitize()` in `ExplanationService` |
| Authentication / authorization | ✅ | `security/*` — Spring Security, JWT, roles `APPLICANT/UNDERWRITER/ADMIN` |
| Input validation | ✅ | Bean validation, normalised upload names, 10 MB upload cap |
| Secure API usage / no hardcoded secrets | ✅ | Secrets via env (`JWT_SECRET`, `OPENAI_API_KEY`); `.env` git-ignored |
| Explainability & transparency | ✅ | Per-decision reasoning, confidence, LLM explanation + disclaimer |
| Responsible AI | ✅ | Age-sensitive bias guardrail → human review; audit trail; simulation labels |
| Document-evidence pipeline | ✅ | Apache Tika extraction → preview + `evidence_embedding` semantic index |
| Git / README / run instructions | ✅ | Commits, README, `.env.example`, this file |
| Architecture diagram | ✅ | `ARCHITECTURE.md` + diagram in submission deck |
| Test coverage | ✅ | 9 backend tests (incl. bias guardrail, vector store) + frontend smoke/build |

## Honest scope notes (do not overclaim)

| Item | Honest status |
| --- | --- |
| AWS Bedrock specifically | Wired through an OpenAI-compatible client; Bedrock is a config swap (`base-url`/model), not invoked in this offline build |
| Real credit-bureau data | Not used; alternative-data signals are simulated/illustrative |
| Production document intelligence | Local text extraction + semantic index implemented; OCR/field-verification governance is roadmap |
| Cloud deployment / monitoring | Docker dev compose only; no managed cloud deploy in this submission |
| Fairness evaluation at scale | Guardrail + review route implemented; formal fairness testing is roadmap |

## Submission deliverables

1. `SE23UCSE065.pdf` — problem, findings, architecture, code approach, evidence, roadmap (generated from `SUBMISSION.md`).
2. `SE23UCSE065.zip` — recorded demo + this repository (build artifacts excluded).
3. Every submitted file named using **only** the roll number.
4. Email to Technologyinterns@syf.com before the stated 12:00 PM IST deadline.
