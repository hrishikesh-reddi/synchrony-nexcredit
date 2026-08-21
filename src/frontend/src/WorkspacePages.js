import { Alert, Button, Card, Col, Empty, Row, Spin, Table, Tag } from 'antd';
import {
  ApiOutlined,
  ArrowRightOutlined,
  AuditOutlined,
  CheckCircleOutlined,
  DatabaseOutlined,
  FileSearchOutlined,
  LockOutlined,
  PlusOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import ImpactMetrics from './ImpactMetrics';
import TraditionalComparison from './TraditionalComparison';
import EvidenceSearchPanel from './EvidenceSearchPanel';

const tagColor = decision => ({ APPROVED: 'green', REJECTED: 'red', PENDING: 'gold' }[decision] || 'default');

const columns = [
  { title: 'Applicant', dataIndex: 'applicantName', render: name => <strong>{name}</strong> },
  { title: 'Age', dataIndex: 'age' },
  { title: 'Income', dataIndex: 'annualIncome', render: income => `₹${Number(income || 0).toLocaleString('en-IN')}` },
  { title: 'Decision', dataIndex: 'creditDecision', render: decision => <Tag color={tagColor(decision)}>{decision || 'PENDING'}</Tag> },
  { title: 'Confidence', dataIndex: 'confidenceScore', render: score => score == null ? '—' : `${score}%` },
  { title: 'Fraud risk', dataIndex: 'fraudRisk', render: risk => <Tag>{risk || '—'}</Tag> },
];

function PageHeader({ code, title, description, action }) {
  return <header className="workspace-page-header">
    <div><span>{code}</span><h1>{title}</h1><p>{description}</p></div>
    {action && <div className="page-header-action">{action}</div>}
  </header>;
}

function CommandCenter({ applications, approved, pending, apiStatus, authUser, onNavigate, onOpenApplication }) {
  const rejected = applications.filter(app => app.creditDecision === 'REJECTED').length;
  const total = applications.length || 1;
  const decisionRows = [
    ['Approved', approved, '#0f8a78'],
    ['Pending review', pending, '#d29a2e'],
    ['Rejected', rejected, '#bd4b55'],
  ];
  return <section className="workspace-page">
    <PageHeader code="01 / COMMAND CENTER" title="Portfolio command center" description="A governed view of credit access, underwriting outcomes, and operational workload." action={<Button type="primary" icon={<PlusOutlined />} onClick={onOpenApplication}>Create application</Button>} />
    <section className="metric-ledger">
      <article><span>ACTIVE PORTFOLIO</span><strong>{applications.length}</strong><small>Submitted applications</small></article>
      <article><span>APPROVED</span><strong>{approved}</strong><small>Contextual decisions</small></article>
      <article><span>HUMAN REVIEW</span><strong>{pending}</strong><small>Cases needing judgement</small></article>
      <article><span>REJECTED</span><strong>{rejected}</strong><small>Policy outcomes</small></article>
    </section>
    <ImpactMetrics applications={applications} />
    <section className="command-grid">
      <Card title="Decision distribution" className="banking-card">
        <div className="distribution-list">{decisionRows.map(([label, value, color]) => <div className="distribution-row" key={label}><div><span>{label}</span><strong>{value}</strong></div><div className="distribution-track"><i style={{ width: `${Math.round(value / total * 100)}%`, background: color }} /></div></div>)}</div>
      </Card>
      <Card title="Recent decisions" className="banking-card" extra={<Button type="link" onClick={() => onNavigate('Underwriting Studio')}>View portfolio <ArrowRightOutlined /></Button>}>
        {applications.length ? <div className="recent-decisions">{applications.slice(0, 5).map(app => <div className="recent-decision" key={app.id}><span className="case-monogram">{app.applicantName?.slice(0, 2).toUpperCase()}</span><div><strong>{app.applicantName}</strong><small>{app.employmentType?.replaceAll('_', ' ')} · {app.confidenceScore}% confidence</small></div><Tag color={tagColor(app.creditDecision)}>{app.creditDecision}</Tag></div>)}</div> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No decisions yet" />}
      </Card>
    </section>
    <section className="operating-strip" aria-label="Platform operating state">
      <span><ApiOutlined /><b>API</b> {apiStatus}</span><span><SafetyCertificateOutlined /><b>Policy</b> deterministic</span><span><LockOutlined /><b>Access</b> {authUser?.roles?.[0] || 'sign-in required'}</span><span><DatabaseOutlined /><b>Evidence</b> resilient retrieval</span>
    </section>
  </section>;
}

function UnderwritingStudio({ applications, loading, approved, pending, onOpenApplication, onRefresh }) {
  return <section className="workspace-page">
    <PageHeader code="02 / UNDERWRITING" title="Underwriting Studio" description="Submit alternative signals, inspect portfolio outcomes, and follow the transparent decision path." action={<Button type="primary" icon={<PlusOutlined />} onClick={onOpenApplication}>New application</Button>} />
    <section className="studio-grid">
      <Card className="portfolio-card banking-card" title="Application portfolio" extra={<Button onClick={onRefresh}>Refresh</Button>}>
        {loading ? <div className="loading"><Spin /></div> : applications.length ? <Table dataSource={applications} columns={columns} rowKey={app => app.id} pagination={{ pageSize: 5 }} scroll={{ x: 720 }} /> : <Empty description="Create an application to run an underwriting decision." />}
      </Card>
      <Card className="trace-card" title={<><ThunderboltOutlined /> Decision trace</>}><p>Each application follows a controlled, explainable sequence.</p>{['Signal intake', 'Creditworthiness', 'Fraud screen', 'Decision policy', 'Audit record'].map((stage, index) => <div className="trace-step" key={stage}><b>0{index + 1}</b><span>{stage}<small>{index === 4 ? 'Linked evidence record' : 'Policy stage'}</small></span><i /></div>)}</Card>
    </section>
    <section className="studio-summary"><Card><span>PORTFOLIO</span><strong>{applications.length}</strong><small>active applications</small></Card><Card><span>AUTO-APPROVED</span><strong>{approved}</strong><small>contextual outcomes</small></Card><Card><span>REVIEW WORKLOAD</span><strong>{pending}</strong><small>pending cases</small></Card></section>
    <TraditionalComparison />
  </section>;
}

function EvidenceIntelligence({ applications, onOpenApplication }) {
  const documented = applications.filter(app => app.documentPath || app.documentPreview).length;
  const flow = [
    ['01', 'Secure intake', 'Attach evidence to an application through the authenticated upload endpoint.'],
    ['02', 'Text extraction', 'Apache Tika extracts a bounded preview from supported documents.'],
    ['03', 'Evidence indexing', 'Document chunks are stored for retrieval; pgvector is used when available.'],
    ['04', 'Resilient search', 'Evidence queries fall back to deterministic text matching if vector search is unavailable.'],
  ];
  return <section className="workspace-page">
    <PageHeader code="03 / EVIDENCE" title="Evidence Intelligence" description="Turn applicant documents into searchable decision support without hiding the underlying evidence." action={<Button icon={<PlusOutlined />} onClick={onOpenApplication}>Evidence-backed application</Button>} />
    <section className="evidence-overview"><Card><FileSearchOutlined /><span>DOCUMENTED CASES</span><strong>{documented}</strong><small>evidence attached in portfolio</small></Card><Card><DatabaseOutlined /><span>RETRIEVAL MODE</span><strong>Resilient</strong><small>vector with text fallback</small></Card><Card><SafetyCertificateOutlined /><span>DECISION ROLE</span><strong>Advisory</strong><small>evidence never bypasses policy</small></Card></section>
    <div className="evidence-flow">{flow.map(([number, title, detail], index) => <article key={title}><b>{number}</b><div><h3>{title}</h3><p>{detail}</p></div>{index < flow.length - 1 && <ArrowRightOutlined />}</article>)}</div>
    <EvidenceSearchPanel />
  </section>;
}

function Governance({ applications, auditLogs, pending, onReview, onRefreshAudit }) {
  const reviewCases = applications.filter(app => app.reviewStatus === 'PENDING_REVIEW');
  return <section className="workspace-page">
    <PageHeader code="04 / GOVERNANCE" title="Review & Governance" description="Keep consequential decisions explainable, reviewable, and connected to an audit event." />
    <Alert className="responsible-ai" message="Responsible decision guardrail" description="Low-confidence, high-risk, and policy-sensitive outcomes are routed to a human reviewer before final action." type="info" showIcon />
    <section className="governance-controls"><article><SafetyCertificateOutlined /><div><strong>Bias-sensitive escalation</strong><p>Age-sensitive rejections are moved to review instead of being finalized automatically.</p></div></article><article><CheckCircleOutlined /><div><strong>Human authority</strong><p>An authenticated underwriter can approve or reject a queued case with an explicit review action.</p></div></article><article><AuditOutlined /><div><strong>Decision lineage</strong><p>Application decisions and reviewer outcomes produce linked audit records.</p></div></article></section>
    <Row gutter={[18, 18]} className="operations-row"><Col xs={24} lg={12}><Card title="Human review queue" extra={<Tag color="gold">{pending} pending</Tag>} className="banking-card">{reviewCases.length ? reviewCases.map(app => <div className="queue-item" key={app.id}><strong>{app.applicantName}</strong><span>{app.confidenceScore}% confidence · {app.fraudRisk} risk</span><div className="review-actions"><Button size="small" onClick={() => onReview(app, 'APPROVED')}>Approve</Button><Button danger size="small" onClick={() => onReview(app, 'REJECTED')}>Reject</Button></div></div>) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No cases awaiting review" />}</Card></Col><Col xs={24} lg={12}><Card title="Decision audit history" extra={<Button size="small" onClick={onRefreshAudit}>Refresh</Button>} className="banking-card">{auditLogs.length ? auditLogs.slice(0, 8).map(log => <div className="queue-item" key={log.id}><strong>Application #{log.applicationId || 'legacy'}</strong><span>{log.decision} · {log.reasoning}</span><Tag>Audited</Tag></div>) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No audit entries loaded" />}</Card></Col></Row>
  </section>;
}

function Architecture() {
  const implemented = ['React multi-page underwriting workspace', 'Spring Boot REST API and deterministic policy', 'PostgreSQL applications and audit records', 'JWT roles for reviewer actions', 'Apache Tika document extraction', 'pgvector adapter with text-search fallback'];
  const evolution = ['Consented real-time signal connectors', 'Versioned policy snapshots and decision provenance', 'Device, velocity, and graph-based fraud intelligence', 'Guarded Bedrock assistance for reviewer explanations', 'Cloud IAM, observability, drift, and fairness monitoring'];
  return <section className="workspace-page">
    <PageHeader code="05 / PLATFORM" title="Platform Architecture" description="A modular API-first foundation for contextual underwriting, evidence retrieval, and responsible human oversight." />
    <section className="architecture-map"><article><span>EXPERIENCE</span><strong>React workbench</strong><small>Applications · evidence · governance</small></article><ArrowRightOutlined /><article><span>API</span><strong>Spring Boot</strong><small>Validation · JWT roles · REST services</small></article><ArrowRightOutlined /><article><span>DECISION</span><strong>Transparent policy</strong><small>Outcome · confidence · rationale · risk</small></article><ArrowRightOutlined /><article><span>DATA</span><strong>PostgreSQL</strong><small>Portfolio · audit · document evidence</small></article></section>
    <section className="architecture-secondary"><article><FileSearchOutlined /><div><strong>Evidence path</strong><p>Multipart upload → Tika extraction → bounded content → vector or text retrieval.</p></div></article><article><SafetyCertificateOutlined /><div><strong>Governance path</strong><p>Policy guardrail → pending review → underwriter action → linked audit event.</p></div></article><article><ApiOutlined /><div><strong>Integration path</strong><p>API-first services keep the UI, policy, retrieval, and future cloud adapters independently evolvable.</p></div></article></section>
    <section className="capability-columns"><Card title="Implemented in this prototype">{implemented.map(item => <p key={item}><CheckCircleOutlined /> {item}</p>)}</Card><Card title="Production evolution">{evolution.map(item => <p key={item}><ArrowRightOutlined /> {item}</p>)}</Card></section>
  </section>;
}

export default function WorkspacePages(props) {
  switch (props.activePage) {
    case 'Underwriting Studio': return <UnderwritingStudio {...props} />;
    case 'Evidence Intelligence': return <EvidenceIntelligence {...props} />;
    case 'Review & Governance': return <Governance {...props} />;
    case 'Platform Architecture': return <Architecture />;
    default: return <CommandCenter {...props} />;
  }
}
