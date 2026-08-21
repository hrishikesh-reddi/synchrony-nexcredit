import { Alert, Collapse, Tag } from 'antd';

const decisionColor = decision => ({ APPROVED: 'success', REJECTED: 'error', PENDING: 'warning' }[decision] || 'default');

function DecisionCard({ decision }) {
  if (!decision) return null;
  const type = decision.creditDecision === 'APPROVED' ? 'success' : decision.creditDecision === 'REJECTED' ? 'error' : 'warning';
  return <Alert className="decision-card" type={type} showIcon
    message={<span>Decision: <Tag color={decisionColor(decision.creditDecision)}>{decision.creditDecision}</Tag> {decision.confidenceScore}% confidence</span>}
    description={<><Collapse size="small" ghost items={[{ key: 'reasoning', label: 'Decision rationale', children: <span>{decision.reasoning}</span> }]} /><strong>Fraud risk:</strong> {decision.fraudRisk}</>} />;
}

export default DecisionCard;
