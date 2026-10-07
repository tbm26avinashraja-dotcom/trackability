import StatusBadge from './StatusBadge';
import ActivityLog from './ActivityLog';
import NotificationPanel from './NotificationPanel';
import { money,prettyDate } from '../logic';
export default function CycleDetail({cycle,onBack,onEvidence,asOf}){
 return <div className="detail-page">
  <button className="back" onClick={onBack}>← Back to Control Tower</button>
  <section className="detail-hero"><div><p className="eyebrow">{cycle.id}</p><h1>{cycle.client}</h1><p>{cycle.site} · {cycle.service} · September 2026</p></div><div className="hero-status"><StatusBadge status={cycle.status}/><strong>{money(cycle.affected)}</strong><span>affected exposure</span></div></section>
  <section className="detail-grid">
   <div className="panel"><p className="eyebrow">CURRENT ISSUE</p><h2>{cycle.primary?.label||'Cycle complete'}</h2><p className="reason">{cycle.reason}</p><div className="facts"><div><span>Capital state</span><strong>{cycle.capitalState}</strong></div><div><span>Operating owner</span><strong>{cycle.owner}</strong></div><div><span>Target source</span><strong>{cycle.targetSource}</strong></div><div><span>Gross cycle value</span><strong>{money(cycle.value)}</strong></div></div></div>
   <div className="panel action-card"><p className="eyebrow">NEXT ACTION</p><h2>{cycle.actionLabel}</h2><p>{cycle.action.text}</p>{cycle.management&&<div className="management-note"><strong>Management flag</strong><span>{cycle.managementAsk}</span></div>}</div>
  </section>
  <section className="panel"><div className="section-head"><div><p className="eyebrow">CYCLE TIMELINE</p><h2>Where time was gained or lost</h2></div><span>Targets: {cycle.targetSource}</span></div><div className="timeline">{cycle.details.map((d,i)=><div className={`milestone ${d.event===cycle.primary?.event?'current':''}`} key={d.event}><div className="dot">{d.actual?'✓':i+1}</div><div className="mile-body"><div className="mile-title"><strong>{d.label}</strong><StatusBadge status={d.state}/></div><div className="mile-meta"><span>Target {prettyDate(d.target)}</span><span>Actual {prettyDate(d.actual)}</span><span>{d.timing}</span></div>{d.actual&&<button className="evidence-link" onClick={()=>onEvidence(d.event)}>View evidence</button>}</div></div>)}</div></section>
  <NotificationPanel cycle={cycle} asOf={asOf}/>
  <ActivityLog cycle={cycle} asOf={asOf}/>
 </div>;
}
