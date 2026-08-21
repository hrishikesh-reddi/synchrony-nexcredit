# NexCredit AI - Final Demo Recording Script

**Target duration:** 4-5 minutes

**Frontend:** `http://localhost:3001`

**Demo user:** `underwriter / underwriter123`

**Recording filename:** `SE23UCSE065.mp4`

## Before recording

- Keep the backend running on port 8081 and the frontend on port 3001.
- Open the landing page and close unrelated tabs or notifications.
- Keep one plain-text supporting document ready. PostgreSQL is required; pgvector is optional because evidence search has a text fallback.
- Do not show terminal tokens, personal messages, environment variables, or API keys.

## 1. Opening and problem (0:00-0:30)

**On screen:** NexCredit landing page.

**Say:**

“Hello, I am SE23UCSE065. This is NexCredit AI, my solution for Synchrony Hackathon Problem Statement 3: building a real-time, multi-modal underwriting engine for New-to-Credit and thin-file applicants.

Traditional models often reject people who do not have a long bureau history. NexCredit evaluates permitted alternative signals, explains the result, routes uncertain cases to a human reviewer, and keeps an audit trail.”

## 2. Architecture and product overview (0:30-1:00)

**On screen:** Scroll through the problem, architecture and capability sections; then click **Open live workbench**.

**Say:**

“The application is a working React and Spring Boot system backed by PostgreSQL. Structured application signals go through a deterministic underwriting policy. Documents are extracted with Apache Tika, evidence can be retrieved through pgvector or the offline text fallback, and an optional language model may improve explanations without changing the credit decision.

The five-stage animation visualises this controlled workflow. It is not a claim that five autonomous agents are making lending decisions.”

## 3. Approve a healthy NTC application (1:00-2:00)

**On screen:** Click **New application** and enter:

- Applicant name: `Demo NTC Applicant`
- Age: `29`
- Annual income: `480000`
- Employment: `GIG_WORKER`
- Mobile usage: `85`
- Transaction behaviour: `80`
- Social signals: `70`

Click **Analyze application** and show the stage animation and decision card.

**Say:**

“This applicant is a gig worker with limited traditional history but strong alternative signals. NexCredit evaluates the signals in real time and produces an APPROVED decision with 88 percent confidence and low fraud risk.

The reviewer can see the contributing scores, decision rationale and comparison with a traditional thin-file outcome. The result is reproducible because the decision itself comes from an auditable policy, not an unconstrained prompt.”

## 4. Bias guardrail and human review (2:00-2:50)

**On screen:** Create a second application:

- Applicant name: `Demo Review Applicant`
- Age: `19`
- Annual income: `180000`
- Employment: `STUDENT`
- Mobile usage: `20`
- Transaction behaviour: `45`
- Social signals: `50`

Submit it, open **Review queue**, and show the case being routed for review. If it is already present from testing, use the existing case. Approve or reject it and show the updated status.

**Say:**

“Here the low mobile score would normally produce a rejection. Because the applicant is under 21, the bias guardrail prevents an automatic decline and routes the case to human review.

The active underwriter role can add a final decision and reviewer note. This demonstrates human-in-the-loop control instead of pretending the system is certain.”

## 5. Document evidence and resilient search (2:50-3:35)

**On screen:** Upload the prepared text document, show the extracted evidence preview, and search for `alternative data underwriting` in the Evidence Search panel.

**Say:**

“Supporting documents are not merely stored. Apache Tika extracts a bounded reviewer-visible preview. The evidence layer can use pgvector when available, and it falls back to text matching when the vector extension is offline.

In this local recording the interface reports the active mode honestly, while still returning relevant evidence instead of failing the complete workflow.”

## 6. Explanation and audit trail (3:35-4:15)

**On screen:** Show **Decision rationale**, then open **Audit trail**.

**Say:**

“The explanation endpoint works offline by default and cannot create another application or change the original outcome. Optional remote AI is disabled for this demo; if enabled later, it can improve wording but never decide eligibility.

Every actual analysis creates a linked audit record. Reviewer action creates another event, giving the team a visible decision history for governance and investigation.”

## 7. Closing (4:15-4:30)

**On screen:** Return to the workbench overview or landing page.

**Say:**

“NexCredit AI shifts underwriting from a missing-score rejection to proactive, contextual and accountable decision support. It combines alternative signals, document evidence, explainability, human review and auditability in one working prototype. Thank you.”

## Recording validation

After export, confirm that `SE23UCSE065.mp4` contains a real video stream, opens normally, has audible narration, and shows no private information. Copy it to:

`submission/SE23UCSE065/SE23UCSE065-demo.mp4`
