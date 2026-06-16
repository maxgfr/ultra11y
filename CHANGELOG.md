# Changelog

All notable changes to this project are documented here, generated automatically from the Conventional Commits by semantic-release.

# [1.1.0](https://github.com/maxgfr/ultra11y/compare/v1.0.1...v1.1.0) (2026-06-16)


### Features

* **rules:** +10 static rules, layout-table heuristic, definite-NC on render criteria ([7979599](https://github.com/maxgfr/ultra11y/commit/7979599c19941a15913d7d29544e9e2145c66035)), closes [hi#confidence](https://github.com/hi/issues/confidence)
* **scan:** optional Docker dynamic tier (axe-core in a headless browser) ([4b7a287](https://github.com/maxgfr/ultra11y/commit/4b7a2877475445d422bb26edb6782cd1da9fde5f))

## [1.0.1](https://github.com/maxgfr/ultra11y/compare/v1.0.0...v1.0.1) (2026-06-16)


### Bug Fixes

* **build:** bundle htmlparser2 into the standalone .mjs (noExternal) ([eeeff3e](https://github.com/maxgfr/ultra11y/commit/eeeff3e4a365a09e23e57ad0feb24d916ab37c39))

# 1.0.0 (2026-06-16)


### Bug Fixes

* track references/verify.md shadowed by case-insensitive gitignore ([66e5288](https://github.com/maxgfr/ultra11y/commit/66e52883f77e0b316a77901de0605dc0315e6c7c))


### Features

* **audit:** static engine integration — audit command + AuditResult (M3) ([ef7c509](https://github.com/maxgfr/ultra11y/commit/ef7c509098c506277d833df30d83135d32f0281a))
* **criteria:** offline RGAA reference lookup + criteria command (M5) ([9ae2ae6](https://github.com/maxgfr/ultra11y/commit/9ae2ae6c3a1857ecc8fd54c7f4be04b15a0836df))
* **gates:** check (report integrity) + verify (adversarial claim gate) (M6) ([9f062ef](https://github.com/maxgfr/ultra11y/commit/9f062ef1252a7a43dd74f2353964b942c56ace7b))
* **parse:** HTML/JSX parsers + accessible-name engine (M1) ([5adf3b3](https://github.com/maxgfr/ultra11y/commit/5adf3b3119fdbce0ab8e144894cbf95e481719ab))
* **report:** etalab-style RGAA report renderer + report command (M4) ([59d87b7](https://github.com/maxgfr/ultra11y/commit/59d87b78ed8eb377bb2c421c6c833e823ed77a03))
* **rules:** static rule engine — 25 RGAA rules across 10 themes (M2) ([3729cfc](https://github.com/maxgfr/ultra11y/commit/3729cfccf307175888d0af95504f611d1da17ebb))
* scaffold ultra11y skill — RGAA 4.1.2 dataset + loader + integrity gate (M0) ([479cf2a](https://github.com/maxgfr/ultra11y/commit/479cf2a22cbe3d2a095f373e386a3cbce5167e51))
* **skill:** SKILL.md + 6 reference docs + skill drift guards (M7) ([6c021e8](https://github.com/maxgfr/ultra11y/commit/6c021e8c8c79c90425c2b11fcd5ccf67d7328033))
