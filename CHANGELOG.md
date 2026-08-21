# Changelog — NexCredit AI (Synchrony Hackathon, PB-3)

> Shared record of completed work. Other terminals/agents should read this instead of
> re-running or re-discovering changes. Last updated: 2026-08-21.

## Status: READY FOR SUBMISSION (pending PDF export + demo video + email)

## Completed work

### Rebrand / de-scaffolding (done)
- Renamed Java package `com.syscomz.springbootfullstackprofessional` → `com.synchrony.nexcredit`.
- Renamed main class `SpringBootFullStackProfessionalApplication` → `NexCreditApplication`;
  test `SpringBootFullStackProfessionalApplicationTests` → `NexCreditApplicationTests`.
- `pom.xml`: groupId `com.synchrony`, artifactId `nexcredit-ai`, name `nexcredit-ai`,
  `app.image.name=nexcredit-ai`.
- Removed scaffold tell-tales: `elasticbeanstalk/`, the author's AWS/Slack/DockerHub deploy
  workflow, `application-dev.properties` (his AWS RDS), `application-it.properties` (`syscomz`),
  root scaffold `package.json`/`package-lock.json`, internal `docs/superpowers/` notes,
  `student.sql`, `resources/` AWS/CICD screenshots, empty `student`/`integration` packages.
- Consolidated Markdown: deleted exact duplicates of `submission/SE23UCSE065/*`
  (`DEMO_SCRIPT.md`, `PANEL_QA.md`, `PITCH_DECK.md`, `SUBMISSION.md`, `HACKATHON_COMPLIANCE.md`,
  `HELP.md`); moved unique docs into `docs/` (`architecture.md`, `pitch-context.md`, `roadmap.md`,
  `deck-generation-prompt.md`).
- Rewrote `HELP.md` + CI (`.github/workflows/build.yml`) under the NexCredit identity.

### Backend features (done, 13/13 tests green)
- Spring Boot 3.3.5 + Java 17, `javax`→`jakarta`.
- Spring Security + JWT: `SecurityConfig`, `JwtUtil`, `JwtAuthenticationFilter`, `AuthController`
  (`/api/auth/login`), `UsersConfig` (underwriter / admin / applicant). CORS enabled.
- pgvector semantic document search: `VectorStore`, `EmbeddingService`, `EvidenceSearchRequest`,
  `SearchHit`; `CreditController` gained `POST /api/credit/evidence/search` and
  `POST /api/credit/explanation`.
- LLM `ExplanationService` (OpenAI-compatible optional + deterministic local fallback, guardrails).
- **Strengthening (2026-08-21):** `POST /api/credit/applications` now runs the underwriting policy
  on save, so new applications get a decision + correct review routing (bias guardrail included).
- `build-submission.sh` fixed for macOS `zip` (dropped unsupported `-C`); generated artifacts
  (`submission/*.zip`, `*.pdf`) gitignored.

### Docs / submission (done)
- Master `README.md` with full file-by-file map, API table, responsible-AI posture, run steps.
- `docs/product-vision.md` — problem statement (sell), Synchrony PRISM mapping, SaaS expansion table
  (KYC/bureau/Account-Aggregator/device intel/DPDP), frontend improvements, demo-video script.
  Use for README overview + pitch.
- `submission/SE23UCSE065.zip` regenerated (363K) from current code + roll-numbered docs.

### In progress (separate autonomous terminal/agent)
- **Screenshots into README**: an agent will boot pgvector (5434) + backend (8081, `DB_PASSWORD=admin`)
  + frontend (`REACT_APP_API_BASE_URL=http://localhost:8081`), capture landing/workbench/dashboard/
  review-queue/audit-trail/evidence-search/decision PNGs into `docs/screenshots/`, and add a
  `## Screenshots` section to `README.md`. Do NOT duplicate this in another terminal.

## Known deviations from the original task checklist (deliberate)
- **Ollama not used**; LLM layer uses OpenAI-compatible API (optional) + local rule-based fallback.
- **Spring AI not used**; pgvector + RestClient used directly.
- Roles are `APPLICANT / UNDERWRITER / ADMIN` (checklist said "auditor"; ADMIN ~ auditor).

## Remaining before submit (owner: user)
- Export `submission/SE23UCSE065/SE23UCSE065-pdf-source.md` → `SE23UCSE065.pdf`.
- Optional: drop recorded `SE23UCSE065-demo.mp4` into `submission/SE23UCSE065/` and re-run
  `bash build-submission.sh`.
- Email ZIP + PDF to Technologyinterns@syf.com before 12:00 PM IST.

## Environment notes (for any terminal running the app)
- pgvector: `docker run -e POSTGRES_USER=$USER -e POSTGRES_PASSWORD=admin -e POSTGRES_DB=creditdb
  -p 5433:5432 pgvector/pgvector:pg16` (use 5434 if 5433 busy).
- Backend: `SERVER_PORT=8081 SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5433/creditdb
  DB_PASSWORD=admin ./mvnw -P'!bundle-backend-and-frontend' spring-boot:run`
  (port 8080 is taken by another local service — use 8081).
- Frontend: `cd src/frontend && npm install && REACT_APP_API_BASE_URL=http://localhost:8081 npm start`.
- Demo users: underwriter/underwriter123, admin/admin123, applicant/applicant123.
