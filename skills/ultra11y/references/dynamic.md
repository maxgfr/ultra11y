# Tier dynamique (Docker + axe-core) — optionnel

Le moteur statique laisse certains critères en « à évaluer » parce qu'ils exigent
un **rendu** : contraste calculé (3.2/3.3), focus visible (10.7), reflow/zoom
(10.4/10.11). Le tier dynamique les décide en lançant **axe-core dans un vrai
navigateur headless** (Playwright), packagé dans une image Docker auto-construite
au premier usage — le skill reste un bundle unique (runner + Dockerfile embarqués).

## Prérequis

Docker doit tourner. Sans Docker, `scan` échoue avec un message explicite ; le
reste du skill (audit statique) fonctionne sans Docker.

## Utilisation

```
# audit dynamique seul (URL ou fichier HTML)
node scripts/ultra11y.mjs scan https://exemple.fr --json

# fusion avec un audit statique : les critères "à évaluer" passent en C/NC
node scripts/ultra11y.mjs audit "src/**/*.html" --out audits --json > /dev/null
node scripts/ultra11y.mjs scan https://exemple.fr --merge audits/audit-latest.json --out audits
node scripts/ultra11y.mjs report --in audits/audit-latest.json --out audits
```

La première exécution construit l'image (`node:22` + Playwright/Chromium + axe-core)
— quelques minutes ; les suivantes sont immédiates.

## Ce que le tier dynamique apporte

- **Contraste réel (3.2/3.3)** — axe calcule les couleurs rendues (le gain principal).
- **Reflow (10.11)** — vérifie l'absence de défilement horizontal à 320px de large.
- **Cross-check** — axe revalide au rendu les critères structurels (alt, labels,
  ARIA, titres…) ; un finding au rendu est **autoritatif** et passe le critère en NC.

Les findings axe sont mappés aux critères RGAA via une table embarquée
(`axe-rule → critère`). À la fusion (`--merge`), un critère `manual` que le tier
décide sort des risques résiduels et devient `C`/`NC`.

## Limites

axe ne couvre pas tout le « rendu » : la **visibilité du focus** (10.7), le zoom
texte 200% (10.4 au-delà du blocage viewport) et certains contenus au survol
restent à vérifier manuellement (toujours signalés en risque résiduel). pa11y peut
être ajouté comme seconde source si besoin.
