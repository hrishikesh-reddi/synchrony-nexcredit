import { Button } from 'antd';
import { ArrowRightOutlined, AuditOutlined, FileSearchOutlined } from '@ant-design/icons';

const roadmapStages = [
  {
    title: 'Consented signal ingestion',
    status: 'ROADMAP',
    detail: 'Streaming connectors would validate provenance, consent, freshness, and permitted use before any signal reaches underwriting.',
  },
  {
    title: 'Versioned credit policy',
    status: 'LIVE CORE',
    detail: 'The prototype already produces reproducible policy outcomes. Production adds policy versions, effective dates, and decision snapshots.',
  },
  {
    title: 'Fraud intelligence',
    status: 'PARTIAL',
    detail: 'The current score-based screen routes risk. Production extends it with device, velocity, location, and graph anomaly signals.',
  },
  {
    title: 'Bedrock explanation assistance',
    status: 'ROADMAP',
    detail: 'A guarded model may improve reviewer-facing wording, but it never changes eligibility or overrides deterministic policy.',
  },
  {
    title: 'Human decision and audit',
    status: 'LIVE CORE',
    detail: 'Role-protected review, reviewer actions, rationale, and linked audit events are working in the current prototype.',
  },
];

export default function OperationsBriefing({ apiStatus, authUser, onNavigate }) {
  const reviewerRole = authUser?.roles?.[0] || 'SIGN-IN REQUIRED';

  return <>
    <section className="operations-briefing" id="dashboard-overview">
      <div className="operations-copy">
        <span className="operations-kicker">UNDERWRITING CONTROL PLANE · LIVE PROTOTYPE</span>
        <h1>Credit decision operations</h1>
        <p>Coordinate contextual underwriting, document evidence, human escalation, and decision lineage from one governed workspace.</p>
      </div>
      <div className="operations-actions">
        <Button icon={<FileSearchOutlined />} onClick={() => onNavigate('Applications', 'applications')}>Inspect portfolio</Button>
        <Button type="primary" icon={<AuditOutlined />} onClick={() => onNavigate('Review queue', 'review-queue')}>Open review queue <ArrowRightOutlined /></Button>
      </div>
    </section>

    <section className="system-ledger" aria-label="System operating state">
      <article className={`ledger-api ${apiStatus}`}><span>API SERVICE</span><strong>{apiStatus.toUpperCase()}</strong><small>Spring Boot health probe</small></article>
      <article><span>DECISION POLICY</span><strong>Deterministic policy</strong><small>Reproducible eligibility outcome</small></article>
      <article><span>REVIEWER ACCESS</span><strong>{reviewerRole}</strong><small>JWT role boundary</small></article>
      <article><span>EVIDENCE MODE</span><strong>Resilient retrieval</strong><small>pgvector-ready · text fallback</small></article>
    </section>

    <section className="orchestration-preview" aria-labelledby="orchestration-title">
      <div className="preview-heading">
        <div><span>CONCEPT PREVIEW · PRODUCTION ROADMAP</span><h2 id="orchestration-title">Future-state decision orchestration</h2><p>The working prototype supplies the governed core. Open each stage to see how the platform evolves without confusing planned integrations with live capability.</p></div>
        <b>NOT LIVE</b>
      </div>
      <div className="decision-lineage">
        {roadmapStages.map((stage, index) => <details key={stage.title}>
          <summary><i>0{index + 1}</i><span><strong>{stage.title}</strong><small>{stage.status}</small></span></summary>
          <p>{stage.detail}</p>
        </details>)}
      </div>
      <div className="roadmap-disclosure"><strong>Prototype boundary</strong><span>Deterministic decisioning, document extraction, review, and audit are live. Streaming signals, Bedrock assistance, and advanced fraud intelligence are planned production integrations.</span></div>
    </section>
  </>;
}
