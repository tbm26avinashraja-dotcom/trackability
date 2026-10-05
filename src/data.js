export const benchmarks = {
  B: { MIS_READY: 6, MIS_APPROVED: 12, INVOICE_CREATED: 15, INVOICE_ACCEPTED: 16, CASH_RECEIVED: 61 },
  C: { MIS_READY: 2, INVOICE_CREATED: 5, INVOICE_ACCEPTED: 15, CASH_RECEIVED: 55 },
  D: { MIS_READY: 6, MIS_APPROVED: 10, INVOICE_CREATED: 13, COMP_RECEIVED: 20, COMP_APPROVED: 32, SES_APPROVED: 44, INVOICE_ACCEPTED: 49, CASH_RECEIVED: 94 },
  F: { MIS_READY: 4, MIS_APPROVED: 4, INVOICE_CREATED: 9, INVOICE_ACCEPTED: 9, CASH_RECEIVED: 39 },
};

export const eventLabels = {
  MIS_READY: 'MIS ready', MIS_APPROVED: 'MIS approved', INVOICE_CREATED: 'Invoice created',
  COMP_RECEIVED: 'Compliance received', COMP_APPROVED: 'Compliance approved', SES_APPROVED: 'SES approved',
  INVOICE_ACCEPTED: 'Invoice accepted', CASH_RECEIVED: 'Cash received'
};

export const cycles = [
  {
    id:'CHW-0001P-2609', client:'State Bank of India', site:'Pan India', service:'Pharma', bucket:'B', value:42000000, affected:42000000,
    owner:'KAM / Client approver', creditDays:30, targetSource:'SBI commitment', management:false,
    override:{ MIS_READY:8, MIS_APPROVED:16, INVOICE_CREATED:16, INVOICE_ACCEPTED:20, CASH_RECEIVED:30 },
    events:{ MIS_READY:'2026-10-08' },
    evidence:{ MIS_READY:{source:'MIS file',ref:'Synthetic final MIS artefact'} },
    action:{available:true,effectiveness:'Clear',taken:false,followUp:null,text:'Escalate to the named client approver today.'}
  },
  {
    id:'CHW-0002O-2609', client:'Tata Steel', site:'Khopoli', service:'OHC', bucket:'D', value:760000, affected:760000,
    owner:'KAM / Client operations', creditDays:45, targetSource:'Bucket D benchmark', management:true,
    events:{ MIS_READY:'2026-10-05', MIS_APPROVED:'2026-10-11', INVOICE_CREATED:'2026-10-13', COMP_RECEIVED:'2026-10-24', COMP_APPROVED:'2026-11-04' },
    evidence:{
      MIS_READY:{source:'Drive artefact',ref:'Synthetic MIS final file'}, MIS_APPROVED:{source:'Client email',ref:'“Looks fine, please proceed.”'},
      INVOICE_CREATED:{source:'SAP/HANA',ref:'Synthetic invoice #TSK-2609'}, COMP_RECEIVED:{source:'Compliance folder',ref:'Synthetic PF/ESIC documents'},
      COMP_APPROVED:{source:'Client portal',ref:'Synthetic compliance approval notification'}
    },
    action:{available:true,effectiveness:'Unclear',taken:false,followUp:null,text:'Follow up with client operations for SES approval.'},
    managementAsk:'Support client escalation if SES remains unresolved.'
  },
  {
    id:'CHW-0003D-2609', client:'Tata Steel', site:'West Bokaro', service:'Diagnostics', bucket:'D', value:1000000, affected:1000000,
    owner:'KAM / Client operations', creditDays:30, targetSource:'Bucket D benchmark', management:false,
    events:{ MIS_READY:'2026-10-04', MIS_APPROVED:'2026-10-08', INVOICE_CREATED:'2026-10-12', COMP_RECEIVED:'2026-10-18', COMP_APPROVED:'2026-10-29', SES_APPROVED:'2026-11-10', INVOICE_ACCEPTED:'2026-11-14' },
    evidence:{ INVOICE_CREATED:{source:'SAP/HANA',ref:'Synthetic invoice #TSW-2609'}, INVOICE_ACCEPTED:{source:'Client portal',ref:'Synthetic acceptance status'} },
    action:{available:false,effectiveness:'None',taken:false,followUp:null,text:'No intervention required while within contractual payment terms.'}
  },
  {
    id:'CHW-0004P-2609', client:'BSES', site:'Delhi', service:'Pharma', bucket:'B', value:900000, affected:900000,
    owner:'Finance AR', creditDays:30, targetSource:'Bucket B benchmark', management:false,
    events:{ MIS_READY:'2026-10-06', MIS_APPROVED:'2026-10-12' },
    evidence:{ MIS_APPROVED:{source:'Client email',ref:'Synthetic approval email'} },
    action:{available:true,effectiveness:'Clear',taken:false,followUp:null,text:'Finance AR to create the invoice against the approved MIS.'}
  },
  {
    id:'CHW-0005O-2609', client:'TCS', site:'Noida', service:'OHC', bucket:'C', value:1200000, affected:1200000,
    owner:'KAM / Client AP', creditDays:45, targetSource:'Bucket C benchmark (provisional)', management:false,
    events:{ MIS_READY:'2026-10-02', INVOICE_CREATED:'2026-10-05', INVOICE_ACCEPTED:'2026-10-15' },
    evidence:{ INVOICE_ACCEPTED:{source:'Client portal',ref:'Synthetic portal acceptance'} },
    action:{available:false,effectiveness:'None',taken:false,followUp:null,text:'Watch payment against contractual due date.'}
  },
  {
    id:'CHW-0006D-2609', client:'MediAssist', site:'Pan India', service:'Diagnostics', bucket:'F', value:2900000, affected:2900000,
    owner:'Collections', creditDays:30, targetSource:'API benchmark', management:false,
    events:{ MIS_READY:'2026-10-04', MIS_APPROVED:'2026-10-04', INVOICE_CREATED:'2026-10-09', INVOICE_ACCEPTED:'2026-10-09', CASH_RECEIVED:'2026-11-08' },
    evidence:{ INVOICE_CREATED:{source:'API / SAP',ref:'Synthetic API-linked invoice'}, CASH_RECEIVED:{source:'SAP/HANA',ref:'Synthetic clearing event'} },
    action:{available:false,effectiveness:'None',taken:false,followUp:null,text:'No action required.'}
  },
  {
    id:'CHW-0007O-2609', client:'Manasum Senior Living', site:'Bengaluru', service:'OHC', bucket:'B', value:80000, affected:80000,
    owner:'KAM', creditDays:30, targetSource:'POC simple-mail baseline', management:false,
    override:{ MIS_READY:6, MIS_APPROVED:6, INVOICE_CREATED:6, INVOICE_ACCEPTED:6, CASH_RECEIVED:36 },
    events:{ MIS_READY:'2026-10-05', MIS_APPROVED:'2026-10-05', INVOICE_CREATED:'2026-10-06', INVOICE_ACCEPTED:'2026-10-06', CASH_RECEIVED:'2026-11-05' },
    evidence:{ CASH_RECEIVED:{source:'SAP/HANA',ref:'Synthetic clearing event'} },
    action:{available:false,effectiveness:'None',taken:false,followUp:null,text:'No action required.'}
  }
];
