// Uses the icon-only IconButton without passing any accessible name → the
// cross-file rule flags THIS usage and points at the IconButton definition.
import IconButton from "./IconButton";

export default function PageBad() {
  return (
    <div>
      <IconButton onClick={() => {}} />
    </div>
  );
}
