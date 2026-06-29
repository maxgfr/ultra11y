// Renders a control but never forwards the `label` prop to it — name is dropped.
export default function SaveButton({ label }) {
  return (
    <button>
      <svg viewBox="0 0 16 16" />
    </button>
  );
}
