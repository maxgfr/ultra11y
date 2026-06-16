# Écrire / revoir du HTML/CSS accessible (sans régression)

Doctrine : **HTML natif sémantique d'abord, ARIA en dernier** (native-first,
ARIA last). N'ajoutez ARIA que lorsqu'aucun élément natif ne convient, et ne
dupliquez jamais une sémantique implicite (voir `references/forbidden-patterns.md`).

## Boucle de revue (inspirée du workflow RGAA)

1. **Structure & landmarks** — un seul `<main>`, `<header>/<nav>/<footer>`, titres
   `h1…h6` sans saut de niveau, listes réelles (`ul/ol/dl`).
2. **Noms accessibles** — chaque lien/bouton a un intitulé ; chaque champ a un
   `<label>` associé (pas un simple `placeholder`).
3. **Images & icônes** — `alt` pertinent si informatif, `alt=""` si décoratif,
   nom sur les contrôles icône-seule.
4. **Tableaux** — `<caption>`, `<th scope>`, association cellule↔en-tête.
5. **Clavier** — tout est atteignable et activable au clavier ; pas de `tabindex`
   positif ; focus visible (à vérifier au rendu) ; lien d'évitement fonctionnel.
6. **Langue & titre** — `<html lang>`, `<title>` pertinent, changements de langue indiqués.

## Détecter les régressions tôt

Avant de rendre le code, auditez l'extrait :
```
node scripts/ultra11y.mjs audit - < composant.html
node scripts/ultra11y.mjs audit "src/components/**/*.tsx" --jsx
```
Corrigez par ordre de priorité : sémantique native → noms/labels → clavier →
focus → sens non porté par la seule couleur/forme → médias.

## Definition of Done

Une modification est « terminée » quand : la sémantique native est correcte, les
noms accessibles sont présents, l'accès clavier est préservé, aucune régression
n'est introduite, et les points non vérifiables statiquement (contraste, focus
visible, zoom) sont **signalés comme risques résiduels** plutôt que supposés OK.

Pour le sens exact d'un critère : `node scripts/ultra11y.mjs criteria <id>`.
