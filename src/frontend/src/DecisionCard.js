import { Alert, Collapse, Progress, Tag, Typography } from 'antd';

const { Text } = Typography;

const decisionColor = decision => ({ APPROVED: 'success', REJECTED: 'error', PENDING: 'warning' }[decision] || 'default');
const prettyName = key => ({
  mobile: 'Mobile usage',
  transaction: 'Transaction behaviour',
  social: 'Social signal',
  income: 'Income stability',
  age: 'Applicant age',
  employment: 'Employment type',
}[key] || key);

function ModelInsights({ contributions }) {
  if (!contributions) return null;
  const entries = Object.entries(contributions)
    .map(([k, v]) => [k, v])
    .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]));
  if (entries.length === 0) return null;
  const max = Math.max(...entries.map(([, v]) => Math.abs(v)), 0.0001);
  return (
    <Collapse size="small" ghost items={[{
      key: 'ml',
      label: 'Model insights (feature attribution)',
      children: (
        <div>
          {entries.map(([k, v]) => {
            const pct = Math.round((Math.abs(v) / max) * 100);
            const positive = v >= 0;
            return (
              <div key={k} style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{prettyName(k)}</span>
                  <span>{positive ? 'supports approval' : 'against approval'}</span>
                </div>
                <Progress percent={pct} showInfo={false}
                  strokeColor={positive ? '#52c41a' : '#ff4d4f'} />
              </div>
            );
          })}
        </div>
      ),
    }]} />
  );
}

function DecisionCard({ decision }) {
  if (!decision) return null;
  const type = decision.creditDecision === 'APPROVED' ? 'success' : decision.creditDecision === 'REJECTED' ? 'error' : 'warning';
  return (
    <Alert className="decision-card" type={type} showIcon
      message={<span>Decision: <Tag color={decisionColor(decision.creditDecision)}>{decision.creditDecision}</Tag> {decision.confidenceScore}% confidence
        {decision.mlPowered && <Tag color="geekblue" style={{ marginLeft: 8 }}>ML scored</Tag>}
        {decision.fraudRisk && <Tag color={decision.fraudRisk === 'HIGH' ? 'red' : decision.fraudRisk === 'LOW' ? 'green' : 'gold'} style={{ marginLeft: 8 }}>Fraud: {decision.fraudRisk}</Tag>}
        {decision.modelVersion && <Text type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>model v{decision.modelVersion}</Text>}</span>}
      description={<>
        <Collapse size="small" ghost items={[{ key: 'reasoning', label: 'Decision rationale', children: <span>{decision.reasoning}</span> }]} />
        <ModelInsights contributions={decision.modelContributions} />
        <strong>Fraud risk:</strong> {decision.fraudRisk}
      </>} />
  );
}

export default DecisionCard;
