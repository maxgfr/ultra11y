export function Button({ ...rest }: { [key: string]: unknown }) {
  return (
    <button {...rest}>
      <svg />
    </button>
  );
}
