import { useState } from 'react';
import { money,prettyDate } from '../logic';

export default function ClientActionModal({request,asOf,onClose,onConfirm}){
 const {cycle,type,title}=request;
 const isQuery=type==='MIS_QUERY';
 const isDispute=type==='INV_DISPUTED';
 const [note,setNote]=useState(isQuery?'Please review the employee-count variance in the MIS.':isDispute?'Part of the invoice is disputed pending reconciliation.':'');
 const [amount,setAmount]=useState(isDispute?Math.min(cycle.affected,1000000):0);
 const submit=()=>onConfirm({cycleId:cycle.id,type,disputedValue:isDispute?Number(amount):undefined,note});
 return <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)onClose();}}><div className="modal client-action-modal">
  <button className="modal-x" onClick={onClose}>×</button><p className="eyebrow">CLIENT ACTION · {cycle.id}</p><h2>{title}</h2><div className="approval-summary"><strong>{cycle.client}</strong><span>{cycle.site} · {cycle.service} · September 2026</span><span>{money(cycle.value)}</span></div>
  {!isQuery&&!isDispute&&<p className="confirm-copy">Opening this page does not record an action. Only pressing the confirmation button below creates the simulated client-attested event.</p>}
  {(isQuery||isDispute)&&<label className="field-label">{isDispute?'Reason for dispute':'Query'}<textarea value={note} onChange={e=>setNote(e.target.value)} rows="3"/></label>}
  {isDispute&&<label className="field-label">Affected amount (₹)<input type="number" min="0" max={cycle.value} value={amount} onChange={e=>setAmount(e.target.value)}/><small>Gross invoice value: {money(cycle.value)}</small></label>}
  <div className="signed-note"><strong>T3 · Client-attested</strong><span>POC actor: {cycle.clientTask?.approver||'whitelisted.client@example.com'}</span><span>Event time: {prettyDate(asOf)}</span></div>
  <div className="modal-actions"><button className="secondary-btn" onClick={onClose}>Cancel</button><button className="primary-btn" onClick={submit}>{isQuery?'Submit query':isDispute?'Submit dispute':type==='MIS_APPROVED'?'Confirm approval':'Confirm acknowledgement'}</button></div>
 </div></div>;
}
