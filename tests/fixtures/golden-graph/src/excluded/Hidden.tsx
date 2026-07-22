// Dropped by the golden test's --exclude glob ("**/excluded/**") — must never
// appear in the discovered list or the graph.
export default function Hidden() {
  return <button>Caché</button>;
}
