import { CheckCircleFilled, LoadingOutlined } from '@ant-design/icons';
import { Progress, Tag } from 'antd';

const stages = [
  ['Creditworthiness stage', 'Evaluating alternative-data strength'],
  ['Fraud screening stage', 'Screening behavioral risk signals'],
  ['Decision engine', 'Balancing risk, confidence, and policy'],
  ['Explanation stage', 'Preparing an auditable rationale'],
  ['Audit stage', 'Writing the decision trail'],
];

function AgentPipeline({ activeStep = -1, complete = false, decision }) {
  if (activeStep < 0 && !complete) return null;
  return <section className="agent-pipeline" aria-label="Underwriting decision pipeline">
    <div className="section-kicker">DETERMINISTIC TRACE</div>
    <h3>Underwriting decision pipeline</h3>
    <p>Each stage is visible and reproducible; the final decision is produced by the transparent rules service, not an autonomous agent.</p>
    {stages.map(([title, description], index) => {
      const done = complete || index < activeStep;
      const running = !complete && index === activeStep;
      return <div className={`pipeline-step ${done ? 'done' : ''} ${running ? 'running' : ''}`} key={title}>
        <span className="pipeline-icon">{done ? <CheckCircleFilled /> : running ? <LoadingOutlined spin /> : index + 1}</span>
        <div><strong>{title}</strong><small>{running ? `${description}…` : done ? 'Complete' : 'Waiting'}</small></div>
        {done && index === 1 && <Tag color={decision?.fraudRisk === 'HIGH' ? 'red' : 'green'}>{decision?.fraudRisk || 'RISK'} risk</Tag>}
        <Progress percent={done ? 100 : running ? 62 : 0} showInfo={false} strokeColor={done ? '#52c41a' : '#2f7de1'} />
      </div>;
    })}
  </section>;
}

export default AgentPipeline;
