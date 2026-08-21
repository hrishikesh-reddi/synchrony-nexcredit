import { CheckCircleFilled, LoadingOutlined } from '@ant-design/icons';
import { Progress, Tag } from 'antd';

const stages = [
  ['Creditworthiness Agent', 'Evaluating alternative-data strength'],
  ['Fraud Detection Agent', 'Screening behavioral risk signals'],
  ['Decision Engine', 'Balancing risk, confidence, and policy'],
  ['Explanation Agent', 'Preparing an auditable rationale'],
  ['Audit Agent', 'Writing the decision trail'],
];

function AgentPipeline({ activeStep = -1, complete = false, decision }) {
  if (activeStep < 0 && !complete) return null;
  return <section className="agent-pipeline" aria-label="Specialised underwriting pipeline">
    <div className="section-kicker">LIVE PROTOTYPE TRACE</div>
    <h3>Specialised decision pipeline</h3>
    <p>Each stage is visible in the demo; the final decision is produced by the rules service.</p>
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
