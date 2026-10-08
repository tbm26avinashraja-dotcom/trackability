import { benchmarks, eventLabels } from './data';
const DAY=86400000;
const MONTH_END='2026-09-30';
export const addDays=(iso,days)=>{ const [y,m,d]=iso.split('-').map(Number); const dt=new Date(Date.UTC(y,m-1,d+days)); return dt.toISOString().slice(0,10); };
export const diffDays=(a,b)=>{ const pa=a.split('-').map(Number), pb=b.split('-').map(Number); return Math.round((Date.UTC(pa[0],pa[1]-1,pa[2])-Date.UTC(pb[0],pb[1]-1,pb[2]))/DAY); };
export const money=(n)=> n>=10000000 ? `₹${(n/10000000).toFixed(n%10000000?1:0)}cr` : `₹${(n/100000).toFixed(n%100000?1:0)}L`;
export const prettyDate=(iso)=> iso ? new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-IN',{day:'numeric',month:'short',timeZone:'UTC'}) : '—';
export const tierLabel=(tier)=>({T1:'System-attested',T2:'Artefact-attested',T3:'Client-attested',T4:'AI-inferred',T5:'Human-declared'}[tier]||tier||'System');

export function targetsFor(cycle){
  const profile=cycle.override || benchmarks[cycle.bucket] || {};
  return Object.fromEntries(Object.entries(profile).map(([k,v])=>[k,addDays(MONTH_END,v)]));
}

function prerequisiteFor(event,targets){
  const map={
    MIS_READY:null,
    MIS_APPROVED:'MIS_READY',
    INVOICE_CREATED:targets.MIS_APPROVED?'MIS_APPROVED':'MIS_READY',
    COMP_RECEIVED:null,
    COMP_APPROVED:'COMP_RECEIVED',
    SES_APPROVED:'COMP_APPROVED',
    INVOICE_ACCEPTED:targets.SES_APPROVED?'SES_APPROVED':'INVOICE_CREATED',
    CASH_RECEIVED:'INVOICE_ACCEPTED'
  };
  return map[event] ?? null;
}

function legMetrics(event,target,actual,targets,eventsVisible){
  const prereq=prerequisiteFor(event,targets);
  const plannedStart=prereq?targets[prereq]:MONTH_END;
  const actualStart=prereq?eventsVisible[prereq]:MONTH_END;
  if(!plannedStart) return {};
  const expectedLegDays=Math.max(0,diffDays(target,plannedStart));
  if(!actualStart) return {prereq,expectedLegDays};
  const projected=addDays(actualStart,expectedLegDays);
  if(!actual) return {prereq,expectedLegDays,actualStart,projected};
  const actualLegDays=Math.max(0,diffDays(actual,actualStart));
  const addedDelay=actualLegDays-expectedLegDays;
  const scheduleVariance=diffDays(actual,target);
  const inheritedDelay=scheduleVariance-addedDelay;
  return {prereq,expectedLegDays,actualStart,projected,actualLegDays,addedDelay,scheduleVariance,inheritedDelay};
}

export function evaluateCycle(cycle, asOf){
  const targets=targetsFor(cycle);
  const eventsVisible=Object.fromEntries(Object.entries(cycle.events).filter(([,time])=>time<=asOf));
  const keys=Object.keys(targets);
  const details=keys.map((event,i)=>{
    let target=targets[event];
    if(event==='CASH_RECEIVED' && eventsVisible.INVOICE_ACCEPTED){
      target=addDays(eventsVisible.INVOICE_ACCEPTED,cycle.creditDays);
    }
    const actual=eventsVisible[event];
    const metrics=legMetrics(event,target,actual,targets,eventsVisible);
    let state='Pending', timing='', signal='';
    if(actual){
      const late=diffDays(actual,target);
      state=late>0?'Done late':'Done on time';
      timing=late>0?`+${late}d vs plan`:`${Math.abs(late)}d early`;
      if(metrics.addedDelay>0) signal=`+${metrics.addedDelay}d added at this step`;
      else if(late>0 && metrics.inheritedDelay>0) signal=`${metrics.inheritedDelay}d inherited · no additional delay here`;
      else if(metrics.addedDelay<0) signal=`${Math.abs(metrics.addedDelay)}d recovered at this step`;
    } else if(asOf>target){
      const late=diffDays(asOf,target); state='Breached'; timing=`+${late}d`;
    } else {
      const left=diffDays(target,asOf); state='On track'; timing=`${left}d left`;
      // At Risk is evidence-based, not simply "target is close".
      if(metrics.projected && metrics.projected>target){
        state='At risk'; signal=`Projected completion ${prettyDate(metrics.projected)} · ${diffDays(metrics.projected,target)}d beyond target`;
      } else if(metrics.actualStart && metrics.expectedLegDays>0){
        const elapsed=diffDays(asOf,metrics.actualStart);
        const remaining=diffDays(target,asOf);
        if(elapsed>metrics.expectedLegDays && remaining<=3){
          state='At risk'; signal='Current leg has exceeded expected TAT and little recovery time remains';
        }
      }
    }
    const targetBasis=(event==='CASH_RECEIVED' && eventsVisible.INVOICE_ACCEPTED)?`Contract · ${cycle.creditDays}d from acceptance`:cycle.targetSource;
    return {event,label:eventLabels[event]||event,target,actual,state,timing,signal,targetBasis,index:i,...metrics};
  });

  const active=details.filter(d=>!d.actual);
  const breached=active.filter(d=>d.state==='Breached');
  const risk=active.filter(d=>d.state==='At risk');
  let primary=breached[0] || risk[0] || active[0] || null;
  let status=primary?.state || 'Closed';
  let reason='Cycle complete';
  if(primary?.state==='Breached') reason=`${primary.label} target passed ${primary.timing}`;
  else if(primary?.state==='At risk') reason=primary.signal || `${primary.label} is projected to miss target`;
  else if(primary) reason=`Waiting for ${primary.label.toLowerCase()}`;

  const visibleIssue=cycle.clientIssue && cycle.clientIssue.time<=asOf ? cycle.clientIssue : null;
  if(visibleIssue?.type==='MIS_QUERY' && !eventsVisible.MIS_APPROVED){
    const target=targets.MIS_APPROVED;
    primary={event:'MIS_APPROVED',label:'MIS approved',target,actual:null,state:asOf>target?'Breached':'At risk',timing:target?(asOf>target?`+${diffDays(asOf,target)}d`:`${diffDays(target,asOf)}d left`):'',signal:'Client query must be resolved before approval'};
    status=primary.state;
    reason=`Client query open: ${visibleIssue.note}`;
  }

  const invoiceCreated=Boolean(eventsVisible.INVOICE_CREATED);
  const accepted=Boolean(eventsVisible.INVOICE_ACCEPTED);
  const paid=Boolean(eventsVisible.CASH_RECEIVED);
  const capitalState=paid?'Closed':accepted?'Payment':invoiceCreated?'Invoiced, not accepted':'Pre-invoice';
  const contractDue=accepted?addDays(eventsVisible.INVOICE_ACCEPTED,cycle.creditDays):null;
  if(!paid && accepted && asOf>contractDue){
    status='Breached'; primary={event:'CASH_RECEIVED',label:'Cash received',target:contractDue,actual:null,state:'Breached',timing:`+${diffDays(asOf,contractDue)}d`,signal:'Contractual payment due date passed'};
    reason=`Payment past contractual due date by ${diffDays(asOf,contractDue)}d`;
  }
  if(visibleIssue?.type==='INV_DISPUTED') reason=`Invoice dispute open: ${visibleIssue.note}`;

  let actionLabel='Watch';
  if(status==='Closed') actionLabel='No action';
  else if(status==='On track') actionLabel='Watch';
  else if(cycle.action.taken && cycle.action.followUp && asOf<cycle.action.followUp) actionLabel='Watch';
  else if(cycle.action.available && cycle.action.effectiveness!=='None') actionLabel='Act today';
  else actionLabel='Diagnose';

  const lastCompleted=[...details].filter(d=>d.actual).sort((a,b)=>b.actual.localeCompare(a.actual))[0] || null;
  return {...cycle,eventsVisible,clientIssue:visibleIssue,targets,details,status,reason,primary,capitalState,contractDue,actionLabel,lastCompleted,
    waitingFor:primary?.label||null, otherOpen:Math.max(0,active.length-(primary?1:0))};
}

export function capitalPools(cycles){
  return cycles.reduce((acc,c)=>{ if(c.capitalState!=='Closed') acc[c.capitalState]=(acc[c.capitalState]||0)+c.affected; return acc; },{});
}

export function buildActivity(cycle,notifications=[]){
  const items=[];
  Object.entries(cycle.eventsVisible||{}).forEach(([event,time])=>{
    const evidence=cycle.evidence[event];
    items.push({time:`${time} 10:00`,type:'event',title:eventLabels[event]||event,detail:evidence?`${evidence.tier} · ${evidence.source}`:'Synthetic event',status:evidence?.checker||'Recorded'});
  });
  if(cycle.action?.taken){
    const actionDate=(cycle.eventsVisible?.INV_DISPUTED || cycle.eventsVisible?.MIS_APPROVED || '2026-10-15');
    items.push({time:`${actionDate} 15:00`,type:'action',title:'Operating action recorded',detail:cycle.action.text,status:cycle.action.followUp?`Follow-up ${cycle.action.followUp}`:'Action taken'});
  }
  notifications.filter(n=>n.cycleId===cycle.id).forEach(n=>items.push({time:n.time,type:'notification',title:n.title,detail:`${n.channel} · ${n.recipients.join(', ')}`,status:n.status}));
  return items.sort((a,b)=>b.time.localeCompare(a.time));
}

const routing={
  MIS_READY:[['RPO / preparer'],['RPO SPOC'],['CH&W management']],
  MIS_APPROVED:[['KAM','Client approver'],['KAM','RPO SPOC'],['CH&W management']],
  COMP_APPROVED:[['KAM','Client contact'],['KAM','RPO SPOC'],['CH&W management']],
  SES_APPROVED:[['KAM','Client contact'],['KAM','RPO SPOC'],['CH&W management']],
  INVOICE_ACCEPTED:[['KAM','Client AP'],['KAM','RPO SPOC'],['CH&W management']],
  INVOICE_CREATED:[['Finance AR'],['Finance controller'],['CH&W management']],
  COMP_RECEIVED:[['Compliance team'],['Compliance lead'],['CH&W management']],
  CASH_RECEIVED:[['KAM'],['KAM','Collections'],['CH&W management']]
};

export function automaticNotifications(cycle,asOf){
  if(cycle.status!=='Breached' || !cycle.primary?.target) return [];
  const event=cycle.primary.event;
  const route=routing[event] || [['Operating owner'],['Operating owner','Functional lead'],['CH&W management']];
  const levels=[
    {level:1,day:1,label:'Day 1 · Owner alert',recipients:route[0]},
    {level:2,day:3,label:'Day 3 · Lead escalation',recipients:route[1]},
    {level:3,day:5,label:'Day 5 · Management escalation',recipients:route[2]},
  ];
  return levels.filter(x=>diffDays(asOf,cycle.primary.target)>=x.day).map(x=>({
    id:`${cycle.id}-${event}-L${x.level}`,cycleId:cycle.id,time:`${addDays(cycle.primary.target,x.day)} 09:30`,
    title:`${x.label}: ${cycle.primary.label}`,channel:'Google Chat',recipients:x.recipients,
    status:'Simulated notification generated',level:x.level,label:x.label,days:x.day,
  }));
}
export function escalationStage(cycle,asOf){ const due=automaticNotifications(cycle,asOf); return due.length?due[due.length-1]:null; }
