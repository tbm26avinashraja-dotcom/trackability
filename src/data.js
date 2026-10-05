export const benchmarks = {
  B: { MIS_READY: 6, MIS_APPROVED: 12, INVOICE_CREATED: 15, INVOICE_ACCEPTED: 16, CASH_RECEIVED: 61 },
  C: { MIS_READY: 2, INVOICE_CREATED: 5, INVOICE_ACCEPTED: 15, CASH_RECEIVED: 55 },
  D: { MIS_READY: 6, MIS_APPROVED: 10, INVOICE_CREATED: 13, COMP_RECEIVED: 20, COMP_APPROVED: 32, SES_APPROVED: 44, INVOICE_ACCEPTED: 49, CASH_RECEIVED: 94 },
  F: { MIS_READY: 4, MIS_APPROVED: 4, INVOICE_CREATED: 9, INVOICE_ACCEPTED: 9, CASH_RECEIVED: 39 },
};

export const eventLabels = {
  MIS_READY: 'MIS ready', MIS_SHARED: 'MIS shared', MIS_APPROVED: 'MIS approved', MIS_QUERY: 'MIS query',
  INVOICE_CREATED: 'Invoice created', COMP_RECEIVED: 'Compliance received', COMP_APPROVED: 'Compliance approved',
  SES_APPROVED: 'SES approved', INVOICE_ACCEPTED: 'Invoice accepted', INV_DISPUTED: 'Invoice disputed', CASH_RECEIVED: 'Cash received'
};

const ev=(source,tier,ref,extra={})=>({source,tier,ref,...extra});

export const cycles = [
  {
    id:'CHW-0001P-2609', client:'State Bank of India', site:'Pan India', service:'Pharma', bucket:'B', value:42000000, affected:42000000,
    owner:'KAM / Client approver', creditDays:30, targetSource:'SBI client commitment', management:false,
    override:{ MIS_READY:8, MIS_APPROVED:16, INVOICE_CREATED:16, INVOICE_ACCEPTED:20, CASH_RECEIVED:30 },
    events:{ MIS_READY:'2026-10-08', MIS_SHARED:'2026-10-09' },
    evidence:{
      MIS_READY:ev('Drive artefact','T2','CHW-0001P-2609_MIS.xlsx',{checker:'Automated checks passed'}),
      MIS_SHARED:ev('Tracker email','T2','Message ID DEMO-SBI-001',{checker:'Attachment hash matched final MIS'})
    },
    action:{available:true,effectiveness:'Clear',taken:false,followUp:null,text:'Escalate to the named client approver today.'},
    clientTask:{type:'MIS_APPROVAL',title:'September MIS awaiting approval',approver:'sbi.approver@example.com'}
  },
  {
    id:'CHW-0002O-2609', client:'Tata Steel', site:'Khopoli', service:'OHC', bucket:'D', value:760000, affected:760000,
    owner:'KAM / Client operations', creditDays:45, targetSource:'Bucket D benchmark', management:true,
    events:{ MIS_READY:'2026-10-05', MIS_SHARED:'2026-10-06', MIS_APPROVED:'2026-10-11', INVOICE_CREATED:'2026-10-13', COMP_RECEIVED:'2026-10-24', COMP_APPROVED:'2026-11-04' },
    evidence:{
      MIS_READY:ev('Drive artefact','T2','CHW-0002O-2609_MIS.xlsx',{checker:'Provision and line-count checks passed'}),
      MIS_SHARED:ev('Tracker email','T2','Message ID DEMO-TSK-001',{checker:'Attachment hash matched'}),
      MIS_APPROVED:ev('Client email','T4','“Looks fine, please proceed.”',{actor:'ravi.client@example.com',confidence:'96%',checker:'Sender whitelisted · quote verified'}),
      INVOICE_CREATED:ev('SAP/HANA daily extract','T1','SAP document 180034821',{checker:'Cycle ID and amount matched'}),
      COMP_RECEIVED:ev('Compliance folder','T2','PF/ESIC challans · DEMO',{checker:'Wage month and establishment code matched'}),
      COMP_APPROVED:ev('Client portal notification','T1','Portal ref TS-COMP-2609',{checker:'Accepted automatically'})
    },
    action:{available:true,effectiveness:'Unclear',taken:false,followUp:null,text:'Follow up with client operations for SES approval.'},
    managementAsk:'Support client escalation if SES remains unresolved.',
    clientTask:{type:'SES_WAIT',title:'SES approval pending with client operations'}
  },
  {
    id:'CHW-0003D-2609', client:'Tata Steel', site:'West Bokaro', service:'Diagnostics', bucket:'D', value:1000000, affected:1000000,
    owner:'KAM / Client operations', creditDays:30, targetSource:'Bucket D benchmark', management:false,
    events:{ MIS_READY:'2026-10-04', MIS_APPROVED:'2026-10-08', INVOICE_CREATED:'2026-10-12', COMP_RECEIVED:'2026-10-18', COMP_APPROVED:'2026-10-29', SES_APPROVED:'2026-11-10', INVOICE_ACCEPTED:'2026-11-14' },
    evidence:{
      INVOICE_CREATED:ev('SAP/HANA daily extract','T1','SAP document 180034944',{checker:'Cycle ID and amount matched'}),
      SES_APPROVED:ev('KAM manual entry','T5','SES 5001234',{actor:'KAM',checker:'Pending corroboration from remittance'}),
      INVOICE_ACCEPTED:ev('Client portal','T1','Portal acceptance WB-2609',{checker:'Accepted automatically'})
    },
    action:{available:false,effectiveness:'None',taken:false,followUp:null,text:'No intervention required while within contractual payment terms.'}
  },
  {
    id:'CHW-0004P-2609', client:'BSES', site:'Delhi', service:'Pharma', bucket:'B', value:900000, affected:900000,
    owner:'Finance AR', creditDays:30, targetSource:'Bucket B benchmark', management:false,
    events:{ MIS_READY:'2026-10-06', MIS_APPROVED:'2026-10-12' },
    evidence:{ MIS_APPROVED:ev('Signed client approval','T3','Approval token DEMO-BSES-01',{actor:'ap.bses@example.com',checker:'Signature valid · approver whitelisted'}) },
    action:{available:true,effectiveness:'Clear',taken:false,followUp:null,text:'Finance AR to create the invoice against the approved MIS.'}
  },
  {
    id:'CHW-0005O-2609', client:'TCS', site:'Noida', service:'OHC', bucket:'C', value:1200000, affected:1200000,
    owner:'KAM / Client AP', creditDays:45, targetSource:'Bucket C benchmark (provisional)', management:false,
    events:{ MIS_READY:'2026-10-02', INVOICE_CREATED:'2026-10-05', INVOICE_ACCEPTED:'2026-10-15' },
    evidence:{ INVOICE_ACCEPTED:ev('Client portal','T1','Portal acceptance TCS-NOI-2609',{checker:'Accepted automatically'}) },
    action:{available:false,effectiveness:'None',taken:false,followUp:null,text:'Watch payment against contractual due date.'}
  },
  {
    id:'CHW-0006D-2609', client:'MediAssist', site:'Pan India', service:'Diagnostics', bucket:'F', value:2900000, affected:2900000,
    owner:'Collections', creditDays:30, targetSource:'API benchmark', management:false,
    events:{ MIS_READY:'2026-10-04', MIS_APPROVED:'2026-10-04', INVOICE_CREATED:'2026-10-09', INVOICE_ACCEPTED:'2026-10-09', CASH_RECEIVED:'2026-11-08' },
    evidence:{
      INVOICE_CREATED:ev('API / SAP','T1','API-linked invoice MA-2609',{checker:'Accepted automatically'}),
      CASH_RECEIVED:ev('SAP/HANA clearing','T1','Clearing document MA-CLR-2609',{checker:'Bank credit matched clearing'})
    },
    action:{available:false,effectiveness:'None',taken:false,followUp:null,text:'No action required.'}
  },
  {
    id:'CHW-0007O-2609', client:'Manasum Senior Living', site:'Bengaluru', service:'OHC', bucket:'B', value:80000, affected:80000,
    owner:'KAM', creditDays:30, targetSource:'POC simple-mail baseline', management:false,
    override:{ MIS_READY:6, MIS_APPROVED:6, INVOICE_CREATED:6, INVOICE_ACCEPTED:6, CASH_RECEIVED:36 },
    events:{ MIS_READY:'2026-10-05', MIS_APPROVED:'2026-10-05', INVOICE_CREATED:'2026-10-06', INVOICE_ACCEPTED:'2026-10-06', CASH_RECEIVED:'2026-11-05' },
    evidence:{ CASH_RECEIVED:ev('SAP/HANA clearing','T1','Clearing document MSL-2609',{checker:'Bank credit matched clearing'}) },
    action:{available:false,effectiveness:'None',taken:false,followUp:null,text:'No action required.'}
  },
  {
    id:'CHW-0008O-2609', client:'Demo Corporate', site:'Mumbai', service:'OHC', bucket:'B', value:10000000, affected:1000000,
    owner:'KAM / Client AP', creditDays:30, targetSource:'Bucket B benchmark', management:false, disputedValue:1000000,
    events:{ MIS_READY:'2026-10-05', MIS_APPROVED:'2026-10-10', INVOICE_CREATED:'2026-10-13', INVOICE_ACCEPTED:'2026-10-16', INV_DISPUTED:'2026-10-17' },
    evidence:{ INV_DISPUTED:ev('Client email','T4','“₹10 lakh is disputed pending employee-count reconciliation.”',{actor:'ap.demo@example.com',confidence:'94%',checker:'Sender whitelisted · quote verified'}) },
    action:{available:true,effectiveness:'Clear',taken:true,followUp:'2026-10-20',text:'Resolve the disputed ₹10L portion; undisputed amount continues normally.'},
    clientTask:{type:'DISPUTE',title:'Invoice dispute under review'}
  }
];

export const unmatchedEvidence = [
  {id:'UNKEYED-001',received:'2026-10-15 11:42',from:'client.ap@example.com',subject:'Re: September billing approval',source:'Client email',candidates:['CHW-0001P-2609','CHW-0004P-2609'],reason:'No Cycle ID in subject/body; two candidate cycles match sender domain.'}
];
