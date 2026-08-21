# NexCredit AI — Working Context

## Product objective

NexCredit AI addresses Synchrony Hackathon Problem Statement 3: contextual credit decisioning for New-to-Credit and thin-file applicants. The prototype combines alternative-data scores, deterministic underwriting, fraud-risk routing, human review, document evidence, and audit history. It must never be described as a trained production model or as autonomous agents.

## Canonical workspace

- Work only in `/Users/hrishikeshreddygavinolla/Desktop/NexCredit-AI`.
- Local frontend: `http://localhost:3001`.
- Local backend: `http://localhost:8081`.
- Keep Docker work optional until after the submission; local services are the demo path.

## Implemented experience

The landing page introduces the problem and architecture. The authenticated workspace has five real navigation views:

1. Command Center — portfolio and inclusion metrics, decision mix, recent decisions.
2. Underwriting Studio — working application drawer, portfolio, deterministic decision trace, traditional comparison.
3. Evidence Intelligence — working evidence search plus the implemented Tika/vector/text-fallback flow.
4. Review & Governance — working reviewer approve/reject actions and audit history.
5. Platform Architecture — truthful implemented topology and separately labelled production evolution.

## Truthfulness boundaries

- The underwriting outcome is deterministic and explainable.
- The five-stage frontend sequence is a workflow visualisation, not an autonomous multi-agent runtime.
- Remote LLM assistance is optional and off by default; the local fallback is deterministic.
- pgvector is supported when available; local evidence search can fall back to text retrieval.
- Fraud assessment is score-based prototype routing, not device/graph/velocity fraud detection.
- Production ideas belong under “Production evolution” and must not appear as working action buttons.

## Submission priorities

- Required report: `submission/SE23UCSE065.pdf`.
- Required real demo: `submission/SE23UCSE065/SE23UCSE065.mp4`.
- Run `bash build-submission.sh` only after the real MP4 exists; the script validates the video and creates `submission/SE23UCSE065.zip`.
- Do not submit any file named `DO-NOT-SUBMIT` or an older ZIP from `/Desktop/syncrony`.

## Verification

- Frontend: `cd src/frontend && CI=true npm test -- --runInBand && npm run build`.
- Backend: `./mvnw -P'!bundle-backend-and-frontend' test`.
- Health: `curl http://localhost:8081/api/health`.
