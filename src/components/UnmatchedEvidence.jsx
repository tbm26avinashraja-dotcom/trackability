export default function UnmatchedEvidence({items}){
 return <section className="panel warning-panel"><div className="section-head"><div><p className="eyebrow">UNMATCHED EVIDENCE</p><h2>Safe-failure queue: evidence not silently assigned</h2></div><span>{items.length} item{items.length===1?'':'s'}</span></div>
 {items.map(x=><div className="unmatched-row" key={x.id}><div><strong>{x.subject}</strong><small>{x.from} · {x.received}</small><p>{x.reason}</p></div><div><span>Possible cycles</span>{x.candidates.map(c=><code key={c}>{c}</code>)}</div><button className="secondary-btn" disabled title="Resolution workflow comes in a later increment">Resolve later</button></div>)}
 </section>;
}
