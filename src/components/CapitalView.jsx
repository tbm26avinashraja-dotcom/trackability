import { capitalPools,money } from '../logic';
export default function CapitalView({cycles}){
 const pools=capitalPools(cycles);
 return <section className="capital-strip"><div><span>Pre-invoice</span><strong>{money(pools['Pre-invoice']||0)}</strong><small>Service delivered, invoice not created</small></div><div><span>Invoiced, not accepted</span><strong>{money(pools['Invoiced, not accepted']||0)}</strong><small>Invoice exists, client clock not started</small></div><div><span>Payment</span><strong>{money(pools['Payment']||0)}</strong><small>Accepted, payment clock running</small></div></section>;
}
