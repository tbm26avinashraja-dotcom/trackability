import { useMemo,useState } from 'react';
import './App.css';
import { cycles as seedCycles } from './data';
import { evaluateCycle } from './logic';
import ControlTower from './components/ControlTower';
import CycleDetail from './components/CycleDetail';
import EvidenceModal from './components/EvidenceModal';
import ClientView from './components/ClientView';
import ClientActionModal from './components/ClientActionModal';

export default function App(){
 const [asOf,setAsOf]=useState('2026-10-15');
 const [mode,setMode]=useState('internal');
 const [cycles,setCycles]=useState(seedCycles);
 const [selected,setSelected]=useState(null);
 const [evidence,setEvidence]=useState(null);
 const [clientAction,setClientAction]=useState(null);
 const evaluated=useMemo(()=>cycles.map(c=>evaluateCycle(c,asOf)),[cycles,asOf]);
 const selectedCycle=selected?evaluated.find(c=>c.id===selected):null;

 const recordClientAction=({cycleId,type,disputedValue,note})=>{
  setCycles(prev=>prev.map(c=>{
   if(c.id!==cycleId) return c;
   const events={...c.events};
   const evidence={...c.evidence};
   const actor=c.clientTask?.approver || `approved.contact@${c.client.toLowerCase().replace(/[^a-z0-9]+/g,'')}.example.com`;
   if(type==='MIS_APPROVED'){
    events.MIS_APPROVED=asOf;
    evidence.MIS_APPROVED={source:'Signed client approval',tier:'T3',ref:`Approval token POC-${cycleId}-${asOf}`,actor,checker:'Signature valid · approver whitelisted'};
   }
   if(type==='MIS_QUERY'){
    events.MIS_QUERY=asOf;
    evidence.MIS_QUERY={source:'Client query action',tier:'T3',ref:note||'Client raised a query on the MIS',actor,checker:'Signed action · approver whitelisted'};
   }
   if(type==='INVOICE_ACCEPTED'){
    events.INVOICE_ACCEPTED=asOf;
    evidence.INVOICE_ACCEPTED={source:'Signed client acknowledgement',tier:'T3',ref:`Acceptance token POC-${cycleId}-${asOf}`,actor,checker:'Signature valid · AP contact whitelisted'};
   }
   if(type==='INV_DISPUTED'){
    events.INV_DISPUTED=asOf;
    evidence.INV_DISPUTED={source:'Client dispute action',tier:'T3',ref:note||'Client raised an invoice dispute',actor,checker:'Signed action · AP contact whitelisted'};
   }
   return {...c,events,evidence,
    ...(type==='INV_DISPUTED'?{disputedValue:disputedValue||c.affected,affected:disputedValue||c.affected}:{}),
    clientIssue:type==='MIS_QUERY'?{type:'MIS_QUERY',note:note||'Client query raised',time:asOf}:type==='INV_DISPUTED'?{type:'INV_DISPUTED',note:note||'Invoice dispute raised',time:asOf}:null
   };
  }));
  setClientAction(null);
 };

 const switchMode=(next)=>{setMode(next);setSelected(null);setEvidence(null);setClientAction(null);};
 return <div className="app">
  <header className="topbar"><div><span className="brand-mark">1mg</span><div><strong>CH&W Billing Control Tower</strong><small>Proof of concept · synthetic data</small></div></div><div className="top-actions"><div className="view-toggle" role="group" aria-label="Prototype view"><button className={mode==='internal'?'active':''} onClick={()=>switchMode('internal')}>1mg view</button><button className={mode==='client'?'active':''} onClick={()=>switchMode('client')}>Client view</button></div><label>As of date <input type="date" value={asOf} onChange={e=>setAsOf(e.target.value)}/></label></div></header>
  <main>{mode==='client'?<ClientView cycles={evaluated} asOf={asOf} onAction={setClientAction}/>:selectedCycle?<CycleDetail cycle={selectedCycle} asOf={asOf} onBack={()=>setSelected(null)} onEvidence={setEvidence}/>:<><section className="page-title"><p className="eyebrow">BILLING OPERATIONS</p><h1>What needs attention today?</h1><p>Early warning and exception management from month-end to cash.</p></section><ControlTower cycles={evaluated} onOpen={c=>setSelected(c.id)}/></>}</main>
  {evidence&&selectedCycle&&<EvidenceModal cycle={selectedCycle} event={evidence} onClose={()=>setEvidence(null)}/>} 
  {clientAction&&<ClientActionModal request={clientAction} asOf={asOf} onClose={()=>setClientAction(null)} onConfirm={recordClientAction}/>} 
 </div>;
}
