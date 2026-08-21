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
| PostgreSQL + pgvector (semantic search) | ✅ | `ai/VectorStore.java` — `CREATE EXTENSION vector`, L2-distance search, graceful token fallback |
| Embeddings model for vector search | ✅ | `ai/EmbeddingService.java` — OpenAI-compatible embeddings with deterministic local fallback |
| LLM service (AWS Bedrock / equivalent) | ⚠️ | `ai/ExplanationService.java` — optional OpenAI-compatible endpoint, off by default with a deterministic fallback. Native Bedrock integration is roadmap |
| Prompt templates & guardrails | ✅ | System prompt + `guardrailOk()` + `sanitize()` in `ExplanationService` |
| Authentication / authorization | ⚠️ | `security/*` — Spring Security and JWT roles; review/upload are role-gated. Full data-endpoint protection and per-applicant isolation are roadmap hardening |
| Input validation | ✅ | Bean validation, normalised upload names, 10 MB upload cap |
| Secure API usage / no hardcoded secrets | ✅ | Secrets via env (`JWT_SECRET`, `OPENAI_API_KEY`); `.env` git-ignored |
| Explainability & transparency | ✅ | Per-decision reasoning, confidence, LLM explanation + disclaimer |
| Responsible AI | ✅ | Age-sensitive bias guardrail → human review; audit trail; simulation labels |
| Document-evidence pipeline | ✅ | Apache Tika extraction → preview + `evidence_embedding` semantic index |
| Git / README / run instructions | ✅ | Commits, README, `.env.example`, this file |
| Architecture diagram | ✅ | `ARCHITECTURE.md` + diagram in submission deck |
| Test coverage | ✅ | 13 backend tests (incl. bias guardrail, vector store) + frontend smoke/build |

## Honest scope notes (do not overclaim)

| Item | Honest status |
| --- | --- |
| AWS Bedrock specifically | Not invoked in this build; a native Bedrock adapter is a roadmap item |
| Real credit-bureau data | Not used; alternative-data signals are simulated/illustrative |
| Production document intelligence | Local text extraction + semantic index implemented; OCR/field-verification governance is roadmap |
| Cloud deployment / monitoring | Docker dev compose only; no managed cloud deploy in this submission |
| Fairness evaluation at scale | Guardrail + review route implemented; formal fairness testing is roadmap |

## Submission deliverables

1. `SE23UCSE065.pdf` — problem, findings, architecture, code approach, evidence, roadmap (generated from `SE23UCSE065.pdf-source.md`).
2. `SE23UCSE065.zip` — must contain the final recorded demo + this repository (build artifacts excluded) after recording and validation.
3. Every submitted file named using **only** the roll number.
4. Email to Technologyinterns@syf.com before the stated 12:00 PM IST deadline.
