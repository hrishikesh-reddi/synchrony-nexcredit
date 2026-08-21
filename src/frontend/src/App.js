import { useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Empty, Input, Layout, Modal, Row, Spin, Table, Tag, Typography } from 'antd';
import { ApiOutlined, AppstoreOutlined, ArrowRightOutlined, AuditOutlined, CheckCircleFilled, FileSearchOutlined, LockOutlined, PlusOutlined, SafetyCertificateOutlined, ThunderboltOutlined, UserOutlined } from '@ant-design/icons';
import { getAuditLogs, getCreditApplications, getHealth, login, reviewCreditApplication, setAuthToken } from './Client';
import { errorNotification } from './Notification';
import CreditApplicationForm from './CreditApplicationForm';
import ImpactMetrics from './ImpactMetrics';
import TraditionalComparison from './TraditionalComparison';
import EvidenceSearchPanel from './EvidenceSearchPanel';
import './App.css';

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;
const tagColor = decision => ({ APPROVED: 'green', REJECTED: 'red', PENDING: 'gold' }[decision] || 'default');
const columns = [
  { title: 'Applicant', dataIndex: 'applicantName', render: name => <strong>{name}</strong> },
  { title: 'Age', dataIndex: 'age' },
  { title: 'Income', dataIndex: 'annualIncome', render: income => `₹${Number(income || 0).toLocaleString('en-IN')}` },
  { title: 'Decision', dataIndex: 'creditDecision', render: decision => <Tag color={tagColor(decision)}>{decision || 'PENDING'}</Tag> },
  { title: 'Confidence', dataIndex: 'confidenceScore', render: score => score == null ? ' ' : `${score}%` },
  { title: 'Fraud risk', dataIndex: 'fraudRisk', render: risk => <Tag>{risk || ' '}</Tag> },
];

function LandingPage({ onOpenWorkbench, onStartApplication }) {
  return <Layout className="app-shell landing-shell">
    <Header className="topbar"><div className="brand"><SafetyCertificateOutlined /> NexCredit <span>AI</span></div><nav className="command-nav landing-nav"><Button type="text">Overview</Button><Button type="text" onClick={onOpenWorkbench}>Live workbench</Button></nav><Button className="new-app-button" onClick={onStartApplication}>Start an application <ArrowRightOutlined /></Button></Header>
    <Content className="landing-wrap"><section className="landing-hero"><div className="landing-copy"><span className="eyebrow">NEXT-GEN CREDIT INTELLIGENCE <i>●</i> LIVE PROTOTYPE</span><Title>Credit decisions<br />with <em>context.</em></Title><p>NexCredit gives New-to-Credit applicants a fairer path forward through alternative signals, explainable decisions, and accountable human review.</p><div className="landing-actions"><Button className="landing-primary" size="large" onClick={onOpenWorkbench}>Open live workbench <ArrowRightOutlined /></Button><Button size="large" onClick={onStartApplication}>Run a sample application</Button></div><small><CheckCircleFilled /> Explainable prototype · <CheckCircleFilled /> Human review · <CheckCircleFilled /> Audit-ready trail</small></div><div className="signal-canvas" aria-hidden="true"><span className="canvas-label label-a">INCOME SIGNAL</span><span className="canvas-label label-b">BEHAVIOUR</span><span className="canvas-label label-c">REVIEW PATH</span><i className="signal-node node-a" /><i className="signal-node node-b" /><i className="signal-node node-c" /><svg viewBox="0 0 500 360"><path d="M34 296 C114 190, 131 319, 218 206 S358 286, 461 78" /><path d="M51 94 C156 157, 216 28, 314 131 S407 199, 476 171" /></svg><aside className="hero-console"><div className="console-top"><span>DECISION PREVIEW</span><i>LIVE</i></div><strong>New-to-Credit profile</strong><p>Alternative signals need a reviewer’s context.</p><div className="console-decision"><span>ROUTED TO REVIEW</span><b>92<span>%</span></b><small>Confidence</small></div><div className="console-signals"><span>Alternative signals</span><b>Mobile 20 · Transactions 45 · Social 50</b></div></aside></div></section>
      <section className="problem-strip"><div><span>THE PROBLEM</span><h2>Thin-file applicants deserve more than a missing-score rejection.</h2></div><p>Traditional models can lack context. NexCredit makes the decision path visible, uses consented prototype signals, and refers uncertain cases to human underwriting.</p></section>
      <section className="landing-grid"><Card><span className="feature-index">01</span><h3>Contextual underwriting</h3><p>Combine income, behaviour, and alternative data into one understandable decision profile.</p></Card><Card><span className="feature-index">02</span><h3>Responsible by design</h3><p>Bias guardrails, confidence thresholds, reviewer escalation, and explicit reasoning.</p></Card><Card><span className="feature-index">03</span><h3>Evidence at every step</h3><p>Decision traces and audit history make each workflow event inspectable.</p></Card></section>
      <section className="architecture-section"><div><span className="eyebrow">HOW IT WORKS</span><h2>From signal to accountable action.</h2><p>Built as a real React, Spring Boot, and PostgreSQL application not a static mockup.</p></div><div className="architecture-flow"><span>React workbench</span><ArrowRightOutlined /><span>Spring Boot API</span><ArrowRightOutlined /><span>Underwriting + guardrails</span><ArrowRightOutlined /><span>PostgreSQL + audit</span></div></section>
      <section className="project-briefing"><div className="briefing-intro"><span className="eyebrow">PROJECT BRIEFING</span><h2>Architecture you can explain.</h2><p>This is the pitch map: every stage corresponds to a real part of the prototype, so the narrative stays clear during a demo or jury discussion.</p></div><div className="architecture-ledger"><article><b>01</b><h3>Consent-led signal intake</h3><p>The application captures income, employment type, and three alternative-data indicators: mobile use, transaction behaviour, and social signals.</p><small>React form · input validation</small></article><article><b>02</b><h3>Decisioning API</h3><p>Spring Boot receives the application and applies a transparent underwriting policy to produce a decision, confidence, explanation, and fraud-risk label.</p><small>REST API · deterministic policy</small></article><article><b>03</b><h3>Guardrails and review</h3><p>Low-confidence, high-risk, or policy-sensitive outcomes route to a reviewer rather than pretending the system is certain.</p><small>Bias guardrail · human-in-the-loop</small></article><article><b>04</b><h3>Evidence and accountability</h3><p>PostgreSQL keeps the application and its decision history together, making reviewer actions and audit events inspectable.</p><small>Audit log · reviewer notes</small></article></div></section>
      <section className="capability-section"><div className="capability-copy"><span className="eyebrow">PROBLEM STATEMENT 3</span><h2>What the prototype proves today.</h2><p>NexCredit demonstrates proactive, contextual credit decisioning for thin-file customers. It combines alternative signals with explainability and an escalation route instead of treating automation as a black box.</p><Button type="text" onClick={onOpenWorkbench}>Inspect the live workflow <ArrowRightOutlined /></Button></div><div className="capability-matrix"><div><span>LIVE IN THIS PROTOTYPE</span><ul><li>Alternative-data application workflow</li><li>Explainable decision and confidence</li><li>Fraud-risk routing and bias guardrail</li><li>Human review queue with audit history</li></ul></div><div className="roadmap-card"><span>PRODUCTION EXTENSIONS</span><ul><li>Consent management and role-based access</li><li>Bedrock + prompt guardrails for assisted explanations</li><li>pgvector document retrieval and evidence search</li><li>Monitoring, model evaluation, and drift review</li></ul></div></div></section>
      <section className="landing-cta"><div><ApiOutlined /><h2>See the full underwriting workflow.</h2><p>Open the portfolio, review a case, and watch the audit trail update.</p></div><Button size="large" onClick={onOpenWorkbench}>Explore NexCredit <ArrowRightOutlined /></Button></section>
    </Content><Footer className="footer">NexCredit AI · Synchrony Hackathon 2026</Footer>
  </Layout>;
}

function LoginDialog({ open, onClose, onLogin }) {
  const [username, setUsername] = useState('underwriter');
  const [password, setPassword] = useState('underwriter123');
  const [submitting, setSubmitting] = useState(false);
  const demoUsers = [
    { label: 'Underwriter', username: 'underwriter', password: 'underwriter123' },
    { label: 'Admin', username: 'admin', password: 'admin123' },
    { label: 'Applicant', username: 'applicant', password: 'applicant123' },
  ];
  const submit = () => {
    setSubmitting(true);
    login(username, password)
      .then(response => { setAuthToken(response.token); onLogin({ username: response.username, roles: response.roles }); onClose(); })
      .catch(() => errorNotification('Login failed', 'Check the credentials and that the backend is running.'))
      .finally(() => setSubmitting(false));
  };
  return <Modal title="Sign in to NexCredit" open={open} onCancel={onClose} onOk={submit} okText="Sign in" confirmLoading={submitting}>
    <Input addonBefore={<UserOutlined />} placeholder="Username" value={username} onChange={event => setUsername(event.target.value)} style={{ marginBottom: 12 }} />
    <Input.Password addonBefore={<LockOutlined />} placeholder="Password" value={password} onChange={event => setPassword(event.target.value)} />
    <div className="demo-creds">
      {demoUsers.map(user => <Button key={user.username} size="small" onClick={() => { setUsername(user.username); setPassword(user.password); }}>{user.label}</Button>)}
    </div>
  </Modal>;
}

function App() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [auditLogs, setAuditLogs] = useState([]);
  const [activeNavigation, setActiveNavigation] = useState('Dashboard');
  const [authUser, setAuthUser] = useState(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [apiStatus, setApiStatus] = useState('checking');
  useEffect(() => {
    getHealth()
      .then(health => setApiStatus(health.status === 'UP' ? 'live' : 'offline'))
      .catch(() => setApiStatus('offline'));
  }, []);
  useEffect(() => {
    login('underwriter', 'underwriter123')
      .then(response => { setAuthToken(response.token); setAuthUser({ username: response.username, roles: response.roles }); })
      .catch(() => setAuthUser(null));
  }, []);
  const loadApplications = () => {
    setLoading(true);
    return getCreditApplications().then(response => response.json()).then(setApplications)
      .catch(() => errorNotification('Applications unavailable', 'Start the backend to load saved applications.'))
      .finally(() => setLoading(false));
  };
  useEffect(() => { loadApplications(); }, []);
  const loadAuditLogs = () => getAuditLogs().then(response => response.json()).then(setAuditLogs).catch(() => setAuditLogs([]));
  useEffect(() => { loadAuditLogs(); }, []);
  const approved = applications.filter(app => app.creditDecision === 'APPROVED').length;
  const pending = applications.filter(app => app.reviewStatus === 'PENDING_REVIEW').length;
  const completeReview = (application, decision) => reviewCreditApplication(application.id, decision, `Reviewer finalised ${decision.toLowerCase()} in the NexCredit workbench.`)
    .then(() => { loadApplications(); loadAuditLogs(); })
    .catch(() => errorNotification('Review could not be saved', 'Confirm that the backend is running and try again.'));
  const startApplication = () => { setWorkspaceOpen(true); setDrawerOpen(true); };
  const navigateTo = (label, sectionId) => {
    setActiveNavigation(label);
    if (sectionId) document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  if (!workspaceOpen) return <><LandingPage onOpenWorkbench={() => setWorkspaceOpen(true)} onStartApplication={startApplication} /><CreditApplicationForm open={drawerOpen} onClose={() => setDrawerOpen(false)} onCreated={loadApplications} /><LoginDialog open={loginOpen} onClose={() => setLoginOpen(false)} onLogin={setAuthUser} /></>;
  return <Layout className="app-shell">
    <Header className="topbar workspace-topbar"><div className="workspace-brand"><Button type="text" className="brand brand-home" onClick={() => { setWorkspaceOpen(false); setActiveNavigation('Dashboard'); }}><SafetyCertificateOutlined /> NexCredit <span>AI</span></Button><span className="product-context">UNDERWRITING</span></div><nav className="workspace-tabs" aria-label="Workbench navigation"><Button type="text" className={activeNavigation === 'Dashboard' ? 'active' : ''} icon={<AppstoreOutlined />} onClick={() => navigateTo('Dashboard', 'dashboard-overview')}>Dashboard</Button><Button type="text" className={activeNavigation === 'Applications' ? 'active' : ''} icon={<FileSearchOutlined />} onClick={() => navigateTo('Applications', 'applications')}>Applications</Button><Button type="text" className={activeNavigation === 'Review queue' ? 'active' : ''} icon={<SafetyCertificateOutlined />} onClick={() => navigateTo('Review queue', 'review-queue')}>Review queue {pending > 0 && <b>{pending}</b>}</Button><Button type="text" className={activeNavigation === 'Audit trail' ? 'active' : ''} icon={<AuditOutlined />} onClick={() => navigateTo('Audit trail', 'audit-log')}>Audit trail</Button></nav><div className="workspace-controls"><span className={`service-status ${apiStatus}`}><i /> API {apiStatus}</span><Button className="new-app-button" icon={<PlusOutlined />} onClick={() => setDrawerOpen(true)}>New application</Button>{authUser ? <Button icon={<UserOutlined />} onClick={() => setLoginOpen(true)}>{authUser.username} <Tag color="blue">{authUser.roles?.[0] || 'USER'}</Tag></Button> : <Button icon={<UserOutlined />} onClick={() => setLoginOpen(true)}>Sign in</Button>}</div></Header>
    <Content className="content-wrap">
      <section className="dashboard-hero" id="dashboard-overview"><div><span className="eyebrow">UNDERWRITING OPERATIONS · LIVE WORKBENCH</span><Title level={1}>Good morning, analyst.</Title><Text>Review alternative signals, route uncertainty, and keep every decision accountable.</Text></div><div className="hero-status"><span>Portfolio health</span><strong>{approved} approvals</strong><small><i /> Decision engine online</small></div></section>
      <Alert className="responsible-ai" message="Responsible AI guardrail active" description="Low-confidence or policy-sensitive cases are routed to a human reviewer before any final action." type="info" showIcon />
      <section className="workbench-grid"><Card id="applications" className="portfolio-card" title="Application portfolio" extra={<Button onClick={loadApplications}>Refresh</Button>}>{loading ? <div className="loading"><Spin /></div> : applications.length ? <Table dataSource={applications} columns={columns} rowKey={app => app.id} pagination={{ pageSize: 5 }} /> : <Empty description="No applications yet. Create one to run an underwriting decision." />}</Card><Card className="trace-card" title={<><ThunderboltOutlined /> Decision trace</>} extra={<Tag color="blue">LIVE</Tag>}><p>Every submitted application moves through a controlled, explainable sequence.</p>{['Signal intake', 'Creditworthiness', 'Fraud screen', 'Decision policy', 'Audit record'].map((stage, index) => <div className="trace-step" key={stage}><b>0{index + 1}</b><span>{stage}<small>{index === 4 ? 'Linked evidence record' : 'Ready for next case'}</small></span><i /></div>)}</Card><Card className="pulse-card" title="Underwriting pulse"><div className="pulse-number">{applications.length}</div><p>applications in the active portfolio</p><div className="pulse-line"><span style={{ width: `${applications.length ? Math.round(approved / applications.length * 100) : 0}%` }} /></div><div className="pulse-detail"><span>Auto-approved <strong>{approved}</strong></span><span>Needs review <strong>{pending}</strong></span></div></Card></section>
      <ImpactMetrics applications={applications} />
      <TraditionalComparison />
      <EvidenceSearchPanel />
      <Row gutter={[16,16]} className="operations-row"><Col xs={24} lg={12}><Card id="review-queue" title="Human review queue" extra={<Tag color="gold">{pending} pending</Tag>}>{applications.filter(app => app.reviewStatus === 'PENDING_REVIEW').length ? applications.filter(app => app.reviewStatus === 'PENDING_REVIEW').map(app => <div className="queue-item" key={app.id}><strong>{app.applicantName}</strong><span>{app.confidenceScore}% confidence · {app.fraudRisk} risk</span><div className="review-actions"><Button size="small" onClick={() => completeReview(app, 'APPROVED')}>Approve</Button><Button danger size="small" onClick={() => completeReview(app, 'REJECTED')}>Reject</Button></div></div>) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No cases awaiting review" />}</Card></Col><Col xs={24} lg={12}><Card id="audit-log" title="Decision audit trail" extra={<Button size="small" onClick={loadAuditLogs}>Refresh</Button>}>{auditLogs.length ? auditLogs.slice(0,5).map(log => <div className="queue-item" key={log.id}><strong>Application #{log.applicationId || 'legacy'}</strong><span>{log.decision} · {log.reasoning}</span><Tag>Audited</Tag></div>) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No audit entries loaded" />}</Card></Col></Row>
    </Content>
    <Footer className="footer">NexCredit AI · Synchrony Hackathon 2026</Footer>
    <CreditApplicationForm open={drawerOpen} onClose={() => setDrawerOpen(false)} onCreated={loadApplications} />
  </Layout>;
}
export default App;
