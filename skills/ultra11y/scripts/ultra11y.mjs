#!/usr/bin/env node

// src/cli.ts
import { realpathSync, writeFileSync as writeFileSync4, mkdirSync as mkdirSync3 } from "fs";
import { join as join5 } from "path";
import { fileURLToPath, pathToFileURL } from "url";

// src/types.ts
var VERSION = "1.3.0";
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
      ruleIds: [
        "contrast-literal"
      ]
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
      automatability: "static",
      ruleIds: [
        "layout-table-data-markup"
      ]
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
      ruleIds: [
        "lang-invalid"
      ]
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
      ruleIds: [
        "lang-invalid"
      ]
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
      automatability: "static",
      ruleIds: [
        "list-structure"
      ]
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
      ruleIds: [
        "meta-viewport-zoom-block"
      ]
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
        "placeholder-as-label",
        "form-field-multiple-labels",
        "select-has-option"
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
      automatability: "static",
      ruleIds: [
        "fieldset-legend-missing"
      ]
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
function getCriterion(id) {
  return byId.get(id);
}
function hasCriterion(id) {
  return byId.has(id);
}
function listTheme(n) {
  return data.criteria.filter((c) => c.theme === n);
}

// node_modules/.pnpm/entities@7.0.1/node_modules/entities/dist/esm/decode-codepoint.js
var _a;
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
var fromCodePoint = (
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, n/no-unsupported-features/es-builtins
  (_a = String.fromCodePoint) !== null && _a !== void 0 ? _a : ((codePoint) => {
    let output = "";
    if (codePoint > 65535) {
      codePoint -= 65536;
      output += String.fromCharCode(codePoint >>> 10 & 1023 | 55296);
      codePoint = 56320 | codePoint & 1023;
    }
    output += String.fromCharCode(codePoint);
    return output;
  })
);
function replaceCodePoint(codePoint) {
  var _a3;
  if (codePoint >= 55296 && codePoint <= 57343 || codePoint > 1114111) {
    return 65533;
  }
  return (_a3 = decodeMap.get(codePoint)) !== null && _a3 !== void 0 ? _a3 : codePoint;
}

// node_modules/.pnpm/entities@7.0.1/node_modules/entities/dist/esm/internal/decode-shared.js
function decodeBase64(input) {
  const binary = (
    // eslint-disable-next-line n/no-unsupported-features/node-builtins
    typeof atob === "function" ? (
      // Browser (and Node >=16)
      // eslint-disable-next-line n/no-unsupported-features/node-builtins
      atob(input)
    ) : (
      // Older Node versions (<16)
      // eslint-disable-next-line n/no-unsupported-features/node-builtins
      typeof Buffer.from === "function" ? (
        // eslint-disable-next-line n/no-unsupported-features/node-builtins
        Buffer.from(input, "base64").toString("binary")
      ) : (
        // eslint-disable-next-line unicorn/no-new-buffer, n/no-deprecated-api
        new Buffer(input, "base64").toString("binary")
      )
    )
  );
  const evenLength = binary.length & ~1;
  const out = new Uint16Array(evenLength / 2);
  for (let index = 0, outIndex = 0; index < evenLength; index += 2) {
    const lo = binary.charCodeAt(index);
    const hi = binary.charCodeAt(index + 1);
    out[outIndex++] = lo | hi << 8;
  }
  return out;
}

// node_modules/.pnpm/entities@7.0.1/node_modules/entities/dist/esm/generated/decode-data-html.js
var htmlDecodeTree = /* @__PURE__ */ decodeBase64("QR08ALkAAgH6AYsDNQR2BO0EPgXZBQEGLAbdBxMISQrvCmQLfQurDKQNLw4fD4YPpA+6D/IPAAAAAAAAAAAAAAAAKhBMEY8TmxUWF2EYLBkxGuAa3RsJHDscWR8YIC8jSCSIJcMl6ie3Ku8rEC0CLjoupS7kLgAIRU1hYmNmZ2xtbm9wcnN0dVQAWgBeAGUAaQBzAHcAfgCBAIQAhwCSAJoAoACsALMAbABpAGcAO4DGAMZAUAA7gCYAJkBjAHUAdABlADuAwQDBQHIiZXZlAAJhAAFpeW0AcgByAGMAO4DCAMJAEGRyAADgNdgE3XIAYQB2AGUAO4DAAMBA8CFoYZFj4SFjcgBhZAAAoFMqAAFncIsAjgBvAG4ABGFmAADgNdg43fAlbHlGdW5jdGlvbgCgYSBpAG4AZwA7gMUAxUAAAWNzpACoAHIAAOA12Jzc6SFnbgCgVCJpAGwAZABlADuAwwDDQG0AbAA7gMQAxEAABGFjZWZvcnN1xQDYANoA7QDxAPYA+QD8AAABY3LJAM8AayNzbGFzaAAAoBYidgHTANUAAKDnKmUAZAAAoAYjeQARZIABY3J0AOAA5QDrAGEidXNlAACgNSLuI291bGxpcwCgLCFhAJJjcgAA4DXYBd1wAGYAAOA12Dnd5SF2ZdhiYwDyAOoAbSJwZXEAAKBOIgAHSE9hY2RlZmhpbG9yc3UXARoBHwE6AVIBVQFiAWQBZgGCAakB6QHtAfIBYwB5ACdkUABZADuAqQCpQIABY3B5ACUBKAE1AfUhdGUGYWmg0iJ0KGFsRGlmZmVyZW50aWFsRAAAoEUhbCJleXMAAKAtIQACYWVpb0EBRAFKAU0B8iFvbgxhZABpAGwAO4DHAMdAcgBjAAhhbiJpbnQAAKAwIm8AdAAKYQABZG5ZAV0BaSJsbGEAuGB0I2VyRG90ALdg8gA5AWkAp2NyImNsZQAAAkRNUFRwAXQBeQF9AW8AdAAAoJkiaSJudXMAAKCWIuwhdXMAoJUiaSJtZXMAAKCXIm8AAAFjc4cBlAFrKndpc2VDb250b3VySW50ZWdyYWwAAKAyImUjQ3VybHkAAAFEUZwBpAFvJXVibGVRdW90ZQAAoB0gdSJvdGUAAKAZIAACbG5wdbABtgHNAdgBbwBuAGWgNyIAoHQqgAFnaXQAvAHBAcUB8iJ1ZW50AKBhIm4AdAAAoC8i7yV1ckludGVncmFsAKAuIgABZnLRAdMBAKACIe8iZHVjdACgECJuLnRlckNsb2Nrd2lzZUNvbnRvdXJJbnRlZ3JhbAAAoDMi7yFzcwCgLypjAHIAAOA12J7ccABDoNMiYQBwAACgTSKABURKU1phY2VmaW9zAAsCEgIVAhgCGwIsAjQCOQI9AnMCfwNvoEUh9CJyYWhkAKARKWMAeQACZGMAeQAFZGMAeQAPZIABZ3JzACECJQIoAuchZXIAoCEgcgAAoKEhaAB2AACg5CoAAWF5MAIzAvIhb24OYRRkbAB0oAciYQCUY3IAAOA12AfdAAFhZkECawIAAWNtRQJnAvIjaXRpY2FsAAJBREdUUAJUAl8CYwJjInV0ZQC0YG8AdAFZAloC2WJiJGxlQWN1dGUA3WJyImF2ZQBgYGkibGRlANxi7yFuZACgxCJmJWVyZW50aWFsRAAAoEYhcAR9AgAAAAAAAIECjgIAABoDZgAA4DXYO91EoagAhQKJAm8AdAAAoNwgcSJ1YWwAAKBQIuIhbGUAA0NETFJVVpkCqAK1Au8C/wIRA28AbgB0AG8AdQByAEkAbgB0AGUAZwByAGEA7ADEAW8AdAKvAgAAAACwAqhgbiNBcnJvdwAAoNMhAAFlb7kC0AJmAHQAgAFBUlQAwQLGAs0CciJyb3cAAKDQIekkZ2h0QXJyb3cAoNQhZQDlACsCbgBnAAABTFLWAugC5SFmdAABQVLcAuECciJyb3cAAKD4J+kkZ2h0QXJyb3cAoPon6SRnaHRBcnJvdwCg+SdpImdodAAAAUFU9gL7AnIicm93AACg0iFlAGUAAKCoInAAQQIGAwAAAAALA3Iicm93AACg0SFvJHduQXJyb3cAAKDVIWUlcnRpY2FsQmFyAACgJSJuAAADQUJMUlRhJAM2AzoDWgNxA3oDciJyb3cAAKGTIUJVLAMwA2EAcgAAoBMpcCNBcnJvdwAAoPUhciJldmUAEWPlIWZ00gJDAwAASwMAAFIDaSVnaHRWZWN0b3IAAKBQKWUkZVZlY3RvcgAAoF4p5SJjdG9yQqC9IWEAcgAAoFYpaSJnaHQA1AFiAwAAaQNlJGVWZWN0b3IAAKBfKeUiY3RvckKgwSFhAHIAAKBXKWUAZQBBoKQiciJyb3cAAKCnIXIAcgBvAPcAtAIAAWN0gwOHA3IAAOA12J/c8iFvaxBhAAhOVGFjZGZnbG1vcHFzdHV4owOlA6kDsAO/A8IDxgPNA9ID8gP9AwEEFAQeBCAEJQRHAEphSAA7gNAA0EBjAHUAdABlADuAyQDJQIABYWl5ALYDuQO+A/Ihb24aYXIAYwA7gMoAykAtZG8AdAAWYXIAAOA12AjdcgBhAHYAZQA7gMgAyEDlIm1lbnQAoAgiAAFhcNYD2QNjAHIAEmF0AHkAUwLhAwAAAADpA20lYWxsU3F1YXJlAACg+yVlJ3J5U21hbGxTcXVhcmUAAKCrJQABZ3D2A/kDbwBuABhhZgAA4DXYPN3zImlsb26VY3UAAAFhaQYEDgRsAFSgdSppImxkZQAAoEIi7CNpYnJpdW0AoMwhAAFjaRgEGwRyAACgMCFtAACgcyphAJdjbQBsADuAywDLQAABaXApBC0E8yF0cwCgAyLvJG5lbnRpYWxFAKBHIYACY2Zpb3MAPQQ/BEMEXQRyBHkAJGRyAADgNdgJ3WwibGVkAFMCTAQAAAAAVARtJWFsbFNxdWFyZQAAoPwlZSdyeVNtYWxsU3F1YXJlAACgqiVwA2UEAABpBAAAAABtBGYAAOA12D3dwSFsbACgACLyI2llcnRyZgCgMSFjAPIAcQQABkpUYWJjZGZnb3JzdIgEiwSOBJMElwSkBKcEqwStBLIE5QTqBGMAeQADZDuAPgA+QO0hbWFkoJMD3GNyImV2ZQAeYYABZWl5AJ0EoASjBOQhaWwiYXIAYwAcYRNkbwB0ACBhcgAA4DXYCt0AoNkicABmAADgNdg+3eUiYXRlcgADRUZHTFNUvwTIBM8E1QTZBOAEcSJ1YWwATKBlIuUhc3MAoNsidSRsbEVxdWFsAACgZyJyI2VhdGVyAACgoirlIXNzAKB3IuwkYW50RXF1YWwAoH4qaSJsZGUAAKBzImMAcgAA4DXYotwAoGsiAARBYWNmaW9zdfkE/QQFBQgFCwUTBSIFKwVSIkRjeQAqZAABY3QBBQQFZQBrAMdiXmDpIXJjJGFyAACgDCFsJWJlcnRTcGFjZQAAoAsh8AEYBQAAGwVmAACgDSHpJXpvbnRhbExpbmUAoAAlAAFjdCYFKAXyABIF8iFvayZhbQBwAEQBMQU5BW8AdwBuAEgAdQBtAPAAAAFxInVhbAAAoE8iAAdFSk9hY2RmZ21ub3N0dVMFVgVZBVwFYwVtBXAFcwV6BZAFtgXFBckFzQVjAHkAFWTsIWlnMmFjAHkAAWRjAHUAdABlADuAzQDNQAABaXlnBWwFcgBjADuAzgDOQBhkbwB0ADBhcgAAoBEhcgBhAHYAZQA7gMwAzEAAoREhYXB/BYsFAAFjZ4MFhQVyACphaSNuYXJ5SQAAoEghbABpAGUA8wD6AvQBlQUAAKUFZaAsIgABZ3KaBZ4F8iFhbACgKyLzI2VjdGlvbgCgwiJpI3NpYmxlAAABQ1SsBbEFbyJtbWEAAKBjIGkibWVzAACgYiCAAWdwdAC8Bb8FwwVvAG4ALmFmAADgNdhA3WEAmWNjAHIAAKAQIWkibGRlAChh6wHSBQAA1QVjAHkABmRsADuAzwDPQIACY2Zvc3UA4QXpBe0F8gX9BQABaXnlBegFcgBjADRhGWRyAADgNdgN3XAAZgAA4DXYQd3jAfcFAAD7BXIAAOA12KXc8iFjeQhk6yFjeQRkgANISmFjZm9zAAwGDwYSBhUGHQYhBiYGYwB5ACVkYwB5AAxk8CFwYZpjAAFleRkGHAbkIWlsNmEaZHIAAOA12A7dcABmAADgNdhC3WMAcgAA4DXYptyABUpUYWNlZmxtb3N0AD0GQAZDBl4GawZkB2gHcAd0B80H2gdjAHkACWQ7gDwAPECAAmNtbnByAEwGTwZSBlUGWwb1IXRlOWHiIWRhm2NnAACg6ifsI2FjZXRyZgCgEiFyAACgniGAAWFleQBkBmcGagbyIW9uPWHkIWlsO2EbZAABZnNvBjQHdAAABUFDREZSVFVWYXKABp4GpAbGBssG3AYDByEHwQIqBwABbnKEBowGZyVsZUJyYWNrZXQAAKDoJ/Ihb3cAoZAhQlKTBpcGYQByAACg5CHpJGdodEFycm93AKDGIWUjaWxpbmcAAKAII28A9QGqBgAAsgZiJWxlQnJhY2tldAAAoOYnbgDUAbcGAAC+BmUkZVZlY3RvcgAAoGEp5SJjdG9yQqDDIWEAcgAAoFkpbCJvb3IAAKAKI2kiZ2h0AAABQVbSBtcGciJyb3cAAKCUIeUiY3RvcgCgTikAAWVy4AbwBmUAAKGjIkFW5gbrBnIicm93AACgpCHlImN0b3IAoFopaSNhbmdsZQBCorIi+wYAAAAA/wZhAHIAAKDPKXEidWFsAACgtCJwAIABRFRWAAoHEQcYB+8kd25WZWN0b3IAoFEpZSRlVmVjdG9yAACgYCnlImN0b3JCoL8hYQByAACgWCnlImN0b3JCoLwhYQByAACgUilpAGcAaAB0AGEAcgByAG8A9wDMAnMAAANFRkdMU1Q/B0cHTgdUB1gHXwfxJXVhbEdyZWF0ZXIAoNoidSRsbEVxdWFsAACgZiJyI2VhdGVyAACgdiLlIXNzAKChKuwkYW50RXF1YWwAoH0qaSJsZGUAAKByInIAAOA12A/dZaDYIuYjdGFycm93AKDaIWkiZG90AD9hgAFucHcAege1B7kHZwAAAkxSbHKCB5QHmwerB+UhZnQAAUFSiAeNB3Iicm93AACg9SfpJGdodEFycm93AKD3J+kkZ2h0QXJyb3cAoPYn5SFmdAABYXLcAqEHaQBnAGgAdABhAHIAcgBvAPcA5wJpAGcAaAB0AGEAcgByAG8A9wDuAmYAAOA12EPdZQByAAABTFK/B8YHZSRmdEFycm93AACgmSHpJGdodEFycm93AKCYIYABY2h0ANMH1QfXB/IAWgYAoLAh8iFva0FhAKBqIgAEYWNlZmlvc3XpB+wH7gf/BwMICQgOCBEIcAAAoAUpeQAcZAABZGzyB/kHaSR1bVNwYWNlAACgXyBsI2ludHJmAACgMyFyAADgNdgQ3e4jdXNQbHVzAKATInAAZgAA4DXYRN1jAPIA/gecY4AESmFjZWZvc3R1ACEIJAgoCDUIgQiFCDsKQApHCmMAeQAKZGMidXRlAENhgAFhZXkALggxCDQI8iFvbkdh5CFpbEVhHWSAAWdzdwA7CGEIfQjhInRpdmWAAU1UVgBECEwIWQhlJWRpdW1TcGFjZQAAoAsgaABpAAABY25SCFMIawBTAHAAYQBjAOUASwhlAHIAeQBUAGgAaQDuAFQI9CFlZAABR0xnCHUIcgBlAGEAdABlAHIARwByAGUAYQB0AGUA8gDrBGUAcwBzAEwAZQBzAPMA2wdMImluZQAKYHIAAOA12BHdAAJCbnB0jAiRCJkInAhyImVhawAAoGAgwiZyZWFraW5nU3BhY2WgYGYAAKAVIUOq7CqzCMIIzQgAAOcIGwkAAAAAAAAtCQAAbwkAAIcJAACdCcAJGQoAADQKAAFvdbYIvAjuI2dydWVudACgYiJwIkNhcAAAoG0ibyh1YmxlVmVydGljYWxCYXIAAKAmIoABbHF4ANII1wjhCOUibWVudACgCSL1IWFsVKBgImkibGRlAADgQiI4A2kic3RzAACgBCJyI2VhdGVyAACjbyJFRkdMU1T1CPoIAgkJCQ0JFQlxInVhbAAAoHEidSRsbEVxdWFsAADgZyI4A3IjZWF0ZXIAAOBrIjgD5SFzcwCgeSLsJGFudEVxdWFsAOB+KjgDaSJsZGUAAKB1IvUhbXBEASAJJwnvI3duSHVtcADgTiI4A3EidWFsAADgTyI4A2UAAAFmczEJRgn0JFRyaWFuZ2xlQqLqIj0JAAAAAEIJYQByAADgzyk4A3EidWFsAACg7CJzAICibiJFR0xTVABRCVYJXAlhCWkJcSJ1YWwAAKBwInIjZWF0ZXIAAKB4IuUhc3MA4GoiOAPsJGFudEVxdWFsAOB9KjgDaSJsZGUAAKB0IuUic3RlZAABR0x1CX8J8iZlYXRlckdyZWF0ZXIA4KIqOAPlI3NzTGVzcwDgoSo4A/IjZWNlZGVzAKGAIkVTjwmVCXEidWFsAADgryo4A+wkYW50RXF1YWwAoOAiAAFlaaAJqQl2JmVyc2VFbGVtZW50AACgDCLnJWh0VHJpYW5nbGVCousitgkAAAAAuwlhAHIAAODQKTgDcSJ1YWwAAKDtIgABcXXDCeAJdSNhcmVTdQAAAWJwywnVCfMhZXRF4I8iOANxInVhbAAAoOIi5SJyc2V0ReCQIjgDcSJ1YWwAAKDjIoABYmNwAOYJ8AkNCvMhZXRF4IIi0iBxInVhbAAAoIgi4yJlZWRzgKGBIkVTVAD6CQAKBwpxInVhbAAA4LAqOAPsJGFudEVxdWFsAKDhImkibGRlAADgfyI4A+UicnNldEXggyLSIHEidWFsAACgiSJpImxkZQCAoUEiRUZUACIKJwouCnEidWFsAACgRCJ1JGxsRXF1YWwAAKBHImkibGRlAACgSSJlJXJ0aWNhbEJhcgAAoCQiYwByAADgNdip3GkAbABkAGUAO4DRANFAnWMAB0VhY2RmZ21vcHJzdHV2XgphCmgKcgp2CnoKgQqRCpYKqwqtCrsKyArNCuwhaWdSYWMAdQB0AGUAO4DTANNAAAFpeWwKcQpyAGMAO4DUANRAHmRiImxhYwBQYXIAAOA12BLdcgBhAHYAZQA7gNIA0kCAAWFlaQCHCooKjQpjAHIATGFnAGEAqWNjInJvbgCfY3AAZgAA4DXYRt3lI25DdXJseQABRFGeCqYKbyV1YmxlUXVvdGUAAKAcIHUib3RlAACgGCAAoFQqAAFjbLEKtQpyAADgNdiq3GEAcwBoADuA2ADYQGkAbAHACsUKZABlADuA1QDVQGUAcwAAoDcqbQBsADuA1gDWQGUAcgAAAUJQ0wrmCgABYXLXCtoKcgAAoD4gYQBjAAABZWvgCuIKAKDeI2UAdAAAoLQjYSVyZW50aGVzaXMAAKDcI4AEYWNmaGlsb3JzAP0KAwsFCwkLCwsMCxELIwtaC3IjdGlhbEQAAKACInkAH2RyAADgNdgT3WkApmOgY/Ujc01pbnVzsWAAAWlwFQsgC24AYwBhAHIAZQBwAGwAYQBuAOUACgVmAACgGSGAobsqZWlvACoLRQtJC+MiZWRlc4CheiJFU1QANAs5C0ALcSJ1YWwAAKCvKuwkYW50RXF1YWwAoHwiaSJsZGUAAKB+Im0AZQAAoDMgAAFkcE0LUQv1IWN0AKAPIm8jcnRpb24AYaA3ImwAAKAdIgABY2leC2ILcgAA4DXYq9yoYwACVWZvc2oLbwtzC3cLTwBUADuAIgAiQHIAAOA12BTdcABmAACgGiFjAHIAAOA12KzcAAZCRWFjZWZoaW9yc3WPC5MLlwupC7YL2AvbC90LhQyTDJoMowzhIXJyAKAQKUcAO4CuAK5AgAFjbnIAnQugC6ML9SF0ZVRhZwAAoOsncgB0oKAhbAAAoBYpgAFhZXkArwuyC7UL8iFvblhh5CFpbFZhIGR2oBwhZSJyc2UAAAFFVb8LzwsAAWxxwwvIC+UibWVudACgCyL1JGlsaWJyaXVtAKDLIXAmRXF1aWxpYnJpdW0AAKBvKXIAAKAcIW8AoWPnIWh0AARBQ0RGVFVWYewLCgwQDDIMNwxeDHwM9gIAAW5y8Av4C2clbGVCcmFja2V0AACg6SfyIW93AKGSIUJM/wsDDGEAcgAAoOUhZSRmdEFycm93AACgxCFlI2lsaW5nAACgCSNvAPUBFgwAAB4MYiVsZUJyYWNrZXQAAKDnJ24A1AEjDAAAKgxlJGVWZWN0b3IAAKBdKeUiY3RvckKgwiFhAHIAAKBVKWwib29yAACgCyMAAWVyOwxLDGUAAKGiIkFWQQxGDHIicm93AACgpiHlImN0b3IAoFspaSNhbmdsZQBCorMiVgwAAAAAWgxhAHIAAKDQKXEidWFsAACgtSJwAIABRFRWAGUMbAxzDO8kd25WZWN0b3IAoE8pZSRlVmVjdG9yAACgXCnlImN0b3JCoL4hYQByAACgVCnlImN0b3JCoMAhYQByAACgUykAAXB1iQyMDGYAAKAdIe4kZEltcGxpZXMAoHAp6SRnaHRhcnJvdwCg2yEAAWNongyhDHIAAKAbIQCgsSHsJGVEZWxheWVkAKD0KYAGSE9hY2ZoaW1vcXN0dQC/DMgMzAzQDOIM5gwKDQ0NFA0ZDU8NVA1YDQABQ2PDDMYMyCFjeSlkeQAoZEYiVGN5ACxkYyJ1dGUAWmEAorwqYWVpedgM2wzeDOEM8iFvbmBh5CFpbF5hcgBjAFxhIWRyAADgNdgW3e8hcnQAAkRMUlXvDPYM/QwEDW8kd25BcnJvdwAAoJMhZSRmdEFycm93AACgkCHpJGdodEFycm93AKCSIXAjQXJyb3cAAKCRIechbWGjY+EkbGxDaXJjbGUAoBgicABmAADgNdhK3XICHw0AAAAAIg10AACgGiLhIXJlgKGhJUlTVQAqDTINSg3uJXRlcnNlY3Rpb24AoJMidQAAAWJwNw1ADfMhZXRFoI8icSJ1YWwAAKCRIuUicnNldEWgkCJxInVhbAAAoJIibiJpb24AAKCUImMAcgAA4DXYrtxhAHIAAKDGIgACYmNtcF8Nag2ODZANc6DQImUAdABFoNAicSJ1YWwAAKCGIgABY2huDYkNZSJlZHMAgKF7IkVTVAB4DX0NhA1xInVhbAAAoLAq7CRhbnRFcXVhbACgfSJpImxkZQAAoH8iVABoAGEA9ADHCwCgESIAodEiZXOVDZ8NciJzZXQARaCDInEidWFsAACghyJlAHQAAKDRIoAFSFJTYWNmaGlvcnMAtQ27Db8NyA3ODdsN3w3+DRgOHQ4jDk8AUgBOADuA3gDeQMEhREUAoCIhAAFIY8MNxg1jAHkAC2R5ACZkAAFidcwNzQ0JYKRjgAFhZXkA1A3XDdoN8iFvbmRh5CFpbGJhImRyAADgNdgX3QABZWnjDe4N8gHoDQAA7Q3lImZvcmUAoDQiYQCYYwABY27yDfkNayNTcGFjZQAA4F8gCiDTInBhY2UAoAkg7CFkZYChPCJFRlQABw4MDhMOcSJ1YWwAAKBDInUkbGxFcXVhbAAAoEUiaSJsZGUAAKBIInAAZgAA4DXYS93pI3BsZURvdACg2yAAAWN0Jw4rDnIAAOA12K/c8iFva2Zh4QpFDlYOYA5qDgAAbg5yDgAAAAAAAAAAAAB5DnwOqA6zDgAADg8RDxYPGg8AAWNySA5ODnUAdABlADuA2gDaQHIAb6CfIeMhaXIAoEkpcgDjAVsOAABdDnkADmR2AGUAbGEAAWl5Yw5oDnIAYwA7gNsA20AjZGIibGFjAHBhcgAA4DXYGN1yAGEAdgBlADuA2QDZQOEhY3JqYQABZGl/Dp8OZQByAAABQlCFDpcOAAFhcokOiw5yAF9gYQBjAAABZWuRDpMOAKDfI2UAdAAAoLUjYSVyZW50aGVzaXMAAKDdI28AbgBQoMMi7CF1cwCgjiIAAWdwqw6uDm8AbgByYWYAAOA12EzdAARBREVUYWRwc78O0g7ZDuEOBQPqDvMOBw9yInJvdwDCoZEhyA4AAMwOYQByAACgEilvJHduQXJyb3cAAKDFIW8kd25BcnJvdwAAoJUhcSV1aWxpYnJpdW0AAKBuKWUAZQBBoKUiciJyb3cAAKClIW8AdwBuAGEAcgByAG8A9wAQA2UAcgAAAUxS+Q4AD2UkZnRBcnJvdwAAoJYh6SRnaHRBcnJvdwCglyFpAGyg0gNvAG4ApWPpIW5nbmFjAHIAAOA12LDcaSJsZGUAaGFtAGwAO4DcANxAgAREYmNkZWZvc3YALQ8xDzUPNw89D3IPdg97D4AP4SFzaACgqyJhAHIAAKDrKnkAEmThIXNobKCpIgCg5ioAAWVyQQ9DDwCgwSKAAWJ0eQBJD00Paw9hAHIAAKAWIGmgFiDjIWFsAAJCTFNUWA9cD18PZg9hAHIAAKAjIukhbmV8YGUkcGFyYXRvcgAAoFgnaSJsZGUAAKBAItQkaGluU3BhY2UAoAogcgAA4DXYGd1wAGYAAOA12E3dYwByAADgNdix3GQiYXNoAACgqiKAAmNlZm9zAI4PkQ+VD5kPng/pIXJjdGHkIWdlAKDAInIAAOA12BrdcABmAADgNdhO3WMAcgAA4DXYstwAAmZpb3OqD64Prw+0D3IAAOA12BvdnmNwAGYAAOA12E/dYwByAADgNdiz3IAEQUlVYWNmb3N1AMgPyw/OD9EP2A/gD+QP6Q/uD2MAeQAvZGMAeQAHZGMAeQAuZGMAdQB0AGUAO4DdAN1AAAFpedwP3w9yAGMAdmErZHIAAOA12BzdcABmAADgNdhQ3WMAcgAA4DXYtNxtAGwAeGEABEhhY2RlZm9z/g8BEAUQDRAQEB0QIBAkEGMAeQAWZGMidXRlAHlhAAFheQkQDBDyIW9ufWEXZG8AdAB7YfIBFRAAABwQbwBXAGkAZAB0AOgAVAhhAJZjcgAAoCghcABmAACgJCFjAHIAAOA12LXc4QtCEEkQTRAAAGcQbRByEAAAAAAAAAAAeRCKEJcQ8hD9EAAAGxEhETIROREAAD4RYwB1AHQAZQA7gOEA4UByImV2ZQADYYCiPiJFZGl1eQBWEFkQWxBgEGUQAOA+IjMDAKA/InIAYwA7gOIA4kB0AGUAO4C0ALRAMGRsAGkAZwA7gOYA5kByoGEgAOA12B7dcgBhAHYAZQA7gOAA4EAAAWVwfBCGEAABZnCAEIQQ8yF5bQCgNSHoAIMQaABhALFjAAFhcI0QWwAAAWNskRCTEHIAAWFnAACgPypkApwQAAAAALEQAKInImFkc3ajEKcQqRCuEG4AZAAAoFUqAKBcKmwib3BlAACgWCoAoFoqAKMgImVsbXJzersQvRDAEN0Q5RDtEACgpCllAACgICJzAGQAYaAhImEEzhDQENIQ1BDWENgQ2hDcEACgqCkAoKkpAKCqKQCgqykAoKwpAKCtKQCgrikAoK8pdAB2oB8iYgBkoL4iAKCdKQABcHTpEOwQaAAAoCIixWDhIXJyAKB8IwABZ3D1EPgQbwBuAAVhZgAA4DXYUt0Ao0giRWFlaW9wBxEJEQ0RDxESERQRAKBwKuMhaXIAoG8qAKBKImQAAKBLInMAJ2DyIW94ZaBIIvEADhFpAG4AZwA7gOUA5UCAAWN0eQAmESoRKxFyAADgNdi23CpgbQBwAGWgSCLxAPgBaQBsAGQAZQA7gOMA40BtAGwAO4DkAORAAAFjaUERRxFvAG4AaQBuAPQA6AFuAHQAAKARKgAITmFiY2RlZmlrbG5vcHJzdWQRaBGXEZ8RpxGrEdIR1hErEjASexKKEn0RThNbE3oTbwB0AACg7SoAAWNybBGJEWsAAAJjZXBzdBF4EX0RghHvIW5nAKBMInAjc2lsb24A9mNyImltZQAAoDUgaQBtAGWgPSJxAACgzSJ2AY0RkRFlAGUAAKC9ImUAZABnoAUjZQAAoAUjcgBrAHSgtSPiIXJrAKC2IwABb3mjEaYRbgDnAHcRMWTxIXVvAKAeIIACY21wcnQAtBG5Eb4RwRHFEeEhdXPloDUi5ABwInR5dgAAoLApcwDpAH0RbgBvAPUA6gCAAWFodwDLEcwRzhGyYwCgNiHlIWVuAKBsInIAAOA12B/dZwCAA2Nvc3R1dncA4xHyEQUSEhIhEiYSKRKAAWFpdQDpEesR7xHwAKMFcgBjAACg7yVwAACgwyKAAWRwdAD4EfwRABJvAHQAAKAAKuwhdXMAoAEqaSJtZXMAAKACKnECCxIAAAAADxLjIXVwAKAGKmEAcgAAoAUm8iNpYW5nbGUAAWR1GhIeEu8hd24AoL0lcAAAoLMlcCJsdXMAAKAEKmUA5QBCD+UAkg9hInJvdwAAoA0pgAFha28ANhJoEncSAAFjbjoSZRJrAIABbHN0AEESRxJNEm8jemVuZ2UAAKDrKXEAdQBhAHIA5QBcBPIjaWFuZ2xlgKG0JWRscgBYElwSYBLvIXduAKC+JeUhZnQAoMIlaSJnaHQAAKC4JWsAAKAjJLEBbRIAAHUSsgFxEgAAcxIAoJIlAKCRJTQAAKCTJWMAawAAoIglAAFlb38ShxJx4D0A5SD1IWl2AOBhIuUgdAAAoBAjAAJwdHd4kRKVEpsSnxJmAADgNdhT3XSgpSJvAG0AAKClIvQhaWUAoMgiAAZESFVWYmRobXB0dXayEsES0RLgEvcS+xIKExoTHxMjEygTNxMAAkxSbHK5ErsSvRK/EgCgVyUAoFQlAKBWJQCgUyUAolAlRFVkdckSyxLNEs8SAKBmJQCgaSUAoGQlAKBnJQACTFJsctgS2hLcEt4SAKBdJQCgWiUAoFwlAKBZJQCjUSVITFJobHLrEu0S7xLxEvMS9RIAoGwlAKBjJQCgYCUAoGslAKBiJQCgXyVvAHgAAKDJKQACTFJscgITBBMGEwgTAKBVJQCgUiUAoBAlAKAMJQCiACVEVWR1EhMUExYTGBMAoGUlAKBoJQCgLCUAoDQlaSJudXMAAKCfIuwhdXMAoJ4iaSJtZXMAAKCgIgACTFJsci8TMRMzEzUTAKBbJQCgWCUAoBglAKAUJQCjAiVITFJobHJCE0QTRhNIE0oTTBMAoGolAKBhJQCgXiUAoDwlAKAkJQCgHCUAAWV2UhNVE3YA5QD5AGIAYQByADuApgCmQAACY2Vpb2ITZhNqE24TcgAA4DXYt9xtAGkAAKBPIG0A5aA9IogRbAAAoVwAYmh0E3YTAKDFKfMhdWIAoMgnbAF+E4QTbABloCIgdAAAoCIgcAAAoU4iRWWJE4sTAKCuKvGgTyI8BeEMqRMAAN8TABQDFB8UAAAjFDQUAAAAAIUUAAAAAI0UAAAAANcU4xT3FPsUAACIFQAAlhWAAWNwcgCuE7ET1RP1IXRlB2GAoikiYWJjZHMAuxO/E8QTzhPSE24AZAAAoEQqciJjdXAAAKBJKgABYXXIE8sTcAAAoEsqcAAAoEcqbwB0AACgQCoA4CkiAP4AAWVv2RPcE3QAAKBBIO4ABAUAAmFlaXXlE+8T9RP4E/AB6hMAAO0TcwAAoE0qbwBuAA1hZABpAGwAO4DnAOdAcgBjAAlhcABzAHOgTCptAACgUCpvAHQAC2GAAWRtbgAIFA0UEhRpAGwAO4C4ALhAcCJ0eXYAAKCyKXQAAIGiADtlGBQZFKJAcgBkAG8A9ABiAXIAAOA12CDdgAFjZWkAKBQqFDIUeQBHZGMAawBtoBMn4SFyawCgEyfHY3IAAKPLJUVjZWZtcz8UQRRHFHcUfBSAFACgwykAocYCZWxGFEkUcQAAoFciZQBhAlAUAAAAAGAUciJyb3cAAAFsclYUWhTlIWZ0AKC6IWkiZ2h0AACguyGAAlJTYWNkAGgUaRRrFG8UcxSuYACgyCRzAHQAAKCbIukhcmMAoJoi4SFzaACgnSJuImludAAAoBAqaQBkAACg7yrjIWlyAKDCKfUhYnN1oGMmaQB0AACgYybsApMUmhS2FAAAwxRvAG4AZaA6APGgVCKrAG0CnxQAAAAAoxRhAHSgLABAYAChASJmbKcUqRTuABMNZQAAAW14rhSyFOUhbnQAoAEiZQDzANIB5wG6FAAAwBRkoEUibwB0AACgbSpuAPQAzAGAAWZyeQDIFMsUzhQA4DXYVN1vAOQA1wEAgakAO3MeAdMUcgAAoBchAAFhb9oU3hRyAHIAAKC1IXMAcwAAoBcnAAFjdeYU6hRyAADgNdi43AABYnDuFPIUZaDPKgCg0SploNAqAKDSKuQhb3QAoO8igANkZWxwcnZ3AAYVEBUbFSEVRBVlFYQV4SFycgABbHIMFQ4VAKA4KQCgNSlwAhYVAAAAABkVcgAAoN4iYwAAoN8i4SFycnCgtiEAoD0pgKIqImJjZG9zACsVMBU6FT4VQRVyImNhcAAAoEgqAAFhdTQVNxVwAACgRipwAACgSipvAHQAAKCNInIAAKBFKgDgKiIA/gACYWxydksVURVuFXMVcgByAG2gtyEAoDwpeQCAAWV2dwBYFWUVaRVxAHACXxUAAAAAYxVyAGUA4wAXFXUA4wAZFWUAZQAAoM4iZSJkZ2UAAKDPImUAbgA7gKQApEBlI2Fycm93AAABbHJ7FX8V5SFmdACgtiFpImdodAAAoLchZQDkAG0VAAFjaYsVkRVvAG4AaQBuAPQAkwFuAHQAAKAxImwiY3R5AACgLSOACUFIYWJjZGVmaGlqbG9yc3R1d3oAuBW7Fb8V1RXgFegV+RUKFhUWHxZUFlcWZRbFFtsW7xb7FgUXChdyAPIAtAJhAHIAAKBlKQACZ2xyc8YVyhXOFdAV5yFlcgCgICDlIXRoAKA4IfIA9QxoAHagECAAoKMiawHZFd4VYSJyb3cAAKAPKWEA4wBfAgABYXnkFecV8iFvbg9hNGQAoUYhYW/tFfQVAAFnciEC8RVyAACgyiF0InNlcQAAoHcqgAFnbG0A/xUCFgUWO4CwALBAdABhALRjcCJ0eXYAAKCxKQABaXIOFhIW8yFodACgfykA4DXYId1hAHIAAAFschsWHRYAoMMhAKDCIYACYWVnc3YAKBauAjYWOhY+Fm0AAKHEIm9zLhY0Fm4AZABzoMQi9SFpdACgZiZhIm1tYQDdY2kAbgAAoPIiAKH3AGlvQxZRFmQAZQAAgfcAO29KFksW90BuI3RpbWVzAACgxyJuAPgAUBZjAHkAUmRjAG8CXhYAAAAAYhZyAG4AAKAeI28AcAAAoA0jgAJscHR1dwBuFnEWdRaSFp4W7CFhciRgZgAA4DXYVd0AotkCZW1wc30WhBaJFo0WcQBkoFAibwB0AACgUSJpIm51cwAAoDgi7CF1cwCgFCLxInVhcmUAoKEiYgBsAGUAYgBhAHIAdwBlAGQAZwDlANcAbgCAAWFkaAClFqoWtBZyAHIAbwD3APUMbwB3AG4AYQByAHIAbwB3APMA8xVhI3Jwb29uAAABbHK8FsAWZQBmAPQAHBZpAGcAaAD0AB4WYgHJFs8WawBhAHIAbwD3AJILbwLUFgAAAADYFnIAbgAAoB8jbwBwAACgDCOAAWNvdADhFukW7BYAAXJ55RboFgDgNdi53FVkbAAAoPYp8iFvaxFhAAFkcvMW9xZvAHQAAKDxImkA5qC/JVsSAAFhaP8WAhdyAPIANQNhAPIA1wvhIm5nbGUAoKYpAAFjaQ4XEBd5AF9k5yJyYXJyAKD/JwAJRGFjZGVmZ2xtbm9wcXJzdHV4MRc4F0YXWxcyBF4XaRd5F40XrBe0F78X2RcVGCEYLRg1GEAYAAFEbzUXgRZvAPQA+BUAAWNzPBdCF3UAdABlADuA6QDpQPQhZXIAoG4qAAJhaW95TRdQF1YXWhfyIW9uG2FyAGOgViI7gOoA6kDsIW9uAKBVIk1kbwB0ABdhAAFEcmIXZhdvAHQAAKBSIgDgNdgi3XKhmipuF3QXYQB2AGUAO4DoAOhAZKCWKm8AdAAAoJgqgKGZKmlscwCAF4UXhxfuInRlcnMAoOcjAKATIWSglSpvAHQAAKCXKoABYXBzAJMXlheiF2MAcgATYXQAeQBzogUinxcAAAAAoRdlAHQAAKAFInAAMaADIDMBqRerFwCgBCAAoAUgAAFnc7AXsRdLYXAAAKACIAABZ3C4F7sXbwBuABlhZgAA4DXYVt2AAWFscwDFF8sXzxdyAHOg1SJsAACg4yl1AHMAAKBxKmkAAKG1A2x21RfYF28AbgC1Y/VjAAJjc3V24BfoF/0XEBgAAWlv5BdWF3IAYwAAoFYiaQLuFwAAAADwF+0ADQThIW50AAFnbPUX+Rd0AHIAAKCWKuUhc3MAoJUqgAFhZWkAAxgGGAoYbABzAD1gcwB0AACgXyJ2AESgYSJEAACgeCrwImFyc2wAoOUpAAFEYRkYHRhvAHQAAKBTInIAcgAAoHEpgAFjZGkAJxgqGO0XcgAAoC8hbwD0AIwCAAFhaDEYMhi3YzuA8ADwQAABbXI5GD0YbAA7gOsA60BvAACgrCCAAWNpcABGGEgYSxhsACFgcwD0ACwEAAFlb08YVxhjAHQAYQB0AGkAbwDuABoEbgBlAG4AdABpAGEAbADlADME4Ql1GAAAgRgAAIMYiBgAAAAAoRilGAAAqhgAALsYvhjRGAAA1xgnGWwAbABpAG4AZwBkAG8AdABzAGUA8QBlF3kARGRtImFsZQAAoEAmgAFpbHIAjRiRGJ0Y7CFpZwCgA/tpApcYAAAAAJoYZwAAoAD7aQBnAACgBPsA4DXYI93sIWlnAKAB++whaWcA4GYAagCAAWFsdACvGLIYthh0AACgbSZpAGcAAKAC+24AcwAAoLElbwBmAJJh8AHCGAAAxhhmAADgNdhX3QABYWvJGMwYbADsAGsEdqDUIgCg2SphI3J0aW50AACgDSoAAWFv2hgiGQABY3PeGB8ZsQPnGP0YBRkSGRUZAAAdGbID7xjyGPQY9xj5GAAA+xg7gL0AvUAAoFMhO4C8ALxAAKBVIQCgWSEAoFshswEBGQAAAxkAoFQhAKBWIbQCCxkOGQAAAAAQGTuAvgC+QACgVyEAoFwhNQAAoFghtgEZGQAAGxkAoFohAKBdITgAAKBeIWwAAKBEIHcAbgAAoCIjYwByAADgNdi73IAIRWFiY2RlZmdpamxub3JzdHYARhlKGVoZXhlmGWkZkhmWGZkZnRmgGa0ZxhnLGc8Z4BkjGmygZyIAoIwqgAFjbXAAUBlTGVgZ9SF0ZfVhbQBhAOSgswM6FgCghipyImV2ZQAfYQABaXliGWUZcgBjAB1hM2RvAHQAIWGAoWUibHFzAMYEcBl6GfGhZSLOBAAAdhlsAGEAbgD0AN8EgKF+KmNkbACBGYQZjBljAACgqSpvAHQAb6CAKmyggioAoIQqZeDbIgD+cwAAoJQqcgAA4DXYJN3noGsirATtIWVsAKA3IWMAeQBTZIChdyJFYWoApxmpGasZAKCSKgCgpSoAoKQqAAJFYWVztBm2Gb0ZwhkAoGkicABwoIoq8iFveACgiipxoIgq8aCIKrUZaQBtAACg5yJwAGYAAOA12FjdYQB2AOUAYwIAAWNp0xnWGXIAAKAKIW0AAKFzImVs3BneGQCgjioAoJAqAIM+ADtjZGxxco0E6xn0GfgZ/BkBGgABY2nvGfEZAKCnKnIAAKB6Km8AdAAAoNci0CFhcgCglSl1ImVzdAAAoHwqgAJhZGVscwAKGvQZFhrVBCAa8AEPGgAAFBpwAHIAbwD4AFkZcgAAoHgpcQAAAWxxxAQbGmwAZQBzAPMASRlpAO0A5AQAAWVuJxouGnIjdG5lcXEAAOBpIgD+xQAsGgAFQWFiY2Vma29zeUAaQxpmGmoabRqDGocalhrCGtMacgDyAMwCAAJpbG1yShpOGlAaVBpyAHMA8ABxD2YAvWBpAGwA9AASBQABZHJYGlsaYwB5AEpkAKGUIWN3YBpkGmkAcgAAoEgpAKCtIWEAcgAAoA8h6SFyYyVhgAFhbHIAcxp7Gn8a8iF0c3WgZSZpAHQAAKBlJuwhaXAAoCYg4yFvbgCguSJyAADgNdgl3XMAAAFld4wakRphInJvdwAAoCUpYSJyb3cAAKAmKYACYW1vcHIAnxqjGqcauhq+GnIAcgAAoP8h9CFodACgOyJrAAABbHKsGrMaZSRmdGFycm93AACgqSHpJGdodGFycm93AKCqIWYAAOA12Fnd4iFhcgCgFSCAAWNsdADIGswa0BpyAADgNdi93GEAcwDoAGka8iFvaydhAAFicNca2xr1IWxsAKBDIOghZW4AoBAg4Qr2GgAA/RoAAAgbExsaGwAAIRs7GwAAAAA+G2IbmRuVG6sbAACyG80b0htjAHUAdABlADuA7QDtQAChYyBpeQEbBhtyAGMAO4DuAO5AOGQAAWN4CxsNG3kANWRjAGwAO4ChAKFAAAFmcssCFhsA4DXYJt1yAGEAdgBlADuA7ADsQIChSCFpbm8AJxsyGzYbAAFpbisbLxtuAHQAAKAMKnQAAKAtIuYhaW4AoNwpdABhAACgKSHsIWlnM2GAAWFvcABDG1sbXhuAAWNndABJG0sbWRtyACthgAFlbHAAcQVRG1UbaQBuAOUAyAVhAHIA9AByBWgAMWFmAACgtyJlAGQAtWEAoggiY2ZvdGkbbRt1G3kb4SFyZQCgBSFpAG4AdKAeImkAZQAAoN0pZABvAPQAWxsAoisiY2VscIEbhRuPG5QbYQBsAACguiIAAWdyiRuNG2UAcgDzACMQ4wCCG2EicmhrAACgFyryIW9kAKA8KgACY2dwdJ8boRukG6gbeQBRZG8AbgAvYWYAAOA12FrdYQC5Y3UAZQBzAHQAO4C/AL9AAAFjabUbuRtyAADgNdi+3G4AAKIIIkVkc3bCG8QbyBvQAwCg+SJvAHQAAKD1Inag9CIAoPMiaaBiIOwhZGUpYesB1hsAANkbYwB5AFZkbAA7gO8A70AAA2NmbW9zdeYb7hvyG/Ub+hsFHAABaXnqG+0bcgBjADVhOWRyAADgNdgn3eEhdGg3YnAAZgAA4DXYW93jAf8bAAADHHIAAOA12L/c8iFjeVhk6yFjeVRkAARhY2ZnaGpvcxUcGhwiHCYcKhwtHDAcNRzwIXBhdqC6A/BjAAFleR4cIRzkIWls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ZmdobG1vcHJzdHV3CiwNLBEsHSwnLDEsQCxLLFIsYix6LIQsjyzLLOgs7Sz/LAotcgDyAAkDYQByAACgYykAAWNyFSwbLHUAdABlADuA+gD6QPIACQ1yAOMBIywAACUseQBeZHYAZQBtYQABaXkrLDAscgBjADuA+wD7QENkgAFhYmgANyw6LD0scgDyANEO7CFhY3FhYQDyAOAOAAFpckQsSCzzIWh0AKB+KQDgNdgy3XIAYQB2AGUAO4D5APlAYQFWLF8scgAAAWxyWixcLACgvyEAoL4hbABrAACggCUAAWN0Zix2LG8CbCwAAAAAcyxyAG4AZaAcI3IAAKAcI28AcAAAoA8jcgBpAACg+CUAAWFsfiyBLGMAcgBrYTuAqACoQAABZ3CILIssbwBuAHNhZgAA4DXYZt0AA2FkaGxzdZksniynLLgsuyzFLHIAcgBvAPcACQ1vAHcAbgBhAHIAcgBvAPcA2A5hI3Jwb29uAAABbHKvLLMsZQBmAPQAWyxpAGcAaAD0AF0sdQDzAKYOaQAAocUDaGzBLMIs0mNvAG4AxWPwI2Fycm93cwCgyCGAAWNpdADRLOEs5CxvAtcsAAAAAN4scgBuAGWgHSNyAACgHSNvAHAAAKAOI24AZwBvYXIAaQAAoPklYwByAADgNdjK3IABZGlyAPMs9yz6LG8AdAAAoPAi7CFkZWlhaQBmoLUlAKC0JQABYW0DLQYtcgDyAMosbAA7gPwA/EDhIm5nbGUAoKcpgAdBQkRhY2RlZmxub3Byc3oAJy0qLTAtNC2bLZ0toS2/LcMtxy3TLdgt3C3gLfwtcgDyABADYQByAHag6CoAoOkqYQBzAOgA/gIAAW5yOC08LechcnQAoJwpgANla25wcnN0AJkpSC1NLVQtXi1iLYItYQBwAHAA4QAaHG8AdABoAGkAbgDnAKEXgAFoaXIAoSmzJFotbwBwAPQAdCVooJUh7wD4JgABaXVmLWotZwBtAOEAuygAAWJwbi14LXMjZXRuZXEAceCKIgD+AODLKgD+cyNldG5lcQBx4IsiAP4A4MwqAP4AAWhyhi2KLWUAdADhABIraSNhbmdsZQAAAWxyki2WLeUhZnQAoLIiaSJnaHQAAKCzInkAMmThIXNoAKCiIoABZWxyAKcttC24LWKiKCKuLQAAAACyLWEAcgAAoLsicQAAoFoi7CFpcACg7iIAAWJ0vC1eD2EA8gBfD3IAAOA12DPddAByAOkAlS1zAHUAAAFicM0t0C0A4IIi0iAA4IMi0iBwAGYAAOA12GfdcgBvAPAAWQt0AHIA6QCaLQABY3XkLegtcgAA4DXYy9wAAWJw7C30LW4AAAFFZXUt8S0A4IoiAP5uAAABRWV/LfktAOCLIgD+6SJnemFnAKCaKYADY2Vmb3BycwANLhAuJS4pLiMuLi40LukhcmN1YQABZGkULiEuAAFiZxguHC5hAHIAAKBfKmUAcaAnIgCgWSLlIXJwAKAYIXIAAOA12DTdcABmAADgNdho3WWgQCJhAHQA6ABqD2MAcgAA4DXYzNzjCuQRUC4AAFQuAABYLmIuAAAAAGMubS5wLnQuAAAAAIguki4AAJouJxIqEnQAcgDpAB0ScgAA4DXYNd0AAUFhWy5eLnIA8gDnAnIA8gCTB75jAAFBYWYuaS5yAPIA4AJyAPIAjAdhAPAAeh5pAHMAAKD7IoABZHB0APgReS6DLgABZmx9LoAuAOA12GnddQDzAP8RaQBtAOUABBIAAUFhiy6OLnIA8gDuAnIA8gCaBwABY3GVLgoScgAA4DXYzdwAAXB0nS6hLmwAdQDzACUScgDpACASAARhY2VmaW9zdbEuvC7ELsguzC7PLtQu2S5jAAABdXm2LrsudABlADuA/QD9QE9kAAFpecAuwy5yAGMAd2FLZG4AO4ClAKVAcgAA4DXYNt1jAHkAV2RwAGYAAOA12GrdYwByAADgNdjO3AABY23dLt8ueQBOZGwAO4D/AP9AAAVhY2RlZmhpb3N38y73Lv8uAi8MLxAvEy8YLx0vIi9jInV0ZQB6YQABYXn7Lv4u8iFvbn5hN2RvAHQAfGEAAWV0Bi8KL3QAcgDmAB8QYQC2Y3IAAOA12DfdYwB5ADZk5yJyYXJyAKDdIXAAZgAA4DXYa91jAHIAAOA12M/cAAFqbiYvKC8AoA0gagAAoAwg");

// node_modules/.pnpm/entities@7.0.1/node_modules/entities/dist/esm/generated/decode-data-xml.js
var xmlDecodeTree = /* @__PURE__ */ decodeBase64("AAJhZ2xxBwARABMAFQBtAg0AAAAAAA8AcAAmYG8AcwAnYHQAPmB0ADxg9SFvdCJg");

// node_modules/.pnpm/entities@7.0.1/node_modules/entities/dist/esm/internal/bin-trie-flags.js
var BinTrieFlags;
(function(BinTrieFlags3) {
  BinTrieFlags3[BinTrieFlags3["VALUE_LENGTH"] = 49152] = "VALUE_LENGTH";
  BinTrieFlags3[BinTrieFlags3["FLAG13"] = 8192] = "FLAG13";
  BinTrieFlags3[BinTrieFlags3["BRANCH_LENGTH"] = 8064] = "BRANCH_LENGTH";
  BinTrieFlags3[BinTrieFlags3["JUMP_TABLE"] = 127] = "JUMP_TABLE";
})(BinTrieFlags || (BinTrieFlags = {}));

// node_modules/.pnpm/entities@7.0.1/node_modules/entities/dist/esm/decode.js
var CharCodes;
(function(CharCodes4) {
  CharCodes4[CharCodes4["NUM"] = 35] = "NUM";
  CharCodes4[CharCodes4["SEMI"] = 59] = "SEMI";
  CharCodes4[CharCodes4["EQUALS"] = 61] = "EQUALS";
  CharCodes4[CharCodes4["ZERO"] = 48] = "ZERO";
  CharCodes4[CharCodes4["NINE"] = 57] = "NINE";
  CharCodes4[CharCodes4["LOWER_A"] = 97] = "LOWER_A";
  CharCodes4[CharCodes4["LOWER_F"] = 102] = "LOWER_F";
  CharCodes4[CharCodes4["LOWER_X"] = 120] = "LOWER_X";
  CharCodes4[CharCodes4["LOWER_Z"] = 122] = "LOWER_Z";
  CharCodes4[CharCodes4["UPPER_A"] = 65] = "UPPER_A";
  CharCodes4[CharCodes4["UPPER_F"] = 70] = "UPPER_F";
  CharCodes4[CharCodes4["UPPER_Z"] = 90] = "UPPER_Z";
})(CharCodes || (CharCodes = {}));
var TO_LOWER_BIT = 32;
function isNumber(code) {
  return code >= CharCodes.ZERO && code <= CharCodes.NINE;
}
function isHexadecimalCharacter(code) {
  return code >= CharCodes.UPPER_A && code <= CharCodes.UPPER_F || code >= CharCodes.LOWER_A && code <= CharCodes.LOWER_F;
}
function isAsciiAlphaNumeric(code) {
  return code >= CharCodes.UPPER_A && code <= CharCodes.UPPER_Z || code >= CharCodes.LOWER_A && code <= CharCodes.LOWER_Z || isNumber(code);
}
function isEntityInAttributeInvalidEnd(code) {
  return code === CharCodes.EQUALS || isAsciiAlphaNumeric(code);
}
var EntityDecoderState;
(function(EntityDecoderState3) {
  EntityDecoderState3[EntityDecoderState3["EntityStart"] = 0] = "EntityStart";
  EntityDecoderState3[EntityDecoderState3["NumericStart"] = 1] = "NumericStart";
  EntityDecoderState3[EntityDecoderState3["NumericDecimal"] = 2] = "NumericDecimal";
  EntityDecoderState3[EntityDecoderState3["NumericHex"] = 3] = "NumericHex";
  EntityDecoderState3[EntityDecoderState3["NamedEntity"] = 4] = "NamedEntity";
})(EntityDecoderState || (EntityDecoderState = {}));
var DecodingMode;
(function(DecodingMode3) {
  DecodingMode3[DecodingMode3["Legacy"] = 0] = "Legacy";
  DecodingMode3[DecodingMode3["Strict"] = 1] = "Strict";
  DecodingMode3[DecodingMode3["Attribute"] = 2] = "Attribute";
})(DecodingMode || (DecodingMode = {}));
var EntityDecoder = class {
  constructor(decodeTree, emitCodePoint, errors) {
    this.decodeTree = decodeTree;
    this.emitCodePoint = emitCodePoint;
    this.errors = errors;
    this.state = EntityDecoderState.EntityStart;
    this.consumed = 1;
    this.result = 0;
    this.treeIndex = 0;
    this.excess = 1;
    this.decodeMode = DecodingMode.Strict;
    this.runConsumed = 0;
  }
  /** Resets the instance to make it reusable. */
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
   *
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
   *
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
   *
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
   *
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
   *
   * @param lastCp The last code point of the entity. Used to see if the
   *               entity was terminated with a semicolon.
   * @param expectedLength The minimum number of characters that should be
   *                       consumed. Used to validate that at least one digit
   *                       was consumed.
   * @returns The number of characters that were consumed.
   */
  emitNumericEntity(lastCp, expectedLength) {
    var _a3;
    if (this.consumed <= expectedLength) {
      (_a3 = this.errors) === null || _a3 === void 0 ? void 0 : _a3.absenceOfDigitsInNumericCharacterReference(this.consumed);
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
   *
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
   *
   * @returns The number of characters consumed.
   */
  emitNotTerminatedNamedEntity() {
    var _a3;
    const { result, decodeTree } = this;
    const valueLength = (decodeTree[result] & BinTrieFlags.VALUE_LENGTH) >> 14;
    this.emitNamedEntityData(result, valueLength, this.consumed);
    (_a3 = this.errors) === null || _a3 === void 0 ? void 0 : _a3.missingSemicolonAfterCharacterReference();
    return this.consumed;
  }
  /**
   * Emit a named entity.
   *
   * @param result The index of the entity in the decode tree.
   * @param valueLength The number of bytes in the entity.
   * @param consumed The number of characters consumed.
   *
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
   *
   * @returns The number of characters consumed.
   */
  end() {
    var _a3;
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
        (_a3 = this.errors) === null || _a3 === void 0 ? void 0 : _a3.absenceOfDigitsInNumericCharacterReference(this.consumed);
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

// node_modules/.pnpm/htmlparser2@10.1.0/node_modules/htmlparser2/dist/esm/Tokenizer.js
var CharCodes2;
(function(CharCodes4) {
  CharCodes4[CharCodes4["Tab"] = 9] = "Tab";
  CharCodes4[CharCodes4["NewLine"] = 10] = "NewLine";
  CharCodes4[CharCodes4["FormFeed"] = 12] = "FormFeed";
  CharCodes4[CharCodes4["CarriageReturn"] = 13] = "CarriageReturn";
  CharCodes4[CharCodes4["Space"] = 32] = "Space";
  CharCodes4[CharCodes4["ExclamationMark"] = 33] = "ExclamationMark";
  CharCodes4[CharCodes4["Number"] = 35] = "Number";
  CharCodes4[CharCodes4["Amp"] = 38] = "Amp";
  CharCodes4[CharCodes4["SingleQuote"] = 39] = "SingleQuote";
  CharCodes4[CharCodes4["DoubleQuote"] = 34] = "DoubleQuote";
  CharCodes4[CharCodes4["Dash"] = 45] = "Dash";
  CharCodes4[CharCodes4["Slash"] = 47] = "Slash";
  CharCodes4[CharCodes4["Zero"] = 48] = "Zero";
  CharCodes4[CharCodes4["Nine"] = 57] = "Nine";
  CharCodes4[CharCodes4["Semi"] = 59] = "Semi";
  CharCodes4[CharCodes4["Lt"] = 60] = "Lt";
  CharCodes4[CharCodes4["Eq"] = 61] = "Eq";
  CharCodes4[CharCodes4["Gt"] = 62] = "Gt";
  CharCodes4[CharCodes4["Questionmark"] = 63] = "Questionmark";
  CharCodes4[CharCodes4["UpperA"] = 65] = "UpperA";
  CharCodes4[CharCodes4["LowerA"] = 97] = "LowerA";
  CharCodes4[CharCodes4["UpperF"] = 70] = "UpperF";
  CharCodes4[CharCodes4["LowerF"] = 102] = "LowerF";
  CharCodes4[CharCodes4["UpperZ"] = 90] = "UpperZ";
  CharCodes4[CharCodes4["LowerZ"] = 122] = "LowerZ";
  CharCodes4[CharCodes4["LowerX"] = 120] = "LowerX";
  CharCodes4[CharCodes4["OpeningSquareBracket"] = 91] = "OpeningSquareBracket";
})(CharCodes2 || (CharCodes2 = {}));
var State;
(function(State2) {
  State2[State2["Text"] = 1] = "Text";
  State2[State2["BeforeTagName"] = 2] = "BeforeTagName";
  State2[State2["InTagName"] = 3] = "InTagName";
  State2[State2["InSelfClosingTag"] = 4] = "InSelfClosingTag";
  State2[State2["BeforeClosingTagName"] = 5] = "BeforeClosingTagName";
  State2[State2["InClosingTagName"] = 6] = "InClosingTagName";
  State2[State2["AfterClosingTagName"] = 7] = "AfterClosingTagName";
  State2[State2["BeforeAttributeName"] = 8] = "BeforeAttributeName";
  State2[State2["InAttributeName"] = 9] = "InAttributeName";
  State2[State2["AfterAttributeName"] = 10] = "AfterAttributeName";
  State2[State2["BeforeAttributeValue"] = 11] = "BeforeAttributeValue";
  State2[State2["InAttributeValueDq"] = 12] = "InAttributeValueDq";
  State2[State2["InAttributeValueSq"] = 13] = "InAttributeValueSq";
  State2[State2["InAttributeValueNq"] = 14] = "InAttributeValueNq";
  State2[State2["BeforeDeclaration"] = 15] = "BeforeDeclaration";
  State2[State2["InDeclaration"] = 16] = "InDeclaration";
  State2[State2["InProcessingInstruction"] = 17] = "InProcessingInstruction";
  State2[State2["BeforeComment"] = 18] = "BeforeComment";
  State2[State2["CDATASequence"] = 19] = "CDATASequence";
  State2[State2["InSpecialComment"] = 20] = "InSpecialComment";
  State2[State2["InCommentLike"] = 21] = "InCommentLike";
  State2[State2["BeforeSpecialS"] = 22] = "BeforeSpecialS";
  State2[State2["BeforeSpecialT"] = 23] = "BeforeSpecialT";
  State2[State2["SpecialStartSequence"] = 24] = "SpecialStartSequence";
  State2[State2["InSpecialTag"] = 25] = "InSpecialTag";
  State2[State2["InEntity"] = 26] = "InEntity";
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
  Cdata: new Uint8Array([67, 68, 65, 84, 65, 91]),
  // CDATA[
  CdataEnd: new Uint8Array([93, 93, 62]),
  // ]]>
  CommentEnd: new Uint8Array([45, 45, 62]),
  // `-->`
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
var Tokenizer = class {
  constructor({ xmlMode = false, decodeEntities = true }, cbs) {
    this.cbs = cbs;
    this.state = State.Text;
    this.buffer = "";
    this.sectionStart = 0;
    this.index = 0;
    this.entityStart = 0;
    this.baseState = State.Text;
    this.isSpecial = false;
    this.running = true;
    this.offset = 0;
    this.currentSequence = void 0;
    this.sequenceIndex = 0;
    this.xmlMode = xmlMode;
    this.decodeEntities = decodeEntities;
    this.entityDecoder = new EntityDecoder(xmlMode ? xmlDecodeTree : htmlDecodeTree, (cp, consumed) => this.emitCodePoint(cp, consumed));
  }
  reset() {
    this.state = State.Text;
    this.buffer = "";
    this.sectionStart = 0;
    this.index = 0;
    this.baseState = State.Text;
    this.currentSequence = void 0;
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
  stateSpecialStartSequence(c) {
    const isEnd = this.sequenceIndex === this.currentSequence.length;
    const isMatch = isEnd ? (
      // If we are at the end of the sequence, make sure the tag name has ended
      isEndOfTagSection(c)
    ) : (
      // Otherwise, do a case-insensitive comparison
      (c | 32) === this.currentSequence[this.sequenceIndex]
    );
    if (!isMatch) {
      this.isSpecial = false;
    } else if (!isEnd) {
      this.sequenceIndex++;
      return;
    }
    this.sequenceIndex = 0;
    this.state = State.InTagName;
    this.stateInTagName(c);
  }
  /** Look for an end tag. For <title> tags, also decode entities. */
  stateInSpecialTag(c) {
    if (this.sequenceIndex === this.currentSequence.length) {
      if (c === CharCodes2.Gt || isWhitespace(c)) {
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
      if (this.currentSequence === Sequences.TitleEnd) {
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
      this.state = State.InDeclaration;
      this.stateInDeclaration(c);
    }
  }
  /**
   * When we wait for one specific character, we can speed things up
   * by skipping through the buffer until we find it.
   *
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
   * Comments and CDATA end with `-->` and `]]>`.
   *
   * Their common qualities are:
   * - Their end sequences have a distinct character they start with.
   * - That character is then repeated, so we have to check multiple repeats.
   * - All characters but the start character of the sequence can be skipped.
   */
  stateInCommentLike(c) {
    if (c === this.currentSequence[this.sequenceIndex]) {
      if (++this.sequenceIndex === this.currentSequence.length) {
        if (this.currentSequence === Sequences.CdataEnd) {
          this.cbs.oncdata(this.sectionStart, this.index, 2);
        } else {
          this.cbs.oncomment(this.sectionStart, this.index, 2);
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
   */
  isTagStartChar(c) {
    return this.xmlMode ? !isEndOfTagSection(c) : isASCIIAlpha(c);
  }
  startSpecial(sequence, offset) {
    this.isSpecial = true;
    this.currentSequence = sequence;
    this.sequenceIndex = offset;
    this.state = State.SpecialStartSequence;
  }
  stateBeforeTagName(c) {
    if (c === CharCodes2.ExclamationMark) {
      this.state = State.BeforeDeclaration;
      this.sectionStart = this.index + 1;
    } else if (c === CharCodes2.Questionmark) {
      this.state = State.InProcessingInstruction;
      this.sectionStart = this.index + 1;
    } else if (this.isTagStartChar(c)) {
      const lower = c | 32;
      this.sectionStart = this.index;
      if (this.xmlMode) {
        this.state = State.InTagName;
      } else if (lower === Sequences.ScriptEnd[2]) {
        this.state = State.BeforeSpecialS;
      } else if (lower === Sequences.TitleEnd[2] || lower === Sequences.XmpEnd[2]) {
        this.state = State.BeforeSpecialT;
      } else {
        this.state = State.InTagName;
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
    } else if (c === CharCodes2.Gt) {
      this.state = State.Text;
    } else {
      this.state = this.isTagStartChar(c) ? State.InClosingTagName : State.InSpecialComment;
      this.sectionStart = this.index;
    }
  }
  stateInClosingTagName(c) {
    if (c === CharCodes2.Gt || isWhitespace(c)) {
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
      if (this.isSpecial) {
        this.state = State.InSpecialTag;
        this.sequenceIndex = 0;
      } else {
        this.state = State.Text;
      }
      this.sectionStart = this.index + 1;
    } else if (c === CharCodes2.Slash) {
      this.state = State.InSelfClosingTag;
    } else if (!isWhitespace(c)) {
      this.state = State.InAttributeName;
      this.sectionStart = this.index;
    }
  }
  stateInSelfClosingTag(c) {
    if (c === CharCodes2.Gt) {
      this.cbs.onselfclosingtag(this.index);
      this.state = State.Text;
      this.sectionStart = this.index + 1;
      this.isSpecial = false;
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
  stateBeforeDeclaration(c) {
    if (c === CharCodes2.OpeningSquareBracket) {
      this.state = State.CDATASequence;
      this.sequenceIndex = 0;
    } else {
      this.state = c === CharCodes2.Dash ? State.BeforeComment : State.InDeclaration;
    }
  }
  stateInDeclaration(c) {
    if (c === CharCodes2.Gt || this.fastForwardTo(CharCodes2.Gt)) {
      this.cbs.ondeclaration(this.sectionStart, this.index);
      this.state = State.Text;
      this.sectionStart = this.index + 1;
    }
  }
  stateInProcessingInstruction(c) {
    if (c === CharCodes2.Gt || this.fastForwardTo(CharCodes2.Gt)) {
      this.cbs.onprocessinginstruction(this.sectionStart, this.index);
      this.state = State.Text;
      this.sectionStart = this.index + 1;
    }
  }
  stateBeforeComment(c) {
    if (c === CharCodes2.Dash) {
      this.state = State.InCommentLike;
      this.currentSequence = Sequences.CommentEnd;
      this.sequenceIndex = 2;
      this.sectionStart = this.index + 1;
    } else {
      this.state = State.InDeclaration;
    }
  }
  stateInSpecialComment(c) {
    if (c === CharCodes2.Gt || this.fastForwardTo(CharCodes2.Gt)) {
      this.cbs.oncomment(this.sectionStart, this.index, 0);
      this.state = State.Text;
      this.sectionStart = this.index + 1;
    }
  }
  stateBeforeSpecialS(c) {
    const lower = c | 32;
    if (lower === Sequences.ScriptEnd[3]) {
      this.startSpecial(Sequences.ScriptEnd, 4);
    } else if (lower === Sequences.StyleEnd[3]) {
      this.startSpecial(Sequences.StyleEnd, 4);
    } else {
      this.state = State.InTagName;
      this.stateInTagName(c);
    }
  }
  stateBeforeSpecialT(c) {
    const lower = c | 32;
    switch (lower) {
      case Sequences.TitleEnd[3]: {
        this.startSpecial(Sequences.TitleEnd, 4);
        break;
      }
      case Sequences.TextareaEnd[3]: {
        this.startSpecial(Sequences.TextareaEnd, 4);
        break;
      }
      case Sequences.XmpEnd[3]: {
        this.startSpecial(Sequences.XmpEnd, 4);
        break;
      }
      default: {
        this.state = State.InTagName;
        this.stateInTagName(c);
      }
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
      if (this.state === State.Text || this.state === State.InSpecialTag && this.sequenceIndex === 0) {
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
        case State.BeforeSpecialS: {
          this.stateBeforeSpecialS(c);
          break;
        }
        case State.BeforeSpecialT: {
          this.stateBeforeSpecialT(c);
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
  /** Handle any trailing data. */
  handleTrailingData() {
    const endIndex = this.buffer.length + this.offset;
    if (this.sectionStart >= endIndex) {
      return;
    }
    if (this.state === State.InCommentLike) {
      if (this.currentSequence === Sequences.CdataEnd) {
        this.cbs.oncdata(this.sectionStart, endIndex, 0);
      } else {
        this.cbs.oncomment(this.sectionStart, endIndex, 0);
      }
    } else if (this.state === State.InTagName || this.state === State.BeforeAttributeName || this.state === State.BeforeAttributeValue || this.state === State.AfterAttributeName || this.state === State.InAttributeName || this.state === State.InAttributeValueSq || this.state === State.InAttributeValueDq || this.state === State.InAttributeValueNq || this.state === State.InClosingTagName) {
    } else {
      this.cbs.ontext(this.sectionStart, endIndex);
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

// node_modules/.pnpm/htmlparser2@10.1.0/node_modules/htmlparser2/dist/esm/Parser.js
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
var tableSectionTags = /* @__PURE__ */ new Set(["thead", "tbody"]);
var ddtTags = /* @__PURE__ */ new Set(["dd", "dt"]);
var rtpTags = /* @__PURE__ */ new Set(["rt", "rp"]);
var openImpliesClose = /* @__PURE__ */ new Map([
  ["tr", /* @__PURE__ */ new Set(["tr", "th", "td"])],
  ["th", /* @__PURE__ */ new Set(["th"])],
  ["td", /* @__PURE__ */ new Set(["thead", "th", "td"])],
  ["body", /* @__PURE__ */ new Set(["head", "link", "script"])],
  ["li", /* @__PURE__ */ new Set(["li"])],
  ["p", pTag],
  ["h1", pTag],
  ["h2", pTag],
  ["h3", pTag],
  ["h4", pTag],
  ["h5", pTag],
  ["h6", pTag],
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
  "foreignobject",
  "desc",
  "title"
]);
var reNameEnd = /\s|\//;
var Parser = class {
  constructor(cbs, options = {}) {
    var _a3, _b, _c, _d, _e, _f;
    this.options = options;
    this.startIndex = 0;
    this.endIndex = 0;
    this.openTagStart = 0;
    this.tagname = "";
    this.attribname = "";
    this.attribvalue = "";
    this.attribs = null;
    this.stack = [];
    this.buffers = [];
    this.bufferOffset = 0;
    this.writeIndex = 0;
    this.ended = false;
    this.cbs = cbs !== null && cbs !== void 0 ? cbs : {};
    this.htmlMode = !this.options.xmlMode;
    this.lowerCaseTagNames = (_a3 = options.lowerCaseTags) !== null && _a3 !== void 0 ? _a3 : this.htmlMode;
    this.lowerCaseAttributeNames = (_b = options.lowerCaseAttributeNames) !== null && _b !== void 0 ? _b : this.htmlMode;
    this.recognizeSelfClosing = (_c = options.recognizeSelfClosing) !== null && _c !== void 0 ? _c : !this.htmlMode;
    this.tokenizer = new ((_d = options.Tokenizer) !== null && _d !== void 0 ? _d : Tokenizer)(this.options, this);
    this.foreignContext = [!this.htmlMode];
    (_f = (_e = this.cbs).onparserinit) === null || _f === void 0 ? void 0 : _f.call(_e, this);
  }
  // Tokenizer event handlers
  /** @internal */
  ontext(start, endIndex) {
    var _a3, _b;
    const data2 = this.getSlice(start, endIndex);
    this.endIndex = endIndex - 1;
    (_b = (_a3 = this.cbs).ontext) === null || _b === void 0 ? void 0 : _b.call(_a3, data2);
    this.startIndex = endIndex;
  }
  /** @internal */
  ontextentity(cp, endIndex) {
    var _a3, _b;
    this.endIndex = endIndex - 1;
    (_b = (_a3 = this.cbs).ontext) === null || _b === void 0 ? void 0 : _b.call(_a3, fromCodePoint(cp));
    this.startIndex = endIndex;
  }
  /**
   * Checks if the current tag is a void element. Override this if you want
   * to specify your own additional void elements.
   */
  isVoidElement(name) {
    return this.htmlMode && voidElements.has(name);
  }
  /** @internal */
  onopentagname(start, endIndex) {
    this.endIndex = endIndex;
    let name = this.getSlice(start, endIndex);
    if (this.lowerCaseTagNames) {
      name = name.toLowerCase();
    }
    this.emitOpenTag(name);
  }
  emitOpenTag(name) {
    var _a3, _b, _c, _d;
    this.openTagStart = this.startIndex;
    this.tagname = name;
    const impliesClose = this.htmlMode && openImpliesClose.get(name);
    if (impliesClose) {
      while (this.stack.length > 0 && impliesClose.has(this.stack[0])) {
        const element = this.stack.shift();
        (_b = (_a3 = this.cbs).onclosetag) === null || _b === void 0 ? void 0 : _b.call(_a3, element, true);
      }
    }
    if (!this.isVoidElement(name)) {
      this.stack.unshift(name);
      if (this.htmlMode) {
        if (foreignContextElements.has(name)) {
          this.foreignContext.unshift(true);
        } else if (htmlIntegrationElements.has(name)) {
          this.foreignContext.unshift(false);
        }
      }
    }
    (_d = (_c = this.cbs).onopentagname) === null || _d === void 0 ? void 0 : _d.call(_c, name);
    if (this.cbs.onopentag)
      this.attribs = {};
  }
  endOpenTag(isImplied) {
    var _a3, _b;
    this.startIndex = this.openTagStart;
    if (this.attribs) {
      (_b = (_a3 = this.cbs).onopentag) === null || _b === void 0 ? void 0 : _b.call(_a3, this.tagname, this.attribs, isImplied);
      this.attribs = null;
    }
    if (this.cbs.onclosetag && this.isVoidElement(this.tagname)) {
      this.cbs.onclosetag(this.tagname, true);
    }
    this.tagname = "";
  }
  /** @internal */
  onopentagend(endIndex) {
    this.endIndex = endIndex;
    this.endOpenTag(false);
    this.startIndex = endIndex + 1;
  }
  /** @internal */
  onclosetag(start, endIndex) {
    var _a3, _b, _c, _d, _e, _f, _g, _h;
    this.endIndex = endIndex;
    let name = this.getSlice(start, endIndex);
    if (this.lowerCaseTagNames) {
      name = name.toLowerCase();
    }
    if (this.htmlMode && (foreignContextElements.has(name) || htmlIntegrationElements.has(name))) {
      this.foreignContext.shift();
    }
    if (!this.isVoidElement(name)) {
      const pos = this.stack.indexOf(name);
      if (pos !== -1) {
        for (let index = 0; index <= pos; index++) {
          const element = this.stack.shift();
          (_b = (_a3 = this.cbs).onclosetag) === null || _b === void 0 ? void 0 : _b.call(_a3, element, index !== pos);
        }
      } else if (this.htmlMode && name === "p") {
        this.emitOpenTag("p");
        this.closeCurrentTag(true);
      }
    } else if (this.htmlMode && name === "br") {
      (_d = (_c = this.cbs).onopentagname) === null || _d === void 0 ? void 0 : _d.call(_c, "br");
      (_f = (_e = this.cbs).onopentag) === null || _f === void 0 ? void 0 : _f.call(_e, "br", {}, true);
      (_h = (_g = this.cbs).onclosetag) === null || _h === void 0 ? void 0 : _h.call(_g, "br", false);
    }
    this.startIndex = endIndex + 1;
  }
  /** @internal */
  onselfclosingtag(endIndex) {
    this.endIndex = endIndex;
    if (this.recognizeSelfClosing || this.foreignContext[0]) {
      this.closeCurrentTag(false);
      this.startIndex = endIndex + 1;
    } else {
      this.onopentagend(endIndex);
    }
  }
  closeCurrentTag(isOpenImplied) {
    var _a3, _b;
    const name = this.tagname;
    this.endOpenTag(isOpenImplied);
    if (this.stack[0] === name) {
      (_b = (_a3 = this.cbs).onclosetag) === null || _b === void 0 ? void 0 : _b.call(_a3, name, !isOpenImplied);
      this.stack.shift();
    }
  }
  /** @internal */
  onattribname(start, endIndex) {
    this.startIndex = start;
    const name = this.getSlice(start, endIndex);
    this.attribname = this.lowerCaseAttributeNames ? name.toLowerCase() : name;
  }
  /** @internal */
  onattribdata(start, endIndex) {
    this.attribvalue += this.getSlice(start, endIndex);
  }
  /** @internal */
  onattribentity(cp) {
    this.attribvalue += fromCodePoint(cp);
  }
  /** @internal */
  onattribend(quote, endIndex) {
    var _a3, _b;
    this.endIndex = endIndex;
    (_b = (_a3 = this.cbs).onattribute) === null || _b === void 0 ? void 0 : _b.call(_a3, this.attribname, this.attribvalue, quote === QuoteType.Double ? '"' : quote === QuoteType.Single ? "'" : quote === QuoteType.NoValue ? void 0 : null);
    if (this.attribs && !Object.prototype.hasOwnProperty.call(this.attribs, this.attribname)) {
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
  /** @internal */
  ondeclaration(start, endIndex) {
    this.endIndex = endIndex;
    const value = this.getSlice(start, endIndex);
    if (this.cbs.onprocessinginstruction) {
      const name = this.getInstructionName(value);
      this.cbs.onprocessinginstruction(`!${name}`, `!${value}`);
    }
    this.startIndex = endIndex + 1;
  }
  /** @internal */
  onprocessinginstruction(start, endIndex) {
    this.endIndex = endIndex;
    const value = this.getSlice(start, endIndex);
    if (this.cbs.onprocessinginstruction) {
      const name = this.getInstructionName(value);
      this.cbs.onprocessinginstruction(`?${name}`, `?${value}`);
    }
    this.startIndex = endIndex + 1;
  }
  /** @internal */
  oncomment(start, endIndex, offset) {
    var _a3, _b, _c, _d;
    this.endIndex = endIndex;
    (_b = (_a3 = this.cbs).oncomment) === null || _b === void 0 ? void 0 : _b.call(_a3, this.getSlice(start, endIndex - offset));
    (_d = (_c = this.cbs).oncommentend) === null || _d === void 0 ? void 0 : _d.call(_c);
    this.startIndex = endIndex + 1;
  }
  /** @internal */
  oncdata(start, endIndex, offset) {
    var _a3, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    this.endIndex = endIndex;
    const value = this.getSlice(start, endIndex - offset);
    if (!this.htmlMode || this.options.recognizeCDATA) {
      (_b = (_a3 = this.cbs).oncdatastart) === null || _b === void 0 ? void 0 : _b.call(_a3);
      (_d = (_c = this.cbs).ontext) === null || _d === void 0 ? void 0 : _d.call(_c, value);
      (_f = (_e = this.cbs).oncdataend) === null || _f === void 0 ? void 0 : _f.call(_e);
    } else {
      (_h = (_g = this.cbs).oncomment) === null || _h === void 0 ? void 0 : _h.call(_g, `[CDATA[${value}]]`);
      (_k = (_j = this.cbs).oncommentend) === null || _k === void 0 ? void 0 : _k.call(_j);
    }
    this.startIndex = endIndex + 1;
  }
  /** @internal */
  onend() {
    var _a3, _b;
    if (this.cbs.onclosetag) {
      this.endIndex = this.startIndex;
      for (let index = 0; index < this.stack.length; index++) {
        this.cbs.onclosetag(this.stack[index], true);
      }
    }
    (_b = (_a3 = this.cbs).onend) === null || _b === void 0 ? void 0 : _b.call(_a3);
  }
  /**
   * Resets the parser to a blank state, ready to parse a new HTML document
   */
  reset() {
    var _a3, _b, _c, _d;
    (_b = (_a3 = this.cbs).onreset) === null || _b === void 0 ? void 0 : _b.call(_a3);
    this.tokenizer.reset();
    this.tagname = "";
    this.attribname = "";
    this.attribs = null;
    this.stack.length = 0;
    this.startIndex = 0;
    this.endIndex = 0;
    (_d = (_c = this.cbs).onparserinit) === null || _d === void 0 ? void 0 : _d.call(_c, this);
    this.buffers.length = 0;
    this.foreignContext.length = 0;
    this.foreignContext.unshift(!this.htmlMode);
    this.bufferOffset = 0;
    this.writeIndex = 0;
    this.ended = false;
  }
  /**
   * Resets the parser, then parses a complete document and
   * pushes it to the handler.
   *
   * @param data Document to parse.
   */
  parseComplete(data2) {
    this.reset();
    this.end(data2);
  }
  getSlice(start, end) {
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
   *
   * @param chunk Chunk to parse.
   */
  write(chunk) {
    var _a3, _b;
    if (this.ended) {
      (_b = (_a3 = this.cbs).onerror) === null || _b === void 0 ? void 0 : _b.call(_a3, new Error(".write() after done!"));
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
   *
   * @param chunk Optional final chunk to parse.
   */
  end(chunk) {
    var _a3, _b;
    if (this.ended) {
      (_b = (_a3 = this.cbs).onerror) === null || _b === void 0 ? void 0 : _b.call(_a3, new Error(".end() after done!"));
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
  /**
   * Alias of `write`, for backwards compatibility.
   *
   * @param chunk Chunk to parse.
   * @deprecated
   */
  parseChunk(chunk) {
    this.write(chunk);
  }
  /**
   * Alias of `end`, for backwards compatibility.
   *
   * @param chunk Optional final chunk to parse.
   * @deprecated
   */
  done(chunk) {
    this.end(chunk);
  }
};

// node_modules/.pnpm/domelementtype@2.3.0/node_modules/domelementtype/lib/esm/index.js
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
function isTag(elem) {
  return elem.type === ElementType.Tag || elem.type === ElementType.Script || elem.type === ElementType.Style;
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

// node_modules/.pnpm/domhandler@5.0.3/node_modules/domhandler/lib/esm/node.js
var Node = class {
  constructor() {
    this.parent = null;
    this.prev = null;
    this.next = null;
    this.startIndex = null;
    this.endIndex = null;
  }
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
  set previousSibling(prev) {
    this.prev = prev;
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
   *
   * @param recursive Clone child nodes as well.
   * @returns A clone of the node.
   */
  cloneNode(recursive = false) {
    return cloneNode(this, recursive);
  }
};
var DataNode = class extends Node {
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
  constructor() {
    super(...arguments);
    this.type = ElementType.Text;
  }
  get nodeType() {
    return 3;
  }
};
var Comment2 = class extends DataNode {
  constructor() {
    super(...arguments);
    this.type = ElementType.Comment;
  }
  get nodeType() {
    return 8;
  }
};
var ProcessingInstruction = class extends DataNode {
  constructor(name, data2) {
    super(data2);
    this.name = name;
    this.type = ElementType.Directive;
  }
  get nodeType() {
    return 1;
  }
};
var NodeWithChildren = class extends Node {
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
    var _a3;
    return (_a3 = this.children[0]) !== null && _a3 !== void 0 ? _a3 : null;
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
  constructor() {
    super(...arguments);
    this.type = ElementType.CDATA;
  }
  get nodeType() {
    return 4;
  }
};
var Document = class extends NodeWithChildren {
  constructor() {
    super(...arguments);
    this.type = ElementType.Root;
  }
  get nodeType() {
    return 9;
  }
};
var Element = class extends NodeWithChildren {
  /**
   * @param name Name of the tag, eg. `div`, `span`.
   * @param attribs Object mapping attribute names to attribute values.
   * @param children Children of the node.
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
    return Object.keys(this.attribs).map((name) => {
      var _a3, _b;
      return {
        name,
        value: this.attribs[name],
        namespace: (_a3 = this["x-attribsNamespace"]) === null || _a3 === void 0 ? void 0 : _a3[name],
        prefix: (_b = this["x-attribsPrefix"]) === null || _b === void 0 ? void 0 : _b[name]
      };
    });
  }
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
    children.forEach((child) => child.parent = clone);
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
    children.forEach((child) => child.parent = clone);
    result = clone;
  } else if (isDocument(node)) {
    const children = recursive ? cloneChildren(node.children) : [];
    const clone = new Document(children);
    children.forEach((child) => child.parent = clone);
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
  for (let i = 1; i < children.length; i++) {
    children[i].prev = children[i - 1];
    children[i - 1].next = children[i];
  }
  return children;
}

// node_modules/.pnpm/domhandler@5.0.3/node_modules/domhandler/lib/esm/index.js
var defaultOpts = {
  withStartIndices: false,
  withEndIndices: false,
  xmlMode: false
};
var DomHandler = class {
  /**
   * @param callback Called once parsing has completed.
   * @param options Settings for the handler.
   * @param elementCB Callback whenever a tag is closed.
   */
  constructor(callback, options, elementCB) {
    this.dom = [];
    this.root = new Document(this.dom);
    this.done = false;
    this.tagStack = [this.root];
    this.lastNode = null;
    this.parser = null;
    if (typeof options === "function") {
      elementCB = options;
      options = defaultOpts;
    }
    if (typeof callback === "object") {
      options = callback;
      callback = void 0;
    }
    this.callback = callback !== null && callback !== void 0 ? callback : null;
    this.options = options !== null && options !== void 0 ? options : defaultOpts;
    this.elementCB = elementCB !== null && elementCB !== void 0 ? elementCB : null;
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
    const elem = this.tagStack.pop();
    if (this.options.withEndIndices) {
      elem.endIndex = this.parser.endIndex;
    }
    if (this.elementCB)
      this.elementCB(elem);
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
      if (this.options.withEndIndices) {
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
    if (this.options.withStartIndices) {
      node.startIndex = this.parser.startIndex;
    }
    if (this.options.withEndIndices) {
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

// node_modules/.pnpm/entities@4.5.0/node_modules/entities/lib/esm/generated/decode-data-html.js
var decode_data_html_default = new Uint16Array(
  // prettier-ignore
  '\u1D41<\xD5\u0131\u028A\u049D\u057B\u05D0\u0675\u06DE\u07A2\u07D6\u080F\u0A4A\u0A91\u0DA1\u0E6D\u0F09\u0F26\u10CA\u1228\u12E1\u1415\u149D\u14C3\u14DF\u1525\0\0\0\0\0\0\u156B\u16CD\u198D\u1C12\u1DDD\u1F7E\u2060\u21B0\u228D\u23C0\u23FB\u2442\u2824\u2912\u2D08\u2E48\u2FCE\u3016\u32BA\u3639\u37AC\u38FE\u3A28\u3A71\u3AE0\u3B2E\u0800EMabcfglmnoprstu\\bfms\x7F\x84\x8B\x90\x95\x98\xA6\xB3\xB9\xC8\xCFlig\u803B\xC6\u40C6P\u803B&\u4026cute\u803B\xC1\u40C1reve;\u4102\u0100iyx}rc\u803B\xC2\u40C2;\u4410r;\uC000\u{1D504}rave\u803B\xC0\u40C0pha;\u4391acr;\u4100d;\u6A53\u0100gp\x9D\xA1on;\u4104f;\uC000\u{1D538}plyFunction;\u6061ing\u803B\xC5\u40C5\u0100cs\xBE\xC3r;\uC000\u{1D49C}ign;\u6254ilde\u803B\xC3\u40C3ml\u803B\xC4\u40C4\u0400aceforsu\xE5\xFB\xFE\u0117\u011C\u0122\u0127\u012A\u0100cr\xEA\xF2kslash;\u6216\u0176\xF6\xF8;\u6AE7ed;\u6306y;\u4411\u0180crt\u0105\u010B\u0114ause;\u6235noullis;\u612Ca;\u4392r;\uC000\u{1D505}pf;\uC000\u{1D539}eve;\u42D8c\xF2\u0113mpeq;\u624E\u0700HOacdefhilorsu\u014D\u0151\u0156\u0180\u019E\u01A2\u01B5\u01B7\u01BA\u01DC\u0215\u0273\u0278\u027Ecy;\u4427PY\u803B\xA9\u40A9\u0180cpy\u015D\u0162\u017Aute;\u4106\u0100;i\u0167\u0168\u62D2talDifferentialD;\u6145leys;\u612D\u0200aeio\u0189\u018E\u0194\u0198ron;\u410Cdil\u803B\xC7\u40C7rc;\u4108nint;\u6230ot;\u410A\u0100dn\u01A7\u01ADilla;\u40B8terDot;\u40B7\xF2\u017Fi;\u43A7rcle\u0200DMPT\u01C7\u01CB\u01D1\u01D6ot;\u6299inus;\u6296lus;\u6295imes;\u6297o\u0100cs\u01E2\u01F8kwiseContourIntegral;\u6232eCurly\u0100DQ\u0203\u020FoubleQuote;\u601Duote;\u6019\u0200lnpu\u021E\u0228\u0247\u0255on\u0100;e\u0225\u0226\u6237;\u6A74\u0180git\u022F\u0236\u023Aruent;\u6261nt;\u622FourIntegral;\u622E\u0100fr\u024C\u024E;\u6102oduct;\u6210nterClockwiseContourIntegral;\u6233oss;\u6A2Fcr;\uC000\u{1D49E}p\u0100;C\u0284\u0285\u62D3ap;\u624D\u0580DJSZacefios\u02A0\u02AC\u02B0\u02B4\u02B8\u02CB\u02D7\u02E1\u02E6\u0333\u048D\u0100;o\u0179\u02A5trahd;\u6911cy;\u4402cy;\u4405cy;\u440F\u0180grs\u02BF\u02C4\u02C7ger;\u6021r;\u61A1hv;\u6AE4\u0100ay\u02D0\u02D5ron;\u410E;\u4414l\u0100;t\u02DD\u02DE\u6207a;\u4394r;\uC000\u{1D507}\u0100af\u02EB\u0327\u0100cm\u02F0\u0322ritical\u0200ADGT\u0300\u0306\u0316\u031Ccute;\u40B4o\u0174\u030B\u030D;\u42D9bleAcute;\u42DDrave;\u4060ilde;\u42DCond;\u62C4ferentialD;\u6146\u0470\u033D\0\0\0\u0342\u0354\0\u0405f;\uC000\u{1D53B}\u0180;DE\u0348\u0349\u034D\u40A8ot;\u60DCqual;\u6250ble\u0300CDLRUV\u0363\u0372\u0382\u03CF\u03E2\u03F8ontourIntegra\xEC\u0239o\u0274\u0379\0\0\u037B\xBB\u0349nArrow;\u61D3\u0100eo\u0387\u03A4ft\u0180ART\u0390\u0396\u03A1rrow;\u61D0ightArrow;\u61D4e\xE5\u02CAng\u0100LR\u03AB\u03C4eft\u0100AR\u03B3\u03B9rrow;\u67F8ightArrow;\u67FAightArrow;\u67F9ight\u0100AT\u03D8\u03DErrow;\u61D2ee;\u62A8p\u0241\u03E9\0\0\u03EFrrow;\u61D1ownArrow;\u61D5erticalBar;\u6225n\u0300ABLRTa\u0412\u042A\u0430\u045E\u047F\u037Crrow\u0180;BU\u041D\u041E\u0422\u6193ar;\u6913pArrow;\u61F5reve;\u4311eft\u02D2\u043A\0\u0446\0\u0450ightVector;\u6950eeVector;\u695Eector\u0100;B\u0459\u045A\u61BDar;\u6956ight\u01D4\u0467\0\u0471eeVector;\u695Fector\u0100;B\u047A\u047B\u61C1ar;\u6957ee\u0100;A\u0486\u0487\u62A4rrow;\u61A7\u0100ct\u0492\u0497r;\uC000\u{1D49F}rok;\u4110\u0800NTacdfglmopqstux\u04BD\u04C0\u04C4\u04CB\u04DE\u04E2\u04E7\u04EE\u04F5\u0521\u052F\u0536\u0552\u055D\u0560\u0565G;\u414AH\u803B\xD0\u40D0cute\u803B\xC9\u40C9\u0180aiy\u04D2\u04D7\u04DCron;\u411Arc\u803B\xCA\u40CA;\u442Dot;\u4116r;\uC000\u{1D508}rave\u803B\xC8\u40C8ement;\u6208\u0100ap\u04FA\u04FEcr;\u4112ty\u0253\u0506\0\0\u0512mallSquare;\u65FBerySmallSquare;\u65AB\u0100gp\u0526\u052Aon;\u4118f;\uC000\u{1D53C}silon;\u4395u\u0100ai\u053C\u0549l\u0100;T\u0542\u0543\u6A75ilde;\u6242librium;\u61CC\u0100ci\u0557\u055Ar;\u6130m;\u6A73a;\u4397ml\u803B\xCB\u40CB\u0100ip\u056A\u056Fsts;\u6203onentialE;\u6147\u0280cfios\u0585\u0588\u058D\u05B2\u05CCy;\u4424r;\uC000\u{1D509}lled\u0253\u0597\0\0\u05A3mallSquare;\u65FCerySmallSquare;\u65AA\u0370\u05BA\0\u05BF\0\0\u05C4f;\uC000\u{1D53D}All;\u6200riertrf;\u6131c\xF2\u05CB\u0600JTabcdfgorst\u05E8\u05EC\u05EF\u05FA\u0600\u0612\u0616\u061B\u061D\u0623\u066C\u0672cy;\u4403\u803B>\u403Emma\u0100;d\u05F7\u05F8\u4393;\u43DCreve;\u411E\u0180eiy\u0607\u060C\u0610dil;\u4122rc;\u411C;\u4413ot;\u4120r;\uC000\u{1D50A};\u62D9pf;\uC000\u{1D53E}eater\u0300EFGLST\u0635\u0644\u064E\u0656\u065B\u0666qual\u0100;L\u063E\u063F\u6265ess;\u62DBullEqual;\u6267reater;\u6AA2ess;\u6277lantEqual;\u6A7Eilde;\u6273cr;\uC000\u{1D4A2};\u626B\u0400Aacfiosu\u0685\u068B\u0696\u069B\u069E\u06AA\u06BE\u06CARDcy;\u442A\u0100ct\u0690\u0694ek;\u42C7;\u405Eirc;\u4124r;\u610ClbertSpace;\u610B\u01F0\u06AF\0\u06B2f;\u610DizontalLine;\u6500\u0100ct\u06C3\u06C5\xF2\u06A9rok;\u4126mp\u0144\u06D0\u06D8ownHum\xF0\u012Fqual;\u624F\u0700EJOacdfgmnostu\u06FA\u06FE\u0703\u0707\u070E\u071A\u071E\u0721\u0728\u0744\u0778\u078B\u078F\u0795cy;\u4415lig;\u4132cy;\u4401cute\u803B\xCD\u40CD\u0100iy\u0713\u0718rc\u803B\xCE\u40CE;\u4418ot;\u4130r;\u6111rave\u803B\xCC\u40CC\u0180;ap\u0720\u072F\u073F\u0100cg\u0734\u0737r;\u412AinaryI;\u6148lie\xF3\u03DD\u01F4\u0749\0\u0762\u0100;e\u074D\u074E\u622C\u0100gr\u0753\u0758ral;\u622Bsection;\u62C2isible\u0100CT\u076C\u0772omma;\u6063imes;\u6062\u0180gpt\u077F\u0783\u0788on;\u412Ef;\uC000\u{1D540}a;\u4399cr;\u6110ilde;\u4128\u01EB\u079A\0\u079Ecy;\u4406l\u803B\xCF\u40CF\u0280cfosu\u07AC\u07B7\u07BC\u07C2\u07D0\u0100iy\u07B1\u07B5rc;\u4134;\u4419r;\uC000\u{1D50D}pf;\uC000\u{1D541}\u01E3\u07C7\0\u07CCr;\uC000\u{1D4A5}rcy;\u4408kcy;\u4404\u0380HJacfos\u07E4\u07E8\u07EC\u07F1\u07FD\u0802\u0808cy;\u4425cy;\u440Cppa;\u439A\u0100ey\u07F6\u07FBdil;\u4136;\u441Ar;\uC000\u{1D50E}pf;\uC000\u{1D542}cr;\uC000\u{1D4A6}\u0580JTaceflmost\u0825\u0829\u082C\u0850\u0863\u09B3\u09B8\u09C7\u09CD\u0A37\u0A47cy;\u4409\u803B<\u403C\u0280cmnpr\u0837\u083C\u0841\u0844\u084Dute;\u4139bda;\u439Bg;\u67EAlacetrf;\u6112r;\u619E\u0180aey\u0857\u085C\u0861ron;\u413Ddil;\u413B;\u441B\u0100fs\u0868\u0970t\u0500ACDFRTUVar\u087E\u08A9\u08B1\u08E0\u08E6\u08FC\u092F\u095B\u0390\u096A\u0100nr\u0883\u088FgleBracket;\u67E8row\u0180;BR\u0899\u089A\u089E\u6190ar;\u61E4ightArrow;\u61C6eiling;\u6308o\u01F5\u08B7\0\u08C3bleBracket;\u67E6n\u01D4\u08C8\0\u08D2eeVector;\u6961ector\u0100;B\u08DB\u08DC\u61C3ar;\u6959loor;\u630Aight\u0100AV\u08EF\u08F5rrow;\u6194ector;\u694E\u0100er\u0901\u0917e\u0180;AV\u0909\u090A\u0910\u62A3rrow;\u61A4ector;\u695Aiangle\u0180;BE\u0924\u0925\u0929\u62B2ar;\u69CFqual;\u62B4p\u0180DTV\u0937\u0942\u094CownVector;\u6951eeVector;\u6960ector\u0100;B\u0956\u0957\u61BFar;\u6958ector\u0100;B\u0965\u0966\u61BCar;\u6952ight\xE1\u039Cs\u0300EFGLST\u097E\u098B\u0995\u099D\u09A2\u09ADqualGreater;\u62DAullEqual;\u6266reater;\u6276ess;\u6AA1lantEqual;\u6A7Dilde;\u6272r;\uC000\u{1D50F}\u0100;e\u09BD\u09BE\u62D8ftarrow;\u61DAidot;\u413F\u0180npw\u09D4\u0A16\u0A1Bg\u0200LRlr\u09DE\u09F7\u0A02\u0A10eft\u0100AR\u09E6\u09ECrrow;\u67F5ightArrow;\u67F7ightArrow;\u67F6eft\u0100ar\u03B3\u0A0Aight\xE1\u03BFight\xE1\u03CAf;\uC000\u{1D543}er\u0100LR\u0A22\u0A2CeftArrow;\u6199ightArrow;\u6198\u0180cht\u0A3E\u0A40\u0A42\xF2\u084C;\u61B0rok;\u4141;\u626A\u0400acefiosu\u0A5A\u0A5D\u0A60\u0A77\u0A7C\u0A85\u0A8B\u0A8Ep;\u6905y;\u441C\u0100dl\u0A65\u0A6FiumSpace;\u605Flintrf;\u6133r;\uC000\u{1D510}nusPlus;\u6213pf;\uC000\u{1D544}c\xF2\u0A76;\u439C\u0480Jacefostu\u0AA3\u0AA7\u0AAD\u0AC0\u0B14\u0B19\u0D91\u0D97\u0D9Ecy;\u440Acute;\u4143\u0180aey\u0AB4\u0AB9\u0ABEron;\u4147dil;\u4145;\u441D\u0180gsw\u0AC7\u0AF0\u0B0Eative\u0180MTV\u0AD3\u0ADF\u0AE8ediumSpace;\u600Bhi\u0100cn\u0AE6\u0AD8\xEB\u0AD9eryThi\xEE\u0AD9ted\u0100GL\u0AF8\u0B06reaterGreate\xF2\u0673essLes\xF3\u0A48Line;\u400Ar;\uC000\u{1D511}\u0200Bnpt\u0B22\u0B28\u0B37\u0B3Areak;\u6060BreakingSpace;\u40A0f;\u6115\u0680;CDEGHLNPRSTV\u0B55\u0B56\u0B6A\u0B7C\u0BA1\u0BEB\u0C04\u0C5E\u0C84\u0CA6\u0CD8\u0D61\u0D85\u6AEC\u0100ou\u0B5B\u0B64ngruent;\u6262pCap;\u626DoubleVerticalBar;\u6226\u0180lqx\u0B83\u0B8A\u0B9Bement;\u6209ual\u0100;T\u0B92\u0B93\u6260ilde;\uC000\u2242\u0338ists;\u6204reater\u0380;EFGLST\u0BB6\u0BB7\u0BBD\u0BC9\u0BD3\u0BD8\u0BE5\u626Fqual;\u6271ullEqual;\uC000\u2267\u0338reater;\uC000\u226B\u0338ess;\u6279lantEqual;\uC000\u2A7E\u0338ilde;\u6275ump\u0144\u0BF2\u0BFDownHump;\uC000\u224E\u0338qual;\uC000\u224F\u0338e\u0100fs\u0C0A\u0C27tTriangle\u0180;BE\u0C1A\u0C1B\u0C21\u62EAar;\uC000\u29CF\u0338qual;\u62ECs\u0300;EGLST\u0C35\u0C36\u0C3C\u0C44\u0C4B\u0C58\u626Equal;\u6270reater;\u6278ess;\uC000\u226A\u0338lantEqual;\uC000\u2A7D\u0338ilde;\u6274ested\u0100GL\u0C68\u0C79reaterGreater;\uC000\u2AA2\u0338essLess;\uC000\u2AA1\u0338recedes\u0180;ES\u0C92\u0C93\u0C9B\u6280qual;\uC000\u2AAF\u0338lantEqual;\u62E0\u0100ei\u0CAB\u0CB9verseElement;\u620CghtTriangle\u0180;BE\u0CCB\u0CCC\u0CD2\u62EBar;\uC000\u29D0\u0338qual;\u62ED\u0100qu\u0CDD\u0D0CuareSu\u0100bp\u0CE8\u0CF9set\u0100;E\u0CF0\u0CF3\uC000\u228F\u0338qual;\u62E2erset\u0100;E\u0D03\u0D06\uC000\u2290\u0338qual;\u62E3\u0180bcp\u0D13\u0D24\u0D4Eset\u0100;E\u0D1B\u0D1E\uC000\u2282\u20D2qual;\u6288ceeds\u0200;EST\u0D32\u0D33\u0D3B\u0D46\u6281qual;\uC000\u2AB0\u0338lantEqual;\u62E1ilde;\uC000\u227F\u0338erset\u0100;E\u0D58\u0D5B\uC000\u2283\u20D2qual;\u6289ilde\u0200;EFT\u0D6E\u0D6F\u0D75\u0D7F\u6241qual;\u6244ullEqual;\u6247ilde;\u6249erticalBar;\u6224cr;\uC000\u{1D4A9}ilde\u803B\xD1\u40D1;\u439D\u0700Eacdfgmoprstuv\u0DBD\u0DC2\u0DC9\u0DD5\u0DDB\u0DE0\u0DE7\u0DFC\u0E02\u0E20\u0E22\u0E32\u0E3F\u0E44lig;\u4152cute\u803B\xD3\u40D3\u0100iy\u0DCE\u0DD3rc\u803B\xD4\u40D4;\u441Eblac;\u4150r;\uC000\u{1D512}rave\u803B\xD2\u40D2\u0180aei\u0DEE\u0DF2\u0DF6cr;\u414Cga;\u43A9cron;\u439Fpf;\uC000\u{1D546}enCurly\u0100DQ\u0E0E\u0E1AoubleQuote;\u601Cuote;\u6018;\u6A54\u0100cl\u0E27\u0E2Cr;\uC000\u{1D4AA}ash\u803B\xD8\u40D8i\u016C\u0E37\u0E3Cde\u803B\xD5\u40D5es;\u6A37ml\u803B\xD6\u40D6er\u0100BP\u0E4B\u0E60\u0100ar\u0E50\u0E53r;\u603Eac\u0100ek\u0E5A\u0E5C;\u63DEet;\u63B4arenthesis;\u63DC\u0480acfhilors\u0E7F\u0E87\u0E8A\u0E8F\u0E92\u0E94\u0E9D\u0EB0\u0EFCrtialD;\u6202y;\u441Fr;\uC000\u{1D513}i;\u43A6;\u43A0usMinus;\u40B1\u0100ip\u0EA2\u0EADncareplan\xE5\u069Df;\u6119\u0200;eio\u0EB9\u0EBA\u0EE0\u0EE4\u6ABBcedes\u0200;EST\u0EC8\u0EC9\u0ECF\u0EDA\u627Aqual;\u6AAFlantEqual;\u627Cilde;\u627Eme;\u6033\u0100dp\u0EE9\u0EEEuct;\u620Fortion\u0100;a\u0225\u0EF9l;\u621D\u0100ci\u0F01\u0F06r;\uC000\u{1D4AB};\u43A8\u0200Ufos\u0F11\u0F16\u0F1B\u0F1FOT\u803B"\u4022r;\uC000\u{1D514}pf;\u611Acr;\uC000\u{1D4AC}\u0600BEacefhiorsu\u0F3E\u0F43\u0F47\u0F60\u0F73\u0FA7\u0FAA\u0FAD\u1096\u10A9\u10B4\u10BEarr;\u6910G\u803B\xAE\u40AE\u0180cnr\u0F4E\u0F53\u0F56ute;\u4154g;\u67EBr\u0100;t\u0F5C\u0F5D\u61A0l;\u6916\u0180aey\u0F67\u0F6C\u0F71ron;\u4158dil;\u4156;\u4420\u0100;v\u0F78\u0F79\u611Cerse\u0100EU\u0F82\u0F99\u0100lq\u0F87\u0F8Eement;\u620Builibrium;\u61CBpEquilibrium;\u696Fr\xBB\u0F79o;\u43A1ght\u0400ACDFTUVa\u0FC1\u0FEB\u0FF3\u1022\u1028\u105B\u1087\u03D8\u0100nr\u0FC6\u0FD2gleBracket;\u67E9row\u0180;BL\u0FDC\u0FDD\u0FE1\u6192ar;\u61E5eftArrow;\u61C4eiling;\u6309o\u01F5\u0FF9\0\u1005bleBracket;\u67E7n\u01D4\u100A\0\u1014eeVector;\u695Dector\u0100;B\u101D\u101E\u61C2ar;\u6955loor;\u630B\u0100er\u102D\u1043e\u0180;AV\u1035\u1036\u103C\u62A2rrow;\u61A6ector;\u695Biangle\u0180;BE\u1050\u1051\u1055\u62B3ar;\u69D0qual;\u62B5p\u0180DTV\u1063\u106E\u1078ownVector;\u694FeeVector;\u695Cector\u0100;B\u1082\u1083\u61BEar;\u6954ector\u0100;B\u1091\u1092\u61C0ar;\u6953\u0100pu\u109B\u109Ef;\u611DndImplies;\u6970ightarrow;\u61DB\u0100ch\u10B9\u10BCr;\u611B;\u61B1leDelayed;\u69F4\u0680HOacfhimoqstu\u10E4\u10F1\u10F7\u10FD\u1119\u111E\u1151\u1156\u1161\u1167\u11B5\u11BB\u11BF\u0100Cc\u10E9\u10EEHcy;\u4429y;\u4428FTcy;\u442Ccute;\u415A\u0280;aeiy\u1108\u1109\u110E\u1113\u1117\u6ABCron;\u4160dil;\u415Erc;\u415C;\u4421r;\uC000\u{1D516}ort\u0200DLRU\u112A\u1134\u113E\u1149ownArrow\xBB\u041EeftArrow\xBB\u089AightArrow\xBB\u0FDDpArrow;\u6191gma;\u43A3allCircle;\u6218pf;\uC000\u{1D54A}\u0272\u116D\0\0\u1170t;\u621Aare\u0200;ISU\u117B\u117C\u1189\u11AF\u65A1ntersection;\u6293u\u0100bp\u118F\u119Eset\u0100;E\u1197\u1198\u628Fqual;\u6291erset\u0100;E\u11A8\u11A9\u6290qual;\u6292nion;\u6294cr;\uC000\u{1D4AE}ar;\u62C6\u0200bcmp\u11C8\u11DB\u1209\u120B\u0100;s\u11CD\u11CE\u62D0et\u0100;E\u11CD\u11D5qual;\u6286\u0100ch\u11E0\u1205eeds\u0200;EST\u11ED\u11EE\u11F4\u11FF\u627Bqual;\u6AB0lantEqual;\u627Dilde;\u627FTh\xE1\u0F8C;\u6211\u0180;es\u1212\u1213\u1223\u62D1rset\u0100;E\u121C\u121D\u6283qual;\u6287et\xBB\u1213\u0580HRSacfhiors\u123E\u1244\u1249\u1255\u125E\u1271\u1276\u129F\u12C2\u12C8\u12D1ORN\u803B\xDE\u40DEADE;\u6122\u0100Hc\u124E\u1252cy;\u440By;\u4426\u0100bu\u125A\u125C;\u4009;\u43A4\u0180aey\u1265\u126A\u126Fron;\u4164dil;\u4162;\u4422r;\uC000\u{1D517}\u0100ei\u127B\u1289\u01F2\u1280\0\u1287efore;\u6234a;\u4398\u0100cn\u128E\u1298kSpace;\uC000\u205F\u200ASpace;\u6009lde\u0200;EFT\u12AB\u12AC\u12B2\u12BC\u623Cqual;\u6243ullEqual;\u6245ilde;\u6248pf;\uC000\u{1D54B}ipleDot;\u60DB\u0100ct\u12D6\u12DBr;\uC000\u{1D4AF}rok;\u4166\u0AE1\u12F7\u130E\u131A\u1326\0\u132C\u1331\0\0\0\0\0\u1338\u133D\u1377\u1385\0\u13FF\u1404\u140A\u1410\u0100cr\u12FB\u1301ute\u803B\xDA\u40DAr\u0100;o\u1307\u1308\u619Fcir;\u6949r\u01E3\u1313\0\u1316y;\u440Eve;\u416C\u0100iy\u131E\u1323rc\u803B\xDB\u40DB;\u4423blac;\u4170r;\uC000\u{1D518}rave\u803B\xD9\u40D9acr;\u416A\u0100di\u1341\u1369er\u0100BP\u1348\u135D\u0100ar\u134D\u1350r;\u405Fac\u0100ek\u1357\u1359;\u63DFet;\u63B5arenthesis;\u63DDon\u0100;P\u1370\u1371\u62C3lus;\u628E\u0100gp\u137B\u137Fon;\u4172f;\uC000\u{1D54C}\u0400ADETadps\u1395\u13AE\u13B8\u13C4\u03E8\u13D2\u13D7\u13F3rrow\u0180;BD\u1150\u13A0\u13A4ar;\u6912ownArrow;\u61C5ownArrow;\u6195quilibrium;\u696Eee\u0100;A\u13CB\u13CC\u62A5rrow;\u61A5own\xE1\u03F3er\u0100LR\u13DE\u13E8eftArrow;\u6196ightArrow;\u6197i\u0100;l\u13F9\u13FA\u43D2on;\u43A5ing;\u416Ecr;\uC000\u{1D4B0}ilde;\u4168ml\u803B\xDC\u40DC\u0480Dbcdefosv\u1427\u142C\u1430\u1433\u143E\u1485\u148A\u1490\u1496ash;\u62ABar;\u6AEBy;\u4412ash\u0100;l\u143B\u143C\u62A9;\u6AE6\u0100er\u1443\u1445;\u62C1\u0180bty\u144C\u1450\u147Aar;\u6016\u0100;i\u144F\u1455cal\u0200BLST\u1461\u1465\u146A\u1474ar;\u6223ine;\u407Ceparator;\u6758ilde;\u6240ThinSpace;\u600Ar;\uC000\u{1D519}pf;\uC000\u{1D54D}cr;\uC000\u{1D4B1}dash;\u62AA\u0280cefos\u14A7\u14AC\u14B1\u14B6\u14BCirc;\u4174dge;\u62C0r;\uC000\u{1D51A}pf;\uC000\u{1D54E}cr;\uC000\u{1D4B2}\u0200fios\u14CB\u14D0\u14D2\u14D8r;\uC000\u{1D51B};\u439Epf;\uC000\u{1D54F}cr;\uC000\u{1D4B3}\u0480AIUacfosu\u14F1\u14F5\u14F9\u14FD\u1504\u150F\u1514\u151A\u1520cy;\u442Fcy;\u4407cy;\u442Ecute\u803B\xDD\u40DD\u0100iy\u1509\u150Drc;\u4176;\u442Br;\uC000\u{1D51C}pf;\uC000\u{1D550}cr;\uC000\u{1D4B4}ml;\u4178\u0400Hacdefos\u1535\u1539\u153F\u154B\u154F\u155D\u1560\u1564cy;\u4416cute;\u4179\u0100ay\u1544\u1549ron;\u417D;\u4417ot;\u417B\u01F2\u1554\0\u155BoWidt\xE8\u0AD9a;\u4396r;\u6128pf;\u6124cr;\uC000\u{1D4B5}\u0BE1\u1583\u158A\u1590\0\u15B0\u15B6\u15BF\0\0\0\0\u15C6\u15DB\u15EB\u165F\u166D\0\u1695\u169B\u16B2\u16B9\0\u16BEcute\u803B\xE1\u40E1reve;\u4103\u0300;Ediuy\u159C\u159D\u15A1\u15A3\u15A8\u15AD\u623E;\uC000\u223E\u0333;\u623Frc\u803B\xE2\u40E2te\u80BB\xB4\u0306;\u4430lig\u803B\xE6\u40E6\u0100;r\xB2\u15BA;\uC000\u{1D51E}rave\u803B\xE0\u40E0\u0100ep\u15CA\u15D6\u0100fp\u15CF\u15D4sym;\u6135\xE8\u15D3ha;\u43B1\u0100ap\u15DFc\u0100cl\u15E4\u15E7r;\u4101g;\u6A3F\u0264\u15F0\0\0\u160A\u0280;adsv\u15FA\u15FB\u15FF\u1601\u1607\u6227nd;\u6A55;\u6A5Clope;\u6A58;\u6A5A\u0380;elmrsz\u1618\u1619\u161B\u161E\u163F\u164F\u1659\u6220;\u69A4e\xBB\u1619sd\u0100;a\u1625\u1626\u6221\u0461\u1630\u1632\u1634\u1636\u1638\u163A\u163C\u163E;\u69A8;\u69A9;\u69AA;\u69AB;\u69AC;\u69AD;\u69AE;\u69AFt\u0100;v\u1645\u1646\u621Fb\u0100;d\u164C\u164D\u62BE;\u699D\u0100pt\u1654\u1657h;\u6222\xBB\xB9arr;\u637C\u0100gp\u1663\u1667on;\u4105f;\uC000\u{1D552}\u0380;Eaeiop\u12C1\u167B\u167D\u1682\u1684\u1687\u168A;\u6A70cir;\u6A6F;\u624Ad;\u624Bs;\u4027rox\u0100;e\u12C1\u1692\xF1\u1683ing\u803B\xE5\u40E5\u0180cty\u16A1\u16A6\u16A8r;\uC000\u{1D4B6};\u402Amp\u0100;e\u12C1\u16AF\xF1\u0288ilde\u803B\xE3\u40E3ml\u803B\xE4\u40E4\u0100ci\u16C2\u16C8onin\xF4\u0272nt;\u6A11\u0800Nabcdefiklnoprsu\u16ED\u16F1\u1730\u173C\u1743\u1748\u1778\u177D\u17E0\u17E6\u1839\u1850\u170D\u193D\u1948\u1970ot;\u6AED\u0100cr\u16F6\u171Ek\u0200ceps\u1700\u1705\u170D\u1713ong;\u624Cpsilon;\u43F6rime;\u6035im\u0100;e\u171A\u171B\u623Dq;\u62CD\u0176\u1722\u1726ee;\u62BDed\u0100;g\u172C\u172D\u6305e\xBB\u172Drk\u0100;t\u135C\u1737brk;\u63B6\u0100oy\u1701\u1741;\u4431quo;\u601E\u0280cmprt\u1753\u175B\u1761\u1764\u1768aus\u0100;e\u010A\u0109ptyv;\u69B0s\xE9\u170Cno\xF5\u0113\u0180ahw\u176F\u1771\u1773;\u43B2;\u6136een;\u626Cr;\uC000\u{1D51F}g\u0380costuvw\u178D\u179D\u17B3\u17C1\u17D5\u17DB\u17DE\u0180aiu\u1794\u1796\u179A\xF0\u0760rc;\u65EFp\xBB\u1371\u0180dpt\u17A4\u17A8\u17ADot;\u6A00lus;\u6A01imes;\u6A02\u0271\u17B9\0\0\u17BEcup;\u6A06ar;\u6605riangle\u0100du\u17CD\u17D2own;\u65BDp;\u65B3plus;\u6A04e\xE5\u1444\xE5\u14ADarow;\u690D\u0180ako\u17ED\u1826\u1835\u0100cn\u17F2\u1823k\u0180lst\u17FA\u05AB\u1802ozenge;\u69EBriangle\u0200;dlr\u1812\u1813\u1818\u181D\u65B4own;\u65BEeft;\u65C2ight;\u65B8k;\u6423\u01B1\u182B\0\u1833\u01B2\u182F\0\u1831;\u6592;\u65914;\u6593ck;\u6588\u0100eo\u183E\u184D\u0100;q\u1843\u1846\uC000=\u20E5uiv;\uC000\u2261\u20E5t;\u6310\u0200ptwx\u1859\u185E\u1867\u186Cf;\uC000\u{1D553}\u0100;t\u13CB\u1863om\xBB\u13CCtie;\u62C8\u0600DHUVbdhmptuv\u1885\u1896\u18AA\u18BB\u18D7\u18DB\u18EC\u18FF\u1905\u190A\u1910\u1921\u0200LRlr\u188E\u1890\u1892\u1894;\u6557;\u6554;\u6556;\u6553\u0280;DUdu\u18A1\u18A2\u18A4\u18A6\u18A8\u6550;\u6566;\u6569;\u6564;\u6567\u0200LRlr\u18B3\u18B5\u18B7\u18B9;\u655D;\u655A;\u655C;\u6559\u0380;HLRhlr\u18CA\u18CB\u18CD\u18CF\u18D1\u18D3\u18D5\u6551;\u656C;\u6563;\u6560;\u656B;\u6562;\u655Fox;\u69C9\u0200LRlr\u18E4\u18E6\u18E8\u18EA;\u6555;\u6552;\u6510;\u650C\u0280;DUdu\u06BD\u18F7\u18F9\u18FB\u18FD;\u6565;\u6568;\u652C;\u6534inus;\u629Flus;\u629Eimes;\u62A0\u0200LRlr\u1919\u191B\u191D\u191F;\u655B;\u6558;\u6518;\u6514\u0380;HLRhlr\u1930\u1931\u1933\u1935\u1937\u1939\u193B\u6502;\u656A;\u6561;\u655E;\u653C;\u6524;\u651C\u0100ev\u0123\u1942bar\u803B\xA6\u40A6\u0200ceio\u1951\u1956\u195A\u1960r;\uC000\u{1D4B7}mi;\u604Fm\u0100;e\u171A\u171Cl\u0180;bh\u1968\u1969\u196B\u405C;\u69C5sub;\u67C8\u016C\u1974\u197El\u0100;e\u1979\u197A\u6022t\xBB\u197Ap\u0180;Ee\u012F\u1985\u1987;\u6AAE\u0100;q\u06DC\u06DB\u0CE1\u19A7\0\u19E8\u1A11\u1A15\u1A32\0\u1A37\u1A50\0\0\u1AB4\0\0\u1AC1\0\0\u1B21\u1B2E\u1B4D\u1B52\0\u1BFD\0\u1C0C\u0180cpr\u19AD\u19B2\u19DDute;\u4107\u0300;abcds\u19BF\u19C0\u19C4\u19CA\u19D5\u19D9\u6229nd;\u6A44rcup;\u6A49\u0100au\u19CF\u19D2p;\u6A4Bp;\u6A47ot;\u6A40;\uC000\u2229\uFE00\u0100eo\u19E2\u19E5t;\u6041\xEE\u0693\u0200aeiu\u19F0\u19FB\u1A01\u1A05\u01F0\u19F5\0\u19F8s;\u6A4Don;\u410Ddil\u803B\xE7\u40E7rc;\u4109ps\u0100;s\u1A0C\u1A0D\u6A4Cm;\u6A50ot;\u410B\u0180dmn\u1A1B\u1A20\u1A26il\u80BB\xB8\u01ADptyv;\u69B2t\u8100\xA2;e\u1A2D\u1A2E\u40A2r\xE4\u01B2r;\uC000\u{1D520}\u0180cei\u1A3D\u1A40\u1A4Dy;\u4447ck\u0100;m\u1A47\u1A48\u6713ark\xBB\u1A48;\u43C7r\u0380;Ecefms\u1A5F\u1A60\u1A62\u1A6B\u1AA4\u1AAA\u1AAE\u65CB;\u69C3\u0180;el\u1A69\u1A6A\u1A6D\u42C6q;\u6257e\u0261\u1A74\0\0\u1A88rrow\u0100lr\u1A7C\u1A81eft;\u61BAight;\u61BB\u0280RSacd\u1A92\u1A94\u1A96\u1A9A\u1A9F\xBB\u0F47;\u64C8st;\u629Birc;\u629Aash;\u629Dnint;\u6A10id;\u6AEFcir;\u69C2ubs\u0100;u\u1ABB\u1ABC\u6663it\xBB\u1ABC\u02EC\u1AC7\u1AD4\u1AFA\0\u1B0Aon\u0100;e\u1ACD\u1ACE\u403A\u0100;q\xC7\xC6\u026D\u1AD9\0\0\u1AE2a\u0100;t\u1ADE\u1ADF\u402C;\u4040\u0180;fl\u1AE8\u1AE9\u1AEB\u6201\xEE\u1160e\u0100mx\u1AF1\u1AF6ent\xBB\u1AE9e\xF3\u024D\u01E7\u1AFE\0\u1B07\u0100;d\u12BB\u1B02ot;\u6A6Dn\xF4\u0246\u0180fry\u1B10\u1B14\u1B17;\uC000\u{1D554}o\xE4\u0254\u8100\xA9;s\u0155\u1B1Dr;\u6117\u0100ao\u1B25\u1B29rr;\u61B5ss;\u6717\u0100cu\u1B32\u1B37r;\uC000\u{1D4B8}\u0100bp\u1B3C\u1B44\u0100;e\u1B41\u1B42\u6ACF;\u6AD1\u0100;e\u1B49\u1B4A\u6AD0;\u6AD2dot;\u62EF\u0380delprvw\u1B60\u1B6C\u1B77\u1B82\u1BAC\u1BD4\u1BF9arr\u0100lr\u1B68\u1B6A;\u6938;\u6935\u0270\u1B72\0\0\u1B75r;\u62DEc;\u62DFarr\u0100;p\u1B7F\u1B80\u61B6;\u693D\u0300;bcdos\u1B8F\u1B90\u1B96\u1BA1\u1BA5\u1BA8\u622Arcap;\u6A48\u0100au\u1B9B\u1B9Ep;\u6A46p;\u6A4Aot;\u628Dr;\u6A45;\uC000\u222A\uFE00\u0200alrv\u1BB5\u1BBF\u1BDE\u1BE3rr\u0100;m\u1BBC\u1BBD\u61B7;\u693Cy\u0180evw\u1BC7\u1BD4\u1BD8q\u0270\u1BCE\0\0\u1BD2re\xE3\u1B73u\xE3\u1B75ee;\u62CEedge;\u62CFen\u803B\xA4\u40A4earrow\u0100lr\u1BEE\u1BF3eft\xBB\u1B80ight\xBB\u1BBDe\xE4\u1BDD\u0100ci\u1C01\u1C07onin\xF4\u01F7nt;\u6231lcty;\u632D\u0980AHabcdefhijlorstuwz\u1C38\u1C3B\u1C3F\u1C5D\u1C69\u1C75\u1C8A\u1C9E\u1CAC\u1CB7\u1CFB\u1CFF\u1D0D\u1D7B\u1D91\u1DAB\u1DBB\u1DC6\u1DCDr\xF2\u0381ar;\u6965\u0200glrs\u1C48\u1C4D\u1C52\u1C54ger;\u6020eth;\u6138\xF2\u1133h\u0100;v\u1C5A\u1C5B\u6010\xBB\u090A\u016B\u1C61\u1C67arow;\u690Fa\xE3\u0315\u0100ay\u1C6E\u1C73ron;\u410F;\u4434\u0180;ao\u0332\u1C7C\u1C84\u0100gr\u02BF\u1C81r;\u61CAtseq;\u6A77\u0180glm\u1C91\u1C94\u1C98\u803B\xB0\u40B0ta;\u43B4ptyv;\u69B1\u0100ir\u1CA3\u1CA8sht;\u697F;\uC000\u{1D521}ar\u0100lr\u1CB3\u1CB5\xBB\u08DC\xBB\u101E\u0280aegsv\u1CC2\u0378\u1CD6\u1CDC\u1CE0m\u0180;os\u0326\u1CCA\u1CD4nd\u0100;s\u0326\u1CD1uit;\u6666amma;\u43DDin;\u62F2\u0180;io\u1CE7\u1CE8\u1CF8\u40F7de\u8100\xF7;o\u1CE7\u1CF0ntimes;\u62C7n\xF8\u1CF7cy;\u4452c\u026F\u1D06\0\0\u1D0Arn;\u631Eop;\u630D\u0280lptuw\u1D18\u1D1D\u1D22\u1D49\u1D55lar;\u4024f;\uC000\u{1D555}\u0280;emps\u030B\u1D2D\u1D37\u1D3D\u1D42q\u0100;d\u0352\u1D33ot;\u6251inus;\u6238lus;\u6214quare;\u62A1blebarwedg\xE5\xFAn\u0180adh\u112E\u1D5D\u1D67ownarrow\xF3\u1C83arpoon\u0100lr\u1D72\u1D76ef\xF4\u1CB4igh\xF4\u1CB6\u0162\u1D7F\u1D85karo\xF7\u0F42\u026F\u1D8A\0\0\u1D8Ern;\u631Fop;\u630C\u0180cot\u1D98\u1DA3\u1DA6\u0100ry\u1D9D\u1DA1;\uC000\u{1D4B9};\u4455l;\u69F6rok;\u4111\u0100dr\u1DB0\u1DB4ot;\u62F1i\u0100;f\u1DBA\u1816\u65BF\u0100ah\u1DC0\u1DC3r\xF2\u0429a\xF2\u0FA6angle;\u69A6\u0100ci\u1DD2\u1DD5y;\u445Fgrarr;\u67FF\u0900Dacdefglmnopqrstux\u1E01\u1E09\u1E19\u1E38\u0578\u1E3C\u1E49\u1E61\u1E7E\u1EA5\u1EAF\u1EBD\u1EE1\u1F2A\u1F37\u1F44\u1F4E\u1F5A\u0100Do\u1E06\u1D34o\xF4\u1C89\u0100cs\u1E0E\u1E14ute\u803B\xE9\u40E9ter;\u6A6E\u0200aioy\u1E22\u1E27\u1E31\u1E36ron;\u411Br\u0100;c\u1E2D\u1E2E\u6256\u803B\xEA\u40EAlon;\u6255;\u444Dot;\u4117\u0100Dr\u1E41\u1E45ot;\u6252;\uC000\u{1D522}\u0180;rs\u1E50\u1E51\u1E57\u6A9Aave\u803B\xE8\u40E8\u0100;d\u1E5C\u1E5D\u6A96ot;\u6A98\u0200;ils\u1E6A\u1E6B\u1E72\u1E74\u6A99nters;\u63E7;\u6113\u0100;d\u1E79\u1E7A\u6A95ot;\u6A97\u0180aps\u1E85\u1E89\u1E97cr;\u4113ty\u0180;sv\u1E92\u1E93\u1E95\u6205et\xBB\u1E93p\u01001;\u1E9D\u1EA4\u0133\u1EA1\u1EA3;\u6004;\u6005\u6003\u0100gs\u1EAA\u1EAC;\u414Bp;\u6002\u0100gp\u1EB4\u1EB8on;\u4119f;\uC000\u{1D556}\u0180als\u1EC4\u1ECE\u1ED2r\u0100;s\u1ECA\u1ECB\u62D5l;\u69E3us;\u6A71i\u0180;lv\u1EDA\u1EDB\u1EDF\u43B5on\xBB\u1EDB;\u43F5\u0200csuv\u1EEA\u1EF3\u1F0B\u1F23\u0100io\u1EEF\u1E31rc\xBB\u1E2E\u0269\u1EF9\0\0\u1EFB\xED\u0548ant\u0100gl\u1F02\u1F06tr\xBB\u1E5Dess\xBB\u1E7A\u0180aei\u1F12\u1F16\u1F1Als;\u403Dst;\u625Fv\u0100;D\u0235\u1F20D;\u6A78parsl;\u69E5\u0100Da\u1F2F\u1F33ot;\u6253rr;\u6971\u0180cdi\u1F3E\u1F41\u1EF8r;\u612Fo\xF4\u0352\u0100ah\u1F49\u1F4B;\u43B7\u803B\xF0\u40F0\u0100mr\u1F53\u1F57l\u803B\xEB\u40EBo;\u60AC\u0180cip\u1F61\u1F64\u1F67l;\u4021s\xF4\u056E\u0100eo\u1F6C\u1F74ctatio\xEE\u0559nential\xE5\u0579\u09E1\u1F92\0\u1F9E\0\u1FA1\u1FA7\0\0\u1FC6\u1FCC\0\u1FD3\0\u1FE6\u1FEA\u2000\0\u2008\u205Allingdotse\xF1\u1E44y;\u4444male;\u6640\u0180ilr\u1FAD\u1FB3\u1FC1lig;\u8000\uFB03\u0269\u1FB9\0\0\u1FBDg;\u8000\uFB00ig;\u8000\uFB04;\uC000\u{1D523}lig;\u8000\uFB01lig;\uC000fj\u0180alt\u1FD9\u1FDC\u1FE1t;\u666Dig;\u8000\uFB02ns;\u65B1of;\u4192\u01F0\u1FEE\0\u1FF3f;\uC000\u{1D557}\u0100ak\u05BF\u1FF7\u0100;v\u1FFC\u1FFD\u62D4;\u6AD9artint;\u6A0D\u0100ao\u200C\u2055\u0100cs\u2011\u2052\u03B1\u201A\u2030\u2038\u2045\u2048\0\u2050\u03B2\u2022\u2025\u2027\u202A\u202C\0\u202E\u803B\xBD\u40BD;\u6153\u803B\xBC\u40BC;\u6155;\u6159;\u615B\u01B3\u2034\0\u2036;\u6154;\u6156\u02B4\u203E\u2041\0\0\u2043\u803B\xBE\u40BE;\u6157;\u615C5;\u6158\u01B6\u204C\0\u204E;\u615A;\u615D8;\u615El;\u6044wn;\u6322cr;\uC000\u{1D4BB}\u0880Eabcdefgijlnorstv\u2082\u2089\u209F\u20A5\u20B0\u20B4\u20F0\u20F5\u20FA\u20FF\u2103\u2112\u2138\u0317\u213E\u2152\u219E\u0100;l\u064D\u2087;\u6A8C\u0180cmp\u2090\u2095\u209Dute;\u41F5ma\u0100;d\u209C\u1CDA\u43B3;\u6A86reve;\u411F\u0100iy\u20AA\u20AErc;\u411D;\u4433ot;\u4121\u0200;lqs\u063E\u0642\u20BD\u20C9\u0180;qs\u063E\u064C\u20C4lan\xF4\u0665\u0200;cdl\u0665\u20D2\u20D5\u20E5c;\u6AA9ot\u0100;o\u20DC\u20DD\u6A80\u0100;l\u20E2\u20E3\u6A82;\u6A84\u0100;e\u20EA\u20ED\uC000\u22DB\uFE00s;\u6A94r;\uC000\u{1D524}\u0100;g\u0673\u061Bmel;\u6137cy;\u4453\u0200;Eaj\u065A\u210C\u210E\u2110;\u6A92;\u6AA5;\u6AA4\u0200Eaes\u211B\u211D\u2129\u2134;\u6269p\u0100;p\u2123\u2124\u6A8Arox\xBB\u2124\u0100;q\u212E\u212F\u6A88\u0100;q\u212E\u211Bim;\u62E7pf;\uC000\u{1D558}\u0100ci\u2143\u2146r;\u610Am\u0180;el\u066B\u214E\u2150;\u6A8E;\u6A90\u8300>;cdlqr\u05EE\u2160\u216A\u216E\u2173\u2179\u0100ci\u2165\u2167;\u6AA7r;\u6A7Aot;\u62D7Par;\u6995uest;\u6A7C\u0280adels\u2184\u216A\u2190\u0656\u219B\u01F0\u2189\0\u218Epro\xF8\u209Er;\u6978q\u0100lq\u063F\u2196les\xF3\u2088i\xED\u066B\u0100en\u21A3\u21ADrtneqq;\uC000\u2269\uFE00\xC5\u21AA\u0500Aabcefkosy\u21C4\u21C7\u21F1\u21F5\u21FA\u2218\u221D\u222F\u2268\u227Dr\xF2\u03A0\u0200ilmr\u21D0\u21D4\u21D7\u21DBrs\xF0\u1484f\xBB\u2024il\xF4\u06A9\u0100dr\u21E0\u21E4cy;\u444A\u0180;cw\u08F4\u21EB\u21EFir;\u6948;\u61ADar;\u610Firc;\u4125\u0180alr\u2201\u220E\u2213rts\u0100;u\u2209\u220A\u6665it\xBB\u220Alip;\u6026con;\u62B9r;\uC000\u{1D525}s\u0100ew\u2223\u2229arow;\u6925arow;\u6926\u0280amopr\u223A\u223E\u2243\u225E\u2263rr;\u61FFtht;\u623Bk\u0100lr\u2249\u2253eftarrow;\u61A9ightarrow;\u61AAf;\uC000\u{1D559}bar;\u6015\u0180clt\u226F\u2274\u2278r;\uC000\u{1D4BD}as\xE8\u21F4rok;\u4127\u0100bp\u2282\u2287ull;\u6043hen\xBB\u1C5B\u0AE1\u22A3\0\u22AA\0\u22B8\u22C5\u22CE\0\u22D5\u22F3\0\0\u22F8\u2322\u2367\u2362\u237F\0\u2386\u23AA\u23B4cute\u803B\xED\u40ED\u0180;iy\u0771\u22B0\u22B5rc\u803B\xEE\u40EE;\u4438\u0100cx\u22BC\u22BFy;\u4435cl\u803B\xA1\u40A1\u0100fr\u039F\u22C9;\uC000\u{1D526}rave\u803B\xEC\u40EC\u0200;ino\u073E\u22DD\u22E9\u22EE\u0100in\u22E2\u22E6nt;\u6A0Ct;\u622Dfin;\u69DCta;\u6129lig;\u4133\u0180aop\u22FE\u231A\u231D\u0180cgt\u2305\u2308\u2317r;\u412B\u0180elp\u071F\u230F\u2313in\xE5\u078Ear\xF4\u0720h;\u4131f;\u62B7ed;\u41B5\u0280;cfot\u04F4\u232C\u2331\u233D\u2341are;\u6105in\u0100;t\u2338\u2339\u621Eie;\u69DDdo\xF4\u2319\u0280;celp\u0757\u234C\u2350\u235B\u2361al;\u62BA\u0100gr\u2355\u2359er\xF3\u1563\xE3\u234Darhk;\u6A17rod;\u6A3C\u0200cgpt\u236F\u2372\u2376\u237By;\u4451on;\u412Ff;\uC000\u{1D55A}a;\u43B9uest\u803B\xBF\u40BF\u0100ci\u238A\u238Fr;\uC000\u{1D4BE}n\u0280;Edsv\u04F4\u239B\u239D\u23A1\u04F3;\u62F9ot;\u62F5\u0100;v\u23A6\u23A7\u62F4;\u62F3\u0100;i\u0777\u23AElde;\u4129\u01EB\u23B8\0\u23BCcy;\u4456l\u803B\xEF\u40EF\u0300cfmosu\u23CC\u23D7\u23DC\u23E1\u23E7\u23F5\u0100iy\u23D1\u23D5rc;\u4135;\u4439r;\uC000\u{1D527}ath;\u4237pf;\uC000\u{1D55B}\u01E3\u23EC\0\u23F1r;\uC000\u{1D4BF}rcy;\u4458kcy;\u4454\u0400acfghjos\u240B\u2416\u2422\u2427\u242D\u2431\u2435\u243Bppa\u0100;v\u2413\u2414\u43BA;\u43F0\u0100ey\u241B\u2420dil;\u4137;\u443Ar;\uC000\u{1D528}reen;\u4138cy;\u4445cy;\u445Cpf;\uC000\u{1D55C}cr;\uC000\u{1D4C0}\u0B80ABEHabcdefghjlmnoprstuv\u2470\u2481\u2486\u248D\u2491\u250E\u253D\u255A\u2580\u264E\u265E\u2665\u2679\u267D\u269A\u26B2\u26D8\u275D\u2768\u278B\u27C0\u2801\u2812\u0180art\u2477\u247A\u247Cr\xF2\u09C6\xF2\u0395ail;\u691Barr;\u690E\u0100;g\u0994\u248B;\u6A8Bar;\u6962\u0963\u24A5\0\u24AA\0\u24B1\0\0\0\0\0\u24B5\u24BA\0\u24C6\u24C8\u24CD\0\u24F9ute;\u413Amptyv;\u69B4ra\xEE\u084Cbda;\u43BBg\u0180;dl\u088E\u24C1\u24C3;\u6991\xE5\u088E;\u6A85uo\u803B\xAB\u40ABr\u0400;bfhlpst\u0899\u24DE\u24E6\u24E9\u24EB\u24EE\u24F1\u24F5\u0100;f\u089D\u24E3s;\u691Fs;\u691D\xEB\u2252p;\u61ABl;\u6939im;\u6973l;\u61A2\u0180;ae\u24FF\u2500\u2504\u6AABil;\u6919\u0100;s\u2509\u250A\u6AAD;\uC000\u2AAD\uFE00\u0180abr\u2515\u2519\u251Drr;\u690Crk;\u6772\u0100ak\u2522\u252Cc\u0100ek\u2528\u252A;\u407B;\u405B\u0100es\u2531\u2533;\u698Bl\u0100du\u2539\u253B;\u698F;\u698D\u0200aeuy\u2546\u254B\u2556\u2558ron;\u413E\u0100di\u2550\u2554il;\u413C\xEC\u08B0\xE2\u2529;\u443B\u0200cqrs\u2563\u2566\u256D\u257Da;\u6936uo\u0100;r\u0E19\u1746\u0100du\u2572\u2577har;\u6967shar;\u694Bh;\u61B2\u0280;fgqs\u258B\u258C\u0989\u25F3\u25FF\u6264t\u0280ahlrt\u2598\u25A4\u25B7\u25C2\u25E8rrow\u0100;t\u0899\u25A1a\xE9\u24F6arpoon\u0100du\u25AF\u25B4own\xBB\u045Ap\xBB\u0966eftarrows;\u61C7ight\u0180ahs\u25CD\u25D6\u25DErrow\u0100;s\u08F4\u08A7arpoon\xF3\u0F98quigarro\xF7\u21F0hreetimes;\u62CB\u0180;qs\u258B\u0993\u25FAlan\xF4\u09AC\u0280;cdgs\u09AC\u260A\u260D\u261D\u2628c;\u6AA8ot\u0100;o\u2614\u2615\u6A7F\u0100;r\u261A\u261B\u6A81;\u6A83\u0100;e\u2622\u2625\uC000\u22DA\uFE00s;\u6A93\u0280adegs\u2633\u2639\u263D\u2649\u264Bppro\xF8\u24C6ot;\u62D6q\u0100gq\u2643\u2645\xF4\u0989gt\xF2\u248C\xF4\u099Bi\xED\u09B2\u0180ilr\u2655\u08E1\u265Asht;\u697C;\uC000\u{1D529}\u0100;E\u099C\u2663;\u6A91\u0161\u2669\u2676r\u0100du\u25B2\u266E\u0100;l\u0965\u2673;\u696Alk;\u6584cy;\u4459\u0280;acht\u0A48\u2688\u268B\u2691\u2696r\xF2\u25C1orne\xF2\u1D08ard;\u696Bri;\u65FA\u0100io\u269F\u26A4dot;\u4140ust\u0100;a\u26AC\u26AD\u63B0che\xBB\u26AD\u0200Eaes\u26BB\u26BD\u26C9\u26D4;\u6268p\u0100;p\u26C3\u26C4\u6A89rox\xBB\u26C4\u0100;q\u26CE\u26CF\u6A87\u0100;q\u26CE\u26BBim;\u62E6\u0400abnoptwz\u26E9\u26F4\u26F7\u271A\u272F\u2741\u2747\u2750\u0100nr\u26EE\u26F1g;\u67ECr;\u61FDr\xEB\u08C1g\u0180lmr\u26FF\u270D\u2714eft\u0100ar\u09E6\u2707ight\xE1\u09F2apsto;\u67FCight\xE1\u09FDparrow\u0100lr\u2725\u2729ef\xF4\u24EDight;\u61AC\u0180afl\u2736\u2739\u273Dr;\u6985;\uC000\u{1D55D}us;\u6A2Dimes;\u6A34\u0161\u274B\u274Fst;\u6217\xE1\u134E\u0180;ef\u2757\u2758\u1800\u65CAnge\xBB\u2758ar\u0100;l\u2764\u2765\u4028t;\u6993\u0280achmt\u2773\u2776\u277C\u2785\u2787r\xF2\u08A8orne\xF2\u1D8Car\u0100;d\u0F98\u2783;\u696D;\u600Eri;\u62BF\u0300achiqt\u2798\u279D\u0A40\u27A2\u27AE\u27BBquo;\u6039r;\uC000\u{1D4C1}m\u0180;eg\u09B2\u27AA\u27AC;\u6A8D;\u6A8F\u0100bu\u252A\u27B3o\u0100;r\u0E1F\u27B9;\u601Arok;\u4142\u8400<;cdhilqr\u082B\u27D2\u2639\u27DC\u27E0\u27E5\u27EA\u27F0\u0100ci\u27D7\u27D9;\u6AA6r;\u6A79re\xE5\u25F2mes;\u62C9arr;\u6976uest;\u6A7B\u0100Pi\u27F5\u27F9ar;\u6996\u0180;ef\u2800\u092D\u181B\u65C3r\u0100du\u2807\u280Dshar;\u694Ahar;\u6966\u0100en\u2817\u2821rtneqq;\uC000\u2268\uFE00\xC5\u281E\u0700Dacdefhilnopsu\u2840\u2845\u2882\u288E\u2893\u28A0\u28A5\u28A8\u28DA\u28E2\u28E4\u0A83\u28F3\u2902Dot;\u623A\u0200clpr\u284E\u2852\u2863\u287Dr\u803B\xAF\u40AF\u0100et\u2857\u2859;\u6642\u0100;e\u285E\u285F\u6720se\xBB\u285F\u0100;s\u103B\u2868to\u0200;dlu\u103B\u2873\u2877\u287Bow\xEE\u048Cef\xF4\u090F\xF0\u13D1ker;\u65AE\u0100oy\u2887\u288Cmma;\u6A29;\u443Cash;\u6014asuredangle\xBB\u1626r;\uC000\u{1D52A}o;\u6127\u0180cdn\u28AF\u28B4\u28C9ro\u803B\xB5\u40B5\u0200;acd\u1464\u28BD\u28C0\u28C4s\xF4\u16A7ir;\u6AF0ot\u80BB\xB7\u01B5us\u0180;bd\u28D2\u1903\u28D3\u6212\u0100;u\u1D3C\u28D8;\u6A2A\u0163\u28DE\u28E1p;\u6ADB\xF2\u2212\xF0\u0A81\u0100dp\u28E9\u28EEels;\u62A7f;\uC000\u{1D55E}\u0100ct\u28F8\u28FDr;\uC000\u{1D4C2}pos\xBB\u159D\u0180;lm\u2909\u290A\u290D\u43BCtimap;\u62B8\u0C00GLRVabcdefghijlmoprstuvw\u2942\u2953\u297E\u2989\u2998\u29DA\u29E9\u2A15\u2A1A\u2A58\u2A5D\u2A83\u2A95\u2AA4\u2AA8\u2B04\u2B07\u2B44\u2B7F\u2BAE\u2C34\u2C67\u2C7C\u2CE9\u0100gt\u2947\u294B;\uC000\u22D9\u0338\u0100;v\u2950\u0BCF\uC000\u226B\u20D2\u0180elt\u295A\u2972\u2976ft\u0100ar\u2961\u2967rrow;\u61CDightarrow;\u61CE;\uC000\u22D8\u0338\u0100;v\u297B\u0C47\uC000\u226A\u20D2ightarrow;\u61CF\u0100Dd\u298E\u2993ash;\u62AFash;\u62AE\u0280bcnpt\u29A3\u29A7\u29AC\u29B1\u29CCla\xBB\u02DEute;\u4144g;\uC000\u2220\u20D2\u0280;Eiop\u0D84\u29BC\u29C0\u29C5\u29C8;\uC000\u2A70\u0338d;\uC000\u224B\u0338s;\u4149ro\xF8\u0D84ur\u0100;a\u29D3\u29D4\u666El\u0100;s\u29D3\u0B38\u01F3\u29DF\0\u29E3p\u80BB\xA0\u0B37mp\u0100;e\u0BF9\u0C00\u0280aeouy\u29F4\u29FE\u2A03\u2A10\u2A13\u01F0\u29F9\0\u29FB;\u6A43on;\u4148dil;\u4146ng\u0100;d\u0D7E\u2A0Aot;\uC000\u2A6D\u0338p;\u6A42;\u443Dash;\u6013\u0380;Aadqsx\u0B92\u2A29\u2A2D\u2A3B\u2A41\u2A45\u2A50rr;\u61D7r\u0100hr\u2A33\u2A36k;\u6924\u0100;o\u13F2\u13F0ot;\uC000\u2250\u0338ui\xF6\u0B63\u0100ei\u2A4A\u2A4Ear;\u6928\xED\u0B98ist\u0100;s\u0BA0\u0B9Fr;\uC000\u{1D52B}\u0200Eest\u0BC5\u2A66\u2A79\u2A7C\u0180;qs\u0BBC\u2A6D\u0BE1\u0180;qs\u0BBC\u0BC5\u2A74lan\xF4\u0BE2i\xED\u0BEA\u0100;r\u0BB6\u2A81\xBB\u0BB7\u0180Aap\u2A8A\u2A8D\u2A91r\xF2\u2971rr;\u61AEar;\u6AF2\u0180;sv\u0F8D\u2A9C\u0F8C\u0100;d\u2AA1\u2AA2\u62FC;\u62FAcy;\u445A\u0380AEadest\u2AB7\u2ABA\u2ABE\u2AC2\u2AC5\u2AF6\u2AF9r\xF2\u2966;\uC000\u2266\u0338rr;\u619Ar;\u6025\u0200;fqs\u0C3B\u2ACE\u2AE3\u2AEFt\u0100ar\u2AD4\u2AD9rro\xF7\u2AC1ightarro\xF7\u2A90\u0180;qs\u0C3B\u2ABA\u2AEAlan\xF4\u0C55\u0100;s\u0C55\u2AF4\xBB\u0C36i\xED\u0C5D\u0100;r\u0C35\u2AFEi\u0100;e\u0C1A\u0C25i\xE4\u0D90\u0100pt\u2B0C\u2B11f;\uC000\u{1D55F}\u8180\xAC;in\u2B19\u2B1A\u2B36\u40ACn\u0200;Edv\u0B89\u2B24\u2B28\u2B2E;\uC000\u22F9\u0338ot;\uC000\u22F5\u0338\u01E1\u0B89\u2B33\u2B35;\u62F7;\u62F6i\u0100;v\u0CB8\u2B3C\u01E1\u0CB8\u2B41\u2B43;\u62FE;\u62FD\u0180aor\u2B4B\u2B63\u2B69r\u0200;ast\u0B7B\u2B55\u2B5A\u2B5Flle\xEC\u0B7Bl;\uC000\u2AFD\u20E5;\uC000\u2202\u0338lint;\u6A14\u0180;ce\u0C92\u2B70\u2B73u\xE5\u0CA5\u0100;c\u0C98\u2B78\u0100;e\u0C92\u2B7D\xF1\u0C98\u0200Aait\u2B88\u2B8B\u2B9D\u2BA7r\xF2\u2988rr\u0180;cw\u2B94\u2B95\u2B99\u619B;\uC000\u2933\u0338;\uC000\u219D\u0338ghtarrow\xBB\u2B95ri\u0100;e\u0CCB\u0CD6\u0380chimpqu\u2BBD\u2BCD\u2BD9\u2B04\u0B78\u2BE4\u2BEF\u0200;cer\u0D32\u2BC6\u0D37\u2BC9u\xE5\u0D45;\uC000\u{1D4C3}ort\u026D\u2B05\0\0\u2BD6ar\xE1\u2B56m\u0100;e\u0D6E\u2BDF\u0100;q\u0D74\u0D73su\u0100bp\u2BEB\u2BED\xE5\u0CF8\xE5\u0D0B\u0180bcp\u2BF6\u2C11\u2C19\u0200;Ees\u2BFF\u2C00\u0D22\u2C04\u6284;\uC000\u2AC5\u0338et\u0100;e\u0D1B\u2C0Bq\u0100;q\u0D23\u2C00c\u0100;e\u0D32\u2C17\xF1\u0D38\u0200;Ees\u2C22\u2C23\u0D5F\u2C27\u6285;\uC000\u2AC6\u0338et\u0100;e\u0D58\u2C2Eq\u0100;q\u0D60\u2C23\u0200gilr\u2C3D\u2C3F\u2C45\u2C47\xEC\u0BD7lde\u803B\xF1\u40F1\xE7\u0C43iangle\u0100lr\u2C52\u2C5Ceft\u0100;e\u0C1A\u2C5A\xF1\u0C26ight\u0100;e\u0CCB\u2C65\xF1\u0CD7\u0100;m\u2C6C\u2C6D\u43BD\u0180;es\u2C74\u2C75\u2C79\u4023ro;\u6116p;\u6007\u0480DHadgilrs\u2C8F\u2C94\u2C99\u2C9E\u2CA3\u2CB0\u2CB6\u2CD3\u2CE3ash;\u62ADarr;\u6904p;\uC000\u224D\u20D2ash;\u62AC\u0100et\u2CA8\u2CAC;\uC000\u2265\u20D2;\uC000>\u20D2nfin;\u69DE\u0180Aet\u2CBD\u2CC1\u2CC5rr;\u6902;\uC000\u2264\u20D2\u0100;r\u2CCA\u2CCD\uC000<\u20D2ie;\uC000\u22B4\u20D2\u0100At\u2CD8\u2CDCrr;\u6903rie;\uC000\u22B5\u20D2im;\uC000\u223C\u20D2\u0180Aan\u2CF0\u2CF4\u2D02rr;\u61D6r\u0100hr\u2CFA\u2CFDk;\u6923\u0100;o\u13E7\u13E5ear;\u6927\u1253\u1A95\0\0\0\0\0\0\0\0\0\0\0\0\0\u2D2D\0\u2D38\u2D48\u2D60\u2D65\u2D72\u2D84\u1B07\0\0\u2D8D\u2DAB\0\u2DC8\u2DCE\0\u2DDC\u2E19\u2E2B\u2E3E\u2E43\u0100cs\u2D31\u1A97ute\u803B\xF3\u40F3\u0100iy\u2D3C\u2D45r\u0100;c\u1A9E\u2D42\u803B\xF4\u40F4;\u443E\u0280abios\u1AA0\u2D52\u2D57\u01C8\u2D5Alac;\u4151v;\u6A38old;\u69BClig;\u4153\u0100cr\u2D69\u2D6Dir;\u69BF;\uC000\u{1D52C}\u036F\u2D79\0\0\u2D7C\0\u2D82n;\u42DBave\u803B\xF2\u40F2;\u69C1\u0100bm\u2D88\u0DF4ar;\u69B5\u0200acit\u2D95\u2D98\u2DA5\u2DA8r\xF2\u1A80\u0100ir\u2D9D\u2DA0r;\u69BEoss;\u69BBn\xE5\u0E52;\u69C0\u0180aei\u2DB1\u2DB5\u2DB9cr;\u414Dga;\u43C9\u0180cdn\u2DC0\u2DC5\u01CDron;\u43BF;\u69B6pf;\uC000\u{1D560}\u0180ael\u2DD4\u2DD7\u01D2r;\u69B7rp;\u69B9\u0380;adiosv\u2DEA\u2DEB\u2DEE\u2E08\u2E0D\u2E10\u2E16\u6228r\xF2\u1A86\u0200;efm\u2DF7\u2DF8\u2E02\u2E05\u6A5Dr\u0100;o\u2DFE\u2DFF\u6134f\xBB\u2DFF\u803B\xAA\u40AA\u803B\xBA\u40BAgof;\u62B6r;\u6A56lope;\u6A57;\u6A5B\u0180clo\u2E1F\u2E21\u2E27\xF2\u2E01ash\u803B\xF8\u40F8l;\u6298i\u016C\u2E2F\u2E34de\u803B\xF5\u40F5es\u0100;a\u01DB\u2E3As;\u6A36ml\u803B\xF6\u40F6bar;\u633D\u0AE1\u2E5E\0\u2E7D\0\u2E80\u2E9D\0\u2EA2\u2EB9\0\0\u2ECB\u0E9C\0\u2F13\0\0\u2F2B\u2FBC\0\u2FC8r\u0200;ast\u0403\u2E67\u2E72\u0E85\u8100\xB6;l\u2E6D\u2E6E\u40B6le\xEC\u0403\u0269\u2E78\0\0\u2E7Bm;\u6AF3;\u6AFDy;\u443Fr\u0280cimpt\u2E8B\u2E8F\u2E93\u1865\u2E97nt;\u4025od;\u402Eil;\u6030enk;\u6031r;\uC000\u{1D52D}\u0180imo\u2EA8\u2EB0\u2EB4\u0100;v\u2EAD\u2EAE\u43C6;\u43D5ma\xF4\u0A76ne;\u660E\u0180;tv\u2EBF\u2EC0\u2EC8\u43C0chfork\xBB\u1FFD;\u43D6\u0100au\u2ECF\u2EDFn\u0100ck\u2ED5\u2EDDk\u0100;h\u21F4\u2EDB;\u610E\xF6\u21F4s\u0480;abcdemst\u2EF3\u2EF4\u1908\u2EF9\u2EFD\u2F04\u2F06\u2F0A\u2F0E\u402Bcir;\u6A23ir;\u6A22\u0100ou\u1D40\u2F02;\u6A25;\u6A72n\u80BB\xB1\u0E9Dim;\u6A26wo;\u6A27\u0180ipu\u2F19\u2F20\u2F25ntint;\u6A15f;\uC000\u{1D561}nd\u803B\xA3\u40A3\u0500;Eaceinosu\u0EC8\u2F3F\u2F41\u2F44\u2F47\u2F81\u2F89\u2F92\u2F7E\u2FB6;\u6AB3p;\u6AB7u\xE5\u0ED9\u0100;c\u0ECE\u2F4C\u0300;acens\u0EC8\u2F59\u2F5F\u2F66\u2F68\u2F7Eppro\xF8\u2F43urlye\xF1\u0ED9\xF1\u0ECE\u0180aes\u2F6F\u2F76\u2F7Approx;\u6AB9qq;\u6AB5im;\u62E8i\xED\u0EDFme\u0100;s\u2F88\u0EAE\u6032\u0180Eas\u2F78\u2F90\u2F7A\xF0\u2F75\u0180dfp\u0EEC\u2F99\u2FAF\u0180als\u2FA0\u2FA5\u2FAAlar;\u632Eine;\u6312urf;\u6313\u0100;t\u0EFB\u2FB4\xEF\u0EFBrel;\u62B0\u0100ci\u2FC0\u2FC5r;\uC000\u{1D4C5};\u43C8ncsp;\u6008\u0300fiopsu\u2FDA\u22E2\u2FDF\u2FE5\u2FEB\u2FF1r;\uC000\u{1D52E}pf;\uC000\u{1D562}rime;\u6057cr;\uC000\u{1D4C6}\u0180aeo\u2FF8\u3009\u3013t\u0100ei\u2FFE\u3005rnion\xF3\u06B0nt;\u6A16st\u0100;e\u3010\u3011\u403F\xF1\u1F19\xF4\u0F14\u0A80ABHabcdefhilmnoprstux\u3040\u3051\u3055\u3059\u30E0\u310E\u312B\u3147\u3162\u3172\u318E\u3206\u3215\u3224\u3229\u3258\u326E\u3272\u3290\u32B0\u32B7\u0180art\u3047\u304A\u304Cr\xF2\u10B3\xF2\u03DDail;\u691Car\xF2\u1C65ar;\u6964\u0380cdenqrt\u3068\u3075\u3078\u307F\u308F\u3094\u30CC\u0100eu\u306D\u3071;\uC000\u223D\u0331te;\u4155i\xE3\u116Emptyv;\u69B3g\u0200;del\u0FD1\u3089\u308B\u308D;\u6992;\u69A5\xE5\u0FD1uo\u803B\xBB\u40BBr\u0580;abcfhlpstw\u0FDC\u30AC\u30AF\u30B7\u30B9\u30BC\u30BE\u30C0\u30C3\u30C7\u30CAp;\u6975\u0100;f\u0FE0\u30B4s;\u6920;\u6933s;\u691E\xEB\u225D\xF0\u272El;\u6945im;\u6974l;\u61A3;\u619D\u0100ai\u30D1\u30D5il;\u691Ao\u0100;n\u30DB\u30DC\u6236al\xF3\u0F1E\u0180abr\u30E7\u30EA\u30EEr\xF2\u17E5rk;\u6773\u0100ak\u30F3\u30FDc\u0100ek\u30F9\u30FB;\u407D;\u405D\u0100es\u3102\u3104;\u698Cl\u0100du\u310A\u310C;\u698E;\u6990\u0200aeuy\u3117\u311C\u3127\u3129ron;\u4159\u0100di\u3121\u3125il;\u4157\xEC\u0FF2\xE2\u30FA;\u4440\u0200clqs\u3134\u3137\u313D\u3144a;\u6937dhar;\u6969uo\u0100;r\u020E\u020Dh;\u61B3\u0180acg\u314E\u315F\u0F44l\u0200;ips\u0F78\u3158\u315B\u109Cn\xE5\u10BBar\xF4\u0FA9t;\u65AD\u0180ilr\u3169\u1023\u316Esht;\u697D;\uC000\u{1D52F}\u0100ao\u3177\u3186r\u0100du\u317D\u317F\xBB\u047B\u0100;l\u1091\u3184;\u696C\u0100;v\u318B\u318C\u43C1;\u43F1\u0180gns\u3195\u31F9\u31FCht\u0300ahlrst\u31A4\u31B0\u31C2\u31D8\u31E4\u31EErrow\u0100;t\u0FDC\u31ADa\xE9\u30C8arpoon\u0100du\u31BB\u31BFow\xEE\u317Ep\xBB\u1092eft\u0100ah\u31CA\u31D0rrow\xF3\u0FEAarpoon\xF3\u0551ightarrows;\u61C9quigarro\xF7\u30CBhreetimes;\u62CCg;\u42DAingdotse\xF1\u1F32\u0180ahm\u320D\u3210\u3213r\xF2\u0FEAa\xF2\u0551;\u600Foust\u0100;a\u321E\u321F\u63B1che\xBB\u321Fmid;\u6AEE\u0200abpt\u3232\u323D\u3240\u3252\u0100nr\u3237\u323Ag;\u67EDr;\u61FEr\xEB\u1003\u0180afl\u3247\u324A\u324Er;\u6986;\uC000\u{1D563}us;\u6A2Eimes;\u6A35\u0100ap\u325D\u3267r\u0100;g\u3263\u3264\u4029t;\u6994olint;\u6A12ar\xF2\u31E3\u0200achq\u327B\u3280\u10BC\u3285quo;\u603Ar;\uC000\u{1D4C7}\u0100bu\u30FB\u328Ao\u0100;r\u0214\u0213\u0180hir\u3297\u329B\u32A0re\xE5\u31F8mes;\u62CAi\u0200;efl\u32AA\u1059\u1821\u32AB\u65B9tri;\u69CEluhar;\u6968;\u611E\u0D61\u32D5\u32DB\u32DF\u332C\u3338\u3371\0\u337A\u33A4\0\0\u33EC\u33F0\0\u3428\u3448\u345A\u34AD\u34B1\u34CA\u34F1\0\u3616\0\0\u3633cute;\u415Bqu\xEF\u27BA\u0500;Eaceinpsy\u11ED\u32F3\u32F5\u32FF\u3302\u330B\u330F\u331F\u3326\u3329;\u6AB4\u01F0\u32FA\0\u32FC;\u6AB8on;\u4161u\xE5\u11FE\u0100;d\u11F3\u3307il;\u415Frc;\u415D\u0180Eas\u3316\u3318\u331B;\u6AB6p;\u6ABAim;\u62E9olint;\u6A13i\xED\u1204;\u4441ot\u0180;be\u3334\u1D47\u3335\u62C5;\u6A66\u0380Aacmstx\u3346\u334A\u3357\u335B\u335E\u3363\u336Drr;\u61D8r\u0100hr\u3350\u3352\xEB\u2228\u0100;o\u0A36\u0A34t\u803B\xA7\u40A7i;\u403Bwar;\u6929m\u0100in\u3369\xF0nu\xF3\xF1t;\u6736r\u0100;o\u3376\u2055\uC000\u{1D530}\u0200acoy\u3382\u3386\u3391\u33A0rp;\u666F\u0100hy\u338B\u338Fcy;\u4449;\u4448rt\u026D\u3399\0\0\u339Ci\xE4\u1464ara\xEC\u2E6F\u803B\xAD\u40AD\u0100gm\u33A8\u33B4ma\u0180;fv\u33B1\u33B2\u33B2\u43C3;\u43C2\u0400;deglnpr\u12AB\u33C5\u33C9\u33CE\u33D6\u33DE\u33E1\u33E6ot;\u6A6A\u0100;q\u12B1\u12B0\u0100;E\u33D3\u33D4\u6A9E;\u6AA0\u0100;E\u33DB\u33DC\u6A9D;\u6A9Fe;\u6246lus;\u6A24arr;\u6972ar\xF2\u113D\u0200aeit\u33F8\u3408\u340F\u3417\u0100ls\u33FD\u3404lsetm\xE9\u336Ahp;\u6A33parsl;\u69E4\u0100dl\u1463\u3414e;\u6323\u0100;e\u341C\u341D\u6AAA\u0100;s\u3422\u3423\u6AAC;\uC000\u2AAC\uFE00\u0180flp\u342E\u3433\u3442tcy;\u444C\u0100;b\u3438\u3439\u402F\u0100;a\u343E\u343F\u69C4r;\u633Ff;\uC000\u{1D564}a\u0100dr\u344D\u0402es\u0100;u\u3454\u3455\u6660it\xBB\u3455\u0180csu\u3460\u3479\u349F\u0100au\u3465\u346Fp\u0100;s\u1188\u346B;\uC000\u2293\uFE00p\u0100;s\u11B4\u3475;\uC000\u2294\uFE00u\u0100bp\u347F\u348F\u0180;es\u1197\u119C\u3486et\u0100;e\u1197\u348D\xF1\u119D\u0180;es\u11A8\u11AD\u3496et\u0100;e\u11A8\u349D\xF1\u11AE\u0180;af\u117B\u34A6\u05B0r\u0165\u34AB\u05B1\xBB\u117Car\xF2\u1148\u0200cemt\u34B9\u34BE\u34C2\u34C5r;\uC000\u{1D4C8}tm\xEE\xF1i\xEC\u3415ar\xE6\u11BE\u0100ar\u34CE\u34D5r\u0100;f\u34D4\u17BF\u6606\u0100an\u34DA\u34EDight\u0100ep\u34E3\u34EApsilo\xEE\u1EE0h\xE9\u2EAFs\xBB\u2852\u0280bcmnp\u34FB\u355E\u1209\u358B\u358E\u0480;Edemnprs\u350E\u350F\u3511\u3515\u351E\u3523\u352C\u3531\u3536\u6282;\u6AC5ot;\u6ABD\u0100;d\u11DA\u351Aot;\u6AC3ult;\u6AC1\u0100Ee\u3528\u352A;\u6ACB;\u628Alus;\u6ABFarr;\u6979\u0180eiu\u353D\u3552\u3555t\u0180;en\u350E\u3545\u354Bq\u0100;q\u11DA\u350Feq\u0100;q\u352B\u3528m;\u6AC7\u0100bp\u355A\u355C;\u6AD5;\u6AD3c\u0300;acens\u11ED\u356C\u3572\u3579\u357B\u3326ppro\xF8\u32FAurlye\xF1\u11FE\xF1\u11F3\u0180aes\u3582\u3588\u331Bppro\xF8\u331Aq\xF1\u3317g;\u666A\u0680123;Edehlmnps\u35A9\u35AC\u35AF\u121C\u35B2\u35B4\u35C0\u35C9\u35D5\u35DA\u35DF\u35E8\u35ED\u803B\xB9\u40B9\u803B\xB2\u40B2\u803B\xB3\u40B3;\u6AC6\u0100os\u35B9\u35BCt;\u6ABEub;\u6AD8\u0100;d\u1222\u35C5ot;\u6AC4s\u0100ou\u35CF\u35D2l;\u67C9b;\u6AD7arr;\u697Bult;\u6AC2\u0100Ee\u35E4\u35E6;\u6ACC;\u628Blus;\u6AC0\u0180eiu\u35F4\u3609\u360Ct\u0180;en\u121C\u35FC\u3602q\u0100;q\u1222\u35B2eq\u0100;q\u35E7\u35E4m;\u6AC8\u0100bp\u3611\u3613;\u6AD4;\u6AD6\u0180Aan\u361C\u3620\u362Drr;\u61D9r\u0100hr\u3626\u3628\xEB\u222E\u0100;o\u0A2B\u0A29war;\u692Alig\u803B\xDF\u40DF\u0BE1\u3651\u365D\u3660\u12CE\u3673\u3679\0\u367E\u36C2\0\0\0\0\0\u36DB\u3703\0\u3709\u376C\0\0\0\u3787\u0272\u3656\0\0\u365Bget;\u6316;\u43C4r\xEB\u0E5F\u0180aey\u3666\u366B\u3670ron;\u4165dil;\u4163;\u4442lrec;\u6315r;\uC000\u{1D531}\u0200eiko\u3686\u369D\u36B5\u36BC\u01F2\u368B\0\u3691e\u01004f\u1284\u1281a\u0180;sv\u3698\u3699\u369B\u43B8ym;\u43D1\u0100cn\u36A2\u36B2k\u0100as\u36A8\u36AEppro\xF8\u12C1im\xBB\u12ACs\xF0\u129E\u0100as\u36BA\u36AE\xF0\u12C1rn\u803B\xFE\u40FE\u01EC\u031F\u36C6\u22E7es\u8180\xD7;bd\u36CF\u36D0\u36D8\u40D7\u0100;a\u190F\u36D5r;\u6A31;\u6A30\u0180eps\u36E1\u36E3\u3700\xE1\u2A4D\u0200;bcf\u0486\u36EC\u36F0\u36F4ot;\u6336ir;\u6AF1\u0100;o\u36F9\u36FC\uC000\u{1D565}rk;\u6ADA\xE1\u3362rime;\u6034\u0180aip\u370F\u3712\u3764d\xE5\u1248\u0380adempst\u3721\u374D\u3740\u3751\u3757\u375C\u375Fngle\u0280;dlqr\u3730\u3731\u3736\u3740\u3742\u65B5own\xBB\u1DBBeft\u0100;e\u2800\u373E\xF1\u092E;\u625Cight\u0100;e\u32AA\u374B\xF1\u105Aot;\u65ECinus;\u6A3Alus;\u6A39b;\u69CDime;\u6A3Bezium;\u63E2\u0180cht\u3772\u377D\u3781\u0100ry\u3777\u377B;\uC000\u{1D4C9};\u4446cy;\u445Brok;\u4167\u0100io\u378B\u378Ex\xF4\u1777head\u0100lr\u3797\u37A0eftarro\xF7\u084Fightarrow\xBB\u0F5D\u0900AHabcdfghlmoprstuw\u37D0\u37D3\u37D7\u37E4\u37F0\u37FC\u380E\u381C\u3823\u3834\u3851\u385D\u386B\u38A9\u38CC\u38D2\u38EA\u38F6r\xF2\u03EDar;\u6963\u0100cr\u37DC\u37E2ute\u803B\xFA\u40FA\xF2\u1150r\u01E3\u37EA\0\u37EDy;\u445Eve;\u416D\u0100iy\u37F5\u37FArc\u803B\xFB\u40FB;\u4443\u0180abh\u3803\u3806\u380Br\xF2\u13ADlac;\u4171a\xF2\u13C3\u0100ir\u3813\u3818sht;\u697E;\uC000\u{1D532}rave\u803B\xF9\u40F9\u0161\u3827\u3831r\u0100lr\u382C\u382E\xBB\u0957\xBB\u1083lk;\u6580\u0100ct\u3839\u384D\u026F\u383F\0\0\u384Arn\u0100;e\u3845\u3846\u631Cr\xBB\u3846op;\u630Fri;\u65F8\u0100al\u3856\u385Acr;\u416B\u80BB\xA8\u0349\u0100gp\u3862\u3866on;\u4173f;\uC000\u{1D566}\u0300adhlsu\u114B\u3878\u387D\u1372\u3891\u38A0own\xE1\u13B3arpoon\u0100lr\u3888\u388Cef\xF4\u382Digh\xF4\u382Fi\u0180;hl\u3899\u389A\u389C\u43C5\xBB\u13FAon\xBB\u389Aparrows;\u61C8\u0180cit\u38B0\u38C4\u38C8\u026F\u38B6\0\0\u38C1rn\u0100;e\u38BC\u38BD\u631Dr\xBB\u38BDop;\u630Eng;\u416Fri;\u65F9cr;\uC000\u{1D4CA}\u0180dir\u38D9\u38DD\u38E2ot;\u62F0lde;\u4169i\u0100;f\u3730\u38E8\xBB\u1813\u0100am\u38EF\u38F2r\xF2\u38A8l\u803B\xFC\u40FCangle;\u69A7\u0780ABDacdeflnoprsz\u391C\u391F\u3929\u392D\u39B5\u39B8\u39BD\u39DF\u39E4\u39E8\u39F3\u39F9\u39FD\u3A01\u3A20r\xF2\u03F7ar\u0100;v\u3926\u3927\u6AE8;\u6AE9as\xE8\u03E1\u0100nr\u3932\u3937grt;\u699C\u0380eknprst\u34E3\u3946\u394B\u3952\u395D\u3964\u3996app\xE1\u2415othin\xE7\u1E96\u0180hir\u34EB\u2EC8\u3959op\xF4\u2FB5\u0100;h\u13B7\u3962\xEF\u318D\u0100iu\u3969\u396Dgm\xE1\u33B3\u0100bp\u3972\u3984setneq\u0100;q\u397D\u3980\uC000\u228A\uFE00;\uC000\u2ACB\uFE00setneq\u0100;q\u398F\u3992\uC000\u228B\uFE00;\uC000\u2ACC\uFE00\u0100hr\u399B\u399Fet\xE1\u369Ciangle\u0100lr\u39AA\u39AFeft\xBB\u0925ight\xBB\u1051y;\u4432ash\xBB\u1036\u0180elr\u39C4\u39D2\u39D7\u0180;be\u2DEA\u39CB\u39CFar;\u62BBq;\u625Alip;\u62EE\u0100bt\u39DC\u1468a\xF2\u1469r;\uC000\u{1D533}tr\xE9\u39AEsu\u0100bp\u39EF\u39F1\xBB\u0D1C\xBB\u0D59pf;\uC000\u{1D567}ro\xF0\u0EFBtr\xE9\u39B4\u0100cu\u3A06\u3A0Br;\uC000\u{1D4CB}\u0100bp\u3A10\u3A18n\u0100Ee\u3980\u3A16\xBB\u397En\u0100Ee\u3992\u3A1E\xBB\u3990igzag;\u699A\u0380cefoprs\u3A36\u3A3B\u3A56\u3A5B\u3A54\u3A61\u3A6Airc;\u4175\u0100di\u3A40\u3A51\u0100bg\u3A45\u3A49ar;\u6A5Fe\u0100;q\u15FA\u3A4F;\u6259erp;\u6118r;\uC000\u{1D534}pf;\uC000\u{1D568}\u0100;e\u1479\u3A66at\xE8\u1479cr;\uC000\u{1D4CC}\u0AE3\u178E\u3A87\0\u3A8B\0\u3A90\u3A9B\0\0\u3A9D\u3AA8\u3AAB\u3AAF\0\0\u3AC3\u3ACE\0\u3AD8\u17DC\u17DFtr\xE9\u17D1r;\uC000\u{1D535}\u0100Aa\u3A94\u3A97r\xF2\u03C3r\xF2\u09F6;\u43BE\u0100Aa\u3AA1\u3AA4r\xF2\u03B8r\xF2\u09EBa\xF0\u2713is;\u62FB\u0180dpt\u17A4\u3AB5\u3ABE\u0100fl\u3ABA\u17A9;\uC000\u{1D569}im\xE5\u17B2\u0100Aa\u3AC7\u3ACAr\xF2\u03CEr\xF2\u0A01\u0100cq\u3AD2\u17B8r;\uC000\u{1D4CD}\u0100pt\u17D6\u3ADCr\xE9\u17D4\u0400acefiosu\u3AF0\u3AFD\u3B08\u3B0C\u3B11\u3B15\u3B1B\u3B21c\u0100uy\u3AF6\u3AFBte\u803B\xFD\u40FD;\u444F\u0100iy\u3B02\u3B06rc;\u4177;\u444Bn\u803B\xA5\u40A5r;\uC000\u{1D536}cy;\u4457pf;\uC000\u{1D56A}cr;\uC000\u{1D4CE}\u0100cm\u3B26\u3B29y;\u444El\u803B\xFF\u40FF\u0500acdefhiosw\u3B42\u3B48\u3B54\u3B58\u3B64\u3B69\u3B6D\u3B74\u3B7A\u3B80cute;\u417A\u0100ay\u3B4D\u3B52ron;\u417E;\u4437ot;\u417C\u0100et\u3B5D\u3B61tr\xE6\u155Fa;\u43B6r;\uC000\u{1D537}cy;\u4436grarr;\u61DDpf;\uC000\u{1D56B}cr;\uC000\u{1D4CF}\u0100jn\u3B85\u3B87;\u600Dj;\u600C'.split("").map((c) => c.charCodeAt(0))
);

// node_modules/.pnpm/entities@4.5.0/node_modules/entities/lib/esm/generated/decode-data-xml.js
var decode_data_xml_default = new Uint16Array(
  // prettier-ignore
  "\u0200aglq	\x1B\u026D\0\0p;\u4026os;\u4027t;\u403Et;\u403Cuot;\u4022".split("").map((c) => c.charCodeAt(0))
);

// node_modules/.pnpm/entities@4.5.0/node_modules/entities/lib/esm/decode_codepoint.js
var _a2;
var decodeMap2 = /* @__PURE__ */ new Map([
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
var fromCodePoint2 = (
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, node/no-unsupported-features/es-builtins
  (_a2 = String.fromCodePoint) !== null && _a2 !== void 0 ? _a2 : function(codePoint) {
    let output = "";
    if (codePoint > 65535) {
      codePoint -= 65536;
      output += String.fromCharCode(codePoint >>> 10 & 1023 | 55296);
      codePoint = 56320 | codePoint & 1023;
    }
    output += String.fromCharCode(codePoint);
    return output;
  }
);
function replaceCodePoint2(codePoint) {
  var _a3;
  if (codePoint >= 55296 && codePoint <= 57343 || codePoint > 1114111) {
    return 65533;
  }
  return (_a3 = decodeMap2.get(codePoint)) !== null && _a3 !== void 0 ? _a3 : codePoint;
}

// node_modules/.pnpm/entities@4.5.0/node_modules/entities/lib/esm/decode.js
var CharCodes3;
(function(CharCodes4) {
  CharCodes4[CharCodes4["NUM"] = 35] = "NUM";
  CharCodes4[CharCodes4["SEMI"] = 59] = "SEMI";
  CharCodes4[CharCodes4["EQUALS"] = 61] = "EQUALS";
  CharCodes4[CharCodes4["ZERO"] = 48] = "ZERO";
  CharCodes4[CharCodes4["NINE"] = 57] = "NINE";
  CharCodes4[CharCodes4["LOWER_A"] = 97] = "LOWER_A";
  CharCodes4[CharCodes4["LOWER_F"] = 102] = "LOWER_F";
  CharCodes4[CharCodes4["LOWER_X"] = 120] = "LOWER_X";
  CharCodes4[CharCodes4["LOWER_Z"] = 122] = "LOWER_Z";
  CharCodes4[CharCodes4["UPPER_A"] = 65] = "UPPER_A";
  CharCodes4[CharCodes4["UPPER_F"] = 70] = "UPPER_F";
  CharCodes4[CharCodes4["UPPER_Z"] = 90] = "UPPER_Z";
})(CharCodes3 || (CharCodes3 = {}));
var TO_LOWER_BIT2 = 32;
var BinTrieFlags2;
(function(BinTrieFlags3) {
  BinTrieFlags3[BinTrieFlags3["VALUE_LENGTH"] = 49152] = "VALUE_LENGTH";
  BinTrieFlags3[BinTrieFlags3["BRANCH_LENGTH"] = 16256] = "BRANCH_LENGTH";
  BinTrieFlags3[BinTrieFlags3["JUMP_TABLE"] = 127] = "JUMP_TABLE";
})(BinTrieFlags2 || (BinTrieFlags2 = {}));
function isNumber2(code) {
  return code >= CharCodes3.ZERO && code <= CharCodes3.NINE;
}
function isHexadecimalCharacter2(code) {
  return code >= CharCodes3.UPPER_A && code <= CharCodes3.UPPER_F || code >= CharCodes3.LOWER_A && code <= CharCodes3.LOWER_F;
}
function isAsciiAlphaNumeric2(code) {
  return code >= CharCodes3.UPPER_A && code <= CharCodes3.UPPER_Z || code >= CharCodes3.LOWER_A && code <= CharCodes3.LOWER_Z || isNumber2(code);
}
function isEntityInAttributeInvalidEnd2(code) {
  return code === CharCodes3.EQUALS || isAsciiAlphaNumeric2(code);
}
var EntityDecoderState2;
(function(EntityDecoderState3) {
  EntityDecoderState3[EntityDecoderState3["EntityStart"] = 0] = "EntityStart";
  EntityDecoderState3[EntityDecoderState3["NumericStart"] = 1] = "NumericStart";
  EntityDecoderState3[EntityDecoderState3["NumericDecimal"] = 2] = "NumericDecimal";
  EntityDecoderState3[EntityDecoderState3["NumericHex"] = 3] = "NumericHex";
  EntityDecoderState3[EntityDecoderState3["NamedEntity"] = 4] = "NamedEntity";
})(EntityDecoderState2 || (EntityDecoderState2 = {}));
var DecodingMode2;
(function(DecodingMode3) {
  DecodingMode3[DecodingMode3["Legacy"] = 0] = "Legacy";
  DecodingMode3[DecodingMode3["Strict"] = 1] = "Strict";
  DecodingMode3[DecodingMode3["Attribute"] = 2] = "Attribute";
})(DecodingMode2 || (DecodingMode2 = {}));
var EntityDecoder2 = class {
  constructor(decodeTree, emitCodePoint, errors) {
    this.decodeTree = decodeTree;
    this.emitCodePoint = emitCodePoint;
    this.errors = errors;
    this.state = EntityDecoderState2.EntityStart;
    this.consumed = 1;
    this.result = 0;
    this.treeIndex = 0;
    this.excess = 1;
    this.decodeMode = DecodingMode2.Strict;
  }
  /** Resets the instance to make it reusable. */
  startEntity(decodeMode) {
    this.decodeMode = decodeMode;
    this.state = EntityDecoderState2.EntityStart;
    this.result = 0;
    this.treeIndex = 0;
    this.excess = 1;
    this.consumed = 1;
  }
  /**
   * Write an entity to the decoder. This can be called multiple times with partial entities.
   * If the entity is incomplete, the decoder will return -1.
   *
   * Mirrors the implementation of `getDecoder`, but with the ability to stop decoding if the
   * entity is incomplete, and resume when the next string is written.
   *
   * @param string The string containing the entity (or a continuation of the entity).
   * @param offset The offset at which the entity begins. Should be 0 if this is not the first call.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  write(str, offset) {
    switch (this.state) {
      case EntityDecoderState2.EntityStart: {
        if (str.charCodeAt(offset) === CharCodes3.NUM) {
          this.state = EntityDecoderState2.NumericStart;
          this.consumed += 1;
          return this.stateNumericStart(str, offset + 1);
        }
        this.state = EntityDecoderState2.NamedEntity;
        return this.stateNamedEntity(str, offset);
      }
      case EntityDecoderState2.NumericStart: {
        return this.stateNumericStart(str, offset);
      }
      case EntityDecoderState2.NumericDecimal: {
        return this.stateNumericDecimal(str, offset);
      }
      case EntityDecoderState2.NumericHex: {
        return this.stateNumericHex(str, offset);
      }
      case EntityDecoderState2.NamedEntity: {
        return this.stateNamedEntity(str, offset);
      }
    }
  }
  /**
   * Switches between the numeric decimal and hexadecimal states.
   *
   * Equivalent to the `Numeric character reference state` in the HTML spec.
   *
   * @param str The string containing the entity (or a continuation of the entity).
   * @param offset The current offset.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  stateNumericStart(str, offset) {
    if (offset >= str.length) {
      return -1;
    }
    if ((str.charCodeAt(offset) | TO_LOWER_BIT2) === CharCodes3.LOWER_X) {
      this.state = EntityDecoderState2.NumericHex;
      this.consumed += 1;
      return this.stateNumericHex(str, offset + 1);
    }
    this.state = EntityDecoderState2.NumericDecimal;
    return this.stateNumericDecimal(str, offset);
  }
  addToNumericResult(str, start, end, base) {
    if (start !== end) {
      const digitCount = end - start;
      this.result = this.result * Math.pow(base, digitCount) + parseInt(str.substr(start, digitCount), base);
      this.consumed += digitCount;
    }
  }
  /**
   * Parses a hexadecimal numeric entity.
   *
   * Equivalent to the `Hexademical character reference state` in the HTML spec.
   *
   * @param str The string containing the entity (or a continuation of the entity).
   * @param offset The current offset.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  stateNumericHex(str, offset) {
    const startIdx = offset;
    while (offset < str.length) {
      const char = str.charCodeAt(offset);
      if (isNumber2(char) || isHexadecimalCharacter2(char)) {
        offset += 1;
      } else {
        this.addToNumericResult(str, startIdx, offset, 16);
        return this.emitNumericEntity(char, 3);
      }
    }
    this.addToNumericResult(str, startIdx, offset, 16);
    return -1;
  }
  /**
   * Parses a decimal numeric entity.
   *
   * Equivalent to the `Decimal character reference state` in the HTML spec.
   *
   * @param str The string containing the entity (or a continuation of the entity).
   * @param offset The current offset.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  stateNumericDecimal(str, offset) {
    const startIdx = offset;
    while (offset < str.length) {
      const char = str.charCodeAt(offset);
      if (isNumber2(char)) {
        offset += 1;
      } else {
        this.addToNumericResult(str, startIdx, offset, 10);
        return this.emitNumericEntity(char, 2);
      }
    }
    this.addToNumericResult(str, startIdx, offset, 10);
    return -1;
  }
  /**
   * Validate and emit a numeric entity.
   *
   * Implements the logic from the `Hexademical character reference start
   * state` and `Numeric character reference end state` in the HTML spec.
   *
   * @param lastCp The last code point of the entity. Used to see if the
   *               entity was terminated with a semicolon.
   * @param expectedLength The minimum number of characters that should be
   *                       consumed. Used to validate that at least one digit
   *                       was consumed.
   * @returns The number of characters that were consumed.
   */
  emitNumericEntity(lastCp, expectedLength) {
    var _a3;
    if (this.consumed <= expectedLength) {
      (_a3 = this.errors) === null || _a3 === void 0 ? void 0 : _a3.absenceOfDigitsInNumericCharacterReference(this.consumed);
      return 0;
    }
    if (lastCp === CharCodes3.SEMI) {
      this.consumed += 1;
    } else if (this.decodeMode === DecodingMode2.Strict) {
      return 0;
    }
    this.emitCodePoint(replaceCodePoint2(this.result), this.consumed);
    if (this.errors) {
      if (lastCp !== CharCodes3.SEMI) {
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
   *
   * @param str The string containing the entity (or a continuation of the entity).
   * @param offset The current offset.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  stateNamedEntity(str, offset) {
    const { decodeTree } = this;
    let current = decodeTree[this.treeIndex];
    let valueLength = (current & BinTrieFlags2.VALUE_LENGTH) >> 14;
    for (; offset < str.length; offset++, this.excess++) {
      const char = str.charCodeAt(offset);
      this.treeIndex = determineBranch2(decodeTree, current, this.treeIndex + Math.max(1, valueLength), char);
      if (this.treeIndex < 0) {
        return this.result === 0 || // If we are parsing an attribute
        this.decodeMode === DecodingMode2.Attribute && // We shouldn't have consumed any characters after the entity,
        (valueLength === 0 || // And there should be no invalid characters.
        isEntityInAttributeInvalidEnd2(char)) ? 0 : this.emitNotTerminatedNamedEntity();
      }
      current = decodeTree[this.treeIndex];
      valueLength = (current & BinTrieFlags2.VALUE_LENGTH) >> 14;
      if (valueLength !== 0) {
        if (char === CharCodes3.SEMI) {
          return this.emitNamedEntityData(this.treeIndex, valueLength, this.consumed + this.excess);
        }
        if (this.decodeMode !== DecodingMode2.Strict) {
          this.result = this.treeIndex;
          this.consumed += this.excess;
          this.excess = 0;
        }
      }
    }
    return -1;
  }
  /**
   * Emit a named entity that was not terminated with a semicolon.
   *
   * @returns The number of characters consumed.
   */
  emitNotTerminatedNamedEntity() {
    var _a3;
    const { result, decodeTree } = this;
    const valueLength = (decodeTree[result] & BinTrieFlags2.VALUE_LENGTH) >> 14;
    this.emitNamedEntityData(result, valueLength, this.consumed);
    (_a3 = this.errors) === null || _a3 === void 0 ? void 0 : _a3.missingSemicolonAfterCharacterReference();
    return this.consumed;
  }
  /**
   * Emit a named entity.
   *
   * @param result The index of the entity in the decode tree.
   * @param valueLength The number of bytes in the entity.
   * @param consumed The number of characters consumed.
   *
   * @returns The number of characters consumed.
   */
  emitNamedEntityData(result, valueLength, consumed) {
    const { decodeTree } = this;
    this.emitCodePoint(valueLength === 1 ? decodeTree[result] & ~BinTrieFlags2.VALUE_LENGTH : decodeTree[result + 1], consumed);
    if (valueLength === 3) {
      this.emitCodePoint(decodeTree[result + 2], consumed);
    }
    return consumed;
  }
  /**
   * Signal to the parser that the end of the input was reached.
   *
   * Remaining data will be emitted and relevant errors will be produced.
   *
   * @returns The number of characters consumed.
   */
  end() {
    var _a3;
    switch (this.state) {
      case EntityDecoderState2.NamedEntity: {
        return this.result !== 0 && (this.decodeMode !== DecodingMode2.Attribute || this.result === this.treeIndex) ? this.emitNotTerminatedNamedEntity() : 0;
      }
      // Otherwise, emit a numeric entity if we have one.
      case EntityDecoderState2.NumericDecimal: {
        return this.emitNumericEntity(0, 2);
      }
      case EntityDecoderState2.NumericHex: {
        return this.emitNumericEntity(0, 3);
      }
      case EntityDecoderState2.NumericStart: {
        (_a3 = this.errors) === null || _a3 === void 0 ? void 0 : _a3.absenceOfDigitsInNumericCharacterReference(this.consumed);
        return 0;
      }
      case EntityDecoderState2.EntityStart: {
        return 0;
      }
    }
  }
};
function getDecoder(decodeTree) {
  let ret = "";
  const decoder = new EntityDecoder2(decodeTree, (str) => ret += fromCodePoint2(str));
  return function decodeWithTrie(str, decodeMode) {
    let lastIndex = 0;
    let offset = 0;
    while ((offset = str.indexOf("&", offset)) >= 0) {
      ret += str.slice(lastIndex, offset);
      decoder.startEntity(decodeMode);
      const len = decoder.write(
        str,
        // Skip the "&"
        offset + 1
      );
      if (len < 0) {
        lastIndex = offset + decoder.end();
        break;
      }
      lastIndex = offset + len;
      offset = len === 0 ? lastIndex + 1 : lastIndex;
    }
    const result = ret + str.slice(lastIndex);
    ret = "";
    return result;
  };
}
function determineBranch2(decodeTree, current, nodeIdx, char) {
  const branchCount = (current & BinTrieFlags2.BRANCH_LENGTH) >> 7;
  const jumpOffset = current & BinTrieFlags2.JUMP_TABLE;
  if (branchCount === 0) {
    return jumpOffset !== 0 && char === jumpOffset ? nodeIdx : -1;
  }
  if (jumpOffset) {
    const value = char - jumpOffset;
    return value < 0 || value >= branchCount ? -1 : decodeTree[nodeIdx + value] - 1;
  }
  let lo = nodeIdx;
  let hi = lo + branchCount - 1;
  while (lo <= hi) {
    const mid = lo + hi >>> 1;
    const midVal = decodeTree[mid];
    if (midVal < char) {
      lo = mid + 1;
    } else if (midVal > char) {
      hi = mid - 1;
    } else {
      return decodeTree[mid + branchCount];
    }
  }
  return -1;
}
var htmlDecoder = getDecoder(decode_data_html_default);
var xmlDecoder = getDecoder(decode_data_xml_default);

// node_modules/.pnpm/entities@4.5.0/node_modules/entities/lib/esm/generated/encode-html.js
function restoreDiff(arr) {
  for (let i = 1; i < arr.length; i++) {
    arr[i][0] += arr[i - 1][0] + 1;
  }
  return arr;
}
var encode_html_default = new Map(/* @__PURE__ */ restoreDiff([[9, "&Tab;"], [0, "&NewLine;"], [22, "&excl;"], [0, "&quot;"], [0, "&num;"], [0, "&dollar;"], [0, "&percnt;"], [0, "&amp;"], [0, "&apos;"], [0, "&lpar;"], [0, "&rpar;"], [0, "&ast;"], [0, "&plus;"], [0, "&comma;"], [1, "&period;"], [0, "&sol;"], [10, "&colon;"], [0, "&semi;"], [0, { v: "&lt;", n: 8402, o: "&nvlt;" }], [0, { v: "&equals;", n: 8421, o: "&bne;" }], [0, { v: "&gt;", n: 8402, o: "&nvgt;" }], [0, "&quest;"], [0, "&commat;"], [26, "&lbrack;"], [0, "&bsol;"], [0, "&rbrack;"], [0, "&Hat;"], [0, "&lowbar;"], [0, "&DiacriticalGrave;"], [5, { n: 106, o: "&fjlig;" }], [20, "&lbrace;"], [0, "&verbar;"], [0, "&rbrace;"], [34, "&nbsp;"], [0, "&iexcl;"], [0, "&cent;"], [0, "&pound;"], [0, "&curren;"], [0, "&yen;"], [0, "&brvbar;"], [0, "&sect;"], [0, "&die;"], [0, "&copy;"], [0, "&ordf;"], [0, "&laquo;"], [0, "&not;"], [0, "&shy;"], [0, "&circledR;"], [0, "&macr;"], [0, "&deg;"], [0, "&PlusMinus;"], [0, "&sup2;"], [0, "&sup3;"], [0, "&acute;"], [0, "&micro;"], [0, "&para;"], [0, "&centerdot;"], [0, "&cedil;"], [0, "&sup1;"], [0, "&ordm;"], [0, "&raquo;"], [0, "&frac14;"], [0, "&frac12;"], [0, "&frac34;"], [0, "&iquest;"], [0, "&Agrave;"], [0, "&Aacute;"], [0, "&Acirc;"], [0, "&Atilde;"], [0, "&Auml;"], [0, "&angst;"], [0, "&AElig;"], [0, "&Ccedil;"], [0, "&Egrave;"], [0, "&Eacute;"], [0, "&Ecirc;"], [0, "&Euml;"], [0, "&Igrave;"], [0, "&Iacute;"], [0, "&Icirc;"], [0, "&Iuml;"], [0, "&ETH;"], [0, "&Ntilde;"], [0, "&Ograve;"], [0, "&Oacute;"], [0, "&Ocirc;"], [0, "&Otilde;"], [0, "&Ouml;"], [0, "&times;"], [0, "&Oslash;"], [0, "&Ugrave;"], [0, "&Uacute;"], [0, "&Ucirc;"], [0, "&Uuml;"], [0, "&Yacute;"], [0, "&THORN;"], [0, "&szlig;"], [0, "&agrave;"], [0, "&aacute;"], [0, "&acirc;"], [0, "&atilde;"], [0, "&auml;"], [0, "&aring;"], [0, "&aelig;"], [0, "&ccedil;"], [0, "&egrave;"], [0, "&eacute;"], [0, "&ecirc;"], [0, "&euml;"], [0, "&igrave;"], [0, "&iacute;"], [0, "&icirc;"], [0, "&iuml;"], [0, "&eth;"], [0, "&ntilde;"], [0, "&ograve;"], [0, "&oacute;"], [0, "&ocirc;"], [0, "&otilde;"], [0, "&ouml;"], [0, "&div;"], [0, "&oslash;"], [0, "&ugrave;"], [0, "&uacute;"], [0, "&ucirc;"], [0, "&uuml;"], [0, "&yacute;"], [0, "&thorn;"], [0, "&yuml;"], [0, "&Amacr;"], [0, "&amacr;"], [0, "&Abreve;"], [0, "&abreve;"], [0, "&Aogon;"], [0, "&aogon;"], [0, "&Cacute;"], [0, "&cacute;"], [0, "&Ccirc;"], [0, "&ccirc;"], [0, "&Cdot;"], [0, "&cdot;"], [0, "&Ccaron;"], [0, "&ccaron;"], [0, "&Dcaron;"], [0, "&dcaron;"], [0, "&Dstrok;"], [0, "&dstrok;"], [0, "&Emacr;"], [0, "&emacr;"], [2, "&Edot;"], [0, "&edot;"], [0, "&Eogon;"], [0, "&eogon;"], [0, "&Ecaron;"], [0, "&ecaron;"], [0, "&Gcirc;"], [0, "&gcirc;"], [0, "&Gbreve;"], [0, "&gbreve;"], [0, "&Gdot;"], [0, "&gdot;"], [0, "&Gcedil;"], [1, "&Hcirc;"], [0, "&hcirc;"], [0, "&Hstrok;"], [0, "&hstrok;"], [0, "&Itilde;"], [0, "&itilde;"], [0, "&Imacr;"], [0, "&imacr;"], [2, "&Iogon;"], [0, "&iogon;"], [0, "&Idot;"], [0, "&imath;"], [0, "&IJlig;"], [0, "&ijlig;"], [0, "&Jcirc;"], [0, "&jcirc;"], [0, "&Kcedil;"], [0, "&kcedil;"], [0, "&kgreen;"], [0, "&Lacute;"], [0, "&lacute;"], [0, "&Lcedil;"], [0, "&lcedil;"], [0, "&Lcaron;"], [0, "&lcaron;"], [0, "&Lmidot;"], [0, "&lmidot;"], [0, "&Lstrok;"], [0, "&lstrok;"], [0, "&Nacute;"], [0, "&nacute;"], [0, "&Ncedil;"], [0, "&ncedil;"], [0, "&Ncaron;"], [0, "&ncaron;"], [0, "&napos;"], [0, "&ENG;"], [0, "&eng;"], [0, "&Omacr;"], [0, "&omacr;"], [2, "&Odblac;"], [0, "&odblac;"], [0, "&OElig;"], [0, "&oelig;"], [0, "&Racute;"], [0, "&racute;"], [0, "&Rcedil;"], [0, "&rcedil;"], [0, "&Rcaron;"], [0, "&rcaron;"], [0, "&Sacute;"], [0, "&sacute;"], [0, "&Scirc;"], [0, "&scirc;"], [0, "&Scedil;"], [0, "&scedil;"], [0, "&Scaron;"], [0, "&scaron;"], [0, "&Tcedil;"], [0, "&tcedil;"], [0, "&Tcaron;"], [0, "&tcaron;"], [0, "&Tstrok;"], [0, "&tstrok;"], [0, "&Utilde;"], [0, "&utilde;"], [0, "&Umacr;"], [0, "&umacr;"], [0, "&Ubreve;"], [0, "&ubreve;"], [0, "&Uring;"], [0, "&uring;"], [0, "&Udblac;"], [0, "&udblac;"], [0, "&Uogon;"], [0, "&uogon;"], [0, "&Wcirc;"], [0, "&wcirc;"], [0, "&Ycirc;"], [0, "&ycirc;"], [0, "&Yuml;"], [0, "&Zacute;"], [0, "&zacute;"], [0, "&Zdot;"], [0, "&zdot;"], [0, "&Zcaron;"], [0, "&zcaron;"], [19, "&fnof;"], [34, "&imped;"], [63, "&gacute;"], [65, "&jmath;"], [142, "&circ;"], [0, "&caron;"], [16, "&breve;"], [0, "&DiacriticalDot;"], [0, "&ring;"], [0, "&ogon;"], [0, "&DiacriticalTilde;"], [0, "&dblac;"], [51, "&DownBreve;"], [127, "&Alpha;"], [0, "&Beta;"], [0, "&Gamma;"], [0, "&Delta;"], [0, "&Epsilon;"], [0, "&Zeta;"], [0, "&Eta;"], [0, "&Theta;"], [0, "&Iota;"], [0, "&Kappa;"], [0, "&Lambda;"], [0, "&Mu;"], [0, "&Nu;"], [0, "&Xi;"], [0, "&Omicron;"], [0, "&Pi;"], [0, "&Rho;"], [1, "&Sigma;"], [0, "&Tau;"], [0, "&Upsilon;"], [0, "&Phi;"], [0, "&Chi;"], [0, "&Psi;"], [0, "&ohm;"], [7, "&alpha;"], [0, "&beta;"], [0, "&gamma;"], [0, "&delta;"], [0, "&epsi;"], [0, "&zeta;"], [0, "&eta;"], [0, "&theta;"], [0, "&iota;"], [0, "&kappa;"], [0, "&lambda;"], [0, "&mu;"], [0, "&nu;"], [0, "&xi;"], [0, "&omicron;"], [0, "&pi;"], [0, "&rho;"], [0, "&sigmaf;"], [0, "&sigma;"], [0, "&tau;"], [0, "&upsi;"], [0, "&phi;"], [0, "&chi;"], [0, "&psi;"], [0, "&omega;"], [7, "&thetasym;"], [0, "&Upsi;"], [2, "&phiv;"], [0, "&piv;"], [5, "&Gammad;"], [0, "&digamma;"], [18, "&kappav;"], [0, "&rhov;"], [3, "&epsiv;"], [0, "&backepsilon;"], [10, "&IOcy;"], [0, "&DJcy;"], [0, "&GJcy;"], [0, "&Jukcy;"], [0, "&DScy;"], [0, "&Iukcy;"], [0, "&YIcy;"], [0, "&Jsercy;"], [0, "&LJcy;"], [0, "&NJcy;"], [0, "&TSHcy;"], [0, "&KJcy;"], [1, "&Ubrcy;"], [0, "&DZcy;"], [0, "&Acy;"], [0, "&Bcy;"], [0, "&Vcy;"], [0, "&Gcy;"], [0, "&Dcy;"], [0, "&IEcy;"], [0, "&ZHcy;"], [0, "&Zcy;"], [0, "&Icy;"], [0, "&Jcy;"], [0, "&Kcy;"], [0, "&Lcy;"], [0, "&Mcy;"], [0, "&Ncy;"], [0, "&Ocy;"], [0, "&Pcy;"], [0, "&Rcy;"], [0, "&Scy;"], [0, "&Tcy;"], [0, "&Ucy;"], [0, "&Fcy;"], [0, "&KHcy;"], [0, "&TScy;"], [0, "&CHcy;"], [0, "&SHcy;"], [0, "&SHCHcy;"], [0, "&HARDcy;"], [0, "&Ycy;"], [0, "&SOFTcy;"], [0, "&Ecy;"], [0, "&YUcy;"], [0, "&YAcy;"], [0, "&acy;"], [0, "&bcy;"], [0, "&vcy;"], [0, "&gcy;"], [0, "&dcy;"], [0, "&iecy;"], [0, "&zhcy;"], [0, "&zcy;"], [0, "&icy;"], [0, "&jcy;"], [0, "&kcy;"], [0, "&lcy;"], [0, "&mcy;"], [0, "&ncy;"], [0, "&ocy;"], [0, "&pcy;"], [0, "&rcy;"], [0, "&scy;"], [0, "&tcy;"], [0, "&ucy;"], [0, "&fcy;"], [0, "&khcy;"], [0, "&tscy;"], [0, "&chcy;"], [0, "&shcy;"], [0, "&shchcy;"], [0, "&hardcy;"], [0, "&ycy;"], [0, "&softcy;"], [0, "&ecy;"], [0, "&yucy;"], [0, "&yacy;"], [1, "&iocy;"], [0, "&djcy;"], [0, "&gjcy;"], [0, "&jukcy;"], [0, "&dscy;"], [0, "&iukcy;"], [0, "&yicy;"], [0, "&jsercy;"], [0, "&ljcy;"], [0, "&njcy;"], [0, "&tshcy;"], [0, "&kjcy;"], [1, "&ubrcy;"], [0, "&dzcy;"], [7074, "&ensp;"], [0, "&emsp;"], [0, "&emsp13;"], [0, "&emsp14;"], [1, "&numsp;"], [0, "&puncsp;"], [0, "&ThinSpace;"], [0, "&hairsp;"], [0, "&NegativeMediumSpace;"], [0, "&zwnj;"], [0, "&zwj;"], [0, "&lrm;"], [0, "&rlm;"], [0, "&dash;"], [2, "&ndash;"], [0, "&mdash;"], [0, "&horbar;"], [0, "&Verbar;"], [1, "&lsquo;"], [0, "&CloseCurlyQuote;"], [0, "&lsquor;"], [1, "&ldquo;"], [0, "&CloseCurlyDoubleQuote;"], [0, "&bdquo;"], [1, "&dagger;"], [0, "&Dagger;"], [0, "&bull;"], [2, "&nldr;"], [0, "&hellip;"], [9, "&permil;"], [0, "&pertenk;"], [0, "&prime;"], [0, "&Prime;"], [0, "&tprime;"], [0, "&backprime;"], [3, "&lsaquo;"], [0, "&rsaquo;"], [3, "&oline;"], [2, "&caret;"], [1, "&hybull;"], [0, "&frasl;"], [10, "&bsemi;"], [7, "&qprime;"], [7, { v: "&MediumSpace;", n: 8202, o: "&ThickSpace;" }], [0, "&NoBreak;"], [0, "&af;"], [0, "&InvisibleTimes;"], [0, "&ic;"], [72, "&euro;"], [46, "&tdot;"], [0, "&DotDot;"], [37, "&complexes;"], [2, "&incare;"], [4, "&gscr;"], [0, "&hamilt;"], [0, "&Hfr;"], [0, "&Hopf;"], [0, "&planckh;"], [0, "&hbar;"], [0, "&imagline;"], [0, "&Ifr;"], [0, "&lagran;"], [0, "&ell;"], [1, "&naturals;"], [0, "&numero;"], [0, "&copysr;"], [0, "&weierp;"], [0, "&Popf;"], [0, "&Qopf;"], [0, "&realine;"], [0, "&real;"], [0, "&reals;"], [0, "&rx;"], [3, "&trade;"], [1, "&integers;"], [2, "&mho;"], [0, "&zeetrf;"], [0, "&iiota;"], [2, "&bernou;"], [0, "&Cayleys;"], [1, "&escr;"], [0, "&Escr;"], [0, "&Fouriertrf;"], [1, "&Mellintrf;"], [0, "&order;"], [0, "&alefsym;"], [0, "&beth;"], [0, "&gimel;"], [0, "&daleth;"], [12, "&CapitalDifferentialD;"], [0, "&dd;"], [0, "&ee;"], [0, "&ii;"], [10, "&frac13;"], [0, "&frac23;"], [0, "&frac15;"], [0, "&frac25;"], [0, "&frac35;"], [0, "&frac45;"], [0, "&frac16;"], [0, "&frac56;"], [0, "&frac18;"], [0, "&frac38;"], [0, "&frac58;"], [0, "&frac78;"], [49, "&larr;"], [0, "&ShortUpArrow;"], [0, "&rarr;"], [0, "&darr;"], [0, "&harr;"], [0, "&updownarrow;"], [0, "&nwarr;"], [0, "&nearr;"], [0, "&LowerRightArrow;"], [0, "&LowerLeftArrow;"], [0, "&nlarr;"], [0, "&nrarr;"], [1, { v: "&rarrw;", n: 824, o: "&nrarrw;" }], [0, "&Larr;"], [0, "&Uarr;"], [0, "&Rarr;"], [0, "&Darr;"], [0, "&larrtl;"], [0, "&rarrtl;"], [0, "&LeftTeeArrow;"], [0, "&mapstoup;"], [0, "&map;"], [0, "&DownTeeArrow;"], [1, "&hookleftarrow;"], [0, "&hookrightarrow;"], [0, "&larrlp;"], [0, "&looparrowright;"], [0, "&harrw;"], [0, "&nharr;"], [1, "&lsh;"], [0, "&rsh;"], [0, "&ldsh;"], [0, "&rdsh;"], [1, "&crarr;"], [0, "&cularr;"], [0, "&curarr;"], [2, "&circlearrowleft;"], [0, "&circlearrowright;"], [0, "&leftharpoonup;"], [0, "&DownLeftVector;"], [0, "&RightUpVector;"], [0, "&LeftUpVector;"], [0, "&rharu;"], [0, "&DownRightVector;"], [0, "&dharr;"], [0, "&dharl;"], [0, "&RightArrowLeftArrow;"], [0, "&udarr;"], [0, "&LeftArrowRightArrow;"], [0, "&leftleftarrows;"], [0, "&upuparrows;"], [0, "&rightrightarrows;"], [0, "&ddarr;"], [0, "&leftrightharpoons;"], [0, "&Equilibrium;"], [0, "&nlArr;"], [0, "&nhArr;"], [0, "&nrArr;"], [0, "&DoubleLeftArrow;"], [0, "&DoubleUpArrow;"], [0, "&DoubleRightArrow;"], [0, "&dArr;"], [0, "&DoubleLeftRightArrow;"], [0, "&DoubleUpDownArrow;"], [0, "&nwArr;"], [0, "&neArr;"], [0, "&seArr;"], [0, "&swArr;"], [0, "&lAarr;"], [0, "&rAarr;"], [1, "&zigrarr;"], [6, "&larrb;"], [0, "&rarrb;"], [15, "&DownArrowUpArrow;"], [7, "&loarr;"], [0, "&roarr;"], [0, "&hoarr;"], [0, "&forall;"], [0, "&comp;"], [0, { v: "&part;", n: 824, o: "&npart;" }], [0, "&exist;"], [0, "&nexist;"], [0, "&empty;"], [1, "&Del;"], [0, "&Element;"], [0, "&NotElement;"], [1, "&ni;"], [0, "&notni;"], [2, "&prod;"], [0, "&coprod;"], [0, "&sum;"], [0, "&minus;"], [0, "&MinusPlus;"], [0, "&dotplus;"], [1, "&Backslash;"], [0, "&lowast;"], [0, "&compfn;"], [1, "&radic;"], [2, "&prop;"], [0, "&infin;"], [0, "&angrt;"], [0, { v: "&ang;", n: 8402, o: "&nang;" }], [0, "&angmsd;"], [0, "&angsph;"], [0, "&mid;"], [0, "&nmid;"], [0, "&DoubleVerticalBar;"], [0, "&NotDoubleVerticalBar;"], [0, "&and;"], [0, "&or;"], [0, { v: "&cap;", n: 65024, o: "&caps;" }], [0, { v: "&cup;", n: 65024, o: "&cups;" }], [0, "&int;"], [0, "&Int;"], [0, "&iiint;"], [0, "&conint;"], [0, "&Conint;"], [0, "&Cconint;"], [0, "&cwint;"], [0, "&ClockwiseContourIntegral;"], [0, "&awconint;"], [0, "&there4;"], [0, "&becaus;"], [0, "&ratio;"], [0, "&Colon;"], [0, "&dotminus;"], [1, "&mDDot;"], [0, "&homtht;"], [0, { v: "&sim;", n: 8402, o: "&nvsim;" }], [0, { v: "&backsim;", n: 817, o: "&race;" }], [0, { v: "&ac;", n: 819, o: "&acE;" }], [0, "&acd;"], [0, "&VerticalTilde;"], [0, "&NotTilde;"], [0, { v: "&eqsim;", n: 824, o: "&nesim;" }], [0, "&sime;"], [0, "&NotTildeEqual;"], [0, "&cong;"], [0, "&simne;"], [0, "&ncong;"], [0, "&ap;"], [0, "&nap;"], [0, "&ape;"], [0, { v: "&apid;", n: 824, o: "&napid;" }], [0, "&backcong;"], [0, { v: "&asympeq;", n: 8402, o: "&nvap;" }], [0, { v: "&bump;", n: 824, o: "&nbump;" }], [0, { v: "&bumpe;", n: 824, o: "&nbumpe;" }], [0, { v: "&doteq;", n: 824, o: "&nedot;" }], [0, "&doteqdot;"], [0, "&efDot;"], [0, "&erDot;"], [0, "&Assign;"], [0, "&ecolon;"], [0, "&ecir;"], [0, "&circeq;"], [1, "&wedgeq;"], [0, "&veeeq;"], [1, "&triangleq;"], [2, "&equest;"], [0, "&ne;"], [0, { v: "&Congruent;", n: 8421, o: "&bnequiv;" }], [0, "&nequiv;"], [1, { v: "&le;", n: 8402, o: "&nvle;" }], [0, { v: "&ge;", n: 8402, o: "&nvge;" }], [0, { v: "&lE;", n: 824, o: "&nlE;" }], [0, { v: "&gE;", n: 824, o: "&ngE;" }], [0, { v: "&lnE;", n: 65024, o: "&lvertneqq;" }], [0, { v: "&gnE;", n: 65024, o: "&gvertneqq;" }], [0, { v: "&ll;", n: new Map(/* @__PURE__ */ restoreDiff([[824, "&nLtv;"], [7577, "&nLt;"]])) }], [0, { v: "&gg;", n: new Map(/* @__PURE__ */ restoreDiff([[824, "&nGtv;"], [7577, "&nGt;"]])) }], [0, "&between;"], [0, "&NotCupCap;"], [0, "&nless;"], [0, "&ngt;"], [0, "&nle;"], [0, "&nge;"], [0, "&lesssim;"], [0, "&GreaterTilde;"], [0, "&nlsim;"], [0, "&ngsim;"], [0, "&LessGreater;"], [0, "&gl;"], [0, "&NotLessGreater;"], [0, "&NotGreaterLess;"], [0, "&pr;"], [0, "&sc;"], [0, "&prcue;"], [0, "&sccue;"], [0, "&PrecedesTilde;"], [0, { v: "&scsim;", n: 824, o: "&NotSucceedsTilde;" }], [0, "&NotPrecedes;"], [0, "&NotSucceeds;"], [0, { v: "&sub;", n: 8402, o: "&NotSubset;" }], [0, { v: "&sup;", n: 8402, o: "&NotSuperset;" }], [0, "&nsub;"], [0, "&nsup;"], [0, "&sube;"], [0, "&supe;"], [0, "&NotSubsetEqual;"], [0, "&NotSupersetEqual;"], [0, { v: "&subne;", n: 65024, o: "&varsubsetneq;" }], [0, { v: "&supne;", n: 65024, o: "&varsupsetneq;" }], [1, "&cupdot;"], [0, "&UnionPlus;"], [0, { v: "&sqsub;", n: 824, o: "&NotSquareSubset;" }], [0, { v: "&sqsup;", n: 824, o: "&NotSquareSuperset;" }], [0, "&sqsube;"], [0, "&sqsupe;"], [0, { v: "&sqcap;", n: 65024, o: "&sqcaps;" }], [0, { v: "&sqcup;", n: 65024, o: "&sqcups;" }], [0, "&CirclePlus;"], [0, "&CircleMinus;"], [0, "&CircleTimes;"], [0, "&osol;"], [0, "&CircleDot;"], [0, "&circledcirc;"], [0, "&circledast;"], [1, "&circleddash;"], [0, "&boxplus;"], [0, "&boxminus;"], [0, "&boxtimes;"], [0, "&dotsquare;"], [0, "&RightTee;"], [0, "&dashv;"], [0, "&DownTee;"], [0, "&bot;"], [1, "&models;"], [0, "&DoubleRightTee;"], [0, "&Vdash;"], [0, "&Vvdash;"], [0, "&VDash;"], [0, "&nvdash;"], [0, "&nvDash;"], [0, "&nVdash;"], [0, "&nVDash;"], [0, "&prurel;"], [1, "&LeftTriangle;"], [0, "&RightTriangle;"], [0, { v: "&LeftTriangleEqual;", n: 8402, o: "&nvltrie;" }], [0, { v: "&RightTriangleEqual;", n: 8402, o: "&nvrtrie;" }], [0, "&origof;"], [0, "&imof;"], [0, "&multimap;"], [0, "&hercon;"], [0, "&intcal;"], [0, "&veebar;"], [1, "&barvee;"], [0, "&angrtvb;"], [0, "&lrtri;"], [0, "&bigwedge;"], [0, "&bigvee;"], [0, "&bigcap;"], [0, "&bigcup;"], [0, "&diam;"], [0, "&sdot;"], [0, "&sstarf;"], [0, "&divideontimes;"], [0, "&bowtie;"], [0, "&ltimes;"], [0, "&rtimes;"], [0, "&leftthreetimes;"], [0, "&rightthreetimes;"], [0, "&backsimeq;"], [0, "&curlyvee;"], [0, "&curlywedge;"], [0, "&Sub;"], [0, "&Sup;"], [0, "&Cap;"], [0, "&Cup;"], [0, "&fork;"], [0, "&epar;"], [0, "&lessdot;"], [0, "&gtdot;"], [0, { v: "&Ll;", n: 824, o: "&nLl;" }], [0, { v: "&Gg;", n: 824, o: "&nGg;" }], [0, { v: "&leg;", n: 65024, o: "&lesg;" }], [0, { v: "&gel;", n: 65024, o: "&gesl;" }], [2, "&cuepr;"], [0, "&cuesc;"], [0, "&NotPrecedesSlantEqual;"], [0, "&NotSucceedsSlantEqual;"], [0, "&NotSquareSubsetEqual;"], [0, "&NotSquareSupersetEqual;"], [2, "&lnsim;"], [0, "&gnsim;"], [0, "&precnsim;"], [0, "&scnsim;"], [0, "&nltri;"], [0, "&NotRightTriangle;"], [0, "&nltrie;"], [0, "&NotRightTriangleEqual;"], [0, "&vellip;"], [0, "&ctdot;"], [0, "&utdot;"], [0, "&dtdot;"], [0, "&disin;"], [0, "&isinsv;"], [0, "&isins;"], [0, { v: "&isindot;", n: 824, o: "&notindot;" }], [0, "&notinvc;"], [0, "&notinvb;"], [1, { v: "&isinE;", n: 824, o: "&notinE;" }], [0, "&nisd;"], [0, "&xnis;"], [0, "&nis;"], [0, "&notnivc;"], [0, "&notnivb;"], [6, "&barwed;"], [0, "&Barwed;"], [1, "&lceil;"], [0, "&rceil;"], [0, "&LeftFloor;"], [0, "&rfloor;"], [0, "&drcrop;"], [0, "&dlcrop;"], [0, "&urcrop;"], [0, "&ulcrop;"], [0, "&bnot;"], [1, "&profline;"], [0, "&profsurf;"], [1, "&telrec;"], [0, "&target;"], [5, "&ulcorn;"], [0, "&urcorn;"], [0, "&dlcorn;"], [0, "&drcorn;"], [2, "&frown;"], [0, "&smile;"], [9, "&cylcty;"], [0, "&profalar;"], [7, "&topbot;"], [6, "&ovbar;"], [1, "&solbar;"], [60, "&angzarr;"], [51, "&lmoustache;"], [0, "&rmoustache;"], [2, "&OverBracket;"], [0, "&bbrk;"], [0, "&bbrktbrk;"], [37, "&OverParenthesis;"], [0, "&UnderParenthesis;"], [0, "&OverBrace;"], [0, "&UnderBrace;"], [2, "&trpezium;"], [4, "&elinters;"], [59, "&blank;"], [164, "&circledS;"], [55, "&boxh;"], [1, "&boxv;"], [9, "&boxdr;"], [3, "&boxdl;"], [3, "&boxur;"], [3, "&boxul;"], [3, "&boxvr;"], [7, "&boxvl;"], [7, "&boxhd;"], [7, "&boxhu;"], [7, "&boxvh;"], [19, "&boxH;"], [0, "&boxV;"], [0, "&boxdR;"], [0, "&boxDr;"], [0, "&boxDR;"], [0, "&boxdL;"], [0, "&boxDl;"], [0, "&boxDL;"], [0, "&boxuR;"], [0, "&boxUr;"], [0, "&boxUR;"], [0, "&boxuL;"], [0, "&boxUl;"], [0, "&boxUL;"], [0, "&boxvR;"], [0, "&boxVr;"], [0, "&boxVR;"], [0, "&boxvL;"], [0, "&boxVl;"], [0, "&boxVL;"], [0, "&boxHd;"], [0, "&boxhD;"], [0, "&boxHD;"], [0, "&boxHu;"], [0, "&boxhU;"], [0, "&boxHU;"], [0, "&boxvH;"], [0, "&boxVh;"], [0, "&boxVH;"], [19, "&uhblk;"], [3, "&lhblk;"], [3, "&block;"], [8, "&blk14;"], [0, "&blk12;"], [0, "&blk34;"], [13, "&square;"], [8, "&blacksquare;"], [0, "&EmptyVerySmallSquare;"], [1, "&rect;"], [0, "&marker;"], [2, "&fltns;"], [1, "&bigtriangleup;"], [0, "&blacktriangle;"], [0, "&triangle;"], [2, "&blacktriangleright;"], [0, "&rtri;"], [3, "&bigtriangledown;"], [0, "&blacktriangledown;"], [0, "&dtri;"], [2, "&blacktriangleleft;"], [0, "&ltri;"], [6, "&loz;"], [0, "&cir;"], [32, "&tridot;"], [2, "&bigcirc;"], [8, "&ultri;"], [0, "&urtri;"], [0, "&lltri;"], [0, "&EmptySmallSquare;"], [0, "&FilledSmallSquare;"], [8, "&bigstar;"], [0, "&star;"], [7, "&phone;"], [49, "&female;"], [1, "&male;"], [29, "&spades;"], [2, "&clubs;"], [1, "&hearts;"], [0, "&diamondsuit;"], [3, "&sung;"], [2, "&flat;"], [0, "&natural;"], [0, "&sharp;"], [163, "&check;"], [3, "&cross;"], [8, "&malt;"], [21, "&sext;"], [33, "&VerticalSeparator;"], [25, "&lbbrk;"], [0, "&rbbrk;"], [84, "&bsolhsub;"], [0, "&suphsol;"], [28, "&LeftDoubleBracket;"], [0, "&RightDoubleBracket;"], [0, "&lang;"], [0, "&rang;"], [0, "&Lang;"], [0, "&Rang;"], [0, "&loang;"], [0, "&roang;"], [7, "&longleftarrow;"], [0, "&longrightarrow;"], [0, "&longleftrightarrow;"], [0, "&DoubleLongLeftArrow;"], [0, "&DoubleLongRightArrow;"], [0, "&DoubleLongLeftRightArrow;"], [1, "&longmapsto;"], [2, "&dzigrarr;"], [258, "&nvlArr;"], [0, "&nvrArr;"], [0, "&nvHarr;"], [0, "&Map;"], [6, "&lbarr;"], [0, "&bkarow;"], [0, "&lBarr;"], [0, "&dbkarow;"], [0, "&drbkarow;"], [0, "&DDotrahd;"], [0, "&UpArrowBar;"], [0, "&DownArrowBar;"], [2, "&Rarrtl;"], [2, "&latail;"], [0, "&ratail;"], [0, "&lAtail;"], [0, "&rAtail;"], [0, "&larrfs;"], [0, "&rarrfs;"], [0, "&larrbfs;"], [0, "&rarrbfs;"], [2, "&nwarhk;"], [0, "&nearhk;"], [0, "&hksearow;"], [0, "&hkswarow;"], [0, "&nwnear;"], [0, "&nesear;"], [0, "&seswar;"], [0, "&swnwar;"], [8, { v: "&rarrc;", n: 824, o: "&nrarrc;" }], [1, "&cudarrr;"], [0, "&ldca;"], [0, "&rdca;"], [0, "&cudarrl;"], [0, "&larrpl;"], [2, "&curarrm;"], [0, "&cularrp;"], [7, "&rarrpl;"], [2, "&harrcir;"], [0, "&Uarrocir;"], [0, "&lurdshar;"], [0, "&ldrushar;"], [2, "&LeftRightVector;"], [0, "&RightUpDownVector;"], [0, "&DownLeftRightVector;"], [0, "&LeftUpDownVector;"], [0, "&LeftVectorBar;"], [0, "&RightVectorBar;"], [0, "&RightUpVectorBar;"], [0, "&RightDownVectorBar;"], [0, "&DownLeftVectorBar;"], [0, "&DownRightVectorBar;"], [0, "&LeftUpVectorBar;"], [0, "&LeftDownVectorBar;"], [0, "&LeftTeeVector;"], [0, "&RightTeeVector;"], [0, "&RightUpTeeVector;"], [0, "&RightDownTeeVector;"], [0, "&DownLeftTeeVector;"], [0, "&DownRightTeeVector;"], [0, "&LeftUpTeeVector;"], [0, "&LeftDownTeeVector;"], [0, "&lHar;"], [0, "&uHar;"], [0, "&rHar;"], [0, "&dHar;"], [0, "&luruhar;"], [0, "&ldrdhar;"], [0, "&ruluhar;"], [0, "&rdldhar;"], [0, "&lharul;"], [0, "&llhard;"], [0, "&rharul;"], [0, "&lrhard;"], [0, "&udhar;"], [0, "&duhar;"], [0, "&RoundImplies;"], [0, "&erarr;"], [0, "&simrarr;"], [0, "&larrsim;"], [0, "&rarrsim;"], [0, "&rarrap;"], [0, "&ltlarr;"], [1, "&gtrarr;"], [0, "&subrarr;"], [1, "&suplarr;"], [0, "&lfisht;"], [0, "&rfisht;"], [0, "&ufisht;"], [0, "&dfisht;"], [5, "&lopar;"], [0, "&ropar;"], [4, "&lbrke;"], [0, "&rbrke;"], [0, "&lbrkslu;"], [0, "&rbrksld;"], [0, "&lbrksld;"], [0, "&rbrkslu;"], [0, "&langd;"], [0, "&rangd;"], [0, "&lparlt;"], [0, "&rpargt;"], [0, "&gtlPar;"], [0, "&ltrPar;"], [3, "&vzigzag;"], [1, "&vangrt;"], [0, "&angrtvbd;"], [6, "&ange;"], [0, "&range;"], [0, "&dwangle;"], [0, "&uwangle;"], [0, "&angmsdaa;"], [0, "&angmsdab;"], [0, "&angmsdac;"], [0, "&angmsdad;"], [0, "&angmsdae;"], [0, "&angmsdaf;"], [0, "&angmsdag;"], [0, "&angmsdah;"], [0, "&bemptyv;"], [0, "&demptyv;"], [0, "&cemptyv;"], [0, "&raemptyv;"], [0, "&laemptyv;"], [0, "&ohbar;"], [0, "&omid;"], [0, "&opar;"], [1, "&operp;"], [1, "&olcross;"], [0, "&odsold;"], [1, "&olcir;"], [0, "&ofcir;"], [0, "&olt;"], [0, "&ogt;"], [0, "&cirscir;"], [0, "&cirE;"], [0, "&solb;"], [0, "&bsolb;"], [3, "&boxbox;"], [3, "&trisb;"], [0, "&rtriltri;"], [0, { v: "&LeftTriangleBar;", n: 824, o: "&NotLeftTriangleBar;" }], [0, { v: "&RightTriangleBar;", n: 824, o: "&NotRightTriangleBar;" }], [11, "&iinfin;"], [0, "&infintie;"], [0, "&nvinfin;"], [4, "&eparsl;"], [0, "&smeparsl;"], [0, "&eqvparsl;"], [5, "&blacklozenge;"], [8, "&RuleDelayed;"], [1, "&dsol;"], [9, "&bigodot;"], [0, "&bigoplus;"], [0, "&bigotimes;"], [1, "&biguplus;"], [1, "&bigsqcup;"], [5, "&iiiint;"], [0, "&fpartint;"], [2, "&cirfnint;"], [0, "&awint;"], [0, "&rppolint;"], [0, "&scpolint;"], [0, "&npolint;"], [0, "&pointint;"], [0, "&quatint;"], [0, "&intlarhk;"], [10, "&pluscir;"], [0, "&plusacir;"], [0, "&simplus;"], [0, "&plusdu;"], [0, "&plussim;"], [0, "&plustwo;"], [1, "&mcomma;"], [0, "&minusdu;"], [2, "&loplus;"], [0, "&roplus;"], [0, "&Cross;"], [0, "&timesd;"], [0, "&timesbar;"], [1, "&smashp;"], [0, "&lotimes;"], [0, "&rotimes;"], [0, "&otimesas;"], [0, "&Otimes;"], [0, "&odiv;"], [0, "&triplus;"], [0, "&triminus;"], [0, "&tritime;"], [0, "&intprod;"], [2, "&amalg;"], [0, "&capdot;"], [1, "&ncup;"], [0, "&ncap;"], [0, "&capand;"], [0, "&cupor;"], [0, "&cupcap;"], [0, "&capcup;"], [0, "&cupbrcap;"], [0, "&capbrcup;"], [0, "&cupcup;"], [0, "&capcap;"], [0, "&ccups;"], [0, "&ccaps;"], [2, "&ccupssm;"], [2, "&And;"], [0, "&Or;"], [0, "&andand;"], [0, "&oror;"], [0, "&orslope;"], [0, "&andslope;"], [1, "&andv;"], [0, "&orv;"], [0, "&andd;"], [0, "&ord;"], [1, "&wedbar;"], [6, "&sdote;"], [3, "&simdot;"], [2, { v: "&congdot;", n: 824, o: "&ncongdot;" }], [0, "&easter;"], [0, "&apacir;"], [0, { v: "&apE;", n: 824, o: "&napE;" }], [0, "&eplus;"], [0, "&pluse;"], [0, "&Esim;"], [0, "&Colone;"], [0, "&Equal;"], [1, "&ddotseq;"], [0, "&equivDD;"], [0, "&ltcir;"], [0, "&gtcir;"], [0, "&ltquest;"], [0, "&gtquest;"], [0, { v: "&leqslant;", n: 824, o: "&nleqslant;" }], [0, { v: "&geqslant;", n: 824, o: "&ngeqslant;" }], [0, "&lesdot;"], [0, "&gesdot;"], [0, "&lesdoto;"], [0, "&gesdoto;"], [0, "&lesdotor;"], [0, "&gesdotol;"], [0, "&lap;"], [0, "&gap;"], [0, "&lne;"], [0, "&gne;"], [0, "&lnap;"], [0, "&gnap;"], [0, "&lEg;"], [0, "&gEl;"], [0, "&lsime;"], [0, "&gsime;"], [0, "&lsimg;"], [0, "&gsiml;"], [0, "&lgE;"], [0, "&glE;"], [0, "&lesges;"], [0, "&gesles;"], [0, "&els;"], [0, "&egs;"], [0, "&elsdot;"], [0, "&egsdot;"], [0, "&el;"], [0, "&eg;"], [2, "&siml;"], [0, "&simg;"], [0, "&simlE;"], [0, "&simgE;"], [0, { v: "&LessLess;", n: 824, o: "&NotNestedLessLess;" }], [0, { v: "&GreaterGreater;", n: 824, o: "&NotNestedGreaterGreater;" }], [1, "&glj;"], [0, "&gla;"], [0, "&ltcc;"], [0, "&gtcc;"], [0, "&lescc;"], [0, "&gescc;"], [0, "&smt;"], [0, "&lat;"], [0, { v: "&smte;", n: 65024, o: "&smtes;" }], [0, { v: "&late;", n: 65024, o: "&lates;" }], [0, "&bumpE;"], [0, { v: "&PrecedesEqual;", n: 824, o: "&NotPrecedesEqual;" }], [0, { v: "&sce;", n: 824, o: "&NotSucceedsEqual;" }], [2, "&prE;"], [0, "&scE;"], [0, "&precneqq;"], [0, "&scnE;"], [0, "&prap;"], [0, "&scap;"], [0, "&precnapprox;"], [0, "&scnap;"], [0, "&Pr;"], [0, "&Sc;"], [0, "&subdot;"], [0, "&supdot;"], [0, "&subplus;"], [0, "&supplus;"], [0, "&submult;"], [0, "&supmult;"], [0, "&subedot;"], [0, "&supedot;"], [0, { v: "&subE;", n: 824, o: "&nsubE;" }], [0, { v: "&supE;", n: 824, o: "&nsupE;" }], [0, "&subsim;"], [0, "&supsim;"], [2, { v: "&subnE;", n: 65024, o: "&varsubsetneqq;" }], [0, { v: "&supnE;", n: 65024, o: "&varsupsetneqq;" }], [2, "&csub;"], [0, "&csup;"], [0, "&csube;"], [0, "&csupe;"], [0, "&subsup;"], [0, "&supsub;"], [0, "&subsub;"], [0, "&supsup;"], [0, "&suphsub;"], [0, "&supdsub;"], [0, "&forkv;"], [0, "&topfork;"], [0, "&mlcp;"], [8, "&Dashv;"], [1, "&Vdashl;"], [0, "&Barv;"], [0, "&vBar;"], [0, "&vBarv;"], [1, "&Vbar;"], [0, "&Not;"], [0, "&bNot;"], [0, "&rnmid;"], [0, "&cirmid;"], [0, "&midcir;"], [0, "&topcir;"], [0, "&nhpar;"], [0, "&parsim;"], [9, { v: "&parsl;", n: 8421, o: "&nparsl;" }], [44343, { n: new Map(/* @__PURE__ */ restoreDiff([[56476, "&Ascr;"], [1, "&Cscr;"], [0, "&Dscr;"], [2, "&Gscr;"], [2, "&Jscr;"], [0, "&Kscr;"], [2, "&Nscr;"], [0, "&Oscr;"], [0, "&Pscr;"], [0, "&Qscr;"], [1, "&Sscr;"], [0, "&Tscr;"], [0, "&Uscr;"], [0, "&Vscr;"], [0, "&Wscr;"], [0, "&Xscr;"], [0, "&Yscr;"], [0, "&Zscr;"], [0, "&ascr;"], [0, "&bscr;"], [0, "&cscr;"], [0, "&dscr;"], [1, "&fscr;"], [1, "&hscr;"], [0, "&iscr;"], [0, "&jscr;"], [0, "&kscr;"], [0, "&lscr;"], [0, "&mscr;"], [0, "&nscr;"], [1, "&pscr;"], [0, "&qscr;"], [0, "&rscr;"], [0, "&sscr;"], [0, "&tscr;"], [0, "&uscr;"], [0, "&vscr;"], [0, "&wscr;"], [0, "&xscr;"], [0, "&yscr;"], [0, "&zscr;"], [52, "&Afr;"], [0, "&Bfr;"], [1, "&Dfr;"], [0, "&Efr;"], [0, "&Ffr;"], [0, "&Gfr;"], [2, "&Jfr;"], [0, "&Kfr;"], [0, "&Lfr;"], [0, "&Mfr;"], [0, "&Nfr;"], [0, "&Ofr;"], [0, "&Pfr;"], [0, "&Qfr;"], [1, "&Sfr;"], [0, "&Tfr;"], [0, "&Ufr;"], [0, "&Vfr;"], [0, "&Wfr;"], [0, "&Xfr;"], [0, "&Yfr;"], [1, "&afr;"], [0, "&bfr;"], [0, "&cfr;"], [0, "&dfr;"], [0, "&efr;"], [0, "&ffr;"], [0, "&gfr;"], [0, "&hfr;"], [0, "&ifr;"], [0, "&jfr;"], [0, "&kfr;"], [0, "&lfr;"], [0, "&mfr;"], [0, "&nfr;"], [0, "&ofr;"], [0, "&pfr;"], [0, "&qfr;"], [0, "&rfr;"], [0, "&sfr;"], [0, "&tfr;"], [0, "&ufr;"], [0, "&vfr;"], [0, "&wfr;"], [0, "&xfr;"], [0, "&yfr;"], [0, "&zfr;"], [0, "&Aopf;"], [0, "&Bopf;"], [1, "&Dopf;"], [0, "&Eopf;"], [0, "&Fopf;"], [0, "&Gopf;"], [1, "&Iopf;"], [0, "&Jopf;"], [0, "&Kopf;"], [0, "&Lopf;"], [0, "&Mopf;"], [1, "&Oopf;"], [3, "&Sopf;"], [0, "&Topf;"], [0, "&Uopf;"], [0, "&Vopf;"], [0, "&Wopf;"], [0, "&Xopf;"], [0, "&Yopf;"], [1, "&aopf;"], [0, "&bopf;"], [0, "&copf;"], [0, "&dopf;"], [0, "&eopf;"], [0, "&fopf;"], [0, "&gopf;"], [0, "&hopf;"], [0, "&iopf;"], [0, "&jopf;"], [0, "&kopf;"], [0, "&lopf;"], [0, "&mopf;"], [0, "&nopf;"], [0, "&oopf;"], [0, "&popf;"], [0, "&qopf;"], [0, "&ropf;"], [0, "&sopf;"], [0, "&topf;"], [0, "&uopf;"], [0, "&vopf;"], [0, "&wopf;"], [0, "&xopf;"], [0, "&yopf;"], [0, "&zopf;"]])) }], [8906, "&fflig;"], [0, "&filig;"], [0, "&fllig;"], [0, "&ffilig;"], [0, "&ffllig;"]]));

// node_modules/.pnpm/entities@4.5.0/node_modules/entities/lib/esm/escape.js
var xmlCodeMap = /* @__PURE__ */ new Map([
  [34, "&quot;"],
  [38, "&amp;"],
  [39, "&apos;"],
  [60, "&lt;"],
  [62, "&gt;"]
]);
var getCodePoint = (
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  String.prototype.codePointAt != null ? (str, index) => str.codePointAt(index) : (
    // http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
    (c, index) => (c.charCodeAt(index) & 64512) === 55296 ? (c.charCodeAt(index) - 55296) * 1024 + c.charCodeAt(index + 1) - 56320 + 65536 : c.charCodeAt(index)
  )
);
function getEscaper(regex, map) {
  return function escape2(data2) {
    let match;
    let lastIdx = 0;
    let result = "";
    while (match = regex.exec(data2)) {
      if (lastIdx !== match.index) {
        result += data2.substring(lastIdx, match.index);
      }
      result += map.get(match[0].charCodeAt(0));
      lastIdx = match.index + 1;
    }
    return result + data2.substring(lastIdx);
  };
}
var escapeUTF8 = getEscaper(/[&<>'"]/g, xmlCodeMap);
var escapeAttribute = getEscaper(/["&\u00A0]/g, /* @__PURE__ */ new Map([
  [34, "&quot;"],
  [38, "&amp;"],
  [160, "&nbsp;"]
]));
var escapeText = getEscaper(/[&<>\u00A0]/g, /* @__PURE__ */ new Map([
  [38, "&amp;"],
  [60, "&lt;"],
  [62, "&gt;"],
  [160, "&nbsp;"]
]));

// node_modules/.pnpm/entities@4.5.0/node_modules/entities/lib/esm/index.js
var EntityLevel;
(function(EntityLevel2) {
  EntityLevel2[EntityLevel2["XML"] = 0] = "XML";
  EntityLevel2[EntityLevel2["HTML"] = 1] = "HTML";
})(EntityLevel || (EntityLevel = {}));
var EncodingMode;
(function(EncodingMode2) {
  EncodingMode2[EncodingMode2["UTF8"] = 0] = "UTF8";
  EncodingMode2[EncodingMode2["ASCII"] = 1] = "ASCII";
  EncodingMode2[EncodingMode2["Extensive"] = 2] = "Extensive";
  EncodingMode2[EncodingMode2["Attribute"] = 3] = "Attribute";
  EncodingMode2[EncodingMode2["Text"] = 4] = "Text";
})(EncodingMode || (EncodingMode = {}));

// node_modules/.pnpm/dom-serializer@2.0.0/node_modules/dom-serializer/lib/esm/foreignNames.js
var elementNames = new Map([
  "altGlyph",
  "altGlyphDef",
  "altGlyphItem",
  "animateColor",
  "animateMotion",
  "animateTransform",
  "clipPath",
  "feBlend",
  "feColorMatrix",
  "feComponentTransfer",
  "feComposite",
  "feConvolveMatrix",
  "feDiffuseLighting",
  "feDisplacementMap",
  "feDistantLight",
  "feDropShadow",
  "feFlood",
  "feFuncA",
  "feFuncB",
  "feFuncG",
  "feFuncR",
  "feGaussianBlur",
  "feImage",
  "feMerge",
  "feMergeNode",
  "feMorphology",
  "feOffset",
  "fePointLight",
  "feSpecularLighting",
  "feSpotLight",
  "feTile",
  "feTurbulence",
  "foreignObject",
  "glyphRef",
  "linearGradient",
  "radialGradient",
  "textPath"
].map((val) => [val.toLowerCase(), val]));
var attributeNames = new Map([
  "definitionURL",
  "attributeName",
  "attributeType",
  "baseFrequency",
  "baseProfile",
  "calcMode",
  "clipPathUnits",
  "diffuseConstant",
  "edgeMode",
  "filterUnits",
  "glyphRef",
  "gradientTransform",
  "gradientUnits",
  "kernelMatrix",
  "kernelUnitLength",
  "keyPoints",
  "keySplines",
  "keyTimes",
  "lengthAdjust",
  "limitingConeAngle",
  "markerHeight",
  "markerUnits",
  "markerWidth",
  "maskContentUnits",
  "maskUnits",
  "numOctaves",
  "pathLength",
  "patternContentUnits",
  "patternTransform",
  "patternUnits",
  "pointsAtX",
  "pointsAtY",
  "pointsAtZ",
  "preserveAlpha",
  "preserveAspectRatio",
  "primitiveUnits",
  "refX",
  "refY",
  "repeatCount",
  "repeatDur",
  "requiredExtensions",
  "requiredFeatures",
  "specularConstant",
  "specularExponent",
  "spreadMethod",
  "startOffset",
  "stdDeviation",
  "stitchTiles",
  "surfaceScale",
  "systemLanguage",
  "tableValues",
  "targetX",
  "targetY",
  "textLength",
  "viewBox",
  "viewTarget",
  "xChannelSelector",
  "yChannelSelector",
  "zoomAndPan"
].map((val) => [val.toLowerCase(), val]));

// node_modules/.pnpm/domutils@3.2.2/node_modules/domutils/lib/esm/helpers.js
var DocumentPosition;
(function(DocumentPosition2) {
  DocumentPosition2[DocumentPosition2["DISCONNECTED"] = 1] = "DISCONNECTED";
  DocumentPosition2[DocumentPosition2["PRECEDING"] = 2] = "PRECEDING";
  DocumentPosition2[DocumentPosition2["FOLLOWING"] = 4] = "FOLLOWING";
  DocumentPosition2[DocumentPosition2["CONTAINS"] = 8] = "CONTAINS";
  DocumentPosition2[DocumentPosition2["CONTAINED_BY"] = 16] = "CONTAINED_BY";
})(DocumentPosition || (DocumentPosition = {}));

// node_modules/.pnpm/htmlparser2@10.1.0/node_modules/htmlparser2/dist/esm/index.js
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
function textContent2(node) {
  if (node.type === "text") return node.data;
  let out = "";
  for (const c of node.children) out += textContent2(c);
  return out;
}
function visibleText(el) {
  return textContent2(el).replace(/\s+/g, " ").trim();
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
var INTERACTIVE_ROLES = ["button", "link", "checkbox", "radio", "tab", "menuitem", "menuitemcheckbox", "menuitemradio", "option", "switch", "textbox", "combobox", "slider", "spinbutton"];
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
var scriptsAriaRules = [invalidAriaRole, ariaRefMissingId, redundantAria, clickableNoninteractive, ariaRequiredChildren, ariaHiddenFocusable, nestedInteractive];

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
      for (const f of acc) if (re.test(toPosix(f))) files.add(f);
    } else if (existsSync(input)) {
      if (statSync(input).isDirectory()) {
        const acc = [];
        walk(input, acc);
        for (const f of acc) if (exts.has(ext(f))) files.add(f);
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
    if (c.automatability === "static") {
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
  for (const file of expandInputs(opts.inputs, { include: opts.include, exclude: opts.exclude, ext: opts.ext })) {
    docs.push(parseSource(readText(file), file, { forceJsx: opts.forceJsx }));
  }
  if (opts.inputs.includes("-") && opts.stdin !== void 0) {
    docs.push(parseSource(opts.stdin, "<stdin>", { forceJsx: opts.forceJsx }));
  }
  return buildAudit(docs, opts.inputs);
}

// src/report.ts
import { mkdirSync, writeFileSync } from "fs";
import { join as join2 } from "path";
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
    nothing: "Aucun."
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
    nothing: "None."
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
  out.push("", `> \u26A0\uFE0F ${s.warn}`, "");
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
  out.push(
    r.residualRisks.length ? r.residualRisks.map((rr) => `- ${critLabel(rr.criteriaId)} \u2014 _${rr.reason}_`).join("\n") : s.nothing,
    ""
  );
  return out.join("\n");
}
function writeReport(r, opts) {
  const md = renderReport(r, opts.lang);
  mkdirSync(opts.out, { recursive: true });
  const path = join2(opts.out, `rgaa-${r.date}.md`);
  writeFileSync(path, md);
  return path;
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
  out.push(`${lang === "fr" ? "Th\xE9matique" : "Theme"} ${c.theme} (${theme}) \xB7 ${lang === "fr" ? "automatisabilit\xE9" : "automatability"} : ${auto}${c.ruleIds.length ? ` \xB7 ${lang === "fr" ? "r\xE8gles" : "rules"} : ${c.ruleIds.join(", ")}` : ""}`);
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
    out.push(`${String(t2.number).padStart(2)}. ${t2.name.padEnd(32).slice(0, 32)} ${String(t2.count).padStart(3)} ${lang === "fr" ? "crit\xE8res" : "criteria"} (${stat} ${lang === "fr" ? "auto" : "auto"})`);
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
  if (!/\d+\s*%/.test(md)) issues.push("Taux de conformit\xE9 absent de l'en-t\xEAte du rapport.");
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
import { mkdirSync as mkdirSync2, writeFileSync as writeFileSync2 } from "fs";
import { join as join3 } from "path";
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
  }
  out.push("");
  return out.join("\n");
}
function applyVerdicts(items) {
  const refuted = items.filter((i) => i.verdict === "refuted").length;
  const unsupported = items.filter((i) => i.verdict === "unsupported").length;
  const unadjudicated = items.filter((i) => i.verdict == null).length;
  const failures = items.filter((i) => i.verdict == null || i.verdict === "refuted" || i.verdict === "unsupported");
  return { ok: failures.length === 0, total: items.length, refuted, unsupported, unadjudicated, failures };
}
function writeWorklist(items, outDir, semantic) {
  mkdirSync2(outDir, { recursive: true });
  const todoPath = join3(outDir, "VERIFY.todo.json");
  const mdPath = join3(outDir, "VERIFY.md");
  writeFileSync2(todoPath, JSON.stringify(items, null, 2) + "\n");
  writeFileSync2(mdPath, formatWorklist(items, semantic));
  return { todoPath, mdPath, count: items.length };
}

// src/scan.ts
import { execFileSync } from "child_process";
import { mkdtempSync, writeFileSync as writeFileSync3, existsSync as existsSync2, statSync as statSync2, readdirSync as readdirSync2, rmSync } from "fs";
import { tmpdir } from "os";
import { join as join4, resolve } from "path";

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
  "list": "9.3",
  "listitem": "9.3",
  "definition-list": "9.3",
  "dlitem": "9.3",
  "landmark-one-main": "12.6",
  "region": "12.6",
  // presentation / zoom
  "meta-viewport": "10.4",
  "meta-viewport-large": "10.4",
  // forms
  "label": "11.1",
  "form-field-multiple-labels": "11.1",
  "select-name": "11.1",
  "label-title-only": "11.1",
  "autocomplete-valid": "11.13",
  "fieldset": "11.6",
  // multimedia
  "audio-caption": "4.3",
  "video-caption": "4.3",
  "no-autoplay-audio": "4.10",
  "blink": "13.8",
  "marquee": "13.8",
  // navigation
  "tabindex": "12.8",
  "skip-link": "12.7",
  "bypass": "12.7",
  "accesskeys": "12.10"
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
    execFileSync("docker", ["info"], { stdio: "ignore", timeout: 1e4 });
    return true;
  } catch {
    return false;
  }
}
function imageExists(tag) {
  try {
    execFileSync("docker", ["image", "inspect", tag], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}
var CTX_PREFIX = "ultra11y-dyn-";
function buildImage(tag = IMAGE_TAG) {
  const ctx = mkdtempSync(join4(tmpdir(), CTX_PREFIX));
  try {
    writeFileSync3(join4(ctx, "runner.mjs"), RUNNER);
    writeFileSync3(join4(ctx, "package.json"), PKG);
    writeFileSync3(join4(ctx, "Dockerfile"), DOCKERFILE);
    execFileSync("docker", ["build", "-t", tag, ctx], { stdio: "inherit", timeout: 9e5 });
  } finally {
    rmSync(ctx, { recursive: true, force: true });
  }
}
function cleanTempContexts() {
  let removed = 0;
  const dir = tmpdir();
  for (const name of readdirSync2(dir)) {
    if (!name.startsWith(CTX_PREFIX)) continue;
    rmSync(join4(dir, name), { recursive: true, force: true });
    removed++;
  }
  return removed;
}
function cleanDynamic(tag = IMAGE_TAG) {
  let imageRemoved = false;
  if (dockerAvailable() && imageExists(tag)) {
    try {
      execFileSync("docker", ["rmi", "-f", tag], { stdio: "ignore" });
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
  const stdout = execFileSync("docker", args, { encoding: "utf8", timeout: 24e4, maxBuffer: 32 * 1024 * 1024, stdio: ["ignore", "pipe", "ignore"] });
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
  if (!dockerAvailable()) {
    throw new Error("Docker n'est pas disponible. D\xE9marrez Docker puis relancez `scan --docker`.");
  }
  const tag = opts.tag ?? IMAGE_TAG;
  if (!imageExists(tag)) buildImage(tag);
  const isFile = !/^https?:\/\//i.test(opts.target) && existsSync2(opts.target) && statSync2(opts.target).isFile();
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
var ICON2 = { bloquant: "\u{1F534}", majeur: "\u{1F7E0}", mineur: "\u{1F7E1}" };
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
      lines.push(`  ${ICON2[f.severity]} [${f.criteriaId}] ${f.file}:${f.line}  ${f.message}`);
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
  ultra11y audit    <globs\u2026 | -> [--out <dir>] [--include <glob>] [--exclude <glob>] [--ext <list>] [--jsx] [--json] [--lang fr|en]
  ultra11y report   --in <audit.json> [--out <dir>] [--lang fr|en]
  ultra11y criteria [<id>] [--theme <N>] [--list] [--json] [--lang fr|en]
  ultra11y check    --report <md> [--quiet] [--json]
  ultra11y verify   --report <md> [--semantic] [--apply <verdicts.json>] [--max-verify <n>] [--json]
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
  criteria   Look up the RGAA reference offline: one criterion, a whole theme,
             or the 13-theme list. Carries WCAG cross-refs + automatability class.
  check      Integrity gate on a produced report: every cited criterion resolves,
             every NA is justified, sections + conformance maths are well-formed.
  verify     Adversarial claim\u2194criterion worklist for the report's non-conformities,
             then (--apply) gate on refuted/unsupported findings.
  scan       OPTIONAL dynamic tier: run axe-core in a headless browser (Docker) to
             decide the needs-rendering criteria the static engine can't \u2014 computed
             contrast (3.2/3.3), 320px reflow (10.11) \u2014 over a URL or HTML file.
             --merge folds the findings into a static AuditResult (manual \u2192 C/NC).
             --sitemap/--crawl scan many pages (every sitemap URL, or same-origin
             links BFS-crawled from a start URL) and aggregate the findings.

Options:
  --out <dir>        audit/report: output dir for AuditResult + report  (default: audits)
  --in <file>        report: the AuditResult JSON to render ('-' for stdin)
  --include <glob>   audit: only include paths matching (comma-separated)
  --exclude <glob>   audit: skip paths matching (comma-separated)
  --ext <list>       audit: extra file extensions to walk (e.g. .twig,.erb);
                     .html/.htm/.xhtml/.jsx/.tsx/.vue/.svelte/.astro are built-in
  --jsx              audit: force best-effort JSX/TSX parsing
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
var COMMANDS = ["audit", "report", "criteria", "check", "verify", "scan"];
function isCommand(s) {
  return !!s && COMMANDS.includes(s);
}
var VALUE_FLAGS = /* @__PURE__ */ new Set(["out", "in", "include", "exclude", "ext", "report", "theme", "apply", "max-verify", "lang", "merge", "sitemap", "crawl", "depth", "max"]);
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
    exclude: asList(p.flags["exclude"]),
    ext: asList(p.flags["ext"])
  });
  const out = typeof p.flags["out"] === "string" ? p.flags["out"] : "audits";
  try {
    mkdirSync3(out, { recursive: true });
    writeFileSync4(join5(out, "audit-latest.json"), JSON.stringify(result, null, 2) + "\n");
  } catch {
  }
  if (p.flags["json"]) console.log(JSON.stringify(result, null, 2));
  else console.log(auditSummary(result, langOf(p.flags)));
  return 0;
}
function cmdCriteria(p) {
  const themeFlag = p.flags["theme"];
  return runCriteria({
    id: p.positionals[0],
    theme: typeof themeFlag === "string" && themeFlag ? Number(themeFlag) : void 0,
    list: p.flags["list"] === true,
    json: p.flags["json"] === true,
    lang: langOf(p.flags)
  });
}
async function cmdReport(p) {
  const inFlag = p.flags["in"];
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
  const out = typeof p.flags["out"] === "string" ? p.flags["out"] : "audits";
  const path = writeReport(result, { out, lang: langOf(p.flags) });
  console.log(path);
  return 0;
}
function cmdCheck(p) {
  const rep = p.flags["report"];
  if (typeof rep !== "string" || !rep) {
    console.error("ultra11y check: --report <md> is required.");
    return 2;
  }
  const res = checkReport(readText(rep));
  if (p.flags["json"]) {
    console.log(JSON.stringify(res, null, 2));
  } else if (!p.flags["quiet"]) {
    if (res.ok) console.log("\u2713 Rapport valide : sections, crit\xE8res cit\xE9s et justifications NA coh\xE9rents.");
    else for (const i of res.issues) console.error(`\u2717 ${i}`);
  }
  return res.ok ? 0 : 1;
}
function cmdVerify(p) {
  const apply = p.flags["apply"];
  if (typeof apply === "string" && apply) {
    let items2;
    try {
      items2 = JSON.parse(readText(apply));
    } catch {
      console.error("ultra11y verify: --apply file is not valid JSON.");
      return 2;
    }
    const r = applyVerdicts(items2);
    if (p.flags["json"]) console.log(JSON.stringify(r, null, 2));
    else if (r.ok) console.log(`\u2713 ${r.total} non-conformit\xE9s v\xE9rifi\xE9es, toutes \xE9tay\xE9es.`);
    else console.error(`\u2717 ${r.failures.length}/${r.total} en \xE9chec (refuted ${r.refuted}, unsupported ${r.unsupported}, non statu\xE9 ${r.unadjudicated}).`);
    return r.ok ? 0 : 1;
  }
  const rep = p.flags["report"];
  if (typeof rep !== "string" || !rep) {
    console.error("ultra11y verify: --report <md> is required (or --apply <verdicts.json>).");
    return 2;
  }
  const max = typeof p.flags["max-verify"] === "string" ? Number(p.flags["max-verify"]) : VERIFY_MAX;
  const items = buildWorklist(readText(rep), max);
  const out = typeof p.flags["out"] === "string" ? p.flags["out"] : ".";
  const { todoPath, mdPath, count } = writeWorklist(items, out, p.flags["semantic"] === true);
  console.log(`${count} non-conformit\xE9(s) \xE0 v\xE9rifier \u2192 ${mdPath}, ${todoPath}`);
  return 0;
}
async function cmdScan(p) {
  if (p.flags["clean"]) {
    const r = cleanDynamic();
    console.log(`Nettoyage : image dynamique ${r.imageRemoved ? "supprim\xE9e" : "absente"}, ${r.tempContextsRemoved} contexte(s) temporaire(s) supprim\xE9(s).`);
    return 0;
  }
  const sitemap = typeof p.flags["sitemap"] === "string" ? p.flags["sitemap"] : void 0;
  const crawl = typeof p.flags["crawl"] === "string" ? p.flags["crawl"] : void 0;
  let dynamic;
  try {
    if (sitemap || crawl) {
      const depth = typeof p.flags["depth"] === "string" ? Number(p.flags["depth"]) : void 0;
      const max = typeof p.flags["max"] === "string" ? Number(p.flags["max"]) : void 0;
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
  const out = typeof p.flags["out"] === "string" ? p.flags["out"] : "audits";
  const mergeIn = p.flags["merge"];
  if (typeof mergeIn === "string" && mergeIn) {
    const audit = JSON.parse(readText(mergeIn));
    const merged = mergeDynamic(audit, dynamic);
    mkdirSync3(out, { recursive: true });
    writeFileSync4(join5(out, "audit-latest.json"), JSON.stringify(merged, null, 2) + "\n");
    if (p.flags["json"]) console.log(JSON.stringify(merged, null, 2));
    else console.log(`Audit statique + dynamique fusionn\xE9 \u2192 ${join5(out, "audit-latest.json")} (${merged.conformancePct}% conformit\xE9, ${merged.findings.length} findings).`);
    return 0;
  }
  if (p.flags["json"]) console.log(JSON.stringify(dynamic, null, 2));
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
  switch (p.command) {
    case "audit":
      return cmdAudit(p);
    case "report":
      return cmdReport(p);
    case "criteria":
      return cmdCriteria(p);
    case "check":
      return cmdCheck(p);
    case "verify":
      return cmdVerify(p);
    case "scan":
      return cmdScan(p);
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
