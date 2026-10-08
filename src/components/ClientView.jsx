import { useMemo,useState } from 'react';
import { money,prettyDate } from '../logic';

function availableAction(c){
 if(c.clientIssue?.type==='MIS_QUERY') return {kind:'query-open',title:'MIS query is open'};
 if(c.clientIssue?.type==='INV_DISPUTED') return {kind:'dispute-open',title:'Invoice dispute is open'};
 // Client can review MIS only after it is ready/shared and before approval.
 if(c.targets.MIS_APPROVED && (c.eventsVisible.MIS_SHARED||c.eventsVisible.MIS_READY) && !c.eventsVisible.MIS_APPROVED) return {kind:'mis',title:'MIS awaiting your review'};
 // Invoice acknowledgement is unlocked only after the invoice has actually been submitted/shared.
 if(c.eventsVisible.INVOICE_SUBMITTED && !c.eventsVisible.INVOICE_ACCEPTED) return {kind:'invoice',title:'Invoice awaiting acknowledgement'};
 return null;
}

export default function ClientView({cycles,asOf,onAction}){
 const clients=useMemo(()=>[...new Set(cycles.map(c=>c.client))].sort(),[cycles]);
 const [selectedClient,setSelectedClient]=useState('');
 const visible=selectedClient?cycles.filter(c=>c.client===selectedClient):[];
 const tasks=visible.map(c=>({cycle:c,task:availableAction(c)})).filter(x=>x.task);
 return <div className="client-page">
  <section className="client-hero"><p className="eyebrow">CLIENT VIEW · POC</p><h1>Documents requiring your response</h1><p>This simplified view demonstrates how a client action can become timestamped evidence in Trackability.</p></section>
  <div className="client-banner"><strong>Synthetic demonstration only.</strong><span>No message, approval or dispute is sent outside this browser session.</span></div>
  <section className="client-identity panel"><div><p className="eyebrow">DEMO IDENTITY</p><h2>Who are you viewing as?</h2><p>Real access would be determined by a signed link or authenticated client identity. The selector exists only for this POC.</p></div><label>Viewing as<select value={selectedClient} onChange={e=>setSelectedClient(e.target.value)}><option value="">Select a demo client</option>{clients.map(c=><option value={c} key={c}>{c}</option>)}</select></label></section>
  {!selectedClient?<div className="panel empty">Select a demo client to see only that client's pending actions.</div>:<section className="client-task-list">{tasks.length?tasks.map(({cycle:c,task})=><article className="client-task" key={c.id}>
   <div className="client-task-head"><div><p className="eyebrow">{c.id}</p><h2>{c.client}</h2><p>{c.site} · {c.service} · September 2026</p></div><strong>{money(c.value)}</strong></div>
   <div className="client-task-body"><div><span className="task-label">{task.title}</span>{task.kind==='mis'&&<><p>The September MIS is ready for your review. Your response will be recorded against this billing cycle.</p><small>Target approval: {prettyDate(c.targets.MIS_APPROVED)}</small></>}{task.kind==='invoice'&&<><p>The invoice has been submitted/shared and is ready for acknowledgement.</p><small>Invoice acceptance target: {prettyDate(c.targets.INVOICE_ACCEPTED)}</small></>}{task.kind==='query-open'&&<><p>{c.clientIssue.note}</p><small>Query recorded {prettyDate(c.clientIssue.time)} · awaiting 1mg resolution</small></>}{task.kind==='dispute-open'&&<><p>{c.clientIssue.note}</p><small>{money(c.affected)} currently affected · recorded {prettyDate(c.clientIssue.time)}</small></>}</div>
    {task.kind==='mis'&&<div className="client-buttons"><button className="primary-btn" onClick={()=>onAction({cycle:c,type:'MIS_APPROVED',title:'Approve MIS'})}>Approve MIS</button><button className="secondary-btn" onClick={()=>onAction({cycle:c,type:'MIS_QUERY',title:'Raise a query'})}>Raise a query</button></div>}
    {task.kind==='invoice'&&<div className="client-buttons"><button className="primary-btn" onClick={()=>onAction({cycle:c,type:'INVOICE_ACCEPTED',title:'Acknowledge invoice'})}>Acknowledge invoice</button><button className="secondary-btn" onClick={()=>onAction({cycle:c,type:'INV_DISPUTED',title:'Raise a dispute'})}>Raise a dispute</button></div>}
   </div>
  </article>):<div className="panel empty">No client response is required from {selectedClient} as of {prettyDate(asOf)}.</div>}</section>}
 </div>;
}
