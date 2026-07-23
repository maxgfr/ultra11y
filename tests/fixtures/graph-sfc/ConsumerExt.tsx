// EXTENSIONLESS imports of .svelte/.astro SFCs — resolving "./Sprocket"/"./Gadget"
// needs the engine's SFC candidate probe (JS_EXT_PROBES: .vue/.svelte/.astro/.html/.htm),
// the same mechanism already pinned for .vue in tests/fixtures/golden-graph/src/WidgetHost.tsx.
import Sprocket from "./Sprocket";
import Gadget from "./Gadget";

export default function ConsumerExt() {
  return (
    <>
      <Sprocket />
      <Gadget />
    </>
  );
}
