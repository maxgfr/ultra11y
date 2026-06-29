// Passes an accessible name to SaveButton, but SaveButton never forwards it to its
// <button> → the name is lost. The cross-file rule flags THIS usage.
import SaveButton from "./SaveButton";

export default function PagePropDrill() {
  return (
    <div>
      <SaveButton label="Enregistrer le document" />
    </div>
  );
}
