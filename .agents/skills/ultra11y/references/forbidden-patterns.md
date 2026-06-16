# Anti-patterns interdits (HTML/CSS accessible)

15 pièges fréquents. Format : ❌ mauvais → pourquoi → ✅ correction native →
critère RGAA (règle moteur si détectée statiquement).

### 1. `<div>`/`<span>` cliquable
❌ `<div onClick={…}>` → non focalisable, non activable au clavier, sans rôle.
✅ `<button type="button">` natif. RGAA 7.1/7.3 (`clickable-noninteractive`).

### 2. `<html>` sans `lang`
❌ langue par défaut non déclarée → mauvaise restitution lecteur d'écran.
✅ `<html lang="fr">`. RGAA 8.3 (`html-lang-missing`).

### 3. Page sans `<title>` (ou vide)
❌ titre d'onglet/historique manquant. ✅ `<title>` pertinent. RGAA 8.5 (`title-missing-empty`).

### 4. Lien ou bouton vide
❌ `<a href="/"></a>`, `<button></button>` → aucun nom accessible.
✅ texte visible, ou `aria-label`. RGAA 6.2 / 7.1 (`link-empty-name`, `button-empty-name`).

### 5. Contrôle icône-seule non nommé
❌ `<button><svg/></button>` sans nom. ✅ `aria-label` ou texte masqué visuellement.
RGAA 1.1/6.2/7.1 (`icon-only-control-unnamed`).

### 6. `<label>` non associé au champ
❌ étiquette visuelle sans `for`/imbrication. ✅ `<label for="id">` ou enveloppe.
RGAA 11.1 (`control-label-missing`).

### 7. `placeholder` en guise d'étiquette
❌ placeholder seul → disparaît à la saisie, pas un label. ✅ vrai `<label>`.
RGAA 11.1 (`placeholder-as-label`).

### 8. `outline: none` / `outline: 0` sur un élément focusable
❌ supprime l'indicateur de focus clavier. ✅ conserver/styler un focus visible.
RGAA 10.7 (needs-rendering — à vérifier manuellement).

### 9. `tabindex` positif
❌ `tabindex="1"` casse l'ordre logique du DOM. ✅ `tabindex="0"` ou rien.
RGAA 12.8 (`positive-tabindex`).

### 10. Texte porteur d'information en image
❌ image-texte sans alternative. ✅ vrai texte stylé en CSS. RGAA 1.8 (jugement).

### 11. Sens porté uniquement par CSS (`::before`/`::after`)
❌ information injectée par les seuls styles. ✅ texte dans le HTML. RGAA 10.x (jugement/rendu).

### 12. Lien d'évitement masqué par `display:none`
❌ cible inexistante ou skip-link non focalisable. ✅ cible réelle + visible au focus.
RGAA 12.7 (`skip-link-target-missing` pour la cible).

### 13. Navigation non structurée en liste
❌ suite de liens sans `<ul>`. ✅ `<nav><ul><li>…`. RGAA 12.x (jugement).

### 14. Tableau de données sans en-têtes
❌ `<table>` sans `<th>`/`scope`/`<caption>`. ✅ en-têtes + `scope` + caption.
RGAA 5.4/5.6/5.7 (`data-table-no-headers`, `table-caption-missing`).

### 15. ARIA redondant ou cassé
❌ `<button role="button">`, `aria-labelledby="id-inexistant"`, rôle inventé.
✅ sémantique native ; références ARIA valides. RGAA 7.1 (`redundant-aria`,
`aria-ref-missing-id`, `invalid-aria-role`).
