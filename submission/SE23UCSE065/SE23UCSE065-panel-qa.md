# NexCredit AI — Anticipated Panel Questions & Answers

> For the Synchrony campus pitch (24–25 Aug). Answers are honest, rubric-aligned, and
> demo-backed. Where something is roadmap, say so plainly — it reads as maturity, not weakness.

---

## On the problem & differentiation

**Q: What makes this different from a normal credit-score form?**
A: Most student credit projects stop at a form + approve/reject label. NexCredit makes the
decision *inspectable* — stage trace, confidence, fraud context, bias-aware escalation, audit
trail — and adds semantic retrieval over document evidence plus a guarded LLM explanation.

**Q: Why "rules-first, AI-second"?**
A: Because the decision must be reproducible and auditable. The LLM only *explains* a decision
the deterministic engine already made. If the LLM is wrong or unavailable, the decision and its
reasoning still stand. That's the responsible-AI posture a lender needs.

## On AI / LLM

**Q: You mention AWS Bedrock — did you actually use it?**
A: The AI client is OpenAI-compatible and **Bedrock-swappable** via `base-url`/model config, but
the offline submission doesn't call Bedrock — no keys are committed and the layer is off by
default. It degrades to a deterministic explanation. I can show the exact config swap.

**Q: How do you prevent prompt injection from applicant data?**
A: Two layers. (1) The system prompt forbids following instructions in data and inventing facts.
(2) Server-side `guardrailOk()` rejects outputs containing "ignore previous", "jailbreak", etc.,
and `sanitize()` strips injection patterns before anything is returned. Guardrails are in *code*,
not just the prompt.

**Q: What embedding model, and what if it fails?**
A: `text-embedding-3-small` (1536-dim) when enabled; otherwise a deterministic local hashing
embedding keeps semantic search functional offline. Same resilience pattern as the chat layer.

## On security

**Q: How is auth implemented?**
A: Spring Security + JWT (HS256). `AuthController.login` returns a signed token with a `roles`
claim; `JwtAuthenticationFilter` validates it; `SecurityConfig` gates review/upload to
UNDERWRITER/ADMIN. Passwords are BCrypt-hashed; secrets come from env vars, never the repo.

**Q: Any hardcoded secrets?**
A: No. `JWT_SECRET`, `OPENAI_API_KEY` are environment-injected with safe dev defaults; `.env` is
git-ignored (see `.env.example`).

## On data & fairness

**Q: Is this biased against certain groups?**
A: We don't claim a fair model — we claim *controlled* handling. The age guardrail deliberately
routes under-21 cases to humans rather than auto-deciding, and every case is auditable. Formal
fairness evaluation, consented-data provenance, and bias monitoring are explicit roadmap items.

**Q: Where does the data come from?**
A: Alternative-data signals are simulated/illustrative; no live bureau, device, or location data.
Document evidence is uploaded locally, name-normalised, size-capped (10 MB), and stored as
reviewer-only bounded text. Clearly labelled as prototype.

## On architecture & engineering

**Q: Why PostgreSQL + pgvector rather than a separate vector DB?**
A: Single source of truth, transactional consistency between structured applications and evidence
embeddings, and operational simplicity. pgvector gives us cosine search with a text fallback when
the extension isn't present.

**Q: How would you deploy this?**
A: Docker compose today (dev). Production path: managed RDS with pgvector, ECS/EKS, Bedrock for
models, CloudWatch for logging/monitoring, and an append-only audit store. Outlined in the
roadmap slide.

**Q: Test coverage?**
A: 9 backend tests (underwriting, bias guardrail, vector store, document evidence, controller,
health) plus a frontend smoke test and production build — all green.

## Trap questions (answer calmly)

**Q: Is this ready to approve real loans?**
A: No, and we state that explicitly. It's a governed prototype for the hackathon. Production would
require consented data, model governance, fairness testing, monitoring, and regulatory review.

**Q: Why didn't you use a real ML model?**
A: A black-box model would undermine the core value — explainability and auditability. For a
hackathon demonstrating *responsible* credit intelligence, transparent rules + guarded
explanations is the stronger, more honest choice, and the architecture cleanly accepts a governed
model later.

## One-line closer
"NexCredit shows that expanding credit access and keeping decisions explainable, secure, and
auditable aren't competing goals — they're the same engineering discipline."
