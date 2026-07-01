import { Button as DsfrButton } from "@codegouvfr/react-dsfr/Button";

// Renders ONLY a library component (opaque, no intrinsic control) and has no capture
// → a blind spot reached via the opaque-render signal, not hasControl.
export function Widget() {
  return <DsfrButton>Save</DsfrButton>;
}
