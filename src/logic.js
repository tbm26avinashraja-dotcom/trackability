import { benchmarks, eventLabels } from './data';
const DAY=86400000;
export const addDays=(iso,days)=>{ const d=new Date(`${iso}T00:00:00`); d.setDate(d.getDate()+days); return d.toISOString().slice(0,10); };
export const diffDays=(a,b)=>Math.round((new Date(`${a}T00:00:00`)-new Date(`${b}T00:00:00`))/DAY);
export const money=(n)=> n>=10000000 ? `₹${(n/10000000).toFixed(n%10000000?1:0)}cr` : `₹${(n/100000).toFixed(n%100000?1:0)}L`;
export const prettyDate=(iso)=> iso ? new Date(`${iso}T00:00:00`).toLocaleDateString('en-IN',{day:'numeric',month:'short'}) : '—';
export const tierLabel=(tier)=>({T1:'System-attested',T2:'Artefact-attested',T3:'Client-attested',T4:'AI-inferred',T5:'Human-declared'}[tier]||tier||'System');

export function targetsFor(cycle){
  const monthEnd='2026-09-30';
  const profile=cycle.override || benchmarks[cycle.bucket] || {};
  return Object.fromEntries(Object.entries(profile).map(([k,v])=>[k,addDays(monthEnd,v)]));
}

export function evaluateCycle(cycle, asOf){
  const targets=targetsFor(cycle);
  const keys=Object.keys(targets);
  const details=keys.map((event,i)=>{
    const target=targets[event], actual=cycle.events[event];
    let state='Pending', timing='';
    if(actual){ const late=diffDays(actual,target); state=late>0?'Done late':'Done on time'; timing=late>0?`+${late}d`:`${Math.abs(late)}d early`; }
    else if(asOf>target){ const late=diffDays(asOf,target); state='Breached'; timing=`+${late}d`; }
    else { const left=diffDays(target,asOf); state=left<=3?'At risk':'On track'; timing=`${left}d left`; }
    return {event,label:eventLabels[event]||event,target,actual,state,timing,index:i};
  });
  const active=details.filter(d=>!d.actual);
  const breached=active.filter(d=>d.state==='Breached');
  const risk=active.filter(d=>d.state==='At risk');
  let primary=breached[0] || risk[0] || active[0] || null;
  let status=primary?.state || 'Closed';
  let reason='Cycle complete';
  if(primary?.state==='Breached') reason=`${primary.label} target passed ${primary.timing}`;
  else if(primary?.state==='At risk') reason=`${primary.label} target approaching`;
  else if(primary) reason=`Waiting on ${primary.label}`;

  if(primary && status==='On track' && primary.index>0){
    const prev=details[primary.index-1];
    if(prev.actual && prev.state==='Done late'){
      const plannedGap=diffDays(primary.target,prev.target);
      const actualGapLeft=diffDays(primary.target,prev.actual);
      if(actualGapLeft < plannedGap){ status='At risk'; reason='Upstream delay has consumed planned buffer'; }
    }
  }

  const invoiceCreated=Boolean(cycle.events.INVOICE_CREATED);
  const accepted=Boolean(cycle.events.INVOICE_ACCEPTED);
  const paid=Boolean(cycle.events.CASH_RECEIVED);
  const capitalState=paid?'Closed':accepted?'Payment':invoiceCreated?'Invoiced, not accepted':'Pre-invoice';
  const contractDue=accepted?addDays(cycle.events.INVOICE_ACCEPTED,cycle.creditDays):null;
  if(!paid && accepted && asOf>contractDue){
    status='Breached'; primary={event:'CASH_RECEIVED',label:'Cash received',target:contractDue,actual:null,state:'Breached',timing:`+${diffDays(asOf,contractDue)}d`};
    reason=`Payment past contractual due date by ${diffDays(asOf,contractDue)}d`;
  }

  let actionLabel='Watch';
  if(status==='Closed'||status==='On track') actionLabel='No action';
  else if(cycle.action.taken && cycle.action.followUp && asOf<cycle.action.followUp) actionLabel='Watch';
  else if(cycle.action.available && cycle.action.effectiveness!=='None') actionLabel='Act today';
  else actionLabel='Diagnose';

  return {...cycle,targets,details,status,reason,primary,capitalState,contractDue,actionLabel,
    otherOpen:Math.max(0,active.length-(primary?1:0))};
}

export function capitalPools(cycles){
  return cycles.reduce((acc,c)=>{ if(c.capitalState!=='Closed') acc[c.capitalState]=(acc[c.capitalState]||0)+c.affected; return acc; },{});
}

export function buildActivity(cycle){
  const items=[];
  Object.entries(cycle.events).forEach(([event,time])=>{
    const evidence=cycle.evidence[event];
    items.push({time:`${time} 10:00`,type:'event',title:eventLabels[event]||event,detail:evidence?`${evidence.tier} · ${evidence.source}`:'Synthetic event',status:evidence?.checker||'Recorded'});
  });
  return items.sort((a,b)=>b.time.localeCompare(a.time));
}
