import StatusBadge from './StatusBadge';
import CapitalView from './CapitalView';
import { money } from '../logic';
import UnmatchedEvidence from './UnmatchedEvidence';
import { unmatchedEvidence } from '../data';
export default function ControlTower({cycles,onOpen}){
 const act=cycles.filter(c=>c.actionLabel==='Act today');
 const escalated=cycles.filter(c=>c.management && c.status!=='Closed');
 const issueText=c=>c.waitingFor?`Waiting for ${c.waitingFor.toLowerCase()}`:'Cycle complete';
 return <>
  <CapitalView cycles={cycles}/>
  <section className="kpis">
   <div className="kpi"><span>Breached cycles</span><strong>{cycles.filter(c=>c.status==='Breached').length}</strong></div>
   <div className="kpi"><span>At-risk cycles</span><strong>{cycles.filter(c=>c.status==='At risk').length}</strong></div>
   <div className="kpi"><span>Act today</span><strong>{act.length}</strong></div>
   <div className="kpi"><span>Management flags</span><strong>{escalated.length}</strong></div>
  </section>
  <section className="panel">
   <div className="section-head"><div><p className="eyebrow">ACTION QUEUE</p><h2>Where intervention today can create value</h2></div><span>{act.length} items</span></div>
   <div className="exception-list">{act.length?act.map(c=><button className="exception" key={c.id} onClick={()=>onOpen(c)}>
    <div><strong>{c.client}</strong><small>{c.site} · {c.service}</small></div>
    <div className="issue"><span>{issueText(c)}</span><small>{c.reason}</small></div>
    <strong>{money(c.affected)}</strong><StatusBadge status={c.status}/><span className="arrow">→</span>
   </button>):<div className="empty">No cycles require action today.</div>}</div>
  </section>
  {escalated.length>0 && <section className="panel attention"><div className="section-head"><div><p className="eyebrow">MANAGEMENT ATTENTION</p><h2>Issues needing escalation or a decision</h2></div></div>
   {escalated.map(c=><button className="management-row" key={c.id} onClick={()=>onOpen(c)}><div><strong>{c.client} · {c.site}</strong><p>{c.managementAsk||'Management support requested.'}</p></div><div><strong>{money(c.affected)}</strong><small>{c.reason}</small></div></button>)}
  </section>}
  <UnmatchedEvidence items={unmatchedEvidence} cycles={cycles}/>
  <section className="panel"><div className="section-head"><div><p className="eyebrow">ALL CYCLES</p><h2>Current billing-cycle health</h2></div></div>
   <div className="table-wrap"><table><thead><tr><th>Client</th><th>Affected exposure</th><th>Waiting for</th><th>Status</th><th>Action</th><th>Owner</th></tr></thead><tbody>{cycles.map(c=><tr key={c.id} onClick={()=>onOpen(c)}><td><strong>{c.client}</strong><small>{c.site} · {c.service}</small></td><td>{money(c.affected)}{c.affected<c.value&&<small>of {money(c.value)} gross</small>}</td><td>{c.waitingFor||'Cycle complete'}{c.otherOpen>0&&<small>+ {c.otherOpen} other open</small>}</td><td><StatusBadge status={c.status}/></td><td>{c.actionLabel}</td><td>{c.owner}</td></tr>)}</tbody></table></div>
  </section>
 </>;
}
