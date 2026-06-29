// Renders a DSFR library component (opaque output) plus a local and an aliased one.
import { Button } from "@codegouvfr/react-dsfr/Button";
import Card from "./Card";
import { Foo } from "@/components/Foo";

export default function Page() {
  return (
    <div>
      <Button iconId="fr-icon-add-line" />
      <Card />
      <Foo />
    </div>
  );
}
