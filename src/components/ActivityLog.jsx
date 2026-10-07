import { automaticNotifications,buildActivity } from '../logic';
export default function ActivityLog({cycle,asOf}){
 const notifications=automaticNotifications(cycle,asOf);
 const items=buildActivity(cycle,notifications);
 return <section className="panel"><div className="section-head"><div><p className="eyebrow">APPEND-ONLY ACTIVITY LOG</p><h2>Events, evidence and tracker actions</h2></div><span>{items.length} records</span></div>
 <div className="activity-log">{items.map((x,i)=><div className="activity-row" key={`${x.time}-${i}`}><div className={`activity-icon ${x.type}`}>{x.type==='notification'?'↗':x.type==='action'?'→':'✓'}</div><div><strong>{x.title}</strong><small>{x.detail}</small></div><div><strong>{x.time}</strong><small>{x.status}</small></div></div>)}</div></section>;
}
