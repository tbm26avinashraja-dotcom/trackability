export default function StatusBadge({status}){ return <span className={`badge badge-${status.toLowerCase().replaceAll(' ','-')}`}>{status}</span>; }
