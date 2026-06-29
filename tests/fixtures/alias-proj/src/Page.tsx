// Imports SaveButton via the tsconfig "@/*" ALIAS (not a relative path) and passes a
// name prop. If alias resolution works, the graph resolves the usage to SaveButton and
// cross-prop-drilled-name-lost fires; if not, no cross finding appears.
import SaveButton from "@/SaveButton";

export default function Page() {
  return (
    <main id="main">
      <SaveButton label="Enregistrer" />
    </main>
  );
}
