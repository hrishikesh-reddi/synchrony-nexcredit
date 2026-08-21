# NexCredit AI — Demo Recording Script

> Goal: one continuous, ~6–8 min screen recording that proves the full loop works and that the
> implemented workflow, security, evidence retrieval, and optional-AI boundary are clear. Narrate
> as you click. Use OBS / QuickTime. Resolution 1280×800+.

## Before recording (checklist)
- [ ] Backend running on `:8081`, frontend on `:3001`, PostgreSQL + `vector` extension up.
- [ ] Two browser profiles / incognito ready (applicant vs underwriter).
- [ ] A sample income-evidence `.txt`/`.pdf` file on desktop (e.g. `sample-income-evidence.txt`).
- [ ] `NEXCREDIT_AI_ENABLED` left **false** for the resilience segment, then briefly **true** if a key is available.

---

## 0. Cold open (15s)
"Hi, I'm SE23UCSE065. This is NexCredit AI — an explainable, multi-modal underwriting engine."

**Add:** "It addresses Synchrony Hackathon Problem Statement 3: real-time, contextual credit
decisioning for New-to-Credit and thin-file applicants."

## 1. Dashboard (45s)
- Open `http://localhost:3001` → portfolio of seeded NTC applicants + inclusion metrics.
- **Say:** "Here are seeded New-to-Credit applicants and our inclusion impact metrics — the
  population traditional models overlook."

## 2. Create a Gig-Worker application (60s)
- Fill: name, age 29, employment Gig, income, mobile 85 / txn 80 / social 70 → Submit.
- Show the animated **stage trace**: creditworthiness → fraud → decision → explanation → audit.
- **Say:** "Signals flow through deterministic rules. We get an APPROVE with a confidence score
  and a plain-language reason — not a black box. The animation makes the implemented workflow
  visible; it is not a claim that five independent AI agents are running."

## 3. Bias guardrail → human review (60s)
- Create an **under-21** applicant (age 19) with similar scores → submit.
- Show outcome flips to **REVIEW**; open "Pending Review" queue.
- **Say:** "Our age-sensitive guardrail routes policy-sensitive cases to a human. This is
  responsible-AI by design, not an afterthought."

## 4. Security: JWT login as Underwriter (60s)
- Open incognito → `POST /api/auth/login` (or UI login) with `underwriter / underwriter123`.
- Show the returned bearer token; call a protected endpoint (review/upload) **with** and
  **without** the token to demonstrate 401 vs 200.
- **Say:** "Spring Security issues a signed JWT; review and upload are gated to
  UNDERWRITER/ADMIN. This is real authn/authz, the usual student-build gap."

## 5. Document evidence → semantic search (90s)
- As underwriter, upload `sample-income-evidence.txt` against an application.
- Show Tika extraction + bounded preview persisted.
- Run `POST /api/credit/evidence/search` with query **"inconsistent monthly income"**.
- Show ranked evidence chunks (pgvector vector-distance ranking). Mention the token-based text
  fallback if `vector` is off.
- **Say:** "Unstructured proofs become semantically searchable. An underwriter asks in plain
  language and retrieves the exact evidence — by meaning, not keywords."

## 6. Explanation + optional-AI boundary (60s)
- With the default configuration (`NEXCREDIT_AI_ENABLED=false`), call
  `POST /api/credit/explanation` and show the deterministic explanation, `aiPowered: false`, and
  the human-review disclaimer.
- Only if a valid OpenAI-compatible key is deliberately configured, repeat with optional AI enabled
  and show `aiPowered: true`. Do not claim or simulate a remote model call without that evidence.
- **Say:** "The underwriting outcome is always produced by the deterministic policy engine. The
  explanation endpoint works offline by default. An optional, guarded language model can improve
  the wording, but it cannot change the decision; failures fall back safely."

## 7. Audit trail (30s)
- Open `/api/audit/logs` → show decision lineage for the applications just created.
- **Say:** "Every decision is auditable end-to-end — exactly what governance teams require."

## 8. Close (15s)
"NexCredit AI: explainable, secure, multi-modal underwriting. Full code, tests and run
instructions are in the repo. Thank you."

---

## Recording notes
- Capture a clean terminal showing the backend suite passing **13 tests** and `npm run build` early or
  as a pinned clip at the end.
- If Bedrock/OpenAI key is unavailable, that's fine — the resilience segment (step 6) *is* the
  proof point. Do not fake an LLM call.
- Save as `SE23UCSE065-demo.mp4`; zip with the repo as `SE23UCSE065.zip`.
