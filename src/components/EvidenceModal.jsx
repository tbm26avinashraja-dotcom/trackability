import { eventLabels } from '../data';
import { tierLabel } from '../logic';
export default function EvidenceModal({cycle,event,onClose}){
 const evidence=cycle.evidence[event]||{source:'Synthetic POC event',tier:'—',ref:'No external evidence connected in this prototype.'};
 return <div className="modal-backdrop" onClick={onClose}><div className="modal" onClick={e=>e.stopPropagation()}><button className="modal-x" onClick={onClose}>×</button><p className="eyebrow">EVENT EVIDENCE</p><h2>{eventLabels[event]||event}</h2>
 <div className={`tier-card tier-${(evidence.tier||'x').toLowerCase()}`}><strong>{evidence.tier||'—'} · {tierLabel(evidence.tier)}</strong><span>{evidence.checker||'Synthetic POC evidence'}</span></div>
 <dl><dt>Cycle</dt><dd>{cycle.id}</dd><dt>Actual date</dt><dd>{cycle.events[event]}</dd><dt>Source</dt><dd>{evidence.source}</dd><dt>Evidence</dt><dd>{evidence.ref}</dd>{evidence.actor&&<><dt>Actor</dt><dd>{evidence.actor}</dd></>}{evidence.confidence&&<><dt>Confidence</dt><dd>{evidence.confidence}</dd></>}</dl>
 <p className="poc-note">Synthetic demonstration evidence. In production, this would link back to the source system, email, document or portal event.</p></div></div>;
}
