// A full document: declares <html lang> and a skip link whose target (#main) lives
// in the imported Main component — a cross-file skip-link target.
import Main from "./Main";

export default function Layout({ children }) {
  return (
    <html lang="fr">
      <body>
        <a href="#main">Aller au contenu</a>
        <Main>{children}</Main>
      </body>
    </html>
  );
}
