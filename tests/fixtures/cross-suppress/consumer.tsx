// References ids defined in defs.tsx — single-file rules see them as dangling, the graph
// proves they exist elsewhere (label-for-dangling, aria-ref-missing-id, empty-heading).
export default function Consumer() {
  return (
    <form>
      <label htmlFor="remote-field">Email</label>
      <input aria-describedby="remote-hint" />
      <h2 aria-labelledby="remote-heading"></h2>
    </form>
  );
}
