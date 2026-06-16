#!/usr/bin/env node

// src/cli.ts
import { realpathSync, writeFileSync, mkdirSync } from "fs";
import { join as join2 } from "path";
import { fileURLToPath, pathToFileURL } from "url";

// src/types.ts
var VERSION = "0.0.0";
var SCHEMA_VERSION = 1;

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
      wcag: [
        "1.1.1 Non-text Content (A)"
      ],
      techniques: [
        "H36",
        "H37",
        "H53",
        "F65",
        "H24"
      ],
      automatability: "static",
      ruleIds: [
        "img-alt-missing",
        "canvas-fallback-missing",
        "icon-only-control-unnamed"
      ]
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
      wcag: [
        "1.1.1 Non-text Content (A)",
        "4.1.2 Name, Role, Value (A)"
      ],
      techniques: [
        "H67",
        "G196",
        "C9",
        "F39",
        "F38",
        "ARIA4",
        "ARIA10"
      ],
      technicalNote: [
        "Lorsqu'une image est associ\xE9e \xE0 une [l\xE9gende](#legende-d-image), la note technique WCAG recommande de pr\xE9voir syst\xE9matiquement une [alternative textuelle](#alternative-textuelle-image) (cf. crit\xE8re 1.9). Dans ce cas le crit\xE8re 1.2 est non applicable.",
        "Dans le cas d'une image vectorielle (balise `<svg>`) de d\xE9coration qui serait affich\xE9e au travers d'un \xE9l\xE9ment `<use href=\"\u2026\">` enfant de l'\xE9l\xE9ment `<svg>`, le test 1.2.4 s'appliquera \xE9galement \xE0 l'\xE9l\xE9ment `<svg>` associ\xE9e par le biais de l'\xE9l\xE9ment `<use>`.",
        'Un attribut WAI-ARIA `role="presentation"` peut \xEAtre utilis\xE9 sur les images de d\xE9coration et les zones non cliquables de d\xE9coration. Le r\xF4le `"none"` introduit en ARIA 1.1 et synonyme du r\xF4le `"presentation"` peut \xEAtre aussi utilis\xE9. Il reste pr\xE9f\xE9rable cependant d\'utiliser le r\xF4le `"presentation"` en attendant un support satisfaisant du r\xF4le `"none"`.'
      ],
      automatability: "static",
      ruleIds: [
        "decorative-alt-misuse"
      ]
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
      wcag: [
        "1.1.1 Non-text Content (A)",
        "4.1.2 Name, Role, Value (A)"
      ],
      techniques: [
        "G94",
        "G95",
        "F30",
        "F71",
        "G196",
        "ARIA6",
        "ARIA9",
        "ARIA10"
      ],
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
      wcag: [
        "1.1.1 Non-text Content (A)"
      ],
      techniques: [
        "G100",
        "G143"
      ],
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
      wcag: [
        "1.1.1 Non-text Content (A)"
      ],
      techniques: [
        "G144"
      ],
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
      wcag: [
        "1.1.1 Non-text Content (A)"
      ],
      techniques: [
        "G92",
        "G74",
        "G73",
        "H45",
        "ARIA6"
      ],
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
      wcag: [
        "1.1.1 Non-text Content (A)"
      ],
      techniques: [
        "G92",
        "F67"
      ],
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
      wcag: [
        "1.4.5 Images of Text (AA)"
      ],
      techniques: [
        "G136",
        "G140",
        "C22",
        "C30"
      ],
      technicalNote: [
        "Le texte dans les images vectorielles \xE9tant du texte r\xE9el, il n\u2019est pas concern\xE9 par ce crit\xE8re."
      ],
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
      wcag: [
        "1.1.1 Non-text Content (A)",
        "4.1.2 Name, Role, Value (A)"
      ],
      techniques: [
        "G140",
        "ARIA4",
        "ARIA6"
      ],
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
        "1": [
          "Chaque cadre (balise `<iframe>` ou `<frame>`) a-t-il un attribut `title`\xA0?"
        ]
      },
      wcag: [
        "4.1.2 Name, Role, Value (A)"
      ],
      techniques: [
        "H64"
      ],
      automatability: "static",
      ruleIds: [
        "iframe-title-missing"
      ]
    },
    {
      id: "2.2",
      theme: 2,
      title: "Pour chaque [cadre](#cadre) ayant un [titre de cadre](#titre-de-cadre), ce titre de cadre est-il pertinent\xA0?",
      titlePlain: "Pour chaque cadre ayant un titre de cadre, ce titre de cadre est-il pertinent\xA0?",
      tests: {
        "1": [
          "Pour chaque cadre (balise `<iframe>` ou `<frame>`) ayant un attribut `title`, le contenu de cet attribut est-il pertinent\xA0?"
        ]
      },
      wcag: [
        "4.1.2 Name, Role, Value (A)"
      ],
      techniques: [
        "H64"
      ],
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
      wcag: [
        "1.3.1 Info and Relationships (A)",
        "1.4.1 Use of color (A)"
      ],
      techniques: [
        "G14",
        "G182",
        "G111",
        "G117",
        "G138",
        "G205"
      ],
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
      wcag: [
        "1.4.3 Contrast (Minimum) (AA)"
      ],
      techniques: [
        "G18",
        "G136",
        "G148",
        "G174",
        "G145",
        "C29"
      ],
      particularCases: [
        "Dans ces situations, les crit\xE8res sont non applicables pour ces \xE9l\xE9ments\xA0:",
        "[object Object]"
      ],
      automatability: "needs-rendering",
      ruleIds: []
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
      wcag: [
        "1.4.11 Non-text Contrast (AA)"
      ],
      techniques: [
        "G18",
        "G195",
        "G207",
        "G174",
        "G145",
        "G183",
        "F78"
      ],
      particularCases: [
        "Les cas suivants sont non applicables pour ce crit\xE8re\xA0:",
        "[object Object]"
      ],
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
      wcag: [
        "1.2.1 Audio-only and Video-only (Prerecorded) (A)",
        "1.2.3 Audio Description or Media Alternative (Prerecorded) (A)"
      ],
      techniques: [
        "G58",
        "G69",
        "G78",
        "G158",
        "G159",
        "G173",
        "G8",
        "G166",
        "H96",
        "SM6",
        "SM7"
      ],
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
      wcag: [
        "1.2.1 Audio-only and Video-only (Prerecorded) (A)",
        "1.2.3 Audio Description or Media Alternative (Prerecorded) (A)"
      ],
      techniques: [
        "F30",
        "F67",
        "SM6",
        "SM7"
      ],
      particularCases: [
        "Voir cas particuliers crit\xE8re 4.1."
      ],
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
      wcag: [
        "1.2.2 Captions (Prerecorded) (A)"
      ],
      techniques: [
        "G58",
        "G93",
        "G87",
        "H95",
        "SM11",
        "SM12",
        "F74",
        "F75"
      ],
      particularCases: [
        "Voir cas particuliers crit\xE8re 4.1."
      ],
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
      wcag: [
        "1.2.2 Captions (Prerecorded) (A)"
      ],
      techniques: [
        "G93",
        "G87",
        "SM11",
        "SM12",
        "F8",
        "F74",
        "F75"
      ],
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
      wcag: [
        "1.2.5 Audio Description (Prerecorded) (AA)"
      ],
      techniques: [
        "G8",
        "G58",
        "G78",
        "G173",
        "H96",
        "SM1",
        "SM2",
        "SM6",
        "SM7"
      ],
      particularCases: [
        "Voir cas particuliers crit\xE8re 4.1."
      ],
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
      wcag: [
        "1.2.5 Audio Description (Prerecorded) (AA)"
      ],
      techniques: [
        "SM1",
        "SM2",
        "SM6",
        "SM7"
      ],
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
      wcag: [
        "1.1.1 Non-text Content (A)"
      ],
      techniques: [
        "G68",
        "G100"
      ],
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
      wcag: [
        "1.1.1 Non-text Content (A)"
      ],
      techniques: [
        "H35",
        "H46"
      ],
      particularCases: [
        "Il existe une gestion de cas particulier lorsque\xA0:",
        "[object Object]",
        "Dans ces situations, le crit\xE8re est non applicable."
      ],
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
      wcag: [
        "1.1.1 Non-text Content (A)"
      ],
      techniques: [
        "H46",
        "F30"
      ],
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
      wcag: [
        "1.4.2 Audio Control (A)"
      ],
      techniques: [
        "G60",
        "G170",
        "G171",
        "F23",
        "F93"
      ],
      automatability: "static",
      ruleIds: [
        "autoplay-media"
      ]
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
      wcag: [
        "2.1.1 Keyboard (A)",
        "2.1.2 No Keyboard Trap (A)"
      ],
      techniques: [
        "G4",
        "G90",
        "G202"
      ],
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
      wcag: [
        "2.1.1 Keyboard (A)",
        "2.1.2 No Keyboard Trap (A)"
      ],
      techniques: [
        "G4",
        "G90"
      ],
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
      wcag: [
        "4.1.2 Name, role, Value (A)"
      ],
      techniques: [
        "G10",
        "G135",
        "F15",
        "F54"
      ],
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
        "1": [
          "Pour chaque [tableau de donn\xE9es complexe](#tableau-de-donnees-complexe), un [r\xE9sum\xE9](#resume-de-tableau) est-il disponible\xA0?"
        ]
      },
      wcag: [
        "1.3.1 Info and Relationships (A)"
      ],
      techniques: [
        "H73"
      ],
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
        "1": [
          "Pour chaque [tableau de donn\xE9es complexe](#tableau-de-donnees-complexe) ayant un [r\xE9sum\xE9](#resume-de-tableau), celui-ci est-il pertinent\xA0?"
        ]
      },
      wcag: [
        "1.3.1 Info and Relationships (A)"
      ],
      techniques: [
        "H73"
      ],
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
      wcag: [
        "1.3.2 Meaningful Sequence (A)",
        "4.1.2 Name, Role, Value (A)"
      ],
      techniques: [
        "F49",
        "ARIA4"
      ],
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
      wcag: [
        "1.3.1 Info and Relationships (A)"
      ],
      techniques: [
        "H39"
      ],
      automatability: "static",
      ruleIds: [
        "table-caption-missing"
      ]
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
      wcag: [
        "1.3.1 Info and Relationships (A)"
      ],
      techniques: [
        "H39"
      ],
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
      wcag: [
        "1.3.1 Info and Relationships (A)"
      ],
      techniques: [
        "H51",
        "F91"
      ],
      automatability: "static",
      ruleIds: [
        "data-table-no-headers"
      ]
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
      wcag: [
        "1.3.1 Info and Relationships (A)"
      ],
      techniques: [
        "H43",
        "H63",
        "F90"
      ],
      technicalNote: [
        "Si l\u2019attribut `headers` est impl\xE9ment\xE9 sur une cellule d\xE9j\xE0 reli\xE9e \xE0 un en-t\xEAte (de ligne ou de colonne) avec l\u2019attribut `scope` (avec la valeur `col` ou `row`), c\u2019est l\u2019en-t\xEAte ou les en-t\xEAtes r\xE9f\xE9renc\xE9s par l\u2019attribut `headers` qui seront restitu\xE9s aux technologies d\u2019assistance. Les en-t\xEAtes reli\xE9s avec l\u2019attribut `scope` seront ignor\xE9s."
      ],
      particularCases: [
        "Dans le cas de tableaux de donn\xE9es ayant des en-t\xEAtes sur une seule ligne ou une seule colonne, les en-t\xEAtes peuvent \xEAtre structur\xE9s \xE0 l\u2019aide de balise `<th>` sans attribut `scope`."
      ],
      automatability: "static",
      ruleIds: [
        "data-table-no-headers"
      ]
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
      wcag: [
        "1.3.1 Info and Relationships (A)"
      ],
      techniques: [
        "F46"
      ],
      automatability: "judgment",
      ruleIds: []
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
      wcag: [
        "1.1.1 Non-text Content (A)",
        "2.4.4 Link Purpose (In Context) (A)",
        "2.5.3 Label in Name (A)"
      ],
      techniques: [
        "H30",
        "H78",
        "H79",
        "H80",
        "H81",
        "G53",
        "G91",
        "F63",
        "F89",
        "ARIA7",
        "ARIA8"
      ],
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
        "1": [
          "Dans chaque page web, chaque [lien](#lien) a-t-il un [intitul\xE9](#intitule-ou-nom-accessible-de-lien) entre `<a>` et `</a>`\xA0?"
        ]
      },
      wcag: [
        "1.1.1 Non-text Content (A)",
        "2.4.4 Link Purpose (In Context) (A)"
      ],
      techniques: [
        "H30",
        "G91",
        "F89"
      ],
      technicalNote: [
        "Une ancre n\u2019est pas un lien m\xEAme si pendant longtemps l\u2019\xE9l\xE9ment `<a>` a servi de support \xE0 cette technique. Elle n\u2019est donc pas concern\xE9e par le pr\xE9sent crit\xE8re."
      ],
      automatability: "static",
      ruleIds: [
        "link-empty-name",
        "icon-only-control-unnamed"
      ]
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
      wcag: [
        "2.5.3 Label in Name (A)",
        "4.1.2 Name, Role, Value (A)"
      ],
      techniques: [
        "G10",
        "G135",
        "G136",
        "F15",
        "F19",
        "F20",
        "F42",
        "F59",
        "F79",
        "ARIA4",
        "ARIA5",
        "ARIA18",
        "ARIA19",
        "SCR21"
      ],
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
        "icon-only-control-unnamed"
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
      wcag: [
        "1.1.1 Non-text Content (A)",
        "4.1.2 Name, Role, Value (A)"
      ],
      techniques: [
        "G136",
        "F19",
        "F20"
      ],
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
        "2": [
          "Un [script](#script) ne doit pas supprimer le focus d\u2019un \xE9l\xE9ment qui le re\xE7oit. Cette r\xE8gle est-elle respect\xE9e (hors cas particuliers)\xA0?"
        ]
      },
      wcag: [
        "1.3.1 Info and Relationships (A)",
        "2.1.1 Keyboard (A)",
        "2.4.7 Focus Visible (AA)"
      ],
      techniques: [
        "G90",
        "G202",
        "F42",
        "F54",
        "F55",
        "SCR2",
        "SCR20",
        "SCR29",
        "SCR35"
      ],
      particularCases: [
        "Il existe une gestion de cas particuliers lorsque la fonctionnalit\xE9 d\xE9pend de l\u2019utilisation d\u2019un gestionnaire d\u2019\xE9v\xE9nement sans \xE9quivalent universel\xA0; par exemple, une application de dessin \xE0 main lev\xE9e ne pourra pas \xEAtre rendue contr\xF4lable au clavier. Dans ces situations, le crit\xE8re est non applicable."
      ],
      automatability: "static",
      ruleIds: [
        "clickable-noninteractive"
      ]
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
      wcag: [
        "3.2.1 On Focus (A)",
        "3.2.2 On Input (A)"
      ],
      techniques: [
        "G13",
        "G76",
        "G80",
        "G107",
        "H32",
        "H84",
        "F9",
        "F22",
        "F36",
        "F37",
        "F41",
        "SCR19"
      ],
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
      wcag: [
        "4.1.3 Status Messages (AA)"
      ],
      techniques: [
        "ARIA19",
        "ARIA22",
        "ARIA23"
      ],
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
        "1": [
          "Pour chaque page web, le [type de document](#type-de-document) (balise `doctype`) est-il pr\xE9sent\xA0?"
        ],
        "2": [
          "Pour chaque page web, le [type de document](#type-de-document) (balise `doctype`) est-il valide\xA0?"
        ],
        "3": [
          "Pour chaque page web poss\xE9dant une d\xE9claration de [type de document](#type-de-document), celle-ci est-elle situ\xE9e avant la balise `<html>` dans le code source\xA0?"
        ]
      },
      wcag: [
        "4.1.1 Parsing (A)"
      ],
      techniques: [
        "G134",
        "G192"
      ],
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
      wcag: [
        "4.1.1 Parsing (A)",
        "4.1.2 Name, Role, Value (A)"
      ],
      techniques: [
        "H74",
        "H93",
        "H94",
        "F70",
        "F77"
      ],
      automatability: "static",
      ruleIds: [
        "duplicate-id"
      ]
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
      wcag: [
        "3.1.1 Language of Page (A)"
      ],
      techniques: [
        "H57"
      ],
      automatability: "static",
      ruleIds: [
        "html-lang-missing"
      ]
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
      wcag: [
        "3.1.1 Language of Page (A)"
      ],
      techniques: [
        "H57"
      ],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "8.5",
      theme: 8,
      title: "Chaque page web a-t-elle un [titre de page](#titre-de-page)\xA0?",
      titlePlain: "Chaque page web a-t-elle un titre de page\xA0?",
      tests: {
        "1": [
          "Chaque page web a-t-elle un [titre de page](#titre-de-page) (balise `<title>`)\xA0?"
        ]
      },
      wcag: [
        "2.4.2 Page Titled (A)"
      ],
      techniques: [
        "G88",
        "G127",
        "H25"
      ],
      automatability: "static",
      ruleIds: [
        "title-missing-empty"
      ]
    },
    {
      id: "8.6",
      theme: 8,
      title: "Pour chaque page web ayant un [titre de page](#titre-de-page), ce titre est-il pertinent\xA0?",
      titlePlain: "Pour chaque page web ayant un titre de page, ce titre est-il pertinent\xA0?",
      tests: {
        "1": [
          "Pour chaque page web ayant un [titre de page](#titre-de-page) (balise `<title>`), le contenu de cette balise est-il pertinent\xA0?"
        ]
      },
      wcag: [
        "2.4.2 Page Titled (A)"
      ],
      techniques: [
        "G88",
        "G127",
        "H25"
      ],
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
      wcag: [
        "3.1.2 Language of Parts (AA)"
      ],
      techniques: [
        "H58"
      ],
      particularCases: [
        "Il y a une gestion de cas particuliers sur le changement de langue pour les cas suivants\xA0:",
        "[object Object]",
        "Note 1\xA0: le dictionnaire officiel est celui recommand\xE9 par l\u2019acad\xE9mie en charge de la langue en question. Pour la France, par exemple, le lien vers le dictionnaire officiel se trouve sur le site de l\u2019Acad\xE9mie fran\xE7aise \xE0 l\u2019adresse suivante\xA0: http://www.academie-francaise.fr/le-dictionnaire/la-9e-edition. Pour toute demande aupr\xE8s du service du dictionnaire de l\u2019Acad\xE9mie fran\xE7aise, utiliser le formulaire de contact du service du dictionnaire.",
        "Note 2\xA0: pour les noms communs de langue \xE9trang\xE8re, absents dans le dictionnaire officiel de la langue par d\xE9faut de la page web, et qui sont pass\xE9s dans le langage commun (exemple\xA0: newsletter)\xA0: le crit\xE8re est applicable, uniquement lorsque l\u2019absence d\u2019indication de langue peut provoquer une incompr\xE9hension pour la restitution."
      ],
      automatability: "static",
      ruleIds: [
        "inline-lang-change-missing"
      ]
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
      wcag: [
        "3.1.2 Language of Parts (AA)"
      ],
      techniques: [
        "H58"
      ],
      automatability: "judgment",
      ruleIds: []
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
      wcag: [
        "1.3.1 Info and Relationships (A)"
      ],
      techniques: [
        "G115",
        "H88",
        "F43",
        "F92"
      ],
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
      wcag: [
        "1.3.2 Meaningful Sequence (A)"
      ],
      techniques: [
        "H56"
      ],
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
      wcag: [
        "1.3.1 Info and Relationships (A)",
        "2.4.1 Bypass Blocks (A)",
        "2.4.6 Headings and Labels (AA)",
        "4.1.2 Name, Role, Value (A)"
      ],
      techniques: [
        "G115",
        "G130",
        "H42",
        "G141",
        "ARIA4",
        "ARIA12"
      ],
      technicalNote: [
        "WAI-ARIA permet de d\xE9finir des titres via le r\xF4le `heading` et l\u2019attribut `aria-level` (indication du niveau de titre). Bien qu\u2019il soit pr\xE9f\xE9rable d\u2019utiliser l\u2019\xE9l\xE9ment de titre natif en HTML `<hx>`, l\u2019utilisation du r\xF4le WAI-ARIA `heading` est compatible avec l\u2019accessibilit\xE9."
      ],
      automatability: "static",
      ruleIds: [
        "heading-order-skip",
        "h1-missing",
        "h1-multiple"
      ]
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
      wcag: [
        "1.3.1 Info and Relationships (A)"
      ],
      techniques: [
        "G115",
        "ARIA11"
      ],
      technicalNote: [
        "La balise `<main>` peut \xEAtre utilis\xE9e plusieurs fois dans le m\xEAme document HTML. N\xE9anmoins, il ne peut y avoir en permanence qu\u2019une seule balise visible et lisible par les technologies d\u2019assistances, les autres devant disposer d\u2019un attribut `hidden` ou d\u2019un style permettant de les masquer aux technologies d\u2019assistances. \xC0 noter cependant que l\u2019utilisation d\u2019un style seul restera insuffisante pour assurer l\u2019unicit\xE9 d\u2019une balise `<main>` visible en cas de d\xE9sactivation des feuilles de styles."
      ],
      particularCases: [
        "Lorsque le doctype d\xE9clar\xE9 dans la page n\u2019est pas le doctype HTML5, ce crit\xE8re est non applicable."
      ],
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
      wcag: [
        "1.3.1 Info and Relationships (A)"
      ],
      techniques: [
        "G115",
        "G153",
        "H40",
        "H48",
        "F2"
      ],
      technicalNote: [
        'Les attributs WAI-ARIA `role="list"` et `role="listitem"` peuvent n\xE9cessiter l\u2019utilisation des attributs WAI-ARIA `aria-setsize` et `aria-posinset` dans le cas o\xF9 l\u2019ensemble de la liste n\u2019est pas disponible via le DOM g\xE9n\xE9r\xE9 au moment de la consultation.',
        'Les attributs WAI-ARIA `role="tree"`, `role="tablist"`, `role="menu"`, `role="combobox"` et `role="listbox"` ne sont pas \xE9quivalents \xE0 une liste HTML `<ul>` ou `<ol>`.'
      ],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "9.4",
      theme: 9,
      title: "Dans chaque page web, chaque citation est-elle correctement indiqu\xE9e\xA0?",
      titlePlain: "Dans chaque page web, chaque citation est-elle correctement indiqu\xE9e\xA0?",
      tests: {
        "1": [
          "Dans chaque page web, chaque citation courte utilise-t-elle une balise `<q>`\xA0?"
        ],
        "2": [
          "Dans chaque page web, chaque bloc de citation utilise-t-il une balise `<blockquote>`\xA0?"
        ]
      },
      wcag: [
        "1.3.1 Info and Relationships (A)"
      ],
      techniques: [
        "G115",
        "H49",
        "F2"
      ],
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
      wcag: [
        "1.3.1 Info and Relationships (A)",
        "1.3.2 Meaningful Sequence (A)"
      ],
      techniques: [
        "G140",
        "F32",
        "F33",
        "F34",
        "F48",
        "C6",
        "C8",
        "C18",
        "C22"
      ],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "10.2",
      theme: 10,
      title: "Dans chaque page web, le [contenu visible](#contenu-visible) porteur d\u2019information reste-t-il pr\xE9sent lorsque les [feuilles de styles](#feuille-de-style) sont d\xE9sactiv\xE9es\xA0?",
      titlePlain: "Dans chaque page web, le contenu visible porteur d\u2019information reste-t-il pr\xE9sent lorsque les feuilles de styles sont d\xE9sactiv\xE9es\xA0?",
      tests: {
        "1": [
          "Dans chaque page web, l\u2019information reste-t-elle pr\xE9sente lorsque les [feuilles de styles](#feuille-de-style) sont d\xE9sactiv\xE9es\xA0?"
        ]
      },
      wcag: [
        "1.1.1 Non-text Content (A)",
        "1.3.1 Info and Relationships (A)"
      ],
      techniques: [
        "G140",
        "F3",
        "F87"
      ],
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
      wcag: [
        "1.3.2 Meaningful Sequence (A)",
        "2.4.3 Focus Order (A)"
      ],
      techniques: [
        "G59",
        "G140",
        "F1"
      ],
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
      wcag: [
        "1.4.4 Resize Text (AA)"
      ],
      techniques: [
        "G146",
        "G179",
        "F69",
        "F80",
        "SCR34",
        "C12",
        "C13",
        "C14",
        "C17",
        "C28"
      ],
      particularCases: [
        "Font exception \xE0 ce crit\xE8re, les contenus pour lesquels l\u2019utilisateur n\u2019a pas de possibilit\xE9 de personnalisation\xA0:",
        "[object Object]"
      ],
      automatability: "needs-rendering",
      ruleIds: []
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
      wcag: [
        "1.4.3 Contrast (Minimum) (AA)"
      ],
      techniques: [
        "F24"
      ],
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
      wcag: [
        "1.4.1 Use of Color (A)"
      ],
      techniques: [
        "G183",
        "F73"
      ],
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
      wcag: [
        "1.4.1 Use of Color (A)",
        "2.4.7 Focus Visible (AA)"
      ],
      techniques: [
        "G149",
        "G165",
        "G183",
        "G195",
        "F73",
        "F78",
        "SCR31",
        "C15"
      ],
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
      wcag: [
        "1.3.2 Meaningful Sequence (A)",
        "4.1.2 Name, Role, Value (A)"
      ],
      techniques: [
        "G57"
      ],
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
      wcag: [
        "1.3.3 Sensory Characteristics (A)",
        "1.4.1 Use of Color (A)"
      ],
      techniques: [
        "G96",
        "G140",
        "F14",
        "F26"
      ],
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
      wcag: [
        "1.3.3 Sensory Characteristics (A)",
        "1.4.1 Use of Color (A)"
      ],
      techniques: [
        "G96",
        "G140",
        "F14",
        "F26"
      ],
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
      wcag: [
        "1.4.10 Reflow (AA)"
      ],
      techniques: [
        "C34",
        "C37"
      ],
      technicalNote: [
        "Lorsqu'il est ici question de pixel, il s'agit du pixel CSS tel que d\xE9fini par le W3C https://www.w3.org/TR/css3-values/"
      ],
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
      wcag: [
        "1.4.12 Text Spacing (AA)"
      ],
      techniques: [
        "C8",
        "C21",
        "C35",
        "C36"
      ],
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
      wcag: [
        "1.4.13 Content on Hover or Focus (AA)"
      ],
      techniques: [
        "F95"
      ],
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
      wcag: [
        "2.1.1 Keyboard (A)"
      ],
      techniques: [
        "G202"
      ],
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
      wcag: [
        "1.3.1 Info and Relationships (A)",
        "2.4.6 Headings and Labels (AA)",
        "3.3.2 Labels or Instructions (A)",
        "4.1.2 Name, Role, Value (A)"
      ],
      techniques: [
        "G82",
        "G131",
        "H44",
        "H65",
        "F68",
        "F82",
        "F86",
        "ARIA6",
        "ARIA9",
        "ARIA14",
        "ARIA16"
      ],
      automatability: "static",
      ruleIds: [
        "control-label-missing",
        "placeholder-as-label"
      ]
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
      wcag: [
        "2.4.6 Headings and Labels (AA)",
        "2.5.3 Label in Name (A)",
        "3.3.2 Labels or Instructions (A)"
      ],
      techniques: [
        "G82",
        "G131",
        "H44",
        "H65",
        "ARIA6",
        "ARIA9",
        "ARIA14",
        "ARIA16"
      ],
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
      wcag: [
        "3.2.4 Consistent Identification (AA)"
      ],
      techniques: [
        "F31"
      ],
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
      wcag: [
        "3.3.2 Labels or Instructions (A)"
      ],
      techniques: [
        "G162"
      ],
      particularCases: [
        "Les tests 11.4.2 et 11.4.3 seront consid\xE9r\xE9s comme non applicables\xA0:",
        "[object Object]"
      ],
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
      wcag: [
        "1.3.1 Info and Relationships (A)",
        "3.3.2 Labels or Instructions (A)"
      ],
      techniques: [
        "H71",
        "ARIA17"
      ],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "11.6",
      theme: 11,
      title: "Dans chaque [formulaire](#formulaire), chaque regroupement de [champs de m\xEAme nature](#champs-de-meme-nature) a-t-il une [l\xE9gende](#legende)\xA0?",
      titlePlain: "Dans chaque formulaire, chaque regroupement de champs de m\xEAme nature a-t-il une l\xE9gende\xA0?",
      tests: {
        "1": [
          "Chaque regroupement de [champs de m\xEAme nature](#champs-de-meme-nature) poss\xE8de-t-il une [l\xE9gende](#legende)\xA0?"
        ]
      },
      wcag: [
        "1.3.1 Info and Relationships (A)",
        "3.3.2 Labels or Instructions (A)"
      ],
      techniques: [
        "H71",
        "ARIA17"
      ],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "11.7",
      theme: 11,
      title: "Dans chaque [formulaire](#formulaire), chaque [l\xE9gende](#legende) associ\xE9e \xE0 un regroupement de [champs de m\xEAme nature](#champs-de-meme-nature) est-elle pertinente\xA0?",
      titlePlain: "Dans chaque formulaire, chaque l\xE9gende associ\xE9e \xE0 un regroupement de champs de m\xEAme nature est-elle pertinente\xA0?",
      tests: {
        "1": [
          "Chaque [l\xE9gende](#legende) associ\xE9e \xE0 un regroupement de [champs de m\xEAme nature](#champs-de-meme-nature) est-elle pertinente\xA0?"
        ]
      },
      wcag: [
        "1.3.1 Info and Relationships (A)",
        "3.3.2 Labels or Instructions (A)"
      ],
      techniques: [
        "H71",
        "ARIA17"
      ],
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
        "2": [
          "Dans chaque balise `<select>`, chaque balise `<optgroup>` poss\xE8de-t-elle un attribut `label`\xA0?"
        ],
        "3": [
          "Pour chaque balise `<optgroup>` ayant un attribut `label`, le contenu de l\u2019attribut `label` est-il pertinent\xA0?"
        ]
      },
      wcag: [
        "1.3.1 Info and Relationships (A)"
      ],
      techniques: [
        "H85"
      ],
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
      wcag: [
        "2.5.3 Label in Name (A)",
        "4.1.2 Name, Role, Value (A)"
      ],
      techniques: [
        "H36",
        "H91",
        "ARIA6",
        "ARIA9",
        "ARIA14",
        "ARIA16"
      ],
      particularCases: [
        "Pour le test 11.9.2, voir cas particuliers crit\xE8re 11.2."
      ],
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
      wcag: [
        "3.3.1 Error Identification (A)",
        "3.3.2 Labels or Instructions (A)"
      ],
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
        "1": [
          "Pour chaque erreur de saisie, les types et les formats de donn\xE9es sont-ils sugg\xE9r\xE9s, si n\xE9cessaire\xA0?"
        ],
        "2": [
          "Pour chaque erreur de saisie, des exemples de valeurs attendues sont-ils sugg\xE9r\xE9s, si n\xE9cessaire\xA0?"
        ]
      },
      wcag: [
        "3.3.3 Error Suggestion (AA)"
      ],
      techniques: [
        "G84",
        "G85",
        "G89",
        "G177",
        "H89"
      ],
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
      wcag: [
        "3.3.4 Error Prevention (Legal, Financial, Data) (AA)"
      ],
      techniques: [
        "G98",
        "G99",
        "G155",
        "G164",
        "G168"
      ],
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
      wcag: [
        "1.3.5 Identify Input Purpose (AA)"
      ],
      techniques: [
        "H98"
      ],
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
      wcag: [
        "2.4.5 Multiple Ways (AA)"
      ],
      techniques: [
        "G63",
        "G64",
        "G161"
      ],
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
      wcag: [
        "3.2.3 Consistent Navigation (AA)"
      ],
      techniques: [
        "G61",
        "F66"
      ],
      particularCases: [
        "Il existe une gestion de cas particuliers lorsque\xA0:",
        "[object Object]",
        "Dans ces situations, le crit\xE8re est non applicable."
      ],
      automatability: "judgment",
      ruleIds: []
    },
    {
      id: "12.3",
      theme: 12,
      title: "La [page \xAB\xA0plan du site\xA0\xBB](#page-plan-du-site) est-elle pertinente\xA0?",
      titlePlain: "La page \xAB\xA0plan du site\xA0\xBB est-elle pertinente\xA0?",
      tests: {
        "1": [
          "La [page \xAB\xA0plan du site\xA0\xBB](#page-plan-du-site) est-elle repr\xE9sentative de l\u2019architecture g\xE9n\xE9rale du site\xA0?"
        ],
        "2": [
          "Les liens du [plan du site](#page-plan-du-site) sont-ils fonctionnels\xA0?"
        ],
        "3": [
          "Les liens du [plan du site](#page-plan-du-site) renvoient-ils bien vers les pages indiqu\xE9es par l\u2019intitul\xE9\xA0?"
        ]
      },
      wcag: [
        "2.4.5 Multiple Ways (AA)"
      ],
      techniques: [
        "G63"
      ],
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
      wcag: [
        "2.4.5 Multiple Ways (AA)",
        "3.2.3 Consistent Navigation (AA)"
      ],
      techniques: [
        "G61",
        "G63"
      ],
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
      wcag: [
        "3.2.3 Consistent Navigation (AA)"
      ],
      techniques: [
        "G61",
        "F66"
      ],
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
      wcag: [
        "1.3.1 Info and Relationships (A)",
        "2.4.1 Bypass Blocks (A)",
        "4.1.2 Name, Role, Value (A)"
      ],
      techniques: [
        "H69",
        "G115",
        "ARIA4",
        "ARIA11"
      ],
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
      wcag: [
        "2.4.1 Bypass Blocks (A)",
        "2.4.3 Focus Order (A)",
        "3.2.3 Consistent Navigation (AA)"
      ],
      techniques: [
        "G1",
        "G59",
        "G123",
        "G124",
        "SCR28",
        "F66"
      ],
      particularCases: [
        "Il existe une gestion de cas particuliers lorsque le site web est constitu\xE9 d\u2019une seule page.",
        "Dans ce cas de figure, l\u2019obligation de la pr\xE9sence d\u2019un lien d\u2019acc\xE8s rapide est li\xE9e au contexte de la page\xA0: pr\xE9sence ou absence de navigation ou de contenus additionnels, par exemple. Le crit\xE8re peut \xEAtre consid\xE9r\xE9 comme non applicable lorsqu\u2019il est av\xE9r\xE9 qu\u2019un lien d\u2019acc\xE8s rapide est inutile."
      ],
      automatability: "static",
      ruleIds: [
        "skip-link-target-missing"
      ]
    },
    {
      id: "12.8",
      theme: 12,
      title: "Dans chaque page web, l\u2019[ordre de tabulation](#ordre-de-tabulation) est-il [coh\xE9rent](#comprehensible-ordre-de-lecture)\xA0?",
      titlePlain: "Dans chaque page web, l\u2019ordre de tabulation est-il coh\xE9rent\xA0?",
      tests: {
        "1": [
          "Dans chaque page web, l\u2019[ordre de tabulation](#ordre-de-tabulation) dans le contenu est-il [coh\xE9rent](#comprehensible-ordre-de-lecture)\xA0?"
        ],
        "2": [
          "Pour chaque [script](#script) qui met \xE0 jour ou ins\xE8re un contenu, l\u2019[ordre de tabulation](#ordre-de-tabulation) reste-t-il [coh\xE9rent](#comprehensible-ordre-de-lecture)\xA0?"
        ]
      },
      wcag: [
        "2.4.3 Focus Order (A)"
      ],
      techniques: [
        "G59",
        "H4",
        "F44",
        "F85",
        "SCR26",
        "SCR27",
        "SCR37",
        "C27"
      ],
      automatability: "static",
      ruleIds: [
        "positive-tabindex"
      ]
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
      wcag: [
        "2.1.1 Keyboard (A)",
        "2.1.2 No Keyboard Trap (A)"
      ],
      techniques: [
        "G21",
        "H91",
        "F10"
      ],
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
      wcag: [
        "2.1.4 Character Key Shortcuts (A)"
      ],
      techniques: [
        "F99",
        "G217"
      ],
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
      wcag: [
        "2.1.1 Keyboard (A)"
      ],
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
        "2": [
          "Pour chaque page web, chaque proc\xE9d\xE9 de [redirection](#redirection) effectu\xE9 via une balise `<meta>` est-il imm\xE9diat (hors cas particuliers)\xA0?"
        ],
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
      wcag: [
        "2.2.1 Timing Adjustable (A)",
        "2.2.2 Pause, Stop, Hide (A)"
      ],
      techniques: [
        "F40",
        "F41",
        "F58",
        "F61",
        "G75",
        "G76",
        "G110",
        "G133",
        "G180",
        "G186",
        "G198",
        "H76",
        "SCR1",
        "SCR16",
        "SCR36",
        "SVR1"
      ],
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
      wcag: [
        "3.2.1 On focus (A)"
      ],
      techniques: [
        "F55",
        "G107"
      ],
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
      techniques: [
        "F15",
        "G10",
        "G135"
      ],
      particularCases: [
        "Il existe une gestion de cas particuliers\xA0:",
        "[object Object]",
        "Dans cette situation, le crit\xE8re est non applicable."
      ],
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
      techniques: [
        "F15",
        "G10",
        "G135"
      ],
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
      wcag: [
        "1.1.1 Non-text Content (A)"
      ],
      techniques: [
        "F71",
        "F70",
        "G135",
        "H86"
      ],
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
      wcag: [
        "1.1.1 Non-text Content (A)"
      ],
      techniques: [
        "F71",
        "F72",
        "H86"
      ],
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
      wcag: [
        "2.3.1 Three Flashes or Below Threshold (A)"
      ],
      techniques: [
        "G15",
        "G19",
        "G176"
      ],
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
      wcag: [
        "2.2.1 Timing Adjustable (A)",
        "2.2.2 Pause, Stop, Hide (A)"
      ],
      techniques: [
        "F4",
        "F7",
        "F16",
        "F47",
        "F50",
        "G4",
        "G11",
        "G152",
        "G186",
        "G187",
        "G191",
        "SCR22",
        "SCR33",
        "SCR36",
        "SM11",
        "SM12"
      ],
      automatability: "static",
      ruleIds: [
        "autoplay-media"
      ]
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
      wcag: [
        "1.3.4 Orientation (AA)"
      ],
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
      wcag: [
        "2.5.1 Pointer Gestures (A)"
      ],
      techniques: [
        "G215",
        "G216"
      ],
      particularCases: [
        "Il existe une gestion de cas particuliers dans deux types de situation\xA0:",
        "[object Object]"
      ],
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
      wcag: [
        "2.5.2 Pointer Cancellation (A)"
      ],
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
      wcag: [
        "2.5.4 Motion Actuation (A)"
      ],
      techniques: [],
      particularCases: [
        "Il existe une gestion de cas particulier lorsque\xA0:",
        "[object Object]"
      ],
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

// src/parse/html.ts
import { parseDocument } from "htmlparser2";
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
      const id = el.attribs["id"];
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
  return { file, source, lossy, roots, elements, byId: byId2, lineStarts };
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
    const id = el.attribs["id"];
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

// src/parse/source.ts
function detectKind(file, forceJsx = false) {
  if (forceJsx) return "jsx";
  if (/\.(jsx|tsx)$/i.test(file)) return "jsx";
  return "html";
}
function parseSource(source, file, opts = {}) {
  const kind = detectKind(file, opts.forceJsx);
  if (kind === "jsx") return parseHtml(jsxToHtml(source), file, true);
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
  const id = el.attribs["id"];
  if (id) return `${el.tag}#${id}`;
  const type = el.attribs["type"];
  if (type && (el.tag === "input" || el.tag === "button")) return `${el.tag}[type=${type}]`;
  const cls = el.attribs["class"];
  if (cls) return `${el.tag}.${cls.trim().split(/\s+/)[0]}`;
  if (el.tag === "a" && el.attribs["href"]) {
    const h = el.attribs["href"];
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
    snippet: snippet(doc, rf.el)
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
      } else if (["presentation", "none"].includes(role) && alt && alt.trim()) {
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
var scriptsAriaRules = [invalidAriaRole, ariaRefMissingId, redundantAria, clickableNoninteractive];

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
var mandatoryRules = [htmlLangMissing, titleMissingEmpty, duplicateId, inlineLangChangeMissing];

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
var headingsRules = [headingOrderSkip, h1Missing, h1Multiple];

// src/rules/tables.ts
var isLayout = (t2) => ["presentation", "none"].includes((attr(t2, "role") ?? "").trim());
var named2 = (t2) => !!(attr(t2, "aria-label") ?? "").trim() || hasAttr(t2, "aria-labelledby");
var dataTableNoHeaders = {
  id: "data-table-no-headers",
  criteria: ["5.6", "5.7"],
  parser: ["html", "jsx"],
  severity: "majeur",
  run(doc) {
    const out = [];
    for (const t2 of doc.elements) {
      if (t2.tag !== "table" || isLayout(t2)) continue;
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
      if (t2.tag !== "table" || isLayout(t2)) continue;
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
var tablesRules = [dataTableNoHeaders, tableCaptionMissing];

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
var formsRules = [controlLabelMissing, placeholderAsLabel];

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

// src/rules/registry.ts
var ALL_RULES = [
  ...imagesRules,
  ...framesRules,
  ...scriptsAriaRules,
  ...mandatoryRules,
  ...headingsRules,
  ...tablesRules,
  ...linksRules,
  ...formsRules,
  ...navigationRules,
  ...multimediaRules
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

// src/glob.ts
import { readdirSync, statSync, existsSync } from "fs";
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
var DEFAULT_EXT = /* @__PURE__ */ new Set([".html", ".htm", ".xhtml", ".jsx", ".tsx"]);
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
  const files = /* @__PURE__ */ new Set();
  for (const input of inputs) {
    if (input === "-") continue;
    if (hasGlob(input)) {
      const re = globToRegExp(input);
      const acc = [];
      walk(staticBase(input), acc);
      for (const f of acc) if (re.test(toPosix(f))) files.add(f);
    } else if (existsSync(input)) {
      if (statSync(input).isDirectory()) {
        const acc = [];
        walk(input, acc);
        for (const f of acc) if (DEFAULT_EXT.has(ext(f))) files.add(f);
      } else {
        files.add(input);
      }
    }
  }
  let list = [...files];
  if (include) list = list.filter((f) => include(toPosix(f)));
  if (exclude) list = list.filter((f) => !exclude(toPosix(f)));
  return list.sort();
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
  "11.1": (d) => d.elements.some(isFormField),
  "12.7": (d) => isFullDocument(d) && d.elements.some((e) => e.tag === "a" && (attr(e, "href") ?? "").startsWith("#")),
  "12.8": (d) => d.elements.some((e) => hasAttr(e, "tabindex"))
};
function residualReason(automatability) {
  return automatability === "needs-rendering" ? "N\xE9cessite un rendu (contraste, focus, zoom/reflow) \u2014 \xE0 v\xE9rifier manuellement." : "Crit\xE8re de jugement \u2014 \xE0 \xE9valuer manuellement avec le contexte.";
}
function buildAudit(docs, inputs) {
  const findings = [];
  for (const d of docs) findings.push(...runRules(d));
  const byCriterion = /* @__PURE__ */ new Map();
  for (const f of findings) {
    const arr = byCriterion.get(f.criteriaId) ?? [];
    arr.push(f);
    byCriterion.set(f.criteriaId, arr);
  }
  const criteria = [];
  const residualRisks = [];
  for (const c of allCriteria()) {
    const fs = byCriterion.get(c.id) ?? [];
    let status;
    let justification;
    if (c.automatability !== "static") {
      status = "manual";
      residualRisks.push({ criteriaId: c.id, reason: residualReason(c.automatability), automatability: c.automatability });
    } else {
      const pred = APPLICABLE[c.id];
      const applicable = pred ? docs.some((d) => pred(d)) : docs.some((d) => isFullDocument(d));
      if (!applicable) {
        status = "NA";
        justification = "Aucun \xE9l\xE9ment concern\xE9 par ce crit\xE8re dans le p\xE9rim\xE8tre audit\xE9.";
      } else if (fs.length > 0) {
        status = "NC";
      } else {
        status = "C";
      }
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
    scope: { inputs, files: docs.length },
    themes,
    criteria,
    findings,
    residualRisks,
    conformancePct
  };
}
function runAudit(opts) {
  const docs = [];
  for (const file of expandInputs(opts.inputs, { include: opts.include, exclude: opts.exclude })) {
    docs.push(parseSource(readText(file), file, { forceJsx: opts.forceJsx }));
  }
  if (opts.inputs.includes("-") && opts.stdin !== void 0) {
    docs.push(parseSource(opts.stdin, "<stdin>", { forceJsx: opts.forceJsx }));
  }
  return buildAudit(docs, opts.inputs);
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
    manualNote: "crit\xE8res non d\xE9cidables par le moteur \u2014 \xE0 compl\xE9ter par une revue humaine."
  },
  en: {
    summaryTitle: "RGAA 4.1.2 audit (ultra11y static engine)",
    files: "files analysed",
    autoConformance: "automatic conformance (static subset)",
    theme: "Theme",
    findingsTitle: "Non-conformities detected",
    noFindings: "No non-conformity detected by the static engine.",
    residualTitle: "To assess manually (judgment / rendering)",
    manualNote: "criteria the engine cannot decide \u2014 complete with a human review."
  }
};
function t(lang, key) {
  return STR[lang][key];
}
var ICON = { bloquant: "\u{1F534}", majeur: "\u{1F7E0}", mineur: "\u{1F7E1}" };
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
      lines.push(`  ${ICON[f.severity]} [${f.criteriaId}] ${f.file}:${f.line}  ${f.message}`);
    }
    if (r.findings.length > 20) lines.push(`  \u2026 (+${r.findings.length - 20})`);
  }
  lines.push("");
  lines.push(`${t(lang, "residualTitle")} : ${r.residualRisks.length} ${t(lang, "manualNote")}`);
  return lines.join("\n");
}

// src/cli.ts
var HELP = `ultra11y v${VERSION}
Audit HTML/CSS/JSX for RGAA 4.1.2 + WCAG 2.1/2.2 AA accessibility and produce a
dated compliance report, or author/review accessible markup (native-HTML-first).
A deterministic zero-dependency static engine plus your judgment, with check/verify
gates against hallucinated non-conformities.

Usage:
  ultra11y audit    <globs\u2026 | -> [--out <dir>] [--include <glob>] [--exclude <glob>] [--jsx] [--json] [--lang fr|en]
  ultra11y report   --in <audit.json> [--out <dir>] [--lang fr|en]
  ultra11y criteria [<id>] [--theme <N>] [--list] [--json] [--lang fr|en]
  ultra11y check    --report <md> [--quiet] [--json]
  ultra11y verify   --report <md> [--semantic] [--apply <verdicts.json>] [--max-verify <n>] [--json]

Commands:
  audit      Run the static engine over the inputs (files/globs, or '-' for stdin)
             and emit an AuditResult JSON (consumed by 'report'). Without --json,
             prints a French summary. The engine decides the machine-detectable
             criteria; you supply the judgment + needs-rendering ones.
  report     Render an AuditResult into a dated RGAA compliance report
             (audits/rgaa-YYYY-MM-DD.md): metadata, per-theme synthesis table,
             non-conformities by priority, conforming + not-applicable lists.
  criteria   Look up the RGAA reference offline: one criterion, a whole theme,
             or the 13-theme list. Carries WCAG cross-refs + automatability class.
  check      Integrity gate on a produced report: every cited criterion resolves,
             every NA is justified, sections + conformance maths are well-formed.
  verify     Adversarial claim\u2194criterion worklist for the report's non-conformities,
             then (--apply) gate on refuted/unsupported findings.

Options:
  --out <dir>        audit/report: output dir for AuditResult + report  (default: audits)
  --in <file>        report: the AuditResult JSON to render ('-' for stdin)
  --include <glob>   audit: only include paths matching (comma-separated)
  --exclude <glob>   audit: skip paths matching (comma-separated)
  --jsx              audit: force best-effort JSX/TSX parsing
  --report <file>    check/verify: the report markdown to gate
  --theme <N>        criteria: list the criteria of theme N (1..13)
  --list             criteria: print the 13-theme table
  --apply <file>     verify: reduce a filled verdicts file to a pass/fail gate
  --max-verify <n>   verify: cap the worklist size                       (default: 40)
  --semantic         verify: fold the support-check into one pass
  --lang fr|en       output language                                     (default: fr)
  --json             machine-readable output
  --quiet            check: exit code only, no output
  -h, --help         show this help
  -v, --version      print version

Data: RGAA 4.1.2 \xA9 DINUM, Licence Ouverte / Etalab 2.0 (see NOTICE).`;
var COMMANDS = ["audit", "report", "criteria", "check", "verify"];
function isCommand(s) {
  return !!s && COMMANDS.includes(s);
}
var VALUE_FLAGS = /* @__PURE__ */ new Set(["out", "in", "include", "exclude", "report", "theme", "apply", "max-verify", "lang"]);
function parseArgs(argv) {
  const [command, ...rest] = argv;
  const positionals = [];
  const flags = {};
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      if (VALUE_FLAGS.has(key)) flags[key] = rest[++i] ?? "";
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
  return flags["lang"] === "en" ? "en" : "fr";
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
  const result = runAudit({
    inputs,
    stdin,
    forceJsx: p.flags["jsx"] === true,
    include: asList(p.flags["include"]),
    exclude: asList(p.flags["exclude"])
  });
  const out = typeof p.flags["out"] === "string" ? p.flags["out"] : "audits";
  try {
    mkdirSync(out, { recursive: true });
    writeFileSync(join2(out, "audit-latest.json"), JSON.stringify(result, null, 2) + "\n");
  } catch {
  }
  if (p.flags["json"]) console.log(JSON.stringify(result, null, 2));
  else console.log(auditSummary(result, langOf(p.flags)));
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
  switch (p.command) {
    case "audit":
      return cmdAudit(p);
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
    (code) => process.exit(code),
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
