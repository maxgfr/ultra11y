# Analyse inter-fichiers (`audit --graph`)

Par défaut, le moteur audite **chaque fichier isolément**. `--graph` (alias
`--cross-file`) ajoute une passe qui **résout les imports entre fichiers**,
construit un graphe de dépendances + de composants, et applique des règles que
seul le contexte inter-fichiers rend visibles — **sans navigateur** (pas de
Playwright). C'est complémentaire du moteur statique par fichier et du tier
dynamique optionnel (`scan`) : les trois alimentent le **même** `AuditResult`.

```
node scripts/ultra11y.mjs audit "src/**/*.tsx" --graph --json > audit.json
node scripts/ultra11y.mjs audit --changed --graph     # diff git, graphe sur tout le périmètre
```

## Comment ça marche (et pourquoi ça passe à l'échelle)

- **Vrai AST** : les `.jsx/.tsx` sont analysés via un vrai parseur JS/TS/JSX
  (`@babel/parser`, embarqué dans le bundle — toujours « no install »), pas par
  l'ancienne normalisation regex. Les composants `PascalCase` gardent leur casse
  (les règles par-fichier les ignorent ; seules les règles inter-fichiers les
  résolvent) ; les éléments natifs restent en minuscules.
- **Deux passes, mémoire bornée** : passe 1 — lire chaque fichier, en extraire un
  petit *nœud de graphe* (imports, composants + signaux du contrôle rendu, ids,
  `<html lang>`), puis **jeter** l'AST/Doc. Passe 2 — la boucle d'audit habituelle,
  qui exécute aussi les règles inter-fichiers avec le graphe en main. On ne garde
  jamais tout le dépôt en mémoire : O(nombre de fichiers) de petits nœuds.
- **`--changed --graph`** : le graphe est indexé sur **tout** le périmètre (pour
  résoudre une référence vers une définition non modifiée), mais seuls les
  fichiers du diff sont audités.

## Les règles inter-fichiers

- **`cross-icon-only-unnamed`** (1.1/6.2/7.1, *signalement*) : un composant qui
  rend un contrôle à **icône seule** et qui *peut* recevoir un nom
  (`{...props}` / `aria-label={…}` / `{children}`) est utilisé **sans nom**. Le
  signalement est posé **au point d'utilisation**, avec la **définition** du
  composant en `related`.
- **`cross-aria-forwarding`** (7.1, *suppression*) : un contrôle natif qui
  diffuse `{...props}` est nommable par son parent → on **supprime** le faux
  positif `button-empty-name`/`icon-only-control-unnamed`… sur la **définition**.
- **`cross-skip-link-target`** (12.7, *suppression*) : une ancre `href="#id"`
  dont la cible vit dans un **autre** fichier (layout/composant importé) → on
  supprime le faux « ancre cassée ». Cible introuvable partout = vrai positif
  laissé en place.
- **`cross-page-lang`** (8.3, *suppression*) : un `<html>` sans `lang` dont un
  layout/wrapper importé déclare la langue → suppression du faux positif.

## Bénéfice pour `fix`

Comme l'AST indexe le **fichier réel** (offsets exacts, `Doc` non *lossy*), `fix`
peut désormais appliquer ses codemods *sûrs* sur du JSX/TSX (suppression d'ARIA
redondant, insertion de `alt`/`lang`/`title`/`aria-label`), toujours derrière le
garde anti-régression. Les codemods qui **réécrivent** un nom d'attribut restent
désactivés sur JSX (pour ne pas transformer `tabIndex={5}` en `tabindex="0"`).

> Les signalements inter-fichiers se fondent dans le même `AuditResult` :
> `report`, `prd`, `check` et `verify` les consomment sans changement.
