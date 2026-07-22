// Golden fixture entry: exercises every risky discovery/resolution surface at once —
// a tsconfig "@/*" ALIAS import, a barrel re-export, and an import into a
// .gitignored tree (src/generated/ — see the fixture's .gitignore).
import SaveButton from "@/components/SaveButton";
import { Card } from "./components";
import Gen from "./generated/Ignored";

export default function App() {
  return (
    <main id="main">
      <SaveButton label="Enregistrer" />
      <Card />
      <Gen label="Générer" />
    </main>
  );
}
