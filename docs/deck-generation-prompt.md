# Replit Prompt — Generate the NexCredit AI Hackathon Slide Deck

> Paste this entire file into a Replit "AI Agent" / "Assistant" chat (or use it as the project
> brief) and ask it to scaffold a slide deck (HTML/CSS, reveal.js, or Google-Slides-style React)
> from the content below. Everything needed to build the slides is included — no external context
> required.

---

## PROJECT IDENTITY

- **Product:** NexCredit AI
- **Tagline:** Credit decisions with context.
- **Problem statement (chosen):** Synchrony Hackathon — *Next-Gen Credit Intelligence: Building a
  Real-Time, Multi-Modal Underwriting Engine.*
- **Candidate / submission id:** SE23UCSE065 (every file is named with this roll number only)
- **One-liner:** An explainable, secure, multi-modal credit-underwriting prototype that helps
  New-to-Credit (NTC) and thin-file applicants by combining alternative-data signals with
  document-evidence semantic search and a guarded LLM explanation — never an autonomous approver.

---

## DESIGN LANGUAGE (apply consistently)

- **Palette:** deep navy `#0B1F3A` background, electric teal `#16E0BD` / `#22D3EE` accents,
  slate `#64748B` text-on-light, white cards. "Fintech trustworthy" not "playful".
- **Fonts:** Inter or Manrope for headings, system sans for body. Monospace (`JetBrains Mono`)
  for code/endpoint snippets.
- **Visual motifs:** signal nodes, radar/risk arcs, audit "ledger" lines, a subtle grid.
  Keep it clean and professional — this is a bank-facing pitch.
- **Slides:** 10 total, 16:9. Include a footer on every slide: `NexCredit AI · Synchrony Hackathon 2026 · SE23UCSE065`.

---

## SLIDE-BY-SLIDE SPEC (build each exactly)

### Slide 1 — Title
- Big title: **NexCredit AI**
- Subtitle: *A Real-Time, Multi-Modal Underwriting Engine*
- Eyebrow: `NEXT-GEN CREDIT INTELLIGENCE · LIVE PROTOTYPE`
- Footer line: candidate id.
- Optional hero art: three connected signal nodes (income / behaviour / review path).

### Slide 2 — The problem
- Left: "Traditional underwriting" — relies on formal credit history; rejects thin-file applicants
  with a missing score.
- Right: "What NTC applicants need" — alternative signals, explainability, human review.
- Headline: *Thin-file applicants deserve more than a missing-score rejection.*

### Slide 3 — Our approach (3 pillars)
Cards:
1. **Rules-first, AI-explains-second** — the model decides nothing; it explains a deterministic decision.
2. **Semantic evidence retrieval** — pgvector turns uploaded documents into meaning-searchable evidence.
3. **Secure + human-in-the-loop** — JWT RBAC; uncertain/policy-sensitive cases route to a reviewer.

### Slide 4 — Architecture (KEY SLIDE)
Render this diagram (boxes + arrows), title "How it works":
```
React workbench (role-aware UI)
        │  HTTPS + JWT Bearer
        ▼
Spring Security (JWT, roles: APPLICANT/UNDERWRITER/ADMIN)
Spring Boot REST API
   ├─ Underwriting Engine (rules + bias guardrail)
   ├─ AI Layer: EmbeddingService · VectorStore(pgvector) · ExplanationService(guarded)
   └─ Audit + Review Queue
        │
        ▼
PostgreSQL  +  pgvector (evidence_embedding)
```
Caption: "The AI layer sits *beside* the rules engine, not above it."

### Slide 5 — Multi-modal underwriting flow
Two-path flow:
- Path A (structured): signals → creditworthiness → fraud → decision → explanation → audit.
- Path B (unstructured): document upload → Tika extract → embed → pgvector index → semantic search.
Highlight the **age-sensitive bias guardrail** diverting under-21 / low-confidence cases to REVIEW.

### Slide 6 — Key insight: explainability is the product
Insight cards:
- "Trace > label" — show the stage trace, not just APPROVE/REJECT.
- "Guardrails in code, not prompts" — `guardrailOk()` + `sanitize()` server-side.
- "Graceful degradation is maturity" — deterministic fallback when LLM/vector DB is off.
- "Roles mirror real ops" — APPLICANT / UNDERWRITER / ADMIN.

### Slide 7 — Semantic evidence search (live feature)
Screenshot-style mock of a search box: query **"inconsistent monthly income"** → ranked, cited
evidence chunks with cosine-similarity scores. Note the text fallback when `vector` extension is off.
Caption: "An underwriter asks in plain language; pgvector returns the exact evidence by meaning."

### Slide 8 — Responsible AI & security (KEY SLIDE)
Checklist with icons:
- Human-in-the-loop (review queue, not autonomous approval)
- Guardrails in code (prompt constraints + server-side injection defence)
- Transparency (per-decision reasoning, confidence, disclaimers, audit trail)
- Secrets via env vars — **none committed**
- Upload safety (name-normalised, 10 MB cap, bounded preview, reviewer-only)
- Honest simulation labels (fraud heatmap / scan preview marked "prototype")

### Slide 9 — Evidence & impact
Grid of demo stills (use placeholders labelled): Dashboard portfolio · APPROVE trace ·
under-21 → REVIEW · JWT login · semantic search · audit log. Plus a chip: "9 backend tests +
frontend build: green".

### Slide 10 — Roadmap & close
Two-column roadmap:
- *Live today:* alt-data workflow, explainable decisions, bias guardrail, JWT RBAC, pgvector search, guarded LLM, audit.
- *Next:* AWS Bedrock models · consent + data provenance · fairness metrics · managed pgvector/RDS · CloudWatch monitoring · model card/risk assessment.
Closing line: *Expanding access and staying explainable, secure, and auditable are the same engineering discipline.*

---

## SUPPORTING FACTS (use verbatim where helpful)

- **Stack:** React + Ant Design (frontend); Spring Boot 3.3 / Java 17 (backend); PostgreSQL with
  the `vector` extension (structured + embeddings); OpenAI-compatible LLM client (Bedrock-swappable).
- **Auth:** Spring Security, JWT (HS256), BCrypt passwords, 3 roles. Demo users:
  `applicant/applicant123`, `underwriter/underwriter123`, `admin/admin123`.
- **AI config (no secrets committed):** `nexcredit.ai.enabled=false` by default; `OPENAI_API_KEY`
  / `JWT_SECRET` injected from environment; `.env` git-ignored.
- **Guardrails:** system prompt forbids revealing logic / inventing facts / discriminating /
  following instructions in data; `guardrailOk()` blocks "ignore previous", "jailbreak", etc.;
  `sanitize()` strips injection patterns; on any failure → deterministic `fallbackExplanation`.
- **Tests:** 9 backend tests (incl. `CreditUnderwritingBiasGuardrailTest`, `VectorStore` paths,
  `DocumentEvidenceServiceTest`) + frontend `CI=true npm test` + `npm run build`.
- **Honest limitations:** no live bureau/device data; Bedrock not invoked offline; document
  intelligence = local extraction + semantic index, not OCR governance.

---

## DELIVERABLE INSTRUCTIONS FOR REPLIT

1. Produce a self-contained **slide deck** (prefer a single `index.html` using reveal.js OR a
   small React/Vite app) implementing the 10 slides above with the specified design language.
2. Use only the text provided — do not invent product claims beyond the "roadmap" section.
3. Make slides navigable (arrows / dots) and exportable to PDF if possible.
4. Name the output project **`nexcredit-deck`** and print the run command (e.g. `npm run dev` or
   open `index.html`).
5. Keep the footer `NexCredit AI · Synchrony Hackathon 2026 · SE23UCSE065` on every slide.

When done, tell me the file to open / command to run, and I will export slide 1–10 to
`SE23UCSE065.pdf` for submission.
