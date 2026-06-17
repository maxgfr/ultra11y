# Méthodologie & format du rapport

## Statuts par critère

- **C** — conforme (tous les tests applicables passent).
- **NC** — non conforme (au moins un test échoue ; un finding cite `fichier:ligne`).
- **NA** — non applicable (aucun élément concerné dans le périmètre — justifié).
- **À évaluer (manual)** — critère que le moteur ne peut pas trancher seul
  (rendu ou jugement) ; à compléter par une revue humaine.

## Taux de conformité

Taux de conformité = **critères conformes ÷ critères applicables × 100**.

Le moteur ne calcule que le **taux de conformité automatique**, sur le seul
sous-ensemble statique qu'il décide : `C ÷ (C + NC)`. La conformité RGAA complète
(seuil de 50 % / 100 % pour la déclaration d'accessibilité) exige de compléter
les critères « à évaluer ».

## Priorités des non-conformités

- 🔴 **Bloquant** — empêche l'accès au contenu/à une fonction (ex. alt manquant,
  champ non étiqueté, lien vide).
- 🟠 **Majeur** — fort impact mais contournable (ordre de titres, contraste,
  focus invisible).
- 🟡 **Mineur** — gêne légère (caption absent, ARIA redondant).

## Le partage du travail (statique / rendu / jugement)

ultra11y est honnête sur ce qu'un analyseur statique peut décider :

- **Automatisable (statique)** — décidé par le moteur : alt/lang/title manquants,
  champs sans label, `iframe` sans titre, liens/boutons vides, tables sans en-têtes,
  sauts de titres, `id` dupliqués, ARIA invalide/cassé, `tabindex` positif, autoplay…
- **Nécessite un rendu** — contraste calculé (3.2/3.3), focus visible (10.7),
  zoom/reflow (10.4/10.11/10.12), contenus au survol/focus (10.13). **Hors moteur** :
  à vérifier dans un navigateur, signalé en risque résiduel.
- **Jugement humain** — pertinence de l'alt (1.3), intitulé de lien en contexte (6.1),
  ordre de lecture/tabulation, cohérence de navigation, exactitude des sous-titres…

Voir la table complète des 106 critères dans `references/criteria.md`.

## Format du rapport (`report`)

`audits/rgaa-AAAA-MM-JJ.md` contient 5 sections : (1) synthèse par thématique
(C/NC/NA/à évaluer), (2) non-conformités par priorité, (3) critères conformes,
(4) critères non applicables justifiés, (5) critères à évaluer manuellement.

## Mondial : RGAA primaire, WCAG visible

Le RGAA reste la clé interne du moteur. Pour une lecture **internationale**,
`report --standard wcag` (et `criteria --standard wcag`) ré-affiche l'audit **par
critère de succès WCAG 2.1 niveau AA**, à partir des correspondances que chaque
critère RGAA porte déjà (`wcag-AAAA-MM-JJ.md`). C'est une **vue de présentation** :
elle n'est jamais passée par `check`/`verify` (ces gates raisonnent sur les
identifiants RGAA à 2 segments du rapport canonique).

**Équivalence** : EN 301 549 §9 (Union européenne) et la Section 508 révisée
(États-Unis) intègrent WCAG 2.1 niveau AA par référence ; la vue WCAG couvre donc les
exigences « web » de ces référentiels. Le jeu de données ne contient pas de critère
propre à WCAG 2.2 — la vue est annoncée comme **2.1 AA**.
