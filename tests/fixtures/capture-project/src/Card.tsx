// No control, no library component → nothing rendered warrants a capture; must NOT
// appear in the coverage universe.
export function Card() {
  return <div className="card">Hello</div>;
}
