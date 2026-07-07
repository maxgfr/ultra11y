// A realistic sign-in form. The status region is rendered in BOTH arms of a
// conditional with the same id="form-status" — the two <p> are mutually exclusive
// at runtime (only one is ever in the DOM), so the engine must NOT report a
// duplicate id. Regression fixture for the JSX branch-arm duplicate-id false positive.
import { useState } from "react";

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);

  return (
    <main>
      <h1>Se connecter</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setError(null);
        }}
      >
        <label htmlFor="email">Adresse e-mail</label>
        <input id="email" name="email" type="email" autoComplete="email" required />

        <label htmlFor="password">Mot de passe</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required />

        {error ? (
          <p id="form-status" role="alert">
            {error}
          </p>
        ) : (
          <p id="form-status" role="status">
            Prêt.
          </p>
        )}

        <button type="submit">Continuer</button>
      </form>
    </main>
  );
}
