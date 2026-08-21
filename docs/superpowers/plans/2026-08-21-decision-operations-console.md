# Decision Operations Console Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the verified workbench into a finance-grade decision-operations presentation with real system status and an honest interactive production-roadmap explanation.

**Architecture:** Keep the single-page React structure and all existing backend integrations. Add one presentational `OperationsBriefing` component driven by `apiStatus` and `authUser`, then render it above the existing working portfolio. The future-state orchestration uses expandable native details panels and is explicitly labelled as a concept preview.

**Tech Stack:** React 18, Ant Design, existing CSS, Jest and React Testing Library.

## Global Constraints

- No backend, schema, dependency, Docker, or API changes.
- No fake LLM or autonomous-agent execution.
- Every roadmap capability must display “Concept preview” or “Roadmap”.
- Existing application, review, evidence, explanation, and audit flows must remain unchanged.

---

### Task 1: Decision operations briefing

**Files:**
- Create: `src/frontend/src/OperationsBriefing.js`
- Modify: `src/frontend/src/App.js`
- Modify: `src/frontend/src/App.css`
- Test: `src/frontend/src/App.test.js`

**Interfaces:**
- Consumes: `apiStatus: 'checking' | 'live' | 'offline'`, `authUser: { username, roles } | null`, and `navigateTo(label, sectionId)`.
- Produces: `<OperationsBriefing apiStatus authUser onNavigate />` with working section-navigation controls and static, disclosed roadmap details.

- [ ] **Step 1: Write the failing test**

Add assertions after opening the workbench:

```javascript
expect(await screen.findByRole('heading', { name: /Credit decision operations/i })).toBeInTheDocument();
expect(screen.getByText(/Concept preview/i)).toBeInTheDocument();
expect(screen.getByText(/Deterministic policy/i)).toBeInTheDocument();
expect(screen.queryByText(/Good morning, analyst/i)).not.toBeInTheDocument();
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
cd src/frontend
CI=true npm test -- --runInBand
```

Expected: FAIL because the new operations heading and concept disclosure do not exist.

- [ ] **Step 3: Implement the component and integration**

Create `OperationsBriefing.js` with:

```javascript
export default function OperationsBriefing({ apiStatus, authUser, onNavigate }) {
  const role = authUser?.roles?.[0] || 'SIGN-IN REQUIRED';
  return <>
    <section className="operations-briefing" id="dashboard-overview">
      <div><span>UNDERWRITING CONTROL PLANE</span><h1>Credit decision operations</h1><p>Coordinate contextual underwriting, evidence review, human escalation, and decision lineage.</p></div>
      <div className="operations-actions">
        <button onClick={() => onNavigate('Applications', 'applications')}>Inspect portfolio</button>
        <button onClick={() => onNavigate('Review queue', 'review-queue')}>Open review queue</button>
      </div>
    </section>
    <section className="system-ledger" aria-label="System operating state">
      <article><span>API SERVICE</span><strong>{apiStatus.toUpperCase()}</strong><small>Spring Boot health probe</small></article>
      <article><span>DECISION POLICY</span><strong>Deterministic policy</strong><small>Reproducible eligibility outcome</small></article>
      <article><span>REVIEWER ACCESS</span><strong>{role}</strong><small>JWT role boundary</small></article>
      <article><span>EVIDENCE MODE</span><strong>Resilient retrieval</strong><small>pgvector-ready with text fallback</small></article>
    </section>
    <section className="orchestration-preview">
      <div className="preview-heading"><div><span>CONCEPT PREVIEW · PRODUCTION ROADMAP</span><h2>Future-state decision orchestration</h2><p>The working prototype supplies the governed core. These disclosed extensions show how it evolves in production.</p></div><b>NOT LIVE</b></div>
      <div className="decision-lineage">{['Signal ingestion','Credit policy','Fraud assessment','Explanation assistance','Human approval + audit'].map((stage, index) => <details key={stage}><summary><i>0{index + 1}</i><strong>{stage}</strong></summary><p>Roadmap capability connected to the governed underwriting workflow.</p></details>)}</div>
    </section>
  </>;
}
```

Import and render it in `App.js` before the responsible-AI alert. Remove the generic dashboard hero.

- [ ] **Step 4: Add finance-grade styling**

Add CSS for `.operations-briefing`, `.system-ledger`, `.orchestration-preview`, `.preview-heading`, and `.decision-lineage` using the approved navy, teal, white, slate, and amber tokens. Preserve responsive behaviour below 900px and 600px.

- [ ] **Step 5: Run verification**

Run:

```bash
cd src/frontend
CI=true npm test -- --runInBand
npm run build
```

Expected: 2 frontend tests pass and the production build completes.

- [ ] **Step 6: Commit**

```bash
git add src/frontend/src/OperationsBriefing.js src/frontend/src/App.js src/frontend/src/App.css src/frontend/src/App.test.js
git commit -m "feat: add decision operations console"
```
