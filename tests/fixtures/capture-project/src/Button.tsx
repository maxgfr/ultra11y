import { Icon } from "@codegouvfr/react-dsfr";

// Renders an intrinsic control (hasControl) AND a library component (opaque): the
// canonical case a rendered capture illuminates. Covered by a committed capture.
export function Button() {
  return (
    <button className="fr-btn">
      <Icon name="add" />
    </button>
  );
}
