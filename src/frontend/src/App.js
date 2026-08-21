import { useEffect, useState } from 'react';
import { Button, Layout, Typography } from 'antd';
import { ArrowRightOutlined, CheckCircleFilled, FileSearchOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { getAuditLogs, getCreditApplications, login, reviewCreditApplication, setAuthToken } from './Client';
import { FALLBACK_APPLICATIONS, FALLBACK_AUDIT_LOGS } from './seedData';
import { errorNotification } from './Notification';
import CreditApplicationForm from './CreditApplicationForm';
import WorkspacePages from './WorkspacePages';
import ApplicationDetail from './ApplicationDetail';
import CommandPalette from './CommandPalette';
import './App.css';
import './nexcredit-ui.css';

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

function LandingPage({ onOpenWorkbench, onStartApplication }) {
  return <Layout className="app-shell landing-shell">
    <Header className="topbar"><div className="brand"><SafetyCertificateOutlined /> NexCredit <span>AI</span></div><nav className="command-nav landing-nav"><Button type="text">Overview</Button><Button type="text" onClick={onOpenWorkbench}>Live workbench</Button></nav><Button className="new-app-button" onClick={onStartApplication}>Start an application <ArrowRightOutlined /></Button></Header>
    <Content className="landing-wrap">
      <section className="nx-hero">
        <div className="nx-hero-copy">
          <span className="nx-eyebrow">SYNCHRONY HACKATHON · PROBLEM STATEMENT 3</span>
          <h1>Credit decisions<br />with <em>context.</em></h1>
          <p>NexCredit helps New-to-Credit and thin-file applicants get a fairer path forward. It combines consented alternative-data signals, a transparent underwriting policy, and accountable human review instead of a missing-score rejection.</p>
          <div className="nx-hero-actions">
            <Button className="nx-btn-primary" size="large" onClick={onOpenWorkbench}>Open live workbench <ArrowRightOutlined /></Button>
            <Button size="large" onClick={onStartApplication}>Run a sample application</Button>
          </div>
          <div className="nx-hero-trust"><CheckCircleFilled /> Explainable · <CheckCircleFilled /> Human review · <CheckCircleFilled /> Audit-ready</div>
        </div>
        <aside className="nx-hero-card">
          <div className="nx-card">
            <header className="nx-card-head"><h3>Sample decision</h3><span className="nx-sub">New-to-Credit profile</span></header>
            <div className="nx-card-body">
              <div className="nx-preview-name">Aarav Mehta</div>
              <div className="nx-preview-meta">Gig worker · ₹2.4L / yr</div>
              <span className="nx-pill warn"><i />Routed to review</span>
              <div style={{ height: 14 }} />
              <div className="nx-sample-signals">
                {[['Mobile', 72], ['Transactions', 64], ['Social', 58]].map(([l, v]) => <div key={l} className="nx-sample-signal"><span>{l}</span><div className="nx-meter"><i style={{ width: v + '%' }} /></div><b>{v}</b></div>)}
              </div>
              <div style={{ height: 10 }} />
              <Text type="secondary" style={{ fontSize: 12 }}>Confidence 92% · fraud risk LOW</Text>
            </div>
          </div>
        </aside>
      </section>

      <section className="nx-problem">
        <div><span className="nx-eyebrow">THE PROBLEM</span><h2>Thin-file applicants deserve more than a missing-score rejection.</h2></div>
        <p>Traditional bureau models often have no data on young earners, gig workers, and first-time applicants. NexCredit makes the decision path visible, uses consented prototype signals, and refers uncertain cases to a human underwriter rather than guessing.</p>
      </section>

      <section className="nx-cap-grid">
        <article className="nx-card"><h3>Contextual underwriting</h3><p>Combine income, behaviour, and alternative data into one understandable decision profile.</p></article>
        <article className="nx-card"><h3>Responsible by design</h3><p>Bias guardrails, confidence thresholds, reviewer escalation, and explicit reasoning.</p></article>
        <article className="nx-card"><h3>Evidence at every step</h3><p>Decision traces and audit history make each workflow event inspectable.</p></article>
      </section>

      <section className="nx-step-flow-wrap">
        <span className="nx-eyebrow">HOW IT WORKS</span>
        <h2>From signal to accountable action.</h2>
        <div className="nx-step-flow">
          {[['1', 'Consent-led intake', 'The application captures income, employment type, and three alternative-data indicators.'],
            ['2', 'Decisioning API', 'Spring Boot applies a transparent underwriting policy to return a decision, confidence, and fraud label.'],
            ['3', 'Guardrails & review', 'Low-confidence or high-risk outcomes route to a reviewer, not a false certainty.'],
            ['4', 'Evidence & accountability', 'PostgreSQL keeps the application and its decision history for audit.']].map(([n, t, d]) => <div className="nx-step" key={n}><span className="nx-step-n">{n}</span><h4>{t}</h4><p>{d}</p></div>)}
        </div>
      </section>

      <section className="nx-cta-band">
        <div><h2>See the full underwriting workflow.</h2><p>Open the portfolio, review a case, and watch the audit trail update.</p></div>
        <Button size="large" onClick={onOpenWorkbench}>Explore NexCredit <ArrowRightOutlined /></Button>
      </section>
    </Content>
    <Footer className="footer">NexCredit AI · Synchrony Hackathon 2026</Footer>
  </Layout>;
}

function App() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [auditLogs, setAuditLogs] = useState([]);
  const [activeNavigation, setActiveNavigation] = useState('Command Center');
  const [detailApp, setDetailApp] = useState(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  useEffect(() => {
    const onKey = event => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setPaletteOpen(open => !open);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  useEffect(() => {
    login('underwriter', 'underwriter123')
      .then(response => setAuthToken(response.token))
      .catch(() => {});
  }, []);
  const loadApplications = () => {
    setLoading(true);
    return getCreditApplications().then(response => response.json()).then(setApplications)
      .catch(() => { setApplications(FALLBACK_APPLICATIONS); })
      .finally(() => setLoading(false));
  };
  useEffect(() => { loadApplications(); }, []);
  const loadAuditLogs = () => getAuditLogs().then(response => response.json()).then(setAuditLogs).catch(() => setAuditLogs(FALLBACK_AUDIT_LOGS));
  useEffect(() => { loadAuditLogs(); }, []);
  const approved = applications.filter(app => app.creditDecision === 'APPROVED').length;
  const pending = applications.filter(app => app.reviewStatus === 'PENDING_REVIEW').length;
  const completeReview = (application, decision) => reviewCreditApplication(application.id, decision, `Reviewer finalised ${decision.toLowerCase()} in the NexCredit workbench.`)
    .then(() => { loadApplications(); loadAuditLogs(); })
    .catch(() => errorNotification('Review could not be saved', 'Confirm that the backend is running and try again.'));
  const startApplication = () => { setWorkspaceOpen(true); setDrawerOpen(true); };
  const navigateTo = label => {
    setActiveNavigation(label);
  };
  if (!workspaceOpen) return <><LandingPage onOpenWorkbench={() => setWorkspaceOpen(true)} onStartApplication={startApplication} /><CreditApplicationForm open={drawerOpen} onClose={() => setDrawerOpen(false)} onCreated={loadApplications} /></>;
  return <Layout className="app-shell">
    <Header className="topbar workspace-topbar"><div className="workspace-brand"><Button type="text" className="brand brand-home" onClick={() => { setWorkspaceOpen(false); setActiveNavigation('Command Center'); }}><SafetyCertificateOutlined /> NexCredit <span>AI</span></Button><span className="product-context">CREDIT OPERATIONS</span></div><div className="workspace-controls"><Button className="command-search" onClick={() => setPaletteOpen(true)}><FileSearchOutlined /> Search <kbd>⌘K</kbd></Button></div></Header>
    <Content className="content-wrap">
      <WorkspacePages activePage={activeNavigation} applications={applications} auditLogs={auditLogs} loading={loading} approved={approved} pending={pending} onOpenApplication={() => setDrawerOpen(true)} onOpenDetail={setDetailApp} onRefresh={loadApplications} onRefreshAudit={loadAuditLogs} onReview={completeReview} onNavigate={navigateTo} />
    </Content>
    <Footer className="footer">NexCredit AI · Synchrony Hackathon 2026</Footer>
    <CreditApplicationForm open={drawerOpen} onClose={() => setDrawerOpen(false)} onCreated={loadApplications} />
    <ApplicationDetail application={detailApp} auditLogs={auditLogs} onClose={() => setDetailApp(null)} />
    <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} applications={applications} onNavigate={label => { setActiveNavigation(label); }} onOpenDetail={app => setDetailApp(app)} />
  </Layout>;
}
export default App;
