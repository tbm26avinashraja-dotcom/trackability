import { automaticNotifications,escalationStage,prettyDate } from '../logic';

export default function NotificationPanel({cycle,asOf}){
 const stage=escalationStage(cycle,asOf);
 const history=automaticNotifications(cycle,asOf).sort((a,b)=>b.time.localeCompare(a.time));
 return <section className="panel notification-panel">
  <div className="section-head"><div><p className="eyebrow">ALERTS & ESCALATION</p><h2>Automatically generated from time and status</h2></div><span>Simulation only · no messages sent</span></div>
  {stage?<div className="alert-preview">
   <div><span className="alert-kicker">{stage.label}</span><h3>{cycle.primary?.label} · {cycle.client}</h3><p><strong>{cycle.reason}</strong></p><p>{cycle.action.text}</p></div>
   <div className="alert-meta"><span>Recipients</span><strong>{stage.recipients.join(' + ')}</strong><span>Channel</span><strong>Google Chat</strong></div>
   <div className="auto-trigger-note"><strong>Auto-triggered</strong><span>Changing the As of date advances the simulated Day 1 / Day 3 / Day 5 escalation ladder.</span></div>
  </div>:<div className="empty left">No breach-triggered notification is due as of {prettyDate(asOf)}.</div>}
  {history.length>0&&<div className="notification-history"><h3>Automatically generated alert history</h3>{history.map(n=><div className="notification-row" key={n.id}><div><strong>{n.title}</strong><small>{n.recipients.join(' · ')}</small></div><div><strong>{n.time}</strong><small>{n.status}</small></div></div>)}</div>}
 </section>;
}
