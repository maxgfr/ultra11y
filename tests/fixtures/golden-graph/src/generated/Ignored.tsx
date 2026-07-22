// Lives in a .gitignored tree (see ../.gitignore: "generated/"). Same name-dropping
// shape as SaveButton so its presence/absence in the graph is visible in findings.
export default function Ignored({ label }) {
  return (
    <button>
      <svg viewBox="0 0 16 16" />
    </button>
  );
}
