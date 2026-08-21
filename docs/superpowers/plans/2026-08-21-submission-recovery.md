# NexCredit Submission Recovery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a verified NexCredit application and roll-number-only PDF and ZIP package by 10:30 AM IST.

**Architecture:** Preserve the current landing page and corporate workbench in the canonical repository. Stabilize the React-to-Spring Boot workflow on ports 3001 and 8081, remove submission-critical correctness and credibility defects, then regenerate the report, real demo video, and source bundle from the verified commit.

**Tech Stack:** React 18, Ant Design 5, Spring Boot 3.3, Java 17, PostgreSQL 16, pgvector, JWT, Apache Tika, Maven, Docker Compose.

## Global Constraints

- Canonical source only: `/Users/hrishikeshreddygavinolla/Desktop/NexCredit-AI`.
- Selected challenge only: Problem Statement 3, “Next-Gen Credit Intelligence: Building a Real-Time, Multi-Modal Underwriting Engine.”
- Preserve the current landing page in `src/frontend/src/App.js` and `src/frontend/src/App.css`.
- Do not package `/Users/hrishikeshreddygavinolla/Desktop/syncrony/spring-boot-full-stack-professional` or `/Users/hrishikeshreddygavinolla/Desktop/syncrony/nexcredit-ai`.
- Do not describe the frontend pipeline animation as a live multi-agent backend.
- AI explanations are optional and disabled by default; deterministic fallback behavior must remain usable.
- Final attachments must be named `SE23UCSE065.pdf` and `SE23UCSE065.zip`.
- The ZIP must contain a real playable video named `SE23UCSE065.mp4`.

---

### Task 1: Stabilize the local demo runtime

**Files:**
- Modify: `src/main/resources/application.properties`
- Modify: `src/frontend/src/Client.js`
- Modify: `src/frontend/src/App.js`
- Test: `src/frontend/src/App.test.js`

**Interfaces:**
- Consumes: Spring Boot `GET /api/health` and React `getHealth()`.
- Produces: backend on `http://localhost:8081`, frontend on `http://localhost:3001`, and a health indicator based on an actual response.

- [ ] Add `server.port=${SERVER_PORT:8081}` to the backend configuration and make the frontend default API base `http://localhost:8081`.
- [ ] Add a frontend test proving the status is not shown as live until `getHealth()` resolves successfully.
- [ ] Replace the hard-coded `API live` copy with state driven by `getHealth()`; remove or disable the inert Search control.
- [ ] Run `./mvnw -P'!bundle-backend-and-frontend' test`; expect 13 or more passing tests and zero failures.
- [ ] Run `cd src/frontend && CI=true npm test -- --watchAll=false && npm run build`; expect one passing suite and a successful production build.
- [ ] Start PostgreSQL/pgvector, backend, and frontend; verify `curl -fsS http://localhost:8081/api/health` and open `http://localhost:3001`.
- [ ] Commit with `git commit -m "fix: stabilize local demo runtime"`.

### Task 2: Make explanations read-only

**Files:**
- Modify: `src/main/java/com/synchrony/nexcredit/credit/CreditUnderwritingService.java`
- Modify: `src/main/java/com/synchrony/nexcredit/credit/CreditController.java`
- Modify: `src/main/java/com/synchrony/nexcredit/ai/ExplanationService.java`
- Test: `src/test/java/com/synchrony/nexcredit/credit/CreditControllerTest.java`
- Test: `src/test/java/com/synchrony/nexcredit/credit/CreditUnderwritingServiceTest.java`

**Interfaces:**
- Consumes: an existing `CreditApplication` or a pure underwriting evaluation.
- Produces: `POST /api/credit/explanation` without inserting another application or audit record.

- [ ] Write a failing service/controller test that records repository counts, requests an explanation, and proves the counts must not change.
- [ ] Extract a pure evaluation method that returns a `CreditDecision` without persistence.
- [ ] Keep persistence and audit creation only in the explicit analyze/create workflow.
- [ ] Rename frontend “AI Reasoning” to “Decision rationale” unless `aiPowered` is true.
- [ ] Run the focused tests, then the full backend and frontend suites.
- [ ] Commit with `git commit -m "fix: keep decision explanations read only"`.

### Task 3: Protect decision and evidence data

**Files:**
- Modify: `src/main/java/com/synchrony/nexcredit/security/SecurityConfig.java`
- Modify: `src/main/java/com/synchrony/nexcredit/credit/CreditUnderwritingService.java`
- Modify: `src/main/java/com/synchrony/nexcredit/credit/CreditApplicationService.java`
- Test: create `src/test/java/com/synchrony/nexcredit/security/SecurityIntegrationTest.java`

**Interfaces:**
- Consumes: JWT roles `APPLICANT`, `UNDERWRITER`, and `ADMIN`.
- Produces: authenticated access to applications, audit logs, review queues, uploads, and evidence; atomic decision-plus-audit persistence.

- [ ] Write failing security tests for unauthenticated application, audit, pending-review, and evidence reads.
- [ ] Require UNDERWRITER or ADMIN for portfolio, audit, review, upload, evidence, and explanation operations; retain only health and login as public.
- [ ] Add transactional boundaries around analyze-and-audit and review-and-audit workflows.
- [ ] Replace wildcard credentialed CORS with the configured frontend origins.
- [ ] Run the complete backend test suite and a JWT-authenticated API smoke flow.
- [ ] Commit with `git commit -m "fix: protect underwriting data and audit atomically"`.

### Task 4: Correct the report and demo narrative

**Files:**
- Modify: `submission/SE23UCSE065/SE23UCSE065.pdf-source.md`
- Modify: `submission/SE23UCSE065/SE23UCSE065-demo-script.md`
- Modify: `submission/SE23UCSE065/SE23UCSE065-deck-source.md`
- Modify: `docs/roadmap.md`
- Modify: `README.md`

**Interfaces:**
- Consumes: verified behavior from Tasks 1–3 and screenshots under `docs/screenshots/`.
- Produces: a truthful PB-3-only report and narration aligned with actual endpoints and test counts.

- [ ] Remove PB-1/PB-2 references and identify Problem Statement 3 consistently.
- [ ] Correct credentials, endpoint paths, current test count, pgvector/LLM status, and simulated-agent wording.
- [ ] Insert current screenshots and architecture into the report source.
- [ ] Export a visually checked four-to-eight-page PDF as `/Users/hrishikeshreddygavinolla/Desktop/syncrony/SE23UCSE065/SE23UCSE065.pdf`.
- [ ] Inspect every rendered PDF page for missing glyphs, cropped content, false claims, and inconsistent naming.
- [ ] Commit with `git commit -m "docs: align submission narrative with verified prototype"`.

### Task 5: Record and validate the demo

**Files:**
- Create: `submission/SE23UCSE065/SE23UCSE065.mp4`

**Interfaces:**
- Consumes: the verified local application and final demo script.
- Produces: a real H.264/AAC screen recording showing landing, application, decision, review route, evidence, and audit.

- [ ] Record a concise three-to-five-minute demo against the live canonical application.
- [ ] Validate with `ffprobe`: require one video stream, nonzero duration, readable resolution, and optional audio stream.
- [ ] Play the first, middle, and final sections to confirm there is no dead air, private data, or failed interaction.
- [ ] Keep the final recording small enough that the completed ZIP remains comfortably email-safe.

### Task 6: Build and inspect the final submission

**Files:**
- Modify: `build-submission.sh`
- Create: `submission/SE23UCSE065.zip`

**Interfaces:**
- Consumes: current canonical HEAD, final PDF, and validated MP4.
- Produces: a nonrecursive, roll-numbered submission bundle with no secrets or build artifacts.

- [ ] Update the packaging exclusions to omit `.git`, `node_modules`, `build`, `target`, `.env`, `uploads`, and the generated `submission` directory from the code snapshot.
- [ ] Copy the validated video into the roll-numbered submission folder and generate the ZIP from current HEAD.
- [ ] Run `unzip -t submission/SE23UCSE065.zip`; expect no errors.
- [ ] Extract to a temporary directory and verify it contains the real MP4, README, and current `com/synchrony/nexcredit` sources without old `com/syscomz` scaffold files.
- [ ] Confirm the final attachments are exactly `SE23UCSE065.pdf` and `SE23UCSE065.zip` and send by 10:30 AM IST.
