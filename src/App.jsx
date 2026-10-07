import { useMemo,useState } from 'react';
import './App.css';
import { cycles } from './data';
import { evaluateCycle } from './logic';
import ControlTower from './components/ControlTower';
import CycleDetail from './components/CycleDetail';
import EvidenceModal from './components/EvidenceModal';

export default function App(){
 const [asOf,setAsOf]=useState('2026-10-15');
 const [selected,setSelected]=useState(null);
 const [evidence,setEvidence]=useState(null);
 const evaluated=useMemo(()=>cycles.map(c=>evaluateCycle(c,asOf)),[asOf]);
 const selectedCycle=selected?evaluated.find(c=>c.id===selected):null;
 return <div className="app">
  <header className="topbar"><div><span className="brand-mark">1mg</span><div><strong>CH&W Billing Control Tower</strong><small>Proof of concept · synthetic data</small></div></div><label>As of date <input type="date" value={asOf} onChange={e=>setAsOf(e.target.value)}/></label></header>
  <main>{selectedCycle?<CycleDetail cycle={selectedCycle} asOf={asOf} onBack={()=>setSelected(null)} onEvidence={setEvidence}/>:<><section className="page-title"><p className="eyebrow">BILLING OPERATIONS</p><h1>What needs attention today?</h1><p>Early warning and exception management from month-end to cash.</p></section><ControlTower cycles={evaluated} onOpen={c=>setSelected(c.id)}/></>}</main>
  {evidence&&selectedCycle&&<EvidenceModal cycle={selectedCycle} event={evidence} onClose={()=>setEvidence(null)}/>} 
 </div>;
}
