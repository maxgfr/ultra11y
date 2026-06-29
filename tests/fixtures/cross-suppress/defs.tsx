// Defines the ids that sibling files reference cross-file.
const MODAL_ID = "cse-modal"; // referenced via a const-bound id={MODAL_ID} below
export default function Defs() {
  return (
    <>
      <div id="remote-hint">Saisissez votre email professionnel</div>
      <input id="remote-field" type="email" />
      <span id="remote-heading">Section principale</span>
      <dialog id={MODAL_ID}>Modal</dialog>
    </>
  );
}
