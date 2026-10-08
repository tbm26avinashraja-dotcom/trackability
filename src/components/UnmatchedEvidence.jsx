export default function UnmatchedEvidence({items,cycles=[]}){
 const describe=id=>{const c=cycles.find(x=>x.id===id);return c?`${id} — ${c.client} · ${c.site} · ${c.service}`:id;};
 return <section className="panel warning-panel"><div className="section-head"><div><p className="eyebrow">EVIDENCE NEEDS REVIEW</p><h2>Could not confidently match this evidence to a billing cycle</h2></div><span>{items.length} item{items.length===1?'':'s'}</span></div>
 {items.map(x=><div className="unmatched-row" key={x.id}><div><strong>{x.subject}</strong><small>{x.from} · {x.received}</small><p>{x.reason}</p></div><div><span>Possible cycles</span>{x.candidates.map(c=><code key={c}>{describe(c)}</code>)}</div><div className="review-status">Awaiting manual review</div></div>)}
 </section>;
}
