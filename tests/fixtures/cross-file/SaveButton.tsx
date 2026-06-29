// A control component that does NOT forward a name: the <button> has no {...props},
// no aria-label expression, and no {children}/{label} child — so a `label` prop passed
// by a parent is silently dropped. cross-prop-drilled-name-lost flags the usage.
export default function SaveButton({ label }) {
  return (
    <button>
      <svg viewBox="0 0 16 16" />
    </button>
  );
}
