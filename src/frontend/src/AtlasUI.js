import { useEffect, useRef, useState } from 'react';

/* ---------- Sparkline ---------- */
export function Sparkline({ data = [], color = '#1f6feb', width = 96, height = 34 }) {
  const nums = (data || []).map(Number).filter(n => !Number.isNaN(n));
  if (!nums.length) return null;
  const max = Math.max(...nums), min = Math.min(...nums);
  const span = (max - min) || 1;
  const coords = nums.map((v, i) => {
    const x = 2 + (i / (nums.length - 1)) * (width - 4);
    const y = (height - 3) - ((v - min) / span) * (height - 8);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const area = `2,${height - 2} ${coords.join(' ')} ${width - 2},${height - 2}`;
  return <svg className="nx-kpi-spark" width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
    <polygon points={area} fill={color} opacity="0.10" />
    <polyline points={coords.join(' ')} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
  </svg>;
}

/* ---------- Donut ---------- */
export function Donut({ segments = [], size = 132, thickness = 16 }) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return <div className="nx-donut-wrap">
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#eef2f6" strokeWidth={thickness} />
      {segments.map(seg => {
        const len = (seg.value / total) * c;
        const el = <circle key={seg.label} cx={size / 2} cy={size / 2} r={r} fill="none" stroke={seg.color} strokeWidth={thickness}
          strokeDasharray={`${len} ${c - len}`} strokeDashoffset={-offset} transform={`rotate(-90 ${size / 2} ${size / 2})`} strokeLinecap="round" />;
        offset += len;
        return el;
      })}
      <text x="50%" y="46%" textAnchor="middle" dominantBaseline="middle" style={{ fill: '#0c1f33', fontSize: 22, fontWeight: 700 }}>{total}</text>
      <text x="50%" y="62%" textAnchor="middle" style={{ fill: '#8a97a6', fontSize: 10, fontWeight: 600, letterSpacing: '.04em' }}>TOTAL</text>
    </svg>
    <div className="nx-donut-legend">
      {segments.map(seg => <div className="nx-legend-row" key={seg.label}><span className="nx-swatch" style={{ background: seg.color }} />{seg.label}<b>{seg.value}</b></div>)}
    </div>
  </div>;
}

/* ---------- KPI card ---------- */
export function KpiCard({ label, value, delta, deltaType = 'flat', spark, tag }) {
  return <article className="nx-kpi">
    {tag && <span className="nx-kpi-tag">{tag}</span>}
    <span className="nx-kpi-label">{label}</span>
    <strong className="nx-kpi-value">{value}</strong>
    {delta && <span className={`nx-kpi-delta ${deltaType}`}>{delta}</span>}
    {spark && <Sparkline data={spark} color={deltaType === 'down' ? '#e5484d' : '#1f6feb'} />}
  </article>;
}

/* ---------- Filter chips ---------- */
export function FilterChips({ options, value, onChange }) {
  return <div className="nx-chips">
    {options.map(o => <button key={o.value} className={`nx-chip ${value === o.value ? 'active' : ''}`} onClick={() => onChange(o.value)}>{o.label}</button>)}
  </div>;
}

/* ---------- Live decision stream (mocked, feels alive) ---------- */
const SAMPLE = [
  { name: 'Aarav Mehta', sub: 'GIG_WORKER · ₹2.4L', decision: 'APPROVED', when: 'just now' },
  { name: 'Kavya Nair', sub: 'STUDENT · ₹1.1L', decision: 'REVIEW', when: 'just now' },
  { name: 'Rohan Das', sub: 'SALARIED · ₹6.0L', decision: 'APPROVED', when: 'just now' },
  { name: 'Ishita Roy', sub: 'SELF_EMPLOYED · ₹3.2L', decision: 'REJECTED', when: 'just now' },
];
const COLORS = { APPROVED: '#0f9d6b', REVIEW: '#c98a14', REJECTED: '#e5484d' };
export function LiveStream({ seed = [] }) {
  const [items, setItems] = useState(seed.length ? seed : SAMPLE);
  const idx = useRef(0);
  useEffect(() => {
    const t = setInterval(() => {
      const base = SAMPLE[idx.current % SAMPLE.length];
      idx.current += 1;
      setItems(prev => [{ ...base, when: 'just now' }, ...prev].slice(0, 6));
    }, 2600);
    return () => clearInterval(t);
  }, []);
  return <div className="nx-stream">
    {items.map((it, i) => <div className="nx-stream-item" key={i}>
      <span className="nx-stream-dot" style={{ background: COLORS[it.decision] }} />
      <div><div className="nx-stream-name">{it.name}</div><div className="nx-stream-sub">{it.sub}</div></div>
      <div style={{ textAlign: 'right' }}>
        <span className={`nx-pill ${it.decision === 'APPROVED' ? 'pos' : it.decision === 'REJECTED' ? 'neg' : 'warn'}`}><i />{it.decision}</span>
        <div className="nx-stream-when">{i === 0 ? 'just now' : `${i * 3}s ago`}</div>
      </div>
    </div>)}
  </div>;
}

/* ---------- Activity feed ---------- */
export function ActivityFeed({ items = [] }) {
  if (!items.length) return <div className="nx-preview-empty">No recent activity yet.</div>;
  return <div className="nx-activity">
    {items.slice(0, 7).map((it, i) => <div className="nx-activity-item" key={i}>
      <span className={`nx-activity-ic ${it.tone || 'ink'}`}>{it.icon}</span>
      <div><div className="nx-activity-main" dangerouslySetInnerHTML={{ __html: it.text }} /><div className="nx-activity-time">{it.time}</div></div>
    </div>)}
  </div>;
}

/* ---------- Proof type grid (evidence) ---------- */
export function ProofTypeGrid({ types, active, onSelect }) {
  return <div className="nx-proof-grid">
    {types.map(t => <button key={t.key} className={`nx-proof ${active === t.key ? 'active' : ''}`} onClick={() => onSelect(t.key)}>
      <span className="nx-proof-ic">{t.icon}</span>
      <span className="nx-proof-title">{t.title}</span>
    </button>)}
  </div>;
}

/* ---------- Trend area chart ---------- */
export function TrendChart({ data = [], height = 150, color = '#1f6feb' }) {
  if (!data.length) return null;
  const W = 1000, H = height, pad = 8;
  const max = Math.max(...data, 1), min = Math.min(...data, 0);
  const span = max - min || 1;
  const x = i => pad + (i / (data.length - 1)) * (W - pad * 2);
  const y = v => H - pad - ((v - min) / span) * (H - pad * 2);
  const line = data.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  const area = `${line} L${x(data.length - 1).toFixed(1)},${H - pad} L${x(0).toFixed(1)},${H - pad} Z`;
  const gid = 'tg' + Math.round(color.charCodeAt(1) + data.length);
  return <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display: 'block' }}>
    <defs><linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor={color} stopOpacity="0.18" />
      <stop offset="100%" stopColor={color} stopOpacity="0" />
    </linearGradient></defs>
    {[0.25, 0.5, 0.75].map(t => <line key={t} x1={pad} x2={W - pad} y1={H * t} y2={H * t} stroke="#eef2f6" strokeWidth="1" />)}
    <path d={area} fill={`url(#${gid})`} />
    <path d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    {data.map((v, i) => i % Math.ceil(data.length / 6) === 0 && <circle key={i} cx={x(i)} cy={y(v)} r="3" fill="#fff" stroke={color} strokeWidth="2" />)}
  </svg>;
}

/* ---------- Review queue ---------- */
export function ReviewQueue({ cases = [], onReview, onOpen }) {
  if (!cases.length) return <div className="nx-preview-empty">No cases awaiting review.</div>;
  return <div className="nx-review">
    {cases.map(app => <div className="nx-review-item" key={app.id} onClick={() => onOpen && onOpen(app)} style={{ cursor: onOpen ? 'pointer' : 'default' }}>
      <div><div className="nx-review-name">{app.applicantName}</div><div className="nx-review-meta">{app.confidenceScore}% confidence · {app.fraudRisk} fraud risk · {app.employmentType?.replaceAll('_', ' ')}</div></div>
      <div className="nx-review-actions" onClick={e => e.stopPropagation()}>
        <button className="nx-chip" style={{ background: '#0f9d6b', color: '#fff' }} onClick={() => onReview(app, 'APPROVED')}>Approve</button>
        <button className="nx-chip" style={{ background: '#e5484d', color: '#fff' }} onClick={() => onReview(app, 'REJECTED')}>Reject</button>
      </div>
    </div>)}
  </div>;
}
