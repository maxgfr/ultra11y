// A control that already carries a LITERAL accessible name; a name prop passed by a
// parent is dead code, not a lost name — cross-prop-drilled-name-lost must not fire.
export default function LiteralNamed(props) {
  return (
    <button onClick={props.onClick} aria-label="Close">
      <svg viewBox="0 0 16 16" />
    </button>
  );
}
