// An icon-only button whose name is computed INTERNALLY (a dynamic aria-label that is
// always non-empty) — the component is self-named, so the cross-file rule must NOT flag
// the call site as "icon-only used without a name".
function QtyButton({ kind }: { kind: "plus" | "minus" }) {
  return (
    <button type="submit" aria-label={kind === "plus" ? "Increase quantity" : "Reduce quantity"}>
      <PlusIcon />
    </button>
  );
}

export default function Page() {
  return <QtyButton kind="plus" />;
}
