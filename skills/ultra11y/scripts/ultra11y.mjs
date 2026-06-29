#!/usr/bin/env node

// src/cli.ts
import { realpathSync, writeFileSync as writeFileSync7, mkdirSync as mkdirSync5, existsSync as existsSync4 } from "fs";
import { join as join9, relative as relative2, sep as sep2 } from "path";
import { fileURLToPath, pathToFileURL } from "url";

// src/types.ts
var VERSION = "2.0.0";
var SCHEMA_VERSION = 1;

// src/audit.ts
import { createHash } from "crypto";

// src/data/rgaa.json
var rgaa_default = {
  rgaaVersion: "4.1.2",
  wcagVersion: "2.1",
  source: "https://github.com/DISIC/accessibilite.numerique.gouv.fr",
  license: "Licence Ouverte / Etalab 2.0",
  themes: [
    {
      number: 1,
      name: "Images",
      count: 9
    },
    {
      number: 2,
      name: "Cadres",
      count: 2
    },
    {
      number: 3,
      name: "Couleurs",
      count: 3
    },
    {
      number: 4,
      name: "Multim\xE9dia",
      count: 13
    },
    {
      number: 5,
      name: "Tableaux",
      count: 8
    },
    {
      number: 6,
      name: "Liens",
      count: 2
    },
    {
      number: 7,
      name: "Scripts",
      count: 5
    },
    {
      number: 8,
      name: "\xC9l\xE9ments obligatoires",
      count: 10
    },
    {
      number: 9,
      name: "Structuration de l\u2019information",
      count: 4
    },
    {
      number: 10,
      name: "Pr\xE9sentation de l\u2019information",
      count: 14
    },
    {
      number: 11,
      name: "Formulaires",
      count: 13
    },
    {
      number: 12,
      name: "Navigation",
      count: 11
    },
    {
      number: 13,
      name: "Consultation",
      count: 12
    }
  ],
  criteria: [
    {
      id: "1.1",
      theme: 1,
      title: "Chaque [image porteuse d\u2019information](#image-porteuse-d-information) a-t-elle une [alternative textuelle](#alternative-textuelle-image)\xA0?",
      titlePlain: "Chaque image porteuse d\u2019information a-t-elle une alternative textuelle\xA0?",
      tests: {
        "1": [
          'Chaque image (balise `<img>` ou balise poss\xE9dant l\u2019attribut WAI-ARIA `role="img"`) [porteuse d\u2019information](#image-porteuse-d-information) a-t-elle une [alternative textuelle](#alternative-textuelle-image)\xA0?'
        ],
        "2": [
          "Chaque [zone](#zone-d-une-image-reactive) d\u2019une [image r\xE9active](#image-reactive) (balise `<area>`) [porteuse d\u2019information](#image-porteuse-d-information) a-t-elle une [alternative textuelle](#alternative-textuelle-image)\xA0?"
        ],
        "3": [
          'Chaque bouton de type `image` (balise `<input>` avec l\u2019attribut `type="image"`) a-t-il une [alternative textuelle](#alternative-textuelle-image)\xA0?'
        ],
        "4": [
          "Chaque [zone cliquable](#zone-cliquable) d\u2019une image r\xE9active c\xF4t\xE9 serveur est-elle doubl\xE9e d\u2019un m\xE9canisme utilisable quel que soit le dispositif de pointage utilis\xE9 et permettant d\u2019acc\xE9der \xE0 la m\xEAme destination\xA0?"
        ],
        "5": [
          "Chaque image vectorielle (balise `<svg>`) [porteuse d\u2019information](#image-porteuse-d-information), v\xE9rifie-t-elle ces conditions\xA0?",
          'La balise `<svg>` poss\xE8de un attribut WAI-ARIA `role="img"`\xA0;',
          "La balise `<svg>` a une [alternative textuelle](#alternative-textuelle-image)."
        ],
        "6": [
          'Chaque [image objet](#image-objet) (balise `<object>` avec l\u2019attribut `type="image/\u2026"`) [porteuse d\u2019information](#image-porteuse-d-information), v\xE9rifie-t-elle une de ces conditions\xA0?',
          'La balise `<object>` poss\xE8de une [alternative textuelle](#alternative-textuelle-image) et un attribut `role="img"`\xA0;',
          "L\u2019\xE9l\xE9ment `<object>` est imm\xE9diatement suivi d\u2019un [lien ou bouton adjacent](#lien-ou-bouton-adjacent) permettant d\u2019acc\xE9der \xE0 un [contenu alternatif](#contenu-alternatif)\xA0;",
          "Un m\xE9canisme permet \xE0 l\u2019utilisateur de remplacer l\u2019\xE9l\xE9ment `<object>` par un [contenu alternatif](#contenu-alternatif)."
        ],
        "7": [
          'Chaque image embarqu\xE9e (balise `<embed>` avec l\u2019attribut `type="image/\u2026"`) [porteuse d\u2019information](#image-porteuse-d-information), v\xE9rifie-t-elle une de ces conditions\xA0?',
          'La balise `<embed>` poss\xE8de une [alternative textuelle](#alternative-textuelle-image) et un attribut `role="img"`\xA0;',
          "L\u2019\xE9l\xE9ment `<embed>` est imm\xE9diatement suivi d\u2019un [lien ou bouton adjacent](#lien-ou-bouton-adjacent) permettant d\u2019acc\xE9der \xE0 un [contenu alternatif](#contenu-alternatif)\xA0;",
          "Un m\xE9canisme permet \xE0 l\u2019utilisateur de remplacer l\u2019\xE9l\xE9ment `<embed>` par un [contenu alternatif](#contenu-alternatif)."
        ],
        "8": [
          "Chaque image bitmap (balise `<canvas>`) [porteuse d\u2019information](#image-porteuse-d-information), v\xE9rifie-t-elle une de ces conditions\xA0?",
          'La balise `<canvas>` poss\xE8de une [alternative textuelle](#alternative-textuelle-image) et un attribut `role="img"`\xA0;',
          "Un [contenu alternatif](#contenu-alternatif) est pr\xE9sent entre les balises `<canvas>` et `</canvas>`\xA0;",
          "L\u2019\xE9l\xE9ment `<canvas>` est imm\xE9diatement suivi d\u2019un [lien ou bouton adjacent](#lien-ou-bouton-adjacent) permettant d\u2019acc\xE9der \xE0 un [contenu alternatif](#contenu-alternatif)\xA0;",
          "Un m\xE9canisme permet \xE0 l\u2019utilisateur de remplacer l\u2019\xE9l\xE9ment `<canvas>` par un [contenu alternatif](#contenu-alternatif)."
        ]
      },
      wcag: ["1.1.1 Non-text Content (A)"],
      techniques: ["H36", "H37", "H53", "F65", "H24"],
      automatability: "static",
      ruleIds: ["img-alt-missing", "canvas-fallback-missing", "icon-only-control-unnamed"]
    },
    {
      id: "1.2",
      theme: 1,
      title: "Chaque [image de d\xE9coration](#image-de-decoration) est-elle correctement ignor\xE9e par les technologies d\u2019assistance\xA0?",
      titlePlain: "Chaque image de d\xE9coration est-elle correctement ignor\xE9e par les technologies d\u2019assistance\xA0?",
      tests: {
        "1": [
          "Chaque image (balise `<img>`) [de d\xE9coration](#image-de-decoration), sans [l\xE9gende](#legende-d-image), v\xE9rifie-t-elle une de ces conditions\xA0?",
          'La balise `<img>` poss\xE8de un attribut `alt` vide (`alt=""`) et est d\xE9pourvue de tout autre attribut permettant de fournir une [alternative textuelle](#alternative-textuelle-image)\xA0;',
          'La balise `<img>` poss\xE8de un attribut WAI-ARIA `aria-hidden="true"` ou `role="presentation"`.'
        ],
        "2": [
          "Chaque [zone non cliquable](#zone-non-cliquable) (balise `<area>` sans attribut `href`) [de d\xE9coration](#image-de-decoration), v\xE9rifie-t-elle une de ces conditions\xA0?",
          'La balise `<area>` poss\xE8de un attribut `alt` vide (`alt=""`) et est d\xE9pourvue de tout autre attribut permettant de fournir une [alternative textuelle](#alternative-textuelle-image)\xA0;',
          'La balise `<area>` poss\xE8de un attribut WAI-ARIA `aria-hidden="true"` ou `role="presentation"`.'
        ],
        "3": [
          'Chaque [image objet](#image-objet) (balise `<object>` avec l\u2019attribut `type="image/\u2026"`) [de d\xE9coration](#image-de-decoration), sans [l\xE9gende](#legende-d-image), v\xE9rifie-t-elle ces conditions\xA0?',
          'La balise `<object>` poss\xE8de un attribut WAI-ARIA `aria-hidden="true"`\xA0;',
          "La balise `<object>` est d\xE9pourvue d\u2019alternative textuelle\xA0;",
          "Il n\u2019y a aucun texte faisant office d\u2019alternative textuelle entre `<object>` et `</object>`."
        ],
        "4": [
          "Chaque image vectorielle (balise `<svg>`) [de d\xE9coration](#image-de-decoration), sans [l\xE9gende](#legende-d-image), v\xE9rifie-t-elle ces conditions\xA0?",
          'La balise `<svg>` poss\xE8de un attribut WAI-ARIA `aria-hidden="true"`\xA0;',
          "La balise `<svg>` et ses enfants sont d\xE9pourvus d\u2019[alternative textuelle](#alternative-textuelle-image)\xA0;",
          "Les balises `<title>` et `<desc>` sont absentes ou vides\xA0;",
          "La balise `<svg>` et ses enfants sont d\xE9pourvus d\u2019attribut `title`."
        ],
        "5": [
          "Chaque image bitmap (balise `<canvas>`) [de d\xE9coration](#image-de-decoration), sans [l\xE9gende](#legende-d-image), v\xE9rifie-t-elle ces conditions\xA0?",
          'La balise `<canvas>` poss\xE8de un attribut WAI-ARIA `aria-hidden="true"`\xA0;',
          "La balise `<canvas>` et ses enfants sont d\xE9pourvus d\u2019[alternative textuelle](#alternative-textuelle-image)\xA0;",
          "Il n\u2019y a aucun texte faisant office d\u2019[alternative textuelle](#alternative-textuelle-image) entre `<canvas>` et `</canvas>`."
        ],
        "6": [
          'Chaque image embarqu\xE9e (balise `<embed>` avec l\u2019attribut `type="image/\u2026"`) [de d\xE9coration](#image-de-decoration), sans [l\xE9gende](#legende-d-image), v\xE9rifie-t-elle ces conditions\xA0?',
          'La balise `<embed>` poss\xE8de un attribut WAI-ARIA `aria-hidden="true"`\xA0;',
          "La balise `<embed>` et ses enfants sont d\xE9pourvus d\u2019[alternative textuelle](#alternative-textuelle-image)."
        ]
      },
      wcag: ["1.1.1 Non-text Content (A)", "4.1.2 Name, Role, Value (A)"],
      techniques: ["H67", "G196", "C9", "F39", "F38", "ARIA4", "ARIA10"],
      technicalNote: [
        "Lorsqu'une image est associ\xE9e \xE0 une [l\xE9gende](#legende-d-image), la note technique WCAG recommande de pr\xE9voir syst\xE9matiquement une [alternative textuelle](#alternative-textuelle-image) (cf. crit\xE8re 1.9). Dans ce cas le crit\xE8re 1.2 est non applicable.",
        "Dans le cas d'une image vectorielle (balise `<svg>`) de d\xE9coration qui serait affich\xE9e au travers d'un \xE9l\xE9ment `<use href=\"\u2026\">` enfant de l'\xE9l\xE9ment `<svg>`, le test 1.2.4 s'appliquera \xE9galement \xE0 l'\xE9l\xE9ment `<svg>` associ\xE9e par le biais de l'\xE9l\xE9ment `<use>`.",
        'Un attribut WAI-ARIA `role="presentation"` peut \xEAtre utilis\xE9 sur les images de d\xE9coration et les zones non cliquables de d\xE9coration. Le r\xF4le `"none"` introduit en ARIA 1.1 et synonyme du r\xF4le `"presentation"` peut \xEAtre aussi utilis\xE9. Il reste pr\xE9f\xE9rable cependant d\'utiliser le r\xF4le `"presentation"` en attendant un support satisfaisant du r\xF4le `"none"`.'
      ],
      automatability: "static",
      ruleIds: ["decorative-alt-misuse"]
    },
    {
      id: "1.3",
      theme: 1,
      title: "Pour chaque image [porteuse d\u2019information](#image-porteuse-d-information) ayant une [alternative textuelle](#alternative-textuelle-image), cette alternative est-elle pertinente (hors cas particuliers)\xA0?",
      titlePlain: "Pour chaque image porteuse d\u2019information ayant une alternative textuelle, cette alternative est-elle pertinente (hors cas particuliers)\xA0?",
      tests: {
        "1": [
          'Chaque image (balise `<img>` ou balise poss\xE9dant l\u2019attribut WAI-ARIA `role="img"`) [porteuse d\u2019information](#image-porteuse-d-information), ayant une [alternative textuelle](#alternative-textuelle-image), cette alternative est-elle pertinente (hors cas particuliers)\xA0?',
          "S\u2019il est pr\xE9sent, le contenu de l\u2019attribut `alt` est pertinent\xA0;",
          "S\u2019il est pr\xE9sent, le contenu de l\u2019attribut `title` est pertinent\xA0;",
          "S\u2019il est pr\xE9sent, le contenu de l\u2019attribut WAI-ARIA `aria-label` est pertinent\xA0;",
          "S\u2019il est pr\xE9sent, le [passage de texte](#passage-de-texte-lie-par-aria-labelledby-ou-aria-describedby) associ\xE9 via l\u2019attribut WAI-ARIA `aria-labelledby` est pertinent."
        ],
        "2": [
          "Pour chaque [zone](#zone-d-une-image-reactive) (balise `<area>`) d\u2019une [image r\xE9active](#image-reactive) [porteuse d\u2019information](#image-porteuse-d-information), ayant une [alternative textuelle](#alternative-textuelle-image), cette alternative est-elle pertinente (hors cas particuliers)\xA0?",
          "S\u2019il est pr\xE9sent, le contenu de l\u2019attribut `alt` est pertinent\xA0;",
          "S\u2019il est pr\xE9sent, le contenu de l\u2019attribut `title` est pertinent\xA0;",
          "S\u2019il est pr\xE9sent, le contenu de l\u2019attribut WAI-ARIA `aria-label` est pertinent\xA0;",
          "S\u2019il est pr\xE9sent, le [passage de texte](#passage-de-texte-lie-par-aria-labelledby-ou-aria-describedby) associ\xE9 via l\u2019attribut WAI-ARIA `aria-labelledby` est pertinent."
        ],
        "3": [
          'Pour chaque [bouton](#bouton-formulaire) de type `image` (balise `<input>` avec l\u2019attribut `type="image"`), ayant une [alternative textuelle](#alternative-textuelle-image), cette alternative est-elle pertinente (hors cas particuliers)\xA0?',
          "S\u2019il est pr\xE9sent, le contenu de l\u2019attribut `alt` est pertinent\xA0;",
          "S\u2019il est pr\xE9sent, le contenu de l\u2019attribut `title` est pertinent\xA0;",
          "S\u2019il est pr\xE9sent, le contenu de l\u2019attribut WAI-ARIA `aria-label` est pertinent\xA0;",
          "S\u2019il est pr\xE9sent, le [passage de texte](#passage-de-texte-lie-par-aria-labelledby-ou-aria-describedby) associ\xE9 via l\u2019attribut WAI-ARIA `aria-labelledby` est pertinent."
        ],
        "4": [
          'Pour chaque [image objet](#image-objet) (balise `<object>` avec l\u2019attribut `type="image/\u2026"`) [porteuse d\u2019information](#image-porteuse-d-information), ayant une [alternative textuelle](#alternative-textuelle-image) ou un [contenu alternatif](#contenu-alternatif), cette alternative est-elle pertinente (hors cas particuliers)\xA0?',
          "S\u2019il est pr\xE9sent, le contenu de l\u2019attribut `title` est pertinent\xA0;",
          "S\u2019il est pr\xE9sent, le contenu de l\u2019attribut WAI-ARIA `aria-label` est pertinent\xA0;",
          "S\u2019il est pr\xE9sent, le [passage de texte](#passage-de-texte-lie-par-aria-labelledby-ou-aria-describedby) associ\xE9 via l\u2019attribut WAI-ARIA `aria-labelledby` est pertinent\xA0;",
          "S\u2019il est pr\xE9sent le [contenu alternatif](#contenu-alternatif) est pertinent."
        ],
        "5": [
          'Pour chaque image embarqu\xE9e (balise `<embed>` avec l\u2019attribut `type="image/\u2026"`) [porteuse d\u2019information](#image-porteuse-d-information), ayant une [alternative textuelle](#alternative-textuelle-image) ou un [contenu alternatif](#contenu-alternatif), cette alternative est-elle pertinente (hors cas particuliers)\xA0?',
          "S\u2019il est pr\xE9sent, le contenu de l\u2019attribut `title` est pertinent\xA0;",
          "S\u2019il est pr\xE9sent, le contenu de l\u2019attribut WAI-ARIA `aria-label` est pertinent\xA0;",
          "S\u2019il est pr\xE9sent, le [passage de texte](#passage-de-texte-lie-par-aria-labelledby-ou-aria-describedby) associ\xE9 via l\u2019attribut WAI-ARIA `aria-labelledby` est pertinent\xA0;",
          "S\u2019il est pr\xE9sent le [contenu alternatif](#contenu-alternatif) est pertinent."
        ],
        "6": [
          "Pour chaque image vectorielle (balise `<svg>`) [porteuse d\u2019information](#image-porteuse-d-information), ayant une [alternative textuelle](#alternative-textuelle-image), cette alternative est-elle pertinente (hors cas particuliers)\xA0?",
          "S\u2019il est pr\xE9sent, le contenu de l'\xE9l\xE9ment `<title>` est pertinent\xA0;",
          "S\u2019il est pr\xE9sent, le contenu de l\u2019attribut WAI-ARIA `aria-label` est pertinent\xA0;",
          "S\u2019il est pr\xE9sent, le [passage de texte](#passage-de-texte-lie-par-aria-labelledby-ou-aria-describedby) associ\xE9 via l\u2019attribut WAI-ARIA `aria-labelledby` est pertinent."
        ],
        "7": [
          "Pour chaque image bitmap (balise `<canvas>`) [porteuse d\u2019information](#image-porteuse-d-information), ayant une [alternative textuelle](#alternative-textuelle-image) ou un [contenu alternatif](#contenu-alternatif), cette alternative est-elle pertinente (hors cas particuliers)\xA0?",
          "S\u2019il est pr\xE9sent, le contenu de l\u2019attribut `title` est pertinent\xA0;",
          "S\u2019il est pr\xE9sent, le contenu de l\u2019attribut WAI-ARIA `aria-label` est pertinent\xA0;",
          "S\u2019il est pr\xE9sent, le [passage de texte](#passage-de-texte-lie-par-aria-labelledby-ou-aria-describedby) associ\xE9 via l\u2019attribut WAI-ARIA `aria-labelledby` est pertinent\xA0;",
          "S\u2019il est pr\xE9sent le [contenu alternatif](#contenu-alternatif) est pertinent."
        ],
        "8": [
          "Pour chaque image bitmap (balise `<canvas>`) [porteuse d\u2019information](#image-porteuse-d-information) et ayant  un [contenu alternatif](#contenu-alternatif) entre `<canvas>` et `</canvas>`, ce [contenu alternatif](#contenu-alternatif) est-il [correctement restitu\xE9 par les technologies d\u2019assistance](#correctement-restitue-par-les-technologies-d-assistance)\xA0?"
        ],
        "9": [
          "Pour chaque image [porteuse d\u2019information](#image-porteuse-d-information) et ayant une [alternative textuelle](#alternative-textuelle-image), l\u2019[alternative textuelle](#alternative-textuelle-image) est-elle [courte et concise](#alternative-courte-et-concise) (hors cas particuliers)\xA0?"
        ]
      },
      wcag: ["1.1.1 Non-text Content (A)", "4.1.2 Name, Role, Value (A)"],
      techniques: ["G94", "G95", "F30", "F71", "G196", "ARIA6", "ARIA9", "ARIA10"],
      particularCases: [
        "Il existe une gestion de cas particuliers lorsque l\u2019image est utilis\xE9e comme [CAPTCHA](#captcha) ou comme [image-test](#image-test). Dans cette situation, o\xF9 il n\u2019est pas possible de donner une alternative pertinente sans d\xE9truire l\u2019objet du CAPTCHA ou du test, le crit\xE8re est non applicable.",
        "Note\xA0: le cas des CAPTCHA et des images-test est trait\xE9 de mani\xE8re sp\xE9cifique par le crit\xE8re 1.4."
      ],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "1.4",
      theme: 1,
      title: "Pour chaque image utilis\xE9e comme [CAPTCHA](#captcha) ou comme [image-test](#image-test), ayant une [alternative textuelle](#alternative-textuelle-image), cette alternative permet-elle d\u2019identifier la nature et la fonction de l\u2019image\xA0?",
      titlePlain: "Pour chaque image utilis\xE9e comme CAPTCHA ou comme image-test, ayant une alternative textuelle, cette alternative permet-elle d\u2019identifier la nature et la fonction de l\u2019image\xA0?",
      tests: {
        "1": [
          "Pour chaque image (balise `<img>`) utilis\xE9e comme [CAPTCHA](#captcha) ou comme [image-test](#image-test), ayant une [alternative textuelle](#alternative-textuelle-image), cette alternative est-elle pertinente\xA0?",
          "S\u2019il est pr\xE9sent, le contenu de l\u2019attribut `alt` est pertinent\xA0;",
          "S\u2019il est pr\xE9sent, le contenu de l\u2019attribut `title` est pertinent\xA0;",
          "S\u2019il est pr\xE9sent, le contenu de l\u2019attribut WAI-ARIA `aria-label` est pertinent\xA0;",
          "S\u2019il est pr\xE9sent, le [passage de texte](#passage-de-texte-lie-par-aria-labelledby-ou-aria-describedby) associ\xE9 via l\u2019attribut WAI-ARIA `aria-labelledby` est pertinent."
        ],
        "2": [
          "Pour chaque zone (balise `<area>`) d\u2019une image r\xE9active utilis\xE9e comme [CAPTCHA](#captcha) ou comme [image-test](#image-test), ayant une [alternative textuelle](#alternative-textuelle-image), cette alternative est-elle pertinente\xA0?",
          "S\u2019il est pr\xE9sent, le contenu de l\u2019attribut `alt` est pertinent\xA0;",
          "S\u2019il est pr\xE9sent, le contenu de l\u2019attribut `title` est pertinent\xA0;",
          "S\u2019il est pr\xE9sent, le contenu de l\u2019attribut WAI-ARIA `aria-label` est pertinent\xA0;",
          "S\u2019il est pr\xE9sent, le [passage de texte](#passage-de-texte-lie-par-aria-labelledby-ou-aria-describedby) associ\xE9 via l\u2019attribut WAI-ARIA `aria-labelledby` est pertinent."
        ],
        "3": [
          'Pour chaque [bouton](#bouton-formulaire) de type image (balise `<input>` avec l\u2019attribut `type="image"`) utilis\xE9 comme [CAPTCHA](#captcha) ou comme [image-test](#image-test), ayant une [alternative textuelle](#alternative-textuelle-image), cette alternative est-elle pertinente\xA0?',
          "S\u2019il est pr\xE9sent, le contenu de l\u2019attribut `alt` est pertinent\xA0;",
          "S\u2019il est pr\xE9sent, le contenu de l\u2019attribut `title` est pertinent\xA0;",
          "S\u2019il est pr\xE9sent, le contenu de l\u2019attribut WAI-ARIA `aria-label` est pertinent\xA0;",
          "S\u2019il est pr\xE9sent, le [passage de texte](#passage-de-texte-lie-par-aria-labelledby-ou-aria-describedby) associ\xE9 via l\u2019attribut WAI-ARIA `aria-labelledby` est pertinent."
        ],
        "4": [
          'Pour chaque [image objet](#image-objet) (balise `<object>` avec l\u2019attribut `type="image/\u2026"`) utilis\xE9e comme [CAPTCHA](#captcha) ou comme [image-test](#image-test), ayant une [alternative textuelle](#alternative-textuelle-image) ou un [contenu alternatif](#contenu-alternatif), cette alternative est-elle pertinente\xA0?',
          "S\u2019il est pr\xE9sent, le contenu de l\u2019attribut `alt` est pertinent\xA0;",
          "S\u2019il est pr\xE9sent, le contenu de l\u2019attribut `title` est pertinent\xA0;",
          "S\u2019il est pr\xE9sent, le contenu de l\u2019attribut WAI-ARIA `aria-label` est pertinent\xA0;",
          "S\u2019il est pr\xE9sent, le [passage de texte](#passage-de-texte-lie-par-aria-labelledby-ou-aria-describedby) associ\xE9 via l\u2019attribut WAI-ARIA `aria-labelledby` est pertinent\xA0;",
          "S\u2019il est pr\xE9sent le [contenu alternatif](#contenu-alternatif) est pertinent."
        ],
        "5": [
          'Pour chaque image embarqu\xE9e (balise `<embed>` avec l\u2019attribut `type="image/\u2026"`) utilis\xE9e comme [CAPTCHA](#captcha) ou comme [image-test](#image-test), ayant une [alternative textuelle](#alternative-textuelle-image) ou un [contenu alternatif](#contenu-alternatif), cette alternative est-elle pertinente\xA0?',
          "S\u2019il est pr\xE9sent, le contenu de l\u2019attribut `alt` est pertinent\xA0;",
          "S\u2019il est pr\xE9sent, le contenu de l\u2019attribut `title` est pertinent\xA0;",
          "S\u2019il est pr\xE9sent, le contenu de l\u2019attribut WAI-ARIA `aria-label` est pertinent\xA0;",
          "S\u2019il est pr\xE9sent, le [passage de texte](#passage-de-texte-lie-par-aria-labelledby-ou-aria-describedby) associ\xE9 via l\u2019attribut WAI-ARIA `aria-labelledby` est pertinent\xA0;",
          "S\u2019il est pr\xE9sent le [contenu alternatif](#contenu-alternatif) est pertinent."
        ],
        "6": [
          "Pour chaque image vectorielle (balise `<svg>`) utilis\xE9e comme [CAPTCHA](#captcha) ou comme [image-test](#image-test), ayant une [alternative textuelle](#alternative-textuelle-image), cette alternative est-elle pertinente\xA0?",
          "S\u2019il est pr\xE9sent, le contenu de l\u2019attribut `alt` est pertinent\xA0;",
          "S\u2019il est pr\xE9sent, le contenu de l\u2019attribut `title` est pertinent\xA0;",
          "S\u2019il est pr\xE9sent, le contenu de l\u2019attribut WAI-ARIA `aria-label` est pertinent\xA0;",
          "S\u2019il est pr\xE9sent, le [passage de texte](#passage-de-texte-lie-par-aria-labelledby-ou-aria-describedby) associ\xE9 via l\u2019attribut WAI-ARIA `aria-labelledby` est pertinent."
        ],
        "7": [
          "Pour chaque image bitmap (balise `<canvas>`) utilis\xE9e comme [CAPTCHA](#captcha) ou comme [image-test](#image-test), ayant une [alternative textuelle](#alternative-textuelle-image) ou un [contenu alternatif](#contenu-alternatif), cette alternative est-elle pertinente\xA0?",
          "S\u2019il est pr\xE9sent, le contenu de l\u2019attribut `alt` est pertinent\xA0;",
          "S\u2019il est pr\xE9sent, le contenu de l\u2019attribut `title` est pertinent\xA0;",
          "S\u2019il est pr\xE9sent, le contenu de l\u2019attribut WAI-ARIA `aria-label` est pertinent\xA0;",
          "S\u2019il est pr\xE9sent, le [passage de texte](#passage-de-texte-lie-par-aria-labelledby-ou-aria-describedby) associ\xE9 via l\u2019attribut WAI-ARIA `aria-labelledby` est pertinent\xA0;",
          "S\u2019il est pr\xE9sent le [contenu alternatif](#contenu-alternatif) est pertinent."
        ]
      },
      wcag: ["1.1.1 Non-text Content (A)"],
      techniques: ["G100", "G143"],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "1.5",
      theme: 1,
      title: "Pour chaque image utilis\xE9e comme [CAPTCHA](#captcha), une solution d\u2019acc\xE8s alternatif au contenu ou \xE0 la fonction du CAPTCHA est-elle pr\xE9sente\xA0?",
      titlePlain: "Pour chaque image utilis\xE9e comme CAPTCHA, une solution d\u2019acc\xE8s alternatif au contenu ou \xE0 la fonction du CAPTCHA est-elle pr\xE9sente\xA0?",
      tests: {
        "1": [
          'Chaque image (balises `<img>`, `<area>`, `<object>`, `<embed>`, `<svg>`, `<canvas>` ou poss\xE9dant un attribut WAI-ARIA `role="img"`) utilis\xE9e comme [CAPTCHA](#captcha) v\xE9rifie-t-elle une de ces conditions\xA0?',
          "Il existe une autre forme de [CAPTCHA](#captcha) non graphique, au moins\xA0;",
          "Il existe une autre solution d\u2019acc\xE8s \xE0 la fonctionnalit\xE9 qui est s\xE9curis\xE9e par le [CAPTCHA](#captcha)."
        ],
        "2": [
          'Chaque bouton associ\xE9 \xE0 une image (balise `input` avec l\u2019attribut `type="image"`) utilis\xE9e comme [CAPTCHA](#captcha) v\xE9rifie-t-il une de ces conditions\xA0?',
          "Il existe une autre forme de [CAPTCHA](#captcha) non graphique, au moins\xA0;",
          "Il existe une autre solution d\u2019acc\xE8s \xE0 la fonctionnalit\xE9 s\xE9curis\xE9e par le [CAPTCHA](#captcha)."
        ]
      },
      wcag: ["1.1.1 Non-text Content (A)"],
      techniques: ["G144"],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "1.6",
      theme: 1,
      title: "Chaque image [porteuse d\u2019information](#image-porteuse-d-information) a-t-elle, si n\xE9cessaire, une [description d\xE9taill\xE9e](#description-detaillee-image)\xA0?",
      titlePlain: "Chaque image porteuse d\u2019information a-t-elle, si n\xE9cessaire, une description d\xE9taill\xE9e\xA0?",
      tests: {
        "1": [
          "Chaque image (balise `<img>`) [porteuse d\u2019information](#image-porteuse-d-information), qui n\xE9cessite une [description d\xE9taill\xE9e](#description-detaillee-image), v\xE9rifie-t-elle une de ces conditions\xA0?",
          "Il existe un attribut `longdesc` qui donne l\u2019adresse (URL) d\u2019une page ou d\u2019un emplacement dans la page contenant la [description d\xE9taill\xE9e](#description-detaillee-image)\xA0;",
          "Il existe une [alternative textuelle](#alternative-textuelle-image) contenant la r\xE9f\xE9rence \xE0 une [description d\xE9taill\xE9e](#description-detaillee-image) adjacente \xE0 l\u2019image\xA0;",
          "Il existe un [lien ou un bouton adjacent](#lien-ou-bouton-adjacent) permettant d\u2019acc\xE9der \xE0 la [description d\xE9taill\xE9e](#description-detaillee-image)."
        ],
        "2": [
          'Chaque [image objet](#image-objet) (balise `<object>` avec l\u2019attribut `type="image/\u2026"`) [porteuse d\u2019information](#image-porteuse-d-information), qui n\xE9cessite une [description d\xE9taill\xE9e](#description-detaillee-image), v\xE9rifie-t-elle une de ces conditions\xA0?',
          "Il existe un attribut `longdesc` qui donne l\u2019adresse (URL) d\u2019une page ou d\u2019un emplacement dans la page contenant la [description d\xE9taill\xE9e](#description-detaillee-image)\xA0;",
          "Il existe une [alternative textuelle](#alternative-textuelle-image) contenant la r\xE9f\xE9rence \xE0 une [description d\xE9taill\xE9e](#description-detaillee-image) adjacente \xE0 l\u2019image\xA0;",
          "Il existe un [lien ou un bouton adjacent](#lien-ou-bouton-adjacent) permettant d\u2019acc\xE9der \xE0 la [description d\xE9taill\xE9e](#description-detaillee-image)."
        ],
        "3": [
          "Chaque image embarqu\xE9e (balise `<embed>`) [porteuse d\u2019information](#image-porteuse-d-information), qui n\xE9cessite une [description d\xE9taill\xE9e](#description-detaillee-image), v\xE9rifie-t-elle une de ces conditions\xA0?",
          "Il existe un attribut `longdesc` qui donne l\u2019adresse (URL) d\u2019une page ou d\u2019un emplacement dans la page contenant la [description d\xE9taill\xE9e](#description-detaillee-image)\xA0;",
          "Il existe une [alternative textuelle](#alternative-textuelle-image) contenant la r\xE9f\xE9rence \xE0 une [description d\xE9taill\xE9e](#description-detaillee-image) adjacente \xE0 l\u2019image\xA0;",
          "Il existe un [lien ou un bouton adjacent](#lien-ou-bouton-adjacent) permettant d\u2019acc\xE9der \xE0 la [description d\xE9taill\xE9e](#description-detaillee-image)."
        ],
        "4": [
          'Chaque [bouton](#bouton-formulaire) de type image (balise `<input>` avec l\u2019attribut `type="image"`) [porteur d\u2019information](#image-porteuse-d-information), qui n\xE9cessite une [description d\xE9taill\xE9e](#description-detaillee-image), v\xE9rifie-t-il une de ces conditions\xA0?',
          "Il existe un attribut `longdesc` qui donne l\u2019adresse (URL) d\u2019une page ou d\u2019un emplacement dans la page contenant la [description d\xE9taill\xE9e](#description-detaillee-image)\xA0;",
          "Il existe une [alternative textuelle](#alternative-textuelle-image) contenant la r\xE9f\xE9rence \xE0 une [description d\xE9taill\xE9e](#description-detaillee-image) adjacente \xE0 l\u2019image\xA0;",
          "Il existe un [lien ou un bouton adjacent](#lien-ou-bouton-adjacent) permettant d\u2019acc\xE9der \xE0 la [description d\xE9taill\xE9e](#description-detaillee-image)."
        ],
        "5": [
          "Chaque image vectorielle (balise `<svg>`) [porteuse d\u2019information](#image-porteuse-d-information), qui n\xE9cessite une [description d\xE9taill\xE9e](#description-detaillee-image), v\xE9rifie-t-elle une de ces conditions\xA0?",
          "Il existe un attribut WAI-ARIA `aria-label` contenant l\u2019alternative textuelle et une r\xE9f\xE9rence \xE0 une [description d\xE9taill\xE9e](#description-detaillee-image) adjacente\xA0;",
          "Il existe un attribut WAI-ARIA `aria-labelledby` associant un [passage de texte](#passage-de-texte-lie-par-aria-labelledby-ou-aria-describedby) faisant office d\u2019alternative textuelle et un autre faisant office de [description d\xE9taill\xE9e](#description-detaillee-image)\xA0;",
          "Il existe un attribut WAI-ARIA `aria-describedby` associant un [passage de texte](#passage-de-texte-lie-par-aria-labelledby-ou-aria-describedby) faisant office de [description d\xE9taill\xE9e](#description-detaillee-image)\xA0;",
          "Il existe un [lien ou un bouton adjacent](#lien-ou-bouton-adjacent) permettant d\u2019acc\xE9der \xE0 la [description d\xE9taill\xE9e](#description-detaillee-image)."
        ],
        "6": [
          "Pour chaque image vectorielle (balise `<svg>`) [porteuse d\u2019information](#image-porteuse-d-information), ayant une [description d\xE9taill\xE9e](#description-detaillee-image), la r\xE9f\xE9rence \xE9ventuelle \xE0 la [description d\xE9taill\xE9e](#description-detaillee-image) dans l\u2019attribut WAI-ARIA `aria-label` et la [description d\xE9taill\xE9e](#description-detaillee-image) associ\xE9e par l\u2019attribut WAI-ARIA `aria-labelledby` ou `aria-describedby` sont-elles correctement restitu\xE9es par les technologies d\u2019assistance\xA0?"
        ],
        "7": [
          "Chaque image bitmap (balise `<canvas>`), [porteuse d\u2019information](#image-porteuse-d-information), qui n\xE9cessite une [description d\xE9taill\xE9e](#description-detaillee-image), v\xE9rifie-t-elle une de ces conditions\xA0?",
          "Il existe un attribut WAI-ARIA `aria-label` contenant l\u2019alternative textuelle et une r\xE9f\xE9rence \xE0 une [description d\xE9taill\xE9e](#description-detaillee-image) adjacente\xA0;",
          "Il existe un attribut WAI-ARIA `aria-labelledby` associant un passage de texte faisant office d\u2019alternative textuelle et un autre faisant office de [description d\xE9taill\xE9e](#description-detaillee-image)\xA0;",
          "Il existe un contenu textuel entre `<canvas>` et `</canvas>` faisant r\xE9f\xE9rence \xE0 une [description d\xE9taill\xE9e](#description-detaillee-image) adjacente \xE0 l\u2019image bitmap\xA0;",
          "Il existe un contenu textuel entre `<canvas>` et `</canvas>` faisant office de [description d\xE9taill\xE9e](#description-detaillee-image)\xA0;",
          "Il existe un [lien ou bouton adjacent](#lien-ou-bouton-adjacent) permettant d\u2019acc\xE9der \xE0 la [description d\xE9taill\xE9e](#description-detaillee-image)."
        ],
        "8": [
          "Pour chaque image bitmap (balise `<canvas>`) [porteuse d\u2019information](#image-porteuse-d-information), qui impl\xE9mente une r\xE9f\xE9rence \xE0 une [description d\xE9taill\xE9e](#description-detaillee-image) adjacente, cette r\xE9f\xE9rence est-elle correctement restitu\xE9e par les technologies d\u2019assistance\xA0?"
        ],
        "9": [
          'Pour chaque image (balise `<img>`, `<input>` avec l\u2019attribut `type="image"`, `<area>`, `<object>`, `<embed>`, `<svg>`, `<canvas>`, ou poss\xE9dant un attribut WAI-ARIA `role="img"`) [porteuse d\u2019information](#image-porteuse-d-information), qui est accompagn\xE9e d\u2019une [description d\xE9taill\xE9e](#description-detaillee-image) et qui utilise un attribut WAI-ARIA `aria-describedby`, l\u2019attribut WAI-ARIA `aria-describedby` associe-t-il la [description d\xE9taill\xE9e](#description-detaillee-image)\xA0?'
        ],
        "10": [
          'Chaque balise poss\xE9dant un attribut WAI-ARIA `role="img"` [porteuse d\u2019information](#image-porteuse-d-information), qui n\xE9cessite une [description d\xE9taill\xE9e](#description-detaillee-image), v\xE9rifie-t-elle une de ces conditions\xA0?',
          "Il existe un attribut WAI-ARIA `aria-label` contenant l\u2019[alternative textuelle](#alternative-textuelle-image) et une r\xE9f\xE9rence \xE0 une [description d\xE9taill\xE9e](#description-detaillee-image) adjacente\xA0;",
          "Il existe un attribut WAI-ARIA `aria-labelledby` associant un [passage de texte](#passage-de-texte-lie-par-aria-labelledby-ou-aria-describedby) faisant office d\u2019[alternative textuelle](#alternative-textuelle-image) et un autre faisant office de [description d\xE9taill\xE9e](#description-detaillee-image)\xA0;",
          "Il existe un attribut WAI-ARIA `aria-describedby` associant un [passage de texte](#passage-de-texte-lie-par-aria-labelledby-ou-aria-describedby) faisant office de [description d\xE9taill\xE9e](#description-detaillee-image)\xA0;",
          "Il existe un [lien ou un bouton adjacent](#lien-ou-bouton-adjacent) permettant d\u2019acc\xE9der \xE0 la [description d\xE9taill\xE9e](#description-detaillee-image)."
        ]
      },
      wcag: ["1.1.1 Non-text Content (A)"],
      techniques: ["G92", "G74", "G73", "H45", "ARIA6"],
      technicalNote: [
        "Dans le cas du SVG, le manque de support de l\u2019\xE9l\xE9ment `<title>` et `<desc>` par les technologies d\u2019assistance cr\xE9e une difficult\xE9 dans le cas de l\u2019impl\xE9mentation de l\u2019[alternative textuelle](#alternative-textuelle-image) de l\u2019image et de sa [description d\xE9taill\xE9e](#description-detaillee-image). Dans ce cas, il est recommand\xE9 d\u2019utiliser l\u2019attribut WAI-ARIA `aria-label` pour impl\xE9menter \xE0 la fois l\u2019[alternative textuelle](#alternative-textuelle-image) courte et la r\xE9f\xE9rence \xE0 la [description d\xE9taill\xE9e](#description-detaillee-image) adjacente ou l\u2019attribut WAI-ARIA `aria-labelledby` pour associer les passages de texte faisant office d\u2019alternative courte et de [description d\xE9taill\xE9e](#description-detaillee-image).",
        "L\u2019utilisation de l\u2019attribut WAI-ARIA aria-describedby n\u2019est pas recommand\xE9e pour lier une image (`<img>`, `<object>`, `<embed>`, `<canvas>`) a\u0300 sa [description d\xE9taill\xE9e](#description-detaillee-image), par manque de support des technologies d\u2019assistance. N\xE9anmoins, lorsqu\u2019il est utilis\xE9, l\u2019attribut devra n\xE9cessairement faire r\xE9f\xE9rence \xE0 l\u2019`id` de la zone contenant la [description d\xE9taill\xE9e](#description-detaillee-image).",
        'La [description d\xE9taill\xE9e](#description-detaillee-image) adjacente peut \xEAtre impl\xE9ment\xE9e via une balise `<figcaption>`, dans ce cas le crit\xE8re 1.9 doit \xEAtre v\xE9rifi\xE9 (utilisation de `<figure>` et des attributs WAI-ARIA `role="figure"` et `aria-label`, notamment).',
        "L'attribut `longdesc` qui constitue une des conditions du test 1.6.1 (et dont la pertinence est v\xE9rifi\xE9e avec le test 1.7.1) est d\xE9sormais consid\xE9r\xE9 comme obsol\xE8te par la sp\xE9cification HTML en cours. La v\xE9rification de cet attribut ne sera donc requise que pour les versions de la sp\xE9cification HTML ant\xE9rieure \xE0 HTML 5."
      ],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "1.7",
      theme: 1,
      title: "Pour chaque image [porteuse d\u2019information](#image-porteuse-d-information) ayant une [description d\xE9taill\xE9e](#description-detaillee-image), cette description est-elle pertinente\xA0?",
      titlePlain: "Pour chaque image porteuse d\u2019information ayant une description d\xE9taill\xE9e, cette description est-elle pertinente\xA0?",
      tests: {
        "1": [
          "Chaque image (balise `<img>`) [porteuse d\u2019information](#image-porteuse-d-information), ayant une [description d\xE9taill\xE9e](#description-detaillee-image), v\xE9rifie-t-elle ces conditions\xA0?",
          "La [description d\xE9taill\xE9e](#description-detaillee-image) via l\u2019adresse r\xE9f\xE9renc\xE9e dans l\u2019attribut `longdesc` est pertinente\xA0;",
          "La [description d\xE9taill\xE9e](#description-detaillee-image) dans la page et signal\xE9e par l\u2019[alternative textuelle](#alternative-textuelle-image) est pertinente\xA0;",
          "La [description d\xE9taill\xE9e](#description-detaillee-image) via un [lien ou un bouton adjacent](#lien-ou-bouton-adjacent) est pertinente\xA0;",
          "Le passage de texte associ\xE9 via l\u2019attribut WAI-ARIA `aria-describedby` est pertinent."
        ],
        "2": [
          'Chaque [bouton](#bouton-formulaire) de type image (balise `<input>` avec l\u2019attribut `type="image"`) [porteur d\u2019information](#image-porteuse-d-information), ayant une [description d\xE9taill\xE9e](#description-detaillee-image), v\xE9rifie-t-il ces conditions\xA0?',
          "La [description d\xE9taill\xE9e](#description-detaillee-image) dans la page et signal\xE9e par l\u2019[alternative textuelle](#alternative-textuelle-image) est pertinente\xA0;",
          "La [description d\xE9taill\xE9e](#description-detaillee-image) via un [lien ou un bouton adjacent](#lien-ou-bouton-adjacent) est pertinente\xA0;",
          "Le passage de texte associ\xE9 via l\u2019attribut WAI-ARIA `aria-describedby` est pertinent."
        ],
        "3": [
          'Chaque [image objet](#image-objet) (balise `<object>` avec l\u2019attribut `type="image/\u2026"`) [porteuse d\u2019information](#image-porteuse-d-information), ayant une [description d\xE9taill\xE9e](#description-detaillee-image), v\xE9rifie-t-elle ces conditions\xA0?',
          "La [description d\xE9taill\xE9e](#description-detaillee-image) dans la page et signal\xE9e par l\u2019[alternative textuelle](#alternative-textuelle-image) est pertinente\xA0;",
          "La [description d\xE9taill\xE9e](#description-detaillee-image) adjacente \xE0 l\u2019[image objet](#image-objet) est pertinente\xA0;",
          "La [description d\xE9taill\xE9e](#description-detaillee-image) via un [lien ou un bouton adjacent](#lien-ou-bouton-adjacent) est pertinente\xA0;",
          "Le passage de texte associ\xE9 via l\u2019attribut WAI-ARIA `aria-describedby` est pertinent."
        ],
        "4": [
          'Chaque image embarqu\xE9e (balise `<embed>` avec l\u2019attribut `type="image/\u2026"`) [porteuse d\u2019information](#image-porteuse-d-information), ayant une [description d\xE9taill\xE9e](#description-detaillee-image), v\xE9rifie-t-elle ces conditions\xA0?',
          "La [description d\xE9taill\xE9e](#description-detaillee-image) dans la page et signal\xE9e par l\u2019[alternative textuelle](#alternative-textuelle-image) est pertinente\xA0;",
          "La [description d\xE9taill\xE9e](#description-detaillee-image) adjacente \xE0 l\u2019image embarqu\xE9e est pertinente\xA0;",
          "La [description d\xE9taill\xE9e](#description-detaillee-image) via un [lien ou un bouton adjacent](#lien-ou-bouton-adjacent) est pertinente\xA0;",
          "Le passage de texte associ\xE9 via l\u2019attribut WAI-ARIA `aria-describedby` est pertinent."
        ],
        "5": [
          "Chaque image vectorielle (balise `<svg>`) [porteuse d\u2019information](#image-porteuse-d-information), ayant une [description d\xE9taill\xE9e](#description-detaillee-image), v\xE9rifie-t-elle ces conditions\xA0?",
          "La [description d\xE9taill\xE9e](#description-detaillee-image) dans la page et signal\xE9e par l\u2019[alternative textuelle](#alternative-textuelle-image) est pertinente\xA0;",
          "La [description d\xE9taill\xE9e](#description-detaillee-image) dans la page et signal\xE9e par le texte contenu dans la balise `<desc>` ou `<title>` est pertinente\xA0;",
          "La [description d\xE9taill\xE9e](#description-detaillee-image) adjacente contenue dans la balise `<desc>` est pertinente\xA0;",
          "La [description d\xE9taill\xE9e](#description-detaillee-image) via un [lien ou un bouton adjacent](#lien-ou-bouton-adjacent) est pertinente\xA0;",
          "Le passage de texte associ\xE9 via l\u2019attribut WAI-ARIA `aria-describedby` est pertinent."
        ],
        "6": [
          "Chaque image bitmap (balise `<canvas>`) [porteuse d\u2019information](#image-porteuse-d-information), ayant une [description d\xE9taill\xE9e](#description-detaillee-image), v\xE9rifie-t-elle ces conditions\xA0?",
          "La [description d\xE9taill\xE9e](#description-detaillee-image) dans la page et signal\xE9e par l\u2019[alternative textuelle](#alternative-textuelle-image) est pertinente\xA0;",
          "La [description d\xE9taill\xE9e](#description-detaillee-image) dans la page et signal\xE9e par le texte contenu entre `<canvas>` et `</canvas>` est pertinente\xA0;",
          "La [description d\xE9taill\xE9e](#description-detaillee-image) contenue entre `<canvas>` et `</canvas>` est pertinente\xA0;",
          "La [description d\xE9taill\xE9e](#description-detaillee-image) adjacente \xE0 l\u2019image bitmap est pertinente\xA0;",
          "La [description d\xE9taill\xE9e](#description-detaillee-image) via un [lien ou un bouton adjacent](#lien-ou-bouton-adjacent) est pertinente\xA0;",
          "Le passage de texte associ\xE9 via l\u2019attribut WAI-ARIA `aria-describedby` est pertinent."
        ]
      },
      wcag: ["1.1.1 Non-text Content (A)"],
      techniques: ["G92", "F67"],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "1.8",
      theme: 1,
      title: "Chaque [image texte](#image-texte) [porteuse d\u2019information](#image-porteuse-d-information), en l\u2019absence d\u2019un [m\xE9canisme de remplacement](#mecanisme-de-remplacement), doit si possible \xEAtre remplac\xE9e par du [texte styl\xE9](#texte-style). Cette r\xE8gle est-elle respect\xE9e (hors cas particuliers)\xA0?",
      titlePlain: "Chaque image texte porteuse d\u2019information, en l\u2019absence d\u2019un m\xE9canisme de remplacement, doit si possible \xEAtre remplac\xE9e par du texte styl\xE9. Cette r\xE8gle est-elle respect\xE9e (hors cas particuliers)\xA0?",
      tests: {
        "1": [
          'Chaque [image texte](#image-texte) (balise `<img>` ou poss\xE9dant un attribut WAI-ARIA `role="img"`) [porteuse d\u2019information](#image-porteuse-d-information), en l\u2019absence d\u2019un [m\xE9canisme de remplacement](#mecanisme-de-remplacement), doit si possible \xEAtre remplac\xE9e par du [texte styl\xE9](#texte-style). Cette r\xE8gle est-elle respect\xE9e (hors cas particuliers)\xA0?'
        ],
        "2": [
          'Chaque bouton \xAB\xA0[image texte](#image-texte)\xA0\xBB (balise `<input>` avec l\u2019attribut `type="image"`) [porteur d\u2019information](#image-porteuse-d-information), en l\u2019absence d\u2019un [m\xE9canisme de remplacement](#mecanisme-de-remplacement), doit si possible \xEAtre remplac\xE9 par du [texte styl\xE9](#texte-style). Cette r\xE8gle est-elle respect\xE9e (hors cas particuliers)\xA0?'
        ],
        "3": [
          'Chaque [image texte](#image-texte) objet (balise `<object>` avec l\u2019attribut `type="image/\u2026"`) [porteuse d\u2019information](#image-porteuse-d-information), en l\u2019absence d\u2019un [m\xE9canisme de remplacement](#mecanisme-de-remplacement), doit si possible \xEAtre remplac\xE9e par du [texte styl\xE9](#texte-style). Cette r\xE8gle est-elle respect\xE9e (hors cas particuliers)\xA0?'
        ],
        "4": [
          'Chaque [image texte](#image-texte) embarqu\xE9e (balise `<embed>` avec l\u2019attribut `type="image/\u2026"`) [porteuse d\u2019information](#image-porteuse-d-information), en l\u2019absence d\u2019un [m\xE9canisme de remplacement](#mecanisme-de-remplacement), doit si possible \xEAtre remplac\xE9e par du [texte styl\xE9](#texte-style). Cette r\xE8gle est-elle respect\xE9e (hors cas particuliers)\xA0?'
        ],
        "5": [
          "Chaque [image texte](#image-texte) bitmap (balise `<canvas>`) [porteuse d\u2019information](#image-porteuse-d-information), en l\u2019absence d\u2019un [m\xE9canisme de remplacement](#mecanisme-de-remplacement), doit si possible \xEAtre remplac\xE9e par du [texte styl\xE9](#texte-style). Cette r\xE8gle est-elle respect\xE9e (hors cas particuliers)\xA0?"
        ],
        "6": [
          "Chaque [image texte](#image-texte) SVG (balise `<svg>`) [porteuse d\u2019information](#image-porteuse-d-information) et dont le texte n\u2019est pas compl\xE8tement structur\xE9 au moyen d\u2019\xE9l\xE9ments `<text>`, en l\u2019absence d\u2019un [m\xE9canisme de remplacement](#mecanisme-de-remplacement), doit si possible \xEAtre remplac\xE9e par du [texte styl\xE9](#texte-style). Cette r\xE8gle est-elle respect\xE9e (hors cas particuliers)\xA0?"
        ]
      },
      wcag: ["1.4.5 Images of Text (AA)"],
      techniques: ["G136", "G140", "C22", "C30"],
      technicalNote: ["Le texte dans les images vectorielles \xE9tant du texte r\xE9el, il n\u2019est pas concern\xE9 par ce crit\xE8re."],
      particularCases: [
        "Pour ce crit\xE8re, il existe une gestion de cas particulier lorsque le texte fait partie du logo, d\u2019une d\xE9nomination commerciale, d\u2019un [CAPTCHA](#captcha), d\u2019une [image-test](#image-test) ou d\u2019une image dont l\u2019exactitude graphique serait consid\xE9r\xE9e comme essentielle \xE0 la bonne transmission de l\u2019information v\xE9hicul\xE9e par l\u2019image. Dans ces situations, le crit\xE8re est non applicable pour ces \xE9l\xE9ments."
      ],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "1.9",
      theme: 1,
      title: "Chaque [l\xE9gende d\u2019image](#legende-d-image) est-elle, si n\xE9cessaire, correctement reli\xE9e \xE0 l\u2019image correspondante\xA0?",
      titlePlain: "Chaque l\xE9gende d\u2019image est-elle, si n\xE9cessaire, correctement reli\xE9e \xE0 l\u2019image correspondante\xA0?",
      tests: {
        "1": [
          'Chaque image pourvue d\u2019une [l\xE9gende](#legende-d-image) (balise `<img>`, `<input>` avec l\u2019attribut `type="image"` ou poss\xE9dant un attribut WAI-ARIA `role="img"` associ\xE9e \xE0 une [l\xE9gende](#legende-d-image) adjacente), v\xE9rifie-t-elle, si n\xE9cessaire, ces conditions\xA0?',
          'L\u2019image (balise `<img>`, `<input>` avec l\u2019attribut `type="image"` ou poss\xE9dant un attribut WAI-ARIA `role="img"`) et sa [l\xE9gende](#legende-d-image) adjacente sont contenues dans une balise `<figure>`\xA0;',
          'La balise `<figure>` poss\xE8de un attribut WAI-ARIA `role="figure"` ou `role="group"`\xA0;',
          "La balise `<figure>` poss\xE8de un attribut WAI-ARIA `aria-label` dont le contenu est identique au contenu de la [l\xE9gende](#legende-d-image)\xA0;",
          "La [l\xE9gende](#legende-d-image) est contenue dans une balise `<figcaption>`."
        ],
        "2": [
          'Chaque [image objet](#image-objet) pourvue d\u2019une [l\xE9gende](#legende-d-image) (balise `<object>` avec l\u2019attribut `type="image/\u2026"` associ\xE9e \xE0 une [l\xE9gende](#legende-d-image) adjacente), v\xE9rifie-t-elle, si n\xE9cessaire, ces conditions\xA0?',
          "L\u2019[image objet](#image-objet) et sa [l\xE9gende](#legende-d-image) adjacente sont contenues dans une balise `<figure>`\xA0;",
          'La balise `<figure>` poss\xE8de un attribut WAI-ARIA `role="figure"` ou `role="group"`\xA0;',
          "La balise `<figure>` poss\xE8de un attribut WAI-ARIA `aria-label` dont le contenu est identique au contenu de la [l\xE9gende](#legende-d-image)\xA0;",
          "La [l\xE9gende](#legende-d-image) est contenue dans une balise `<figcaption>`."
        ],
        "3": [
          "Chaque image embarqu\xE9e pourvue d\u2019une [l\xE9gende](#legende-d-image) (balise `<embed>` associ\xE9e \xE0 une [l\xE9gende](#legende-d-image) adjacente), v\xE9rifie-t-elle, si n\xE9cessaire, ces conditions\xA0?",
          "L\u2019image embarqu\xE9e (balise `<embed>`) et sa [l\xE9gende](#legende-d-image) adjacente sont contenues dans une balise `<figure>`\xA0;",
          'La balise `<figure>` poss\xE8de un attribut WAI-ARIA `role="figure"` ou `role="group"`\xA0;',
          "La balise `<figure>` poss\xE8de un attribut WAI-ARIA `aria-label` dont le contenu est identique au contenu de la [l\xE9gende](#legende-d-image)\xA0;",
          "La [l\xE9gende](#legende-d-image) est contenue dans une balise `<figcaption>`."
        ],
        "4": [
          "Chaque image vectorielle pourvue d\u2019une [l\xE9gende](#legende-d-image) (balise `<svg>` associ\xE9e \xE0 une [l\xE9gende](#legende-d-image) adjacente), v\xE9rifie-t-elle, si n\xE9cessaire, ces conditions\xA0?",
          "L\u2019image vectorielle (balise `<svg>`) et sa [l\xE9gende](#legende-d-image) adjacente sont contenues dans une balise `<figure>`\xA0;",
          'La balise `<figure>` poss\xE8de un attribut WAI-ARIA `role="figure"` ou `role="group"`\xA0;',
          "La balise `<figure>` poss\xE8de un attribut WAI-ARIA `aria-label` dont le contenu est identique au contenu de la [l\xE9gende](#legende-d-image)\xA0;",
          "La [l\xE9gende](#legende-d-image) est contenue dans une balise `<figcaption>`."
        ],
        "5": [
          "Chaque image bitmap pourvue d\u2019une [l\xE9gende](#legende-d-image) (balise `<canvas>` associ\xE9e \xE0 une [l\xE9gende](#legende-d-image) adjacente), v\xE9rifie-t-elle, si n\xE9cessaire, ces conditions\xA0?",
          "L\u2019image bitmap (balise `<canvas>`) et sa [l\xE9gende](#legende-d-image) adjacente sont contenues dans une balise `<figure>`\xA0;",
          'La balise `<figure>` poss\xE8de un attribut WAI-ARIA `role="figure"` ou `role="group"`\xA0;',
          "La balise `<figure>` poss\xE8de un attribut WAI-ARIA `aria-label` dont le contenu est identique au contenu de la [l\xE9gende](#legende-d-image)\xA0;",
          "La [l\xE9gende](#legende-d-image) est contenue dans une balise `<figcaption>`."
        ]
      },
      wcag: ["1.1.1 Non-text Content (A)", "4.1.2 Name, Role, Value (A)"],
      techniques: ["G140", "ARIA4", "ARIA6"],
      technicalNote: [
        'L\u2019impl\xE9mentation d\u2019un attribut WAI-ARIA `role="group"` ou `role="figure"` sur l\u2019\xE9l\xE9ment parent `<figure>` est destin\xE9 \xE0 pallier le manque de support actuel des \xE9l\xE9ments `<figure>` par les technologies d\u2019assistance. L\u2019utilisation d\u2019un \xE9l\xE9ment `<figcaption>` pour associer une [l\xE9gende](#legende-d-image) \xE0 une image impose au minimum l\u2019utilisation d\u2019un attribut WAI-ARIA `aria-label` sur l\u2019\xE9l\xE9ment parent `<figure>` dont le contenu sera identique au contenu de l\u2019\xE9l\xE9ment `<figcaption>`. Pour s\u2019assurer d\u2019un support optimal, il peut \xE9galement \xEAtre fait une association explicite entre le contenu de l\u2019[alternative textuelle](#alternative-textuelle-image) de l\u2019image et le contenu de l\u2019\xE9l\xE9ment `<figcaption>`, par exemple\xA0:',
        '`<img src="image.png" alt="Photo\xA0: soleil couchant" /><figcaption>Photo\xA0: cr\xE9dit xxx</figcaption>`',
        "Les attributs WAI-ARIA `aria-labelledby` et `aria-describedby` ne peuvent pas \xEAtre utilis\xE9s actuellement par manque de support par les technologies d\u2019assistance.",
        "Note\xA0: les images l\xE9gend\xE9es doivent par ailleurs respecter le crit\xE8re 1.1 et le crit\xE8re 1.3 relatifs aux images porteuses d\u2019information."
      ],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "2.1",
      theme: 2,
      title: "Chaque [cadre](#cadre) a-t-il un [titre de cadre](#titre-de-cadre)\xA0?",
      titlePlain: "Chaque cadre a-t-il un titre de cadre\xA0?",
      tests: {
        "1": ["Chaque cadre (balise `<iframe>` ou `<frame>`) a-t-il un attribut `title`\xA0?"]
      },
      wcag: ["4.1.2 Name, Role, Value (A)"],
      techniques: ["H64"],
      automatability: "static",
      ruleIds: ["iframe-title-missing"]
    },
    {
      id: "2.2",
      theme: 2,
      title: "Pour chaque [cadre](#cadre) ayant un [titre de cadre](#titre-de-cadre), ce titre de cadre est-il pertinent\xA0?",
      titlePlain: "Pour chaque cadre ayant un titre de cadre, ce titre de cadre est-il pertinent\xA0?",
      tests: {
        "1": ["Pour chaque cadre (balise `<iframe>` ou `<frame>`) ayant un attribut `title`, le contenu de cet attribut est-il pertinent\xA0?"]
      },
      wcag: ["4.1.2 Name, Role, Value (A)"],
      techniques: ["H64"],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "3.1",
      theme: 3,
      title: "Dans chaque page web, l\u2019[information](#information-donnee-par-la-couleur) ne doit pas \xEAtre donn\xE9e uniquement par la couleur. Cette r\xE8gle est-elle respect\xE9e\xA0?",
      titlePlain: "Dans chaque page web, l\u2019information ne doit pas \xEAtre donn\xE9e uniquement par la couleur. Cette r\xE8gle est-elle respect\xE9e\xA0?",
      tests: {
        "1": [
          "Pour chaque mot ou ensemble de mots dont la mise en couleur est porteuse d\u2019information, l\u2019[information](#information-donnee-par-la-couleur) ne doit pas \xEAtre donn\xE9e uniquement par la couleur. Cette r\xE8gle est-elle respect\xE9e\xA0?"
        ],
        "2": [
          "Pour chaque indication de couleur donn\xE9e par un texte, l\u2019[information](#information-donnee-par-la-couleur) ne doit pas \xEAtre donn\xE9e uniquement par la couleur. Cette r\xE8gle est-elle respect\xE9e\xA0?"
        ],
        "3": [
          "Pour chaque image [v\xE9hiculant une information](#image-vehiculant-une-information-donnee-par-la-couleur), l\u2019[information](#information-donnee-par-la-couleur) ne doit pas \xEAtre donn\xE9e uniquement par la couleur. Cette r\xE8gle est-elle respect\xE9e\xA0?"
        ],
        "4": [
          "Pour chaque [propri\xE9t\xE9 CSS d\xE9terminant une couleur](#propriete-css-determinant-une-couleur) et [v\xE9hiculant une information](#image-vehiculant-une-information-donnee-par-la-couleur), l\u2019[information](#information-donnee-par-la-couleur) ne doit pas \xEAtre donn\xE9e uniquement par la couleur. Cette r\xE8gle est-elle respect\xE9e\xA0?"
        ],
        "5": [
          "Pour chaque [m\xE9dia temporel](#media-temporel-type-son-video-et-synchronise) [v\xE9hiculant une information](#image-vehiculant-une-information-donnee-par-la-couleur), l\u2019[information](#information-donnee-par-la-couleur) ne doit pas \xEAtre donn\xE9e uniquement par la couleur. Cette r\xE8gle est-elle respect\xE9e\xA0?"
        ],
        "6": [
          "Pour chaque [m\xE9dia non temporel](#media-non-temporel) [v\xE9hiculant une information](#image-vehiculant-une-information-donnee-par-la-couleur), l\u2019[information](#information-donnee-par-la-couleur) ne doit pas \xEAtre donn\xE9e uniquement par la couleur. Cette r\xE8gle est-elle respect\xE9e\xA0?"
        ]
      },
      wcag: ["1.3.1 Info and Relationships (A)", "1.4.1 Use of color (A)"],
      techniques: ["G14", "G182", "G111", "G117", "G138", "G205"],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "3.2",
      theme: 3,
      title: "Dans chaque page web, le [contraste](#contraste) entre la couleur du texte et la couleur de son arri\xE8re-plan est-il suffisamment \xE9lev\xE9 (hors cas particuliers)\xA0?",
      titlePlain: "Dans chaque page web, le contraste entre la couleur du texte et la couleur de son arri\xE8re-plan est-il suffisamment \xE9lev\xE9 (hors cas particuliers)\xA0?",
      tests: {
        "1": [
          "Dans chaque page web, le texte et le texte en image sans effet de graisse d\u2019une taille restitu\xE9e inf\xE9rieure \xE0 24px v\xE9rifient-ils une de ces conditions (hors cas particuliers)\xA0?",
          "Le rapport de [contraste](#contraste) entre le texte et son arri\xE8re-plan est de 4.5:1, au moins\xA0;",
          "Un m\xE9canisme permet \xE0 l\u2019utilisateur d\u2019afficher le texte avec un rapport de [contraste](#contraste) de 4.5:1, au moins."
        ],
        "2": [
          "Dans chaque page web, le texte et le texte en image en gras d\u2019une taille restitu\xE9e inf\xE9rieure \xE0 18,5px v\xE9rifient-ils une de ces conditions (hors cas particuliers)\xA0?",
          "Le rapport de [contraste](#contraste) entre le texte et son arri\xE8re-plan est de 4.5:1, au moins\xA0;",
          "Un m\xE9canisme permet \xE0 l\u2019utilisateur d\u2019afficher le texte avec un rapport de [contraste](#contraste) de 4.5:1, au moins."
        ],
        "3": [
          "Dans chaque page web, le texte et le texte en image sans effet de graisse d\u2019une taille restitu\xE9e sup\xE9rieure ou \xE9gale \xE0 24px v\xE9rifient-ils une de ces conditions (hors cas particuliers)\xA0?",
          "Le rapport de [contraste](#contraste) entre le texte et son arri\xE8re-plan est de 3:1, au moins\xA0;",
          "Un m\xE9canisme permet \xE0 l\u2019utilisateur d\u2019afficher le texte avec un rapport de [contraste](#contraste) de 3:1, au moins."
        ],
        "4": [
          "Dans chaque page web, le texte et le texte en image en gras d\u2019une taille restitu\xE9e sup\xE9rieure ou \xE9gale \xE0 18,5px v\xE9rifient-ils une de ces conditions (hors cas particuliers)\xA0?",
          "Le rapport de [contraste](#contraste) entre le texte et son arri\xE8re-plan est de 3:1, au moins\xA0;",
          "Un m\xE9canisme permet \xE0 l\u2019utilisateur d\u2019afficher le texte avec un rapport de [contraste](#contraste) de 3:1, au moins."
        ],
        "5": [
          "Dans le [m\xE9canisme qui permet d\u2019afficher un rapport de contraste](#mecanisme-qui-permet-d-afficher-un-rapport-de-contraste-conforme) conforme, le rapport de contraste entre le texte et la couleur d\u2019arri\xE8re-plan est-il suffisamment \xE9lev\xE9\xA0?"
        ]
      },
      wcag: ["1.4.3 Contrast (Minimum) (AA)"],
      techniques: ["G18", "G136", "G148", "G174", "G145", "C29"],
      particularCases: ["Dans ces situations, les crit\xE8res sont non applicables pour ces \xE9l\xE9ments\xA0:", "[object Object]"],
      automatability: "needs-rendering",
      ruleIds: ["contrast-literal"]
    },
    {
      id: "3.3",
      theme: 3,
      title: "Dans chaque page web, les couleurs utilis\xE9es dans les [composants d\u2019interface](#composant-d-interface) ou les \xE9l\xE9ments graphiques porteurs d\u2019informations sont-elles suffisamment contrast\xE9es (hors cas particuliers)\xA0?",
      titlePlain: "Dans chaque page web, les couleurs utilis\xE9es dans les composants d\u2019interface ou les \xE9l\xE9ments graphiques porteurs d\u2019informations sont-elles suffisamment contrast\xE9es (hors cas particuliers)\xA0?",
      tests: {
        "1": [
          "Dans chaque page web, le rapport de [contraste](#contraste) entre les couleurs d\u2019un [composant d\u2019interface](#composant-d-interface) dans ses diff\xE9rents \xE9tats et la [couleur d\u2019arri\xE8re-plan contigu\xEB](#couleur-d-arriere-plan-contigue-et-couleur-contigue) v\xE9rifie-t-il une de ces conditions (hors cas particuliers)\xA0?",
          "Le rapport de [contraste](#contraste) est de 3:1, au moins\xA0;",
          "Un [m\xE9canisme](#mecanisme-qui-permet-d-afficher-un-rapport-de-contraste-conforme) permet un rapport de [contraste](#contraste) de 3:1, au moins."
        ],
        "2": [
          "Dans chaque page web, le rapport de [contraste](#contraste) des diff\xE9rentes couleurs composant un [\xE9l\xE9ment graphique](#element-graphique), lorsqu\u2019elles sont n\xE9cessaires \xE0 sa compr\xE9hension, et la [couleur d\u2019arri\xE8re-plan contigu\xEB](#couleur-d-arriere-plan-contigue-et-couleur-contigue), v\xE9rifie-t-il une de ces conditions (hors cas particuliers)\xA0?",
          "Le rapport de [contraste](#contraste) est de 3:1, au moins\xA0;",
          "Un [m\xE9canisme](#mecanisme-qui-permet-d-afficher-un-rapport-de-contraste-conforme) permet un rapport de [contraste](#contraste) de 3:1, au moins."
        ],
        "3": [
          "Dans chaque page web, le rapport de [contraste](#contraste) des diff\xE9rentes [couleurs contigu\xEBs](#couleur-d-arriere-plan-contigue-et-couleur-contigue) entre elles d\u2019un [\xE9l\xE9ment graphique](#element-graphique), lorsqu\u2019elles sont n\xE9cessaires \xE0 sa compr\xE9hension, v\xE9rifie-t-il une de ces conditions (hors cas particuliers)\xA0?",
          "Le rapport de [contraste](#contraste) est de 3:1, au moins\xA0;",
          "Un [m\xE9canisme](#mecanisme-qui-permet-d-afficher-un-rapport-de-contraste-conforme) permet un rapport de [contraste](#contraste) de 3:1, au moins."
        ],
        "4": [
          "Dans le [m\xE9canisme qui permet d\u2019afficher un rapport de contraste](#mecanisme-qui-permet-d-afficher-un-rapport-de-contraste-conforme) conforme, les couleurs du composant ou des \xE9l\xE9ments graphiques porteurs d\u2019informations qui le composent, sont-elles suffisamment contrast\xE9es\xA0?"
        ]
      },
      wcag: ["1.4.11 Non-text Contrast (AA)"],
      techniques: ["G18", "G195", "G207", "G174", "G145", "G183", "F78"],
      particularCases: ["Les cas suivants sont non applicables pour ce crit\xE8re\xA0:", "[object Object]"],
      automatability: "needs-rendering",
      ruleIds: []
    },
    {
      id: "4.1",
      theme: 4,
      title: "Chaque [m\xE9dia temporel](#media-temporel-type-son-video-et-synchronise) pr\xE9-enregistr\xE9 a-t-il, si n\xE9cessaire, une [transcription textuelle](#transcription-textuelle-media-temporel) ou une [audiodescription](#audiodescription-synchronisee-media-temporel) (hors cas particuliers)\xA0?",
      titlePlain: "Chaque m\xE9dia temporel pr\xE9-enregistr\xE9 a-t-il, si n\xE9cessaire, une transcription textuelle ou une audiodescription (hors cas particuliers)\xA0?",
      tests: {
        "1": [
          "Chaque [m\xE9dia temporel](#media-temporel-type-son-video-et-synchronise) pr\xE9-enregistr\xE9 seulement audio, v\xE9rifie-t-il, si n\xE9cessaire, l\u2019une de ces conditions (hors cas particuliers)\xA0?",
          "Il existe une [transcription textuelle](#transcription-textuelle-media-temporel) accessible via un [lien ou bouton adjacent](#lien-ou-bouton-adjacent)\xA0;",
          "Il existe une [transcription textuelle](#transcription-textuelle-media-temporel) adjacente clairement identifiable."
        ],
        "2": [
          "Chaque [m\xE9dia temporel](#media-temporel-type-son-video-et-synchronise) pr\xE9-enregistr\xE9 seulement vid\xE9o v\xE9rifie-t-il, si n\xE9cessaire, l\u2019une de ces conditions (hors cas particuliers)\xA0?",
          "Il existe une [version alternative \xAB\xA0audio seulement\xA0\xBB](#version-alternative-audio-seulement) accessible via un [lien ou bouton adjacent](#lien-ou-bouton-adjacent)\xA0;",
          "Il existe une [version alternative \xAB\xA0audio seulement\xA0\xBB](#version-alternative-audio-seulement) adjacente clairement identifiable\xA0;",
          "Il existe une [transcription textuelle](#transcription-textuelle-media-temporel) accessible via un [lien ou bouton adjacent](#lien-ou-bouton-adjacent)\xA0;",
          "Il existe une [transcription textuelle](#transcription-textuelle-media-temporel) adjacente clairement identifiable\xA0;",
          "Il existe une [audiodescription](#audiodescription-synchronisee-media-temporel) synchronis\xE9e\xA0;",
          "Il existe une version alternative avec une [audiodescription](#audiodescription-synchronisee-media-temporel) synchronis\xE9e accessible via un [lien ou bouton adjacent](#lien-ou-bouton-adjacent)."
        ],
        "3": [
          "Chaque [m\xE9dia temporel](#media-temporel-type-son-video-et-synchronise) synchronis\xE9 pr\xE9-enregistr\xE9 v\xE9rifie-t-il, si n\xE9cessaire, une de ces conditions (hors cas particuliers)\xA0?",
          "Il existe une [transcription textuelle](#transcription-textuelle-media-temporel) accessible via un [lien ou bouton adjacent](#lien-ou-bouton-adjacent)\xA0;",
          "Il existe une [transcription textuelle](#transcription-textuelle-media-temporel) adjacente clairement identifiable\xA0;",
          "Il existe une [audiodescription](#audiodescription-synchronisee-media-temporel) synchronis\xE9e\xA0;",
          "Il existe une version alternative avec une [audiodescription](#audiodescription-synchronisee-media-temporel) synchronis\xE9e accessible via un [lien ou bouton adjacent](#lien-ou-bouton-adjacent)."
        ]
      },
      wcag: ["1.2.1 Audio-only and Video-only (Prerecorded) (A)", "1.2.3 Audio Description or Media Alternative (Prerecorded) (A)"],
      techniques: ["G58", "G69", "G78", "G158", "G159", "G173", "G8", "G166", "H96", "SM6", "SM7"],
      particularCases: [
        "Il existe une gestion de cas particulier lorsque\xA0:",
        "[object Object]",
        "Dans ces situations, le crit\xE8re est non applicable.",
        "Ce cas particulier s\u2019applique \xE9galement aux crit\xE8res 4.2, 4.3, 4.5."
      ],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "4.2",
      theme: 4,
      title: "Pour chaque [m\xE9dia temporel](#media-temporel-type-son-video-et-synchronise) pr\xE9-enregistr\xE9 ayant une [transcription textuelle](#transcription-textuelle-media-temporel) ou une [audiodescription](#audiodescription-synchronisee-media-temporel) synchronis\xE9e, celles-ci sont-elles pertinentes (hors cas particuliers)\xA0?",
      titlePlain: "Pour chaque m\xE9dia temporel pr\xE9-enregistr\xE9 ayant une transcription textuelle ou une audiodescription synchronis\xE9e, celles-ci sont-elles pertinentes (hors cas particuliers)\xA0?",
      tests: {
        "1": [
          "Pour chaque [m\xE9dia temporel](#media-temporel-type-son-video-et-synchronise) pr\xE9-enregistr\xE9 seulement audio, ayant une [transcription textuelle](#transcription-textuelle-media-temporel), celle-ci est-elle pertinente (hors cas particuliers)\xA0?"
        ],
        "2": [
          "Chaque [m\xE9dia temporel](#media-temporel-type-son-video-et-synchronise) pr\xE9-enregistr\xE9 seulement vid\xE9o v\xE9rifie-t-il une de ces conditions (hors cas particuliers)\xA0?",
          "La [transcription textuelle](#transcription-textuelle-media-temporel) est pertinente\xA0;",
          "L\u2019[audiodescription](#audiodescription-synchronisee-media-temporel) synchronis\xE9e est pertinente\xA0;",
          "L\u2019[audiodescription](#audiodescription-synchronisee-media-temporel) synchronis\xE9e de la version alternative est pertinente\xA0;",
          "La version alternative audio seulement est pertinente."
        ],
        "3": [
          "Chaque [m\xE9dia temporel](#media-temporel-type-son-video-et-synchronise) synchronis\xE9 pr\xE9-enregistr\xE9 v\xE9rifie-t-il une de ces conditions (hors cas particuliers)\xA0?",
          "La [transcription textuelle](#transcription-textuelle-media-temporel) est pertinente\xA0;",
          "L\u2019[audiodescription](#audiodescription-synchronisee-media-temporel) synchronis\xE9e est pertinente\xA0;",
          "L\u2019[audiodescription](#audiodescription-synchronisee-media-temporel) synchronis\xE9e de la version alternative est pertinente."
        ]
      },
      wcag: ["1.2.1 Audio-only and Video-only (Prerecorded) (A)", "1.2.3 Audio Description or Media Alternative (Prerecorded) (A)"],
      techniques: ["F30", "F67", "SM6", "SM7"],
      particularCases: ["Voir cas particuliers crit\xE8re 4.1."],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "4.3",
      theme: 4,
      title: "Chaque [m\xE9dia temporel](#media-temporel-type-son-video-et-synchronise) synchronis\xE9 pr\xE9-enregistr\xE9 a-t-il, si n\xE9cessaire, des [sous-titres synchronis\xE9s](#sous-titres-synchronises-objet-multimedia) (hors cas particuliers)\xA0?",
      titlePlain: "Chaque m\xE9dia temporel synchronis\xE9 pr\xE9-enregistr\xE9 a-t-il, si n\xE9cessaire, des sous-titres synchronis\xE9s (hors cas particuliers)\xA0?",
      tests: {
        "1": [
          "Chaque [m\xE9dia temporel](#media-temporel-type-son-video-et-synchronise) synchronis\xE9 pr\xE9-enregistr\xE9 v\xE9rifie-t-il, si n\xE9cessaire, l\u2019une de ces conditions (hors cas particuliers)\xA0?",
          "Le [m\xE9dia temporel](#media-temporel-type-son-video-et-synchronise) synchronis\xE9 poss\xE8de des [sous-titres synchronis\xE9s](#sous-titres-synchronises-objet-multimedia)\xA0;",
          "Il existe une version alternative poss\xE9dant des [sous-titres synchronis\xE9s](#sous-titres-synchronises-objet-multimedia) accessible via un [lien ou bouton adjacent](#lien-ou-bouton-adjacent)."
        ],
        "2": [
          'Pour chaque [m\xE9dia temporel](#media-temporel-type-son-video-et-synchronise) synchronis\xE9 pr\xE9-enregistr\xE9 poss\xE9dant des [sous-titres synchronis\xE9s](#sous-titres-synchronises-objet-multimedia) diffus\xE9s via une balise `<track>`, la balise `<track>` poss\xE8de-t-elle un attribut `kind="captions"`\xA0?'
        ]
      },
      wcag: ["1.2.2 Captions (Prerecorded) (A)"],
      techniques: ["G58", "G93", "G87", "H95", "SM11", "SM12", "F74", "F75"],
      particularCases: ["Voir cas particuliers crit\xE8re 4.1."],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "4.4",
      theme: 4,
      title: "Pour chaque [m\xE9dia temporel](#media-temporel-type-son-video-et-synchronise) synchronis\xE9 pr\xE9-enregistr\xE9 ayant des [sous-titres synchronis\xE9s](#sous-titres-synchronises-objet-multimedia), ces sous-titres sont-ils pertinents\xA0?",
      titlePlain: "Pour chaque m\xE9dia temporel synchronis\xE9 pr\xE9-enregistr\xE9 ayant des sous-titres synchronis\xE9s, ces sous-titres sont-ils pertinents\xA0?",
      tests: {
        "1": [
          "Pour chaque [m\xE9dia temporel](#media-temporel-type-son-video-et-synchronise) synchronis\xE9 pr\xE9-enregistr\xE9 ayant des [sous-titres synchronis\xE9s](#sous-titres-synchronises-objet-multimedia), ces sous-titres sont-ils pertinents\xA0?"
        ]
      },
      wcag: ["1.2.2 Captions (Prerecorded) (A)"],
      techniques: ["G93", "G87", "SM11", "SM12", "F8", "F74", "F75"],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "4.5",
      theme: 4,
      title: "Chaque [m\xE9dia temporel](#media-temporel-type-son-video-et-synchronise) pr\xE9-enregistr\xE9 a-t-il, si n\xE9cessaire, une [audiodescription](#audiodescription-synchronisee-media-temporel) synchronis\xE9e (hors cas particuliers)\xA0?",
      titlePlain: "Chaque m\xE9dia temporel pr\xE9-enregistr\xE9 a-t-il, si n\xE9cessaire, une audiodescription synchronis\xE9e (hors cas particuliers)\xA0?",
      tests: {
        "1": [
          "Chaque [m\xE9dia temporel](#media-temporel-type-son-video-et-synchronise) pr\xE9-enregistr\xE9 seulement vid\xE9o v\xE9rifie-t-il, si n\xE9cessaire, une de ces conditions (hors cas particuliers)\xA0?",
          "Il existe une [audiodescription](#audiodescription-synchronisee-media-temporel) synchronis\xE9e\xA0;",
          "Il existe une version alternative avec une [audiodescription](#audiodescription-synchronisee-media-temporel) synchronis\xE9e."
        ],
        "2": [
          "Chaque [m\xE9dia temporel](#media-temporel-type-son-video-et-synchronise) synchronis\xE9 pr\xE9-enregistr\xE9 v\xE9rifie-t-il, si n\xE9cessaire, une de ces conditions (hors cas particuliers)\xA0?",
          "Il existe une [audiodescription](#audiodescription-synchronisee-media-temporel) synchronis\xE9e\xA0;",
          "Il existe une version alternative avec une [audiodescription](#audiodescription-synchronisee-media-temporel) synchronis\xE9e."
        ]
      },
      wcag: ["1.2.5 Audio Description (Prerecorded) (AA)"],
      techniques: ["G8", "G58", "G78", "G173", "H96", "SM1", "SM2", "SM6", "SM7"],
      particularCases: ["Voir cas particuliers crit\xE8re 4.1."],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "4.6",
      theme: 4,
      title: "Pour chaque [m\xE9dia temporel](#media-temporel-type-son-video-et-synchronise) pr\xE9-enregistr\xE9 ayant une [audiodescription](#audiodescription-synchronisee-media-temporel) synchronis\xE9e, celle-ci est-elle pertinente\xA0?",
      titlePlain: "Pour chaque m\xE9dia temporel pr\xE9-enregistr\xE9 ayant une audiodescription synchronis\xE9e, celle-ci est-elle pertinente\xA0?",
      tests: {
        "1": [
          "Pour chaque [m\xE9dia temporel](#media-temporel-type-son-video-et-synchronise) pr\xE9-enregistr\xE9 seulement vid\xE9o ayant une [audiodescription](#audiodescription-synchronisee-media-temporel) synchronis\xE9e, celle-ci est-elle pertinente\xA0?"
        ],
        "2": [
          "Pour chaque [m\xE9dia temporel](#media-temporel-type-son-video-et-synchronise) synchronis\xE9 ayant une [audiodescription](#audiodescription-synchronisee-media-temporel) synchronis\xE9e, celle-ci est-elle pertinente\xA0?"
        ]
      },
      wcag: ["1.2.5 Audio Description (Prerecorded) (AA)"],
      techniques: ["SM1", "SM2", "SM6", "SM7"],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "4.7",
      theme: 4,
      title: "Chaque [m\xE9dia temporel](#media-temporel-type-son-video-et-synchronise) est-il clairement identifiable (hors cas particuliers)\xA0?",
      titlePlain: "Chaque m\xE9dia temporel est-il clairement identifiable (hors cas particuliers)\xA0?",
      tests: {
        "1": [
          "Pour chaque [m\xE9dia temporel](#media-temporel-type-son-video-et-synchronise) seulement son, seulement vid\xE9o ou synchronis\xE9, le contenu textuel adjacent permet-il d\u2019identifier clairement le [m\xE9dia temporel](#media-temporel-type-son-video-et-synchronise) (hors cas particuliers)\xA0?"
        ]
      },
      wcag: ["1.1.1 Non-text Content (A)"],
      techniques: ["G68", "G100"],
      particularCases: [
        "Il existe une gestion de cas particulier lorsque le [m\xE9dia temporel](#media-temporel-type-son-video-et-synchronise) est utilis\xE9 \xE0 des fins d\xE9coratives (c\u2019est-\xE0-dire qu\u2019il n\u2019apporte aucune information). Dans cette situation, le crit\xE8re est non applicable."
      ],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "4.8",
      theme: 4,
      title: "Chaque [m\xE9dia non temporel](#media-non-temporel) a-t-il, si n\xE9cessaire, une alternative (hors cas particuliers)\xA0?",
      titlePlain: "Chaque m\xE9dia non temporel a-t-il, si n\xE9cessaire, une alternative (hors cas particuliers)\xA0?",
      tests: {
        "1": [
          "Chaque [m\xE9dia non temporel](#media-non-temporel) v\xE9rifie-t-il, si n\xE9cessaire, une de ces conditions (hors cas particuliers)\xA0?",
          "Un [lien ou un bouton adjacent](#lien-ou-bouton-adjacent), clairement identifiable, permet d\u2019acc\xE9der \xE0 une page contenant une alternative\xA0;",
          "Un [lien ou un bouton adjacent](#lien-ou-bouton-adjacent), clairement identifiable, permet d\u2019acc\xE9der \xE0 une alternative dans la page."
        ],
        "2": [
          "Chaque [m\xE9dia non temporel](#media-non-temporel) associ\xE9 \xE0 une alternative v\xE9rifie-t-il une de ces conditions (hors cas particuliers)\xA0?",
          "La page r\xE9f\xE9renc\xE9e par le [lien ou bouton adjacent](#lien-ou-bouton-adjacent) est accessible\xA0;",
          "L\u2019alternative dans la page, r\xE9f\xE9renc\xE9e par le [lien ou bouton adjacent](#lien-ou-bouton-adjacent), est accessible."
        ]
      },
      wcag: ["1.1.1 Non-text Content (A)"],
      techniques: ["H35", "H46"],
      particularCases: ["Il existe une gestion de cas particulier lorsque\xA0:", "[object Object]", "Dans ces situations, le crit\xE8re est non applicable."],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "4.9",
      theme: 4,
      title: "Pour chaque [m\xE9dia non temporel](#media-non-temporel) ayant une alternative, cette alternative est-elle pertinente\xA0?",
      titlePlain: "Pour chaque m\xE9dia non temporel ayant une alternative, cette alternative est-elle pertinente\xA0?",
      tests: {
        "1": [
          "Pour chaque [m\xE9dia non temporel](#media-non-temporel) ayant une alternative, cette alternative permet-elle d\u2019acc\xE9der au m\xEAme contenu et \xE0 des fonctionnalit\xE9s similaires\xA0?"
        ]
      },
      wcag: ["1.1.1 Non-text Content (A)"],
      techniques: ["H46", "F30"],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "4.10",
      theme: 4,
      title: "Chaque son d\xE9clench\xE9 automatiquement est-il [contr\xF4lable](#controle-son-declenche-automatiquement) par l\u2019utilisateur\xA0?",
      titlePlain: "Chaque son d\xE9clench\xE9 automatiquement est-il contr\xF4lable par l\u2019utilisateur\xA0?",
      tests: {
        "1": [
          "Chaque s\xE9quence sonore d\xE9clench\xE9e automatiquement via une balise `<object>`, `<video>`, `<audio>`, `<embed>`, `<bgsound>` ou un code JavaScript v\xE9rifie-t-elle une de ces conditions\xA0?",
          "La s\xE9quence sonore a une dur\xE9e inf\xE9rieure ou \xE9gale \xE0 3 secondes\xA0;",
          "La s\xE9quence sonore peut \xEAtre stopp\xE9e sur action de l\u2019utilisateur\xA0;",
          "Le volume de la s\xE9quence sonore peut \xEAtre contr\xF4l\xE9 par l\u2019utilisateur ind\xE9pendamment du contr\xF4le de volume du syst\xE8me."
        ]
      },
      wcag: ["1.4.2 Audio Control (A)"],
      techniques: ["G60", "G170", "G171", "F23", "F93"],
      automatability: "static",
      ruleIds: ["autoplay-media"]
    },
    {
      id: "4.11",
      theme: 4,
      title: "La consultation de chaque [m\xE9dia temporel](#media-temporel-type-son-video-et-synchronise) est-elle, si n\xE9cessaire, [contr\xF4lable par le clavier et tout dispositif de pointage](#accessible-et-activable-par-le-clavier-et-tout-dispositif-de-pointage)\xA0?",
      titlePlain: "La consultation de chaque m\xE9dia temporel est-elle, si n\xE9cessaire, contr\xF4lable par le clavier et tout dispositif de pointage\xA0?",
      tests: {
        "1": [
          "Chaque [m\xE9dia temporel](#media-temporel-type-son-video-et-synchronise) a-t-il, si n\xE9cessaire, les fonctionnalit\xE9s de [contr\xF4le de sa consultation](#controle-de-la-consultation-d-un-media-temporel)\xA0?"
        ],
        "2": [
          "Pour chaque [m\xE9dia temporel](#media-temporel-type-son-video-et-synchronise), chaque fonctionnalit\xE9 v\xE9rifie-t-elle une de ces conditions\xA0?",
          "La fonctionnalit\xE9 est [accessible par le clavier et tout dispositif de pointage](#accessible-et-activable-par-le-clavier-et-tout-dispositif-de-pointage)\xA0;",
          "Une fonctionnalit\xE9 [accessible par le clavier et tout dispositif de pointage](#accessible-et-activable-par-le-clavier-et-tout-dispositif-de-pointage) permettant de r\xE9aliser la m\xEAme action est pr\xE9sente dans la page."
        ],
        "3": [
          "Pour chaque [m\xE9dia temporel](#media-temporel-type-son-video-et-synchronise), chaque fonctionnalit\xE9 v\xE9rifie-t-elle une de ces conditions\xA0?",
          "La fonctionnalit\xE9 est [activable par le clavier et tout dispositif de pointage](#accessible-et-activable-par-le-clavier-et-tout-dispositif-de-pointage)\xA0;",
          "Une fonctionnalit\xE9 [activable par le clavier et tout dispositif de pointage](#accessible-et-activable-par-le-clavier-et-tout-dispositif-de-pointage) permettant de r\xE9aliser la m\xEAme action est pr\xE9sente dans la page."
        ]
      },
      wcag: ["2.1.1 Keyboard (A)", "2.1.2 No Keyboard Trap (A)"],
      techniques: ["G4", "G90", "G202"],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "4.12",
      theme: 4,
      title: "La consultation de chaque [m\xE9dia non temporel](#media-non-temporel) est-elle [contr\xF4lable par le clavier et tout dispositif de pointage](#accessible-et-activable-par-le-clavier-et-tout-dispositif-de-pointage)\xA0?",
      titlePlain: "La consultation de chaque m\xE9dia non temporel est-elle contr\xF4lable par le clavier et tout dispositif de pointage\xA0?",
      tests: {
        "1": [
          "Pour chaque [m\xE9dia non temporel](#media-non-temporel), chaque fonctionnalit\xE9 v\xE9rifie-t-elle une de ces conditions\xA0?",
          "La fonctionnalit\xE9 est [accessible par le clavier et tout dispositif de pointage](#accessible-et-activable-par-le-clavier-et-tout-dispositif-de-pointage)\xA0;",
          "Une fonctionnalit\xE9 [accessible par le clavier et tout dispositif de pointage](#accessible-et-activable-par-le-clavier-et-tout-dispositif-de-pointage) permettant de r\xE9aliser la m\xEAme action est pr\xE9sente dans la page."
        ],
        "2": [
          "Pour chaque [m\xE9dia non temporel](#media-non-temporel), chaque fonctionnalit\xE9 v\xE9rifie-t-elle une de ces conditions\xA0?",
          "La fonctionnalit\xE9 est [activable par le clavier et tout dispositif de pointage](#accessible-et-activable-par-le-clavier-et-tout-dispositif-de-pointage)\xA0;",
          "Une fonctionnalit\xE9 [activable par le clavier et tout dispositif de pointage](#accessible-et-activable-par-le-clavier-et-tout-dispositif-de-pointage) permettant de r\xE9aliser la m\xEAme action est pr\xE9sente dans la page."
        ]
      },
      wcag: ["2.1.1 Keyboard (A)", "2.1.2 No Keyboard Trap (A)"],
      techniques: ["G4", "G90"],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "4.13",
      theme: 4,
      title: "Chaque [m\xE9dia temporel](#media-temporel-type-son-video-et-synchronise) et [non temporel](#media-non-temporel) est-il [compatible avec les technologies d\u2019assistance](#compatible-avec-les-technologies-d-assistance) (hors cas particuliers)\xA0?",
      titlePlain: "Chaque m\xE9dia temporel et non temporel est-il compatible avec les technologies d\u2019assistance (hors cas particuliers)\xA0?",
      tests: {
        "1": [
          "Chaque [m\xE9dia temporel](#media-temporel-type-son-video-et-synchronise) et [non temporel](#media-non-temporel) v\xE9rifie-t-il une de ces conditions (hors cas particuliers)\xA0?",
          "Le nom, le r\xF4le, la valeur, le param\xE9trage et les changements d\u2019\xE9tats des composants d\u2019interfaces sont accessibles aux technologies d\u2019assistance via une API d\u2019accessibilit\xE9\xA0;",
          "Une alternative [compatible avec une API d\u2019accessibilit\xE9](#compatible-avec-les-technologies-d-assistance) permet d\u2019acc\xE9der aux m\xEAmes fonctionnalit\xE9s."
        ],
        "2": [
          "Chaque [m\xE9dia temporel](#media-temporel-type-son-video-et-synchronise) et [non temporel](#media-non-temporel) qui poss\xE8de une alternative [compatible avec les technologies d\u2019assistance](#compatible-avec-les-technologies-d-assistance), v\xE9rifie-t-il une de ces conditions\xA0?",
          "L\u2019alternative est adjacente au [m\xE9dia temporel](#media-temporel-type-son-video-et-synchronise) ou [non temporel](#media-non-temporel)\xA0;",
          "L\u2019alternative est accessible via un [lien ou bouton adjacent](#lien-ou-bouton-adjacent)\xA0;",
          "Un m\xE9canisme permet de remplacer le [m\xE9dia temporel](#media-temporel-type-son-video-et-synchronise) ou [non temporel](#media-non-temporel) par son alternative."
        ]
      },
      wcag: ["4.1.2 Name, role, Value (A)"],
      techniques: ["G10", "G135", "F15", "F54"],
      particularCases: [
        "Il existe une gestion de cas particulier lorsque\xA0le [m\xE9dia temporel](#media-temporel-type-son-video-et-synchronise) ou [non temporel](#media-non-temporel) est utilis\xE9 \xE0 des fins d\xE9coratives (c\u2019est-\xE0-dire qu\u2019il n\u2019apporte aucune information).",
        "Dans ces situations, le crit\xE8re est non applicable."
      ],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "5.1",
      theme: 5,
      title: "Chaque [tableau de donn\xE9es complexe](#tableau-de-donnees-complexe) a-t-il un [r\xE9sum\xE9](#resume-de-tableau)\xA0?",
      titlePlain: "Chaque tableau de donn\xE9es complexe a-t-il un r\xE9sum\xE9\xA0?",
      tests: {
        "1": ["Pour chaque [tableau de donn\xE9es complexe](#tableau-de-donnees-complexe), un [r\xE9sum\xE9](#resume-de-tableau) est-il disponible\xA0?"]
      },
      wcag: ["1.3.1 Info and Relationships (A)"],
      techniques: ["H73"],
      technicalNote: [
        "La sp\xE9cification HTML propose plusieurs [m\xE9thodes pour lier un r\xE9sum\xE9 \xE0 un tableau](#table-descriptions-techniques) (tableau li\xE9 \xE0 un passage de texte avec l\u2019attribut `aria-describedby`, tableau group\xE9 dans un \xE9l\xE9ment `figure` avec un r\xE9sum\xE9 pr\xE9sent dans un \xE9l\xE9ment `figcaption` ou un \xE9l\xE9ment `p`, r\xE9sum\xE9 pr\xE9sent dans un \xE9l\xE9ment `details` contenu dans l\u2019\xE9l\xE9ment `caption`). Ces m\xE9thodes n\u2019ont pas un support suffisant pour \xEAtre utilis\xE9es actuellement."
      ],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "5.2",
      theme: 5,
      title: "Pour chaque [tableau de donn\xE9es complexe](#tableau-de-donnees-complexe) ayant un [r\xE9sum\xE9](#resume-de-tableau), celui-ci est-il pertinent\xA0?",
      titlePlain: "Pour chaque tableau de donn\xE9es complexe ayant un r\xE9sum\xE9, celui-ci est-il pertinent\xA0?",
      tests: {
        "1": ["Pour chaque [tableau de donn\xE9es complexe](#tableau-de-donnees-complexe) ayant un [r\xE9sum\xE9](#resume-de-tableau), celui-ci est-il pertinent\xA0?"]
      },
      wcag: ["1.3.1 Info and Relationships (A)"],
      techniques: ["H73"],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "5.3",
      theme: 5,
      title: "Pour chaque [tableau de mise en forme](#tableau-de-mise-en-forme), le contenu lin\xE9aris\xE9 reste-t-il compr\xE9hensible\xA0?",
      titlePlain: "Pour chaque tableau de mise en forme, le contenu lin\xE9aris\xE9 reste-t-il compr\xE9hensible\xA0?",
      tests: {
        "1": [
          "Chaque [tableau de mise en forme](#tableau-de-mise-en-forme) v\xE9rifie-t-il ces conditions\xA0?",
          "Le contenu lin\xE9aris\xE9 reste compr\xE9hensible\xA0;",
          'La balise `<table>` poss\xE8de un attribut `role="presentation"`.'
        ]
      },
      wcag: ["1.3.2 Meaningful Sequence (A)", "4.1.2 Name, Role, Value (A)"],
      techniques: ["F49", "ARIA4"],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "5.4",
      theme: 5,
      title: "Pour chaque [tableau de donn\xE9es ayant un titre](#tableau-de-donnees-ayant-un-titre), le titre est-il correctement associ\xE9 au tableau de donn\xE9es\xA0?",
      titlePlain: "Pour chaque tableau de donn\xE9es ayant un titre, le titre est-il correctement associ\xE9 au tableau de donn\xE9es\xA0?",
      tests: {
        "1": [
          "Pour chaque [tableau de donn\xE9es ayant un titre](#tableau-de-donnees-ayant-un-titre), le titre est-il correctement associ\xE9 au tableau de donn\xE9es\xA0?"
        ]
      },
      wcag: ["1.3.1 Info and Relationships (A)"],
      techniques: ["H39"],
      automatability: "static",
      ruleIds: ["table-caption-missing"]
    },
    {
      id: "5.5",
      theme: 5,
      title: "Pour chaque [tableau de donn\xE9es ayant un titre](#tableau-de-donnees-ayant-un-titre), celui-ci est-il pertinent\xA0?",
      titlePlain: "Pour chaque tableau de donn\xE9es ayant un titre, celui-ci est-il pertinent\xA0?",
      tests: {
        "1": [
          "Pour chaque [tableau de donn\xE9es ayant un titre](#tableau-de-donnees-ayant-un-titre), ce titre permet-il d\u2019identifier le contenu du [tableau de donn\xE9es](#tableau-de-donnees) de mani\xE8re claire et concise\xA0?"
        ]
      },
      wcag: ["1.3.1 Info and Relationships (A)"],
      techniques: ["H39"],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "5.6",
      theme: 5,
      title: "Pour chaque [tableau de donn\xE9es](#tableau-de-donnees), chaque [en-t\xEAte de colonne](#en-tete-de-colonne-ou-de-ligne) et chaque [en-t\xEAte de ligne](#en-tete-de-colonne-ou-de-ligne) sont-ils correctement d\xE9clar\xE9s\xA0?",
      titlePlain: "Pour chaque tableau de donn\xE9es, chaque en-t\xEAte de colonne et chaque en-t\xEAte de ligne sont-ils correctement d\xE9clar\xE9s\xA0?",
      tests: {
        "1": [
          "Pour chaque [tableau de donn\xE9es](#tableau-de-donnees), chaque [en-t\xEAte de colonne](#en-tete-de-colonne-ou-de-ligne) s\u2019appliquant \xE0 la totalit\xE9 de la colonne v\xE9rifie-t-il une de ces conditions\xA0?",
          "L\u2019[en-t\xEAte de colonnes](#en-tete-de-colonne-ou-de-ligne) est structur\xE9 au moyen d\u2019une balise `<th>`\xA0;",
          'L\u2019[en-t\xEAte de colonnes](#en-tete-de-colonne-ou-de-ligne) est structur\xE9 au moyen d\u2019une balise pourvue d\u2019un attribut WAI-ARIA `role="columnheader"`.'
        ],
        "2": [
          "Pour chaque [tableau de donn\xE9es](#tableau-de-donnees), chaque [en-t\xEAte de ligne](#en-tete-de-colonne-ou-de-ligne) s\u2019appliquant \xE0 la totalit\xE9 de la ligne v\xE9rifie-t-il une de ces conditions\xA0?",
          "L\u2019[en-t\xEAte de lignes](#en-tete-de-colonne-ou-de-ligne) est structur\xE9 au moyen d\u2019une balise `<th>`\xA0;",
          'L\u2019[en-t\xEAte de lignes](#en-tete-de-colonne-ou-de-ligne) est structur\xE9 au moyen d\u2019une balise pourvue d\u2019un attribut WAI-ARIA `role="rowheader"`.'
        ],
        "3": [
          "Pour chaque [tableau de donn\xE9es](#tableau-de-donnees), chaque en-t\xEAte ne s\u2019appliquant pas \xE0 la totalit\xE9 de la ligne ou de la colonne est-il structur\xE9 au moyen d\u2019une balise `<th>`\xA0?"
        ],
        "4": [
          "Pour chaque [tableau de donn\xE9es](#tableau-de-donnees), chaque cellule associ\xE9e \xE0 plusieurs en-t\xEAtes est-elle structur\xE9e au moyen d\u2019une balise `<td>` ou `<th>`\xA0?"
        ]
      },
      wcag: ["1.3.1 Info and Relationships (A)"],
      techniques: ["H51", "F91"],
      automatability: "static",
      ruleIds: ["data-table-no-headers"]
    },
    {
      id: "5.7",
      theme: 5,
      title: "Pour chaque [tableau de donn\xE9es](#tableau-de-donnees), la technique appropri\xE9e permettant d\u2019associer chaque cellule avec ses [en-t\xEAtes](#en-tete-de-colonne-ou-de-ligne) est-elle utilis\xE9e (hors cas particuliers)\xA0?",
      titlePlain: "Pour chaque tableau de donn\xE9es, la technique appropri\xE9e permettant d\u2019associer chaque cellule avec ses en-t\xEAtes est-elle utilis\xE9e (hors cas particuliers)\xA0?",
      tests: {
        "1": [
          "Pour chaque contenu de balise `<th>` s\u2019appliquant \xE0 la totalit\xE9 de la ligne ou de la colonne, la balise `<th>` respecte-t-elle une de ces conditions (hors cas particuliers)\xA0?",
          "La balise `<th>` poss\xE8de un attribut `id` unique\xA0;",
          "La balise `<th>` poss\xE8de un attribut `scope`\xA0;",
          'La balise `<th>` poss\xE8de un attribut WAI-ARIA `role="rowheader"` ou `role="columnheader"`.'
        ],
        "2": [
          "Pour chaque contenu de balise `<th>` s\u2019appliquant \xE0 la totalit\xE9 de la ligne ou de la colonne et poss\xE9dant un attribut `scope`, la balise `<th>` v\xE9rifie-t-elle une de ces conditions\xA0?",
          'La balise `<th>` poss\xE8de un attribut `scope` avec la valeur `"row"` pour les [en-t\xEAtes de ligne](#en-tete-de-colonne-ou-de-ligne)\xA0;',
          'La balise `<th>` poss\xE8de un attribut `scope` avec la valeur `"col"` pour les [en-t\xEAtes de colonne](#en-tete-de-colonne-ou-de-ligne).'
        ],
        "3": [
          "Pour chaque contenu de balise `<th>` ne s\u2019appliquant pas \xE0 la totalit\xE9 de la ligne ou de la colonne, la balise `<th>` v\xE9rifie-t-elle ces conditions\xA0?",
          "La balise `<th>` ne poss\xE8de pas d\u2019attribut `scope`\xA0;",
          'La balise `<th>` ne poss\xE8de pas d\u2019attribut WAI-ARIA `role="rowheader"` ou `role="columnheader"`\xA0;',
          "La balise `<th>` poss\xE8de un attribut `id` unique."
        ],
        "4": [
          "Pour chaque contenu de balise `<td>` ou `<th>` associ\xE9e \xE0 un ou plusieurs en-t\xEAtes poss\xE9dant un attribut `id`, la balise v\xE9rifie-t-elle ces conditions\xA0?",
          "La balise poss\xE8de un attribut `headers`\xA0;",
          "L\u2019attribut `headers` poss\xE8de la liste des valeurs d\u2019attribut `id` des [en-t\xEAtes](#en-tete-de-colonne-ou-de-ligne) associ\xE9s."
        ],
        "5": [
          'Pour chaque balise pourvue d\u2019un attribut WAI-ARIA `role="rowheader"` ou `role="columnheader"` dont le contenu s\u2019applique \xE0 la totalit\xE9 de la ligne ou de la colonne, la balise v\xE9rifie-t-elle une de ces conditions\xA0?',
          'La balise poss\xE8de un attribut WAI-ARIA `role="rowheader"` pour les [en-t\xEAtes de ligne](#en-tete-de-colonne-ou-de-ligne)\xA0;',
          'La balise poss\xE8de un attribut WAI-ARIA `role="columnheader"` pour les [en-t\xEAtes de colonne](#en-tete-de-colonne-ou-de-ligne).'
        ]
      },
      wcag: ["1.3.1 Info and Relationships (A)"],
      techniques: ["H43", "H63", "F90"],
      technicalNote: [
        "Si l\u2019attribut `headers` est impl\xE9ment\xE9 sur une cellule d\xE9j\xE0 reli\xE9e \xE0 un en-t\xEAte (de ligne ou de colonne) avec l\u2019attribut `scope` (avec la valeur `col` ou `row`), c\u2019est l\u2019en-t\xEAte ou les en-t\xEAtes r\xE9f\xE9renc\xE9s par l\u2019attribut `headers` qui seront restitu\xE9s aux technologies d\u2019assistance. Les en-t\xEAtes reli\xE9s avec l\u2019attribut `scope` seront ignor\xE9s."
      ],
      particularCases: [
        "Dans le cas de tableaux de donn\xE9es ayant des en-t\xEAtes sur une seule ligne ou une seule colonne, les en-t\xEAtes peuvent \xEAtre structur\xE9s \xE0 l\u2019aide de balise `<th>` sans attribut `scope`."
      ],
      automatability: "static",
      ruleIds: ["data-table-no-headers"]
    },
    {
      id: "5.8",
      theme: 5,
      title: "Chaque [tableau de mise en forme](#tableau-de-mise-en-forme) ne doit pas utiliser d\u2019\xE9l\xE9ments propres aux  [tableaux de donn\xE9es](#tableau-de-donnees). Cette r\xE8gle est-elle respect\xE9e\xA0?",
      titlePlain: "Chaque tableau de mise en forme ne doit pas utiliser d\u2019\xE9l\xE9ments propres aux  tableaux de donn\xE9es. Cette r\xE8gle est-elle respect\xE9e\xA0?",
      tests: {
        "1": [
          "Chaque [tableau de mise en forme](#tableau-de-mise-en-forme) (balise `<table>`) v\xE9rifie-t-il ces conditions\xA0?",
          'Le tableau de mise en forme (balise `<table>`) n\u2019a pas d\u2019attribut `summary` (sinon vide) et ne contient pas de balises `<caption>`, `<th>`, `<thead>`, `<tfoot>` ou de balises ayant un attribut WAI-ARIA `role="rowheader"`, `role="columnheader"`\xA0;',
          "Les cellules du tableau de mise en forme (balises `<td>`) ne poss\xE8dent pas d\u2019attributs `scope`, `headers` et `axis`."
        ]
      },
      wcag: ["1.3.1 Info and Relationships (A)"],
      techniques: ["F46"],
      automatability: "static",
      ruleIds: ["layout-table-data-markup"]
    },
    {
      id: "6.1",
      theme: 6,
      title: "Chaque [lien](#lien) est-il explicite (hors cas particuliers)\xA0?",
      titlePlain: "Chaque lien est-il explicite (hors cas particuliers)\xA0?",
      tests: {
        "1": [
          "Chaque [lien texte](#lien-texte) v\xE9rifie-t-il une de ces conditions (hors cas particuliers)\xA0?",
          "L\u2019[intitul\xE9 de lien](#intitule-ou-nom-accessible-de-lien) seul permet d\u2019en comprendre la fonction et la destination\xA0;",
          "L\u2019[intitul\xE9 de lien](#intitule-ou-nom-accessible-de-lien) additionn\xE9 au [contexte du lien](#contexte-du-lien) permet d\u2019en comprendre la fonction et la destination."
        ],
        "2": [
          "Chaque [lien image](#lien-image) v\xE9rifie-t-il une de ces conditions (hors cas particuliers)\xA0?",
          "L\u2019[intitul\xE9 de lien](#intitule-ou-nom-accessible-de-lien) seul permet d\u2019en comprendre la fonction et la destination\xA0;",
          "L\u2019[intitul\xE9 de lien](#intitule-ou-nom-accessible-de-lien) additionn\xE9 au [contexte du lien](#contexte-du-lien) permet d\u2019en comprendre la fonction et la destination."
        ],
        "3": [
          "Chaque [lien composite](#lien-composite) v\xE9rifie-t-il une de ces conditions (hors cas particuliers)\xA0?",
          "L\u2019[intitul\xE9 de lien](#intitule-ou-nom-accessible-de-lien) seul permet d\u2019en comprendre la fonction et la destination\xA0;",
          "L\u2019[intitul\xE9 de lien](#intitule-ou-nom-accessible-de-lien) additionn\xE9 au [contexte du lien](#contexte-du-lien) permet d\u2019en comprendre la fonction et la destination."
        ],
        "4": [
          "Chaque [lien SVG](#lien-svg) v\xE9rifie-t-il une de ces conditions (hors cas particuliers)\xA0?",
          "L\u2019[intitul\xE9 de lien](#intitule-ou-nom-accessible-de-lien) seul permet d\u2019en comprendre la fonction et la destination\xA0;",
          "L\u2019[intitul\xE9 de lien](#intitule-ou-nom-accessible-de-lien) additionn\xE9 au [contexte du lien](#contexte-du-lien) permet d\u2019en comprendre la fonction et la destination."
        ],
        "5": [
          "Pour chaque [lien](#lien) ayant un [intitul\xE9 visible](#intitule-visible), le [nom accessible du lien](#intitule-ou-nom-accessible-de-lien) contient-il au moins l\u2019[intitul\xE9 visible](#intitule-visible) (hors cas particuliers)\xA0?"
        ]
      },
      wcag: ["1.1.1 Non-text Content (A)", "2.4.4 Link Purpose (In Context) (A)", "2.5.3 Label in Name (A)"],
      techniques: ["H30", "H78", "H79", "H80", "H81", "G53", "G91", "F63", "F89", "ARIA7", "ARIA8"],
      technicalNote: [
        "Lorsque l\u2019intitul\xE9 visible est compl\xE9t\xE9 par une autre expression dans le nom accessible\xA0:",
        "[object Object]",
        "Par exemple, si l\u2019on consid\xE8re l\u2019intitul\xE9 visible \xAB\xA0Commander maintenant\xA0\xBB compl\xE9t\xE9 dans le nom accessible par l\u2019expression \xAB\xA0produit X\xA0\xBB, on peut avoir les diff\xE9rents cas suivants\xA0:",
        "[object Object]"
      ],
      particularCases: [
        "Il existe une gestion de cas particuliers pour les tests 6.1.1, 6.1.2, 6.1.3 et 6.1.4 lorsque le lien est [ambigu pour tout le monde](#ambigu-pour-tout-le-monde). Dans cette situation, o\xF9 il n\u2019est pas possible de rendre le lien explicite dans son contexte, le crit\xE8re est non applicable.",
        "Il existe une gestion de cas particuliers pour le test 6.1.5 lorsque\xA0:",
        "[object Object]",
        "Note\xA0: si l\u2019\xE9tiquette visible repr\xE9sente une expression math\xE9matique, les symboles math\xE9matiques peuvent \xEAtre repris litt\xE9ralement pour servir d\u2019\xE9tiquette au nom accessible (ex.\xA0: \u201CA>B\u201D). Il est laiss\xE9 \xE0 l\u2019utilisateur le soin d\u2019op\xE9rer la correspondance entre l\u2019expression et ce qu\u2019il doit \xE9peler compte tenu de la connaissance qu\u2019il a du fonctionnement de son logiciel de saisie vocale (\u201CA plus grand que B\u201D ou \u201CA sup\xE9rieur \xE0 B\u201D)."
      ],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "6.2",
      theme: 6,
      title: "Dans chaque page web, chaque [lien](#lien) a-t-il un [intitul\xE9](#intitule-ou-nom-accessible-de-lien)\xA0?",
      titlePlain: "Dans chaque page web, chaque lien a-t-il un intitul\xE9\xA0?",
      tests: {
        "1": ["Dans chaque page web, chaque [lien](#lien) a-t-il un [intitul\xE9](#intitule-ou-nom-accessible-de-lien) entre `<a>` et `</a>`\xA0?"]
      },
      wcag: ["1.1.1 Non-text Content (A)", "2.4.4 Link Purpose (In Context) (A)"],
      techniques: ["H30", "G91", "F89"],
      technicalNote: [
        "Une ancre n\u2019est pas un lien m\xEAme si pendant longtemps l\u2019\xE9l\xE9ment `<a>` a servi de support \xE0 cette technique. Elle n\u2019est donc pas concern\xE9e par le pr\xE9sent crit\xE8re."
      ],
      automatability: "static",
      ruleIds: ["link-empty-name", "icon-only-control-unnamed"]
    },
    {
      id: "7.1",
      theme: 7,
      title: "Chaque [script](#script) est-il, si n\xE9cessaire, [compatible avec les technologies d\u2019assistance](#compatible-avec-les-technologies-d-assistance)\xA0?",
      titlePlain: "Chaque script est-il, si n\xE9cessaire, compatible avec les technologies d\u2019assistance\xA0?",
      tests: {
        "1": [
          "Chaque [script](#script) qui g\xE9n\xE8re ou contr\xF4le un [composant d\u2019interface](#composant-d-interface) v\xE9rifie-t-il, si n\xE9cessaire, une de ces conditions\xA0?",
          "Le [nom, le r\xF4le, la valeur, le param\xE9trage et les changements d\u2019\xE9tats](#le-nom-le-role-la-valeur-le-parametrage-et-les-changements-d-etats) sont accessibles aux technologies d\u2019assistance via une API d\u2019accessibilit\xE9\xA0;",
          "Un [composant d\u2019interface](#composant-d-interface) accessible permettant d\u2019acc\xE9der aux m\xEAmes fonctionnalit\xE9s est pr\xE9sent dans la page\xA0;",
          "Une [alternative](#alternative-a-script) accessible permet d\u2019acc\xE9der aux m\xEAmes fonctionnalit\xE9s."
        ],
        "2": [
          "Chaque [script](#script) qui g\xE9n\xE8re ou contr\xF4le un [composant d\u2019interface](#composant-d-interface) respecte-t-il une de ces conditions\xA0?",
          "Le [composant d\u2019interface](#composant-d-interface) est [correctement restitu\xE9](#correctement-restitue-par-les-technologies-d-assistance) par les technologies d\u2019assistance\xA0;",
          "Une [alternative](#alternative-a-script) accessible permet d\u2019acc\xE9der aux m\xEAmes fonctionnalit\xE9s."
        ],
        "3": [
          "Chaque [script](#script) qui g\xE9n\xE8re ou contr\xF4le un [composant d\u2019interface](#composant-d-interface) v\xE9rifie-t-il ces conditions (hors cas particuliers)\xA0?",
          "Le composant poss\xE8de un nom pertinent\xA0;",
          "Le nom accessible du composant contient au moins l\u2019[intitul\xE9 visible](#intitule-visible)\xA0;",
          "Le composant poss\xE8de un r\xF4le pertinent."
        ]
      },
      wcag: ["2.5.3 Label in Name (A)", "4.1.2 Name, Role, Value (A)"],
      techniques: ["G10", "G135", "G136", "F15", "F19", "F20", "F42", "F59", "F79", "ARIA4", "ARIA5", "ARIA18", "ARIA19", "SCR21"],
      technicalNote: [
        "Le crit\xE8re 7.1 impl\xE9mente la notion de \xAB\xA0compatible avec les technologies d\u2019assistance\xA0\xBB telle que d\xE9finie par les WCAG, ainsi que le recours \xE0 WAI-ARIA pour rendre un composant ou une fonctionnalit\xE9 accessible. Le bon usage de WAI-ARIA est v\xE9rifi\xE9 via les tests 7.1.1, 7.1.2, 7.1.3.",
        "Note importante\xA0: dans un environnement HTML5, beaucoup de composants peuvent n\xE9cessiter JavaScript pour fonctionner\xA0; en cons\xE9quence la fourniture d\u2019une alternative \xE0 un composant JavaScript qui ne pourrait pas \xEAtre rendu accessible devra b\xE9n\xE9ficier d\u2019une m\xE9thode sp\xE9cifique au composant en cause, permettant de le remplacer par une alternative accessible (et de le r\xE9activer). Cela signifie que la d\xE9sactivation de JavaScript pour l\u2019ensemble de la page ne sera pas accept\xE9e comme une m\xE9thode valable, \xE0 moins qu\u2019elle ne remette pas en cause l\u2019utilisation des autres composants."
      ],
      particularCases: [
        "Il existe une gestion de cas particuliers pour le test 7.1.3 lorsque\xA0:",
        "[object Object]",
        "Note\xA0: si l\u2019\xE9tiquette visible repr\xE9sente une expression math\xE9matique, les symboles math\xE9matiques peuvent \xEAtre repris litt\xE9ralement pour servir d\u2019\xE9tiquette au nom accessible (ex.\xA0: \u201CA>B\u201D). Il est laiss\xE9 \xE0 l\u2019utilisateur le soin d\u2019op\xE9rer la correspondance entre l\u2019expression et ce qu\u2019il doit \xE9peler compte tenu de la connaissance qu\u2019il a du fonctionnement de son logiciel de saisie vocale (\u201CA plus grand que B\u201D ou \u201CA sup\xE9rieur \xE0 B\u201D)."
      ],
      automatability: "static",
      ruleIds: [
        "invalid-aria-role",
        "redundant-aria",
        "button-empty-name",
        "clickable-noninteractive",
        "aria-ref-missing-id",
        "icon-only-control-unnamed",
        "aria-required-children",
        "aria-hidden-focusable",
        "nested-interactive"
      ]
    },
    {
      id: "7.2",
      theme: 7,
      title: "Pour chaque [script](#script) ayant une [alternative](#alternative-a-script), cette alternative est-elle pertinente\xA0?",
      titlePlain: "Pour chaque script ayant une alternative, cette alternative est-elle pertinente\xA0?",
      tests: {
        "1": [
          "Chaque [script](#script) d\xE9butant par la balise `<script>` et ayant une [alternative](#alternative-a-script) v\xE9rifie-t-il une de ces conditions\xA0?",
          "L\u2019[alternative](#alternative-a-script) entre `<noscript>` et `</noscript>` permet d\u2019acc\xE9der \xE0 des contenus et des fonctionnalit\xE9s similaires\xA0;",
          "La page affich\xE9e, lorsque JavaScript est d\xE9sactiv\xE9, permet d\u2019acc\xE9der \xE0 des contenus et des fonctionnalit\xE9s similaires\xA0;",
          "La page alternative permet d\u2019acc\xE9der \xE0 des contenus et des fonctionnalit\xE9s similaires\xA0;",
          "Le langage de script c\xF4t\xE9 serveur permet d\u2019acc\xE9der \xE0 des contenus et des fonctionnalit\xE9s similaires\xA0;",
          "L\u2019alternative pr\xE9sente dans la page permet d\u2019acc\xE9der \xE0 des contenus et des fonctionnalit\xE9s similaires."
        ],
        "2": [
          "Chaque \xE9l\xE9ment non textuel mis \xE0 jour par un [script](#script) (dans la page, ou dans un [cadre](#cadre)) et ayant une [alternative](#alternative-a-script) v\xE9rifie-t-il ces conditions\xA0?",
          "L\u2019alternative de l\u2019\xE9l\xE9ment non textuel est mise \xE0 jour\xA0;",
          "L\u2019alternative mise \xE0 jour est pertinente."
        ]
      },
      wcag: ["1.1.1 Non-text Content (A)", "4.1.2 Name, Role, Value (A)"],
      techniques: ["G136", "F19", "F20"],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "7.3",
      theme: 7,
      title: "Chaque [script](#script) est-il [contr\xF4lable par le clavier et par tout dispositif de pointage](#accessible-et-activable-par-le-clavier-et-tout-dispositif-de-pointage) (hors cas particuliers)\xA0?",
      titlePlain: "Chaque script est-il contr\xF4lable par le clavier et par tout dispositif de pointage (hors cas particuliers)\xA0?",
      tests: {
        "1": [
          "Chaque \xE9l\xE9ment poss\xE9dant un gestionnaire d\u2019\xE9v\xE9nement contr\xF4l\xE9 par un script v\xE9rifie-t-il une de ces conditions (hors cas particuliers)\xA0?",
          "L\u2019\xE9l\xE9ment est [accessible par le clavier et tout dispositif de pointage](#accessible-et-activable-par-le-clavier-et-tout-dispositif-de-pointage)\xA0;",
          "Un \xE9l\xE9ment [accessible par le clavier et tout dispositif de pointage](#accessible-et-activable-par-le-clavier-et-tout-dispositif-de-pointage) permettant de r\xE9aliser la m\xEAme action est pr\xE9sent dans la page."
        ],
        "2": ["Un [script](#script) ne doit pas supprimer le focus d\u2019un \xE9l\xE9ment qui le re\xE7oit. Cette r\xE8gle est-elle respect\xE9e (hors cas particuliers)\xA0?"]
      },
      wcag: ["1.3.1 Info and Relationships (A)", "2.1.1 Keyboard (A)", "2.4.7 Focus Visible (AA)"],
      techniques: ["G90", "G202", "F42", "F54", "F55", "SCR2", "SCR20", "SCR29", "SCR35"],
      particularCases: [
        "Il existe une gestion de cas particuliers lorsque la fonctionnalit\xE9 d\xE9pend de l\u2019utilisation d\u2019un gestionnaire d\u2019\xE9v\xE9nement sans \xE9quivalent universel\xA0; par exemple, une application de dessin \xE0 main lev\xE9e ne pourra pas \xEAtre rendue contr\xF4lable au clavier. Dans ces situations, le crit\xE8re est non applicable."
      ],
      automatability: "static",
      ruleIds: ["clickable-noninteractive"]
    },
    {
      id: "7.4",
      theme: 7,
      title: "Pour chaque [script](#script) qui initie un [changement de contexte](#changement-de-contexte), l\u2019utilisateur est-il averti ou en a-t-il le contr\xF4le\xA0?",
      titlePlain: "Pour chaque script qui initie un changement de contexte, l\u2019utilisateur est-il averti ou en a-t-il le contr\xF4le\xA0?",
      tests: {
        "1": [
          "Chaque [script](#script) qui initie un [changement de contexte](#changement-de-contexte) v\xE9rifie-t-il une de ces conditions\xA0?",
          "L\u2019utilisateur est averti par un texte de l\u2019action du script et du type de changement avant son d\xE9clenchement\xA0;",
          "Le changement de contexte est initi\xE9 par un bouton (input de type `submit`, `button` ou `image` ou balise `<button>`) explicite\xA0;",
          "Le changement de contexte est initi\xE9 par un lien explicite."
        ]
      },
      wcag: ["3.2.1 On Focus (A)", "3.2.2 On Input (A)"],
      techniques: ["G13", "G76", "G80", "G107", "H32", "H84", "F9", "F22", "F36", "F37", "F41", "SCR19"],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "7.5",
      theme: 7,
      title: "Dans chaque page web, les [messages de statut](#message-de-statut) sont-ils correctement restitu\xE9s par les technologies d\u2019assistance\xA0?",
      titlePlain: "Dans chaque page web, les messages de statut sont-ils correctement restitu\xE9s par les technologies d\u2019assistance\xA0?",
      tests: {
        "1": [
          'Chaque [message de statut](#message-de-statut) qui informe de la r\xE9ussite, du r\xE9sultat d\u2019une action ou bien de l\u2019\xE9tat d\u2019une application utilise-t-il l\u2019attribut WAI-ARIA `role="status"`\xA0?'
        ],
        "2": [
          'Chaque [message de statut](#message-de-statut) qui pr\xE9sente une suggestion, ou avertit de l\u2019existence d\u2019une erreur utilise-t-il l\u2019attribut WAI-ARIA `role="alert"`\xA0?'
        ],
        "3": [
          'Chaque [message de statut](#message-de-statut) qui indique la progression d\u2019un processus utilise-t-il l\u2019un des attributs WAI-ARIA `role="log"`, `role="progressbar"` ou `role="status"`\xA0?'
        ]
      },
      wcag: ["4.1.3 Status Messages (AA)"],
      techniques: ["ARIA19", "ARIA22", "ARIA23"],
      technicalNote: [
        "Les r\xF4les WAI-ARIA `log`, `status` et `alert` ont implicitement une valeur d\u2019attribut WAI-ARIA `aria-live` et `aria-atomic`. On pourra donc consid\xE9rer (conform\xE9ment \xE0 la sp\xE9cification WAI-ARIA 1.1) que\xA0:",
        "[object Object]",
        "C\u2019est sous r\xE9serve que la nature du message de statut satisfasse bien \xE0 la correspondance implicitement \xE9tablie. Dans le cas d\u2019un message de statut indiquant la progression d\u2019un processus et mat\xE9rialis\xE9 graphiquement par une barre de progression, un r\xF4le WAI-ARIA `progressbar` explicite est n\xE9cessaire."
      ],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "8.1",
      theme: 8,
      title: "Chaque page web est-elle d\xE9finie par un [type de document](#type-de-document)\xA0?",
      titlePlain: "Chaque page web est-elle d\xE9finie par un type de document\xA0?",
      tests: {
        "1": ["Pour chaque page web, le [type de document](#type-de-document) (balise `doctype`) est-il pr\xE9sent\xA0?"],
        "2": ["Pour chaque page web, le [type de document](#type-de-document) (balise `doctype`) est-il valide\xA0?"],
        "3": [
          "Pour chaque page web poss\xE9dant une d\xE9claration de [type de document](#type-de-document), celle-ci est-elle situ\xE9e avant la balise `<html>` dans le code source\xA0?"
        ]
      },
      wcag: ["4.1.1 Parsing (A)"],
      techniques: ["G134", "G192"],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "8.2",
      theme: 8,
      title: "Pour chaque page web, le code source g\xE9n\xE9r\xE9 est-il valide selon le [type de document](#type-de-document) sp\xE9cifi\xE9\xA0?",
      titlePlain: "Pour chaque page web, le code source g\xE9n\xE9r\xE9 est-il valide selon le type de document sp\xE9cifi\xE9\xA0?",
      tests: {
        "1": [
          "Pour chaque d\xE9claration de [type de document](#type-de-document), le code source g\xE9n\xE9r\xE9 de la page v\xE9rifie-t-il ces conditions\xA0?",
          "Les balises, attributs et valeurs d\u2019attributs respectent les [r\xE8gles d\u2019\xE9criture](#regles-d-ecriture)\xA0;",
          "L\u2019imbrication des balises est conforme\xA0;",
          "L\u2019ouverture et la fermeture des balises sont conformes\xA0;",
          "Les valeurs d\u2019attribut id sont uniques dans la page\xA0;",
          "Les attributs ne sont pas doubl\xE9s sur un m\xEAme \xE9l\xE9ment."
        ]
      },
      wcag: ["4.1.1 Parsing (A)", "4.1.2 Name, Role, Value (A)"],
      techniques: ["H74", "H93", "H94", "F70", "F77"],
      automatability: "static",
      ruleIds: ["duplicate-id"]
    },
    {
      id: "8.3",
      theme: 8,
      title: "Dans chaque page web, la [langue par d\xE9faut](#langue-par-defaut) est-elle pr\xE9sente\xA0?",
      titlePlain: "Dans chaque page web, la langue par d\xE9faut est-elle pr\xE9sente\xA0?",
      tests: {
        "1": [
          "Pour chaque page web, l\u2019indication de langue par d\xE9faut v\xE9rifie-t-elle une de ces conditions\xA0?",
          "L\u2019indication de la langue de la page (attribut `lang` et/ou `xml:lang`) est donn\xE9e pour l\u2019\xE9l\xE9ment `html`\xA0;",
          "L\u2019indication de la langue de la page (attribut `lang` et/ou `xml:lang`) est donn\xE9e sur chaque \xE9l\xE9ment de texte ou sur l\u2019un des \xE9l\xE9ments parents."
        ]
      },
      wcag: ["3.1.1 Language of Page (A)"],
      techniques: ["H57"],
      automatability: "static",
      ruleIds: ["html-lang-missing"]
    },
    {
      id: "8.4",
      theme: 8,
      title: "Pour chaque page web ayant une [langue par d\xE9faut](#langue-par-defaut), le [code de langue](#code-de-langue) est-il pertinent\xA0?",
      titlePlain: "Pour chaque page web ayant une langue par d\xE9faut, le code de langue est-il pertinent\xA0?",
      tests: {
        "1": [
          "Pour chaque page web ayant une langue par d\xE9faut, le code de langue v\xE9rifie-t-il ces conditions\xA0?",
          "Le code de langue est valide\xA0;",
          "Le code de langue est pertinent."
        ]
      },
      wcag: ["3.1.1 Language of Page (A)"],
      techniques: ["H57"],
      automatability: "judgment",
      ruleIds: ["lang-invalid"]
    },
    {
      id: "8.5",
      theme: 8,
      title: "Chaque page web a-t-elle un [titre de page](#titre-de-page)\xA0?",
      titlePlain: "Chaque page web a-t-elle un titre de page\xA0?",
      tests: {
        "1": ["Chaque page web a-t-elle un [titre de page](#titre-de-page) (balise `<title>`)\xA0?"]
      },
      wcag: ["2.4.2 Page Titled (A)"],
      techniques: ["G88", "G127", "H25"],
      automatability: "static",
      ruleIds: ["title-missing-empty"]
    },
    {
      id: "8.6",
      theme: 8,
      title: "Pour chaque page web ayant un [titre de page](#titre-de-page), ce titre est-il pertinent\xA0?",
      titlePlain: "Pour chaque page web ayant un titre de page, ce titre est-il pertinent\xA0?",
      tests: {
        "1": ["Pour chaque page web ayant un [titre de page](#titre-de-page) (balise `<title>`), le contenu de cette balise est-il pertinent\xA0?"]
      },
      wcag: ["2.4.2 Page Titled (A)"],
      techniques: ["G88", "G127", "H25"],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "8.7",
      theme: 8,
      title: "Dans chaque page web, chaque [changement de langue](#changement-de-langue) est-il indiqu\xE9 dans le code source (hors cas particuliers)\xA0?",
      titlePlain: "Dans chaque page web, chaque changement de langue est-il indiqu\xE9 dans le code source (hors cas particuliers)\xA0?",
      tests: {
        "1": [
          "Dans chaque page web, chaque texte \xE9crit dans une langue diff\xE9rente de la [langue par d\xE9faut](#langue-par-defaut) v\xE9rifie-t-il une de ces conditions (hors cas particuliers)\xA0?",
          "L\u2019indication de langue est donn\xE9e sur l\u2019\xE9l\xE9ment contenant le texte (attribut `lang` et/ou `xml:lang`)\xA0;",
          "L\u2019indication de langue est donn\xE9e sur un des \xE9l\xE9ments parents (attribut `lang` et/ou `xml:lang`)"
        ]
      },
      wcag: ["3.1.2 Language of Parts (AA)"],
      techniques: ["H58"],
      particularCases: [
        "Il y a une gestion de cas particuliers sur le changement de langue pour les cas suivants\xA0:",
        "[object Object]",
        "Note 1\xA0: le dictionnaire officiel est celui recommand\xE9 par l\u2019acad\xE9mie en charge de la langue en question. Pour la France, par exemple, le lien vers le dictionnaire officiel se trouve sur le site de l\u2019Acad\xE9mie fran\xE7aise \xE0 l\u2019adresse suivante\xA0: http://www.academie-francaise.fr/le-dictionnaire/la-9e-edition. Pour toute demande aupr\xE8s du service du dictionnaire de l\u2019Acad\xE9mie fran\xE7aise, utiliser le formulaire de contact du service du dictionnaire.",
        "Note 2\xA0: pour les noms communs de langue \xE9trang\xE8re, absents dans le dictionnaire officiel de la langue par d\xE9faut de la page web, et qui sont pass\xE9s dans le langage commun (exemple\xA0: newsletter)\xA0: le crit\xE8re est applicable, uniquement lorsque l\u2019absence d\u2019indication de langue peut provoquer une incompr\xE9hension pour la restitution."
      ],
      automatability: "static",
      ruleIds: ["inline-lang-change-missing"]
    },
    {
      id: "8.8",
      theme: 8,
      title: "Dans chaque page web, le code de langue de chaque [changement de langue](#changement-de-langue) est-il valide et pertinent\xA0?",
      titlePlain: "Dans chaque page web, le code de langue de chaque changement de langue est-il valide et pertinent\xA0?",
      tests: {
        "1": [
          "Pour chaque page web, le code de langue de chaque [changement de langue](#changement-de-langue) v\xE9rifie-t-il ces conditions\xA0?",
          "Le code de langue est valide\xA0;",
          "Le code de langue est pertinent."
        ]
      },
      wcag: ["3.1.2 Language of Parts (AA)"],
      techniques: ["H58"],
      automatability: "judgment",
      ruleIds: ["lang-invalid"]
    },
    {
      id: "8.9",
      theme: 8,
      title: "Dans chaque page web, les balises ne doivent pas \xEAtre utilis\xE9es [uniquement \xE0 des fins de pr\xE9sentation](#uniquement-a-des-fins-de-presentation). Cette r\xE8gle est-elle respect\xE9e\xA0?",
      titlePlain: "Dans chaque page web, les balises ne doivent pas \xEAtre utilis\xE9es uniquement \xE0 des fins de pr\xE9sentation. Cette r\xE8gle est-elle respect\xE9e\xA0?",
      tests: {
        "1": [
          "Dans chaque page web les balises (\xE0 l\u2019exception de `<div>`, `<span>` et `<table>`) ne doivent pas \xEAtre utilis\xE9es [uniquement \xE0 des fins de pr\xE9sentation](#uniquement-a-des-fins-de-presentation). Cette r\xE8gle est-elle respect\xE9e\xA0?"
        ]
      },
      wcag: ["1.3.1 Info and Relationships (A)"],
      techniques: ["G115", "H88", "F43", "F92"],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "8.10",
      theme: 8,
      title: "Dans chaque page web, les changements du [sens de lecture](#sens-de-lecture) sont-ils signal\xE9s\xA0?",
      titlePlain: "Dans chaque page web, les changements du sens de lecture sont-ils signal\xE9s\xA0?",
      tests: {
        "1": [
          "Dans chaque page web, chaque texte dont le sens de lecture est diff\xE9rent du [sens de lecture](#sens-de-lecture) par d\xE9faut est contenu dans une balise poss\xE9dant un attribut `dir`\xA0?"
        ],
        "2": [
          "Dans chaque page web, chaque changement du [sens de lecture](#sens-de-lecture) (attribut `dir`) v\xE9rifie-t-il ces conditions\xA0?",
          "La valeur de l\u2019attribut `dir` est conforme (`rtl` ou `ltr`)\xA0;",
          "La valeur de l\u2019attribut `dir` est pertinente."
        ]
      },
      wcag: ["1.3.2 Meaningful Sequence (A)"],
      techniques: ["H56"],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "9.1",
      theme: 9,
      title: "Dans chaque page web, l\u2019information est-elle structur\xE9e par l\u2019utilisation appropri\xE9e de [titres](#titre)\xA0?",
      titlePlain: "Dans chaque page web, l\u2019information est-elle structur\xE9e par l\u2019utilisation appropri\xE9e de titres\xA0?",
      tests: {
        "1": [
          'Dans chaque page web, la hi\xE9rarchie entre les [titres](#titre) (balise `<hx>` ou balise poss\xE9dant un attribut WAI-ARIA `role="heading"` associ\xE9 \xE0 un attribut WAI-ARIA `aria-level`) est-elle pertinente\xA0?'
        ],
        "2": [
          'Dans chaque page web, le contenu de chaque [titre](#titre) (balise `<hx>` ou balise poss\xE9dant un attribut WAI-ARIA `role="heading"` associ\xE9 \xE0 un attribut WAI-ARIA `aria-level`) est-il pertinent\xA0?'
        ],
        "3": [
          'Dans chaque page web, chaque passage de texte constituant un [titre](#titre) est-il structur\xE9 \xE0 l\u2019aide d\u2019une balise `<hx>` ou d\u2019une balise poss\xE9dant un attribut WAI-ARIA `role="heading"` associ\xE9 \xE0 un attribut WAI-ARIA `aria-level`\xA0?'
        ]
      },
      wcag: ["1.3.1 Info and Relationships (A)", "2.4.1 Bypass Blocks (A)", "2.4.6 Headings and Labels (AA)", "4.1.2 Name, Role, Value (A)"],
      techniques: ["G115", "G130", "H42", "G141", "ARIA4", "ARIA12"],
      technicalNote: [
        "WAI-ARIA permet de d\xE9finir des titres via le r\xF4le `heading` et l\u2019attribut `aria-level` (indication du niveau de titre). Bien qu\u2019il soit pr\xE9f\xE9rable d\u2019utiliser l\u2019\xE9l\xE9ment de titre natif en HTML `<hx>`, l\u2019utilisation du r\xF4le WAI-ARIA `heading` est compatible avec l\u2019accessibilit\xE9."
      ],
      automatability: "static",
      ruleIds: ["heading-order-skip", "h1-missing", "h1-multiple"]
    },
    {
      id: "9.2",
      theme: 9,
      title: "Dans chaque page web, la [structure du document](#structure-du-document) est-elle coh\xE9rente (hors cas particuliers)\xA0?",
      titlePlain: "Dans chaque page web, la structure du document est-elle coh\xE9rente (hors cas particuliers)\xA0?",
      tests: {
        "1": [
          "Dans chaque page web, la [structure du document](#structure-du-document) v\xE9rifie-t-elle ces conditions (hors cas particuliers)\xA0?",
          "La [zone d\u2019en-t\xEAte de la page](#zone-d-en-tete) est structur\xE9e via une balise `<header>`\xA0;",
          "Les [zones de navigation principales et secondaires](#menu-et-barre-de-navigation) sont structur\xE9es via une balise `<nav>`\xA0;",
          "La balise `<nav>` est r\xE9serv\xE9e \xE0 la structuration des [zones de navigation principales et secondaires](#menu-et-barre-de-navigation)\xA0;",
          "La [zone de contenu principal](#zone-de-contenu-principal) est structur\xE9e via une balise `<main>`\xA0;",
          "La [structure du document](#structure-du-document) utilise une balise `<main>` visible unique\xA0;",
          "La [zone de pied de page](#zone-de-pied-de-page) est structur\xE9e via une balise `<footer>`."
        ]
      },
      wcag: ["1.3.1 Info and Relationships (A)"],
      techniques: ["G115", "ARIA11"],
      technicalNote: [
        "La balise `<main>` peut \xEAtre utilis\xE9e plusieurs fois dans le m\xEAme document HTML. N\xE9anmoins, il ne peut y avoir en permanence qu\u2019une seule balise visible et lisible par les technologies d\u2019assistances, les autres devant disposer d\u2019un attribut `hidden` ou d\u2019un style permettant de les masquer aux technologies d\u2019assistances. \xC0 noter cependant que l\u2019utilisation d\u2019un style seul restera insuffisante pour assurer l\u2019unicit\xE9 d\u2019une balise `<main>` visible en cas de d\xE9sactivation des feuilles de styles."
      ],
      particularCases: ["Lorsque le doctype d\xE9clar\xE9 dans la page n\u2019est pas le doctype HTML5, ce crit\xE8re est non applicable."],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "9.3",
      theme: 9,
      title: "Dans chaque page web, chaque [liste](#listes) est-elle correctement structur\xE9e\xA0?",
      titlePlain: "Dans chaque page web, chaque liste est-elle correctement structur\xE9e\xA0?",
      tests: {
        "1": [
          "Dans chaque page web, les informations regroup\xE9es visuellement sous forme de [liste](#listes) non ordonn\xE9e v\xE9rifient-elles une de ces conditions\xA0?",
          "La liste utilise les balises HTML `<ul>` et `<li>`\xA0;",
          'La liste utilise les attributs WAI-ARIA `role="list"` et `role="listitem"`.'
        ],
        "2": [
          "Dans chaque page web, les informations regroup\xE9es visuellement sous forme de [liste](#listes) ordonn\xE9e v\xE9rifient-elles une de ces conditions\xA0?",
          "La liste utilise les balises HTML `<ol>` et `<li>`\xA0;",
          'La liste utilise les attributs WAI-ARIA `role="list"` et `role="listitem"`.'
        ],
        "3": [
          "Dans chaque page web, les informations regroup\xE9es sous forme de [liste](#listes) de description utilisent-elles les balises `<dl>` et `<dt>/<dd>`\xA0?"
        ]
      },
      wcag: ["1.3.1 Info and Relationships (A)"],
      techniques: ["G115", "G153", "H40", "H48", "F2"],
      technicalNote: [
        'Les attributs WAI-ARIA `role="list"` et `role="listitem"` peuvent n\xE9cessiter l\u2019utilisation des attributs WAI-ARIA `aria-setsize` et `aria-posinset` dans le cas o\xF9 l\u2019ensemble de la liste n\u2019est pas disponible via le DOM g\xE9n\xE9r\xE9 au moment de la consultation.',
        'Les attributs WAI-ARIA `role="tree"`, `role="tablist"`, `role="menu"`, `role="combobox"` et `role="listbox"` ne sont pas \xE9quivalents \xE0 une liste HTML `<ul>` ou `<ol>`.'
      ],
      automatability: "static",
      ruleIds: ["list-structure"]
    },
    {
      id: "9.4",
      theme: 9,
      title: "Dans chaque page web, chaque citation est-elle correctement indiqu\xE9e\xA0?",
      titlePlain: "Dans chaque page web, chaque citation est-elle correctement indiqu\xE9e\xA0?",
      tests: {
        "1": ["Dans chaque page web, chaque citation courte utilise-t-elle une balise `<q>`\xA0?"],
        "2": ["Dans chaque page web, chaque bloc de citation utilise-t-il une balise `<blockquote>`\xA0?"]
      },
      wcag: ["1.3.1 Info and Relationships (A)"],
      techniques: ["G115", "H49", "F2"],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "10.1",
      theme: 10,
      title: "Dans le site web, des [feuilles de styles](#feuille-de-style) sont-elles utilis\xE9es pour contr\xF4ler la [pr\xE9sentation de l\u2019information](#presentation-de-l-information)\xA0?",
      titlePlain: "Dans le site web, des feuilles de styles sont-elles utilis\xE9es pour contr\xF4ler la pr\xE9sentation de l\u2019information\xA0?",
      tests: {
        "1": [
          "Dans chaque page web, les balises servant \xE0 la [pr\xE9sentation de l\u2019information](#presentation-de-l-information) ne doivent pas \xEAtre pr\xE9sentes dans le code source g\xE9n\xE9r\xE9 des pages. Cette r\xE8gle est-elle respect\xE9e\xA0?"
        ],
        "2": [
          "Dans chaque page web, les attributs servant \xE0 la [pr\xE9sentation de l\u2019information](#presentation-de-l-information) ne doivent pas \xEAtre pr\xE9sents dans le code source g\xE9n\xE9r\xE9 des pages. Cette r\xE8gle est-elle respect\xE9e\xA0?"
        ],
        "3": [
          "Dans chaque page web, l\u2019utilisation des espaces v\xE9rifie-t-elle ces conditions\xA0?",
          "Les espaces ne sont pas utilis\xE9es pour s\xE9parer les lettres d\u2019un mot\xA0;",
          "Les espaces ne sont pas utilis\xE9es pour simuler des tableaux\xA0;",
          "Les espaces ne sont pas utilis\xE9es pour simuler des colonnes de texte."
        ]
      },
      wcag: ["1.3.1 Info and Relationships (A)", "1.3.2 Meaningful Sequence (A)"],
      techniques: ["G140", "F32", "F33", "F34", "F48", "C6", "C8", "C18", "C22"],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "10.2",
      theme: 10,
      title: "Dans chaque page web, le [contenu visible](#contenu-visible) porteur d\u2019information reste-t-il pr\xE9sent lorsque les [feuilles de styles](#feuille-de-style) sont d\xE9sactiv\xE9es\xA0?",
      titlePlain: "Dans chaque page web, le contenu visible porteur d\u2019information reste-t-il pr\xE9sent lorsque les feuilles de styles sont d\xE9sactiv\xE9es\xA0?",
      tests: {
        "1": ["Dans chaque page web, l\u2019information reste-t-elle pr\xE9sente lorsque les [feuilles de styles](#feuille-de-style) sont d\xE9sactiv\xE9es\xA0?"]
      },
      wcag: ["1.1.1 Non-text Content (A)", "1.3.1 Info and Relationships (A)"],
      techniques: ["G140", "F3", "F87"],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "10.3",
      theme: 10,
      title: "Dans chaque page web, l\u2019information reste-t-elle [compr\xE9hensible](#comprehensible-ordre-de-lecture) lorsque les [feuilles de styles](#feuille-de-style) sont d\xE9sactiv\xE9es\xA0?",
      titlePlain: "Dans chaque page web, l\u2019information reste-t-elle compr\xE9hensible lorsque les feuilles de styles sont d\xE9sactiv\xE9es\xA0?",
      tests: {
        "1": [
          "Dans chaque page web, l\u2019information reste-t-elle [compr\xE9hensible](#comprehensible-ordre-de-lecture) lorsque les [feuilles de styles](#feuille-de-style) sont d\xE9sactiv\xE9es\xA0?"
        ]
      },
      wcag: ["1.3.2 Meaningful Sequence (A)", "2.4.3 Focus Order (A)"],
      techniques: ["G59", "G140", "F1"],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "10.4",
      theme: 10,
      title: "Dans chaque page web, le texte reste-t-il lisible lorsque la [taille des caract\xE8res](#taille-des-caracteres) est augment\xE9e jusqu\u2019\xE0 200\u202F%, au moins (hors cas particuliers)\xA0?",
      titlePlain: "Dans chaque page web, le texte reste-t-il lisible lorsque la taille des caract\xE8res est augment\xE9e jusqu\u2019\xE0 200\u202F%, au moins (hors cas particuliers)\xA0?",
      tests: {
        "1": [
          "Dans chaque page web, l\u2019augmentation de la [taille des caract\xE8res](#taille-des-caracteres) jusqu\u2019\xE0 200\u202F%, au moins, ne doit pas provoquer de perte d\u2019information. Cette r\xE8gle est-elle respect\xE9e selon une de ces conditions (hors cas particuliers)\xA0?",
          "Lors de l\u2019utilisation de la fonction d\u2019agrandissement du texte du navigateur\xA0;",
          "Lors de l\u2019utilisation des fonctions de zoom graphique du navigateur\xA0;",
          "Lors de l\u2019utilisation d\u2019un [composant d\u2019interface](#composant-d-interface) propre au site permettant d\u2019agrandir le texte ou de zoomer."
        ],
        "2": [
          "Dans chaque page web, l\u2019augmentation de la taille des caract\xE8res jusqu\u2019\xE0 200\u202F%, au moins, doit \xEAtre possible pour l\u2019ensemble du texte dans la page. Cette r\xE8gle est-elle respect\xE9e selon une de ces conditions (hors cas particuliers)\xA0?",
          "Lors de l\u2019utilisation de la fonction d\u2019agrandissement du texte du navigateur\xA0;",
          "Lors de l\u2019utilisation des fonctions de zoom graphique du navigateur\xA0;",
          "Lors de l\u2019utilisation d\u2019un [composant d\u2019interface](#composant-d-interface) propre au site permettant d\u2019agrandir le texte ou de zoomer."
        ]
      },
      wcag: ["1.4.4 Resize Text (AA)"],
      techniques: ["G146", "G179", "F69", "F80", "SCR34", "C12", "C13", "C14", "C17", "C28"],
      particularCases: [
        "Font exception \xE0 ce crit\xE8re, les contenus pour lesquels l\u2019utilisateur n\u2019a pas de possibilit\xE9 de personnalisation\xA0:",
        "[object Object]"
      ],
      automatability: "needs-rendering",
      ruleIds: ["meta-viewport-zoom-block"]
    },
    {
      id: "10.5",
      theme: 10,
      title: "Dans chaque page web, les d\xE9clarations CSS de couleurs de fond d\u2019\xE9l\xE9ment et de police sont-elles correctement utilis\xE9es\xA0?",
      titlePlain: "Dans chaque page web, les d\xE9clarations CSS de couleurs de fond d\u2019\xE9l\xE9ment et de police sont-elles correctement utilis\xE9es\xA0?",
      tests: {
        "1": [
          "Dans chaque page web, chaque d\xE9claration CSS de couleurs de police (`color`), d\u2019un \xE9l\xE9ment susceptible de contenir du texte, est-elle accompagn\xE9e d\u2019une d\xE9claration de couleur de fond (`background`, `background-color`), au moins, h\xE9rit\xE9e d\u2019un parent\xA0?"
        ],
        "2": [
          "Dans chaque page web, chaque d\xE9claration de couleur de fond (`background`, `background-color`), d\u2019un \xE9l\xE9ment susceptible de contenir du texte, est-elle accompagn\xE9e d\u2019une d\xE9claration de couleur de police (`color`) au moins, h\xE9rit\xE9e d\u2019un parent\xA0?"
        ],
        "3": [
          "Dans chaque page web, chaque utilisation d\u2019une image pour cr\xE9er une couleur de fond d\u2019un \xE9l\xE9ment susceptible de contenir du texte, via CSS (`background`, `background-image`), est-elle accompagn\xE9e d\u2019une d\xE9claration de couleur de fond (`background`, `background-color`), au moins, h\xE9rit\xE9e d\u2019un parent\xA0?"
        ]
      },
      wcag: ["1.4.3 Contrast (Minimum) (AA)"],
      techniques: ["F24"],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "10.6",
      theme: 10,
      title: "Dans chaque page web, chaque [lien dont la nature n\u2019est pas \xE9vidente](#lien-dont-la-nature-n-est-pas-evidente) est-il visible par rapport au texte environnant\xA0?",
      titlePlain: "Dans chaque page web, chaque lien dont la nature n\u2019est pas \xE9vidente est-il visible par rapport au texte environnant\xA0?",
      tests: {
        "1": [
          "Dans chaque page web, chaque [lien texte](#lien-texte) signal\xE9 uniquement par la couleur, et dont la nature n\u2019est pas \xE9vidente, v\xE9rifie-t-il ces conditions\xA0?",
          "La couleur du lien a un rapport de [contraste](#contraste) sup\xE9rieur ou \xE9gal \xE0 3:1 par rapport au texte environnant\xA0;",
          "Le lien dispose d\u2019une indication visuelle au survol autre qu\u2019un changement de couleur\xA0;",
          "Le lien dispose d\u2019une indication visuelle au focus autre qu\u2019un changement de couleur."
        ]
      },
      wcag: ["1.4.1 Use of Color (A)"],
      techniques: ["G183", "F73"],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "10.7",
      theme: 10,
      title: "Dans chaque page web, pour chaque \xE9l\xE9ment recevant le focus, la [prise de focus](#prise-de-focus) est-elle visible\xA0?",
      titlePlain: "Dans chaque page web, pour chaque \xE9l\xE9ment recevant le focus, la prise de focus est-elle visible\xA0?",
      tests: {
        "1": [
          "Pour chaque \xE9l\xE9ment recevant le focus, la [prise de focus](#prise-de-focus) v\xE9rifie-t-elle une de ces conditions\xA0?",
          "Le style du focus natif du navigateur n\u2019est pas supprim\xE9 ou d\xE9grad\xE9\xA0;",
          "Un style du focus d\xE9fini par l\u2019auteur est visible."
        ]
      },
      wcag: ["1.4.1 Use of Color (A)", "2.4.7 Focus Visible (AA)"],
      techniques: ["G149", "G165", "G183", "G195", "F73", "F78", "SCR31", "C15"],
      automatability: "needs-rendering",
      ruleIds: []
    },
    {
      id: "10.8",
      theme: 10,
      title: "Pour chaque page web, les [contenus cach\xE9s](#contenu-cache) ont-ils vocation \xE0 \xEAtre ignor\xE9s par les technologies d\u2019assistance\xA0?",
      titlePlain: "Pour chaque page web, les contenus cach\xE9s ont-ils vocation \xE0 \xEAtre ignor\xE9s par les technologies d\u2019assistance\xA0?",
      tests: {
        "1": [
          "Dans chaque page web, chaque contenu cach\xE9 v\xE9rifie-t-il une de ces conditions\xA0?",
          "Le [contenu cach\xE9](#contenu-cache) a vocation \xE0 \xEAtre ignor\xE9 par les technologies d\u2019assistance\xA0;",
          "Le [contenu cach\xE9](#contenu-cache) n\u2019a pas vocation \xE0 \xEAtre ignor\xE9 par les technologies d\u2019assistance et est rendu restituable par les technologies d\u2019assistance suite \xE0 une action de l\u2019utilisateur r\xE9alisable au clavier ou par tout dispositif de pointage sur un \xE9l\xE9ment pr\xE9c\xE9dent le contenu cach\xE9 ou suite \xE0 un repositionnement du focus dessus."
        ]
      },
      wcag: ["1.3.2 Meaningful Sequence (A)", "4.1.2 Name, Role, Value (A)"],
      techniques: ["G57"],
      technicalNote: [
        'WAI-ARIA propose un attribut `aria-hidden` (`true` ou `false`) qui permet d\u2019inhiber la restitution d\u2019un contenu en direction des technologies d\u2019assistance, sans action sur sa visibilit\xE9 en direction des agents utilisateurs\xA0: un contenu avec `aria-hidden="true"` ne sera donc plus vocalisable, mais restera visible.',
        "Sauf si le contenu contr\xF4l\xE9 par `aria-hidden` n\u2019a pas vocation \xE0 \xEAtre restitu\xE9 par les technologies d\u2019assistance, la valeur de l\u2019attribut `aria-hidden` doit \xEAtre coh\xE9rente avec l\u2019\xE9tat affich\xE9 ou masqu\xE9 du contenu \xE0 l\u2019\xE9cran.",
        'La sp\xE9cification HTML5 propose un attribut `hidden` qui permet de rendre indisponible (quand l\u2019attribut `hidden` est pr\xE9sent) un contenu dans le DOM g\xE9n\xE9r\xE9 (de mani\xE8re similaire au `type="hidden"` sur un contr\xF4le de formulaire).',
        "Il est possible d\u2019avoir des situations o\xF9 un contenu contr\xF4l\xE9 par `hidden` ou `aria-hidden` se trouve momentan\xE9ment dans un \xE9tat incoh\xE9rent avec le statut affich\xE9 ou masqu\xE9 du contenu, par exemple si l\u2019on d\xE9sire rendre disponible un \xE9l\xE9ment, mais que son affichage \xE0 l\u2019\xE9cran reste d\xE9pendant d\u2019une action ult\xE9rieure. Dans ce cas, c\u2019est l\u2019\xE9tat final du contenu qui doit \xEAtre consid\xE9r\xE9."
      ],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "10.9",
      theme: 10,
      title: "Dans chaque page web, l\u2019information ne doit pas \xEAtre donn\xE9e uniquement [par la forme, taille ou position](#indication-donnee-par-la-forme-la-taille-ou-la-position). Cette r\xE8gle est-elle respect\xE9e\xA0?",
      titlePlain: "Dans chaque page web, l\u2019information ne doit pas \xEAtre donn\xE9e uniquement par la forme, taille ou position. Cette r\xE8gle est-elle respect\xE9e\xA0?",
      tests: {
        "1": [
          "Dans chaque page web, pour chaque texte ou ensemble de textes, l\u2019information ne doit pas \xEAtre donn\xE9e uniquement [par la forme, taille ou position](#indication-donnee-par-la-forme-la-taille-ou-la-position). Cette r\xE8gle est-elle respect\xE9e\xA0?"
        ],
        "2": [
          "Dans chaque page web, pour chaque image ou ensemble d\u2019images, l\u2019information ne doit pas \xEAtre donn\xE9e uniquement [par la forme, taille ou position](#indication-donnee-par-la-forme-la-taille-ou-la-position). Cette r\xE8gle est-elle respect\xE9e\xA0?"
        ],
        "3": [
          "Dans chaque page web, pour chaque [m\xE9dia temporel](#media-temporel-type-son-video-et-synchronise), l\u2019information ne doit pas \xEAtre donn\xE9e uniquement [par la forme, taille ou position](#indication-donnee-par-la-forme-la-taille-ou-la-position). Cette r\xE8gle est-elle respect\xE9e\xA0?"
        ],
        "4": [
          "Dans chaque page web, pour chaque [m\xE9dia non temporel](#media-non-temporel), l\u2019information ne doit pas \xEAtre donn\xE9e uniquement [par la forme, taille ou position](#indication-donnee-par-la-forme-la-taille-ou-la-position). Cette r\xE8gle est-elle respect\xE9e\xA0?"
        ]
      },
      wcag: ["1.3.3 Sensory Characteristics (A)", "1.4.1 Use of Color (A)"],
      techniques: ["G96", "G140", "F14", "F26"],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "10.10",
      theme: 10,
      title: "Dans chaque page web, l\u2019information ne doit pas \xEAtre donn\xE9e [par la forme, taille ou position](#indication-donnee-par-la-forme-la-taille-ou-la-position) uniquement. Cette r\xE8gle est-elle impl\xE9ment\xE9e de fa\xE7on pertinente\xA0?",
      titlePlain: "Dans chaque page web, l\u2019information ne doit pas \xEAtre donn\xE9e par la forme, taille ou position uniquement. Cette r\xE8gle est-elle impl\xE9ment\xE9e de fa\xE7on pertinente\xA0?",
      tests: {
        "1": [
          "Dans chaque page web, pour chaque texte ou ensemble de textes, l\u2019information ne doit pas \xEAtre donn\xE9e uniquement [par la forme, taille ou position](#indication-donnee-par-la-forme-la-taille-ou-la-position). Cette r\xE8gle est-elle impl\xE9ment\xE9e de fa\xE7on pertinente\xA0?"
        ],
        "2": [
          "Dans chaque page web, pour chaque image ou ensemble d\u2019images, l\u2019information ne doit pas \xEAtre donn\xE9e uniquement [par la forme, taille ou position](#indication-donnee-par-la-forme-la-taille-ou-la-position). Cette r\xE8gle est-elle impl\xE9ment\xE9e de fa\xE7on pertinente\xA0?"
        ],
        "3": [
          "Dans chaque page web, pour chaque [m\xE9dia temporel](#media-temporel-type-son-video-et-synchronise), l\u2019information ne doit pas \xEAtre donn\xE9e uniquement [par la forme, taille ou position](#indication-donnee-par-la-forme-la-taille-ou-la-position). Cette r\xE8gle est-elle impl\xE9ment\xE9e de fa\xE7on pertinente\xA0?"
        ],
        "4": [
          "Dans chaque page web, pour chaque [m\xE9dia non temporel](#media-non-temporel), l\u2019information ne doit pas \xEAtre donn\xE9e uniquement [par la forme, taille ou position](#indication-donnee-par-la-forme-la-taille-ou-la-position). Cette r\xE8gle est-elle impl\xE9ment\xE9e de fa\xE7on pertinente\xA0?"
        ]
      },
      wcag: ["1.3.3 Sensory Characteristics (A)", "1.4.1 Use of Color (A)"],
      techniques: ["G96", "G140", "F14", "F26"],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "10.11",
      theme: 10,
      title: "Pour chaque page web, les contenus peuvent-ils \xEAtre pr\xE9sent\xE9s sans perte d\u2019information ou de fonctionnalit\xE9 et sans avoir recours soit \xE0 un d\xE9filement vertical pour une fen\xEAtre ayant une hauteur de 256\u202Fpx, soit \xE0 un d\xE9filement horizontal pour une fen\xEAtre ayant une largeur de 320\u202Fpx (hors cas particuliers)\xA0?",
      titlePlain: "Pour chaque page web, les contenus peuvent-ils \xEAtre pr\xE9sent\xE9s sans perte d\u2019information ou de fonctionnalit\xE9 et sans avoir recours soit \xE0 un d\xE9filement vertical pour une fen\xEAtre ayant une hauteur de 256\u202Fpx, soit \xE0 un d\xE9filement horizontal pour une fen\xEAtre ayant une largeur de 320\u202Fpx (hors cas particuliers)\xA0?",
      tests: {
        "1": [
          "Pour chaque page web, lorsque le contenu dont le sens de lecture est horizontal est affich\xE9 dans une fen\xEAtre r\xE9duite \xE0 une largeur de 320\u202Fpx, l\u2019ensemble des informations et des fonctionnalit\xE9s sont-elles disponibles sans aucun d\xE9filement horizontal (hors cas particuliers)\xA0?"
        ],
        "2": [
          "Pour chaque page web, lorsque le contenu dont le sens de lecture est vertical est affich\xE9 dans une fen\xEAtre r\xE9duite \xE0 une hauteur de 256\u202Fpx, l\u2019ensemble des informations et des fonctionnalit\xE9s sont-elles disponibles sans aucun d\xE9filement vertical (hors cas particuliers)\xA0?"
        ]
      },
      wcag: ["1.4.10 Reflow (AA)"],
      techniques: ["C34", "C37"],
      technicalNote: ["Lorsqu'il est ici question de pixel, il s'agit du pixel CSS tel que d\xE9fini par le W3C https://www.w3.org/TR/css3-values/"],
      particularCases: [
        "L'objectif de ce crit\xE8re est de garantir un d\xE9filement dans une unique direction pour une lecture facilit\xE9e selon le sens de l'\xE9criture.",
        "Font exception \xE0 ce crit\xE8re, les contenus dont l'agencement requiert deux dimensions pour \xEAtre compris ou utilis\xE9s comme\xA0:",
        "[object Object]",
        "Note\xA0: la majorit\xE9 des navigateurs sur les syst\xE8mes d'exploitation sur mobile (Android, iOS) ne g\xE8re pas correctement la redistribution en cas de zoom. Dans ce contexte, le crit\xE8re sera consid\xE9r\xE9 comme non applicable sur ces environnements."
      ],
      automatability: "needs-rendering",
      ruleIds: []
    },
    {
      id: "10.12",
      theme: 10,
      title: "Dans chaque page web, les propri\xE9t\xE9s d\u2019espacement du texte peuvent-elles \xEAtre red\xE9finies par l\u2019utilisateur sans perte de contenu ou de fonctionnalit\xE9 (hors cas particuliers)\xA0?",
      titlePlain: "Dans chaque page web, les propri\xE9t\xE9s d\u2019espacement du texte peuvent-elles \xEAtre red\xE9finies par l\u2019utilisateur sans perte de contenu ou de fonctionnalit\xE9 (hors cas particuliers)\xA0?",
      tests: {
        "1": [
          "Dans chaque page web, le texte reste-t-il lisible lorsque l\u2019affichage est modifi\xE9 selon ces conditions (hors cas particuliers)\xA0?",
          "L\u2019espacement entre les lignes (`line-height`) est augment\xE9 jusqu\u2019\xE0 1,5 fois la taille de la police\xA0;",
          "L\u2019espacement suivant les paragraphes (balise `<p>`) est augment\xE9 jusqu\u2019\xE0 2 fois la taille de la police\xA0;",
          "L\u2019espacement des lettres (`letter-spacing`) est augment\xE9 jusqu\u2019\xE0 0,12 fois la taille de la police\xA0;",
          "L\u2019espacement des mots (`word-spacing`) est augment\xE9 jusqu\u2019\xE0 0,16 fois la taille de la police."
        ]
      },
      wcag: ["1.4.12 Text Spacing (AA)"],
      techniques: ["C8", "C21", "C35", "C36"],
      particularCases: [
        "Font exception \xE0 ce crit\xE8re, les contenus pour lesquels l\u2019utilisateur n\u2019a pas de possibilit\xE9 de personnalisation\xA0:",
        "[object Object]"
      ],
      automatability: "needs-rendering",
      ruleIds: []
    },
    {
      id: "10.13",
      theme: 10,
      title: "Dans chaque page web, les contenus additionnels apparaissant \xE0 la prise de focus ou au survol d\u2019un [composant d\u2019interface](#composant-d-interface) sont-ils contr\xF4lables par l\u2019utilisateur (hors cas particuliers)\xA0?",
      titlePlain: "Dans chaque page web, les contenus additionnels apparaissant \xE0 la prise de focus ou au survol d\u2019un composant d\u2019interface sont-ils contr\xF4lables par l\u2019utilisateur (hors cas particuliers)\xA0?",
      tests: {
        "1": [
          "Chaque contenu additionnel devenant visible \xE0 la prise de focus ou au survol d\u2019un [composant d\u2019interface](#composant-d-interface) peut-il \xEAtre masqu\xE9 par une action de l\u2019utilisateur sans d\xE9placer le focus ou le pointeur de la souris (hors cas particuliers)\xA0?"
        ],
        "2": [
          "Chaque contenu additionnel qui apparait au survol d\u2019un [composant d\u2019interface](#composant-d-interface) peut-il \xEAtre survol\xE9 par le pointeur de la souris sans dispara\xEEtre (hors cas particuliers)\xA0?"
        ],
        "3": [
          "Chaque contenu additionnel qui appara\xEEt \xE0 la prise de focus ou au survol d\u2019un [composant d\u2019interface](#composant-d-interface) v\xE9rifie-t-il une de ces conditions (hors cas particuliers)\xA0?",
          "Le contenu additionnel reste visible jusqu\u2019\xE0 ce que l\u2019utilisateur retire le pointeur souris ou le focus du contenu additionnel et du [composant d\u2019interface](#composant-d-interface) ayant d\xE9clench\xE9 son apparition\xA0;",
          "Le contenu additionnel reste visible jusqu\u2019\xE0 ce que l\u2019utilisateur d\xE9clenche une action masquant ce contenu sans d\xE9placer le focus ou le pointeur de la souris du [composant d\u2019interface](#composant-d-interface) ayant d\xE9clench\xE9 son apparition\xA0;",
          "Le contenu additionnel reste visible jusqu\u2019\xE0 ce qu\u2019il ne soit plus valide."
        ]
      },
      wcag: ["1.4.13 Content on Hover or Focus (AA)"],
      techniques: ["F95"],
      particularCases: [
        "Lorsque le contenu additionnel est contr\xF4l\xE9 par l\u2019agent utilisateur (par exemple, attribut `title` ou validation native de formulaire) ou correspond \xE0 une fen\xEAtre modale conforme au [motif de conception](#motif-de-conception) WAI-ARIA `dialog`, le crit\xE8re 10.13 est non applicable.",
        "Lorsque le contenu additionnel ne masque ou ne remplace aucun contenu porteur d\u2019information, le test 10.13.1 est non applicable."
      ],
      automatability: "needs-rendering",
      ruleIds: []
    },
    {
      id: "10.14",
      theme: 10,
      title: "Dans chaque page web, les contenus additionnels apparaissant via les styles CSS uniquement peuvent-ils \xEAtre rendus visibles au clavier et par tout dispositif de pointage\xA0?",
      titlePlain: "Dans chaque page web, les contenus additionnels apparaissant via les styles CSS uniquement peuvent-ils \xEAtre rendus visibles au clavier et par tout dispositif de pointage\xA0?",
      tests: {
        "1": [
          "Dans chaque page web, les contenus additionnels apparaissant au survol d\u2019un [composant d\u2019interface](#composant-d-interface) via les styles CSS respectent-ils si n\xE9cessaire une de ces conditions\xA0?",
          "Les contenus additionnels apparaissent \xE9galement \xE0 l\u2019activation du composant via le clavier et tout dispositif de pointage\xA0;",
          "Les contenus additionnels apparaissent \xE9galement \xE0 la prise de focus du composant\xA0;",
          "Les contenus additionnels apparaissent \xE9galement par le biais de l\u2019activation ou de la prise de focus d\u2019un autre composant."
        ],
        "2": [
          "Dans chaque page web, les contenus additionnels apparaissant au focus d\u2019un [composant d\u2019interface](#composant-d-interface) via les styles CSS respectent-ils si n\xE9cessaire une de ces conditions\xA0?",
          "Les contenus additionnels apparaissent \xE9galement \xE0 l\u2019activation du composant via le clavier et tout dispositif de pointage\xA0;",
          "Les contenus additionnels apparaissent \xE9galement au survol du composant\xA0;",
          "Les contenus additionnels apparaissent \xE9galement par le biais de l\u2019activation ou du survol d\u2019un autre composant."
        ]
      },
      wcag: ["2.1.1 Keyboard (A)"],
      techniques: ["G202"],
      automatability: "needs-rendering",
      ruleIds: []
    },
    {
      id: "11.1",
      theme: 11,
      title: "Chaque [champ de formulaire](#champ-de-saisie-de-formulaire) a-t-il une [\xE9tiquette](#etiquette-de-champ-de-formulaire)\xA0?",
      titlePlain: "Chaque champ de formulaire a-t-il une \xE9tiquette\xA0?",
      tests: {
        "1": [
          "Chaque [champ de formulaire](#champ-de-saisie-de-formulaire) v\xE9rifie-t-il une de ces conditions\xA0?",
          "Le [champ de formulaire](#champ-de-saisie-de-formulaire) poss\xE8de un attribut WAI-ARIA `aria-labelledby` r\xE9f\xE9ren\xE7ant un [passage de texte](#passage-de-texte-lie-par-aria-labelledby-ou-aria-describedby) identifi\xE9\xA0;",
          "Le [champ de formulaire](#champ-de-saisie-de-formulaire) poss\xE8de un attribut WAI-ARIA `aria-label`\xA0;",
          "Une balise `<label>` ayant un attribut `for` est associ\xE9e au [champ de formulaire](#champ-de-saisie-de-formulaire)\xA0;",
          "Le [champ de formulaire](#champ-de-saisie-de-formulaire) poss\xE8de un attribut `title`\xA0;",
          "Un bouton adjacent au [champ de formulaire](#champ-de-saisie-de-formulaire) lui fournit une \xE9tiquette visible et un \xE9l\xE9ment `<label>` visuellement cach\xE9 ou un attribut WAI-ARIA `aria-label`, `aria-labelledby` ou `title` lui fournit un nom accessible."
        ],
        "2": [
          "Chaque [champ de formulaire](#champ-de-saisie-de-formulaire) associ\xE9 \xE0 une balise `<label>` ayant un attribut `for`, v\xE9rifie-t-il ces conditions\xA0?",
          "Le [champ de formulaire](#champ-de-saisie-de-formulaire) poss\xE8de un attribut `id`\xA0;",
          "La valeur de l\u2019attribut `for` est \xE9gale \xE0 la valeur de l\u2019attribut `id` du [champ de formulaire](#champ-de-saisie-de-formulaire) associ\xE9."
        ],
        "3": [
          "Chaque [champ de formulaire](#champ-de-saisie-de-formulaire) ayant une [\xE9tiquette](#etiquette-de-champ-de-formulaire) dont le contenu n\u2019est pas visible ou \xE0 proximit\xE9 (masqu\xE9, `aria-label`) ou qui n\u2019est pas [accol\xE9](#accoles-etiquette-et-champ-accoles) au champ (`aria-labelledby`), v\xE9rifie-t-il une de ses conditions\xA0?",
          "Le [champ de formulaire](#champ-de-saisie-de-formulaire) poss\xE8de un attribut `title` dont le contenu permet de comprendre la nature de la saisie attendue\xA0;",
          "Le [champ de formulaire](#champ-de-saisie-de-formulaire) est accompagn\xE9 d\u2019un [passage de texte](#passage-de-texte-lie-par-aria-labelledby-ou-aria-describedby) accol\xE9 au champ qui devient visible \xE0 la prise de focus permettant de comprendre la nature de la saisie attendue\xA0;",
          "Le [champ de formulaire](#champ-de-saisie-de-formulaire) est accompagn\xE9 d\u2019un [passage de texte](#passage-de-texte-lie-par-aria-labelledby-ou-aria-describedby) visible accol\xE9 au champ permettant de comprendre la nature de la saisie attendue."
        ]
      },
      wcag: ["1.3.1 Info and Relationships (A)", "2.4.6 Headings and Labels (AA)", "3.3.2 Labels or Instructions (A)", "4.1.2 Name, Role, Value (A)"],
      techniques: ["G82", "G131", "H44", "H65", "F68", "F82", "F86", "ARIA6", "ARIA9", "ARIA14", "ARIA16"],
      automatability: "static",
      ruleIds: ["control-label-missing", "placeholder-as-label", "form-field-multiple-labels", "select-has-option"]
    },
    {
      id: "11.2",
      theme: 11,
      title: "Chaque [\xE9tiquette](#etiquette-de-champ-de-formulaire) associ\xE9e \xE0 un [champ de formulaire](#champ-de-saisie-de-formulaire) est-elle pertinente (hors cas particuliers)\xA0?",
      titlePlain: "Chaque \xE9tiquette associ\xE9e \xE0 un champ de formulaire est-elle pertinente (hors cas particuliers)\xA0?",
      tests: {
        "1": [
          "Chaque balise `<label>` permet-elle de conna\xEEtre la fonction exacte du [champ de formulaire](#champ-de-saisie-de-formulaire) auquel elle est associ\xE9e\xA0?"
        ],
        "2": [
          "Chaque attribut `title` permet-il de conna\xEEtre la fonction exacte du [champ de formulaire](#champ-de-saisie-de-formulaire) auquel il est associ\xE9\xA0?"
        ],
        "3": [
          "Chaque \xE9tiquette impl\xE9ment\xE9e via l\u2019attribut WAI-ARIA `aria-label` permet-elle de conna\xEEtre la fonction exacte du [champ de formulaire](#champ-de-saisie-de-formulaire) auquel elle est associ\xE9e\xA0?"
        ],
        "4": [
          "Chaque [passage de texte](#passage-de-texte-lie-par-aria-labelledby-ou-aria-describedby) associ\xE9 via l\u2019attribut WAI-ARIA `aria-labelledby` permet-il de conna\xEEtre la fonction exacte du [champ de formulaire](#champ-de-saisie-de-formulaire) auquel il est associ\xE9\xA0?"
        ],
        "5": [
          "Chaque [champ de formulaire](#champ-de-saisie-de-formulaire) ayant un [intitul\xE9 visible](#intitule-visible) v\xE9rifie-t-il ces conditions (hors cas particuliers)\xA0?",
          "S\u2019il est pr\xE9sent, le contenu de l\u2019attribut WAI-ARIA `aria-label` du [champ de formulaire](#champ-de-saisie-de-formulaire) contient au moins l\u2019[intitul\xE9 visible](#intitule-visible)\xA0;",
          "S\u2019il est pr\xE9sent, le [passage de texte](#passage-de-texte-lie-par-aria-labelledby-ou-aria-describedby) li\xE9 au [champ de formulaire](#champ-de-saisie-de-formulaire) via un attribut WAI-ARIA `aria-labelledby` contient au moins l\u2019[intitul\xE9 visible](#intitule-visible)\xA0;",
          "S\u2019il est pr\xE9sent, le contenu de l\u2019attribut `title` du [champ de formulaire](#champ-de-saisie-de-formulaire) contient au moins l\u2019[intitul\xE9 visible](#intitule-visible)\xA0;",
          "S\u2019il est pr\xE9sent le contenu de la balise `<label>` associ\xE9 au [champ de formulaire](#champ-de-saisie-de-formulaire) contient au moins l\u2019[intitul\xE9 visible](#intitule-visible)."
        ],
        "6": [
          "Chaque bouton adjacent au [champ de formulaire](#champ-de-saisie-de-formulaire) qui fournit une \xE9tiquette visible permet-il de conna\xEEtre la fonction exacte du [champ de formulaire](#champ-de-saisie-de-formulaire) auquel il est associ\xE9\xA0?"
        ]
      },
      wcag: ["2.4.6 Headings and Labels (AA)", "2.5.3 Label in Name (A)", "3.3.2 Labels or Instructions (A)"],
      techniques: ["G82", "G131", "H44", "H65", "ARIA6", "ARIA9", "ARIA14", "ARIA16"],
      particularCases: [
        "Il existe une gestion de cas particuliers pour le test 11.2.5 lorsque\xA0:",
        "[object Object]",
        "Note\xA0: si l\u2019\xE9tiquette visible repr\xE9sente une expression math\xE9matique, les symboles math\xE9matiques peuvent \xEAtre repris litt\xE9ralement pour servir d\u2019\xE9tiquette au nom accessible (ex.\xA0: \u201CA>B\u201D). Il est laiss\xE9 \xE0 l\u2019utilisateur le soin d\u2019op\xE9rer la correspondance entre l\u2019expression et ce qu\u2019il doit \xE9peler compte tenu de la connaissance qu\u2019il a du fonctionnement de son logiciel de saisie vocale (\u201CA plus grand que B\u201D ou \u201CA sup\xE9rieur \xE0 B\u201D).",
        "Ce cas particulier s\u2019applique \xE9galement au test 11.9.2."
      ],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "11.3",
      theme: 11,
      title: "Dans chaque [formulaire](#formulaire), chaque [\xE9tiquette](#etiquette-de-champ-de-formulaire) associ\xE9e \xE0 un [champ de formulaire](#champ-de-saisie-de-formulaire) ayant la m\xEAme fonction et r\xE9p\xE9t\xE9e plusieurs fois dans une m\xEAme page ou dans un [ensemble de pages](#ensemble-de-pages) est-elle [coh\xE9rente](#etiquettes-coherentes)\xA0?",
      titlePlain: "Dans chaque formulaire, chaque \xE9tiquette associ\xE9e \xE0 un champ de formulaire ayant la m\xEAme fonction et r\xE9p\xE9t\xE9e plusieurs fois dans une m\xEAme page ou dans un ensemble de pages est-elle coh\xE9rente\xA0?",
      tests: {
        "1": [
          "Chaque [\xE9tiquette](#etiquette-de-champ-de-formulaire) associ\xE9e \xE0 un [champ de formulaire](#champ-de-saisie-de-formulaire) ayant la m\xEAme fonction et r\xE9p\xE9t\xE9e plusieurs fois dans une m\xEAme page est-elle [coh\xE9rente](#etiquettes-coherentes)\xA0?"
        ],
        "2": [
          "Chaque [\xE9tiquette](#etiquette-de-champ-de-formulaire) associ\xE9e \xE0 un [champ de formulaire](#champ-de-saisie-de-formulaire) ayant la m\xEAme fonction et r\xE9p\xE9t\xE9e dans un ensemble de pages est-elle [coh\xE9rente](#etiquettes-coherentes)\xA0?"
        ]
      },
      wcag: ["3.2.4 Consistent Identification (AA)"],
      techniques: ["F31"],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "11.4",
      theme: 11,
      title: "Dans chaque [formulaire](#formulaire), chaque [\xE9tiquette de champ](#etiquette-de-champ-de-formulaire) et son champ associ\xE9 sont-ils [accol\xE9s](#accoles-etiquette-et-champ-accoles) (hors cas particuliers)\xA0?",
      titlePlain: "Dans chaque formulaire, chaque \xE9tiquette de champ et son champ associ\xE9 sont-ils accol\xE9s (hors cas particuliers)\xA0?",
      tests: {
        "1": [
          "Chaque [\xE9tiquette de champ](#etiquette-de-champ-de-formulaire) et son [champ](#champ-de-saisie-de-formulaire) associ\xE9 sont-ils [accol\xE9s](#accoles-etiquette-et-champ-accoles)\xA0?"
        ],
        "2": [
          'Chaque [\xE9tiquette](#etiquette-de-champ-de-formulaire) [accol\xE9e](#accoles-etiquette-et-champ-accoles) \xE0 un [champ](#champ-de-saisie-de-formulaire) (\xE0 l\u2019exception des cases \xE0 cocher, bouton radio ou balises ayant un attribut WAI-ARIA `role="checkbox"`, `role="radio"` ou `role="switch"`), v\xE9rifie-t-elle ces conditions (hors cas particuliers)\xA0?',
          "L\u2019\xE9tiquette est visuellement [accol\xE9e](#accoles-etiquette-et-champ-accoles) imm\xE9diatement au-dessus ou \xE0 gauche du [champ de formulaire](#champ-de-saisie-de-formulaire) lorsque le sens de lecture de la langue de l\u2019\xE9tiquette est de gauche \xE0 droite\xA0;",
          "L\u2019\xE9tiquette est visuellement [accol\xE9e](#accoles-etiquette-et-champ-accoles) imm\xE9diatement au-dessus ou \xE0 droite du [champ de formulaire](#champ-de-saisie-de-formulaire) lorsque le sens de lecture de la langue de l\u2019\xE9tiquette est de droite \xE0 gauche."
        ],
        "3": [
          'Chaque [\xE9tiquette](#etiquette-de-champ-de-formulaire) [accol\xE9e](#accoles-etiquette-et-champ-accoles) \xE0 un [champ](#champ-de-saisie-de-formulaire) de type `checkbox` ou `radio` ou \xE0 une balise ayant un attribut WAI-ARIA `role="checkbox"`, `role="radio"` ou `role="switch"`, v\xE9rifie-t-elle ces conditions (hors cas particuliers)\xA0?',
          "L\u2019\xE9tiquette est visuellement [accol\xE9e](#accoles-etiquette-et-champ-accoles) imm\xE9diatement au-dessous ou \xE0 droite du [champ de formulaire](#champ-de-saisie-de-formulaire) lorsque le sens de lecture de la langue de l\u2019\xE9tiquette est de gauche \xE0 droite\xA0;",
          "L\u2019\xE9tiquette est visuellement [accol\xE9e](#accoles-etiquette-et-champ-accoles) imm\xE9diatement au-dessous ou \xE0 gauche du [champ de formulaire](#champ-de-saisie-de-formulaire) lorsque le sens de lecture de la langue de l\u2019\xE9tiquette est de droite \xE0 gauche."
        ]
      },
      wcag: ["3.3.2 Labels or Instructions (A)"],
      techniques: ["G162"],
      particularCases: ["Les tests 11.4.2 et 11.4.3 seront consid\xE9r\xE9s comme non applicables\xA0:", "[object Object]"],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "11.5",
      theme: 11,
      title: "Dans chaque [formulaire](#formulaire), les [champs de m\xEAme nature](#champs-de-meme-nature) sont-ils regroup\xE9s, si n\xE9cessaire\xA0?",
      titlePlain: "Dans chaque formulaire, les champs de m\xEAme nature sont-ils regroup\xE9s, si n\xE9cessaire\xA0?",
      tests: {
        "1": [
          "Les [champs de m\xEAme nature](#champs-de-meme-nature) v\xE9rifient-ils l\u2019une de ces conditions, si n\xE9cessaire\xA0?",
          "Les [champs de m\xEAme nature](#champs-de-meme-nature) sont regroup\xE9s dans une balise `<fieldset>`\xA0;",
          'Les [champs de m\xEAme nature](#champs-de-meme-nature) sont regroup\xE9s dans une balise poss\xE9dant un attribut WAI-ARIA `role="group"`\xA0;',
          'Les [champs de m\xEAme nature](#champs-de-meme-nature) de type radio (`<input type="radio">`) ou balises poss\xE9dant un attribut WAI-ARIA `role="radio"`) sont regroup\xE9s dans une balise poss\xE9dant un attribut WAI-ARIA `role="radiogroup"` ou `role="group"`.'
        ]
      },
      wcag: ["1.3.1 Info and Relationships (A)", "3.3.2 Labels or Instructions (A)"],
      techniques: ["H71", "ARIA17"],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "11.6",
      theme: 11,
      title: "Dans chaque [formulaire](#formulaire), chaque regroupement de [champs de m\xEAme nature](#champs-de-meme-nature) a-t-il une [l\xE9gende](#legende)\xA0?",
      titlePlain: "Dans chaque formulaire, chaque regroupement de champs de m\xEAme nature a-t-il une l\xE9gende\xA0?",
      tests: {
        "1": ["Chaque regroupement de [champs de m\xEAme nature](#champs-de-meme-nature) poss\xE8de-t-il une [l\xE9gende](#legende)\xA0?"]
      },
      wcag: ["1.3.1 Info and Relationships (A)", "3.3.2 Labels or Instructions (A)"],
      techniques: ["H71", "ARIA17"],
      automatability: "static",
      ruleIds: ["fieldset-legend-missing"]
    },
    {
      id: "11.7",
      theme: 11,
      title: "Dans chaque [formulaire](#formulaire), chaque [l\xE9gende](#legende) associ\xE9e \xE0 un regroupement de [champs de m\xEAme nature](#champs-de-meme-nature) est-elle pertinente\xA0?",
      titlePlain: "Dans chaque formulaire, chaque l\xE9gende associ\xE9e \xE0 un regroupement de champs de m\xEAme nature est-elle pertinente\xA0?",
      tests: {
        "1": ["Chaque [l\xE9gende](#legende) associ\xE9e \xE0 un regroupement de [champs de m\xEAme nature](#champs-de-meme-nature) est-elle pertinente\xA0?"]
      },
      wcag: ["1.3.1 Info and Relationships (A)", "3.3.2 Labels or Instructions (A)"],
      techniques: ["H71", "ARIA17"],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "11.8",
      theme: 11,
      title: "Dans chaque [formulaire](#formulaire), les [items de m\xEAme nature d\u2019une liste de choix](#items-de-meme-nature-d-une-liste-de-choix) sont-ils regroup\xE9s de mani\xE8re pertinente\xA0?",
      titlePlain: "Dans chaque formulaire, les items de m\xEAme nature d\u2019une liste de choix sont-ils regroup\xE9s de mani\xE8re pertinente\xA0?",
      tests: {
        "1": [
          "Pour chaque balise `<select>`, les [items de m\xEAme nature d\u2019une liste de choix](#items-de-meme-nature-d-une-liste-de-choix) sont-ils regroup\xE9s avec une balise `<optgroup>`, si n\xE9cessaire\xA0?"
        ],
        "2": ["Dans chaque balise `<select>`, chaque balise `<optgroup>` poss\xE8de-t-elle un attribut `label`\xA0?"],
        "3": ["Pour chaque balise `<optgroup>` ayant un attribut `label`, le contenu de l\u2019attribut `label` est-il pertinent\xA0?"]
      },
      wcag: ["1.3.1 Info and Relationships (A)"],
      techniques: ["H85"],
      technicalNote: [
        'Il est possible d\u2019utiliser une balise ayant un attribut WAI-ARIA `role="listbox"` en remplacement d\u2019une balise `<select>`. En revanche, il est impossible de cr\xE9er des groupes d\u2019options via l\u2019utilisation de WAI-ARIA. De ce fait, une liste n\xE9cessitant un regroupement d\u2019options structur\xE9e \xE0 l\u2019aide d\u2019une balise ayant un attribut WAI-ARIA `role="listbox"` sera consid\xE9r\xE9e comme non conforme au crit\xE8re 11.8.'
      ],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "11.9",
      theme: 11,
      title: "Dans chaque [formulaire](#formulaire), l\u2019intitul\xE9 de chaque [bouton](#bouton-formulaire) est-il pertinent (hors cas particuliers)\xA0?",
      titlePlain: "Dans chaque formulaire, l\u2019intitul\xE9 de chaque bouton est-il pertinent (hors cas particuliers)\xA0?",
      tests: {
        "1": [
          "L\u2019intitul\xE9 de chaque [bouton](#bouton-formulaire) v\xE9rifie-t-il ces conditions (hors cas particuliers)\xA0?",
          "S\u2019il est pr\xE9sent, le contenu de l\u2019attribut WAI-ARIA `aria-label` est pertinent\xA0;",
          "S\u2019il est pr\xE9sent, le [passage de texte](#passage-de-texte-lie-par-aria-labelledby-ou-aria-describedby) li\xE9 au bouton via un attribut WAI-ARIA `aria-labelledby` est pertinent\xA0;",
          "S\u2019il est pr\xE9sent, le contenu de l\u2019attribut `value` d\u2019une balise `<input>` de type `submit`, `reset` ou `button` est pertinent\xA0;",
          "S\u2019il est pr\xE9sent, le contenu de la balise `<button>` est pertinent\xA0;",
          "S\u2019il est pr\xE9sent, le contenu de l\u2019attribut `alt` d\u2019une balise `<input>` de type `image` est pertinent\xA0;",
          "S\u2019il est pr\xE9sent, le contenu de l\u2019attribut `title` est pertinent."
        ],
        "2": [
          "Chaque [bouton](#bouton-formulaire) affichant un [intitul\xE9 visible](#intitule-visible) v\xE9rifie-t-il ces conditions (hors cas particuliers)\xA0?",
          "S\u2019il est pr\xE9sent, le contenu de l\u2019attribut WAI-ARIA `aria-label `contient au moins l\u2019[intitul\xE9 visible](#intitule-visible)\xA0;",
          "S\u2019il est pr\xE9sent, le [passage de texte](#passage-de-texte-lie-par-aria-labelledby-ou-aria-describedby) li\xE9 au bouton via un attribut WAI-ARIA `aria-labelledby` contient au moins l\u2019[intitul\xE9 visible](#intitule-visible)\xA0;",
          "S\u2019il est pr\xE9sent, le contenu de l\u2019attribut value d\u2019une balise `<input>` de type `submit`, `reset` ou `button` contient au moins l\u2019[intitul\xE9 visible](#intitule-visible)\xA0;",
          "S\u2019il est pr\xE9sent, le contenu de la balise `<button>` contient au moins l\u2019[intitul\xE9 visible](#intitule-visible)\xA0;",
          "S\u2019il est pr\xE9sent, le contenu de l\u2019attribut `alt` d\u2019une balise `<input>` de type `image` contient au moins l\u2019[intitul\xE9 visible](#intitule-visible)\xA0;",
          "S\u2019il est pr\xE9sent, le contenu de l\u2019attribut `title` contient au moins l\u2019[intitul\xE9 visible](#intitule-visible)."
        ]
      },
      wcag: ["2.5.3 Label in Name (A)", "4.1.2 Name, Role, Value (A)"],
      techniques: ["H36", "H91", "ARIA6", "ARIA9", "ARIA14", "ARIA16"],
      particularCases: ["Pour le test 11.9.2, voir cas particuliers crit\xE8re 11.2."],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "11.10",
      theme: 11,
      title: "Dans chaque [formulaire](#formulaire), le [contr\xF4le de saisie](#controle-de-saisie-formulaire) est-il utilis\xE9 de mani\xE8re pertinente (hors cas particuliers)\xA0?",
      titlePlain: "Dans chaque formulaire, le contr\xF4le de saisie est-il utilis\xE9 de mani\xE8re pertinente (hors cas particuliers)\xA0?",
      tests: {
        "1": [
          "Les [indications du caract\xE8re obligatoire](#indication-de-champ-obligatoire) de la saisie des champs v\xE9rifient-elles une de ces conditions (hors cas particuliers)\xA0?",
          "Une [indication de champ obligatoire](#indication-de-champ-obligatoire) est visible et permet d\u2019identifier nomm\xE9ment le champ concern\xE9 pr\xE9alablement \xE0 la validation du formulaire\xA0;",
          'Le champ obligatoire dispose de l\u2019attribut `aria-required="true"` ou `required` pr\xE9alablement \xE0 la validation du formulaire.'
        ],
        "2": [
          'Les champs obligatoires ayant l\u2019attribut `aria-required="true"` ou `required` v\xE9rifient-ils une de ces conditions\xA0?',
          "Une [indication de champ obligatoire](#indication-de-champ-obligatoire) est visible et situ\xE9e dans l\u2019\xE9tiquette associ\xE9e au champ pr\xE9alablement \xE0 la validation du formulaire\xA0;",
          "Une [indication de champ obligatoire](#indication-de-champ-obligatoire) est visible et situ\xE9e dans le [passage de texte](#passage-de-texte-lie-par-aria-labelledby-ou-aria-describedby) associ\xE9 au champ pr\xE9alablement \xE0 la validation du formulaire."
        ],
        "3": [
          "Les messages d\u2019erreur indiquant l\u2019absence de saisie d\u2019un champ obligatoire v\xE9rifient-ils une de ces conditions\xA0?",
          "Le message d\u2019erreur indiquant l\u2019absence de saisie d\u2019un champ obligatoire est visible et permet d\u2019identifier nomm\xE9ment le champ concern\xE9\xA0;",
          'Le champ obligatoire dispose de l\u2019attribut `aria-invalid="true"`.'
        ],
        "4": [
          'Les champs obligatoires ayant l\u2019attribut `aria-invalid="true"` v\xE9rifient-ils une de ces conditions\xA0?',
          "Le message d\u2019erreur indiquant le caract\xE8re invalide de la saisie est visible et situ\xE9 dans l\u2019\xE9tiquette associ\xE9e au champ\xA0;",
          "Le message d\u2019erreur indiquant le caract\xE8re invalide de la saisie est visible et situ\xE9 dans le [passage de texte](#passage-de-texte-lie-par-aria-labelledby-ou-aria-describedby) associ\xE9 au champ."
        ],
        "5": [
          "Les instructions et indications du type de donn\xE9es et/ou de format obligatoires v\xE9rifient-elles une de ces conditions\xA0?",
          "Une instruction ou une indication du type de donn\xE9es et/ou de format obligatoire est visible et permet d\u2019identifier nomm\xE9ment le champ concern\xE9 pr\xE9alablement \xE0 la validation du formulaire\xA0;",
          "Une instruction ou une indication du type de donn\xE9es et/ou de format obligatoire est visible dans l\u2019\xE9tiquette ou le [passage de texte](#passage-de-texte-lie-par-aria-labelledby-ou-aria-describedby) associ\xE9 au champ pr\xE9alablement \xE0 la validation du formulaire."
        ],
        "6": [
          "Les messages d\u2019erreurs fournissant une instruction ou une indication du type de donn\xE9es et/ou de format obligatoire des champs v\xE9rifient-ils une de ces conditions\xA0?",
          "Le message d\u2019erreur fournissant une instruction ou une indication du type de donn\xE9es et/ou de format obligatoires est visible et identifie le champ concern\xE9\xA0;",
          'Le champ dispose de l\u2019attribut `aria-invalid="true"`.'
        ],
        "7": [
          'Les champs ayant l\u2019attribut `aria-invalid="true"` dont la saisie requiert un type de donn\xE9es et/ou de format obligatoires v\xE9rifient-ils une de ces conditions\xA0?',
          "Une instruction ou une indication du type de donn\xE9es et/ou de format obligatoire est visible et situ\xE9e dans la balise `<label>` associ\xE9e au champ\xA0;",
          "Une instruction ou une indication du type de donn\xE9es et/ou de format obligatoire est visible et situ\xE9e dans le [passage de texte](#passage-de-texte-lie-par-aria-labelledby-ou-aria-describedby) associ\xE9 au champ."
        ]
      },
      wcag: ["3.3.1 Error Identification (A)", "3.3.2 Labels or Instructions (A)"],
      techniques: [
        "G83",
        "G84",
        "G85",
        "G89",
        "G184",
        "H44",
        "H81",
        "H89",
        "H90",
        "F81",
        "SCR18",
        "SCR32",
        "ARIA1",
        "ARIA2",
        "ARIA6",
        "ARIA9",
        "ARIA16",
        "ARIA21"
      ],
      technicalNote: [
        "Dans un long formulaire dont la majorit\xE9 des champs sont obligatoires, on pourrait constater que ce sont les quelques champs rest\xE9s facultatifs qui sont explicitement signal\xE9s comme tels. Dans ce cas, il faudrait s\u2019assurer que\xA0:",
        "[object Object]"
      ],
      particularCases: [
        "Le test 11.10.1 et le test 11.10.2 seront consid\xE9r\xE9s comme non applicables lorsque le formulaire comporte un seul [champ de formulaire](#champ-de-saisie-de-formulaire) ou qu\u2019il indique les champs optionnels de mani\xE8re\xA0:",
        "[object Object]",
        "Dans le cas o\xF9 l\u2019ensemble des champs d\u2019un formulaire sont obligatoires, les tests 11.10.1 et 11.10.2 restent applicables."
      ],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "11.11",
      theme: 11,
      title: "Dans chaque [formulaire](#formulaire), le [contr\xF4le de saisie](#controle-de-saisie-formulaire) est-il accompagn\xE9, si n\xE9cessaire, de suggestions facilitant la correction des erreurs de saisie\xA0?",
      titlePlain: "Dans chaque formulaire, le contr\xF4le de saisie est-il accompagn\xE9, si n\xE9cessaire, de suggestions facilitant la correction des erreurs de saisie\xA0?",
      tests: {
        "1": ["Pour chaque erreur de saisie, les types et les formats de donn\xE9es sont-ils sugg\xE9r\xE9s, si n\xE9cessaire\xA0?"],
        "2": ["Pour chaque erreur de saisie, des exemples de valeurs attendues sont-ils sugg\xE9r\xE9s, si n\xE9cessaire\xA0?"]
      },
      wcag: ["3.3.3 Error Suggestion (AA)"],
      techniques: ["G84", "G85", "G89", "G177", "H89"],
      technicalNote: [
        "Certains types de contr\xF4les en HTML5 proposent des messages d\u2019aide \xE0 la saisie automatique\xA0: par exemple le type `email` affiche un message du type \xAB\xA0veuillez saisir une adresse e-mail valide\xA0\xBB dans le cas o\xF9 l\u2019adresse e-mail saisie ne correspond pas au format attendu. Ces messages sont personnalisables via l\u2019API Constraint Validation, ce qui permet de personnaliser les messages d\u2019erreur et de valider le crit\xE8re. L\u2019attribut `pattern` permet d\u2019effectuer automatiquement des contr\xF4les de format (via des expressions r\xE9guli\xE8res) et affiche un message d\u2019aide personnalisable via l\u2019attribut `title`\xA0: ce dispositif valide \xE9galement le crit\xE8re."
      ],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "11.12",
      theme: 11,
      title: "Pour chaque [formulaire](#formulaire) qui modifie ou supprime des donne\u0301es, ou qui transmet des re\u0301ponses a\u0300 un test ou a\u0300 un examen, ou dont la validation a des conse\u0301quences financie\u0300res ou juridiques, les donne\u0301es saisies peuvent-elles \xEAtre modifi\xE9es, mises \xE0 jour ou r\xE9cup\xE9r\xE9es par l\u2019utilisateur\xA0?",
      titlePlain: "Pour chaque formulaire qui modifie ou supprime des donne\u0301es, ou qui transmet des re\u0301ponses a\u0300 un test ou a\u0300 un examen, ou dont la validation a des conse\u0301quences financie\u0300res ou juridiques, les donne\u0301es saisies peuvent-elles \xEAtre modifi\xE9es, mises \xE0 jour ou r\xE9cup\xE9r\xE9es par l\u2019utilisateur\xA0?",
      tests: {
        "1": [
          "Pour chaque formulaire qui modifie ou supprime des donn\xE9es, ou qui transmet des r\xE9ponses \xE0 un test ou un examen, ou dont la validation a des cons\xE9quences financi\xE8res ou juridiques, la saisie des donn\xE9es v\xE9rifie-t-elle une de ces conditions\xA0?",
          "L\u2019utilisateur peut [modifier ou annuler les donn\xE9es et les actions effectu\xE9es](#modifier-ou-annuler-les-donnees-et-les-actions-effectues) sur ces donn\xE9es apr\xE8s la validation du formulaire\xA0;",
          "L\u2019utilisateur peut v\xE9rifier et corriger les donn\xE9es avant la validation d\u2019un formulaire en plusieurs \xE9tapes\xA0;",
          'Un m\xE9canisme de confirmation explicite, via une case \xE0 cocher (balise `<input>` de type `checkbox` ou balise ayant un attribut WAI-ARIA `role="checkbox"`) ou une \xE9tape suppl\xE9mentaire, est pr\xE9sent.'
        ],
        "2": [
          "Chaque formulaire dont la validation modifie ou supprime des donn\xE9es \xE0 caract\xE8re financier, juridique ou personnel v\xE9rifie-t-il une de ces conditions\xA0?",
          "Un m\xE9canisme permet de r\xE9cup\xE9rer les donn\xE9es supprim\xE9es ou modifi\xE9es par l\u2019utilisateur\xA0;",
          "Un m\xE9canisme de demande de confirmation explicite de la suppression ou de la modification, via un [champ de formulaire](#champ-de-saisie-de-formulaire) ou une \xE9tape suppl\xE9mentaire, est propos\xE9."
        ]
      },
      wcag: ["3.3.4 Error Prevention (Legal, Financial, Data) (AA)"],
      techniques: ["G98", "G99", "G155", "G164", "G168"],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "11.13",
      theme: 11,
      title: "La finalit\xE9 d\u2019un champ de saisie peut-elle \xEAtre d\xE9duite pour faciliter le remplissage automatique des champs avec les donn\xE9es de l\u2019utilisateur\xA0?",
      titlePlain: "La finalit\xE9 d\u2019un champ de saisie peut-elle \xEAtre d\xE9duite pour faciliter le remplissage automatique des champs avec les donn\xE9es de l\u2019utilisateur\xA0?",
      tests: {
        "1": [
          "Chaque [champ de formulaire](#champ-de-saisie-de-formulaire) dont l\u2019objet se rapporte \xE0 une information concernant l\u2019utilisateur v\xE9rifie-t-il ces conditions\xA0?",
          "Le [champ de formulaire](#champ-de-saisie-de-formulaire) poss\xE8de un attribut `autocomplete\xA0`;",
          "L\u2019attribut `autocomplete` est pourvu d\u2019une valeur pr\xE9sente dans la [liste des valeurs possibles pour l\u2019attribut `autocomplete`](#liste-des-valeurs-possibles-pour-l-attribut-autocomplete) associ\xE9s \xE0 un [champ de formulaire](#champ-de-saisie-de-formulaire)\xA0;",
          "La valeur indiqu\xE9e pour l\u2019attribut `autocomplete` est pertinente au regard du type d\u2019information attendu."
        ]
      },
      wcag: ["1.3.5 Identify Input Purpose (AA)"],
      techniques: ["H98"],
      technicalNote: [
        "La [liste des valeurs possibles pour l\u2019attribut `autocomplete`](#liste-des-valeurs-possibles-pour-l-attribut-autocomplete) repose sur la liste des valeurs pr\xE9sentes dans la sp\xE9cification WCAG2.1 qui reprend elle-m\xEAme la liste des valeurs de type \u201Cfield name\u201D de la sp\xE9cification HTML5.2. Le crit\xE8re WCAG demande \xE0 ce que l\u2019une de ces valeurs soit pr\xE9sente pour qualifier un champ de saisie concernant l\u2019utilisateur.",
        'Ce que le crit\xE8re WCAG laisse implicite, ce sont les diff\xE9rentes r\xE8gles de construction possibles pour obtenir une valeur (simple ou compos\xE9e) pour l\u2019attribut `autocomplete`. C\u2019est cependant l\u2019affaire du d\xE9veloppeur de fournir \xE0 l\u2019attribut `autocomplete` une valeur ou un ensemble de valeurs valides au regard des exigences de l\u2019algorithme fourni par la sp\xE9cification HTML5.2. Ainsi, un attribut `autocomplete` ne peut contenir qu\u2019une seule valeur de type `\u201Cfield name\u201D`, comme `"name"` ou `"street-address"`. On peut avoir \xE9galement un ensemble compos\xE9 de diff\xE9rentes valeurs comme, par exemple, `autocomplete="shipping name"` ou `autocomplete="section-software shipping street-address"`\xA0: `"section-software"` renvoie \xE0 une valeur de type <span lang="en">\u201Cscope\u201D</span> et `"shipping"` \xE0 une valeur de type <span lang="en">\u201Chint set\u201D</span>, mais toujours une seule valeur de type <span lang="en">\u201Cfield name\u201D</span>.'
      ],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "12.1",
      theme: 12,
      title: "Chaque [ensemble de pages](#ensemble-de-pages) dispose-t-il de deux [syst\xE8mes de navigation](#systeme-de-navigation) diff\xE9rents, au moins (hors cas particuliers)\xA0?",
      titlePlain: "Chaque ensemble de pages dispose-t-il de deux syst\xE8mes de navigation diff\xE9rents, au moins (hors cas particuliers)\xA0?",
      tests: {
        "1": [
          "Chaque [ensemble de pages](#ensemble-de-pages) v\xE9rifie-t-il une de ces conditions (hors cas particuliers)\xA0?",
          "Un [menu de navigation](#menu-et-barre-de-navigation) et un [plan du site](#page-plan-du-site) sont pr\xE9sents\xA0;",
          "Un [menu de navigation](#menu-et-barre-de-navigation) et un [moteur de recherche](#moteur-de-recherche-interne-a-un-site-web) sont pr\xE9sents\xA0;",
          "Un [moteur de recherche](#moteur-de-recherche-interne-a-un-site-web) et un [plan du site](#page-plan-du-site) sont pr\xE9sents."
        ]
      },
      wcag: ["2.4.5 Multiple Ways (AA)"],
      techniques: ["G63", "G64", "G161"],
      particularCases: [
        "Il existe une gestion de cas particulier lorsque le site web est constitu\xE9 d\u2019une seule page ou d\u2019un nombre tr\xE8s limit\xE9 de pages (cf. note). Dans ce cas-l\xE0, le crit\xE8re est non applicable.",
        "Le crit\xE8re est \xE9galement non applicable pour les pages d\u2019un ensemble de pages qui sont le r\xE9sultat ou une partie d\u2019un processus (un processus de paiement ou de prise de commande, par exemple).",
        "Note\xA0: l\u2019appr\xE9ciation d\u2019un nombre tr\xE8s limit\xE9 de pages devrait \xEAtre r\xE9serv\xE9 \xE0 un site dont l\u2019ensemble des pages sont atteignables depuis la page d\u2019accueil."
      ],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "12.2",
      theme: 12,
      title: "Dans chaque [ensemble de pages](#ensemble-de-pages), le [menu et les barres de navigation](#menu-et-barre-de-navigation) sont-ils toujours \xE0 la m\xEAme place (hors cas particuliers)\xA0?",
      titlePlain: "Dans chaque ensemble de pages, le menu et les barres de navigation sont-ils toujours \xE0 la m\xEAme place (hors cas particuliers)\xA0?",
      tests: {
        "1": [
          "Dans chaque [ensemble de pages](#ensemble-de-pages), chaque page disposant d\u2019un [menu et les barres de navigation](#menu-et-barre-de-navigation) v\xE9rifie-t-elle ces conditions (hors cas particuliers)\xA0?",
          "Le [menu et les barres de navigation](#menu-et-barre-de-navigation) sont toujours \xE0 la m\xEAme place dans la pr\xE9sentation\xA0;",
          "Le [menu et les barres de navigation](#menu-et-barre-de-navigation) se pr\xE9sentent toujours dans le m\xEAme ordre relatif dans le code source."
        ]
      },
      wcag: ["3.2.3 Consistent Navigation (AA)"],
      techniques: ["G61", "F66"],
      particularCases: ["Il existe une gestion de cas particuliers lorsque\xA0:", "[object Object]", "Dans ces situations, le crit\xE8re est non applicable."],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "12.3",
      theme: 12,
      title: "La [page \xAB\xA0plan du site\xA0\xBB](#page-plan-du-site) est-elle pertinente\xA0?",
      titlePlain: "La page \xAB\xA0plan du site\xA0\xBB est-elle pertinente\xA0?",
      tests: {
        "1": ["La [page \xAB\xA0plan du site\xA0\xBB](#page-plan-du-site) est-elle repr\xE9sentative de l\u2019architecture g\xE9n\xE9rale du site\xA0?"],
        "2": ["Les liens du [plan du site](#page-plan-du-site) sont-ils fonctionnels\xA0?"],
        "3": ["Les liens du [plan du site](#page-plan-du-site) renvoient-ils bien vers les pages indiqu\xE9es par l\u2019intitul\xE9\xA0?"]
      },
      wcag: ["2.4.5 Multiple Ways (AA)"],
      techniques: ["G63"],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "12.4",
      theme: 12,
      title: "Dans chaque [ensemble de pages](#ensemble-de-pages), la [page \xAB\xA0plan du site\xA0\xBB](#page-plan-du-site) est-elle accessible \xE0 partir d\u2019une fonctionnalit\xE9 identique\xA0?",
      titlePlain: "Dans chaque ensemble de pages, la page \xAB\xA0plan du site\xA0\xBB est-elle accessible \xE0 partir d\u2019une fonctionnalit\xE9 identique\xA0?",
      tests: {
        "1": [
          "Dans chaque [ensemble de pages](#ensemble-de-pages), la [page \xAB\xA0plan du site\xA0\xBB](#page-plan-du-site) est-elle accessible \xE0 partir d\u2019une fonctionnalit\xE9 identique\xA0?"
        ],
        "2": [
          "Dans chaque [ensemble de pages](#ensemble-de-pages), la fonctionnalit\xE9 vers la [page \xAB\xA0plan du site\xA0\xBB](#page-plan-du-site) est-elle situ\xE9e \xE0 la m\xEAme place dans la pr\xE9sentation\xA0?"
        ],
        "3": [
          "Dans chaque [ensemble de pages](#ensemble-de-pages), la fonctionnalit\xE9 vers la [page \xAB\xA0plan du site\xA0\xBB](#page-plan-du-site) se pr\xE9sente-t-elle toujours dans le m\xEAme ordre relatif dans le code source\xA0?"
        ]
      },
      wcag: ["2.4.5 Multiple Ways (AA)", "3.2.3 Consistent Navigation (AA)"],
      techniques: ["G61", "G63"],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "12.5",
      theme: 12,
      title: "Dans chaque [ensemble de pages](#ensemble-de-pages), le [moteur de recherche](#moteur-de-recherche-interne-a-un-site-web) est-il atteignable de mani\xE8re identique\xA0?",
      titlePlain: "Dans chaque ensemble de pages, le moteur de recherche est-il atteignable de mani\xE8re identique\xA0?",
      tests: {
        "1": [
          "Dans chaque [ensemble de pages](#ensemble-de-pages), le [moteur de recherche](#moteur-de-recherche-interne-a-un-site-web) est-il accessible \xE0 partir d\u2019une fonctionnalit\xE9 identique\xA0?"
        ],
        "2": [
          "Dans chaque [ensemble de pages](#ensemble-de-pages), la fonctionnalit\xE9 vers le [moteur de recherche](#moteur-de-recherche-interne-a-un-site-web) est-elle situ\xE9e \xE0 la m\xEAme place dans la pr\xE9sentation\xA0?"
        ],
        "3": [
          "Dans chaque [ensemble de pages](#ensemble-de-pages), la fonctionnalit\xE9 vers le [moteur de recherche](#moteur-de-recherche-interne-a-un-site-web) se pr\xE9sente-t-elle toujours dans le m\xEAme ordre relatif dans le code source\xA0?"
        ]
      },
      wcag: ["3.2.3 Consistent Navigation (AA)"],
      techniques: ["G61", "F66"],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "12.6",
      theme: 12,
      title: "Les zones de regroupement de contenus pr\xE9sentes dans plusieurs pages web (zones d\u2019[en-t\xEAte](#zone-d-en-tete), de [navigation principale](#menu-et-barre-de-navigation), de [contenu principal](#zone-de-contenu-principal), de [pied de page](#zone-de-pied-de-page) et de [moteur de recherche](#moteur-de-recherche-interne-a-un-site-web)) peuvent-elles \xEAtre atteintes ou \xE9vit\xE9es\xA0?",
      titlePlain: "Les zones de regroupement de contenus pr\xE9sentes dans plusieurs pages web (zones d\u2019en-t\xEAte, de navigation principale, de contenu principal, de pied de page et de moteur de recherche) peuvent-elles \xEAtre atteintes ou \xE9vit\xE9es\xA0?",
      tests: {
        "1": [
          "Dans chaque page web o\xF9 elles sont pr\xE9sentes, la zone d\u2019[en-t\xEAte](#zone-d-en-tete), de [navigation principale](#menu-et-barre-de-navigation), de [contenu principal](#zone-de-contenu-principal), de [pied de page](#zone-de-pied-de-page) et de [moteur de recherche](#moteur-de-recherche-interne-a-un-site-web) respectent-elles au moins une de ces conditions\xA0?",
          "La zone poss\xE8de un r\xF4le WAI-ARIA de type [landmark](#landmarks) correspondant \xE0 sa nature\xA0;",
          "La zone poss\xE8de un titre dont le contenu permet de comprendre la nature du contenu de la zone\xA0;",
          "La zone peut \xEAtre masqu\xE9e par le biais d\u2019un bouton pr\xE9c\xE9dent directement la zone dans l\u2019ordre du code source\xA0;",
          "La zone peut \xEAtre \xE9vit\xE9e par le biais d\u2019un [lien d\u2019\xE9vitement](#liens-d-evitement-ou-d-acces-rapide) pr\xE9c\xE9dent directement la zone dans l\u2019ordre du code source\xA0;",
          "La zone peut \xEAtre atteinte par le biais d\u2019un [lien d\u2019acc\xE8s rapide](#liens-d-evitement-ou-d-acces-rapide) visible ou, \xE0 d\xE9faut, visible \xE0 la prise de focus."
        ]
      },
      wcag: ["1.3.1 Info and Relationships (A)", "2.4.1 Bypass Blocks (A)", "4.1.2 Name, Role, Value (A)"],
      techniques: ["H69", "G115", "ARIA4", "ARIA11"],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "12.7",
      theme: 12,
      title: "Dans chaque page web, un [lien d\u2019\xE9vitement ou d\u2019acc\xE8s rapide](#liens-d-evitement-ou-d-acces-rapide) \xE0 la [zone de contenu principal](#zone-de-contenu-principal) est-il pr\xE9sent (hors cas particuliers)\xA0?",
      titlePlain: "Dans chaque page web, un lien d\u2019\xE9vitement ou d\u2019acc\xE8s rapide \xE0 la zone de contenu principal est-il pr\xE9sent (hors cas particuliers)\xA0?",
      tests: {
        "1": [
          "Dans chaque page web, un lien permet-il d\u2019\xE9viter la [zone de contenu principal](#zone-de-contenu-principal) ou d\u2019y acc\xE9der (hors cas particuliers)\xA0?"
        ],
        "2": [
          "Dans chaque ensemble de pages, le [lien d\u2019\xE9vitement ou d\u2019acc\xE8s rapide](#liens-d-evitement-ou-d-acces-rapide) \xE0 la [zone de contenu principal](#zone-de-contenu-principal) v\xE9rifie-t-il ces conditions (hors cas particuliers)\xA0?",
          "Le lien est situ\xE9 \xE0 la m\xEAme place dans la pr\xE9sentation\xA0;",
          "Le lien se pr\xE9sente toujours dans le m\xEAme ordre relatif dans le code source\xA0;",
          "Le lien est visible ou, \xE0 d\xE9faut, visible \xE0 la prise de focus\xA0;",
          "Le lien est fonctionnel."
        ]
      },
      wcag: ["2.4.1 Bypass Blocks (A)", "2.4.3 Focus Order (A)", "3.2.3 Consistent Navigation (AA)"],
      techniques: ["G1", "G59", "G123", "G124", "SCR28", "F66"],
      particularCases: [
        "Il existe une gestion de cas particuliers lorsque le site web est constitu\xE9 d\u2019une seule page.",
        "Dans ce cas de figure, l\u2019obligation de la pr\xE9sence d\u2019un lien d\u2019acc\xE8s rapide est li\xE9e au contexte de la page\xA0: pr\xE9sence ou absence de navigation ou de contenus additionnels, par exemple. Le crit\xE8re peut \xEAtre consid\xE9r\xE9 comme non applicable lorsqu\u2019il est av\xE9r\xE9 qu\u2019un lien d\u2019acc\xE8s rapide est inutile."
      ],
      automatability: "static",
      ruleIds: ["skip-link-target-missing"]
    },
    {
      id: "12.8",
      theme: 12,
      title: "Dans chaque page web, l\u2019[ordre de tabulation](#ordre-de-tabulation) est-il [coh\xE9rent](#comprehensible-ordre-de-lecture)\xA0?",
      titlePlain: "Dans chaque page web, l\u2019ordre de tabulation est-il coh\xE9rent\xA0?",
      tests: {
        "1": ["Dans chaque page web, l\u2019[ordre de tabulation](#ordre-de-tabulation) dans le contenu est-il [coh\xE9rent](#comprehensible-ordre-de-lecture)\xA0?"],
        "2": [
          "Pour chaque [script](#script) qui met \xE0 jour ou ins\xE8re un contenu, l\u2019[ordre de tabulation](#ordre-de-tabulation) reste-t-il [coh\xE9rent](#comprehensible-ordre-de-lecture)\xA0?"
        ]
      },
      wcag: ["2.4.3 Focus Order (A)"],
      techniques: ["G59", "H4", "F44", "F85", "SCR26", "SCR27", "SCR37", "C27"],
      automatability: "static",
      ruleIds: ["positive-tabindex"]
    },
    {
      id: "12.9",
      theme: 12,
      title: "Dans chaque page web, la navigation ne doit pas contenir de pi\xE8ge au clavier. Cette r\xE8gle est-elle respect\xE9e\xA0?",
      titlePlain: "Dans chaque page web, la navigation ne doit pas contenir de pi\xE8ge au clavier. Cette r\xE8gle est-elle respect\xE9e\xA0?",
      tests: {
        "1": [
          "Dans chaque page web, chaque [\xE9l\xE9ment recevant le focus](#prise-de-focus) v\xE9rifie-t-il une de ces conditions\xA0?",
          "Il est possible d\u2019atteindre l\u2019\xE9l\xE9ment suivant ou pr\xE9c\xE9dent pouvant recevoir le focus avec la touche de tabulation\xA0;",
          "L\u2019utilisateur est inform\xE9 d\u2019un m\xE9canisme fonctionnel permettant d\u2019atteindre au clavier l\u2019\xE9l\xE9ment suivant ou pr\xE9c\xE9dent pouvant recevoir le focus."
        ]
      },
      wcag: ["2.1.1 Keyboard (A)", "2.1.2 No Keyboard Trap (A)"],
      techniques: ["G21", "H91", "F10"],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "12.10",
      theme: 12,
      title: "Dans chaque page web, les [raccourcis clavier](#raccourci-clavier) n\u2019utilisant qu\u2019une seule touche (lettre minuscule ou majuscule, ponctuation, chiffre ou symbole) sont-ils contr\xF4lables par l\u2019utilisateur\xA0?",
      titlePlain: "Dans chaque page web, les raccourcis clavier n\u2019utilisant qu\u2019une seule touche (lettre minuscule ou majuscule, ponctuation, chiffre ou symbole) sont-ils contr\xF4lables par l\u2019utilisateur\xA0?",
      tests: {
        "1": [
          "Dans chaque page web, chaque [raccourci clavier](#raccourci-clavier) n\u2019utilisant qu\u2019une seule touche (lettre minuscule ou majuscule, ponctuation, chiffre ou symbole) v\xE9rifie-t-il l\u2019une de ces conditions\xA0?",
          "Un m\xE9canisme est disponible pour d\xE9sactiver le [raccourci clavier](#raccourci-clavier)\xA0;",
          "Un m\xE9canisme est disponible pour configurer la touche de [raccourci clavier](#raccourci-clavier) au moyen des touches de modification (Ctrl, Alt, Maj, etc.)\xA0;",
          "Dans le cas d\u2019un [composant d\u2019interface](#composant-d-interface) utilisateur, le [raccourci clavier](#raccourci-clavier) qui lui est associ\xE9 ne peut \xEAtre activ\xE9 que si le focus clavier est sur ce composant."
        ]
      },
      wcag: ["2.1.4 Character Key Shortcuts (A)"],
      techniques: ["F99", "G217"],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "12.11",
      theme: 12,
      title: "Dans chaque page web, les contenus additionnels apparaissant au survol, \xE0 la prise de focus ou \xE0 l\u2019activation d\u2019un [composant d\u2019interface](#composant-d-interface) sont-ils si n\xE9cessaire atteignables au clavier\xA0?",
      titlePlain: "Dans chaque page web, les contenus additionnels apparaissant au survol, \xE0 la prise de focus ou \xE0 l\u2019activation d\u2019un composant d\u2019interface sont-ils si n\xE9cessaire atteignables au clavier\xA0?",
      tests: {
        "1": [
          "Dans chaque page web, les contenus additionnels apparaissant au survol, \xE0 la prise de focus ou \xE0 l\u2019activation d\u2019un [composant d\u2019interface](#composant-d-interface) sont-ils si n\xE9cessaire atteignables au clavier\xA0?"
        ]
      },
      wcag: ["2.1.1 Keyboard (A)"],
      techniques: [],
      technicalNote: [
        "Ce crit\xE8re adresse les situations o\xF9 un contenu additionnel contient des [composants d\u2019interface](#composant-d-interface) avec lesquels il doit \xEAtre possible d\u2019interagir au clavier. Par exemple, une infobulle personnalis\xE9e qui propose un lien dans son contenu."
      ],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "13.1",
      theme: 13,
      title: "Pour chaque page web, l\u2019utilisateur a-t-il le contr\xF4le de chaque limite de temps modifiant le contenu (hors cas particuliers)\xA0?",
      titlePlain: "Pour chaque page web, l\u2019utilisateur a-t-il le contr\xF4le de chaque limite de temps modifiant le contenu (hors cas particuliers)\xA0?",
      tests: {
        "1": [
          "Pour chaque page web, chaque [proc\xE9d\xE9 de rafra\xEEchissement](#procede-de-rafraichissement) (balise `<object>`, balise `<embed>`, balise `<svg>`, balise `<canvas>`, balise `<meta>`) v\xE9rifie-t-il une de ces conditions (hors cas particuliers)\xA0?",
          "L\u2019utilisateur peut arr\xEAter ou relancer le rafra\xEEchissement\xA0;",
          "L\u2019utilisateur peut augmenter la limite de temps entre deux rafra\xEEchissements de dix fois, au moins\xA0;",
          "L\u2019utilisateur est averti de l\u2019imminence du rafra\xEEchissement et dispose de vingt secondes, au moins, pour augmenter la limite de temps avant le prochain rafra\xEEchissement\xA0;",
          "La limite de temps entre deux rafra\xEEchissements est de vingt heures, au moins."
        ],
        "2": ["Pour chaque page web, chaque proc\xE9d\xE9 de [redirection](#redirection) effectu\xE9 via une balise `<meta>` est-il imm\xE9diat (hors cas particuliers)\xA0?"],
        "3": [
          "Pour chaque page web, chaque proc\xE9d\xE9 de [redirection](#redirection) effectu\xE9 via un [script](#script) v\xE9rifie-t-il une de ces conditions (hors cas particuliers)\xA0?",
          "L\u2019utilisateur peut arr\xEAter ou relancer la redirection\xA0;",
          "L\u2019utilisateur peut augmenter la limite de temps avant la redirection de dix fois, au moins\xA0;",
          "L\u2019utilisateur est averti de l\u2019imminence de la redirection et dispose de vingt secondes, au moins, pour augmenter la limite de temps avant la prochaine redirection\xA0;",
          "La limite de temps avant la redirection est de vingt heures, au moins."
        ],
        "4": [
          "Pour chaque page web, chaque proc\xE9d\xE9 limitant le temps d\u2019une session v\xE9rifie-t-il une de ces conditions (hors cas particuliers)\xA0?",
          "L\u2019utilisateur peut supprimer la limite de temps\xA0;",
          "L\u2019utilisateur peut augmenter la limite de temps\xA0;",
          "La limite de temps avant la fin de la session est de vingt heures au moins."
        ]
      },
      wcag: ["2.2.1 Timing Adjustable (A)", "2.2.2 Pause, Stop, Hide (A)"],
      techniques: ["F40", "F41", "F58", "F61", "G75", "G76", "G110", "G133", "G180", "G186", "G198", "H76", "SCR1", "SCR16", "SCR36", "SVR1"],
      particularCases: [
        "Il existe une gestion de cas particuliers lorsque la limite de temps est essentielle, notamment lorsqu\u2019elle ne pourrait pas \xEAtre supprim\xE9e sans changer fondamentalement le contenu ou les fonctionnalit\xE9s li\xE9es au contenu.",
        "Dans ces situations, le crit\xE8re est non applicable. Par exemple, le rafra\xEEchissement d\u2019un flux RSS dans une page n\u2019est pas une limite de temps essentielle\xA0; le crit\xE8re est applicable. En revanche, une redirection automatique qui am\xE8ne vers la nouvelle version d\u2019une page \xE0 partir d\u2019une URL obsol\xE8te est essentielle\xA0; le crit\xE8re est non applicable."
      ],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "13.2",
      theme: 13,
      title: "Dans chaque page web, l\u2019ouverture d\u2019une nouvelle fen\xEAtre ne doit pas \xEAtre d\xE9clench\xE9e sans action de l\u2019utilisateur. Cette r\xE8gle est-elle respect\xE9e\xA0?",
      titlePlain: "Dans chaque page web, l\u2019ouverture d\u2019une nouvelle fen\xEAtre ne doit pas \xEAtre d\xE9clench\xE9e sans action de l\u2019utilisateur. Cette r\xE8gle est-elle respect\xE9e\xA0?",
      tests: {
        "1": [
          "Dans chaque page web, l\u2019ouverture d\u2019une nouvelle fen\xEAtre ne doit pas \xEAtre d\xE9clench\xE9e sans action de l\u2019utilisateur. Cette r\xE8gle est-elle respect\xE9e\xA0?"
        ]
      },
      wcag: ["3.2.1 On focus (A)"],
      techniques: ["F55", "G107"],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "13.3",
      theme: 13,
      title: "Dans chaque page web, chaque document bureautique en t\xE9l\xE9chargement poss\xE8de-t-il, si n\xE9cessaire, une [version accessible](#version-accessible-pour-un-document-en-telechargement) (hors cas particuliers)\xA0?",
      titlePlain: "Dans chaque page web, chaque document bureautique en t\xE9l\xE9chargement poss\xE8de-t-il, si n\xE9cessaire, une version accessible (hors cas particuliers)\xA0?",
      tests: {
        "1": [
          "Dans chaque page web, chaque fonctionnalit\xE9 de t\xE9l\xE9chargement d\u2019un document bureautique v\xE9rifie-t-elle une de ces conditions\xA0?",
          "Le document en t\xE9l\xE9chargement est compatible avec l'accessibilit\xE9 ;",
          "Il en existe une version alternative en t\xE9l\xE9chargement compatible avec l'accessibilit\xE9 ;",
          "Il en existe une version alternative au format HTML compatible avec l'accessibilit\xE9."
        ]
      },
      wcag: [
        "1.1.1 Non-text Content (A)",
        "1.3.1 Info and Relationships (A)",
        "1.3.2 Meaningful Sequence (A)",
        "2.4.1 Bypass Blocks (A)",
        "2.4.3 Focus Order (A)",
        "3.1.1 Language of Page (A)",
        "4.1.2 Name, Role, Value (A)"
      ],
      techniques: ["F15", "G10", "G135"],
      particularCases: ["Il existe une gestion de cas particuliers\xA0:", "[object Object]", "Dans cette situation, le crit\xE8re est non applicable."],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "13.4",
      theme: 13,
      title: "Pour chaque document bureautique ayant une [version accessible](#version-accessible-pour-un-document-en-telechargement), cette version offre-t-elle la m\xEAme information\xA0?",
      titlePlain: "Pour chaque document bureautique ayant une version accessible, cette version offre-t-elle la m\xEAme information\xA0?",
      tests: {
        "1": [
          "Chaque document bureautique ayant une version accessible v\xE9rifie-t-il une de ces conditions\xA0?",
          "La version compatible avec l\u2019accessibilit\xE9 offre la m\xEAme information\xA0;",
          "La version alternative au format HTML est pertinente et offre la m\xEAme information."
        ]
      },
      wcag: [
        "1.1.1 Non-text Content (A)",
        "1.3.1 Info and Relationships (A)",
        "1.3.2 Meaningful Sequence (A)",
        "2.4.1 Bypass Blocks (A)",
        "2.4.3 Focus Order (A)",
        "3.1.1 Language of Page (A)",
        "4.1.2 Name, Role, Value (A)"
      ],
      techniques: ["F15", "G10", "G135"],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "13.5",
      theme: 13,
      title: "Dans chaque page web, chaque contenu cryptique (art ASCII, \xE9motic\xF4ne, syntaxe cryptique) a-t-il une alternative\xA0?",
      titlePlain: "Dans chaque page web, chaque contenu cryptique (art ASCII, \xE9motic\xF4ne, syntaxe cryptique) a-t-il une alternative\xA0?",
      tests: {
        "1": [
          "Dans chaque page web, chaque contenu cryptique (art ASCII, \xE9motic\xF4ne, syntaxe cryptique) v\xE9rifie-t-il une de ces conditions\xA0?",
          "Un attribut title est disponible\xA0;",
          "Une d\xE9finition est donn\xE9e par le contexte adjacent."
        ]
      },
      wcag: ["1.1.1 Non-text Content (A)"],
      techniques: ["F71", "F70", "G135", "H86"],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "13.6",
      theme: 13,
      title: "Dans chaque page web, pour chaque contenu cryptique (art ASCII, \xE9motic\xF4ne, syntaxe cryptique) ayant une alternative, cette alternative est-elle pertinente\xA0?",
      titlePlain: "Dans chaque page web, pour chaque contenu cryptique (art ASCII, \xE9motic\xF4ne, syntaxe cryptique) ayant une alternative, cette alternative est-elle pertinente\xA0?",
      tests: {
        "1": [
          "Dans chaque page web, chaque contenu cryptique (art ASCII, \xE9motic\xF4ne, syntaxe cryptique) v\xE9rifie-t-il une de ces conditions\xA0?",
          "Le contenu de l\u2019attribut `title` est pertinent\xA0;",
          "La d\xE9finition donn\xE9e par le contexte adjacent est pertinente."
        ]
      },
      wcag: ["1.1.1 Non-text Content (A)"],
      techniques: ["F71", "F72", "H86"],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "13.7",
      theme: 13,
      title: "Dans chaque page web, [les changements brusques de luminosit\xE9 ou les effets de flash](#changement-brusque-de-luminosite-ou-effet-de-flash) sont-ils correctement utilis\xE9s\xA0?",
      titlePlain: "Dans chaque page web, les changements brusques de luminosit\xE9 ou les effets de flash sont-ils correctement utilis\xE9s\xA0?",
      tests: {
        "1": [
          "Dans chaque page web, chaque image ou \xE9l\xE9ment multim\xE9dia (balise `<video>`, balise `<img>`, balise `<svg>`, balise `<canvas>`, balise `<embed>` ou balise `<object>`) qui provoque un changement brusque de luminosite\u0301 ou un effet de flash ve\u0301rifie-t-il une de ces conditions\xA0?",
          "La fr\xE9quence de l\u2019effet est inf\xE9rieure \xE0 3 par seconde\xA0;",
          "La surface totale cumul\xE9e des effets est inf\xE9rieure ou \xE9gale \xE0 21824 pixels."
        ],
        "2": [
          "Dans chaque page web, chaque script qui provoque [un changement brusque de luminosit\xE9 ou un effet de flash](#changement-brusque-de-luminosite-ou-effet-de-flash) v\xE9rifie-t-il une de ces conditions\xA0?",
          "La fr\xE9quence de l\u2019effet est inf\xE9rieure \xE0 3 par seconde\xA0;",
          "La surface totale cumul\xE9e des effets est inf\xE9rieure ou \xE9gale \xE0 21824 pixels."
        ],
        "3": [
          "Dans chaque page web, chaque mise en forme CSS qui provoque [un changement brusque de luminosit\xE9 ou un effet de flash](#changement-brusque-de-luminosite-ou-effet-de-flash) v\xE9rifie-t-il une de ces conditions\xA0?",
          "La fr\xE9quence de l\u2019effet est inf\xE9rieure \xE0 3 par seconde\xA0;",
          "La surface totale cumul\xE9e des effets est inf\xE9rieure ou \xE9gale \xE0 21824 pixels."
        ]
      },
      wcag: ["2.3.1 Three Flashes or Below Threshold (A)"],
      techniques: ["G15", "G19", "G176"],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "13.8",
      theme: 13,
      title: "Dans chaque page web, chaque contenu en mouvement ou clignotant est-il [contr\xF4lable](#controle-contenu-en-mouvement-ou-clignotant) par l\u2019utilisateur\xA0?",
      titlePlain: "Dans chaque page web, chaque contenu en mouvement ou clignotant est-il contr\xF4lable par l\u2019utilisateur\xA0?",
      tests: {
        "1": [
          "Dans chaque page web, chaque contenu en mouvement d\xE9clench\xE9 automatiquement, v\xE9rifie-t-il une de ces conditions\xA0?",
          "La dur\xE9e du mouvement est inf\xE9rieure ou \xE9gale \xE0 5\u202Fsecondes\xA0;",
          "L\u2019utilisateur peut arr\xEAter et relancer le mouvement\xA0;",
          "L\u2019utilisateur peut afficher et masquer le contenu en mouvement\xA0;",
          "L\u2019utilisateur peut afficher la totalit\xE9 de l\u2019information sans le mouvement."
        ],
        "2": [
          "Dans chaque page web, chaque contenu clignotant d\xE9clench\xE9 automatiquement, v\xE9rifie-t-il une de ces conditions\xA0?",
          "La dur\xE9e du clignotement est inf\xE9rieure ou \xE9gale \xE0 5\u202Fsecondes\xA0;",
          "L\u2019utilisateur peut arr\xEAter et relancer le clignotement\xA0;",
          "L\u2019utilisateur peut afficher et masquer le contenu clignotant\xA0;",
          "L\u2019utilisateur peut afficher la totalit\xE9 de l\u2019information sans le clignotement."
        ]
      },
      wcag: ["2.2.1 Timing Adjustable (A)", "2.2.2 Pause, Stop, Hide (A)"],
      techniques: ["F4", "F7", "F16", "F47", "F50", "G4", "G11", "G152", "G186", "G187", "G191", "SCR22", "SCR33", "SCR36", "SM11", "SM12"],
      automatability: "static",
      ruleIds: ["autoplay-media"]
    },
    {
      id: "13.9",
      theme: 13,
      title: "Dans chaque page web, le contenu propos\xE9 est-il consultable quelle que soit l\u2019orientation de l\u2019\xE9cran (portrait ou paysage) (hors cas particuliers)\xA0?",
      titlePlain: "Dans chaque page web, le contenu propos\xE9 est-il consultable quelle que soit l\u2019orientation de l\u2019\xE9cran (portrait ou paysage) (hors cas particuliers)\xA0?",
      tests: {
        "1": [
          "Dans chaque page web, chaque contenu v\xE9rifie-t-il ces conditions (hors cas particuliers)\xA0?",
          "La consultation est possible quel que soit le mode d\u2019orientation de l\u2019\xE9cran\xA0;",
          "Le contenu propos\xE9 reste le m\xEAme quel que soit le mode d\u2019orientation de l\u2019\xE9cran utilis\xE9 m\xEAme si sa pr\xE9sentation et le moyen d\u2019y acc\xE9der peut diff\xE9rer."
        ]
      },
      wcag: ["1.3.4 Orientation (AA)"],
      techniques: [],
      particularCases: [
        "Il existe des interfaces pour lesquelles l\u2019orientation du p\xE9riph\xE9rique est essentielle \xE0 leur utilisation.",
        "Dans ces situations, le crit\xE8re est non applicable. Il peut s\u2019agir d\u2019interfaces de jeu, de piano, de d\xE9p\xF4t de ch\xE8ques bancaires, etc.",
        "Si l\u2019interface est le seul moyen d\u2019acc\xE9der au service propos\xE9, une alternative devrait \xEAtre mise en place pour pallier cette carence."
      ],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "13.10",
      theme: 13,
      title: "Dans chaque page web, les fonctionnalit\xE9s utilisables ou disponibles au moyen d\u2019un [geste complexe](#gestes-complexes-et-gestes-simples) peuvent-elles \xEAtre \xE9galement disponibles au moyen d\u2019un [geste simple](#gestes-complexes-et-gestes-simples) (hors cas particuliers)\xA0?",
      titlePlain: "Dans chaque page web, les fonctionnalit\xE9s utilisables ou disponibles au moyen d\u2019un geste complexe peuvent-elles \xEAtre \xE9galement disponibles au moyen d\u2019un geste simple (hors cas particuliers)\xA0?",
      tests: {
        "1": [
          "Dans chaque page web, chaque fonctionnalit\xE9 utilisable ou disponible suite \xE0 un contact multipoint est-elle \xE9galement utilisable ou disponible suite \xE0 un contact en un point unique de l\u2019\xE9cran (hors cas particuliers)."
        ],
        "2": [
          "Dans chaque page web, chaque fonctionnalit\xE9 utilisable ou disponible suite \xE0 un geste bas\xE9 sur le suivi d\u2019une trajectoire sur l\u2019\xE9cran est-elle \xE9galement utilisable ou disponible suite \xE0 un contact en un point unique de l\u2019\xE9cran (hors cas particuliers)."
        ]
      },
      wcag: ["2.5.1 Pointer Gestures (A)"],
      techniques: ["G215", "G216"],
      particularCases: ["Il existe une gestion de cas particuliers dans deux types de situation\xA0:", "[object Object]"],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "13.11",
      theme: 13,
      title: "Dans chaque page web, les actions d\xE9clench\xE9es au moyen d\u2019un dispositif de pointage sur un point unique de l\u2019\xE9cran peuvent-elles faire l\u2019objet d\u2019une annulation (hors cas particuliers)\xA0?",
      titlePlain: "Dans chaque page web, les actions d\xE9clench\xE9es au moyen d\u2019un dispositif de pointage sur un point unique de l\u2019\xE9cran peuvent-elles faire l\u2019objet d\u2019une annulation (hors cas particuliers)\xA0?",
      tests: {
        "1": [
          "Dans chaque page web, les actions d\xE9clench\xE9es au moyen d\u2019un dispositif de pointage sur un point unique de l\u2019\xE9cran v\xE9rifient-elles l\u2019une de ces conditions (hors cas particuliers)\xA0?",
          "L\u2019action est d\xE9clench\xE9e au moment o\xF9 le dispositif de pointage est [rel\xE2ch\xE9 ou relev\xE9](#relache-ou-releve)\xA0;",
          "L\u2019action est d\xE9clench\xE9e au moment o\xF9 le dispositif de pointage est [press\xE9 ou pos\xE9](#presse-ou-pose) puis annul\xE9e lorsque le dispositif de pointage est [rel\xE2ch\xE9 ou relev\xE9](#relache-ou-releve)\xA0;",
          "Un m\xE9canisme est disponible pour abandonner (avant ach\xE8vement de l\u2019action) ou annuler (apr\xE8s ach\xE8vement) l\u2019ex\xE9cution de l\u2019action."
        ]
      },
      wcag: ["2.5.2 Pointer Cancellation (A)"],
      techniques: [],
      technicalNote: [
        "Deux exemples de m\xE9canisme mis en place pour annuler ou abandonner une action d\xE9clench\xE9e au moyen d\u2019un dispositif de pointage sur un point unique de l\u2019\xE9cran\xA0:",
        "[object Object]"
      ],
      particularCases: [
        "Il existe une gestion de cas particulier lorsque la fonctionnalit\xE9 n\xE9cessite que le comportement attendu soit r\xE9alis\xE9 lors d\u2019un \xE9v\xE9nement descendant, par exemple, un \xE9mulateur de clavier dont les touches doivent s\u2019activer \xE0 la pression comme sur un clavier physique. Dans ces situations, le crit\xE8re est non applicable."
      ],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "13.12",
      theme: 13,
      title: "Dans chaque page web, les fonctionnalit\xE9s qui impliquent un mouvement de l\u2019appareil ou vers l\u2019appareil peuvent-elles \xEAtre satisfaites de mani\xE8re alternative (hors cas particuliers)\xA0?",
      titlePlain: "Dans chaque page web, les fonctionnalit\xE9s qui impliquent un mouvement de l\u2019appareil ou vers l\u2019appareil peuvent-elles \xEAtre satisfaites de mani\xE8re alternative (hors cas particuliers)\xA0?",
      tests: {
        "1": [
          "Dans chaque page web, les fonctionnalit\xE9s disponibles en bougeant l\u2019appareil peuvent-elles \xEAtre accomplies avec des [composants d\u2019interface](#composant-d-interface) utilisateur (hors cas particuliers)\xA0?"
        ],
        "2": [
          "Dans chaque page web, les fonctionnalit\xE9s disponibles en faisant un geste en direction de l\u2019appareil peuvent-elles \xEAtre accomplies avec des [composants d\u2019interface](#composant-d-interface) utilisateur (hors cas particuliers)\xA0?"
        ],
        "3": [
          "L\u2019utilisateur a-t-il la possibilit\xE9 de d\xE9sactiver la d\xE9tection du mouvement pour \xE9viter un d\xE9clenchement accidentel de la fonctionnalit\xE9 (hors cas particuliers)\xA0?"
        ]
      },
      wcag: ["2.5.4 Motion Actuation (A)"],
      techniques: [],
      particularCases: ["Il existe une gestion de cas particulier lorsque\xA0:", "[object Object]"],
      automatability: "judgment",
      ruleIds: []
    }
  ]
};

// src/rgaa.ts
var data = rgaa_default;
var byId = new Map(data.criteria.map((c) => [c.id, c]));
function allCriteria() {
  return data.criteria;
}
function allThemes() {
  return data.themes;
}
function getCriterion(id) {
  return byId.get(id);
}
function hasCriterion(id) {
  return byId.has(id);
}
function listTheme(n) {
  return data.criteria.filter((c) => c.theme === n);
}

// node_modules/.pnpm/entities@8.0.0/node_modules/entities/dist/decode-codepoint.js
var decodeMap = /* @__PURE__ */ new Map([
  [0, 65533],
  // C1 Unicode control character reference replacements
  [128, 8364],
  [130, 8218],
  [131, 402],
  [132, 8222],
  [133, 8230],
  [134, 8224],
  [135, 8225],
  [136, 710],
  [137, 8240],
  [138, 352],
  [139, 8249],
  [140, 338],
  [142, 381],
  [145, 8216],
  [146, 8217],
  [147, 8220],
  [148, 8221],
  [149, 8226],
  [150, 8211],
  [151, 8212],
  [152, 732],
  [153, 8482],
  [154, 353],
  [155, 8250],
  [156, 339],
  [158, 382],
  [159, 376]
]);
function replaceCodePoint(codePoint) {
  if (codePoint >= 55296 && codePoint <= 57343 || codePoint > 1114111) {
    return 65533;
  }
  return decodeMap.get(codePoint) ?? codePoint;
}

// node_modules/.pnpm/entities@8.0.0/node_modules/entities/dist/internal/decode-shared.js
function decodeBase64(input) {
  const binary = atob(input);
  const evenLength = binary.length & ~1;
  const out = new Uint16Array(evenLength / 2);
  for (let index = 0, outIndex = 0; index < evenLength; index += 2) {
    const lo = binary.charCodeAt(index);
    const hi = binary.charCodeAt(index + 1);
    out[outIndex++] = lo | hi << 8;
  }
  return out;
}

// node_modules/.pnpm/entities@8.0.0/node_modules/entities/dist/generated/decode-data-html.js
var htmlDecodeTree = /* @__PURE__ */ decodeBase64("QR08ALkAAgH6AYsDNQR2BO0EPgXZBQEGLAbdBxMISQrvCmQLfQurDKQNLw4fD4YPpA+6D/IPAAAAAAAAAAAAAAAAKhBMEY8TmxUWF2EYLBkxGuAa3RsJHDscWR8YIC8jSCSIJcMl6ie3Ku8rEC0CLjoupS7kLgAIRU1hYmNmZ2xtbm9wcnN0dVQAWgBeAGUAaQBzAHcAfgCBAIQAhwCSAJoAoACsALMAbABpAGcAO4DGAMZAUAA7gCYAJkBjAHUAdABlADuAwQDBQHIiZXZlAAJhAAFpeW0AcgByAGMAO4DCAMJAEGRyAADgNdgE3XIAYQB2AGUAO4DAAMBA8CFoYZFj4SFjcgBhZAAAoFMqAAFncIsAjgBvAG4ABGFmAADgNdg43fAlbHlGdW5jdGlvbgCgYSBpAG4AZwA7gMUAxUAAAWNzpACoAHIAAOA12Jzc6SFnbgCgVCJpAGwAZABlADuAwwDDQG0AbAA7gMQAxEAABGFjZWZvcnN1xQDYANoA7QDxAPYA+QD8AAABY3LJAM8AayNzbGFzaAAAoBYidgHTANUAAKDnKmUAZAAAoAYjeQARZIABY3J0AOAA5QDrAGEidXNlAACgNSLuI291bGxpcwCgLCFhAJJjcgAA4DXYBd1wAGYAAOA12Dnd5SF2ZdhiYwDyAOoAbSJwZXEAAKBOIgAHSE9hY2RlZmhpbG9yc3UXARoBHwE6AVIBVQFiAWQBZgGCAakB6QHtAfIBYwB5ACdkUABZADuAqQCpQIABY3B5ACUBKAE1AfUhdGUGYWmg0iJ0KGFsRGlmZmVyZW50aWFsRAAAoEUhbCJleXMAAKAtIQACYWVpb0EBRAFKAU0B8iFvbgxhZABpAGwAO4DHAMdAcgBjAAhhbiJpbnQAAKAwIm8AdAAKYQABZG5ZAV0BaSJsbGEAuGB0I2VyRG90ALdg8gA5AWkAp2NyImNsZQAAAkRNUFRwAXQBeQF9AW8AdAAAoJkiaSJudXMAAKCWIuwhdXMAoJUiaSJtZXMAAKCXIm8AAAFjc4cBlAFrKndpc2VDb250b3VySW50ZWdyYWwAAKAyImUjQ3VybHkAAAFEUZwBpAFvJXVibGVRdW90ZQAAoB0gdSJvdGUAAKAZIAACbG5wdbABtgHNAdgBbwBuAGWgNyIAoHQqgAFnaXQAvAHBAcUB8iJ1ZW50AKBhIm4AdAAAoC8i7yV1ckludGVncmFsAKAuIgABZnLRAdMBAKACIe8iZHVjdACgECJuLnRlckNsb2Nrd2lzZUNvbnRvdXJJbnRlZ3JhbAAAoDMi7yFzcwCgLypjAHIAAOA12J7ccABDoNMiYQBwAACgTSKABURKU1phY2VmaW9zAAsCEgIVAhgCGwIsAjQCOQI9AnMCfwNvoEUh9CJyYWhkAKARKWMAeQACZGMAeQAFZGMAeQAPZIABZ3JzACECJQIoAuchZXIAoCEgcgAAoKEhaAB2AACg5CoAAWF5MAIzAvIhb24OYRRkbAB0oAciYQCUY3IAAOA12AfdAAFhZkECawIAAWNtRQJnAvIjaXRpY2FsAAJBREdUUAJUAl8CYwJjInV0ZQC0YG8AdAFZAloC2WJiJGxlQWN1dGUA3WJyImF2ZQBgYGkibGRlANxi7yFuZACgxCJmJWVyZW50aWFsRAAAoEYhcAR9AgAAAAAAAIECjgIAABoDZgAA4DXYO91EoagAhQKJAm8AdAAAoNwgcSJ1YWwAAKBQIuIhbGUAA0NETFJVVpkCqAK1Au8C/wIRA28AbgB0AG8AdQByAEkAbgB0AGUAZwByAGEA7ADEAW8AdAKvAgAAAACwAqhgbiNBcnJvdwAAoNMhAAFlb7kC0AJmAHQAgAFBUlQAwQLGAs0CciJyb3cAAKDQIekkZ2h0QXJyb3cAoNQhZQDlACsCbgBnAAABTFLWAugC5SFmdAABQVLcAuECciJyb3cAAKD4J+kkZ2h0QXJyb3cAoPon6SRnaHRBcnJvdwCg+SdpImdodAAAAUFU9gL7AnIicm93AACg0iFlAGUAAKCoInAAQQIGAwAAAAALA3Iicm93AACg0SFvJHduQXJyb3cAAKDVIWUlcnRpY2FsQmFyAACgJSJuAAADQUJMUlRhJAM2AzoDWgNxA3oDciJyb3cAAKGTIUJVLAMwA2EAcgAAoBMpcCNBcnJvdwAAoPUhciJldmUAEWPlIWZ00gJDAwAASwMAAFIDaSVnaHRWZWN0b3IAAKBQKWUkZVZlY3RvcgAAoF4p5SJjdG9yQqC9IWEAcgAAoFYpaSJnaHQA1AFiAwAAaQNlJGVWZWN0b3IAAKBfKeUiY3RvckKgwSFhAHIAAKBXKWUAZQBBoKQiciJyb3cAAKCnIXIAcgBvAPcAtAIAAWN0gwOHA3IAAOA12J/c8iFvaxBhAAhOVGFjZGZnbG1vcHFzdHV4owOlA6kDsAO/A8IDxgPNA9ID8gP9AwEEFAQeBCAEJQRHAEphSAA7gNAA0EBjAHUAdABlADuAyQDJQIABYWl5ALYDuQO+A/Ihb24aYXIAYwA7gMoAykAtZG8AdAAWYXIAAOA12AjdcgBhAHYAZQA7gMgAyEDlIm1lbnQAoAgiAAFhcNYD2QNjAHIAEmF0AHkAUwLhAwAAAADpA20lYWxsU3F1YXJlAACg+yVlJ3J5U21hbGxTcXVhcmUAAKCrJQABZ3D2A/kDbwBuABhhZgAA4DXYPN3zImlsb26VY3UAAAFhaQYEDgRsAFSgdSppImxkZQAAoEIi7CNpYnJpdW0AoMwhAAFjaRgEGwRyAACgMCFtAACgcyphAJdjbQBsADuAywDLQAABaXApBC0E8yF0cwCgAyLvJG5lbnRpYWxFAKBHIYACY2Zpb3MAPQQ/BEMEXQRyBHkAJGRyAADgNdgJ3WwibGVkAFMCTAQAAAAAVARtJWFsbFNxdWFyZQAAoPwlZSdyeVNtYWxsU3F1YXJlAACgqiVwA2UEAABpBAAAAABtBGYAAOA12D3dwSFsbACgACLyI2llcnRyZgCgMSFjAPIAcQQABkpUYWJjZGZnb3JzdIgEiwSOBJMElwSkBKcEqwStBLIE5QTqBGMAeQADZDuAPgA+QO0hbWFkoJMD3GNyImV2ZQAeYYABZWl5AJ0EoASjBOQhaWwiYXIAYwAcYRNkbwB0ACBhcgAA4DXYCt0AoNkicABmAADgNdg+3eUiYXRlcgADRUZHTFNUvwTIBM8E1QTZBOAEcSJ1YWwATKBlIuUhc3MAoNsidSRsbEVxdWFsAACgZyJyI2VhdGVyAACgoirlIXNzAKB3IuwkYW50RXF1YWwAoH4qaSJsZGUAAKBzImMAcgAA4DXYotwAoGsiAARBYWNmaW9zdfkE/QQFBQgFCwUTBSIFKwVSIkRjeQAqZAABY3QBBQQFZQBrAMdiXmDpIXJjJGFyAACgDCFsJWJlcnRTcGFjZQAAoAsh8AEYBQAAGwVmAACgDSHpJXpvbnRhbExpbmUAoAAlAAFjdCYFKAXyABIF8iFvayZhbQBwAEQBMQU5BW8AdwBuAEgAdQBtAPAAAAFxInVhbAAAoE8iAAdFSk9hY2RmZ21ub3N0dVMFVgVZBVwFYwVtBXAFcwV6BZAFtgXFBckFzQVjAHkAFWTsIWlnMmFjAHkAAWRjAHUAdABlADuAzQDNQAABaXlnBWwFcgBjADuAzgDOQBhkbwB0ADBhcgAAoBEhcgBhAHYAZQA7gMwAzEAAoREhYXB/BYsFAAFjZ4MFhQVyACphaSNuYXJ5SQAAoEghbABpAGUA8wD6AvQBlQUAAKUFZaAsIgABZ3KaBZ4F8iFhbACgKyLzI2VjdGlvbgCgwiJpI3NpYmxlAAABQ1SsBbEFbyJtbWEAAKBjIGkibWVzAACgYiCAAWdwdAC8Bb8FwwVvAG4ALmFmAADgNdhA3WEAmWNjAHIAAKAQIWkibGRlAChh6wHSBQAA1QVjAHkABmRsADuAzwDPQIACY2Zvc3UA4QXpBe0F8gX9BQABaXnlBegFcgBjADRhGWRyAADgNdgN3XAAZgAA4DXYQd3jAfcFAAD7BXIAAOA12KXc8iFjeQhk6yFjeQRkgANISmFjZm9zAAwGDwYSBhUGHQYhBiYGYwB5ACVkYwB5AAxk8CFwYZpjAAFleRkGHAbkIWlsNmEaZHIAAOA12A7dcABmAADgNdhC3WMAcgAA4DXYptyABUpUYWNlZmxtb3N0AD0GQAZDBl4GawZkB2gHcAd0B80H2gdjAHkACWQ7gDwAPECAAmNtbnByAEwGTwZSBlUGWwb1IXRlOWHiIWRhm2NnAACg6ifsI2FjZXRyZgCgEiFyAACgniGAAWFleQBkBmcGagbyIW9uPWHkIWlsO2EbZAABZnNvBjQHdAAABUFDREZSVFVWYXKABp4GpAbGBssG3AYDByEHwQIqBwABbnKEBowGZyVsZUJyYWNrZXQAAKDoJ/Ihb3cAoZAhQlKTBpcGYQByAACg5CHpJGdodEFycm93AKDGIWUjaWxpbmcAAKAII28A9QGqBgAAsgZiJWxlQnJhY2tldAAAoOYnbgDUAbcGAAC+BmUkZVZlY3RvcgAAoGEp5SJjdG9yQqDDIWEAcgAAoFkpbCJvb3IAAKAKI2kiZ2h0AAABQVbSBtcGciJyb3cAAKCUIeUiY3RvcgCgTikAAWVy4AbwBmUAAKGjIkFW5gbrBnIicm93AACgpCHlImN0b3IAoFopaSNhbmdsZQBCorIi+wYAAAAA/wZhAHIAAKDPKXEidWFsAACgtCJwAIABRFRWAAoHEQcYB+8kd25WZWN0b3IAoFEpZSRlVmVjdG9yAACgYCnlImN0b3JCoL8hYQByAACgWCnlImN0b3JCoLwhYQByAACgUilpAGcAaAB0AGEAcgByAG8A9wDMAnMAAANFRkdMU1Q/B0cHTgdUB1gHXwfxJXVhbEdyZWF0ZXIAoNoidSRsbEVxdWFsAACgZiJyI2VhdGVyAACgdiLlIXNzAKChKuwkYW50RXF1YWwAoH0qaSJsZGUAAKByInIAAOA12A/dZaDYIuYjdGFycm93AKDaIWkiZG90AD9hgAFucHcAege1B7kHZwAAAkxSbHKCB5QHmwerB+UhZnQAAUFSiAeNB3Iicm93AACg9SfpJGdodEFycm93AKD3J+kkZ2h0QXJyb3cAoPYn5SFmdAABYXLcAqEHaQBnAGgAdABhAHIAcgBvAPcA5wJpAGcAaAB0AGEAcgByAG8A9wDuAmYAAOA12EPdZQByAAABTFK/B8YHZSRmdEFycm93AACgmSHpJGdodEFycm93AKCYIYABY2h0ANMH1QfXB/IAWgYAoLAh8iFva0FhAKBqIgAEYWNlZmlvc3XpB+wH7gf/BwMICQgOCBEIcAAAoAUpeQAcZAABZGzyB/kHaSR1bVNwYWNlAACgXyBsI2ludHJmAACgMyFyAADgNdgQ3e4jdXNQbHVzAKATInAAZgAA4DXYRN1jAPIA/gecY4AESmFjZWZvc3R1ACEIJAgoCDUIgQiFCDsKQApHCmMAeQAKZGMidXRlAENhgAFhZXkALggxCDQI8iFvbkdh5CFpbEVhHWSAAWdzdwA7CGEIfQjhInRpdmWAAU1UVgBECEwIWQhlJWRpdW1TcGFjZQAAoAsgaABpAAABY25SCFMIawBTAHAAYQBjAOUASwhlAHIAeQBUAGgAaQDuAFQI9CFlZAABR0xnCHUIcgBlAGEAdABlAHIARwByAGUAYQB0AGUA8gDrBGUAcwBzAEwAZQBzAPMA2wdMImluZQAKYHIAAOA12BHdAAJCbnB0jAiRCJkInAhyImVhawAAoGAgwiZyZWFraW5nU3BhY2WgYGYAAKAVIUOq7CqzCMIIzQgAAOcIGwkAAAAAAAAtCQAAbwkAAIcJAACdCcAJGQoAADQKAAFvdbYIvAjuI2dydWVudACgYiJwIkNhcAAAoG0ibyh1YmxlVmVydGljYWxCYXIAAKAmIoABbHF4ANII1wjhCOUibWVudACgCSL1IWFsVKBgImkibGRlAADgQiI4A2kic3RzAACgBCJyI2VhdGVyAACjbyJFRkdMU1T1CPoIAgkJCQ0JFQlxInVhbAAAoHEidSRsbEVxdWFsAADgZyI4A3IjZWF0ZXIAAOBrIjgD5SFzcwCgeSLsJGFudEVxdWFsAOB+KjgDaSJsZGUAAKB1IvUhbXBEASAJJwnvI3duSHVtcADgTiI4A3EidWFsAADgTyI4A2UAAAFmczEJRgn0JFRyaWFuZ2xlQqLqIj0JAAAAAEIJYQByAADgzyk4A3EidWFsAACg7CJzAICibiJFR0xTVABRCVYJXAlhCWkJcSJ1YWwAAKBwInIjZWF0ZXIAAKB4IuUhc3MA4GoiOAPsJGFudEVxdWFsAOB9KjgDaSJsZGUAAKB0IuUic3RlZAABR0x1CX8J8iZlYXRlckdyZWF0ZXIA4KIqOAPlI3NzTGVzcwDgoSo4A/IjZWNlZGVzAKGAIkVTjwmVCXEidWFsAADgryo4A+wkYW50RXF1YWwAoOAiAAFlaaAJqQl2JmVyc2VFbGVtZW50AACgDCLnJWh0VHJpYW5nbGVCousitgkAAAAAuwlhAHIAAODQKTgDcSJ1YWwAAKDtIgABcXXDCeAJdSNhcmVTdQAAAWJwywnVCfMhZXRF4I8iOANxInVhbAAAoOIi5SJyc2V0ReCQIjgDcSJ1YWwAAKDjIoABYmNwAOYJ8AkNCvMhZXRF4IIi0iBxInVhbAAAoIgi4yJlZWRzgKGBIkVTVAD6CQAKBwpxInVhbAAA4LAqOAPsJGFudEVxdWFsAKDhImkibGRlAADgfyI4A+UicnNldEXggyLSIHEidWFsAACgiSJpImxkZQCAoUEiRUZUACIKJwouCnEidWFsAACgRCJ1JGxsRXF1YWwAAKBHImkibGRlAACgSSJlJXJ0aWNhbEJhcgAAoCQiYwByAADgNdip3GkAbABkAGUAO4DRANFAnWMAB0VhY2RmZ21vcHJzdHV2XgphCmgKcgp2CnoKgQqRCpYKqwqtCrsKyArNCuwhaWdSYWMAdQB0AGUAO4DTANNAAAFpeWwKcQpyAGMAO4DUANRAHmRiImxhYwBQYXIAAOA12BLdcgBhAHYAZQA7gNIA0kCAAWFlaQCHCooKjQpjAHIATGFnAGEAqWNjInJvbgCfY3AAZgAA4DXYRt3lI25DdXJseQABRFGeCqYKbyV1YmxlUXVvdGUAAKAcIHUib3RlAACgGCAAoFQqAAFjbLEKtQpyAADgNdiq3GEAcwBoADuA2ADYQGkAbAHACsUKZABlADuA1QDVQGUAcwAAoDcqbQBsADuA1gDWQGUAcgAAAUJQ0wrmCgABYXLXCtoKcgAAoD4gYQBjAAABZWvgCuIKAKDeI2UAdAAAoLQjYSVyZW50aGVzaXMAAKDcI4AEYWNmaGlsb3JzAP0KAwsFCwkLCwsMCxELIwtaC3IjdGlhbEQAAKACInkAH2RyAADgNdgT3WkApmOgY/Ujc01pbnVzsWAAAWlwFQsgC24AYwBhAHIAZQBwAGwAYQBuAOUACgVmAACgGSGAobsqZWlvACoLRQtJC+MiZWRlc4CheiJFU1QANAs5C0ALcSJ1YWwAAKCvKuwkYW50RXF1YWwAoHwiaSJsZGUAAKB+Im0AZQAAoDMgAAFkcE0LUQv1IWN0AKAPIm8jcnRpb24AYaA3ImwAAKAdIgABY2leC2ILcgAA4DXYq9yoYwACVWZvc2oLbwtzC3cLTwBUADuAIgAiQHIAAOA12BTdcABmAACgGiFjAHIAAOA12KzcAAZCRWFjZWZoaW9yc3WPC5MLlwupC7YL2AvbC90LhQyTDJoMowzhIXJyAKAQKUcAO4CuAK5AgAFjbnIAnQugC6ML9SF0ZVRhZwAAoOsncgB0oKAhbAAAoBYpgAFhZXkArwuyC7UL8iFvblhh5CFpbFZhIGR2oBwhZSJyc2UAAAFFVb8LzwsAAWxxwwvIC+UibWVudACgCyL1JGlsaWJyaXVtAKDLIXAmRXF1aWxpYnJpdW0AAKBvKXIAAKAcIW8AoWPnIWh0AARBQ0RGVFVWYewLCgwQDDIMNwxeDHwM9gIAAW5y8Av4C2clbGVCcmFja2V0AACg6SfyIW93AKGSIUJM/wsDDGEAcgAAoOUhZSRmdEFycm93AACgxCFlI2lsaW5nAACgCSNvAPUBFgwAAB4MYiVsZUJyYWNrZXQAAKDnJ24A1AEjDAAAKgxlJGVWZWN0b3IAAKBdKeUiY3RvckKgwiFhAHIAAKBVKWwib29yAACgCyMAAWVyOwxLDGUAAKGiIkFWQQxGDHIicm93AACgpiHlImN0b3IAoFspaSNhbmdsZQBCorMiVgwAAAAAWgxhAHIAAKDQKXEidWFsAACgtSJwAIABRFRWAGUMbAxzDO8kd25WZWN0b3IAoE8pZSRlVmVjdG9yAACgXCnlImN0b3JCoL4hYQByAACgVCnlImN0b3JCoMAhYQByAACgUykAAXB1iQyMDGYAAKAdIe4kZEltcGxpZXMAoHAp6SRnaHRhcnJvdwCg2yEAAWNongyhDHIAAKAbIQCgsSHsJGVEZWxheWVkAKD0KYAGSE9hY2ZoaW1vcXN0dQC/DMgMzAzQDOIM5gwKDQ0NFA0ZDU8NVA1YDQABQ2PDDMYMyCFjeSlkeQAoZEYiVGN5ACxkYyJ1dGUAWmEAorwqYWVpedgM2wzeDOEM8iFvbmBh5CFpbF5hcgBjAFxhIWRyAADgNdgW3e8hcnQAAkRMUlXvDPYM/QwEDW8kd25BcnJvdwAAoJMhZSRmdEFycm93AACgkCHpJGdodEFycm93AKCSIXAjQXJyb3cAAKCRIechbWGjY+EkbGxDaXJjbGUAoBgicABmAADgNdhK3XICHw0AAAAAIg10AACgGiLhIXJlgKGhJUlTVQAqDTINSg3uJXRlcnNlY3Rpb24AoJMidQAAAWJwNw1ADfMhZXRFoI8icSJ1YWwAAKCRIuUicnNldEWgkCJxInVhbAAAoJIibiJpb24AAKCUImMAcgAA4DXYrtxhAHIAAKDGIgACYmNtcF8Nag2ODZANc6DQImUAdABFoNAicSJ1YWwAAKCGIgABY2huDYkNZSJlZHMAgKF7IkVTVAB4DX0NhA1xInVhbAAAoLAq7CRhbnRFcXVhbACgfSJpImxkZQAAoH8iVABoAGEA9ADHCwCgESIAodEiZXOVDZ8NciJzZXQARaCDInEidWFsAACghyJlAHQAAKDRIoAFSFJTYWNmaGlvcnMAtQ27Db8NyA3ODdsN3w3+DRgOHQ4jDk8AUgBOADuA3gDeQMEhREUAoCIhAAFIY8MNxg1jAHkAC2R5ACZkAAFidcwNzQ0JYKRjgAFhZXkA1A3XDdoN8iFvbmRh5CFpbGJhImRyAADgNdgX3QABZWnjDe4N8gHoDQAA7Q3lImZvcmUAoDQiYQCYYwABY27yDfkNayNTcGFjZQAA4F8gCiDTInBhY2UAoAkg7CFkZYChPCJFRlQABw4MDhMOcSJ1YWwAAKBDInUkbGxFcXVhbAAAoEUiaSJsZGUAAKBIInAAZgAA4DXYS93pI3BsZURvdACg2yAAAWN0Jw4rDnIAAOA12K/c8iFva2Zh4QpFDlYOYA5qDgAAbg5yDgAAAAAAAAAAAAB5DnwOqA6zDgAADg8RDxYPGg8AAWNySA5ODnUAdABlADuA2gDaQHIAb6CfIeMhaXIAoEkpcgDjAVsOAABdDnkADmR2AGUAbGEAAWl5Yw5oDnIAYwA7gNsA20AjZGIibGFjAHBhcgAA4DXYGN1yAGEAdgBlADuA2QDZQOEhY3JqYQABZGl/Dp8OZQByAAABQlCFDpcOAAFhcokOiw5yAF9gYQBjAAABZWuRDpMOAKDfI2UAdAAAoLUjYSVyZW50aGVzaXMAAKDdI28AbgBQoMMi7CF1cwCgjiIAAWdwqw6uDm8AbgByYWYAAOA12EzdAARBREVUYWRwc78O0g7ZDuEOBQPqDvMOBw9yInJvdwDCoZEhyA4AAMwOYQByAACgEilvJHduQXJyb3cAAKDFIW8kd25BcnJvdwAAoJUhcSV1aWxpYnJpdW0AAKBuKWUAZQBBoKUiciJyb3cAAKClIW8AdwBuAGEAcgByAG8A9wAQA2UAcgAAAUxS+Q4AD2UkZnRBcnJvdwAAoJYh6SRnaHRBcnJvdwCglyFpAGyg0gNvAG4ApWPpIW5nbmFjAHIAAOA12LDcaSJsZGUAaGFtAGwAO4DcANxAgAREYmNkZWZvc3YALQ8xDzUPNw89D3IPdg97D4AP4SFzaACgqyJhAHIAAKDrKnkAEmThIXNobKCpIgCg5ioAAWVyQQ9DDwCgwSKAAWJ0eQBJD00Paw9hAHIAAKAWIGmgFiDjIWFsAAJCTFNUWA9cD18PZg9hAHIAAKAjIukhbmV8YGUkcGFyYXRvcgAAoFgnaSJsZGUAAKBAItQkaGluU3BhY2UAoAogcgAA4DXYGd1wAGYAAOA12E3dYwByAADgNdix3GQiYXNoAACgqiKAAmNlZm9zAI4PkQ+VD5kPng/pIXJjdGHkIWdlAKDAInIAAOA12BrdcABmAADgNdhO3WMAcgAA4DXYstwAAmZpb3OqD64Prw+0D3IAAOA12BvdnmNwAGYAAOA12E/dYwByAADgNdiz3IAEQUlVYWNmb3N1AMgPyw/OD9EP2A/gD+QP6Q/uD2MAeQAvZGMAeQAHZGMAeQAuZGMAdQB0AGUAO4DdAN1AAAFpedwP3w9yAGMAdmErZHIAAOA12BzdcABmAADgNdhQ3WMAcgAA4DXYtNxtAGwAeGEABEhhY2RlZm9z/g8BEAUQDRAQEB0QIBAkEGMAeQAWZGMidXRlAHlhAAFheQkQDBDyIW9ufWEXZG8AdAB7YfIBFRAAABwQbwBXAGkAZAB0AOgAVAhhAJZjcgAAoCghcABmAACgJCFjAHIAAOA12LXc4QtCEEkQTRAAAGcQbRByEAAAAAAAAAAAeRCKEJcQ8hD9EAAAGxEhETIROREAAD4RYwB1AHQAZQA7gOEA4UByImV2ZQADYYCiPiJFZGl1eQBWEFkQWxBgEGUQAOA+IjMDAKA/InIAYwA7gOIA4kB0AGUAO4C0ALRAMGRsAGkAZwA7gOYA5kByoGEgAOA12B7dcgBhAHYAZQA7gOAA4EAAAWVwfBCGEAABZnCAEIQQ8yF5bQCgNSHoAIMQaABhALFjAAFhcI0QWwAAAWNskRCTEHIAAWFnAACgPypkApwQAAAAALEQAKInImFkc3ajEKcQqRCuEG4AZAAAoFUqAKBcKmwib3BlAACgWCoAoFoqAKMgImVsbXJzersQvRDAEN0Q5RDtEACgpCllAACgICJzAGQAYaAhImEEzhDQENIQ1BDWENgQ2hDcEACgqCkAoKkpAKCqKQCgqykAoKwpAKCtKQCgrikAoK8pdAB2oB8iYgBkoL4iAKCdKQABcHTpEOwQaAAAoCIixWDhIXJyAKB8IwABZ3D1EPgQbwBuAAVhZgAA4DXYUt0Ao0giRWFlaW9wBxEJEQ0RDxESERQRAKBwKuMhaXIAoG8qAKBKImQAAKBLInMAJ2DyIW94ZaBIIvEADhFpAG4AZwA7gOUA5UCAAWN0eQAmESoRKxFyAADgNdi23CpgbQBwAGWgSCLxAPgBaQBsAGQAZQA7gOMA40BtAGwAO4DkAORAAAFjaUERRxFvAG4AaQBuAPQA6AFuAHQAAKARKgAITmFiY2RlZmlrbG5vcHJzdWQRaBGXEZ8RpxGrEdIR1hErEjASexKKEn0RThNbE3oTbwB0AACg7SoAAWNybBGJEWsAAAJjZXBzdBF4EX0RghHvIW5nAKBMInAjc2lsb24A9mNyImltZQAAoDUgaQBtAGWgPSJxAACgzSJ2AY0RkRFlAGUAAKC9ImUAZABnoAUjZQAAoAUjcgBrAHSgtSPiIXJrAKC2IwABb3mjEaYRbgDnAHcRMWTxIXVvAKAeIIACY21wcnQAtBG5Eb4RwRHFEeEhdXPloDUi5ABwInR5dgAAoLApcwDpAH0RbgBvAPUA6gCAAWFodwDLEcwRzhGyYwCgNiHlIWVuAKBsInIAAOA12B/dZwCAA2Nvc3R1dncA4xHyEQUSEhIhEiYSKRKAAWFpdQDpEesR7xHwAKMFcgBjAACg7yVwAACgwyKAAWRwdAD4EfwRABJvAHQAAKAAKuwhdXMAoAEqaSJtZXMAAKACKnECCxIAAAAADxLjIXVwAKAGKmEAcgAAoAUm8iNpYW5nbGUAAWR1GhIeEu8hd24AoL0lcAAAoLMlcCJsdXMAAKAEKmUA5QBCD+UAkg9hInJvdwAAoA0pgAFha28ANhJoEncSAAFjbjoSZRJrAIABbHN0AEESRxJNEm8jemVuZ2UAAKDrKXEAdQBhAHIA5QBcBPIjaWFuZ2xlgKG0JWRscgBYElwSYBLvIXduAKC+JeUhZnQAoMIlaSJnaHQAAKC4JWsAAKAjJLEBbRIAAHUSsgFxEgAAcxIAoJIlAKCRJTQAAKCTJWMAawAAoIglAAFlb38ShxJx4D0A5SD1IWl2AOBhIuUgdAAAoBAjAAJwdHd4kRKVEpsSnxJmAADgNdhT3XSgpSJvAG0AAKClIvQhaWUAoMgiAAZESFVWYmRobXB0dXayEsES0RLgEvcS+xIKExoTHxMjEygTNxMAAkxSbHK5ErsSvRK/EgCgVyUAoFQlAKBWJQCgUyUAolAlRFVkdckSyxLNEs8SAKBmJQCgaSUAoGQlAKBnJQACTFJsctgS2hLcEt4SAKBdJQCgWiUAoFwlAKBZJQCjUSVITFJobHLrEu0S7xLxEvMS9RIAoGwlAKBjJQCgYCUAoGslAKBiJQCgXyVvAHgAAKDJKQACTFJscgITBBMGEwgTAKBVJQCgUiUAoBAlAKAMJQCiACVEVWR1EhMUExYTGBMAoGUlAKBoJQCgLCUAoDQlaSJudXMAAKCfIuwhdXMAoJ4iaSJtZXMAAKCgIgACTFJsci8TMRMzEzUTAKBbJQCgWCUAoBglAKAUJQCjAiVITFJobHJCE0QTRhNIE0oTTBMAoGolAKBhJQCgXiUAoDwlAKAkJQCgHCUAAWV2UhNVE3YA5QD5AGIAYQByADuApgCmQAACY2Vpb2ITZhNqE24TcgAA4DXYt9xtAGkAAKBPIG0A5aA9IogRbAAAoVwAYmh0E3YTAKDFKfMhdWIAoMgnbAF+E4QTbABloCIgdAAAoCIgcAAAoU4iRWWJE4sTAKCuKvGgTyI8BeEMqRMAAN8TABQDFB8UAAAjFDQUAAAAAIUUAAAAAI0UAAAAANcU4xT3FPsUAACIFQAAlhWAAWNwcgCuE7ET1RP1IXRlB2GAoikiYWJjZHMAuxO/E8QTzhPSE24AZAAAoEQqciJjdXAAAKBJKgABYXXIE8sTcAAAoEsqcAAAoEcqbwB0AACgQCoA4CkiAP4AAWVv2RPcE3QAAKBBIO4ABAUAAmFlaXXlE+8T9RP4E/AB6hMAAO0TcwAAoE0qbwBuAA1hZABpAGwAO4DnAOdAcgBjAAlhcABzAHOgTCptAACgUCpvAHQAC2GAAWRtbgAIFA0UEhRpAGwAO4C4ALhAcCJ0eXYAAKCyKXQAAIGiADtlGBQZFKJAcgBkAG8A9ABiAXIAAOA12CDdgAFjZWkAKBQqFDIUeQBHZGMAawBtoBMn4SFyawCgEyfHY3IAAKPLJUVjZWZtcz8UQRRHFHcUfBSAFACgwykAocYCZWxGFEkUcQAAoFciZQBhAlAUAAAAAGAUciJyb3cAAAFsclYUWhTlIWZ0AKC6IWkiZ2h0AACguyGAAlJTYWNkAGgUaRRrFG8UcxSuYACgyCRzAHQAAKCbIukhcmMAoJoi4SFzaACgnSJuImludAAAoBAqaQBkAACg7yrjIWlyAKDCKfUhYnN1oGMmaQB0AACgYybsApMUmhS2FAAAwxRvAG4AZaA6APGgVCKrAG0CnxQAAAAAoxRhAHSgLABAYAChASJmbKcUqRTuABMNZQAAAW14rhSyFOUhbnQAoAEiZQDzANIB5wG6FAAAwBRkoEUibwB0AACgbSpuAPQAzAGAAWZyeQDIFMsUzhQA4DXYVN1vAOQA1wEAgakAO3MeAdMUcgAAoBchAAFhb9oU3hRyAHIAAKC1IXMAcwAAoBcnAAFjdeYU6hRyAADgNdi43AABYnDuFPIUZaDPKgCg0SploNAqAKDSKuQhb3QAoO8igANkZWxwcnZ3AAYVEBUbFSEVRBVlFYQV4SFycgABbHIMFQ4VAKA4KQCgNSlwAhYVAAAAABkVcgAAoN4iYwAAoN8i4SFycnCgtiEAoD0pgKIqImJjZG9zACsVMBU6FT4VQRVyImNhcAAAoEgqAAFhdTQVNxVwAACgRipwAACgSipvAHQAAKCNInIAAKBFKgDgKiIA/gACYWxydksVURVuFXMVcgByAG2gtyEAoDwpeQCAAWV2dwBYFWUVaRVxAHACXxUAAAAAYxVyAGUA4wAXFXUA4wAZFWUAZQAAoM4iZSJkZ2UAAKDPImUAbgA7gKQApEBlI2Fycm93AAABbHJ7FX8V5SFmdACgtiFpImdodAAAoLchZQDkAG0VAAFjaYsVkRVvAG4AaQBuAPQAkwFuAHQAAKAxImwiY3R5AACgLSOACUFIYWJjZGVmaGlqbG9yc3R1d3oAuBW7Fb8V1RXgFegV+RUKFhUWHxZUFlcWZRbFFtsW7xb7FgUXChdyAPIAtAJhAHIAAKBlKQACZ2xyc8YVyhXOFdAV5yFlcgCgICDlIXRoAKA4IfIA9QxoAHagECAAoKMiawHZFd4VYSJyb3cAAKAPKWEA4wBfAgABYXnkFecV8iFvbg9hNGQAoUYhYW/tFfQVAAFnciEC8RVyAACgyiF0InNlcQAAoHcqgAFnbG0A/xUCFgUWO4CwALBAdABhALRjcCJ0eXYAAKCxKQABaXIOFhIW8yFodACgfykA4DXYId1hAHIAAAFschsWHRYAoMMhAKDCIYACYWVnc3YAKBauAjYWOhY+Fm0AAKHEIm9zLhY0Fm4AZABzoMQi9SFpdACgZiZhIm1tYQDdY2kAbgAAoPIiAKH3AGlvQxZRFmQAZQAAgfcAO29KFksW90BuI3RpbWVzAACgxyJuAPgAUBZjAHkAUmRjAG8CXhYAAAAAYhZyAG4AAKAeI28AcAAAoA0jgAJscHR1dwBuFnEWdRaSFp4W7CFhciRgZgAA4DXYVd0AotkCZW1wc30WhBaJFo0WcQBkoFAibwB0AACgUSJpIm51cwAAoDgi7CF1cwCgFCLxInVhcmUAoKEiYgBsAGUAYgBhAHIAdwBlAGQAZwDlANcAbgCAAWFkaAClFqoWtBZyAHIAbwD3APUMbwB3AG4AYQByAHIAbwB3APMA8xVhI3Jwb29uAAABbHK8FsAWZQBmAPQAHBZpAGcAaAD0AB4WYgHJFs8WawBhAHIAbwD3AJILbwLUFgAAAADYFnIAbgAAoB8jbwBwAACgDCOAAWNvdADhFukW7BYAAXJ55RboFgDgNdi53FVkbAAAoPYp8iFvaxFhAAFkcvMW9xZvAHQAAKDxImkA5qC/JVsSAAFhaP8WAhdyAPIANQNhAPIA1wvhIm5nbGUAoKYpAAFjaQ4XEBd5AF9k5yJyYXJyAKD/JwAJRGFjZGVmZ2xtbm9wcXJzdHV4MRc4F0YXWxcyBF4XaRd5F40XrBe0F78X2RcVGCEYLRg1GEAYAAFEbzUXgRZvAPQA+BUAAWNzPBdCF3UAdABlADuA6QDpQPQhZXIAoG4qAAJhaW95TRdQF1YXWhfyIW9uG2FyAGOgViI7gOoA6kDsIW9uAKBVIk1kbwB0ABdhAAFEcmIXZhdvAHQAAKBSIgDgNdgi3XKhmipuF3QXYQB2AGUAO4DoAOhAZKCWKm8AdAAAoJgqgKGZKmlscwCAF4UXhxfuInRlcnMAoOcjAKATIWSglSpvAHQAAKCXKoABYXBzAJMXlheiF2MAcgATYXQAeQBzogUinxcAAAAAoRdlAHQAAKAFInAAMaADIDMBqRerFwCgBCAAoAUgAAFnc7AXsRdLYXAAAKACIAABZ3C4F7sXbwBuABlhZgAA4DXYVt2AAWFscwDFF8sXzxdyAHOg1SJsAACg4yl1AHMAAKBxKmkAAKG1A2x21RfYF28AbgC1Y/VjAAJjc3V24BfoF/0XEBgAAWlv5BdWF3IAYwAAoFYiaQLuFwAAAADwF+0ADQThIW50AAFnbPUX+Rd0AHIAAKCWKuUhc3MAoJUqgAFhZWkAAxgGGAoYbABzAD1gcwB0AACgXyJ2AESgYSJEAACgeCrwImFyc2wAoOUpAAFEYRkYHRhvAHQAAKBTInIAcgAAoHEpgAFjZGkAJxgqGO0XcgAAoC8hbwD0AIwCAAFhaDEYMhi3YzuA8ADwQAABbXI5GD0YbAA7gOsA60BvAACgrCCAAWNpcABGGEgYSxhsACFgcwD0ACwEAAFlb08YVxhjAHQAYQB0AGkAbwDuABoEbgBlAG4AdABpAGEAbADlADME4Ql1GAAAgRgAAIMYiBgAAAAAoRilGAAAqhgAALsYvhjRGAAA1xgnGWwAbABpAG4AZwBkAG8AdABzAGUA8QBlF3kARGRtImFsZQAAoEAmgAFpbHIAjRiRGJ0Y7CFpZwCgA/tpApcYAAAAAJoYZwAAoAD7aQBnAACgBPsA4DXYI93sIWlnAKAB++whaWcA4GYAagCAAWFsdACvGLIYthh0AACgbSZpAGcAAKAC+24AcwAAoLElbwBmAJJh8AHCGAAAxhhmAADgNdhX3QABYWvJGMwYbADsAGsEdqDUIgCg2SphI3J0aW50AACgDSoAAWFv2hgiGQABY3PeGB8ZsQPnGP0YBRkSGRUZAAAdGbID7xjyGPQY9xj5GAAA+xg7gL0AvUAAoFMhO4C8ALxAAKBVIQCgWSEAoFshswEBGQAAAxkAoFQhAKBWIbQCCxkOGQAAAAAQGTuAvgC+QACgVyEAoFwhNQAAoFghtgEZGQAAGxkAoFohAKBdITgAAKBeIWwAAKBEIHcAbgAAoCIjYwByAADgNdi73IAIRWFiY2RlZmdpamxub3JzdHYARhlKGVoZXhlmGWkZkhmWGZkZnRmgGa0ZxhnLGc8Z4BkjGmygZyIAoIwqgAFjbXAAUBlTGVgZ9SF0ZfVhbQBhAOSgswM6FgCghipyImV2ZQAfYQABaXliGWUZcgBjAB1hM2RvAHQAIWGAoWUibHFzAMYEcBl6GfGhZSLOBAAAdhlsAGEAbgD0AN8EgKF+KmNkbACBGYQZjBljAACgqSpvAHQAb6CAKmyggioAoIQqZeDbIgD+cwAAoJQqcgAA4DXYJN3noGsirATtIWVsAKA3IWMAeQBTZIChdyJFYWoApxmpGasZAKCSKgCgpSoAoKQqAAJFYWVztBm2Gb0ZwhkAoGkicABwoIoq8iFveACgiipxoIgq8aCIKrUZaQBtAACg5yJwAGYAAOA12FjdYQB2AOUAYwIAAWNp0xnWGXIAAKAKIW0AAKFzImVs3BneGQCgjioAoJAqAIM+ADtjZGxxco0E6xn0GfgZ/BkBGgABY2nvGfEZAKCnKnIAAKB6Km8AdAAAoNci0CFhcgCglSl1ImVzdAAAoHwqgAJhZGVscwAKGvQZFhrVBCAa8AEPGgAAFBpwAHIAbwD4AFkZcgAAoHgpcQAAAWxxxAQbGmwAZQBzAPMASRlpAO0A5AQAAWVuJxouGnIjdG5lcXEAAOBpIgD+xQAsGgAFQWFiY2Vma29zeUAaQxpmGmoabRqDGocalhrCGtMacgDyAMwCAAJpbG1yShpOGlAaVBpyAHMA8ABxD2YAvWBpAGwA9AASBQABZHJYGlsaYwB5AEpkAKGUIWN3YBpkGmkAcgAAoEgpAKCtIWEAcgAAoA8h6SFyYyVhgAFhbHIAcxp7Gn8a8iF0c3WgZSZpAHQAAKBlJuwhaXAAoCYg4yFvbgCguSJyAADgNdgl3XMAAAFld4wakRphInJvdwAAoCUpYSJyb3cAAKAmKYACYW1vcHIAnxqjGqcauhq+GnIAcgAAoP8h9CFodACgOyJrAAABbHKsGrMaZSRmdGFycm93AACgqSHpJGdodGFycm93AKCqIWYAAOA12Fnd4iFhcgCgFSCAAWNsdADIGswa0BpyAADgNdi93GEAcwDoAGka8iFvaydhAAFicNca2xr1IWxsAKBDIOghZW4AoBAg4Qr2GgAA/RoAAAgbExsaGwAAIRs7GwAAAAA+G2IbmRuVG6sbAACyG80b0htjAHUAdABlADuA7QDtQAChYyBpeQEbBhtyAGMAO4DuAO5AOGQAAWN4CxsNG3kANWRjAGwAO4ChAKFAAAFmcssCFhsA4DXYJt1yAGEAdgBlADuA7ADsQIChSCFpbm8AJxsyGzYbAAFpbisbLxtuAHQAAKAMKnQAAKAtIuYhaW4AoNwpdABhAACgKSHsIWlnM2GAAWFvcABDG1sbXhuAAWNndABJG0sbWRtyACthgAFlbHAAcQVRG1UbaQBuAOUAyAVhAHIA9AByBWgAMWFmAACgtyJlAGQAtWEAoggiY2ZvdGkbbRt1G3kb4SFyZQCgBSFpAG4AdKAeImkAZQAAoN0pZABvAPQAWxsAoisiY2VscIEbhRuPG5QbYQBsAACguiIAAWdyiRuNG2UAcgDzACMQ4wCCG2EicmhrAACgFyryIW9kAKA8KgACY2dwdJ8boRukG6gbeQBRZG8AbgAvYWYAAOA12FrdYQC5Y3UAZQBzAHQAO4C/AL9AAAFjabUbuRtyAADgNdi+3G4AAKIIIkVkc3bCG8QbyBvQAwCg+SJvAHQAAKD1Inag9CIAoPMiaaBiIOwhZGUpYesB1hsAANkbYwB5AFZkbAA7gO8A70AAA2NmbW9zdeYb7hvyG/Ub+hsFHAABaXnqG+0bcgBjADVhOWRyAADgNdgn3eEhdGg3YnAAZgAA4DXYW93jAf8bAAADHHIAAOA12L/c8iFjeVhk6yFjeVRkAARhY2ZnaGpvcxUcGhwiHCYcKhwtHDAcNRzwIXBhdqC6A/BjAAFleR4cIRzkIWlsN2E6ZHIAAOA12CjdciJlZW4AOGFjAHkARWRjAHkAXGRwAGYAAOA12FzdYwByAADgNdjA3IALQUJFSGFiY2RlZmdoamxtbm9wcnN0dXYAXhxtHHEcdRx5HN8cBx0dHTwd3B3tHfEdAR4EHh0eLB5FHrwewx7hHgkfPR9LH4ABYXJ0AGQcZxxpHHIA8gBvB/IAxQLhIWlsAKAbKeEhcnIAoA4pZ6BmIgCgiyphAHIAAKBiKWMJjRwAAJAcAACVHAAAAAAAAAAAAACZHJwcAACmHKgcrRwAANIc9SF0ZTph7SJwdHl2AKC0KXIAYQDuAFoG4iFkYbtjZwAAoegnZGyhHKMcAKCRKeUAiwYAoIUqdQBvADuAqwCrQHIAgKOQIWJmaGxwc3QAuhy/HMIcxBzHHMoczhxmoOQhcwAAoB8pcwAAoB0p6wCyGnAAAKCrIWwAAKA5KWkAbQAAoHMpbAAAoKIhAKGrKmFl1hzaHGkAbAAAoBkpc6CtKgDgrSoA/oABYWJyAOUc6RztHHIAcgAAoAwpcgBrAACgcicAAWFr8Rz4HGMAAAFla/Yc9xx7YFtgAAFlc/wc/hwAoIspbAAAAWR1Ax0FHQCgjykAoI0pAAJhZXV5Dh0RHRodHB3yIW9uPmEAAWRpFR0YHWkAbAA8YewAowbiAPccO2QAAmNxcnMkHScdLB05HWEAAKA2KXUAbwDyoBwgqhEAAWR1MB00HeghYXIAoGcpcyJoYXIAAKBLKWgAAKCyIQCiZCJmZ3FzRB1FB5Qdnh10AIACYWhscnQATh1WHWUdbB2NHXIicm93AHSgkCFhAOkAzxxhI3Jwb29uAAABZHVeHWId7yF3bgCgvSFwAACgvCHlJGZ0YXJyb3dzAKDHIWkiZ2h0AIABYWhzAHUdex2DHXIicm93APOglCGdBmEAcgBwAG8AbwBuAPMAzgtxAHUAaQBnAGEAcgByAG8A9wBlGugkcmVldGltZXMAoMsi8aFkIk0HAACaHWwAYQBuAPQAXgcAon0qY2Rnc6YdqR2xHbcdYwAAoKgqbwB0AG+gfypyoIEqAKCDKmXg2iIA/nMAAKCTKoACYWRlZ3MAwB3GHcod1h3ZHXAAcAByAG8A+ACmHG8AdAAAoNYicQAAAWdxzx3SHXQA8gBGB2cAdADyAHQcdADyAFMHaQDtAGMHgAFpbHIA4h3mHeod8yFodACgfClvAG8A8gDKBgDgNdgp3UWgdiIAoJEqYQH1Hf4dcgAAAWR1YB35HWygvCEAoGopbABrAACghCVjAHkAWWQAomoiYWNodAweDx4VHhkecgDyAGsdbwByAG4AZQDyAGAW4SFyZACgaylyAGkAAKD6JQABaW8hHiQe5CFvdEBh9SFzdGGgsCPjIWhlAKCwIwACRWFlczMeNR48HkEeAKBoInAAcKCJKvIhb3gAoIkqcaCHKvGghyo0HmkAbQAAoOYiAARhYm5vcHR3elIeXB5fHoUelh6mHqsetB4AAW5yVh5ZHmcAAKDsJ3IAAKD9IXIA6wCwBmcAgAFsbXIAZh52Hnse5SFmdAABYXKIB2weaQBnAGgAdABhAHIAcgBvAPcAkwfhInBzdG8AoPwnaQBnAGgAdABhAHIAcgBvAPcAmgdwI2Fycm93AAABbHKNHpEeZQBmAPQAxhxpImdodAAAoKwhgAFhZmwAnB6fHqIecgAAoIUpAOA12F3ddQBzAACgLSppIm1lcwAAoDQqYQGvHrMecwB0AACgFyLhAIoOZaHKJbkeRhLuIWdlAKDKJWEAcgBsoCgAdAAAoJMpgAJhY2htdADMHs8e1R7bHt0ecgDyAJ0GbwByAG4AZQDyANYWYQByAGSgyyEAoG0pAKAOIHIAaQAAoL8iAANhY2hpcXTrHu8e1QfzHv0eBh/xIXVvAKA5IHIAAOA12MHcbQDloXIi+h4AAPweAKCNKgCgjyoAAWJ19xwBH28AcqAYIACgGiDyIW9rQmEAhDwAO2NkaGlscXJCBhcfxh0gHyQfKB8sHzEfAAFjaRsfHR8AoKYqcgAAoHkqcgBlAOUAkx3tIWVzAKDJIuEhcnIAoHYpdSJlc3QAAKB7KgABUGk1HzkfYQByAACglillocMlAgdfEnIAAAFkdUIfRx9zImhhcgAAoEop6CFhcgCgZikAAWVuTx9WH3IjdG5lcXEAAOBoIgD+xQBUHwAHRGFjZGVmaGlsbm9wc3VuH3Ifoh+rH68ftx+7H74f5h/uH/MfBwj/HwsgxCFvdACgOiIAAmNscHJ5H30fiR+eH3IAO4CvAK9AAAFldIEfgx8AoEImZaAgJ3MAZQAAoCAnc6CmIXQAbwCAoaYhZGx1AJQfmB+cH28AdwDuAHkDZQBmAPQA6gbwAOkO6yFlcgCgriUAAW95ph+qH+0hbWEAoCkqPGThIXNoAKAUIOElc3VyZWRhbmdsZQCgISJyAADgNdgq3W8AAKAnIYABY2RuAMQfyR/bH3IAbwA7gLUAtUBhoiMi0B8AANMf1x9zAPQAKxFpAHIAAKDwKm8AdAA7gLcAt0B1AHMA4qESIh4TAADjH3WgOCIAoCoqYwHqH+0fcAAAoNsq8gB+GnAAbAB1APMACAgAAWRw9x/7H+UhbHMAoKciZgAA4DXYXt0AAWN0AyAHIHIAAOA12MLc8CFvcwCgPiJsobwDECAVIPQiaW1hcACguCJhAPAAEyAADEdMUlZhYmNkZWZnaGlqbG1vcHJzdHV2dzwgRyBmIG0geSCqILgg2iDeIBEhFSEyIUMhTSFQIZwhnyHSIQAiIyKLIrEivyIUIwABZ3RAIEMgAODZIjgD9uBrItIgBwmAAWVsdABNIF8gYiBmAHQAAAFhclMgWCByInJvdwAAoM0h6SRnaHRhcnJvdwCgziEA4NgiOAP24Goi0iBfCekkZ2h0YXJyb3cAoM8hAAFEZHEgdSDhIXNoAKCvIuEhc2gAoK4igAJiY25wdACCIIYgiSCNIKIgbABhAACgByL1IXRlRGFnAADgICLSIACiSSJFaW9wlSCYIJwgniAA4HAqOANkAADgSyI4A3MASWFyAG8A+AAyCnUAcgBhoG4mbADzoG4mmwjzAa8gAACzIHAAO4CgAKBAbQBwAOXgTiI4AyoJgAJhZW91eQDBIMogzSDWINkg8AHGIAAAyCAAoEMqbwBuAEhh5CFpbEZhbgBnAGSgRyJvAHQAAOBtKjgDcAAAoEIqPWThIXNoAKATIACjYCJBYWRxc3jpIO0g+SD+IAIhDCFyAHIAAKDXIXIAAAFocvIg9SBrAACgJClvoJch9wAGD28AdAAA4FAiOAN1AGkA9gC7CAABZWkGIQohYQByAACgKCntAN8I6SFzdPOgBCLlCHIAAOA12CvdAAJFZXN0/wgcISshLiHxoXEiIiEAABMJ8aFxIgAJAAAnIWwAYQBuAPQAEwlpAO0AGQlyoG8iAKBvIoABQWFwADghOyE/IXIA8gBeIHIAcgAAoK4hYQByAACg8ipzogsiSiEAAAAAxwtkoPwiAKD6ImMAeQBaZIADQUVhZGVzdABcIV8hYiFmIWkhkyGWIXIA8gBXIADgZiI4A3IAcgAAoJohcgAAoCUggKFwImZxcwBwIYQhjiF0AAABYXJ1IXohcgByAG8A9wBlIWkAZwBoAHQAYQByAHIAbwD3AD4h8aFwImAhAACKIWwAYQBuAPQAZwlz4H0qOAMAoG4iaQDtAG0JcqBuImkA5aDqIkUJaQDkADoKAAFwdKMhpyFmAADgNdhf3YCBrAA7aW4AriGvIcchrEBuAIChCSJFZHYAtyG6Ib8hAOD5IjgDbwB0AADg9SI4A+EB1gjEIcYhAKD3IgCg9iJpAHagDCLhAagJzyHRIQCg/iIAoP0igAFhb3IA2CHsIfEhcgCAoSYiYXN0AOAh5SHpIWwAbABlAOwAywhsAADg/SrlIADgAiI4A2wiaW50AACgFCrjoYAi9yEAAPohdQDlAJsJY+CvKjgDZaCAIvEAkwkAAkFhaXQHIgoiFyIeInIA8gBsIHIAcgAAoZshY3cRIhQiAOAzKTgDAOCdITgDZyRodGFycm93AACgmyFyAGkA5aDrIr4JgANjaGltcHF1AC8iPCJHIpwhTSJQIloigKGBImNlcgA2Iv0JOSJ1AOUABgoA4DXYw9zvIXJ0bQKdIQAAAABEImEAcgDhAOEhbQBloEEi8aBEIiYKYQDyAMsIcwB1AAABYnBWIlgi5QDUCeUA3wmAAWJjcABgInMieCKAoYQiRWVzAGci7glqIgDgxSo4A2UAdABl4IIi0iBxAPGgiCJoImMAZaCBIvEA/gmAoYUiRWVzAH8iFgqCIgDgxio4A2UAdABl4IMi0iBxAPGgiSKAIgACZ2lscpIilCKaIpwi7AAMCWwAZABlADuA8QDxQOcAWwlpI2FuZ2xlAAABbHKkIqoi5SFmdGWg6iLxAEUJaSJnaHQAZaDrIvEAvgltoL0DAKEjAGVzuCK8InIAbwAAoBYhcAAAoAcggARESGFkZ2lscnMAziLSItYi2iLeIugi7SICIw8j4SFzaACgrSLhIXJyAKAEKXAAAOBNItIg4SFzaACgrCIAAWV04iLlIgDgZSLSIADgPgDSIG4iZmluAACg3imAAUFldADzIvci+iJyAHIAAKACKQDgZCLSIHLgPADSIGkAZQAA4LQi0iAAAUF0BiMKI3IAcgAAoAMp8iFpZQDgtSLSIGkAbQAA4Dwi0iCAAUFhbgAaIx4jKiNyAHIAAKDWIXIAAAFociMjJiNrAACgIylvoJYh9wD/DuUhYXIAoCcpUxJqFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVCMAAF4jaSN/I4IjjSOeI8AUAAAAAKYjwCMAANoj3yMAAO8jHiQvJD8kRCQAAWNzVyNsFHUAdABlADuA8wDzQAABaXlhI2cjcgBjoJoiO4D0APRAPmSAAmFiaW9zAHEjdCN3I3EBeiNzAOgAdhTsIWFjUWF2AACgOCrvIWxkAKC8KewhaWdTYQABY3KFI4kjaQByAACgvykA4DXYLN1vA5QjAAAAAJYjAACcI24A22JhAHYAZQA7gPIA8kAAoMEpAAFibaEjjAphAHIAAKC1KQACYWNpdKwjryO6I70jcgDyAFkUAAFpcrMjtiNyAACgvinvIXNzAKC7KW4A5QDZCgCgwCmAAWFlaQDFI8gjyyNjAHIATWFnAGEAyWOAAWNkbgDRI9Qj1iPyIW9uv2MAoLYpdQDzAHgBcABmAADgNdhg3YABYWVsAOQj5yPrI3IAAKC3KXIAcAAAoLkpdQDzAHwBAKMoImFkaW9zdvkj/CMPJBMkFiQbJHIA8gBeFIChXSplZm0AAyQJJAwkcgBvoDQhZgAAoDQhO4CqAKpAO4C6ALpA5yFvZgCgtiJyAACgVipsIm9wZQAAoFcqAKBbKoABY2xvACMkJSQrJPIACCRhAHMAaAA7gPgA+EBsAACgmCJpAGwBMyQ4JGQAZQA7gPUA9UBlAHMAYaCXInMAAKA2Km0AbAA7gPYA9kDiIWFyAKA9I+EKXiQAAHokAAB8JJQkAACYJKkkAAAAALUkEQsAAPAkAAAAAAQleiUAAIMlcgCAoSUiYXN0AGUkbyQBCwCBtgA7bGokayS2QGwAZQDsABgDaQJ1JAAAAAB4JG0AAKDzKgCg/Sp5AD9kcgCAAmNpbXB0AIUkiCSLJJkSjyRuAHQAJWBvAGQALmBpAGwAAKAwIOUhbmsAoDEgcgAA4DXYLd2AAWltbwCdJKAkpCR2oMYD1WNtAGEA9AD+B24AZQAAoA4m9KHAA64kAAC0JGMjaGZvcmsAAKDUItZjAAFhdbgkxCRuAAABY2u9JMIkawBooA8hAKAOIfYAaRpzAACkKwBhYmNkZW1zdNMkIRPXJNsk4STjJOck6yTjIWlyAKAjKmkAcgAAoCIqAAFvdYsW3yQAoCUqAKByKm4AO4CxALFAaQBtAACgJip3AG8AAKAnKoABaXB1APUk+iT+JO4idGludACgFSpmAADgNdhh3W4AZAA7gKMAo0CApHoiRWFjZWlub3N1ABMlFSUYJRslTCVRJVklSSV1JQCgsypwAACgtyp1AOUAPwtjoK8qgKJ6ImFjZW5zACclLSU0JTYlSSVwAHAAcgBvAPgAFyV1AHIAbAB5AGUA8QA/C/EAOAuAAWFlcwA8JUElRSXwInByb3gAoLkqcQBxAACgtSppAG0AAKDoImkA7QBEC20AZQDzoDIgIguAAUVhcwBDJVclRSXwAEAlgAFkZnAATwtfJXElgAFhbHMAZSVpJW0l7CFhcgCgLiPpIW5lAKASI/UhcmYAoBMjdKAdIu8AWQvyIWVsAKCwIgABY2l9JYElcgAA4DXYxdzIY24iY3NwAACgCCAAA2Zpb3BzdZElKxuVJZolnyWkJXIAAOA12C7dcABmAADgNdhi3XIiaW1lAACgVyBjAHIAAOA12MbcgAFhZW8AqiW6JcAldAAAAWVpryW2JXIAbgBpAG8AbgDzABkFbgB0AACgFipzAHQAZaA/APEACRj0AG0LgApBQkhhYmNkZWZoaWxtbm9wcnN0dXgA4yXyJfYl+iVpJpAmpia9JtUm5ib4JlonaCdxJ3UnnietJ7EnyCfiJ+cngAFhcnQA6SXsJe4lcgDyAJkM8gD6AuEhaWwAoBwpYQByAPIA3BVhAHIAAKBkKYADY2RlbnFydAAGJhAmEyYYJiYmKyZaJgABZXUKJg0mAOA9IjEDdABlAFVhaQDjACAN7SJwdHl2AKCzKWcAgKHpJ2RlbAAgJiImJCYAoJIpAKClKeUA9wt1AG8AO4C7ALtAcgAApZIhYWJjZmhscHN0dz0mQCZFJkcmSiZMJk4mUSZVJlgmcAAAoHUpZqDlIXMAAKAgKQCgMylzAACgHinrALka8ACVHmwAAKBFKWkAbQAAoHQpbAAAoKMhAKCdIQABYWleJmImaQBsAACgGilvAG6gNiJhAGwA8wB2C4ABYWJyAG8mciZ2JnIA8gAvEnIAawAAoHMnAAFha3omgSZjAAABZWt/JoAmfWBdYAABZXOFJocmAKCMKWwAAAFkdYwmjiYAoI4pAKCQKQACYWV1eZcmmiajJqUm8iFvbllhAAFkaZ4moSZpAGwAV2HsAA8M4gCAJkBkAAJjbHFzrSawJrUmuiZhAACgNylkImhhcgAAoGkpdQBvAPKgHSCjAWgAAKCzIYABYWNnAMMm0iaUC2wAgKEcIWlwcwDLJs4migxuAOUAoAxhAHIA9ADaC3QAAKCtJYABaWxyANsm3ybjJvMhaHQAoH0pbwBvAPIANgwA4DXYL90AAWFv6ib1JnIAAAFkde8m8SYAoMEhbKDAIQCgbCl2oMED8WOAAWducwD+Jk4nUCdoAHQAAANhaGxyc3QKJxInISc1Jz0nRydyInJvdwB0oJIhYQDpAFYmYSNycG9vbgAAAWR1GiceJ28AdwDuAPAmcAAAoMAh5SFmdAABYWgnJy0ncgByAG8AdwDzAAkMYQByAHAAbwBvAG4A8wATBGklZ2h0YXJyb3dzAACgySFxAHUAaQBnAGEAcgByAG8A9wBZJugkcmVldGltZXMAoMwiZwDaYmkAbgBnAGQAbwB0AHMAZQDxABwYgAFhaG0AYCdjJ2YncgDyAAkMYQDyABMEAKAPIG8idXN0AGGgsSPjIWhlAKCxI+0haWQAoO4qAAJhYnB0fCeGJ4knmScAAW5ygCeDJ2cAAKDtJ3IAAKD+IXIA6wAcDIABYWZsAI8nkieVJ3IAAKCGKQDgNdhj3XUAcwAAoC4qaSJtZXMAAKA1KgABYXCiJ6gncgBnoCkAdAAAoJQp7yJsaW50AKASKmEAcgDyADwnAAJhY2hxuCe8J6EMwCfxIXVvAKA6IHIAAOA12MfcAAFidYAmxCdvAPKgGSCoAYABaGlyAM4n0ifWJ3IAZQDlAE0n7SFlcwCgyiJpAIChuSVlZmwAXAxjEt4n9CFyaQCgzinsInVoYXIAoGgpAKAeIWENBSgJKA0oSyhVKIYoAACLKLAoAAAAAOMo5ygAABApJCkxKW0pcSmHKaYpAACYKgAAAACxKmMidXRlAFthcQB1AO8ABR+ApHsiRWFjZWlucHN5ABwoHignKCooLygyKEEoRihJKACgtCrwASMoAAAlKACguCpvAG4AYWF1AOUAgw1koLAqaQBsAF9hcgBjAF1hgAFFYXMAOCg6KD0oAKC2KnAAAKC6KmkAbQAAoOki7yJsaW50AKATKmkA7QCIDUFkbwB0AGKixSKRFgAAAABTKACgZiqAA0FhY21zdHgAYChkKG8ocyh1KHkogihyAHIAAKDYIXIAAAFocmkoayjrAJAab6CYIfcAzAd0ADuApwCnQGkAO2D3IWFyAKApKW0AAAFpbn4ozQBuAHUA8wDOAHQAAKA2J3IA7+A12DDdIxkAAmFjb3mRKJUonSisKHIAcAAAoG8mAAFoeZkonChjAHkASWRIZHIAdABtAqUoAAAAAKgoaQDkAFsPYQByAGEA7ABsJDuArQCtQAABZ22zKLsobQBhAAChwwNmdroouijCY4CjPCJkZWdsbnByAMgozCjPKNMo1yjaKN4obwB0AACgairxoEMiCw5FoJ4qAKCgKkWgnSoAoJ8qZQAAoEYi7CF1cwCgJCrhIXJyAKByKWEAcgDyAPwMAAJhZWl07Sj8KAEpCCkAAWxz8Sj4KGwAcwBlAHQAbQDpAH8oaABwAACgMyrwImFyc2wAoOQpAAFkbFoPBSllAACgIyNloKoqc6CsKgDgrCoA/oABZmxwABUpGCkfKfQhY3lMZGKgLwBhoMQpcgAAoD8jZgAA4DXYZN1hAAABZHIoKRcDZQBzAHWgYCZpAHQAAKBgJoABY3N1ADYpRilhKQABYXU6KUApcABzoJMiAOCTIgD+cABzoJQiAOCUIgD+dQAAAWJwSylWKQChjyJlcz4NUCllAHQAZaCPIvEAPw0AoZAiZXNIDVspZQB0AGWgkCLxAEkNAKGhJWFmZilbBHIAZQFrKVwEAKChJWEAcgDyAAMNAAJjZW10dyl7KX8pgilyAADgNdjI3HQAbQDuAM4AaQDsAAYpYQByAOYAVw0AAWFyiimOKXIA5qAGJhESAAFhbpIpoylpImdodAAAAWVwmSmgKXAAcwBpAGwAbwDuANkXaADpAKAkcwCvYIACYmNtbnAArin8KY4NJSooKgCkgiJFZGVtbnByc7wpvinCKcgpzCnUKdgp3CkAoMUqbwB0AACgvSpkoIYibwB0AACgwyr1IWx0AKDBKgABRWXQKdIpAKDLKgCgiiLsIXVzAKC/KuEhcnIAoHkpgAFlaXUA4inxKfQpdAAAoYIiZW7oKewpcQDxoIYivSllAHEA8aCKItEpbQAAoMcqAAFicPgp+ikAoNUqAKDTKmMAgKJ7ImFjZW5zAAcqDSoUKhYqRihwAHAAcgBvAPgAIyh1AHIAbAB5AGUA8QCDDfEAfA2AAWFlcwAcKiIqPShwAHAAcgBvAPgAPChxAPEAOShnAACgaiYApoMiMTIzRWRlaGxtbnBzPCo/KkIqRSpHKlIqWCpjKmcqaypzKncqO4C5ALlAO4CyALJAO4CzALNAAKDGKgABb3NLKk4qdAAAoL4qdQBiAACg2CpkoIcibwB0AACgxCpzAAABb3VdKmAqbAAAoMknYgAAoNcq4SFycgCgeyn1IWx0AKDCKgABRWVvKnEqAKDMKgCgiyLsIXVzAKDAKoABZWl1AH0qjCqPKnQAAKGDImVugyqHKnEA8aCHIkYqZQBxAPGgiyJwKm0AAKDIKgABYnCTKpUqAKDUKgCg1iqAAUFhbgCdKqEqrCpyAHIAAKDZIXIAAAFocqYqqCrrAJUab6CZIfcAxQf3IWFyAKAqKWwAaQBnADuA3wDfQOELzyrZKtwq6SrsKvEqAAD1KjQrAAAAAAAAAAAAAEwrbCsAAHErvSsAAAAAAADRK3IC1CoAAAAA2CrnIWV0AKAWI8RjcgDrAOUKgAFhZXkA4SrkKucq8iFvbmVh5CFpbGNhQmRvAPQAIg5sInJlYwAAoBUjcgAA4DXYMd0AAmVpa2/7KhIrKCsuK/IBACsAAAkrZQAAATRm6g0EK28AcgDlAOsNYQBzorgDECsAAAAAEit5AG0A0WMAAWNuFislK2sAAAFhcxsrIStwAHAAcgBvAPgAFw5pAG0AAKA8InMA8AD9DQABYXMsKyEr8AAXDnIAbgA7gP4A/kDsATgrOyswG2QA5QBnAmUAcwCAgdcAO2JkAEMrRCtJK9dAYaCgInIAAKAxKgCgMCqAAWVwcwBRK1MraSvhAAkh4qKkIlsrXysAAAAAYytvAHQAAKA2I2kAcgAAoPEqb+A12GXdcgBrAACg2irhAHgociJpbWUAAKA0IIABYWlwAHYreSu3K2QA5QC+DYADYWRlbXBzdACFK6MrmiunK6wrsCuzK24iZ2xlAACitSVkbHFykCuUK5ornCvvIXduAKC/JeUhZnRloMMl8QACBwCgXCJpImdodABloLkl8QBdDG8AdAAAoOwlaSJudXMAAKA6KuwhdXMAoDkqYgAAoM0p6SFtZQCgOyrlInppdW0AoOIjgAFjaHQAwivKK80rAAFyecYrySsA4DXYydxGZGMAeQBbZPIhb2tnYQABaW/UK9creAD0ANERaCJlYWQAAAFsct4r5ytlAGYAdABhAHIAcgBvAPcAXQbpJGdodGFycm93AKCgIQAJQUhhYmNkZmdobG1vcHJzdHV3CiwNLBEsHSwnLDEsQCxLLFIsYix6LIQsjyzLLOgs7Sz/LAotcgDyAAkDYQByAACgYykAAWNyFSwbLHUAdABlADuA+gD6QPIACQ1yAOMBIywAACUseQBeZHYAZQBtYQABaXkrLDAscgBjADuA+wD7QENkgAFhYmgANyw6LD0scgDyANEO7CFhY3FhYQDyAOAOAAFpckQsSCzzIWh0AKB+KQDgNdgy3XIAYQB2AGUAO4D5APlAYQFWLF8scgAAAWxyWixcLACgvyEAoL4hbABrAACggCUAAWN0Zix2LG8CbCwAAAAAcyxyAG4AZaAcI3IAAKAcI28AcAAAoA8jcgBpAACg+CUAAWFsfiyBLGMAcgBrYTuAqACoQAABZ3CILIssbwBuAHNhZgAA4DXYZt0AA2FkaGxzdZksniynLLgsuyzFLHIAcgBvAPcACQ1vAHcAbgBhAHIAcgBvAPcA2A5hI3Jwb29uAAABbHKvLLMsZQBmAPQAWyxpAGcAaAD0AF0sdQDzAKYOaQAAocUDaGzBLMIs0mNvAG4AxWPwI2Fycm93cwCgyCGAAWNpdADRLOEs5CxvAtcsAAAAAN4scgBuAGWgHSNyAACgHSNvAHAAAKAOI24AZwBvYXIAaQAAoPklYwByAADgNdjK3IABZGlyAPMs9yz6LG8AdAAAoPAi7CFkZWlhaQBmoLUlAKC0JQABYW0DLQYtcgDyAMosbAA7gPwA/EDhIm5nbGUAoKcpgAdBQkRhY2RlZmxub3Byc3oAJy0qLTAtNC2bLZ0toS2/LcMtxy3TLdgt3C3gLfwtcgDyABADYQByAHag6CoAoOkqYQBzAOgA/gIAAW5yOC08LechcnQAoJwpgANla25wcnN0AJkpSC1NLVQtXi1iLYItYQBwAHAA4QAaHG8AdABoAGkAbgDnAKEXgAFoaXIAoSmzJFotbwBwAPQAdCVooJUh7wD4JgABaXVmLWotZwBtAOEAuygAAWJwbi14LXMjZXRuZXEAceCKIgD+AODLKgD+cyNldG5lcQBx4IsiAP4A4MwqAP4AAWhyhi2KLWUAdADhABIraSNhbmdsZQAAAWxyki2WLeUhZnQAoLIiaSJnaHQAAKCzInkAMmThIXNoAKCiIoABZWxyAKcttC24LWKiKCKuLQAAAACyLWEAcgAAoLsicQAAoFoi7CFpcACg7iIAAWJ0vC1eD2EA8gBfD3IAAOA12DPddAByAOkAlS1zAHUAAAFicM0t0C0A4IIi0iAA4IMi0iBwAGYAAOA12GfdcgBvAPAAWQt0AHIA6QCaLQABY3XkLegtcgAA4DXYy9wAAWJw7C30LW4AAAFFZXUt8S0A4IoiAP5uAAABRWV/LfktAOCLIgD+6SJnemFnAKCaKYADY2Vmb3BycwANLhAuJS4pLiMuLi40LukhcmN1YQABZGkULiEuAAFiZxguHC5hAHIAAKBfKmUAcaAnIgCgWSLlIXJwAKAYIXIAAOA12DTdcABmAADgNdho3WWgQCJhAHQA6ABqD2MAcgAA4DXYzNzjCuQRUC4AAFQuAABYLmIuAAAAAGMubS5wLnQuAAAAAIguki4AAJouJxIqEnQAcgDpAB0ScgAA4DXYNd0AAUFhWy5eLnIA8gDnAnIA8gCTB75jAAFBYWYuaS5yAPIA4AJyAPIAjAdhAPAAeh5pAHMAAKD7IoABZHB0APgReS6DLgABZmx9LoAuAOA12GnddQDzAP8RaQBtAOUABBIAAUFhiy6OLnIA8gDuAnIA8gCaBwABY3GVLgoScgAA4DXYzdwAAXB0nS6hLmwAdQDzACUScgDpACASAARhY2VmaW9zdbEuvC7ELsguzC7PLtQu2S5jAAABdXm2LrsudABlADuA/QD9QE9kAAFpecAuwy5yAGMAd2FLZG4AO4ClAKVAcgAA4DXYNt1jAHkAV2RwAGYAAOA12GrdYwByAADgNdjO3AABY23dLt8ueQBOZGwAO4D/AP9AAAVhY2RlZmhpb3N38y73Lv8uAi8MLxAvEy8YLx0vIi9jInV0ZQB6YQABYXn7Lv4u8iFvbn5hN2RvAHQAfGEAAWV0Bi8KL3QAcgDmAB8QYQC2Y3IAAOA12DfdYwB5ADZk5yJyYXJyAKDdIXAAZgAA4DXYa91jAHIAAOA12M/cAAFqbiYvKC8AoA0gagAAoAwg");

// node_modules/.pnpm/entities@8.0.0/node_modules/entities/dist/generated/decode-data-xml.js
var xmlDecodeTree = /* @__PURE__ */ decodeBase64("AAJhZ2xxBwARABMAFQBtAg0AAAAAAA8AcAAmYG8AcwAnYHQAPmB0ADxg9SFvdCJg");

// node_modules/.pnpm/entities@8.0.0/node_modules/entities/dist/internal/bin-trie-flags.js
var BinTrieFlags;
(function(BinTrieFlags2) {
  BinTrieFlags2[BinTrieFlags2["VALUE_LENGTH"] = 49152] = "VALUE_LENGTH";
  BinTrieFlags2[BinTrieFlags2["FLAG13"] = 8192] = "FLAG13";
  BinTrieFlags2[BinTrieFlags2["BRANCH_LENGTH"] = 8064] = "BRANCH_LENGTH";
  BinTrieFlags2[BinTrieFlags2["JUMP_TABLE"] = 127] = "JUMP_TABLE";
})(BinTrieFlags || (BinTrieFlags = {}));

// node_modules/.pnpm/entities@8.0.0/node_modules/entities/dist/decode.js
var CharCodes;
(function(CharCodes3) {
  CharCodes3[CharCodes3["NUM"] = 35] = "NUM";
  CharCodes3[CharCodes3["SEMI"] = 59] = "SEMI";
  CharCodes3[CharCodes3["EQUALS"] = 61] = "EQUALS";
  CharCodes3[CharCodes3["ZERO"] = 48] = "ZERO";
  CharCodes3[CharCodes3["NINE"] = 57] = "NINE";
  CharCodes3[CharCodes3["LOWER_A"] = 97] = "LOWER_A";
  CharCodes3[CharCodes3["LOWER_F"] = 102] = "LOWER_F";
  CharCodes3[CharCodes3["LOWER_X"] = 120] = "LOWER_X";
  CharCodes3[CharCodes3["LOWER_Z"] = 122] = "LOWER_Z";
  CharCodes3[CharCodes3["UPPER_A"] = 65] = "UPPER_A";
  CharCodes3[CharCodes3["UPPER_F"] = 70] = "UPPER_F";
  CharCodes3[CharCodes3["UPPER_Z"] = 90] = "UPPER_Z";
})(CharCodes || (CharCodes = {}));
var TO_LOWER_BIT = 32;
function isNumber(code2) {
  return code2 >= CharCodes.ZERO && code2 <= CharCodes.NINE;
}
function isHexadecimalCharacter(code2) {
  return code2 >= CharCodes.UPPER_A && code2 <= CharCodes.UPPER_F || code2 >= CharCodes.LOWER_A && code2 <= CharCodes.LOWER_F;
}
function isAsciiAlphaNumeric(code2) {
  return code2 >= CharCodes.UPPER_A && code2 <= CharCodes.UPPER_Z || code2 >= CharCodes.LOWER_A && code2 <= CharCodes.LOWER_Z || isNumber(code2);
}
function isEntityInAttributeInvalidEnd(code2) {
  return code2 === CharCodes.EQUALS || isAsciiAlphaNumeric(code2);
}
var EntityDecoderState;
(function(EntityDecoderState2) {
  EntityDecoderState2[EntityDecoderState2["EntityStart"] = 0] = "EntityStart";
  EntityDecoderState2[EntityDecoderState2["NumericStart"] = 1] = "NumericStart";
  EntityDecoderState2[EntityDecoderState2["NumericDecimal"] = 2] = "NumericDecimal";
  EntityDecoderState2[EntityDecoderState2["NumericHex"] = 3] = "NumericHex";
  EntityDecoderState2[EntityDecoderState2["NamedEntity"] = 4] = "NamedEntity";
})(EntityDecoderState || (EntityDecoderState = {}));
var DecodingMode;
(function(DecodingMode2) {
  DecodingMode2[DecodingMode2["Legacy"] = 0] = "Legacy";
  DecodingMode2[DecodingMode2["Strict"] = 1] = "Strict";
  DecodingMode2[DecodingMode2["Attribute"] = 2] = "Attribute";
})(DecodingMode || (DecodingMode = {}));
var EntityDecoder = class {
  decodeTree;
  emitCodePoint;
  errors;
  constructor(decodeTree, emitCodePoint, errors) {
    this.decodeTree = decodeTree;
    this.emitCodePoint = emitCodePoint;
    this.errors = errors;
  }
  /** The current state of the decoder. */
  state = EntityDecoderState.EntityStart;
  /** Characters that were consumed while parsing an entity. */
  consumed = 1;
  /**
   * The result of the entity.
   *
   * Either the result index of a numeric entity, or the codepoint of a
   * numeric entity.
   */
  result = 0;
  /** The current index in the decode tree. */
  treeIndex = 0;
  /** The number of characters that were consumed in excess. */
  excess = 1;
  /** The mode in which the decoder is operating. */
  decodeMode = DecodingMode.Strict;
  /** The number of characters that have been consumed in the current run. */
  runConsumed = 0;
  /**
   * Resets the instance to make it reusable.
   * @param decodeMode Entity decoding mode to use.
   */
  startEntity(decodeMode) {
    this.decodeMode = decodeMode;
    this.state = EntityDecoderState.EntityStart;
    this.result = 0;
    this.treeIndex = 0;
    this.excess = 1;
    this.consumed = 1;
    this.runConsumed = 0;
  }
  /**
   * Write an entity to the decoder. This can be called multiple times with partial entities.
   * If the entity is incomplete, the decoder will return -1.
   *
   * Mirrors the implementation of `getDecoder`, but with the ability to stop decoding if the
   * entity is incomplete, and resume when the next string is written.
   * @param input The string containing the entity (or a continuation of the entity).
   * @param offset The offset at which the entity begins. Should be 0 if this is not the first call.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  write(input, offset) {
    switch (this.state) {
      case EntityDecoderState.EntityStart: {
        if (input.charCodeAt(offset) === CharCodes.NUM) {
          this.state = EntityDecoderState.NumericStart;
          this.consumed += 1;
          return this.stateNumericStart(input, offset + 1);
        }
        this.state = EntityDecoderState.NamedEntity;
        return this.stateNamedEntity(input, offset);
      }
      case EntityDecoderState.NumericStart: {
        return this.stateNumericStart(input, offset);
      }
      case EntityDecoderState.NumericDecimal: {
        return this.stateNumericDecimal(input, offset);
      }
      case EntityDecoderState.NumericHex: {
        return this.stateNumericHex(input, offset);
      }
      case EntityDecoderState.NamedEntity: {
        return this.stateNamedEntity(input, offset);
      }
    }
  }
  /**
   * Switches between the numeric decimal and hexadecimal states.
   *
   * Equivalent to the `Numeric character reference state` in the HTML spec.
   * @param input The string containing the entity (or a continuation of the entity).
   * @param offset The current offset.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  stateNumericStart(input, offset) {
    if (offset >= input.length) {
      return -1;
    }
    if ((input.charCodeAt(offset) | TO_LOWER_BIT) === CharCodes.LOWER_X) {
      this.state = EntityDecoderState.NumericHex;
      this.consumed += 1;
      return this.stateNumericHex(input, offset + 1);
    }
    this.state = EntityDecoderState.NumericDecimal;
    return this.stateNumericDecimal(input, offset);
  }
  /**
   * Parses a hexadecimal numeric entity.
   *
   * Equivalent to the `Hexademical character reference state` in the HTML spec.
   * @param input The string containing the entity (or a continuation of the entity).
   * @param offset The current offset.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  stateNumericHex(input, offset) {
    while (offset < input.length) {
      const char = input.charCodeAt(offset);
      if (isNumber(char) || isHexadecimalCharacter(char)) {
        const digit = char <= CharCodes.NINE ? char - CharCodes.ZERO : (char | TO_LOWER_BIT) - CharCodes.LOWER_A + 10;
        this.result = this.result * 16 + digit;
        this.consumed++;
        offset++;
      } else {
        return this.emitNumericEntity(char, 3);
      }
    }
    return -1;
  }
  /**
   * Parses a decimal numeric entity.
   *
   * Equivalent to the `Decimal character reference state` in the HTML spec.
   * @param input The string containing the entity (or a continuation of the entity).
   * @param offset The current offset.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  stateNumericDecimal(input, offset) {
    while (offset < input.length) {
      const char = input.charCodeAt(offset);
      if (isNumber(char)) {
        this.result = this.result * 10 + (char - CharCodes.ZERO);
        this.consumed++;
        offset++;
      } else {
        return this.emitNumericEntity(char, 2);
      }
    }
    return -1;
  }
  /**
   * Validate and emit a numeric entity.
   *
   * Implements the logic from the `Hexademical character reference start
   * state` and `Numeric character reference end state` in the HTML spec.
   * @param lastCp The last code point of the entity. Used to see if the
   *               entity was terminated with a semicolon.
   * @param expectedLength The minimum number of characters that should be
   *                       consumed. Used to validate that at least one digit
   *                       was consumed.
   * @returns The number of characters that were consumed.
   */
  emitNumericEntity(lastCp, expectedLength) {
    if (this.consumed <= expectedLength) {
      this.errors?.absenceOfDigitsInNumericCharacterReference(this.consumed);
      return 0;
    }
    if (lastCp === CharCodes.SEMI) {
      this.consumed += 1;
    } else if (this.decodeMode === DecodingMode.Strict) {
      return 0;
    }
    this.emitCodePoint(replaceCodePoint(this.result), this.consumed);
    if (this.errors) {
      if (lastCp !== CharCodes.SEMI) {
        this.errors.missingSemicolonAfterCharacterReference();
      }
      this.errors.validateNumericCharacterReference(this.result);
    }
    return this.consumed;
  }
  /**
   * Parses a named entity.
   *
   * Equivalent to the `Named character reference state` in the HTML spec.
   * @param input The string containing the entity (or a continuation of the entity).
   * @param offset The current offset.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  stateNamedEntity(input, offset) {
    const { decodeTree } = this;
    let current = decodeTree[this.treeIndex];
    let valueLength = (current & BinTrieFlags.VALUE_LENGTH) >> 14;
    while (offset < input.length) {
      if (valueLength === 0 && (current & BinTrieFlags.FLAG13) !== 0) {
        const runLength = (current & BinTrieFlags.BRANCH_LENGTH) >> 7;
        if (this.runConsumed === 0) {
          const firstChar = current & BinTrieFlags.JUMP_TABLE;
          if (input.charCodeAt(offset) !== firstChar) {
            return this.result === 0 ? 0 : this.emitNotTerminatedNamedEntity();
          }
          offset++;
          this.excess++;
          this.runConsumed++;
        }
        while (this.runConsumed < runLength) {
          if (offset >= input.length) {
            return -1;
          }
          const charIndexInPacked = this.runConsumed - 1;
          const packedWord = decodeTree[this.treeIndex + 1 + (charIndexInPacked >> 1)];
          const expectedChar = charIndexInPacked % 2 === 0 ? packedWord & 255 : packedWord >> 8 & 255;
          if (input.charCodeAt(offset) !== expectedChar) {
            this.runConsumed = 0;
            return this.result === 0 ? 0 : this.emitNotTerminatedNamedEntity();
          }
          offset++;
          this.excess++;
          this.runConsumed++;
        }
        this.runConsumed = 0;
        this.treeIndex += 1 + (runLength >> 1);
        current = decodeTree[this.treeIndex];
        valueLength = (current & BinTrieFlags.VALUE_LENGTH) >> 14;
      }
      if (offset >= input.length)
        break;
      const char = input.charCodeAt(offset);
      if (char === CharCodes.SEMI && valueLength !== 0 && (current & BinTrieFlags.FLAG13) !== 0) {
        return this.emitNamedEntityData(this.treeIndex, valueLength, this.consumed + this.excess);
      }
      this.treeIndex = determineBranch(decodeTree, current, this.treeIndex + Math.max(1, valueLength), char);
      if (this.treeIndex < 0) {
        return this.result === 0 || // If we are parsing an attribute
        this.decodeMode === DecodingMode.Attribute && // We shouldn't have consumed any characters after the entity,
        (valueLength === 0 || // And there should be no invalid characters.
        isEntityInAttributeInvalidEnd(char)) ? 0 : this.emitNotTerminatedNamedEntity();
      }
      current = decodeTree[this.treeIndex];
      valueLength = (current & BinTrieFlags.VALUE_LENGTH) >> 14;
      if (valueLength !== 0) {
        if (char === CharCodes.SEMI) {
          return this.emitNamedEntityData(this.treeIndex, valueLength, this.consumed + this.excess);
        }
        if (this.decodeMode !== DecodingMode.Strict && (current & BinTrieFlags.FLAG13) === 0) {
          this.result = this.treeIndex;
          this.consumed += this.excess;
          this.excess = 0;
        }
      }
      offset++;
      this.excess++;
    }
    return -1;
  }
  /**
   * Emit a named entity that was not terminated with a semicolon.
   * @returns The number of characters consumed.
   */
  emitNotTerminatedNamedEntity() {
    const { result, decodeTree } = this;
    const valueLength = (decodeTree[result] & BinTrieFlags.VALUE_LENGTH) >> 14;
    this.emitNamedEntityData(result, valueLength, this.consumed);
    this.errors?.missingSemicolonAfterCharacterReference();
    return this.consumed;
  }
  /**
   * Emit a named entity.
   * @param result The index of the entity in the decode tree.
   * @param valueLength The number of bytes in the entity.
   * @param consumed The number of characters consumed.
   * @returns The number of characters consumed.
   */
  emitNamedEntityData(result, valueLength, consumed) {
    const { decodeTree } = this;
    this.emitCodePoint(valueLength === 1 ? decodeTree[result] & ~(BinTrieFlags.VALUE_LENGTH | BinTrieFlags.FLAG13) : decodeTree[result + 1], consumed);
    if (valueLength === 3) {
      this.emitCodePoint(decodeTree[result + 2], consumed);
    }
    return consumed;
  }
  /**
   * Signal to the parser that the end of the input was reached.
   *
   * Remaining data will be emitted and relevant errors will be produced.
   * @returns The number of characters consumed.
   */
  end() {
    switch (this.state) {
      case EntityDecoderState.NamedEntity: {
        return this.result !== 0 && (this.decodeMode !== DecodingMode.Attribute || this.result === this.treeIndex) ? this.emitNotTerminatedNamedEntity() : 0;
      }
      // Otherwise, emit a numeric entity if we have one.
      case EntityDecoderState.NumericDecimal: {
        return this.emitNumericEntity(0, 2);
      }
      case EntityDecoderState.NumericHex: {
        return this.emitNumericEntity(0, 3);
      }
      case EntityDecoderState.NumericStart: {
        this.errors?.absenceOfDigitsInNumericCharacterReference(this.consumed);
        return 0;
      }
      case EntityDecoderState.EntityStart: {
        return 0;
      }
    }
  }
};
function determineBranch(decodeTree, current, nodeIndex, char) {
  const branchCount = (current & BinTrieFlags.BRANCH_LENGTH) >> 7;
  const jumpOffset = current & BinTrieFlags.JUMP_TABLE;
  if (branchCount === 0) {
    return jumpOffset !== 0 && char === jumpOffset ? nodeIndex : -1;
  }
  if (jumpOffset) {
    const value = char - jumpOffset;
    return value < 0 || value >= branchCount ? -1 : decodeTree[nodeIndex + value] - 1;
  }
  const packedKeySlots = branchCount + 1 >> 1;
  let lo = 0;
  let hi = branchCount - 1;
  while (lo <= hi) {
    const mid = lo + hi >>> 1;
    const slot = mid >> 1;
    const packed = decodeTree[nodeIndex + slot];
    const midKey = packed >> (mid & 1) * 8 & 255;
    if (midKey < char) {
      lo = mid + 1;
    } else if (midKey > char) {
      hi = mid - 1;
    } else {
      return decodeTree[nodeIndex + packedKeySlots + mid];
    }
  }
  return -1;
}

// node_modules/.pnpm/htmlparser2@12.0.0/node_modules/htmlparser2/dist/Tokenizer.js
var CharCodes2;
(function(CharCodes3) {
  CharCodes3[CharCodes3["Tab"] = 9] = "Tab";
  CharCodes3[CharCodes3["NewLine"] = 10] = "NewLine";
  CharCodes3[CharCodes3["FormFeed"] = 12] = "FormFeed";
  CharCodes3[CharCodes3["CarriageReturn"] = 13] = "CarriageReturn";
  CharCodes3[CharCodes3["Space"] = 32] = "Space";
  CharCodes3[CharCodes3["ExclamationMark"] = 33] = "ExclamationMark";
  CharCodes3[CharCodes3["Number"] = 35] = "Number";
  CharCodes3[CharCodes3["Amp"] = 38] = "Amp";
  CharCodes3[CharCodes3["SingleQuote"] = 39] = "SingleQuote";
  CharCodes3[CharCodes3["DoubleQuote"] = 34] = "DoubleQuote";
  CharCodes3[CharCodes3["Dash"] = 45] = "Dash";
  CharCodes3[CharCodes3["Slash"] = 47] = "Slash";
  CharCodes3[CharCodes3["Zero"] = 48] = "Zero";
  CharCodes3[CharCodes3["Nine"] = 57] = "Nine";
  CharCodes3[CharCodes3["Semi"] = 59] = "Semi";
  CharCodes3[CharCodes3["Lt"] = 60] = "Lt";
  CharCodes3[CharCodes3["Eq"] = 61] = "Eq";
  CharCodes3[CharCodes3["Gt"] = 62] = "Gt";
  CharCodes3[CharCodes3["Questionmark"] = 63] = "Questionmark";
  CharCodes3[CharCodes3["UpperA"] = 65] = "UpperA";
  CharCodes3[CharCodes3["LowerA"] = 97] = "LowerA";
  CharCodes3[CharCodes3["UpperF"] = 70] = "UpperF";
  CharCodes3[CharCodes3["LowerF"] = 102] = "LowerF";
  CharCodes3[CharCodes3["UpperZ"] = 90] = "UpperZ";
  CharCodes3[CharCodes3["LowerZ"] = 122] = "LowerZ";
  CharCodes3[CharCodes3["LowerX"] = 120] = "LowerX";
  CharCodes3[CharCodes3["OpeningSquareBracket"] = 91] = "OpeningSquareBracket";
})(CharCodes2 || (CharCodes2 = {}));
var State;
(function(State3) {
  State3[State3["Text"] = 1] = "Text";
  State3[State3["BeforeTagName"] = 2] = "BeforeTagName";
  State3[State3["InTagName"] = 3] = "InTagName";
  State3[State3["InSelfClosingTag"] = 4] = "InSelfClosingTag";
  State3[State3["BeforeClosingTagName"] = 5] = "BeforeClosingTagName";
  State3[State3["InClosingTagName"] = 6] = "InClosingTagName";
  State3[State3["AfterClosingTagName"] = 7] = "AfterClosingTagName";
  State3[State3["BeforeAttributeName"] = 8] = "BeforeAttributeName";
  State3[State3["InAttributeName"] = 9] = "InAttributeName";
  State3[State3["AfterAttributeName"] = 10] = "AfterAttributeName";
  State3[State3["BeforeAttributeValue"] = 11] = "BeforeAttributeValue";
  State3[State3["InAttributeValueDq"] = 12] = "InAttributeValueDq";
  State3[State3["InAttributeValueSq"] = 13] = "InAttributeValueSq";
  State3[State3["InAttributeValueNq"] = 14] = "InAttributeValueNq";
  State3[State3["BeforeDeclaration"] = 15] = "BeforeDeclaration";
  State3[State3["InDeclaration"] = 16] = "InDeclaration";
  State3[State3["InProcessingInstruction"] = 17] = "InProcessingInstruction";
  State3[State3["BeforeComment"] = 18] = "BeforeComment";
  State3[State3["CDATASequence"] = 19] = "CDATASequence";
  State3[State3["DeclarationSequence"] = 20] = "DeclarationSequence";
  State3[State3["InSpecialComment"] = 21] = "InSpecialComment";
  State3[State3["InCommentLike"] = 22] = "InCommentLike";
  State3[State3["SpecialStartSequence"] = 23] = "SpecialStartSequence";
  State3[State3["InSpecialTag"] = 24] = "InSpecialTag";
  State3[State3["InPlainText"] = 25] = "InPlainText";
  State3[State3["InEntity"] = 26] = "InEntity";
})(State || (State = {}));
function isWhitespace(c) {
  return c === CharCodes2.Space || c === CharCodes2.NewLine || c === CharCodes2.Tab || c === CharCodes2.FormFeed || c === CharCodes2.CarriageReturn;
}
function isEndOfTagSection(c) {
  return c === CharCodes2.Slash || c === CharCodes2.Gt || isWhitespace(c);
}
function isASCIIAlpha(c) {
  return c >= CharCodes2.LowerA && c <= CharCodes2.LowerZ || c >= CharCodes2.UpperA && c <= CharCodes2.UpperZ;
}
var QuoteType;
(function(QuoteType2) {
  QuoteType2[QuoteType2["NoValue"] = 0] = "NoValue";
  QuoteType2[QuoteType2["Unquoted"] = 1] = "Unquoted";
  QuoteType2[QuoteType2["Single"] = 2] = "Single";
  QuoteType2[QuoteType2["Double"] = 3] = "Double";
})(QuoteType || (QuoteType = {}));
var Sequences = {
  Empty: new Uint8Array(0),
  Cdata: new Uint8Array([67, 68, 65, 84, 65, 91]),
  // CDATA[
  CdataEnd: new Uint8Array([93, 93, 62]),
  // ]]>
  CommentEnd: new Uint8Array([45, 45, 33, 62]),
  // `--!>`
  Doctype: new Uint8Array([100, 111, 99, 116, 121, 112, 101]),
  // `doctype`
  IframeEnd: new Uint8Array([60, 47, 105, 102, 114, 97, 109, 101]),
  // `</iframe`
  NoembedEnd: new Uint8Array([
    60,
    47,
    110,
    111,
    101,
    109,
    98,
    101,
    100
  ]),
  // `</noembed`
  NoframesEnd: new Uint8Array([
    60,
    47,
    110,
    111,
    102,
    114,
    97,
    109,
    101,
    115
  ]),
  // `</noframes`
  Plaintext: new Uint8Array([
    60,
    47,
    112,
    108,
    97,
    105,
    110,
    116,
    101,
    120,
    116
  ]),
  // `</plaintext`
  ScriptEnd: new Uint8Array([60, 47, 115, 99, 114, 105, 112, 116]),
  // `</script`
  StyleEnd: new Uint8Array([60, 47, 115, 116, 121, 108, 101]),
  // `</style`
  TitleEnd: new Uint8Array([60, 47, 116, 105, 116, 108, 101]),
  // `</title`
  TextareaEnd: new Uint8Array([
    60,
    47,
    116,
    101,
    120,
    116,
    97,
    114,
    101,
    97
  ]),
  // `</textarea`
  XmpEnd: new Uint8Array([60, 47, 120, 109, 112])
  // `</xmp`
};
var specialStartSequences = /* @__PURE__ */ new Map([
  [Sequences.IframeEnd[2], Sequences.IframeEnd],
  [Sequences.NoembedEnd[2], Sequences.NoembedEnd],
  [Sequences.Plaintext[2], Sequences.Plaintext],
  [Sequences.ScriptEnd[2], Sequences.ScriptEnd],
  [Sequences.TitleEnd[2], Sequences.TitleEnd],
  [Sequences.XmpEnd[2], Sequences.XmpEnd]
]);
var Tokenizer = class {
  cbs;
  /** The current state the tokenizer is in. */
  state = State.Text;
  /** The read buffer. */
  buffer = "";
  /** The beginning of the section that is currently being read. */
  sectionStart = 0;
  /** The index within the buffer that we are currently looking at. */
  index = 0;
  /** The start of the last entity. */
  entityStart = 0;
  /** Some behavior, eg. when decoding entities, is done while we are in another state. This keeps track of the other state type. */
  baseState = State.Text;
  /** For special parsing behavior inside of script and style tags. */
  isSpecial = false;
  /** Indicates whether the tokenizer has been paused. */
  running = true;
  /** The offset of the current buffer. */
  offset = 0;
  xmlMode;
  decodeEntities;
  recognizeSelfClosing;
  entityDecoder;
  constructor({ xmlMode = false, decodeEntities = true, recognizeSelfClosing = xmlMode }, cbs) {
    this.cbs = cbs;
    this.xmlMode = xmlMode;
    this.decodeEntities = decodeEntities;
    this.recognizeSelfClosing = recognizeSelfClosing;
    this.entityDecoder = new EntityDecoder(xmlMode ? xmlDecodeTree : htmlDecodeTree, (cp, consumed) => this.emitCodePoint(cp, consumed));
  }
  reset() {
    this.state = State.Text;
    this.buffer = "";
    this.sectionStart = 0;
    this.index = 0;
    this.baseState = State.Text;
    this.isSpecial = false;
    this.currentSequence = Sequences.Empty;
    this.sequenceIndex = 0;
    this.running = true;
    this.offset = 0;
  }
  write(chunk) {
    this.offset += this.buffer.length;
    this.buffer = chunk;
    this.parse();
  }
  end() {
    if (this.running)
      this.finish();
  }
  pause() {
    this.running = false;
  }
  resume() {
    this.running = true;
    if (this.index < this.buffer.length + this.offset) {
      this.parse();
    }
  }
  stateText(c) {
    if (c === CharCodes2.Lt || !this.decodeEntities && this.fastForwardTo(CharCodes2.Lt)) {
      if (this.index > this.sectionStart) {
        this.cbs.ontext(this.sectionStart, this.index);
      }
      this.state = State.BeforeTagName;
      this.sectionStart = this.index;
    } else if (this.decodeEntities && c === CharCodes2.Amp) {
      this.startEntity();
    }
  }
  currentSequence = Sequences.Empty;
  sequenceIndex = 0;
  enterTagBody() {
    if (this.currentSequence === Sequences.Plaintext) {
      this.currentSequence = Sequences.Empty;
      this.state = State.InPlainText;
    } else if (this.isSpecial) {
      this.state = State.InSpecialTag;
      this.sequenceIndex = 0;
    } else {
      this.state = State.Text;
    }
  }
  /**
   * Match the opening tag name against an HTML text-only tag sequence.
   *
   * Some tags share an initial prefix (`script`/`style`, `title`/`textarea`,
   * `noembed`/`noframes`), so we may switch to an alternate sequence at the
   * first distinguishing byte.  On a successful full match we fall back to
   * the normal tag-name state; a later `>` will enter raw-text, RCDATA, or
   * plaintext mode based on `currentSequence` / `isSpecial`.
   * @param c Current character code point.
   */
  stateSpecialStartSequence(c) {
    const lower = c | 32;
    if (this.sequenceIndex < this.currentSequence.length) {
      if (lower === this.currentSequence[this.sequenceIndex]) {
        this.sequenceIndex++;
        return;
      }
      if (this.sequenceIndex === 3) {
        if (this.currentSequence === Sequences.ScriptEnd && lower === Sequences.StyleEnd[3]) {
          this.currentSequence = Sequences.StyleEnd;
          this.sequenceIndex = 4;
          return;
        }
        if (this.currentSequence === Sequences.TitleEnd && lower === Sequences.TextareaEnd[3]) {
          this.currentSequence = Sequences.TextareaEnd;
          this.sequenceIndex = 4;
          return;
        }
      } else if (this.sequenceIndex === 4 && this.currentSequence === Sequences.NoembedEnd && lower === Sequences.NoframesEnd[4]) {
        this.currentSequence = Sequences.NoframesEnd;
        this.sequenceIndex = 5;
        return;
      }
    } else if (isEndOfTagSection(c)) {
      this.sequenceIndex = 0;
      this.state = State.InTagName;
      this.stateInTagName(c);
      return;
    }
    this.isSpecial = false;
    this.currentSequence = Sequences.Empty;
    this.sequenceIndex = 0;
    this.state = State.InTagName;
    this.stateInTagName(c);
  }
  stateCDATASequence(c) {
    if (c === Sequences.Cdata[this.sequenceIndex]) {
      if (++this.sequenceIndex === Sequences.Cdata.length) {
        this.state = State.InCommentLike;
        this.currentSequence = Sequences.CdataEnd;
        this.sequenceIndex = 0;
        this.sectionStart = this.index + 1;
      }
    } else {
      this.sequenceIndex = 0;
      if (this.xmlMode) {
        this.state = State.InDeclaration;
        this.stateInDeclaration(c);
      } else {
        this.state = State.InSpecialComment;
        this.stateInSpecialComment(c);
      }
    }
  }
  /**
   * When we wait for one specific character, we can speed things up
   * by skipping through the buffer until we find it.
   * @param c Current character code point.
   * @returns Whether the character was found.
   */
  fastForwardTo(c) {
    while (++this.index < this.buffer.length + this.offset) {
      if (this.buffer.charCodeAt(this.index - this.offset) === c) {
        return true;
      }
    }
    this.index = this.buffer.length + this.offset - 1;
    return false;
  }
  /**
   * Emit a comment token and return to the text state.
   * @param offset Number of characters in the end sequence that have already been matched.
   */
  emitComment(offset) {
    this.cbs.oncomment(this.sectionStart, this.index, offset);
    this.sequenceIndex = 0;
    this.sectionStart = this.index + 1;
    this.state = State.Text;
  }
  /**
   * Comments and CDATA end with `-->` and `]]>`.
   *
   * Their common qualities are:
   * - Their end sequences have a distinct character they start with.
   * - That character is then repeated, so we have to check multiple repeats.
   * - All characters but the start character of the sequence can be skipped.
   * @param c Current character code point.
   */
  stateInCommentLike(c) {
    if (!this.xmlMode && this.currentSequence === Sequences.CommentEnd && this.sequenceIndex <= 1 && /*
     * We're still at the very start of the comment: the only
     * characters consumed since `<!--` are the dashes that
     * advanced sequenceIndex (0 for `<!-->`, 1 for `<!--->`).
     */
    this.index === this.sectionStart + this.sequenceIndex && c === CharCodes2.Gt) {
      this.emitComment(this.sequenceIndex);
    } else if (this.currentSequence === Sequences.CommentEnd && this.sequenceIndex === 2 && c === CharCodes2.Gt) {
      this.emitComment(2);
    } else if (this.currentSequence === Sequences.CommentEnd && this.sequenceIndex === this.currentSequence.length - 1 && c !== CharCodes2.Gt) {
      this.sequenceIndex = Number(c === CharCodes2.Dash);
    } else if (c === this.currentSequence[this.sequenceIndex]) {
      if (++this.sequenceIndex === this.currentSequence.length) {
        if (this.currentSequence === Sequences.CdataEnd) {
          this.cbs.oncdata(this.sectionStart, this.index, 2);
        } else {
          this.cbs.oncomment(this.sectionStart, this.index, 3);
        }
        this.sequenceIndex = 0;
        this.sectionStart = this.index + 1;
        this.state = State.Text;
      }
    } else if (this.sequenceIndex === 0) {
      if (this.fastForwardTo(this.currentSequence[0])) {
        this.sequenceIndex = 1;
      }
    } else if (c !== this.currentSequence[this.sequenceIndex - 1]) {
      this.sequenceIndex = 0;
    }
  }
  /**
   * HTML only allows ASCII alpha characters (a-z and A-Z) at the beginning of a tag name.
   *
   * XML allows a lot more characters here (@see https://www.w3.org/TR/REC-xml/#NT-NameStartChar).
   * We allow anything that wouldn't end the tag.
   * @param c Current character code point.
   */
  isTagStartChar(c) {
    return this.xmlMode ? !isEndOfTagSection(c) : isASCIIAlpha(c);
  }
  /**
   * Scan raw-text / RCDATA content for the matching end tag.
   *
   * For RCDATA tags (`<title>`, `<textarea>`) entities are decoded inline.
   * For raw-text tags (`<script>`, `<style>`, etc.) we fast-forward to `<`.
   * @param c Current character code point.
   */
  stateInSpecialTag(c) {
    if (this.sequenceIndex === this.currentSequence.length) {
      if (isEndOfTagSection(c)) {
        const endOfText = this.index - this.currentSequence.length;
        if (this.sectionStart < endOfText) {
          const actualIndex = this.index;
          this.index = endOfText;
          this.cbs.ontext(this.sectionStart, endOfText);
          this.index = actualIndex;
        }
        this.isSpecial = false;
        this.sectionStart = endOfText + 2;
        this.stateInClosingTagName(c);
        return;
      }
      this.sequenceIndex = 0;
    }
    if ((c | 32) === this.currentSequence[this.sequenceIndex]) {
      this.sequenceIndex += 1;
    } else if (this.sequenceIndex === 0) {
      if (this.currentSequence === Sequences.TitleEnd || this.currentSequence === Sequences.TextareaEnd) {
        if (this.decodeEntities && c === CharCodes2.Amp) {
          this.startEntity();
        }
      } else if (this.fastForwardTo(CharCodes2.Lt)) {
        this.sequenceIndex = 1;
      }
    } else {
      this.sequenceIndex = Number(c === CharCodes2.Lt);
    }
  }
  stateBeforeTagName(c) {
    if (c === CharCodes2.ExclamationMark) {
      this.state = State.BeforeDeclaration;
      this.sectionStart = this.index + 1;
    } else if (c === CharCodes2.Questionmark) {
      if (this.xmlMode) {
        this.state = State.InProcessingInstruction;
        this.sequenceIndex = 0;
        this.sectionStart = this.index + 1;
      } else {
        this.state = State.InSpecialComment;
        this.sectionStart = this.index;
      }
    } else if (this.isTagStartChar(c)) {
      this.sectionStart = this.index;
      const special = this.xmlMode || this.cbs.isInForeignContext?.() ? void 0 : specialStartSequences.get(c | 32);
      if (special === void 0) {
        this.state = State.InTagName;
      } else {
        this.isSpecial = true;
        this.currentSequence = special;
        this.sequenceIndex = 3;
        this.state = State.SpecialStartSequence;
      }
    } else if (c === CharCodes2.Slash) {
      this.state = State.BeforeClosingTagName;
    } else {
      this.state = State.Text;
      this.stateText(c);
    }
  }
  stateInTagName(c) {
    if (isEndOfTagSection(c)) {
      this.cbs.onopentagname(this.sectionStart, this.index);
      this.sectionStart = -1;
      this.state = State.BeforeAttributeName;
      this.stateBeforeAttributeName(c);
    }
  }
  stateBeforeClosingTagName(c) {
    if (isWhitespace(c)) {
      if (this.xmlMode) {
      } else {
        this.state = State.InSpecialComment;
        this.sectionStart = this.index;
      }
    } else if (c === CharCodes2.Gt) {
      this.state = State.Text;
      if (!this.xmlMode) {
        this.sectionStart = this.index + 1;
      }
    } else {
      this.state = this.isTagStartChar(c) ? State.InClosingTagName : State.InSpecialComment;
      this.sectionStart = this.index;
    }
  }
  stateInClosingTagName(c) {
    if (isEndOfTagSection(c)) {
      this.cbs.onclosetag(this.sectionStart, this.index);
      this.sectionStart = -1;
      this.state = State.AfterClosingTagName;
      this.stateAfterClosingTagName(c);
    }
  }
  stateAfterClosingTagName(c) {
    if (c === CharCodes2.Gt || this.fastForwardTo(CharCodes2.Gt)) {
      this.state = State.Text;
      this.sectionStart = this.index + 1;
    }
  }
  stateBeforeAttributeName(c) {
    if (c === CharCodes2.Gt) {
      this.cbs.onopentagend(this.index);
      this.enterTagBody();
      this.sectionStart = this.index + 1;
    } else if (c === CharCodes2.Slash) {
      this.state = State.InSelfClosingTag;
    } else if (!isWhitespace(c)) {
      this.state = State.InAttributeName;
      this.sectionStart = this.index;
    }
  }
  /**
   * Handle `/` before `>` in an opening tag.
   *
   * In HTML mode, text-only tags ignore the self-closing flag and still enter
   * their raw-text/RCDATA/plaintext state unless self-closing tags are being
   * recognized. In XML mode, or for ordinary tags, the tokenizer returns to
   * regular text parsing after emitting the self-closing callback.
   * @param c Current character code point.
   */
  stateInSelfClosingTag(c) {
    if (c === CharCodes2.Gt) {
      this.cbs.onselfclosingtag(this.index);
      this.sectionStart = this.index + 1;
      if (!this.recognizeSelfClosing) {
        this.enterTagBody();
        return;
      }
      this.state = State.Text;
      this.isSpecial = false;
      this.currentSequence = Sequences.Empty;
    } else if (!isWhitespace(c)) {
      this.state = State.BeforeAttributeName;
      this.stateBeforeAttributeName(c);
    }
  }
  stateInAttributeName(c) {
    if (c === CharCodes2.Eq || isEndOfTagSection(c)) {
      this.cbs.onattribname(this.sectionStart, this.index);
      this.sectionStart = this.index;
      this.state = State.AfterAttributeName;
      this.stateAfterAttributeName(c);
    }
  }
  stateAfterAttributeName(c) {
    if (c === CharCodes2.Eq) {
      this.state = State.BeforeAttributeValue;
    } else if (c === CharCodes2.Slash || c === CharCodes2.Gt) {
      this.cbs.onattribend(QuoteType.NoValue, this.sectionStart);
      this.sectionStart = -1;
      this.state = State.BeforeAttributeName;
      this.stateBeforeAttributeName(c);
    } else if (!isWhitespace(c)) {
      this.cbs.onattribend(QuoteType.NoValue, this.sectionStart);
      this.state = State.InAttributeName;
      this.sectionStart = this.index;
    }
  }
  stateBeforeAttributeValue(c) {
    if (c === CharCodes2.DoubleQuote) {
      this.state = State.InAttributeValueDq;
      this.sectionStart = this.index + 1;
    } else if (c === CharCodes2.SingleQuote) {
      this.state = State.InAttributeValueSq;
      this.sectionStart = this.index + 1;
    } else if (!isWhitespace(c)) {
      this.sectionStart = this.index;
      this.state = State.InAttributeValueNq;
      this.stateInAttributeValueNoQuotes(c);
    }
  }
  handleInAttributeValue(c, quote) {
    if (c === quote || !this.decodeEntities && this.fastForwardTo(quote)) {
      this.cbs.onattribdata(this.sectionStart, this.index);
      this.sectionStart = -1;
      this.cbs.onattribend(quote === CharCodes2.DoubleQuote ? QuoteType.Double : QuoteType.Single, this.index + 1);
      this.state = State.BeforeAttributeName;
    } else if (this.decodeEntities && c === CharCodes2.Amp) {
      this.startEntity();
    }
  }
  stateInAttributeValueDoubleQuotes(c) {
    this.handleInAttributeValue(c, CharCodes2.DoubleQuote);
  }
  stateInAttributeValueSingleQuotes(c) {
    this.handleInAttributeValue(c, CharCodes2.SingleQuote);
  }
  stateInAttributeValueNoQuotes(c) {
    if (isWhitespace(c) || c === CharCodes2.Gt) {
      this.cbs.onattribdata(this.sectionStart, this.index);
      this.sectionStart = -1;
      this.cbs.onattribend(QuoteType.Unquoted, this.index);
      this.state = State.BeforeAttributeName;
      this.stateBeforeAttributeName(c);
    } else if (this.decodeEntities && c === CharCodes2.Amp) {
      this.startEntity();
    }
  }
  /**
   * Distinguish between CDATA, declarations, HTML comments, and HTML bogus
   * comments after `<!`.
   *
   * In HTML mode, only real comments and doctypes stay on declaration paths;
   * everything else becomes a bogus comment terminated by the next `>`.
   * @param c Current character code point.
   */
  stateBeforeDeclaration(c) {
    if (c === CharCodes2.OpeningSquareBracket) {
      this.state = State.CDATASequence;
      this.sequenceIndex = 0;
    } else if (this.xmlMode) {
      this.state = c === CharCodes2.Dash ? State.BeforeComment : State.InDeclaration;
    } else if ((c | 32) === Sequences.Doctype[0]) {
      this.state = State.DeclarationSequence;
      this.currentSequence = Sequences.Doctype;
      this.sequenceIndex = 1;
    } else if (c === CharCodes2.Gt) {
      this.cbs.oncomment(this.sectionStart, this.index, 0);
      this.state = State.Text;
      this.sectionStart = this.index + 1;
    } else if (c === CharCodes2.Dash) {
      this.state = State.BeforeComment;
    } else {
      this.state = State.InSpecialComment;
    }
  }
  /**
   * Continue matching `doctype` after `<!d`.
   *
   * A full `doctype` match stays on the declaration path; any other name falls
   * back to an HTML bogus comment, which matches browser behavior for
   * non-doctype `<!...>` constructs.
   * @param c Current character code point.
   */
  stateDeclarationSequence(c) {
    if (this.sequenceIndex === this.currentSequence.length) {
      this.state = State.InDeclaration;
      this.stateInDeclaration(c);
    } else if ((c | 32) === this.currentSequence[this.sequenceIndex]) {
      this.sequenceIndex += 1;
    } else if (c === CharCodes2.Gt) {
      this.cbs.oncomment(this.sectionStart, this.index, 0);
      this.state = State.Text;
      this.sectionStart = this.index + 1;
    } else {
      this.state = State.InSpecialComment;
    }
  }
  stateInDeclaration(c) {
    if (c === CharCodes2.Gt || this.fastForwardTo(CharCodes2.Gt)) {
      this.cbs.ondeclaration(this.sectionStart, this.index);
      this.state = State.Text;
      this.sectionStart = this.index + 1;
    }
  }
  /**
   * XML processing instructions (`<?...?>`).
   *
   * In HTML mode `<?` is routed to `InSpecialComment` instead, so this
   * state is only reachable in XML mode.
   * @param c Current character code point.
   */
  stateInProcessingInstruction(c) {
    if (c === CharCodes2.Questionmark) {
      this.sequenceIndex = 1;
    } else if (c === CharCodes2.Gt && this.sequenceIndex === 1) {
      this.cbs.onprocessinginstruction(this.sectionStart, this.index - 1);
      this.sequenceIndex = 0;
      this.state = State.Text;
      this.sectionStart = this.index + 1;
    } else {
      this.sequenceIndex = Number(this.fastForwardTo(CharCodes2.Questionmark));
    }
  }
  stateBeforeComment(c) {
    if (c === CharCodes2.Dash) {
      this.state = State.InCommentLike;
      this.currentSequence = Sequences.CommentEnd;
      this.sequenceIndex = 0;
      this.sectionStart = this.index + 1;
    } else if (this.xmlMode) {
      this.state = State.InDeclaration;
    } else if (c === CharCodes2.Gt) {
      this.cbs.oncomment(this.sectionStart, this.index, 0);
      this.state = State.Text;
      this.sectionStart = this.index + 1;
    } else {
      this.state = State.InSpecialComment;
    }
  }
  stateInSpecialComment(c) {
    if (c === CharCodes2.Gt || this.fastForwardTo(CharCodes2.Gt)) {
      this.cbs.oncomment(this.sectionStart, this.index, 0);
      this.state = State.Text;
      this.sectionStart = this.index + 1;
    }
  }
  startEntity() {
    this.baseState = this.state;
    this.state = State.InEntity;
    this.entityStart = this.index;
    this.entityDecoder.startEntity(this.xmlMode ? DecodingMode.Strict : this.baseState === State.Text || this.baseState === State.InSpecialTag ? DecodingMode.Legacy : DecodingMode.Attribute);
  }
  stateInEntity() {
    const indexInBuffer = this.index - this.offset;
    const length = this.entityDecoder.write(this.buffer, indexInBuffer);
    if (length >= 0) {
      this.state = this.baseState;
      if (length === 0) {
        this.index -= 1;
      }
    } else {
      if (indexInBuffer < this.buffer.length && this.buffer.charCodeAt(indexInBuffer) === CharCodes2.Amp) {
        this.state = this.baseState;
        this.index -= 1;
        return;
      }
      this.index = this.offset + this.buffer.length - 1;
    }
  }
  /**
   * Remove data that has already been consumed from the buffer.
   */
  cleanup() {
    if (this.running && this.sectionStart !== this.index) {
      if (this.state === State.Text || this.state === State.InPlainText || this.state === State.InSpecialTag && this.sequenceIndex === 0) {
        this.cbs.ontext(this.sectionStart, this.index);
        this.sectionStart = this.index;
      } else if (this.state === State.InAttributeValueDq || this.state === State.InAttributeValueSq || this.state === State.InAttributeValueNq) {
        this.cbs.onattribdata(this.sectionStart, this.index);
        this.sectionStart = this.index;
      }
    }
  }
  shouldContinue() {
    return this.index < this.buffer.length + this.offset && this.running;
  }
  /**
   * Iterates through the buffer, calling the function corresponding to the current state.
   *
   * States that are more likely to be hit are higher up, as a performance improvement.
   */
  parse() {
    while (this.shouldContinue()) {
      const c = this.buffer.charCodeAt(this.index - this.offset);
      switch (this.state) {
        case State.Text: {
          this.stateText(c);
          break;
        }
        case State.InPlainText: {
          this.index = this.buffer.length + this.offset - 1;
          break;
        }
        case State.SpecialStartSequence: {
          this.stateSpecialStartSequence(c);
          break;
        }
        case State.InSpecialTag: {
          this.stateInSpecialTag(c);
          break;
        }
        case State.CDATASequence: {
          this.stateCDATASequence(c);
          break;
        }
        case State.DeclarationSequence: {
          this.stateDeclarationSequence(c);
          break;
        }
        case State.InAttributeValueDq: {
          this.stateInAttributeValueDoubleQuotes(c);
          break;
        }
        case State.InAttributeName: {
          this.stateInAttributeName(c);
          break;
        }
        case State.InCommentLike: {
          this.stateInCommentLike(c);
          break;
        }
        case State.InSpecialComment: {
          this.stateInSpecialComment(c);
          break;
        }
        case State.BeforeAttributeName: {
          this.stateBeforeAttributeName(c);
          break;
        }
        case State.InTagName: {
          this.stateInTagName(c);
          break;
        }
        case State.InClosingTagName: {
          this.stateInClosingTagName(c);
          break;
        }
        case State.BeforeTagName: {
          this.stateBeforeTagName(c);
          break;
        }
        case State.AfterAttributeName: {
          this.stateAfterAttributeName(c);
          break;
        }
        case State.InAttributeValueSq: {
          this.stateInAttributeValueSingleQuotes(c);
          break;
        }
        case State.BeforeAttributeValue: {
          this.stateBeforeAttributeValue(c);
          break;
        }
        case State.BeforeClosingTagName: {
          this.stateBeforeClosingTagName(c);
          break;
        }
        case State.AfterClosingTagName: {
          this.stateAfterClosingTagName(c);
          break;
        }
        case State.InAttributeValueNq: {
          this.stateInAttributeValueNoQuotes(c);
          break;
        }
        case State.InSelfClosingTag: {
          this.stateInSelfClosingTag(c);
          break;
        }
        case State.InDeclaration: {
          this.stateInDeclaration(c);
          break;
        }
        case State.BeforeDeclaration: {
          this.stateBeforeDeclaration(c);
          break;
        }
        case State.BeforeComment: {
          this.stateBeforeComment(c);
          break;
        }
        case State.InProcessingInstruction: {
          this.stateInProcessingInstruction(c);
          break;
        }
        case State.InEntity: {
          this.stateInEntity();
          break;
        }
      }
      this.index++;
    }
    this.cleanup();
  }
  finish() {
    if (this.state === State.InEntity) {
      this.entityDecoder.end();
      this.state = this.baseState;
    }
    this.handleTrailingData();
    this.cbs.onend();
  }
  handleTrailingCommentLikeData(endIndex) {
    if (this.state !== State.InCommentLike) {
      return false;
    }
    if (this.currentSequence === Sequences.CdataEnd) {
      if (this.xmlMode) {
        if (this.sectionStart < endIndex) {
          this.cbs.oncdata(this.sectionStart, endIndex, 0);
        }
      } else {
        const cdataStart = this.sectionStart - Sequences.Cdata.length - 1;
        this.cbs.oncomment(cdataStart, endIndex, 0);
      }
    } else {
      const offset = this.xmlMode ? 0 : Math.min(this.sequenceIndex, Sequences.CommentEnd.length - 1);
      this.cbs.oncomment(this.sectionStart, endIndex, offset);
    }
    return true;
  }
  handleTrailingMarkupDeclaration(endIndex) {
    if (this.xmlMode) {
      switch (this.state) {
        case State.InSpecialComment:
        case State.BeforeComment:
        case State.CDATASequence:
        case State.DeclarationSequence:
        case State.InDeclaration: {
          this.cbs.ontext(this.sectionStart, endIndex);
          return true;
        }
        default: {
          return false;
        }
      }
    }
    switch (this.state) {
      case State.BeforeDeclaration:
      case State.InSpecialComment:
      case State.BeforeComment:
      case State.CDATASequence: {
        this.cbs.oncomment(this.sectionStart, endIndex, 0);
        return true;
      }
      case State.DeclarationSequence: {
        if (this.sequenceIndex !== Sequences.Doctype.length) {
          this.cbs.oncomment(this.sectionStart, endIndex, 0);
        }
        return true;
      }
      case State.InDeclaration: {
        return true;
      }
      default: {
        return false;
      }
    }
  }
  /** Handle any trailing data. */
  handleTrailingData() {
    const endIndex = this.buffer.length + this.offset;
    if (this.handleTrailingCommentLikeData(endIndex) || this.handleTrailingMarkupDeclaration(endIndex)) {
      return;
    }
    if (this.sectionStart >= endIndex) {
      return;
    }
    switch (this.state) {
      case State.InTagName:
      case State.BeforeAttributeName:
      case State.BeforeAttributeValue:
      case State.AfterAttributeName:
      case State.InAttributeName:
      case State.InAttributeValueSq:
      case State.InAttributeValueDq:
      case State.InAttributeValueNq:
      case State.InClosingTagName: {
        break;
      }
      default: {
        this.cbs.ontext(this.sectionStart, endIndex);
      }
    }
  }
  emitCodePoint(cp, consumed) {
    if (this.baseState !== State.Text && this.baseState !== State.InSpecialTag) {
      if (this.sectionStart < this.entityStart) {
        this.cbs.onattribdata(this.sectionStart, this.entityStart);
      }
      this.sectionStart = this.entityStart + consumed;
      this.index = this.sectionStart - 1;
      this.cbs.onattribentity(cp);
    } else {
      if (this.sectionStart < this.entityStart) {
        this.cbs.ontext(this.sectionStart, this.entityStart);
      }
      this.sectionStart = this.entityStart + consumed;
      this.index = this.sectionStart - 1;
      this.cbs.ontextentity(cp, this.sectionStart);
    }
  }
};

// node_modules/.pnpm/htmlparser2@12.0.0/node_modules/htmlparser2/dist/Parser.js
var { fromCodePoint } = String;
var formTags = /* @__PURE__ */ new Set([
  "input",
  "option",
  "optgroup",
  "select",
  "button",
  "datalist",
  "textarea"
]);
var pTag = /* @__PURE__ */ new Set(["p"]);
var headingTags = /* @__PURE__ */ new Set(["h1", "h2", "h3", "h4", "h5", "h6", "p"]);
var tableSectionTags = /* @__PURE__ */ new Set(["thead", "tbody"]);
var ddtTags = /* @__PURE__ */ new Set(["dd", "dt"]);
var rtpTags = /* @__PURE__ */ new Set(["rt", "rp"]);
var openImpliesClose = /* @__PURE__ */ new Map([
  ["tr", /* @__PURE__ */ new Set(["tr", "th", "td"])],
  ["th", /* @__PURE__ */ new Set(["th"])],
  ["td", /* @__PURE__ */ new Set(["thead", "th", "td"])],
  ["body", /* @__PURE__ */ new Set(["head", "link", "script"])],
  ["a", /* @__PURE__ */ new Set(["a"])],
  ["li", /* @__PURE__ */ new Set(["li"])],
  ["p", pTag],
  ["h1", headingTags],
  ["h2", headingTags],
  ["h3", headingTags],
  ["h4", headingTags],
  ["h5", headingTags],
  ["h6", headingTags],
  ["select", formTags],
  ["input", formTags],
  ["output", formTags],
  ["button", formTags],
  ["datalist", formTags],
  ["textarea", formTags],
  ["option", /* @__PURE__ */ new Set(["option"])],
  ["optgroup", /* @__PURE__ */ new Set(["optgroup", "option"])],
  ["dd", ddtTags],
  ["dt", ddtTags],
  ["address", pTag],
  ["article", pTag],
  ["aside", pTag],
  ["blockquote", pTag],
  ["details", pTag],
  ["div", pTag],
  ["dl", pTag],
  ["fieldset", pTag],
  ["figcaption", pTag],
  ["figure", pTag],
  ["footer", pTag],
  ["form", pTag],
  ["header", pTag],
  ["hr", pTag],
  ["main", pTag],
  ["nav", pTag],
  ["ol", pTag],
  ["pre", pTag],
  ["section", pTag],
  ["table", pTag],
  ["ul", pTag],
  ["rt", rtpTags],
  ["rp", rtpTags],
  ["tbody", tableSectionTags],
  ["tfoot", tableSectionTags]
]);
var DOCUMENT_TYPE = "doctype";
var voidElements = /* @__PURE__ */ new Set([
  "area",
  "base",
  "basefont",
  "br",
  "col",
  "command",
  "embed",
  "frame",
  "hr",
  "img",
  "input",
  "isindex",
  "keygen",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr"
]);
var foreignContextElements = /* @__PURE__ */ new Set(["math", "svg"]);
var htmlIntegrationElements = /* @__PURE__ */ new Set([
  "mi",
  "mo",
  "mn",
  "ms",
  "mtext",
  "annotation-xml",
  "foreignObject",
  "desc",
  "title"
]);
var svgTagNameAdjustments = /* @__PURE__ */ new Map([
  ["altglyph", "altGlyph"],
  ["altglyphdef", "altGlyphDef"],
  ["altglyphitem", "altGlyphItem"],
  ["animatecolor", "animateColor"],
  ["animatemotion", "animateMotion"],
  ["animatetransform", "animateTransform"],
  ["clippath", "clipPath"],
  ["feblend", "feBlend"],
  ["fecolormatrix", "feColorMatrix"],
  ["fecomponenttransfer", "feComponentTransfer"],
  ["fecomposite", "feComposite"],
  ["feconvolvematrix", "feConvolveMatrix"],
  ["fediffuselighting", "feDiffuseLighting"],
  ["fedisplacementmap", "feDisplacementMap"],
  ["fedistantlight", "feDistantLight"],
  ["fedropshadow", "feDropShadow"],
  ["feflood", "feFlood"],
  ["fefunca", "feFuncA"],
  ["fefuncb", "feFuncB"],
  ["fefuncg", "feFuncG"],
  ["fefuncr", "feFuncR"],
  ["fegaussianblur", "feGaussianBlur"],
  ["feimage", "feImage"],
  ["femerge", "feMerge"],
  ["femergenode", "feMergeNode"],
  ["femorphology", "feMorphology"],
  ["feoffset", "feOffset"],
  ["fepointlight", "fePointLight"],
  ["fespecularlighting", "feSpecularLighting"],
  ["fespotlight", "feSpotLight"],
  ["fetile", "feTile"],
  ["feturbulence", "feTurbulence"],
  ["foreignobject", "foreignObject"],
  ["glyphref", "glyphRef"],
  ["lineargradient", "linearGradient"],
  ["radialgradient", "radialGradient"],
  ["textpath", "textPath"]
]);
var ForeignContext;
(function(ForeignContext2) {
  ForeignContext2[ForeignContext2["None"] = 0] = "None";
  ForeignContext2[ForeignContext2["Svg"] = 1] = "Svg";
  ForeignContext2[ForeignContext2["MathML"] = 2] = "MathML";
})(ForeignContext || (ForeignContext = {}));
var reNameEnd = /\s|\//;
var Parser = class {
  options;
  /** The start index of the last event. */
  startIndex = 0;
  /** The end index of the last event. */
  endIndex = 0;
  /**
   * Store the start index of the current open tag,
   * so we can update the start index for attributes.
   */
  openTagStart = 0;
  tagname = "";
  attribname = "";
  attribvalue = "";
  attribs = null;
  stack = [];
  foreignContext;
  cbs;
  lowerCaseTagNames;
  lowerCaseAttributeNames;
  recognizeSelfClosing;
  /** We are parsing HTML. Inverse of the `xmlMode` option. */
  htmlMode;
  tokenizer;
  buffers = [];
  bufferOffset = 0;
  /** The index of the last written buffer. Used when resuming after a `pause()`. */
  writeIndex = 0;
  /** Indicates whether the parser has finished running / `.end` has been called. */
  ended = false;
  constructor(cbs, options = {}) {
    this.options = options;
    this.cbs = cbs ?? {};
    this.htmlMode = !this.options.xmlMode;
    this.lowerCaseTagNames = options.lowerCaseTags ?? this.htmlMode;
    this.lowerCaseAttributeNames = options.lowerCaseAttributeNames ?? this.htmlMode;
    this.recognizeSelfClosing = options.recognizeSelfClosing ?? !this.htmlMode;
    this.tokenizer = new (options.Tokenizer ?? Tokenizer)(this.options, this);
    this.foreignContext = [ForeignContext.None];
    this.cbs.onparserinit?.(this);
  }
  // Tokenizer event handlers
  /**
   * @param start Start index for the current parser event.
   * @param endIndex End index for the current parser event.
   * @internal
   */
  ontext(start, endIndex) {
    const data2 = this.getSlice(start, endIndex);
    this.endIndex = endIndex - 1;
    this.cbs.ontext?.(data2);
    this.startIndex = endIndex;
  }
  /**
   * @param cp Current Unicode code point.
   * @param endIndex End index for the current parser event.
   * @internal
   */
  ontextentity(cp, endIndex) {
    this.endIndex = endIndex - 1;
    this.cbs.ontext?.(fromCodePoint(cp));
    this.startIndex = endIndex;
  }
  /** @internal */
  isInForeignContext() {
    return this.foreignContext[0] !== ForeignContext.None;
  }
  /**
   * Checks if the current tag is a void element. Override this if you want
   * to specify your own additional void elements.
   * @param name Name of the pseudo selector.
   */
  isVoidElement(name) {
    return this.htmlMode && voidElements.has(name);
  }
  /**
   * Read a tag name from the buffer.
   *
   * When `lowerCaseTagNames` is enabled (the default in HTML mode), the name
   * is lowercased and may be adjusted for SVG casing or the `image` → `img`
   * alias.
   * @param start Start index of the tag name in the buffer.
   * @param endIndex End index of the tag name in the buffer.
   */
  readTagName(start, endIndex) {
    const name = this.lowerCaseTagNames ? this.getSlice(start, endIndex).toLowerCase() : this.getSlice(start, endIndex);
    if (!(this.lowerCaseTagNames && this.htmlMode)) {
      return name;
    }
    if (this.foreignContext[0] === ForeignContext.Svg) {
      return svgTagNameAdjustments.get(name) ?? name;
    }
    if (this.foreignContext.length > 1) {
      const adjusted = svgTagNameAdjustments.get(name);
      if (adjusted !== void 0 && this.stack.includes(adjusted)) {
        return adjusted;
      }
    }
    if (!this.isInForeignContext()) {
      return name === "image" ? "img" : name;
    }
    return name;
  }
  /**
   * @param start Start index for the current parser event.
   * @param endIndex End index for the current parser event.
   * @internal
   */
  onopentagname(start, endIndex) {
    this.endIndex = endIndex;
    this.emitOpenTag(this.readTagName(start, endIndex));
  }
  emitOpenTag(name) {
    this.openTagStart = this.startIndex;
    this.tagname = name;
    if (this.htmlMode && name === "form" && this.stack.includes("form")) {
      this.tagname = "";
      return;
    }
    const impliesClose = this.htmlMode && openImpliesClose.get(name);
    if (impliesClose) {
      while (this.stack.length > 0 && impliesClose.has(this.stack[0])) {
        this.popElement(true);
      }
    }
    if (!this.isVoidElement(name)) {
      this.stack.unshift(name);
      if (this.htmlMode) {
        if (name === "svg") {
          this.foreignContext.unshift(ForeignContext.Svg);
        } else if (name === "math") {
          this.foreignContext.unshift(ForeignContext.MathML);
        } else if (htmlIntegrationElements.has(name)) {
          this.foreignContext.unshift(ForeignContext.None);
        }
      }
    }
    this.cbs.onopentagname?.(name);
    if (this.cbs.onopentag)
      this.attribs = {};
  }
  endOpenTag(isImplied) {
    this.startIndex = this.openTagStart;
    if (this.attribs) {
      this.cbs.onopentag?.(this.tagname, this.attribs, isImplied);
      this.attribs = null;
    }
    if (this.cbs.onclosetag && this.isVoidElement(this.tagname)) {
      this.cbs.onclosetag(this.tagname, true);
    }
    this.tagname = "";
  }
  /**
   * @param endIndex End index for the current parser event.
   * @internal
   */
  onopentagend(endIndex) {
    this.endIndex = endIndex;
    this.endOpenTag(false);
    this.startIndex = endIndex + 1;
  }
  /**
   * @param start Start index for the current parser event.
   * @param endIndex End index for the current parser event.
   * @internal
   */
  onclosetag(start, endIndex) {
    this.endIndex = endIndex;
    const name = this.readTagName(start, endIndex);
    if (!this.isVoidElement(name)) {
      const pos = this.stack.indexOf(name);
      if (pos !== -1) {
        for (let index = 0; index < pos; index++) {
          this.popElement(true);
        }
        this.popElement(false);
      } else if (this.htmlMode && name === "p") {
        this.emitOpenTag("p");
        this.closeCurrentTag(true);
      }
    } else if (this.htmlMode && name === "br") {
      this.cbs.onopentagname?.("br");
      this.cbs.onopentag?.("br", {}, true);
      this.cbs.onclosetag?.("br", false);
    }
    this.startIndex = endIndex + 1;
  }
  /**
   * @param endIndex End index for the current parser event.
   * @internal
   */
  onselfclosingtag(endIndex) {
    this.endIndex = endIndex;
    if (this.recognizeSelfClosing || this.isInForeignContext()) {
      this.closeCurrentTag(false);
      this.startIndex = endIndex + 1;
    } else {
      this.onopentagend(endIndex);
    }
  }
  /**
   * Pop the top element off the stack, emit a close event, and maintain
   * the foreign context stack.
   * @param implied Whether this close is implied (not from an explicit end tag).
   */
  popElement(implied) {
    const element = this.stack.shift();
    if (this.htmlMode && (foreignContextElements.has(element) || htmlIntegrationElements.has(element))) {
      this.foreignContext.shift();
    }
    this.cbs.onclosetag?.(element, implied);
  }
  closeCurrentTag(isOpenImplied) {
    const name = this.tagname;
    this.endOpenTag(isOpenImplied);
    if (this.stack[0] === name) {
      this.popElement(!isOpenImplied);
    }
  }
  /**
   * @param start Start index for the current parser event.
   * @param endIndex End index for the current parser event.
   * @internal
   */
  onattribname(start, endIndex) {
    this.startIndex = start;
    const name = this.getSlice(start, endIndex);
    this.attribname = this.lowerCaseAttributeNames ? name.toLowerCase() : name;
  }
  /**
   * @param start Start index for the current parser event.
   * @param endIndex End index for the current parser event.
   * @internal
   */
  onattribdata(start, endIndex) {
    this.attribvalue += this.getSlice(start, endIndex);
  }
  /**
   * @param cp Current Unicode code point.
   * @internal
   */
  onattribentity(cp) {
    this.attribvalue += fromCodePoint(cp);
  }
  /**
   * @param quote Quote type used for the current attribute.
   * @param endIndex End index for the current parser event.
   * @internal
   */
  onattribend(quote, endIndex) {
    this.endIndex = endIndex;
    this.cbs.onattribute?.(this.attribname, this.attribvalue, quote === QuoteType.Double ? '"' : quote === QuoteType.Single ? "'" : quote === QuoteType.NoValue ? void 0 : null);
    if (this.attribs && !Object.hasOwn(this.attribs, this.attribname)) {
      this.attribs[this.attribname] = this.attribvalue;
    }
    this.attribvalue = "";
  }
  getInstructionName(value) {
    const index = value.search(reNameEnd);
    let name = index < 0 ? value : value.substr(0, index);
    if (this.lowerCaseTagNames) {
      name = name.toLowerCase();
    }
    return name;
  }
  /**
   * @param start Start index for the current parser event.
   * @param endIndex End index for the current parser event.
   * @internal
   */
  ondeclaration(start, endIndex) {
    this.endIndex = endIndex;
    const value = this.getSlice(start, endIndex);
    if (this.cbs.onprocessinginstruction) {
      const name = this.htmlMode ? this.lowerCaseTagNames ? DOCUMENT_TYPE : value.slice(0, DOCUMENT_TYPE.length) : this.getInstructionName(value);
      this.cbs.onprocessinginstruction(`!${name}`, `!${value}`);
    }
    this.startIndex = endIndex + 1;
  }
  /**
   * @param start Start index for the current parser event.
   * @param endIndex End index for the current parser event.
   * @internal
   */
  onprocessinginstruction(start, endIndex) {
    this.endIndex = endIndex;
    const value = this.getSlice(start, endIndex);
    if (this.cbs.onprocessinginstruction) {
      const name = this.getInstructionName(value);
      this.cbs.onprocessinginstruction(`?${name}`, `?${value}`);
    }
    this.startIndex = endIndex + 1;
  }
  /**
   * @param start Start index for the current parser event.
   * @param endIndex End index for the current parser event.
   * @param offset Offset applied when computing parser indices.
   * @internal
   */
  oncomment(start, endIndex, offset) {
    this.endIndex = endIndex;
    this.cbs.oncomment?.(this.getSlice(start, endIndex - offset));
    this.cbs.oncommentend?.();
    this.startIndex = endIndex + 1;
  }
  /**
   * @param start Start index for the current parser event.
   * @param endIndex End index for the current parser event.
   * @param offset Offset applied when computing parser indices.
   * @internal
   */
  oncdata(start, endIndex, offset) {
    this.endIndex = endIndex;
    const value = this.getSlice(start, endIndex - offset);
    if (!this.htmlMode || this.options.recognizeCDATA) {
      this.cbs.oncdatastart?.();
      this.cbs.ontext?.(value);
      this.cbs.oncdataend?.();
    } else if (this.isInForeignContext()) {
      this.cbs.ontext?.(value);
    } else {
      this.cbs.oncomment?.(`[CDATA[${value}]]`);
      this.cbs.oncommentend?.();
    }
    this.startIndex = endIndex + 1;
  }
  /** @internal */
  onend() {
    if (this.cbs.onclosetag) {
      this.endIndex = this.startIndex;
      for (let index = 0; index < this.stack.length; index++) {
        this.cbs.onclosetag(this.stack[index], true);
      }
    }
    this.cbs.onend?.();
  }
  /**
   * Resets the parser to a blank state, ready to parse a new HTML document
   */
  reset() {
    this.cbs.onreset?.();
    this.tokenizer.reset();
    this.tagname = "";
    this.attribname = "";
    this.attribvalue = "";
    this.attribs = null;
    this.stack.length = 0;
    this.startIndex = 0;
    this.endIndex = 0;
    this.cbs.onparserinit?.(this);
    this.buffers.length = 0;
    this.foreignContext.length = 0;
    this.foreignContext.unshift(ForeignContext.None);
    this.bufferOffset = 0;
    this.writeIndex = 0;
    this.ended = false;
  }
  /**
   * Resets the parser, then parses a complete document and
   * pushes it to the handler.
   * @param data Document to parse.
   */
  parseComplete(data2) {
    this.reset();
    this.end(data2);
  }
  getSlice(start, end) {
    if (start === end) {
      return "";
    }
    while (start - this.bufferOffset >= this.buffers[0].length) {
      this.shiftBuffer();
    }
    let slice = this.buffers[0].slice(start - this.bufferOffset, end - this.bufferOffset);
    while (end - this.bufferOffset > this.buffers[0].length) {
      this.shiftBuffer();
      slice += this.buffers[0].slice(0, end - this.bufferOffset);
    }
    return slice;
  }
  shiftBuffer() {
    this.bufferOffset += this.buffers[0].length;
    this.writeIndex--;
    this.buffers.shift();
  }
  /**
   * Parses a chunk of data and calls the corresponding callbacks.
   * @param chunk Chunk to parse.
   */
  write(chunk) {
    if (this.ended) {
      this.cbs.onerror?.(new Error(".write() after done!"));
      return;
    }
    this.buffers.push(chunk);
    if (this.tokenizer.running) {
      this.tokenizer.write(chunk);
      this.writeIndex++;
    }
  }
  /**
   * Parses the end of the buffer and clears the stack, calls onend.
   * @param chunk Optional final chunk to parse.
   */
  end(chunk) {
    if (this.ended) {
      this.cbs.onerror?.(new Error(".end() after done!"));
      return;
    }
    if (chunk)
      this.write(chunk);
    this.ended = true;
    this.tokenizer.end();
  }
  /**
   * Pauses parsing. The parser won't emit events until `resume` is called.
   */
  pause() {
    this.tokenizer.pause();
  }
  /**
   * Resumes parsing after `pause` was called.
   */
  resume() {
    this.tokenizer.resume();
    while (this.tokenizer.running && this.writeIndex < this.buffers.length) {
      this.tokenizer.write(this.buffers[this.writeIndex++]);
    }
    if (this.ended)
      this.tokenizer.end();
  }
};

// node_modules/.pnpm/domelementtype@3.0.0/node_modules/domelementtype/dist/index.js
var ElementType;
(function(ElementType2) {
  ElementType2["Root"] = "root";
  ElementType2["Text"] = "text";
  ElementType2["Directive"] = "directive";
  ElementType2["Comment"] = "comment";
  ElementType2["Script"] = "script";
  ElementType2["Style"] = "style";
  ElementType2["Tag"] = "tag";
  ElementType2["CDATA"] = "cdata";
  ElementType2["Doctype"] = "doctype";
})(ElementType || (ElementType = {}));
function isTag(element) {
  return element.type === ElementType.Tag || element.type === ElementType.Script || element.type === ElementType.Style;
}
var Root = ElementType.Root;
var Text = ElementType.Text;
var Directive = ElementType.Directive;
var Comment = ElementType.Comment;
var Script = ElementType.Script;
var Style = ElementType.Style;
var Tag = ElementType.Tag;
var CDATA = ElementType.CDATA;
var Doctype = ElementType.Doctype;

// node_modules/.pnpm/domhandler@6.0.1/node_modules/domhandler/dist/node.js
var Node = class {
  /** Parent of the node */
  parent = null;
  /** Previous sibling */
  prev = null;
  /** Next sibling */
  next = null;
  /** The start index of the node. Requires `withStartIndices` on the handler to be `true. */
  startIndex = null;
  /** The end index of the node. Requires `withEndIndices` on the handler to be `true. */
  endIndex = null;
  // Read-write aliases for properties
  /**
   * Same as {@link parent}.
   * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
   */
  get parentNode() {
    return this.parent;
  }
  set parentNode(parent) {
    this.parent = parent;
  }
  /**
   * Same as {@link prev}.
   * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
   */
  get previousSibling() {
    return this.prev;
  }
  set previousSibling(previous) {
    this.prev = previous;
  }
  /**
   * Same as {@link next}.
   * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
   */
  get nextSibling() {
    return this.next;
  }
  set nextSibling(next) {
    this.next = next;
  }
  /**
   * Clone this node, and optionally its children.
   * @param recursive Clone child nodes as well.
   * @returns A clone of the node.
   */
  cloneNode(recursive = false) {
    return cloneNode(this, recursive);
  }
};
var DataNode = class extends Node {
  data;
  /**
   * @param data The content of the data node
   */
  constructor(data2) {
    super();
    this.data = data2;
  }
  /**
   * Same as {@link data}.
   * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
   */
  get nodeValue() {
    return this.data;
  }
  set nodeValue(data2) {
    this.data = data2;
  }
};
var Text2 = class extends DataNode {
  type = ElementType.Text;
  get nodeType() {
    return 3;
  }
};
var Comment2 = class extends DataNode {
  type = ElementType.Comment;
  get nodeType() {
    return 8;
  }
};
var ProcessingInstruction = class extends DataNode {
  type = ElementType.Directive;
  name;
  constructor(name, data2) {
    super(data2);
    this.name = name;
  }
  get nodeType() {
    return 1;
  }
  /** If this is a doctype, the document type name (parse5 only). */
  "x-name";
  /** If this is a doctype, the document type public identifier (parse5 only). */
  "x-publicId";
  /** If this is a doctype, the document type system identifier (parse5 only). */
  "x-systemId";
};
var NodeWithChildren = class extends Node {
  children;
  /**
   * @param children Children of the node. Only certain node types can have children.
   */
  constructor(children) {
    super();
    this.children = children;
  }
  // Aliases
  /** First child of the node. */
  get firstChild() {
    return this.children[0] ?? null;
  }
  /** Last child of the node. */
  get lastChild() {
    return this.children.length > 0 ? this.children[this.children.length - 1] : null;
  }
  /**
   * Same as {@link children}.
   * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
   */
  get childNodes() {
    return this.children;
  }
  set childNodes(children) {
    this.children = children;
  }
};
var CDATA2 = class extends NodeWithChildren {
  type = ElementType.CDATA;
  get nodeType() {
    return 4;
  }
};
var Document = class extends NodeWithChildren {
  type = ElementType.Root;
  get nodeType() {
    return 9;
  }
};
var Element = class extends NodeWithChildren {
  name;
  attribs;
  type;
  /**
   * @param name Name of the tag, eg. `div`, `span`.
   * @param attribs Object mapping attribute names to attribute values.
   * @param children Children of the node.
   * @param type Node type used for the new node instance.
   */
  constructor(name, attribs, children = [], type = name === "script" ? ElementType.Script : name === "style" ? ElementType.Style : ElementType.Tag) {
    super(children);
    this.name = name;
    this.attribs = attribs;
    this.type = type;
  }
  get nodeType() {
    return 1;
  }
  // DOM Level 1 aliases
  /**
   * Same as {@link name}.
   * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
   */
  get tagName() {
    return this.name;
  }
  set tagName(name) {
    this.name = name;
  }
  get attributes() {
    return Object.keys(this.attribs).map((name) => ({
      name,
      value: this.attribs[name],
      namespace: this["x-attribsNamespace"]?.[name],
      prefix: this["x-attribsPrefix"]?.[name]
    }));
  }
  /** Element namespace (parse5 only). */
  namespace;
  /** Element attribute namespaces (parse5 only). */
  "x-attribsNamespace";
  /** Element attribute namespace-related prefixes (parse5 only). */
  "x-attribsPrefix";
};
function isTag2(node) {
  return isTag(node);
}
function isCDATA(node) {
  return node.type === ElementType.CDATA;
}
function isText(node) {
  return node.type === ElementType.Text;
}
function isComment(node) {
  return node.type === ElementType.Comment;
}
function isDirective(node) {
  return node.type === ElementType.Directive;
}
function isDocument(node) {
  return node.type === ElementType.Root;
}
function cloneNode(node, recursive = false) {
  let result;
  if (isText(node)) {
    result = new Text2(node.data);
  } else if (isComment(node)) {
    result = new Comment2(node.data);
  } else if (isTag2(node)) {
    const children = recursive ? cloneChildren(node.children) : [];
    const clone = new Element(node.name, { ...node.attribs }, children);
    for (const child of children) {
      child.parent = clone;
    }
    if (node.namespace != null) {
      clone.namespace = node.namespace;
    }
    if (node["x-attribsNamespace"]) {
      clone["x-attribsNamespace"] = { ...node["x-attribsNamespace"] };
    }
    if (node["x-attribsPrefix"]) {
      clone["x-attribsPrefix"] = { ...node["x-attribsPrefix"] };
    }
    result = clone;
  } else if (isCDATA(node)) {
    const children = recursive ? cloneChildren(node.children) : [];
    const clone = new CDATA2(children);
    for (const child of children) {
      child.parent = clone;
    }
    result = clone;
  } else if (isDocument(node)) {
    const children = recursive ? cloneChildren(node.children) : [];
    const clone = new Document(children);
    for (const child of children) {
      child.parent = clone;
    }
    if (node["x-mode"]) {
      clone["x-mode"] = node["x-mode"];
    }
    result = clone;
  } else if (isDirective(node)) {
    const instruction = new ProcessingInstruction(node.name, node.data);
    if (node["x-name"] != null) {
      instruction["x-name"] = node["x-name"];
      instruction["x-publicId"] = node["x-publicId"];
      instruction["x-systemId"] = node["x-systemId"];
    }
    result = instruction;
  } else {
    throw new Error(`Not implemented yet: ${node.type}`);
  }
  result.startIndex = node.startIndex;
  result.endIndex = node.endIndex;
  if (node.sourceCodeLocation != null) {
    result.sourceCodeLocation = node.sourceCodeLocation;
  }
  return result;
}
function cloneChildren(childs) {
  const children = childs.map((child) => cloneNode(child, true));
  for (let index = 1; index < children.length; index++) {
    children[index].prev = children[index - 1];
    children[index - 1].next = children[index];
  }
  return children;
}

// node_modules/.pnpm/domhandler@6.0.1/node_modules/domhandler/dist/index.js
var defaultOptions = {
  withStartIndices: false,
  withEndIndices: false,
  xmlMode: false
};
var DomHandler = class {
  /** The elements of the DOM */
  dom = [];
  /** The root element for the DOM */
  root = new Document(this.dom);
  /** Called once parsing has completed. */
  callback;
  /** Settings for the handler. */
  options;
  /** Callback whenever a tag is closed. */
  elementCB;
  /** Indicated whether parsing has been completed. */
  done = false;
  /** Stack of open tags. */
  tagStack = [this.root];
  /** A data node that is still being written to. */
  lastNode = null;
  /** Reference to the parser instance. Used for location information. */
  parser = null;
  /**
   * @param callback Called once parsing has completed.
   * @param options Settings for the handler.
   * @param elementCB Callback whenever a tag is closed.
   */
  constructor(callback, options, elementCB) {
    if (typeof options === "function") {
      elementCB = options;
      options = defaultOptions;
    }
    if (typeof callback === "object") {
      options = callback;
      callback = void 0;
    }
    this.callback = callback ?? null;
    this.options = options ?? defaultOptions;
    this.elementCB = elementCB ?? null;
  }
  onparserinit(parser) {
    this.parser = parser;
  }
  // Resets the handler back to starting state
  onreset() {
    this.dom = [];
    this.root = new Document(this.dom);
    this.done = false;
    this.tagStack = [this.root];
    this.lastNode = null;
    this.parser = null;
  }
  // Signals the handler that parsing is done
  onend() {
    if (this.done)
      return;
    this.done = true;
    this.parser = null;
    this.handleCallback(null);
  }
  onerror(error) {
    this.handleCallback(error);
  }
  onclosetag() {
    this.lastNode = null;
    const element = this.tagStack.pop();
    if (this.options.withEndIndices && this.parser) {
      element.endIndex = this.parser.endIndex;
    }
    if (this.elementCB)
      this.elementCB(element);
  }
  onopentag(name, attribs) {
    const type = this.options.xmlMode ? ElementType.Tag : void 0;
    const element = new Element(name, attribs, void 0, type);
    this.addNode(element);
    this.tagStack.push(element);
  }
  ontext(data2) {
    const { lastNode } = this;
    if (lastNode && lastNode.type === ElementType.Text) {
      lastNode.data += data2;
      if (this.options.withEndIndices && this.parser) {
        lastNode.endIndex = this.parser.endIndex;
      }
    } else {
      const node = new Text2(data2);
      this.addNode(node);
      this.lastNode = node;
    }
  }
  oncomment(data2) {
    if (this.lastNode && this.lastNode.type === ElementType.Comment) {
      this.lastNode.data += data2;
      return;
    }
    const node = new Comment2(data2);
    this.addNode(node);
    this.lastNode = node;
  }
  oncommentend() {
    this.lastNode = null;
  }
  oncdatastart() {
    const text = new Text2("");
    const node = new CDATA2([text]);
    this.addNode(node);
    text.parent = node;
    this.lastNode = text;
  }
  oncdataend() {
    this.lastNode = null;
  }
  onprocessinginstruction(name, data2) {
    const node = new ProcessingInstruction(name, data2);
    this.addNode(node);
  }
  handleCallback(error) {
    if (typeof this.callback === "function") {
      this.callback(error, this.dom);
    } else if (error) {
      throw error;
    }
  }
  addNode(node) {
    const parent = this.tagStack[this.tagStack.length - 1];
    const previousSibling = parent.children[parent.children.length - 1];
    if (this.options.withStartIndices && this.parser) {
      node.startIndex = this.parser.startIndex;
    }
    if (this.options.withEndIndices && this.parser) {
      node.endIndex = this.parser.endIndex;
    }
    parent.children.push(node);
    if (previousSibling) {
      node.prev = previousSibling;
      previousSibling.next = node;
    }
    node.parent = parent;
    this.lastNode = null;
  }
};

// node_modules/.pnpm/htmlparser2@12.0.0/node_modules/htmlparser2/dist/index.js
function parseDocument(data2, options) {
  const handler = new DomHandler(void 0, options);
  new Parser(handler, options).end(data2);
  return handler.root;
}

// src/parse/html.ts
function lineStartsOf(source) {
  const starts = [0];
  for (let i = 0; i < source.length; i++) if (source.charCodeAt(i) === 10) starts.push(i + 1);
  return starts;
}
function lineColAt(lineStarts, offset) {
  let lo = 0;
  let hi = lineStarts.length - 1;
  while (lo < hi) {
    const mid = lo + hi + 1 >> 1;
    if (lineStarts[mid] <= offset) lo = mid;
    else hi = mid - 1;
  }
  return { line: lo + 1, col: offset - lineStarts[lo] + 1 };
}
function parseHtml(source, file, lossy = false) {
  const dom = parseDocument(source, {
    withStartIndices: true,
    withEndIndices: true,
    lowerCaseTags: true,
    lowerCaseAttributeNames: true,
    recognizeSelfClosing: true
  });
  const lineStarts = lineStartsOf(source);
  const elements = [];
  const byId2 = /* @__PURE__ */ new Map();
  const convert = (node, parent) => {
    if (node.type === "text") {
      return { type: "text", data: node.data, parent };
    }
    if (node.type === "tag" || node.type === "script" || node.type === "style") {
      const dh = node;
      const start = dh.startIndex ?? 0;
      const { line, col } = lineColAt(lineStarts, start);
      const el = {
        type: "element",
        tag: dh.name.toLowerCase(),
        attribs: { ...dh.attribs },
        children: [],
        parent,
        line,
        col,
        start,
        end: dh.endIndex ?? start
      };
      elements.push(el);
      const id = el.attribs.id;
      if (id && !byId2.has(id)) byId2.set(id, el);
      for (const child of dh.children) {
        const c = convert(child, el);
        if (c) el.children.push(c);
      }
      return el;
    }
    return null;
  };
  const roots = [];
  for (const node of dom.children) {
    const c = convert(node, null);
    if (c) roots.push(c);
  }
  return { file, source, lossy, kind: lossy ? "jsx-lossy" : "html", roots, elements, byId: byId2, lineStarts };
}
function attr(el, name) {
  return el.attribs[name.toLowerCase()];
}
function hasAttr(el, name) {
  return name.toLowerCase() in el.attribs;
}
function textContent(node) {
  if (node.type === "text") return node.data;
  let out = "";
  for (const c of node.children) out += textContent(c);
  return out;
}
function visibleText(el) {
  return textContent(el).replace(/\s+/g, " ").trim();
}
function descendants(el) {
  const out = [];
  const stack = [...el.children];
  while (stack.length) {
    const n = stack.pop();
    if (n.type === "element") {
      out.push(n);
      stack.push(...n.children);
    }
  }
  return out;
}
function ancestors(el) {
  const out = [];
  let p = el.parent;
  while (p) {
    out.push(p);
    p = p.parent;
  }
  return out;
}
function elementsByTag(doc, ...tags) {
  const want = new Set(tags.map((t2) => t2.toLowerCase()));
  return doc.elements.filter((e) => want.has(e.tag));
}
function allIds(doc) {
  const out = [];
  for (const el of doc.elements) {
    const id = el.attribs.id;
    if (id) out.push({ id, el });
  }
  return out;
}
function snippet(doc, el, max = 120) {
  const lineStart = doc.lineStarts[el.line - 1] ?? 0;
  let end = doc.source.indexOf("\n", lineStart);
  if (end === -1) end = doc.source.length;
  const raw = doc.source.slice(lineStart, end).trim();
  return raw.length > max ? raw.slice(0, max - 1) + "\u2026" : raw;
}

// src/parse/jsx.ts
function jsxToHtml(source) {
  let s = source;
  s = s.replace(/\{\/\*[\s\S]*?\*\/\}/g, " ");
  s = s.replace(/\bclassName=/g, "class=");
  s = s.replace(/\bhtmlFor=/g, "for=");
  s = s.replace(/\btabIndex=/g, "tabindex=");
  return s;
}

// node_modules/.pnpm/@babel+parser@8.0.0/node_modules/@babel/parser/lib/index.js
var Position = class {
  constructor(line, col, index) {
    this.line = void 0;
    this.column = void 0;
    if (index !== void 0) this.index = void 0;
    this.line = line;
    this.column = col;
    if (index !== void 0) this.index = index;
  }
};
var SourceLocation = class {
  start;
  end;
  filename;
  identifierName;
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }
};
function createPositionWithColumnOffset(position, columnOffset) {
  const {
    line,
    column,
    index
  } = position;
  return new Position(line, column + columnOffset, index + columnOffset);
}
var code = "BABEL_PARSER_SOURCETYPE_MODULE_REQUIRED";
var ModuleErrors = {
  ImportMetaOutsideModule: {
    message: `import.meta may appear only with 'sourceType: "module"'`,
    code
  },
  ImportOutsideModule: {
    message: `'import' and 'export' may appear only with 'sourceType: "module"'`,
    code
  }
};
var NodeDescriptions = {
  ArrayPattern: "array destructuring pattern",
  AssignmentExpression: "assignment expression",
  AssignmentPattern: "assignment expression",
  ArrowFunctionExpression: "arrow function expression",
  ConditionalExpression: "conditional expression",
  CatchClause: "catch clause",
  ForOfStatement: "for-of statement",
  ForInStatement: "for-in statement",
  ForStatement: "for-loop",
  FormalParameters: "function parameter list",
  Identifier: "identifier",
  ImportSpecifier: "import specifier",
  ImportDefaultSpecifier: "import default specifier",
  ImportNamespaceSpecifier: "import namespace specifier",
  ObjectPattern: "object destructuring pattern",
  ParenthesizedExpression: "parenthesized expression",
  RestElement: "rest element",
  UpdateExpression: {
    true: "prefix operation",
    false: "postfix operation"
  },
  VariableDeclarator: "variable declaration",
  YieldExpression: "yield expression"
};
var toNodeDescription = (node) => node.type === "UpdateExpression" ? NodeDescriptions.UpdateExpression[`${node.prefix}`] : NodeDescriptions[node.type];
var StandardErrors = {
  AccessorIsGenerator: ({
    kind
  }) => `A ${kind}ter cannot be a generator.`,
  ArgumentsInClass: "'arguments' is only allowed in functions and class methods.",
  AsyncFunctionInSingleStatementContext: "Async functions can only be declared at the top level or inside a block.",
  AwaitBindingIdentifier: "Can not use 'await' as identifier inside an async function.",
  AwaitBindingIdentifierInStaticBlock: "Can not use 'await' as identifier inside a static block.",
  AwaitExpressionFormalParameter: "'await' is not allowed in async function parameters.",
  AwaitUsingNotInAsyncContext: "'await using' is only allowed within async functions and at the top levels of modules.",
  AwaitNotInAsyncContext: "'await' is only allowed within async functions and at the top levels of modules.",
  BadGetterArity: "A 'get' accessor must not have any formal parameters.",
  BadSetterArity: "A 'set' accessor must have exactly one formal parameter.",
  BadSetterRestParameter: "A 'set' accessor function argument must not be a rest parameter.",
  ConstructorClassField: "Classes may not have a field named 'constructor'.",
  ConstructorClassPrivateField: "Classes may not have a private field named '#constructor'.",
  ConstructorIsAccessor: "Class constructor may not be an accessor.",
  ConstructorIsAsync: "Constructor can't be an async function.",
  ConstructorIsGenerator: "Constructor can't be a generator.",
  DeclarationMissingInitializer: ({
    kind
  }) => `Missing initializer in ${kind} declaration.`,
  DecoratorArgumentsOutsideParentheses: "Decorator arguments must be moved inside parentheses: use '@(decorator(args))' instead of '@(decorator)(args)'.",
  DecoratorsBeforeAfterExport: "Decorators can be placed *either* before or after the 'export' keyword, but not in both locations at the same time.",
  DecoratorConstructor: "Decorators can't be used with a constructor. Did you mean '@dec class { ... }'?",
  DecoratorSemicolon: "Decorators must not be followed by a semicolon.",
  DecoratorStaticBlock: "Decorators can't be used with a static block.",
  DeferImportRequiresNamespace: 'Only `import defer * as x from "./module"` is valid.',
  DeletePrivateField: "Deleting a private field is not allowed.",
  DestructureNamedImport: "ES2015 named imports do not destructure. Use another statement for destructuring after the import.",
  DuplicateConstructor: "Duplicate constructor in the same class.",
  DuplicateDefaultExport: "Only one default export allowed per module.",
  DuplicateExport: ({
    exportName
  }) => `\`${exportName}\` has already been exported. Exported identifiers must be unique.`,
  DuplicateProto: "Redefinition of __proto__ property.",
  DuplicateRegExpFlags: "Duplicate regular expression flag.",
  ElementAfterRest: "Rest element must be last element.",
  EscapedCharNotAnIdentifier: "Invalid Unicode escape.",
  ExportBindingIsString: ({
    localName,
    exportName
  }) => `A string literal cannot be used as an exported binding without \`from\`.
- Did you mean \`export { '${localName}' as '${exportName}' } from 'some-module'\`?`,
  ExportDefaultFromAsIdentifier: "'from' is not allowed as an identifier after 'export default'.",
  ForInOfLoopInitializer: ({
    type
  }) => `'${type === "ForInStatement" ? "for-in" : "for-of"}' loop variable declaration may not have an initializer.`,
  ForInUsing: "For-in loop may not start with 'using' declaration.",
  ForOfAsync: "The left-hand side of a for-of loop may not be 'async'.",
  ForOfLet: "The left-hand side of a for-of loop may not start with 'let'.",
  GeneratorInSingleStatementContext: "Generators can only be declared at the top level or inside a block.",
  IllegalBreakContinue: ({
    type
  }) => `Unsyntactic ${type === "BreakStatement" ? "break" : "continue"}.`,
  IllegalLanguageModeDirective: "Illegal 'use strict' directive in function with non-simple parameter list.",
  IllegalReturn: "'return' outside of function.",
  ImportBindingIsString: ({
    importName
  }) => `A string literal cannot be used as an imported binding.
- Did you mean \`import { "${importName}" as foo }\`?`,
  ImportCallArity: ({
    phase
  }) => `\`import${phase ? `.${phase}` : ""}()\` requires exactly one or two arguments.`,
  ImportCallNotNewExpression: ({
    phase
  }) => `Cannot use new with import${phase ? `.${phase}` : ""}().`,
  ImportCallSpreadArgument: ({
    phase
  }) => `\`...\` is not allowed in \`import${phase ? `.${phase}` : ""}()\`.`,
  IncompatibleRegExpUVFlags: "The 'u' and 'v' regular expression flags cannot be enabled at the same time.",
  InvalidBigIntLiteral: "Invalid BigIntLiteral.",
  InvalidCodePoint: "Code point out of bounds.",
  InvalidCoverDiscardElement: "'void' must be followed by an expression when not used in a binding position.",
  InvalidCoverInitializedName: "Invalid shorthand property initializer.",
  InvalidDigit: ({
    radix
  }) => `Expected number in radix ${radix}.`,
  InvalidEscapeSequence: "Bad character escape sequence.",
  InvalidEscapeSequenceTemplate: "Invalid escape sequence in template.",
  InvalidEscapedReservedWord: ({
    reservedWord
  }) => `Escape sequence in keyword ${reservedWord}.`,
  InvalidIdentifier: ({
    identifierName
  }) => `Invalid identifier ${identifierName}.`,
  InvalidLhs: ({
    ancestor
  }) => `Invalid left-hand side in ${toNodeDescription(ancestor)}.`,
  InvalidLhsBinding: ({
    ancestor
  }) => `Binding invalid left-hand side in ${toNodeDescription(ancestor)}.`,
  InvalidLhsOptionalChaining: ({
    ancestor
  }) => `Invalid optional chaining in the left-hand side of ${toNodeDescription(ancestor)}.`,
  InvalidNumber: "Invalid number.",
  InvalidOrMissingExponent: "Floating-point numbers require a valid exponent after the 'e'.",
  InvalidOrUnexpectedToken: ({
    unexpected
  }) => `Unexpected character '${unexpected}'.`,
  InvalidParenthesizedAssignment: "Invalid parenthesized assignment pattern.",
  InvalidPrivateFieldResolution: ({
    identifierName
  }) => `Private name #${identifierName} is not defined.`,
  InvalidPropertyBindingPattern: "Binding member expression.",
  InvalidRestAssignmentPattern: "Invalid rest operator's argument.",
  LabelRedeclaration: ({
    labelName
  }) => `Label '${labelName}' is already declared.`,
  LetInLexicalBinding: "'let' is disallowed as a lexically bound name.",
  LineTerminatorBeforeArrow: "No line break is allowed before '=>'.",
  MalformedRegExpFlags: "Invalid regular expression flag.",
  MissingClassName: "A class name is required.",
  MissingEqInAssignment: "Only '=' operator can be used for specifying default value.",
  MissingSemicolon: "Missing semicolon.",
  MissingPlugin: ({
    missingPlugin
  }) => `This experimental syntax requires enabling the parser plugin: ${missingPlugin.map((name) => JSON.stringify(name)).join(", ")}.`,
  MissingOneOfPlugins: ({
    missingPlugin
  }) => `This experimental syntax requires enabling one of the following parser plugin(s): ${missingPlugin.map((name) => JSON.stringify(name)).join(", ")}.`,
  MissingUnicodeEscape: "Expecting Unicode escape sequence \\uXXXX.",
  MixingCoalesceWithLogical: "Nullish coalescing operator(??) requires parens when mixing with logical operators.",
  ModuleAttributeInvalidValue: "Only string literals are allowed as module attribute values.",
  ModuleAttributesWithDuplicateKeys: ({
    key
  }) => `Duplicate key "${key}" is not allowed in module attributes.`,
  ModuleExportNameHasLoneSurrogate: ({
    surrogateCharCode
  }) => `An export name cannot include a lone surrogate, found '\\u${surrogateCharCode.toString(16)}'.`,
  ModuleExportUndefined: ({
    localName
  }) => `Export '${localName}' is not defined.`,
  MultipleDefaultsInSwitch: "Multiple default clauses.",
  NewlineAfterThrow: "Illegal newline after throw.",
  NoCatchOrFinally: "Missing catch or finally clause.",
  NumberIdentifier: "Identifier directly after number.",
  NumericSeparatorInEscapeSequence: "Numeric separators are not allowed inside unicode escape sequences or hex escape sequences.",
  ObsoleteAwaitStar: "'await*' has been removed from the async functions proposal. Use Promise.all() instead.",
  OptionalChainingNoNew: "Constructors in/after an Optional Chain are not allowed.",
  OptionalChainingNoTemplate: "Tagged Template Literals are not allowed in optionalChain.",
  OverrideOnConstructor: "'override' modifier cannot appear on a constructor declaration.",
  ParamDupe: "Argument name clash.",
  PatternHasAccessor: "Object pattern can't contain getter or setter.",
  PatternHasMethod: "Object pattern can't contain methods.",
  PrivateInExpectedIn: ({
    identifierName
  }) => `Private names are only allowed in property accesses (\`obj.#${identifierName}\`) or in \`in\` expressions (\`#${identifierName} in obj\`).`,
  PrivateNameRedeclaration: ({
    identifierName
  }) => `Duplicate private name #${identifierName}.`,
  RestTrailingComma: "Unexpected trailing comma after rest element.",
  SloppyFunction: "In non-strict mode code, functions can only be declared at top level or inside a block.",
  SloppyFunctionAnnexB: "In non-strict mode code, functions can only be declared at top level, inside a block, or as the body of an if statement.",
  SourcePhaseImportRequiresDefault: 'Only `import source x from "./module"` is valid.',
  StaticPrototype: "Classes may not have static property named prototype.",
  SuperCallNotNewExpression: "Cannot use new with super(...).",
  SuperNotAllowed: "`super()` is only valid inside a class constructor of a subclass. Maybe a typo in the method name ('constructor') or not extending another class?",
  SuperPrivateField: "Private fields can't be accessed on super.",
  TrailingDecorator: "Decorators must be attached to a class element.",
  UnexpectedArgumentPlaceholder: "Unexpected argument placeholder.",
  UnexpectedDigitAfterHash: "Unexpected digit after hash token.",
  UnexpectedImportExport: "'import' and 'export' may only appear at the top level.",
  UnexpectedKeyword: ({
    keyword
  }) => `Unexpected keyword '${keyword}'.`,
  UnexpectedLeadingDecorator: "Leading decorators must be attached to a class declaration.",
  UnexpectedLexicalDeclaration: "Lexical declaration cannot appear in a single-statement context.",
  UnexpectedNewTarget: "`new.target` can only be used in functions or class properties.",
  UnexpectedNumericSeparator: "A numeric separator is only allowed between two digits.",
  UnexpectedPrivateField: "Unexpected private name.",
  UnexpectedReservedWord: ({
    reservedWord
  }) => `Unexpected reserved word '${reservedWord}'.`,
  UnexpectedSuper: "'super' is only allowed in object methods and classes.",
  UnexpectedToken: ({
    expected,
    unexpected
  }) => `Unexpected token${unexpected ? ` '${unexpected}'.` : ""}${expected ? `, expected "${expected}"` : ""}`,
  UnexpectedTokenUnaryExponentiation: "Illegal expression. Wrap left hand side or entire exponentiation in parentheses.",
  UnexpectedUsingDeclaration: "Using declaration cannot appear in the top level when source type is `script` or in the bare case statement.",
  UnexpectedVoidPattern: "Unexpected void binding.",
  UnsupportedDecoratorExport: "A decorated export must export a class declaration.",
  UnsupportedDefaultExport: "Only expressions, functions or classes are allowed as the `default` export.",
  UnsupportedImport: "`import` can only be used in `import()` or `import.meta`.",
  UnsupportedMetaProperty: ({
    target,
    onlyValidPropertyName
  }) => `The only valid meta property for ${target} is ${target}.${onlyValidPropertyName}.`,
  UnsupportedParameterDecorator: "Decorators cannot be used to decorate parameters.",
  UnsupportedPropertyDecorator: "Decorators cannot be used to decorate object literal properties.",
  UnsupportedSuper: "'super' can only be used with function calls (i.e. super()) or in property accesses (i.e. super.prop or super[prop]).",
  UnterminatedComment: "Unterminated comment.",
  UnterminatedRegExp: "Unterminated regular expression.",
  UnterminatedString: "Unterminated string constant.",
  UnterminatedTemplate: "Unterminated template.",
  UsingDeclarationExport: "Using declaration cannot be exported.",
  UsingDeclarationHasBindingPattern: "Using declaration cannot have destructuring patterns.",
  VarRedeclaration: ({
    identifierName
  }) => `Identifier '${identifierName}' has already been declared.`,
  VoidPatternCatchClauseParam: "A void binding can not be the catch clause parameter. Use `try { ... } catch { ... }` if you want to discard the caught error.",
  VoidPatternInitializer: "A void binding may not have an initializer.",
  YieldBindingIdentifier: "Can not use 'yield' as identifier inside a generator.",
  YieldInParameter: "Yield expression is not allowed in formal parameters.",
  YieldNotInGeneratorFunction: "'yield' is only allowed within generator functions.",
  ZeroDigitNumericSeparator: "Numeric separator can not be used after leading 0."
};
var StrictModeErrors = {
  StrictDelete: "Deleting local variable in strict mode.",
  StrictEvalArguments: ({
    referenceName
  }) => `Assigning to '${referenceName}' in strict mode.`,
  StrictEvalArgumentsBinding: ({
    bindingName
  }) => `Binding '${bindingName}' in strict mode.`,
  StrictFunction: "In strict mode code, functions can only be declared at top level or inside a block.",
  StrictNumericEscape: "The only valid numeric escape in strict mode is '\\0'.",
  StrictOctalLiteral: "Legacy octal literals are not allowed in strict mode.",
  StrictWith: "'with' in strict mode."
};
var ParseExpressionErrors = {
  ParseExpressionEmptyInput: "Unexpected parseExpression() input: The input is empty or contains only comments.",
  ParseExpressionExpectsEOF: ({
    unexpected
  }) => `Unexpected parseExpression() input: The input should contain exactly one expression, but the first expression is followed by the unexpected character \`${String.fromCodePoint(unexpected)}\`.`
};
var UnparenthesizedPipeBodyDescriptions = /* @__PURE__ */ new Set(["ArrowFunctionExpression", "AssignmentExpression", "ConditionalExpression", "YieldExpression"]);
var PipelineOperatorErrors = {
  PipeTopicRequiresHackPipes: 'Topic references are only supported when using the `"proposal": "hack"` version of the pipeline proposal.',
  PipeTopicUnbound: "Topic reference is unbound; it must be inside a pipe body.",
  PipeTopicUnconfiguredToken: ({
    token
  }) => `Invalid topic token ${token}. In order to use ${token} as a topic reference, the pipelineOperator plugin must be configured with { "proposal": "hack", "topicToken": "${token}" }.`,
  PipeTopicUnused: "Hack-style pipe body does not contain a topic reference; Hack-style pipes must use topic at least once.",
  PipeUnparenthesizedBody: ({
    type
  }) => `Hack-style pipe body cannot be an unparenthesized ${toNodeDescription({
    type
  })}; please wrap it in parentheses.`,
  PipelineUnparenthesized: "Cannot mix binary operator with solo-await F#-style pipeline. Please wrap the pipeline in parentheses."
};
var FunctionBindErrors = {
  UnsupportedBind: "Binding should be performed on object property.",
  UnsupportedBindRHS: "The right-hand side of binding can not be super or import."
};
function defineHidden(obj, key, value) {
  Object.defineProperty(obj, key, {
    enumerable: false,
    configurable: true,
    value
  });
}
function toParseErrorConstructor({
  toMessage,
  code: code2,
  reasonCode,
  syntaxPlugin
}) {
  const hasMissingPlugin = reasonCode === "MissingPlugin" || reasonCode === "MissingOneOfPlugins";
  return function constructor(loc, pos, details) {
    const error = new SyntaxError();
    error.code = code2;
    error.reasonCode = reasonCode;
    error.loc = loc;
    error.pos = pos;
    error.syntaxPlugin = syntaxPlugin;
    if (hasMissingPlugin) {
      error.missingPlugin = details.missingPlugin;
    }
    defineHidden(error, "clone", function clone(overrides = {}) {
      const {
        line,
        column,
        index = pos
      } = overrides.loc ?? loc;
      return constructor(new Position(line, column), index, {
        ...details,
        ...overrides.details
      });
    });
    defineHidden(error, "details", details);
    Object.defineProperty(error, "message", {
      configurable: true,
      get() {
        const message = `${toMessage(details)} (${loc.line}:${loc.column})`;
        this.message = message;
        return message;
      },
      set(value) {
        Object.defineProperty(this, "message", {
          value,
          writable: true
        });
      }
    });
    return error;
  };
}
function ParseErrorEnum(argument, syntaxPlugin) {
  if (Array.isArray(argument)) {
    return (parseErrorTemplates) => ParseErrorEnum(parseErrorTemplates, argument[0]);
  }
  const ParseErrorConstructors = {};
  for (const reasonCode of Object.keys(argument)) {
    const template = argument[reasonCode];
    const {
      message,
      ...rest
    } = typeof template === "string" ? {
      message: () => template
    } : typeof template === "function" ? {
      message: template
    } : template;
    const toMessage = typeof message === "string" ? () => message : message;
    ParseErrorConstructors[reasonCode] = toParseErrorConstructor({
      code: "BABEL_PARSER_SYNTAX_ERROR",
      reasonCode,
      toMessage,
      ...syntaxPlugin ? {
        syntaxPlugin
      } : {},
      ...rest
    });
  }
  return ParseErrorConstructors;
}
var Errors = {
  ...ParseErrorEnum(ModuleErrors),
  ...ParseErrorEnum(StandardErrors),
  ...ParseErrorEnum(StrictModeErrors),
  ...ParseErrorEnum(ParseExpressionErrors),
  ...ParseErrorEnum`pipelineOperator`(PipelineOperatorErrors),
  ...ParseErrorEnum`functionBind`(FunctionBindErrors)
};
function createDefaultOptions() {
  return {
    sourceType: "script",
    sourceFilename: void 0,
    startIndex: 0,
    startColumn: 0,
    startLine: 1,
    allowAwaitOutsideFunction: false,
    allowReturnOutsideFunction: false,
    allowNewTargetOutsideFunction: false,
    allowImportExportEverywhere: false,
    allowSuperOutsideMethod: false,
    allowUndeclaredExports: false,
    allowYieldOutsideFunction: false,
    plugins: [],
    strictMode: void 0,
    ranges: false,
    locations: true,
    tokens: false,
    createImportExpressions: true,
    createParenthesizedExpressions: false,
    errorRecovery: false,
    attachComment: true,
    annexB: true
  };
}
function getOptions(opts) {
  const options = createDefaultOptions();
  if (opts == null) {
    return options;
  }
  if (opts.annexB != null && opts.annexB !== false) {
    throw new Error("The `annexB` option can only be set to `false`.");
  }
  for (const key of Object.keys(options)) {
    if (opts[key] != null) options[key] = opts[key];
  }
  if (options.startLine === 1) {
    if (opts.startIndex == null && options.startColumn > 0) {
      options.startIndex = options.startColumn;
    } else if (opts.startColumn == null && options.startIndex > 0) {
      options.startColumn = options.startIndex;
    }
  } else if (opts.startColumn == null || opts.startIndex == null) {
    throw new Error("With a `startLine > 1` you must also specify `startIndex` and `startColumn`.");
  }
  if (options.sourceType === "commonjs") {
    if (opts.allowAwaitOutsideFunction != null) {
      throw new Error("The `allowAwaitOutsideFunction` option cannot be used with `sourceType: 'commonjs'`.");
    }
    if (opts.allowReturnOutsideFunction != null) {
      throw new Error("`sourceType: 'commonjs'` implies `allowReturnOutsideFunction: true`, please remove the `allowReturnOutsideFunction` option or use `sourceType: 'script'`.");
    }
    if (opts.allowNewTargetOutsideFunction != null) {
      throw new Error("`sourceType: 'commonjs'` implies `allowNewTargetOutsideFunction: true`, please remove the `allowNewTargetOutsideFunction` option or use `sourceType: 'script'`.");
    }
  }
  return options;
}
function toESTreeLocation(node) {
  const {
    start,
    end
  } = node.loc;
  node.loc.start = new Position(start.line, start.column);
  node.loc.end = new Position(end.line, end.column);
  return node;
}
var estree = (superClass) => class ESTreeParserMixin extends superClass {
  createPosition(loc) {
    return new Position(loc.line, loc.column);
  }
  parse() {
    const file = super.parse();
    if (this.optionFlags & 512) {
      file.tokens = file.tokens.map(toESTreeLocation);
    }
    return toESTreeLocation(file);
  }
  parseRegExpLiteral({
    pattern,
    flags
  }) {
    let regex = null;
    try {
      regex = new RegExp(pattern, flags);
    } catch (_) {
    }
    const node = this.estreeParseLiteral(regex);
    node.regex = {
      pattern,
      flags
    };
    return node;
  }
  parseBigIntLiteral(value) {
    let bigInt;
    try {
      bigInt = BigInt(value);
    } catch {
      bigInt = null;
    }
    const node = this.estreeParseLiteral(bigInt);
    node.bigint = String(node.value || value);
    return node;
  }
  estreeParseLiteral(value) {
    return this.parseLiteral(value, "Literal");
  }
  parseStringLiteral(value) {
    return this.estreeParseLiteral(value);
  }
  parseNumericLiteral(value) {
    return this.estreeParseLiteral(value);
  }
  parseNullLiteral() {
    return this.estreeParseLiteral(null);
  }
  parseBooleanLiteral(value) {
    return this.estreeParseLiteral(value);
  }
  estreeParseChainExpression(node, endNode) {
    const chain = this.startNodeAtNode(node);
    chain.expression = node;
    return this.finishNodeAtNode(chain, "ChainExpression", endNode);
  }
  directiveToStmt(directive) {
    const expression = directive.value;
    delete directive.value;
    this.castNodeTo(expression, "Literal");
    expression.raw = expression.extra.raw;
    expression.value = expression.extra.expressionValue;
    const stmt = this.castNodeTo(directive, "ExpressionStatement");
    stmt.expression = expression;
    stmt.directive = expression.extra.rawValue;
    delete expression.extra;
    return stmt;
  }
  fillOptionalPropertiesForTSESLint(node) {
  }
  cloneEstreeStringLiteral(node) {
    const {
      start,
      end,
      loc,
      range,
      raw,
      value
    } = node;
    const cloned = Object.create(node.constructor.prototype);
    cloned.type = "Literal";
    cloned.start = start;
    cloned.end = end;
    cloned.loc = loc;
    cloned.range = range;
    cloned.raw = raw;
    cloned.value = value;
    return cloned;
  }
  initFunction(node, isAsync) {
    super.initFunction(node, isAsync);
    node.expression = false;
  }
  checkDeclaration(node) {
    if (node != null && this.isObjectProperty(node)) {
      this.checkDeclaration(node.value);
    } else {
      super.checkDeclaration(node);
    }
  }
  getObjectOrClassMethodParams(method) {
    return method.value.params;
  }
  isValidDirective(stmt) {
    return stmt.type === "ExpressionStatement" && stmt.expression.type === "Literal" && typeof stmt.expression.value === "string" && !stmt.expression.extra?.parenthesized;
  }
  parseBlockBody(node, allowDirectives, topLevel, end, afterBlockParse) {
    super.parseBlockBody(node, allowDirectives, topLevel, end, afterBlockParse);
    const directiveStatements = node.directives.map((d) => this.directiveToStmt(d));
    node.body = directiveStatements.concat(node.body);
    delete node.directives;
  }
  parsePrivateName() {
    const node = super.parsePrivateName();
    return this.convertPrivateNameToPrivateIdentifier(node);
  }
  convertPrivateNameToPrivateIdentifier(node) {
    const name = super.getPrivateNameSV(node);
    delete node.id;
    node.name = name;
    return this.castNodeTo(node, "PrivateIdentifier");
  }
  isPrivateName(node) {
    return node.type === "PrivateIdentifier";
  }
  getPrivateNameSV(node) {
    return node.name;
  }
  parseLiteral(value, type) {
    const node = super.parseLiteral(value, type);
    node.raw = node.extra.raw;
    delete node.extra;
    return node;
  }
  parseFunctionBody(node, allowExpression, isMethod = false) {
    super.parseFunctionBody(node, allowExpression, isMethod);
    node.expression = node.body.type !== "BlockStatement";
  }
  parseMethod(node, isGenerator, isAsync, isConstructor, allowDirectSuper, type, inClassScope = false) {
    let funcNode = this.startNode();
    funcNode.kind = node.kind;
    funcNode = super.parseMethod(funcNode, isGenerator, isAsync, isConstructor, allowDirectSuper, type, inClassScope);
    delete funcNode.kind;
    const {
      typeParameters
    } = node;
    if (typeParameters) {
      delete node.typeParameters;
      funcNode.typeParameters = typeParameters;
      this.resetStartLocationFromNode(funcNode, typeParameters);
    }
    const valueNode = this.castNodeTo(funcNode, this.hasPlugin("typescript") && !funcNode.body ? "TSEmptyBodyFunctionExpression" : "FunctionExpression");
    node.value = valueNode;
    if (type === "ClassPrivateMethod") {
      node.computed = false;
    }
    if (this.hasPlugin("typescript")) {
      if (node.abstract) {
        delete node.abstract;
        return this.finishNode(node, "TSAbstractMethodDefinition");
      }
    }
    if (type === "ObjectMethod") {
      if (node.kind === "method") {
        node.kind = "init";
      }
      node.shorthand = false;
      return this.finishNode(node, "Property");
    } else {
      return this.finishNode(node, "MethodDefinition");
    }
  }
  nameIsConstructor(key) {
    if (key.type === "Literal") return key.value === "constructor";
    return super.nameIsConstructor(key);
  }
  parseClassProperty(...args) {
    const propertyNode = super.parseClassProperty(...args);
    if (propertyNode.abstract && this.hasPlugin("typescript")) {
      delete propertyNode.abstract;
      this.castNodeTo(propertyNode, "TSAbstractPropertyDefinition");
    } else {
      this.castNodeTo(propertyNode, "PropertyDefinition");
    }
    return propertyNode;
  }
  parseClassPrivateProperty(...args) {
    const propertyNode = super.parseClassPrivateProperty(...args);
    if (propertyNode.abstract && this.hasPlugin("typescript")) {
      this.castNodeTo(propertyNode, "TSAbstractPropertyDefinition");
    } else {
      this.castNodeTo(propertyNode, "PropertyDefinition");
    }
    propertyNode.computed = false;
    return propertyNode;
  }
  parseClassAccessorProperty(node) {
    const accessorPropertyNode = super.parseClassAccessorProperty(node);
    if (accessorPropertyNode.abstract && this.hasPlugin("typescript")) {
      delete accessorPropertyNode.abstract;
      this.castNodeTo(accessorPropertyNode, "TSAbstractAccessorProperty");
    } else {
      this.castNodeTo(accessorPropertyNode, "AccessorProperty");
    }
    return accessorPropertyNode;
  }
  parseObjectProperty(prop, startLoc, isPattern, refExpressionErrors) {
    const node = super.parseObjectProperty(prop, startLoc, isPattern, refExpressionErrors);
    if (node) {
      node.kind = "init";
      this.castNodeTo(node, "Property");
    }
    return node;
  }
  finishObjectProperty(node) {
    node.kind = "init";
    return this.finishNode(node, "Property");
  }
  isValidLVal(type, disallowCallExpression, isUnparenthesizedInAssign, binding) {
    return type === "Property" ? "value" : super.isValidLVal(type, disallowCallExpression, isUnparenthesizedInAssign, binding);
  }
  isAssignable(node, isBinding) {
    if (node != null && this.isObjectProperty(node)) {
      return this.isAssignable(node.value, isBinding);
    }
    return super.isAssignable(node, isBinding);
  }
  toAssignable(node, isLHS = false) {
    if (node != null && this.isObjectProperty(node)) {
      const {
        key,
        value
      } = node;
      if (this.isPrivateName(key)) {
        this.classScope.usePrivateName(this.getPrivateNameSV(key), key.start);
      }
      this.toAssignable(value, isLHS);
    } else {
      super.toAssignable(node, isLHS);
    }
  }
  toAssignableObjectExpressionProp(prop, isLast, isLHS) {
    if (prop.type === "Property" && (prop.kind === "get" || prop.kind === "set")) {
      this.raise(Errors.PatternHasAccessor, prop.key);
    } else if (prop.type === "Property" && prop.method) {
      this.raise(Errors.PatternHasMethod, prop.key);
    } else {
      super.toAssignableObjectExpressionProp(prop, isLast, isLHS);
    }
  }
  finishCallExpression(unfinished, optional) {
    const node = super.finishCallExpression(unfinished, optional);
    if (node.callee.type === "Import") {
      this.castNodeTo(node, "ImportExpression");
      node.source = node.arguments[0];
      node.options = node.arguments[1] ?? null;
      delete node.arguments;
      delete node.callee;
    } else if (node.type === "OptionalCallExpression") {
      this.castNodeTo(node, "CallExpression");
    } else {
      node.optional = false;
    }
    return node;
  }
  parseExport(unfinished, decorators) {
    const exportStartLoc = this.state.lastTokStartLoc;
    const node = super.parseExport(unfinished, decorators);
    switch (node.type) {
      case "ExportAllDeclaration":
        node.exported = null;
        break;
      case "ExportNamedDeclaration":
        if (node.specifiers.length === 1 && node.specifiers[0].type === "ExportNamespaceSpecifier") {
          this.castNodeTo(node, "ExportAllDeclaration");
          node.exported = node.specifiers[0].exported;
          delete node.specifiers;
        }
      case "ExportDefaultDeclaration":
        {
          const {
            declaration
          } = node;
          if (declaration?.type === "ClassDeclaration" && declaration.decorators?.length > 0 && declaration.start === node.start) {
            this.resetStartLocation(node, exportStartLoc);
          }
        }
        break;
    }
    return node;
  }
  stopParseSubscript(base, state) {
    const node = super.stopParseSubscript(base, state);
    if (state.optionalChainMember) {
      return this.estreeParseChainExpression(node, base);
    }
    return node;
  }
  parseMember(base, startLoc, state, computed, optional) {
    const node = super.parseMember(base, startLoc, state, computed, optional);
    if (node.type === "OptionalMemberExpression") {
      this.castNodeTo(node, "MemberExpression");
    } else {
      node.optional = false;
    }
    return node;
  }
  isOptionalMemberExpression(node) {
    if (node.type === "ChainExpression") {
      return node.expression.type === "MemberExpression";
    }
    return super.isOptionalMemberExpression(node);
  }
  hasPropertyAsPrivateName(node) {
    if (node.type === "ChainExpression") {
      node = node.expression;
    }
    return super.hasPropertyAsPrivateName(node);
  }
  isObjectProperty(node) {
    return node.type === "Property" && node.kind === "init" && !node.method;
  }
  isObjectMethod(node) {
    return node.type === "Property" && (node.method || node.kind === "get" || node.kind === "set");
  }
  castNodeTo(node, type) {
    const result = super.castNodeTo(node, type);
    this.fillOptionalPropertiesForTSESLint(result);
    return result;
  }
  cloneIdentifier(node) {
    const cloned = super.cloneIdentifier(node);
    this.fillOptionalPropertiesForTSESLint(cloned);
    return cloned;
  }
  cloneStringLiteral(node) {
    if (node.type === "Literal") {
      return this.cloneEstreeStringLiteral(node);
    }
    return super.cloneStringLiteral(node);
  }
  finishNodeAt(node, type, endLoc) {
    return toESTreeLocation(super.finishNodeAt(node, type, endLoc));
  }
  finishNodeAtNode(node, type, endNode) {
    return toESTreeLocation(super.finishNodeAtNode(node, type, endNode));
  }
  finishNode(node, type) {
    const result = super.finishNode(node, type);
    this.fillOptionalPropertiesForTSESLint(result);
    return result;
  }
  resetStartLocation(node, startLoc) {
    super.resetStartLocation(node, startLoc);
    toESTreeLocation(node);
  }
  resetEndLocation(node, endLoc = this.state.lastTokEndLoc) {
    super.resetEndLocation(node, endLoc);
    toESTreeLocation(node);
  }
};
var beforeExpr = true;
var startsExpr = true;
var isLoop = true;
var isAssign = true;
var prefix = true;
var postfix = true;
var ExportedTokenType = class {
  label;
  keyword;
  beforeExpr;
  startsExpr;
  rightAssociative;
  isLoop;
  isAssign;
  prefix;
  postfix;
  binop;
  constructor(label, conf = {}) {
    this.label = label;
    this.keyword = conf.keyword;
    this.beforeExpr = !!conf.beforeExpr;
    this.startsExpr = !!conf.startsExpr;
    this.rightAssociative = !!conf.rightAssociative;
    this.isLoop = !!conf.isLoop;
    this.isAssign = !!conf.isAssign;
    this.prefix = !!conf.prefix;
    this.postfix = !!conf.postfix;
    this.binop = conf.binop != null ? conf.binop : null;
  }
};
var keywords$1 = /* @__PURE__ */ new Map();
function createKeyword(name, options = {}) {
  options.keyword = name;
  const token = createToken(name, options);
  keywords$1.set(name, token);
  return token;
}
function createBinop(name, binop) {
  return createToken(name, {
    beforeExpr,
    binop
  });
}
var tokenTypeCounter = -1;
var tokenTypes = [];
var tokenLabels = [];
var tokenBinops = [];
var tokenBeforeExprs = [];
var tokenStartsExprs = [];
var tokenPrefixes = [];
function createToken(name, options = {}) {
  ++tokenTypeCounter;
  tokenLabels.push(name);
  tokenBinops.push(options.binop ?? -1);
  tokenBeforeExprs.push(options.beforeExpr ?? false);
  tokenStartsExprs.push(options.startsExpr ?? false);
  tokenPrefixes.push(options.prefix ?? false);
  tokenTypes.push(new ExportedTokenType(name, options));
  return tokenTypeCounter;
}
function createKeywordLike(name, options = {}) {
  ++tokenTypeCounter;
  keywords$1.set(name, tokenTypeCounter);
  tokenLabels.push(name);
  tokenBinops.push(options.binop ?? -1);
  tokenBeforeExprs.push(options.beforeExpr ?? false);
  tokenStartsExprs.push(options.startsExpr ?? false);
  tokenPrefixes.push(options.prefix ?? false);
  tokenTypes.push(new ExportedTokenType("name", options));
  return tokenTypeCounter;
}
var tt = {
  bracketL: createToken("[", {
    beforeExpr,
    startsExpr
  }),
  bracketR: createToken("]"),
  braceL: createToken("{", {
    beforeExpr,
    startsExpr
  }),
  braceBarL: createToken("{|", {
    beforeExpr,
    startsExpr
  }),
  braceR: createToken("}"),
  braceBarR: createToken("|}"),
  parenL: createToken("(", {
    beforeExpr,
    startsExpr
  }),
  parenR: createToken(")"),
  comma: createToken(",", {
    beforeExpr
  }),
  semi: createToken(";", {
    beforeExpr
  }),
  colon: createToken(":", {
    beforeExpr
  }),
  doubleColon: createToken("::", {
    beforeExpr
  }),
  dot: createToken("."),
  question: createToken("?", {
    beforeExpr
  }),
  questionDot: createToken("?."),
  arrow: createToken("=>", {
    beforeExpr
  }),
  template: createToken("template"),
  ellipsis: createToken("...", {
    beforeExpr
  }),
  backQuote: createToken("`", {
    startsExpr
  }),
  dollarBraceL: createToken("${", {
    beforeExpr,
    startsExpr
  }),
  templateTail: createToken("...`", {
    startsExpr
  }),
  templateNonTail: createToken("...${", {
    beforeExpr,
    startsExpr
  }),
  at: createToken("@"),
  hash: createToken("#", {
    startsExpr
  }),
  interpreterDirective: createToken("#!..."),
  eq: createToken("=", {
    beforeExpr,
    isAssign
  }),
  assign: createToken("_=", {
    beforeExpr,
    isAssign
  }),
  slashAssign: createToken("_=", {
    beforeExpr,
    isAssign
  }),
  xorAssign: createToken("_=", {
    beforeExpr,
    isAssign
  }),
  moduloAssign: createToken("_=", {
    beforeExpr,
    isAssign
  }),
  incDec: createToken("++/--", {
    prefix,
    postfix,
    startsExpr
  }),
  bang: createToken("!", {
    beforeExpr,
    prefix,
    startsExpr
  }),
  tilde: createToken("~", {
    beforeExpr,
    prefix,
    startsExpr
  }),
  doubleCaret: createToken("^^", {
    startsExpr
  }),
  doubleAt: createToken("@@", {
    startsExpr
  }),
  pipeline: createBinop("|>", 0),
  nullishCoalescing: createBinop("??", 1),
  logicalOR: createBinop("||", 1),
  logicalAND: createBinop("&&", 2),
  bitwiseOR: createBinop("|", 3),
  bitwiseXOR: createBinop("^", 4),
  bitwiseAND: createBinop("&", 5),
  equality: createBinop("==/!=/===/!==", 6),
  lt: createBinop("</>/<=/>=", 7),
  gt: createBinop("</>/<=/>=", 7),
  relational: createBinop("</>/<=/>=", 7),
  bitShift: createBinop("<</>>/>>>", 8),
  bitShiftL: createBinop("<</>>/>>>", 8),
  bitShiftR: createBinop("<</>>/>>>", 8),
  plusMin: createToken("+/-", {
    beforeExpr,
    binop: 9,
    prefix,
    startsExpr
  }),
  modulo: createToken("%", {
    binop: 10,
    startsExpr
  }),
  star: createToken("*", {
    binop: 10
  }),
  slash: createBinop("/", 10),
  exponent: createToken("**", {
    beforeExpr,
    binop: 11,
    rightAssociative: true
  }),
  _in: createKeyword("in", {
    beforeExpr,
    binop: 7
  }),
  _instanceof: createKeyword("instanceof", {
    beforeExpr,
    binop: 7
  }),
  _break: createKeyword("break"),
  _case: createKeyword("case", {
    beforeExpr
  }),
  _catch: createKeyword("catch"),
  _continue: createKeyword("continue"),
  _debugger: createKeyword("debugger"),
  _default: createKeyword("default", {
    beforeExpr
  }),
  _else: createKeyword("else", {
    beforeExpr
  }),
  _finally: createKeyword("finally"),
  _function: createKeyword("function", {
    startsExpr
  }),
  _if: createKeyword("if"),
  _return: createKeyword("return", {
    beforeExpr
  }),
  _switch: createKeyword("switch"),
  _throw: createKeyword("throw", {
    beforeExpr,
    prefix,
    startsExpr
  }),
  _try: createKeyword("try"),
  _var: createKeyword("var"),
  _const: createKeyword("const"),
  _with: createKeyword("with"),
  _new: createKeyword("new", {
    beforeExpr,
    startsExpr
  }),
  _this: createKeyword("this", {
    startsExpr
  }),
  _super: createKeyword("super", {
    startsExpr
  }),
  _class: createKeyword("class", {
    startsExpr
  }),
  _extends: createKeyword("extends", {
    beforeExpr
  }),
  _export: createKeyword("export"),
  _import: createKeyword("import", {
    startsExpr
  }),
  _null: createKeyword("null", {
    startsExpr
  }),
  _true: createKeyword("true", {
    startsExpr
  }),
  _false: createKeyword("false", {
    startsExpr
  }),
  _typeof: createKeyword("typeof", {
    beforeExpr,
    prefix,
    startsExpr
  }),
  _void: createKeyword("void", {
    beforeExpr,
    prefix,
    startsExpr
  }),
  _delete: createKeyword("delete", {
    beforeExpr,
    prefix,
    startsExpr
  }),
  _do: createKeyword("do", {
    isLoop,
    beforeExpr
  }),
  _for: createKeyword("for", {
    isLoop
  }),
  _while: createKeyword("while", {
    isLoop
  }),
  _as: createKeywordLike("as", {
    startsExpr
  }),
  _assert: createKeywordLike("assert", {
    startsExpr
  }),
  _async: createKeywordLike("async", {
    startsExpr
  }),
  _await: createKeywordLike("await", {
    startsExpr
  }),
  _defer: createKeywordLike("defer", {
    startsExpr
  }),
  _from: createKeywordLike("from", {
    startsExpr
  }),
  _get: createKeywordLike("get", {
    startsExpr
  }),
  _let: createKeywordLike("let", {
    startsExpr
  }),
  _meta: createKeywordLike("meta", {
    startsExpr
  }),
  _of: createKeywordLike("of", {
    startsExpr
  }),
  _sent: createKeywordLike("sent", {
    startsExpr
  }),
  _set: createKeywordLike("set", {
    startsExpr
  }),
  _source: createKeywordLike("source", {
    startsExpr
  }),
  _static: createKeywordLike("static", {
    startsExpr
  }),
  _using: createKeywordLike("using", {
    startsExpr
  }),
  _yield: createKeywordLike("yield", {
    startsExpr
  }),
  _asserts: createKeywordLike("asserts", {
    startsExpr
  }),
  _checks: createKeywordLike("checks", {
    startsExpr
  }),
  _exports: createKeywordLike("exports", {
    startsExpr
  }),
  _global: createKeywordLike("global", {
    startsExpr
  }),
  _implements: createKeywordLike("implements", {
    startsExpr
  }),
  _intrinsic: createKeywordLike("intrinsic", {
    startsExpr
  }),
  _infer: createKeywordLike("infer", {
    startsExpr
  }),
  _is: createKeywordLike("is", {
    startsExpr
  }),
  _mixins: createKeywordLike("mixins", {
    startsExpr
  }),
  _proto: createKeywordLike("proto", {
    startsExpr
  }),
  _require: createKeywordLike("require", {
    startsExpr
  }),
  _satisfies: createKeywordLike("satisfies", {
    startsExpr
  }),
  _keyof: createKeywordLike("keyof", {
    startsExpr
  }),
  _readonly: createKeywordLike("readonly", {
    startsExpr
  }),
  _unique: createKeywordLike("unique", {
    startsExpr
  }),
  _abstract: createKeywordLike("abstract", {
    startsExpr
  }),
  _declare: createKeywordLike("declare", {
    startsExpr
  }),
  _enum: createKeywordLike("enum", {
    startsExpr
  }),
  _module: createKeywordLike("module", {
    startsExpr
  }),
  _namespace: createKeywordLike("namespace", {
    startsExpr
  }),
  _interface: createKeywordLike("interface", {
    startsExpr
  }),
  _type: createKeywordLike("type", {
    startsExpr
  }),
  _opaque: createKeywordLike("opaque", {
    startsExpr
  }),
  name: createToken("name", {
    startsExpr
  }),
  placeholder: createToken("%%", {
    startsExpr
  }),
  string: createToken("string", {
    startsExpr
  }),
  num: createToken("num", {
    startsExpr
  }),
  bigint: createToken("bigint", {
    startsExpr
  }),
  regexp: createToken("regexp", {
    startsExpr
  }),
  privateName: createToken("#name", {
    startsExpr
  }),
  eof: createToken("eof"),
  jsxName: createToken("jsxName"),
  jsxText: createToken("jsxText", {
    beforeExpr
  }),
  jsxTagStart: createToken("jsxTagStart", {
    startsExpr
  }),
  jsxTagEnd: createToken("jsxTagEnd")
};
function tokenIsIdentifier(token) {
  return token >= 89 && token <= 129;
}
function tokenKeywordOrIdentifierIsKeyword(token) {
  return token <= 88;
}
function tokenIsKeywordOrIdentifier(token) {
  return token >= 54 && token <= 129;
}
function tokenIsLiteralPropertyName(token) {
  return token >= 54 && token <= 132;
}
function tokenComesBeforeExpression(token) {
  return tokenBeforeExprs[token];
}
function tokenCanStartExpression(token) {
  return tokenStartsExprs[token];
}
function tokenIsAssignment(token) {
  return token >= 25 && token <= 29;
}
function tokenIsFlowInterfaceOrTypeOrOpaque(token) {
  return token >= 125 && token <= 127;
}
function tokenIsLoop(token) {
  return token >= 86 && token <= 88;
}
function tokenIsKeyword(token) {
  return token >= 54 && token <= 88;
}
function tokenIsOperator(token) {
  return token >= 35 && token <= 55;
}
function tokenIsPostfix(token) {
  return token === 30;
}
function tokenIsPrefix(token) {
  return tokenPrefixes[token];
}
function tokenIsTSTypeOperator(token) {
  return token >= 117 && token <= 119;
}
function tokenIsTSDeclarationStart(token) {
  return token >= 120 && token <= 126;
}
function tokenLabelName(token) {
  return tokenLabels[token];
}
function tokenOperatorPrecedence(token) {
  return tokenBinops[token];
}
function tokenIsRightAssociative(token) {
  return token === 53;
}
function tokenIsTemplate(token) {
  return token >= 20 && token <= 21;
}
function getExportedToken(token) {
  return tokenTypes[token];
}
var TokContext = class {
  constructor(token, preserveSpace) {
    this.token = token;
    this.preserveSpace = !!preserveSpace;
  }
  token;
  preserveSpace;
};
var types = {
  brace: new TokContext("{"),
  j_oTag: new TokContext("<tag"),
  j_cTag: new TokContext("</tag"),
  j_expr: new TokContext("<tag>...</tag>", true)
};
var bmpIdentifierStartChars = "\\xaa\\xb5\\xba\\xc0-\\xd6\\xd8-\\xf6\\xf8-\\u02c1\\u02c6-\\u02d1\\u02e0-\\u02e4\\u02ec\\u02ee\\u0370-\\u0374\\u0376\\u0377\\u037a-\\u037d\\u037f\\u0386\\u0388-\\u038a\\u038c\\u038e-\\u03a1\\u03a3-\\u03f5\\u03f7-\\u0481\\u048a-\\u052f\\u0531-\\u0556\\u0559\\u0560-\\u0588\\u05d0-\\u05ea\\u05ef-\\u05f2\\u0620-\\u064a\\u066e\\u066f\\u0671-\\u06d3\\u06d5\\u06e5\\u06e6\\u06ee\\u06ef\\u06fa-\\u06fc\\u06ff\\u0710\\u0712-\\u072f\\u074d-\\u07a5\\u07b1\\u07ca-\\u07ea\\u07f4\\u07f5\\u07fa\\u0800-\\u0815\\u081a\\u0824\\u0828\\u0840-\\u0858\\u0860-\\u086a\\u0870-\\u0887\\u0889-\\u088f\\u08a0-\\u08c9\\u0904-\\u0939\\u093d\\u0950\\u0958-\\u0961\\u0971-\\u0980\\u0985-\\u098c\\u098f\\u0990\\u0993-\\u09a8\\u09aa-\\u09b0\\u09b2\\u09b6-\\u09b9\\u09bd\\u09ce\\u09dc\\u09dd\\u09df-\\u09e1\\u09f0\\u09f1\\u09fc\\u0a05-\\u0a0a\\u0a0f\\u0a10\\u0a13-\\u0a28\\u0a2a-\\u0a30\\u0a32\\u0a33\\u0a35\\u0a36\\u0a38\\u0a39\\u0a59-\\u0a5c\\u0a5e\\u0a72-\\u0a74\\u0a85-\\u0a8d\\u0a8f-\\u0a91\\u0a93-\\u0aa8\\u0aaa-\\u0ab0\\u0ab2\\u0ab3\\u0ab5-\\u0ab9\\u0abd\\u0ad0\\u0ae0\\u0ae1\\u0af9\\u0b05-\\u0b0c\\u0b0f\\u0b10\\u0b13-\\u0b28\\u0b2a-\\u0b30\\u0b32\\u0b33\\u0b35-\\u0b39\\u0b3d\\u0b5c\\u0b5d\\u0b5f-\\u0b61\\u0b71\\u0b83\\u0b85-\\u0b8a\\u0b8e-\\u0b90\\u0b92-\\u0b95\\u0b99\\u0b9a\\u0b9c\\u0b9e\\u0b9f\\u0ba3\\u0ba4\\u0ba8-\\u0baa\\u0bae-\\u0bb9\\u0bd0\\u0c05-\\u0c0c\\u0c0e-\\u0c10\\u0c12-\\u0c28\\u0c2a-\\u0c39\\u0c3d\\u0c58-\\u0c5a\\u0c5c\\u0c5d\\u0c60\\u0c61\\u0c80\\u0c85-\\u0c8c\\u0c8e-\\u0c90\\u0c92-\\u0ca8\\u0caa-\\u0cb3\\u0cb5-\\u0cb9\\u0cbd\\u0cdc-\\u0cde\\u0ce0\\u0ce1\\u0cf1\\u0cf2\\u0d04-\\u0d0c\\u0d0e-\\u0d10\\u0d12-\\u0d3a\\u0d3d\\u0d4e\\u0d54-\\u0d56\\u0d5f-\\u0d61\\u0d7a-\\u0d7f\\u0d85-\\u0d96\\u0d9a-\\u0db1\\u0db3-\\u0dbb\\u0dbd\\u0dc0-\\u0dc6\\u0e01-\\u0e30\\u0e32\\u0e33\\u0e40-\\u0e46\\u0e81\\u0e82\\u0e84\\u0e86-\\u0e8a\\u0e8c-\\u0ea3\\u0ea5\\u0ea7-\\u0eb0\\u0eb2\\u0eb3\\u0ebd\\u0ec0-\\u0ec4\\u0ec6\\u0edc-\\u0edf\\u0f00\\u0f40-\\u0f47\\u0f49-\\u0f6c\\u0f88-\\u0f8c\\u1000-\\u102a\\u103f\\u1050-\\u1055\\u105a-\\u105d\\u1061\\u1065\\u1066\\u106e-\\u1070\\u1075-\\u1081\\u108e\\u10a0-\\u10c5\\u10c7\\u10cd\\u10d0-\\u10fa\\u10fc-\\u1248\\u124a-\\u124d\\u1250-\\u1256\\u1258\\u125a-\\u125d\\u1260-\\u1288\\u128a-\\u128d\\u1290-\\u12b0\\u12b2-\\u12b5\\u12b8-\\u12be\\u12c0\\u12c2-\\u12c5\\u12c8-\\u12d6\\u12d8-\\u1310\\u1312-\\u1315\\u1318-\\u135a\\u1380-\\u138f\\u13a0-\\u13f5\\u13f8-\\u13fd\\u1401-\\u166c\\u166f-\\u167f\\u1681-\\u169a\\u16a0-\\u16ea\\u16ee-\\u16f8\\u1700-\\u1711\\u171f-\\u1731\\u1740-\\u1751\\u1760-\\u176c\\u176e-\\u1770\\u1780-\\u17b3\\u17d7\\u17dc\\u1820-\\u1878\\u1880-\\u18a8\\u18aa\\u18b0-\\u18f5\\u1900-\\u191e\\u1950-\\u196d\\u1970-\\u1974\\u1980-\\u19ab\\u19b0-\\u19c9\\u1a00-\\u1a16\\u1a20-\\u1a54\\u1aa7\\u1b05-\\u1b33\\u1b45-\\u1b4c\\u1b83-\\u1ba0\\u1bae\\u1baf\\u1bba-\\u1be5\\u1c00-\\u1c23\\u1c4d-\\u1c4f\\u1c5a-\\u1c7d\\u1c80-\\u1c8a\\u1c90-\\u1cba\\u1cbd-\\u1cbf\\u1ce9-\\u1cec\\u1cee-\\u1cf3\\u1cf5\\u1cf6\\u1cfa\\u1d00-\\u1dbf\\u1e00-\\u1f15\\u1f18-\\u1f1d\\u1f20-\\u1f45\\u1f48-\\u1f4d\\u1f50-\\u1f57\\u1f59\\u1f5b\\u1f5d\\u1f5f-\\u1f7d\\u1f80-\\u1fb4\\u1fb6-\\u1fbc\\u1fbe\\u1fc2-\\u1fc4\\u1fc6-\\u1fcc\\u1fd0-\\u1fd3\\u1fd6-\\u1fdb\\u1fe0-\\u1fec\\u1ff2-\\u1ff4\\u1ff6-\\u1ffc\\u2071\\u207f\\u2090-\\u209c\\u2102\\u2107\\u210a-\\u2113\\u2115\\u2118-\\u211d\\u2124\\u2126\\u2128\\u212a-\\u2139\\u213c-\\u213f\\u2145-\\u2149\\u214e\\u2160-\\u2188\\u2c00-\\u2ce4\\u2ceb-\\u2cee\\u2cf2\\u2cf3\\u2d00-\\u2d25\\u2d27\\u2d2d\\u2d30-\\u2d67\\u2d6f\\u2d80-\\u2d96\\u2da0-\\u2da6\\u2da8-\\u2dae\\u2db0-\\u2db6\\u2db8-\\u2dbe\\u2dc0-\\u2dc6\\u2dc8-\\u2dce\\u2dd0-\\u2dd6\\u2dd8-\\u2dde\\u3005-\\u3007\\u3021-\\u3029\\u3031-\\u3035\\u3038-\\u303c\\u3041-\\u3096\\u309b-\\u309f\\u30a1-\\u30fa\\u30fc-\\u30ff\\u3105-\\u312f\\u3131-\\u318e\\u31a0-\\u31bf\\u31f0-\\u31ff\\u3400-\\u4dbf\\u4e00-\\ua48c\\ua4d0-\\ua4fd\\ua500-\\ua60c\\ua610-\\ua61f\\ua62a\\ua62b\\ua640-\\ua66e\\ua67f-\\ua69d\\ua6a0-\\ua6ef\\ua717-\\ua71f\\ua722-\\ua788\\ua78b-\\ua7dc\\ua7f1-\\ua801\\ua803-\\ua805\\ua807-\\ua80a\\ua80c-\\ua822\\ua840-\\ua873\\ua882-\\ua8b3\\ua8f2-\\ua8f7\\ua8fb\\ua8fd\\ua8fe\\ua90a-\\ua925\\ua930-\\ua946\\ua960-\\ua97c\\ua984-\\ua9b2\\ua9cf\\ua9e0-\\ua9e4\\ua9e6-\\ua9ef\\ua9fa-\\ua9fe\\uaa00-\\uaa28\\uaa40-\\uaa42\\uaa44-\\uaa4b\\uaa60-\\uaa76\\uaa7a\\uaa7e-\\uaaaf\\uaab1\\uaab5\\uaab6\\uaab9-\\uaabd\\uaac0\\uaac2\\uaadb-\\uaadd\\uaae0-\\uaaea\\uaaf2-\\uaaf4\\uab01-\\uab06\\uab09-\\uab0e\\uab11-\\uab16\\uab20-\\uab26\\uab28-\\uab2e\\uab30-\\uab5a\\uab5c-\\uab69\\uab70-\\uabe2\\uac00-\\ud7a3\\ud7b0-\\ud7c6\\ud7cb-\\ud7fb\\uf900-\\ufa6d\\ufa70-\\ufad9\\ufb00-\\ufb06\\ufb13-\\ufb17\\ufb1d\\ufb1f-\\ufb28\\ufb2a-\\ufb36\\ufb38-\\ufb3c\\ufb3e\\ufb40\\ufb41\\ufb43\\ufb44\\ufb46-\\ufbb1\\ufbd3-\\ufd3d\\ufd50-\\ufd8f\\ufd92-\\ufdc7\\ufdf0-\\ufdfb\\ufe70-\\ufe74\\ufe76-\\ufefc\\uff21-\\uff3a\\uff41-\\uff5a\\uff66-\\uffbe\\uffc2-\\uffc7\\uffca-\\uffcf\\uffd2-\\uffd7\\uffda-\\uffdc";
var bmpIdentifierChars = "\\xb7\\u0300-\\u036f\\u0387\\u0483-\\u0487\\u0591-\\u05bd\\u05bf\\u05c1\\u05c2\\u05c4\\u05c5\\u05c7\\u0610-\\u061a\\u064b-\\u0669\\u0670\\u06d6-\\u06dc\\u06df-\\u06e4\\u06e7\\u06e8\\u06ea-\\u06ed\\u06f0-\\u06f9\\u0711\\u0730-\\u074a\\u07a6-\\u07b0\\u07c0-\\u07c9\\u07eb-\\u07f3\\u07fd\\u0816-\\u0819\\u081b-\\u0823\\u0825-\\u0827\\u0829-\\u082d\\u0859-\\u085b\\u0897-\\u089f\\u08ca-\\u08e1\\u08e3-\\u0903\\u093a-\\u093c\\u093e-\\u094f\\u0951-\\u0957\\u0962\\u0963\\u0966-\\u096f\\u0981-\\u0983\\u09bc\\u09be-\\u09c4\\u09c7\\u09c8\\u09cb-\\u09cd\\u09d7\\u09e2\\u09e3\\u09e6-\\u09ef\\u09fe\\u0a01-\\u0a03\\u0a3c\\u0a3e-\\u0a42\\u0a47\\u0a48\\u0a4b-\\u0a4d\\u0a51\\u0a66-\\u0a71\\u0a75\\u0a81-\\u0a83\\u0abc\\u0abe-\\u0ac5\\u0ac7-\\u0ac9\\u0acb-\\u0acd\\u0ae2\\u0ae3\\u0ae6-\\u0aef\\u0afa-\\u0aff\\u0b01-\\u0b03\\u0b3c\\u0b3e-\\u0b44\\u0b47\\u0b48\\u0b4b-\\u0b4d\\u0b55-\\u0b57\\u0b62\\u0b63\\u0b66-\\u0b6f\\u0b82\\u0bbe-\\u0bc2\\u0bc6-\\u0bc8\\u0bca-\\u0bcd\\u0bd7\\u0be6-\\u0bef\\u0c00-\\u0c04\\u0c3c\\u0c3e-\\u0c44\\u0c46-\\u0c48\\u0c4a-\\u0c4d\\u0c55\\u0c56\\u0c62\\u0c63\\u0c66-\\u0c6f\\u0c81-\\u0c83\\u0cbc\\u0cbe-\\u0cc4\\u0cc6-\\u0cc8\\u0cca-\\u0ccd\\u0cd5\\u0cd6\\u0ce2\\u0ce3\\u0ce6-\\u0cef\\u0cf3\\u0d00-\\u0d03\\u0d3b\\u0d3c\\u0d3e-\\u0d44\\u0d46-\\u0d48\\u0d4a-\\u0d4d\\u0d57\\u0d62\\u0d63\\u0d66-\\u0d6f\\u0d81-\\u0d83\\u0dca\\u0dcf-\\u0dd4\\u0dd6\\u0dd8-\\u0ddf\\u0de6-\\u0def\\u0df2\\u0df3\\u0e31\\u0e34-\\u0e3a\\u0e47-\\u0e4e\\u0e50-\\u0e59\\u0eb1\\u0eb4-\\u0ebc\\u0ec8-\\u0ece\\u0ed0-\\u0ed9\\u0f18\\u0f19\\u0f20-\\u0f29\\u0f35\\u0f37\\u0f39\\u0f3e\\u0f3f\\u0f71-\\u0f84\\u0f86\\u0f87\\u0f8d-\\u0f97\\u0f99-\\u0fbc\\u0fc6\\u102b-\\u103e\\u1040-\\u1049\\u1056-\\u1059\\u105e-\\u1060\\u1062-\\u1064\\u1067-\\u106d\\u1071-\\u1074\\u1082-\\u108d\\u108f-\\u109d\\u135d-\\u135f\\u1369-\\u1371\\u1712-\\u1715\\u1732-\\u1734\\u1752\\u1753\\u1772\\u1773\\u17b4-\\u17d3\\u17dd\\u17e0-\\u17e9\\u180b-\\u180d\\u180f-\\u1819\\u18a9\\u1920-\\u192b\\u1930-\\u193b\\u1946-\\u194f\\u19d0-\\u19da\\u1a17-\\u1a1b\\u1a55-\\u1a5e\\u1a60-\\u1a7c\\u1a7f-\\u1a89\\u1a90-\\u1a99\\u1ab0-\\u1abd\\u1abf-\\u1add\\u1ae0-\\u1aeb\\u1b00-\\u1b04\\u1b34-\\u1b44\\u1b50-\\u1b59\\u1b6b-\\u1b73\\u1b80-\\u1b82\\u1ba1-\\u1bad\\u1bb0-\\u1bb9\\u1be6-\\u1bf3\\u1c24-\\u1c37\\u1c40-\\u1c49\\u1c50-\\u1c59\\u1cd0-\\u1cd2\\u1cd4-\\u1ce8\\u1ced\\u1cf4\\u1cf7-\\u1cf9\\u1dc0-\\u1dff\\u200c\\u200d\\u203f\\u2040\\u2054\\u20d0-\\u20dc\\u20e1\\u20e5-\\u20f0\\u2cef-\\u2cf1\\u2d7f\\u2de0-\\u2dff\\u302a-\\u302f\\u3099\\u309a\\u30fb\\ua620-\\ua629\\ua66f\\ua674-\\ua67d\\ua69e\\ua69f\\ua6f0\\ua6f1\\ua802\\ua806\\ua80b\\ua823-\\ua827\\ua82c\\ua880\\ua881\\ua8b4-\\ua8c5\\ua8d0-\\ua8d9\\ua8e0-\\ua8f1\\ua8ff-\\ua909\\ua926-\\ua92d\\ua947-\\ua953\\ua980-\\ua983\\ua9b3-\\ua9c0\\ua9d0-\\ua9d9\\ua9e5\\ua9f0-\\ua9f9\\uaa29-\\uaa36\\uaa43\\uaa4c\\uaa4d\\uaa50-\\uaa59\\uaa7b-\\uaa7d\\uaab0\\uaab2-\\uaab4\\uaab7\\uaab8\\uaabe\\uaabf\\uaac1\\uaaeb-\\uaaef\\uaaf5\\uaaf6\\uabe3-\\uabea\\uabec\\uabed\\uabf0-\\uabf9\\ufb1e\\ufe00-\\ufe0f\\ufe20-\\ufe2f\\ufe33\\ufe34\\ufe4d-\\ufe4f\\uff10-\\uff19\\uff3f\\uff65";
var supplementaryIdentifierStartCodes = [0, 11, 2, 25, 2, 18, 2, 1, 2, 14, 3, 13, 35, 122, 70, 52, 268, 28, 4, 48, 48, 31, 14, 29, 6, 37, 11, 29, 3, 35, 5, 7, 2, 4, 43, 157, 19, 35, 5, 35, 5, 39, 9, 51, 13, 10, 2, 14, 2, 6, 2, 1, 2, 10, 2, 14, 2, 6, 2, 1, 4, 51, 13, 310, 10, 21, 11, 7, 25, 5, 2, 41, 2, 8, 70, 5, 3, 0, 2, 43, 2, 1, 4, 0, 3, 22, 11, 22, 10, 30, 66, 18, 2, 1, 11, 21, 11, 25, 7, 25, 39, 55, 7, 1, 65, 0, 16, 3, 2, 2, 2, 28, 43, 28, 4, 28, 36, 7, 2, 27, 28, 53, 11, 21, 11, 18, 14, 17, 111, 72, 56, 50, 14, 50, 14, 35, 39, 27, 10, 22, 251, 41, 7, 1, 17, 5, 57, 28, 11, 0, 9, 21, 43, 17, 47, 20, 28, 22, 13, 52, 58, 1, 3, 0, 14, 44, 33, 24, 27, 35, 30, 0, 3, 0, 9, 34, 4, 0, 13, 47, 15, 3, 22, 0, 2, 0, 36, 17, 2, 24, 20, 1, 64, 6, 2, 0, 2, 3, 2, 14, 2, 9, 8, 46, 39, 7, 3, 1, 3, 21, 2, 6, 2, 1, 2, 4, 4, 0, 19, 0, 13, 4, 31, 9, 2, 0, 3, 0, 2, 37, 2, 0, 26, 0, 2, 0, 45, 52, 19, 3, 21, 2, 31, 47, 21, 1, 2, 0, 185, 46, 42, 3, 37, 47, 21, 0, 60, 42, 14, 0, 72, 26, 38, 6, 186, 43, 117, 63, 32, 7, 3, 0, 3, 7, 2, 1, 2, 23, 16, 0, 2, 0, 95, 7, 3, 38, 17, 0, 2, 0, 29, 0, 11, 39, 8, 0, 22, 0, 12, 45, 20, 0, 19, 72, 200, 32, 32, 8, 2, 36, 18, 0, 50, 29, 113, 6, 2, 1, 2, 37, 22, 0, 26, 5, 2, 1, 2, 31, 15, 0, 24, 43, 261, 18, 16, 0, 2, 12, 2, 33, 125, 0, 80, 921, 103, 110, 18, 195, 2637, 96, 16, 1071, 18, 5, 26, 3994, 6, 582, 6842, 29, 1763, 568, 8, 30, 18, 78, 18, 29, 19, 47, 17, 3, 32, 20, 6, 18, 433, 44, 212, 63, 33, 24, 3, 24, 45, 74, 6, 0, 67, 12, 65, 1, 2, 0, 15, 4, 10, 7381, 42, 31, 98, 114, 8702, 3, 2, 6, 2, 1, 2, 290, 16, 0, 30, 2, 3, 0, 15, 3, 9, 395, 2309, 106, 6, 12, 4, 8, 8, 9, 5991, 84, 2, 70, 2, 1, 3, 0, 3, 1, 3, 3, 2, 11, 2, 0, 2, 6, 2, 64, 2, 3, 3, 7, 2, 6, 2, 27, 2, 3, 2, 4, 2, 0, 4, 6, 2, 339, 3, 24, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 7, 1845, 30, 7, 5, 262, 61, 147, 44, 11, 6, 17, 0, 322, 29, 19, 43, 485, 27, 229, 29, 3, 0, 208, 30, 2, 2, 2, 1, 2, 6, 3, 4, 10, 1, 225, 6, 2, 3, 2, 1, 2, 14, 2, 196, 60, 67, 8, 0, 1205, 3, 2, 26, 2, 1, 2, 0, 3, 0, 2, 9, 2, 3, 2, 0, 2, 0, 7, 0, 5, 0, 2, 0, 2, 0, 2, 2, 2, 1, 2, 0, 3, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 1, 2, 0, 3, 3, 2, 6, 2, 3, 2, 3, 2, 0, 2, 9, 2, 16, 6, 2, 2, 4, 2, 16, 4421, 42719, 33, 4381, 3, 5773, 3, 7472, 16, 621, 2467, 541, 1507, 4938, 6, 8489];
var supplementaryIdentifierCodes = [509, 0, 227, 0, 150, 4, 294, 9, 1368, 2, 2, 1, 6, 3, 41, 2, 5, 0, 166, 1, 574, 3, 9, 9, 7, 9, 32, 4, 318, 1, 78, 5, 71, 10, 50, 3, 123, 2, 54, 14, 32, 10, 3, 1, 11, 3, 46, 10, 8, 0, 46, 9, 7, 2, 37, 13, 2, 9, 6, 1, 45, 0, 13, 2, 49, 13, 9, 3, 2, 11, 83, 11, 7, 0, 3, 0, 158, 11, 6, 9, 7, 3, 56, 1, 2, 6, 3, 1, 3, 2, 10, 0, 11, 1, 3, 6, 4, 4, 68, 8, 2, 0, 3, 0, 2, 3, 2, 4, 2, 0, 15, 1, 83, 17, 10, 9, 5, 0, 82, 19, 13, 9, 214, 6, 3, 8, 28, 1, 83, 16, 16, 9, 82, 12, 9, 9, 7, 19, 58, 14, 5, 9, 243, 14, 166, 9, 71, 5, 2, 1, 3, 3, 2, 0, 2, 1, 13, 9, 120, 6, 3, 6, 4, 0, 29, 9, 41, 6, 2, 3, 9, 0, 10, 10, 47, 15, 199, 7, 137, 9, 54, 7, 2, 7, 17, 9, 57, 21, 2, 13, 123, 5, 4, 0, 2, 1, 2, 6, 2, 0, 9, 9, 49, 4, 2, 1, 2, 4, 9, 9, 55, 9, 266, 3, 10, 1, 2, 0, 49, 6, 4, 4, 14, 10, 5350, 0, 7, 14, 11465, 27, 2343, 9, 87, 9, 39, 4, 60, 6, 26, 9, 535, 9, 470, 0, 2, 54, 8, 3, 82, 0, 12, 1, 19628, 1, 4178, 9, 519, 45, 3, 22, 543, 4, 4, 5, 9, 7, 3, 6, 31, 3, 149, 2, 1418, 49, 513, 54, 5, 49, 9, 0, 15, 0, 23, 4, 2, 14, 1361, 6, 2, 16, 3, 6, 2, 1, 2, 4, 101, 0, 161, 6, 10, 9, 357, 0, 62, 13, 499, 13, 245, 1, 2, 9, 233, 0, 3, 0, 8, 1, 6, 0, 475, 6, 110, 6, 6, 9, 4759, 9, 787719, 239];
var bmpIdentifierStart = new RegExp("[" + bmpIdentifierStartChars + "]");
var bmpIdentifier = new RegExp("[" + bmpIdentifierStartChars + bmpIdentifierChars + "]");
function isInSupplementarySet(code2, set) {
  let pos = 65536;
  for (let i = 0, length = set.length; i < length; i += 2) {
    pos += set[i];
    if (pos > code2) return false;
    pos += set[i + 1];
    if (pos >= code2) return true;
  }
  return false;
}
function isIdentifierStart(code2) {
  if (code2 < 65) return code2 === 36;
  if (code2 <= 90) return true;
  if (code2 < 97) return code2 === 95;
  if (code2 <= 122) return true;
  if (code2 <= 65535) {
    return code2 >= 170 && bmpIdentifierStart.test(String.fromCharCode(code2));
  }
  return isInSupplementarySet(code2, supplementaryIdentifierStartCodes);
}
function isIdentifierChar(code2) {
  if (code2 < 48) return code2 === 36;
  if (code2 < 58) return true;
  if (code2 < 65) return false;
  if (code2 <= 90) return true;
  if (code2 < 97) return code2 === 95;
  if (code2 <= 122) return true;
  if (code2 <= 65535) {
    return code2 >= 170 && bmpIdentifier.test(String.fromCharCode(code2));
  }
  return isInSupplementarySet(code2, supplementaryIdentifierStartCodes) || isInSupplementarySet(code2, supplementaryIdentifierCodes);
}
var reservedWords = {
  keyword: ["break", "case", "catch", "continue", "debugger", "default", "do", "else", "finally", "for", "function", "if", "return", "switch", "throw", "try", "var", "const", "while", "with", "new", "this", "super", "class", "extends", "export", "import", "null", "true", "false", "in", "instanceof", "typeof", "void", "delete"],
  strict: ["implements", "interface", "let", "package", "private", "protected", "public", "static", "yield"],
  strictBind: ["eval", "arguments"]
};
var keywords = new Set(reservedWords.keyword);
var reservedWordsStrictSet = new Set(reservedWords.strict);
var reservedWordsStrictBindSet = new Set(reservedWords.strictBind);
function isReservedWord(word, inModule) {
  return inModule && word === "await" || word === "enum";
}
function isStrictReservedWord(word, inModule) {
  return isReservedWord(word, inModule) || reservedWordsStrictSet.has(word);
}
function isStrictBindOnlyReservedWord(word) {
  return reservedWordsStrictBindSet.has(word);
}
function isStrictBindReservedWord(word, inModule) {
  return isStrictReservedWord(word, inModule) || isStrictBindOnlyReservedWord(word);
}
function isKeyword(word) {
  return keywords.has(word);
}
function isIteratorStart(current, next, next2) {
  return current === 64 && next === 64 && isIdentifierStart(next2);
}
var reservedWordLikeSet = /* @__PURE__ */ new Set(["break", "case", "catch", "continue", "debugger", "default", "do", "else", "finally", "for", "function", "if", "return", "switch", "throw", "try", "var", "const", "while", "with", "new", "this", "super", "class", "extends", "export", "import", "null", "true", "false", "in", "instanceof", "typeof", "void", "delete", "implements", "interface", "let", "package", "private", "protected", "public", "static", "yield", "eval", "arguments", "enum", "await"]);
function canBeReservedWord(word) {
  return reservedWordLikeSet.has(word);
}
var Scope = class {
  flags = 0;
  names = /* @__PURE__ */ new Map();
  firstLexicalName = "";
  constructor(flags) {
    this.flags = flags;
  }
};
var ScopeHandler = class {
  parser;
  scopeStack = [];
  inModule;
  undefinedExports = /* @__PURE__ */ new Map();
  constructor(parser, inModule) {
    this.parser = parser;
    this.inModule = inModule;
  }
  get inTopLevel() {
    return (this.currentScope().flags & 1) > 0;
  }
  get inFunction() {
    return (this.currentVarScopeFlags() & 2) > 0;
  }
  get allowSuper() {
    return (this.currentThisScopeFlags() & 16) > 0;
  }
  get allowDirectSuper() {
    return (this.currentThisScopeFlags() & 32) > 0;
  }
  get allowNewTarget() {
    return (this.currentThisScopeFlags() & 512) > 0;
  }
  get inClass() {
    return (this.currentThisScopeFlags() & 64) > 0;
  }
  get inClassAndNotInNonArrowFunction() {
    const flags = this.currentThisScopeFlags();
    return (flags & 64) > 0 && (flags & 2) === 0;
  }
  get inStaticBlock() {
    for (let i = this.scopeStack.length - 1; ; i--) {
      const {
        flags
      } = this.scopeStack[i];
      if (flags & 128) {
        return true;
      }
      if (flags & (3715 | 64)) {
        return false;
      }
    }
  }
  get inNonArrowFunction() {
    return (this.currentThisScopeFlags() & 2) > 0;
  }
  get inBareCaseStatement() {
    return (this.currentScope().flags & 256) > 0;
  }
  get treatFunctionsAsVar() {
    return this.treatFunctionsAsVarInScope(this.currentScope());
  }
  createScope(flags) {
    return new Scope(flags);
  }
  enter(flags) {
    this.scopeStack.push(this.createScope(flags));
  }
  exit() {
    const scope = this.scopeStack.pop();
    return scope.flags;
  }
  treatFunctionsAsVarInScope(scope) {
    return !!(scope.flags & (2 | 128) || !this.parser.inModule && scope.flags & 1);
  }
  declareName(name, bindingType, loc) {
    let scope = this.currentScope();
    if (bindingType & 8 || bindingType & 16) {
      this.checkRedeclarationInScope(scope, name, bindingType, loc);
      let type = scope.names.get(name) || 0;
      if (bindingType & 16) {
        type = type | 4;
      } else {
        if (!scope.firstLexicalName) {
          scope.firstLexicalName = name;
        }
        type = type | 2;
      }
      scope.names.set(name, type);
      if (bindingType & 8) {
        this.maybeExportDefined(scope, name);
      }
    } else if (bindingType & 4) {
      for (let i = this.scopeStack.length - 1; i >= 0; --i) {
        scope = this.scopeStack[i];
        this.checkRedeclarationInScope(scope, name, bindingType, loc);
        scope.names.set(name, (scope.names.get(name) || 0) | 1);
        this.maybeExportDefined(scope, name);
        if (scope.flags & 3715) break;
      }
    }
    if (this.parser.inModule && scope.flags & 1) {
      this.undefinedExports.delete(name);
    }
  }
  maybeExportDefined(scope, name) {
    if (this.parser.inModule && scope.flags & 1) {
      this.undefinedExports.delete(name);
    }
  }
  checkRedeclarationInScope(scope, name, bindingType, loc) {
    if (this.isRedeclaredInScope(scope, name, bindingType)) {
      this.parser.raise(Errors.VarRedeclaration, loc, {
        identifierName: name
      });
    }
  }
  isRedeclaredInScope(scope, name, bindingType) {
    if (!(bindingType & 1)) return false;
    if (bindingType & 8) {
      return scope.names.has(name);
    }
    const type = scope.names.get(name) || 0;
    if (bindingType & 16) {
      return (type & 2) > 0 || !this.treatFunctionsAsVarInScope(scope) && (type & 1) > 0;
    }
    return (type & 2) > 0 && !(scope.flags & 8 && scope.firstLexicalName === name) || !this.treatFunctionsAsVarInScope(scope) && (type & 4) > 0;
  }
  checkLocalExport(id) {
    const {
      name
    } = id;
    const topLevelScope = this.scopeStack[0];
    if (!topLevelScope.names.has(name)) {
      this.undefinedExports.set(name, id.start);
    }
  }
  currentScope() {
    return this.scopeStack[this.scopeStack.length - 1];
  }
  currentVarScopeFlags() {
    for (let i = this.scopeStack.length - 1; ; i--) {
      const {
        flags
      } = this.scopeStack[i];
      if (flags & 3715) {
        return flags;
      }
    }
  }
  currentThisScopeFlags() {
    for (let i = this.scopeStack.length - 1; ; i--) {
      const {
        flags
      } = this.scopeStack[i];
      if (flags & (3715 | 64) && !(flags & 4)) {
        return flags;
      }
    }
  }
};
var FlowScope = class extends Scope {
  declareFunctions = /* @__PURE__ */ new Set();
};
var FlowScopeHandler = class extends ScopeHandler {
  createScope(flags) {
    return new FlowScope(flags);
  }
  declareName(name, bindingType, loc) {
    const scope = this.currentScope();
    if (bindingType & 2048) {
      this.checkRedeclarationInScope(scope, name, bindingType, loc);
      this.maybeExportDefined(scope, name);
      scope.declareFunctions.add(name);
      return;
    }
    super.declareName(name, bindingType, loc);
  }
  isRedeclaredInScope(scope, name, bindingType) {
    if (super.isRedeclaredInScope(scope, name, bindingType)) return true;
    if (bindingType & 2048 && !scope.declareFunctions.has(name)) {
      const type = scope.names.get(name);
      return (type & 4) > 0 || (type & 2) > 0;
    }
    return false;
  }
  checkLocalExport(id) {
    if (!this.scopeStack[0].declareFunctions.has(id.name)) {
      super.checkLocalExport(id);
    }
  }
};
var reservedTypes = /* @__PURE__ */ new Set(["_", "any", "bool", "boolean", "empty", "extends", "false", "interface", "mixed", "null", "number", "static", "string", "true", "typeof", "void"]);
var FlowErrorTemplates = {
  AmbiguousConditionalArrow: "Ambiguous expression: wrap the arrow functions in parentheses to disambiguate.",
  AmbiguousDeclareModuleKind: "Found both `declare module.exports` and `declare export` in the same module. Modules can only have 1 since they are either an ES module or they are a CommonJS module.",
  AssignReservedType: ({
    reservedType
  }) => `Cannot overwrite reserved type ${reservedType}.`,
  DeclareClassElement: "The `declare` modifier can only appear on class fields.",
  DeclareClassFieldInitializer: "Initializers are not allowed in fields with the `declare` modifier.",
  DuplicateDeclareModuleExports: "Duplicate `declare module.exports` statement.",
  EnumBooleanMemberNotInitialized: ({
    memberName,
    enumName
  }) => `Boolean enum members need to be initialized. Use either \`${memberName} = true,\` or \`${memberName} = false,\` in enum \`${enumName}\`.`,
  EnumDuplicateMemberName: ({
    memberName,
    enumName
  }) => `Enum member names need to be unique, but the name \`${memberName}\` has already been used before in enum \`${enumName}\`.`,
  EnumInconsistentMemberValues: ({
    enumName
  }) => `Enum \`${enumName}\` has inconsistent member initializers. Either use no initializers, or consistently use literals (either booleans, numbers, or strings) for all member initializers.`,
  EnumInvalidExplicitType: ({
    invalidEnumType,
    enumName
  }) => `Enum type \`${invalidEnumType}\` is not valid. Use one of \`boolean\`, \`number\`, \`string\`, or \`symbol\` in enum \`${enumName}\`.`,
  EnumInvalidExplicitTypeUnknownSupplied: ({
    enumName
  }) => `Supplied enum type is not valid. Use one of \`boolean\`, \`number\`, \`string\`, or \`symbol\` in enum \`${enumName}\`.`,
  EnumInvalidMemberInitializerPrimaryType: ({
    enumName,
    memberName,
    explicitType
  }) => `Enum \`${enumName}\` has type \`${explicitType}\`, so the initializer of \`${memberName}\` needs to be a ${explicitType} literal.`,
  EnumInvalidMemberInitializerSymbolType: ({
    enumName,
    memberName
  }) => `Symbol enum members cannot be initialized. Use \`${memberName},\` in enum \`${enumName}\`.`,
  EnumInvalidMemberInitializerUnknownType: ({
    enumName,
    memberName
  }) => `The enum member initializer for \`${memberName}\` needs to be a literal (either a boolean, number, or string) in enum \`${enumName}\`.`,
  EnumInvalidMemberName: ({
    enumName,
    memberName,
    suggestion
  }) => `Enum member names cannot start with lowercase 'a' through 'z'. Instead of using \`${memberName}\`, consider using \`${suggestion}\`, in enum \`${enumName}\`.`,
  EnumNumberMemberNotInitialized: ({
    enumName,
    memberName
  }) => `Number enum members need to be initialized, e.g. \`${memberName} = 1\` in enum \`${enumName}\`.`,
  EnumStringMemberInconsistentlyInitialized: ({
    enumName
  }) => `String enum members need to consistently either all use initializers, or use no initializers, in enum \`${enumName}\`.`,
  GetterMayNotHaveThisParam: "A getter cannot have a `this` parameter.",
  ImportTypeShorthandOnlyInPureImport: "The `type` and `typeof` keywords on named imports can only be used on regular `import` statements. It cannot be used with `import type` or `import typeof` statements.",
  InexactInsideExact: "Explicit inexact syntax cannot appear inside an explicit exact object type.",
  InexactInsideNonObject: "Explicit inexact syntax cannot appear in class or interface definitions.",
  InexactVariance: "Explicit inexact syntax cannot have variance.",
  InvalidNonTypeImportInDeclareModule: "Imports within a `declare module` body must always be `import type` or `import typeof`.",
  MissingTypeParamDefault: "Type parameter declaration needs a default, since a preceding type parameter declaration has a default.",
  NestedDeclareModule: "`declare module` cannot be used inside another `declare module`.",
  NestedFlowComment: "Cannot have a flow comment inside another flow comment.",
  PatternIsOptional: {
    message: "A binding pattern parameter cannot be optional in an implementation signature."
  },
  SetterMayNotHaveThisParam: "A setter cannot have a `this` parameter.",
  SpreadVariance: "Spread properties cannot have variance.",
  ThisParamAnnotationRequired: "A type annotation is required for the `this` parameter.",
  ThisParamBannedInConstructor: "Constructors cannot have a `this` parameter; constructors don't bind `this` like other functions.",
  ThisParamMayNotBeOptional: "The `this` parameter cannot be optional.",
  ThisParamMustBeFirst: "The `this` parameter must be the first function parameter.",
  ThisParamNoDefault: "The `this` parameter may not have a default value.",
  TypeBeforeInitializer: "Type annotations must come before default assignments, e.g. instead of `age = 25: number` use `age: number = 25`.",
  TypeCastInPattern: "The type cast expression is expected to be wrapped with parenthesis.",
  UnexpectedExplicitInexactInObject: "Explicit inexact syntax must appear at the end of an inexact object.",
  UnexpectedReservedType: ({
    reservedType
  }) => `Unexpected reserved type ${reservedType}.`,
  UnexpectedReservedUnderscore: "`_` is only allowed as a type argument to call or new.",
  UnexpectedSpaceBetweenModuloChecks: "Spaces between `%` and `checks` are not allowed here.",
  UnexpectedSpreadType: "Spread operator cannot appear in class or interface definitions.",
  UnexpectedSubtractionOperand: 'Unexpected token, expected "number" or "bigint".',
  UnexpectedTokenAfterTypeParameter: "Expected an arrow function after this type parameter declaration.",
  UnexpectedTypeParameterBeforeAsyncArrowFunction: "Type parameters must come after the async keyword, e.g. instead of `<T> async () => {}`, use `async <T>() => {}`.",
  UnsupportedDeclareExportKind: ({
    unsupportedExportKind,
    suggestion
  }) => `\`declare export ${unsupportedExportKind}\` is not supported. Use \`${suggestion}\` instead.`,
  UnsupportedStatementInDeclareModule: "Only declares and type imports are allowed inside declare module.",
  UnterminatedFlowComment: "Unterminated flow-comment."
};
var FlowErrors = ParseErrorEnum`flow`(FlowErrorTemplates);
function isEsModuleType(bodyElement) {
  return bodyElement.type === "DeclareExportAllDeclaration" || bodyElement.type === "DeclareExportDeclaration" && (!bodyElement.declaration || bodyElement.declaration.type !== "TypeAlias" && bodyElement.declaration.type !== "InterfaceDeclaration");
}
function hasTypeImportKind(node) {
  return node.importKind === "type" || node.importKind === "typeof";
}
var exportSuggestions = {
  const: "declare export var",
  let: "declare export var",
  type: "export type",
  interface: "export interface"
};
function partition(list, test) {
  const list1 = [];
  const list2 = [];
  for (let i = 0; i < list.length; i++) {
    (test(list[i], i, list) ? list1 : list2).push(list[i]);
  }
  return [list1, list2];
}
var FLOW_PRAGMA_REGEX = /\*?\s*@((?:no)?flow)\b/;
var flow = (superClass) => class FlowParserMixin extends superClass {
  flowPragma = void 0;
  getScopeHandler() {
    return FlowScopeHandler;
  }
  shouldParseTypes() {
    return this.getPluginOption("flow", "all") || this.flowPragma === "flow";
  }
  finishToken(type, val) {
    if (type !== 130 && type !== 9 && type !== 24) {
      if (this.flowPragma === void 0) {
        this.flowPragma = null;
      }
    }
    super.finishToken(type, val);
  }
  addComment(comment) {
    if (this.flowPragma === void 0) {
      const matches = FLOW_PRAGMA_REGEX.exec(comment.value);
      if (!matches) ;
      else if (matches[1] === "flow") {
        this.flowPragma = "flow";
      } else if (matches[1] === "noflow") {
        this.flowPragma = "noflow";
      } else {
        throw new Error("Unexpected flow pragma");
      }
    }
    super.addComment(comment);
  }
  flowParseTypeInitialiser(tok) {
    const oldInType = this.state.inType;
    this.state.inType = true;
    this.expect(tok || 10);
    const type = this.flowParseType();
    this.state.inType = oldInType;
    return type;
  }
  flowParsePredicate() {
    const node = this.startNode();
    const moduloLoc = this.state.startLoc;
    this.next();
    this.expectContextual(106);
    if (this.state.lastTokStartLoc.index > moduloLoc.index + 1) {
      this.raise(FlowErrors.UnexpectedSpaceBetweenModuloChecks, moduloLoc);
    }
    if (this.eat(6)) {
      node.value = super.parseExpression();
      this.expect(7);
      return this.finishNode(node, "DeclaredPredicate");
    } else {
      return this.finishNode(node, "InferredPredicate");
    }
  }
  flowParseTypeAndPredicateInitialiser(allowLonePredicate) {
    const oldInType = this.state.inType;
    this.state.inType = true;
    this.expect(10);
    let type = null;
    let predicate = null;
    if (allowLonePredicate && this.match(50)) {
      this.state.inType = oldInType;
      predicate = this.flowParsePredicate();
    } else {
      type = this.flowParseType();
      this.state.inType = oldInType;
      if (this.match(50)) {
        predicate = this.flowParsePredicate();
      }
    }
    return [type, predicate];
  }
  flowParseDeclareClass(node) {
    this.next();
    this.flowParseInterfaceish(node, true);
    return this.finishNode(node, "DeclareClass");
  }
  flowParseDeclareFunction(node) {
    this.next();
    const id = node.id = this.parseIdentifier();
    const typeNode = this.startNode();
    const typeContainer = this.startNode();
    if (this.match(43)) {
      typeNode.typeParameters = this.flowParseTypeParameterDeclaration();
    } else {
      typeNode.typeParameters = null;
    }
    this.expect(6);
    const tmp = this.flowParseFunctionTypeParams();
    typeNode.params = tmp.params;
    typeNode.rest = tmp.rest;
    typeNode.this = tmp._this;
    this.expect(7);
    [typeNode.returnType, node.predicate] = this.flowParseTypeAndPredicateInitialiser(false);
    typeContainer.typeAnnotation = this.finishNode(typeNode, "FunctionTypeAnnotation");
    id.typeAnnotation = this.finishNode(typeContainer, "TypeAnnotation");
    this.resetEndLocation(id);
    this.semicolon();
    this.scope.declareName(node.id.name, 2048, node.id.start);
    return this.finishNode(node, "DeclareFunction");
  }
  flowParseDeclare(node, insideModule) {
    if (this.match(76)) {
      return this.flowParseDeclareClass(node);
    } else if (this.match(64)) {
      return this.flowParseDeclareFunction(node);
    } else if (this.match(70)) {
      return this.flowParseDeclareVariable(node);
    } else if (this.eatContextual(123)) {
      if (this.match(12)) {
        return this.flowParseDeclareModuleExports(node);
      } else {
        if (insideModule) {
          this.raise(FlowErrors.NestedDeclareModule, this.state.lastTokStartLoc);
        }
        return this.flowParseDeclareModule(node);
      }
    } else if (this.isContextual(126)) {
      return this.flowParseDeclareTypeAlias(node);
    } else if (this.isContextual(127)) {
      return this.flowParseDeclareOpaqueType(node);
    } else if (this.isContextual(125)) {
      return this.flowParseDeclareInterface(node);
    } else if (this.match(78)) {
      return this.flowParseDeclareExportDeclaration(node, insideModule);
    }
    throw this.unexpected();
  }
  flowParseDeclareVariable(node) {
    this.next();
    node.id = this.flowParseTypeAnnotatableIdentifier();
    this.scope.declareName(node.id.name, 5, node.id.start);
    this.semicolon();
    return this.finishNode(node, "DeclareVariable");
  }
  flowParseDeclareModule(node) {
    this.scope.enter(0);
    if (this.match(130)) {
      node.id = super.parseExprAtom();
    } else {
      node.id = this.parseIdentifier();
    }
    const bodyNode = this.startNode();
    const body = bodyNode.body = [];
    this.expect(2);
    while (!this.match(4)) {
      const bodyNode2 = this.startNode();
      if (this.match(79)) {
        this.next();
        if (!this.isContextual(126) && !this.match(83)) {
          this.raise(FlowErrors.InvalidNonTypeImportInDeclareModule, this.state.lastTokStartLoc);
        }
        body.push(super.parseImport(bodyNode2));
      } else {
        this.expectContextual(121, FlowErrors.UnsupportedStatementInDeclareModule);
        body.push(this.flowParseDeclare(bodyNode2, true));
      }
    }
    this.scope.exit();
    this.expect(4);
    node.body = this.finishNode(bodyNode, "BlockStatement");
    let kind = null;
    let hasModuleExport = false;
    body.forEach((bodyElement) => {
      if (isEsModuleType(bodyElement)) {
        if (kind === "CommonJS") {
          this.raise(FlowErrors.AmbiguousDeclareModuleKind, bodyElement);
        }
        kind = "ES";
      } else if (bodyElement.type === "DeclareModuleExports") {
        if (hasModuleExport) {
          this.raise(FlowErrors.DuplicateDeclareModuleExports, bodyElement);
        }
        if (kind === "ES") {
          this.raise(FlowErrors.AmbiguousDeclareModuleKind, bodyElement);
        }
        kind = "CommonJS";
        hasModuleExport = true;
      }
    });
    node.kind = kind || "CommonJS";
    return this.finishNode(node, "DeclareModule");
  }
  flowParseDeclareExportDeclaration(node, insideModule) {
    this.expect(78);
    if (this.eat(61)) {
      if (this.match(64) || this.match(76)) {
        node.declaration = this.flowParseDeclare(this.startNode());
      } else {
        node.declaration = this.flowParseType();
        this.semicolon();
      }
      node.default = true;
      return this.finishNode(node, "DeclareExportDeclaration");
    } else {
      if (this.match(71) || this.isLet() || (this.isContextual(126) || this.isContextual(125)) && !insideModule) {
        const label = this.state.value;
        throw this.raise(FlowErrors.UnsupportedDeclareExportKind, this.state.startLoc, {
          unsupportedExportKind: label,
          suggestion: exportSuggestions[label]
        });
      }
      if (this.match(70) || this.match(64) || this.match(76) || this.isContextual(127)) {
        node.declaration = this.flowParseDeclare(this.startNode());
        node.default = false;
        return this.finishNode(node, "DeclareExportDeclaration");
      } else if (this.match(51) || this.match(2) || this.isContextual(125) || this.isContextual(126) || this.isContextual(127)) {
        const result = this.parseExport(node, null);
        if (result.type === "ExportNamedDeclaration") {
          result.default = false;
          delete result.exportKind;
          return this.castNodeTo(result, "DeclareExportDeclaration");
        } else {
          return this.castNodeTo(result, "DeclareExportAllDeclaration");
        }
      }
    }
    throw this.unexpected();
  }
  flowParseDeclareModuleExports(node) {
    this.next();
    this.expectContextual(107);
    node.typeAnnotation = this.flowParseTypeAnnotation();
    this.semicolon();
    return this.finishNode(node, "DeclareModuleExports");
  }
  flowParseDeclareTypeAlias(node) {
    this.next();
    const finished = this.flowParseTypeAlias(node);
    this.castNodeTo(finished, "DeclareTypeAlias");
    return finished;
  }
  flowParseDeclareOpaqueType(node) {
    this.next();
    return this.flowParseOpaqueType(node, true);
  }
  flowParseDeclareInterface(node) {
    this.next();
    this.flowParseInterfaceish(node, false);
    return this.finishNode(node, "DeclareInterface");
  }
  flowParseInterfaceish(node, isClass) {
    node.id = this.flowParseRestrictedIdentifier(!isClass, true);
    this.scope.declareName(node.id.name, isClass ? 17 : 8201, node.id.start);
    if (this.match(43)) {
      node.typeParameters = this.flowParseTypeParameterDeclaration();
    } else {
      node.typeParameters = null;
    }
    node.extends = [];
    if (this.eat(77)) {
      do {
        node.extends.push(this.flowParseInterfaceExtends());
      } while (!isClass && this.eat(8));
    }
    if (isClass) {
      const implemented = [];
      const mixins = [];
      if (this.eatContextual(113)) {
        do {
          mixins.push(this.flowParseInterfaceExtends());
        } while (this.eat(8));
      }
      if (this.eatContextual(109)) {
        do {
          implemented.push(this.flowParseClassImplements());
        } while (this.eat(8));
      }
      node.implements = implemented;
      node.mixins = mixins;
    }
    node.body = this.flowParseObjectType({
      allowStatic: isClass,
      allowExact: false,
      allowSpread: false,
      allowProto: isClass,
      allowInexact: false
    });
  }
  flowParseInterfaceExtends() {
    const node = this.startNode();
    node.id = this.flowParseQualifiedTypeIdentifier();
    if (this.match(43)) {
      node.typeParameters = this.flowParseTypeParameterInstantiation();
    } else {
      node.typeParameters = null;
    }
    return this.finishNode(node, "InterfaceExtends");
  }
  flowParseInterface(node) {
    this.flowParseInterfaceish(node, false);
    return this.finishNode(node, "InterfaceDeclaration");
  }
  checkNotUnderscore(word) {
    if (word === "_") {
      this.raise(FlowErrors.UnexpectedReservedUnderscore, this.state.startLoc);
    }
  }
  checkReservedType(word, startLoc, declaration) {
    if (!reservedTypes.has(word)) return;
    this.raise(declaration ? FlowErrors.AssignReservedType : FlowErrors.UnexpectedReservedType, startLoc, {
      reservedType: word
    });
  }
  flowParseRestrictedIdentifierName(liberal, declaration) {
    this.checkReservedType(this.state.value, this.state.startLoc, declaration);
    return this.parseIdentifierName(liberal);
  }
  flowParseRestrictedIdentifier(liberal, declaration) {
    const node = this.startNode();
    const name = this.flowParseRestrictedIdentifierName(liberal, declaration);
    return this.createIdentifier(node, name);
  }
  flowParseTypeAlias(node) {
    node.id = this.flowParseRestrictedIdentifier(false, true);
    this.scope.declareName(node.id.name, 8201, node.id.start);
    if (this.match(43)) {
      node.typeParameters = this.flowParseTypeParameterDeclaration();
    } else {
      node.typeParameters = null;
    }
    node.right = this.flowParseTypeInitialiser(25);
    this.semicolon();
    return this.finishNode(node, "TypeAlias");
  }
  flowParseOpaqueType(node, declare) {
    this.expectContextual(126);
    node.id = this.flowParseRestrictedIdentifier(true, true);
    this.scope.declareName(node.id.name, 8201, node.id.start);
    if (this.match(43)) {
      node.typeParameters = this.flowParseTypeParameterDeclaration();
    } else {
      node.typeParameters = null;
    }
    node.supertype = null;
    if (this.match(10)) {
      node.supertype = this.flowParseTypeInitialiser(10);
    }
    node.impltype = null;
    if (!declare) {
      node.impltype = this.flowParseTypeInitialiser(25);
    }
    this.semicolon();
    return this.finishNode(node, declare ? "DeclareOpaqueType" : "OpaqueType");
  }
  flowParseTypeParameterBound() {
    if (this.match(10) || this.isContextual(77)) {
      const node = this.startNode();
      this.next();
      node.typeAnnotation = this.flowParseType();
      return this.finishNode(node, "TypeAnnotation");
    }
  }
  flowParseTypeParameter(requireDefault = false) {
    const nodeStartLoc = this.state.startLoc;
    const node = this.startNode();
    const variance = this.flowParseVariance();
    node.name = this.flowParseRestrictedIdentifierName();
    node.variance = variance;
    node.bound = this.flowParseTypeParameterBound();
    if (this.match(25)) {
      this.eat(25);
      node.default = this.flowParseType();
    } else {
      if (requireDefault) {
        this.raise(FlowErrors.MissingTypeParamDefault, nodeStartLoc);
      }
    }
    return this.finishNode(node, "TypeParameter");
  }
  flowParseTypeParameterDeclaration() {
    const oldInType = this.state.inType;
    const node = this.startNode();
    node.params = [];
    this.state.inType = true;
    if (this.match(43) || this.match(138)) {
      this.next();
    } else {
      this.unexpected();
    }
    let defaultRequired = false;
    do {
      const typeParameter = this.flowParseTypeParameter(defaultRequired);
      node.params.push(typeParameter);
      if (typeParameter.default) {
        defaultRequired = true;
      }
      if (!this.match(44)) {
        this.expect(8);
      }
    } while (!this.match(44));
    this.expect(44);
    this.state.inType = oldInType;
    return this.finishNode(node, "TypeParameterDeclaration");
  }
  flowInTopLevelContext(cb) {
    if (this.curContext() !== types.brace) {
      const oldContext = this.state.context;
      this.state.context = [oldContext[0]];
      try {
        return cb();
      } finally {
        this.state.context = oldContext;
      }
    } else {
      return cb();
    }
  }
  flowParseTypeParameterInstantiationInExpression() {
    if (this.reScan_lt() !== 43) return;
    return this.flowParseTypeParameterInstantiation();
  }
  flowParseTypeParameterInstantiation() {
    const node = this.startNode();
    const oldInType = this.state.inType;
    this.state.inType = true;
    node.params = [];
    this.flowInTopLevelContext(() => {
      this.expect(43);
      const oldNoAnonFunctionType = this.state.noAnonFunctionType;
      this.state.noAnonFunctionType = false;
      while (!this.match(44)) {
        node.params.push(this.flowParseType());
        if (!this.match(44)) {
          this.expect(8);
        }
      }
      this.state.noAnonFunctionType = oldNoAnonFunctionType;
    });
    this.state.inType = oldInType;
    if (!this.state.inType && this.curContext() === types.brace) {
      this.reScan_lt_gt();
    }
    this.expect(44);
    return this.finishNode(node, "TypeParameterInstantiation");
  }
  flowParseTypeParameterInstantiationCallOrNew() {
    if (this.reScan_lt() !== 43) return null;
    const node = this.startNode();
    const oldInType = this.state.inType;
    node.params = [];
    this.state.inType = true;
    this.expect(43);
    while (!this.match(44)) {
      node.params.push(this.flowParseTypeOrImplicitInstantiation());
      if (!this.match(44)) {
        this.expect(8);
      }
    }
    this.expect(44);
    this.state.inType = oldInType;
    return this.finishNode(node, "TypeParameterInstantiation");
  }
  flowParseInterfaceType() {
    const node = this.startNode();
    this.expectContextual(125);
    node.extends = [];
    if (this.eat(77)) {
      do {
        node.extends.push(this.flowParseInterfaceExtends());
      } while (this.eat(8));
    }
    node.body = this.flowParseObjectType({
      allowStatic: false,
      allowExact: false,
      allowSpread: false,
      allowProto: false,
      allowInexact: false
    });
    return this.finishNode(node, "InterfaceTypeAnnotation");
  }
  flowParseObjectPropertyKey() {
    return this.match(131) || this.match(130) ? super.parseExprAtom() : this.parseIdentifier(true);
  }
  flowParseObjectTypeIndexer(node, isStatic, variance) {
    node.static = isStatic;
    if (this.lookahead().type === 10) {
      node.id = this.parseIdentifier(true);
      node.key = this.flowParseTypeInitialiser();
    } else {
      node.id = null;
      node.key = this.flowParseType();
    }
    this.expect(1);
    node.value = this.flowParseTypeInitialiser();
    node.variance = variance;
    return this.finishNode(node, "ObjectTypeIndexer");
  }
  flowParseObjectTypeInternalSlot(node, isStatic) {
    node.static = isStatic;
    node.id = this.parseIdentifier(true);
    this.expect(1);
    this.expect(1);
    if (this.match(43) || this.match(6)) {
      node.method = true;
      node.optional = false;
      node.value = this.flowParseObjectTypeMethodish(this.startNodeAtNode(node));
    } else {
      node.method = false;
      if (this.eat(13)) {
        node.optional = true;
      }
      node.value = this.flowParseTypeInitialiser();
    }
    return this.finishNode(node, "ObjectTypeInternalSlot");
  }
  flowParseObjectTypeMethodish(node) {
    node.params = [];
    node.rest = null;
    node.typeParameters = null;
    node.this = null;
    if (this.match(43)) {
      node.typeParameters = this.flowParseTypeParameterDeclaration();
    }
    this.expect(6);
    if (this.match(74)) {
      node.this = this.flowParseFunctionTypeParam(true);
      node.this.name = null;
      if (!this.match(7)) {
        this.expect(8);
      }
    }
    while (!this.match(7) && !this.match(17)) {
      node.params.push(this.flowParseFunctionTypeParam(false));
      if (!this.match(7)) {
        this.expect(8);
      }
    }
    if (this.eat(17)) {
      node.rest = this.flowParseFunctionTypeParam(false);
    }
    this.expect(7);
    node.returnType = this.flowParseTypeInitialiser();
    return this.finishNode(node, "FunctionTypeAnnotation");
  }
  flowParseObjectTypeCallProperty(node, isStatic) {
    const valueNode = this.startNode();
    node.static = isStatic;
    node.value = this.flowParseObjectTypeMethodish(valueNode);
    return this.finishNode(node, "ObjectTypeCallProperty");
  }
  flowParseObjectType({
    allowStatic,
    allowExact,
    allowSpread,
    allowProto,
    allowInexact
  }) {
    const oldInType = this.state.inType;
    this.state.inType = true;
    const nodeStart = this.startNode();
    nodeStart.callProperties = [];
    nodeStart.properties = [];
    nodeStart.indexers = [];
    nodeStart.internalSlots = [];
    let endDelim;
    let exact;
    let inexact = false;
    if (allowExact && this.match(3)) {
      this.expect(3);
      endDelim = 5;
      exact = true;
    } else {
      this.expect(2);
      endDelim = 4;
      exact = false;
    }
    nodeStart.exact = exact;
    while (!this.match(endDelim)) {
      let isStatic = false;
      let protoStartLoc = null;
      let inexactStartLoc = null;
      const node = this.startNode();
      if (allowProto && this.isContextual(114)) {
        const lookahead = this.lookahead();
        if (lookahead.type !== 10 && lookahead.type !== 13) {
          this.next();
          protoStartLoc = this.state.startLoc;
          allowStatic = false;
        }
      }
      if (allowStatic && this.isContextual(102)) {
        const lookahead = this.lookahead();
        if (lookahead.type !== 10 && lookahead.type !== 13) {
          this.next();
          isStatic = true;
        }
      }
      const variance = this.flowParseVariance();
      if (this.eat(0)) {
        if (protoStartLoc != null) {
          this.unexpected(protoStartLoc);
        }
        if (this.eat(0)) {
          if (variance) {
            this.unexpected(variance.start);
          }
          nodeStart.internalSlots.push(this.flowParseObjectTypeInternalSlot(node, isStatic));
        } else {
          nodeStart.indexers.push(this.flowParseObjectTypeIndexer(node, isStatic, variance));
        }
      } else if (this.match(6) || this.match(43)) {
        if (protoStartLoc != null) {
          this.unexpected(protoStartLoc);
        }
        if (variance) {
          this.unexpected(variance.start);
        }
        nodeStart.callProperties.push(this.flowParseObjectTypeCallProperty(node, isStatic));
      } else {
        let kind = "init";
        if (this.isContextual(95) || this.isContextual(100)) {
          const lookahead = this.lookahead();
          if (tokenIsLiteralPropertyName(lookahead.type)) {
            kind = this.state.value;
            this.next();
          }
        }
        const propOrInexact = this.flowParseObjectTypeProperty(node, isStatic, protoStartLoc, variance, kind, allowSpread, allowInexact ?? !exact);
        if (propOrInexact === null) {
          inexact = true;
          inexactStartLoc = this.state.lastTokStartLoc;
        } else {
          nodeStart.properties.push(propOrInexact);
        }
      }
      this.flowObjectTypeSemicolon();
      if (inexactStartLoc && !this.match(4) && !this.match(5)) {
        this.raise(FlowErrors.UnexpectedExplicitInexactInObject, inexactStartLoc);
      }
    }
    this.expect(endDelim);
    if (allowSpread) {
      nodeStart.inexact = inexact;
    }
    const out = this.finishNode(nodeStart, "ObjectTypeAnnotation");
    this.state.inType = oldInType;
    return out;
  }
  flowParseObjectTypeProperty(node, isStatic, protoStartLoc, variance, kind, allowSpread, allowInexact) {
    if (this.eat(17)) {
      const isInexactToken = this.match(8) || this.match(9) || this.match(4) || this.match(5);
      if (isInexactToken) {
        if (!allowSpread) {
          this.raise(FlowErrors.InexactInsideNonObject, this.state.lastTokStartLoc);
        } else if (!allowInexact) {
          this.raise(FlowErrors.InexactInsideExact, this.state.lastTokStartLoc);
        }
        if (variance) {
          this.raise(FlowErrors.InexactVariance, variance);
        }
        return null;
      }
      if (!allowSpread) {
        this.raise(FlowErrors.UnexpectedSpreadType, this.state.lastTokStartLoc);
      }
      if (protoStartLoc != null) {
        this.unexpected(protoStartLoc);
      }
      if (variance) {
        this.raise(FlowErrors.SpreadVariance, variance);
      }
      node.argument = this.flowParseType();
      return this.finishNode(node, "ObjectTypeSpreadProperty");
    } else {
      node.key = this.flowParseObjectPropertyKey();
      node.static = isStatic;
      node.proto = protoStartLoc != null;
      node.kind = kind;
      let optional = false;
      if (this.match(43) || this.match(6)) {
        node.method = true;
        if (protoStartLoc != null) {
          this.unexpected(protoStartLoc);
        }
        if (variance) {
          this.unexpected(variance.start);
        }
        node.value = this.flowParseObjectTypeMethodish(this.startNodeAtNode(node));
        if (kind === "get" || kind === "set") {
          this.flowCheckGetterSetterParams(node);
        } else if (!isStatic && !allowSpread && node.key.name === "constructor" && node.value.this) {
          this.raise(FlowErrors.ThisParamBannedInConstructor, node.value.this);
        }
      } else {
        if (kind !== "init") this.unexpected();
        node.method = false;
        if (this.eat(13)) {
          optional = true;
        }
        node.value = this.flowParseTypeInitialiser();
        node.variance = variance;
      }
      node.optional = optional;
      return this.finishNode(node, "ObjectTypeProperty");
    }
  }
  flowCheckGetterSetterParams(property) {
    const paramCount = property.kind === "get" ? 0 : 1;
    const value = property.value;
    const length = value.params.length + (value.rest ? 1 : 0);
    if (value.this) {
      this.raise(property.kind === "get" ? FlowErrors.GetterMayNotHaveThisParam : FlowErrors.SetterMayNotHaveThisParam, value.this);
    }
    if (length !== paramCount) {
      this.raise(property.kind === "get" ? Errors.BadGetterArity : Errors.BadSetterArity, property);
    }
    if (property.kind === "set" && value.rest) {
      this.raise(Errors.BadSetterRestParameter, property);
    }
  }
  flowObjectTypeSemicolon() {
    if (!this.eat(9) && !this.eat(8) && !this.match(4) && !this.match(5)) {
      this.unexpected();
    }
  }
  flowParseQualifiedTypeIdentifier(startLoc, id) {
    startLoc ??= this.state.startLoc;
    let node = id || this.flowParseRestrictedIdentifier(true);
    while (this.eat(12)) {
      const node2 = this.startNodeAt(startLoc);
      node2.qualification = node;
      node2.id = this.flowParseRestrictedIdentifier(true);
      node = this.finishNode(node2, "QualifiedTypeIdentifier");
    }
    return node;
  }
  flowParseGenericType(startLoc, id) {
    const node = this.startNodeAt(startLoc);
    node.typeParameters = null;
    node.id = this.flowParseQualifiedTypeIdentifier(startLoc, id);
    if (this.match(43)) {
      node.typeParameters = this.flowParseTypeParameterInstantiation();
    }
    return this.finishNode(node, "GenericTypeAnnotation");
  }
  flowParseTypeofType() {
    const node = this.startNode();
    this.expect(83);
    node.argument = this.flowParsePrimaryType();
    return this.finishNode(node, "TypeofTypeAnnotation");
  }
  flowParseTupleType() {
    const node = this.startNode();
    node.types = [];
    this.expect(0);
    while (this.state.pos < this.length && !this.match(1)) {
      node.types.push(this.flowParseType());
      if (this.match(1)) break;
      this.expect(8);
    }
    this.expect(1);
    return this.finishNode(node, "TupleTypeAnnotation");
  }
  flowParseFunctionTypeParam(first) {
    let name = null;
    let optional = false;
    let typeAnnotation;
    const node = this.startNode();
    const lh = this.lookahead();
    const isThis = this.state.type === 74;
    if (lh.type === 10 || lh.type === 13) {
      if (isThis && !first) {
        this.raise(FlowErrors.ThisParamMustBeFirst, node);
      }
      name = this.parseIdentifier(isThis);
      if (this.eat(13)) {
        optional = true;
        if (isThis) {
          this.raise(FlowErrors.ThisParamMayNotBeOptional, node);
        }
      }
      typeAnnotation = this.flowParseTypeInitialiser();
    } else {
      typeAnnotation = this.flowParseType();
    }
    node.name = name;
    node.optional = optional;
    node.typeAnnotation = typeAnnotation;
    return this.finishNode(node, "FunctionTypeParam");
  }
  reinterpretTypeAsFunctionTypeParam(type) {
    const node = this.startNodeAtNode(type);
    node.name = null;
    node.optional = false;
    node.typeAnnotation = type;
    return this.finishNode(node, "FunctionTypeParam");
  }
  flowParseFunctionTypeParams(params = []) {
    let rest = null;
    let _this = null;
    if (this.match(74)) {
      _this = this.flowParseFunctionTypeParam(true);
      _this.name = null;
      if (!this.match(7)) {
        this.expect(8);
      }
    }
    while (!this.match(7) && !this.match(17)) {
      params.push(this.flowParseFunctionTypeParam(false));
      if (!this.match(7)) {
        this.expect(8);
      }
    }
    if (this.eat(17)) {
      rest = this.flowParseFunctionTypeParam(false);
    }
    return {
      params,
      rest,
      _this
    };
  }
  flowIdentToTypeAnnotation(startLoc, node, id) {
    switch (id.name) {
      case "any":
        return this.finishNode(node, "AnyTypeAnnotation");
      case "bool":
      case "boolean":
        return this.finishNode(node, "BooleanTypeAnnotation");
      case "mixed":
        return this.finishNode(node, "MixedTypeAnnotation");
      case "empty":
        return this.finishNode(node, "EmptyTypeAnnotation");
      case "number":
        return this.finishNode(node, "NumberTypeAnnotation");
      case "string":
        return this.finishNode(node, "StringTypeAnnotation");
      case "symbol":
        return this.finishNode(node, "SymbolTypeAnnotation");
      default:
        this.checkNotUnderscore(id.name);
        return this.flowParseGenericType(startLoc, id);
    }
  }
  flowParsePrimaryType() {
    const startLoc = this.state.startLoc;
    const node = this.startNode();
    let tmp;
    let type;
    let isGroupedType = false;
    const oldNoAnonFunctionType = this.state.noAnonFunctionType;
    switch (this.state.type) {
      case 2:
        return this.flowParseObjectType({
          allowStatic: false,
          allowExact: false,
          allowSpread: true,
          allowProto: false,
          allowInexact: true
        });
      case 3:
        return this.flowParseObjectType({
          allowStatic: false,
          allowExact: true,
          allowSpread: true,
          allowProto: false,
          allowInexact: false
        });
      case 0:
        this.state.noAnonFunctionType = false;
        type = this.flowParseTupleType();
        this.state.noAnonFunctionType = oldNoAnonFunctionType;
        return type;
      case 43: {
        const node2 = this.startNode();
        node2.typeParameters = this.flowParseTypeParameterDeclaration();
        this.expect(6);
        tmp = this.flowParseFunctionTypeParams();
        node2.params = tmp.params;
        node2.rest = tmp.rest;
        node2.this = tmp._this;
        this.expect(7);
        this.expect(15);
        node2.returnType = this.flowParseType();
        return this.finishNode(node2, "FunctionTypeAnnotation");
      }
      case 6: {
        const node2 = this.startNode();
        this.next();
        if (!this.match(7) && !this.match(17)) {
          if (tokenIsIdentifier(this.state.type) || this.match(74)) {
            const token = this.lookahead().type;
            isGroupedType = token !== 13 && token !== 10;
          } else {
            isGroupedType = true;
          }
        }
        if (isGroupedType) {
          this.state.noAnonFunctionType = false;
          type = this.flowParseType();
          this.state.noAnonFunctionType = oldNoAnonFunctionType;
          if (this.state.noAnonFunctionType || !(this.match(8) || this.match(7) && this.lookahead().type === 15)) {
            this.expect(7);
            return type;
          } else {
            this.eat(8);
          }
        }
        if (type) {
          tmp = this.flowParseFunctionTypeParams([this.reinterpretTypeAsFunctionTypeParam(type)]);
        } else {
          tmp = this.flowParseFunctionTypeParams();
        }
        node2.params = tmp.params;
        node2.rest = tmp.rest;
        node2.this = tmp._this;
        this.expect(7);
        this.expect(15);
        node2.returnType = this.flowParseType();
        node2.typeParameters = null;
        return this.finishNode(node2, "FunctionTypeAnnotation");
      }
      case 130:
        return this.parseLiteral(this.state.value, "StringLiteralTypeAnnotation");
      case 81:
      case 82:
        node.value = this.match(81);
        this.next();
        return this.finishNode(node, "BooleanLiteralTypeAnnotation");
      case 49:
        if (this.state.value === "-") {
          this.next();
          if (this.match(131)) {
            return this.parseLiteralAtNode(-this.state.value, "NumberLiteralTypeAnnotation", node);
          }
          if (this.match(132)) {
            return this.parseLiteralAtNode(-this.state.value, "BigIntLiteralTypeAnnotation", node);
          }
          throw this.raise(FlowErrors.UnexpectedSubtractionOperand, this.state.startLoc);
        }
        throw this.unexpected();
      case 131:
        return this.parseLiteral(this.state.value, "NumberLiteralTypeAnnotation");
      case 132:
        return this.parseLiteral(this.state.value, "BigIntLiteralTypeAnnotation");
      case 84:
        this.next();
        return this.finishNode(node, "VoidTypeAnnotation");
      case 80:
        this.next();
        return this.finishNode(node, "NullLiteralTypeAnnotation");
      case 74:
        this.next();
        return this.finishNode(node, "ThisTypeAnnotation");
      case 51:
        this.next();
        return this.finishNode(node, "ExistsTypeAnnotation");
      case 83:
        return this.flowParseTypeofType();
      default:
        if (tokenIsKeyword(this.state.type)) {
          const label = tokenLabelName(this.state.type);
          this.next();
          return super.createIdentifier(node, label);
        } else if (tokenIsIdentifier(this.state.type)) {
          if (this.isContextual(125)) {
            return this.flowParseInterfaceType();
          }
          return this.flowIdentToTypeAnnotation(startLoc, node, this.parseIdentifier());
        }
    }
    throw this.unexpected();
  }
  flowParsePostfixType() {
    const startLoc = this.state.startLoc;
    let type = this.flowParsePrimaryType();
    let seenOptionalIndexedAccess = false;
    while ((this.match(0) || this.match(14)) && !this.canInsertSemicolon()) {
      const node = this.startNodeAt(startLoc);
      const optional = this.eat(14);
      seenOptionalIndexedAccess = seenOptionalIndexedAccess || optional;
      this.expect(0);
      if (!optional && this.match(1)) {
        node.elementType = type;
        this.next();
        type = this.finishNode(node, "ArrayTypeAnnotation");
      } else {
        node.objectType = type;
        node.indexType = this.flowParseType();
        this.expect(1);
        if (seenOptionalIndexedAccess) {
          node.optional = optional;
          type = this.finishNode(node, "OptionalIndexedAccessType");
        } else {
          type = this.finishNode(node, "IndexedAccessType");
        }
      }
    }
    return type;
  }
  flowParsePrefixType() {
    const node = this.startNode();
    if (this.eat(13)) {
      node.typeAnnotation = this.flowParsePrefixType();
      return this.finishNode(node, "NullableTypeAnnotation");
    } else {
      return this.flowParsePostfixType();
    }
  }
  flowParseAnonFunctionWithoutParens() {
    const param = this.flowParsePrefixType();
    if (!this.state.noAnonFunctionType && this.eat(15)) {
      const node = this.startNodeAtNode(param);
      node.params = [this.reinterpretTypeAsFunctionTypeParam(param)];
      node.rest = null;
      node.this = null;
      node.returnType = this.flowParseType();
      node.typeParameters = null;
      return this.finishNode(node, "FunctionTypeAnnotation");
    }
    return param;
  }
  flowParseIntersectionType() {
    const node = this.startNode();
    this.eat(41);
    const type = this.flowParseAnonFunctionWithoutParens();
    node.types = [type];
    while (this.eat(41)) {
      node.types.push(this.flowParseAnonFunctionWithoutParens());
    }
    return node.types.length === 1 ? type : this.finishNode(node, "IntersectionTypeAnnotation");
  }
  flowParseUnionType() {
    const node = this.startNode();
    this.eat(39);
    const type = this.flowParseIntersectionType();
    node.types = [type];
    while (this.eat(39)) {
      node.types.push(this.flowParseIntersectionType());
    }
    return node.types.length === 1 ? type : this.finishNode(node, "UnionTypeAnnotation");
  }
  flowParseType() {
    const oldInType = this.state.inType;
    this.state.inType = true;
    const type = this.flowParseUnionType();
    this.state.inType = oldInType;
    return type;
  }
  flowParseTypeOrImplicitInstantiation() {
    if (this.state.type === 128 && this.state.value === "_") {
      const startLoc = this.state.startLoc;
      const node = this.parseIdentifier();
      return this.flowParseGenericType(startLoc, node);
    } else {
      return this.flowParseType();
    }
  }
  flowParseTypeAnnotation() {
    const node = this.startNode();
    node.typeAnnotation = this.flowParseTypeInitialiser();
    return this.finishNode(node, "TypeAnnotation");
  }
  flowParseTypeAnnotatableIdentifier() {
    const node = this.startNode();
    const name = this.parseIdentifierName();
    if (this.match(10)) {
      node.typeAnnotation = this.flowParseTypeAnnotation();
    }
    return this.createIdentifier(node, name);
  }
  typeCastToParameter(node) {
    node.expression.typeAnnotation = node.typeAnnotation;
    this.resetEndLocationFromNode(node.expression, node.typeAnnotation);
    return node.expression;
  }
  flowParseVariance() {
    let variance = null;
    if (this.match(49)) {
      variance = this.startNode();
      if (this.state.value === "+") {
        variance.kind = "plus";
      } else {
        variance.kind = "minus";
      }
      this.next();
      return this.finishNode(variance, "Variance");
    }
    return variance;
  }
  parseFunctionBody(node, allowExpressionBody, isMethod = false) {
    if (allowExpressionBody) {
      this.forwardNoArrowParamsConversionAt(node, () => super.parseFunctionBody(node, true, isMethod));
      return;
    }
    super.parseFunctionBody(node, false, isMethod);
  }
  parseFunctionBodyAndFinish(node, type, isMethod = false) {
    if (this.match(10)) {
      const typeNode = this.startNode();
      if (type === "FunctionDeclaration" || type === "FunctionExpression" || type === "ArrowFunctionExpression") {
        [typeNode.typeAnnotation, node.predicate] = this.flowParseTypeAndPredicateInitialiser(true);
      } else {
        typeNode.typeAnnotation = this.flowParseTypeInitialiser();
      }
      node.returnType = typeNode.typeAnnotation ? this.finishNode(typeNode, "TypeAnnotation") : null;
    }
    return super.parseFunctionBodyAndFinish(node, type, isMethod);
  }
  parseStatementLike(flags) {
    if (this.state.strict && this.isContextual(125)) {
      const lookahead = this.lookahead();
      if (tokenIsKeywordOrIdentifier(lookahead.type)) {
        const node = this.startNode();
        this.next();
        return this.flowParseInterface(node);
      }
    } else if (this.isContextual(122)) {
      const node = this.startNode();
      this.next();
      return this.flowParseEnumDeclaration(node);
    }
    const stmt = super.parseStatementLike(flags);
    if (this.flowPragma === void 0 && !this.isValidDirective(stmt)) {
      this.flowPragma = null;
    }
    return stmt;
  }
  parseExpressionStatement(node, expr, decorators) {
    if (expr.type === "Identifier") {
      if (expr.name === "declare") {
        if (this.match(76) || tokenIsIdentifier(this.state.type) || this.match(64) || this.match(70) || this.match(78)) {
          return this.flowParseDeclare(node);
        }
      } else if (tokenIsIdentifier(this.state.type)) {
        if (expr.name === "interface") {
          return this.flowParseInterface(node);
        } else if (expr.name === "type") {
          return this.flowParseTypeAlias(node);
        } else if (expr.name === "opaque") {
          return this.flowParseOpaqueType(node, false);
        }
      }
    }
    return super.parseExpressionStatement(node, expr, decorators);
  }
  shouldParseExportDeclaration() {
    const {
      type
    } = this.state;
    if (type === 122 || tokenIsFlowInterfaceOrTypeOrOpaque(type)) {
      return !this.state.containsEsc;
    }
    return super.shouldParseExportDeclaration();
  }
  isExportDefaultSpecifier() {
    const {
      type
    } = this.state;
    if (type === 122 || tokenIsFlowInterfaceOrTypeOrOpaque(type)) {
      return this.state.containsEsc;
    }
    return super.isExportDefaultSpecifier();
  }
  parseExportDefaultExpression() {
    if (this.isContextual(122)) {
      const node = this.startNode();
      this.next();
      return this.flowParseEnumDeclaration(node);
    }
    return super.parseExportDefaultExpression();
  }
  parseConditional(expr, startLoc, refExpressionErrors) {
    if (!this.match(13)) return expr;
    if (refExpressionErrors != null) {
      const nextCh = this.lookaheadCharCode();
      if (nextCh === 44 || nextCh === 61 || nextCh === 58 || nextCh === 41) {
        this.setOptionalParametersError(refExpressionErrors);
        return expr;
      }
    }
    this.expect(13);
    const state = this.state.clone();
    const originalNoArrowAt = this.state.noArrowAt;
    const node = this.startNodeAt(startLoc);
    let {
      consequent,
      failed
    } = this.tryParseConditionalConsequent();
    const result = this.getArrowLikeExpressions(consequent);
    let valid = result[0];
    const invalid = result[1];
    if (failed || invalid.length > 0) {
      const noArrowAt = [...originalNoArrowAt];
      if (invalid.length > 0) {
        this.state = state;
        this.state.noArrowAt = noArrowAt;
        for (let i = 0; i < invalid.length; i++) {
          noArrowAt.push(invalid[i].start);
        }
        ({
          consequent,
          failed
        } = this.tryParseConditionalConsequent());
        [valid] = this.getArrowLikeExpressions(consequent);
      }
      if (failed && valid.length > 1) {
        this.raise(FlowErrors.AmbiguousConditionalArrow, state.startLoc);
      }
      if (failed && valid.length === 1) {
        this.state = state;
        noArrowAt.push(valid[0].start);
        this.state.noArrowAt = noArrowAt;
        ({
          consequent
        } = this.tryParseConditionalConsequent());
      }
    }
    this.getArrowLikeExpressions(consequent, true);
    this.state.noArrowAt = originalNoArrowAt;
    this.expect(10);
    node.test = expr;
    node.consequent = consequent;
    node.alternate = this.forwardNoArrowParamsConversionAt(node, () => this.parseMaybeAssign(void 0, void 0));
    return this.finishNode(node, "ConditionalExpression");
  }
  tryParseConditionalConsequent() {
    this.state.noArrowParamsConversionAt.push(this.state.start);
    const consequent = this.parseMaybeAssignAllowIn();
    const failed = !this.match(10);
    this.state.noArrowParamsConversionAt.pop();
    return {
      consequent,
      failed
    };
  }
  getArrowLikeExpressions(node, disallowInvalid) {
    const stack = [node];
    const arrows = [];
    while (stack.length !== 0) {
      const node2 = stack.pop();
      if (node2.type === "ArrowFunctionExpression" && node2.body.type !== "BlockStatement") {
        if (node2.typeParameters || !node2.returnType) {
          this.finishArrowValidation(node2);
        } else {
          arrows.push(node2);
        }
        stack.push(node2.body);
      } else if (node2.type === "ConditionalExpression") {
        stack.push(node2.consequent);
        stack.push(node2.alternate);
      }
    }
    if (disallowInvalid) {
      arrows.forEach((node2) => this.finishArrowValidation(node2));
      return [arrows, []];
    }
    return partition(arrows, (node2) => node2.params.every((param) => this.isAssignable(param, true)));
  }
  finishArrowValidation(node) {
    this.toAssignableList(node.params, node.extra?.trailingCommaLoc, false);
    this.scope.enter(514 | 4);
    super.checkParams(node, false, true);
    this.scope.exit();
  }
  forwardNoArrowParamsConversionAt(node, parse2) {
    let result;
    if (this.state.noArrowParamsConversionAt.includes(this.offsetToSourcePos(node.start))) {
      this.state.noArrowParamsConversionAt.push(this.state.start);
      result = parse2();
      this.state.noArrowParamsConversionAt.pop();
    } else {
      result = parse2();
    }
    return result;
  }
  parseParenItem(node, startLoc) {
    const newNode = super.parseParenItem(node, startLoc);
    if (this.eat(13)) {
      newNode.optional = true;
      this.resetEndLocation(node);
    }
    if (this.match(10)) {
      const typeCastNode = this.startNodeAt(startLoc);
      typeCastNode.expression = newNode;
      typeCastNode.typeAnnotation = this.flowParseTypeAnnotation();
      return this.finishNode(typeCastNode, "TypeCastExpression");
    }
    return newNode;
  }
  assertModuleNodeAllowed(node) {
    if (node.type === "ImportDeclaration" && (node.importKind === "type" || node.importKind === "typeof") || node.type === "ExportNamedDeclaration" && node.exportKind === "type" || node.type === "ExportAllDeclaration" && node.exportKind === "type") {
      return;
    }
    super.assertModuleNodeAllowed(node);
  }
  parseExportDeclaration(node) {
    if (this.isContextual(126)) {
      node.exportKind = "type";
      const declarationNode = this.startNode();
      this.next();
      if (this.match(2)) {
        node.specifiers = this.parseExportSpecifiers(true);
        super.parseExportFrom(node);
        return null;
      } else {
        return this.flowParseTypeAlias(declarationNode);
      }
    } else if (this.isContextual(127)) {
      node.exportKind = "type";
      const declarationNode = this.startNode();
      this.next();
      return this.flowParseOpaqueType(declarationNode, false);
    } else if (this.isContextual(125)) {
      node.exportKind = "type";
      const declarationNode = this.startNode();
      this.next();
      return this.flowParseInterface(declarationNode);
    } else if (this.isContextual(122)) {
      node.exportKind = "value";
      const declarationNode = this.startNode();
      this.next();
      return this.flowParseEnumDeclaration(declarationNode);
    } else {
      return super.parseExportDeclaration(node);
    }
  }
  eatExportStar(node) {
    if (super.eatExportStar(node)) return true;
    if (this.isContextual(126) && this.lookahead().type === 51) {
      node.exportKind = "type";
      this.next();
      this.next();
      return true;
    }
    return false;
  }
  maybeParseExportNamespaceSpecifier(node) {
    const {
      startLoc
    } = this.state;
    const hasNamespace = super.maybeParseExportNamespaceSpecifier(node);
    if (hasNamespace && node.exportKind === "type") {
      this.unexpected(startLoc);
    }
    return hasNamespace;
  }
  parseClassId(node, isStatement, optionalId) {
    if ((!isStatement || optionalId) && this.isContextual(109)) {
      node.id = null;
      return;
    }
    super.parseClassId(node, isStatement, optionalId);
    if (this.match(43)) {
      node.typeParameters = this.flowParseTypeParameterDeclaration();
    }
  }
  parseClassMember(classBody, member, state) {
    const {
      startLoc
    } = this.state;
    if (this.isContextual(121)) {
      if (super.parseClassMemberFromModifier(classBody, member)) {
        return;
      }
      member.declare = true;
    }
    super.parseClassMember(classBody, member, state);
    if (member.declare) {
      if (member.type !== "ClassProperty" && member.type !== "ClassPrivateProperty" && member.type !== "PropertyDefinition") {
        this.raise(FlowErrors.DeclareClassElement, startLoc);
      } else if (member.value) {
        this.raise(FlowErrors.DeclareClassFieldInitializer, member.value);
      }
    }
  }
  isIterator(word) {
    return word === "iterator" || word === "asyncIterator";
  }
  readIterator() {
    const word = super.readWord1();
    const fullWord = "@@" + word;
    if (!this.isIterator(word) || !this.state.inType) {
      this.raise(Errors.InvalidIdentifier, this.state.curPosition(), {
        identifierName: fullWord
      });
    }
    this.finishToken(128, fullWord);
  }
  getTokenFromCode(code2) {
    const next = this.input.charCodeAt(this.state.pos + 1);
    if (code2 === 123 && next === 124) {
      this.finishOp(3, 2);
    } else if (this.state.inType && (code2 === 62 || code2 === 60)) {
      this.finishOp(code2 === 62 ? 44 : 43, 1);
    } else if (this.state.inType && code2 === 63) {
      if (next === 46) {
        this.finishOp(14, 2);
      } else {
        this.finishOp(13, 1);
      }
    } else if (isIteratorStart(code2, next, this.input.charCodeAt(this.state.pos + 2))) {
      this.state.pos += 2;
      this.readIterator();
    } else {
      super.getTokenFromCode(code2);
    }
  }
  isAssignable(node, isBinding) {
    if (node.type === "TypeCastExpression") {
      return this.isAssignable(node.expression, isBinding);
    } else {
      return super.isAssignable(node, isBinding);
    }
  }
  toAssignable(node, isLHS = false) {
    if (!isLHS && node.type === "AssignmentExpression" && node.left.type === "TypeCastExpression") {
      node.left = this.typeCastToParameter(node.left);
    }
    super.toAssignable(node, isLHS);
  }
  toAssignableListItem(exprList, index, isLHS) {
    const node = exprList[index];
    if (node.type === "TypeCastExpression") {
      exprList[index] = this.typeCastToParameter(node);
    }
    super.toAssignableListItem(exprList, index, isLHS);
  }
  toReferencedList(exprList, isParenthesizedExpr) {
    for (let i = 0; i < exprList.length; i++) {
      const expr = exprList[i];
      if (expr?.type === "TypeCastExpression" && !expr.extra?.parenthesized && (exprList.length > 1 || !isParenthesizedExpr)) {
        this.raise(FlowErrors.TypeCastInPattern, expr.typeAnnotation);
      }
    }
    return exprList;
  }
  parseArrayLike(close, refExpressionErrors) {
    const node = super.parseArrayLike(close, refExpressionErrors);
    if (node.type === "ArrayExpression") {
      this.toReferencedList(node.elements);
    }
    return node;
  }
  isValidLVal(type, disallowCallExpression, isParenthesized, binding) {
    return type === "TypeCastExpression" || super.isValidLVal(type, disallowCallExpression, isParenthesized, binding);
  }
  parseClassProperty(node) {
    if (this.match(10)) {
      node.typeAnnotation = this.flowParseTypeAnnotation();
    }
    return super.parseClassProperty(node);
  }
  parseClassPrivateProperty(node) {
    if (this.match(10)) {
      node.typeAnnotation = this.flowParseTypeAnnotation();
    }
    return super.parseClassPrivateProperty(node);
  }
  isClassMethod() {
    return this.match(43) || super.isClassMethod();
  }
  isClassProperty() {
    return this.match(10) || super.isClassProperty();
  }
  isNonstaticConstructor(method) {
    return !this.match(10) && super.isNonstaticConstructor(method);
  }
  pushClassMethod(classBody, method, isGenerator, isAsync, isConstructor, allowsDirectSuper) {
    if (method.variance) {
      this.unexpected(method.variance.start);
    }
    delete method.variance;
    if (this.match(43)) {
      method.typeParameters = this.flowParseTypeParameterDeclaration();
    }
    super.pushClassMethod(classBody, method, isGenerator, isAsync, isConstructor, allowsDirectSuper);
    if (method.params && isConstructor) {
      const params = method.params;
      if (params.length > 0 && this.isThisParam(params[0])) {
        this.raise(FlowErrors.ThisParamBannedInConstructor, method);
      }
    } else if (method.type === "MethodDefinition" && isConstructor && method.value.params) {
      const params = method.value.params;
      if (params.length > 0 && this.isThisParam(params[0])) {
        this.raise(FlowErrors.ThisParamBannedInConstructor, method);
      }
    }
  }
  pushClassPrivateMethod(classBody, method, isGenerator, isAsync) {
    if (method.variance) {
      this.unexpected(method.variance.start);
    }
    delete method.variance;
    if (this.match(43)) {
      method.typeParameters = this.flowParseTypeParameterDeclaration();
    }
    super.pushClassPrivateMethod(classBody, method, isGenerator, isAsync);
  }
  flowParseClassImplements() {
    const node = this.startNode();
    node.id = this.flowParseRestrictedIdentifier(true);
    if (this.match(43)) {
      node.typeParameters = this.flowParseTypeParameterInstantiation();
    } else {
      node.typeParameters = null;
    }
    return this.finishNode(node, "ClassImplements");
  }
  parseClassSuper(node) {
    super.parseClassSuper(node);
    if (node.superClass && (this.match(43) || this.match(47))) {
      node.superTypeArguments = this.flowParseTypeParameterInstantiationInExpression();
    }
    if (this.eatContextual(109)) {
      const implemented = node.implements = [];
      do {
        implemented.push(this.flowParseClassImplements());
      } while (this.eat(8));
    }
  }
  checkGetterSetterParams(method) {
    super.checkGetterSetterParams(method);
    const params = this.getObjectOrClassMethodParams(method);
    if (params.length > 0) {
      const param = params[0];
      if (this.isThisParam(param) && method.kind === "get") {
        this.raise(FlowErrors.GetterMayNotHaveThisParam, param);
      } else if (this.isThisParam(param)) {
        this.raise(FlowErrors.SetterMayNotHaveThisParam, param);
      }
    }
  }
  parsePropertyNamePrefixOperator(node) {
    node.variance = this.flowParseVariance();
  }
  parseObjPropValue(prop, startLoc, isGenerator, isAsync, isPattern, isAccessor, refExpressionErrors) {
    if (prop.variance) {
      this.unexpected(prop.variance.start);
    }
    delete prop.variance;
    let typeParameters;
    if (this.match(43) && !isAccessor) {
      typeParameters = this.flowParseTypeParameterDeclaration();
      if (!this.match(6)) this.unexpected();
    }
    const result = super.parseObjPropValue(prop, startLoc, isGenerator, isAsync, isPattern, isAccessor, refExpressionErrors);
    if (typeParameters) {
      (result.value || result).typeParameters = typeParameters;
    }
    return result;
  }
  parseFunctionParamType(param) {
    if (this.eat(13)) {
      if (param.type !== "Identifier") {
        this.raise(FlowErrors.PatternIsOptional, param);
      }
      if (this.isThisParam(param)) {
        this.raise(FlowErrors.ThisParamMayNotBeOptional, param);
      }
      param.optional = true;
    }
    if (this.match(10)) {
      param.typeAnnotation = this.flowParseTypeAnnotation();
    } else if (this.isThisParam(param)) {
      this.raise(FlowErrors.ThisParamAnnotationRequired, param);
    }
    if (this.match(25) && this.isThisParam(param)) {
      this.raise(FlowErrors.ThisParamNoDefault, param);
    }
    this.resetEndLocation(param);
    return param;
  }
  parseMaybeDefault(startLoc, left) {
    const node = super.parseMaybeDefault(startLoc, left);
    if (node.type === "AssignmentPattern" && node.typeAnnotation && node.right.start < node.typeAnnotation.start) {
      this.raise(FlowErrors.TypeBeforeInitializer, node.typeAnnotation);
    }
    return node;
  }
  parseImportSpecifierLocal(node, specifier, type) {
    specifier.local = hasTypeImportKind(node) ? this.flowParseRestrictedIdentifier(true, true) : this.parseIdentifier();
    node.specifiers.push(this.finishImportSpecifier(specifier, type));
  }
  isPotentialImportPhase(isExport) {
    if (super.isPotentialImportPhase(isExport)) return true;
    if (this.isContextual(126)) {
      if (!isExport) return true;
      const ch = this.lookaheadCharCode();
      return ch === 123 || ch === 42;
    }
    return !isExport && this.isContextual(83);
  }
  applyImportPhase(node, isExport, phase, loc) {
    super.applyImportPhase(node, isExport, phase, loc);
    if (isExport) {
      if (!phase && this.match(61)) {
        return;
      }
      node.exportKind = phase === "type" ? phase : "value";
    } else {
      if (phase === "type" && this.match(51)) this.unexpected();
      node.importKind = phase === "type" || phase === "typeof" ? phase : "value";
    }
  }
  parseImportSpecifier(specifier, importedIsString, isInTypeOnlyImport, isMaybeTypeOnly, bindingType) {
    const firstIdent = specifier.imported;
    let specifierTypeKind = null;
    if (firstIdent.type === "Identifier") {
      if (firstIdent.name === "type") {
        specifierTypeKind = "type";
      } else if (firstIdent.name === "typeof") {
        specifierTypeKind = "typeof";
      }
    }
    let isBinding = false;
    if (this.isContextual(89) && !this.isLookaheadContextual("as")) {
      const as_ident = this.parseIdentifier(true);
      if (specifierTypeKind !== null && !tokenIsKeywordOrIdentifier(this.state.type)) {
        specifier.imported = as_ident;
        specifier.importKind = specifierTypeKind;
        specifier.local = this.cloneIdentifier(as_ident);
      } else {
        specifier.imported = firstIdent;
        specifier.importKind = null;
        specifier.local = this.parseIdentifier();
      }
    } else {
      if (specifierTypeKind !== null && tokenIsKeywordOrIdentifier(this.state.type)) {
        specifier.imported = this.parseIdentifier(true);
        specifier.importKind = specifierTypeKind;
      } else {
        if (importedIsString) {
          throw this.raise(Errors.ImportBindingIsString, specifier, {
            importName: firstIdent.value
          });
        }
        specifier.imported = firstIdent;
        specifier.importKind = null;
      }
      if (this.eatContextual(89)) {
        specifier.local = this.parseIdentifier();
      } else {
        isBinding = true;
        specifier.local = this.cloneIdentifier(specifier.imported);
      }
    }
    const specifierIsTypeImport = hasTypeImportKind(specifier);
    if (isInTypeOnlyImport && specifierIsTypeImport) {
      this.raise(FlowErrors.ImportTypeShorthandOnlyInPureImport, specifier);
    }
    if (isInTypeOnlyImport || specifierIsTypeImport) {
      this.checkReservedType(specifier.local.name, specifier.local.start, true);
    }
    if (isBinding && !isInTypeOnlyImport && !specifierIsTypeImport) {
      this.checkReservedWord(specifier.local.name, specifier.start, true, true);
    }
    return this.finishImportSpecifier(specifier, "ImportSpecifier");
  }
  parseBindingAtom() {
    switch (this.state.type) {
      case 74:
        return this.parseIdentifier(true);
      default:
        return super.parseBindingAtom();
    }
  }
  parseFunctionParams(node, isConstructor) {
    const kind = node.kind;
    if (kind !== "get" && kind !== "set" && this.match(43)) {
      node.typeParameters = this.flowParseTypeParameterDeclaration();
    }
    super.parseFunctionParams(node, isConstructor);
  }
  parseVarId(decl, kind) {
    super.parseVarId(decl, kind);
    if (this.match(10)) {
      decl.id.typeAnnotation = this.flowParseTypeAnnotation();
      this.resetEndLocation(decl.id);
    }
  }
  parseAsyncArrowFromCallExpression(node, call) {
    if (this.match(10)) {
      const oldNoAnonFunctionType = this.state.noAnonFunctionType;
      this.state.noAnonFunctionType = true;
      node.returnType = this.flowParseTypeAnnotation();
      this.state.noAnonFunctionType = oldNoAnonFunctionType;
    }
    return super.parseAsyncArrowFromCallExpression(node, call);
  }
  shouldParseAsyncArrow() {
    return this.match(10) || super.shouldParseAsyncArrow();
  }
  parseMaybeAssign(refExpressionErrors, afterLeftParse) {
    let state = null;
    let jsx2;
    if (this.hasPlugin("jsx") && (this.match(138) || this.match(43))) {
      state = this.state.clone();
      jsx2 = this.tryParse(() => super.parseMaybeAssign(refExpressionErrors, afterLeftParse), state);
      if (!jsx2.error) return jsx2.node;
      const {
        context
      } = this.state;
      const currentContext = context[context.length - 1];
      if (currentContext === types.j_oTag || currentContext === types.j_expr) {
        context.pop();
      }
    }
    if (jsx2?.error || this.match(43)) {
      state = state || this.state.clone();
      let typeParameters;
      const arrow = this.tryParse((abort) => {
        typeParameters = this.flowParseTypeParameterDeclaration();
        const arrowExpression2 = this.forwardNoArrowParamsConversionAt(typeParameters, () => {
          const result = super.parseMaybeAssign(refExpressionErrors, afterLeftParse);
          this.resetStartLocationFromNode(result, typeParameters);
          return result;
        });
        if (arrowExpression2.extra?.parenthesized) abort();
        const expr = this.maybeUnwrapTypeCastExpression(arrowExpression2);
        if (expr.type !== "ArrowFunctionExpression") abort();
        expr.typeParameters = typeParameters;
        this.resetStartLocationFromNode(expr, typeParameters);
        return arrowExpression2;
      }, state);
      let arrowExpression = null;
      if (arrow.node && this.maybeUnwrapTypeCastExpression(arrow.node).type === "ArrowFunctionExpression") {
        if (!arrow.error && !arrow.aborted) {
          if (arrow.node.async) {
            this.raise(FlowErrors.UnexpectedTypeParameterBeforeAsyncArrowFunction, typeParameters);
          }
          return arrow.node;
        }
        arrowExpression = arrow.node;
      }
      if (jsx2?.node) {
        this.state = jsx2.failState;
        return jsx2.node;
      }
      if (arrowExpression) {
        this.state = arrow.failState;
        return arrowExpression;
      }
      if (jsx2?.thrown) throw jsx2.error;
      if (arrow.thrown) throw arrow.error;
      throw this.raise(FlowErrors.UnexpectedTokenAfterTypeParameter, typeParameters);
    }
    return super.parseMaybeAssign(refExpressionErrors, afterLeftParse);
  }
  parseArrow(node) {
    if (this.match(10)) {
      const result = this.tryParse(() => {
        const oldNoAnonFunctionType = this.state.noAnonFunctionType;
        this.state.noAnonFunctionType = true;
        const typeNode = this.startNode();
        [typeNode.typeAnnotation, node.predicate] = this.flowParseTypeAndPredicateInitialiser(true);
        this.state.noAnonFunctionType = oldNoAnonFunctionType;
        if (this.canInsertSemicolon()) this.unexpected();
        if (!this.match(15)) this.unexpected();
        return typeNode;
      });
      if (result.thrown) return null;
      if (result.error) this.state = result.failState;
      node.returnType = result.node.typeAnnotation ? this.finishNode(result.node, "TypeAnnotation") : null;
    }
    return super.parseArrow(node);
  }
  shouldParseArrow(params) {
    return this.match(10) || super.shouldParseArrow(params);
  }
  setArrowFunctionParameters(node, params) {
    if (this.state.noArrowParamsConversionAt.includes(this.offsetToSourcePos(node.start))) {
      node.params = params;
    } else {
      super.setArrowFunctionParameters(node, params);
    }
  }
  checkParams(node, allowDuplicates, isArrowFunction, strictModeChanged = true) {
    if (isArrowFunction && this.state.noArrowParamsConversionAt.includes(this.offsetToSourcePos(node.start))) {
      return;
    }
    for (let i = 0; i < node.params.length; i++) {
      if (this.isThisParam(node.params[i]) && i > 0) {
        this.raise(FlowErrors.ThisParamMustBeFirst, node.params[i]);
      }
    }
    super.checkParams(node, allowDuplicates, isArrowFunction, strictModeChanged);
  }
  parseParenAndDistinguishExpression(canStartArrow) {
    return super.parseParenAndDistinguishExpression(canStartArrow && !this.state.noArrowAt.includes(this.sourceToOffsetPos(this.state.start)));
  }
  parseSubscripts(base, startLoc, noCalls) {
    if (base.type === "Identifier" && base.name === "async" && this.state.noArrowAt.includes(startLoc.index)) {
      this.next();
      const node = this.startNodeAt(startLoc);
      node.callee = base;
      node.arguments = super.parseCallExpressionArguments();
      base = this.finishNode(node, "CallExpression");
    } else if (base.type === "Identifier" && base.name === "async" && this.match(43)) {
      const state = this.state.clone();
      const arrow = this.tryParse((abort) => this.parseAsyncArrowWithTypeParameters(startLoc) || abort(), state);
      if (!arrow.error && !arrow.aborted) return arrow.node;
      const result = this.tryParse(() => super.parseSubscripts(base, startLoc, noCalls), state);
      if (result.node && !result.error) return result.node;
      if (arrow.node) {
        this.state = arrow.failState;
        return arrow.node;
      }
      if (result.node) {
        this.state = result.failState;
        return result.node;
      }
      throw arrow.error || result.error;
    }
    return super.parseSubscripts(base, startLoc, noCalls);
  }
  parseSubscript(base, startLoc, noCalls, subscriptState) {
    if (this.match(14) && this.isLookaheadToken_lt()) {
      subscriptState.optionalChainMember = true;
      if (noCalls) {
        subscriptState.stop = true;
        return base;
      }
      this.next();
      const node = this.startNodeAt(startLoc);
      node.callee = base;
      node.typeArguments = this.flowParseTypeParameterInstantiationInExpression();
      this.expect(6);
      node.arguments = this.parseCallExpressionArguments();
      node.optional = true;
      return this.finishCallExpression(node, true);
    } else if (!noCalls && this.shouldParseTypes() && (this.match(43) || this.match(47))) {
      const node = this.startNodeAt(startLoc);
      node.callee = base;
      const result = this.tryParse(() => {
        node.typeArguments = this.flowParseTypeParameterInstantiationCallOrNew();
        this.expect(6);
        node.arguments = super.parseCallExpressionArguments();
        if (subscriptState.optionalChainMember) {
          node.optional = false;
        }
        return this.finishCallExpression(node, subscriptState.optionalChainMember);
      });
      if (result.node) {
        if (result.error) this.state = result.failState;
        return result.node;
      }
    }
    return super.parseSubscript(base, startLoc, noCalls, subscriptState);
  }
  parseNewCallee(node) {
    super.parseNewCallee(node);
    let targs = null;
    if (this.shouldParseTypes() && this.match(43)) {
      targs = this.tryParse(() => this.flowParseTypeParameterInstantiationCallOrNew()).node;
    }
    node.typeArguments = targs;
  }
  parseAsyncArrowWithTypeParameters(startLoc) {
    const node = this.startNodeAt(startLoc);
    this.parseFunctionParams(node, false);
    if (!this.parseArrow(node)) return;
    return super.parseArrowExpression(node, void 0, true);
  }
  readToken_mult_modulo(code2) {
    const next = this.input.charCodeAt(this.state.pos + 1);
    if (code2 === 42 && next === 47 && this.state.hasFlowComment) {
      this.state.hasFlowComment = false;
      this.state.pos += 2;
      this.nextToken();
      return;
    }
    super.readToken_mult_modulo(code2);
  }
  readToken_pipe_amp(code2) {
    const next = this.input.charCodeAt(this.state.pos + 1);
    if (code2 === 124 && next === 125) {
      this.finishOp(5, 2);
      return;
    }
    super.readToken_pipe_amp(code2);
  }
  parseTopLevel(file, program) {
    const fileNode = super.parseTopLevel(file, program);
    if (this.state.hasFlowComment) {
      this.raise(FlowErrors.UnterminatedFlowComment, this.state.curPosition());
    }
    return fileNode;
  }
  skipBlockComment() {
    if (this.hasPlugin("flowComments") && this.skipFlowComment()) {
      if (this.state.hasFlowComment) {
        throw this.raise(FlowErrors.NestedFlowComment, this.state.startLoc);
      }
      this.hasFlowCommentCompletion();
      const commentSkip = this.skipFlowComment();
      if (commentSkip) {
        this.state.pos += commentSkip;
        this.state.hasFlowComment = true;
      }
      return;
    }
    return super.skipBlockComment(this.state.hasFlowComment ? "*-/" : "*/");
  }
  skipFlowComment() {
    const {
      pos
    } = this.state;
    let shiftToFirstNonWhiteSpace = 2;
    while ([32, 9].includes(this.input.charCodeAt(pos + shiftToFirstNonWhiteSpace))) {
      shiftToFirstNonWhiteSpace++;
    }
    const ch2 = this.input.charCodeAt(shiftToFirstNonWhiteSpace + pos);
    const ch3 = this.input.charCodeAt(shiftToFirstNonWhiteSpace + pos + 1);
    if (ch2 === 58 && ch3 === 58) {
      return shiftToFirstNonWhiteSpace + 2;
    }
    if (this.input.slice(shiftToFirstNonWhiteSpace + pos, shiftToFirstNonWhiteSpace + pos + 12) === "flow-include") {
      return shiftToFirstNonWhiteSpace + 12;
    }
    if (ch2 === 58 && ch3 !== 58) {
      return shiftToFirstNonWhiteSpace;
    }
    return false;
  }
  hasFlowCommentCompletion() {
    const end = this.input.indexOf("*/", this.state.pos);
    if (end === -1) {
      throw this.raise(Errors.UnterminatedComment, this.state.curPosition());
    }
  }
  flowEnumErrorBooleanMemberNotInitialized(loc, names) {
    this.raise(FlowErrors.EnumBooleanMemberNotInitialized, loc, names);
  }
  flowEnumErrorInvalidMemberInitializer(loc, enumContext) {
    return this.raise(!enumContext.explicitType ? FlowErrors.EnumInvalidMemberInitializerUnknownType : enumContext.explicitType === "symbol" ? FlowErrors.EnumInvalidMemberInitializerSymbolType : FlowErrors.EnumInvalidMemberInitializerPrimaryType, loc, enumContext);
  }
  flowEnumErrorNumberMemberNotInitialized(loc, details) {
    this.raise(FlowErrors.EnumNumberMemberNotInitialized, loc, details);
  }
  flowEnumErrorStringMemberInconsistentlyInitialized(node, details) {
    this.raise(FlowErrors.EnumStringMemberInconsistentlyInitialized, node, details);
  }
  flowEnumMemberInit() {
    const startLoc = this.state.startLoc;
    const endOfInit = () => this.match(8) || this.match(4);
    switch (this.state.type) {
      case 131: {
        const literal = this.parseNumericLiteral(this.state.value);
        if (endOfInit()) {
          return {
            type: "number",
            loc: literal.start,
            value: literal
          };
        }
        break;
      }
      case 130: {
        const literal = this.parseStringLiteral(this.state.value);
        if (endOfInit()) {
          return {
            type: "string",
            loc: literal.start,
            value: literal
          };
        }
        break;
      }
      case 81:
      case 82: {
        const literal = this.parseBooleanLiteral(this.match(81));
        if (endOfInit()) {
          return {
            type: "boolean",
            loc: literal.start,
            value: literal
          };
        }
      }
    }
    return {
      type: "invalid",
      loc: startLoc
    };
  }
  flowEnumMemberRaw() {
    const loc = this.state.startLoc;
    const id = this.parseIdentifier(true);
    const init = this.eat(25) ? this.flowEnumMemberInit() : {
      type: "none",
      loc
    };
    return {
      id,
      init
    };
  }
  flowEnumCheckExplicitTypeMismatch(loc, context, expectedType) {
    const {
      explicitType
    } = context;
    if (explicitType === null) {
      return;
    }
    if (explicitType !== expectedType) {
      this.flowEnumErrorInvalidMemberInitializer(loc, context);
    }
  }
  flowEnumMembers({
    enumName,
    explicitType
  }) {
    const seenNames = /* @__PURE__ */ new Set();
    const members = {
      booleanMembers: [],
      numberMembers: [],
      stringMembers: [],
      defaultedMembers: []
    };
    let hasUnknownMembers = false;
    while (!this.match(4)) {
      if (this.eat(17)) {
        hasUnknownMembers = true;
        break;
      }
      const memberNode = this.startNode();
      const {
        id,
        init
      } = this.flowEnumMemberRaw();
      const memberName = id.name;
      if (memberName === "") {
        continue;
      }
      if (/^[a-z]/.test(memberName)) {
        this.raise(FlowErrors.EnumInvalidMemberName, id, {
          memberName,
          suggestion: memberName[0].toUpperCase() + memberName.slice(1),
          enumName
        });
      }
      if (seenNames.has(memberName)) {
        this.raise(FlowErrors.EnumDuplicateMemberName, id, {
          memberName,
          enumName
        });
      }
      seenNames.add(memberName);
      const context = {
        enumName,
        explicitType,
        memberName
      };
      memberNode.id = id;
      switch (init.type) {
        case "boolean": {
          this.flowEnumCheckExplicitTypeMismatch(init.loc, context, "boolean");
          memberNode.init = init.value;
          members.booleanMembers.push(this.finishNode(memberNode, "EnumBooleanMember"));
          break;
        }
        case "number": {
          this.flowEnumCheckExplicitTypeMismatch(init.loc, context, "number");
          memberNode.init = init.value;
          members.numberMembers.push(this.finishNode(memberNode, "EnumNumberMember"));
          break;
        }
        case "string": {
          this.flowEnumCheckExplicitTypeMismatch(init.loc, context, "string");
          memberNode.init = init.value;
          members.stringMembers.push(this.finishNode(memberNode, "EnumStringMember"));
          break;
        }
        case "invalid": {
          throw this.flowEnumErrorInvalidMemberInitializer(init.loc, context);
        }
        case "none": {
          switch (explicitType) {
            case "boolean":
              this.flowEnumErrorBooleanMemberNotInitialized(init.loc, context);
              break;
            case "number":
              this.flowEnumErrorNumberMemberNotInitialized(init.loc, context);
              break;
            default:
              members.defaultedMembers.push(this.finishNode(memberNode, "EnumDefaultedMember"));
          }
        }
      }
      if (!this.match(4)) {
        this.expect(8);
      }
    }
    return {
      members,
      hasUnknownMembers
    };
  }
  flowEnumStringMembers(initializedMembers, defaultedMembers, {
    enumName
  }) {
    if (initializedMembers.length === 0) {
      return defaultedMembers;
    } else if (defaultedMembers.length === 0) {
      return initializedMembers;
    } else if (defaultedMembers.length > initializedMembers.length) {
      for (const member of initializedMembers) {
        this.flowEnumErrorStringMemberInconsistentlyInitialized(member, {
          enumName
        });
      }
      return defaultedMembers;
    } else {
      for (const member of defaultedMembers) {
        this.flowEnumErrorStringMemberInconsistentlyInitialized(member, {
          enumName
        });
      }
      return initializedMembers;
    }
  }
  flowEnumParseExplicitType({
    enumName
  }) {
    if (!this.eatContextual(98)) return null;
    if (!tokenIsIdentifier(this.state.type)) {
      throw this.raise(FlowErrors.EnumInvalidExplicitTypeUnknownSupplied, this.state.startLoc, {
        enumName
      });
    }
    const {
      value
    } = this.state;
    this.next();
    if (value !== "boolean" && value !== "number" && value !== "string" && value !== "symbol") {
      this.raise(FlowErrors.EnumInvalidExplicitType, this.state.startLoc, {
        enumName,
        invalidEnumType: value
      });
    }
    return value;
  }
  flowEnumBody(node, id) {
    const enumName = id.name;
    const nameLoc = id.start;
    const explicitType = this.flowEnumParseExplicitType({
      enumName
    });
    this.expect(2);
    const {
      members,
      hasUnknownMembers
    } = this.flowEnumMembers({
      enumName,
      explicitType
    });
    node.hasUnknownMembers = hasUnknownMembers;
    switch (explicitType) {
      case "boolean":
        node.explicitType = true;
        node.members = members.booleanMembers;
        this.expect(4);
        return this.finishNode(node, "EnumBooleanBody");
      case "number":
        node.explicitType = true;
        node.members = members.numberMembers;
        this.expect(4);
        return this.finishNode(node, "EnumNumberBody");
      case "string":
        node.explicitType = true;
        node.members = this.flowEnumStringMembers(members.stringMembers, members.defaultedMembers, {
          enumName
        });
        this.expect(4);
        return this.finishNode(node, "EnumStringBody");
      case "symbol":
        node.members = members.defaultedMembers;
        this.expect(4);
        return this.finishNode(node, "EnumSymbolBody");
      default: {
        const empty = () => {
          node.members = [];
          this.expect(4);
          return this.finishNode(node, "EnumStringBody");
        };
        node.explicitType = false;
        const boolsLen = members.booleanMembers.length;
        const numsLen = members.numberMembers.length;
        const strsLen = members.stringMembers.length;
        const defaultedLen = members.defaultedMembers.length;
        if (!boolsLen && !numsLen && !strsLen && !defaultedLen) {
          return empty();
        } else if (!boolsLen && !numsLen) {
          node.members = this.flowEnumStringMembers(members.stringMembers, members.defaultedMembers, {
            enumName
          });
          this.expect(4);
          return this.finishNode(node, "EnumStringBody");
        } else if (!numsLen && !strsLen && boolsLen >= defaultedLen) {
          for (const member of members.defaultedMembers) {
            this.flowEnumErrorBooleanMemberNotInitialized(member.start, {
              enumName,
              memberName: member.id.name
            });
          }
          node.members = members.booleanMembers;
          this.expect(4);
          return this.finishNode(node, "EnumBooleanBody");
        } else if (!boolsLen && !strsLen && numsLen >= defaultedLen) {
          for (const member of members.defaultedMembers) {
            this.flowEnumErrorNumberMemberNotInitialized(member.start, {
              enumName,
              memberName: member.id.name
            });
          }
          node.members = members.numberMembers;
          this.expect(4);
          return this.finishNode(node, "EnumNumberBody");
        } else {
          this.raise(FlowErrors.EnumInconsistentMemberValues, nameLoc, {
            enumName
          });
          return empty();
        }
      }
    }
  }
  flowParseEnumDeclaration(node) {
    const id = this.parseIdentifier();
    node.id = id;
    node.body = this.flowEnumBody(this.startNode(), id);
    return this.finishNode(node, "EnumDeclaration");
  }
  jsxParseOpeningElementAfterName(node) {
    if (this.shouldParseTypes()) {
      if (this.match(43) || this.match(47)) {
        node.typeArguments = this.flowParseTypeParameterInstantiationInExpression();
      }
    }
    return super.jsxParseOpeningElementAfterName(node);
  }
  isLookaheadToken_lt() {
    const next = this.nextTokenStart();
    if (this.input.charCodeAt(next) === 60) {
      const afterNext = this.input.charCodeAt(next + 1);
      return afterNext !== 60 && afterNext !== 61;
    }
    return false;
  }
  reScan_lt_gt() {
    const {
      type
    } = this.state;
    if (type === 43) {
      this.state.pos -= 1;
      this.readToken_lt();
    } else if (type === 44) {
      this.state.pos -= 1;
      this.readToken_gt();
    }
  }
  reScan_lt() {
    const {
      type
    } = this.state;
    if (type === 47) {
      this.state.pos -= 2;
      this.finishOp(43, 1);
      return 43;
    }
    return type;
  }
  maybeUnwrapTypeCastExpression(node) {
    return node.type === "TypeCastExpression" ? node.expression : node;
  }
};
var entities = {
  __proto__: null,
  quot: '"',
  amp: "&",
  apos: "'",
  lt: "<",
  gt: ">",
  nbsp: "\xA0",
  iexcl: "\xA1",
  cent: "\xA2",
  pound: "\xA3",
  curren: "\xA4",
  yen: "\xA5",
  brvbar: "\xA6",
  sect: "\xA7",
  uml: "\xA8",
  copy: "\xA9",
  ordf: "\xAA",
  laquo: "\xAB",
  not: "\xAC",
  shy: "\xAD",
  reg: "\xAE",
  macr: "\xAF",
  deg: "\xB0",
  plusmn: "\xB1",
  sup2: "\xB2",
  sup3: "\xB3",
  acute: "\xB4",
  micro: "\xB5",
  para: "\xB6",
  middot: "\xB7",
  cedil: "\xB8",
  sup1: "\xB9",
  ordm: "\xBA",
  raquo: "\xBB",
  frac14: "\xBC",
  frac12: "\xBD",
  frac34: "\xBE",
  iquest: "\xBF",
  Agrave: "\xC0",
  Aacute: "\xC1",
  Acirc: "\xC2",
  Atilde: "\xC3",
  Auml: "\xC4",
  Aring: "\xC5",
  AElig: "\xC6",
  Ccedil: "\xC7",
  Egrave: "\xC8",
  Eacute: "\xC9",
  Ecirc: "\xCA",
  Euml: "\xCB",
  Igrave: "\xCC",
  Iacute: "\xCD",
  Icirc: "\xCE",
  Iuml: "\xCF",
  ETH: "\xD0",
  Ntilde: "\xD1",
  Ograve: "\xD2",
  Oacute: "\xD3",
  Ocirc: "\xD4",
  Otilde: "\xD5",
  Ouml: "\xD6",
  times: "\xD7",
  Oslash: "\xD8",
  Ugrave: "\xD9",
  Uacute: "\xDA",
  Ucirc: "\xDB",
  Uuml: "\xDC",
  Yacute: "\xDD",
  THORN: "\xDE",
  szlig: "\xDF",
  agrave: "\xE0",
  aacute: "\xE1",
  acirc: "\xE2",
  atilde: "\xE3",
  auml: "\xE4",
  aring: "\xE5",
  aelig: "\xE6",
  ccedil: "\xE7",
  egrave: "\xE8",
  eacute: "\xE9",
  ecirc: "\xEA",
  euml: "\xEB",
  igrave: "\xEC",
  iacute: "\xED",
  icirc: "\xEE",
  iuml: "\xEF",
  eth: "\xF0",
  ntilde: "\xF1",
  ograve: "\xF2",
  oacute: "\xF3",
  ocirc: "\xF4",
  otilde: "\xF5",
  ouml: "\xF6",
  divide: "\xF7",
  oslash: "\xF8",
  ugrave: "\xF9",
  uacute: "\xFA",
  ucirc: "\xFB",
  uuml: "\xFC",
  yacute: "\xFD",
  thorn: "\xFE",
  yuml: "\xFF",
  OElig: "\u0152",
  oelig: "\u0153",
  Scaron: "\u0160",
  scaron: "\u0161",
  Yuml: "\u0178",
  fnof: "\u0192",
  circ: "\u02C6",
  tilde: "\u02DC",
  Alpha: "\u0391",
  Beta: "\u0392",
  Gamma: "\u0393",
  Delta: "\u0394",
  Epsilon: "\u0395",
  Zeta: "\u0396",
  Eta: "\u0397",
  Theta: "\u0398",
  Iota: "\u0399",
  Kappa: "\u039A",
  Lambda: "\u039B",
  Mu: "\u039C",
  Nu: "\u039D",
  Xi: "\u039E",
  Omicron: "\u039F",
  Pi: "\u03A0",
  Rho: "\u03A1",
  Sigma: "\u03A3",
  Tau: "\u03A4",
  Upsilon: "\u03A5",
  Phi: "\u03A6",
  Chi: "\u03A7",
  Psi: "\u03A8",
  Omega: "\u03A9",
  alpha: "\u03B1",
  beta: "\u03B2",
  gamma: "\u03B3",
  delta: "\u03B4",
  epsilon: "\u03B5",
  zeta: "\u03B6",
  eta: "\u03B7",
  theta: "\u03B8",
  iota: "\u03B9",
  kappa: "\u03BA",
  lambda: "\u03BB",
  mu: "\u03BC",
  nu: "\u03BD",
  xi: "\u03BE",
  omicron: "\u03BF",
  pi: "\u03C0",
  rho: "\u03C1",
  sigmaf: "\u03C2",
  sigma: "\u03C3",
  tau: "\u03C4",
  upsilon: "\u03C5",
  phi: "\u03C6",
  chi: "\u03C7",
  psi: "\u03C8",
  omega: "\u03C9",
  thetasym: "\u03D1",
  upsih: "\u03D2",
  piv: "\u03D6",
  ensp: "\u2002",
  emsp: "\u2003",
  thinsp: "\u2009",
  zwnj: "\u200C",
  zwj: "\u200D",
  lrm: "\u200E",
  rlm: "\u200F",
  ndash: "\u2013",
  mdash: "\u2014",
  lsquo: "\u2018",
  rsquo: "\u2019",
  sbquo: "\u201A",
  ldquo: "\u201C",
  rdquo: "\u201D",
  bdquo: "\u201E",
  dagger: "\u2020",
  Dagger: "\u2021",
  bull: "\u2022",
  hellip: "\u2026",
  permil: "\u2030",
  prime: "\u2032",
  Prime: "\u2033",
  lsaquo: "\u2039",
  rsaquo: "\u203A",
  oline: "\u203E",
  frasl: "\u2044",
  euro: "\u20AC",
  image: "\u2111",
  weierp: "\u2118",
  real: "\u211C",
  trade: "\u2122",
  alefsym: "\u2135",
  larr: "\u2190",
  uarr: "\u2191",
  rarr: "\u2192",
  darr: "\u2193",
  harr: "\u2194",
  crarr: "\u21B5",
  lArr: "\u21D0",
  uArr: "\u21D1",
  rArr: "\u21D2",
  dArr: "\u21D3",
  hArr: "\u21D4",
  forall: "\u2200",
  part: "\u2202",
  exist: "\u2203",
  empty: "\u2205",
  nabla: "\u2207",
  isin: "\u2208",
  notin: "\u2209",
  ni: "\u220B",
  prod: "\u220F",
  sum: "\u2211",
  minus: "\u2212",
  lowast: "\u2217",
  radic: "\u221A",
  prop: "\u221D",
  infin: "\u221E",
  ang: "\u2220",
  and: "\u2227",
  or: "\u2228",
  cap: "\u2229",
  cup: "\u222A",
  int: "\u222B",
  there4: "\u2234",
  sim: "\u223C",
  cong: "\u2245",
  asymp: "\u2248",
  ne: "\u2260",
  equiv: "\u2261",
  le: "\u2264",
  ge: "\u2265",
  sub: "\u2282",
  sup: "\u2283",
  nsub: "\u2284",
  sube: "\u2286",
  supe: "\u2287",
  oplus: "\u2295",
  otimes: "\u2297",
  perp: "\u22A5",
  sdot: "\u22C5",
  lceil: "\u2308",
  rceil: "\u2309",
  lfloor: "\u230A",
  rfloor: "\u230B",
  lang: "\u2329",
  rang: "\u232A",
  loz: "\u25CA",
  spades: "\u2660",
  clubs: "\u2663",
  hearts: "\u2665",
  diams: "\u2666"
};
var lineBreak = /\r\n|[\r\n\u2028\u2029]/;
var lineBreakG = new RegExp(lineBreak.source, "g");
function isNewLine(code2) {
  switch (code2) {
    case 10:
    case 13:
    case 8232:
    case 8233:
      return true;
    default:
      return false;
  }
}
function hasNewLine(input, start, end) {
  for (let i = start; i < end; i++) {
    if (isNewLine(input.charCodeAt(i))) {
      return true;
    }
  }
  return false;
}
var skipWhiteSpace = /(?:\s|\/\/.*|\/\*[^]*?\*\/)*/g;
var skipWhiteSpaceInLine = /(?:[^\S\n\r\u2028\u2029]|\/\/.*|\/\*.*?\*\/)*/g;
function isWhitespace2(code2) {
  switch (code2) {
    case 9:
    case 11:
    case 12:
    case 32:
    case 160:
    case 5760:
    case 8192:
    case 8193:
    case 8194:
    case 8195:
    case 8196:
    case 8197:
    case 8198:
    case 8199:
    case 8200:
    case 8201:
    case 8202:
    case 8239:
    case 8287:
    case 12288:
    case 65279:
      return true;
    default:
      return false;
  }
}
var JsxErrorTemplates = {
  AttributeIsEmpty: "JSX attributes must only be assigned a non-empty expression.",
  MissingClosingTagElement: ({
    openingTagName
  }) => `Expected corresponding JSX closing tag for <${openingTagName}>.`,
  MissingClosingTagFragment: "Expected corresponding JSX closing tag for <>.",
  UnexpectedSequenceExpression: "Sequence expressions cannot be directly nested inside JSX. Did you mean to wrap it in parentheses (...)?",
  UnexpectedToken: ({
    unexpected,
    HTMLEntity
  }) => `Unexpected token \`${unexpected}\`. Did you mean \`${HTMLEntity}\` or \`{'${unexpected}'}\`?`,
  UnsupportedJsxValue: "JSX value should be either an expression or a quoted JSX text.",
  UnterminatedJsxContent: "Unterminated JSX contents.",
  UnwrappedAdjacentJSXElements: "Adjacent JSX elements must be wrapped in an enclosing tag. Did you want a JSX fragment <>...</>?"
};
var JsxErrors = ParseErrorEnum`jsx`(JsxErrorTemplates);
function isFragment(object) {
  return object ? object.type === "JSXOpeningFragment" || object.type === "JSXClosingFragment" : false;
}
function getQualifiedJSXName(object) {
  if (object.type === "JSXIdentifier") {
    return object.name;
  }
  if (object.type === "JSXNamespacedName") {
    return object.namespace.name + ":" + object.name.name;
  }
  if (object.type === "JSXMemberExpression") {
    return getQualifiedJSXName(object.object) + "." + getQualifiedJSXName(object.property);
  }
  throw new Error("Node had unexpected type: " + object.type);
}
var jsx = (superClass) => class JSXParserMixin extends superClass {
  jsxReadToken() {
    let out = "";
    let chunkStart = this.state.pos;
    for (; ; ) {
      if (this.state.pos >= this.length) {
        throw this.raise(JsxErrors.UnterminatedJsxContent, this.state.startLoc);
      }
      const ch = this.input.charCodeAt(this.state.pos);
      switch (ch) {
        case 60:
        case 123:
          if (this.state.pos === this.state.start) {
            if (ch === 60 && this.state.canStartJSXElement) {
              ++this.state.pos;
              this.finishToken(138);
            } else {
              super.getTokenFromCode(ch);
            }
            return;
          }
          out += this.input.slice(chunkStart, this.state.pos);
          this.finishToken(137, out);
          return;
        case 38:
          out += this.input.slice(chunkStart, this.state.pos);
          out += this.jsxReadEntity();
          chunkStart = this.state.pos;
          break;
        case 62:
        case 125:
          this.raise(JsxErrors.UnexpectedToken, this.state.curPosition(), {
            unexpected: this.input[this.state.pos],
            HTMLEntity: ch === 125 ? "&rbrace;" : "&gt;"
          });
        default:
          if (isNewLine(ch)) {
            out += this.input.slice(chunkStart, this.state.pos);
            out += this.jsxReadNewLine(true);
            chunkStart = this.state.pos;
          } else {
            ++this.state.pos;
          }
      }
    }
  }
  jsxReadNewLine(normalizeCRLF) {
    const ch = this.input.charCodeAt(this.state.pos);
    let out;
    ++this.state.pos;
    if (ch === 13 && this.input.charCodeAt(this.state.pos) === 10) {
      ++this.state.pos;
      out = normalizeCRLF ? "\n" : "\r\n";
    } else {
      out = String.fromCharCode(ch);
    }
    ++this.state.curLine;
    this.state.lineStart = this.state.pos;
    return out;
  }
  jsxReadString(quote) {
    let out = "";
    let chunkStart = ++this.state.pos;
    for (; ; ) {
      if (this.state.pos >= this.length) {
        throw this.raise(Errors.UnterminatedString, this.state.startLoc);
      }
      const ch = this.input.charCodeAt(this.state.pos);
      if (ch === quote) break;
      if (ch === 38) {
        out += this.input.slice(chunkStart, this.state.pos);
        out += this.jsxReadEntity();
        chunkStart = this.state.pos;
      } else if (isNewLine(ch)) {
        out += this.input.slice(chunkStart, this.state.pos);
        out += this.jsxReadNewLine(false);
        chunkStart = this.state.pos;
      } else {
        ++this.state.pos;
      }
    }
    out += this.input.slice(chunkStart, this.state.pos++);
    this.finishToken(130, out);
  }
  jsxReadEntity() {
    const startPos = ++this.state.pos;
    if (this.codePointAtPos(this.state.pos) === 35) {
      ++this.state.pos;
      let radix = 10;
      if (this.codePointAtPos(this.state.pos) === 120) {
        radix = 16;
        ++this.state.pos;
      }
      const codePoint = this.readInt(radix, void 0, false, "bail");
      if (codePoint !== null && this.codePointAtPos(this.state.pos) === 59) {
        ++this.state.pos;
        return String.fromCodePoint(codePoint);
      }
    } else {
      let count = 0;
      let semi = false;
      while (count++ < 10 && this.state.pos < this.length && !(semi = this.codePointAtPos(this.state.pos) === 59)) {
        ++this.state.pos;
      }
      if (semi) {
        const desc = this.input.slice(startPos, this.state.pos);
        const entity = entities[desc];
        ++this.state.pos;
        if (entity) {
          return entity;
        }
      }
    }
    this.state.pos = startPos;
    return "&";
  }
  jsxReadWord() {
    let ch;
    const start = this.state.pos;
    do {
      ch = this.input.charCodeAt(++this.state.pos);
    } while (isIdentifierChar(ch) || ch === 45);
    this.finishToken(136, this.input.slice(start, this.state.pos));
  }
  jsxParseIdentifier() {
    const node = this.startNode();
    if (this.match(136)) {
      node.name = this.state.value;
    } else if (tokenIsKeyword(this.state.type)) {
      node.name = tokenLabelName(this.state.type);
    } else {
      this.unexpected();
    }
    this.next();
    return this.finishNode(node, "JSXIdentifier");
  }
  jsxParseNamespacedName() {
    const startLoc = this.state.startLoc;
    const name = this.jsxParseIdentifier();
    if (!this.eat(10)) return name;
    const node = this.startNodeAt(startLoc);
    node.namespace = name;
    node.name = this.jsxParseIdentifier();
    return this.finishNode(node, "JSXNamespacedName");
  }
  jsxParseElementName() {
    const startLoc = this.state.startLoc;
    let node = this.jsxParseNamespacedName();
    if (node.type === "JSXNamespacedName") {
      return node;
    }
    while (this.eat(12)) {
      const newNode = this.startNodeAt(startLoc);
      newNode.object = node;
      newNode.property = this.jsxParseIdentifier();
      node = this.finishNode(newNode, "JSXMemberExpression");
    }
    return node;
  }
  jsxParseAttributeValue() {
    let node;
    switch (this.state.type) {
      case 2:
        node = this.startNode();
        this.setContext(types.brace);
        this.next();
        node = this.jsxParseExpressionContainer(node, types.j_oTag);
        if (node.expression.type === "JSXEmptyExpression") {
          this.raise(JsxErrors.AttributeIsEmpty, node);
        }
        return node;
      case 138:
      case 130:
        return this.parseExprAtom();
      default:
        throw this.raise(JsxErrors.UnsupportedJsxValue, this.state.startLoc);
    }
  }
  jsxParseEmptyExpression() {
    const node = this.startNodeAt(this.state.lastTokEndLoc);
    return this.finishNodeAt(node, "JSXEmptyExpression", this.state.startLoc);
  }
  jsxParseSpreadChild(node) {
    this.next();
    node.expression = this.parseExpression();
    this.setContext(types.j_expr);
    this.state.canStartJSXElement = true;
    this.expect(4);
    return this.finishNode(node, "JSXSpreadChild");
  }
  jsxParseExpressionContainer(node, previousContext) {
    if (this.match(4)) {
      node.expression = this.jsxParseEmptyExpression();
    } else {
      const expression = this.parseExpression();
      if (expression.type === "SequenceExpression" && !expression.extra?.parenthesized) {
        this.raise(JsxErrors.UnexpectedSequenceExpression, expression.expressions[1]);
      }
      node.expression = expression;
    }
    this.setContext(previousContext);
    this.state.canStartJSXElement = true;
    this.expect(4);
    return this.finishNode(node, "JSXExpressionContainer");
  }
  jsxParseAttribute() {
    if (this.match(2)) {
      const node2 = this.startNode();
      this.setContext(types.brace);
      this.next();
      this.expect(17);
      node2.argument = this.parseMaybeAssignAllowIn();
      this.setContext(types.j_oTag);
      this.state.canStartJSXElement = true;
      this.expect(4);
      return this.finishNode(node2, "JSXSpreadAttribute");
    }
    const node = this.startNode();
    node.name = this.jsxParseNamespacedName();
    node.value = this.eat(25) ? this.jsxParseAttributeValue() : null;
    return this.finishNode(node, "JSXAttribute");
  }
  jsxParseOpeningElementAt(startLoc) {
    if (this.eat(139)) {
      const node2 = this.startNodeAt(startLoc);
      return this.finishNode(node2, "JSXOpeningFragment");
    }
    const node = this.startNodeAt(startLoc);
    node.name = this.jsxParseElementName();
    return this.jsxParseOpeningElementAfterName(node);
  }
  jsxParseOpeningElementAfterName(node) {
    const attributes = [];
    while (!this.match(52) && !this.match(139)) {
      attributes.push(this.jsxParseAttribute());
    }
    node.attributes = attributes;
    node.selfClosing = this.eat(52);
    this.expect(139);
    return this.finishNode(node, "JSXOpeningElement");
  }
  jsxParseClosingElementAt(startLoc) {
    if (this.eat(139)) {
      const node2 = this.startNodeAt(startLoc);
      return this.finishNode(node2, "JSXClosingFragment");
    }
    const node = this.startNodeAt(startLoc);
    node.name = this.jsxParseElementName();
    this.expect(139);
    return this.finishNode(node, "JSXClosingElement");
  }
  jsxParseElementAt(startLoc) {
    const node = this.startNodeAt(startLoc);
    const children = [];
    const openingElement = this.jsxParseOpeningElementAt(startLoc);
    let closingElement = null;
    if (!openingElement.selfClosing) {
      contents: for (; ; ) {
        switch (this.state.type) {
          case 138:
            startLoc = this.state.startLoc;
            this.next();
            if (this.eat(52)) {
              this.setLoc(startLoc);
              closingElement = this.jsxParseClosingElementAt(startLoc);
              break contents;
            }
            children.push(this.jsxParseElementAt(startLoc));
            break;
          case 137:
            children.push(this.parseLiteral(this.state.value, "JSXText"));
            break;
          case 2: {
            const node2 = this.startNode();
            this.setContext(types.brace);
            this.next();
            if (this.match(17)) {
              children.push(this.jsxParseSpreadChild(node2));
            } else {
              children.push(this.jsxParseExpressionContainer(node2, types.j_expr));
            }
            break;
          }
          default:
            this.unexpected();
        }
      }
      if (isFragment(openingElement) && !isFragment(closingElement) && closingElement !== null) {
        this.raise(JsxErrors.MissingClosingTagFragment, closingElement);
      } else if (!isFragment(openingElement) && isFragment(closingElement)) {
        this.raise(JsxErrors.MissingClosingTagElement, closingElement, {
          openingTagName: getQualifiedJSXName(openingElement.name)
        });
      } else if (!isFragment(openingElement) && !isFragment(closingElement)) {
        if (getQualifiedJSXName(closingElement.name) !== getQualifiedJSXName(openingElement.name)) {
          this.raise(JsxErrors.MissingClosingTagElement, closingElement, {
            openingTagName: getQualifiedJSXName(openingElement.name)
          });
        }
      }
    }
    if (isFragment(openingElement)) {
      node.openingFragment = openingElement;
      node.closingFragment = closingElement;
    } else {
      node.openingElement = openingElement;
      node.closingElement = closingElement;
    }
    node.children = children;
    if (this.match(43)) {
      throw this.raise(JsxErrors.UnwrappedAdjacentJSXElements, this.state.startLoc);
    }
    return isFragment(openingElement) ? this.finishNode(node, "JSXFragment") : this.finishNode(node, "JSXElement");
  }
  jsxParseElement() {
    const startLoc = this.state.startLoc;
    this.next();
    return this.jsxParseElementAt(startLoc);
  }
  setContext(newContext) {
    const {
      context
    } = this.state;
    context[context.length - 1] = newContext;
  }
  parseExprAtom(refExpressionErrors) {
    if (this.match(138)) {
      return this.jsxParseElement();
    } else if (this.match(43) && this.input.charCodeAt(this.state.pos) !== 33) {
      this.replaceToken(138);
      return this.jsxParseElement();
    } else {
      return super.parseExprAtom(refExpressionErrors);
    }
  }
  skipSpace() {
    const curContext = this.curContext();
    if (!curContext.preserveSpace) super.skipSpace();
  }
  getTokenFromCode(code2) {
    const context = this.curContext();
    if (context === types.j_expr) {
      this.jsxReadToken();
      return;
    }
    if (context === types.j_oTag || context === types.j_cTag) {
      if (isIdentifierStart(code2)) {
        this.jsxReadWord();
        return;
      }
      if (code2 === 62) {
        ++this.state.pos;
        this.finishToken(139);
        return;
      }
      if ((code2 === 34 || code2 === 39) && context === types.j_oTag) {
        this.jsxReadString(code2);
        return;
      }
    }
    if (code2 === 60 && this.state.canStartJSXElement && this.input.charCodeAt(this.state.pos + 1) !== 33) {
      ++this.state.pos;
      this.finishToken(138);
      return;
    }
    super.getTokenFromCode(code2);
  }
  updateContext(prevType) {
    const {
      context,
      type
    } = this.state;
    if (type === 52 && prevType === 138) {
      context.splice(-2, 2, types.j_cTag);
      this.state.canStartJSXElement = false;
    } else if (type === 138) {
      context.push(types.j_oTag);
    } else if (type === 139) {
      const out = context[context.length - 1];
      if (out === types.j_oTag && prevType === 52 || out === types.j_cTag) {
        context.pop();
        this.state.canStartJSXElement = context[context.length - 1] === types.j_expr;
      } else {
        this.setContext(types.j_expr);
        this.state.canStartJSXElement = true;
      }
    } else {
      this.state.canStartJSXElement = tokenComesBeforeExpression(type);
    }
  }
};
var TypeScriptScope = class extends Scope {
  tsNames = /* @__PURE__ */ new Map();
};
var TypeScriptScopeHandler = class extends ScopeHandler {
  get inTSNamespace() {
    const scopeStack = this.scopeStack;
    return scopeStack.length >= 2 && scopeStack[scopeStack.length - 1].flags === 0 && (scopeStack[scopeStack.length - 2].flags & 2048) > 0;
  }
  importsStack = [];
  createScope(flags) {
    this.importsStack.push(/* @__PURE__ */ new Set());
    return new TypeScriptScope(flags);
  }
  enter(flags) {
    if (flags & (1024 | 2048)) {
      this.importsStack.push(/* @__PURE__ */ new Set());
    }
    super.enter(flags);
  }
  exit() {
    const flags = super.exit();
    if (flags & (1024 | 2048)) {
      this.importsStack.pop();
    }
    return flags;
  }
  hasImport(name, allowShadow) {
    const len = this.importsStack.length;
    if (this.importsStack[len - 1].has(name)) {
      return true;
    }
    if (!allowShadow && len > 1) {
      for (let i = 0; i < len - 1; i++) {
        if (this.importsStack[i].has(name)) return true;
      }
    }
    return false;
  }
  declareName(name, bindingType, loc) {
    if (bindingType & 4096) {
      if (this.hasImport(name, true)) {
        this.parser.raise(Errors.VarRedeclaration, loc, {
          identifierName: name
        });
      }
      this.importsStack[this.importsStack.length - 1].add(name);
      return;
    }
    const scope = this.currentScope();
    let type = scope.tsNames.get(name) || 0;
    if (bindingType & 1024) {
      this.maybeExportDefined(scope, name);
      scope.tsNames.set(name, type | 16);
      return;
    }
    super.declareName(name, bindingType, loc);
    if (bindingType & 2) {
      if (!(bindingType & 1)) {
        this.checkRedeclarationInScope(scope, name, bindingType, loc);
        this.maybeExportDefined(scope, name);
      }
      type = type | 1;
    }
    if (bindingType & 256) {
      type = type | 2;
    }
    if (bindingType & 512) {
      type = type | 4;
    }
    if (bindingType & 128) {
      type = type | 8;
    }
    if (type) scope.tsNames.set(name, type);
  }
  isRedeclaredInScope(scope, name, bindingType) {
    const type = scope.tsNames.get(name);
    if ((type & 2) > 0) {
      if (bindingType & 256) {
        const isConst = (bindingType & 512) > 0;
        const wasConst = (type & 4) > 0;
        return isConst !== wasConst;
      }
      return true;
    }
    if (bindingType & 128 && (type & 8) > 0) {
      if (scope.names.get(name) & 2) {
        return !!(bindingType & 1);
      } else {
        return false;
      }
    }
    if (bindingType & 2 && (type & 1) > 0) {
      return true;
    }
    return super.isRedeclaredInScope(scope, name, bindingType);
  }
  checkLocalExport(id) {
    const {
      name
    } = id;
    if (this.hasImport(name)) return;
    const len = this.scopeStack.length;
    for (let i = len - 1; i >= 0; i--) {
      const scope = this.scopeStack[i];
      const type = scope.tsNames.get(name);
      if ((type & 1) > 0 || (type & 16) > 0) {
        return;
      }
    }
    super.checkLocalExport(id);
  }
};
var BaseParser = class {
  sawUnambiguousESM = false;
  ambiguousScriptDifferentAst = false;
  sourceToOffsetPos(sourcePos) {
    return sourcePos + this.startIndex;
  }
  offsetToSourcePos(offsetPos) {
    return offsetPos - this.startIndex;
  }
  hasPlugin(pluginConfig) {
    if (typeof pluginConfig === "string") {
      return this.plugins.has(pluginConfig);
    } else {
      const [pluginName, pluginOptions] = pluginConfig;
      if (!this.hasPlugin(pluginName)) {
        return false;
      }
      const actualOptions = this.plugins.get(pluginName);
      for (const key of Object.keys(pluginOptions)) {
        if (actualOptions?.[key] !== pluginOptions[key]) {
          return false;
        }
      }
      return true;
    }
  }
  getPluginOption(plugin, name) {
    return this.plugins.get(plugin)?.[name];
  }
};
function setTrailingComments(node, comments) {
  if (node.trailingComments === void 0) {
    node.trailingComments = comments;
  } else {
    node.trailingComments.unshift(...comments);
  }
}
function setLeadingComments(node, comments) {
  if (node.leadingComments === void 0) {
    node.leadingComments = comments;
  } else {
    node.leadingComments.unshift(...comments);
  }
}
function setInnerComments(node, comments) {
  if (node.innerComments === void 0) {
    node.innerComments = comments;
  } else {
    node.innerComments.unshift(...comments);
  }
}
function adjustInnerComments(node, elements, commentWS) {
  let lastElement = null;
  let i = elements.length;
  while (lastElement === null && i > 0) {
    lastElement = elements[--i];
  }
  if (lastElement === null || lastElement.start > commentWS.start) {
    setInnerComments(node, commentWS.comments);
  } else {
    setTrailingComments(lastElement, commentWS.comments);
  }
}
var CommentsParser = class extends BaseParser {
  addComment(comment) {
    if (this.filename) comment.loc.filename = this.filename;
    const {
      commentsLen
    } = this.state;
    if (this.comments.length !== commentsLen) {
      this.comments.length = commentsLen;
    }
    this.comments.push(comment);
    this.state.commentsLen++;
  }
  processComment(node) {
    const {
      commentStack
    } = this.state;
    const commentStackLength = commentStack.length;
    if (commentStackLength === 0) return;
    let i = commentStackLength - 1;
    const lastCommentWS = commentStack[i];
    if (lastCommentWS.start === node.end) {
      lastCommentWS.leadingNode = node;
      i--;
    }
    const nodeStart = node.start;
    for (; i >= 0; i--) {
      const commentWS = commentStack[i];
      const commentEnd = commentWS.end;
      if (commentEnd > nodeStart) {
        commentWS.containingNode = node;
        this.finalizeComment(commentWS);
        commentStack.splice(i, 1);
      } else {
        if (commentEnd === nodeStart) {
          commentWS.trailingNode = node;
        }
        break;
      }
    }
  }
  finalizeComment(commentWS) {
    const {
      comments
    } = commentWS;
    if (commentWS.leadingNode !== null || commentWS.trailingNode !== null) {
      if (commentWS.leadingNode !== null) {
        setTrailingComments(commentWS.leadingNode, comments);
      }
      if (commentWS.trailingNode !== null) {
        setLeadingComments(commentWS.trailingNode, comments);
      }
    } else {
      const node = commentWS.containingNode;
      const commentStart = commentWS.start;
      if (this.input.charCodeAt(this.offsetToSourcePos(commentStart) - 1) === 44) {
        switch (node.type) {
          case "ObjectExpression":
          case "ObjectPattern":
            adjustInnerComments(node, node.properties, commentWS);
            break;
          case "CallExpression":
          case "NewExpression":
          case "OptionalCallExpression":
            adjustInnerComments(node, node.arguments, commentWS);
            break;
          case "ImportExpression":
            adjustInnerComments(node, [node.source, node.options ?? null], commentWS);
            break;
          case "FunctionDeclaration":
          case "FunctionExpression":
          case "ArrowFunctionExpression":
          case "ObjectMethod":
          case "ClassMethod":
          case "ClassPrivateMethod":
          case "TSTypeParameterDeclaration":
            adjustInnerComments(node, node.params, commentWS);
            break;
          case "ArrayExpression":
          case "ArrayPattern":
            adjustInnerComments(node, node.elements, commentWS);
            break;
          case "ExportNamedDeclaration":
          case "ImportDeclaration":
            adjustInnerComments(node, node.specifiers, commentWS);
            break;
          case "TSEnumBody":
            adjustInnerComments(node, node.members, commentWS);
            break;
          case "TSInterfaceBody":
            adjustInnerComments(node, node.body, commentWS);
            break;
          default: {
            setInnerComments(node, comments);
          }
        }
      } else {
        setInnerComments(node, comments);
      }
    }
  }
  finalizeRemainingComments() {
    const {
      commentStack
    } = this.state;
    for (let i = commentStack.length - 1; i >= 0; i--) {
      this.finalizeComment(commentStack[i]);
    }
    this.state.commentStack = [];
  }
  resetPreviousNodeTrailingComments(node) {
    const {
      commentStack
    } = this.state;
    const {
      length
    } = commentStack;
    if (length === 0) return;
    const commentWS = commentStack[length - 1];
    if (commentWS.leadingNode === node) {
      commentWS.leadingNode = null;
    }
  }
  takeSurroundingComments(node, start, end) {
    const {
      commentStack
    } = this.state;
    const commentStackLength = commentStack.length;
    if (commentStackLength === 0) return;
    let i = commentStackLength - 1;
    for (; i >= 0; i--) {
      const commentWS = commentStack[i];
      const commentEnd = commentWS.end;
      const commentStart = commentWS.start;
      if (commentStart === end) {
        commentWS.leadingNode = node;
      } else if (commentEnd === start) {
        commentWS.trailingNode = node;
      } else if (commentEnd < start) {
        break;
      }
    }
  }
};
var State2 = class _State {
  flags = 2048;
  get strict() {
    return (this.flags & 1) > 0;
  }
  set strict(v) {
    if (v) this.flags |= 1;
    else this.flags &= -2;
  }
  startIndex;
  curLine;
  lineStart;
  startLoc;
  endLoc;
  init({
    strictMode,
    sourceType,
    startIndex,
    startLine,
    startColumn
  }) {
    this.strict = strictMode === false ? false : strictMode === true ? true : sourceType === "module";
    this.startIndex = startIndex;
    this.curLine = startLine;
    this.lineStart = -startColumn;
    this.startLoc = this.endLoc = new Position(startLine, startColumn, startIndex);
  }
  errors = [];
  noArrowAt = [];
  noArrowParamsConversionAt = [];
  get canStartArrow() {
    return (this.flags & 2) > 0;
  }
  set canStartArrow(v) {
    if (v) this.flags |= 2;
    else this.flags &= -3;
  }
  get inType() {
    return (this.flags & 4) > 0;
  }
  set inType(v) {
    if (v) this.flags |= 4;
    else this.flags &= -5;
  }
  get noAnonFunctionType() {
    return (this.flags & 8) > 0;
  }
  set noAnonFunctionType(v) {
    if (v) this.flags |= 8;
    else this.flags &= -9;
  }
  get hasFlowComment() {
    return (this.flags & 16) > 0;
  }
  set hasFlowComment(v) {
    if (v) this.flags |= 16;
    else this.flags &= -17;
  }
  get isAmbientContext() {
    return (this.flags & 32) > 0;
  }
  set isAmbientContext(v) {
    if (v) this.flags |= 32;
    else this.flags &= -33;
  }
  get inAbstractClass() {
    return (this.flags & 64) > 0;
  }
  set inAbstractClass(v) {
    if (v) this.flags |= 64;
    else this.flags &= -65;
  }
  get inDisallowConditionalTypesContext() {
    return (this.flags & 128) > 0;
  }
  set inDisallowConditionalTypesContext(v) {
    if (v) this.flags |= 128;
    else this.flags &= -129;
  }
  get inConditionalConsequent() {
    return (this.flags & 256) > 0;
  }
  set inConditionalConsequent(v) {
    if (v) this.flags |= 256;
    else this.flags &= -257;
  }
  get inHackPipelineBody() {
    return (this.flags & 512) > 0;
  }
  set inHackPipelineBody(v) {
    if (v) this.flags |= 512;
    else this.flags &= -513;
  }
  get seenTopicReference() {
    return (this.flags & 1024) > 0;
  }
  set seenTopicReference(v) {
    if (v) this.flags |= 1024;
    else this.flags &= -1025;
  }
  labels = [];
  commentsLen = 0;
  commentStack = [];
  pos = 0;
  type = 135;
  value = null;
  start = 0;
  end = 0;
  lastTokEndLoc = null;
  lastTokStartLoc = null;
  context = [types.brace];
  get canStartJSXElement() {
    return (this.flags & 2048) > 0;
  }
  set canStartJSXElement(v) {
    if (v) this.flags |= 2048;
    else this.flags &= -2049;
  }
  get containsEsc() {
    return (this.flags & 4096) > 0;
  }
  set containsEsc(v) {
    if (v) this.flags |= 4096;
    else this.flags &= -4097;
  }
  firstInvalidTemplateEscapePos = null;
  get hasTopLevelAwait() {
    return (this.flags & 8192) > 0;
  }
  set hasTopLevelAwait(v) {
    if (v) this.flags |= 8192;
    else this.flags &= -8193;
  }
  strictErrors = /* @__PURE__ */ new Map();
  tokensLength = 0;
  curPosition() {
    return new Position(this.curLine, this.pos - this.lineStart, this.pos + this.startIndex);
  }
  clone() {
    const state = new _State();
    state.flags = this.flags;
    state.startIndex = this.startIndex;
    state.curLine = this.curLine;
    state.lineStart = this.lineStart;
    state.startLoc = this.startLoc;
    state.endLoc = this.endLoc;
    state.errors = this.errors.slice();
    state.noArrowAt = this.noArrowAt.slice();
    state.noArrowParamsConversionAt = this.noArrowParamsConversionAt.slice();
    state.labels = this.labels.slice();
    state.commentsLen = this.commentsLen;
    state.commentStack = this.commentStack.slice();
    state.pos = this.pos;
    state.type = this.type;
    state.value = this.value;
    state.start = this.start;
    state.end = this.end;
    state.lastTokEndLoc = this.lastTokEndLoc;
    state.lastTokStartLoc = this.lastTokStartLoc;
    state.context = this.context.slice();
    state.firstInvalidTemplateEscapePos = this.firstInvalidTemplateEscapePos;
    state.strictErrors = this.strictErrors;
    state.tokensLength = this.tokensLength;
    return state;
  }
};
var _isDigit = function isDigit(code2) {
  return code2 >= 48 && code2 <= 57;
};
var forbiddenNumericSeparatorSiblings = {
  decBinOct: /* @__PURE__ */ new Set([46, 66, 69, 79, 95, 98, 101, 111]),
  hex: /* @__PURE__ */ new Set([46, 88, 95, 120])
};
var isAllowedNumericSeparatorSibling = {
  bin: (ch) => ch === 48 || ch === 49,
  oct: (ch) => ch >= 48 && ch <= 55,
  dec: (ch) => ch >= 48 && ch <= 57,
  hex: (ch) => ch >= 48 && ch <= 57 || ch >= 65 && ch <= 70 || ch >= 97 && ch <= 102
};
function readStringContents(type, input, pos, lineStart, curLine, errors) {
  const initialPos = pos;
  const initialLineStart = lineStart;
  const initialCurLine = curLine;
  let out = "";
  let firstInvalidLoc = null;
  let chunkStart = pos;
  const {
    length
  } = input;
  for (; ; ) {
    if (pos >= length) {
      errors.unterminated(initialPos, initialLineStart, initialCurLine);
      out += input.slice(chunkStart, pos);
      break;
    }
    const ch = input.charCodeAt(pos);
    if (isStringEnd(type, ch, input, pos)) {
      out += input.slice(chunkStart, pos);
      break;
    }
    if (ch === 92) {
      out += input.slice(chunkStart, pos);
      const res = readEscapedChar(input, pos, lineStart, curLine, type === "template", errors);
      if (res.ch === null && !firstInvalidLoc) {
        firstInvalidLoc = {
          pos,
          lineStart,
          curLine
        };
      } else {
        out += res.ch;
      }
      ({
        pos,
        lineStart,
        curLine
      } = res);
      chunkStart = pos;
    } else if (ch === 8232 || ch === 8233) {
      ++pos;
      ++curLine;
      lineStart = pos;
    } else if (ch === 10 || ch === 13) {
      if (type === "template") {
        out += input.slice(chunkStart, pos) + "\n";
        ++pos;
        if (ch === 13 && input.charCodeAt(pos) === 10) {
          ++pos;
        }
        ++curLine;
        chunkStart = lineStart = pos;
      } else {
        errors.unterminated(initialPos, initialLineStart, initialCurLine);
      }
    } else {
      ++pos;
    }
  }
  return {
    pos,
    str: out,
    firstInvalidLoc,
    lineStart,
    curLine
  };
}
function isStringEnd(type, ch, input, pos) {
  if (type === "template") {
    return ch === 96 || ch === 36 && input.charCodeAt(pos + 1) === 123;
  }
  return ch === (type === "double" ? 34 : 39);
}
function readEscapedChar(input, pos, lineStart, curLine, inTemplate, errors) {
  const throwOnInvalid = !inTemplate;
  pos++;
  const res = (ch2) => ({
    pos,
    ch: ch2,
    lineStart,
    curLine
  });
  const ch = input.charCodeAt(pos++);
  switch (ch) {
    case 110:
      return res("\n");
    case 114:
      return res("\r");
    case 120: {
      let code2;
      ({
        code: code2,
        pos
      } = readHexChar(input, pos, lineStart, curLine, 2, false, throwOnInvalid, errors));
      return res(code2 === null ? null : String.fromCharCode(code2));
    }
    case 117: {
      let code2;
      ({
        code: code2,
        pos
      } = readCodePoint(input, pos, lineStart, curLine, throwOnInvalid, errors));
      return res(code2 === null ? null : String.fromCodePoint(code2));
    }
    case 116:
      return res("	");
    case 98:
      return res("\b");
    case 118:
      return res("\v");
    case 102:
      return res("\f");
    case 13:
      if (input.charCodeAt(pos) === 10) {
        ++pos;
      }
    case 10:
      lineStart = pos;
      ++curLine;
    case 8232:
    case 8233:
      return res("");
    case 56:
    case 57:
      if (inTemplate) {
        return res(null);
      } else {
        errors.strictNumericEscape(pos - 1, lineStart, curLine);
      }
    default:
      if (ch >= 48 && ch <= 55) {
        const startPos = pos - 1;
        const match = /^[0-7]+/.exec(input.slice(startPos, pos + 2));
        let octalStr = match[0];
        let octal = parseInt(octalStr, 8);
        if (octal > 255) {
          octalStr = octalStr.slice(0, -1);
          octal = parseInt(octalStr, 8);
        }
        pos += octalStr.length - 1;
        const next = input.charCodeAt(pos);
        if (octalStr !== "0" || next === 56 || next === 57) {
          if (inTemplate) {
            return res(null);
          } else {
            errors.strictNumericEscape(startPos, lineStart, curLine);
          }
        }
        return res(String.fromCharCode(octal));
      }
      return res(String.fromCharCode(ch));
  }
}
function readHexChar(input, pos, lineStart, curLine, len, forceLen, throwOnInvalid, errors) {
  const initialPos = pos;
  let n;
  ({
    n,
    pos
  } = readInt(input, pos, lineStart, curLine, 16, len, forceLen, false, errors, !throwOnInvalid));
  if (n === null) {
    if (throwOnInvalid) {
      errors.invalidEscapeSequence(initialPos, lineStart, curLine);
    } else {
      pos = initialPos - 1;
    }
  }
  return {
    code: n,
    pos
  };
}
function readInt(input, pos, lineStart, curLine, radix, len, forceLen, allowNumSeparator, errors, bailOnError) {
  const start = pos;
  const forbiddenSiblings = radix === 16 ? forbiddenNumericSeparatorSiblings.hex : forbiddenNumericSeparatorSiblings.decBinOct;
  const isAllowedSibling = radix === 16 ? isAllowedNumericSeparatorSibling.hex : radix === 10 ? isAllowedNumericSeparatorSibling.dec : radix === 8 ? isAllowedNumericSeparatorSibling.oct : isAllowedNumericSeparatorSibling.bin;
  let invalid = false;
  let total = 0;
  for (let i = 0, e = len == null ? Infinity : len; i < e; ++i) {
    const code2 = input.charCodeAt(pos);
    let val;
    if (code2 === 95 && allowNumSeparator !== "bail") {
      const prev = input.charCodeAt(pos - 1);
      const next = input.charCodeAt(pos + 1);
      if (!allowNumSeparator) {
        if (bailOnError) return {
          n: null,
          pos
        };
        errors.numericSeparatorInEscapeSequence(pos, lineStart, curLine);
      } else if (Number.isNaN(next) || !isAllowedSibling(next) || forbiddenSiblings.has(prev) || forbiddenSiblings.has(next)) {
        if (bailOnError) return {
          n: null,
          pos
        };
        errors.unexpectedNumericSeparator(pos, lineStart, curLine);
      }
      ++pos;
      continue;
    }
    if (code2 >= 97) {
      val = code2 - 97 + 10;
    } else if (code2 >= 65) {
      val = code2 - 65 + 10;
    } else if (_isDigit(code2)) {
      val = code2 - 48;
    } else {
      val = Infinity;
    }
    if (val >= radix) {
      if (val <= 9 && bailOnError) {
        return {
          n: null,
          pos
        };
      } else if (val <= 9 && errors.invalidDigit(pos, lineStart, curLine, radix)) {
        val = 0;
      } else if (forceLen) {
        val = 0;
        invalid = true;
      } else {
        break;
      }
    }
    ++pos;
    total = total * radix + val;
  }
  if (pos === start || len != null && pos - start !== len || invalid) {
    return {
      n: null,
      pos
    };
  }
  return {
    n: total,
    pos
  };
}
function readCodePoint(input, pos, lineStart, curLine, throwOnInvalid, errors) {
  const ch = input.charCodeAt(pos);
  let code2;
  if (ch === 123) {
    ++pos;
    ({
      code: code2,
      pos
    } = readHexChar(input, pos, lineStart, curLine, input.indexOf("}", pos) - pos, true, throwOnInvalid, errors));
    ++pos;
    if (code2 !== null && code2 > 1114111) {
      if (throwOnInvalid) {
        errors.invalidCodePoint(pos, lineStart, curLine);
      } else {
        return {
          code: null,
          pos
        };
      }
    }
  } else {
    ({
      code: code2,
      pos
    } = readHexChar(input, pos, lineStart, curLine, 4, false, throwOnInvalid, errors));
  }
  return {
    code: code2,
    pos
  };
}
function buildPosition(pos, lineStart, curLine) {
  return new Position(curLine, pos - lineStart, pos);
}
var VALID_REGEX_FLAGS = /* @__PURE__ */ new Set([103, 109, 115, 105, 121, 117, 100, 118]);
var Token = class {
  constructor(state) {
    const startIndex = state.startIndex || 0;
    this.type = state.type;
    this.value = state.value;
    this.start = startIndex + state.start;
    this.end = startIndex + state.end;
    this.loc = new SourceLocation(state.startLoc, state.endLoc);
  }
};
var locDataCache;
var Tokenizer2 = class extends CommentsParser {
  isLookahead;
  tokens = [];
  constructor(options, input) {
    super();
    this.state = new State2();
    this.state.init(options);
    this.input = input;
    this.length = input.length;
    this.comments = [];
    this.isLookahead = false;
    if (!locDataCache || locDataCache.length < (this.length + 1) * 2) {
      locDataCache = new Uint32Array((this.length + 1) * 2);
    }
    this.locData = locDataCache;
  }
  setLoc(loc) {
    const dataIndex = this.offsetToSourcePos(loc.index);
    this.locData[dataIndex * 2] = loc.line;
    this.locData[dataIndex * 2 + 1] = loc.column;
  }
  getLoc(locIndex) {
    const dataIndex = this.offsetToSourcePos(locIndex);
    const loc = new Position(this.locData[dataIndex * 2], this.locData[dataIndex * 2 + 1], locIndex);
    return loc;
  }
  pushToken(token) {
    this.tokens.length = this.state.tokensLength;
    this.tokens.push(token);
    ++this.state.tokensLength;
  }
  next() {
    this.checkKeywordEscapes();
    if (this.optionFlags & 512) {
      this.pushToken(new Token(this.state));
    }
    this.state.lastTokEndLoc = this.state.endLoc;
    this.state.lastTokStartLoc = this.state.startLoc;
    this.nextToken();
  }
  eat(type) {
    if (this.match(type)) {
      this.next();
      return true;
    } else {
      return false;
    }
  }
  match(type) {
    return this.state.type === type;
  }
  createLookaheadState(state) {
    return {
      pos: state.pos,
      value: null,
      type: state.type,
      start: state.start,
      end: state.end,
      context: [this.curContext()],
      inType: state.inType,
      startLoc: state.startLoc,
      lastTokEndLoc: state.lastTokEndLoc,
      curLine: state.curLine,
      lineStart: state.lineStart,
      curPosition: state.curPosition
    };
  }
  lookahead() {
    const old = this.state;
    this.state = this.createLookaheadState(old);
    this.isLookahead = true;
    this.nextToken();
    this.isLookahead = false;
    const curr = this.state;
    this.state = old;
    return curr;
  }
  nextTokenStart() {
    return this.nextTokenStartSince(this.state.pos);
  }
  nextTokenStartSince(pos) {
    skipWhiteSpace.lastIndex = pos;
    return skipWhiteSpace.test(this.input) ? skipWhiteSpace.lastIndex : pos;
  }
  lookaheadCharCode() {
    return this.lookaheadCharCodeSince(this.state.pos);
  }
  lookaheadCharCodeSince(pos) {
    return this.input.charCodeAt(this.nextTokenStartSince(pos));
  }
  nextTokenInLineStart() {
    return this.nextTokenInLineStartSince(this.state.pos);
  }
  nextTokenInLineStartSince(pos) {
    skipWhiteSpaceInLine.lastIndex = pos;
    return skipWhiteSpaceInLine.test(this.input) ? skipWhiteSpaceInLine.lastIndex : pos;
  }
  lookaheadInLineCharCode() {
    return this.input.charCodeAt(this.nextTokenInLineStart());
  }
  codePointAtPos(pos) {
    let cp = this.input.charCodeAt(pos);
    if ((cp & 64512) === 55296 && ++pos < this.input.length) {
      const trail = this.input.charCodeAt(pos);
      if ((trail & 64512) === 56320) {
        cp = 65536 + ((cp & 1023) << 10) + (trail & 1023);
      }
    }
    return cp;
  }
  setStrict(strict) {
    this.state.strict = strict;
    if (strict) {
      this.state.strictErrors.forEach(([toParseError, at]) => this.raise(toParseError, at));
      this.state.strictErrors.clear();
    }
  }
  curContext() {
    return this.state.context[this.state.context.length - 1];
  }
  nextToken() {
    this.skipSpace();
    this.state.start = this.state.pos;
    if (!this.isLookahead) this.state.startLoc = this.state.curPosition();
    if (this.state.pos >= this.length) {
      this.finishToken(135);
      return;
    }
    this.getTokenFromCode(this.codePointAtPos(this.state.pos));
  }
  skipBlockComment(commentEnd) {
    let startLoc;
    if (!this.isLookahead) startLoc = this.state.curPosition();
    const start = this.state.pos;
    const end = this.input.indexOf(commentEnd, start + 2);
    if (end === -1) {
      throw this.raise(Errors.UnterminatedComment, this.state.curPosition());
    }
    this.state.pos = end + commentEnd.length;
    lineBreakG.lastIndex = start + 2;
    while (lineBreakG.test(this.input) && lineBreakG.lastIndex <= end) {
      ++this.state.curLine;
      this.state.lineStart = lineBreakG.lastIndex;
    }
    if (this.isLookahead) return;
    const comment = {
      type: "CommentBlock",
      value: this.input.slice(start + 2, end),
      start: this.sourceToOffsetPos(start),
      end: this.sourceToOffsetPos(end + commentEnd.length),
      loc: new SourceLocation(startLoc, this.state.curPosition())
    };
    if (this.optionFlags & 512) this.pushToken(comment);
    return comment;
  }
  skipLineComment(startSkip) {
    const start = this.state.pos;
    let startLoc;
    if (!this.isLookahead) startLoc = this.state.curPosition();
    let ch = this.input.charCodeAt(this.state.pos += startSkip);
    if (this.state.pos < this.length) {
      while (!isNewLine(ch) && ++this.state.pos < this.length) {
        ch = this.input.charCodeAt(this.state.pos);
      }
    }
    if (this.isLookahead) return;
    const end = this.state.pos;
    const value = this.input.slice(start + startSkip, end);
    const comment = {
      type: "CommentLine",
      value,
      start: this.sourceToOffsetPos(start),
      end: this.sourceToOffsetPos(end),
      loc: new SourceLocation(startLoc, this.state.curPosition())
    };
    if (this.optionFlags & 512) this.pushToken(comment);
    return comment;
  }
  skipSpace() {
    const spaceStart = this.state.pos;
    const comments = this.optionFlags & 8192 ? [] : null;
    loop: while (this.state.pos < this.length) {
      const ch = this.input.charCodeAt(this.state.pos);
      switch (ch) {
        case 32:
        case 160:
        case 9:
          ++this.state.pos;
          break;
        case 13:
          if (this.input.charCodeAt(this.state.pos + 1) === 10) {
            ++this.state.pos;
          }
        case 10:
        case 8232:
        case 8233:
          ++this.state.pos;
          ++this.state.curLine;
          this.state.lineStart = this.state.pos;
          break;
        case 47:
          switch (this.input.charCodeAt(this.state.pos + 1)) {
            case 42: {
              const comment = this.skipBlockComment("*/");
              if (comment !== void 0) {
                this.addComment(comment);
                comments?.push(comment);
              }
              break;
            }
            case 47: {
              const comment = this.skipLineComment(2);
              if (comment !== void 0) {
                this.addComment(comment);
                comments?.push(comment);
              }
              break;
            }
            default:
              break loop;
          }
          break;
        default:
          if (isWhitespace2(ch)) {
            ++this.state.pos;
          } else if (ch === 45 && !this.inModule && this.optionFlags & 16384) {
            const pos = this.state.pos;
            if (this.input.charCodeAt(pos + 1) === 45 && this.input.charCodeAt(pos + 2) === 62 && (spaceStart === 0 || this.state.lineStart > spaceStart)) {
              const comment = this.skipLineComment(3);
              if (comment !== void 0) {
                this.addComment(comment);
                comments?.push(comment);
              }
            } else {
              break loop;
            }
          } else if (ch === 60 && !this.inModule && this.optionFlags & 16384) {
            const pos = this.state.pos;
            if (this.input.charCodeAt(pos + 1) === 33 && this.input.charCodeAt(pos + 2) === 45 && this.input.charCodeAt(pos + 3) === 45) {
              const comment = this.skipLineComment(4);
              if (comment !== void 0) {
                this.addComment(comment);
                comments?.push(comment);
              }
            } else {
              break loop;
            }
          } else {
            break loop;
          }
      }
    }
    if (comments?.length > 0) {
      const end = this.state.pos;
      const commentWhitespace = {
        start: this.sourceToOffsetPos(spaceStart),
        end: this.sourceToOffsetPos(end),
        comments,
        leadingNode: null,
        trailingNode: null,
        containingNode: null
      };
      this.state.commentStack.push(commentWhitespace);
    }
  }
  finishToken(type, val) {
    this.state.end = this.state.pos;
    this.state.endLoc = this.state.curPosition();
    const prevType = this.state.type;
    this.state.type = type;
    this.state.value = val;
    if (!this.isLookahead) {
      this.updateContext(prevType);
    }
  }
  replaceToken(type) {
    this.state.type = type;
    this.updateContext();
  }
  readToken_numberSign() {
    if (this.state.pos === 0 && this.readToken_interpreter()) {
      return;
    }
    const nextPos = this.state.pos + 1;
    const next = this.codePointAtPos(nextPos);
    if (next >= 48 && next <= 57) {
      throw this.raise(Errors.UnexpectedDigitAfterHash, this.state.curPosition());
    }
    if (isIdentifierStart(next)) {
      ++this.state.pos;
      this.finishToken(134, this.readWord1(next));
    } else if (next === 92) {
      ++this.state.pos;
      this.finishToken(134, this.readWord1());
    } else {
      this.finishOp(23, 1);
    }
  }
  readToken_dot() {
    const next = this.input.charCodeAt(this.state.pos + 1);
    if (next >= 48 && next <= 57) {
      this.readNumber(true);
      return;
    }
    if (next === 46 && this.input.charCodeAt(this.state.pos + 2) === 46) {
      this.state.pos += 3;
      this.finishToken(17);
    } else {
      ++this.state.pos;
      this.finishToken(12);
    }
  }
  readToken_slash() {
    const next = this.input.charCodeAt(this.state.pos + 1);
    if (next === 61) {
      this.finishOp(27, 2);
    } else {
      this.finishOp(52, 1);
    }
  }
  readToken_interpreter() {
    if (this.state.pos !== 0 || this.length < 2) return false;
    let ch = this.input.charCodeAt(this.state.pos + 1);
    if (ch !== 33) return false;
    const start = this.state.pos;
    this.state.pos += 1;
    while (!isNewLine(ch) && ++this.state.pos < this.length) {
      ch = this.input.charCodeAt(this.state.pos);
    }
    const value = this.input.slice(start + 2, this.state.pos);
    this.finishToken(24, value);
    return true;
  }
  readToken_mult_modulo(code2) {
    let type = code2 === 42 ? 51 : 50;
    let width = 1;
    let next = this.input.charCodeAt(this.state.pos + 1);
    if (code2 === 42 && next === 42) {
      width++;
      next = this.input.charCodeAt(this.state.pos + 2);
      type = 53;
    }
    if (next === 61 && !this.state.inType) {
      width++;
      type = code2 === 37 ? 29 : 26;
    }
    this.finishOp(type, width);
  }
  readToken_pipe_amp(code2) {
    const next = this.input.charCodeAt(this.state.pos + 1);
    if (next === code2) {
      if (this.input.charCodeAt(this.state.pos + 2) === 61) {
        this.finishOp(26, 3);
      } else {
        this.finishOp(code2 === 124 ? 37 : 38, 2);
      }
      return;
    }
    if (code2 === 124) {
      if (next === 62) {
        this.finishOp(35, 2);
        return;
      }
    }
    if (next === 61) {
      this.finishOp(26, 2);
      return;
    }
    this.finishOp(code2 === 124 ? 39 : 41, 1);
  }
  readToken_caret() {
    const next = this.input.charCodeAt(this.state.pos + 1);
    if (next === 61 && !this.state.inType) {
      this.finishOp(28, 2);
    } else if (next === 94 && this.hasPlugin(["pipelineOperator", {
      proposal: "hack",
      topicToken: "^^"
    }])) {
      this.finishOp(33, 2);
      const lookaheadCh = this.input.codePointAt(this.state.pos);
      if (lookaheadCh === 94) {
        this.unexpected();
      }
    } else {
      this.finishOp(40, 1);
    }
  }
  readToken_atSign() {
    const next = this.input.charCodeAt(this.state.pos + 1);
    if (next === 64 && this.hasPlugin(["pipelineOperator", {
      proposal: "hack",
      topicToken: "@@"
    }])) {
      this.finishOp(34, 2);
    } else {
      this.finishOp(22, 1);
    }
  }
  readToken_plus_min(code2) {
    const next = this.input.charCodeAt(this.state.pos + 1);
    if (next === code2) {
      this.finishOp(30, 2);
      return;
    }
    if (next === 61) {
      this.finishOp(26, 2);
    } else {
      this.finishOp(49, 1);
    }
  }
  readToken_lt() {
    const {
      pos
    } = this.state;
    const next = this.input.charCodeAt(pos + 1);
    if (next === 60) {
      if (this.input.charCodeAt(pos + 2) === 61) {
        this.finishOp(26, 3);
        return;
      }
      this.finishOp(47, 2);
      return;
    }
    if (next === 61) {
      this.finishOp(45, 2);
      return;
    }
    this.finishOp(43, 1);
  }
  readToken_gt() {
    const {
      pos
    } = this.state;
    const next = this.input.charCodeAt(pos + 1);
    if (next === 62) {
      const size = this.input.charCodeAt(pos + 2) === 62 ? 3 : 2;
      if (this.input.charCodeAt(pos + size) === 61) {
        this.finishOp(26, size + 1);
        return;
      }
      this.finishOp(48, size);
      return;
    }
    if (next === 61) {
      this.finishOp(45, 2);
      return;
    }
    this.finishOp(44, 1);
  }
  readToken_eq_excl(code2) {
    const next = this.input.charCodeAt(this.state.pos + 1);
    if (next === 61) {
      this.finishOp(42, this.input.charCodeAt(this.state.pos + 2) === 61 ? 3 : 2);
      return;
    }
    if (code2 === 61 && next === 62) {
      this.state.pos += 2;
      this.finishToken(15);
      return;
    }
    this.finishOp(code2 === 61 ? 25 : 31, 1);
  }
  readToken_question() {
    const next = this.input.charCodeAt(this.state.pos + 1);
    const next2 = this.input.charCodeAt(this.state.pos + 2);
    if (next === 63) {
      if (next2 === 61) {
        this.finishOp(26, 3);
      } else {
        this.finishOp(36, 2);
      }
    } else if (next === 46 && !(next2 >= 48 && next2 <= 57)) {
      this.state.pos += 2;
      this.finishToken(14);
    } else {
      ++this.state.pos;
      this.finishToken(13);
    }
  }
  getTokenFromCode(code2) {
    switch (code2) {
      case 46:
        this.readToken_dot();
        return;
      case 40:
        ++this.state.pos;
        this.finishToken(6);
        return;
      case 41:
        ++this.state.pos;
        this.finishToken(7);
        return;
      case 59:
        ++this.state.pos;
        this.finishToken(9);
        return;
      case 44:
        ++this.state.pos;
        this.finishToken(8);
        return;
      case 91:
        ++this.state.pos;
        this.finishToken(0);
        return;
      case 93:
        ++this.state.pos;
        this.finishToken(1);
        return;
      case 123:
        ++this.state.pos;
        this.finishToken(2);
        return;
      case 125:
        ++this.state.pos;
        this.finishToken(4);
        return;
      case 58:
        if (this.hasPlugin("functionBind") && this.input.charCodeAt(this.state.pos + 1) === 58) {
          this.finishOp(11, 2);
        } else {
          ++this.state.pos;
          this.finishToken(10);
        }
        return;
      case 63:
        this.readToken_question();
        return;
      case 96:
        this.readTemplateToken();
        return;
      case 48: {
        const next = this.input.charCodeAt(this.state.pos + 1);
        if (next === 120 || next === 88) {
          this.readRadixNumber(16);
          return;
        }
        if (next === 111 || next === 79) {
          this.readRadixNumber(8);
          return;
        }
        if (next === 98 || next === 66) {
          this.readRadixNumber(2);
          return;
        }
      }
      case 49:
      case 50:
      case 51:
      case 52:
      case 53:
      case 54:
      case 55:
      case 56:
      case 57:
        this.readNumber(false);
        return;
      case 34:
      case 39:
        this.readString(code2);
        return;
      case 47:
        this.readToken_slash();
        return;
      case 37:
      case 42:
        this.readToken_mult_modulo(code2);
        return;
      case 124:
      case 38:
        this.readToken_pipe_amp(code2);
        return;
      case 94:
        this.readToken_caret();
        return;
      case 43:
      case 45:
        this.readToken_plus_min(code2);
        return;
      case 60:
        this.readToken_lt();
        return;
      case 62:
        this.readToken_gt();
        return;
      case 61:
      case 33:
        this.readToken_eq_excl(code2);
        return;
      case 126:
        this.finishOp(32, 1);
        return;
      case 64:
        this.readToken_atSign();
        return;
      case 35:
        this.readToken_numberSign();
        return;
      case 92:
        this.readWord();
        return;
      default:
        if (isIdentifierStart(code2)) {
          this.readWord(code2);
          return;
        }
    }
    throw this.raise(Errors.InvalidOrUnexpectedToken, this.state.curPosition(), {
      unexpected: String.fromCodePoint(code2)
    });
  }
  finishOp(type, size) {
    const str = this.input.slice(this.state.pos, this.state.pos + size);
    this.state.pos += size;
    this.finishToken(type, str);
  }
  readRegexp() {
    const startLoc = this.state.startLoc;
    const start = this.state.start + 1;
    let escaped, inClass;
    let {
      pos
    } = this.state;
    for (; ; ++pos) {
      if (pos >= this.length) {
        throw this.raise(Errors.UnterminatedRegExp, createPositionWithColumnOffset(startLoc, 1));
      }
      const ch = this.input.charCodeAt(pos);
      if (isNewLine(ch)) {
        throw this.raise(Errors.UnterminatedRegExp, createPositionWithColumnOffset(startLoc, 1));
      }
      if (escaped) {
        escaped = false;
      } else {
        if (ch === 91) {
          inClass = true;
        } else if (ch === 93 && inClass) {
          inClass = false;
        } else if (ch === 47 && !inClass) {
          break;
        }
        escaped = ch === 92;
      }
    }
    const content = this.input.slice(start, pos);
    ++pos;
    let mods = "";
    const nextPos = () => createPositionWithColumnOffset(startLoc, pos + 2 - start);
    while (pos < this.length) {
      const cp = this.codePointAtPos(pos);
      const char = String.fromCharCode(cp);
      if (VALID_REGEX_FLAGS.has(cp)) {
        if (cp === 118) {
          if (mods.includes("u")) {
            this.raise(Errors.IncompatibleRegExpUVFlags, nextPos());
          }
        } else if (cp === 117) {
          if (mods.includes("v")) {
            this.raise(Errors.IncompatibleRegExpUVFlags, nextPos());
          }
        }
        if (mods.includes(char)) {
          this.raise(Errors.DuplicateRegExpFlags, nextPos());
        }
      } else if (isIdentifierChar(cp) || cp === 92) {
        this.raise(Errors.MalformedRegExpFlags, nextPos());
      } else {
        break;
      }
      ++pos;
      mods += char;
    }
    this.state.pos = pos;
    this.finishToken(133, {
      pattern: content,
      flags: mods
    });
  }
  readInt(radix, len, forceLen = false, allowNumSeparator = true) {
    const {
      n,
      pos
    } = readInt(this.input, this.state.pos, this.state.lineStart, this.state.curLine, radix, len, forceLen, allowNumSeparator, this.errorHandlers_readInt, false);
    this.state.pos = pos;
    return n;
  }
  readRadixNumber(radix) {
    const start = this.state.pos;
    const startLoc = this.state.curPosition();
    let isBigInt = false;
    this.state.pos += 2;
    const val = this.readInt(radix);
    if (val == null) {
      this.raise(Errors.InvalidDigit, createPositionWithColumnOffset(startLoc, 2), {
        radix
      });
    }
    const next = this.input.charCodeAt(this.state.pos);
    if (next === 110) {
      ++this.state.pos;
      isBigInt = true;
    }
    if (isIdentifierStart(this.codePointAtPos(this.state.pos))) {
      throw this.raise(Errors.NumberIdentifier, this.state.curPosition());
    }
    if (isBigInt) {
      const str = this.input.slice(start, this.state.pos).replace(/[_n]/g, "");
      this.finishToken(132, str);
      return;
    }
    this.finishToken(131, val);
  }
  readNumber(startsWithDot) {
    const start = this.state.pos;
    const startLoc = this.state.curPosition();
    let isFloat = false;
    let isBigInt = false;
    let isOctal = false;
    if (!startsWithDot && this.readInt(10) === null) {
      this.raise(Errors.InvalidNumber, this.state.curPosition());
    }
    const hasLeadingZero = this.state.pos - start >= 2 && this.input.charCodeAt(start) === 48;
    if (hasLeadingZero) {
      const integer = this.input.slice(start, this.state.pos);
      this.recordStrictModeErrors(Errors.StrictOctalLiteral, startLoc);
      if (!this.state.strict) {
        const underscorePos = integer.indexOf("_");
        if (underscorePos > 0) {
          this.raise(Errors.ZeroDigitNumericSeparator, createPositionWithColumnOffset(startLoc, underscorePos));
        }
      }
      isOctal = hasLeadingZero && !/[89]/.test(integer);
    }
    let next = this.input.charCodeAt(this.state.pos);
    if (next === 46 && !isOctal) {
      ++this.state.pos;
      this.readInt(10);
      isFloat = true;
      next = this.input.charCodeAt(this.state.pos);
    }
    if ((next === 69 || next === 101) && !isOctal) {
      next = this.input.charCodeAt(++this.state.pos);
      if (next === 43 || next === 45) {
        ++this.state.pos;
      }
      if (this.readInt(10) === null) {
        this.raise(Errors.InvalidOrMissingExponent, startLoc);
      }
      isFloat = true;
      next = this.input.charCodeAt(this.state.pos);
    }
    const str = this.input.slice(start, this.state.pos).replaceAll("_", "");
    if (next === 110) {
      if (isFloat || hasLeadingZero) {
        this.raise(Errors.InvalidBigIntLiteral, startLoc);
      }
      ++this.state.pos;
      isBigInt = true;
    }
    if (isIdentifierStart(this.codePointAtPos(this.state.pos))) {
      throw this.raise(Errors.NumberIdentifier, this.state.curPosition());
    }
    if (isBigInt) {
      this.finishToken(132, str);
      return;
    }
    const val = isOctal ? parseInt(str, 8) : parseFloat(str);
    this.finishToken(131, val);
  }
  readCodePoint(throwOnInvalid) {
    const {
      code: code2,
      pos
    } = readCodePoint(this.input, this.state.pos, this.state.lineStart, this.state.curLine, throwOnInvalid, this.errorHandlers_readCodePoint);
    this.state.pos = pos;
    return code2;
  }
  readString(quote) {
    const {
      str,
      pos,
      curLine,
      lineStart
    } = readStringContents(quote === 34 ? "double" : "single", this.input, this.state.pos + 1, this.state.lineStart, this.state.curLine, this.errorHandlers_readStringContents_string);
    this.state.pos = pos + 1;
    this.state.lineStart = lineStart;
    this.state.curLine = curLine;
    this.finishToken(130, str);
  }
  readTemplateContinuation() {
    if (!this.match(4)) {
      this.unexpected(null, 4);
    }
    this.state.pos--;
    this.readTemplateToken();
  }
  readTemplateToken() {
    const opening2 = this.input[this.state.pos];
    const {
      str,
      firstInvalidLoc,
      pos,
      curLine,
      lineStart
    } = readStringContents("template", this.input, this.state.pos + 1, this.state.lineStart, this.state.curLine, this.errorHandlers_readStringContents_template);
    this.state.pos = pos + 1;
    this.state.lineStart = lineStart;
    this.state.curLine = curLine;
    if (firstInvalidLoc) {
      this.state.firstInvalidTemplateEscapePos = new Position(firstInvalidLoc.curLine, firstInvalidLoc.pos - firstInvalidLoc.lineStart, this.sourceToOffsetPos(firstInvalidLoc.pos));
    }
    if (this.input.codePointAt(pos) === 96) {
      this.finishToken(20, firstInvalidLoc ? null : opening2 + str + "`");
    } else {
      this.state.pos++;
      this.finishToken(21, firstInvalidLoc ? null : opening2 + str + "${");
    }
  }
  recordStrictModeErrors(toParseError, at) {
    const index = at.index;
    if (this.state.strict && !this.state.strictErrors.has(index)) {
      this.raise(toParseError, at);
    } else {
      this.state.strictErrors.set(index, [toParseError, at]);
    }
  }
  readWord1(firstCode) {
    this.state.containsEsc = false;
    let word = "";
    const start = this.state.pos;
    let chunkStart = this.state.pos;
    if (firstCode !== void 0) {
      this.state.pos += firstCode <= 65535 ? 1 : 2;
    }
    while (this.state.pos < this.length) {
      const ch = this.codePointAtPos(this.state.pos);
      if (isIdentifierChar(ch)) {
        this.state.pos += ch <= 65535 ? 1 : 2;
      } else if (ch === 92) {
        this.state.containsEsc = true;
        word += this.input.slice(chunkStart, this.state.pos);
        const escStart = this.state.curPosition();
        const identifierCheck = this.state.pos === start ? isIdentifierStart : isIdentifierChar;
        if (this.input.charCodeAt(++this.state.pos) !== 117) {
          this.raise(Errors.MissingUnicodeEscape, this.state.curPosition());
          chunkStart = this.state.pos - 1;
          continue;
        }
        ++this.state.pos;
        const esc = this.readCodePoint(true);
        if (esc !== null) {
          if (!identifierCheck(esc)) {
            this.raise(Errors.EscapedCharNotAnIdentifier, escStart);
          }
          word += String.fromCodePoint(esc);
        }
        chunkStart = this.state.pos;
      } else {
        break;
      }
    }
    return word + this.input.slice(chunkStart, this.state.pos);
  }
  readWord(firstCode) {
    const word = this.readWord1(firstCode);
    const type = keywords$1.get(word);
    if (type !== void 0) {
      this.finishToken(type, tokenLabelName(type));
    } else {
      this.finishToken(128, word);
    }
  }
  checkKeywordEscapes() {
    const {
      type
    } = this.state;
    if (tokenIsKeyword(type) && this.state.containsEsc) {
      this.raise(Errors.InvalidEscapedReservedWord, this.state.startLoc, {
        reservedWord: tokenLabelName(type)
      });
    }
  }
  raise(toParseError, at, details = {}) {
    const loc = at instanceof Position ? at : typeof at === "number" ? this.getLoc(at) : this.optionFlags & 256 ? at.loc.start : this.getLoc(at.start);
    const pos = at instanceof Position ? loc.index : typeof at === "number" ? at : at.start;
    const error = toParseError(loc, pos, details);
    if (!(this.optionFlags & 4096)) throw error;
    if (!this.isLookahead) this.state.errors.push(error);
    return error;
  }
  raiseOverwrite(toParseError, at, details = {}) {
    const loc = at instanceof Position ? at : this.optionFlags & 256 ? at.loc.start : this.getLoc(at.start);
    const pos = at instanceof Position ? loc.index : at.start;
    const errors = this.state.errors;
    for (let i = errors.length - 1; i >= 0; i--) {
      const error = errors[i];
      if (error.pos === pos) {
        return errors[i] = toParseError(loc, pos, details);
      }
      if (error.pos < pos) break;
    }
    return this.raise(toParseError, loc, details);
  }
  updateContext(prevType) {
  }
  unexpected(loc, type) {
    throw this.raise(Errors.UnexpectedToken, loc != null ? loc : this.state.startLoc, {
      expected: type ? tokenLabelName(type) : null
    });
  }
  expectPlugin(pluginName, loc) {
    if (this.hasPlugin(pluginName)) {
      return true;
    }
    throw this.raise(Errors.MissingPlugin, loc != null ? loc : this.state.startLoc, {
      missingPlugin: [pluginName]
    });
  }
  expectOnePlugin(pluginNames) {
    if (!pluginNames.some((name) => this.hasPlugin(name))) {
      throw this.raise(Errors.MissingOneOfPlugins, this.state.startLoc, {
        missingPlugin: pluginNames
      });
    }
  }
  errorBuilder(error) {
    return (pos, lineStart, curLine) => {
      this.raise(error, buildPosition(pos, lineStart, curLine));
    };
  }
  errorHandlers_readInt = {
    invalidDigit: (pos, lineStart, curLine, radix) => {
      if (!(this.optionFlags & 4096)) return false;
      this.raise(Errors.InvalidDigit, buildPosition(pos, lineStart, curLine), {
        radix
      });
      return true;
    },
    numericSeparatorInEscapeSequence: this.errorBuilder(Errors.NumericSeparatorInEscapeSequence),
    unexpectedNumericSeparator: this.errorBuilder(Errors.UnexpectedNumericSeparator)
  };
  errorHandlers_readCodePoint = {
    ...this.errorHandlers_readInt,
    invalidEscapeSequence: this.errorBuilder(Errors.InvalidEscapeSequence),
    invalidCodePoint: this.errorBuilder(Errors.InvalidCodePoint)
  };
  errorHandlers_readStringContents_string = {
    ...this.errorHandlers_readCodePoint,
    strictNumericEscape: (pos, lineStart, curLine) => {
      this.recordStrictModeErrors(Errors.StrictNumericEscape, buildPosition(pos, lineStart, curLine));
    },
    unterminated: (pos, lineStart, curLine) => {
      throw this.raise(Errors.UnterminatedString, buildPosition(pos - 1, lineStart, curLine));
    }
  };
  errorHandlers_readStringContents_template = {
    ...this.errorHandlers_readCodePoint,
    strictNumericEscape: this.errorBuilder(Errors.StrictNumericEscape),
    unterminated: (pos, lineStart, curLine) => {
      throw this.raise(Errors.UnterminatedTemplate, buildPosition(pos, lineStart, curLine));
    }
  };
};
var ClassScope = class {
  privateNames = /* @__PURE__ */ new Set();
  loneAccessors = /* @__PURE__ */ new Map();
  undefinedPrivateNames = /* @__PURE__ */ new Map();
};
var ClassScopeHandler = class {
  parser;
  stack = [];
  constructor(parser) {
    this.parser = parser;
  }
  current() {
    return this.stack[this.stack.length - 1];
  }
  enter() {
    this.stack.push(new ClassScope());
  }
  exit() {
    const oldClassScope = this.stack.pop();
    const current = this.current();
    for (const [name, loc] of Array.from(oldClassScope.undefinedPrivateNames)) {
      if (current) {
        if (!current.undefinedPrivateNames.has(name)) {
          current.undefinedPrivateNames.set(name, loc);
        }
      } else {
        this.parser.raise(Errors.InvalidPrivateFieldResolution, loc, {
          identifierName: name
        });
      }
    }
  }
  declarePrivateName(name, elementType, loc) {
    const {
      privateNames,
      loneAccessors,
      undefinedPrivateNames
    } = this.current();
    let redefined = privateNames.has(name);
    if (elementType & 3) {
      const accessor = redefined && loneAccessors.get(name);
      if (accessor) {
        const oldStatic = accessor & 4;
        const newStatic = elementType & 4;
        const oldKind = accessor & 3;
        const newKind = elementType & 3;
        redefined = oldKind === newKind || oldStatic !== newStatic;
        if (!redefined) loneAccessors.delete(name);
      } else if (!redefined) {
        loneAccessors.set(name, elementType);
      }
    }
    if (redefined) {
      this.parser.raise(Errors.PrivateNameRedeclaration, loc, {
        identifierName: name
      });
    }
    privateNames.add(name);
    undefinedPrivateNames.delete(name);
  }
  usePrivateName(name, loc) {
    let classScope;
    for (classScope of this.stack) {
      if (classScope.privateNames.has(name)) return;
    }
    if (classScope) {
      classScope.undefinedPrivateNames.set(name, loc);
    } else {
      this.parser.raise(Errors.InvalidPrivateFieldResolution, loc, {
        identifierName: name
      });
    }
  }
};
var ExpressionScope = class {
  constructor(type = 0) {
    this.type = type;
  }
  canBeArrowParameterDeclaration() {
    return this.type === 2 || this.type === 1;
  }
  isCertainlyParameterDeclaration() {
    return this.type === 3;
  }
};
var ArrowHeadParsingScope = class extends ExpressionScope {
  declarationErrors = /* @__PURE__ */ new Map();
  constructor(type) {
    super(type);
  }
  recordDeclarationError(ParsingErrorClass, index) {
    this.declarationErrors.set(index, ParsingErrorClass);
  }
  clearDeclarationError(index) {
    this.declarationErrors.delete(index);
  }
  iterateErrors(iterator) {
    this.declarationErrors.forEach(iterator);
  }
};
var ExpressionScopeHandler = class {
  parser;
  stack = [new ExpressionScope()];
  constructor(parser) {
    this.parser = parser;
  }
  enter(scope) {
    this.stack.push(scope);
  }
  exit() {
    this.stack.pop();
  }
  recordParameterInitializerError(toParseError, loc) {
    const {
      stack
    } = this;
    let i = stack.length - 1;
    let scope = stack[i];
    while (!scope.isCertainlyParameterDeclaration()) {
      if (scope.canBeArrowParameterDeclaration()) {
        scope.recordDeclarationError(toParseError, loc);
      } else {
        return;
      }
      scope = stack[--i];
    }
    this.parser.raise(toParseError, loc);
  }
  recordArrowParameterBindingError(error, node) {
    const {
      stack
    } = this;
    const scope = stack[stack.length - 1];
    const origin = node.start;
    if (scope.isCertainlyParameterDeclaration()) {
      this.parser.raise(error, origin);
    } else if (scope.canBeArrowParameterDeclaration()) {
      scope.recordDeclarationError(error, origin);
    } else {
      return;
    }
  }
  recordAsyncArrowParametersError(at) {
    const {
      stack
    } = this;
    let i = stack.length - 1;
    let scope = stack[i];
    while (scope.canBeArrowParameterDeclaration()) {
      if (scope.type === 2) {
        scope.recordDeclarationError(Errors.AwaitBindingIdentifier, at);
      }
      scope = stack[--i];
    }
  }
  validateAsPattern() {
    const {
      stack
    } = this;
    const currentScope = stack[stack.length - 1];
    if (!currentScope.canBeArrowParameterDeclaration()) return;
    currentScope.iterateErrors((toParseError, key) => {
      this.parser.raise(toParseError, key);
      let i = stack.length - 2;
      let scope = stack[i];
      while (scope.canBeArrowParameterDeclaration()) {
        scope.clearDeclarationError(key);
        scope = stack[--i];
      }
    });
  }
};
function newParameterDeclarationScope() {
  return new ExpressionScope(3);
}
function newArrowHeadScope() {
  return new ArrowHeadParsingScope(1);
}
function newAsyncArrowScope() {
  return new ArrowHeadParsingScope(2);
}
function newExpressionScope() {
  return new ExpressionScope();
}
var ProductionParameterHandler = class {
  stacks = [];
  enter(flags) {
    this.stacks.push(flags);
  }
  exit() {
    this.stacks.pop();
  }
  currentFlags() {
    return this.stacks[this.stacks.length - 1];
  }
  get hasAwait() {
    return (this.currentFlags() & 2) > 0;
  }
  get hasYield() {
    return (this.currentFlags() & 1) > 0;
  }
  get hasReturn() {
    return (this.currentFlags() & 4) > 0;
  }
  get hasIn() {
    return (this.currentFlags() & 8) > 0;
  }
  get inFSharpPipelineDirectBody() {
    return (this.currentFlags() & 16) === 0;
  }
};
function functionFlags(isAsync, isGenerator) {
  return (isAsync ? 2 : 0) | (isGenerator ? 1 : 0);
}
var UtilParser = class extends Tokenizer2 {
  addExtra(node, key, value, enumerable = true) {
    if (!node) return;
    let {
      extra
    } = node;
    if (extra == null) {
      extra = {};
      node.extra = extra;
    }
    if (enumerable) {
      extra[key] = value;
    } else {
      Object.defineProperty(extra, key, {
        enumerable,
        value
      });
    }
  }
  isContextual(token) {
    return this.state.type === token && !this.state.containsEsc;
  }
  isUnparsedContextual(nameStart, name) {
    if (this.input.startsWith(name, nameStart)) {
      const nextCh = this.input.charCodeAt(nameStart + name.length);
      return !(isIdentifierChar(nextCh) || (nextCh & 64512) === 55296);
    }
    return false;
  }
  isLookaheadContextual(name) {
    const next = this.nextTokenStart();
    return this.isUnparsedContextual(next, name);
  }
  eatContextual(token) {
    if (this.isContextual(token)) {
      this.next();
      return true;
    }
    return false;
  }
  expectContextual(token, toParseError) {
    if (!this.eatContextual(token)) {
      if (toParseError != null) {
        throw this.raise(toParseError, this.state.startLoc);
      }
      this.unexpected(null, token);
    }
  }
  canInsertSemicolon() {
    return this.match(135) || this.match(4) || this.hasPrecedingLineBreak();
  }
  hasPrecedingLineBreak() {
    return hasNewLine(this.input, this.offsetToSourcePos(this.state.lastTokEndLoc.index), this.state.start);
  }
  hasFollowingLineBreak() {
    return hasNewLine(this.input, this.state.end, this.nextTokenStart());
  }
  isLineTerminator() {
    return this.eat(9) || this.canInsertSemicolon();
  }
  semicolon(allowAsi = true) {
    if (allowAsi ? this.isLineTerminator() : this.eat(9)) return;
    this.raise(Errors.MissingSemicolon, this.state.lastTokEndLoc);
  }
  expect(type, loc) {
    if (!this.eat(type)) {
      this.unexpected(loc, type);
    }
  }
  tryParse(fn, oldState = this.state.clone()) {
    const abortSignal = {
      node: null
    };
    try {
      const node = fn((node2 = null) => {
        abortSignal.node = node2;
        throw abortSignal;
      });
      if (this.state.errors.length > oldState.errors.length) {
        const failState = this.state;
        this.state = oldState;
        this.state.tokensLength = failState.tokensLength;
        return {
          node,
          error: failState.errors[oldState.errors.length],
          thrown: false,
          aborted: false,
          failState
        };
      }
      return {
        node,
        error: null,
        thrown: false,
        aborted: false,
        failState: null
      };
    } catch (error) {
      const failState = this.state;
      this.state = oldState;
      if (error instanceof SyntaxError) {
        return {
          node: null,
          error,
          thrown: true,
          aborted: false,
          failState
        };
      }
      if (error === abortSignal) {
        return {
          node: abortSignal.node,
          error: null,
          thrown: false,
          aborted: true,
          failState
        };
      }
      throw error;
    }
  }
  checkExpressionErrors(refExpressionErrors, andThrow) {
    if (!refExpressionErrors) return false;
    const {
      shorthandAssignLoc,
      doubleProtoLoc,
      privateKeyLoc,
      optionalParametersLoc,
      voidPatternLoc
    } = refExpressionErrors;
    const hasErrors = !!shorthandAssignLoc || !!doubleProtoLoc || !!optionalParametersLoc || !!privateKeyLoc || !!voidPatternLoc;
    if (!andThrow) {
      return hasErrors;
    }
    if (shorthandAssignLoc != null) {
      this.raise(Errors.InvalidCoverInitializedName, shorthandAssignLoc);
    }
    if (doubleProtoLoc != null) {
      this.raise(Errors.DuplicateProto, doubleProtoLoc);
    }
    if (privateKeyLoc != null) {
      this.raise(Errors.UnexpectedPrivateField, privateKeyLoc);
    }
    if (optionalParametersLoc != null) {
      this.unexpected(optionalParametersLoc);
    }
    if (voidPatternLoc != null) {
      this.raise(Errors.InvalidCoverDiscardElement, voidPatternLoc);
    }
  }
  isLiteralPropertyName() {
    return tokenIsLiteralPropertyName(this.state.type);
  }
  isPrivateName(node) {
    return node.type === "PrivateName";
  }
  getPrivateNameSV(node) {
    return node.id.name;
  }
  hasPropertyAsPrivateName(node) {
    return (node.type === "MemberExpression" || node.type === "OptionalMemberExpression") && this.isPrivateName(node.property);
  }
  isObjectProperty(node) {
    return node.type === "ObjectProperty";
  }
  isObjectMethod(node) {
    return node.type === "ObjectMethod";
  }
  initializeScopes(inModule = this.options.sourceType === "module") {
    const oldLabels = this.state.labels;
    this.state.labels = [];
    const oldExportedIdentifiers = this.exportedIdentifiers;
    this.exportedIdentifiers = /* @__PURE__ */ new Set();
    const oldInModule = this.inModule;
    this.inModule = inModule;
    const oldScope = this.scope;
    const ScopeHandler2 = this.getScopeHandler();
    this.scope = new ScopeHandler2(this, inModule);
    const oldProdParam = this.prodParam;
    this.prodParam = new ProductionParameterHandler();
    const oldClassScope = this.classScope;
    this.classScope = new ClassScopeHandler(this);
    const oldExpressionScope = this.expressionScope;
    this.expressionScope = new ExpressionScopeHandler(this);
    return () => {
      this.state.labels = oldLabels;
      this.exportedIdentifiers = oldExportedIdentifiers;
      this.inModule = oldInModule;
      this.scope = oldScope;
      this.prodParam = oldProdParam;
      this.classScope = oldClassScope;
      this.expressionScope = oldExpressionScope;
    };
  }
  enterInitialScopes() {
    let paramFlags = 0;
    if (this.inModule || this.optionFlags & 1) {
      paramFlags |= 2;
    }
    if (this.optionFlags & 32) {
      paramFlags |= 1;
    }
    const isCommonJS = !this.inModule && this.options.sourceType === "commonjs";
    if (isCommonJS || this.optionFlags & 2) {
      paramFlags |= 4;
    }
    this.prodParam.enter(paramFlags);
    let scopeFlags = isCommonJS ? 514 : 1;
    if (this.optionFlags & 4) {
      scopeFlags |= 512;
    }
    if (this.optionFlags & 16) {
      scopeFlags |= 16 | 32;
    }
    this.scope.enter(scopeFlags);
  }
  checkDestructuringPrivate(refExpressionErrors) {
    const {
      privateKeyLoc
    } = refExpressionErrors;
    if (privateKeyLoc !== null) {
      this.expectPlugin("destructuringPrivate", privateKeyLoc);
    }
  }
};
var ExpressionErrors = class {
  shorthandAssignLoc = null;
  doubleProtoLoc = null;
  privateKeyLoc = null;
  optionalParametersLoc = null;
  voidPatternLoc = null;
};
var Node2 = class {
  constructor(optionFlags, filename, pos, loc) {
    this.start = pos;
    this.end = 0;
    if (loc !== void 0) this.loc = new SourceLocation(loc);
    if (optionFlags & 128) this.range = [pos, 0];
    if (loc !== void 0 && filename) {
      this.loc.filename = filename;
    }
  }
  type = "";
};
var NodePrototype = Node2.prototype;
var NodeUtils = class extends UtilParser {
  createPosition(loc) {
    return loc;
  }
  startNode() {
    const {
      startLoc
    } = this.state;
    this.setLoc(startLoc);
    return this.startNodeAt(startLoc);
  }
  startNodeAt(loc) {
    const {
      optionFlags,
      filename
    } = this;
    if (!(optionFlags & 256)) {
      return new Node2(optionFlags, filename, loc.index);
    }
    return new Node2(optionFlags, filename, loc.index, this.createPosition(loc));
  }
  startNodeAtNode(type) {
    const {
      optionFlags,
      filename
    } = this;
    if (!(optionFlags & 256)) {
      return new Node2(optionFlags, filename, type.start);
    }
    return new Node2(optionFlags, filename, type.start, type.loc.start);
  }
  finishNode(node, type) {
    return this.finishNodeAt(node, type, this.state.lastTokEndLoc);
  }
  finishNodeAt(node, type, endLoc) {
    node.type = type;
    node.end = endLoc.index;
    const {
      optionFlags
    } = this;
    if (optionFlags & 256) {
      node.loc.end = this.createPosition(endLoc);
    }
    if (optionFlags & 128) node.range[1] = endLoc.index;
    if (optionFlags & 8192) this.processComment(node);
    return node;
  }
  finishNodeAtNode(node, type, endNode) {
    node.type = type;
    node.end = endNode.end;
    const {
      optionFlags
    } = this;
    if (optionFlags & 256) {
      node.loc.end = endNode.loc.end;
    }
    if (optionFlags & 128) node.range[1] = node.end;
    if (optionFlags & 8192) this.processComment(node);
    return node;
  }
  resetStartLocation(node, startLoc) {
    node.start = startLoc.index;
    const {
      optionFlags
    } = this;
    if (optionFlags & 256) {
      node.loc.start = this.createPosition(startLoc);
    }
    if (optionFlags & 128) node.range[0] = startLoc.index;
  }
  resetEndLocation(node, endLoc = this.state.lastTokEndLoc) {
    node.end = endLoc.index;
    const {
      optionFlags
    } = this;
    if (optionFlags & 256) {
      node.loc.end = this.createPosition(endLoc);
    }
    if (optionFlags & 128) node.range[1] = endLoc.index;
  }
  resetStartLocationFromNode(node, locationNode) {
    node.start = locationNode.start;
    const {
      optionFlags
    } = this;
    if (optionFlags & 256) {
      node.loc.start = locationNode.loc.start;
    }
    if (optionFlags & 128) node.range[0] = locationNode.start;
  }
  resetEndLocationFromNode(node, locationNode) {
    node.end = locationNode.end;
    const {
      optionFlags
    } = this;
    if (optionFlags & 256) {
      node.loc.end = locationNode.loc.end;
    }
    if (optionFlags & 128) node.range[1] = locationNode.end;
  }
  castNodeTo(node, type) {
    node.type = type;
    return node;
  }
  cloneIdentifier(node) {
    const {
      type,
      start,
      end,
      loc,
      range,
      name
    } = node;
    const cloned = Object.create(NodePrototype);
    cloned.type = type;
    cloned.start = start;
    cloned.end = end;
    cloned.loc = loc;
    cloned.range = range;
    cloned.name = name;
    if (node.extra) cloned.extra = node.extra;
    return cloned;
  }
  cloneStringLiteral(node) {
    const {
      type,
      start,
      end,
      loc,
      range,
      extra
    } = node;
    const cloned = Object.create(NodePrototype);
    cloned.type = type;
    cloned.start = start;
    cloned.end = end;
    cloned.loc = loc;
    cloned.range = range;
    cloned.extra = extra;
    cloned.value = node.value;
    return cloned;
  }
};
var unwrapParenthesizedExpression = (node) => {
  return node.type === "ParenthesizedExpression" ? unwrapParenthesizedExpression(node.expression) : node;
};
var LValParser = class extends NodeUtils {
  toAssignable(node, isLHS = false) {
    let parenthesized = void 0;
    if (node.type === "ParenthesizedExpression" || node.extra?.parenthesized) {
      parenthesized = unwrapParenthesizedExpression(node);
      if (isLHS) {
        if (parenthesized.type === "Identifier") {
          this.expressionScope.recordArrowParameterBindingError(Errors.InvalidParenthesizedAssignment, node);
        } else if (parenthesized.type !== "CallExpression" && parenthesized.type !== "MemberExpression" && !this.isOptionalMemberExpression(parenthesized)) {
          this.raise(Errors.InvalidParenthesizedAssignment, node);
        }
      } else {
        this.raise(Errors.InvalidParenthesizedAssignment, node);
      }
    }
    switch (node.type) {
      case "Identifier":
      case "ObjectPattern":
      case "ArrayPattern":
      case "AssignmentPattern":
      case "RestElement":
      case "VoidPattern":
        break;
      case "ObjectExpression":
        this.castNodeTo(node, "ObjectPattern");
        for (let i = 0, length = node.properties.length, last = length - 1; i < length; i++) {
          const prop = node.properties[i];
          const isLast = i === last;
          this.toAssignableObjectExpressionProp(prop, isLast, isLHS);
          if (isLast && prop.type === "RestElement" && node.extra?.trailingCommaLoc) {
            this.raise(Errors.RestTrailingComma, node.extra.trailingCommaLoc);
          }
        }
        break;
      case "ObjectProperty": {
        const {
          key,
          value
        } = node;
        if (this.isPrivateName(key)) {
          this.classScope.usePrivateName(this.getPrivateNameSV(key), key.start);
        }
        this.toAssignable(value, isLHS);
        break;
      }
      case "SpreadElement": {
        throw new Error("Internal @babel/parser error (this is a bug, please report it). SpreadElement should be converted by .toAssignable's caller.");
      }
      case "ArrayExpression":
        this.castNodeTo(node, "ArrayPattern");
        this.toAssignableList(node.elements, node.extra?.trailingCommaLoc, isLHS);
        break;
      case "AssignmentExpression":
        if (node.operator !== "=") {
          this.raise(Errors.MissingEqInAssignment, this.optionFlags & 256 ? node.left.loc.end : node.left);
        }
        this.castNodeTo(node, "AssignmentPattern");
        delete node.operator;
        if (node.left.type === "VoidPattern") {
          this.raise(Errors.VoidPatternInitializer, node.left);
        }
        this.toAssignable(node.left, isLHS);
        break;
      case "ParenthesizedExpression":
        this.toAssignable(parenthesized, isLHS);
        break;
    }
  }
  toAssignableObjectExpressionProp(prop, isLast, isLHS) {
    if (prop.type === "ObjectMethod") {
      this.raise(prop.kind === "get" || prop.kind === "set" ? Errors.PatternHasAccessor : Errors.PatternHasMethod, prop.key);
    } else if (prop.type === "SpreadElement") {
      this.castNodeTo(prop, "RestElement");
      const arg = prop.argument;
      this.checkToRestConversion(arg, false);
      this.toAssignable(arg, isLHS);
      if (!isLast) {
        this.raise(Errors.RestTrailingComma, prop);
      }
    } else {
      this.toAssignable(prop, isLHS);
    }
  }
  toAssignableList(exprList, trailingCommaLoc, isLHS) {
    const end = exprList.length - 1;
    for (let i = 0; i <= end; i++) {
      const elt = exprList[i];
      if (!elt) continue;
      this.toAssignableListItem(exprList, i, isLHS);
      if (elt.type === "RestElement") {
        if (i < end) {
          this.raise(Errors.RestTrailingComma, elt);
        } else if (trailingCommaLoc) {
          this.raise(Errors.RestTrailingComma, trailingCommaLoc);
        }
      }
    }
  }
  toAssignableListItem(exprList, index, isLHS) {
    const node = exprList[index];
    if (node.type === "SpreadElement") {
      this.castNodeTo(node, "RestElement");
      const arg = node.argument;
      this.checkToRestConversion(arg, true);
      this.toAssignable(arg, isLHS);
    } else {
      this.toAssignable(node, isLHS);
    }
  }
  isAssignable(node, isBinding) {
    switch (node.type) {
      case "Identifier":
      case "ObjectPattern":
      case "ArrayPattern":
      case "AssignmentPattern":
      case "RestElement":
      case "VoidPattern":
        return true;
      case "ObjectExpression": {
        const last = node.properties.length - 1;
        return node.properties.every((prop, i) => {
          return prop.type !== "ObjectMethod" && (i === last || prop.type !== "SpreadElement") && this.isAssignable(prop);
        });
      }
      case "ObjectProperty":
        return this.isAssignable(node.value);
      case "SpreadElement":
        return this.isAssignable(node.argument);
      case "ArrayExpression":
        return node.elements.every((element) => element === null || this.isAssignable(element));
      case "AssignmentExpression":
        return node.operator === "=";
      case "ParenthesizedExpression":
        return this.isAssignable(node.expression);
      case "MemberExpression":
      case "OptionalMemberExpression":
        return !isBinding;
      default:
        return false;
    }
  }
  toReferencedList(exprList, isParenthesizedExpr) {
    return exprList;
  }
  parseSpread(refExpressionErrors) {
    const node = this.startNode();
    this.next();
    node.argument = this.parseMaybeAssignAllowIn(refExpressionErrors, void 0);
    return this.finishNode(node, "SpreadElement");
  }
  parseRestBinding() {
    const node = this.startNode();
    this.next();
    const argument = this.parseBindingAtom();
    if (argument.type === "VoidPattern") {
      this.raise(Errors.UnexpectedVoidPattern, argument);
    }
    node.argument = argument;
    return this.finishNode(node, "RestElement");
  }
  parseBindingAtom() {
    switch (this.state.type) {
      case 0: {
        const node = this.startNode();
        this.next();
        node.elements = this.parseBindingList(1, 93, 1);
        return this.finishNode(node, "ArrayPattern");
      }
      case 2:
        return this.parseObjectLike(4, true);
      case 84:
        return this.parseVoidPattern(null);
    }
    return this.parseIdentifier();
  }
  parseBindingList(close, closeCharCode, flags) {
    const allowEmpty = flags & 1;
    const elts = [];
    let first = true;
    while (!this.eat(close)) {
      if (first) {
        first = false;
      } else {
        this.expect(8);
      }
      if (allowEmpty && this.match(8)) {
        elts.push(null);
      } else if (this.eat(close)) {
        break;
      } else if (this.match(17)) {
        let rest = this.parseRestBinding();
        if (flags & 2) {
          rest = this.parseFunctionParamType(rest);
        }
        elts.push(rest);
        if (!this.checkCommaAfterRest(closeCharCode)) {
          this.expect(close);
          break;
        }
      } else {
        const decorators = [];
        if (flags & 2) {
          if (this.match(22) && this.hasPlugin("decorators")) {
            this.raise(Errors.UnsupportedParameterDecorator, this.state.startLoc);
          }
          while (this.match(22)) {
            decorators.push(this.parseDecorator());
          }
        }
        elts.push(this.parseBindingElement(flags, decorators));
      }
    }
    return elts;
  }
  parseBindingRestProperty(prop) {
    this.next();
    if (this.hasPlugin("discardBinding") && this.match(84)) {
      prop.argument = this.parseVoidPattern(null);
      this.raise(Errors.UnexpectedVoidPattern, prop.argument);
    } else {
      prop.argument = this.parseIdentifier();
    }
    this.checkCommaAfterRest(125);
    return this.finishNode(prop, "RestElement");
  }
  parseBindingProperty() {
    const {
      type,
      startLoc
    } = this.state;
    if (type === 17) {
      return this.parseBindingRestProperty(this.startNode());
    }
    const prop = this.startNode();
    if (type === 134) {
      this.expectPlugin("destructuringPrivate", startLoc);
      this.classScope.usePrivateName(this.state.value, startLoc);
      prop.key = this.parsePrivateName();
    } else {
      this.parsePropertyName(prop);
    }
    prop.method = false;
    return this.parseObjPropValue(prop, startLoc, false, false, true, false);
  }
  parseBindingElement(flags, decorators) {
    const {
      startLoc
    } = this.state;
    const left = this.parseMaybeDefault();
    if (flags & 2) {
      this.parseFunctionParamType(left);
    }
    if (decorators.length) {
      left.decorators = decorators;
      this.resetStartLocationFromNode(left, decorators[0]);
    }
    const elt = this.parseMaybeDefault(startLoc, left);
    return elt;
  }
  parseFunctionParamType(param) {
    return param;
  }
  parseMaybeDefault(startLoc, left) {
    startLoc ??= this.state.startLoc;
    left = left ?? this.parseBindingAtom();
    if (!this.eat(25)) return left;
    const node = this.startNodeAt(startLoc);
    if (left.type === "VoidPattern") {
      this.raise(Errors.VoidPatternInitializer, left);
    }
    node.left = left;
    node.right = this.parseMaybeAssignAllowIn();
    return this.finishNode(node, "AssignmentPattern");
  }
  isValidLVal(type, disallowCallExpression, isUnparenthesizedInAssign, binding) {
    switch (type) {
      case "AssignmentPattern":
        return "left";
      case "RestElement":
        return "argument";
      case "ObjectProperty":
        return "value";
      case "ParenthesizedExpression":
        return "expression";
      case "ArrayPattern":
        return "elements";
      case "ObjectPattern":
        return "properties";
      case "VoidPattern":
        return true;
      case "CallExpression":
        if (!disallowCallExpression && !this.state.strict && this.optionFlags & 16384) {
          return true;
        }
    }
    return false;
  }
  isOptionalMemberExpression(expression) {
    return expression.type === "OptionalMemberExpression";
  }
  checkLVal(expression, ancestor, binding = 64, checkClashes = false, strictModeChanged = false, hasParenthesizedAncestor = false, disallowCallExpression = false) {
    const type = expression.type;
    if (this.isObjectMethod(expression)) return;
    const isOptionalMemberExpression = this.isOptionalMemberExpression(expression);
    if (isOptionalMemberExpression || type === "MemberExpression") {
      if (isOptionalMemberExpression) {
        this.expectPlugin("optionalChainingAssign", expression.start);
        if (ancestor.type !== "AssignmentExpression") {
          this.raise(Errors.InvalidLhsOptionalChaining, expression, {
            ancestor
          });
        }
      }
      if (binding !== 64) {
        this.raise(Errors.InvalidPropertyBindingPattern, expression);
      }
      return;
    }
    if (type === "Identifier") {
      this.checkIdentifier(expression, binding, strictModeChanged);
      const {
        name
      } = expression;
      if (checkClashes) {
        if (checkClashes.has(name)) {
          this.raise(Errors.ParamDupe, expression);
        } else {
          checkClashes.add(name);
        }
      }
      return;
    } else if (type === "VoidPattern" && ancestor.type === "CatchClause") {
      this.raise(Errors.VoidPatternCatchClauseParam, expression);
    }
    const unwrappedExpression = unwrapParenthesizedExpression(expression);
    disallowCallExpression ||= unwrappedExpression.type === "CallExpression" && (unwrappedExpression.callee.type === "Import" || unwrappedExpression.callee.type === "Super");
    const validity = this.isValidLVal(type, disallowCallExpression, !(hasParenthesizedAncestor || expression.extra?.parenthesized) && ancestor.type === "AssignmentExpression", binding);
    if (validity === true) return;
    if (validity === false) {
      const ParseErrorClass = binding === 64 ? Errors.InvalidLhs : Errors.InvalidLhsBinding;
      this.raise(ParseErrorClass, expression, {
        ancestor
      });
      return;
    }
    let key, isParenthesizedExpression;
    if (typeof validity === "string") {
      key = validity;
      isParenthesizedExpression = type === "ParenthesizedExpression";
    } else {
      [key, isParenthesizedExpression] = validity;
    }
    const nextAncestor = type === "ArrayPattern" || type === "ObjectPattern" ? {
      type
    } : ancestor;
    const val = expression[key];
    if (Array.isArray(val)) {
      for (const child of val) {
        if (child) {
          this.checkLVal(child, nextAncestor, binding, checkClashes, strictModeChanged, isParenthesizedExpression, true);
        }
      }
    } else if (val) {
      this.checkLVal(val, nextAncestor, binding, checkClashes, strictModeChanged, isParenthesizedExpression, disallowCallExpression);
    }
  }
  checkIdentifier(at, bindingType, strictModeChanged = false) {
    if (this.state.strict && (strictModeChanged ? isStrictBindReservedWord(at.name, this.inModule) : isStrictBindOnlyReservedWord(at.name))) {
      if (bindingType === 64) {
        this.raise(Errors.StrictEvalArguments, at, {
          referenceName: at.name
        });
      } else {
        this.raise(Errors.StrictEvalArgumentsBinding, at, {
          bindingName: at.name
        });
      }
    }
    if (bindingType & 8192 && at.name === "let") {
      this.raise(Errors.LetInLexicalBinding, at);
    }
    if (!(bindingType & 64)) {
      this.declareNameFromIdentifier(at, bindingType);
    }
  }
  declareNameFromIdentifier(identifier, binding) {
    this.scope.declareName(identifier.name, binding, identifier.start);
  }
  checkToRestConversion(node, allowPattern) {
    switch (node.type) {
      case "ParenthesizedExpression":
        this.checkToRestConversion(node.expression, allowPattern);
        break;
      case "Identifier":
      case "MemberExpression":
        break;
      case "ArrayExpression":
      case "ObjectExpression":
        if (allowPattern) break;
      default:
        this.raise(Errors.InvalidRestAssignmentPattern, node);
    }
  }
  checkCommaAfterRest(close) {
    if (!this.match(8)) {
      return false;
    }
    this.raise(this.lookaheadCharCode() === close ? Errors.RestTrailingComma : Errors.ElementAfterRest, this.state.startLoc);
    return true;
  }
};
var ExpressionParser = class extends LValParser {
  checkProto(prop, sawProto, refExpressionErrors) {
    if (prop.type === "SpreadElement" || this.isObjectMethod(prop) || prop.computed || prop.shorthand) {
      return sawProto;
    }
    const key = prop.key;
    const name = key.type === "Identifier" ? key.name : key.value;
    if (name === "__proto__") {
      if (sawProto) {
        if (refExpressionErrors) {
          if (refExpressionErrors.doubleProtoLoc === null) {
            refExpressionErrors.doubleProtoLoc = this.getLoc(key.start);
          }
        } else {
          this.raise(Errors.DuplicateProto, key);
        }
      }
      return true;
    }
    return sawProto;
  }
  shouldExitDescending(expr) {
    return expr.type === "ArrowFunctionExpression" && !expr.extra?.parenthesized;
  }
  getExpression() {
    this.enterInitialScopes();
    this.nextToken();
    if (this.match(135)) {
      throw this.raise(Errors.ParseExpressionEmptyInput, this.state.startLoc);
    }
    const expr = this.parseExpression();
    if (!this.match(135)) {
      throw this.raise(Errors.ParseExpressionExpectsEOF, this.state.startLoc, {
        unexpected: this.input.codePointAt(this.state.start)
      });
    }
    this.finalizeRemainingComments();
    expr.comments = this.comments;
    expr.errors = this.state.errors;
    if (this.optionFlags & 512) {
      expr.tokens = createExportedTokens(this.tokens);
    }
    return expr;
  }
  parseExpression(disallowIn, refExpressionErrors) {
    if (disallowIn) {
      return this.disallowInAnd(() => this.parseExpressionBase(refExpressionErrors));
    }
    return this.allowInAnd(() => this.parseExpressionBase(refExpressionErrors));
  }
  parseExpressionBase(refExpressionErrors) {
    const startLoc = this.state.startLoc;
    const expr = this.parseMaybeAssign(refExpressionErrors);
    if (this.match(8)) {
      const node = this.startNodeAt(startLoc);
      node.expressions = [expr];
      while (this.eat(8)) {
        node.expressions.push(this.parseMaybeAssign(refExpressionErrors));
      }
      this.toReferencedList(node.expressions);
      return this.finishNode(node, "SequenceExpression");
    }
    return expr;
  }
  parseMaybeAssignDisallowIn(refExpressionErrors, afterLeftParse) {
    return this.disallowInAnd(() => this.parseMaybeAssign(refExpressionErrors, afterLeftParse));
  }
  parseMaybeAssignAllowIn(refExpressionErrors, afterLeftParse) {
    return this.allowInAnd(() => this.parseMaybeAssign(refExpressionErrors, afterLeftParse));
  }
  setOptionalParametersError(refExpressionErrors) {
    refExpressionErrors.optionalParametersLoc = this.state.startLoc;
  }
  parseMaybeAssign(refExpressionErrors, afterLeftParse) {
    const startLoc = this.state.startLoc;
    const isYield = this.isContextual(104);
    if (isYield) {
      if (this.prodParam.hasYield) {
        this.next();
        let left2 = this.parseYield(startLoc);
        if (afterLeftParse) {
          left2 = afterLeftParse.call(this, left2, startLoc);
        }
        return left2;
      }
    }
    let ownExpressionErrors;
    if (refExpressionErrors) {
      ownExpressionErrors = false;
    } else {
      refExpressionErrors = new ExpressionErrors();
      ownExpressionErrors = true;
    }
    this.state.canStartArrow = true;
    let left = this.parseMaybeConditional(refExpressionErrors);
    if (afterLeftParse) {
      left = afterLeftParse.call(this, left, startLoc);
    }
    if (tokenIsAssignment(this.state.type)) {
      const node = this.startNodeAt(startLoc);
      const operator = this.state.value;
      node.operator = operator;
      if (this.match(25)) {
        this.toAssignable(left, true);
        node.left = left;
        const startIndex = startLoc.index;
        if (refExpressionErrors.doubleProtoLoc != null && refExpressionErrors.doubleProtoLoc.index >= startIndex) {
          refExpressionErrors.doubleProtoLoc = null;
        }
        if (refExpressionErrors.shorthandAssignLoc != null && refExpressionErrors.shorthandAssignLoc.index >= startIndex) {
          refExpressionErrors.shorthandAssignLoc = null;
        }
        if (refExpressionErrors.privateKeyLoc != null && refExpressionErrors.privateKeyLoc.index >= startIndex) {
          this.checkDestructuringPrivate(refExpressionErrors);
          refExpressionErrors.privateKeyLoc = null;
        }
        if (refExpressionErrors.voidPatternLoc != null && refExpressionErrors.voidPatternLoc.index >= startIndex) {
          refExpressionErrors.voidPatternLoc = null;
        }
      } else {
        node.left = left;
      }
      this.next();
      node.right = this.parseMaybeAssign();
      this.checkLVal(left, this.finishNode(node, "AssignmentExpression"), void 0, void 0, void 0, void 0, operator === "||=" || operator === "&&=" || operator === "??=");
      return node;
    } else if (ownExpressionErrors) {
      this.checkExpressionErrors(refExpressionErrors, true);
    }
    if (isYield) {
      const {
        type
      } = this.state;
      const startsExpr2 = this.hasPlugin("v8intrinsic") ? tokenCanStartExpression(type) : tokenCanStartExpression(type) && !this.match(50);
      if (startsExpr2 && !this.isAmbiguousPrefixOrIdentifier()) {
        this.raiseOverwrite(Errors.YieldNotInGeneratorFunction, startLoc);
        return this.parseYield(startLoc);
      }
    }
    return left;
  }
  parseMaybeConditional(refExpressionErrors) {
    const startLoc = this.state.startLoc;
    const expr = this.parseExprOps(refExpressionErrors);
    if (this.shouldExitDescending(expr)) {
      return expr;
    }
    return this.parseConditional(expr, startLoc, refExpressionErrors);
  }
  parseConditional(expr, startLoc, refExpressionErrors) {
    if (this.eat(13)) {
      const node = this.startNodeAt(startLoc);
      node.test = expr;
      node.consequent = this.parseMaybeAssignAllowIn();
      this.expect(10);
      node.alternate = this.parseMaybeAssign();
      return this.finishNode(node, "ConditionalExpression");
    }
    return expr;
  }
  parseMaybeUnaryOrPrivate(refExpressionErrors) {
    return this.match(134) ? this.parsePrivateName() : this.parseMaybeUnary(refExpressionErrors);
  }
  parseExprOps(refExpressionErrors) {
    const startLoc = this.state.startLoc;
    const expr = this.parseMaybeUnaryOrPrivate(refExpressionErrors);
    if (this.shouldExitDescending(expr)) {
      return expr;
    }
    this.state.canStartArrow = false;
    return this.parseExprOp(expr, startLoc, -1);
  }
  parseExprOp(left, leftStartLoc, minPrec) {
    if (this.isPrivateName(left)) {
      const value = this.getPrivateNameSV(left);
      if (minPrec >= tokenOperatorPrecedence(54) || !this.prodParam.hasIn || !this.match(54)) {
        this.raise(Errors.PrivateInExpectedIn, leftStartLoc, {
          identifierName: value
        });
      }
      this.classScope.usePrivateName(value, leftStartLoc);
    }
    const op = this.state.type;
    if (tokenIsOperator(op) && (this.prodParam.hasIn || !this.match(54))) {
      let prec = tokenOperatorPrecedence(op);
      if (prec > minPrec) {
        if (op === 35) {
          this.expectPlugin("pipelineOperator");
          if (this.prodParam.inFSharpPipelineDirectBody) {
            return left;
          }
        }
        const node = this.startNodeAt(leftStartLoc);
        node.left = left;
        node.operator = this.state.value;
        const logical = op === 37 || op === 38;
        const coalesce = op === 36;
        if (coalesce) {
          prec = tokenOperatorPrecedence(38);
        }
        this.next();
        node.right = this.parseExprOpRightExpr(op, prec);
        const finishedNode = this.finishNode(node, logical || coalesce ? "LogicalExpression" : "BinaryExpression");
        const nextOp = this.state.type;
        if (coalesce && (nextOp === 37 || nextOp === 38) || logical && nextOp === 36) {
          throw this.raise(Errors.MixingCoalesceWithLogical, this.state.startLoc);
        }
        return this.parseExprOp(finishedNode, leftStartLoc, minPrec);
      }
    }
    return left;
  }
  parseExprOpRightExpr(op, prec) {
    switch (op) {
      case 35:
        switch (this.getPluginOption("pipelineOperator", "proposal")) {
          case "hack":
            return this.withTopicBindingContext(() => {
              return this.parseHackPipeBody();
            });
          case "fsharp":
            return this.parseFSharpPipelineBody(prec);
        }
      default:
        return this.parseExprOpBaseRightExpr(op, prec);
    }
  }
  parseExprOpBaseRightExpr(op, prec) {
    const startLoc = this.state.startLoc;
    return this.parseExprOp(this.parseMaybeUnaryOrPrivate(), startLoc, tokenIsRightAssociative(op) ? prec - 1 : prec);
  }
  parseHackPipeBody() {
    const {
      startLoc
    } = this.state;
    const body = this.parseMaybeAssign();
    const requiredParentheses = UnparenthesizedPipeBodyDescriptions.has(body.type);
    if (requiredParentheses && !body.extra?.parenthesized) {
      this.raise(Errors.PipeUnparenthesizedBody, startLoc, {
        type: body.type
      });
    }
    if (!this.topicReferenceWasUsedInCurrentContext()) {
      this.raise(Errors.PipeTopicUnused, startLoc);
    }
    return body;
  }
  checkExponentialAfterUnary(node) {
    if (this.match(53)) {
      this.raise(Errors.UnexpectedTokenUnaryExponentiation, node.argument);
    }
  }
  parseMaybeUnary(refExpressionErrors, sawUnary) {
    const startLoc = this.state.startLoc;
    const isAwait = this.isContextual(92);
    if (isAwait && this.recordAwaitIfAllowed()) {
      this.next();
      const expr2 = this.parseAwait(startLoc);
      if (!sawUnary) this.checkExponentialAfterUnary(expr2);
      return expr2;
    }
    const update = this.match(30);
    const node = this.startNode();
    if (tokenIsPrefix(this.state.type)) {
      node.operator = this.state.value;
      node.prefix = true;
      this.state.canStartArrow = false;
      if (this.match(68)) {
        this.expectPlugin("throwExpressions");
      }
      const isDelete = this.match(85);
      this.next();
      node.argument = this.parseMaybeUnary(null, true);
      this.checkExpressionErrors(refExpressionErrors, true);
      if (this.state.strict && isDelete) {
        const arg = node.argument;
        if (arg.type === "Identifier") {
          this.raise(Errors.StrictDelete, node);
        } else if (this.hasPropertyAsPrivateName(arg)) {
          this.raise(Errors.DeletePrivateField, node);
        }
      }
      if (!update) {
        if (!sawUnary) {
          this.checkExponentialAfterUnary(node);
        }
        return this.finishNode(node, "UnaryExpression");
      }
    }
    const expr = this.parseUpdate(node, update, refExpressionErrors);
    if (isAwait) {
      const {
        type
      } = this.state;
      const startsExpr2 = this.hasPlugin("v8intrinsic") ? tokenCanStartExpression(type) : tokenCanStartExpression(type) && !this.match(50);
      if (startsExpr2 && !this.isAmbiguousPrefixOrIdentifier()) {
        this.raiseOverwrite(Errors.AwaitNotInAsyncContext, startLoc);
        return this.parseAwait(startLoc);
      }
    }
    return expr;
  }
  parseUpdate(node, update, refExpressionErrors) {
    if (update) {
      const result = this.finishNode(node, "UpdateExpression");
      this.checkLVal(result.argument, result);
      return result;
    }
    const startLoc = this.state.startLoc;
    let expr = this.parseExprSubscripts(refExpressionErrors);
    if (this.checkExpressionErrors(refExpressionErrors, false)) return expr;
    while (tokenIsPostfix(this.state.type) && !this.canInsertSemicolon()) {
      const node2 = this.startNodeAt(startLoc);
      node2.operator = this.state.value;
      node2.prefix = false;
      node2.argument = expr;
      this.next();
      this.checkLVal(expr, expr = this.finishNode(node2, "UpdateExpression"));
    }
    return expr;
  }
  parseExprSubscripts(refExpressionErrors) {
    const startLoc = this.state.startLoc;
    this.setLoc(startLoc);
    const expr = this.parseExprAtom(refExpressionErrors);
    if (this.shouldExitDescending(expr)) {
      return expr;
    }
    return this.parseSubscripts(expr, startLoc);
  }
  parseSubscripts(base, startLoc, noCalls) {
    const state = {
      optionalChainMember: false,
      maybeAsyncArrow: this.atPossibleAsyncArrow(base),
      stop: false
    };
    do {
      base = this.parseSubscript(base, startLoc, noCalls, state);
      state.maybeAsyncArrow = false;
    } while (!state.stop);
    return base;
  }
  parseSubscript(base, startLoc, noCalls, state) {
    const {
      type
    } = this.state;
    if (!noCalls && type === 11) {
      return this.parseBind(base, startLoc, state);
    } else if (tokenIsTemplate(type)) {
      return this.parseTaggedTemplateExpression(base, startLoc, state);
    }
    let optional = false;
    if (type === 14) {
      if (noCalls) {
        this.raise(Errors.OptionalChainingNoNew, this.state.startLoc);
        if (this.lookaheadCharCode() === 40) {
          return this.stopParseSubscript(base, state);
        }
      }
      state.optionalChainMember = optional = true;
      this.next();
    }
    if (!noCalls && this.match(6)) {
      return this.parseCoverCallAndAsyncArrowHead(base, startLoc, state, optional);
    } else {
      const computed = this.eat(0);
      if (computed || optional || this.eat(12)) {
        return this.parseMember(base, startLoc, state, computed, optional);
      } else {
        return this.stopParseSubscript(base, state);
      }
    }
  }
  stopParseSubscript(base, state) {
    state.stop = true;
    return base;
  }
  parseMember(base, startLoc, state, computed, optional) {
    const node = this.startNodeAt(startLoc);
    node.object = base;
    node.computed = computed;
    if (computed) {
      node.property = this.parseExpression();
      this.expect(1);
    } else if (this.match(134)) {
      if (base.type === "Super") {
        this.raise(Errors.SuperPrivateField, startLoc);
      }
      this.classScope.usePrivateName(this.state.value, this.state.startLoc);
      node.property = this.parsePrivateName();
    } else {
      node.property = this.parseIdentifier(true);
    }
    if (state.optionalChainMember) {
      node.optional = optional;
      return this.finishNode(node, "OptionalMemberExpression");
    } else {
      return this.finishNode(node, "MemberExpression");
    }
  }
  parseBind(base, startLoc, state) {
    const node = this.startNodeAt(startLoc);
    node.object = base;
    this.next();
    const isImport = this.match(79);
    const callee = this.parseNoCallExpr();
    if (callee.type === "Super" || isImport && callee.type === "ImportExpression" || callee.type === "Import") {
      throw this.raise(Errors.UnsupportedBindRHS, callee);
    }
    node.callee = callee;
    state.stop = true;
    return this.parseSubscripts(this.finishNode(node, "BindExpression"), startLoc, false);
  }
  parseCoverCallAndAsyncArrowHead(base, startLoc, state, optional) {
    let refExpressionErrors = null;
    this.next();
    const node = this.startNodeAt(startLoc);
    node.callee = base;
    const {
      maybeAsyncArrow,
      optionalChainMember
    } = state;
    if (maybeAsyncArrow) {
      this.expressionScope.enter(newAsyncArrowScope());
      refExpressionErrors = new ExpressionErrors();
    }
    if (optionalChainMember) {
      node.optional = optional;
    }
    if (optional) {
      node.arguments = this.parseCallExpressionArguments();
    } else {
      node.arguments = this.parseCallExpressionArguments(base.type !== "Super", node, refExpressionErrors);
    }
    let finishedNode = this.finishCallExpression(node, optionalChainMember);
    if (maybeAsyncArrow && this.shouldParseAsyncArrow() && !optional) {
      state.stop = true;
      this.checkDestructuringPrivate(refExpressionErrors);
      this.expressionScope.validateAsPattern();
      this.expressionScope.exit();
      finishedNode = this.parseAsyncArrowFromCallExpression(this.startNodeAt(startLoc), finishedNode);
    } else {
      if (maybeAsyncArrow) {
        this.checkExpressionErrors(refExpressionErrors, true);
        this.expressionScope.exit();
      }
      this.toReferencedList(node.arguments);
    }
    return finishedNode;
  }
  parseTaggedTemplateExpression(base, startLoc, state) {
    const node = this.startNodeAt(startLoc);
    node.tag = base;
    node.quasi = this.parseTemplate(true);
    if (state.optionalChainMember) {
      this.raise(Errors.OptionalChainingNoTemplate, startLoc);
    }
    return this.finishNode(node, "TaggedTemplateExpression");
  }
  atPossibleAsyncArrow(base) {
    return base.type === "Identifier" && base.name === "async" && this.state.lastTokEndLoc.index === base.end && !this.canInsertSemicolon() && base.end - base.start === 5 && this.state.canStartArrow;
  }
  finishCallExpression(node, optional) {
    if (node.callee.type === "Import") {
      if (node.arguments.length === 0 || node.arguments.length > 2) {
        this.raise(Errors.ImportCallArity, node);
      } else {
        for (const arg of node.arguments) {
          if (arg.type === "SpreadElement") {
            this.raise(Errors.ImportCallSpreadArgument, arg);
          }
        }
      }
    }
    return this.finishNode(node, optional ? "OptionalCallExpression" : "CallExpression");
  }
  parseCallExpressionArguments(allowPlaceholder, nodeForExtra, refExpressionErrors) {
    const elts = [];
    let first = true;
    while (!this.eat(7)) {
      if (first) {
        first = false;
      } else {
        this.expect(8);
        if (this.match(7)) {
          if (nodeForExtra) {
            this.addTrailingCommaExtraToNode(nodeForExtra);
          }
          this.next();
          break;
        }
      }
      elts.push(this.parseExprListItem(7, false, refExpressionErrors, allowPlaceholder));
    }
    return elts;
  }
  shouldParseAsyncArrow() {
    return this.match(15) && !this.canInsertSemicolon();
  }
  parseAsyncArrowFromCallExpression(node, call) {
    this.resetPreviousNodeTrailingComments(call);
    this.expect(15);
    this.parseArrowExpression(node, call.arguments, true, call.extra?.trailingCommaLoc);
    if (call.innerComments) {
      setInnerComments(node, call.innerComments);
    }
    if (call.callee.trailingComments) {
      setInnerComments(node, call.callee.trailingComments);
    }
    return node;
  }
  parseNoCallExpr() {
    const startLoc = this.state.startLoc;
    return this.parseSubscripts(this.parseExprAtom(), startLoc, true);
  }
  parseExprAtom(refExpressionErrors) {
    let node;
    let decorators = null;
    const {
      type
    } = this.state;
    switch (type) {
      case 75:
        return this.parseSuper();
      case 79:
        node = this.startNode();
        this.next();
        if (this.match(12)) {
          return this.parseImportMetaPropertyOrPhaseCall(node);
        }
        if (this.match(6)) {
          if (this.optionFlags & 1024) {
            return this.parseImportCall(node);
          } else {
            return this.finishNode(node, "Import");
          }
        } else {
          this.raise(Errors.UnsupportedImport, this.state.lastTokStartLoc);
          return this.finishNode(node, "Import");
        }
      case 74:
        node = this.startNode();
        this.next();
        return this.finishNode(node, "ThisExpression");
      case 86: {
        return this.parseDo(this.startNode(), false);
      }
      case 52:
      case 27: {
        this.readRegexp();
        return this.parseRegExpLiteral(this.state.value);
      }
      case 131:
        return this.parseNumericLiteral(this.state.value);
      case 132:
        return this.parseBigIntLiteral(this.state.value);
      case 130:
        return this.parseStringLiteral(this.state.value);
      case 80:
        return this.parseNullLiteral();
      case 81:
        return this.parseBooleanLiteral(true);
      case 82:
        return this.parseBooleanLiteral(false);
      case 6: {
        return this.parseParenAndDistinguishExpression(this.state.canStartArrow);
      }
      case 0: {
        return this.parseArrayLike(1, refExpressionErrors);
      }
      case 2: {
        return this.parseObjectLike(4, false, refExpressionErrors);
      }
      case 64:
        return this.parseFunctionOrFunctionSent();
      case 22:
        decorators = this.parseDecorators();
      case 76:
        return this.parseClass(this.maybeTakeDecorators(decorators, this.startNode()), false);
      case 73:
        return this.parseNewOrNewTarget();
      case 21:
      case 20:
        return this.parseTemplate(false);
      case 11: {
        node = this.startNode();
        this.next();
        node.object = null;
        const callee = node.callee = this.parseNoCallExpr();
        if (callee.type === "MemberExpression") {
          return this.finishNode(node, "BindExpression");
        } else {
          throw this.raise(Errors.UnsupportedBind, callee);
        }
      }
      case 134: {
        this.raise(Errors.PrivateInExpectedIn, this.state.startLoc, {
          identifierName: this.state.value
        });
        return this.parsePrivateName();
      }
      case 29: {
        return this.parseTopicReferenceThenEqualsSign(50, "%");
      }
      case 28: {
        return this.parseTopicReferenceThenEqualsSign(40, "^");
      }
      case 33:
      case 34: {
        return this.parseTopicReference("hack");
      }
      case 40:
      case 50:
      case 23: {
        const pipeProposal = this.getPluginOption("pipelineOperator", "proposal");
        if (pipeProposal) {
          return this.parseTopicReference(pipeProposal);
        }
        throw this.unexpected();
      }
      case 43: {
        const lookaheadCh = this.input.codePointAt(this.nextTokenStart());
        if (isIdentifierStart(lookaheadCh) || lookaheadCh === 62) {
          throw this.expectOnePlugin(["jsx", "flow", "typescript"]);
        }
        throw this.unexpected();
      }
      default:
        if (tokenIsIdentifier(type)) {
          if (this.isContextual(123) && this.lookaheadInLineCharCode() === 123) {
            return this.parseModuleExpression();
          }
          const {
            canStartArrow,
            containsEsc
          } = this.state;
          const id = this.parseIdentifier();
          if (!containsEsc && id.name === "async" && !this.canInsertSemicolon()) {
            const {
              type: type2
            } = this.state;
            if (type2 === 64) {
              this.resetPreviousNodeTrailingComments(id);
              this.next();
              return this.parseAsyncFunctionExpression(this.startNodeAtNode(id));
            } else if (tokenIsIdentifier(type2)) {
              if (canStartArrow && this.lookaheadCharCode() === 61) {
                return this.parseAsyncArrowUnaryFunction(this.startNodeAtNode(id));
              } else {
                return id;
              }
            } else if (type2 === 86) {
              this.resetPreviousNodeTrailingComments(id);
              return this.parseDo(this.startNodeAtNode(id), true);
            }
          }
          if (canStartArrow && this.match(15) && !this.canInsertSemicolon()) {
            this.next();
            return this.parseArrowExpression(this.startNodeAtNode(id), [id], false);
          }
          return id;
        } else {
          throw this.unexpected();
        }
    }
  }
  parseTopicReferenceThenEqualsSign(topicTokenType, topicTokenValue) {
    const pipeProposal = this.getPluginOption("pipelineOperator", "proposal");
    if (pipeProposal) {
      this.state.type = topicTokenType;
      this.state.value = topicTokenValue;
      this.state.pos--;
      this.state.end--;
      this.state.endLoc = createPositionWithColumnOffset(this.state.endLoc, -1);
      return this.parseTopicReference(pipeProposal);
    }
    throw this.unexpected();
  }
  parseTopicReference(pipeProposal) {
    const node = this.startNode();
    const startLoc = this.state.startLoc;
    const tokenType = this.state.type;
    this.next();
    return this.finishTopicReference(node, startLoc, pipeProposal, tokenType);
  }
  finishTopicReference(node, startLoc, pipeProposal, tokenType) {
    if (this.testTopicReferenceConfiguration(pipeProposal, startLoc, tokenType)) {
      if (!this.topicReferenceIsAllowedInCurrentContext()) {
        this.raise(Errors.PipeTopicUnbound, startLoc);
      }
      this.registerTopicReference();
      return this.finishNode(node, "TopicReference");
    } else {
      throw this.raise(Errors.PipeTopicUnconfiguredToken, startLoc, {
        token: tokenLabelName(tokenType)
      });
    }
  }
  testTopicReferenceConfiguration(pipeProposal, startLoc, tokenType) {
    switch (pipeProposal) {
      case "hack": {
        return this.hasPlugin(["pipelineOperator", {
          topicToken: tokenLabelName(tokenType)
        }]);
      }
      default:
        throw this.raise(Errors.PipeTopicRequiresHackPipes, startLoc);
    }
  }
  parseAsyncArrowUnaryFunction(node) {
    this.prodParam.enter(functionFlags(true, this.prodParam.hasYield));
    const params = [this.parseIdentifier()];
    this.prodParam.exit();
    if (this.hasPrecedingLineBreak()) {
      this.raise(Errors.LineTerminatorBeforeArrow, this.state.curPosition());
    }
    this.expect(15);
    return this.parseArrowExpression(node, params, true);
  }
  parseDo(node, isAsync) {
    this.expectPlugin("doExpressions");
    if (isAsync) {
      this.expectPlugin("asyncDoExpressions");
    }
    node.async = isAsync;
    this.next();
    const oldLabels = this.state.labels;
    this.state.labels = [];
    if (isAsync) {
      this.prodParam.enter(2);
      node.body = this.parseBlock();
      this.prodParam.exit();
    } else {
      node.body = this.parseBlock();
    }
    this.state.labels = oldLabels;
    return this.finishNode(node, "DoExpression");
  }
  parseSuper() {
    const node = this.startNode();
    this.next();
    if (this.match(6) && !this.scope.allowDirectSuper) {
      this.raise(Errors.SuperNotAllowed, node);
    } else if (!this.scope.allowSuper) {
      this.raise(Errors.UnexpectedSuper, node);
    }
    if (!this.match(6) && !this.match(0) && !this.match(12)) {
      this.raise(Errors.UnsupportedSuper, node);
    }
    return this.finishNode(node, "Super");
  }
  parsePrivateName() {
    const node = this.startNode();
    const id = this.startNodeAt(createPositionWithColumnOffset(this.state.startLoc, 1));
    const name = this.state.value;
    this.next();
    node.id = this.createIdentifier(id, name);
    return this.finishNode(node, "PrivateName");
  }
  parseFunctionOrFunctionSent() {
    const node = this.startNode();
    this.next();
    if (this.prodParam.hasYield && this.match(12)) {
      const meta = this.createIdentifier(this.startNodeAtNode(node), "function");
      this.next();
      if (this.match(99)) {
        this.expectPlugin("functionSent");
      } else if (!this.hasPlugin("functionSent")) {
        this.unexpected();
      }
      return this.parseMetaProperty(node, meta, "sent");
    }
    return this.parseFunction(node);
  }
  parseMetaProperty(node, meta, propertyName) {
    node.meta = meta;
    const containsEsc = this.state.containsEsc;
    node.property = this.parseIdentifier(true);
    if (node.property.name !== propertyName || containsEsc) {
      this.raise(Errors.UnsupportedMetaProperty, node.property, {
        target: meta.name,
        onlyValidPropertyName: propertyName
      });
    }
    return this.finishNode(node, "MetaProperty");
  }
  parseImportMetaPropertyOrPhaseCall(node) {
    this.next();
    if (this.isContextual(101) || this.isContextual(93)) {
      const isSource = this.isContextual(101);
      this.expectPlugin(isSource ? "sourcePhaseImports" : "deferredImportEvaluation");
      this.next();
      node.phase = isSource ? "source" : "defer";
      return this.parseImportCall(node);
    } else {
      const id = this.createIdentifierAt(this.startNodeAtNode(node), "import", this.state.lastTokStartLoc);
      if (this.isContextual(97)) {
        if (!this.inModule) {
          this.raise(Errors.ImportMetaOutsideModule, id);
        }
        this.sawUnambiguousESM = true;
      }
      return this.parseMetaProperty(node, id, "meta");
    }
  }
  parseLiteralAtNode(value, type, node) {
    this.addExtra(node, "rawValue", value);
    this.addExtra(node, "raw", this.input.slice(this.offsetToSourcePos(node.start), this.state.end));
    node.value = value;
    this.next();
    return this.finishNode(node, type);
  }
  parseLiteral(value, type) {
    const node = this.startNode();
    return this.parseLiteralAtNode(value, type, node);
  }
  parseStringLiteral(value) {
    return this.parseLiteral(value, "StringLiteral");
  }
  parseNumericLiteral(value) {
    return this.parseLiteral(value, "NumericLiteral");
  }
  parseBigIntLiteral(value) {
    let bigInt;
    try {
      bigInt = BigInt(value);
    } catch {
      bigInt = null;
    }
    const node = this.parseLiteral(bigInt, "BigIntLiteral");
    return node;
  }
  parseRegExpLiteral(value) {
    const node = this.startNode();
    this.addExtra(node, "raw", this.input.slice(this.offsetToSourcePos(node.start), this.state.end));
    node.pattern = value.pattern;
    node.flags = value.flags;
    this.next();
    return this.finishNode(node, "RegExpLiteral");
  }
  parseBooleanLiteral(value) {
    const node = this.startNode();
    node.value = value;
    this.next();
    return this.finishNode(node, "BooleanLiteral");
  }
  parseNullLiteral() {
    const node = this.startNode();
    this.next();
    return this.finishNode(node, "NullLiteral");
  }
  parseParenAndDistinguishExpression(canStartArrow) {
    const startLoc = this.state.startLoc;
    let val;
    this.next();
    this.expressionScope.enter(newArrowHeadScope());
    const innerStartLoc = this.state.startLoc;
    const exprList = [];
    const refExpressionErrors = new ExpressionErrors();
    let first = true;
    let spreadStartLoc;
    let optionalCommaStartLoc;
    while (!this.match(7)) {
      if (first) {
        first = false;
      } else {
        this.expect(8, refExpressionErrors.optionalParametersLoc === null ? null : refExpressionErrors.optionalParametersLoc);
        if (this.match(7)) {
          optionalCommaStartLoc = this.state.startLoc;
          break;
        }
      }
      if (this.match(17)) {
        const spreadNodeStartLoc = this.state.startLoc;
        spreadStartLoc = this.state.startLoc;
        exprList.push(this.parseParenItem(this.parseRestBinding(), spreadNodeStartLoc));
        if (!this.checkCommaAfterRest(41)) {
          break;
        }
      } else {
        exprList.push(this.parseMaybeAssignAllowInOrVoidPattern(7, refExpressionErrors, this.parseParenItem));
      }
    }
    const innerEndLoc = this.state.lastTokEndLoc;
    this.expect(7);
    let arrowNode = this.startNodeAt(startLoc);
    if (canStartArrow && this.shouldParseArrow(exprList) && (arrowNode = this.parseArrow(arrowNode))) {
      this.checkDestructuringPrivate(refExpressionErrors);
      this.expressionScope.validateAsPattern();
      this.expressionScope.exit();
      this.parseArrowExpression(arrowNode, exprList, false);
      return arrowNode;
    }
    this.expressionScope.exit();
    if (!exprList.length) {
      this.unexpected(this.state.lastTokStartLoc);
    }
    if (optionalCommaStartLoc) this.unexpected(optionalCommaStartLoc);
    if (spreadStartLoc) this.unexpected(spreadStartLoc);
    this.checkExpressionErrors(refExpressionErrors, true);
    this.toReferencedList(exprList, true);
    if (exprList.length > 1) {
      val = this.startNodeAt(innerStartLoc);
      val.expressions = exprList;
      this.finishNode(val, "SequenceExpression");
      this.resetEndLocation(val, innerEndLoc);
    } else {
      val = exprList[0];
    }
    return this.wrapParenthesis(startLoc, val);
  }
  wrapParenthesis(startLoc, expression) {
    if (!(this.optionFlags & 2048)) {
      this.addExtra(expression, "parenthesized", true);
      this.addExtra(expression, "parenStart", startLoc.index);
      this.takeSurroundingComments(expression, startLoc.index, this.state.lastTokEndLoc.index);
      return expression;
    }
    const parenExpression = this.startNodeAt(startLoc);
    parenExpression.expression = expression;
    return this.finishNode(parenExpression, "ParenthesizedExpression");
  }
  shouldParseArrow(params) {
    return !this.canInsertSemicolon();
  }
  parseArrow(node) {
    if (this.eat(15)) {
      return node;
    }
  }
  parseParenItem(node, startLoc) {
    return node;
  }
  parseNewOrNewTarget() {
    const node = this.startNode();
    this.next();
    if (this.match(12)) {
      const meta = this.createIdentifier(this.startNodeAtNode(node), "new");
      this.next();
      const metaProp = this.parseMetaProperty(node, meta, "target");
      if (!this.scope.allowNewTarget) {
        this.raise(Errors.UnexpectedNewTarget, metaProp);
      }
      return metaProp;
    }
    return this.parseNew(node);
  }
  parseNew(node) {
    this.parseNewCallee(node);
    if (this.eat(6)) {
      const args = this.parseExprList(7);
      this.toReferencedList(args);
      node.arguments = args;
    } else {
      node.arguments = [];
    }
    return this.finishNode(node, "NewExpression");
  }
  parseNewCallee(node) {
    const isImport = this.match(79);
    const callee = this.parseNoCallExpr();
    node.callee = callee;
    if (isImport && callee.type === "ImportExpression") {
      this.raise(Errors.ImportCallNotNewExpression, callee, callee);
    }
    if (callee.type === "Import") {
      this.raise(Errors.ImportCallNotNewExpression, callee);
    }
    if (callee.type === "Super") {
      this.raise(Errors.SuperCallNotNewExpression, callee);
    }
  }
  parseTemplateElement(isTagged) {
    const {
      start,
      startLoc,
      end,
      value
    } = this.state;
    const elemStart = start + 1;
    const elem = this.startNodeAt(createPositionWithColumnOffset(startLoc, 1));
    if (value === null) {
      if (!isTagged) {
        this.raise(Errors.InvalidEscapeSequenceTemplate, createPositionWithColumnOffset(this.state.firstInvalidTemplateEscapePos, 1));
      }
    }
    const isTail = this.match(20);
    const endOffset = isTail ? -1 : -2;
    const elemEnd = end + endOffset;
    elem.value = {
      raw: this.input.slice(elemStart, elemEnd).replace(/\r\n?/g, "\n"),
      cooked: value === null ? null : value.slice(1, endOffset)
    };
    elem.tail = isTail;
    this.next();
    const finishedNode = this.finishNode(elem, "TemplateElement");
    this.resetEndLocation(finishedNode, createPositionWithColumnOffset(this.state.lastTokEndLoc, endOffset));
    return finishedNode;
  }
  parseTemplate(isTagged) {
    const node = this.startNode();
    let curElt = this.parseTemplateElement(isTagged);
    const quasis = [curElt];
    const substitutions = [];
    while (!curElt.tail) {
      substitutions.push(this.parseTemplateSubstitution());
      this.readTemplateContinuation();
      quasis.push(curElt = this.parseTemplateElement(isTagged));
    }
    node.expressions = substitutions;
    node.quasis = quasis;
    return this.finishNode(node, "TemplateLiteral");
  }
  parseTemplateSubstitution() {
    return this.parseExpression();
  }
  parseObjectLike(close, isPattern, refExpressionErrors) {
    let sawProto = false;
    let first = true;
    const node = this.startNode();
    node.properties = [];
    this.next();
    while (!this.match(close)) {
      if (first) {
        first = false;
      } else {
        this.expect(8);
        if (this.match(close)) {
          this.addTrailingCommaExtraToNode(node);
          break;
        }
      }
      let prop;
      if (isPattern) {
        prop = this.parseBindingProperty();
      } else {
        prop = this.parsePropertyDefinition(refExpressionErrors);
        sawProto = this.checkProto(prop, sawProto, refExpressionErrors);
      }
      node.properties.push(prop);
    }
    this.next();
    const type = isPattern ? "ObjectPattern" : "ObjectExpression";
    return this.finishNode(node, type);
  }
  addTrailingCommaExtraToNode(node) {
    this.addExtra(node, "trailingComma", this.state.lastTokStartLoc.index);
    this.addExtra(node, "trailingCommaLoc", this.state.lastTokStartLoc, false);
  }
  maybeAsyncOrAccessorProp(prop) {
    return !prop.computed && prop.key.type === "Identifier" && (this.isLiteralPropertyName() || this.match(0) || this.match(51));
  }
  parsePropertyDefinition(refExpressionErrors) {
    const decorators = [];
    if (this.match(22)) {
      if (this.hasPlugin("decorators")) {
        this.raise(Errors.UnsupportedPropertyDecorator, this.state.startLoc);
      }
      while (this.match(22)) {
        decorators.push(this.parseDecorator());
      }
    }
    const prop = this.startNode();
    let isAsync = false;
    let isAccessor = false;
    let startLoc;
    if (this.match(17)) {
      if (decorators.length) this.unexpected();
      return this.parseSpread();
    }
    if (decorators.length) {
      prop.decorators = decorators;
    }
    prop.method = false;
    if (refExpressionErrors) {
      startLoc = this.state.startLoc;
    }
    let isGenerator = this.eat(51);
    this.parsePropertyNamePrefixOperator(prop);
    const containsEsc = this.state.containsEsc;
    this.parsePropertyName(prop, refExpressionErrors);
    if (!isGenerator && !containsEsc && this.maybeAsyncOrAccessorProp(prop)) {
      const {
        key
      } = prop;
      const keyName = key.name;
      if (keyName === "async" && !this.hasPrecedingLineBreak()) {
        isAsync = true;
        this.resetPreviousNodeTrailingComments(key);
        isGenerator = this.eat(51);
        this.parsePropertyName(prop);
      }
      if (keyName === "get" || keyName === "set") {
        isAccessor = true;
        this.resetPreviousNodeTrailingComments(key);
        prop.kind = keyName;
        if (this.match(51)) {
          isGenerator = true;
          this.raise(Errors.AccessorIsGenerator, this.state.curPosition(), {
            kind: keyName
          });
          this.next();
        }
        this.parsePropertyName(prop);
      }
    }
    return this.parseObjPropValue(prop, startLoc, isGenerator, isAsync, false, isAccessor, refExpressionErrors);
  }
  getGetterSetterExpectedParamCount(method) {
    return method.kind === "get" ? 0 : 1;
  }
  getObjectOrClassMethodParams(method) {
    return method.params;
  }
  checkGetterSetterParams(method) {
    const paramCount = this.getGetterSetterExpectedParamCount(method);
    const params = this.getObjectOrClassMethodParams(method);
    if (params.length !== paramCount) {
      this.raise(method.kind === "get" ? Errors.BadGetterArity : Errors.BadSetterArity, method);
    }
    if (method.kind === "set" && params[params.length - 1]?.type === "RestElement") {
      this.raise(Errors.BadSetterRestParameter, method);
    }
  }
  parseObjectMethod(prop, isGenerator, isAsync, isPattern, isAccessor) {
    if (isAccessor) {
      const finishedProp = this.parseMethod(prop, isGenerator, false, false, false, "ObjectMethod");
      this.checkGetterSetterParams(finishedProp);
      return finishedProp;
    }
    if (isAsync || isGenerator || this.match(6)) {
      if (isPattern) this.unexpected();
      prop.kind = "method";
      prop.method = true;
      return this.parseMethod(prop, isGenerator, isAsync, false, false, "ObjectMethod");
    }
  }
  parseObjectProperty(prop, startLoc, isPattern, refExpressionErrors) {
    prop.shorthand = false;
    if (this.eat(10)) {
      prop.value = isPattern ? this.parseMaybeDefault(this.state.startLoc) : this.parseMaybeAssignAllowInOrVoidPattern(4, refExpressionErrors);
      return this.finishObjectProperty(prop);
    }
    if (!prop.computed && prop.key.type === "Identifier") {
      this.checkReservedWord(prop.key.name, prop.key.start, true, false);
      if (isPattern) {
        prop.value = this.parseMaybeDefault(startLoc, this.cloneIdentifier(prop.key));
      } else if (this.match(25)) {
        const shorthandAssignLoc = this.state.startLoc;
        if (refExpressionErrors != null) {
          if (refExpressionErrors.shorthandAssignLoc === null) {
            refExpressionErrors.shorthandAssignLoc = shorthandAssignLoc;
          }
        } else {
          this.raise(Errors.InvalidCoverInitializedName, shorthandAssignLoc);
        }
        prop.value = this.parseMaybeDefault(startLoc, this.cloneIdentifier(prop.key));
      } else {
        prop.value = this.cloneIdentifier(prop.key);
      }
      prop.shorthand = true;
      return this.finishObjectProperty(prop);
    }
  }
  finishObjectProperty(node) {
    return this.finishNode(node, "ObjectProperty");
  }
  parseObjPropValue(prop, startLoc, isGenerator, isAsync, isPattern, isAccessor, refExpressionErrors) {
    const node = this.parseObjectMethod(prop, isGenerator, isAsync, isPattern, isAccessor) || this.parseObjectProperty(prop, startLoc, isPattern, refExpressionErrors);
    if (!node) this.unexpected();
    return node;
  }
  parsePropertyName(prop, refExpressionErrors) {
    if (this.eat(0)) {
      prop.computed = true;
      prop.key = this.parseMaybeAssignAllowIn();
      this.expect(1);
    } else {
      const {
        type,
        value
      } = this.state;
      let key;
      if (tokenIsKeywordOrIdentifier(type)) {
        key = this.parseIdentifier(true);
      } else {
        switch (type) {
          case 131:
            key = this.parseNumericLiteral(value);
            break;
          case 130:
            key = this.parseStringLiteral(value);
            break;
          case 132:
            key = this.parseBigIntLiteral(value);
            break;
          case 134: {
            const privateKeyLoc = this.state.startLoc;
            if (refExpressionErrors != null) {
              if (refExpressionErrors.privateKeyLoc === null) {
                refExpressionErrors.privateKeyLoc = privateKeyLoc;
              }
            } else {
              this.raise(Errors.UnexpectedPrivateField, privateKeyLoc);
            }
            key = this.parsePrivateName();
            break;
          }
          default:
            this.unexpected();
        }
      }
      prop.key = key;
      if (type !== 134) {
        prop.computed = false;
      }
    }
  }
  initFunction(node, isAsync) {
    node.id = null;
    node.generator = false;
    node.async = isAsync;
  }
  parseMethod(node, isGenerator, isAsync, isConstructor, allowDirectSuper, type, inClassScope = false) {
    this.initFunction(node, isAsync);
    node.generator = isGenerator;
    this.scope.enter(514 | 16 | (inClassScope ? 576 : 0) | (allowDirectSuper ? 32 : 0));
    this.prodParam.enter(functionFlags(isAsync, node.generator));
    this.parseFunctionParams(node, isConstructor);
    const finishedNode = this.parseFunctionBodyAndFinish(node, type, true);
    this.prodParam.exit();
    this.scope.exit();
    return finishedNode;
  }
  parseArrayLike(close, refExpressionErrors) {
    const node = this.startNode();
    this.next();
    node.elements = this.parseExprList(close, true, refExpressionErrors, node);
    return this.finishNode(node, "ArrayExpression");
  }
  parseArrowExpression(node, params, isAsync, trailingCommaLoc) {
    this.scope.enter(514 | 4);
    let flags = functionFlags(isAsync, false);
    if (!this.match(2)) {
      flags |= this.prodParam.currentFlags() & (8 | 16);
    }
    this.prodParam.enter(flags);
    this.initFunction(node, isAsync);
    if (params) {
      this.setArrowFunctionParameters(node, params, trailingCommaLoc);
    }
    this.parseFunctionBody(node, true);
    this.prodParam.exit();
    this.scope.exit();
    return this.finishNode(node, "ArrowFunctionExpression");
  }
  setArrowFunctionParameters(node, params, trailingCommaLoc) {
    this.toAssignableList(params, trailingCommaLoc, false);
    node.params = params;
  }
  parseFunctionBodyAndFinish(node, type, isMethod = false) {
    this.parseFunctionBody(node, false, isMethod);
    return this.finishNode(node, type);
  }
  parseFunctionBody(node, allowExpression, isMethod = false) {
    const isExpression = allowExpression && !this.match(2);
    this.expressionScope.enter(newExpressionScope());
    if (isExpression) {
      node.body = this.parseMaybeAssign();
      this.checkParams(node, false, allowExpression, false);
    } else {
      const oldStrict = this.state.strict;
      const oldLabels = this.state.labels;
      this.state.labels = [];
      this.prodParam.enter(this.prodParam.currentFlags() | 4);
      node.body = this.parseBlock(true, false, (hasStrictModeDirective) => {
        const nonSimple = !this.isSimpleParamList(node.params);
        if (hasStrictModeDirective && nonSimple) {
          this.raise(Errors.IllegalLanguageModeDirective, (node.kind === "method" || node.kind === "constructor") && !!node.key ? this.optionFlags & 256 ? node.key.loc.end : node.key : node);
        }
        const strictModeChanged = !oldStrict && this.state.strict;
        this.checkParams(node, !this.state.strict && !allowExpression && !isMethod && !nonSimple, allowExpression, strictModeChanged);
        if (this.state.strict && node.id) {
          this.checkIdentifier(node.id, 65, strictModeChanged);
        }
      });
      this.prodParam.exit();
      this.state.labels = oldLabels;
    }
    this.expressionScope.exit();
  }
  isSimpleParameter(node) {
    return node.type === "Identifier";
  }
  isSimpleParamList(params) {
    for (let i = 0, len = params.length; i < len; i++) {
      if (!this.isSimpleParameter(params[i])) return false;
    }
    return true;
  }
  checkParams(node, allowDuplicates, isArrowFunction, strictModeChanged = true) {
    const checkClashes = !allowDuplicates && /* @__PURE__ */ new Set();
    const formalParameters = {
      type: "FormalParameters"
    };
    for (const param of node.params) {
      this.checkLVal(param, formalParameters, 5, checkClashes, strictModeChanged);
    }
  }
  parseExprList(close, allowEmpty, refExpressionErrors, nodeForExtra) {
    const elts = [];
    let first = true;
    while (!this.eat(close)) {
      if (first) {
        first = false;
      } else {
        this.expect(8);
        if (this.match(close)) {
          if (nodeForExtra) {
            this.addTrailingCommaExtraToNode(nodeForExtra);
          }
          this.next();
          break;
        }
      }
      elts.push(this.parseExprListItem(close, allowEmpty, refExpressionErrors));
    }
    return elts;
  }
  parseExprListItem(close, allowEmpty, refExpressionErrors, allowPlaceholder) {
    let elt;
    if (this.match(8)) {
      if (!allowEmpty) {
        this.raise(Errors.UnexpectedToken, this.state.curPosition(), {
          unexpected: ","
        });
      }
      elt = null;
    } else if (this.match(17)) {
      const spreadNodeStartLoc = this.state.startLoc;
      elt = this.parseParenItem(this.parseSpread(refExpressionErrors), spreadNodeStartLoc);
    } else if (this.match(13)) {
      this.expectPlugin("partialApplication");
      if (!allowPlaceholder) {
        this.raise(Errors.UnexpectedArgumentPlaceholder, this.state.startLoc);
      }
      const node = this.startNode();
      this.next();
      elt = this.finishNode(node, "ArgumentPlaceholder");
    } else {
      elt = this.parseMaybeAssignAllowInOrVoidPattern(close, refExpressionErrors, this.parseParenItem);
    }
    return elt;
  }
  parseIdentifier(liberal) {
    const node = this.startNode();
    const name = this.parseIdentifierName(liberal);
    return this.createIdentifier(node, name);
  }
  createIdentifier(node, name) {
    node.name = name;
    if (this.optionFlags & 256) {
      node.loc.identifierName = name;
    }
    return this.finishNode(node, "Identifier");
  }
  createIdentifierAt(node, name, endLoc) {
    node.name = name;
    if (this.optionFlags & 256) {
      node.loc.identifierName = name;
    }
    return this.finishNodeAt(node, "Identifier", endLoc);
  }
  parseIdentifierName(liberal) {
    let name;
    const {
      start,
      type
    } = this.state;
    if (tokenIsKeywordOrIdentifier(type)) {
      name = this.state.value;
    } else {
      this.unexpected();
    }
    const tokenIsKeyword2 = tokenKeywordOrIdentifierIsKeyword(type);
    if (liberal) {
      if (tokenIsKeyword2) {
        this.replaceToken(128);
      }
    } else {
      this.checkReservedWord(name, this.sourceToOffsetPos(start), tokenIsKeyword2, false);
    }
    this.next();
    return name;
  }
  checkReservedWord(word, startLoc, checkKeywords, isBinding) {
    if (word.length > 10) {
      return;
    }
    if (!canBeReservedWord(word)) {
      return;
    }
    if (checkKeywords && isKeyword(word)) {
      this.raise(Errors.UnexpectedKeyword, startLoc, {
        keyword: word
      });
      return;
    }
    const reservedTest = !this.state.strict ? isReservedWord : isBinding ? isStrictBindReservedWord : isStrictReservedWord;
    if (reservedTest(word, this.inModule)) {
      this.raise(Errors.UnexpectedReservedWord, startLoc, {
        reservedWord: word
      });
      return;
    } else if (word === "yield") {
      if (this.prodParam.hasYield) {
        this.raise(Errors.YieldBindingIdentifier, startLoc);
        return;
      }
    } else if (word === "await") {
      if (this.prodParam.hasAwait) {
        this.raise(Errors.AwaitBindingIdentifier, startLoc);
        return;
      }
      if (this.scope.inStaticBlock) {
        this.raise(Errors.AwaitBindingIdentifierInStaticBlock, startLoc);
        return;
      }
      this.expressionScope.recordAsyncArrowParametersError(startLoc);
    } else if (word === "arguments") {
      if (this.scope.inClassAndNotInNonArrowFunction) {
        this.raise(Errors.ArgumentsInClass, startLoc);
        return;
      }
    }
  }
  recordAwaitIfAllowed() {
    const isAwaitAllowed = this.prodParam.hasAwait;
    if (isAwaitAllowed && !this.scope.inFunction) {
      this.state.hasTopLevelAwait = true;
    }
    return isAwaitAllowed;
  }
  parseAwait(startLoc, soloAwait) {
    const startIndex = startLoc.index;
    this.setLoc(startLoc);
    const node = this.startNodeAt(startLoc);
    this.expressionScope.recordParameterInitializerError(Errors.AwaitExpressionFormalParameter, startIndex);
    if (this.eat(51)) {
      this.raise(Errors.ObsoleteAwaitStar, startLoc);
    }
    if (!this.scope.inFunction && !(this.optionFlags & 1)) {
      if (this.isAmbiguousPrefixOrIdentifier()) {
        this.ambiguousScriptDifferentAst = true;
      } else {
        this.sawUnambiguousESM = true;
      }
    }
    if (!soloAwait) {
      node.argument = this.parseMaybeUnary(null, true);
    }
    return this.finishNode(node, "AwaitExpression");
  }
  isAmbiguousPrefixOrIdentifier() {
    if (this.hasPrecedingLineBreak()) return true;
    const {
      type
    } = this.state;
    return type === 49 || type === 6 || type === 0 || tokenIsTemplate(type) || type === 98 && !this.state.containsEsc || type === 133 || type === 52 || this.hasPlugin("v8intrinsic") && type === 50;
  }
  parseYield(startLoc) {
    this.setLoc(startLoc);
    const node = this.startNodeAt(startLoc);
    this.expressionScope.recordParameterInitializerError(Errors.YieldInParameter, startLoc.index);
    let delegating = false;
    let argument = null;
    if (!this.hasPrecedingLineBreak()) {
      delegating = this.eat(51);
      switch (this.state.type) {
        case 9:
        case 135:
        case 4:
        case 7:
        case 1:
        case 5:
        case 10:
        case 8:
          if (!delegating) break;
        default:
          argument = this.parseMaybeAssign();
      }
    }
    node.delegate = delegating;
    node.argument = argument;
    return this.finishNode(node, "YieldExpression");
  }
  parseImportCall(node) {
    this.next();
    const args = this.parseCallExpressionArguments();
    if (args.length === 0 || args.length > 2) {
      this.raise(Errors.ImportCallArity, node, node);
    } else {
      for (const arg of args) {
        if (arg.type === "SpreadElement") {
          this.raise(Errors.ImportCallSpreadArgument, arg, node);
        }
      }
    }
    node.source = args[0];
    node.options = args[1] ?? null;
    return this.finishNode(node, "ImportExpression");
  }
  withTopicBindingContext(callback) {
    const oldInHackPipelineBody = this.state.inHackPipelineBody;
    this.state.inHackPipelineBody = true;
    const oldSeenTopicReference = this.state.seenTopicReference;
    this.state.seenTopicReference = false;
    try {
      return callback();
    } finally {
      this.state.inHackPipelineBody = oldInHackPipelineBody;
      this.state.seenTopicReference = oldSeenTopicReference;
    }
  }
  allowInAnd(callback) {
    const flags = this.prodParam.currentFlags();
    const prodParamToSet = (8 | 16) & ~flags;
    if (prodParamToSet) {
      this.prodParam.enter(flags | 8 | 16);
      try {
        return callback();
      } finally {
        this.prodParam.exit();
      }
    }
    return callback();
  }
  disallowInAnd(callback) {
    const flags = this.prodParam.currentFlags();
    const prodParamToClear = 8 & flags;
    const prodParamToSet = 16 & ~flags;
    if (prodParamToClear || prodParamToSet) {
      this.prodParam.enter(flags & -9 | 16);
      try {
        return callback();
      } finally {
        this.prodParam.exit();
      }
    }
    return callback();
  }
  registerTopicReference() {
    this.state.seenTopicReference = true;
  }
  topicReferenceIsAllowedInCurrentContext() {
    return this.state.inHackPipelineBody;
  }
  topicReferenceWasUsedInCurrentContext() {
    return this.state.seenTopicReference;
  }
  parseFSharpPipelineBody(prec) {
    const startLoc = this.state.startLoc;
    this.prodParam.enter(this.prodParam.currentFlags() & -17);
    let ret;
    if (this.isContextual(92) && this.recordAwaitIfAllowed()) {
      this.next();
      ret = this.parseAwait(startLoc, true);
      const nextOp = this.state.type;
      if (tokenIsOperator(nextOp) && nextOp !== 35 && (this.prodParam.hasIn || nextOp !== 54)) {
        this.raise(Errors.PipelineUnparenthesized, startLoc);
      }
    } else {
      this.state.canStartArrow = true;
      ret = this.parseExprOp(this.parseMaybeUnaryOrPrivate(), startLoc, prec);
    }
    this.prodParam.exit();
    return ret;
  }
  parseModuleExpression() {
    this.expectPlugin("moduleBlocks");
    const node = this.startNode();
    this.next();
    if (!this.match(2)) {
      this.unexpected(null, 2);
    }
    const program = this.startNodeAt(this.state.endLoc);
    this.next();
    const revertScopes = this.initializeScopes(true);
    this.enterInitialScopes();
    try {
      node.body = this.parseProgram(program, 4, "module");
    } finally {
      revertScopes();
    }
    return this.finishNode(node, "ModuleExpression");
  }
  parseVoidPattern(refExpressionErrors) {
    this.expectPlugin("discardBinding");
    const node = this.startNode();
    if (refExpressionErrors != null) {
      refExpressionErrors.voidPatternLoc = this.state.startLoc;
    }
    this.next();
    return this.finishNode(node, "VoidPattern");
  }
  parseMaybeAssignAllowInOrVoidPattern(close, refExpressionErrors, afterLeftParse) {
    if (refExpressionErrors != null && this.match(84)) {
      const nextCode = this.lookaheadCharCode();
      if (nextCode === 44 || nextCode === (close === 1 ? 93 : close === 4 ? 125 : 41) || nextCode === 61) {
        return this.parseMaybeDefault(this.state.startLoc, this.parseVoidPattern(refExpressionErrors));
      }
    }
    return this.parseMaybeAssignAllowIn(refExpressionErrors, afterLeftParse);
  }
  parsePropertyNamePrefixOperator(prop) {
  }
};
var loopLabel = {
  kind: 1
};
var switchLabel = {
  kind: 2
};
var loneSurrogate = /[\uD800-\uDFFF]/u;
var keywordRelationalOperator = /in(?:stanceof)?/y;
function createExportedTokens(tokens) {
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const {
      type
    } = token;
    if (typeof type === "number") {
      token.type = getExportedToken(type);
    }
  }
  return tokens;
}
var StatementParser = class extends ExpressionParser {
  parseTopLevel(file, program) {
    file.program = this.parseProgram(program, 135, this.options.sourceType === "module" ? "module" : "script");
    file.comments = this.comments;
    if (this.optionFlags & 512) {
      file.tokens = createExportedTokens(this.tokens);
    }
    return this.finishNode(file, "File");
  }
  parseProgram(program, end, sourceType) {
    program.sourceType = sourceType;
    program.interpreter = this.parseInterpreterDirective();
    this.parseBlockBody(program, true, true, end);
    if (this.inModule) {
      if (!(this.optionFlags & 64) && this.scope.undefinedExports.size > 0) {
        for (const [localName, at] of Array.from(this.scope.undefinedExports)) {
          this.raise(Errors.ModuleExportUndefined, at, {
            localName
          });
        }
      }
      this.addExtra(program, "topLevelAwait", this.state.hasTopLevelAwait);
    }
    let finishedProgram;
    if (end === 135) {
      finishedProgram = this.finishNode(program, "Program");
    } else {
      finishedProgram = this.finishNodeAt(program, "Program", createPositionWithColumnOffset(this.state.startLoc, -1));
    }
    return finishedProgram;
  }
  stmtToDirective(stmt) {
    const directive = this.castNodeTo(stmt, "Directive");
    const directiveLiteral = this.castNodeTo(stmt.expression, "DirectiveLiteral");
    const expressionValue = directiveLiteral.value;
    const raw = this.input.slice(this.offsetToSourcePos(directiveLiteral.start), this.offsetToSourcePos(directiveLiteral.end));
    const val = directiveLiteral.value = raw.slice(1, -1);
    this.addExtra(directiveLiteral, "raw", raw);
    this.addExtra(directiveLiteral, "rawValue", val);
    this.addExtra(directiveLiteral, "expressionValue", expressionValue);
    directive.value = directiveLiteral;
    delete stmt.expression;
    return directive;
  }
  parseInterpreterDirective() {
    if (!this.match(24)) {
      return null;
    }
    const node = this.startNode();
    node.value = this.state.value;
    this.next();
    return this.finishNode(node, "InterpreterDirective");
  }
  isLet() {
    if (!this.isContextual(96)) {
      return false;
    }
    return this.hasFollowingBindingAtom();
  }
  isUsing() {
    if (!this.isContextual(103)) {
      return false;
    }
    return this.nextTokenIsIdentifierOnSameLine();
  }
  isForUsing() {
    if (!this.isContextual(103)) {
      return false;
    }
    const next = this.nextTokenInLineStart();
    const nextCh = this.codePointAtPos(next);
    if (this.isUnparsedContextual(next, "of")) {
      const nextCharAfterOf = this.lookaheadCharCodeSince(next + 2);
      if (nextCharAfterOf !== 61 && nextCharAfterOf !== 58 && nextCharAfterOf !== 59) {
        return false;
      }
    }
    if (this.chStartsBindingIdentifier(nextCh, next) || this.isUnparsedContextual(next, "void")) {
      return true;
    }
    return false;
  }
  nextTokenIsIdentifierOnSameLine() {
    const next = this.nextTokenInLineStart();
    const nextCh = this.codePointAtPos(next);
    return this.chStartsBindingIdentifier(nextCh, next);
  }
  isAwaitUsing() {
    if (!this.isContextual(92)) {
      return false;
    }
    let next = this.nextTokenInLineStart();
    if (this.isUnparsedContextual(next, "using")) {
      next = this.nextTokenInLineStartSince(next + 5);
      const nextCh = this.codePointAtPos(next);
      if (this.chStartsBindingIdentifier(nextCh, next)) {
        return true;
      }
    }
    return false;
  }
  chStartsBindingIdentifier(ch, pos) {
    if (isIdentifierStart(ch)) {
      keywordRelationalOperator.lastIndex = pos;
      if (keywordRelationalOperator.test(this.input)) {
        const endCh = this.codePointAtPos(keywordRelationalOperator.lastIndex);
        if (!isIdentifierChar(endCh) && endCh !== 92) {
          return false;
        }
      }
      return true;
    } else if (ch === 92) {
      return true;
    } else {
      return false;
    }
  }
  chStartsBindingPattern(ch) {
    return ch === 91 || ch === 123;
  }
  hasFollowingBindingAtom() {
    const next = this.nextTokenStart();
    const nextCh = this.codePointAtPos(next);
    return this.chStartsBindingPattern(nextCh) || this.chStartsBindingIdentifier(nextCh, next);
  }
  hasInLineFollowingBindingIdentifierOrBrace() {
    const next = this.nextTokenInLineStart();
    const nextCh = this.codePointAtPos(next);
    return nextCh === 123 || this.chStartsBindingIdentifier(nextCh, next);
  }
  allowsUsing() {
    return (this.scope.inModule || !this.scope.inTopLevel) && !this.scope.inBareCaseStatement;
  }
  parseModuleItem() {
    return this.parseStatementLike(1 | 2 | 4 | 8);
  }
  parseStatementListItem() {
    return this.parseStatementLike(2 | 4 | (!this.options.annexB || this.state.strict ? 0 : 8));
  }
  parseStatementOrSloppyAnnexBFunctionDeclaration(allowLabeledFunction = false) {
    let flags = 0;
    if (this.options.annexB && !this.state.strict) {
      flags |= 4;
      if (allowLabeledFunction) {
        flags |= 8;
      }
    }
    return this.parseStatementLike(flags);
  }
  parseStatement() {
    return this.parseStatementLike(0);
  }
  parseStatementLike(flags) {
    let decorators = null;
    if (this.match(22)) {
      decorators = this.parseDecorators(true);
    }
    return this.parseStatementContent(flags, decorators);
  }
  parseStatementContent(flags, decorators) {
    const startType = this.state.type;
    const node = this.startNode();
    const allowDeclaration = !!(flags & 2);
    const allowFunctionDeclaration = !!(flags & 4);
    const topLevel = flags & 1;
    switch (startType) {
      case 56:
        return this.parseBreakContinueStatement(node, true);
      case 59:
        return this.parseBreakContinueStatement(node, false);
      case 60:
        return this.parseDebuggerStatement(node);
      case 86:
        return this.parseDoWhileStatement(node);
      case 87:
        return this.parseForStatement(node);
      case 64:
        if (this.lookaheadCharCode() === 46) break;
        if (!allowFunctionDeclaration) {
          this.raise(this.state.strict ? Errors.StrictFunction : this.options.annexB ? Errors.SloppyFunctionAnnexB : Errors.SloppyFunction, this.state.startLoc);
        }
        return this.parseFunctionStatement(node, false, !allowDeclaration && allowFunctionDeclaration);
      case 76:
        if (!allowDeclaration) this.unexpected();
        return this.parseClass(this.maybeTakeDecorators(decorators, node), true);
      case 65:
        return this.parseIfStatement(node);
      case 66:
        return this.parseReturnStatement(node);
      case 67:
        return this.parseSwitchStatement(node);
      case 68:
        return this.parseThrowStatement(node);
      case 69:
        return this.parseTryStatement(node);
      case 92:
        if (this.isAwaitUsing()) {
          if (!this.allowsUsing()) {
            this.raise(Errors.UnexpectedUsingDeclaration, node);
          } else if (!allowDeclaration) {
            this.raise(Errors.UnexpectedLexicalDeclaration, node);
          } else if (!this.recordAwaitIfAllowed()) {
            this.raise(Errors.AwaitUsingNotInAsyncContext, node);
          }
          this.next();
          return this.parseVarStatement(node, "await using");
        }
        break;
      case 103:
        if (this.state.containsEsc || !this.hasInLineFollowingBindingIdentifierOrBrace()) {
          break;
        }
        if (!this.allowsUsing()) {
          this.raise(Errors.UnexpectedUsingDeclaration, this.state.startLoc);
        } else if (!allowDeclaration) {
          this.raise(Errors.UnexpectedLexicalDeclaration, this.state.startLoc);
        }
        return this.parseVarStatement(node, "using");
      case 96: {
        if (this.state.containsEsc) {
          break;
        }
        const next = this.nextTokenStart();
        const nextCh = this.codePointAtPos(next);
        if (nextCh !== 91) {
          if (!allowDeclaration && this.hasFollowingLineBreak()) break;
          if (!this.chStartsBindingIdentifier(nextCh, next) && nextCh !== 123) {
            break;
          }
        }
      }
      case 71: {
        if (!allowDeclaration) {
          this.raise(Errors.UnexpectedLexicalDeclaration, this.state.startLoc);
        }
      }
      case 70: {
        const kind = this.state.value;
        return this.parseVarStatement(node, kind);
      }
      case 88:
        return this.parseWhileStatement(node);
      case 72:
        return this.parseWithStatement(node);
      case 2:
        return this.parseBlock();
      case 9:
        return this.parseEmptyStatement(node);
      case 79: {
        const nextTokenCharCode = this.lookaheadCharCode();
        if (nextTokenCharCode === 40 || nextTokenCharCode === 46) {
          break;
        }
      }
      case 78: {
        if (!(this.optionFlags & 8) && !topLevel) {
          this.raise(Errors.UnexpectedImportExport, this.state.startLoc);
        }
        this.next();
        let result;
        if (startType === 79) {
          result = this.parseImport(node);
        } else {
          result = this.parseExport(node, decorators);
        }
        this.assertModuleNodeAllowed(result);
        return result;
      }
      default: {
        if (this.isAsyncFunction()) {
          if (!allowDeclaration) {
            this.raise(Errors.AsyncFunctionInSingleStatementContext, this.state.startLoc);
          }
          this.next();
          return this.parseFunctionStatement(node, true, !allowDeclaration && allowFunctionDeclaration);
        }
      }
    }
    const maybeName = this.state.value;
    const expr = this.parseExpression();
    if (tokenIsIdentifier(startType) && expr.type === "Identifier" && this.eat(10)) {
      return this.parseLabeledStatement(node, maybeName, expr, flags);
    } else {
      return this.parseExpressionStatement(node, expr, decorators);
    }
  }
  assertModuleNodeAllowed(node) {
    if (!(this.optionFlags & 8) && !this.inModule) {
      this.raise(Errors.ImportOutsideModule, node);
    }
  }
  maybeTakeDecorators(maybeDecorators, classNode, exportNode) {
    if (maybeDecorators) {
      if (classNode.decorators?.length) {
        this.raise(Errors.DecoratorsBeforeAfterExport, classNode.decorators[0]);
        classNode.decorators.unshift(...maybeDecorators);
      } else {
        classNode.decorators = maybeDecorators;
      }
      this.resetStartLocationFromNode(classNode, maybeDecorators[0]);
      if (exportNode) this.resetStartLocationFromNode(exportNode, classNode);
    }
    return classNode;
  }
  canHaveLeadingDecorator() {
    return this.match(76);
  }
  parseDecorators(allowExport) {
    const decorators = [];
    do {
      decorators.push(this.parseDecorator());
    } while (this.match(22));
    if (this.match(78)) {
      if (!allowExport) {
        this.unexpected();
      }
    } else if (!this.canHaveLeadingDecorator()) {
      throw this.raise(Errors.UnexpectedLeadingDecorator, this.state.startLoc);
    }
    return decorators;
  }
  parseDecorator() {
    this.expectOnePlugin(["decorators", "decorators-legacy"]);
    const node = this.startNode();
    this.next();
    if (this.hasPlugin("decorators")) {
      const startLoc = this.state.startLoc;
      let expr;
      if (this.match(6)) {
        const startLoc2 = this.state.startLoc;
        this.next();
        expr = this.parseExpression();
        this.expect(7);
        expr = this.wrapParenthesis(startLoc2, expr);
        const paramsStartLoc = this.state.startLoc;
        node.expression = this.parseMaybeDecoratorArguments(expr, startLoc2);
        if (node.expression !== expr) {
          this.raise(Errors.DecoratorArgumentsOutsideParentheses, paramsStartLoc);
        }
      } else {
        expr = this.parseIdentifier(false);
        while (this.eat(12)) {
          const node2 = this.startNodeAt(startLoc);
          node2.object = expr;
          if (this.match(134)) {
            this.classScope.usePrivateName(this.state.value, this.state.startLoc);
            node2.property = this.parsePrivateName();
          } else {
            node2.property = this.parseIdentifier(true);
          }
          node2.computed = false;
          expr = this.finishNode(node2, "MemberExpression");
        }
        node.expression = this.parseMaybeDecoratorArguments(expr, startLoc);
      }
    } else {
      this.state.canStartArrow = false;
      node.expression = this.parseExprSubscripts();
    }
    return this.finishNode(node, "Decorator");
  }
  parseMaybeDecoratorArguments(expr, startLoc) {
    if (this.eat(6)) {
      const node = this.startNodeAt(startLoc);
      node.callee = expr;
      node.arguments = this.parseCallExpressionArguments();
      this.toReferencedList(node.arguments);
      return this.finishNode(node, "CallExpression");
    }
    return expr;
  }
  parseBreakContinueStatement(node, isBreak) {
    this.next();
    if (this.isLineTerminator()) {
      node.label = null;
    } else {
      node.label = this.parseIdentifier();
      this.semicolon();
    }
    this.verifyBreakContinue(node, isBreak);
    return this.finishNode(node, isBreak ? "BreakStatement" : "ContinueStatement");
  }
  verifyBreakContinue(node, isBreak) {
    let i;
    for (i = 0; i < this.state.labels.length; ++i) {
      const lab = this.state.labels[i];
      if (node.label == null || lab.name === node.label.name) {
        if (lab.kind != null && (isBreak || lab.kind === 1)) {
          break;
        }
        if (node.label && isBreak) break;
      }
    }
    if (i === this.state.labels.length) {
      const type = isBreak ? "BreakStatement" : "ContinueStatement";
      this.raise(Errors.IllegalBreakContinue, node, {
        type
      });
    }
  }
  parseDebuggerStatement(node) {
    this.next();
    this.semicolon();
    return this.finishNode(node, "DebuggerStatement");
  }
  parseHeaderExpression() {
    this.expect(6);
    const val = this.parseExpression();
    this.expect(7);
    return val;
  }
  parseDoWhileStatement(node) {
    this.next();
    this.state.labels.push(loopLabel);
    node.body = this.parseStatement();
    this.state.labels.pop();
    this.expect(88);
    node.test = this.parseHeaderExpression();
    this.eat(9);
    return this.finishNode(node, "DoWhileStatement");
  }
  parseForStatement(node) {
    this.next();
    this.state.labels.push(loopLabel);
    let awaitAt = null;
    if (this.isContextual(92) && this.recordAwaitIfAllowed()) {
      awaitAt = this.state.startLoc;
      this.next();
    }
    this.scope.enter(0);
    this.expect(6);
    if (this.match(9)) {
      if (awaitAt !== null) {
        this.unexpected(awaitAt);
      }
      return this.parseFor(node, null);
    }
    const startsWithLet = this.isContextual(96);
    {
      const startsWithAwaitUsing = this.isAwaitUsing();
      const starsWithUsingDeclaration = startsWithAwaitUsing || this.isForUsing();
      const isLetOrUsing = startsWithLet && this.hasFollowingBindingAtom() || starsWithUsingDeclaration;
      if (this.match(70) || this.match(71) || isLetOrUsing) {
        const initNode = this.startNode();
        let kind;
        if (startsWithAwaitUsing) {
          kind = "await using";
          if (!this.recordAwaitIfAllowed()) {
            this.raise(Errors.AwaitUsingNotInAsyncContext, this.state.startLoc);
          }
          this.next();
        } else {
          kind = this.state.value;
        }
        this.next();
        this.parseVar(initNode, true, kind);
        const init2 = this.finishNode(initNode, "VariableDeclaration");
        const isForIn = this.match(54);
        if (isForIn && starsWithUsingDeclaration) {
          this.raise(Errors.ForInUsing, init2);
        }
        if ((isForIn || this.isContextual(98)) && init2.declarations.length === 1) {
          return this.parseForIn(node, init2, awaitAt);
        }
        if (awaitAt !== null) {
          this.unexpected(awaitAt);
        }
        return this.parseFor(node, init2);
      }
    }
    const startsWithAsync = this.isContextual(91);
    const refExpressionErrors = new ExpressionErrors();
    const init = this.parseExpression(true, refExpressionErrors);
    const isForOf = this.isContextual(98);
    if (isForOf) {
      if (startsWithLet) {
        this.raise(Errors.ForOfLet, init);
      }
      if (awaitAt === null && startsWithAsync && init.type === "Identifier") {
        this.raise(Errors.ForOfAsync, init);
      }
    }
    if (isForOf || this.match(54)) {
      this.checkDestructuringPrivate(refExpressionErrors);
      this.toAssignable(init, true);
      const type = isForOf ? "ForOfStatement" : "ForInStatement";
      this.checkLVal(init, {
        type
      });
      return this.parseForIn(node, init, awaitAt);
    } else {
      this.checkExpressionErrors(refExpressionErrors, true);
    }
    if (awaitAt !== null) {
      this.unexpected(awaitAt);
    }
    return this.parseFor(node, init);
  }
  parseFunctionStatement(node, isAsync, isHangingDeclaration) {
    this.next();
    return this.parseFunction(node, 1 | (isHangingDeclaration ? 2 : 0) | (isAsync ? 8 : 0));
  }
  parseIfStatement(node) {
    this.next();
    node.test = this.parseHeaderExpression();
    node.consequent = this.parseStatementOrSloppyAnnexBFunctionDeclaration();
    node.alternate = this.eat(62) ? this.parseStatementOrSloppyAnnexBFunctionDeclaration() : null;
    return this.finishNode(node, "IfStatement");
  }
  parseReturnStatement(node) {
    if (!this.prodParam.hasReturn) {
      this.raise(Errors.IllegalReturn, this.state.startLoc);
    }
    this.next();
    if (this.isLineTerminator()) {
      node.argument = null;
    } else {
      node.argument = this.parseExpression();
      this.semicolon();
    }
    return this.finishNode(node, "ReturnStatement");
  }
  parseSwitchStatement(node) {
    this.next();
    node.discriminant = this.parseHeaderExpression();
    const cases = node.cases = [];
    this.expect(2);
    this.state.labels.push(switchLabel);
    this.scope.enter(256);
    let cur;
    for (let sawDefault; !this.match(4); ) {
      if (this.match(57) || this.match(61)) {
        const isCase = this.match(57);
        if (cur) this.finishNode(cur, "SwitchCase");
        cases.push(cur = this.startNode());
        cur.consequent = [];
        this.next();
        if (isCase) {
          cur.test = this.parseExpression();
        } else {
          if (sawDefault) {
            this.raise(Errors.MultipleDefaultsInSwitch, this.state.lastTokStartLoc);
          }
          sawDefault = true;
          cur.test = null;
        }
        this.expect(10);
      } else {
        if (cur) {
          cur.consequent.push(this.parseStatementListItem());
        } else {
          this.unexpected();
        }
      }
    }
    this.scope.exit();
    if (cur) this.finishNode(cur, "SwitchCase");
    this.next();
    this.state.labels.pop();
    return this.finishNode(node, "SwitchStatement");
  }
  parseThrowStatement(node) {
    this.next();
    if (this.hasPrecedingLineBreak()) {
      this.raise(Errors.NewlineAfterThrow, this.state.lastTokEndLoc);
    }
    node.argument = this.parseExpression();
    this.semicolon();
    return this.finishNode(node, "ThrowStatement");
  }
  parseCatchClauseParam() {
    const param = this.parseBindingAtom();
    this.scope.enter(this.options.annexB && param.type === "Identifier" ? 8 : 0);
    this.checkLVal(param, {
      type: "CatchClause"
    }, 9);
    return param;
  }
  parseTryStatement(node) {
    this.next();
    node.block = this.parseBlock();
    node.handler = null;
    if (this.match(58)) {
      const clause = this.startNode();
      this.next();
      if (this.match(6)) {
        this.expect(6);
        clause.param = this.parseCatchClauseParam();
        this.expect(7);
      } else {
        clause.param = null;
        this.scope.enter(0);
      }
      clause.body = this.parseBlock(false, false);
      this.scope.exit();
      node.handler = this.finishNode(clause, "CatchClause");
    }
    node.finalizer = this.eat(63) ? this.parseBlock() : null;
    if (!node.handler && !node.finalizer) {
      this.raise(Errors.NoCatchOrFinally, node);
    }
    return this.finishNode(node, "TryStatement");
  }
  parseVarStatement(node, kind, allowMissingInitializer = false) {
    this.next();
    this.parseVar(node, false, kind, allowMissingInitializer);
    this.semicolon();
    return this.finishNode(node, "VariableDeclaration");
  }
  parseWhileStatement(node) {
    this.next();
    node.test = this.parseHeaderExpression();
    this.state.labels.push(loopLabel);
    node.body = this.parseStatement();
    this.state.labels.pop();
    return this.finishNode(node, "WhileStatement");
  }
  parseWithStatement(node) {
    if (this.state.strict) {
      this.raise(Errors.StrictWith, this.state.startLoc);
    }
    this.next();
    node.object = this.parseHeaderExpression();
    node.body = this.parseStatement();
    return this.finishNode(node, "WithStatement");
  }
  parseEmptyStatement(node) {
    this.next();
    return this.finishNode(node, "EmptyStatement");
  }
  parseLabeledStatement(node, maybeName, expr, flags) {
    for (const label of this.state.labels) {
      if (label.name === maybeName) {
        this.raise(Errors.LabelRedeclaration, expr, {
          labelName: maybeName
        });
      }
    }
    const kind = tokenIsLoop(this.state.type) ? 1 : this.match(67) ? 2 : null;
    for (let i = this.state.labels.length - 1; i >= 0; i--) {
      const label = this.state.labels[i];
      if (label.statementStart === node.start) {
        label.statementStart = this.sourceToOffsetPos(this.state.start);
        label.kind = kind;
      } else {
        break;
      }
    }
    this.state.labels.push({
      name: maybeName,
      kind,
      statementStart: this.sourceToOffsetPos(this.state.start)
    });
    node.body = flags & 8 ? this.parseStatementOrSloppyAnnexBFunctionDeclaration(true) : this.parseStatement();
    this.state.labels.pop();
    node.label = expr;
    return this.finishNode(node, "LabeledStatement");
  }
  parseExpressionStatement(node, expr, decorators) {
    node.expression = expr;
    this.semicolon();
    return this.finishNode(node, "ExpressionStatement");
  }
  parseBlock(allowDirectives = false, createNewLexicalScope = true, afterBlockParse) {
    const node = this.startNode();
    if (allowDirectives) {
      this.state.strictErrors.clear();
    }
    this.expect(2);
    if (createNewLexicalScope) {
      this.scope.enter(0);
    }
    this.parseBlockBody(node, allowDirectives, false, 4, afterBlockParse);
    if (createNewLexicalScope) {
      this.scope.exit();
    }
    return this.finishNode(node, "BlockStatement");
  }
  isValidDirective(stmt) {
    return stmt.type === "ExpressionStatement" && stmt.expression.type === "StringLiteral" && !stmt.expression.extra.parenthesized;
  }
  parseBlockBody(node, allowDirectives, topLevel, end, afterBlockParse) {
    const body = node.body = [];
    const directives = node.directives = [];
    this.parseBlockOrModuleBlockBody(body, allowDirectives ? directives : void 0, topLevel, end, afterBlockParse);
  }
  parseBlockOrModuleBlockBody(body, directives, topLevel, end, afterBlockParse) {
    const oldStrict = this.state.strict;
    let hasStrictModeDirective = false;
    let parsedNonDirective = false;
    while (!this.match(end)) {
      const stmt = topLevel ? this.parseModuleItem() : this.parseStatementListItem();
      if (directives && !parsedNonDirective) {
        if (this.isValidDirective(stmt)) {
          const directive = this.stmtToDirective(stmt);
          directives.push(directive);
          if (!hasStrictModeDirective && directive.value.value === "use strict") {
            hasStrictModeDirective = true;
            this.setStrict(true);
          }
          continue;
        }
        parsedNonDirective = true;
        this.state.strictErrors.clear();
      }
      body.push(stmt);
    }
    afterBlockParse?.call(this, hasStrictModeDirective);
    if (!oldStrict) {
      this.setStrict(false);
    }
    this.next();
  }
  parseFor(node, init) {
    node.init = init;
    this.semicolon(false);
    node.test = this.match(9) ? null : this.parseExpression();
    this.semicolon(false);
    node.update = this.match(7) ? null : this.parseExpression();
    this.expect(7);
    node.body = this.parseStatement();
    this.scope.exit();
    this.state.labels.pop();
    return this.finishNode(node, "ForStatement");
  }
  parseForIn(node, init, awaitAt) {
    const isForIn = this.match(54);
    this.next();
    if (isForIn) {
      if (awaitAt !== null) this.unexpected(awaitAt);
    } else {
      node.await = awaitAt !== null;
    }
    if (init.type === "VariableDeclaration" && init.declarations[0].init != null && (!isForIn || !this.options.annexB || this.state.strict || init.kind !== "var" || init.declarations[0].id.type !== "Identifier")) {
      this.raise(Errors.ForInOfLoopInitializer, init, {
        type: isForIn ? "ForInStatement" : "ForOfStatement"
      });
    }
    if (init.type === "AssignmentPattern") {
      this.raise(Errors.InvalidLhs, init, {
        ancestor: {
          type: "ForStatement"
        }
      });
    }
    node.left = init;
    node.right = isForIn ? this.parseExpression() : this.parseMaybeAssignAllowIn();
    this.expect(7);
    node.body = this.parseStatement();
    this.scope.exit();
    this.state.labels.pop();
    return this.finishNode(node, isForIn ? "ForInStatement" : "ForOfStatement");
  }
  parseVar(node, isFor, kind, allowMissingInitializer = false) {
    const declarations = node.declarations = [];
    node.kind = kind;
    for (; ; ) {
      const decl = this.startNode();
      this.parseVarId(decl, kind);
      decl.init = !this.eat(25) ? null : isFor ? this.parseMaybeAssignDisallowIn() : this.parseMaybeAssignAllowIn();
      if (decl.init === null && !allowMissingInitializer) {
        if (decl.id.type !== "Identifier" && !(isFor && (this.match(54) || this.isContextual(98)))) {
          this.raise(Errors.DeclarationMissingInitializer, this.state.lastTokEndLoc, {
            kind: "destructuring"
          });
        } else if ((kind === "const" || kind === "using" || kind === "await using") && !(this.match(54) || this.isContextual(98))) {
          this.raise(Errors.DeclarationMissingInitializer, this.state.lastTokEndLoc, {
            kind
          });
        }
      }
      declarations.push(this.finishNode(decl, "VariableDeclarator"));
      if (!this.eat(8)) break;
    }
    return node;
  }
  parseVarId(decl, kind) {
    const id = this.parseBindingAtom();
    if (kind === "using" || kind === "await using") {
      if (id.type === "ArrayPattern" || id.type === "ObjectPattern") {
        this.raise(Errors.UsingDeclarationHasBindingPattern, id);
      }
    } else {
      if (id.type === "VoidPattern") {
        this.raise(Errors.UnexpectedVoidPattern, id);
      }
    }
    this.checkLVal(id, {
      type: "VariableDeclarator"
    }, kind === "var" ? 5 : 8201);
    decl.id = id;
  }
  parseAsyncFunctionExpression(node) {
    return this.parseFunction(node, 8);
  }
  parseFunction(node, flags = 0) {
    const hangingDeclaration = flags & 2;
    const isDeclaration = !!(flags & 1);
    const requireId = isDeclaration && !(flags & 4);
    const isAsync = !!(flags & 8);
    this.initFunction(node, isAsync);
    if (this.match(51)) {
      if (hangingDeclaration) {
        this.raise(Errors.GeneratorInSingleStatementContext, this.state.startLoc);
      }
      this.next();
      node.generator = true;
    }
    if (isDeclaration) {
      node.id = this.parseFunctionId(requireId);
    }
    this.scope.enter(514);
    this.prodParam.enter(functionFlags(isAsync, node.generator));
    if (!isDeclaration) {
      node.id = this.parseFunctionId();
    }
    this.parseFunctionParams(node, false);
    this.parseFunctionBodyAndFinish(node, isDeclaration ? "FunctionDeclaration" : "FunctionExpression");
    this.prodParam.exit();
    this.scope.exit();
    if (isDeclaration && !hangingDeclaration) {
      this.registerFunctionStatementId(node);
    }
    return node;
  }
  parseFunctionId(requireId) {
    return requireId || tokenIsIdentifier(this.state.type) ? this.parseIdentifier() : null;
  }
  parseFunctionParams(node, isConstructor) {
    this.expect(6);
    this.expressionScope.enter(newParameterDeclarationScope());
    node.params = this.parseBindingList(7, 41, 2 | (isConstructor ? 4 : 0));
    this.expressionScope.exit();
  }
  registerFunctionStatementId(node) {
    if (!node.id) return;
    this.scope.declareName(node.id.name, !this.options.annexB || this.state.strict || node.generator || node.async ? this.scope.treatFunctionsAsVar ? 5 : 8201 : 17, node.id.start);
  }
  parseClass(node, isStatement, optionalId) {
    this.next();
    const oldStrict = this.state.strict;
    this.state.strict = true;
    this.parseClassId(node, isStatement, optionalId);
    this.parseClassSuper(node);
    node.body = this.parseClassBody(!!node.superClass, oldStrict);
    return this.finishNode(node, isStatement ? "ClassDeclaration" : "ClassExpression");
  }
  isClassProperty() {
    return this.match(25) || this.match(9) || this.match(4);
  }
  isClassMethod() {
    return this.match(6);
  }
  nameIsConstructor(key) {
    return key.type === "Identifier" && key.name === "constructor" || key.type === "StringLiteral" && key.value === "constructor";
  }
  isNonstaticConstructor(method) {
    return !method.computed && !method.static && this.nameIsConstructor(method.key);
  }
  parseClassBody(hadSuperClass, oldStrict) {
    this.classScope.enter();
    const state = {
      hadConstructor: false,
      hadSuperClass
    };
    let decorators = [];
    const classBody = this.startNode();
    classBody.body = [];
    this.expect(2);
    while (!this.match(4)) {
      if (this.eat(9)) {
        if (decorators.length > 0) {
          throw this.raise(Errors.DecoratorSemicolon, this.state.lastTokEndLoc);
        }
        continue;
      }
      if (this.match(22)) {
        decorators.push(this.parseDecorator());
        continue;
      }
      const member = this.startNode();
      if (decorators.length) {
        member.decorators = decorators;
        this.resetStartLocationFromNode(member, decorators[0]);
        decorators = [];
      }
      this.parseClassMember(classBody, member, state);
    }
    this.state.strict = oldStrict;
    this.next();
    if (decorators.length) {
      throw this.raise(Errors.TrailingDecorator, this.state.startLoc);
    }
    this.classScope.exit();
    return this.finishNode(classBody, "ClassBody");
  }
  parseClassMemberFromModifier(classBody, member) {
    const key = this.parseIdentifier(true);
    if (this.isClassMethod()) {
      const method = member;
      method.kind = "method";
      method.computed = false;
      method.key = key;
      method.static = false;
      this.pushClassMethod(classBody, method, false, false, false, false);
      return true;
    } else if (this.isClassProperty()) {
      const prop = member;
      prop.computed = false;
      prop.key = key;
      prop.static = false;
      classBody.body.push(this.parseClassProperty(prop));
      return true;
    }
    this.resetPreviousNodeTrailingComments(key);
    return false;
  }
  parseClassMember(classBody, member, state) {
    const isStatic = this.isContextual(102);
    if (isStatic) {
      if (this.parseClassMemberFromModifier(classBody, member)) {
        return;
      }
      if (this.eat(2)) {
        this.parseClassStaticBlock(classBody, member);
        return;
      }
    }
    this.parseClassMemberWithIsStatic(classBody, member, state, isStatic);
  }
  parseClassMemberWithIsStatic(classBody, member, state, isStatic) {
    const publicMethod = member;
    const privateMethod = member;
    const publicProp = member;
    const privateProp = member;
    const accessorProp = member;
    const method = publicMethod;
    const publicMember = publicMethod;
    member.static = isStatic;
    this.parsePropertyNamePrefixOperator(member);
    if (this.eat(51)) {
      method.kind = "method";
      const isPrivateName = this.match(134);
      this.parseClassElementName(method);
      this.parsePostMemberNameModifiers(method);
      if (isPrivateName) {
        this.pushClassPrivateMethod(classBody, privateMethod, true, false);
        return;
      }
      if (this.isNonstaticConstructor(publicMethod)) {
        this.raise(Errors.ConstructorIsGenerator, publicMethod.key);
      }
      this.pushClassMethod(classBody, publicMethod, true, false, false, false);
      return;
    }
    const isContextual = !this.state.containsEsc && tokenIsIdentifier(this.state.type);
    const key = this.parseClassElementName(member);
    const maybeContextualKw = isContextual ? key.name : null;
    const isPrivate = this.isPrivateName(key);
    const maybeQuestionTokenStartLoc = this.state.startLoc;
    this.parsePostMemberNameModifiers(publicMember);
    if (this.isClassMethod()) {
      method.kind = "method";
      if (isPrivate) {
        this.pushClassPrivateMethod(classBody, privateMethod, false, false);
        return;
      }
      const isConstructor = this.isNonstaticConstructor(publicMethod);
      let allowsDirectSuper = false;
      if (isConstructor) {
        publicMethod.kind = "constructor";
        if (publicMethod.decorators && publicMethod.decorators.length > 0) {
          this.raise(Errors.DecoratorConstructor, member);
        }
        if (state.hadConstructor && !this.hasPlugin("typescript")) {
          this.raise(Errors.DuplicateConstructor, key);
        }
        if (isConstructor && this.hasPlugin("typescript") && member.override) {
          this.raise(Errors.OverrideOnConstructor, key);
        }
        state.hadConstructor = true;
        allowsDirectSuper = state.hadSuperClass;
      }
      this.pushClassMethod(classBody, publicMethod, false, false, isConstructor, allowsDirectSuper);
    } else if (this.isClassProperty()) {
      if (isPrivate) {
        this.pushClassPrivateProperty(classBody, privateProp);
      } else {
        this.pushClassProperty(classBody, publicProp);
      }
    } else if (maybeContextualKw === "async" && !this.isLineTerminator()) {
      this.resetPreviousNodeTrailingComments(key);
      const isGenerator = this.eat(51);
      if (publicMember.optional) {
        this.unexpected(maybeQuestionTokenStartLoc);
      }
      method.kind = "method";
      const isPrivate2 = this.match(134);
      this.parseClassElementName(method);
      this.parsePostMemberNameModifiers(publicMember);
      if (isPrivate2) {
        this.pushClassPrivateMethod(classBody, privateMethod, isGenerator, true);
      } else {
        if (this.isNonstaticConstructor(publicMethod)) {
          this.raise(Errors.ConstructorIsAsync, publicMethod.key);
        }
        this.pushClassMethod(classBody, publicMethod, isGenerator, true, false, false);
      }
    } else if ((maybeContextualKw === "get" || maybeContextualKw === "set") && !(this.match(51) && this.isLineTerminator())) {
      this.resetPreviousNodeTrailingComments(key);
      method.kind = maybeContextualKw;
      const isPrivate2 = this.match(134);
      this.parseClassElementName(publicMethod);
      if (isPrivate2) {
        this.pushClassPrivateMethod(classBody, privateMethod, false, false);
      } else {
        if (this.isNonstaticConstructor(publicMethod)) {
          this.raise(Errors.ConstructorIsAccessor, publicMethod.key);
        }
        this.pushClassMethod(classBody, publicMethod, false, false, false, false);
      }
      this.checkGetterSetterParams(publicMethod);
    } else if (maybeContextualKw === "accessor" && !this.isLineTerminator()) {
      this.expectPlugin("decoratorAutoAccessors");
      this.resetPreviousNodeTrailingComments(key);
      const isPrivate2 = this.match(134);
      this.parseClassElementName(publicProp);
      this.pushClassAccessorProperty(classBody, accessorProp, isPrivate2);
    } else if (this.isLineTerminator()) {
      if (isPrivate) {
        this.pushClassPrivateProperty(classBody, privateProp);
      } else {
        this.pushClassProperty(classBody, publicProp);
      }
    } else {
      this.unexpected();
    }
  }
  parseClassElementName(member) {
    const {
      type,
      value
    } = this.state;
    if ((type === 128 || type === 130) && member.static && value === "prototype") {
      this.raise(Errors.StaticPrototype, this.state.startLoc);
    }
    if (type === 134) {
      if (value === "constructor") {
        this.raise(Errors.ConstructorClassPrivateField, this.state.startLoc);
      }
      const key = this.parsePrivateName();
      member.key = key;
      return key;
    }
    this.parsePropertyName(member);
    return member.key;
  }
  parseClassStaticBlock(classBody, member) {
    this.scope.enter(576 | 128 | 16);
    const oldLabels = this.state.labels;
    this.state.labels = [];
    this.prodParam.enter(0);
    const body = member.body = [];
    this.parseBlockOrModuleBlockBody(body, void 0, false, 4);
    this.prodParam.exit();
    this.scope.exit();
    this.state.labels = oldLabels;
    classBody.body.push(this.finishNode(member, "StaticBlock"));
    if (member.decorators?.length) {
      this.raise(Errors.DecoratorStaticBlock, member);
    }
  }
  pushClassProperty(classBody, prop) {
    if (!prop.computed && this.nameIsConstructor(prop.key)) {
      this.raise(Errors.ConstructorClassField, prop.key);
    }
    classBody.body.push(this.parseClassProperty(prop));
  }
  pushClassPrivateProperty(classBody, prop) {
    const node = this.parseClassPrivateProperty(prop);
    classBody.body.push(node);
    this.classScope.declarePrivateName(this.getPrivateNameSV(node.key), 0, node.key.start);
  }
  pushClassAccessorProperty(classBody, prop, isPrivate) {
    if (!isPrivate && !prop.computed && this.nameIsConstructor(prop.key)) {
      this.raise(Errors.ConstructorClassField, prop.key);
    }
    const node = this.parseClassAccessorProperty(prop);
    classBody.body.push(node);
    if (isPrivate) {
      this.classScope.declarePrivateName(this.getPrivateNameSV(node.key), 0, node.key.start);
    }
  }
  pushClassMethod(classBody, method, isGenerator, isAsync, isConstructor, allowsDirectSuper) {
    classBody.body.push(this.parseMethod(method, isGenerator, isAsync, isConstructor, allowsDirectSuper, "ClassMethod", true));
  }
  pushClassPrivateMethod(classBody, method, isGenerator, isAsync) {
    const node = this.parseMethod(method, isGenerator, isAsync, false, false, "ClassPrivateMethod", true);
    classBody.body.push(node);
    const kind = node.kind === "get" ? node.static ? 6 : 2 : node.kind === "set" ? node.static ? 5 : 1 : 0;
    this.declareClassPrivateMethodInScope(node, kind);
  }
  declareClassPrivateMethodInScope(node, kind) {
    this.classScope.declarePrivateName(this.getPrivateNameSV(node.key), kind, node.key.start);
  }
  parsePostMemberNameModifiers(methodOrProp) {
  }
  parseClassPrivateProperty(node) {
    this.parseInitializer(node);
    this.semicolon();
    return this.finishNode(node, "ClassPrivateProperty");
  }
  parseClassProperty(node) {
    this.parseInitializer(node);
    this.semicolon();
    return this.finishNode(node, "ClassProperty");
  }
  parseClassAccessorProperty(node) {
    this.parseInitializer(node);
    this.semicolon();
    return this.finishNode(node, "ClassAccessorProperty");
  }
  parseInitializer(node) {
    this.scope.enter(576 | 16);
    this.expressionScope.enter(newExpressionScope());
    this.prodParam.enter(0);
    node.value = this.eat(25) ? this.parseMaybeAssignAllowIn() : null;
    this.expressionScope.exit();
    this.prodParam.exit();
    this.scope.exit();
  }
  parseClassId(node, isStatement, optionalId, bindingType = 8331) {
    if (tokenIsIdentifier(this.state.type)) {
      node.id = this.parseIdentifier();
      if (isStatement) {
        this.declareNameFromIdentifier(node.id, bindingType);
      }
    } else {
      if (optionalId || !isStatement) {
        node.id = null;
      } else {
        throw this.raise(Errors.MissingClassName, this.state.startLoc);
      }
    }
  }
  parseClassSuper(node) {
    if (this.eat(77)) {
      this.state.canStartArrow = false;
      node.superClass = this.parseExprSubscripts();
    } else {
      node.superClass = null;
    }
  }
  parseExport(node, decorators) {
    const maybeDefaultIdentifier = this.parseMaybeImportPhase(node, true);
    const hasDefault = this.maybeParseExportDefaultSpecifier(node, maybeDefaultIdentifier);
    const parseAfterDefault = !hasDefault || this.eat(8);
    const hasStar = parseAfterDefault && this.eatExportStar(node);
    const hasNamespace = hasStar && this.maybeParseExportNamespaceSpecifier(node);
    const parseAfterNamespace = parseAfterDefault && (!hasNamespace || this.eat(8));
    const isFromRequired = hasDefault || hasStar;
    if (hasStar && !hasNamespace) {
      if (hasDefault) this.unexpected();
      if (decorators) {
        throw this.raise(Errors.UnsupportedDecoratorExport, node);
      }
      this.parseExportFrom(node, true);
      this.sawUnambiguousESM = true;
      return this.finishNode(node, "ExportAllDeclaration");
    }
    const hasSpecifiers = this.maybeParseExportNamedSpecifiers(node);
    if (hasDefault && parseAfterDefault && !hasStar && !hasSpecifiers) {
      this.unexpected(null, 2);
    }
    if (hasNamespace && parseAfterNamespace) {
      this.unexpected(null, 94);
    }
    let hasDeclaration;
    if (isFromRequired || hasSpecifiers) {
      hasDeclaration = false;
      if (decorators) {
        throw this.raise(Errors.UnsupportedDecoratorExport, node);
      }
      this.parseExportFrom(node, isFromRequired);
    } else {
      hasDeclaration = this.maybeParseExportDeclaration(node);
    }
    if (isFromRequired || hasSpecifiers || hasDeclaration) {
      const node2 = node;
      this.checkExport(node2, true, false, !!node2.source);
      if (node2.declaration?.type === "ClassDeclaration") {
        this.maybeTakeDecorators(decorators, node2.declaration, node2);
      } else if (decorators) {
        throw this.raise(Errors.UnsupportedDecoratorExport, node);
      }
      this.sawUnambiguousESM = true;
      return this.finishNode(node2, "ExportNamedDeclaration");
    }
    if (this.eat(61)) {
      const node2 = node;
      const decl = this.parseExportDefaultExpression();
      node2.declaration = decl;
      if (decl.type === "ClassDeclaration") {
        this.maybeTakeDecorators(decorators, decl, node2);
      } else if (decorators) {
        throw this.raise(Errors.UnsupportedDecoratorExport, node);
      }
      this.checkExport(node2, true, true);
      this.sawUnambiguousESM = true;
      return this.finishNode(node2, "ExportDefaultDeclaration");
    }
    throw this.unexpected(null, 2);
  }
  eatExportStar(_) {
    return this.eat(51);
  }
  maybeParseExportDefaultSpecifier(node, maybeDefaultIdentifier) {
    if (maybeDefaultIdentifier || this.isExportDefaultSpecifier()) {
      this.expectPlugin("exportDefaultFrom", maybeDefaultIdentifier?.start);
      const id = maybeDefaultIdentifier || this.parseIdentifier(true);
      const specifier = this.startNodeAtNode(id);
      specifier.exported = id;
      node.specifiers = [this.finishNode(specifier, "ExportDefaultSpecifier")];
      return true;
    }
    return false;
  }
  maybeParseExportNamespaceSpecifier(node) {
    if (this.isContextual(89)) {
      node.specifiers ??= [];
      const specifier = this.startNodeAt(this.state.lastTokStartLoc);
      this.next();
      specifier.exported = this.parseModuleExportName();
      node.specifiers.push(this.finishNode(specifier, "ExportNamespaceSpecifier"));
      return true;
    }
    return false;
  }
  maybeParseExportNamedSpecifiers(node) {
    if (this.match(2)) {
      const node2 = node;
      if (!node2.specifiers) node2.specifiers = [];
      const isTypeExport = node2.exportKind === "type";
      node2.specifiers.push(...this.parseExportSpecifiers(isTypeExport));
      node2.source = null;
      node2.attributes = [];
      node2.declaration = null;
      return true;
    }
    return false;
  }
  maybeParseExportDeclaration(node) {
    if (this.shouldParseExportDeclaration()) {
      node.specifiers = [];
      node.source = null;
      node.attributes = [];
      node.declaration = this.parseExportDeclaration(node);
      return true;
    }
    return false;
  }
  isAsyncFunction() {
    if (!this.isContextual(91)) return false;
    const next = this.nextTokenInLineStart();
    return this.isUnparsedContextual(next, "function");
  }
  parseExportDefaultExpression() {
    const expr = this.startNode();
    if (this.match(64)) {
      this.next();
      return this.parseFunction(expr, 1 | 4);
    } else if (this.isAsyncFunction()) {
      this.next();
      this.next();
      return this.parseFunction(expr, 1 | 4 | 8);
    }
    if (this.match(76)) {
      return this.parseClass(expr, true, true);
    }
    if (this.match(22)) {
      return this.parseClass(this.maybeTakeDecorators(this.parseDecorators(false), this.startNode()), true, true);
    }
    if (this.match(71) || this.match(70) || this.isLet() || this.isUsing() || this.isAwaitUsing()) {
      throw this.raise(Errors.UnsupportedDefaultExport, this.state.startLoc);
    }
    const res = this.parseMaybeAssignAllowIn();
    this.semicolon();
    return res;
  }
  parseExportDeclaration(node) {
    if (this.match(76)) {
      const node2 = this.parseClass(this.startNode(), true, false);
      return node2;
    }
    return this.parseStatementListItem();
  }
  isExportDefaultSpecifier() {
    const {
      type
    } = this.state;
    if (tokenIsIdentifier(type)) {
      if (type === 91 && !this.state.containsEsc || type === 96) {
        return false;
      }
      if ((type === 126 || type === 125) && !this.state.containsEsc) {
        const next2 = this.nextTokenStart();
        const nextChar = this.input.charCodeAt(next2);
        if (nextChar === 123 || this.chStartsBindingIdentifier(nextChar, next2) && !this.input.startsWith("from", next2)) {
          this.expectOnePlugin(["flow", "typescript"]);
          return false;
        }
      }
    } else if (!this.match(61)) {
      return false;
    }
    const next = this.nextTokenStart();
    const hasFrom = this.isUnparsedContextual(next, "from");
    if (this.input.charCodeAt(next) === 44 || tokenIsIdentifier(this.state.type) && hasFrom) {
      return true;
    }
    if (this.match(61) && hasFrom) {
      const nextAfterFrom = this.input.charCodeAt(this.nextTokenStartSince(next + 4));
      return nextAfterFrom === 34 || nextAfterFrom === 39;
    }
    return false;
  }
  parseExportFrom(node, expect) {
    if (this.eatContextual(94)) {
      node.source = this.parseImportSource();
      this.checkExport(node);
      this.maybeParseImportAttributes(node);
    } else if (expect) {
      this.unexpected();
    }
    this.semicolon();
  }
  shouldParseExportDeclaration() {
    const {
      type
    } = this.state;
    if (type === 22) {
      this.expectOnePlugin(["decorators", "decorators-legacy"]);
      if (this.hasPlugin("decorators")) {
        return true;
      }
    }
    if (this.isUsing()) {
      this.raise(Errors.UsingDeclarationExport, this.state.startLoc);
      return true;
    }
    if (this.isAwaitUsing()) {
      this.raise(Errors.UsingDeclarationExport, this.state.startLoc);
      return true;
    }
    return type === 70 || type === 71 || type === 64 || type === 76 || this.isLet() || this.isAsyncFunction();
  }
  checkExport(node, checkNames, isDefault, isFrom) {
    if (checkNames) {
      if (isDefault) {
        this.checkDuplicateExports(node, "default");
        if (this.hasPlugin("exportDefaultFrom")) {
          const declaration = node.declaration;
          if (declaration.type === "Identifier" && declaration.name === "from" && declaration.end - declaration.start === 4 && !declaration.extra?.parenthesized) {
            this.raise(Errors.ExportDefaultFromAsIdentifier, declaration);
          }
        }
      } else if (node.specifiers?.length) {
        for (const specifier of node.specifiers) {
          const {
            exported
          } = specifier;
          const exportName = exported.type === "Identifier" ? exported.name : exported.value;
          this.checkDuplicateExports(specifier, exportName);
          if (!isFrom && specifier.local) {
            const {
              local
            } = specifier;
            if (local.type !== "Identifier") {
              this.raise(Errors.ExportBindingIsString, specifier, {
                localName: local.value,
                exportName
              });
            } else {
              this.checkReservedWord(local.name, local.start, true, false);
              this.scope.checkLocalExport(local);
            }
          }
        }
      } else if (node.declaration) {
        const decl = node.declaration;
        if (decl.type === "FunctionDeclaration" || decl.type === "ClassDeclaration") {
          const {
            id
          } = decl;
          if (!id) throw new Error("Assertion failure");
          this.checkDuplicateExports(node, id.name);
        } else if (decl.type === "VariableDeclaration") {
          for (const declaration of decl.declarations) {
            this.checkDeclaration(declaration.id);
          }
        }
      }
    }
  }
  checkDeclaration(node) {
    if (node.type === "Identifier") {
      this.checkDuplicateExports(node, node.name);
    } else if (node.type === "ObjectPattern") {
      for (const prop of node.properties) {
        this.checkDeclaration(prop);
      }
    } else if (node.type === "ArrayPattern") {
      for (const elem of node.elements) {
        if (elem) {
          this.checkDeclaration(elem);
        }
      }
    } else if (node.type === "ObjectProperty") {
      this.checkDeclaration(node.value);
    } else if (node.type === "RestElement") {
      this.checkDeclaration(node.argument);
    } else if (node.type === "AssignmentPattern") {
      this.checkDeclaration(node.left);
    }
  }
  checkDuplicateExports(node, exportName) {
    if (this.exportedIdentifiers.has(exportName)) {
      if (exportName === "default") {
        this.raise(Errors.DuplicateDefaultExport, node);
      } else {
        this.raise(Errors.DuplicateExport, node, {
          exportName
        });
      }
    }
    this.exportedIdentifiers.add(exportName);
  }
  parseExportSpecifiers(isInTypeExport) {
    const nodes = [];
    let first = true;
    this.expect(2);
    while (!this.eat(4)) {
      if (first) {
        first = false;
      } else {
        this.expect(8);
        if (this.eat(4)) break;
      }
      const isMaybeTypeOnly = this.isContextual(126);
      const isString = this.match(130);
      const node = this.startNode();
      node.local = this.parseModuleExportName();
      nodes.push(this.parseExportSpecifier(node, isString, isInTypeExport, isMaybeTypeOnly));
    }
    return nodes;
  }
  parseExportSpecifier(node, isString, isInTypeExport, isMaybeTypeOnly) {
    if (this.eatContextual(89)) {
      node.exported = this.parseModuleExportName();
    } else if (isString) {
      node.exported = this.cloneStringLiteral(node.local);
    } else if (!node.exported) {
      node.exported = this.cloneIdentifier(node.local);
    }
    return this.finishNode(node, "ExportSpecifier");
  }
  parseModuleExportName() {
    if (this.match(130)) {
      const result = this.parseStringLiteral(this.state.value);
      const surrogate = loneSurrogate.exec(result.value);
      if (surrogate) {
        this.raise(Errors.ModuleExportNameHasLoneSurrogate, result, {
          surrogateCharCode: surrogate[0].charCodeAt(0)
        });
      }
      return result;
    }
    return this.parseIdentifier(true);
  }
  checkImportPhase(node) {
    const {
      specifiers
    } = node;
    const singleBindingType = specifiers.length === 1 ? specifiers[0].type : null;
    if (node.phase === "source") {
      if (singleBindingType !== "ImportDefaultSpecifier") {
        this.raise(Errors.SourcePhaseImportRequiresDefault, specifiers[0]);
      }
    } else if (node.phase === "defer") {
      if (singleBindingType !== "ImportNamespaceSpecifier") {
        this.raise(Errors.DeferImportRequiresNamespace, specifiers[0]);
      }
    }
  }
  isPotentialImportPhase(isExport) {
    if (isExport) return false;
    return this.isContextual(101) || this.isContextual(93);
  }
  applyImportPhase(node, isExport, phase, loc) {
    if (isExport) {
      return;
    }
    if (phase === "source") {
      this.expectPlugin("sourcePhaseImports", loc);
      node.phase = "source";
    } else if (phase === "defer") {
      this.expectPlugin("deferredImportEvaluation", loc);
      node.phase = "defer";
    } else if (this.hasPlugin("sourcePhaseImports")) {
      node.phase = null;
    }
  }
  parseMaybeImportPhase(node, isExport) {
    if (!this.isPotentialImportPhase(isExport)) {
      this.applyImportPhase(node, isExport, null);
      return null;
    }
    const phaseIdentifier = this.startNode();
    const phaseIdentifierName = this.parseIdentifierName(true);
    const {
      type
    } = this.state;
    const isImportPhase = tokenIsKeywordOrIdentifier(type) ? type !== 94 || this.lookaheadCharCode() === 102 : type !== 8;
    if (isImportPhase) {
      this.applyImportPhase(node, isExport, phaseIdentifierName, phaseIdentifier.start);
      return null;
    } else {
      this.applyImportPhase(node, isExport, null);
      return this.createIdentifier(phaseIdentifier, phaseIdentifierName);
    }
  }
  isPrecedingIdImportPhase(phase) {
    const {
      type
    } = this.state;
    return tokenIsIdentifier(type) ? type !== 94 || this.lookaheadCharCode() === 102 : type !== 8;
  }
  parseImport(node) {
    if (this.match(130)) {
      return this.parseImportSourceAndAttributes(node);
    }
    return this.parseImportSpecifiersAndAfter(node, this.parseMaybeImportPhase(node, false));
  }
  parseImportSpecifiersAndAfter(node, maybeDefaultIdentifier) {
    node.specifiers = [];
    const hasDefault = this.maybeParseDefaultImportSpecifier(node, maybeDefaultIdentifier);
    const parseNext = !hasDefault || this.eat(8);
    const hasStar = parseNext && this.maybeParseStarImportSpecifier(node);
    if (parseNext && !hasStar) this.parseNamedImportSpecifiers(node);
    this.expectContextual(94);
    return this.parseImportSourceAndAttributes(node);
  }
  parseImportSourceAndAttributes(node) {
    node.specifiers ??= [];
    node.source = this.parseImportSource();
    this.maybeParseImportAttributes(node);
    this.checkImportPhase(node);
    this.semicolon();
    this.sawUnambiguousESM = true;
    return this.finishNode(node, "ImportDeclaration");
  }
  parseImportSource() {
    if (!this.match(130)) this.unexpected();
    return this.parseExprAtom();
  }
  parseImportSpecifierLocal(node, specifier, type) {
    specifier.local = this.parseIdentifier();
    node.specifiers.push(this.finishImportSpecifier(specifier, type));
  }
  finishImportSpecifier(specifier, type, bindingType = 8201) {
    this.checkLVal(specifier.local, {
      type
    }, bindingType);
    return this.finishNode(specifier, type);
  }
  parseImportAttributes() {
    this.expect(2);
    const attrs = [];
    const attrNames = /* @__PURE__ */ new Set();
    do {
      if (this.match(4)) {
        break;
      }
      const node = this.startNode();
      const keyName = this.state.value;
      if (attrNames.has(keyName)) {
        this.raise(Errors.ModuleAttributesWithDuplicateKeys, this.state.startLoc, {
          key: keyName
        });
      }
      attrNames.add(keyName);
      if (this.match(130)) {
        node.key = this.parseStringLiteral(keyName);
      } else {
        node.key = this.parseIdentifier(true);
      }
      this.expect(10);
      if (!this.match(130)) {
        throw this.raise(Errors.ModuleAttributeInvalidValue, this.state.startLoc);
      }
      node.value = this.parseStringLiteral(this.state.value);
      attrs.push(this.finishNode(node, "ImportAttribute"));
    } while (this.eat(8));
    this.expect(4);
    return attrs;
  }
  maybeParseImportAttributes(node) {
    let attributes;
    if (this.match(72)) {
      if (this.hasPrecedingLineBreak() && this.lookaheadCharCode() === 40) {
        return;
      }
      this.next();
      attributes = this.parseImportAttributes();
    } else {
      attributes = [];
    }
    node.attributes = attributes;
  }
  maybeParseDefaultImportSpecifier(node, maybeDefaultIdentifier) {
    if (maybeDefaultIdentifier) {
      const specifier = this.startNodeAtNode(maybeDefaultIdentifier);
      specifier.local = maybeDefaultIdentifier;
      node.specifiers.push(this.finishImportSpecifier(specifier, "ImportDefaultSpecifier"));
      return true;
    } else if (tokenIsKeywordOrIdentifier(this.state.type)) {
      this.parseImportSpecifierLocal(node, this.startNode(), "ImportDefaultSpecifier");
      return true;
    }
    return false;
  }
  maybeParseStarImportSpecifier(node) {
    if (this.match(51)) {
      const specifier = this.startNode();
      this.next();
      this.expectContextual(89);
      this.parseImportSpecifierLocal(node, specifier, "ImportNamespaceSpecifier");
      return true;
    }
    return false;
  }
  parseNamedImportSpecifiers(node) {
    let first = true;
    this.expect(2);
    while (!this.eat(4)) {
      if (first) {
        first = false;
      } else {
        if (this.eat(10)) {
          throw this.raise(Errors.DestructureNamedImport, this.state.startLoc);
        }
        this.expect(8);
        if (this.eat(4)) break;
      }
      const specifier = this.startNode();
      const importedIsString = this.match(130);
      const isMaybeTypeOnly = this.isContextual(126);
      specifier.imported = this.parseModuleExportName();
      const importSpecifier = this.parseImportSpecifier(specifier, importedIsString, node.importKind === "type" || node.importKind === "typeof", isMaybeTypeOnly, void 0);
      node.specifiers.push(importSpecifier);
    }
  }
  parseImportSpecifier(specifier, importedIsString, isInTypeOnlyImport, isMaybeTypeOnly, bindingType) {
    if (this.eatContextual(89)) {
      specifier.local = this.parseIdentifier();
    } else {
      const {
        imported
      } = specifier;
      if (importedIsString) {
        throw this.raise(Errors.ImportBindingIsString, specifier, {
          importName: imported.value
        });
      }
      this.checkReservedWord(imported.name, specifier.start, true, true);
      if (!specifier.local) {
        specifier.local = this.cloneIdentifier(imported);
      }
    }
    return this.finishImportSpecifier(specifier, "ImportSpecifier", bindingType);
  }
  isThisParam(param) {
    return param.type === "Identifier" && param.name === "this";
  }
};
var keywordAndTSRelationalOperator = /in(?:stanceof)?|as|satisfies/y;
function nonNull(x) {
  if (x == null) {
    throw new Error(`Unexpected ${x} value.`);
  }
  return x;
}
function assert(x) {
  if (!x) {
    throw new Error("Assert fail");
  }
}
var TSErrorTemplates = {
  AbstractMethodHasImplementation: ({
    methodName
  }) => `Method '${methodName}' cannot have an implementation because it is marked abstract.`,
  AbstractPropertyHasInitializer: ({
    propertyName
  }) => `Property '${propertyName}' cannot have an initializer because it is marked abstract.`,
  AccessorCannotBeOptional: "An 'accessor' property cannot be declared optional.",
  AccessorCannotDeclareThisParameter: "'get' and 'set' accessors cannot declare 'this' parameters.",
  AccessorCannotHaveTypeParameters: "An accessor cannot have type parameters.",
  ClassMethodHasDeclare: "Class methods cannot have the 'declare' modifier.",
  ClassMethodHasReadonly: "Class methods cannot have the 'readonly' modifier.",
  ConstInitializerMustBeStringOrNumericLiteralOrLiteralEnumReference: "A 'const' initializer in an ambient context must be a string or numeric literal or literal enum reference.",
  ConstructorHasTypeParameters: "Type parameters cannot appear on a constructor declaration.",
  DeclareAccessor: ({
    kind
  }) => `'declare' is not allowed in ${kind}ters.`,
  DeclareClassFieldHasInitializer: "Initializers are not allowed in ambient contexts.",
  DeclareFunctionHasImplementation: "An implementation cannot be declared in ambient contexts.",
  DecoratorAbstractMethod: ({
    kind
  }) => `Decorators can't be used with ${kind.startsWith("a") ? "an" : "a"} ${kind}.`,
  DuplicateAccessibilityModifier: ({
    modifier
  }) => `Accessibility modifier already seen: '${modifier}'.`,
  DuplicateModifier: ({
    modifier
  }) => `Duplicate modifier: '${modifier}'.`,
  EmptyHeritageClauseType: ({
    token
  }) => `'${token}' list cannot be empty.`,
  EmptyTypeArguments: "Type argument list cannot be empty.",
  EmptyTypeParameters: "Type parameter list cannot be empty.",
  ExpectedAmbientAfterExportDeclare: "'export declare' must be followed by an ambient declaration.",
  ExportAssignmentInTSNamespace: "An export assignment cannot be used in a namespace.",
  ExportInTSNamespace: "Export declarations are not permitted in a namespace.",
  ImportAliasHasImportType: "An import alias can not use 'import type'.",
  ImportInTSNamespace: "Import declarations in a namespace cannot reference a module.",
  IncompatibleModifiers: ({
    modifiers
  }) => `'${modifiers[0]}' modifier cannot be used with '${modifiers[1]}' modifier.`,
  IndexSignatureHasAbstract: "Index signatures cannot have the 'abstract' modifier.",
  IndexSignatureHasAccessibility: ({
    modifier
  }) => `Index signatures cannot have an accessibility modifier ('${modifier}').`,
  IndexSignatureHasDeclare: "Index signatures cannot have the 'declare' modifier.",
  IndexSignatureHasOverride: "'override' modifier cannot appear on an index signature.",
  IndexSignatureHasStatic: "Index signatures cannot have the 'static' modifier.",
  InitializerNotAllowedInAmbientContext: "Initializers are not allowed in ambient contexts.",
  InlineModuleDeclarationMustUseString: "`module ... {}` declarations must have a string name. Use `namespace ... {}` instead.",
  InvalidHeritageClauseType: ({
    token
  }) => `'${token}' list can only include identifiers or qualified-names with optional type arguments.`,
  InvalidModifierOnAwaitUsingDeclaration: (modifier) => `'${modifier}' modifier cannot appear on an await using declaration.`,
  InvalidModifierOnTypeMember: ({
    modifier
  }) => `'${modifier}' modifier cannot appear on a type member.`,
  InvalidModifierOnTypeParameter: ({
    modifier
  }) => `'${modifier}' modifier cannot appear on a type parameter.`,
  InvalidModifierOnTypeParameterPositions: ({
    modifier
  }) => `'${modifier}' modifier can only appear on a type parameter of a class, interface or type alias.`,
  InvalidModifierOnUsingDeclaration: (modifier) => `'${modifier}' modifier cannot appear on a using declaration.`,
  InvalidModifiersOrder: ({
    orderedModifiers
  }) => `'${orderedModifiers[0]}' modifier must precede '${orderedModifiers[1]}' modifier.`,
  InvalidPropertyAccessAfterInstantiationExpression: "Invalid property access after an instantiation expression. You can either wrap the instantiation expression in parentheses, or delete the type arguments.",
  InvalidTupleMemberLabel: "Tuple members must be labeled with a simple identifier.",
  MissingInterfaceName: "'interface' declarations must be followed by an identifier.",
  NamespaceExportInTSNamespace: "Global module exports may only appear at top level.",
  NonAbstractClassHasAbstractMethod: "Abstract methods can only appear within an abstract class.",
  NonClassMethodPropertyHasAbstractModifier: "'abstract' modifier can only appear on a class, method, or property declaration.",
  OptionalTypeBeforeRequired: "A required element cannot follow an optional element.",
  OverrideNotInSubClass: "This member cannot have an 'override' modifier because its containing class does not extend another class.",
  PatternIsOptional: "A binding pattern parameter cannot be optional in an implementation signature.",
  PrivateElementHasAbstract: "Private elements cannot have the 'abstract' modifier.",
  PrivateElementHasAccessibility: ({
    modifier
  }) => `Private elements cannot have an accessibility modifier ('${modifier}').`,
  ReadonlyForMethodSignature: "'readonly' modifier can only appear on a property declaration or index signature.",
  ReservedArrowTypeParam: "This syntax is reserved in files with the .mts or .cts extension. Add a trailing comma, as in `<T,>() => ...`.",
  ReservedTypeAssertion: "This syntax is reserved in files with the .mts or .cts extension. Use an `as` expression instead.",
  SetAccessorCannotHaveOptionalParameter: "A 'set' accessor cannot have an optional parameter.",
  SetAccessorCannotHaveRestParameter: "A 'set' accessor cannot have rest parameter.",
  SetAccessorCannotHaveReturnType: "A 'set' accessor cannot have a return type annotation.",
  SingleTypeParameterWithoutTrailingComma: ({
    typeParameterName
  }) => `Single type parameter ${typeParameterName} should have a trailing comma. Example usage: <${typeParameterName},>.`,
  StaticBlockCannotHaveModifier: "Static class blocks cannot have any modifier.",
  TupleOptionalAfterType: "A labeled tuple optional element must be declared using a question mark after the name and before the colon (`name?: type`), rather than after the type (`name: type?`).",
  TypeAnnotationAfterAssign: "Type annotations must come before default assignments, e.g. instead of `age = 25: number` use `age: number = 25`.",
  TypeImportCannotSpecifyDefaultAndNamed: "A type-only import can specify a default import or named bindings, but not both.",
  TypeModifierIsUsedInTypeExports: "The 'type' modifier cannot be used on a named export when 'export type' is used on its export statement.",
  TypeModifierIsUsedInTypeImports: "The 'type' modifier cannot be used on a named import when 'import type' is used on its import statement.",
  UnexpectedParameterInitializer: "A parameter initializer is only allowed in a function or constructor implementation.",
  UnexpectedParameterModifier: "A parameter property is only allowed in a constructor implementation.",
  UnexpectedReadonly: "'readonly' type modifier is only permitted on array and tuple literal types.",
  UnexpectedTypeAnnotation: "Did not expect a type annotation here.",
  UnexpectedTypeCastInParameter: "Unexpected type cast in parameter position.",
  UnexpectedTypeDeclaration: (type) => `'${type}' declarations can only be declared inside a block.`,
  UnsupportedImportTypeArgument: "Argument in a type import must be a string literal.",
  UnsupportedParameterPropertyKind: "A parameter property may not be declared using a binding pattern.",
  UnsupportedSignatureParameterKind: ({
    type
  }) => `Name in a signature must be an Identifier, ObjectPattern or ArrayPattern, instead got ${type}.`,
  UsingDeclarationInAmbientContext: (kind) => `'${kind}' declarations are not allowed in ambient contexts.`
};
var TSErrors = ParseErrorEnum`typescript`(TSErrorTemplates);
function keywordTypeFromName(value) {
  switch (value) {
    case "any":
      return "TSAnyKeyword";
    case "boolean":
      return "TSBooleanKeyword";
    case "bigint":
      return "TSBigIntKeyword";
    case "never":
      return "TSNeverKeyword";
    case "number":
      return "TSNumberKeyword";
    case "object":
      return "TSObjectKeyword";
    case "string":
      return "TSStringKeyword";
    case "symbol":
      return "TSSymbolKeyword";
    case "undefined":
      return "TSUndefinedKeyword";
    case "unknown":
      return "TSUnknownKeyword";
    default:
      return void 0;
  }
}
function tsIsAccessModifier(modifier) {
  return modifier === "private" || modifier === "public" || modifier === "protected";
}
function tsIsVarianceAnnotations(modifier) {
  return modifier === "in" || modifier === "out";
}
function tsIsEntityName(node) {
  if (node.extra?.parenthesized) {
    return false;
  }
  switch (node.type) {
    case "Identifier":
      return true;
    case "MemberExpression":
      return !node.computed && tsIsEntityName(node.object);
    case "TSInstantiationExpression":
      return tsIsEntityName(node.expression);
    default:
      return false;
  }
}
var typescript = (superClass) => class TypeScriptParserMixin extends superClass {
  getScopeHandler() {
    return TypeScriptScopeHandler;
  }
  tsIsIdentifier() {
    return tokenIsIdentifier(this.state.type);
  }
  tsTokenCanFollowModifier() {
    return this.match(0) || this.match(2) || this.match(51) || this.match(17) || this.match(134) || this.isLiteralPropertyName();
  }
  tsNextTokenOnSameLineAndCanFollowModifier() {
    this.next();
    if (this.hasPrecedingLineBreak()) {
      return false;
    }
    return this.tsTokenCanFollowModifier();
  }
  tsNextTokenCanFollowModifier() {
    if (this.match(102)) {
      this.next();
      return this.tsTokenCanFollowModifier();
    }
    return this.tsNextTokenOnSameLineAndCanFollowModifier();
  }
  tsParseModifier(allowedModifiers, stopOnStartOfClassStaticBlock, hasSeenStaticModifier) {
    if (!tokenIsIdentifier(this.state.type) && this.state.type !== 54 && this.state.type !== 71) {
      return void 0;
    }
    const modifier = this.state.value;
    if (allowedModifiers.includes(modifier)) {
      if (hasSeenStaticModifier && this.match(102)) {
        return void 0;
      }
      if (stopOnStartOfClassStaticBlock && this.tsIsStartOfStaticBlocks()) {
        return void 0;
      }
      if (this.tsTryParse(this.tsNextTokenCanFollowModifier.bind(this))) {
        return modifier;
      }
    }
    return void 0;
  }
  tsParseModifiers({
    allowedModifiers,
    disallowedModifiers,
    stopOnStartOfClassStaticBlock,
    errorTemplate = TSErrors.InvalidModifierOnTypeMember
  }, modified) {
    const enforceOrder = (loc, modifier, before, after) => {
      if (modifier === before && modified[after]) {
        this.raise(TSErrors.InvalidModifiersOrder, loc, {
          orderedModifiers: [before, after]
        });
      }
    };
    const incompatible = (loc, modifier, mod1, mod2) => {
      if (modified[mod1] && modifier === mod2 || modified[mod2] && modifier === mod1) {
        this.raise(TSErrors.IncompatibleModifiers, loc, {
          modifiers: [mod1, mod2]
        });
      }
    };
    for (; ; ) {
      const {
        startLoc
      } = this.state;
      const modifier = this.tsParseModifier(allowedModifiers.concat(disallowedModifiers ?? []), stopOnStartOfClassStaticBlock, modified.static);
      if (!modifier) break;
      if (tsIsAccessModifier(modifier)) {
        if (modified.accessibility) {
          this.raise(TSErrors.DuplicateAccessibilityModifier, startLoc, {
            modifier
          });
        } else {
          enforceOrder(startLoc, modifier, modifier, "override");
          enforceOrder(startLoc, modifier, modifier, "static");
          enforceOrder(startLoc, modifier, modifier, "readonly");
          modified.accessibility = modifier;
        }
      } else if (tsIsVarianceAnnotations(modifier)) {
        if (modified[modifier]) {
          this.raise(TSErrors.DuplicateModifier, startLoc, {
            modifier
          });
        }
        modified[modifier] = true;
        enforceOrder(startLoc, modifier, "in", "out");
      } else {
        if (Object.hasOwn(modified, modifier)) {
          this.raise(TSErrors.DuplicateModifier, startLoc, {
            modifier
          });
        } else {
          enforceOrder(startLoc, modifier, "static", "readonly");
          enforceOrder(startLoc, modifier, "static", "override");
          enforceOrder(startLoc, modifier, "override", "readonly");
          enforceOrder(startLoc, modifier, "abstract", "override");
          incompatible(startLoc, modifier, "declare", "override");
          incompatible(startLoc, modifier, "static", "abstract");
        }
        modified[modifier] = true;
      }
      if (disallowedModifiers?.includes(modifier)) {
        this.raise(errorTemplate, startLoc, {
          modifier
        });
      }
    }
  }
  tsIsListTerminator(kind) {
    switch (kind) {
      case "EnumMembers":
      case "TypeMembers":
        return this.match(4);
      case "HeritageClauseElement":
        return this.match(2);
      case "TupleElementTypes":
        return this.match(1);
      case "TypeParametersOrArguments":
        return this.match(44);
    }
  }
  tsParseList(kind, parseElement) {
    const result = [];
    while (!this.tsIsListTerminator(kind)) {
      result.push(parseElement());
    }
    return result;
  }
  tsParseDelimitedList(kind, parseElement, refTrailingCommaPos) {
    return nonNull(this.tsParseDelimitedListWorker(kind, parseElement, true, refTrailingCommaPos));
  }
  tsParseDelimitedListWorker(kind, parseElement, expectSuccess, refTrailingCommaPos) {
    const result = [];
    let trailingCommaPos = -1;
    for (; ; ) {
      if (this.tsIsListTerminator(kind)) {
        break;
      }
      trailingCommaPos = -1;
      const element = parseElement();
      if (element == null) {
        return void 0;
      }
      result.push(element);
      if (this.eat(8)) {
        trailingCommaPos = this.state.lastTokStartLoc.index;
        continue;
      }
      if (this.tsIsListTerminator(kind)) {
        break;
      }
      if (expectSuccess) {
        this.expect(8);
      }
      return void 0;
    }
    if (refTrailingCommaPos) {
      refTrailingCommaPos.value = trailingCommaPos;
    }
    return result;
  }
  tsParseBracketedList(kind, parseElement, bracket, skipFirstToken, refTrailingCommaPos) {
    if (!skipFirstToken) {
      if (bracket) {
        this.expect(0);
      } else {
        this.expect(43);
      }
    }
    const result = this.tsParseDelimitedList(kind, parseElement, refTrailingCommaPos);
    if (bracket) {
      this.expect(1);
    } else {
      this.expect(44);
    }
    return result;
  }
  tsParseImportType() {
    const node = this.startNode();
    this.expect(79);
    this.expect(6);
    if (!this.match(130)) {
      this.raise(TSErrors.UnsupportedImportTypeArgument, this.state.startLoc);
      node.source = this.tsParseNonConditionalType();
    } else {
      node.source = this.parseStringLiteral(this.state.value);
    }
    if (this.eat(8)) {
      node.options = this.tsParseImportTypeOptions();
    } else {
      node.options = null;
    }
    this.expect(7);
    if (this.eat(12)) {
      node.qualifier = this.tsParseEntityName(1 | 2);
    }
    if (this.match(43)) {
      node.typeArguments = this.tsParseTypeArguments();
    }
    return this.finishNode(node, "TSImportType");
  }
  tsParseImportTypeOptions() {
    const node = this.startNode();
    this.expect(2);
    const withProperty = this.startNode();
    if (this.isContextual(72)) {
      withProperty.method = false;
      withProperty.key = this.parseIdentifier(true);
      withProperty.computed = false;
      withProperty.shorthand = false;
    } else {
      this.unexpected(null, 72);
    }
    this.expect(10);
    withProperty.value = this.tsParseImportTypeWithPropertyValue();
    node.properties = [this.finishObjectProperty(withProperty)];
    this.eat(8);
    this.expect(4);
    return this.finishNode(node, "ObjectExpression");
  }
  tsParseImportTypeWithPropertyValue() {
    const node = this.startNode();
    const properties = [];
    this.expect(2);
    while (!this.match(4)) {
      const type = this.state.type;
      if (tokenIsIdentifier(type) || type === 130) {
        properties.push(super.parsePropertyDefinition(null));
      } else {
        this.unexpected();
      }
      this.eat(8);
    }
    node.properties = properties;
    this.next();
    return this.finishNode(node, "ObjectExpression");
  }
  tsParseEntityName(flags) {
    let entity;
    if (flags & 1 && this.match(74)) {
      if (flags & 2) {
        entity = this.parseIdentifier(true);
      } else {
        const node = this.startNode();
        this.next();
        entity = this.finishNode(node, "ThisExpression");
      }
    } else {
      entity = this.parseIdentifier(!!(flags & 1));
    }
    while (this.eat(12)) {
      const node = this.startNodeAtNode(entity);
      node.left = entity;
      node.right = this.parseIdentifier(!!(flags & 1));
      entity = this.finishNode(node, "TSQualifiedName");
    }
    return entity;
  }
  tsParseTypeReference() {
    const node = this.startNode();
    node.typeName = this.tsParseEntityName(1);
    if (!this.hasPrecedingLineBreak() && this.match(43)) {
      node.typeArguments = this.tsParseTypeArguments();
    }
    return this.finishNode(node, "TSTypeReference");
  }
  tsParseThisTypePredicate(lhs) {
    this.next();
    const node = this.startNodeAtNode(lhs);
    node.parameterName = lhs;
    node.typeAnnotation = this.tsParseTypeAnnotation(false);
    node.asserts = false;
    return this.finishNode(node, "TSTypePredicate");
  }
  tsParseThisTypeNode() {
    const node = this.startNode();
    this.next();
    return this.finishNode(node, "TSThisType");
  }
  tsParseTypeQuery() {
    const node = this.startNode();
    this.expect(83);
    if (this.match(79)) {
      node.exprName = this.tsParseImportType();
    } else {
      node.exprName = this.tsParseEntityName(1);
    }
    if (!this.hasPrecedingLineBreak() && this.match(43)) {
      node.typeArguments = this.tsParseTypeArguments();
    }
    return this.finishNode(node, "TSTypeQuery");
  }
  tsParseInOutModifiers = this.tsParseModifiers.bind(this, {
    allowedModifiers: ["in", "out"],
    disallowedModifiers: ["const", "public", "private", "protected", "readonly", "declare", "abstract", "override"],
    errorTemplate: TSErrors.InvalidModifierOnTypeParameter
  });
  tsParseConstModifier = this.tsParseModifiers.bind(this, {
    allowedModifiers: ["const"],
    disallowedModifiers: ["in", "out"],
    errorTemplate: TSErrors.InvalidModifierOnTypeParameterPositions
  });
  tsParseInOutConstModifiers = this.tsParseModifiers.bind(this, {
    allowedModifiers: ["in", "out", "const"],
    disallowedModifiers: ["public", "private", "protected", "readonly", "declare", "abstract", "override"],
    errorTemplate: TSErrors.InvalidModifierOnTypeParameter
  });
  tsParseTypeParameter(parseModifiers) {
    const node = this.startNode();
    parseModifiers(node);
    node.name = this.tsParseTypeParameterName();
    node.constraint = this.tsEatThenParseType(77);
    node.default = this.tsEatThenParseType(25);
    return this.finishNode(node, "TSTypeParameter");
  }
  tsTryParseTypeParameters(parseModifiers) {
    if (this.match(43)) {
      return this.tsParseTypeParameters(parseModifiers);
    }
  }
  tsParseTypeParameters(parseModifiers) {
    const node = this.startNode();
    if (this.match(43) || this.match(138)) {
      this.next();
    } else {
      this.unexpected();
    }
    const refTrailingCommaPos = {
      value: -1
    };
    node.params = this.tsParseBracketedList("TypeParametersOrArguments", this.tsParseTypeParameter.bind(this, parseModifiers), false, true, refTrailingCommaPos);
    if (node.params.length === 0) {
      this.raise(TSErrors.EmptyTypeParameters, node);
    }
    if (refTrailingCommaPos.value !== -1) {
      this.addExtra(node, "trailingComma", refTrailingCommaPos.value);
    }
    return this.finishNode(node, "TSTypeParameterDeclaration");
  }
  tsFillSignature(returnToken, signature) {
    const returnTokenRequired = returnToken === 15;
    const paramsKey = "params";
    const returnTypeKey = "returnType";
    signature.typeParameters = this.tsTryParseTypeParameters(this.tsParseConstModifier);
    this.expect(6);
    signature[paramsKey] = this.tsParseBindingListForSignature();
    if (returnTokenRequired) {
      signature[returnTypeKey] = this.tsParseTypeOrTypePredicateAnnotation(returnToken);
    } else if (this.match(returnToken)) {
      signature[returnTypeKey] = this.tsParseTypeOrTypePredicateAnnotation(returnToken);
    }
  }
  tsParseBindingListForSignature() {
    const list = super.parseBindingList(7, 41, 2);
    for (const pattern of list) {
      const {
        type
      } = pattern;
      if (type === "AssignmentPattern" || type === "TSParameterProperty") {
        this.raise(TSErrors.UnsupportedSignatureParameterKind, pattern, {
          type
        });
      }
    }
    return list;
  }
  tsParseTypeMemberSemicolon() {
    if (!this.eat(8) && !this.isLineTerminator()) {
      this.expect(9);
    }
  }
  tsParseSignatureMember(kind, node) {
    this.tsFillSignature(10, node);
    this.tsParseTypeMemberSemicolon();
    return this.finishNode(node, kind);
  }
  tsIsUnambiguouslyIndexSignature() {
    this.next();
    if (tokenIsIdentifier(this.state.type)) {
      this.next();
      return this.match(10);
    }
    return false;
  }
  tsTryParseIndexSignature(node) {
    if (!(this.match(0) && this.tsLookAhead(this.tsIsUnambiguouslyIndexSignature.bind(this)))) {
      return;
    }
    this.expect(0);
    const id = this.parseIdentifier();
    id.typeAnnotation = this.tsParseTypeAnnotation();
    this.resetEndLocation(id);
    this.expect(1);
    node.parameters = [id];
    const type = this.tsTryParseTypeAnnotation();
    if (type) node.typeAnnotation = type;
    this.tsParseTypeMemberSemicolon();
    return this.finishNode(node, "TSIndexSignature");
  }
  tsParsePropertyOrMethodSignature(node, readonly) {
    if (this.eat(13)) node.optional = true;
    if (this.match(6) || this.match(43)) {
      if (readonly) {
        this.raise(TSErrors.ReadonlyForMethodSignature, node);
      }
      const method = node;
      if (method.kind && this.match(43)) {
        this.raise(TSErrors.AccessorCannotHaveTypeParameters, this.state.curPosition());
      }
      this.tsFillSignature(10, method);
      this.tsParseTypeMemberSemicolon();
      if (method.kind === "get") {
        if (method.params.length > 0) {
          this.raise(Errors.BadGetterArity, this.state.curPosition());
          if (this.isThisParam(method.params[0])) {
            this.raise(TSErrors.AccessorCannotDeclareThisParameter, this.state.curPosition());
          }
        }
      } else if (method.kind === "set") {
        if (method.params.length !== 1) {
          this.raise(Errors.BadSetterArity, this.state.curPosition());
        } else {
          const firstParameter = method.params[0];
          if (this.isThisParam(firstParameter)) {
            this.raise(TSErrors.AccessorCannotDeclareThisParameter, this.state.curPosition());
          }
          if (firstParameter.type === "Identifier" && firstParameter.optional) {
            this.raise(TSErrors.SetAccessorCannotHaveOptionalParameter, this.state.curPosition());
          }
          if (firstParameter.type === "RestElement") {
            this.raise(TSErrors.SetAccessorCannotHaveRestParameter, this.state.curPosition());
          }
        }
        if (method.returnType) {
          this.raise(TSErrors.SetAccessorCannotHaveReturnType, method.returnType);
        }
      } else {
        method.kind = "method";
      }
      return this.finishNode(method, "TSMethodSignature");
    } else {
      const property = node;
      if (readonly) property.readonly = true;
      const type = this.tsTryParseTypeAnnotation();
      if (type) property.typeAnnotation = type;
      this.tsParseTypeMemberSemicolon();
      return this.finishNode(property, "TSPropertySignature");
    }
  }
  tsParseTypeMember() {
    const node = this.startNode();
    if (this.match(6) || this.match(43)) {
      return this.tsParseSignatureMember("TSCallSignatureDeclaration", node);
    }
    if (this.match(73)) {
      const id = this.startNode();
      this.next();
      if (this.match(6) || this.match(43)) {
        return this.tsParseSignatureMember("TSConstructSignatureDeclaration", node);
      } else {
        node.key = this.createIdentifier(id, "new");
        return this.tsParsePropertyOrMethodSignature(node, false);
      }
    }
    this.tsParseModifiers({
      allowedModifiers: ["readonly"],
      disallowedModifiers: ["declare", "abstract", "private", "protected", "public", "static", "override"]
    }, node);
    const idx = this.tsTryParseIndexSignature(node);
    if (idx) {
      return idx;
    }
    super.parsePropertyName(node);
    if (!node.computed && node.key.type === "Identifier" && (node.key.name === "get" || node.key.name === "set") && this.tsTokenCanFollowModifier()) {
      node.kind = node.key.name;
      super.parsePropertyName(node);
      if (!this.match(6) && !this.match(43)) {
        this.unexpected(null, 6);
      }
    }
    return this.tsParsePropertyOrMethodSignature(node, !!node.readonly);
  }
  tsParseTypeLiteral() {
    const node = this.startNode();
    node.members = this.tsParseObjectTypeMembers();
    return this.finishNode(node, "TSTypeLiteral");
  }
  tsParseObjectTypeMembers() {
    this.expect(2);
    const members = this.tsParseList("TypeMembers", this.tsParseTypeMember.bind(this));
    this.expect(4);
    return members;
  }
  tsIsStartOfMappedType() {
    this.next();
    if (this.eat(49)) {
      return this.isContextual(118);
    }
    if (this.isContextual(118)) {
      this.next();
    }
    if (!this.match(0)) {
      return false;
    }
    this.next();
    if (!this.tsIsIdentifier()) {
      return false;
    }
    this.next();
    return this.match(54);
  }
  tsParseMappedType() {
    const node = this.startNode();
    this.expect(2);
    if (this.match(49)) {
      node.readonly = this.state.value;
      this.next();
      this.expectContextual(118);
    } else if (this.eatContextual(118)) {
      node.readonly = true;
    }
    this.expect(0);
    node.key = this.tsParseTypeParameterName();
    node.constraint = this.tsExpectThenParseType(54);
    node.nameType = this.eatContextual(89) ? this.tsParseType() : null;
    this.expect(1);
    if (this.match(49)) {
      node.optional = this.state.value;
      this.next();
      this.expect(13);
    } else if (this.eat(13)) {
      node.optional = true;
    }
    node.typeAnnotation = this.tsTryParseType();
    this.semicolon();
    this.expect(4);
    return this.finishNode(node, "TSMappedType");
  }
  tsParseTupleType() {
    const node = this.startNode();
    node.elementTypes = this.tsParseBracketedList("TupleElementTypes", this.tsParseTupleElementType.bind(this), true, false);
    let seenOptionalElement = false;
    node.elementTypes.forEach((elementNode) => {
      const {
        type
      } = elementNode;
      if (seenOptionalElement && type !== "TSRestType" && type !== "TSOptionalType" && !(type === "TSNamedTupleMember" && elementNode.optional)) {
        this.raise(TSErrors.OptionalTypeBeforeRequired, elementNode);
      }
      seenOptionalElement ||= type === "TSNamedTupleMember" && elementNode.optional || type === "TSOptionalType";
    });
    return this.finishNode(node, "TSTupleType");
  }
  tsParseTupleElementType() {
    const restStartLoc = this.state.startLoc;
    const rest = this.eat(17);
    const {
      startLoc
    } = this.state;
    let labeled;
    let label;
    let optional;
    let type;
    const isWord = tokenIsKeywordOrIdentifier(this.state.type);
    const chAfterWord = isWord ? this.lookaheadCharCode() : null;
    if (chAfterWord === 58) {
      labeled = true;
      optional = false;
      label = this.parseIdentifier(true);
      this.expect(10);
      type = this.tsParseType();
    } else if (chAfterWord === 63) {
      optional = true;
      const wordName = this.state.value;
      const typeOrLabel = this.tsParseNonArrayType();
      if (this.lookaheadCharCode() === 58) {
        labeled = true;
        label = this.createIdentifier(this.startNodeAt(startLoc), wordName);
        this.expect(13);
        this.expect(10);
        type = this.tsParseType();
      } else {
        labeled = false;
        type = typeOrLabel;
        this.expect(13);
      }
    } else {
      type = this.tsParseType();
      optional = this.eat(13);
      labeled = this.eat(10);
    }
    if (labeled) {
      let labeledNode;
      if (label) {
        labeledNode = this.startNodeAt(startLoc);
        labeledNode.optional = optional;
        labeledNode.label = label;
        labeledNode.elementType = type;
        if (this.eat(13)) {
          labeledNode.optional = true;
          this.raise(TSErrors.TupleOptionalAfterType, this.state.lastTokStartLoc);
        }
      } else {
        labeledNode = this.startNodeAt(startLoc);
        labeledNode.optional = optional;
        this.raise(TSErrors.InvalidTupleMemberLabel, type);
        labeledNode.label = type;
        labeledNode.elementType = this.tsParseType();
      }
      type = this.finishNode(labeledNode, "TSNamedTupleMember");
    } else if (optional) {
      const optionalTypeNode = this.startNodeAt(startLoc);
      optionalTypeNode.typeAnnotation = type;
      type = this.finishNode(optionalTypeNode, "TSOptionalType");
    }
    if (rest) {
      const restNode = this.startNodeAt(restStartLoc);
      restNode.typeAnnotation = type;
      type = this.finishNode(restNode, "TSRestType");
    }
    return type;
  }
  tsParseParenthesizedType() {
    const node = this.startNode();
    this.expect(6);
    node.typeAnnotation = this.tsParseType();
    this.expect(7);
    return this.finishNode(node, "TSParenthesizedType");
  }
  tsParseFunctionOrConstructorType(type, abstract) {
    const node = this.startNode();
    if (type === "TSConstructorType") {
      node.abstract = !!abstract;
      if (abstract) this.next();
      this.next();
    }
    this.tsInAllowConditionalTypesContext(() => this.tsFillSignature(15, node));
    return this.finishNode(node, type);
  }
  tsParseLiteralTypeNode() {
    const node = this.startNode();
    switch (this.state.type) {
      case 131:
      case 132:
      case 130:
      case 81:
      case 82:
        node.literal = super.parseExprAtom();
        break;
      default:
        this.unexpected();
    }
    return this.finishNode(node, "TSLiteralType");
  }
  tsParseTemplateLiteralType() {
    const startLoc = this.state.startLoc;
    let curElt = this.parseTemplateElement(false);
    const quasis = [curElt];
    if (curElt.tail) {
      const node = this.startNodeAt(startLoc);
      const literal = this.startNodeAt(startLoc);
      literal.expressions = [];
      literal.quasis = quasis;
      node.literal = this.finishNode(literal, "TemplateLiteral");
      return this.finishNode(node, "TSLiteralType");
    } else {
      const substitutions = [];
      while (!curElt.tail) {
        substitutions.push(this.tsParseType());
        this.readTemplateContinuation();
        quasis.push(curElt = this.parseTemplateElement(false));
      }
      const node = this.startNodeAt(startLoc);
      node.types = substitutions;
      node.quasis = quasis;
      return this.finishNode(node, "TSTemplateLiteralType");
    }
  }
  parseTemplateSubstitution() {
    if (this.state.inType) return this.tsParseType();
    return super.parseTemplateSubstitution();
  }
  tsParseThisTypeOrThisTypePredicate() {
    const thisKeyword = this.tsParseThisTypeNode();
    if (this.isContextual(112) && !this.hasPrecedingLineBreak()) {
      return this.tsParseThisTypePredicate(thisKeyword);
    } else {
      return thisKeyword;
    }
  }
  tsParseNonArrayType() {
    switch (this.state.type) {
      case 130:
      case 131:
      case 132:
      case 81:
      case 82:
        return this.tsParseLiteralTypeNode();
      case 49:
        if (this.state.value === "-") {
          const node = this.startNode();
          const nextToken = this.lookahead();
          if (nextToken.type !== 131 && nextToken.type !== 132) {
            this.unexpected();
          }
          node.literal = this.parseMaybeUnary();
          return this.finishNode(node, "TSLiteralType");
        }
        break;
      case 74:
        return this.tsParseThisTypeOrThisTypePredicate();
      case 83:
        return this.tsParseTypeQuery();
      case 79:
        return this.tsParseImportType();
      case 2:
        return this.tsLookAhead(this.tsIsStartOfMappedType.bind(this)) ? this.tsParseMappedType() : this.tsParseTypeLiteral();
      case 0:
        return this.tsParseTupleType();
      case 6:
        if (!(this.optionFlags & 2048)) {
          const startLoc = this.state.startLoc;
          this.next();
          const type = this.tsParseType();
          this.expect(7);
          this.addExtra(type, "parenthesized", true);
          this.addExtra(type, "parenStart", startLoc.index);
          return type;
        }
        return this.tsParseParenthesizedType();
      case 21:
      case 20:
        return this.tsParseTemplateLiteralType();
      default: {
        const {
          type
        } = this.state;
        if (tokenIsIdentifier(type) || type === 84 || type === 80) {
          const nodeType = type === 84 ? "TSVoidKeyword" : type === 80 ? "TSNullKeyword" : keywordTypeFromName(this.state.value);
          if (nodeType !== void 0 && this.lookaheadCharCode() !== 46) {
            const node = this.startNode();
            this.next();
            return this.finishNode(node, nodeType);
          }
          return this.tsParseTypeReference();
        }
      }
    }
    throw this.unexpected();
  }
  tsParseArrayTypeOrHigher() {
    const {
      startLoc
    } = this.state;
    let type = this.tsParseNonArrayType();
    while (!this.hasPrecedingLineBreak() && this.eat(0)) {
      if (this.match(1)) {
        const node = this.startNodeAt(startLoc);
        node.elementType = type;
        this.expect(1);
        type = this.finishNode(node, "TSArrayType");
      } else {
        const node = this.startNodeAt(startLoc);
        node.objectType = type;
        node.indexType = this.tsParseType();
        this.expect(1);
        type = this.finishNode(node, "TSIndexedAccessType");
      }
    }
    return type;
  }
  tsParseTypeOperator() {
    const node = this.startNode();
    const operator = this.state.value;
    this.next();
    node.operator = operator;
    node.typeAnnotation = this.tsParseTypeOperatorOrHigher();
    if (operator === "readonly") {
      this.tsCheckTypeAnnotationForReadOnly(node);
    }
    return this.finishNode(node, "TSTypeOperator");
  }
  tsCheckTypeAnnotationForReadOnly(node) {
    switch (node.typeAnnotation.type) {
      case "TSTupleType":
      case "TSArrayType":
        return;
      default:
        this.raise(TSErrors.UnexpectedReadonly, node);
    }
  }
  tsParseInferType() {
    const node = this.startNode();
    this.expectContextual(111);
    const typeParameter = this.startNode();
    typeParameter.name = this.tsParseTypeParameterName();
    typeParameter.constraint = this.tsTryParse(() => this.tsParseConstraintForInferType());
    node.typeParameter = this.finishNode(typeParameter, "TSTypeParameter");
    return this.finishNode(node, "TSInferType");
  }
  tsParseConstraintForInferType() {
    if (this.eat(77)) {
      const constraint = this.tsInDisallowConditionalTypesContext(() => this.tsParseType());
      if (this.state.inDisallowConditionalTypesContext || !this.match(13)) {
        return constraint;
      }
    }
  }
  tsParseTypeOperatorOrHigher() {
    const isTypeOperator = tokenIsTSTypeOperator(this.state.type) && !this.state.containsEsc;
    return isTypeOperator ? this.tsParseTypeOperator() : this.isContextual(111) ? this.tsParseInferType() : this.tsInAllowConditionalTypesContext(() => this.tsParseArrayTypeOrHigher());
  }
  tsParseUnionOrIntersectionType(kind, parseConstituentType, operator) {
    const node = this.startNode();
    const hasLeadingOperator = this.eat(operator);
    const types2 = [];
    do {
      types2.push(parseConstituentType());
    } while (this.eat(operator));
    if (types2.length === 1 && !hasLeadingOperator) {
      return types2[0];
    }
    node.types = types2;
    return this.finishNode(node, kind);
  }
  tsParseIntersectionTypeOrHigher() {
    return this.tsParseUnionOrIntersectionType("TSIntersectionType", this.tsParseTypeOperatorOrHigher.bind(this), 41);
  }
  tsParseUnionTypeOrHigher() {
    return this.tsParseUnionOrIntersectionType("TSUnionType", this.tsParseIntersectionTypeOrHigher.bind(this), 39);
  }
  tsIsStartOfFunctionType() {
    if (this.match(43)) {
      return true;
    }
    return this.match(6) && this.tsLookAhead(this.tsIsUnambiguouslyStartOfFunctionType.bind(this));
  }
  tsSkipParameterStart() {
    if (tokenIsIdentifier(this.state.type) || this.match(74)) {
      this.next();
      return true;
    }
    if (this.match(2)) {
      const {
        errors
      } = this.state;
      const previousErrorCount = errors.length;
      try {
        this.parseObjectLike(4, true);
        return errors.length === previousErrorCount;
      } catch {
        return false;
      }
    }
    if (this.match(0)) {
      this.next();
      const {
        errors
      } = this.state;
      const previousErrorCount = errors.length;
      try {
        super.parseBindingList(1, 93, 1);
        return errors.length === previousErrorCount;
      } catch {
        return false;
      }
    }
    return false;
  }
  tsIsUnambiguouslyStartOfFunctionType() {
    this.next();
    if (this.match(7) || this.match(17)) {
      return true;
    }
    if (this.tsSkipParameterStart()) {
      if (this.match(10) || this.match(8) || this.match(13) || this.match(25)) {
        return true;
      }
      if (this.match(7)) {
        this.next();
        if (this.match(15)) {
          return true;
        }
      }
    }
    return false;
  }
  tsParseTypeOrTypePredicateAnnotation(returnToken) {
    return this.tsInType(() => {
      const t2 = this.startNode();
      this.expect(returnToken);
      const node = this.startNode();
      const asserts = !!this.tsTryParse(this.tsParseTypePredicateAsserts.bind(this));
      if (asserts && this.match(74)) {
        let thisTypePredicate = this.tsParseThisTypeOrThisTypePredicate();
        if (thisTypePredicate.type === "TSThisType") {
          node.parameterName = thisTypePredicate;
          node.asserts = true;
          node.typeAnnotation = null;
          thisTypePredicate = this.finishNode(node, "TSTypePredicate");
        } else {
          this.resetStartLocationFromNode(thisTypePredicate, node);
          thisTypePredicate.asserts = true;
        }
        t2.typeAnnotation = thisTypePredicate;
        return this.finishNode(t2, "TSTypeAnnotation");
      }
      const typePredicateVariable = this.tsIsIdentifier() && this.tsTryParse(this.tsParseTypePredicatePrefix.bind(this));
      if (!typePredicateVariable) {
        if (!asserts) {
          return this.tsParseTypeAnnotation(false, t2);
        }
        node.parameterName = this.parseIdentifier();
        node.asserts = asserts;
        node.typeAnnotation = null;
        t2.typeAnnotation = this.finishNode(node, "TSTypePredicate");
        return this.finishNode(t2, "TSTypeAnnotation");
      }
      const type = this.tsParseTypeAnnotation(false);
      node.parameterName = typePredicateVariable;
      node.typeAnnotation = type;
      node.asserts = asserts;
      t2.typeAnnotation = this.finishNode(node, "TSTypePredicate");
      return this.finishNode(t2, "TSTypeAnnotation");
    });
  }
  tsTryParseTypeOrTypePredicateAnnotation() {
    if (this.match(10)) {
      return this.tsParseTypeOrTypePredicateAnnotation(10);
    }
  }
  tsTryParseTypeAnnotation() {
    if (this.match(10)) {
      return this.tsParseTypeAnnotation();
    }
  }
  tsTryParseType() {
    return this.tsEatThenParseType(10);
  }
  tsParseTypePredicatePrefix() {
    const id = this.parseIdentifier();
    if (this.isContextual(112) && !this.hasPrecedingLineBreak()) {
      this.next();
      return id;
    }
  }
  tsParseTypePredicateAsserts() {
    if (this.state.type !== 105) {
      return false;
    }
    const containsEsc = this.state.containsEsc;
    this.next();
    if (!tokenIsIdentifier(this.state.type) && !this.match(74)) {
      return false;
    }
    if (containsEsc) {
      this.raise(Errors.InvalidEscapedReservedWord, this.state.lastTokStartLoc, {
        reservedWord: "asserts"
      });
    }
    return true;
  }
  tsParseTypeAnnotation(eatColon = true, t2 = this.startNode()) {
    this.tsInType(() => {
      if (eatColon) this.expect(10);
      t2.typeAnnotation = this.tsParseType();
    });
    return this.finishNode(t2, "TSTypeAnnotation");
  }
  tsParseType() {
    assert(this.state.inType);
    const type = this.tsParseNonConditionalType();
    if (this.state.inDisallowConditionalTypesContext || this.hasPrecedingLineBreak() || !this.eat(77)) {
      return type;
    }
    const node = this.startNodeAtNode(type);
    node.checkType = type;
    node.extendsType = this.tsInDisallowConditionalTypesContext(() => this.tsParseNonConditionalType());
    this.expect(13);
    node.trueType = this.tsInAllowConditionalTypesContext(() => this.tsParseType());
    this.expect(10);
    node.falseType = this.tsInAllowConditionalTypesContext(() => this.tsParseType());
    return this.finishNode(node, "TSConditionalType");
  }
  isAbstractConstructorSignature() {
    return this.isContextual(120) && this.isLookaheadContextual("new");
  }
  tsParseNonConditionalType() {
    if (this.tsIsStartOfFunctionType()) {
      return this.tsParseFunctionOrConstructorType("TSFunctionType");
    }
    if (this.match(73)) {
      return this.tsParseFunctionOrConstructorType("TSConstructorType");
    } else if (this.isAbstractConstructorSignature()) {
      return this.tsParseFunctionOrConstructorType("TSConstructorType", true);
    }
    return this.tsParseUnionTypeOrHigher();
  }
  tsParseTypeAssertion() {
    if (this.getPluginOption("typescript", "disallowAmbiguousJSXLike")) {
      this.raise(TSErrors.ReservedTypeAssertion, this.state.startLoc);
    }
    const node = this.startNode();
    node.typeAnnotation = this.tsInType(() => {
      this.next();
      return this.match(71) ? this.tsParseTypeReference() : this.tsParseType();
    });
    this.expect(44);
    node.expression = this.parseMaybeUnary();
    return this.finishNode(node, "TSTypeAssertion");
  }
  tsParseHeritageClause(token) {
    const originalStartLoc = this.state.startLoc;
    const delimitedList = this.tsParseDelimitedList("HeritageClauseElement", () => {
      const expression = (this.state.canStartArrow = false, super.parseExprSubscripts());
      if (!tsIsEntityName(expression)) {
        this.raise(TSErrors.InvalidHeritageClauseType, expression.start, {
          token
        });
      }
      const nodeType = token === "extends" ? "TSInterfaceHeritage" : "TSClassImplements";
      if (expression.type === "TSInstantiationExpression") {
        expression.type = nodeType;
        return expression;
      }
      const node = this.startNodeAtNode(expression);
      node.expression = expression;
      if (this.match(43) || this.match(47)) {
        node.typeArguments = this.tsParseTypeArgumentsInExpression();
      }
      return this.finishNode(node, nodeType);
    });
    if (!delimitedList.length) {
      this.raise(TSErrors.EmptyHeritageClauseType, originalStartLoc, {
        token
      });
    }
    return delimitedList;
  }
  tsParseInterfaceDeclaration(node, properties = {}) {
    if (this.hasFollowingLineBreak()) return null;
    this.expectContextual(125);
    if (properties.declare) node.declare = true;
    if (tokenIsIdentifier(this.state.type)) {
      node.id = this.parseIdentifier();
      this.checkIdentifier(node.id, 130);
    } else {
      node.id = null;
      this.raise(TSErrors.MissingInterfaceName, this.state.startLoc);
    }
    node.typeParameters = this.tsTryParseTypeParameters(this.tsParseInOutConstModifiers);
    if (this.eat(77)) {
      node.extends = this.tsParseHeritageClause("extends");
    }
    const body = this.startNode();
    body.body = this.tsInType(this.tsParseObjectTypeMembers.bind(this));
    node.body = this.finishNode(body, "TSInterfaceBody");
    return this.finishNode(node, "TSInterfaceDeclaration");
  }
  tsParseTypeAliasDeclaration(node) {
    node.id = this.parseIdentifier();
    this.checkIdentifier(node.id, 2);
    node.typeAnnotation = this.tsInType(() => {
      node.typeParameters = this.tsTryParseTypeParameters(this.tsParseInOutModifiers);
      this.expect(25);
      if (this.isContextual(110) && this.lookaheadCharCode() !== 46) {
        const node2 = this.startNode();
        this.next();
        return this.finishNode(node2, "TSIntrinsicKeyword");
      }
      return this.tsParseType();
    });
    this.semicolon();
    return this.finishNode(node, "TSTypeAliasDeclaration");
  }
  tsInTopLevelContext(cb) {
    if (this.curContext() !== types.brace) {
      const oldContext = this.state.context;
      this.state.context = [oldContext[0]];
      try {
        return cb();
      } finally {
        this.state.context = oldContext;
      }
    } else {
      return cb();
    }
  }
  tsInType(cb) {
    const oldInType = this.state.inType;
    this.state.inType = true;
    try {
      return cb();
    } finally {
      this.state.inType = oldInType;
    }
  }
  tsInDisallowConditionalTypesContext(cb) {
    const oldInDisallowConditionalTypesContext = this.state.inDisallowConditionalTypesContext;
    this.state.inDisallowConditionalTypesContext = true;
    try {
      return cb();
    } finally {
      this.state.inDisallowConditionalTypesContext = oldInDisallowConditionalTypesContext;
    }
  }
  tsInAllowConditionalTypesContext(cb) {
    const oldInDisallowConditionalTypesContext = this.state.inDisallowConditionalTypesContext;
    this.state.inDisallowConditionalTypesContext = false;
    try {
      return cb();
    } finally {
      this.state.inDisallowConditionalTypesContext = oldInDisallowConditionalTypesContext;
    }
  }
  tsEatThenParseType(token) {
    if (this.match(token)) {
      return this.tsNextThenParseType();
    }
  }
  tsExpectThenParseType(token) {
    return this.tsInType(() => {
      this.expect(token);
      return this.tsParseType();
    });
  }
  tsNextThenParseType() {
    return this.tsInType(() => {
      this.next();
      return this.tsParseType();
    });
  }
  tsParseEnumMember() {
    const node = this.startNode();
    node.id = this.match(130) ? super.parseStringLiteral(this.state.value) : this.parseIdentifier(true);
    if (this.eat(25)) {
      node.initializer = super.parseMaybeAssignAllowIn();
    }
    return this.finishNode(node, "TSEnumMember");
  }
  tsParseEnumDeclaration(node, properties = {}) {
    if (properties.const) node.const = true;
    if (properties.declare) node.declare = true;
    this.expectContextual(122);
    node.id = this.parseIdentifier();
    this.checkIdentifier(node.id, node.const ? 8971 : 8459);
    node.body = this.tsParseEnumBody();
    return this.finishNode(node, "TSEnumDeclaration");
  }
  tsParseEnumBody() {
    const node = this.startNode();
    this.expect(2);
    node.members = this.tsParseDelimitedList("EnumMembers", this.tsParseEnumMember.bind(this));
    this.expect(4);
    return this.finishNode(node, "TSEnumBody");
  }
  tsParseModuleBlock(isGlobal) {
    const node = this.startNode();
    if (!isGlobal) {
      this.scope.enter(0);
    }
    this.expect(2);
    super.parseBlockOrModuleBlockBody(node.body = [], void 0, true, 4);
    if (!isGlobal) {
      this.scope.exit();
    }
    return this.finishNode(node, "TSModuleBlock");
  }
  tsParseNamespaceDeclaration(node) {
    node.id = this.tsParseEntityName(0);
    if (node.id.type === "Identifier") {
      this.checkIdentifier(node.id, 1024);
    }
    this.scope.enter(2048);
    this.prodParam.enter(0);
    node.body = this.tsParseModuleBlock(false);
    this.prodParam.exit();
    this.scope.exit();
    return this.finishNode(node, "TSModuleDeclaration");
  }
  tsParseAmbientExternalModuleDeclaration(node) {
    const isGlobal = this.isContextual(108);
    if (isGlobal) {
      node.kind = "global";
      node.id = this.parseIdentifier();
    } else {
      node.kind = "module";
      node.id = super.parseStringLiteral(this.state.value);
    }
    if (this.match(2)) {
      if (!isGlobal) {
        this.scope.enter(1024);
      }
      this.prodParam.enter(0);
      node.body = this.tsParseModuleBlock(isGlobal);
      this.prodParam.exit();
      if (!isGlobal) {
        this.scope.exit();
      }
    } else {
      this.semicolon();
    }
    return this.finishNode(node, "TSModuleDeclaration");
  }
  tsParseImportEqualsDeclaration(node, maybeDefaultIdentifier) {
    node.id = maybeDefaultIdentifier || this.parseIdentifier();
    this.checkIdentifier(node.id, 4096);
    this.expect(25);
    const moduleReference = this.tsParseModuleReference();
    if (node.importKind === "type" && moduleReference.type !== "TSExternalModuleReference") {
      this.raise(TSErrors.ImportAliasHasImportType, moduleReference);
    }
    node.moduleReference = moduleReference;
    this.semicolon();
    return this.finishNode(node, "TSImportEqualsDeclaration");
  }
  tsIsExternalModuleReference() {
    return this.isContextual(115) && this.lookaheadCharCode() === 40;
  }
  tsParseModuleReference() {
    return this.tsIsExternalModuleReference() ? this.tsParseExternalModuleReference() : this.tsParseEntityName(0);
  }
  tsParseExternalModuleReference() {
    const node = this.startNode();
    this.expectContextual(115);
    this.expect(6);
    if (!this.match(130)) {
      this.unexpected();
    }
    node.expression = super.parseExprAtom();
    this.expect(7);
    this.sawUnambiguousESM = true;
    return this.finishNode(node, "TSExternalModuleReference");
  }
  tsLookAhead(f) {
    const state = this.state.clone();
    const res = f();
    this.state = state;
    return res;
  }
  tsTryParseAndCatch(f) {
    const result = this.tryParse((abort) => f() || abort());
    if (result.aborted || !result.node) return;
    if (result.error) this.state = result.failState;
    return result.node;
  }
  tsTryParse(f) {
    const state = this.state.clone();
    const result = f();
    if (result !== void 0 && result !== false) {
      return result;
    }
    this.state = state;
  }
  tsTryParseDeclare(node) {
    if (this.isLineTerminator()) {
      return;
    }
    const startType = this.state.type;
    return this.tsInAmbientContext(() => {
      switch (startType) {
        case 64:
          node.declare = true;
          return super.parseFunctionStatement(node, false, false);
        case 76:
          node.declare = true;
          return this.parseClass(node, true, false);
        case 122:
          return this.tsParseEnumDeclaration(node, {
            declare: true
          });
        case 108:
          return this.tsParseAmbientExternalModuleDeclaration(node);
        case 96:
          if (this.state.containsEsc) {
            return;
          }
        case 71:
        case 70:
          if (!this.match(71) || !this.isLookaheadContextual("enum")) {
            node.declare = true;
            return this.parseVarStatement(node, this.state.value, true);
          }
          this.expect(71);
          return this.tsParseEnumDeclaration(node, {
            const: true,
            declare: true
          });
        case 103:
          if (this.isUsing()) {
            this.raise(TSErrors.InvalidModifierOnUsingDeclaration, this.state.startLoc, "declare");
            node.declare = true;
            return this.parseVarStatement(node, "using", true);
          }
          break;
        case 92:
          if (this.isAwaitUsing()) {
            this.raise(TSErrors.InvalidModifierOnAwaitUsingDeclaration, this.state.startLoc, "declare");
            node.declare = true;
            this.next();
            return this.parseVarStatement(node, "await using", true);
          }
          break;
        case 125: {
          const result = this.tsParseInterfaceDeclaration(node, {
            declare: true
          });
          if (result) return result;
        }
        default:
          if (tokenIsIdentifier(startType)) {
            return this.tsParseDeclaration(node, this.state.type, true, null);
          }
      }
    });
  }
  tsTryParseExportDeclaration() {
    return this.tsParseDeclaration(this.startNode(), this.state.type, true, null);
  }
  tsParseDeclaration(node, type, next, decorators) {
    switch (type) {
      case 120:
        if (this.tsCheckLineTerminator(next) && (this.match(76) || tokenIsIdentifier(this.state.type))) {
          return this.tsParseAbstractDeclaration(node, decorators);
        }
        break;
      case 123:
        if (this.tsCheckLineTerminator(next)) {
          return this.tsParseAmbientExternalModuleDeclaration(node);
        }
        break;
      case 124:
        if (this.tsCheckLineTerminator(next) && tokenIsIdentifier(this.state.type)) {
          node.kind = "namespace";
          return this.tsParseNamespaceDeclaration(node);
        }
        break;
      case 126:
        if (this.tsCheckLineTerminator(next) && tokenIsIdentifier(this.state.type)) {
          return this.tsParseTypeAliasDeclaration(node);
        }
        break;
    }
  }
  tsCheckLineTerminator(next) {
    if (next) {
      if (this.hasFollowingLineBreak()) return false;
      this.next();
      return true;
    }
    return !this.isLineTerminator();
  }
  tsTryParseGenericAsyncArrowFunction(startLoc) {
    if (!this.match(43)) return;
    const res = this.tsTryParseAndCatch(() => {
      const node = this.startNodeAt(startLoc);
      node.typeParameters = this.tsParseTypeParameters(this.tsParseConstModifier);
      super.parseFunctionParams(node);
      node.returnType = this.tsTryParseTypeOrTypePredicateAnnotation();
      this.expect(15);
      return node;
    });
    if (!res) return;
    return super.parseArrowExpression(res, null, true);
  }
  tsParseTypeArgumentsInExpression() {
    if (this.reScan_lt() !== 43) return;
    return this.tsParseTypeArguments();
  }
  tsParseTypeArguments() {
    const node = this.startNode();
    node.params = this.tsInType(() => this.tsInTopLevelContext(() => {
      this.expect(43);
      return this.tsParseDelimitedList("TypeParametersOrArguments", this.tsParseType.bind(this));
    }));
    if (node.params.length === 0) {
      this.raise(TSErrors.EmptyTypeArguments, node);
    } else if (!this.state.inType && this.curContext() === types.brace) {
      this.reScan_lt_gt();
    }
    this.expect(44);
    return this.finishNode(node, "TSTypeParameterInstantiation");
  }
  tsIsDeclarationStart() {
    return tokenIsTSDeclarationStart(this.state.type);
  }
  isExportDefaultSpecifier() {
    if (this.tsIsDeclarationStart()) return false;
    return super.isExportDefaultSpecifier();
  }
  parseBindingElement(flags, decorators) {
    const startLoc = decorators.length ? null : this.state.startLoc;
    const modified = {};
    this.tsParseModifiers({
      allowedModifiers: ["public", "private", "protected", "override", "readonly"]
    }, modified);
    const accessibility = modified.accessibility;
    const override = modified.override;
    const readonly = modified.readonly;
    if (!(flags & 4) && (accessibility || readonly || override)) {
      this.raise(TSErrors.UnexpectedParameterModifier, startLoc || decorators[0]);
    }
    const startLoc2 = this.state.startLoc;
    const left = this.parseMaybeDefault(startLoc2);
    if (flags & 2) {
      this.parseFunctionParamType(left);
    }
    const elt = this.parseMaybeDefault(startLoc2, left);
    if (accessibility || readonly || override) {
      const pp = startLoc ? this.startNodeAt(startLoc) : this.startNodeAtNode(decorators[0]);
      if (decorators.length) {
        pp.decorators = decorators;
      } else {
        this.setLoc(startLoc);
      }
      if (accessibility) pp.accessibility = accessibility;
      if (readonly) pp.readonly = readonly;
      if (override) pp.override = override;
      if (elt.type !== "Identifier" && elt.type !== "AssignmentPattern") {
        this.raise(TSErrors.UnsupportedParameterPropertyKind, startLoc || decorators[0]);
      }
      pp.parameter = elt;
      return this.finishNode(pp, "TSParameterProperty");
    }
    if (decorators.length) {
      left.decorators = decorators;
    }
    return elt;
  }
  isSimpleParameter(node) {
    return node.type === "TSParameterProperty" && super.isSimpleParameter(node.parameter) || super.isSimpleParameter(node);
  }
  tsDisallowOptionalPattern(node) {
    for (const param of node.params) {
      if (param.type !== "Identifier" && param.optional && !this.state.isAmbientContext) {
        this.raise(TSErrors.PatternIsOptional, param);
      }
    }
  }
  setArrowFunctionParameters(node, params, trailingCommaLoc) {
    super.setArrowFunctionParameters(node, params, trailingCommaLoc);
    this.tsDisallowOptionalPattern(node);
  }
  parseFunctionBodyAndFinish(node, type, isMethod = false) {
    if (this.match(10)) {
      node.returnType = this.tsParseTypeOrTypePredicateAnnotation(10);
    }
    const bodilessType = type === "FunctionDeclaration" ? "TSDeclareFunction" : type === "ClassMethod" || type === "ClassPrivateMethod" ? "TSDeclareMethod" : void 0;
    if (bodilessType && !this.match(2) && this.isLineTerminator()) {
      if (bodilessType === "TSDeclareMethod" && node.kind === "constructor") {
        for (const param of node.params) {
          if (param.type === "TSParameterProperty") {
            this.raise(TSErrors.UnexpectedParameterModifier, param);
          } else if (param.type === "AssignmentPattern") {
            this.raise(TSErrors.UnexpectedParameterInitializer, param);
          }
        }
      } else {
        for (const param of node.params) {
          if (param.type === "AssignmentPattern") {
            this.raise(TSErrors.UnexpectedParameterInitializer, param);
          }
        }
      }
      return this.finishNode(node, bodilessType);
    }
    if (bodilessType && this.state.isAmbientContext) {
      this.raise(TSErrors.DeclareFunctionHasImplementation, this.state.startLoc);
      if (bodilessType === "TSDeclareFunction" && node.declare) {
        return super.parseFunctionBodyAndFinish(node, bodilessType, isMethod);
      }
    }
    this.tsDisallowOptionalPattern(node);
    return super.parseFunctionBodyAndFinish(node, type, isMethod);
  }
  registerFunctionStatementId(node) {
    if (!node.body && node.id) {
      this.checkIdentifier(node.id, 1024);
    } else {
      super.registerFunctionStatementId(node);
    }
  }
  tsCheckForInvalidTypeCasts(items) {
    items.forEach((node) => {
      if (node?.type === "TSTypeCastExpression") {
        this.raise(TSErrors.UnexpectedTypeAnnotation, node.typeAnnotation);
      }
    });
  }
  toReferencedList(exprList, isInParens) {
    this.tsCheckForInvalidTypeCasts(exprList);
    return exprList;
  }
  parseArrayLike(close, refExpressionErrors) {
    const node = super.parseArrayLike(close, refExpressionErrors);
    if (node.type === "ArrayExpression") {
      this.tsCheckForInvalidTypeCasts(node.elements);
    }
    return node;
  }
  parseSubscript(base, startLoc, noCalls, state) {
    if (!this.hasPrecedingLineBreak() && this.match(31)) {
      this.state.canStartJSXElement = false;
      this.next();
      const nonNullExpression = this.startNodeAt(startLoc);
      nonNullExpression.expression = base;
      return this.finishNode(nonNullExpression, "TSNonNullExpression");
    }
    let isOptionalCall = false;
    if (this.match(14) && this.lookaheadCharCode() === 60) {
      if (noCalls) {
        state.stop = true;
        return base;
      }
      state.optionalChainMember = isOptionalCall = true;
      this.next();
    }
    if (this.match(43) || this.match(47)) {
      let missingParenErrorLoc;
      const result = this.tsTryParseAndCatch(() => {
        if (!noCalls && this.atPossibleAsyncArrow(base)) {
          const asyncArrowFn = this.tsTryParseGenericAsyncArrowFunction(startLoc);
          if (asyncArrowFn) {
            state.stop = true;
            return asyncArrowFn;
          }
        }
        const typeArguments = this.tsParseTypeArgumentsInExpression();
        if (!typeArguments) return;
        if (isOptionalCall && !this.match(6)) {
          missingParenErrorLoc = this.state.curPosition();
          return;
        }
        if (tokenIsTemplate(this.state.type)) {
          const result2 = super.parseTaggedTemplateExpression(base, startLoc, state);
          result2.typeArguments = typeArguments;
          return result2;
        }
        if (!noCalls && this.eat(6)) {
          const node2 = this.startNodeAt(startLoc);
          node2.callee = base;
          node2.arguments = this.parseCallExpressionArguments();
          this.tsCheckForInvalidTypeCasts(node2.arguments);
          node2.typeArguments = typeArguments;
          if (state.optionalChainMember) {
            node2.optional = isOptionalCall;
          }
          return this.finishCallExpression(node2, state.optionalChainMember);
        }
        const tokenType = this.state.type;
        if (tokenType === 44 || tokenType === 48 || tokenType !== 6 && tokenType !== 89 && tokenType !== 116 && tokenCanStartExpression(tokenType) && !this.hasPrecedingLineBreak()) {
          return;
        }
        const node = this.startNodeAt(startLoc);
        node.expression = base;
        node.typeArguments = typeArguments;
        return this.finishNode(node, "TSInstantiationExpression");
      });
      if (missingParenErrorLoc) {
        this.unexpected(missingParenErrorLoc, 6);
      }
      if (result) {
        if (result.type === "TSInstantiationExpression") {
          if (this.match(12) || this.match(14) && this.lookaheadCharCode() !== 40) {
            this.raise(TSErrors.InvalidPropertyAccessAfterInstantiationExpression, this.state.startLoc);
          }
          if (!this.match(12) && !this.match(14)) {
            result.expression = super.stopParseSubscript(base, state);
          }
        }
        return result;
      }
    }
    return super.parseSubscript(base, startLoc, noCalls, state);
  }
  parseNewCallee(node) {
    super.parseNewCallee(node);
    const {
      callee
    } = node;
    if (callee.type === "TSInstantiationExpression" && !callee.extra?.parenthesized) {
      node.typeArguments = callee.typeArguments;
      node.callee = callee.expression;
    }
  }
  parseExprOp(left, leftStartLoc, minPrec) {
    let isSatisfies;
    if (tokenOperatorPrecedence(54) > minPrec && !this.hasPrecedingLineBreak() && (this.isContextual(89) || (isSatisfies = this.isContextual(116)))) {
      const node = this.startNodeAt(leftStartLoc);
      node.expression = left;
      node.typeAnnotation = this.tsInType(() => {
        this.next();
        if (this.match(71)) {
          if (isSatisfies) {
            this.raise(Errors.UnexpectedKeyword, this.state.startLoc, {
              keyword: "const"
            });
          }
          return this.tsParseTypeReference();
        }
        return this.tsParseType();
      });
      const result = this.finishNode(node, isSatisfies ? "TSSatisfiesExpression" : "TSAsExpression");
      this.reScan_lt_gt();
      return this.parseExprOp(result, leftStartLoc, minPrec);
    }
    return super.parseExprOp(left, leftStartLoc, minPrec);
  }
  checkReservedWord(word, startLoc, checkKeywords, isBinding) {
    if (!this.state.isAmbientContext) {
      super.checkReservedWord(word, startLoc, checkKeywords, isBinding);
    }
  }
  checkDuplicateExports() {
  }
  isPotentialImportPhase(isExport) {
    if (super.isPotentialImportPhase(isExport)) return true;
    if (this.isContextual(126)) {
      const ch = this.lookaheadCharCode();
      return isExport ? ch === 123 || ch === 42 : ch !== 61;
    }
    return !isExport && this.isContextual(83);
  }
  applyImportPhase(node, isExport, phase, loc) {
    super.applyImportPhase(node, isExport, phase, loc);
    if (isExport) {
      node.exportKind = phase === "type" ? "type" : "value";
    } else {
      node.importKind = phase === "type" || phase === "typeof" ? phase : "value";
    }
  }
  parseImport(node) {
    if (this.match(130)) {
      node.importKind = "value";
      if (this.scope.inTSNamespace) {
        this.raise(TSErrors.ImportInTSNamespace, node);
      }
      return super.parseImport(node);
    }
    let importNode;
    if (tokenIsIdentifier(this.state.type) && this.lookaheadCharCode() === 61) {
      node.importKind = "value";
      const result = this.tsParseImportEqualsDeclaration(node);
      if (this.scope.inTSNamespace && result.moduleReference.type === "TSExternalModuleReference") {
        this.raise(TSErrors.ImportInTSNamespace, node);
      }
      return result;
    } else if (this.isContextual(126)) {
      const maybeDefaultIdentifier = this.parseMaybeImportPhase(node, false);
      if (this.lookaheadCharCode() === 61) {
        if (this.scope.inTSNamespace) {
          this.raise(TSErrors.ImportInTSNamespace, node);
        }
        return this.tsParseImportEqualsDeclaration(node, maybeDefaultIdentifier);
      } else {
        importNode = super.parseImportSpecifiersAndAfter(node, maybeDefaultIdentifier);
      }
    } else {
      importNode = super.parseImport(node);
    }
    if (importNode.importKind === "type" && importNode.specifiers.length > 1 && importNode.specifiers[0].type === "ImportDefaultSpecifier") {
      this.raise(TSErrors.TypeImportCannotSpecifyDefaultAndNamed, importNode);
    } else if (this.scope.inTSNamespace) {
      this.raise(TSErrors.ImportInTSNamespace, importNode);
    }
    return importNode;
  }
  parseExport(node, decorators) {
    if (this.match(79)) {
      const nodeImportEquals = this.startNode();
      this.next();
      let maybeDefaultIdentifier = null;
      if (this.isContextual(126) && this.isPotentialImportPhase(false)) {
        maybeDefaultIdentifier = this.parseMaybeImportPhase(nodeImportEquals, false);
      } else {
        nodeImportEquals.importKind = "value";
      }
      const declaration = this.tsParseImportEqualsDeclaration(nodeImportEquals, maybeDefaultIdentifier);
      node.attributes = [];
      node.declaration = declaration;
      node.exportKind = "value";
      node.source = null;
      node.specifiers = [];
      return this.finishNode(node, "ExportNamedDeclaration");
    } else if (this.eat(25)) {
      const assign = node;
      assign.expression = super.parseExpression();
      this.semicolon();
      this.sawUnambiguousESM = true;
      if (this.scope.inTSNamespace) {
        this.raise(TSErrors.ExportAssignmentInTSNamespace, assign);
      }
      return this.finishNode(assign, "TSExportAssignment");
    } else if (this.eatContextual(89)) {
      const decl = node;
      this.expectContextual(124);
      decl.id = this.parseIdentifier();
      this.checkIdentifier(decl.id, 8201);
      this.semicolon();
      if (this.scope.inTSNamespace) {
        this.raise(TSErrors.NamespaceExportInTSNamespace, decl);
      }
      return this.finishNode(decl, "TSNamespaceExportDeclaration");
    } else {
      const result = super.parseExport(node, decorators);
      if (this.scope.inTSNamespace && (result.type !== "ExportNamedDeclaration" || result.source || !result.declaration && !this.state.isAmbientContext)) {
        this.raise(TSErrors.ExportInTSNamespace, result);
      }
      return result;
    }
  }
  isAbstractClass() {
    return this.isContextual(120) && this.isLookaheadContextual("class");
  }
  parseExportDefaultExpression() {
    if (this.isAbstractClass()) {
      const cls = this.startNode();
      this.next();
      cls.abstract = true;
      return this.parseClass(cls, true, true);
    }
    if (this.match(125)) {
      const result = this.tsParseInterfaceDeclaration(this.startNode());
      if (result) return result;
    }
    return super.parseExportDefaultExpression();
  }
  parseVarStatement(node, kind, allowMissingInitializer = false) {
    const {
      isAmbientContext
    } = this.state;
    const declaration = super.parseVarStatement(node, kind, allowMissingInitializer || isAmbientContext);
    if (!isAmbientContext) return declaration;
    if (!node.declare && (kind === "using" || kind === "await using")) {
      this.raiseOverwrite(TSErrors.UsingDeclarationInAmbientContext, node, kind);
      return declaration;
    }
    for (const {
      id,
      init
    } of declaration.declarations) {
      if (!init) continue;
      if (kind === "var" || kind === "let" || !!id.typeAnnotation) {
        this.raise(TSErrors.InitializerNotAllowedInAmbientContext, init);
      } else if (!isValidAmbientConstInitializer(init, this.hasPlugin("estree"))) {
        this.raise(TSErrors.ConstInitializerMustBeStringOrNumericLiteralOrLiteralEnumReference, init);
      }
    }
    return declaration;
  }
  parseStatementContent(flags, decorators) {
    const allowDeclaration = !!(flags & 2);
    if (!this.state.containsEsc) {
      switch (this.state.type) {
        case 71: {
          if (this.isLookaheadContextual("enum")) {
            const node = this.startNode();
            this.next();
            return this.tsParseEnumDeclaration(node, {
              const: true
            });
          }
          break;
        }
        case 120:
        case 121: {
          if (this.nextTokenIsIdentifierAndNotTSRelationalOperatorOnSameLine()) {
            const token = this.state.type;
            const node = this.startNode();
            this.next();
            const declaration = token === 121 ? this.tsTryParseDeclare(node) : this.tsParseAbstractDeclaration(node, decorators);
            if (declaration) {
              if (token === 121) {
                declaration.declare = true;
              }
              return declaration;
            } else {
              node.expression = this.createIdentifier(this.startNodeAtNode(node), token === 121 ? "declare" : "abstract");
              this.semicolon(false);
              return this.finishNode(node, "ExpressionStatement");
            }
          }
          break;
        }
        case 122:
          return this.tsParseEnumDeclaration(this.startNode());
        case 108: {
          const nextCh = this.lookaheadCharCode();
          if (nextCh === 123) {
            const node = this.startNode();
            return this.tsParseAmbientExternalModuleDeclaration(node);
          }
          break;
        }
        case 125: {
          const result = this.tsParseInterfaceDeclaration(this.startNode());
          if (result) {
            if (!allowDeclaration) {
              this.raise(TSErrors.UnexpectedTypeDeclaration, result, "interface");
            }
            return result;
          }
          break;
        }
        case 123: {
          if (this.nextTokenIsStringLiteralOnSameLine()) {
            const node = this.startNode();
            this.next();
            return this.tsParseDeclaration(node, 123, false, decorators);
          } else if (this.nextTokenIsIdentifierOnSameLine()) {
            this.raise(TSErrors.InlineModuleDeclarationMustUseString, this.state.startLoc);
            const node = this.startNode();
            this.next();
            return this.tsParseDeclaration(node, 124, false, decorators);
          }
          break;
        }
        case 124: {
          if (this.nextTokenIsIdentifierOnSameLine()) {
            const node = this.startNode();
            this.next();
            return this.tsParseDeclaration(node, 124, false, decorators);
          }
          break;
        }
        case 126: {
          if (this.nextTokenIsIdentifierOnSameLine()) {
            const node = this.startNode();
            if (!allowDeclaration) {
              this.raise(TSErrors.UnexpectedTypeDeclaration, node, "type");
            }
            this.next();
            return this.tsParseTypeAliasDeclaration(node);
          }
          break;
        }
      }
    }
    return super.parseStatementContent(flags, decorators);
  }
  parseAccessModifier() {
    return this.tsParseModifier(["public", "protected", "private"]);
  }
  tsHasSomeModifiers(member, modifiers) {
    return modifiers.some((modifier) => {
      if (tsIsAccessModifier(modifier)) {
        return member.accessibility === modifier;
      }
      return !!member[modifier];
    });
  }
  tsIsStartOfStaticBlocks() {
    return this.isContextual(102) && this.lookaheadCharCode() === 123;
  }
  parseClassMember(classBody, member, state) {
    const modifiers = ["declare", "private", "public", "protected", "override", "abstract", "readonly", "static"];
    this.tsParseModifiers({
      allowedModifiers: modifiers,
      disallowedModifiers: ["in", "out"],
      stopOnStartOfClassStaticBlock: true,
      errorTemplate: TSErrors.InvalidModifierOnTypeParameterPositions
    }, member);
    const callParseClassMemberWithIsStatic = () => {
      if (this.tsIsStartOfStaticBlocks()) {
        this.next();
        this.next();
        if (this.tsHasSomeModifiers(member, modifiers)) {
          this.raise(TSErrors.StaticBlockCannotHaveModifier, this.state.curPosition());
        }
        super.parseClassStaticBlock(classBody, member);
      } else {
        this.parseClassMemberWithIsStatic(classBody, member, state, !!member.static);
      }
    };
    if (member.declare) {
      this.tsInAmbientContext(callParseClassMemberWithIsStatic);
    } else {
      callParseClassMemberWithIsStatic();
    }
    if (member.decorators && member.decorators.length > 0 && !this.hasPlugin("decorators-legacy")) {
      if (member.type === "TSAbstractMethodDefinition" || member.type === "TSDeclareMethod") {
        this.raise(TSErrors.DecoratorAbstractMethod, member, {
          kind: "abstract method"
        });
      } else if (member.type === "ClassProperty" && member.abstract || member.type === "ClassProperty" && member.declare || member.type === "TSAbstractPropertyDefinition" || member.type === "PropertyDefinition" && member.declare) {
        this.raise(TSErrors.DecoratorAbstractMethod, member, {
          kind: member.declare ? "declare field" : "abstract field"
        });
      }
    }
  }
  parseClassMemberWithIsStatic(classBody, member, state, isStatic) {
    const idx = this.tsTryParseIndexSignature(member);
    if (idx) {
      classBody.body.push(idx);
      if (member.abstract) {
        this.raise(TSErrors.IndexSignatureHasAbstract, member);
      }
      if (member.accessibility) {
        this.raise(TSErrors.IndexSignatureHasAccessibility, member, {
          modifier: member.accessibility
        });
      }
      if (member.declare) {
        this.raise(TSErrors.IndexSignatureHasDeclare, member);
      }
      if (member.override) {
        this.raise(TSErrors.IndexSignatureHasOverride, member);
      }
      return;
    }
    if (!this.state.inAbstractClass && member.abstract) {
      this.raise(TSErrors.NonAbstractClassHasAbstractMethod, member);
    }
    if (member.override) {
      if (!state.hadSuperClass) {
        this.raise(TSErrors.OverrideNotInSubClass, member);
      }
    }
    super.parseClassMemberWithIsStatic(classBody, member, state, isStatic);
  }
  parsePostMemberNameModifiers(methodOrProp) {
    const optional = this.eat(13);
    if (optional) methodOrProp.optional = true;
    if (methodOrProp.readonly && this.match(6)) {
      this.raise(TSErrors.ClassMethodHasReadonly, methodOrProp);
    }
    if (methodOrProp.declare && this.match(6)) {
      this.raise(TSErrors.ClassMethodHasDeclare, methodOrProp);
    }
  }
  shouldParseExportDeclaration() {
    if (this.tsIsDeclarationStart()) return true;
    return super.shouldParseExportDeclaration();
  }
  parseConditional(expr, startLoc, refExpressionErrors) {
    if (!this.match(13)) return expr;
    if (refExpressionErrors != null) {
      const nextCh = this.lookaheadCharCode();
      if (nextCh === 44 || nextCh === 61 || nextCh === 58 || nextCh === 41) {
        this.setOptionalParametersError(refExpressionErrors);
        return expr;
      }
    }
    this.next();
    const node = this.startNodeAt(startLoc);
    node.test = expr;
    const oldInConditionalConsequent = this.state.inConditionalConsequent;
    this.state.inConditionalConsequent = true;
    node.consequent = this.parseMaybeAssignAllowIn();
    this.state.inConditionalConsequent = oldInConditionalConsequent;
    this.expect(10);
    node.alternate = this.parseMaybeAssign();
    return this.finishNode(node, "ConditionalExpression");
  }
  parseParenItem(node, startLoc) {
    const newNode = super.parseParenItem(node, startLoc);
    if (this.eat(13)) {
      newNode.optional = true;
      this.resetEndLocation(node);
    }
    if (this.match(10)) {
      const typeCastNode = this.startNodeAt(startLoc);
      typeCastNode.expression = node;
      typeCastNode.typeAnnotation = this.tsParseTypeAnnotation();
      return this.finishNode(typeCastNode, "TSTypeCastExpression");
    }
    return node;
  }
  parseExportDeclaration(node) {
    if (!this.state.isAmbientContext && this.isContextual(121)) {
      return this.tsInAmbientContext(() => this.parseExportDeclaration(node));
    }
    const startLoc = this.state.startLoc;
    const isDeclare = this.eatContextual(121);
    if (isDeclare && (this.isContextual(121) || !this.shouldParseExportDeclaration())) {
      throw this.raise(TSErrors.ExpectedAmbientAfterExportDeclare, this.state.startLoc);
    }
    const isIdentifier = tokenIsIdentifier(this.state.type);
    const declaration = isIdentifier && this.tsTryParseExportDeclaration() || super.parseExportDeclaration(node);
    if (!declaration) return null;
    if (declaration.type === "TSInterfaceDeclaration" || declaration.type === "TSTypeAliasDeclaration" || isDeclare) {
      node.exportKind = "type";
    }
    if (isDeclare && declaration.type !== "TSImportEqualsDeclaration") {
      this.resetStartLocation(declaration, startLoc);
      declaration.declare = true;
    }
    return declaration;
  }
  parseClassId(node, isStatement, optionalId, bindingType) {
    if ((!isStatement || optionalId) && this.isContextual(109)) {
      node.id = null;
      return;
    }
    super.parseClassId(node, isStatement, optionalId, node.declare ? 1024 : 8331);
    const typeParameters = this.tsTryParseTypeParameters(this.tsParseInOutConstModifiers);
    if (typeParameters) node.typeParameters = typeParameters;
  }
  parseClassPropertyAnnotation(node) {
    if (!node.optional) {
      if (this.eat(31)) {
        node.definite = true;
      } else if (this.eat(13)) {
        node.optional = true;
      }
    }
    const type = this.tsTryParseTypeAnnotation();
    if (type) node.typeAnnotation = type;
  }
  parseClassProperty(node) {
    this.parseClassPropertyAnnotation(node);
    if (this.state.isAmbientContext && !(node.readonly && !node.typeAnnotation) && this.match(25)) {
      this.raise(TSErrors.DeclareClassFieldHasInitializer, this.state.startLoc);
    }
    if (node.abstract && this.match(25)) {
      const {
        key
      } = node;
      this.raise(TSErrors.AbstractPropertyHasInitializer, this.state.startLoc, {
        propertyName: key.type === "Identifier" && !node.computed ? key.name : `[${this.input.slice(this.offsetToSourcePos(key.start), this.offsetToSourcePos(key.end))}]`
      });
    }
    return super.parseClassProperty(node);
  }
  parseClassPrivateProperty(node) {
    if (node.abstract) {
      this.raise(TSErrors.PrivateElementHasAbstract, node);
    }
    if (node.accessibility) {
      this.raise(TSErrors.PrivateElementHasAccessibility, node, {
        modifier: node.accessibility
      });
    }
    this.parseClassPropertyAnnotation(node);
    return super.parseClassPrivateProperty(node);
  }
  parseClassAccessorProperty(node) {
    this.parseClassPropertyAnnotation(node);
    if (node.optional) {
      this.raise(TSErrors.AccessorCannotBeOptional, node);
    }
    return super.parseClassAccessorProperty(node);
  }
  pushClassMethod(classBody, method, isGenerator, isAsync, isConstructor, allowsDirectSuper) {
    const typeParameters = this.tsTryParseTypeParameters(this.tsParseConstModifier);
    if (typeParameters && isConstructor) {
      this.raise(TSErrors.ConstructorHasTypeParameters, typeParameters);
    }
    const {
      declare = false,
      kind
    } = method;
    if (declare && (kind === "get" || kind === "set")) {
      this.raise(TSErrors.DeclareAccessor, method, {
        kind
      });
    }
    if (typeParameters) method.typeParameters = typeParameters;
    super.pushClassMethod(classBody, method, isGenerator, isAsync, isConstructor, allowsDirectSuper);
  }
  pushClassPrivateMethod(classBody, method, isGenerator, isAsync) {
    const typeParameters = this.tsTryParseTypeParameters(this.tsParseConstModifier);
    if (typeParameters) method.typeParameters = typeParameters;
    super.pushClassPrivateMethod(classBody, method, isGenerator, isAsync);
  }
  declareClassPrivateMethodInScope(node, kind) {
    if (node.type === "TSDeclareMethod") return;
    if (node.type === "MethodDefinition" && node.value.body == null) {
      return;
    }
    super.declareClassPrivateMethodInScope(node, kind);
  }
  parseClassSuper(node) {
    super.parseClassSuper(node);
    if (node.superClass) {
      if (node.superClass.type === "TSInstantiationExpression") {
        const tsInstantiationExpression = node.superClass;
        const superClass2 = tsInstantiationExpression.expression;
        this.takeSurroundingComments(superClass2, superClass2.start, superClass2.end);
        const superTypeArguments = tsInstantiationExpression.typeArguments;
        this.takeSurroundingComments(superTypeArguments, superTypeArguments.start, superTypeArguments.end);
        node.superClass = superClass2;
        node.superTypeArguments = superTypeArguments;
      } else if (this.match(43) || this.match(47)) {
        node.superTypeArguments = this.tsParseTypeArgumentsInExpression();
      }
    }
    if (this.eatContextual(109)) {
      node.implements = this.tsParseHeritageClause("implements");
    }
  }
  parseObjPropValue(prop, startLoc, isGenerator, isAsync, isPattern, isAccessor, refExpressionErrors) {
    const typeParameters = this.tsTryParseTypeParameters(this.tsParseConstModifier);
    if (typeParameters) prop.typeParameters = typeParameters;
    return super.parseObjPropValue(prop, startLoc, isGenerator, isAsync, isPattern, isAccessor, refExpressionErrors);
  }
  parseFunctionParams(node, isConstructor) {
    const typeParameters = this.tsTryParseTypeParameters(this.tsParseConstModifier);
    if (typeParameters) node.typeParameters = typeParameters;
    super.parseFunctionParams(node, isConstructor);
  }
  parseVarId(decl, kind) {
    super.parseVarId(decl, kind);
    if (decl.id.type === "Identifier" && !this.hasPrecedingLineBreak() && this.eat(31)) {
      decl.definite = true;
    }
    const type = this.tsTryParseTypeAnnotation();
    if (type) {
      decl.id.typeAnnotation = type;
      this.resetEndLocation(decl.id);
    }
  }
  parseAsyncArrowFromCallExpression(node, call) {
    if (this.match(10)) {
      node.returnType = this.tsParseTypeAnnotation();
    }
    return super.parseAsyncArrowFromCallExpression(node, call);
  }
  parseMaybeAssign(refExpressionErrors, afterLeftParse) {
    let state;
    let jsx2;
    let typeCast;
    if (this.hasPlugin("jsx") && (this.match(138) || this.match(43))) {
      state = this.state.clone();
      jsx2 = this.tryParse(() => super.parseMaybeAssign(refExpressionErrors, afterLeftParse), state);
      if (!jsx2.error) return jsx2.node;
      const {
        context
      } = this.state;
      const currentContext = context[context.length - 1];
      if (currentContext === types.j_oTag || currentContext === types.j_expr) {
        context.pop();
      }
    }
    if (!jsx2?.error && !this.match(43)) {
      return super.parseMaybeAssign(refExpressionErrors, afterLeftParse);
    }
    if (!state || state === this.state) state = this.state.clone();
    let typeParameters;
    const arrow = this.tryParse((abort) => {
      typeParameters = this.tsParseTypeParameters(this.tsParseConstModifier);
      const expr = super.parseMaybeAssign(refExpressionErrors, afterLeftParse);
      if (expr.type !== "ArrowFunctionExpression" || expr.extra?.parenthesized) {
        abort();
      }
      if (typeParameters?.params.length !== 0) {
        this.resetStartLocationFromNode(expr, typeParameters);
      }
      expr.typeParameters = typeParameters;
      if (this.hasPlugin("jsx") && expr.typeParameters.params.length === 1 && !expr.typeParameters.extra?.trailingComma) {
        const parameter = expr.typeParameters.params[0];
        if (!parameter.constraint) {
          this.raise(TSErrors.SingleTypeParameterWithoutTrailingComma, this.optionFlags & 256 ? createPositionWithColumnOffset(parameter.loc.end, 1) : parameter, {
            typeParameterName: parameter.name.name
          });
        }
      }
      return expr;
    }, state);
    if (!arrow.error && !arrow.aborted) {
      if (typeParameters) this.reportReservedArrowTypeParam(typeParameters);
      return arrow.node;
    }
    if (!jsx2) {
      assert(!this.hasPlugin("jsx"));
      typeCast = this.tryParse(() => super.parseMaybeAssign(refExpressionErrors, afterLeftParse), state);
      if (!typeCast.error) return typeCast.node;
    }
    if (jsx2?.node) {
      this.state = jsx2.failState;
      return jsx2.node;
    }
    if (arrow.node) {
      this.state = arrow.failState;
      if (typeParameters) this.reportReservedArrowTypeParam(typeParameters);
      return arrow.node;
    }
    if (typeCast?.node) {
      this.state = typeCast.failState;
      return typeCast.node;
    }
    throw jsx2?.error || arrow.error || typeCast?.error;
  }
  reportReservedArrowTypeParam(node) {
    if (node.params.length === 1 && !node.params[0].constraint && !node.extra?.trailingComma && this.getPluginOption("typescript", "disallowAmbiguousJSXLike")) {
      this.raise(TSErrors.ReservedArrowTypeParam, node);
    }
  }
  parseMaybeUnary(refExpressionErrors, sawUnary) {
    if (!this.hasPlugin("jsx") && this.match(43)) {
      return this.tsParseTypeAssertion();
    }
    return super.parseMaybeUnary(refExpressionErrors, sawUnary);
  }
  parseArrow(node) {
    if (this.match(10)) {
      const result = this.tryParse((abort) => {
        const returnType = this.tsParseTypeOrTypePredicateAnnotation(10);
        if (this.canInsertSemicolon() || !this.match(15)) abort();
        return returnType;
      });
      if (result.aborted) return;
      if (!result.thrown) {
        if (result.error) this.state = result.failState;
        node.returnType = result.node;
      }
    }
    return super.parseArrow(node);
  }
  parseFunctionParamType(param) {
    if (this.eat(13)) {
      param.optional = true;
    }
    const type = this.tsTryParseTypeAnnotation();
    if (type) param.typeAnnotation = type;
    this.resetEndLocation(param);
    return param;
  }
  isAssignable(node, isBinding) {
    switch (node.type) {
      case "TSTypeCastExpression":
        return this.isAssignable(node.expression, isBinding);
      case "TSParameterProperty":
        return true;
      default:
        return super.isAssignable(node, isBinding);
    }
  }
  toAssignable(node, isLHS = false) {
    switch (node.type) {
      case "ParenthesizedExpression":
        this.toAssignableParenthesizedExpression(node, isLHS);
        break;
      case "TSAsExpression":
      case "TSSatisfiesExpression":
      case "TSNonNullExpression":
      case "TSTypeAssertion":
        if (isLHS) {
          this.expressionScope.recordArrowParameterBindingError(TSErrors.UnexpectedTypeCastInParameter, node);
        } else {
          this.raise(TSErrors.UnexpectedTypeCastInParameter, node);
        }
        this.toAssignable(node.expression, isLHS);
        break;
      case "AssignmentExpression":
        if (!isLHS && node.left.type === "TSTypeCastExpression") {
          node.left = this.typeCastToParameter(node.left);
        }
      default:
        super.toAssignable(node, isLHS);
    }
  }
  toAssignableParenthesizedExpression(node, isLHS) {
    switch (node.expression.type) {
      case "TSAsExpression":
      case "TSSatisfiesExpression":
      case "TSNonNullExpression":
      case "TSTypeAssertion":
      case "ParenthesizedExpression":
        this.toAssignable(node.expression, isLHS);
        break;
      default:
        super.toAssignable(node, isLHS);
    }
  }
  checkToRestConversion(node, allowPattern) {
    switch (node.type) {
      case "TSAsExpression":
      case "TSSatisfiesExpression":
      case "TSTypeAssertion":
      case "TSNonNullExpression":
        this.checkToRestConversion(node.expression, false);
        break;
      default:
        super.checkToRestConversion(node, allowPattern);
    }
  }
  isValidLVal(type, disallowCallExpression, isUnparenthesizedInAssign, binding) {
    switch (type) {
      case "TSTypeCastExpression":
        return true;
      case "TSParameterProperty":
        return "parameter";
      case "TSNonNullExpression":
        return "expression";
      case "TSAsExpression":
      case "TSSatisfiesExpression":
      case "TSTypeAssertion":
        return (binding !== 64 || !isUnparenthesizedInAssign) && ["expression", true];
      default:
        return super.isValidLVal(type, disallowCallExpression, isUnparenthesizedInAssign, binding);
    }
  }
  parseBindingAtom() {
    if (this.state.type === 74) {
      return this.parseIdentifier(true);
    }
    return super.parseBindingAtom();
  }
  parseMaybeDecoratorArguments(expr, startLoc) {
    if (this.match(43) || this.match(47)) {
      const typeArguments = this.tsParseTypeArgumentsInExpression();
      if (this.match(6)) {
        const call = super.parseMaybeDecoratorArguments(expr, startLoc);
        call.typeArguments = typeArguments;
        return call;
      }
      this.unexpected(null, 6);
    }
    return super.parseMaybeDecoratorArguments(expr, startLoc);
  }
  checkCommaAfterRest(close) {
    if (this.state.isAmbientContext && this.match(8) && this.lookaheadCharCode() === close) {
      this.next();
      return false;
    }
    return super.checkCommaAfterRest(close);
  }
  isClassMethod() {
    return this.match(43) || super.isClassMethod();
  }
  isClassProperty() {
    return this.match(31) || this.match(10) || super.isClassProperty();
  }
  parseMaybeDefault(startLoc, left) {
    const node = super.parseMaybeDefault(startLoc, left);
    if (node.type === "AssignmentPattern" && node.typeAnnotation && node.right.start < node.typeAnnotation.start) {
      this.raise(TSErrors.TypeAnnotationAfterAssign, node.typeAnnotation);
    }
    return node;
  }
  getTokenFromCode(code2) {
    if (this.state.inType) {
      if (code2 === 62) {
        this.finishOp(44, 1);
        return;
      }
      if (code2 === 60) {
        this.finishOp(43, 1);
        return;
      }
    }
    super.getTokenFromCode(code2);
  }
  reScan_lt_gt() {
    const {
      type
    } = this.state;
    if (type === 43) {
      this.state.pos -= 1;
      this.readToken_lt();
    } else if (type === 44) {
      this.state.pos -= 1;
      this.readToken_gt();
    }
  }
  reScan_lt() {
    const {
      type
    } = this.state;
    if (type === 47) {
      this.state.pos -= 2;
      this.finishOp(43, 1);
      return 43;
    }
    return type;
  }
  toAssignableListItem(exprList, index, isLHS) {
    const node = exprList[index];
    if (node.type === "TSTypeCastExpression") {
      exprList[index] = this.typeCastToParameter(node);
    }
    super.toAssignableListItem(exprList, index, isLHS);
  }
  typeCastToParameter(node) {
    node.expression.typeAnnotation = node.typeAnnotation;
    this.resetEndLocationFromNode(node.expression, node.typeAnnotation);
    return node.expression;
  }
  shouldParseArrow(params) {
    if (this.match(10)) {
      return params.every((expr) => this.isAssignable(expr, true));
    }
    return super.shouldParseArrow(params);
  }
  shouldParseAsyncArrow() {
    if (this.match(10)) {
      if (this.state.inConditionalConsequent) return false;
      return true;
    }
    return super.shouldParseAsyncArrow();
  }
  parseParenAndDistinguishExpression(canStartArrow) {
    const oldInConditionalConsequent = this.state.inConditionalConsequent;
    this.state.inConditionalConsequent = false;
    const result = super.parseParenAndDistinguishExpression(canStartArrow);
    this.state.inConditionalConsequent = oldInConditionalConsequent;
    return result;
  }
  canHaveLeadingDecorator() {
    return super.canHaveLeadingDecorator() || this.isAbstractClass();
  }
  jsxParseOpeningElementAfterName(node) {
    if (this.match(43) || this.match(47)) {
      const typeArguments = this.tsTryParseAndCatch(() => this.tsParseTypeArgumentsInExpression());
      if (typeArguments) {
        node.typeArguments = typeArguments;
      }
    }
    return super.jsxParseOpeningElementAfterName(node);
  }
  getGetterSetterExpectedParamCount(method) {
    const baseCount = super.getGetterSetterExpectedParamCount(method);
    const params = this.getObjectOrClassMethodParams(method);
    const firstParam = params[0];
    const hasContextParam = firstParam && this.isThisParam(firstParam);
    return hasContextParam ? baseCount + 1 : baseCount;
  }
  parseCatchClauseParam() {
    const param = super.parseCatchClauseParam();
    const type = this.tsTryParseTypeAnnotation();
    if (type) {
      param.typeAnnotation = type;
      this.resetEndLocation(param);
    }
    return param;
  }
  tsInAmbientContext(cb) {
    const {
      isAmbientContext: oldIsAmbientContext,
      strict: oldStrict
    } = this.state;
    this.state.isAmbientContext = true;
    this.state.strict = false;
    try {
      return cb();
    } finally {
      this.state.isAmbientContext = oldIsAmbientContext;
      this.state.strict = oldStrict;
    }
  }
  parseClass(node, isStatement, optionalId) {
    const oldInAbstractClass = this.state.inAbstractClass;
    this.state.inAbstractClass = !!node.abstract;
    try {
      return super.parseClass(node, isStatement, optionalId);
    } finally {
      this.state.inAbstractClass = oldInAbstractClass;
    }
  }
  tsParseAbstractDeclaration(node, decorators) {
    if (this.match(76)) {
      node.abstract = true;
      return this.maybeTakeDecorators(decorators, this.parseClass(node, true, false));
    } else if (this.isContextual(125)) {
      if (!this.hasFollowingLineBreak()) {
        node.abstract = true;
        this.raise(TSErrors.NonClassMethodPropertyHasAbstractModifier, node);
        return this.tsParseInterfaceDeclaration(node);
      } else {
        return null;
      }
    }
    throw this.unexpected(null, 76);
  }
  parseMethod(node, isGenerator, isAsync, isConstructor, allowDirectSuper, type, inClassScope) {
    const method = super.parseMethod(node, isGenerator, isAsync, isConstructor, allowDirectSuper, type, inClassScope);
    if (method.abstract || method.type === "TSAbstractMethodDefinition") {
      const hasEstreePlugin = this.hasPlugin("estree");
      const methodFn = hasEstreePlugin ? method.value : method;
      if (methodFn.body) {
        const {
          key
        } = method;
        this.raise(TSErrors.AbstractMethodHasImplementation, method, {
          methodName: key.type === "Identifier" && !method.computed ? key.name : `[${this.input.slice(this.offsetToSourcePos(key.start), this.offsetToSourcePos(key.end))}]`
        });
      }
    }
    return method;
  }
  tsParseTypeParameterName() {
    return this.parseIdentifier();
  }
  shouldParseAsAmbientContext() {
    return !!this.getPluginOption("typescript", "dts");
  }
  parse() {
    if (this.shouldParseAsAmbientContext()) {
      this.state.isAmbientContext = true;
    }
    return super.parse();
  }
  getExpression() {
    if (this.shouldParseAsAmbientContext()) {
      this.state.isAmbientContext = true;
    }
    return super.getExpression();
  }
  parseExportSpecifier(node, isString, isInTypeExport, isMaybeTypeOnly) {
    if (!isString && isMaybeTypeOnly) {
      this.parseTypeOnlyImportExportSpecifier(node, false, isInTypeExport);
      return this.finishNode(node, "ExportSpecifier");
    }
    node.exportKind = "value";
    return super.parseExportSpecifier(node, isString, isInTypeExport, isMaybeTypeOnly);
  }
  parseImportSpecifier(specifier, importedIsString, isInTypeOnlyImport, isMaybeTypeOnly, bindingType) {
    if (!importedIsString && isMaybeTypeOnly) {
      this.parseTypeOnlyImportExportSpecifier(specifier, true, isInTypeOnlyImport);
      return this.finishNode(specifier, "ImportSpecifier");
    }
    specifier.importKind = "value";
    return super.parseImportSpecifier(specifier, importedIsString, isInTypeOnlyImport, isMaybeTypeOnly, isInTypeOnlyImport ? 4098 : 4096);
  }
  parseTypeOnlyImportExportSpecifier(node, isImport, isInTypeOnlyImportExport) {
    const leftOfAsKey = isImport ? "imported" : "local";
    const rightOfAsKey = isImport ? "local" : "exported";
    let leftOfAs = node[leftOfAsKey];
    let rightOfAs;
    let hasTypeSpecifier = false;
    let canParseAsKeyword = true;
    const loc = leftOfAs.start;
    if (this.isContextual(89)) {
      const firstAs = this.parseIdentifier();
      if (this.isContextual(89)) {
        const secondAs = this.parseIdentifier();
        if (tokenIsKeywordOrIdentifier(this.state.type)) {
          hasTypeSpecifier = true;
          leftOfAs = firstAs;
          rightOfAs = isImport ? this.parseIdentifier() : this.parseModuleExportName();
          canParseAsKeyword = false;
        } else {
          rightOfAs = secondAs;
          canParseAsKeyword = false;
        }
      } else if (tokenIsKeywordOrIdentifier(this.state.type)) {
        canParseAsKeyword = false;
        rightOfAs = isImport ? this.parseIdentifier() : this.parseModuleExportName();
      } else {
        hasTypeSpecifier = true;
        leftOfAs = firstAs;
      }
    } else if (tokenIsKeywordOrIdentifier(this.state.type)) {
      hasTypeSpecifier = true;
      if (isImport) {
        leftOfAs = this.parseIdentifier(true);
        if (!this.isContextual(89)) {
          this.checkReservedWord(leftOfAs.name, leftOfAs.start, true, true);
        }
      } else {
        leftOfAs = this.parseModuleExportName();
      }
    }
    if (hasTypeSpecifier && isInTypeOnlyImportExport) {
      this.raise(isImport ? TSErrors.TypeModifierIsUsedInTypeImports : TSErrors.TypeModifierIsUsedInTypeExports, loc);
    }
    node[leftOfAsKey] = leftOfAs;
    node[rightOfAsKey] = rightOfAs;
    const kindKey = isImport ? "importKind" : "exportKind";
    node[kindKey] = hasTypeSpecifier ? "type" : "value";
    if (canParseAsKeyword && this.eatContextual(89)) {
      node[rightOfAsKey] = isImport ? this.parseIdentifier() : this.parseModuleExportName();
    }
    if (!node[rightOfAsKey]) {
      node[rightOfAsKey] = this.cloneIdentifier(node[leftOfAsKey]);
    }
    if (isImport) {
      this.checkIdentifier(node[rightOfAsKey], hasTypeSpecifier ? 4098 : 4096);
    }
  }
  fillOptionalPropertiesForTSESLint(node) {
    switch (node.type) {
      case "ExpressionStatement":
        node.directive ??= void 0;
        return;
      case "RestElement":
        node.value = void 0;
      case "Identifier":
      case "ArrayPattern":
      case "AssignmentPattern":
      case "ObjectPattern":
        node.decorators ??= [];
        node.optional ??= false;
        node.typeAnnotation ??= void 0;
        return;
      case "TSParameterProperty":
        node.accessibility ??= void 0;
        node.decorators ??= [];
        node.override ??= false;
        node.readonly ??= false;
        node.static ??= false;
        return;
      case "TSEmptyBodyFunctionExpression":
        node.body = null;
      case "TSDeclareFunction":
      case "FunctionDeclaration":
      case "FunctionExpression":
      case "ClassMethod":
      case "ClassPrivateMethod":
        node.declare ??= false;
        node.returnType ??= void 0;
        node.typeParameters ??= void 0;
        return;
      case "Property":
        node.optional ??= false;
        return;
      case "TSMethodSignature":
      case "TSPropertySignature":
        node.optional ??= false;
      case "TSIndexSignature":
        node.accessibility ??= void 0;
        node.readonly ??= false;
        node.static ??= false;
        return;
      case "TSAbstractPropertyDefinition":
      case "PropertyDefinition":
      case "TSAbstractAccessorProperty":
      case "AccessorProperty":
        node.declare ??= false;
        node.definite ??= false;
        node.readonly ??= false;
        node.typeAnnotation ??= void 0;
      case "TSAbstractMethodDefinition":
      case "MethodDefinition":
        node.accessibility ??= void 0;
        node.decorators ??= [];
        node.override ??= false;
        node.optional ??= false;
        return;
      case "ClassExpression":
        node.id ??= null;
      case "ClassDeclaration":
        node.abstract ??= false;
        node.declare ??= false;
        node.decorators ??= [];
        node.implements ??= [];
        node.superTypeArguments ??= void 0;
        node.typeParameters ??= void 0;
        return;
      case "TSTypeAliasDeclaration":
      case "VariableDeclaration":
        node.declare ??= false;
        return;
      case "VariableDeclarator":
        node.definite ??= false;
        return;
      case "TSEnumDeclaration":
        node.const ??= false;
        node.declare ??= false;
        return;
      case "TSEnumMember":
        node.computed ??= false;
        return;
      case "TSImportType":
        node.qualifier ??= null;
        node.options ??= null;
        node.typeArguments ??= null;
        return;
      case "TSInterfaceDeclaration":
        node.declare ??= false;
        node.extends ??= [];
        return;
      case "TSMappedType":
        node.optional ??= false;
        node.readonly ??= void 0;
        return;
      case "TSModuleDeclaration":
        node.declare ??= false;
        node.global ??= node.kind === "global";
        return;
      case "TSTypeParameter":
        node.const ??= false;
        node.in ??= false;
        node.out ??= false;
        return;
    }
  }
  chStartsBindingIdentifierAndNotRelationalOperator(ch, pos) {
    if (isIdentifierStart(ch)) {
      keywordAndTSRelationalOperator.lastIndex = pos;
      if (keywordAndTSRelationalOperator.test(this.input)) {
        const endCh = this.codePointAtPos(keywordAndTSRelationalOperator.lastIndex);
        if (!isIdentifierChar(endCh) && endCh !== 92) {
          return false;
        }
      }
      return true;
    } else if (ch === 92) {
      return true;
    } else {
      return false;
    }
  }
  nextTokenIsIdentifierAndNotTSRelationalOperatorOnSameLine() {
    const next = this.nextTokenInLineStart();
    const nextCh = this.codePointAtPos(next);
    return this.chStartsBindingIdentifierAndNotRelationalOperator(nextCh, next);
  }
  nextTokenIsStringLiteralOnSameLine() {
    const next = this.nextTokenInLineStart();
    const nextCh = this.codePointAtPos(next);
    return nextCh === 34 || nextCh === 39;
  }
};
function isPossiblyLiteralEnum(expression) {
  if (expression.type !== "MemberExpression") return false;
  const {
    computed,
    property
  } = expression;
  if (computed && property.type !== "StringLiteral" && (property.type !== "TemplateLiteral" || property.expressions.length > 0)) {
    return false;
  }
  return isUncomputedMemberExpressionChain(expression.object);
}
function isValidAmbientConstInitializer(expression, estree2) {
  const {
    type
  } = expression;
  if (expression.extra?.parenthesized) {
    return false;
  }
  if (estree2) {
    if (type === "Literal") {
      const {
        value
      } = expression;
      if (typeof value === "string" || typeof value === "boolean") {
        return true;
      }
    }
  } else {
    if (type === "StringLiteral" || type === "BooleanLiteral") {
      return true;
    }
  }
  if (isNumber2(expression, estree2) || isNegativeNumber(expression, estree2)) {
    return true;
  }
  if (type === "TemplateLiteral" && expression.expressions.length === 0) {
    return true;
  }
  if (isPossiblyLiteralEnum(expression)) {
    return true;
  }
  return false;
}
function isNumber2(expression, estree2) {
  if (estree2) {
    return expression.type === "Literal" && (typeof expression.value === "number" || "bigint" in expression);
  }
  return expression.type === "NumericLiteral" || expression.type === "BigIntLiteral";
}
function isNegativeNumber(expression, estree2) {
  if (expression.type === "UnaryExpression") {
    const {
      operator,
      argument
    } = expression;
    if (operator === "-" && isNumber2(argument, estree2)) {
      return true;
    }
  }
  return false;
}
function isUncomputedMemberExpressionChain(expression) {
  if (expression.type === "Identifier") return true;
  if (expression.type !== "MemberExpression" || expression.computed) {
    return false;
  }
  return isUncomputedMemberExpressionChain(expression.object);
}
var PlaceholderErrorTemplates = {
  ClassNameIsRequired: "A class name is required.",
  UnexpectedSpace: "Unexpected space in placeholder."
};
var PlaceholderErrors = ParseErrorEnum`placeholders`(PlaceholderErrorTemplates);
var placeholders = (superClass) => class PlaceholdersParserMixin extends superClass {
  parsePlaceholder(expectedNode) {
    if (this.match(129)) {
      const node = this.startNode();
      this.next();
      this.assertNoSpace();
      node.name = super.parseIdentifier(true);
      this.assertNoSpace();
      this.expect(129);
      return this.finishPlaceholder(node, expectedNode);
    }
  }
  finishPlaceholder(node, expectedNode) {
    let placeholder = node;
    if (!placeholder.expectedNode || !placeholder.type) {
      placeholder = this.finishNode(placeholder, "Placeholder");
    }
    placeholder.expectedNode = expectedNode;
    return placeholder;
  }
  getTokenFromCode(code2) {
    if (code2 === 37 && this.input.charCodeAt(this.state.pos + 1) === 37) {
      this.finishOp(129, 2);
    } else {
      super.getTokenFromCode(code2);
    }
  }
  parseExprAtom(refExpressionErrors) {
    return this.parsePlaceholder("Expression") || super.parseExprAtom(refExpressionErrors);
  }
  parseIdentifier(liberal) {
    return this.parsePlaceholder("Identifier") || super.parseIdentifier(liberal);
  }
  checkReservedWord(word, startLoc, checkKeywords, isBinding) {
    if (word !== void 0) {
      super.checkReservedWord(word, startLoc, checkKeywords, isBinding);
    }
  }
  cloneIdentifier(node) {
    const cloned = super.cloneIdentifier(node);
    if (cloned.type === "Placeholder") {
      cloned.expectedNode = node.expectedNode;
    }
    return cloned;
  }
  cloneStringLiteral(node) {
    if (node.type === "Placeholder") {
      return this.cloneIdentifier(node);
    }
    return super.cloneStringLiteral(node);
  }
  parseBindingAtom() {
    return this.parsePlaceholder("Pattern") || super.parseBindingAtom();
  }
  isValidLVal(type, disallowCallExpression, isParenthesized, binding) {
    return type === "Placeholder" || super.isValidLVal(type, disallowCallExpression, isParenthesized, binding);
  }
  toAssignable(node, isLHS) {
    if (node && node.type === "Placeholder" && node.expectedNode === "Expression") {
      node.expectedNode = "Pattern";
    } else {
      super.toAssignable(node, isLHS);
    }
  }
  chStartsBindingIdentifier(ch, pos) {
    if (super.chStartsBindingIdentifier(ch, pos)) {
      return true;
    }
    const next = this.nextTokenStart();
    if (this.input.charCodeAt(next) === 37 && this.input.charCodeAt(next + 1) === 37) {
      return true;
    }
    return false;
  }
  verifyBreakContinue(node, isBreak) {
    if (node.label?.type === "Placeholder") return;
    super.verifyBreakContinue(node, isBreak);
  }
  parseExpressionStatement(node, expr) {
    if (expr.type !== "Placeholder" || expr.extra?.parenthesized) {
      return super.parseExpressionStatement(node, expr);
    }
    if (this.match(10)) {
      const stmt = node;
      stmt.label = this.finishPlaceholder(expr, "Identifier");
      this.next();
      stmt.body = super.parseStatementOrSloppyAnnexBFunctionDeclaration();
      return this.finishNode(stmt, "LabeledStatement");
    }
    this.semicolon();
    const stmtPlaceholder = node;
    stmtPlaceholder.name = expr.name;
    return this.finishPlaceholder(stmtPlaceholder, "Statement");
  }
  parseBlock(allowDirectives, createNewLexicalScope, afterBlockParse) {
    return this.parsePlaceholder("BlockStatement") || super.parseBlock(allowDirectives, createNewLexicalScope, afterBlockParse);
  }
  parseFunctionId(requireId) {
    return this.parsePlaceholder("Identifier") || super.parseFunctionId(requireId);
  }
  parseClass(node, isStatement, optionalId) {
    const type = isStatement ? "ClassDeclaration" : "ClassExpression";
    this.next();
    const oldStrict = this.state.strict;
    const placeholder = this.parsePlaceholder("Identifier");
    if (placeholder) {
      if (this.match(77) || this.match(129) || this.match(2)) {
        node.id = placeholder;
      } else if (optionalId || !isStatement) {
        node.id = null;
        node.body = this.finishPlaceholder(placeholder, "ClassBody");
        return this.finishNode(node, type);
      } else {
        throw this.raise(PlaceholderErrors.ClassNameIsRequired, this.state.startLoc);
      }
    } else {
      this.parseClassId(node, isStatement, optionalId);
    }
    super.parseClassSuper(node);
    node.body = this.parsePlaceholder("ClassBody") || super.parseClassBody(!!node.superClass, oldStrict);
    return this.finishNode(node, type);
  }
  parseExport(node, decorators) {
    const placeholder = this.parsePlaceholder("Identifier");
    if (!placeholder) return super.parseExport(node, decorators);
    const node2 = node;
    if (!this.isContextual(94) && !this.match(8)) {
      node2.specifiers = [];
      node2.source = null;
      node2.declaration = this.finishPlaceholder(placeholder, "Declaration");
      return this.finishNode(node2, "ExportNamedDeclaration");
    }
    this.expectPlugin("exportDefaultFrom");
    const specifier = this.startNode();
    specifier.exported = placeholder;
    node2.specifiers = [this.finishNode(specifier, "ExportDefaultSpecifier")];
    return super.parseExport(node2, decorators);
  }
  isExportDefaultSpecifier() {
    if (this.match(61)) {
      const next = this.nextTokenStart();
      if (this.isUnparsedContextual(next, "from")) {
        if (this.input.startsWith(tokenLabelName(129), this.nextTokenStartSince(next + 4))) {
          return true;
        }
      }
    }
    return super.isExportDefaultSpecifier();
  }
  maybeParseExportDefaultSpecifier(node, maybeDefaultIdentifier) {
    if (node.specifiers?.length) {
      return true;
    }
    return super.maybeParseExportDefaultSpecifier(node, maybeDefaultIdentifier);
  }
  checkExport(node) {
    const {
      specifiers
    } = node;
    if (specifiers?.length) {
      node.specifiers = specifiers.filter((node2) => node2.exported.type === "Placeholder");
    }
    super.checkExport(node);
    node.specifiers = specifiers;
  }
  parseImport(node) {
    const placeholder = this.parsePlaceholder("Identifier");
    if (!placeholder) return super.parseImport(node);
    node.specifiers = [];
    if (!this.isContextual(94) && !this.match(8)) {
      node.source = this.finishPlaceholder(placeholder, "StringLiteral");
      this.semicolon();
      return this.finishNode(node, "ImportDeclaration");
    }
    const specifier = this.startNodeAtNode(placeholder);
    specifier.local = placeholder;
    node.specifiers.push(this.finishNode(specifier, "ImportDefaultSpecifier"));
    if (this.eat(8)) {
      const hasStarImport = this.maybeParseStarImportSpecifier(node);
      if (!hasStarImport) this.parseNamedImportSpecifiers(node);
    }
    this.expectContextual(94);
    node.source = this.parseImportSource();
    this.semicolon();
    return this.finishNode(node, "ImportDeclaration");
  }
  parseImportSource() {
    return this.parsePlaceholder("StringLiteral") || super.parseImportSource();
  }
  assertNoSpace() {
    if (this.state.start > this.offsetToSourcePos(this.state.lastTokEndLoc.index)) {
      this.raise(PlaceholderErrors.UnexpectedSpace, this.state.lastTokEndLoc);
    }
  }
};
var v8intrinsic = (superClass) => class V8IntrinsicMixin extends superClass {
  parseV8Intrinsic() {
    if (this.match(50)) {
      const v8IntrinsicStartLoc = this.state.startLoc;
      const node = this.startNode();
      this.next();
      if (tokenIsIdentifier(this.state.type)) {
        const name = this.parseIdentifierName();
        const identifier = this.createIdentifier(node, name);
        this.castNodeTo(identifier, "V8IntrinsicIdentifier");
        if (this.match(6)) {
          return identifier;
        }
      }
      this.unexpected(v8IntrinsicStartLoc);
    }
  }
  parseExprAtom(refExpressionErrors) {
    return this.parseV8Intrinsic() || super.parseExprAtom(refExpressionErrors);
  }
};
var PIPELINE_PROPOSALS = ["fsharp", "hack"];
var TOPIC_TOKENS = ["^^", "@@", "^", "%", "#"];
function validatePlugins(pluginsMap) {
  if (pluginsMap.has("decorators")) {
    if (pluginsMap.has("decorators-legacy")) {
      throw new Error("Cannot use the decorators and decorators-legacy plugin together");
    }
  }
  if (pluginsMap.has("flow") && pluginsMap.has("typescript")) {
    throw new Error("Cannot combine flow and typescript plugins.");
  }
  if (pluginsMap.has("placeholders") && pluginsMap.has("v8intrinsic")) {
    throw new Error("Cannot combine placeholders and v8intrinsic plugins.");
  }
  if (pluginsMap.has("pipelineOperator")) {
    const proposal = pluginsMap.get("pipelineOperator").proposal;
    if (!PIPELINE_PROPOSALS.includes(proposal)) {
      const proposalList = PIPELINE_PROPOSALS.map((p) => `"${p}"`).join(", ");
      throw new Error(`"pipelineOperator" requires "proposal" option whose value must be one of: ${proposalList}.`);
    }
    if (proposal === "hack") {
      if (pluginsMap.has("placeholders")) {
        throw new Error("Cannot combine placeholders plugin and Hack-style pipes.");
      }
      if (pluginsMap.has("v8intrinsic")) {
        throw new Error("Cannot combine v8intrinsic plugin and Hack-style pipes.");
      }
      const topicToken = pluginsMap.get("pipelineOperator").topicToken;
      if (!TOPIC_TOKENS.includes(topicToken)) {
        const tokenList = TOPIC_TOKENS.map((t2) => `"${t2}"`).join(", ");
        throw new Error(`"pipelineOperator" in "proposal": "hack" mode also requires a "topicToken" option whose value must be one of: ${tokenList}.`);
      }
    }
  }
  if (pluginsMap.has("moduleAttributes")) {
    throw new Error("`moduleAttributes` has been removed in Babel 8, please migrate to import attributes instead.");
  }
  if (pluginsMap.has("importAssertions")) {
    throw new Error("`importAssertions` has been removed in Babel 8, please use import attributes instead.");
  }
  if (pluginsMap.has("deprecatedImportAssert")) {
    console.warn("`deprecatedImportAssert` has been removed in Babel 8, please use import attributes instead.");
  } else if (pluginsMap.has("importAttributes") && pluginsMap.get("importAttributes").deprecatedAssertSyntax) {
    console.warn("The 'importAttributes' plugin has been removed in Babel 8. Please migrate any usage of `assert`-style attributes to `with`.");
  }
  if (pluginsMap.has("recordAndTuple")) {
    throw new Error("The 'recordAndTuple' plugin has been removed in Babel 8. Please remove it from your configuration.");
  }
  if (pluginsMap.has("asyncDoExpressions") && !pluginsMap.has("doExpressions")) {
    const error = new Error("'asyncDoExpressions' requires 'doExpressions', please add 'doExpressions' to parser plugins.");
    error.missingPlugins = "doExpressions";
    throw error;
  }
  if (pluginsMap.has("optionalChainingAssign") && pluginsMap.get("optionalChainingAssign").version !== "2023-07") {
    throw new Error("The 'optionalChainingAssign' plugin requires a 'version' option, representing the last proposal update. Currently, the only supported value is '2023-07'.");
  }
  if (pluginsMap.has("discardBinding") && pluginsMap.get("discardBinding").syntaxType !== "void") {
    throw new Error("The 'discardBinding' plugin requires a 'syntaxType' option. Currently the only supported value is 'void'.");
  }
  if (pluginsMap.has("decimal")) {
    throw new Error("The 'decimal' plugin has been removed in Babel 8. Please remove it from your configuration.");
  }
  if (pluginsMap.has("importReflection")) {
    throw new Error("The 'importReflection' plugin has been removed in Babel 8. Use 'sourcePhaseImports' instead, and replace 'import module' with 'import source' in your code.");
  }
}
var mixinPlugins = {
  estree,
  jsx,
  flow,
  typescript,
  v8intrinsic,
  placeholders
};
var mixinPluginNames = Object.keys(mixinPlugins);
var Parser2 = class extends StatementParser {
  constructor(options, input, pluginsMap) {
    const normalizedOptions = getOptions(options);
    super(normalizedOptions, input);
    this.options = normalizedOptions;
    this.initializeScopes();
    this.plugins = pluginsMap;
    this.filename = normalizedOptions.sourceFilename;
    this.startIndex = normalizedOptions.startIndex;
    let optionFlags = 0;
    if (normalizedOptions.allowAwaitOutsideFunction) {
      optionFlags |= 1;
    }
    if (normalizedOptions.allowReturnOutsideFunction) {
      optionFlags |= 2;
    }
    if (normalizedOptions.allowImportExportEverywhere) {
      optionFlags |= 8;
    }
    if (normalizedOptions.allowSuperOutsideMethod) {
      optionFlags |= 16;
    }
    if (normalizedOptions.allowUndeclaredExports) {
      optionFlags |= 64;
    }
    if (normalizedOptions.allowNewTargetOutsideFunction) {
      optionFlags |= 4;
    }
    if (normalizedOptions.allowYieldOutsideFunction) {
      optionFlags |= 32;
    }
    if (normalizedOptions.ranges) {
      optionFlags |= 128;
    }
    if (normalizedOptions.locations === true) {
      optionFlags |= 256;
    }
    if (normalizedOptions.tokens) {
      optionFlags |= 512;
    }
    if (normalizedOptions.createImportExpressions) {
      optionFlags |= 1024;
    }
    if (normalizedOptions.createParenthesizedExpressions) {
      optionFlags |= 2048;
    }
    if (normalizedOptions.errorRecovery) {
      optionFlags |= 4096;
    }
    if (normalizedOptions.attachComment) {
      optionFlags |= 8192;
    }
    if (normalizedOptions.annexB) {
      optionFlags |= 16384;
    }
    this.optionFlags = optionFlags;
  }
  getScopeHandler() {
    return ScopeHandler;
  }
  parse() {
    this.enterInitialScopes();
    const file = this.startNode();
    const program = this.startNode();
    this.nextToken();
    file.errors = [];
    const result = this.parseTopLevel(file, program);
    result.errors = this.state.errors;
    result.comments.length = this.state.commentsLen;
    return result;
  }
};
function parse(input, options) {
  if (options?.sourceType === "unambiguous") {
    options = {
      ...options
    };
    try {
      options.sourceType = "module";
      const parser = getParser(options, input);
      const ast = parser.parse();
      if (parser.sawUnambiguousESM) {
        return ast;
      }
      if (parser.ambiguousScriptDifferentAst) {
        try {
          options.sourceType = "script";
          return getParser(options, input).parse();
        } catch {
        }
      } else {
        ast.program.sourceType = "script";
      }
      return ast;
    } catch (moduleError) {
      try {
        options.sourceType = "script";
        return getParser(options, input).parse();
      } catch {
      }
      throw moduleError;
    }
  } else {
    return getParser(options, input).parse();
  }
}
function generateExportedTokenTypes(internalTokenTypes) {
  const tokenTypes2 = {};
  for (const typeName of Object.keys(internalTokenTypes)) {
    tokenTypes2[typeName] = getExportedToken(internalTokenTypes[typeName]);
  }
  return tokenTypes2;
}
var tokTypes = generateExportedTokenTypes(tt);
function getParser(options, input) {
  let cls = Parser2;
  const pluginsMap = /* @__PURE__ */ new Map();
  if (options?.plugins) {
    for (const plugin of options.plugins) {
      let name, opts;
      if (typeof plugin === "string") {
        name = plugin;
      } else {
        [name, opts] = plugin;
      }
      if (!pluginsMap.has(name)) {
        pluginsMap.set(name, opts || {});
      }
    }
    validatePlugins(pluginsMap);
    cls = getParserClass(pluginsMap);
  }
  return new cls(options, input, pluginsMap);
}
var parserClassCache = /* @__PURE__ */ new Map();
function getParserClass(pluginsMap) {
  const pluginList = [];
  for (const name of mixinPluginNames) {
    if (pluginsMap.has(name)) {
      pluginList.push(name);
    }
  }
  const key = pluginList.join("|");
  let cls = parserClassCache.get(key);
  if (!cls) {
    cls = Parser2;
    for (const plugin of pluginList) {
      cls = mixinPlugins[plugin](cls);
    }
    parserClassCache.set(key, cls);
  }
  return cls;
}

// src/parse/jsx-ast.ts
function parseJsxAst(source) {
  try {
    return parse(source, {
      sourceType: "module",
      errorRecovery: true,
      plugins: ["typescript", "jsx"]
    });
  } catch {
    return null;
  }
}
var SKIP_KEYS = /* @__PURE__ */ new Set(["type", "start", "end", "loc", "range", "leadingComments", "trailingComments", "innerComments", "extra", "comments", "tokens"]);
function asNode(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : void 0;
}
function asNodes(value) {
  return Array.isArray(value) ? value : [];
}
function walkAst(root, visit) {
  if (Array.isArray(root)) {
    for (const item of root) walkAst(item, visit);
    return;
  }
  const n = asNode(root);
  if (!n || typeof n.type !== "string") return;
  visit(n);
  for (const key in n) {
    if (SKIP_KEYS.has(key)) continue;
    walkAst(n[key], visit);
  }
}

// src/parse/jsx-bridge.ts
var RENAME = { classname: "class", htmlfor: "for" };
function asNode2(v) {
  return v && typeof v === "object" && !Array.isArray(v) ? v : void 0;
}
function asNodes2(v) {
  return Array.isArray(v) ? v : [];
}
function jsxName(name) {
  if (!name) return "unknown";
  if (name.type === "JSXIdentifier") return typeof name.name === "string" ? name.name : "unknown";
  if (name.type === "JSXNamespacedName") {
    const ns = asNode2(name.namespace);
    const nm = asNode2(name.name);
    return `${ns?.name ?? ""}:${nm?.name ?? ""}`;
  }
  if (name.type === "JSXMemberExpression") {
    const parts = [];
    let n = name;
    while (n && n.type === "JSXMemberExpression") {
      const prop = asNode2(n.property);
      if (prop && typeof prop.name === "string") parts.unshift(prop.name);
      n = asNode2(n.object);
    }
    if (n && typeof n.name === "string") parts.unshift(n.name);
    return parts.join(".");
  }
  return "unknown";
}
function isIntrinsic(tag) {
  const head = tag.split(".")[0] ?? tag;
  const first = head[0] ?? "";
  return first === first.toLowerCase();
}
function normAttrName(raw) {
  const lower = raw.toLowerCase();
  return RENAME[lower] ?? lower;
}
function attribsOf(opening2, source) {
  const attribs = {};
  for (const a of asNodes2(opening2.attributes)) {
    if (a.type === "JSXSpreadAttribute") continue;
    if (a.type !== "JSXAttribute") continue;
    const name = normAttrName(jsxName(asNode2(a.name)));
    if (name in attribs) continue;
    const value = asNode2(a.value);
    if (!value) {
      attribs[name] = "";
    } else if (value.type === "StringLiteral") {
      attribs[name] = typeof value.value === "string" ? value.value : "";
    } else {
      attribs[name] = source.slice(value.start ?? 0, value.end ?? 0);
    }
  }
  return attribs;
}
function collectJsx(node, out) {
  const n = asNode2(node);
  if (Array.isArray(node)) {
    for (const item of node) collectJsx(item, out);
    return;
  }
  if (!n || typeof n.type !== "string") return;
  if (n.type === "JSXElement" || n.type === "JSXFragment") {
    out.push(n);
    return;
  }
  for (const key in n) {
    if (key === "loc" || key === "start" || key === "end" || key === "range" || key === "type") continue;
    collectJsx(n[key], out);
  }
}
function jsxAstToDoc(ast, source, file) {
  const lineStarts = lineStartsOf(source);
  const elements = [];
  const byId2 = /* @__PURE__ */ new Map();
  const roots = [];
  const convert = (node, parent) => {
    let tag = "#fragment";
    let attribs = {};
    let spread = false;
    if (node.type === "JSXElement") {
      const opening2 = asNode2(node.openingElement);
      const raw = jsxName(opening2 ? asNode2(opening2.name) : void 0);
      tag = isIntrinsic(raw) ? raw.toLowerCase() : raw;
      if (opening2) {
        attribs = attribsOf(opening2, source);
        spread = asNodes2(opening2.attributes).some((a) => a.type === "JSXSpreadAttribute");
      }
    }
    const el = {
      type: "element",
      tag,
      attribs,
      children: [],
      parent,
      line: node.loc?.start.line ?? 1,
      col: (node.loc?.start.column ?? 0) + 1,
      start: node.start ?? 0,
      end: node.end ?? 0,
      ...spread ? { spread: true } : {}
    };
    elements.push(el);
    const id = attribs.id;
    if (id && !byId2.has(id)) byId2.set(id, el);
    for (const c of asNodes2(node.children)) {
      if (c.type === "JSXText") {
        const data2 = typeof c.value === "string" ? c.value : "";
        if (data2.trim() !== "") el.children.push({ type: "text", data: data2, parent: el });
      } else if (c.type === "JSXElement" || c.type === "JSXFragment") {
        el.children.push(convert(c, el));
      } else if (c.type === "JSXExpressionContainer" || c.type === "JSXSpreadChild") {
        el.children.push({ type: "text", data: source.slice(c.start ?? 0, c.end ?? 0), parent: el });
        const nested = [];
        collectJsx(c.expression ?? c, nested);
        for (const j of nested) el.children.push(convert(j, el));
      }
    }
    return el;
  };
  const visit = (node) => {
    if (Array.isArray(node)) {
      for (const item of node) visit(item);
      return;
    }
    const n = asNode2(node);
    if (!n || typeof n.type !== "string") return;
    if (n.type === "JSXElement" || n.type === "JSXFragment") {
      roots.push(convert(n, null));
      return;
    }
    for (const key in n) {
      if (key === "loc" || key === "start" || key === "end" || key === "range" || key === "type") continue;
      visit(n[key]);
    }
  };
  visit(ast.program);
  const opaqueComponents = opaqueLibrarySpecifiers(ast, elements);
  return { file, source, lossy: false, kind: "jsx-ast", roots, elements, byId: byId2, lineStarts, ...opaqueComponents.length ? { opaqueComponents } : {} };
}
function isLibrarySpecifier(spec) {
  if (spec.startsWith(".") || spec.startsWith("/") || spec.startsWith("@/") || spec.startsWith("~")) return false;
  if (/^@[a-zA-Z][^/]*\/.+/.test(spec)) return true;
  return /^[a-zA-Z]/.test(spec);
}
function opaqueLibrarySpecifiers(ast, elements) {
  const importSrc = /* @__PURE__ */ new Map();
  const body = asNodes2((asNode2(ast.program) ?? ast).body);
  for (const stmt of body) {
    if (stmt.type !== "ImportDeclaration") continue;
    const source = asNode2(stmt.source);
    const spec = source && typeof source.value === "string" ? source.value : "";
    if (!spec) continue;
    for (const s of asNodes2(stmt.specifiers)) {
      const local = asNode2(s.local);
      if (local && typeof local.name === "string") importSrc.set(local.name, spec);
    }
  }
  const opaque = /* @__PURE__ */ new Set();
  for (const el of elements) {
    if (isIntrinsic(el.tag) || el.tag === "#fragment") continue;
    const head = el.tag.split(".")[0] ?? el.tag;
    const spec = importSrc.get(head);
    if (spec && isLibrarySpecifier(spec)) opaque.add(spec);
  }
  return [...opaque].sort();
}

// src/parse/source.ts
function detectKind(file, forceJsx = false) {
  if (forceJsx) return "jsx";
  if (/\.(jsx|tsx)$/i.test(file)) return "jsx";
  return "html";
}
function parseSource(source, file, opts = {}) {
  const kind = detectKind(file, opts.forceJsx);
  if (kind === "jsx") {
    const ast = parseJsxAst(source);
    if (ast) return jsxAstToDoc(ast, source, file);
    return parseHtml(jsxToHtml(source), file, true);
  }
  return parseHtml(source, file, false);
}

// src/name.ts
var collapse = (s) => s.replace(/\s+/g, " ").trim();
function nameFromContent(el) {
  let out = "";
  const walk2 = (n) => {
    if (n.type === "text") {
      out += n.data;
      return;
    }
    if (n.tag === "img") {
      const a = attr(n, "alt");
      if (a) out += " " + a;
      return;
    }
    if (n.tag === "svg") {
      const title = descendants(n).find((d) => d.tag === "title");
      if (title) out += " " + nameFromContent(title);
      return;
    }
    if (attr(n, "aria-hidden") === "true") return;
    for (const c of n.children) walk2(c);
  };
  for (const c of el.children) walk2(c);
  return collapse(out);
}
function ariaLabelledbyText(el, doc) {
  const ids = attr(el, "aria-labelledby");
  if (!ids) return "";
  const parts = [];
  for (const id of ids.split(/\s+/).filter(Boolean)) {
    const ref = doc.byId.get(id);
    if (ref) parts.push(nameFromContent(ref) || (attr(ref, "aria-label") ?? "").trim());
  }
  return collapse(parts.join(" "));
}
var BUTTON_INPUT = /* @__PURE__ */ new Set(["button", "submit", "reset"]);
var NAMELESS_BY_DEFAULT = /* @__PURE__ */ new Set(["submit", "reset"]);
function accessibleName(el, doc) {
  const labelledby = ariaLabelledbyText(el, doc);
  if (labelledby) return labelledby;
  const ariaLabel = (attr(el, "aria-label") ?? "").trim();
  if (ariaLabel) return ariaLabel;
  if (el.tag === "img" || el.tag === "area") {
    return (attr(el, "alt") ?? "").trim();
  }
  if (el.tag === "input") {
    const type = (attr(el, "type") ?? "text").toLowerCase();
    if (BUTTON_INPUT.has(type)) {
      const value = (attr(el, "value") ?? "").trim();
      if (value) return value;
      if (NAMELESS_BY_DEFAULT.has(type)) return type === "submit" ? "Submit" : "Reset";
      return (attr(el, "title") ?? "").trim();
    }
  }
  const content = nameFromContent(el);
  if (content) return content;
  return (attr(el, "title") ?? "").trim();
}
var FIELD_TAGS = /* @__PURE__ */ new Set(["input", "select", "textarea"]);
var NON_LABELABLE_INPUT = /* @__PURE__ */ new Set(["hidden", "submit", "reset", "button", "image"]);
function isFormField(el) {
  if (!FIELD_TAGS.has(el.tag)) return false;
  if (el.tag === "input") {
    const type = (attr(el, "type") ?? "text").toLowerCase();
    return !NON_LABELABLE_INPUT.has(type);
  }
  return true;
}
function controlLabel(el, doc) {
  if (attr(el, "aria-labelledby") && ariaLabelledbyText(el, doc)) return { hasLabel: true, via: "aria-labelledby" };
  if ((attr(el, "aria-label") ?? "").trim()) return { hasLabel: true, via: "aria-label" };
  const id = attr(el, "id");
  if (id) {
    const lbl = doc.elements.find((e) => e.tag === "label" && attr(e, "for") === id);
    if (lbl) return { hasLabel: true, via: "for" };
  }
  if (ancestors(el).some((a) => a.tag === "label")) return { hasLabel: true, via: "wrapping" };
  if ((attr(el, "title") ?? "").trim()) return { hasLabel: true, via: "title" };
  return { hasLabel: false, via: null };
}

// src/rules/rule.ts
function isFullDocument(doc) {
  return doc.elements.some((e) => e.tag === "html");
}
function selectorOf(el) {
  const id = el.attribs.id;
  if (id) return `${el.tag}#${id}`;
  const type = el.attribs.type;
  if (type && (el.tag === "input" || el.tag === "button")) return `${el.tag}[type=${type}]`;
  const cls = el.attribs.class;
  if (cls) return `${el.tag}.${cls.trim().split(/\s+/)[0]}`;
  if (el.tag === "a" && el.attribs.href) {
    const h = el.attribs.href;
    return `a[href=${h.length > 30 ? h.slice(0, 30) + "\u2026" : h}]`;
  }
  return el.tag;
}
function toFinding(doc, ruleId, def, rf) {
  return {
    ruleId,
    criteriaId: rf.criteriaId,
    file: doc.file,
    line: rf.el.line,
    col: rf.el.col,
    selectorHint: rf.selectorHint ?? selectorOf(rf.el),
    severity: rf.severity ?? def,
    message: rf.message,
    remediation: rf.remediation,
    snippet: snippet(doc, rf.el),
    // Only carry source offsets when they index into the *real* file. For lossy
    // JSX/TSX the offsets are into the transformed HTML string, so `fix` must not
    // edit by range and baseline diffing falls back to line/selector identity.
    ...doc.lossy ? {} : { sourceStart: rf.el.start, sourceEnd: rf.el.end }
  };
}

// src/rules/images.ts
var isHidden = (el) => attr(el, "aria-hidden") === "true" || ["presentation", "none"].includes((attr(el, "role") ?? "").trim());
var named = (el) => !!(attr(el, "aria-label") ?? "").trim() || hasAttr(el, "aria-labelledby");
var imgAltMissing = {
  id: "img-alt-missing",
  criteria: ["1.1"],
  parser: ["html", "jsx"],
  severity: "bloquant",
  run(doc) {
    const out = [];
    for (const el of doc.elements) {
      const isImg = el.tag === "img" || el.tag === "area" || (attr(el, "role") ?? "") === "img";
      if (!isImg) continue;
      if (isHidden(el) && el.tag !== "area") continue;
      if (hasAttr(el, "alt") || named(el)) continue;
      out.push({
        criteriaId: "1.1",
        el,
        message: `<${el.tag}> sans attribut alt ni nom accessible \u2014 alternative textuelle manquante.`,
        remediation: `Ajoutez alt="\u2026" (description si l'image porte de l'information, alt="" si elle est d\xE9corative).`
      });
    }
    return out;
  }
};
var decorativeAltMisuse = {
  id: "decorative-alt-misuse",
  criteria: ["1.2"],
  parser: ["html", "jsx"],
  severity: "majeur",
  run(doc) {
    const out = [];
    for (const el of doc.elements) {
      if (el.tag !== "img") continue;
      const alt = attr(el, "alt");
      const role = (attr(el, "role") ?? "").trim();
      const ariaLabel = (attr(el, "aria-label") ?? "").trim();
      const title = (attr(el, "title") ?? "").trim();
      if (alt === "" && (ariaLabel || title)) {
        out.push({
          criteriaId: "1.2",
          el,
          message: `Image d\xE9corative (alt="") mais nomm\xE9e par aria-label/title \u2014 incoh\xE9rence d\xE9coratif/informatif.`,
          remediation: `Si l'image est d\xE9corative, retirez aria-label/title ; sinon donnez un alt descriptif.`
        });
      } else if (["presentation", "none"].includes(role) && alt?.trim()) {
        out.push({
          criteriaId: "1.2",
          el,
          message: `Image en role="${role}" mais porteuse d'un alt non vide \u2014 d\xE9clar\xE9e d\xE9corative pourtant nomm\xE9e.`,
          remediation: `Retirez role="${role}" si l'image est informative, ou videz l'alt si elle est d\xE9corative.`
        });
      }
    }
    return out;
  }
};
var canvasFallbackMissing = {
  id: "canvas-fallback-missing",
  criteria: ["1.1"],
  parser: ["html", "jsx"],
  severity: "majeur",
  run(doc) {
    const out = [];
    for (const el of doc.elements) {
      if (el.tag !== "canvas") continue;
      const hasFallback = el.children.some((c) => c.type === "element" ? true : c.data.trim().length > 0);
      if (hasFallback || named(el) || visibleText(el)) continue;
      out.push({
        criteriaId: "1.1",
        el,
        message: `<canvas> sans contenu alternatif ni nom accessible.`,
        remediation: `Placez un contenu de repli entre <canvas>\u2026</canvas> ou ajoutez role="img" + aria-label.`
      });
    }
    return out;
  }
};
var imagesRules = [imgAltMissing, decorativeAltMisuse, canvasFallbackMissing];

// src/rules/frames.ts
var iframeTitleMissing = {
  id: "iframe-title-missing",
  criteria: ["2.1"],
  parser: ["html", "jsx"],
  severity: "bloquant",
  run(doc) {
    const out = [];
    for (const el of doc.elements) {
      if (el.tag !== "iframe") continue;
      if (attr(el, "aria-hidden") === "true") continue;
      const title = (attr(el, "title") ?? "").trim();
      const aria = (attr(el, "aria-label") ?? "").trim();
      if (title || aria) continue;
      out.push({
        criteriaId: "2.1",
        el,
        message: `<iframe> sans attribut title \u2014 le cadre n'a pas de titre.`,
        remediation: `Ajoutez un title d\xE9crivant le contenu du cadre, ex. title="Carte de localisation".`
      });
    }
    return out;
  }
};
var framesRules = [iframeTitleMissing];

// src/rules/scripts-aria.ts
var INTERACTIVE_ROLES = [
  "button",
  "link",
  "checkbox",
  "radio",
  "tab",
  "menuitem",
  "menuitemcheckbox",
  "menuitemradio",
  "option",
  "switch",
  "textbox",
  "combobox",
  "slider",
  "spinbutton"
];
function isInteractive(el) {
  if (el.tag === "a") return hasAttr(el, "href");
  if (["button", "select", "textarea"].includes(el.tag)) return true;
  if (el.tag === "input") return (attr(el, "type") ?? "text").toLowerCase() !== "hidden";
  return INTERACTIVE_ROLES.includes((attr(el, "role") ?? "").trim());
}
function isFocusable(el) {
  if (isInteractive(el)) return true;
  const ti = attr(el, "tabindex");
  if (ti !== void 0 && Number(ti) >= 0) return true;
  return hasAttr(el, "contenteditable") && attr(el, "contenteditable") !== "false";
}
var VALID_ROLES = /* @__PURE__ */ new Set([
  "alert",
  "alertdialog",
  "application",
  "article",
  "banner",
  "blockquote",
  "button",
  "caption",
  "cell",
  "checkbox",
  "code",
  "columnheader",
  "combobox",
  "complementary",
  "contentinfo",
  "definition",
  "deletion",
  "dialog",
  "directory",
  "document",
  "emphasis",
  "feed",
  "figure",
  "form",
  "generic",
  "grid",
  "gridcell",
  "group",
  "heading",
  "img",
  "insertion",
  "link",
  "list",
  "listbox",
  "listitem",
  "log",
  "main",
  "marquee",
  "math",
  "menu",
  "menubar",
  "menuitem",
  "menuitemcheckbox",
  "menuitemradio",
  "meter",
  "navigation",
  "none",
  "note",
  "option",
  "paragraph",
  "presentation",
  "progressbar",
  "radio",
  "radiogroup",
  "region",
  "row",
  "rowgroup",
  "rowheader",
  "scrollbar",
  "search",
  "searchbox",
  "separator",
  "slider",
  "spinbutton",
  "status",
  "strong",
  "subscript",
  "superscript",
  "switch",
  "tab",
  "table",
  "tablist",
  "tabpanel",
  "term",
  "textbox",
  "time",
  "timer",
  "toolbar",
  "tooltip",
  "tree",
  "treegrid",
  "treeitem"
]);
var IDREF_ATTRS = ["aria-labelledby", "aria-describedby", "aria-controls", "aria-owns", "aria-details", "aria-errormessage", "aria-flowto"];
var IDREF_SINGLE = ["aria-activedescendant"];
var invalidAriaRole = {
  id: "invalid-aria-role",
  criteria: ["7.1"],
  parser: ["html", "jsx"],
  severity: "majeur",
  run(doc) {
    const out = [];
    for (const el of doc.elements) {
      const role = (attr(el, "role") ?? "").trim();
      if (!role) continue;
      const tokens = role.split(/\s+/);
      const bad = tokens.filter((t2) => !VALID_ROLES.has(t2.toLowerCase()));
      if (bad.length) {
        out.push({
          criteriaId: "7.1",
          el,
          message: `R\xF4le ARIA invalide : "${bad.join(" ")}" n'est pas un r\xF4le WAI-ARIA valide.`,
          remediation: `Utilisez un r\xF4le ARIA valide ou un \xE9l\xE9ment HTML natif \xE9quivalent.`
        });
      }
    }
    return out;
  }
};
var ariaRefMissingId = {
  id: "aria-ref-missing-id",
  criteria: ["7.1"],
  parser: ["html", "jsx"],
  severity: "bloquant",
  run(doc) {
    const out = [];
    for (const el of doc.elements) {
      const refs = [];
      for (const a of IDREF_ATTRS) {
        const v = attr(el, a);
        if (v) refs.push({ attr: a, ids: v.split(/\s+/).filter(Boolean) });
      }
      for (const a of IDREF_SINGLE) {
        const v = (attr(el, a) ?? "").trim();
        if (v) refs.push({ attr: a, ids: [v] });
      }
      for (const { attr: a, ids } of refs) {
        const missing = ids.filter((id) => !doc.byId.has(id));
        if (missing.length) {
          out.push({
            criteriaId: "7.1",
            el,
            message: `${a} r\xE9f\xE9rence un id inexistant : ${missing.map((m) => `#${m}`).join(", ")}.`,
            remediation: `Corrigez la r\xE9f\xE9rence ou ajoutez l'\xE9l\xE9ment cible avec l'id attendu.`
          });
        }
      }
    }
    return out;
  }
};
var IMPLICIT_ROLE = {
  button: "button",
  nav: "navigation",
  main: "main",
  ul: "list",
  ol: "list",
  li: "listitem",
  table: "table",
  h1: "heading",
  h2: "heading",
  h3: "heading",
  h4: "heading",
  h5: "heading",
  h6: "heading",
  form: "form",
  article: "article",
  aside: "complementary",
  dialog: "dialog",
  figure: "figure"
};
var redundantAria = {
  id: "redundant-aria",
  criteria: ["7.1"],
  parser: ["html", "jsx"],
  severity: "mineur",
  run(doc) {
    const out = [];
    for (const el of doc.elements) {
      const role = (attr(el, "role") ?? "").trim().toLowerCase();
      if (!role) continue;
      let implicit = IMPLICIT_ROLE[el.tag];
      if (el.tag === "a" && hasAttr(el, "href")) implicit = "link";
      if (implicit && implicit === role) {
        out.push({
          criteriaId: "7.1",
          el,
          message: `role="${role}" est redondant : <${el.tag}> a d\xE9j\xE0 ce r\xF4le implicite.`,
          remediation: `Retirez l'attribut role redondant et laissez la s\xE9mantique native.`
        });
      }
    }
    return out;
  }
};
var NONINTERACTIVE = /* @__PURE__ */ new Set(["div", "span"]);
var clickableNoninteractive = {
  id: "clickable-noninteractive",
  criteria: ["7.1", "7.3"],
  parser: ["html", "jsx"],
  severity: "majeur",
  run(doc) {
    const out = [];
    for (const el of doc.elements) {
      if (!NONINTERACTIVE.has(el.tag)) continue;
      if (!hasAttr(el, "onclick")) continue;
      const role = (attr(el, "role") ?? "").trim();
      const hasTab = hasAttr(el, "tabindex");
      const interactiveRole = ["button", "link", "checkbox", "tab", "menuitem", "switch", "option"].includes(role);
      if (interactiveRole && hasTab) continue;
      const noKeyboard = !hasTab;
      out.push({
        criteriaId: noKeyboard ? "7.3" : "7.1",
        el,
        message: `<${el.tag}> avec onClick mais ${noKeyboard ? "non focalisable (tabindex absent)" : "sans r\xF4le interactif"} \u2014 contr\xF4le non accessible au clavier/AT.`,
        remediation: `Utilisez <button>/<a> natif, ou ajoutez role + tabindex="0" + gestion clavier (Enter/Espace).`
      });
    }
    return out;
  }
};
var REQUIRED_CHILDREN = {
  list: ["listitem"],
  tablist: ["tab"],
  radiogroup: ["radio"],
  tree: ["treeitem"],
  menu: ["menuitem", "menuitemcheckbox", "menuitemradio"],
  menubar: ["menuitem", "menuitemcheckbox", "menuitemradio"]
};
function satisfiesChild(d, reqRoles) {
  const role = (attr(d, "role") ?? "").trim();
  if (reqRoles.includes(role)) return true;
  if (reqRoles.includes("listitem") && d.tag === "li") return true;
  if (reqRoles.includes("radio") && d.tag === "input" && (attr(d, "type") ?? "").toLowerCase() === "radio") return true;
  return false;
}
var ariaRequiredChildren = {
  id: "aria-required-children",
  criteria: ["7.1"],
  parser: ["html", "jsx"],
  severity: "majeur",
  run(doc) {
    const out = [];
    for (const el of doc.elements) {
      const role = (attr(el, "role") ?? "").trim();
      const req = REQUIRED_CHILDREN[role];
      if (!req) continue;
      if (hasAttr(el, "aria-owns")) continue;
      if (descendants(el).some((d) => satisfiesChild(d, req))) continue;
      out.push({
        criteriaId: "7.1",
        el,
        message: `role="${role}" sans enfant requis (${req.join("/")}) \u2014 structure ARIA incompl\xE8te.`,
        remediation: `Ajoutez les \xE9l\xE9ments enfants au r\xF4le appropri\xE9, ou utilisez les \xE9l\xE9ments HTML natifs.`
      });
    }
    return out;
  }
};
var ariaHiddenFocusable = {
  id: "aria-hidden-focusable",
  criteria: ["7.1"],
  parser: ["html", "jsx"],
  severity: "majeur",
  run(doc) {
    const out = [];
    for (const el of doc.elements) {
      if (attr(el, "aria-hidden") !== "true") continue;
      const focusableHere = isFocusable(el) || descendants(el).some(isFocusable);
      if (!focusableHere) continue;
      out.push({
        criteriaId: "7.1",
        el,
        message: `aria-hidden="true" sur (ou contenant) un \xE9l\xE9ment focalisable \u2014 pi\xE8ge pour les technologies d'assistance.`,
        remediation: `Retirez aria-hidden, ou rendez l'\xE9l\xE9ment non focalisable (tabindex="-1", disabled).`
      });
    }
    return out;
  }
};
var nestedInteractive = {
  id: "nested-interactive",
  criteria: ["7.1"],
  parser: ["html", "jsx"],
  severity: "majeur",
  run(doc) {
    const out = [];
    for (const el of doc.elements) {
      if (!isInteractive(el)) continue;
      if (!ancestors(el).some(isInteractive)) continue;
      out.push({
        criteriaId: "7.1",
        el,
        message: `\xC9l\xE9ment interactif <${el.tag}> imbriqu\xE9 dans un autre \xE9l\xE9ment interactif \u2014 non restitu\xE9 correctement.`,
        remediation: `Ne pas imbriquer des contr\xF4les interactifs (lien/bouton) ; mettez-les c\xF4te \xE0 c\xF4te.`
      });
    }
    return out;
  }
};
var scriptsAriaRules = [
  invalidAriaRole,
  ariaRefMissingId,
  redundantAria,
  clickableNoninteractive,
  ariaRequiredChildren,
  ariaHiddenFocusable,
  nestedInteractive
];

// src/rules/mandatory.ts
var htmlLangMissing = {
  id: "html-lang-missing",
  criteria: ["8.3"],
  parser: ["html", "jsx"],
  severity: "bloquant",
  scope: "page",
  run(doc) {
    const html = elementsByTag(doc, "html")[0];
    if (!html) return [];
    const lang = (attr(html, "lang") ?? attr(html, "xml:lang") ?? "").trim();
    if (lang) return [];
    return [
      {
        criteriaId: "8.3",
        el: html,
        message: `<html> sans attribut lang \u2014 la langue par d\xE9faut de la page n'est pas d\xE9clar\xE9e.`,
        remediation: `Ajoutez lang sur <html>, ex. <html lang="fr">.`
      }
    ];
  }
};
var titleMissingEmpty = {
  id: "title-missing-empty",
  criteria: ["8.5"],
  parser: ["html", "jsx"],
  severity: "bloquant",
  scope: "page",
  run(doc) {
    const titles = elementsByTag(doc, "title");
    const hasNonEmpty = titles.some((t2) => visibleText(t2).length > 0);
    if (hasNonEmpty) return [];
    const anchor = elementsByTag(doc, "head")[0] ?? elementsByTag(doc, "html")[0] ?? doc.elements[0];
    if (!anchor) return [];
    return [
      {
        criteriaId: "8.5",
        el: anchor,
        message: titles.length ? `<title> vide \u2014 le titre de la page est absent de contenu.` : `<title> absent \u2014 la page n'a pas de titre.`,
        remediation: `Ajoutez un <title> non vide et pertinent dans <head>.`
      }
    ];
  }
};
var duplicateId = {
  id: "duplicate-id",
  criteria: ["8.2"],
  parser: ["html", "jsx"],
  severity: "majeur",
  run(doc) {
    const seen = /* @__PURE__ */ new Map();
    const out = [];
    for (const { id, el } of allIds(doc)) {
      const n = (seen.get(id) ?? 0) + 1;
      seen.set(id, n);
      if (n > 1) {
        out.push({
          criteriaId: "8.2",
          el,
          message: `id="${id}" dupliqu\xE9 \u2014 un id doit \xEAtre unique dans la page (HTML invalide).`,
          remediation: `Donnez un id unique \xE0 chaque \xE9l\xE9ment ; ajustez les r\xE9f\xE9rences (label[for], aria-*).`
        });
      }
    }
    return out;
  }
};
var inlineLangChangeMissing = {
  id: "inline-lang-change-missing",
  criteria: ["8.7"],
  parser: ["html", "jsx"],
  severity: "mineur",
  run(doc) {
    const out = [];
    for (const el of doc.elements) {
      if (el.tag === "html") continue;
      if (!hasAttr(el, "lang")) continue;
      if ((attr(el, "lang") ?? "").trim() === "") {
        out.push({
          criteriaId: "8.7",
          el,
          message: `Attribut lang vide sur <${el.tag}> \u2014 changement de langue mal indiqu\xE9.`,
          remediation: `Renseignez un code de langue valide (ex. lang="en") ou retirez l'attribut.`
        });
      }
    }
    return out;
  }
};
var BCP47 = /^[A-Za-z]{2,3}(-[A-Za-z0-9]{1,8})*$/;
var langInvalid = {
  id: "lang-invalid",
  criteria: ["8.4", "8.8"],
  parser: ["html", "jsx"],
  severity: "mineur",
  run(doc) {
    const out = [];
    for (const el of doc.elements) {
      const lang = (attr(el, "lang") ?? "").trim();
      if (!lang) continue;
      if (BCP47.test(lang)) continue;
      out.push({
        criteriaId: el.tag === "html" ? "8.4" : "8.8",
        el,
        message: `Code de langue invalide lang="${lang}" sur <${el.tag}> \u2014 n'est pas un code BCP 47 valide.`,
        remediation: `Utilisez un code de langue valide (ex. "fr", "en", "fr-CA").`
      });
    }
    return out;
  }
};
var mandatoryRules = [htmlLangMissing, titleMissingEmpty, duplicateId, inlineLangChangeMissing, langInvalid];

// src/rules/headings.ts
function headingLevel(el) {
  const m = /^h([1-6])$/.exec(el.tag);
  if (m) return Number(m[1]);
  if ((attr(el, "role") ?? "") === "heading") {
    const lvl = Number(attr(el, "aria-level"));
    if (Number.isInteger(lvl) && lvl >= 1) return lvl;
  }
  return null;
}
function headings(doc) {
  const out = [];
  for (const el of doc.elements) {
    const lvl = headingLevel(el);
    if (lvl !== null) out.push({ el, level: lvl });
  }
  return out;
}
var headingOrderSkip = {
  id: "heading-order-skip",
  criteria: ["9.1"],
  parser: ["html", "jsx"],
  severity: "majeur",
  run(doc) {
    const hs = headings(doc);
    const out = [];
    let prev = 0;
    for (const { el, level } of hs) {
      if (prev !== 0 && level - prev > 1) {
        out.push({
          criteriaId: "9.1",
          el,
          message: `Saut de niveau de titre : <h${level}> apr\xE8s <h${prev}> (niveau h${prev + 1} attendu).`,
          remediation: `Ne sautez pas de niveau : encha\xEEnez les titres sans omettre de palier.`
        });
      }
      prev = level;
    }
    return out;
  }
};
var h1Missing = {
  id: "h1-missing",
  criteria: ["9.1"],
  parser: ["html"],
  severity: "majeur",
  scope: "page",
  run(doc) {
    const hasH1 = headings(doc).some((h) => h.level === 1);
    if (hasH1) return [];
    const anchor = elementsByTag(doc, "body")[0] ?? elementsByTag(doc, "html")[0];
    if (!anchor) return [];
    return [
      {
        criteriaId: "9.1",
        el: anchor,
        message: `Aucun <h1> dans la page \u2014 le titre principal de niveau 1 est manquant.`,
        remediation: `Ajoutez un <h1> d\xE9crivant le contenu principal de la page.`
      }
    ];
  }
};
var h1Multiple = {
  id: "h1-multiple",
  criteria: ["9.1"],
  parser: ["html"],
  severity: "mineur",
  scope: "page",
  run(doc) {
    const h1s = elementsByTag(doc, "h1");
    if (h1s.length <= 1) return [];
    return h1s.slice(1).map((el) => ({
      criteriaId: "9.1",
      el,
      message: `Plusieurs <h1> dans la page (${h1s.length}) \u2014 un seul titre de niveau 1 est recommand\xE9.`,
      remediation: `Conservez un unique <h1> et hi\xE9rarchisez le reste avec h2\u2026h6.`
    }));
  }
};
var ALLOWED_IN_LIST = /* @__PURE__ */ new Set(["li", "script", "template"]);
var listStructure = {
  id: "list-structure",
  criteria: ["9.3"],
  parser: ["html", "jsx"],
  severity: "majeur",
  run(doc) {
    const out = [];
    for (const el of doc.elements) {
      if (el.tag === "ul" || el.tag === "ol") {
        const bad = el.children.find((c) => c.type === "element" && !ALLOWED_IN_LIST.has(c.tag));
        if (bad && bad.type === "element") {
          out.push({
            criteriaId: "9.3",
            el: bad,
            message: `<${bad.tag}> enfant direct de <${el.tag}> \u2014 une liste ne doit contenir que des <li>.`,
            remediation: `Enveloppez le contenu dans des <li>, ou utilisez un autre \xE9l\xE9ment que <${el.tag}>.`
          });
        }
      } else if (el.tag === "li") {
        const parent = el.parent;
        if (parent && !["ul", "ol", "menu"].includes(parent.tag)) {
          out.push({
            criteriaId: "9.3",
            el,
            message: `<li> hors d'une liste (<${parent.tag}> parent) \u2014 structure de liste invalide.`,
            remediation: `Placez chaque <li> directement dans un <ul>, <ol> ou <menu>.`
          });
        }
      }
    }
    return out;
  }
};
var headingsRules = [headingOrderSkip, h1Missing, h1Multiple, listStructure];

// src/rules/tables.ts
var declaredLayout = (t2) => ["presentation", "none"].includes((attr(t2, "role") ?? "").trim());
var named2 = (t2) => !!(attr(t2, "aria-label") ?? "").trim() || hasAttr(t2, "aria-labelledby");
function isLayoutTable(t2) {
  if (declaredLayout(t2)) return true;
  const desc = descendants(t2);
  if (desc.some((d) => d.tag === "table")) return true;
  const hasTh = desc.some((d) => d.tag === "th");
  const hasCaption = t2.children.some((c) => c.type === "element" && c.tag === "caption");
  const rows = desc.filter((d) => d.tag === "tr").length;
  return !hasTh && !hasCaption && rows <= 1;
}
var dataTableNoHeaders = {
  id: "data-table-no-headers",
  criteria: ["5.6", "5.7"],
  parser: ["html", "jsx"],
  severity: "majeur",
  run(doc) {
    const out = [];
    for (const t2 of doc.elements) {
      if (t2.tag !== "table" || isLayoutTable(t2)) continue;
      const desc = descendants(t2);
      const hasTh = desc.some((d) => d.tag === "th");
      const hasAssoc = desc.some((d) => (d.tag === "td" || d.tag === "th") && (hasAttr(d, "scope") || hasAttr(d, "headers")));
      if (hasTh && hasAssoc) continue;
      if (!hasTh) {
        out.push({
          criteriaId: "5.6",
          el: t2,
          message: `Tableau de donn\xE9es sans <th> \u2014 en-t\xEAtes de colonne/ligne non d\xE9clar\xE9s.`,
          remediation: `D\xE9clarez les en-t\xEAtes avec <th>, et associez-les via scope="col"/"row" (ou headers/id).`
        });
      } else if (!hasAssoc) {
        out.push({
          criteriaId: "5.7",
          el: t2,
          message: `Tableau de donn\xE9es avec <th> mais sans scope/headers \u2014 association cellule\u2194en-t\xEAte absente.`,
          remediation: `Ajoutez scope="col"/"row" sur les <th> (ou headers="\u2026"/id sur cellules complexes).`
        });
      }
    }
    return out;
  }
};
var tableCaptionMissing = {
  id: "table-caption-missing",
  criteria: ["5.4"],
  parser: ["html", "jsx"],
  severity: "mineur",
  run(doc) {
    const out = [];
    for (const t2 of doc.elements) {
      if (t2.tag !== "table" || isLayoutTable(t2)) continue;
      const hasCaption = t2.children.some((c) => c.type === "element" && c.tag === "caption");
      if (hasCaption || named2(t2)) continue;
      out.push({
        criteriaId: "5.4",
        el: t2,
        message: `Tableau de donn\xE9es sans <caption> ni nom accessible \u2014 titre du tableau absent.`,
        remediation: `Ajoutez un <caption> en premi\xE8re position du <table> (ou aria-label/aria-labelledby).`
      });
    }
    return out;
  }
};
var layoutTableDataMarkup = {
  id: "layout-table-data-markup",
  criteria: ["5.8"],
  parser: ["html", "jsx"],
  severity: "mineur",
  run(doc) {
    const out = [];
    for (const t2 of doc.elements) {
      if (t2.tag !== "table" || !declaredLayout(t2)) continue;
      const desc = descendants(t2);
      const dataMarkup = desc.some((d) => d.tag === "th") || t2.children.some((c) => c.type === "element" && c.tag === "caption") || desc.some((d) => hasAttr(d, "scope") || hasAttr(d, "headers"));
      if (!dataMarkup) continue;
      out.push({
        criteriaId: "5.8",
        el: t2,
        message: `Tableau de mise en forme (role="${attr(t2, "role")}") utilisant du balisage de donn\xE9es (th/caption/scope).`,
        remediation: `Retirez th/caption/scope/headers d'un tableau de pr\xE9sentation, ou faites-en un vrai tableau de donn\xE9es.`
      });
    }
    return out;
  }
};
var tablesRules = [dataTableNoHeaders, tableCaptionMissing, layoutTableDataMarkup];

// src/rules/links.ts
function hasIconChild(el) {
  return descendants(el).some((d) => {
    if (d.tag === "img") {
      const a = attr(d, "alt");
      return a === void 0 || a.trim() === "";
    }
    if (d.tag === "svg") {
      const titled = descendants(d).some((x) => x.tag === "title" && visibleText(x));
      return !titled && !(attr(d, "aria-label") ?? "").trim();
    }
    if (d.tag === "i") return /(^|\s|-)(icon|fa|glyphicon|material-icons)/.test((attr(d, "class") ?? "").toLowerCase());
    return false;
  });
}
var isButton = (el) => {
  if (el.tag === "button") return true;
  if ((attr(el, "role") ?? "") === "button") return true;
  if (el.tag === "input") return (attr(el, "type") ?? "").toLowerCase() === "button";
  return false;
};
var linkEmptyName = {
  id: "link-empty-name",
  criteria: ["6.2"],
  parser: ["html", "jsx"],
  severity: "bloquant",
  run(doc) {
    const out = [];
    for (const el of doc.elements) {
      if (el.tag !== "a" || !hasAttr(el, "href")) continue;
      if (attr(el, "aria-hidden") === "true") continue;
      if (accessibleName(el, doc) !== "") continue;
      if (hasIconChild(el)) continue;
      out.push({
        criteriaId: "6.2",
        el,
        message: `Lien sans intitul\xE9 \u2014 aucun nom accessible.`,
        remediation: `Donnez un intitul\xE9 textuel au lien (texte visible, ou aria-label si vraiment n\xE9cessaire).`
      });
    }
    return out;
  }
};
var buttonEmptyName = {
  id: "button-empty-name",
  criteria: ["7.1"],
  parser: ["html", "jsx"],
  severity: "bloquant",
  run(doc) {
    const out = [];
    for (const el of doc.elements) {
      if (!isButton(el)) continue;
      if (attr(el, "aria-hidden") === "true") continue;
      if (accessibleName(el, doc) !== "") continue;
      if (hasIconChild(el)) continue;
      out.push({
        criteriaId: "7.1",
        el,
        message: `Bouton sans intitul\xE9 \u2014 aucun nom accessible.`,
        remediation: `Donnez un intitul\xE9 au bouton (texte, value, ou aria-label).`
      });
    }
    return out;
  }
};
var iconOnlyControlUnnamed = {
  id: "icon-only-control-unnamed",
  criteria: ["1.1", "6.2", "7.1"],
  parser: ["html", "jsx"],
  severity: "bloquant",
  run(doc) {
    const out = [];
    for (const el of doc.elements) {
      const link = el.tag === "a" && hasAttr(el, "href");
      const button = isButton(el);
      if (!link && !button) continue;
      if (attr(el, "aria-hidden") === "true") continue;
      if (accessibleName(el, doc) !== "") continue;
      if (!hasIconChild(el)) continue;
      out.push({
        criteriaId: link ? "6.2" : "7.1",
        el,
        message: `${link ? "Lien" : "Bouton"} avec une ic\xF4ne seule (img/svg/i) sans nom accessible.`,
        remediation: `Ajoutez un alt/aria-label sur l'ic\xF4ne ou un texte masqu\xE9 visuellement (classe visually-hidden).`
      });
    }
    return out;
  }
};
var linksRules = [linkEmptyName, buttonEmptyName, iconOnlyControlUnnamed];

// src/rules/forms.ts
var REAL_LABEL = /* @__PURE__ */ new Set(["for", "wrapping", "aria-label", "aria-labelledby"]);
var controlLabelMissing = {
  id: "control-label-missing",
  criteria: ["11.1"],
  parser: ["html", "jsx"],
  severity: "bloquant",
  run(doc) {
    const out = [];
    for (const el of doc.elements) {
      if (!isFormField(el)) continue;
      const { via } = controlLabel(el, doc);
      if (via && REAL_LABEL.has(via)) continue;
      if (hasAttr(el, "placeholder")) continue;
      out.push({
        criteriaId: "11.1",
        el,
        message: `Champ de formulaire <${el.tag}> sans \xE9tiquette \u2014 aucun label associ\xE9.`,
        remediation: `Associez un <label for="\u2026"> (ou enveloppez le champ d'un <label>, ou aria-label/aria-labelledby).`
      });
    }
    return out;
  }
};
var placeholderAsLabel = {
  id: "placeholder-as-label",
  criteria: ["11.1"],
  parser: ["html", "jsx"],
  severity: "majeur",
  run(doc) {
    const out = [];
    for (const el of doc.elements) {
      if (!isFormField(el)) continue;
      if (!hasAttr(el, "placeholder")) continue;
      const { via } = controlLabel(el, doc);
      if (via && REAL_LABEL.has(via)) continue;
      out.push({
        criteriaId: "11.1",
        el,
        message: `placeholder="${attr(el, "placeholder")}" utilis\xE9 comme seule \xE9tiquette \u2014 le placeholder n'est pas un label.`,
        remediation: `Ajoutez un <label> r\xE9el ; le placeholder ne doit que compl\xE9ter, pas remplacer l'\xE9tiquette.`
      });
    }
    return out;
  }
};
var fieldsetLegendMissing = {
  id: "fieldset-legend-missing",
  criteria: ["11.6"],
  parser: ["html", "jsx"],
  severity: "majeur",
  run(doc) {
    const out = [];
    for (const el of doc.elements) {
      if (el.tag !== "fieldset") continue;
      const legend = el.children.find((c) => c.type === "element" && c.tag === "legend");
      if (legend && legend.type === "element" && visibleText(legend)) continue;
      if (hasAttr(el, "aria-label") || hasAttr(el, "aria-labelledby")) continue;
      out.push({
        criteriaId: "11.6",
        el,
        message: `<fieldset> sans <legend> (ou l\xE9gende vide) \u2014 regroupement de champs sans l\xE9gende.`,
        remediation: `Ajoutez un <legend> non vide en premier enfant du <fieldset>.`
      });
    }
    return out;
  }
};
var formFieldMultipleLabels = {
  id: "form-field-multiple-labels",
  criteria: ["11.1"],
  parser: ["html", "jsx"],
  severity: "mineur",
  run(doc) {
    const counts = /* @__PURE__ */ new Map();
    for (const el of doc.elements) {
      if (el.tag !== "label") continue;
      const f = attr(el, "for");
      if (f) counts.set(f, (counts.get(f) ?? 0) + 1);
    }
    const out = [];
    for (const el of doc.elements) {
      if (!isFormField(el)) continue;
      const id = attr(el, "id");
      if (id && (counts.get(id) ?? 0) > 1) {
        out.push({
          criteriaId: "11.1",
          el,
          message: `Champ <${el.tag}> r\xE9f\xE9renc\xE9 par ${counts.get(id)} <label for="${id}"> \u2014 \xE9tiquettes multiples ambigu\xEBs.`,
          remediation: `Un seul <label> doit cibler le champ ; fusionnez ou retirez les \xE9tiquettes superflues.`
        });
      }
    }
    return out;
  }
};
var selectHasOption = {
  id: "select-has-option",
  criteria: ["11.1"],
  parser: ["html", "jsx"],
  severity: "mineur",
  run(doc) {
    const out = [];
    for (const el of doc.elements) {
      if (el.tag !== "select") continue;
      if (descendants(el).some((d) => d.tag === "option")) continue;
      out.push({
        criteriaId: "11.1",
        el,
        message: `<select> sans aucune <option> \u2014 liste de choix vide.`,
        remediation: `Ajoutez des <option> (et un <optgroup>/option par d\xE9faut si pertinent).`
      });
    }
    return out;
  }
};
var formsRules = [controlLabelMissing, placeholderAsLabel, fieldsetLegendMissing, formFieldMultipleLabels, selectHasOption];

// src/rules/navigation.ts
var skipLinkTargetMissing = {
  id: "skip-link-target-missing",
  criteria: ["12.7"],
  parser: ["html"],
  severity: "majeur",
  scope: "page",
  run(doc) {
    const out = [];
    const hasName = (id) => doc.byId.has(id) || doc.elements.some((e) => attr(e, "name") === id);
    for (const el of doc.elements) {
      if (el.tag !== "a") continue;
      const href = attr(el, "href") ?? "";
      if (!href.startsWith("#") || href === "#") continue;
      let id = href.slice(1);
      try {
        id = decodeURIComponent(id);
      } catch {
      }
      if (hasName(id)) continue;
      out.push({
        criteriaId: "12.7",
        el,
        message: `Lien interne href="${href}" \u2014 la cible #${id} n'existe pas dans la page (lien d'\xE9vitement/ancre cass\xE9).`,
        remediation: `Ajoutez un \xE9l\xE9ment avec id="${id}" (ex. <main id="${id}">) ou corrigez l'ancre.`
      });
    }
    return out;
  }
};
var positiveTabindex = {
  id: "positive-tabindex",
  criteria: ["12.8"],
  parser: ["html", "jsx"],
  severity: "majeur",
  run(doc) {
    const out = [];
    for (const el of doc.elements) {
      if (!hasAttr(el, "tabindex")) continue;
      const ti = Number((attr(el, "tabindex") ?? "").trim());
      if (Number.isInteger(ti) && ti > 0) {
        out.push({
          criteriaId: "12.8",
          el,
          message: `tabindex="${ti}" positif \u2014 force un ordre de tabulation incoh\xE9rent avec l'ordre du DOM.`,
          remediation: `Utilisez tabindex="0" (ou pas de tabindex) et ordonnez via le DOM ; r\xE9servez les valeurs >0.`
        });
      }
    }
    return out;
  }
};
var navigationRules = [skipLinkTargetMissing, positiveTabindex];

// src/rules/multimedia.ts
var autoplayMedia = {
  id: "autoplay-media",
  criteria: ["4.10", "13.8"],
  parser: ["html", "jsx"],
  severity: "majeur",
  run(doc) {
    const out = [];
    for (const el of doc.elements) {
      if (el.tag !== "audio" && el.tag !== "video") continue;
      if (!hasAttr(el, "autoplay")) continue;
      if (el.tag === "video" && hasAttr(el, "muted")) {
        out.push({
          criteriaId: "13.8",
          el,
          message: `<video autoplay> d\xE9marre automatiquement \u2014 contenu en mouvement non contr\xF4l\xE9.`,
          remediation: `\xC9vitez l'autoplay ou fournissez un contr\xF4le pause/stop accessible (et controls).`
        });
        continue;
      }
      out.push({
        criteriaId: el.tag === "audio" ? "4.10" : "13.8",
        el,
        message: `<${el.tag} autoplay> d\xE9marre automatiquement ${el.tag === "audio" ? "du son" : "une vid\xE9o sonore"} \u2014 non contr\xF4lable par l'utilisateur.`,
        remediation: `Retirez autoplay, ou ajoutez un contr\xF4le de lecture (controls + pause/stop) facilement accessible.`
      });
    }
    return out;
  }
};
var multimediaRules = [autoplayMedia];

// src/rules/presentation.ts
var metaViewportZoomBlock = {
  id: "meta-viewport-zoom-block",
  criteria: ["10.4"],
  parser: ["html", "jsx"],
  severity: "majeur",
  run(doc) {
    const out = [];
    for (const el of doc.elements) {
      if (el.tag !== "meta" || (attr(el, "name") ?? "").toLowerCase() !== "viewport") continue;
      const content = (attr(el, "content") ?? "").toLowerCase();
      const pairs = /* @__PURE__ */ new Map();
      for (const part of content.split(/[,;]/)) {
        const [k, v] = part.split("=").map((s) => s.trim());
        if (k) pairs.set(k, v ?? "");
      }
      const userScalable = pairs.get("user-scalable");
      const maxScale = pairs.get("maximum-scale");
      const blocked = userScalable === "no" || userScalable === "0" || maxScale !== void 0 && Number(maxScale) < 2;
      if (!blocked) continue;
      out.push({
        criteriaId: "10.4",
        el,
        message: `<meta viewport> bloque le zoom (${userScalable === "no" || userScalable === "0" ? "user-scalable=no" : `maximum-scale=${maxScale}`}) \u2014 agrandissement \xE0 200% emp\xEAch\xE9.`,
        remediation: `Retirez user-scalable=no et maximum-scale (ou maximum-scale \u2265 2) du content du viewport.`
      });
    }
    return out;
  }
};
var presentationRules = [metaViewportZoomBlock];

// src/color.ts
var NAMED = {
  transparent: { r: 0, g: 0, b: 0, a: 0 },
  white: { r: 255, g: 255, b: 255, a: 1 },
  black: { r: 0, g: 0, b: 0, a: 1 },
  red: { r: 255, g: 0, b: 0, a: 1 },
  lime: { r: 0, g: 255, b: 0, a: 1 },
  green: { r: 0, g: 128, b: 0, a: 1 },
  blue: { r: 0, g: 0, b: 255, a: 1 },
  yellow: { r: 255, g: 255, b: 0, a: 1 },
  cyan: { r: 0, g: 255, b: 255, a: 1 },
  aqua: { r: 0, g: 255, b: 255, a: 1 },
  magenta: { r: 255, g: 0, b: 255, a: 1 },
  fuchsia: { r: 255, g: 0, b: 255, a: 1 },
  silver: { r: 192, g: 192, b: 192, a: 1 },
  gray: { r: 128, g: 128, b: 128, a: 1 },
  grey: { r: 128, g: 128, b: 128, a: 1 },
  maroon: { r: 128, g: 0, b: 0, a: 1 },
  olive: { r: 128, g: 128, b: 0, a: 1 },
  purple: { r: 128, g: 0, b: 128, a: 1 },
  teal: { r: 0, g: 128, b: 128, a: 1 },
  navy: { r: 0, g: 0, b: 128, a: 1 },
  orange: { r: 255, g: 165, b: 0, a: 1 }
};
function hex(part) {
  return parseInt(part.length === 1 ? part + part : part, 16);
}
function parseColor(input) {
  const s = input.trim().toLowerCase();
  if (!s) return null;
  if (s in NAMED) return { ...NAMED[s] };
  if (s.startsWith("#")) {
    const h = s.slice(1);
    if (/^[0-9a-f]{3}$/.test(h)) return { r: hex(h[0]), g: hex(h[1]), b: hex(h[2]), a: 1 };
    if (/^[0-9a-f]{4}$/.test(h)) return { r: hex(h[0]), g: hex(h[1]), b: hex(h[2]), a: hex(h[3]) / 255 };
    if (/^[0-9a-f]{6}$/.test(h)) return { r: hex(h.slice(0, 2)), g: hex(h.slice(2, 4)), b: hex(h.slice(4, 6)), a: 1 };
    if (/^[0-9a-f]{8}$/.test(h)) return { r: hex(h.slice(0, 2)), g: hex(h.slice(2, 4)), b: hex(h.slice(4, 6)), a: hex(h.slice(6, 8)) / 255 };
    return null;
  }
  const m = /^rgba?\(([^)]+)\)$/.exec(s);
  if (m) {
    const parts = m[1].split(/[,/\s]+/).filter(Boolean);
    if (parts.length < 3) return null;
    const chan = (p) => p.endsWith("%") ? Math.round(parseFloat(p) / 100 * 255) : parseFloat(p);
    const r = chan(parts[0]);
    const g = chan(parts[1]);
    const b = chan(parts[2]);
    const a = parts[3] !== void 0 ? parts[3].endsWith("%") ? parseFloat(parts[3]) / 100 : parseFloat(parts[3]) : 1;
    if ([r, g, b, a].some((n) => Number.isNaN(n))) return null;
    return { r, g, b, a };
  }
  return null;
}
function channelLuminance(c) {
  const cs = c / 255;
  return cs <= 0.03928 ? cs / 12.92 : ((cs + 0.055) / 1.055) ** 2.4;
}
function relativeLuminance({ r, g, b }) {
  return 0.2126 * channelLuminance(r) + 0.7152 * channelLuminance(g) + 0.0722 * channelLuminance(b);
}
function contrastRatio(a, b) {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [hi, lo] = la >= lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}
function parseInlineStyle(style) {
  const out = /* @__PURE__ */ new Map();
  for (const decl of style.split(";")) {
    const i = decl.indexOf(":");
    if (i === -1) continue;
    const prop = decl.slice(0, i).trim().toLowerCase();
    const val = decl.slice(i + 1).trim();
    if (prop && val) out.set(prop, val);
  }
  return out;
}

// src/rules/colors.ts
var SKIP_TAGS = /* @__PURE__ */ new Set(["script", "style", "head", "title", "meta", "noscript", "link"]);
function styleOf(el) {
  const s = attr(el, "style");
  return s ? parseInlineStyle(s) : /* @__PURE__ */ new Map();
}
function colorFromValue(v) {
  const whole = parseColor(v);
  if (whole) return whole;
  for (const tok of v.split(/\s+/)) {
    const c = parseColor(tok);
    if (c) return c;
  }
  return null;
}
function fgOf(el) {
  for (let p = el; p; p = p.parent) {
    const v = styleOf(p).get("color");
    if (v) {
      const c = colorFromValue(v);
      if (c) return c;
    }
  }
  return null;
}
function bgOf(el) {
  for (let p = el; p; p = p.parent) {
    const st = styleOf(p);
    const v = st.get("background-color") ?? st.get("background");
    if (v) {
      const c = colorFromValue(v);
      if (c) return c;
    }
  }
  return null;
}
function fontPx(el) {
  for (let p = el; p; p = p.parent) {
    const v = styleOf(p).get("font-size");
    if (!v) continue;
    const m = /^([\d.]+)(px|pt|rem|em)?$/.exec(v.trim());
    if (!m) return null;
    const n = parseFloat(m[1]);
    if (Number.isNaN(n)) return null;
    const unit = m[2] ?? "px";
    return unit === "pt" ? n * 4 / 3 : unit === "rem" || unit === "em" ? n * 16 : n;
  }
  return null;
}
function isBold(el) {
  for (let p = el; p; p = p.parent) {
    const v = styleOf(p).get("font-weight");
    if (v) return v === "bold" || Number(v) >= 700;
  }
  return false;
}
function isLarge(el) {
  const px = fontPx(el);
  if (px === null) return false;
  return px >= 24 || px >= 18.5 && isBold(el);
}
function hasDirectText(el) {
  return el.children.some((c) => c.type === "text" && c.data.trim() !== "");
}
var contrastLiteral = {
  id: "contrast-literal",
  criteria: ["3.2"],
  parser: ["html", "jsx", "css"],
  severity: "majeur",
  run(doc) {
    const out = [];
    for (const el of doc.elements) {
      if (SKIP_TAGS.has(el.tag) || !hasDirectText(el)) continue;
      const fg = fgOf(el);
      const bg = bgOf(el);
      if (!fg || !bg || fg.a < 1 || bg.a < 1) continue;
      const ratio = contrastRatio(fg, bg);
      const large = isLarge(el);
      const min = large ? 3 : 4.5;
      if (ratio >= min) continue;
      out.push({
        criteriaId: "3.2",
        el,
        message: `Contraste insuffisant : ratio ${ratio.toFixed(2)}:1 entre le texte et son fond (minimum ${min}:1 pour du texte ${large ? "large" : "normal"}).`,
        remediation: `Assombrissez le texte ou \xE9claircissez le fond pour atteindre au moins ${min}:1 (contraste calcul\xE9 sur des couleurs inline litt\xE9rales).`
      });
    }
    return out;
  }
};
var colorsRules = [contrastLiteral];

// src/rules/registry.ts
var ALL_RULES = [
  ...colorsRules,
  ...imagesRules,
  ...framesRules,
  ...scriptsAriaRules,
  ...mandatoryRules,
  ...headingsRules,
  ...tablesRules,
  ...linksRules,
  ...formsRules,
  ...navigationRules,
  ...multimediaRules,
  ...presentationRules
];
var SEVERITY_ORDER = { bloquant: 0, majeur: 1, mineur: 2 };
function runRules(doc, only) {
  const out = [];
  const fullDoc = isFullDocument(doc);
  for (const rule of ALL_RULES) {
    if (only && !only.has(rule.id)) continue;
    if (rule.scope === "page" && !fullDoc) continue;
    for (const rf of rule.run(doc)) out.push(toFinding(doc, rule.id, rule.severity, rf));
  }
  out.sort((a, b) => a.line - b.line || a.col - b.col || SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]);
  return out;
}

// src/rules/cross-rule.ts
function crossToFinding(doc, ruleId, def, cf) {
  return {
    ruleId,
    criteriaId: cf.criteriaId,
    file: doc.file,
    line: cf.el.line,
    col: cf.el.col,
    selectorHint: cf.selectorHint ?? selectorOf(cf.el),
    severity: cf.severity ?? def,
    message: cf.message,
    remediation: cf.remediation,
    snippet: snippet(doc, cf.el),
    ...doc.lossy ? {} : { sourceStart: cf.el.start, sourceEnd: cf.el.end },
    ...cf.related ? { related: cf.related } : {}
  };
}

// src/graph/resolve.ts
import { dirname, join as join2 } from "path";

// src/glob.ts
import { existsSync, readdirSync, statSync } from "fs";
import { join, sep } from "path";

// src/util.ts
import { readFileSync } from "fs";
import { extname } from "path";
function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function today() {
  return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
function readText(path) {
  return readFileSync(path, "utf8");
}
function ext(path) {
  return extname(path).toLowerCase();
}
async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
}

// src/glob.ts
var DEFAULT_EXT = /* @__PURE__ */ new Set([".html", ".htm", ".xhtml", ".jsx", ".tsx", ".vue", ".svelte", ".astro"]);
function extSet(extra) {
  const set = new Set(DEFAULT_EXT);
  for (const raw of extra ?? []) {
    for (const e of raw.split(",")) {
      const t2 = e.trim().toLowerCase();
      if (t2) set.add(t2.startsWith(".") ? t2 : `.${t2}`);
    }
  }
  return set;
}
var SKIP_DIR = /* @__PURE__ */ new Set(["node_modules", ".git", "dist", "build", "coverage", ".next", "out", "audits"]);
function globToRegExp(glob) {
  let re = "";
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i];
    if (c === "*") {
      if (glob[i + 1] === "*") {
        i++;
        if (glob[i + 1] === "/") {
          i++;
          re += "(?:.*/)?";
        } else {
          re += ".*";
        }
      } else {
        re += "[^/]*";
      }
    } else if (c === "?") {
      re += "[^/]";
    } else {
      re += escapeRegExp(c);
    }
  }
  return new RegExp(`^${re}$`);
}
function compileGlobs(globs) {
  if (!globs || globs.length === 0) return null;
  const res = globs.flatMap((g) => g.split(",")).map((g) => g.trim()).filter(Boolean).map(globToRegExp);
  return (rel) => res.some((r) => r.test(rel));
}
var toPosix = (p) => p.split(sep).join("/");
var hasGlob = (s) => /[*?]/.test(s);
function makeFilter(opts = {}) {
  const include = compileGlobs(opts.include);
  const exclude = compileGlobs(opts.exclude);
  const exts = extSet(opts.ext);
  return (file) => {
    if (!exts.has(ext(file))) return false;
    const rel = toPosix(file);
    if (include && !include(rel)) return false;
    if (exclude?.(rel)) return false;
    return true;
  };
}
function inScopeMatcher(inputs) {
  const scopes = inputs.filter((i) => i !== "-" && i !== ".");
  if (!scopes.length) return null;
  const globMatch = compileGlobs(scopes.filter(hasGlob));
  const prefixes = scopes.filter((i) => !hasGlob(i)).map((p) => toPosix(p).replace(/\/+$/, ""));
  return (file) => {
    const rel = toPosix(file);
    if (globMatch?.(rel)) return true;
    return prefixes.some((p) => rel === p || rel.startsWith(`${p}/`));
  };
}
function walk(dir, acc) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    if (e.isDirectory()) {
      if (SKIP_DIR.has(e.name)) continue;
      walk(join(dir, e.name), acc);
    } else if (e.isFile()) {
      acc.push(join(dir, e.name));
    }
  }
}
function staticBase(glob) {
  const idx = glob.search(/[*?]/);
  const head = idx === -1 ? glob : glob.slice(0, idx);
  const slash = head.lastIndexOf("/");
  return slash === -1 ? "." : head.slice(0, slash) || ".";
}
function expandInputs(inputs, opts = {}) {
  const include = compileGlobs(opts.include);
  const exclude = compileGlobs(opts.exclude);
  const exts = extSet(opts.ext);
  const files = /* @__PURE__ */ new Set();
  for (const input of inputs) {
    if (input === "-") continue;
    if (hasGlob(input)) {
      const re = globToRegExp(input);
      const acc = [];
      walk(staticBase(input), acc);
      for (const f of acc) if (re.test(toPosix(f)) && exts.has(ext(f))) files.add(f);
    } else if (existsSync(input)) {
      if (statSync(input).isDirectory()) {
        const acc = [];
        walk(input, acc);
        for (const f of acc) if (exts.has(ext(f))) files.add(f);
      } else if (exts.has(ext(input))) {
        files.add(input);
      }
    }
  }
  let list = [...files];
  if (include) list = list.filter((f) => include(toPosix(f)));
  if (exclude) list = list.filter((f) => !exclude(toPosix(f)));
  return list.sort();
}

// src/graph/resolve.ts
var EXT_ORDER = [".tsx", ".jsx", ".ts", ".js", ".vue", ".svelte", ".astro", ".html", ".htm"];
function candidates(base) {
  const out = [base];
  for (const e of EXT_ORDER) out.push(base + e);
  for (const e of EXT_ORDER) out.push(join2(base, `index${e}`));
  return out;
}
function resolveSpecifier(fromFile, spec, known, _aliases) {
  if (!spec.startsWith(".")) return null;
  const base = join2(dirname(toPosix(fromFile)), spec);
  for (const c of candidates(base)) {
    const key = toPosix(c);
    if (known.has(key)) return key;
  }
  return null;
}

// src/graph/graph.ts
function buildGraph(nodes) {
  const map = /* @__PURE__ */ new Map();
  const known = /* @__PURE__ */ new Set();
  const allIds2 = /* @__PURE__ */ new Set();
  for (const n of [...nodes].sort((a, b) => a.file < b.file ? -1 : a.file > b.file ? 1 : 0)) {
    map.set(n.file, n);
    known.add(n.file);
    for (const id of n.definesIds) allIds2.add(id);
  }
  return { nodes: map, known, allIds: allIds2 };
}
function resolveUsage(graph, file, localName) {
  const posix = toPosix(file);
  const node = graph.nodes.get(posix);
  if (!node) return void 0;
  const imp = node.imports.find((i) => i.local === localName);
  if (imp) {
    if (imp.imported === "*") return void 0;
    const target = resolveSpecifier(posix, imp.source, graph.known);
    if (!target) return void 0;
    return graph.nodes.get(target)?.components.get(imp.imported);
  }
  return node.components.get(localName);
}
function idDefinedAnywhere(graph, id) {
  return graph.allIds.has(id);
}
function htmlLangProvidedFor(graph, file) {
  const start = toPosix(file);
  const seen = /* @__PURE__ */ new Set([start]);
  const queue = [start];
  while (queue.length) {
    const cur = queue.shift();
    const node = graph.nodes.get(cur);
    if (!node) continue;
    if (cur !== start && node.providesHtmlLang) return true;
    for (const imp of node.imports) {
      const target = resolveSpecifier(cur, imp.source, graph.known);
      if (target && !seen.has(target)) {
        seen.add(target);
        queue.push(target);
      }
    }
  }
  return false;
}

// src/rules/cross-registry.ts
var SEVERITY_ORDER2 = { bloquant: 0, majeur: 1, mineur: 2 };
var NAME_PROPS = ["aria-label", "aria-labelledby", "title", "label", "alt"];
function isComponentUsage(el) {
  return !isIntrinsic(el.tag) && el.tag !== "#fragment";
}
function usageHasName(el) {
  if (el.spread) return true;
  if (visibleText(el) !== "") return true;
  return NAME_PROPS.some((p) => (attr(el, p) ?? "").trim() !== "");
}
function isNameableControl(el) {
  if (el.tag === "button" || el.tag === "select" || el.tag === "textarea") return true;
  if (el.tag === "a" && hasAttr(el, "href")) return true;
  if (el.tag === "input" || el.tag === "img") return true;
  return false;
}
var crossIconOnlyUnnamed = {
  id: "cross-icon-only-unnamed",
  criteria: ["1.1", "6.2", "7.1"],
  severity: "bloquant",
  run(doc, graph) {
    const findings = [];
    for (const el of doc.elements) {
      if (!isComponentUsage(el)) continue;
      const def = resolveUsage(graph, doc.file, el.tag);
      if (!def?.rendersIconOnlyControl || !def.acceptsName) continue;
      if (usageHasName(el)) continue;
      findings.push({
        criteriaId: "7.1",
        el,
        message: `<${el.tag}> rend un contr\xF4le \xE0 ic\xF4ne seule mais est utilis\xE9 sans nom accessible (aucun aria-label/title/texte pass\xE9).`,
        remediation: `Passez un nom au composant \xE0 cet endroit, p. ex. <${el.tag} aria-label="\u2026" /> (le composant ${def.name} rend une ic\xF4ne sans texte).`,
        related: { file: def.file, line: def.line, col: def.col, selectorHint: def.name, note: "d\xE9finition du composant \xE0 ic\xF4ne seule" }
      });
    }
    return { findings, suppress: [] };
  }
};
var crossPageLang = {
  id: "cross-page-lang",
  criteria: ["8.3"],
  severity: "bloquant",
  run(doc, graph) {
    const suppress = [];
    const html = doc.elements.find((e) => e.tag === "html");
    if (html && (attr(html, "lang") ?? "") === "" && htmlLangProvidedFor(graph, doc.file)) {
      suppress.push({ ruleId: "html-lang-missing", line: html.line, reason: "lang fourni par un layout/wrapper import\xE9" });
    }
    return { findings: [], suppress };
  }
};
var SUPPRESSIBLE_BY_SPREAD = ["icon-only-control-unnamed", "button-empty-name", "link-empty-name", "control-label-missing", "img-alt-missing"];
var crossAriaForwarding = {
  id: "cross-aria-forwarding",
  criteria: ["7.1"],
  severity: "bloquant",
  run(doc) {
    const suppress = [];
    for (const el of doc.elements) {
      if (!el.spread || !isNameableControl(el)) continue;
      for (const ruleId of SUPPRESSIBLE_BY_SPREAD) suppress.push({ ruleId, line: el.line, reason: "nommable via {...props} au point d'utilisation" });
    }
    return { findings: [], suppress };
  }
};
var crossSkipLinkTarget = {
  id: "cross-skip-link-target",
  criteria: ["12.7"],
  severity: "majeur",
  run(doc, graph) {
    const suppress = [];
    if (!isFullDocument(doc)) return { findings: [], suppress };
    const sameDocHas = (id) => doc.byId.has(id) || doc.elements.some((e) => attr(e, "name") === id);
    for (const el of doc.elements) {
      if (el.tag !== "a") continue;
      const href = attr(el, "href") ?? "";
      if (!href.startsWith("#") || href === "#") continue;
      let id = href.slice(1);
      try {
        id = decodeURIComponent(id);
      } catch {
      }
      if (sameDocHas(id)) continue;
      if (idDefinedAnywhere(graph, id))
        suppress.push({ ruleId: "skip-link-target-missing", line: el.line, reason: `cible #${id} d\xE9finie dans un autre fichier du graphe` });
    }
    return { findings: [], suppress };
  }
};
var CROSS_RULES = [crossIconOnlyUnnamed, crossPageLang, crossAriaForwarding, crossSkipLinkTarget];
function runCrossRules(doc, graph) {
  const findings = [];
  const suppress = [];
  for (const rule of CROSS_RULES) {
    const r = rule.run(doc, graph);
    for (const cf of r.findings) findings.push(crossToFinding(doc, rule.id, rule.severity, cf));
    suppress.push(...r.suppress);
  }
  findings.sort((a, b) => a.line - b.line || a.col - b.col || SEVERITY_ORDER2[a.severity] - SEVERITY_ORDER2[b.severity]);
  return { findings, suppress };
}

// src/graph/imports.ts
var NAME_PROPS2 = /* @__PURE__ */ new Set(["aria-label", "aria-labelledby", "title", "label", "alt"]);
var ICON_TAGS = /* @__PURE__ */ new Set(["svg", "path", "use", "img", "i"]);
function opening(jsxEl) {
  return asNode(jsxEl.openingElement);
}
function attrName(a) {
  return normAttrName(jsxName(asNode(a.name)));
}
function attrIsExpr(a) {
  return asNode(a.value)?.type === "JSXExpressionContainer";
}
function attrIsLiteral(a) {
  return asNode(a.value)?.type === "StringLiteral";
}
function controlAttrs(jsxEl) {
  const op = opening(jsxEl);
  return op ? asNodes(op.attributes).filter((a) => a.type === "JSXAttribute") : [];
}
function hasSpread(jsxEl) {
  const op = opening(jsxEl);
  return op ? asNodes(op.attributes).some((a) => a.type === "JSXSpreadAttribute") : false;
}
function tagOf(jsxEl) {
  const op = opening(jsxEl);
  return op ? jsxName(asNode(op.name)) : "";
}
function hasLiteralText(jsxEl) {
  let found = false;
  walkAst(jsxEl, (n) => {
    if (n.type === "JSXText" && typeof n.value === "string" && n.value.trim() !== "") found = true;
  });
  return found;
}
function hasIconChild2(jsxEl) {
  let found = false;
  walkAst(jsxEl, (n) => {
    if (n.type !== "JSXElement" || n === jsxEl) return;
    const name = tagOf(n);
    const low = name.toLowerCase();
    if (ICON_TAGS.has(low) || /icon|glyph/i.test(name)) found = true;
  });
  return found;
}
function rendersNameExpr(jsxEl) {
  for (const c of asNodes(jsxEl.children)) {
    if (c.type !== "JSXExpressionContainer") continue;
    const expr = asNode(c.expression);
    const id = expr && (expr.type === "Identifier" || expr.type === "JSXIdentifier") ? String(expr.name ?? "") : "";
    if (/children|label|title|text|name/i.test(id)) return true;
  }
  return false;
}
function findControl(fnNode) {
  let control;
  walkAst(fnNode, (n) => {
    if (control || n.type !== "JSXElement") return;
    const tag = tagOf(n);
    if (!isIntrinsic(tag)) return;
    const low = tag.toLowerCase();
    if (low === "button") control = n;
    else if (low === "a" && controlAttrs(n).some((a) => attrName(a) === "href")) control = n;
  });
  return control;
}
function posOf(node) {
  return { line: node.loc?.start.line ?? 1, col: (node.loc?.start.column ?? 0) + 1 };
}
function analyzeComponent(name, file, fnNode) {
  const control = findControl(fnNode);
  if (!control) {
    const { line: line2, col: col2 } = posOf(fnNode);
    return { name, file, line: line2, col: col2, rendersIconOnlyControl: false, acceptsName: false, spreadsProps: false, forwardsAria: false };
  }
  const { line, col } = posOf(control);
  const attrs = controlAttrs(control);
  const spreadsProps = hasSpread(control);
  const forwardsAria = attrs.some((a) => (attrName(a) === "aria-label" || attrName(a) === "aria-labelledby") && attrIsExpr(a));
  const literalAriaName = attrs.some((a) => NAME_PROPS2.has(attrName(a)) && attrIsLiteral(a));
  const acceptsNameViaChildren = rendersNameExpr(control);
  const acceptsName = spreadsProps || forwardsAria || acceptsNameViaChildren;
  const rendersIconOnlyControl = hasIconChild2(control) && !hasLiteralText(control) && !literalAriaName;
  return { name, file, line, col, rendersIconOnlyControl, acceptsName, spreadsProps, forwardsAria };
}
function isCapitalized(name) {
  const head = name.split(".")[0] ?? name;
  const first = head[0] ?? "";
  return first !== "" && first === first.toUpperCase() && first !== first.toLowerCase();
}
function isComponentFn(init) {
  return !!init && (init.type === "ArrowFunctionExpression" || init.type === "FunctionExpression" || init.type === "FunctionDeclaration");
}
function declComponents(decl, file) {
  const out = [];
  if (decl.type === "FunctionDeclaration") {
    const id = asNode(decl.id);
    const name = id && typeof id.name === "string" ? id.name : "";
    if (name && isCapitalized(name)) out.push(analyzeComponent(name, file, decl));
  } else if (decl.type === "VariableDeclaration") {
    for (const d of asNodes(decl.declarations)) {
      const id = asNode(d.id);
      const init = asNode(d.init);
      const name = id && typeof id.name === "string" ? id.name : "";
      if (name && isCapitalized(name) && isComponentFn(init)) out.push(analyzeComponent(name, file, init));
    }
  }
  return out;
}
function extractGraphNode(ast, doc, file) {
  const posix = toPosix(file);
  const imports = [];
  const components = /* @__PURE__ */ new Map();
  const definesIds = [];
  let providesHtmlLang = false;
  for (const el of doc.elements) {
    const id = el.attribs.id;
    if (id && !id.startsWith("{")) definesIds.push(id);
    if (el.tag === "html" && hasAttr(el, "lang") && (attr(el, "lang") ?? "") !== "") providesHtmlLang = true;
  }
  if (!ast) return { file: posix, imports, components, definesIds, providesHtmlLang };
  const body = asNodes((asNode(ast.program) ?? ast).body);
  const register = (def) => {
    if (!components.has(def.name)) components.set(def.name, def);
  };
  for (const stmt of body) {
    if (stmt.type === "ImportDeclaration") {
      const source = asNode(stmt.source);
      const spec = source && typeof source.value === "string" ? source.value : "";
      for (const s of asNodes(stmt.specifiers)) {
        const local = asNode(s.local);
        const localName = local && typeof local.name === "string" ? local.name : "";
        if (!localName) continue;
        if (s.type === "ImportDefaultSpecifier") imports.push({ source: spec, local: localName, imported: "default" });
        else if (s.type === "ImportNamespaceSpecifier") imports.push({ source: spec, local: localName, imported: "*" });
        else if (s.type === "ImportSpecifier") {
          const imp = asNode(s.imported);
          const impName = imp && typeof imp.name === "string" ? imp.name : localName;
          imports.push({ source: spec, local: localName, imported: impName });
        }
      }
    } else if (stmt.type === "FunctionDeclaration" || stmt.type === "VariableDeclaration") {
      for (const def of declComponents(stmt, posix)) register(def);
    } else if (stmt.type === "ExportNamedDeclaration") {
      const decl = asNode(stmt.declaration);
      if (decl) for (const def of declComponents(decl, posix)) register(def);
      for (const s of asNodes(stmt.specifiers)) {
        const localN = asNode(s.local);
        const exportedN = asNode(s.exported);
        const localName = localN && typeof localN.name === "string" ? localN.name : "";
        const exportedName = exportedN && typeof exportedN.name === "string" ? exportedN.name : "";
        const def = components.get(localName);
        if (def && exportedName && !components.has(exportedName)) components.set(exportedName, def);
      }
    } else if (stmt.type === "ExportDefaultDeclaration") {
      const decl = asNode(stmt.declaration);
      if (!decl) continue;
      if (decl.type === "FunctionDeclaration") {
        const id = asNode(decl.id);
        const name = id && typeof id.name === "string" ? id.name : "default";
        const def = analyzeComponent(name === "default" ? "default" : name, posix, decl);
        register(def);
        if (!components.has("default")) components.set("default", def);
      } else if (decl.type === "ArrowFunctionExpression" || decl.type === "FunctionExpression") {
        const def = analyzeComponent("default", posix, decl);
        if (!components.has("default")) components.set("default", def);
      } else if (decl.type === "Identifier") {
        const ref = typeof decl.name === "string" ? components.get(decl.name) : void 0;
        if (ref && !components.has("default")) components.set("default", ref);
      }
    }
  }
  return { file: posix, imports, components, definesIds, providesHtmlLang };
}

// src/graph/build.ts
function buildGraphStreaming(files) {
  const nodes = [];
  for (const file of files) {
    let content;
    try {
      content = readText(file);
    } catch {
      continue;
    }
    let ast = null;
    let doc;
    if (detectKind(file) === "jsx") {
      ast = parseJsxAst(content);
      doc = ast ? jsxAstToDoc(ast, content, file) : parseHtml(jsxToHtml(content), file, true);
    } else {
      doc = parseHtml(content, file, false);
    }
    nodes.push(extractGraphNode(ast, doc, file));
  }
  return buildGraph(nodes);
}

// src/discover.ts
import { existsSync as existsSync2 } from "fs";
import { execFileSync } from "child_process";
import { join as join3, relative } from "path";
function git(args) {
  try {
    return execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
  } catch {
    return null;
  }
}
function gitChangedFiles(ref) {
  const top = git(["rev-parse", "--show-toplevel"]);
  if (top === null) return null;
  const repoRoot2 = top.trim();
  const base = ref?.trim() ? ref.trim() : "HEAD";
  const out = /* @__PURE__ */ new Set();
  const add = (s) => {
    if (!s) return;
    for (const line of s.split("\n")) {
      const t2 = line.trim();
      if (t2) out.add(t2);
    }
  };
  add(git(["diff", "--name-only", "--diff-filter=d", base]));
  add(git(["diff", "--name-only", "--diff-filter=d", "--cached", base]));
  add(git(["ls-files", "--others", "--exclude-standard"]));
  const cwd = process.cwd();
  return [...out].map((p) => relative(cwd, join3(repoRoot2, p)));
}
var TIER0 = /(^|\/)(layout|template|_app|_document|app|main|index)[.\-/]|(^|\/)(layouts?|templates?)\//i;
var TIER1 = /(^|\/)(components?|shared|ui|design-system|ds|partials?|includes?)\//i;
function priority(file) {
  const rel = toPosix(file);
  if (TIER0.test(rel)) return 0;
  if (TIER1.test(rel)) return 1;
  return 2;
}
function byPriorityThenPath(a, b) {
  return priority(a) - priority(b) || (a < b ? -1 : a > b ? 1 : 0);
}
function discover(inputs, opts = {}) {
  const changedMode = !!(opts.changed || opts.since);
  let files;
  let gitUnavailable = false;
  if (changedMode) {
    const changed = gitChangedFiles(opts.since);
    if (changed === null) {
      gitUnavailable = true;
      opts.onWarn?.("ultra11y: --changed requested but git is unavailable here \u2014 falling back to a full scan.");
      files = expandInputs(inputs, opts);
    } else {
      const filter = makeFilter(opts);
      const inScope = inScopeMatcher(inputs);
      files = changed.filter((f) => existsSync2(f) && filter(f) && (!inScope || inScope(f)));
    }
  } else {
    files = expandInputs(inputs, opts);
  }
  files = [...new Set(files)].sort(byPriorityThenPath);
  return { files, changedMode, gitUnavailable };
}

// src/audit.ts
var has = (d, ...tags) => d.elements.some((e) => tags.includes(e.tag));
var hasAria = (d) => d.elements.some((e) => hasAttr(e, "role") || Object.keys(e.attribs).some((a) => a.startsWith("aria-")));
var APPLICABLE = {
  "1.1": (d) => has(d, "img", "area", "canvas") || d.elements.some((e) => attr(e, "role") === "img"),
  "1.2": (d) => has(d, "img"),
  "2.1": (d) => has(d, "iframe"),
  "4.10": (d) => has(d, "audio", "video"),
  "13.8": (d) => has(d, "audio", "video"),
  "5.4": (d) => has(d, "table"),
  "5.6": (d) => has(d, "table"),
  "5.7": (d) => has(d, "table"),
  "6.2": (d) => d.elements.some((e) => e.tag === "a" && hasAttr(e, "href")),
  "7.1": (d) => hasAria(d) || has(d, "button") || d.elements.some((e) => ["div", "span"].includes(e.tag) && hasAttr(e, "onclick")),
  "7.3": (d) => d.elements.some((e) => ["div", "span"].includes(e.tag) && hasAttr(e, "onclick")),
  "8.2": (d) => isFullDocument(d),
  "8.3": (d) => isFullDocument(d),
  "8.5": (d) => isFullDocument(d),
  "8.7": (d) => d.elements.some((e) => e.tag !== "html" && hasAttr(e, "lang")),
  "9.1": (d) => isFullDocument(d),
  "9.3": (d) => has(d, "ul", "ol", "dl", "li", "dt", "dd"),
  "11.1": (d) => d.elements.some(isFormField),
  "11.6": (d) => has(d, "fieldset"),
  "12.7": (d) => isFullDocument(d) && d.elements.some((e) => e.tag === "a" && (attr(e, "href") ?? "").startsWith("#")),
  "12.8": (d) => d.elements.some((e) => hasAttr(e, "tabindex")),
  "5.8": (d) => has(d, "table")
};
function residualReason(automatability) {
  return automatability === "needs-rendering" ? "N\xE9cessite un rendu (contraste, focus, zoom/reflow) \u2014 \xE0 v\xE9rifier manuellement." : "Crit\xE8re de jugement \u2014 \xE0 \xE9valuer manuellement avec le contexte.";
}
var STATIC_PREDS = allCriteria().filter((c) => c.automatability === "static").map((c) => [c.id, APPLICABLE[c.id] ?? isFullDocument]);
function newAccum() {
  return { byCriterion: /* @__PURE__ */ new Map(), applicable: /* @__PURE__ */ new Map(), allFindings: [], fileCount: 0, opaqueLibs: /* @__PURE__ */ new Set(), opaqueFiles: 0 };
}
function foldDoc(acc, doc, graph) {
  let findings = runRules(doc);
  if (graph) {
    const cross = runCrossRules(doc, graph);
    if (cross.suppress.length) {
      findings = findings.filter((f) => !cross.suppress.some((s) => s.ruleId === f.ruleId && s.line === f.line));
    }
    findings = findings.concat(cross.findings);
    for (const f of cross.findings) acc.applicable.set(f.criteriaId, true);
  }
  for (const f of findings) {
    acc.allFindings.push(f);
    const arr = acc.byCriterion.get(f.criteriaId) ?? [];
    arr.push(f);
    acc.byCriterion.set(f.criteriaId, arr);
  }
  for (const [id, pred] of STATIC_PREDS) {
    if (!acc.applicable.get(id) && pred(doc)) acc.applicable.set(id, true);
  }
  if (doc.opaqueComponents?.length) {
    for (const lib of doc.opaqueComponents) acc.opaqueLibs.add(lib);
    acc.opaqueFiles++;
  }
  acc.fileCount++;
}
function finalize(acc, inputs, extra = {}) {
  const criteria = [];
  const residualRisks = [];
  for (const c of allCriteria()) {
    const fs = acc.byCriterion.get(c.id) ?? [];
    let status;
    let justification;
    if (c.automatability === "static") {
      const applicable = acc.applicable.get(c.id) ?? false;
      if (!applicable) {
        status = "NA";
        justification = "Aucun \xE9l\xE9ment concern\xE9 par ce crit\xE8re dans le p\xE9rim\xE8tre audit\xE9.";
      } else if (fs.length > 0) {
        status = "NC";
      } else {
        status = "C";
      }
    } else if (fs.length > 0) {
      status = "NC";
    } else {
      status = "manual";
      residualRisks.push({ criteriaId: c.id, reason: residualReason(c.automatability), automatability: c.automatability });
    }
    criteria.push({ id: c.id, theme: c.theme, status, findings: fs, ...justification ? { justification } : {} });
  }
  const themes = allThemes().map((t2) => {
    const inTheme = criteria.filter((c) => c.theme === t2.number);
    return {
      number: t2.number,
      title: t2.name,
      c: inTheme.filter((c) => c.status === "C").length,
      nc: inTheme.filter((c) => c.status === "NC").length,
      na: inTheme.filter((c) => c.status === "NA").length,
      manual: inTheme.filter((c) => c.status === "manual").length
    };
  });
  const decided = criteria.filter((c) => c.status === "C" || c.status === "NC");
  const conform = decided.filter((c) => c.status === "C").length;
  const conformancePct = decided.length === 0 ? 100 : Math.round(conform / decided.length * 100);
  return {
    tool: "ultra11y",
    version: VERSION,
    schemaVersion: SCHEMA_VERSION,
    date: today(),
    scope: {
      inputs,
      files: acc.fileCount,
      ...extra.truncated ? { truncated: extra.truncated } : {},
      ...extra.dedup ? { dedup: extra.dedup } : {},
      ...acc.opaqueLibs.size ? { rendered: { opaqueLibraries: [...acc.opaqueLibs].sort(), files: acc.opaqueFiles } } : {}
    },
    themes,
    criteria,
    findings: acc.allFindings,
    residualRisks,
    conformancePct
  };
}
function hashContent(content, mode) {
  const norm = mode === "normalized" ? content.replace(/>\s+</g, "><").trim() : content;
  return createHash("sha1").update(norm).digest("hex");
}
function runAudit(opts) {
  const acc = newAccum();
  const dedupMode = opts.changed || opts.since ? "off" : opts.dedup ?? "exact";
  const seen = /* @__PURE__ */ new Set();
  let duplicateFiles = 0;
  let truncated;
  const { files } = discover(opts.inputs, {
    include: opts.include,
    exclude: opts.exclude,
    ext: opts.ext,
    changed: opts.changed,
    since: opts.since,
    onWarn: opts.onWarn
  });
  let graph;
  if (opts.graph) {
    const graphFiles = opts.changed || opts.since ? discover(opts.inputs, { include: opts.include, exclude: opts.exclude, ext: opts.ext }).files : files;
    graph = buildGraphStreaming(graphFiles);
  }
  for (let i = 0; i < files.length; i++) {
    if (opts.maxFiles && opts.maxFiles > 0 && acc.fileCount >= opts.maxFiles) {
      const skipped = files.length - acc.fileCount;
      truncated = { limit: opts.maxFiles, total: files.length, skipped };
      opts.onWarn?.(
        `ultra11y: --max-files=${opts.maxFiles} reached; audited ${acc.fileCount}/${files.length} files (highest-priority first). Skipped ${skipped}.`
      );
      break;
    }
    const file = files[i];
    let content;
    try {
      content = readText(file);
    } catch {
      continue;
    }
    if (dedupMode !== "off") {
      const h = hashContent(content, dedupMode);
      if (seen.has(h)) {
        duplicateFiles++;
        continue;
      }
      seen.add(h);
    }
    foldDoc(acc, parseSource(content, file, { forceJsx: opts.forceJsx }), graph);
  }
  const canonicalFiles = acc.fileCount;
  if (opts.inputs.includes("-") && opts.stdin !== void 0 && !(opts.maxFiles && opts.maxFiles > 0 && acc.fileCount >= opts.maxFiles)) {
    foldDoc(acc, parseSource(opts.stdin, "<stdin>", { forceJsx: opts.forceJsx }), graph);
  }
  return finalize(acc, opts.inputs, {
    ...truncated ? { truncated } : {},
    ...duplicateFiles > 0 ? { dedup: { canonicalFiles, duplicateFiles } } : {}
  });
}

// src/report.ts
import { mkdirSync, writeFileSync } from "fs";
import { join as join4 } from "path";

// src/standard.ts
function parseStandard(v) {
  return v === "wcag" ? "wcag" : "rgaa";
}
var WCAG_RE = /^(\d+(?:\.\d+)+)\s+(.*?)\s*\(([A]{1,3})\)\s*$/;
function parseWcag(entry) {
  const m = WCAG_RE.exec(entry.trim());
  if (m) return { sc: m[1], title: m[2].trim(), level: m[3] };
  const sp = entry.trim().split(/\s+/);
  return { sc: sp[0] ?? entry.trim(), title: sp.slice(1).join(" "), level: "" };
}
function compareSC(a, b) {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const d = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (d) return d;
  }
  return 0;
}
function wcagIndex() {
  const byScId = /* @__PURE__ */ new Map();
  for (const c of allCriteria()) {
    for (const w of c.wcag) {
      const p = parseWcag(w);
      const e = byScId.get(p.sc) ?? { ...p, rgaaIds: [] };
      e.title = p.title;
      e.level = p.level;
      if (!e.rgaaIds.includes(c.id)) e.rgaaIds.push(c.id);
      byScId.set(p.sc, e);
    }
  }
  return [...byScId.values()].sort((a, b) => compareSC(a.sc, b.sc));
}
function aggregateStatus(results) {
  if (results.some((r) => r.status === "NC")) return "NC";
  if (results.some((r) => r.status === "C")) return "C";
  if (results.some((r) => r.status === "manual")) return "manual";
  return "NA";
}
function scResults(r) {
  const byId2 = new Map(r.criteria.map((c) => [c.id, c]));
  return wcagIndex().map((e) => {
    const results = e.rgaaIds.map((id) => byId2.get(id)).filter((x) => !!x);
    return {
      ...e,
      status: aggregateStatus(results),
      findingCount: results.reduce((n, c) => n + c.findings.length, 0)
    };
  });
}
var STATUS_LABEL = {
  C: { fr: "Conforme", en: "Conforming" },
  NC: { fr: "Non conforme", en: "Non-conforming" },
  NA: { fr: "Non applicable", en: "Not applicable" },
  manual: { fr: "\xC0 \xE9valuer", en: "To assess" }
};
var T = {
  fr: {
    title: "Rapport d'audit d'accessibilit\xE9 \u2014 WCAG 2.1 niveau AA",
    sub: "Vue WCAG d\xE9riv\xE9e des correspondances du RGAA 4.1.2 (r\xE9f\xE9rentiel interne). Pr\xE9sentation seule \u2014 les contr\xF4les d'int\xE9grit\xE9 (`check`/`verify`) op\xE8rent sur le rapport RGAA.",
    date: "Date",
    scope: "P\xE9rim\xE8tre",
    files: "fichier(s)",
    rate: "Taux de conformit\xE9 automatique",
    rateNote: "sous-ensemble statique des crit\xE8res RGAA mapp\xE9s",
    synth: "1. Crit\xE8res de succ\xE8s WCAG",
    th: ["SC", "Intitul\xE9", "Niveau", "Statut", "RGAA", "Findings"],
    ncTitle: "2. Non-conformit\xE9s (par crit\xE8re de succ\xE8s)",
    none: "Aucune non-conformit\xE9 d\xE9tect\xE9e par le moteur statique.",
    equiv: "\xC9quivalence internationale",
    equivBody: "EN 301 549 \xA79 (Union europ\xE9enne) et la Section 508 r\xE9vis\xE9e (\xC9tats-Unis) int\xE8grent WCAG 2.1 niveau AA par r\xE9f\xE9rence ; cette vue couvre donc les exigences \xAB web \xBB de ces deux r\xE9f\xE9rentiels."
  },
  en: {
    title: "Accessibility audit report \u2014 WCAG 2.1 Level AA",
    sub: "WCAG view derived from RGAA 4.1.2 cross-references (internal reference). Presentation only \u2014 integrity gates (`check`/`verify`) operate on the RGAA report.",
    date: "Date",
    scope: "Scope",
    files: "file(s)",
    rate: "Automatic conformance rate",
    rateNote: "static subset of mapped RGAA criteria",
    synth: "1. WCAG success criteria",
    th: ["SC", "Title", "Level", "Status", "RGAA", "Findings"],
    ncTitle: "2. Non-conformities (by success criterion)",
    none: "No non-conformity detected by the static engine.",
    equiv: "International equivalence",
    equivBody: "EN 301 549 \xA79 (European Union) and the revised Section 508 (United States) both incorporate WCAG 2.1 Level AA by reference; this view therefore maps to those standards' web requirements."
  }
};
function renderWcagReport(r, lang = "fr") {
  const s = T[lang];
  const out = [];
  out.push(`# ${s.title}`, "", `> ${s.sub}`, "");
  out.push(`- **${s.date}** : ${r.date}`);
  out.push(`- **${s.scope}** : ${r.scope.files} ${s.files} \u2014 ${r.scope.inputs.join(", ")}`);
  out.push(`- **${s.rate}** : ${r.conformancePct}% (${s.rateNote})`, "");
  const scs = scResults(r);
  out.push(`## ${s.synth}`, "");
  out.push(`| ${s.th.join(" | ")} |`);
  out.push(`|${"---|".repeat(s.th.length)}`);
  for (const sc of scs) {
    out.push(`| ${sc.sc} | ${sc.title} | ${sc.level} | ${STATUS_LABEL[sc.status][lang]} | ${sc.rgaaIds.join(", ")} | ${sc.findingCount || ""} |`);
  }
  out.push("");
  out.push(`## ${s.ncTitle}`, "");
  const ncScs = scs.filter((sc) => sc.status === "NC");
  if (!ncScs.length) {
    out.push(s.none, "");
  } else {
    const byId2 = new Map(r.criteria.map((c) => [c.id, c]));
    for (const sc of ncScs) {
      out.push(`### ${sc.sc} ${sc.title} (${sc.level})`, "");
      for (const id of sc.rgaaIds) {
        const cr = byId2.get(id);
        if (!cr) continue;
        for (const f of cr.findings) {
          const c = getCriterion(id);
          out.push(`- **RGAA ${id}${c ? ` \u2014 ${c.titlePlain}` : ""}** \u2014 \`${f.file}:${f.line}\` (\`${f.selectorHint}\`)`);
          out.push(`  - ${f.message}`);
        }
      }
      out.push("");
    }
  }
  out.push(`## ${s.equiv}`, "", s.equivBody, "");
  return out.join("\n");
}
function wcagListText(lang = "fr") {
  const out = [];
  out.push(lang === "fr" ? "WCAG 2.1 \u2014 crit\xE8res de succ\xE8s r\xE9f\xE9renc\xE9s par le RGAA 4.1.2" : "WCAG 2.1 \u2014 success criteria referenced by RGAA 4.1.2");
  for (const e of wcagIndex()) {
    out.push(`${e.sc.padEnd(8)} [${e.level.padEnd(3)}] ${e.title}  \u2190  RGAA ${e.rgaaIds.join(", ")}`);
  }
  return out.join("\n");
}
function wcagLookupText(sc, lang = "fr") {
  const e = wcagIndex().find((x) => x.sc === sc);
  if (!e) return null;
  const out = [];
  out.push(`${e.sc} \u2014 ${e.title} (${lang === "fr" ? "niveau" : "level"} ${e.level})`);
  out.push(`${lang === "fr" ? "Crit\xE8res RGAA correspondants" : "Corresponding RGAA criteria"} :`);
  for (const id of e.rgaaIds) {
    const c = getCriterion(id);
    out.push(`  ${id} \u2014 ${c?.titlePlain ?? ""} [${c?.automatability ?? "?"}]`);
  }
  return out.join("\n");
}

// src/report.ts
var ICON = { bloquant: "\u{1F534}", majeur: "\u{1F7E0}", mineur: "\u{1F7E1}" };
var SEV_ORDER = ["bloquant", "majeur", "mineur"];
var L = {
  fr: {
    title: "Rapport d'audit d'accessibilit\xE9 \u2014 RGAA 4.1.2",
    date: "Date",
    tool: "Outil",
    toolNote: "moteur statique \u2014 audit pr\xE9liminaire \xE0 compl\xE9ter par une revue humaine",
    scope: "P\xE9rim\xE8tre",
    files: "fichier(s)",
    rate: "Taux de conformit\xE9 automatique",
    rateNote: "sous-ensemble statique : C \xF7 (C + NC)",
    warn: "Ce rapport couvre le sous-ensemble de crit\xE8res v\xE9rifiables automatiquement. Les crit\xE8res \xAB \xE0 \xE9valuer \xBB (rendu / jugement) doivent \xEAtre compl\xE9t\xE9s par une revue humaine (voir la derni\xE8re section).",
    synthTitle: "1. Synth\xE8se par th\xE9matique",
    th: ["Th\xE9matique", "C", "NC", "NA", "\xC0 \xE9valuer"],
    total: "Total",
    ncTitle: "2. Non-conformit\xE9s (par priorit\xE9)",
    sev: { bloquant: "Bloquant", majeur: "Majeur", mineur: "Mineur" },
    fix: "Correction",
    none: "Aucune non-conformit\xE9 d\xE9tect\xE9e par le moteur statique.",
    cTitle: "3. Crit\xE8res conformes (C)",
    naTitle: "4. Crit\xE8res non applicables (NA)",
    manualTitle: "5. Crit\xE8res \xE0 \xE9valuer manuellement (rendu / jugement)",
    manualWarn: "Ne marquez aucun de ces crit\xE8res \xAB conforme \xBB sans v\xE9rification humaine.",
    nothing: "Aucun.",
    dedup: "D\xE9dup",
    canonical: "fichier(s) canonique(s) audit\xE9(s)",
    duplicate: "doublon(s) identique(s) ignor\xE9(s)",
    truncated: (l, t2, s) => `P\xE9rim\xE8tre tronqu\xE9 : ${l}/${t2} fichiers audit\xE9s (priorit\xE9 d'abord), ${s} ignor\xE9(s). \xC9largir avec --max-files.`,
    rendered: (n, libs) => `Verdict source pr\xE9liminaire : ${n} fichier(s) rendent des composants de biblioth\xE8que (${libs}) dont le HTML produit n'est pas visible en analyse statique. Auditez la sortie de build (\`render\` / \`audit <dist>\`) ou \`scan\` avant de conclure.`
  },
  en: {
    title: "Accessibility audit report \u2014 RGAA 4.1.2",
    date: "Date",
    tool: "Tool",
    toolNote: "static engine \u2014 preliminary audit to be completed by a human review",
    scope: "Scope",
    files: "file(s)",
    rate: "Automatic conformance rate",
    rateNote: "static subset: C \xF7 (C + NC)",
    warn: "This report covers the subset of criteria checkable automatically. The \u201Cto assess\u201D criteria (rendering / judgment) must be completed by a human review (see the last section).",
    synthTitle: "1. Per-theme synthesis",
    th: ["Theme", "C", "NC", "NA", "To assess"],
    total: "Total",
    ncTitle: "2. Non-conformities (by priority)",
    sev: { bloquant: "Blocking", majeur: "Major", mineur: "Minor" },
    fix: "Fix",
    none: "No non-conformity detected by the static engine.",
    cTitle: "3. Conforming criteria (C)",
    naTitle: "4. Not-applicable criteria (NA)",
    manualTitle: "5. Criteria to assess manually (rendering / judgment)",
    manualWarn: "Do not mark any of these criteria \u201Cconforming\u201D without a human check.",
    nothing: "None.",
    dedup: "Dedup",
    canonical: "canonical file(s) audited",
    duplicate: "identical duplicate(s) skipped",
    truncated: (l, t2, s) => `Scope truncated: ${l}/${t2} files audited (highest-priority first), ${s} skipped. Widen with --max-files.`,
    rendered: (n, libs) => `Preliminary source verdict: ${n} file(s) render component-library components (${libs}) whose produced HTML is invisible to static analysis. Audit the build output (\`render\` / \`audit <dist>\`) or \`scan\` before concluding.`
  }
};
function critLabel(id) {
  const c = getCriterion(id);
  return c ? `${id} \u2014 ${c.titlePlain}` : id;
}
function ncEntry(f, fixLabel) {
  return `- **${critLabel(f.criteriaId)}** \u2014 \`${f.file}:${f.line}\` (\`${f.selectorHint}\`)
  - ${f.message}
  - _${fixLabel} :_ ${f.remediation}`;
}
function renderReport(r, lang = "fr") {
  const s = L[lang];
  const out = [];
  out.push(`# ${s.title}`, "");
  out.push(`- **${s.date}** : ${r.date}`);
  out.push(`- **${s.tool}** : ultra11y v${r.version} (${s.toolNote})`);
  out.push(`- **${s.scope}** : ${r.scope.files} ${s.files} \u2014 ${r.scope.inputs.join(", ")}`);
  out.push(`- **${s.rate}** : ${r.conformancePct}% (${s.rateNote})`);
  if (r.scope.dedup) out.push(`- **${s.dedup}** : ${r.scope.dedup.canonicalFiles} ${s.canonical}, ${r.scope.dedup.duplicateFiles} ${s.duplicate}`);
  out.push("", `> \u26A0\uFE0F ${s.warn}`, "");
  if (r.scope.truncated) out.push(`> \u2702\uFE0F ${s.truncated(r.scope.truncated.limit, r.scope.truncated.total, r.scope.truncated.skipped)}`, "");
  if (r.scope.rendered) out.push(`> \u{1F9E9} ${s.rendered(r.scope.rendered.files, r.scope.rendered.opaqueLibraries.join(", "))}`, "");
  out.push(`## ${s.synthTitle}`, "");
  out.push(`| ${s.th.join(" | ")} |`);
  out.push(`|${"---|".repeat(s.th.length)}`);
  const tot = { c: 0, nc: 0, na: 0, manual: 0 };
  for (const th of r.themes) {
    out.push(`| ${th.number}. ${th.title} | ${th.c} | ${th.nc} | ${th.na} | ${th.manual} |`);
    tot.c += th.c;
    tot.nc += th.nc;
    tot.na += th.na;
    tot.manual += th.manual;
  }
  out.push(`| **${s.total}** | **${tot.c}** | **${tot.nc}** | **${tot.na}** | **${tot.manual}** |`, "");
  out.push(`## ${s.ncTitle}`, "");
  if (r.findings.length === 0) {
    out.push(s.none, "");
  } else {
    const sorted = [...r.findings].sort(
      (a, b) => SEV_ORDER.indexOf(a.severity) - SEV_ORDER.indexOf(b.severity) || a.criteriaId.localeCompare(b.criteriaId, void 0, { numeric: true }) || a.line - b.line
    );
    for (const sev of SEV_ORDER) {
      const group = sorted.filter((f) => f.severity === sev);
      if (!group.length) continue;
      out.push(`### ${ICON[sev]} ${s.sev[sev]} (${group.length})`, "");
      for (const f of group) out.push(ncEntry(f, s.fix));
      out.push("");
    }
  }
  out.push(`## ${s.cTitle}`, "");
  const conform = r.criteria.filter((c) => c.status === "C");
  out.push(conform.length ? conform.map((c) => `- ${critLabel(c.id)}`).join("\n") : s.nothing, "");
  out.push(`## ${s.naTitle}`, "");
  const na = r.criteria.filter((c) => c.status === "NA");
  out.push(na.length ? na.map((c) => `- ${critLabel(c.id)}${c.justification ? ` \u2014 _${c.justification}_` : ""}`).join("\n") : s.nothing, "");
  out.push(`## ${s.manualTitle}`, "", `> ${s.manualWarn}`, "");
  out.push(r.residualRisks.length ? r.residualRisks.map((rr) => `- ${critLabel(rr.criteriaId)} \u2014 _${rr.reason}_`).join("\n") : s.nothing, "");
  return out.join("\n");
}
function writeReport(r, opts) {
  const wcag = opts.standard === "wcag";
  const md = wcag ? renderWcagReport(r, opts.lang) : renderReport(r, opts.lang);
  mkdirSync(opts.out, { recursive: true });
  const path = join4(opts.out, `${wcag ? "wcag" : "rgaa"}-${r.date}.md`);
  writeFileSync(path, md);
  return path;
}

// src/prd.ts
import { mkdirSync as mkdirSync2, writeFileSync as writeFileSync2 } from "fs";
import { join as join5 } from "path";
var SEV_ORDER2 = ["bloquant", "majeur", "mineur"];
var SEV_RANK = { bloquant: 0, majeur: 1, mineur: 2 };
var ICON2 = { bloquant: "\u{1F534}", majeur: "\u{1F7E0}", mineur: "\u{1F7E1}" };
var L2 = {
  fr: {
    title: "Plan de correction d'accessibilit\xE9 \u2014 RGAA 4.1.2",
    date: "Date",
    scope: "P\xE9rim\xE8tre",
    files: "fichier(s)",
    rate: "Taux de conformit\xE9 automatique",
    note: "Backlog des corrections d\xE9tect\xE9es automatiquement. Les crit\xE8res \xAB \xE0 \xE9valuer \xBB (rendu / jugement) sont \xE0 compl\xE9ter par une revue humaine (voir le rapport).",
    none: "Aucune correction automatique \xE0 faire : le moteur statique n'a relev\xE9 aucune non-conformit\xE9.",
    sev: { bloquant: "Bloquant", majeur: "Majeur", mineur: "Mineur" },
    fix: "Correction",
    affected: "Occurrence(s)",
    def: "D\xE9finition",
    prdTitle: (label) => `PRD \u2014 ${label}`
  },
  en: {
    title: "Accessibility fix plan \u2014 RGAA 4.1.2",
    date: "Date",
    scope: "Scope",
    files: "file(s)",
    rate: "Automatic conformance rate",
    note: "Backlog of automatically-detected fixes. The \u201Cto assess\u201D criteria (rendering / judgment) must be completed by a human review (see the report).",
    none: "No automatic fix to do: the static engine found no non-conformity.",
    sev: { bloquant: "Blocking", majeur: "Major", mineur: "Minor" },
    fix: "Fix",
    affected: "Occurrence(s)",
    def: "Definition",
    prdTitle: (label) => `PRD \u2014 ${label}`
  }
};
function prdUnits(r) {
  const byCrit = /* @__PURE__ */ new Map();
  for (const f of r.findings) {
    const arr = byCrit.get(f.criteriaId) ?? [];
    arr.push(f);
    byCrit.set(f.criteriaId, arr);
  }
  const units = [];
  for (const [criteriaId, fs] of byCrit) {
    const c = getCriterion(criteriaId);
    const severity = [...fs].sort((a, b) => SEV_RANK[a.severity] - SEV_RANK[b.severity])[0]?.severity ?? "mineur";
    units.push({
      criteriaId,
      title: c?.titlePlain ?? criteriaId,
      label: c ? `${criteriaId} \u2014 ${c.titlePlain}` : criteriaId,
      wcag: c?.wcag ?? [],
      severity,
      findings: [...fs].sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line)
    });
  }
  units.sort((a, b) => SEV_RANK[a.severity] - SEV_RANK[b.severity] || a.criteriaId.localeCompare(b.criteriaId, void 0, { numeric: true }));
  return units;
}
function unitBlock(unit, lang, heading) {
  const s = L2[lang];
  const out = [];
  const wcag = unit.wcag.length ? `  \xB7  WCAG ${unit.wcag.join(", ")}` : "";
  out.push(`${heading} ${ICON2[unit.severity]} ${unit.label}${wcag}`, "");
  const fixes = [...new Set(unit.findings.map((f) => f.remediation))];
  for (const fx of fixes) out.push(`- _${s.fix} :_ ${fx}`);
  out.push("", `**${s.affected} (${unit.findings.length})**`, "");
  for (const f of unit.findings) {
    out.push(`- [ ] \`${f.file}:${f.line}\` (\`${f.selectorHint}\`) \u2014 ${f.message}`);
    if (f.related) out.push(`  - \u21B3 ${f.related.note} : \`${f.related.file}:${f.related.line}\` (\`${f.related.selectorHint}\`)`);
  }
  out.push("");
  return out;
}
function header(r, lang, title) {
  const s = L2[lang];
  return [
    `# ${title}`,
    "",
    `- **${s.date}** : ${r.date}`,
    `- **${s.scope}** : ${r.scope.files} ${s.files} \u2014 ${r.scope.inputs.join(", ")}`,
    `- **${s.rate}** : ${r.conformancePct}%`,
    "",
    `> ${s.note}`,
    ""
  ];
}
function renderBacklog(r, lang = "fr") {
  const s = L2[lang];
  const units = prdUnits(r);
  const out = header(r, lang, s.title);
  if (!units.length) {
    out.push(s.none, "");
    return out.join("\n");
  }
  for (const sev of SEV_ORDER2) {
    const group = units.filter((u) => u.severity === sev);
    if (!group.length) continue;
    out.push(`## ${ICON2[sev]} ${s.sev[sev]} (${group.length})`, "");
    for (const u of group) out.push(...unitBlock(u, lang, "###"));
  }
  return out.join("\n");
}
function renderPerCriterion(r, lang = "fr") {
  const s = L2[lang];
  return prdUnits(r).map((u) => {
    const out = header(r, lang, s.prdTitle(u.label));
    out.push(...unitBlock(u, lang, "##"));
    return { name: `prd-${u.criteriaId}-${r.date}.md`, content: out.join("\n") };
  });
}
function writePrd(r, opts) {
  mkdirSync2(opts.out, { recursive: true });
  if (opts.split === "criterion") {
    const files = renderPerCriterion(r, opts.lang);
    const paths = [];
    for (const f of files) {
      const p2 = join5(opts.out, f.name);
      writeFileSync2(p2, f.content);
      paths.push(p2);
    }
    return paths;
  }
  const p = join5(opts.out, `prd-${r.date}.md`);
  writeFileSync2(p, renderBacklog(r, opts.lang));
  return [p];
}

// src/gh.ts
import { execFileSync as execFileSync2 } from "child_process";
function gh(args, input) {
  return execFileSync2("gh", args, { encoding: "utf8", stdio: ["pipe", "pipe", "ignore"], ...input !== void 0 ? { input } : {} });
}
function ghAvailable() {
  try {
    execFileSync2("gh", ["auth", "status"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}
function issueTitle(unit) {
  return `[a11y] RGAA ${unit.criteriaId} \u2014 ${unit.title}`;
}
function existingIssueTitles() {
  try {
    const raw = gh(["issue", "list", "--state", "all", "--limit", "1000", "--json", "title"]);
    const arr = JSON.parse(raw);
    return new Set(arr.map((i) => i.title ?? "").filter(Boolean));
  } catch {
    return /* @__PURE__ */ new Set();
  }
}
function issueBody(unit, lang) {
  const t2 = lang === "fr" ? { fix: "Correction", occ: "Occurrence(s)", def: "\u21B3 d\xE9finition" } : { fix: "Fix", occ: "Occurrence(s)", def: "\u21B3 definition" };
  const lines = [];
  if (unit.wcag.length) lines.push(`**WCAG** : ${unit.wcag.join(", ")}`, "");
  for (const fx of [...new Set(unit.findings.map((f) => f.remediation))]) lines.push(`**${t2.fix}** : ${fx}`);
  lines.push("", `**${t2.occ} (${unit.findings.length})**`, "");
  for (const f of unit.findings) {
    lines.push(`- [ ] \`${f.file}:${f.line}\` (\`${f.selectorHint}\`) \u2014 ${f.message}`);
    if (f.related) lines.push(`  - ${t2.def} : \`${f.related.file}:${f.related.line}\` (\`${f.related.selectorHint}\`)`);
  }
  return lines.join("\n");
}
function createIssue(title, body, labels) {
  const base = ["issue", "create", "--title", title, "--body-file", "-"];
  try {
    gh([...base, "--label", labels.join(",")], body);
    return true;
  } catch {
    try {
      gh(base, body);
      return true;
    } catch {
      return false;
    }
  }
}
function pushIssues(units, lang) {
  const existing = existingIssueTitles();
  const result = { created: 0, skipped: 0, failed: 0, createdTitles: [] };
  for (const u of units) {
    const title = issueTitle(u);
    if (existing.has(title)) {
      result.skipped++;
      continue;
    }
    if (createIssue(title, issueBody(u, lang), ["accessibility", "rgaa", u.severity])) {
      result.created++;
      result.createdTitles.push(title);
      existing.add(title);
    } else {
      result.failed++;
    }
  }
  return result;
}

// src/render.ts
var KNOWN_LIBS = {
  "@codegouvfr/react-dsfr": "DSFR (Syst\xE8me de Design de l'\xC9tat)",
  "@gouvfr/dsfr": "DSFR",
  "@mui/material": "MUI",
  "@chakra-ui/react": "Chakra UI",
  antd: "Ant Design",
  "@mantine/core": "Mantine",
  "react-bootstrap": "React-Bootstrap",
  "@radix-ui/react-dropdown-menu": "Radix UI"
};
function detectFrameworks(deps, has2) {
  const dep = (n) => Object.hasOwn(deps, n);
  const anyConfig = (...files) => files.some((f) => has2(f));
  const frameworks = [];
  if (dep("next") || anyConfig("next.config.js", "next.config.mjs", "next.config.ts"))
    frameworks.push({ name: "Next.js", buildCmd: "npx next build   # set `output: 'export'` in next.config to emit static HTML", outDir: "out" });
  if (dep("astro") || anyConfig("astro.config.mjs", "astro.config.ts", "astro.config.js"))
    frameworks.push({ name: "Astro", buildCmd: "npx astro build", outDir: "dist" });
  if (dep("@sveltejs/kit")) frameworks.push({ name: "SvelteKit", buildCmd: "npx vite build", outDir: "build" });
  if (dep("react-scripts")) frameworks.push({ name: "CRA", buildCmd: "npx react-scripts build", outDir: "build" });
  if (Object.keys(deps).some((d) => d === "storybook" || d.startsWith("@storybook/")) || has2(".storybook"))
    frameworks.push({ name: "Storybook", buildCmd: "npx storybook build", outDir: "storybook-static" });
  if (dep("vite") || anyConfig("vite.config.js", "vite.config.ts", "vite.config.mjs"))
    frameworks.push({ name: "Vite", buildCmd: "npx vite build", outDir: "dist" });
  const componentLibraries = [];
  for (const [pkg, label] of Object.entries(KNOWN_LIBS)) if (dep(pkg)) componentLibraries.push(label);
  return { frameworks, componentLibraries };
}
var L3 = {
  fr: {
    title: "Obtenir du HTML rendu \xE0 auditer (render)",
    why: "Auditer les sources JSX d'une biblioth\xE8que de composants donne des faux n\xE9gatifs : il faut auditer le HTML r\xE9ellement produit.",
    libNote: (libs) => `Biblioth\xE8que(s) d\xE9tect\xE9e(s) : ${libs}. Leur sortie n'est PAS visible en analyse de source \u2014 auditez le build ou un snapshot SSR.`,
    detected: "Frameworks d\xE9tect\xE9s",
    none: "Aucun framework d\xE9tect\xE9.",
    build: "Build",
    then: "puis auditer",
    sbReco: "Le plus simple pour un design-system : un build Storybook statique, puis auditer chaque story rendue.",
    ssr: "Sinon, snapshot SSR : `render --scaffold` \xE9crit un harnais react-dom/server \xE0 compl\xE9ter.",
    dyn: "Pour les crit\xE8res de rendu (contraste calcul\xE9, focus, reflow) : `scan <url>` (tier Docker).",
    scaffoldWrote: (p) => `Harnais SSR \xE9crit : ${p}`,
    scaffoldRun: "Compl\xE9tez COMPONENTS, ex\xE9cutez-le avec votre toolchain (ex. `npx tsx`), puis auditez le dossier produit."
  },
  en: {
    title: "Get rendered HTML to audit (render)",
    why: "Auditing the JSX sources of a component library yields false negatives: audit the HTML it actually produces.",
    libNote: (libs) => `Detected library(ies): ${libs}. Their output is NOT visible to source analysis \u2014 audit the build or an SSR snapshot.`,
    detected: "Detected frameworks",
    none: "No framework detected.",
    build: "Build",
    then: "then audit",
    sbReco: "Easiest for a design system: a static Storybook build, then audit each rendered story.",
    ssr: "Otherwise, SSR snapshot: `render --scaffold` writes a react-dom/server harness to fill in.",
    dyn: "For rendering criteria (computed contrast, focus, reflow): `scan <url>` (Docker tier).",
    scaffoldWrote: (p) => `SSR harness written: ${p}`,
    scaffoldRun: "Fill in COMPONENTS, run it with your toolchain (e.g. `npx tsx`), then audit the produced folder."
  }
};
function renderPlan(d, lang = "fr") {
  const s = L3[lang];
  const out = [`# ${s.title}`, "", `> ${s.why}`, ""];
  if (d.componentLibraries.length) out.push(`> \u{1F9E9} ${s.libNote(d.componentLibraries.join(", "))}`, "");
  out.push(`## ${s.detected}`, "");
  if (!d.frameworks.length) out.push(s.none, "");
  else
    for (const f of d.frameworks) {
      out.push(`- **${f.name}** \u2014 ${s.build} : \`${f.buildCmd}\``);
      out.push(`  - ${s.then} : \`node scripts/ultra11y.mjs audit "${f.outDir}/**/*.html"\``);
    }
  out.push("", `- ${s.sbReco}`, `- ${s.ssr}`, `- ${s.dyn}`, "");
  return out.join("\n");
}
function ssrHarness() {
  return `// ultra11y SSR snapshot harness \u2014 render your components to static HTML for audit.
// 1. Fill in COMPONENTS with your real components (DSFR, design-system, pages\u2026).
// 2. Run it with your project's toolchain, e.g.:  npx tsx ultra11y-render.tsx
// 3. Audit the produced HTML:  node scripts/ultra11y.mjs audit "audits/rendered/**/*.html"
import { mkdirSync, writeFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
// import { Button } from "@codegouvfr/react-dsfr/Button";

const COMPONENTS: { name: string; element: JSX.Element }[] = [
  // { name: "button-icon", element: <Button iconId="fr-icon-add-line" title="Ajouter" /> },
];

const OUT = "audits/rendered";
mkdirSync(OUT, { recursive: true });
for (const { name, element } of COMPONENTS) {
  const body = renderToStaticMarkup(element);
  const html = \`<!doctype html>
<html lang="fr">
<head><meta charset="utf-8"><title>\${name}</title></head>
<body>
\${body}
</body>
</html>
\`;
  writeFileSync(\`\${OUT}/\${name}.html\`, html);
  console.log(\`ultra11y-render: wrote \${OUT}/\${name}.html\`);
}
if (COMPONENTS.length === 0) console.error("ultra11y-render: COMPONENTS is empty \u2014 add your components, then re-run.");
`;
}

// src/criteria.ts
var AUTO_LABEL = {
  static: { fr: "automatisable (moteur)", en: "automatable (engine)" },
  "needs-rendering": { fr: "n\xE9cessite un rendu", en: "needs rendering" },
  judgment: { fr: "jugement humain", en: "human judgment" }
};
function formatCriterion(c, lang = "fr") {
  const out = [];
  out.push(`${c.id} \u2014 ${c.titlePlain}`);
  const auto = AUTO_LABEL[c.automatability][lang];
  const theme = allThemes().find((t2) => t2.number === c.theme)?.name ?? "";
  out.push(
    `${lang === "fr" ? "Th\xE9matique" : "Theme"} ${c.theme} (${theme}) \xB7 ${lang === "fr" ? "automatisabilit\xE9" : "automatability"} : ${auto}${c.ruleIds.length ? ` \xB7 ${lang === "fr" ? "r\xE8gles" : "rules"} : ${c.ruleIds.join(", ")}` : ""}`
  );
  if (c.wcag.length) out.push(`WCAG : ${c.wcag.join(" ; ")}`);
  if (c.techniques.length) out.push(`${lang === "fr" ? "Techniques" : "Techniques"} : ${c.techniques.join(", ")}`);
  const testKeys = Object.keys(c.tests);
  if (testKeys.length) {
    out.push(`${lang === "fr" ? "Tests" : "Tests"} :`);
    for (const k of testKeys) for (const line of c.tests[k]) out.push(`  ${c.id}.${k} ${line.replace(/\[([^\]]+)\]\(#[^)]*\)/g, "$1")}`);
  }
  if (c.technicalNote?.length) out.push(`${lang === "fr" ? "Note technique" : "Technical note"} : ${c.technicalNote.join(" ")}`);
  if (c.particularCases?.length) out.push(`${lang === "fr" ? "Cas particuliers" : "Particular cases"} : ${c.particularCases.join(" ")}`);
  return out.join("\n");
}
function themeList(lang) {
  const out = [];
  out.push(lang === "fr" ? "RGAA 4.1.2 \u2014 13 th\xE9matiques, 106 crit\xE8res" : "RGAA 4.1.2 \u2014 13 themes, 106 criteria");
  for (const t2 of allThemes()) {
    const crits = listTheme(t2.number);
    const stat = crits.filter((c) => c.automatability === "static").length;
    out.push(
      `${String(t2.number).padStart(2)}. ${t2.name.padEnd(32).slice(0, 32)} ${String(t2.count).padStart(3)} ${lang === "fr" ? "crit\xE8res" : "criteria"} (${stat} ${lang === "fr" ? "auto" : "auto"})`
    );
  }
  return out.join("\n");
}
function queryCriteria(opts) {
  if (opts.id) {
    const c = getCriterion(opts.id);
    return c ? { kind: "one", result: c } : null;
  }
  if (typeof opts.theme === "number") {
    const crits = listTheme(opts.theme);
    return crits.length ? { kind: "theme", result: crits } : null;
  }
  return { kind: "list", result: allThemes() };
}
function runCriteria(opts) {
  if (opts.standard === "wcag") {
    if (opts.id) {
      const txt = wcagLookupText(opts.id, opts.lang);
      if (!txt) {
        console.error(`ultra11y criteria: unknown WCAG success criterion "${opts.id}".`);
        return 2;
      }
      console.log(
        opts.json ? JSON.stringify(
          wcagIndex().find((e) => e.sc === opts.id),
          null,
          2
        ) : txt
      );
      return 0;
    }
    console.log(opts.json ? JSON.stringify(wcagIndex(), null, 2) : wcagListText(opts.lang));
    return 0;
  }
  const q = queryCriteria(opts);
  if (!q) {
    console.error(`ultra11y criteria: unknown ${opts.id ? `criterion "${opts.id}"` : `theme "${opts.theme}"`}.`);
    return 2;
  }
  if (opts.json) {
    console.log(JSON.stringify(q.result, null, 2));
    return 0;
  }
  if (q.kind === "one") {
    console.log(formatCriterion(q.result, opts.lang));
  } else if (q.kind === "theme") {
    for (const c of q.result) console.log(`${c.id}	[${c.automatability}]	${c.titlePlain}`);
  } else {
    console.log(themeList(opts.lang));
  }
  return 0;
}

// src/check.ts
var CRIT_REF = /(\d{1,2}\.\d{1,2})\s*—/g;
function checkReport(md) {
  const issues = [];
  for (let n = 1; n <= 5; n++) {
    if (!new RegExp(`^##\\s+${n}\\.`, "m").test(md)) issues.push(`Section ${n} manquante dans le rapport.`);
  }
  const seen = /* @__PURE__ */ new Set();
  let m;
  CRIT_REF.lastIndex = 0;
  while (m = CRIT_REF.exec(md)) {
    const id = m[1];
    if (seen.has(id)) continue;
    seen.add(id);
    if (!hasCriterion(id)) issues.push(`Crit\xE8re inexistant cit\xE9 dans le rapport : ${id}.`);
  }
  const naSection = sectionBody(md, 4);
  for (const line of naSection.split("\n")) {
    const item = /^-\s+(\d{1,2}\.\d{1,2})\s*—/.exec(line);
    if (item && !line.includes("_")) issues.push(`Crit\xE8re NA sans justification : ${item[1]}.`);
  }
  const rateM = /^-\s+\*\*[^*\n]*\*\*\s*:\s*(\d+(?:[.,]\d+)?)\s*%/m.exec(md);
  if (!rateM) {
    issues.push("Taux de conformit\xE9 absent de l'en-t\xEAte du rapport.");
  } else {
    const pct = parseFloat(rateM[1].replace(",", "."));
    if (pct < 0 || pct > 100) issues.push(`Taux de conformit\xE9 hors bornes (0\u2013100) : ${rateM[1]}%.`);
  }
  return { ok: issues.length === 0, issues };
}
function sectionBody(md, n) {
  const start = new RegExp(`^##\\s+${n}\\.`, "m").exec(md);
  if (!start) return "";
  const from = start.index + start[0].length;
  const next = /^##\s+/m.exec(md.slice(from));
  return next ? md.slice(from, from + next.index) : md.slice(from);
}

// src/verify.ts
import { mkdirSync as mkdirSync3, writeFileSync as writeFileSync3 } from "fs";
import { join as join6 } from "path";
var VERIFY_MAX = 40;
var NC_HEADER = /^- \*\*(\d{1,2}\.\d{1,2}) — (.*?)\*\* — `([^`]+):(\d+)` \(`([^`]*)`\)/;
function buildWorklist(reportMd, max = VERIFY_MAX) {
  const items = [];
  const lines = reportMd.split("\n");
  for (let i = 0; i < lines.length && items.length < max; i++) {
    const h = NC_HEADER.exec(lines[i]);
    if (!h) continue;
    let claim = h[2] ?? "";
    for (let j = i + 1; j < Math.min(i + 4, lines.length); j++) {
      const sub = /^\s+-\s+(.*)$/.exec(lines[j]);
      if (sub && !sub[1].startsWith("_")) {
        claim = sub[1];
        break;
      }
    }
    items.push({ n: items.length + 1, criteriaId: h[1], file: h[3], line: Number(h[4]), selector: h[5], claim, verdict: null, note: "" });
  }
  return items;
}
function formatWorklist(items, semantic) {
  const out = [];
  out.push("# V\xE9rification des non-conformit\xE9s (ultra11y)", "");
  out.push("Pour CHAQUE entr\xE9e, ouvrez le fichier \xE0 la ligne cit\xE9e et attribuez un verdict dans");
  out.push("`VERIFY.todo.json` (champ `verdict`), avec une `note` :");
  out.push("");
  out.push("- `supported` \u2014 la non-conformit\xE9 est r\xE9elle et correctement rattach\xE9e au crit\xE8re ;");
  out.push("- `partial` \u2014 r\xE9elle mais le crit\xE8re/la formulation est impr\xE9cis ;");
  out.push("- `refuted` \u2014 fausse (l'\xE9l\xE9ment cit\xE9 est en r\xE9alit\xE9 conforme) ;");
  out.push("- `unsupported` \u2014 l'\xE9l\xE9ment cit\xE9 ne permet pas de trancher.");
  out.push("");
  if (semantic) out.push("> Mode --semantic : v\xE9rifiez que l'extrait cit\xE9 **\xE9taye** r\xE9ellement la non-conformit\xE9.", "");
  out.push(`Puis : \`ultra11y verify --apply VERIFY.todo.json\` (\xE9choue si un verdict est refuted/unsupported).`, "");
  for (const it of items) {
    out.push(`- [ ] #${it.n} **${it.criteriaId}** @ \`${it.file}:${it.line}\` (\`${it.selector}\`) \u2014 ${it.claim}`);
    const crit = getCriterion(it.criteriaId);
    if (crit) {
      const tests = Object.values(crit.tests).flat();
      if (tests.length) {
        out.push(`      Tests RGAA ${it.criteriaId} \u2014 ${crit.titlePlain} :`);
        for (const test of tests.slice(0, 6)) out.push(`      - ${test}`);
      }
    }
  }
  out.push("");
  out.push("## Liste de contr\xF4le avant cl\xF4ture", "");
  out.push("- [ ] Chaque entr\xE9e porte un verdict (aucun `null`).");
  out.push("- [ ] Aucune non-conformit\xE9 invent\xE9e : chaque verdict `supported` cite un \xE9l\xE9ment r\xE9el \xE0 la ligne indiqu\xE9e.");
  out.push("- [ ] Les crit\xE8res \xAB \xE0 \xE9valuer \xBB (rendu / jugement) du rapport ont \xE9t\xE9 tranch\xE9s (ou laiss\xE9s en risque r\xE9siduel explicite).");
  out.push("- [ ] Pour un code rendu par une biblioth\xE8que (DSFR\u2026), le verdict s'appuie sur le HTML **produit** (build / `scan`), pas sur la source JSX.");
  out.push("- [ ] `ultra11y verify --apply VERIFY.todo.json` repasse au vert.");
  out.push("");
  return out.join("\n");
}
var PASSING = /* @__PURE__ */ new Set(["supported", "partial"]);
function normalizeVerdict(v) {
  if (typeof v !== "string") return null;
  const s = v.trim().toLowerCase();
  return s ? s : null;
}
function applyVerdicts(items) {
  let refuted = 0;
  let unsupported = 0;
  let unadjudicated = 0;
  let invalid = 0;
  const failures = [];
  for (const it of items) {
    const v = normalizeVerdict(it.verdict);
    if (v !== null && PASSING.has(v)) continue;
    failures.push(it);
    if (v === "refuted") refuted++;
    else if (v === "unsupported") unsupported++;
    else if (v === null) unadjudicated++;
    else invalid++;
  }
  return { ok: failures.length === 0, total: items.length, refuted, unsupported, unadjudicated, invalid, failures };
}
function writeWorklist(items, outDir, semantic) {
  mkdirSync3(outDir, { recursive: true });
  const todoPath = join6(outDir, "VERIFY.todo.json");
  const mdPath = join6(outDir, "VERIFY.md");
  writeFileSync3(todoPath, JSON.stringify(items, null, 2) + "\n");
  writeFileSync3(mdPath, formatWorklist(items, semantic));
  return { todoPath, mdPath, count: items.length };
}

// src/scan.ts
import { execFileSync as execFileSync3 } from "child_process";
import { mkdtempSync, writeFileSync as writeFileSync4, existsSync as existsSync3, statSync as statSync2, readdirSync as readdirSync2, rmSync } from "fs";
import { tmpdir } from "os";
import { join as join7, resolve } from "path";

// src/axe-map.ts
var AXE_RGAA = {
  // images
  "image-alt": "1.1",
  "input-image-alt": "1.1",
  "area-alt": "1.1",
  "role-img-alt": "1.1",
  "image-redundant-alt": "1.2",
  "svg-img-alt": "1.1",
  // frames
  "frame-title": "2.1",
  "frame-title-unique": "2.2",
  // colour (the headline dynamic win)
  "color-contrast": "3.2",
  "color-contrast-enhanced": "3.2",
  "link-in-text-block": "3.1",
  // tables
  "td-headers-attr": "5.7",
  "th-has-data-cells": "5.7",
  "scope-attr-valid": "5.7",
  "table-fake-caption": "5.4",
  "td-has-header": "5.6",
  "empty-table-header": "5.6",
  // links & buttons
  "link-name": "6.2",
  "button-name": "7.1",
  "input-button-name": "7.1",
  // scripts / ARIA
  "aria-allowed-attr": "7.1",
  "aria-allowed-role": "7.1",
  "aria-command-name": "7.1",
  "aria-hidden-body": "7.1",
  "aria-hidden-focus": "7.1",
  "aria-input-field-name": "11.1",
  "aria-required-attr": "7.1",
  "aria-required-children": "7.1",
  "aria-required-parent": "7.1",
  "aria-roles": "7.1",
  "aria-toggle-field-name": "11.1",
  "aria-valid-attr": "7.1",
  "aria-valid-attr-value": "7.1",
  "nested-interactive": "7.1",
  "aria-tooltip-name": "7.1",
  "aria-meter-name": "7.1",
  "aria-progressbar-name": "7.1",
  "aria-dialog-name": "7.1",
  "presentation-role-conflict": "7.1",
  "duplicate-id-aria": "8.2",
  // mandatory elements / language
  "duplicate-id": "8.2",
  "duplicate-id-active": "8.2",
  "html-has-lang": "8.3",
  "html-xml-lang-mismatch": "8.3",
  "html-lang-valid": "8.4",
  "valid-lang": "8.8",
  "document-title": "8.5",
  // structure
  "heading-order": "9.1",
  "empty-heading": "9.1",
  "page-has-heading-one": "9.1",
  list: "9.3",
  listitem: "9.3",
  "definition-list": "9.3",
  dlitem: "9.3",
  "landmark-one-main": "12.6",
  region: "12.6",
  // presentation / zoom
  "meta-viewport": "10.4",
  "meta-viewport-large": "10.4",
  // forms
  label: "11.1",
  "form-field-multiple-labels": "11.1",
  "select-name": "11.1",
  "label-title-only": "11.1",
  "autocomplete-valid": "11.13",
  fieldset: "11.6",
  // multimedia
  "audio-caption": "4.3",
  "video-caption": "4.3",
  "no-autoplay-audio": "4.10",
  blink: "13.8",
  marquee: "13.8",
  // navigation
  tabindex: "12.8",
  "skip-link": "12.7",
  bypass: "12.7",
  accesskeys: "12.10"
};
var FALLBACK_CRITERION = "7.1";
function criterionFromRgaaTags(tags) {
  if (!tags) return null;
  for (const t2 of tags) {
    const m = /^RGAA-(\d+\.\d+)\.\d+$/.exec(t2);
    if (m) return m[1];
  }
  return null;
}
function severityFromImpact(impact) {
  switch (impact) {
    case "critical":
    case "serious":
      return "bloquant";
    case "moderate":
      return "majeur";
    default:
      return "mineur";
  }
}
function criterionForAxe(ruleId, tags) {
  return AXE_RGAA[ruleId] ?? criterionFromRgaaTags(tags) ?? FALLBACK_CRITERION;
}

// src/crawl.ts
function parseSitemapUrls(xml) {
  const out = [];
  const re = /<loc>\s*([^<]+?)\s*<\/loc>/gi;
  let m;
  while ((m = re.exec(xml)) !== null) out.push(m[1]);
  return out;
}
function extractLinks(html, baseUrl) {
  const origin = new URL(baseUrl).origin;
  const seen = /* @__PURE__ */ new Set();
  const out = [];
  const re = /<a\b[^>]*\bhref\s*=\s*["']([^"']+)["']/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const href = m[1].trim();
    if (!href || href.startsWith("#")) continue;
    let abs;
    try {
      abs = new URL(href, baseUrl);
    } catch {
      continue;
    }
    if (abs.protocol !== "http:" && abs.protocol !== "https:") continue;
    if (abs.origin !== origin) continue;
    abs.hash = "";
    const url = abs.href;
    if (seen.has(url)) continue;
    seen.add(url);
    out.push(url);
  }
  return out;
}
async function crawlUrls(start, opts) {
  const depth = opts.depth ?? 1;
  const max = opts.max ?? 50;
  const order = [];
  const seen = /* @__PURE__ */ new Set([start]);
  const queue = [{ url: start, d: 0 }];
  while (queue.length > 0 && order.length < max) {
    const { url, d } = queue.shift();
    order.push(url);
    if (d >= depth) continue;
    let html = "";
    try {
      html = await opts.fetchHtml(url);
    } catch {
      continue;
    }
    for (const link of extractLinks(html, url)) {
      if (seen.has(link)) continue;
      seen.add(link);
      queue.push({ url: link, d: d + 1 });
    }
  }
  return order;
}

// src/scan.ts
var IMAGE_TAG = "ultra11y-dyn:1";
var MOUNT = "/work/input.html";
var RUNNER = `import { chromium } from "playwright";
import axe from "axe-core";
const target = process.argv[2];
const isFile = target.startsWith("/work/");
const browser = await chromium.launch({ args: ["--no-sandbox", "--disable-dev-shm-usage"] });
try {
  const page = await browser.newPage();
  await page.goto(isFile ? "file://" + target : target, { waitUntil: "load", timeout: 45000 });
  await page.addScriptTag({ content: axe.source });
  const axeRes = await page.evaluate(async () => await window.axe.run(document, { resultTypes: ["violations"] }));
  await page.setViewportSize({ width: 320, height: 800 });
  const reflow = await page.evaluate(() => {
    const el = document.scrollingElement || document.documentElement;
    return { horizontalScroll: el.scrollWidth > el.clientWidth + 2 };
  });
  const violations = axeRes.violations.map((v) => ({
    id: v.id, impact: v.impact, help: v.help, tags: v.tags,
    nodes: v.nodes.slice(0, 10).map((n) => ({ target: n.target, html: (n.html || "").slice(0, 200) })),
  }));
  console.log(JSON.stringify({ url: target, violations, reflow }));
} finally {
  await browser.close();
}
`;
var PKG = JSON.stringify(
  { name: "ultra11y-dynamic", private: true, type: "module", dependencies: { playwright: "^1.49.0", "axe-core": "^4.10.0" } },
  null,
  2
);
var DOCKERFILE = `FROM node:22-bookworm-slim
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev && npx playwright install --with-deps chromium
COPY runner.mjs ./
WORKDIR /work
ENTRYPOINT ["node", "/app/runner.mjs"]
`;
function dockerAvailable() {
  try {
    execFileSync3("docker", ["info"], { stdio: "ignore", timeout: 1e4 });
    return true;
  } catch {
    return false;
  }
}
function imageExists(tag) {
  try {
    execFileSync3("docker", ["image", "inspect", tag], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}
var CTX_PREFIX = "ultra11y-dyn-";
function buildImage(tag = IMAGE_TAG) {
  const ctx = mkdtempSync(join7(tmpdir(), CTX_PREFIX));
  try {
    writeFileSync4(join7(ctx, "runner.mjs"), RUNNER);
    writeFileSync4(join7(ctx, "package.json"), PKG);
    writeFileSync4(join7(ctx, "Dockerfile"), DOCKERFILE);
    execFileSync3("docker", ["build", "-t", tag, ctx], { stdio: "inherit", timeout: 9e5 });
  } finally {
    rmSync(ctx, { recursive: true, force: true });
  }
}
function cleanTempContexts() {
  let removed = 0;
  const dir = tmpdir();
  for (const name of readdirSync2(dir)) {
    if (!name.startsWith(CTX_PREFIX)) continue;
    rmSync(join7(dir, name), { recursive: true, force: true });
    removed++;
  }
  return removed;
}
function cleanDynamic(tag = IMAGE_TAG) {
  let imageRemoved = false;
  if (dockerAvailable() && imageExists(tag)) {
    try {
      execFileSync3("docker", ["rmi", "-f", tag], { stdio: "ignore" });
      imageRemoved = true;
    } catch {
    }
  }
  return { imageRemoved, tempContextsRemoved: cleanTempContexts() };
}
function runRunner(target, isFile, tag) {
  const args = ["run", "--rm"];
  if (isFile) args.push("-v", `${resolve(target)}:${MOUNT}:ro`);
  args.push(tag, isFile ? MOUNT : target);
  const stdout = execFileSync3("docker", args, { encoding: "utf8", timeout: 24e4, maxBuffer: 32 * 1024 * 1024, stdio: ["ignore", "pipe", "ignore"] });
  const line = stdout.trim().split("\n").filter(Boolean).pop() ?? "{}";
  return JSON.parse(line);
}
function toDynamicResult(out, target) {
  const page = out.url || target;
  const findings = [];
  for (const v of out.violations) {
    const criteriaId = criterionForAxe(v.id, v.tags);
    const severity = severityFromImpact(v.impact);
    for (const n of v.nodes.length ? v.nodes : [{ target: [], html: "" }]) {
      findings.push({
        criteriaId,
        axeRule: v.id,
        impact: v.impact ?? "minor",
        severity,
        message: `${v.help} (axe: ${v.id})`,
        selector: n.target.join(" ") || "\u2014",
        snippet: n.html,
        engine: "axe",
        page
      });
    }
  }
  if (out.reflow?.horizontalScroll) {
    findings.push({
      criteriaId: "10.11",
      axeRule: "reflow",
      impact: "serious",
      severity: "majeur",
      message: "D\xE9filement horizontal \xE0 320px de large \u2014 le contenu ne se redistribue pas (reflow).",
      selector: "document",
      snippet: "",
      engine: "reflow",
      page
    });
  }
  return { tool: "ultra11y", engine: "axe-core@playwright (docker)", target, date: today(), findings };
}
function runScan(opts) {
  const isUrl = /^https?:\/\//i.test(opts.target);
  if (!isUrl && !existsSync3(opts.target)) {
    throw new Error(`Fichier introuvable : ${opts.target}. Donnez une URL http(s):// ou un fichier HTML existant.`);
  }
  if (!dockerAvailable()) {
    throw new Error("Docker n'est pas disponible. D\xE9marrez Docker puis relancez `scan --docker`.");
  }
  const tag = opts.tag ?? IMAGE_TAG;
  if (!imageExists(tag)) buildImage(tag);
  const isFile = !isUrl && existsSync3(opts.target) && statSync2(opts.target).isFile();
  const out = runRunner(opts.target, isFile, tag);
  return toDynamicResult(out, opts.target);
}
async function fetchHtml(url) {
  try {
    const res = await fetch(url, { redirect: "follow" });
    if (!res.ok) return "";
    return await res.text();
  } catch {
    return "";
  }
}
async function discoverUrls(opts) {
  const max = opts.max ?? 50;
  if (opts.sitemap) {
    return parseSitemapUrls(await fetchHtml(opts.sitemap)).slice(0, max);
  }
  if (opts.crawl) {
    return crawlUrls(opts.crawl, { fetchHtml, depth: opts.depth ?? 2, max });
  }
  return [];
}
function runScanMany(urls, tag = IMAGE_TAG) {
  if (!dockerAvailable()) {
    throw new Error("Docker n'est pas disponible. D\xE9marrez Docker puis relancez `scan`.");
  }
  if (!imageExists(tag)) buildImage(tag);
  const findings = [];
  for (const url of urls) {
    const out = runRunner(url, false, tag);
    findings.push(...toDynamicResult(out, url).findings);
  }
  return { tool: "ultra11y", engine: "axe-core@playwright (docker)", target: `${urls.length} page(s)`, date: today(), findings };
}
async function runCrawlScan(opts) {
  const urls = await discoverUrls(opts);
  if (urls.length === 0) {
    throw new Error("Aucune URL \xE0 scanner (sitemap vide/inaccessible, ou page d'entr\xE9e sans lien same-origin).");
  }
  return runScanMany(urls, opts.tag ?? IMAGE_TAG);
}
var sevRank = { bloquant: 3, majeur: 2, mineur: 1 };
function mergeDynamic(audit, dynamic) {
  const merged = JSON.parse(JSON.stringify(audit));
  const byId2 = new Map(merged.criteria.map((c) => [c.id, c]));
  for (const df of dynamic.findings) {
    const c = byId2.get(df.criteriaId);
    if (!c) continue;
    const finding = {
      ruleId: df.engine === "reflow" ? "dyn-reflow" : `axe:${df.axeRule}`,
      criteriaId: df.criteriaId,
      file: df.page ?? dynamic.target,
      line: 0,
      col: 0,
      selectorHint: df.selector,
      severity: df.severity,
      message: df.message,
      remediation: "V\xE9rifi\xE9 au rendu par axe-core ; corrigez l'\xE9l\xE9ment cit\xE9.",
      snippet: df.snippet
    };
    c.findings.push(finding);
    c.status = "NC";
    delete c.justification;
    merged.findings.push(finding);
  }
  const nowNc = new Set(dynamic.findings.map((d) => d.criteriaId));
  merged.residualRisks = merged.residualRisks.filter((r) => !nowNc.has(r.criteriaId));
  merged.themes = allThemes().map((t2) => {
    const inTheme = merged.criteria.filter((c) => c.theme === t2.number);
    return {
      number: t2.number,
      title: t2.name,
      c: inTheme.filter((c) => c.status === "C").length,
      nc: inTheme.filter((c) => c.status === "NC").length,
      na: inTheme.filter((c) => c.status === "NA").length,
      manual: inTheme.filter((c) => c.status === "manual").length
    };
  });
  const decided = merged.criteria.filter((c) => c.status === "C" || c.status === "NC");
  const conform = decided.filter((c) => c.status === "C").length;
  merged.conformancePct = decided.length === 0 ? 100 : Math.round(conform / decided.length * 100);
  merged.findings.sort((a, b) => sevRank[b.severity] - sevRank[a.severity]);
  return merged;
}

// src/fix.ts
import { writeFileSync as writeFileSync5 } from "fs";

// src/fix/edits.ts
function openTag(source, start) {
  if (source[start] !== "<") return null;
  let i = start + 1;
  let name = "";
  while (i < source.length && /[A-Za-z0-9:_-]/.test(source[i])) {
    name += source[i];
    i++;
  }
  if (!name) return null;
  let quote = null;
  for (; i < source.length; i++) {
    const ch = source[i];
    if (quote) {
      if (ch === quote) quote = null;
    } else if (ch === '"' || ch === "'") {
      quote = ch;
    } else if (ch === ">") {
      return { tagName: name.toLowerCase(), gt: i, selfClose: source[i - 1] === "/" };
    }
  }
  return null;
}
function findAttr(source, start, gt, name) {
  const seg = source.slice(start, gt);
  const re = new RegExp(`(\\s+)(${name})(?![A-Za-z0-9_:-])(\\s*=\\s*("[^"]*"|'[^']*'|[^\\s>]+))?`, "i");
  const m = re.exec(seg);
  if (!m) return null;
  const attrStart = start + m.index;
  const attrEnd = attrStart + m[0].length;
  let value = null;
  if (m[4]) {
    const raw = m[4];
    value = raw.startsWith('"') || raw.startsWith("'") ? raw.slice(1, -1) : raw;
  }
  return { attrStart, attrEnd, value };
}
function getAttr(source, start, name) {
  const ot = openTag(source, start);
  if (!ot) return null;
  return findAttr(source, start, ot.gt, name)?.value ?? null;
}
function setAttr(source, start, name, value) {
  const ot = openTag(source, start);
  if (!ot) return null;
  const existing = findAttr(source, start, ot.gt, name);
  if (existing) return { start: existing.attrStart, end: existing.attrEnd, replacement: ` ${name}="${value}"` };
  const insertAt = ot.selfClose ? ot.gt - 1 : ot.gt;
  return { start: insertAt, end: insertAt, replacement: ` ${name}="${value}"` };
}
function removeAttr(source, start, name) {
  const ot = openTag(source, start);
  if (!ot) return null;
  const span = findAttr(source, start, ot.gt, name);
  if (!span) return null;
  return { start: span.attrStart, end: span.attrEnd, replacement: "" };
}
function applyEdits(source, edits) {
  const sorted = [...edits].sort((a, b) => b.start - a.start || b.end - a.end);
  let out = source;
  let lastStart = Infinity;
  const insertedAt = /* @__PURE__ */ new Set();
  let applied = 0;
  let conflicts = 0;
  for (const e of sorted) {
    const isInsertion = e.start === e.end;
    if (e.end > lastStart || isInsertion && insertedAt.has(e.start)) {
      conflicts++;
      continue;
    }
    out = out.slice(0, e.start) + e.replacement + out.slice(e.end);
    lastStart = e.start;
    if (isInsertion) insertedAt.add(e.start);
    applied++;
  }
  return { output: out, applied, conflicts };
}

// src/fix/codemods.ts
var PLACEHOLDER = "TODO";
var LANG_PLACEHOLDER = "und";
var one = (fn) => (s, start) => {
  const e = fn(s, start);
  return e ? [e] : [];
};
function viewportFix(source, start) {
  const content = getAttr(source, start, "content");
  if (content === null) return [];
  const kept = content.split(/[,;]/).map((p) => p.trim()).filter(Boolean).filter((p) => {
    const [k, v] = p.split("=").map((x) => x.trim().toLowerCase());
    if (k === "user-scalable") return false;
    if (k === "maximum-scale") return Number(v) >= 2;
    return true;
  });
  const e = setAttr(source, start, "content", kept.join(", "));
  return e ? [e] : [];
}
function altFix(source, start) {
  const tag = openTag(source, start)?.tagName;
  const name = tag === "img" || tag === "area" ? "alt" : "aria-label";
  const e = setAttr(source, start, name, PLACEHOLDER);
  return e ? [e] : [];
}
var CODEMODS = {
  // auto
  "positive-tabindex": { fixability: "auto", build: one((s, st) => setAttr(s, st, "tabindex", "0")) },
  "redundant-aria": { fixability: "auto", jsxSafe: true, build: one((s, st) => removeAttr(s, st, "role")) },
  "meta-viewport-zoom-block": { fixability: "auto", build: viewportFix },
  // placeholder (inserts a valid attribute; alt/lang/title/aria-label are valid React DOM props)
  "iframe-title-missing": { fixability: "placeholder", jsxSafe: true, build: one((s, st) => setAttr(s, st, "title", PLACEHOLDER)) },
  "html-lang-missing": { fixability: "placeholder", jsxSafe: true, build: one((s, st) => setAttr(s, st, "lang", LANG_PLACEHOLDER)) },
  "img-alt-missing": { fixability: "placeholder", jsxSafe: true, build: altFix },
  "control-label-missing": { fixability: "placeholder", jsxSafe: true, build: one((s, st) => setAttr(s, st, "aria-label", PLACEHOLDER)) }
};
function fixabilityOf(ruleId) {
  return CODEMODS[ruleId]?.fixability ?? "proposal";
}

// src/fix/diff.ts
function unifiedDiff(file, before, after, ctx = 2) {
  if (before === after) return "";
  const a = before.split("\n");
  const b = after.split("\n");
  const header2 = `--- a/${file}
+++ b/${file}`;
  if (a.length > 4e3 || b.length > 4e3) return `${header2}
@@ diff omitted (large file): ${a.length} \u2192 ${b.length} lines @@`;
  const n = a.length;
  const m = b.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i2 = n - 1; i2 >= 0; i2--) {
    for (let j2 = m - 1; j2 >= 0; j2--) {
      dp[i2][j2] = a[i2] === b[j2] ? dp[i2 + 1][j2 + 1] + 1 : Math.max(dp[i2 + 1][j2], dp[i2][j2 + 1]);
    }
  }
  const ops = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      ops.push({ t: " ", line: a[i] });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      ops.push({ t: "-", line: a[i] });
      i++;
    } else {
      ops.push({ t: "+", line: b[j] });
      j++;
    }
  }
  while (i < n) ops.push({ t: "-", line: a[i++] });
  while (j < m) ops.push({ t: "+", line: b[j++] });
  const show = new Array(ops.length).fill(false);
  for (let k2 = 0; k2 < ops.length; k2++) {
    if (ops[k2].t !== " ") {
      for (let d = -ctx; d <= ctx; d++) if (k2 + d >= 0 && k2 + d < ops.length) show[k2 + d] = true;
    }
  }
  const out = [header2];
  let k = 0;
  while (k < ops.length) {
    if (!show[k]) {
      k++;
      continue;
    }
    let e = k;
    while (e < ops.length && show[e]) e++;
    out.push(`@@ ${k + 1},${e - k} @@`);
    for (let x = k; x < e; x++) out.push(`${ops[x].t}${ops[x].line}`);
    k = e;
  }
  return out.join("\n");
}

// src/fix.ts
function itemOf(f) {
  return { ruleId: f.ruleId, criteriaId: f.criteriaId, line: f.line, selectorHint: f.selectorHint, fixability: fixabilityOf(f.ruleId) };
}
function fixOne(file, source, opts) {
  const doc = parseSource(source, file, { forceJsx: opts.forceJsx });
  const findings = runRules(doc);
  const items = findings.map(itemOf);
  const edits = [];
  const isJsxAst = doc.kind === "jsx-ast";
  if (!doc.lossy) {
    for (const f of findings) {
      if (opts.only && !opts.only.includes(f.ruleId)) continue;
      const cm = CODEMODS[f.ruleId];
      if (!cm?.build || f.sourceStart === void 0) continue;
      if (isJsxAst && !cm.jsxSafe) continue;
      edits.push(...cm.build(source, f.sourceStart));
    }
  } else if (opts.write && findings.some((f) => CODEMODS[f.ruleId]?.build)) {
    opts.onWarn?.(`ultra11y fix: ${file} is JSX/TSX (lossy parse fallback) \u2014 fixes are proposal-only here; edit the source by hand.`);
  }
  let diff = "";
  let applied = 0;
  let written = false;
  let regression = false;
  if (edits.length) {
    const { output, applied: n } = applyEdits(source, edits);
    applied = n;
    diff = unifiedDiff(file, source, output);
    const after = runRules(parseSource(output, file, { forceJsx: opts.forceJsx }));
    const beforeKinds = new Set(findings.map((f) => f.ruleId));
    regression = after.length > findings.length || after.some((f) => !beforeKinds.has(f.ruleId));
    if (opts.write && !regression && file !== "<stdin>") {
      writeFileSync5(file, output);
      written = true;
    }
    if (regression) opts.onWarn?.(`ultra11y fix: ${file} not written \u2014 fix would introduce a new non-conformity (regression gate).`);
  }
  return { file, lossy: doc.lossy, items, diff, applied, written, regression };
}
function runFix(opts) {
  const { files } = discover(opts.inputs, {
    include: opts.include,
    exclude: opts.exclude,
    ext: opts.ext,
    changed: opts.changed,
    since: opts.since,
    onWarn: opts.onWarn
  });
  const out = [];
  for (const file of files) {
    let src;
    try {
      src = readText(file);
    } catch {
      continue;
    }
    out.push(fixOne(file, src, opts));
  }
  if (opts.inputs.includes("-") && opts.stdin !== void 0) {
    out.push(fixOne("<stdin>", opts.stdin, { ...opts, write: false }));
  }
  const totals = { auto: 0, placeholder: 0, proposal: 0, filesWritten: 0, regressions: 0 };
  for (const ff of out) {
    for (const it of ff.items) totals[it.fixability]++;
    if (ff.written) totals.filesWritten++;
    if (ff.regression) totals.regressions++;
  }
  return { files: out, totals };
}
var FIX_LABEL = {
  auto: { fr: "auto", en: "auto" },
  placeholder: { fr: "\xE0 compl\xE9ter", en: "fill-in" },
  proposal: { fr: "jugement", en: "judgment" }
};
function fixSummary(r, lang = "fr", write = false) {
  const out = [];
  const t2 = r.totals;
  const head = lang === "fr" ? `${write ? "Corrections appliqu\xE9es" : "Corrections propos\xE9es (dry-run)"} : ${t2.auto} auto, ${t2.placeholder} \xE0 compl\xE9ter, ${t2.proposal} jugement \xB7 ${t2.filesWritten} fichier(s) \xE9crit(s)${t2.regressions ? `, ${t2.regressions} bloqu\xE9(s) par le garde anti-r\xE9gression` : ""}.` : `${write ? "Fixes applied" : "Proposed fixes (dry-run)"}: ${t2.auto} auto, ${t2.placeholder} fill-in, ${t2.proposal} judgment \xB7 ${t2.filesWritten} file(s) written${t2.regressions ? `, ${t2.regressions} blocked by the regression gate` : ""}.`;
  out.push(head, "");
  for (const ff of r.files) {
    const fixable = ff.items.filter((i) => i.fixability !== "proposal");
    if (!fixable.length && !ff.items.length) continue;
    out.push(`### ${ff.file}${ff.lossy ? " (JSX/TSX \u2014 " + (lang === "fr" ? "proposition seule" : "proposal-only") + ")" : ""}`);
    for (const it of ff.items)
      out.push(`- [${FIX_LABEL[it.fixability][lang]}] ${it.ruleId} (RGAA ${it.criteriaId}) \u2014 \`${it.selectorHint}\` @ ${ff.file}:${it.line}`);
    if (ff.diff) out.push("", "```diff", ff.diff, "```");
    if (ff.regression) out.push(`> \u26A0\uFE0F ${lang === "fr" ? "non \xE9crit : r\xE9gression d\xE9tect\xE9e" : "not written: regression detected"}`);
    out.push("");
  }
  return out.join("\n");
}

// src/baseline.ts
var RANK = { bloquant: 0, majeur: 1, mineur: 2 };
function findingId(f) {
  const pos = f.sourceStart !== void 0 ? `b${f.sourceStart}-${f.sourceEnd}` : `l${f.line}:${f.col}:${f.selectorHint}`;
  return `${f.ruleId}|${f.criteriaId}|${f.file}|${pos}`;
}
function parseFailOn(v) {
  return v === "majeur" || v === "mineur" ? v : "bloquant";
}
function findingsAtOrAbove(findings, failOn) {
  return findings.filter((f) => RANK[f.severity] <= RANK[failOn]);
}
function diffAgainstBaseline(current, baseline, failOn = "bloquant") {
  const baseIds = new Set((baseline?.findings ?? []).map(findingId));
  const curIds = new Set(current.findings.map(findingId));
  const newFindings = current.findings.filter((f) => !baseIds.has(findingId(f)));
  const auditedFiles = new Set(current.findings.map((f) => f.file));
  const fixedFindings = (baseline?.findings ?? []).filter((f) => auditedFiles.has(f.file) && !curIds.has(findingId(f)));
  const ok = !newFindings.some((f) => RANK[f.severity] <= RANK[failOn]);
  return { newFindings, fixedFindings, ok, failOn };
}
function baselineSummary(diff, lang = "fr") {
  const out = [];
  const blocking = diff.newFindings.filter((f) => RANK[f.severity] <= RANK[diff.failOn]);
  if (diff.ok) {
    out.push(
      lang === "fr" ? `\u2713 Aucune nouvelle non-conformit\xE9 \u2265 ${diff.failOn} (${diff.newFindings.length} nouvelle(s) au total, ${diff.fixedFindings.length} corrig\xE9e(s)).` : `\u2713 No new non-conformity \u2265 ${diff.failOn} (${diff.newFindings.length} new total, ${diff.fixedFindings.length} fixed).`
    );
  } else {
    out.push(
      lang === "fr" ? `\u2717 ${blocking.length} nouvelle(s) non-conformit\xE9(s) \u2265 ${diff.failOn} introduite(s) :` : `\u2717 ${blocking.length} new non-conformity(ies) \u2265 ${diff.failOn} introduced:`
    );
    for (const f of blocking) out.push(`  [${f.severity}] ${f.ruleId} (RGAA ${f.criteriaId}) \u2014 ${f.file}:${f.line} (${f.selectorHint})`);
  }
  return out.join("\n");
}

// src/init.ts
import { writeFileSync as writeFileSync6, mkdirSync as mkdirSync4, chmodSync } from "fs";
import { execFileSync as execFileSync4 } from "child_process";
import { join as join8 } from "path";
function repoRoot() {
  try {
    return execFileSync4("git", ["rev-parse", "--show-toplevel"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return null;
  }
}
function hookScript(enginePath, failOn) {
  return `#!/bin/sh
# ultra11y accessibility regression gate \u2014 generated by \`ultra11y init --hook\`.
# Blocks a commit only on NEW non-conformities >= ${failOn} in staged changes
# (vs audits/baseline.json). Bypass once with: SKIP_A11Y=1 git commit ...
[ -n "$SKIP_A11Y" ] && exit 0
ULTRA11Y=\${ULTRA11Y:-'${enginePath}'}
command -v node >/dev/null 2>&1 || { echo "ultra11y: node not found \u2014 skipping a11y gate." >&2; exit 0; }
if ! node "$ULTRA11Y" audit --changed --baseline audits/baseline.json --fail-on ${failOn}; then
  echo "ultra11y: new accessibility regression in staged changes (>= ${failOn})." >&2
  echo "  Fix it, run: node \\"$ULTRA11Y\\" fix --changed --write" >&2
  echo "  or bypass once with: SKIP_A11Y=1 git commit ..." >&2
  exit 1
fi
exit 0
`;
}
function ciWorkflow(enginePath, failOn) {
  return `name: a11y
# Generated by \`ultra11y init --ci\`. Fails only on NEW non-conformities >= ${failOn}
# introduced by the PR (vs audits/baseline.json) \u2014 not the existing backlog.
on:
  pull_request:
jobs:
  ultra11y:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: ultra11y accessibility regression gate
        run: node "${enginePath}" audit --since "origin/\${{ github.base_ref }}" --baseline audits/baseline.json --fail-on ${failOn}
`;
}
function writeHook(root, enginePath, failOn) {
  const dir = join8(root, ".git", "hooks");
  mkdirSync4(dir, { recursive: true });
  const path = join8(dir, "pre-commit");
  writeFileSync6(path, hookScript(enginePath, failOn));
  chmodSync(path, 493);
  return path;
}
function writeCi(root, enginePath, failOn) {
  const dir = join8(root, ".github", "workflows");
  mkdirSync4(dir, { recursive: true });
  const path = join8(dir, "a11y.yml");
  writeFileSync6(path, ciWorkflow(enginePath, failOn));
  return path;
}

// src/output.ts
var STR = {
  fr: {
    summaryTitle: "Audit RGAA 4.1.2 (moteur statique ultra11y)",
    files: "fichiers analys\xE9s",
    autoConformance: "conformit\xE9 automatique (sous-ensemble statique)",
    theme: "Th\xE9matique",
    findingsTitle: "Non-conformit\xE9s d\xE9tect\xE9es",
    noFindings: "Aucune non-conformit\xE9 d\xE9tect\xE9e par le moteur statique.",
    residualTitle: "\xC0 \xE9valuer manuellement (jugement / rendu)",
    manualNote: "crit\xE8res non d\xE9cidables par le moteur \u2014 \xE0 compl\xE9ter par une revue humaine.",
    renderedNote: "fichier(s) rendent des composants de biblioth\xE8que non analys\xE9s en source \u2014 auditez le build (render) ou scan"
  },
  en: {
    summaryTitle: "RGAA 4.1.2 audit (ultra11y static engine)",
    files: "files analysed",
    autoConformance: "automatic conformance (static subset)",
    theme: "Theme",
    findingsTitle: "Non-conformities detected",
    noFindings: "No non-conformity detected by the static engine.",
    residualTitle: "To assess manually (judgment / rendering)",
    manualNote: "criteria the engine cannot decide \u2014 complete with a human review.",
    renderedNote: "file(s) render component-library output not analysed from source \u2014 audit the build (render) or scan"
  }
};
function t(lang, key) {
  return STR[lang][key];
}
var ICON3 = { bloquant: "\u{1F534}", majeur: "\u{1F7E0}", mineur: "\u{1F7E1}" };
function auditSummary(r, lang) {
  const lines = [];
  lines.push(`${t(lang, "summaryTitle")} \u2014 ${r.date}`);
  lines.push(`${r.scope.files} ${t(lang, "files")} \xB7 ${r.conformancePct}% ${t(lang, "autoConformance")}`);
  lines.push("");
  lines.push(`${t(lang, "theme")}            C  NC  NA  \u23F3`);
  for (const th of r.themes) {
    const name = `${th.number}. ${th.title}`.padEnd(28).slice(0, 28);
    lines.push(`${name} ${String(th.c).padStart(2)}  ${String(th.nc).padStart(2)}  ${String(th.na).padStart(2)}  ${String(th.manual).padStart(2)}`);
  }
  lines.push("");
  if (r.findings.length === 0) {
    lines.push(t(lang, "noFindings"));
  } else {
    lines.push(`${t(lang, "findingsTitle")} (${r.findings.length}) :`);
    for (const f of r.findings.slice(0, 20)) {
      lines.push(`  ${ICON3[f.severity]} [${f.criteriaId}] ${f.file}:${f.line}  ${f.message}`);
    }
    if (r.findings.length > 20) lines.push(`  \u2026 (+${r.findings.length - 20})`);
  }
  lines.push("");
  lines.push(`${t(lang, "residualTitle")} : ${r.residualRisks.length} ${t(lang, "manualNote")}`);
  if (r.scope.rendered) lines.push(`\u{1F9E9} ${r.scope.rendered.files} ${t(lang, "renderedNote")} (${r.scope.rendered.opaqueLibraries.join(", ")}).`);
  return lines.join("\n");
}

// src/cli.ts
var HELP = `ultra11y v${VERSION}
Audit HTML/CSS/JSX for RGAA 4.1.2 + WCAG 2.1/2.2 AA accessibility and produce a
dated compliance report, or author/review accessible markup (native-HTML-first).
A deterministic, install-free static engine plus your judgment, with check/verify
gates against hallucinated non-conformities.

Usage:
  ultra11y audit    <globs\u2026 | -> [--out <dir>] [--include <glob>] [--exclude <glob>] [--ext <list>] [--jsx] [--graph] [--json] [--lang fr|en]
  ultra11y audit    [--changed | --since <ref>] [--max-files <n>] [--dedup exact|normalized|off] [--baseline <file>] [--fail-on bloquant|majeur|mineur]
  ultra11y report   --in <audit.json> [--out <dir>] [--standard rgaa|wcag] [--lang fr|en]
  ultra11y prd      --in <audit.json> [--out <dir>] [--split criterion] [--gh-issues] [--lang fr|en]
  ultra11y render   [<dir>] [--scaffold] [--out <file>] [--json] [--lang fr|en]
  ultra11y criteria [<id>] [--theme <N>] [--list] [--standard rgaa|wcag] [--json] [--lang fr|en]
  ultra11y check    --report <md> [--quiet] [--json]
  ultra11y verify   --report <md> [--semantic] [--apply <verdicts.json>] [--max-verify <n>] [--out <dir>] [--json]
  ultra11y fix      <globs\u2026 | -> [--write] [--iterate] [--changed | --since <ref>] [--include <glob>] [--exclude <glob>] [--ext <list>] [--only <ids>] [--jsx] [--json] [--lang fr|en]
  ultra11y init     [--hook] [--ci] [--baseline] [--fail-on bloquant|majeur|mineur]
  ultra11y scan     <url|file> [--merge <audit.json>] [--out <dir>] [--docker] [--json]
  ultra11y scan     --sitemap <url> | --crawl <url> [--depth <n>] [--max <n>] [--merge <audit.json>] [--json]
  ultra11y scan     --clean        (remove the dynamic-tier Docker image + temp contexts)

Commands:
  audit      Run the static engine over the inputs (files/globs, or '-' for stdin)
             and emit an AuditResult JSON (consumed by 'report'). Without --json,
             prints a French summary. The engine decides the machine-detectable
             criteria; you supply the judgment + needs-rendering ones.
  report     Render an AuditResult into a dated RGAA compliance report
             (audits/rgaa-YYYY-MM-DD.md): metadata, per-theme synthesis table,
             non-conformities by priority, conforming + not-applicable lists.
  prd        Turn an AuditResult into an actionable "fixes to do" backlog
             (audits/prd-YYYY-MM-DD.md), grouped by criterion and sectioned by
             priority; --split criterion writes one PRD file per criterion, and
             --gh-issues files one de-duplicated GitHub issue per criterion (gh CLI).
  render     Get RENDERED HTML to audit (so component libraries like DSFR are
             checked as the HTML they emit, not their JSX sources): detect the
             framework and print the build\u2192audit recipe, or --scaffold a
             react-dom/server SSR snapshot harness to fill in. Then audit the
             produced HTML, and use scan for the needs-rendering criteria.
  criteria   Look up the RGAA reference offline: one criterion, a whole theme,
             or the 13-theme list. Carries WCAG cross-refs + automatability class.
  check      Integrity gate on a produced report: every cited criterion resolves,
             every NA is justified, sections + conformance maths are well-formed.
  verify     Adversarial claim\u2194criterion worklist for the report's non-conformities,
             then (--apply) gate on refuted/unsupported findings.
  fix        Put the fixes in place (hybrid, native-first): apply deterministic
             codemods (tabindex, redundant role, viewport zoom), insert fill-in
             placeholders (alt/lang/title TODO) for the agent to complete, and list
             judgment-only proposals. --dry-run (default) prints a diff; --write
             applies, but only after a re-audit proves no new NC; on real-AST JSX
             only jsxSafe codemods apply (never name-rewriting). --iterate loops to a fixpoint.
  init       Wire ultra11y into the repo as a regression gate (zero-dep, no husky):
             a git pre-commit --hook (audit --changed, vs HEAD) and/or a GitHub
             Actions --ci job (audit --since the PR base ref), both gating against
             --baseline so only NEW blocking NCs fail; --baseline writes
             audits/baseline.json (the committed reference).
  scan       OPTIONAL dynamic tier: run axe-core in a headless browser (Docker) to
             decide the needs-rendering criteria the static engine can't \u2014 computed
             contrast (3.2/3.3), 320px reflow (10.11) \u2014 over a URL or HTML file.
             --merge folds the findings into a static AuditResult (manual \u2192 C/NC).
             --sitemap/--crawl scan many pages (every sitemap URL, or same-origin
             links BFS-crawled from a start URL) and aggregate the findings.

Options:
  --out <dir>        audit/report: output dir for AuditResult + report  (default: audits)
  --in <file>        report: the AuditResult JSON to render ('-' for stdin)
  --include <glob>   audit/fix: only include paths matching (comma-separated)
  --exclude <glob>   audit/fix: skip paths matching (comma-separated)
  --ext <list>       audit/fix: extra file extensions to walk (e.g. .twig,.erb);
                     .html/.htm/.xhtml/.jsx/.tsx/.vue/.svelte/.astro are built-in
  --jsx              audit/fix: force JSX/TSX parsing for inputs of any extension
  --graph            audit: also resolve imports + run cross-file rules (alias --cross-file)
  --cross-file       audit: alias of --graph
  --changed          audit/fix: only files changed vs HEAD (git; for hooks/CI)
  --since <ref>      audit/fix: only files changed vs the given git ref
  --max-files <n>    audit: cap canonical files audited (logged truncation, no silent drop)
  --dedup <mode>     audit: collapse identical files \u2014 exact|normalized|off  (default: exact)
  --standard <std>   report/criteria: key the output by rgaa|wcag  (default: rgaa)
  --split <mode>     prd: split the backlog \u2014 currently only 'criterion' (one file per criterion)
  --gh-issues        prd: also create one GitHub issue per criterion via the gh CLI (opt-in)
  --scaffold         render: write an SSR-snapshot harness (default: ultra11y-render.tsx)
  --write            fix: apply fixes to disk (default is a dry-run diff)
  --iterate          fix: with --write, re-audit + re-apply mechanical fixes until stable (bounded)
  --dry-run          fix: preview only \u2014 never write (this is the default)
  --only <ids>       fix: limit auto-fixes to these rule ids (comma-separated)
  --baseline <file>  audit/init: regression-gate vs / write this baseline AuditResult
  --fail-on <sev>    audit/init: gate severity \u2014 bloquant|majeur|mineur  (default: bloquant)
  --hook             init: write a git pre-commit accessibility gate
  --ci               init: write a GitHub Actions accessibility gate
  --report <file>    check/verify: the report markdown to gate
  --theme <N>        criteria: list the criteria of theme N (1..13)
  --list             criteria: print the 13-theme table
  --apply <file>     verify: reduce a filled verdicts file to a pass/fail gate
  --max-verify <n>   verify: cap the worklist size                       (default: 40)
  --merge <file>     scan: fold dynamic findings into this AuditResult JSON
  --sitemap <url>    scan: scan every URL listed in a sitemap.xml
  --crawl <url>      scan: BFS same-origin links from a start URL (served HTML)
  --depth <n>        scan: crawl link-hop depth from the start URL          (default: 2)
  --max <n>          scan: cap on pages scanned (sitemap/crawl)             (default: 50)
  --docker           scan: run the dynamic tier in Docker (default; built on first use)
  --clean            scan: remove the dynamic-tier image + temp contexts, then exit
  --semantic         verify: fold the support-check into one pass
  --lang fr|en       output language                                     (default: fr)
  --json             machine-readable output
  --quiet            check: exit code only, no output
  -h, --help         show this help
  -v, --version      print version

Data: RGAA 4.1.2 \xA9 DINUM, Licence Ouverte / Etalab 2.0 (see NOTICE).`;
var COMMANDS = ["audit", "report", "prd", "render", "criteria", "check", "verify", "scan", "fix", "init"];
function isCommand(s) {
  return !!s && COMMANDS.includes(s);
}
var VALUE_FLAGS = /* @__PURE__ */ new Set([
  "out",
  "in",
  "include",
  "exclude",
  "ext",
  "report",
  "theme",
  "apply",
  "max-verify",
  "lang",
  "merge",
  "sitemap",
  "crawl",
  "depth",
  "max",
  "since",
  "max-files",
  "dedup",
  "only",
  "standard",
  "baseline",
  "fail-on",
  "split"
]);
var INIT_VALUE_FLAGS = new Set([...VALUE_FLAGS].filter((f) => f !== "baseline"));
function valueFlagsFor(command) {
  return command === "init" ? INIT_VALUE_FLAGS : VALUE_FLAGS;
}
function parseArgs(argv) {
  const [command, ...rest] = argv;
  const valueFlags = valueFlagsFor(command ?? "");
  const positionals = [];
  const flags = {};
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      if (valueFlags.has(key)) flags[key] = rest[++i] ?? "";
      else flags[key] = true;
    } else if (a.startsWith("-") && a !== "-") {
      flags[a.slice(1)] = true;
    } else {
      positionals.push(a);
    }
  }
  return { command: command ?? "", positionals, flags };
}
function langOf(flags) {
  return flags.lang === "en" ? "en" : "fr";
}
function asList(v) {
  return typeof v === "string" && v ? [v] : void 0;
}
async function cmdAudit(p) {
  const inputs = p.positionals.length ? p.positionals : ["."];
  if (inputs.length === 0) {
    console.error("ultra11y audit: provide files/globs, or '-' to read stdin.");
    return 2;
  }
  const stdin = inputs.includes("-") ? await readStdin() : void 0;
  const since = typeof p.flags.since === "string" ? p.flags.since : void 0;
  const dedupFlag = p.flags.dedup;
  const result = runAudit({
    inputs,
    stdin,
    forceJsx: p.flags.jsx === true,
    include: asList(p.flags.include),
    exclude: asList(p.flags.exclude),
    ext: asList(p.flags.ext),
    changed: p.flags.changed === true || since !== void 0,
    since,
    dedup: dedupFlag === "normalized" || dedupFlag === "off" ? dedupFlag : void 0,
    maxFiles: typeof p.flags["max-files"] === "string" ? Number(p.flags["max-files"]) : void 0,
    graph: p.flags.graph === true || p.flags["cross-file"] === true,
    onWarn: (m) => console.error(m)
  });
  const out = typeof p.flags.out === "string" ? p.flags.out : "audits";
  try {
    mkdirSync5(out, { recursive: true });
    writeFileSync7(join9(out, "audit-latest.json"), JSON.stringify(result, null, 2) + "\n");
  } catch {
  }
  const baselineFlag = p.flags.baseline;
  if (typeof baselineFlag === "string" && baselineFlag) {
    let baseline = null;
    if (existsSync4(baselineFlag)) {
      try {
        baseline = JSON.parse(readText(baselineFlag));
      } catch {
        console.error(`ultra11y audit: --baseline ${baselineFlag} is not valid JSON; treating as empty.`);
      }
    }
    const diff = diffAgainstBaseline(result, baseline, parseFailOn(p.flags["fail-on"]));
    if (p.flags.json) console.log(JSON.stringify(diff, null, 2));
    else console.log(baselineSummary(diff, langOf(p.flags)));
    return diff.ok ? 0 : 1;
  }
  if (p.flags["fail-on"] !== void 0) {
    const failOn = parseFailOn(p.flags["fail-on"]);
    const failing = findingsAtOrAbove(result.findings, failOn);
    if (p.flags.json) console.log(JSON.stringify(result, null, 2));
    else {
      console.log(auditSummary(result, langOf(p.flags)));
      if (failing.length)
        console.error(langOf(p.flags) === "fr" ? `\u2717 ${failing.length} non-conformit\xE9(s) \u2265 ${failOn}.` : `\u2717 ${failing.length} non-conformity(ies) \u2265 ${failOn}.`);
    }
    return failing.length ? 1 : 0;
  }
  if (p.flags.json) console.log(JSON.stringify(result, null, 2));
  else console.log(auditSummary(result, langOf(p.flags)));
  return 0;
}
function cmdInit(p) {
  const root = repoRoot() ?? process.cwd();
  let engineRel = process.argv[1] ?? "scripts/ultra11y.mjs";
  try {
    const abs = realpathSync(engineRel);
    engineRel = abs.startsWith(root + sep2) ? relative2(root, abs) : abs;
  } catch {
  }
  const failOn = parseFailOn(p.flags["fail-on"]);
  const want = { hook: p.flags.hook === true, ci: p.flags.ci === true, baseline: p.flags.baseline === true };
  if (!want.hook && !want.ci && !want.baseline) {
    want.hook = true;
    want.baseline = true;
  }
  const wrote = [];
  if (want.baseline) {
    const inputs = p.positionals.length ? p.positionals : ["."];
    const result = runAudit({ inputs, onWarn: (m) => console.error(m) });
    mkdirSync5(join9(root, "audits"), { recursive: true });
    const bp = join9(root, "audits", "baseline.json");
    writeFileSync7(bp, JSON.stringify(result, null, 2) + "\n");
    wrote.push(bp);
  }
  if (want.hook) wrote.push(writeHook(root, engineRel, failOn));
  if (want.ci) wrote.push(writeCi(root, engineRel, failOn));
  for (const w of wrote) console.log(`ultra11y init: wrote ${w}`);
  console.log(`ultra11y init: done. Commit audits/baseline.json so the gate has a reference.`);
  return 0;
}
function cmdCriteria(p) {
  const themeFlag = p.flags.theme;
  return runCriteria({
    id: p.positionals[0],
    theme: typeof themeFlag === "string" && themeFlag ? Number(themeFlag) : void 0,
    list: p.flags.list === true,
    json: p.flags.json === true,
    lang: langOf(p.flags),
    standard: parseStandard(p.flags.standard)
  });
}
async function cmdReport(p) {
  const inFlag = p.flags.in;
  if (typeof inFlag !== "string" || !inFlag) {
    console.error("ultra11y report: --in <audit.json> is required ('-' for stdin).");
    return 2;
  }
  const raw = inFlag === "-" ? await readStdin() : readText(inFlag);
  let result;
  try {
    result = JSON.parse(raw);
  } catch {
    console.error("ultra11y report: --in is not valid JSON (expected an AuditResult).");
    return 2;
  }
  if (result.tool !== "ultra11y" || !Array.isArray(result.criteria)) {
    console.error("ultra11y report: input is not an ultra11y AuditResult.");
    return 2;
  }
  const out = typeof p.flags.out === "string" ? p.flags.out : "audits";
  const path = writeReport(result, { out, lang: langOf(p.flags), standard: parseStandard(p.flags.standard) });
  console.log(path);
  return 0;
}
async function cmdPrd(p) {
  const inFlag = p.flags.in;
  if (typeof inFlag !== "string" || !inFlag) {
    console.error("ultra11y prd: --in <audit.json> is required ('-' for stdin).");
    return 2;
  }
  const raw = inFlag === "-" ? await readStdin() : readText(inFlag);
  let result;
  try {
    result = JSON.parse(raw);
  } catch {
    console.error("ultra11y prd: --in is not valid JSON (expected an AuditResult).");
    return 2;
  }
  if (result.tool !== "ultra11y" || !Array.isArray(result.criteria)) {
    console.error("ultra11y prd: input is not an ultra11y AuditResult.");
    return 2;
  }
  const out = typeof p.flags.out === "string" ? p.flags.out : "audits";
  const lang = langOf(p.flags);
  const split = p.flags.split === "criterion" ? "criterion" : void 0;
  const paths = writePrd(result, { out, lang, split });
  for (const path of paths) console.log(path);
  if (p.flags["gh-issues"] === true) {
    const units = prdUnits(result);
    if (!ghAvailable()) {
      console.error("ultra11y prd: --gh-issues skipped \u2014 `gh` is not installed or not authenticated (run `gh auth login`). Markdown was still written.");
    } else if (units.length === 0) {
      console.error("ultra11y prd: --gh-issues skipped \u2014 no findings to file.");
    } else {
      const r = pushIssues(units, lang);
      console.log(`ultra11y prd: GitHub issues \u2014 ${r.created} cr\xE9\xE9e(s), ${r.skipped} d\xE9j\xE0 existante(s)${r.failed ? `, ${r.failed} en \xE9chec` : ""}.`);
    }
  }
  return 0;
}
function cmdRender(p) {
  const root = p.positionals[0] ?? ".";
  const lang = langOf(p.flags);
  if (p.flags.scaffold === true) {
    const out = typeof p.flags.out === "string" && p.flags.out ? p.flags.out : "ultra11y-render.tsx";
    try {
      writeFileSync7(out, ssrHarness());
    } catch (e) {
      console.error(`ultra11y render: could not write ${out}: ${e instanceof Error ? e.message : String(e)}`);
      return 1;
    }
    console.log(
      lang === "fr" ? `Harnais SSR \xE9crit : ${out}
Compl\xE9tez COMPONENTS, ex\xE9cutez-le (ex. npx tsx ${out}), puis : node scripts/ultra11y.mjs audit "audits/rendered/**/*.html"` : `SSR harness written: ${out}
Fill in COMPONENTS, run it (e.g. npx tsx ${out}), then: node scripts/ultra11y.mjs audit "audits/rendered/**/*.html"`
    );
    return 0;
  }
  let deps = {};
  const pkgPath = join9(root, "package.json");
  if (existsSync4(pkgPath)) {
    try {
      const pkg = JSON.parse(readText(pkgPath));
      deps = { ...pkg.dependencies ?? {}, ...pkg.devDependencies ?? {} };
    } catch {
    }
  }
  const detection = detectFrameworks(deps, (f) => existsSync4(join9(root, f)));
  if (p.flags.json) console.log(JSON.stringify(detection, null, 2));
  else console.log(renderPlan(detection, lang));
  return 0;
}
function cmdCheck(p) {
  const rep = p.flags.report;
  if (typeof rep !== "string" || !rep) {
    console.error("ultra11y check: --report <md> is required.");
    return 2;
  }
  const res = checkReport(readText(rep));
  if (p.flags.json) {
    console.log(JSON.stringify(res, null, 2));
  } else if (!p.flags.quiet) {
    if (res.ok) console.log("\u2713 Rapport valide : sections, crit\xE8res cit\xE9s et justifications NA coh\xE9rents.");
    else for (const i of res.issues) console.error(`\u2717 ${i}`);
  }
  return res.ok ? 0 : 1;
}
function cmdVerify(p) {
  const apply = p.flags.apply;
  if (typeof apply === "string" && apply) {
    let raw;
    try {
      raw = readText(apply);
    } catch {
      console.error(`ultra11y verify: --apply file introuvable : ${apply}.`);
      return 2;
    }
    let items2;
    try {
      items2 = JSON.parse(raw);
    } catch {
      console.error("ultra11y verify: --apply file is not valid JSON.");
      return 2;
    }
    if (!Array.isArray(items2)) {
      console.error("ultra11y verify: --apply must be a JSON array of verdicts.");
      return 2;
    }
    const r = applyVerdicts(items2);
    if (p.flags.json) console.log(JSON.stringify(r, null, 2));
    else if (r.ok) console.log(`\u2713 ${r.total} non-conformit\xE9s v\xE9rifi\xE9es, toutes \xE9tay\xE9es.`);
    else
      console.error(
        `\u2717 ${r.failures.length}/${r.total} en \xE9chec (refuted ${r.refuted}, unsupported ${r.unsupported}, non statu\xE9 ${r.unadjudicated}${r.invalid ? `, invalide ${r.invalid}` : ""}).`
      );
    return r.ok ? 0 : 1;
  }
  const rep = p.flags.report;
  if (typeof rep !== "string" || !rep) {
    console.error("ultra11y verify: --report <md> is required (or --apply <verdicts.json>).");
    return 2;
  }
  let max = VERIFY_MAX;
  const mvFlag = p.flags["max-verify"];
  if (typeof mvFlag === "string" && mvFlag !== "") {
    const n = Number(mvFlag);
    if (!Number.isInteger(n) || n < 0) {
      console.error("ultra11y verify: --max-verify must be a non-negative integer.");
      return 2;
    }
    max = n;
  }
  const items = buildWorklist(readText(rep), max);
  const out = typeof p.flags.out === "string" ? p.flags.out : ".";
  const { todoPath, mdPath, count } = writeWorklist(items, out, p.flags.semantic === true);
  console.log(`${count} non-conformit\xE9(s) \xE0 v\xE9rifier \u2192 ${mdPath}, ${todoPath}`);
  return 0;
}
async function cmdFix(p) {
  const inputs = p.positionals.length ? p.positionals : ["."];
  const stdin = inputs.includes("-") ? await readStdin() : void 0;
  const since = typeof p.flags.since === "string" ? p.flags.since : void 0;
  const write = p.flags.write === true;
  const onlyFlag = p.flags.only;
  if (onlyFlag === "" || typeof onlyFlag === "string" && !onlyFlag.trim()) {
    console.error("ultra11y fix: --only requires one or more rule ids (comma-separated).");
    return 2;
  }
  const opts = {
    inputs,
    stdin,
    forceJsx: p.flags.jsx === true,
    include: asList(p.flags.include),
    exclude: asList(p.flags.exclude),
    ext: asList(p.flags.ext),
    changed: p.flags.changed === true || since !== void 0,
    since,
    only: typeof onlyFlag === "string" ? onlyFlag.split(",").map((s) => s.trim()).filter(Boolean) : void 0,
    write,
    onWarn: (m) => console.error(m)
  };
  const result = runFix(opts);
  let rounds = 1;
  let totalWritten = result.totals.filesWritten;
  if (write && p.flags.iterate === true) {
    const MAX_ROUNDS = 5;
    let last = result;
    while (last.totals.filesWritten > 0 && rounds < MAX_ROUNDS) {
      last = runFix(opts);
      rounds++;
      totalWritten += last.totals.filesWritten;
    }
  }
  if (p.flags.json) console.log(JSON.stringify(p.flags.iterate === true ? { ...result, rounds, totalWritten } : result, null, 2));
  else {
    console.log(fixSummary(result, langOf(p.flags), write));
    if (write && p.flags.iterate === true)
      console.log(
        langOf(p.flags) === "fr" ? `
It\xE9r\xE9 sur ${rounds} passe(s) jusqu'\xE0 stabilit\xE9 \u2014 ${totalWritten} fichier(s) \xE9crit(s) au total.` : `
Iterated over ${rounds} round(s) to a fixpoint \u2014 ${totalWritten} file(s) written in total.`
      );
  }
  return 0;
}
async function cmdScan(p) {
  if (p.flags.clean) {
    const r = cleanDynamic();
    console.log(`Nettoyage : image dynamique ${r.imageRemoved ? "supprim\xE9e" : "absente"}, ${r.tempContextsRemoved} contexte(s) temporaire(s) supprim\xE9(s).`);
    return 0;
  }
  const sitemap = typeof p.flags.sitemap === "string" ? p.flags.sitemap : void 0;
  const crawl = typeof p.flags.crawl === "string" ? p.flags.crawl : void 0;
  let dynamic;
  try {
    if (sitemap || crawl) {
      const depth = typeof p.flags.depth === "string" ? Number(p.flags.depth) : void 0;
      const max = typeof p.flags.max === "string" ? Number(p.flags.max) : void 0;
      dynamic = await runCrawlScan({ sitemap, crawl, depth, max });
    } else {
      const target = p.positionals.find((a) => a !== "-");
      if (!target) {
        console.error("ultra11y scan: provide a URL or HTML file, --sitemap <url>, --crawl <url>, or --clean.");
        return 2;
      }
      dynamic = runScan({ target });
    }
  } catch (e) {
    console.error(`ultra11y scan: ${e instanceof Error ? e.message : String(e)}`);
    return 1;
  }
  const out = typeof p.flags.out === "string" ? p.flags.out : "audits";
  const mergeIn = p.flags.merge;
  if (typeof mergeIn === "string" && mergeIn) {
    let audit;
    try {
      audit = JSON.parse(readText(mergeIn));
    } catch {
      console.error("ultra11y scan: --merge is not valid JSON (expected an AuditResult).");
      return 2;
    }
    if (audit.tool !== "ultra11y" || !Array.isArray(audit.criteria)) {
      console.error("ultra11y scan: --merge input is not an ultra11y AuditResult.");
      return 2;
    }
    const merged = mergeDynamic(audit, dynamic);
    mkdirSync5(out, { recursive: true });
    writeFileSync7(join9(out, "audit-latest.json"), JSON.stringify(merged, null, 2) + "\n");
    if (p.flags.json) console.log(JSON.stringify(merged, null, 2));
    else
      console.log(
        `Audit statique + dynamique fusionn\xE9 \u2192 ${join9(out, "audit-latest.json")} (${merged.conformancePct}% conformit\xE9, ${merged.findings.length} findings).`
      );
    return 0;
  }
  if (p.flags.json) console.log(JSON.stringify(dynamic, null, 2));
  else {
    console.log(`Audit dynamique (${dynamic.engine}) de ${dynamic.target} \u2014 ${dynamic.findings.length} non-conformit\xE9(s) :`);
    for (const f of dynamic.findings.slice(0, 30)) console.log(`  [${f.criteriaId}] ${f.selector} \u2014 ${f.message}`);
  }
  return 0;
}
async function main(argv) {
  const first = argv[0];
  if (!first || first === "-h" || first === "--help") {
    console.log(HELP);
    return 0;
  }
  if (first === "-v" || first === "--version") {
    console.log(VERSION);
    return 0;
  }
  if (!isCommand(first)) {
    console.error(`ultra11y: unknown command "${first}". Run \`ultra11y --help\`.`);
    return 2;
  }
  const p = parseArgs(argv);
  if (p.flags.help === true || p.flags.h === true) {
    console.log(HELP);
    return 0;
  }
  switch (p.command) {
    case "audit":
      return cmdAudit(p);
    case "report":
      return cmdReport(p);
    case "prd":
      return cmdPrd(p);
    case "render":
      return cmdRender(p);
    case "criteria":
      return cmdCriteria(p);
    case "check":
      return cmdCheck(p);
    case "verify":
      return cmdVerify(p);
    case "scan":
      return cmdScan(p);
    case "fix":
      return cmdFix(p);
    case "init":
      return cmdInit(p);
    default:
      console.error(`ultra11y: "${p.command}" is not implemented yet`);
      return 1;
  }
}
function isInvokedDirectly() {
  const argv1 = process.argv[1];
  if (argv1 === void 0) return false;
  const modulePath = fileURLToPath(import.meta.url);
  try {
    if (realpathSync(argv1) === realpathSync(modulePath)) return true;
  } catch {
  }
  return import.meta.url === pathToFileURL(argv1).href;
}
if (isInvokedDirectly()) {
  main(process.argv.slice(2)).then(
    (code2) => process.exit(code2),
    (err) => {
      console.error(err instanceof Error ? err.message : err);
      process.exit(1);
    }
  );
}
export {
  main,
  parseArgs
};
