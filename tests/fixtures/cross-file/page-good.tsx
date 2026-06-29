// Passes an accessible name to the icon-only IconButton → no cross-file finding.
import IconButton from "./IconButton";

export default function PageGood() {
  return (
    <div>
      <IconButton aria-label="Fermer" onClick={() => {}} />
    </div>
  );
}
