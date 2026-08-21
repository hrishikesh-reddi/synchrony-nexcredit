import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';

function TraditionalComparison({ decision, application }) {
  if (!decision || !application) return <section className="comparison-card preview-comparison"><h3>Traditional vs NexCredit AI</h3><p>Submit an application to compare a conventional-only decision path with alternative data.</p></section>;
  const isNtc = ['GIG_WORKER', 'STUDENT', 'SELF_EMPLOYED'].includes(application.employmentType);
  return <section className="comparison-card">
    <div className="section-kicker">DECISION CONTEXT</div><h3>Traditional vs NexCredit AI</h3>
    <div className="comparison-grid"><div className="traditional"><span>Traditional model</span><strong><CloseCircleFilled /> {isNtc ? 'INSUFFICIENT FILE' : 'LIMITED CONTEXT'}</strong><p>Conventional history alone may not surface a complete profile.</p></div><div className="nexcredit"><span>NexCredit AI</span><strong><CheckCircleFilled /> {decision.creditDecision}</strong><p>{decision.reasoning}</p></div></div>
    <small>Illustrative prototype baseline—not a production lending policy or a CIBIL decision.</small>
  </section>;
}
export default TraditionalComparison;
