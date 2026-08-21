import { Drawer, Empty, Tag, Timeline, Typography } from 'antd';
import { FileSearchOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import DecisionCard from './DecisionCard';
import AgentPipeline from './AgentPipeline';
import RiskRadar from './RiskRadar';
import FraudHeatmap from './FraudHeatmap';
import TraditionalComparison from './TraditionalComparison';

const { Paragraph, Text } = Typography;

const tagColor = decision => ({ APPROVED: 'green', REJECTED: 'red', PENDING: 'gold', REVIEW: 'gold' }[decision] || 'default');

const roadmapFeatures = [
  ['Consented real-time signal connectors', 'Live mobile, transaction and employment feeds with explicit opt-in.'],
  ['Guarded LLM reviewer assistance', 'Bedrock-assisted explanations behind a deterministic fallback.'],
  ['Decision provenance & versioned policy', 'Snapshot the exact rule set behind every outcome.'],
  ['Fairness & drift monitoring', 'Continuous evaluation across cohorts and time.'],
];

function FuturePanel() {
  return <section className="future-panel" aria-label="Planned capabilities">
    <div className="future-panel-head"><span className="section-kicker">ROADMAP · PLANNED</span><h3>Where this goes next</h3></div>
    <div className="future-grid">
      {roadmapFeatures.map(([title, detail]) => <article key={title}><Tag color="cyan">Planned</Tag><strong>{title}</strong><p>{detail}</p></article>)}
    </div>
  </section>;
}

export default function ApplicationDetail({ application, auditLogs, onClose }) {
  if (!application) return null;
  const appLogs = (auditLogs || []).filter(log => String(log.applicationId) === String(application.id));
  const decided = Boolean(application.creditDecision);
  return <Drawer
    title={null}
    width={780}
    open={Boolean(application)}
    onClose={onClose}
    destroyOnClose
    className="application-detail"
  >
    <header className="detail-hero">
      <div>
        <span className="section-kicker">APPLICATION #{application.id}</span>
        <h2>{application.applicantName}</h2>
        <p>{application.employmentType?.replaceAll('_', ' ')} · Age {application.age} · ₹{Number(application.annualIncome || 0).toLocaleString('en-IN')} income</p>
      </div>
      <div className="detail-tags">
        {decided
          ? <Tag color={tagColor(application.creditDecision)}>{application.creditDecision}</Tag>
          : <Tag color="default">AWAITING DECISION</Tag>}
        {application.confidenceScore != null && <Tag>{application.confidenceScore}% confidence</Tag>}
        {application.fraudRisk && <Tag color={application.fraudRisk === 'HIGH' ? 'red' : application.fraudRisk === 'LOW' ? 'green' : 'gold'}>{application.fraudRisk} risk</Tag>}
        {application.reviewStatus && <Tag color="blue">{application.reviewStatus.replaceAll('_', ' ')}</Tag>}
      </div>
    </header>

    {decided ? (
      <>
        <DecisionCard decision={application} />
        <AgentPipeline complete decision={application} activeStep={5} />
        <section className="detail-viz">
          <RiskRadar application={application} />
          <FraudHeatmap application={application} />
        </section>
        <TraditionalComparison decision={application} application={application} />
        {application.documentPath && (
          <section className="document-evidence">
            <span>REVIEWER EVIDENCE ON FILE</span>
            <strong><FileSearchOutlined /> Document attached</strong>
            <p>This applicant has an uploaded document. Extraction runs through Apache Tika and is shown as advisory evidence only; it never overrides the policy decision.</p>
          </section>
        )}
      </>
    ) : (
      <Empty description="This application has not been analyzed yet." />
    )}

    <section className="detail-audit">
      <div className="detail-audit-head"><SafetyCertificateOutlined /><div><strong>Audit lineage</strong><p>Decision events linked to this application.</p></div></div>
      {appLogs.length ? (
        <Timeline items={appLogs.map(log => ({
          color: log.decision === 'APPROVED' ? 'green' : log.decision === 'REJECTED' ? 'red' : 'blue',
          children: <div className="audit-event">
            <Tag color={tagColor(log.decision)}>{log.decision}</Tag>
            <Text className="audit-time">{log.timestamp ? new Date(log.timestamp).toLocaleString() : '—'}</Text>
            <Paragraph className="audit-reason">{log.reasoning}</Paragraph>
          </div>,
        }))} />
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No audit events yet" />
      )}
    </section>

    <FuturePanel />
  </Drawer>;
}
