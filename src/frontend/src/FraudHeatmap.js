import { Progress, Tag } from 'antd';

function FraudHeatmap({ application }) {
  const risk = application?.fraudRisk || 'MEDIUM';
  const values = risk === 'HIGH' ? [76, 58, 44, 81] : risk === 'LOW' ? [15, 5, 0, 25] : [38, 21, 16, 48];
  const labels = ['Transaction velocity anomaly', 'Geographic inconsistency', 'Device fingerprint mismatch', 'Behavioral pattern deviation'];
  return <section className="fraud-heatmap"><div className="heatmap-heading"><div><span className="section-kicker">FRAUD SIGNAL VIEW</span><h3>Risk signal heatmap</h3></div><Tag color={risk === 'HIGH' ? 'red' : risk === 'LOW' ? 'green' : 'gold'}>{risk} RISK</Tag></div><p>Prototype risk indicators, derived for visual review not live device intelligence.</p>{labels.map((label, index) => <div className="heat-row" key={label}><span>{label}</span><Progress percent={values[index]} strokeColor={values[index] > 60 ? '#ff4d4f' : values[index] > 30 ? '#faad14' : '#52c41a'} /><strong>{values[index]}%</strong></div>)}</section>;
}
export default FraudHeatmap;
