import { eventLabels } from '../data';
export default function EvidenceModal({cycle,event,onClose}){
 const evidence=cycle.evidence[event]||{source:'Synthetic POC event',ref:'No external evidence connected in this prototype.'};
 return <div className="modal-backdrop" onClick={onClose}><div className="modal" onClick={e=>e.stopPropagation()}><button className="modal-x" onClick={onClose}>×</button><p className="eyebrow">EVENT EVIDENCE</p><h2>{eventLabels[event]||event}</h2><dl><dt>Cycle</dt><dd>{cycle.id}</dd><dt>Actual date</dt><dd>{cycle.events[event]}</dd><dt>Source</dt><dd>{evidence.source}</dd><dt>Evidence</dt><dd>{evidence.ref}</dd></dl><p className="poc-note">Synthetic demonstration evidence. A production design would link back to the source system, email, document or portal event.</p></div></div>;
}
