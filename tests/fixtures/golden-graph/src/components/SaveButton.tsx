// Renders an icon-only control and never forwards the `label` prop — the passed
// name is dropped (cross-prop-drilled-name-lost fires on the App.tsx usage IF the
// "@/components/SaveButton" alias import resolved).
export default function SaveButton({ label }) {
  return (
    <button>
      <svg viewBox="0 0 16 16" />
    </button>
  );
}
