// An icon-only control that accepts a name via spread props. The intrinsic
// <button> here would trip the single-file icon-only-control-unnamed rule, but
// cross-aria-forwarding suppresses it (the control is nameable from the parent).
export default function IconButton({ onClick, ...rest }) {
  return (
    <button onClick={onClick} {...rest}>
      <svg viewBox="0 0 16 16" />
    </button>
  );
}
