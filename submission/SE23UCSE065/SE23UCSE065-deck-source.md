# NexCredit AI — Pitch Deck (slide-by-slide narrative)

> 10 slides, ~8 minutes. Each slide: **title / what to show / what to say**. Build the actual
> deck from this in PowerPoint/Google Slides/Canva. Keep the architecture diagram (slide 4)
> and the responsible-AI slide (slide 8) visually prominent — judges weight these.

---

## Slide 1 — Title
- **Title:** NexCredit AI — A Real-Time, Multi-Modal Underwriting Engine
- **Subtitle:** Explainable credit decisions for New-to-Credit applicants
- **Challenge line:** Synchrony Hackathon Problem Statement 3 (PB-3)
- **Footer:** Synchrony Hackathon · SE23UCSE065
- **Say:** "Thank you. In 8 minutes I'll show how we turn alternative data and document
  evidence into a credit decision a human can actually trust."

## Slide 2 — The problem
- **Show:** Two columns — "Traditional underwriting" vs "What NTC applicants need".
- **Say:** "Credit history excludes millions of creditworthy people — gig workers, students,
  new immigrants. Lenders want to include them *and* stay explainable and auditable. That's
  the tension our engine resolves."

## Slide 3 — Our approach (the 3 ideas)
- **Show:** 3 pillars — (1) Deterministic decisions, optional AI explanations · (2) Semantic evidence retrieval ·
  (3) Secure + human-in-the-loop.
- **Say:** "Three design choices define us: the underwriting outcome is deterministic and the
  optional language model decides nothing autonomously — it only explains;
  we retrieve evidence by *meaning* with pgvector; and review/upload actions are role-gated with JWT."

## Slide 4 — Architecture (KEY SLIDE)
- **Show:** The C4 diagram from `SUBMISSION.md` §4.1 (React → JWT/Security → Engine → AI Layer →
  PostgreSQL+pgvector → Audit).
- **Say:** "API-first, six layers. Note the AI layer sits *beside* the rules engine, not above it.
  The decision is deterministic and reproducible; the LLM only generates the plain-language
  explanation. Everything lands in an audit trail."

## Slide 5 — Multi-modal underwriting flow
- **Show:** The Mermaid sequence (§4.2) or a simplified flow: signals → rules → bias guardrail →
  decision → explanation → audit; plus evidence upload → extract → embed → semantic search.
- **Say:** "Structured signals drive the score; unstructured documents become searchable evidence.
  The age-sensitive guardrail catches policy-sensitive cases and routes them to a human. The
  five-stage frontend animation visualises this workflow; it is not five autonomous backend agents."

## Slide 6 — Key insight: explainability is the product
- **Show:** Bullet insight cards — "Trace > label", "Guardrails in code not prompts", "Graceful
  degradation is maturity", "Roles mirror real ops".
- **Say:** "Our differentiator isn't a fancier model — it's that a reviewer can see *why* in real
  time, the system degrades safely without the LLM, and guardrails are enforced in code."

## Slide 7 — Semantic evidence search
- **Show:** Screenshot of `POST /api/credit/evidence/search` returning ranked evidence chunks for
  "inconsistent monthly income".
- **Say:** "An underwriter asks in natural language; pgvector returns the nearest extracted
  evidence using vector distance — with a text fallback if the extension is off. This is a real
  review-efficiency win."

## Slide 8 — Responsible AI & security (KEY SLIDE)
- **Show:** Icons/checklist — Human-in-the-loop · Guardrails in code · Transparency/disclaimers ·
  Env-injected secrets (none committed) · 10 MB upload cap + name normalization · Honest
  simulation labels.
- **Say:** "We treat this as decision-support, never autonomous approval. Secrets are never
  hardcoded, guardrails run server-side against prompt injection, and every simulation is labelled.
  This is how we'd earn regulatory trust."

## Slide 9 — Evidence & impact
- **Show:** Verified stills: dashboard, APPROVE trace, under-21 → review, JWT login, semantic search,
  audit log. Plus "13 backend tests + frontend test/build green".
- **Say:** "The prototype and its tests cover the deterministic underwriting flow, bias guardrail,
  document extraction, and vector paths. The core flow runs offline with zero AI secrets."

## Slide 10 — Roadmap & ask
- **Show:** Roadmap table (Bedrock swap, consent/provenance, fairness metrics, managed pgvector,
  monitoring) + closing line.
- **Say:** "Next: Bedrock-backed models, consent provenance, and fairness monitoring. Thank you —
  I'd love to show the live demo and take your questions."

---

### Delivery tips
- Spend most time on **slides 4, 7, 8** — they map to the rubric's heaviest weights.
- If asked "is this production-ready?": "No, and we say so explicitly — it's a governed prototype.
  The roadmap shows the path to production."
- Keep total talk time ≤ 8 min to leave 4+ min for Q&A.
