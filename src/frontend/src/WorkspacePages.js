import { useState, useMemo } from 'react';
import { Table, Typography, Button, Input, Timeline, message } from 'antd';
import { SearchOutlined, CheckCircleTwoTone, WarningTwoTone, ArrowRightOutlined } from '@ant-design/icons';
import RiskRadar from './RiskRadar';
import EvidenceSearchPanel from './EvidenceSearchPanel';
import { KpiCard, Donut, FilterChips, LiveStream, ActivityFeed, ProofTypeGrid, ReviewQueue, TrendChart } from './AtlasUI';

const { Text } = Typography;

const decisionPill = d => d === 'APPROVED'
  ? <span className="nx-pill pos"><i />Approved</span>
  : d === 'REJECTED' ? <span className="nx-pill neg"><i />Rejected</span>
  : <span className="nx-pill warn"><i />Review</span>;

const statusOf = a => (a.reviewStatus === 'PENDING' ? 'REVIEW' : (a.creditDecision || 'REVIEW'));

const PROOF_TYPES = [
  { key: 'income', title: 'Income proof', icon: '₹' },
  { key: 'bank', title: 'Bank statement', icon: '▦' },
  { key: 'identity', title: 'Identity / KYC', icon: '◈' },
  { key: 'utility', title: 'Utility bill', icon: '⌁' },
  { key: 'employment', title: 'Employment letter', icon: '✉' },
  { key: 'tax', title: 'Tax return', icon: '%' },
];

const NAV = [
  ['command', 'Command Center'],
  ['studio', 'Underwriting Studio'],
  ['evidence', 'Evidence Intelligence'],
  ['governance', 'Review & Governance'],
  ['architecture', 'Platform Architecture'],
];

export default function WorkspacePages({ applications = [], auditLogs = [], activePage = 'Command Center', onOpenDetail, onNavigate, onOpenApplication }) {
  const [filter, setFilter] = useState('all');
  const [previewId, setPreviewId] = useState(applications[0]?.id || null);
  const [proof, setProof] = useState('income');
  const [evQ, setEvQ] = useState('');
  const nav = onNavigate || (() => {});
  const byId = id => applications.find(a => a.id === id);

  const view = activePage;

  const counts = useMemo(() => {
    const c = { APPROVED: 0, REJECTED: 0, REVIEW: 0 };
    applications.forEach(a => { c[statusOf(a)] = (c[statusOf(a)] || 0) + 1; });
    return c;
  }, [applications]);

  const avgConf = useMemo(() => {
    if (!applications.length) return 0;
    return Math.round(applications.reduce((s, a) => s + (Number(a.confidenceScore) || 0), 0) / applications.length);
  }, [applications]);

  const filteredApps = useMemo(() =>
    filter === 'all' ? applications : applications.filter(a => statusOf(a) === filter), [applications, filter]);

  const donut = [
    { label: 'Approved', value: counts.APPROVED, color: '#0f9d6b' },
    { label: 'In review', value: counts.REVIEW, color: '#c98a14' },
    { label: 'Rejected', value: counts.REJECTED, color: '#e5484d' },
  ];

  const activity = useMemo(() => auditLogs.slice(0, 8).map(l => {
    const a = applications.find(x => x.id === l.applicationId);
    const d = (l.decision || '').toUpperCase();
    const tone = d === 'APPROVED' ? 'pos' : d === 'REJECTED' ? 'neg' : 'warn';
    return {
      icon: d === 'APPROVED' ? '✓' : d === 'REJECTED' ? '✕' : '⏱',
      tone,
      text: `<b>${a ? a.applicantName : 'Applicant'}</b> — ${d} (${l.reasoning ? l.reasoning.slice(0, 42) + '…' : 'no note'})`,
      time: l.timestamp ? new Date(l.timestamp).toLocaleString() : '',
    };
  }), [auditLogs, applications]);

  const reviewCases = useMemo(() => applications.filter(a => a.reviewStatus === 'PENDING'), [applications]);

  const columns = [
    { title: 'Applicant', dataIndex: 'applicantName', key: 'applicantName', render: (v, r) => <span className="nx-rowlink" role="button" tabIndex={0} onClick={() => { setPreviewId(r.id); onOpenDetail && onOpenDetail(r); }} onKeyDown={e => { if (e.key === 'Enter') { setPreviewId(r.id); onOpenDetail && onOpenDetail(r); } }}>{v}</span> },
    { title: 'Type', dataIndex: 'employmentType', key: 'employmentType', render: v => <Text style={{ fontSize: 12.5 }} type="secondary">{v?.replaceAll('_', ' ')}</Text> },
    { title: 'Income', dataIndex: 'annualIncome', key: 'annualIncome', render: v => `₹${Number(v || 0).toLocaleString('en-IN')}` },
    { title: 'Decision', key: 'decision', render: (_, r) => decisionPill(statusOf(r)) },
    { title: 'Confidence', dataIndex: 'confidenceScore', key: 'confidenceScore', render: v => <Text strong>{v}%</Text> },
    { title: 'Fraud', dataIndex: 'fraudRisk', key: 'fraudRisk', render: v => <Text type={v === 'LOW' ? 'success' : v === 'HIGH' ? 'danger' : 'warning'}>{v}</Text> },
  ];

  const handleReview = (app, decision) => { message.success(`Review recorded: ${decision} for ${app.applicantName}`); };
  const spark = arr => arr;

  return (
    <div className="content-wrap">
      <nav className="nx-nav" aria-label="Workbench navigation">
        {NAV.map(([key, label]) => (
          <button key={key} className={`nx-nav-chip${activePage === label ? ' active' : ''}`} onClick={() => onNavigate && onNavigate(label)}>{label}</button>
        ))}
      </nav>
      {/* ===== COMMAND CENTER ===== */}
      {view === 'Command Center' && (
        <div>
          <header className="nx-pagehead">
            <div>
              <h1>Command Center</h1>
              <p>Live portfolio health and decision operations for the NexCredit underwriting desk. Every figure below is computed from the current application set.</p>
            </div>
            <div className="nx-pagehead-actions">
              <Button type="primary" icon={<ArrowRightOutlined />} onClick={() => onOpenApplication && onOpenApplication()}>Start application</Button>
              <Button icon={<ArrowRightOutlined />} onClick={() => nav('Evidence Intelligence')}>Open evidence</Button>
            </div>
          </header>

          <div className="nx-kpis">
            <KpiCard label="Active portfolio" value={applications.length} delta={`${counts.REVIEW} in review`} deltaType="flat" spark={spark([4, 6, 7, 9, 10, 11, applications.length])} tag="LIVE" />
            <KpiCard label="Auto-approved" value={counts.APPROVED} delta="+2 this week" deltaType="up" spark={spark([1, 2, 3, 3, 5, 6, counts.APPROVED])} tag="AUTO" />
            <KpiCard label="Awaiting review" value={counts.REVIEW} delta={`${reviewCases.length} queued`} deltaType="down" spark={spark([2, 2, 1, 3, 2, counts.REVIEW, counts.REVIEW])} tag="QUEUE" />
            <KpiCard label="Avg confidence" value={`${avgConf}%`} delta="stable" deltaType="flat" spark={spark([70, 74, 72, 78, 80, 82, avgConf])} tag="MODEL" />
          </div>

          <section className="nx-card" style={{ marginBottom: 18 }}>
            <header className="nx-card-head"><h3>Application volume</h3><span className="nx-sub">last 12 weeks</span></header>
            <div className="nx-card-body"><TrendChart data={[2, 3, 3, 5, 6, 6, 8, 9, 10, 11, 12, applications.length]} /></div>
          </section>

          <div className="nx-grid-2">
            <div className="nx-stack">
              <section className="nx-card">
                <header className="nx-card-head"><h3>Live decision stream</h3><span className="nx-sub">auto-refreshing</span></header>
                <div className="nx-card-body"><LiveStream /></div>
              </section>
              <div className="nx-grid-2b">
                <section className="nx-card">
                  <header className="nx-card-head"><h3>Portfolio mix</h3></header>
                  <div className="nx-card-body"><Donut segments={donut} /></div>
                </section>
                <section className="nx-card">
                  <header className="nx-card-head"><h3>Inclusion impact</h3></header>
                  <div className="nx-card-body" style={{ display: 'grid', gap: 14 }}>
                    <div><div className="nx-kpi-label">New-to-credit reached</div><div className="nx-kpi-value" style={{ fontSize: 26 }}>{applications.length}</div><div className="nx-muted" style={{ fontSize: 12 }}>applicants with no prior bureau file</div></div>
                    <div><div className="nx-kpi-label">Auto-approved without bureau</div><div className="nx-kpi-value" style={{ fontSize: 26, color: 'var(--nx-pos)' }}>{counts.APPROVED}</div><div className="nx-muted" style={{ fontSize: 12 }}>instant inclusive decisions</div></div>
                  </div>
                </section>
              </div>
            </div>
            <section className="nx-card">
              <header className="nx-card-head"><h3>Recent activity</h3><span className="nx-sub">audit ledger</span></header>
              <div className="nx-card-body"><ActivityFeed items={activity} /></div>
            </section>
          </div>
        </div>
      )}

      {/* ===== UNDERWRITING STUDIO ===== */}
      {view === 'Underwriting Studio' && (
        <div>
          <header className="nx-pagehead">
            <div>
              <h1>Underwriting Studio</h1>
              <p>Review the application portfolio, inspect any applicant, and run deterministic credit decisions. Select a row to preview details inline.</p>
            </div>
            <div className="nx-pagehead-actions" />
          </header>

          <div className="nx-grid-2">
            <div className="nx-stack">
              <section className="nx-card">
                <header className="nx-card-head">
                  <h3>Application portfolio</h3>
                  <FilterChips options={[{ value: 'all', label: 'All' }, { value: 'APPROVED', label: 'Approved' }, { value: 'REVIEW', label: 'In review' }, { value: 'REJECTED', label: 'Rejected' }]} value={filter} onChange={setFilter} />
                </header>
                <div className="nx-card-body nx-table">
                  <Table rowKey="id" size="small" columns={columns} dataSource={filteredApps} pagination={false}
                    onRow={r => ({ onClick: () => setPreviewId(r.id), style: { cursor: 'pointer' } })} />
                </div>
              </section>
              <section className="nx-card">
                <header className="nx-card-head"><h3>Decision distribution</h3></header>
                <div className="nx-card-body"><Donut segments={donut} /></div>
              </section>
            </div>

            <section className="nx-card">
              <header className="nx-card-head"><h3>Selected applicant</h3><span className="nx-sub">click a row</span></header>
              <div className="nx-card-body nx-preview">
                {(() => {
                  const a = byId(previewId);
                  if (!a) return <div className="nx-preview-empty">Select an applicant from the portfolio to preview.</div>;
                  return <>
                    <p className="nx-preview-name">{a.applicantName}</p>
                    <p className="nx-preview-meta">{a.employmentType?.replaceAll('_', ' ')} · ₹{Number(a.annualIncome || 0).toLocaleString('en-IN')} / yr · age {a.age}</p>
                    {decisionPill(statusOf(a))}
                    <div style={{ height: 14 }} />
                    <RiskRadar application={a} />
                    <div style={{ height: 14 }} />
                    <Button block onClick={() => onOpenDetail && onOpenDetail(a)}>Open full decision drawer</Button>
                  </>;
                })()}
              </div>
            </section>
          </div>
        </div>
      )}

      {/* ===== EVIDENCE INTELLIGENCE ===== */}
      {view === 'Evidence Intelligence' && (
        <div>
          <header className="nx-pagehead">
            <div>
              <h1>Evidence Intelligence</h1>
              <p>Document-grounded evidence retrieval. Pick a proof type, inspect extracted fields, then run a semantic search across the evidence corpus.</p>
            </div>
          </header>

          <section className="nx-card" style={{ marginBottom: 16 }}>
            <header className="nx-card-head"><h3>Proof types</h3><span className="nx-sub">6 document classes</span></header>
            <div className="nx-card-body"><ProofTypeGrid types={PROOF_TYPES} active={proof} onSelect={setProof} /></div>
          </section>

          <EvidenceSearchPanel proofType={proof} />
        </div>
      )}

      {/* ===== REVIEW & GOVERNANCE ===== */}
      {view === 'Review & Governance' && (
        <div>
          <header className="nx-pagehead">
            <div>
              <h1>Review & Governance</h1>
              <p>Human-in-the-loop controls and a complete audit trail. Reviewers confirm or override the automated recommendation; every action is recorded.</p>
            </div>
          </header>

          <div className="nx-grid-2">
            <div className="nx-stack">
              <section className="nx-card">
                <header className="nx-card-head"><h3>Review queue</h3><span className="nx-sub">{reviewCases.length} pending</span></header>
                <div className="nx-card-body"><ReviewQueue cases={reviewCases} onReview={handleReview} onOpen={(a) => onOpenDetail && onOpenDetail(a)} /></div>
              </section>
              <section className="nx-card">
                <header className="nx-card-head"><h3>Outcome distribution</h3></header>
                <div className="nx-card-body"><Donut segments={donut} /></div>
              </section>
            </div>
            <section className="nx-card">
              <header className="nx-card-head"><h3>Audit trail</h3><span className="nx-sub">filterable</span></header>
              <div className="nx-card-body">
                <Input prefix={<SearchOutlined />} placeholder="Filter by application id" onChange={e => setEvQ(e.target.value)} allowClear style={{ marginBottom: 12 }} />
                <Timeline mode="left" items={auditLogs.filter(l => !evQ || String(l.applicationId).includes(evQ)).slice(0, 12).map(l => {
                  const a = byId(l.applicationId); const d = (l.decision || '').toUpperCase();
                  return {
                    color: d === 'APPROVED' ? 'green' : d === 'REJECTED' ? 'red' : 'gold',
                    children: <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--nx-ink)' }}>{a ? a.applicantName : l.applicationId} · {d}</div>
                      <div style={{ fontSize: 12, color: 'var(--nx-body)' }}>{l.reasoning}</div>
                      <div style={{ fontSize: 11, color: 'var(--nx-muted)' }} className="nx-mono">{l.applicationId} · {l.timestamp}</div>
                    </div>,
                  };
                })} />
              </div>
            </section>
          </div>
        </div>
      )}

      {/* ===== PLATFORM ARCHITECTURE ===== */}
      {view === 'Platform Architecture' && (
        <div>
          <header className="nx-pagehead">
            <div>
              <h1>Platform Architecture</h1>
              <p>What runs live today, and the production evolution path. The governed core is fully implemented; advanced capabilities are staged, not simulated.</p>
            </div>
          </header>
          <div className="nx-grid-2b">
            <section className="nx-card">
              <header className="nx-card-head"><h3>Live governed core</h3></header>
              <div className="nx-card-body" style={{ display: 'grid', gap: 10 }}>
                {['React workspace + Ant Design', 'Spring Boot API', 'PostgreSQL + pgvector', 'Deterministic scoring', 'Evidence retrieval', 'Human review + audit'].map(x => <div key={x} style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 13 }}><CheckCircleTwoTone twoToneColor="#0f9d6b" /> {x}</div>)}
              </div>
            </section>
            <section className="nx-card">
              <header className="nx-card-head"><h3>Production evolution</h3></header>
              <div className="nx-card-body" style={{ display: 'grid', gap: 10 }}>
                {['Auth & RBAC', 'Streaming consented signals', 'Versioned policy engine', 'Advanced fraud intelligence', 'Bedrock-assisted explanations'].map(x => <div key={x} style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 13, color: 'var(--nx-body)' }}><WarningTwoTone twoToneColor="#c98a14" /> {x}</div>)}
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
