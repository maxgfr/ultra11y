# Changelog

All notable changes to this project are documented here, generated automatically from the Conventional Commits by semantic-release.

## [2.12.2](https://github.com/maxgfr/ultra11y/compare/v2.12.1...v2.12.2) (2026-07-10)


### Bug Fixes

* **check:** fail when the header pass rate contradicts the synthesis totals ([2199f25](https://github.com/maxgfr/ultra11y/commit/2199f256d83b4719f9cbb601535dabc155543380))
* **gh:** exit non-zero and surface gh stderr when issue creation fails ([7492d08](https://github.com/maxgfr/ultra11y/commit/7492d08e7fcba1e62676abc173100b5423ebfadb))
* **grounding:** match HTML tag/attr names case-insensitively in the grounding gate ([0fcdd5e](https://github.com/maxgfr/ultra11y/commit/0fcdd5e70f9e2e05dbec6aba479b57577d7c0a86))

## [2.12.1](https://github.com/maxgfr/ultra11y/compare/v2.12.0...v2.12.1) (2026-07-09)


### Bug Fixes

* **orchestrate:** reconcile stale workflows on re-emit + review polish ([#7](https://github.com/maxgfr/ultra11y/issues/7)) ([8a18a70](https://github.com/maxgfr/ultra11y/commit/8a18a705fa0665ddc539892a9566fe8eeb03d969))

# [2.12.0](https://github.com/maxgfr/ultra11y/compare/v2.11.0...v2.12.0) (2026-07-09)


### Features

* **orchestrate:** engine-managed multi-agent orchestration (family round) ([#6](https://github.com/maxgfr/ultra11y/issues/6)) ([495465f](https://github.com/maxgfr/ultra11y/commit/495465ff45377c590f90009b95a8b4cf0fa9a0c3))

# [2.11.0](https://github.com/maxgfr/ultra11y/compare/v2.10.1...v2.11.0) (2026-07-08)


### Features

* AI-adjudicated judgment criteria + eval-round backlog (R1–R8 + family P0) ([#5](https://github.com/maxgfr/ultra11y/issues/5)) ([1f808d6](https://github.com/maxgfr/ultra11y/commit/1f808d6d95aaf694cfca3e96540fcfe6277a4171)), closes [hi#traffic](https://github.com/hi/issues/traffic)

## [2.10.1](https://github.com/maxgfr/ultra11y/compare/v2.10.0...v2.10.1) (2026-07-07)


### Bug Fixes

* eliminate three static-audit false positives ([acd2174](https://github.com/maxgfr/ultra11y/commit/acd2174e8ff7c3f4b3c10e9c840ff12fd2da1285))

# [2.10.0](https://github.com/maxgfr/ultra11y/compare/v2.9.0...v2.10.0) (2026-07-07)


### Bug Fixes

* **cli,verify:** harden gates & input validation (D6-002, D8-001..006, D5-002) ([ceffe41](https://github.com/maxgfr/ultra11y/commit/ceffe410183fde892ae32148ec19aabf1f3aaa31))
* **graph:** 3 cross-file resolution gaps (D3-001..003, D4-003) ([5c0d280](https://github.com/maxgfr/ultra11y/commit/5c0d28074c6694c32e53b7d4353c22c3cd41c8fe))
* **pack,scan:** ReDoS idPattern gate + honest storage-state fallback (D6-003, D8-004) ([6e44145](https://github.com/maxgfr/ultra11y/commit/6e441454594a3de6b259c840bb5c1b6a11bfec75))
* **rules,check:** close the P0 check gate + 6 content-rule FP/FN (D6-001, D1-001..007) ([ed1b2e1](https://github.com/maxgfr/ultra11y/commit/ed1b2e15019520a8dd99ac06bede080a98aebcd5))
* **rules,name:** honest preliminary marking + dead labelledby check (D4-001, D4-002, D1-005) ([269c793](https://github.com/maxgfr/ultra11y/commit/269c793f1ca62e7538546c7d372e775c7bf7a06e))
* **rules,parse:** 6 ARIA/timing FP-FN + JSX numeric attr unwrap (D2-001..006, D7-001, D1-008) ([c754d68](https://github.com/maxgfr/ultra11y/commit/c754d6817d3d155d0e90e974d4399428ec03f982))


### Features

* **skill:** add review-a11y — change-scoped accessibility review skill ([013eeba](https://github.com/maxgfr/ultra11y/commit/013eeba7c319bd74ef5eba59fd2fb10f2040aee9))
* **skill:** keep technical tokens in English in French prose ([a4fa0f4](https://github.com/maxgfr/ultra11y/commit/a4fa0f4b7515985ab6173e8c1ac8503d52d3d081))

# [2.9.0](https://github.com/maxgfr/ultra11y/compare/v2.8.0...v2.9.0) (2026-07-06)


### Bug Fixes

* **build:** biome-format generated standards datasets for byte-stable rebuilds ([4136517](https://github.com/maxgfr/ultra11y/commit/4136517bdd31fe2a61956657a7f1a0c73a833f73))
* **cli:** honest storybook/scaffold UX, docker+storage-state is an error not a degrade ([a373900](https://github.com/maxgfr/ultra11y/commit/a373900f31a882ac3123e1ded21769f172b0a9a7))
* final review sweep — merge-lang ordering, origin-line tests, stale docs, data guards ([9bfc1a3](https://github.com/maxgfr/ultra11y/commit/9bfc1a3282b5ef58d0a52cfec2352a19844c6ac8))
* **messages:** localize cross-file related-site notes (last French leak in EN output) ([9d0d09b](https://github.com/maxgfr/ultra11y/commit/9d0d09b032ef20dbdaee6c982e36f7eab3e46e7c))
* **verify:** neutralize pack idPattern capture groups in gate regexes ([924499d](https://github.com/maxgfr/ultra11y/commit/924499d77f4e6f12559288d739c6e7e54865ab74))


### Features

* **capture:** tested escaping source-of-truth, real E2E harvester test, captures in diff mode ([dcdd3c0](https://github.com/maxgfr/ultra11y/commit/dcdd3c01248ee983fffc94c96d9e0e4be1cb5966))
* **check,verify:** derive the pack citation-id regex from idPattern ([07703a7](https://github.com/maxgfr/ultra11y/commit/07703a79414f42c882c28be88413fab1f1975521))
* **cli:** --lang auto default — conversation-first language, repo/standard fallback ([eaa4211](https://github.com/maxgfr/ultra11y/commit/eaa421112b08ac1aff64296a48bb96bc6307ea3e))
* **graph:** close cross-file blind spots — .ts/.js barrels, SFC self-defs, Astro frontmatter ([6cd873b](https://github.com/maxgfr/ultra11y/commit/6cd873b56093e45489f20202c05db5acefa55bbc))
* **messages:** add the language-neutral message catalog + rule.ts plumbing ([a022adf](https://github.com/maxgfr/ultra11y/commit/a022adf02679e3256fd36d245914b4341f8ea45c))
* **renderers:** resolve finding message/remediation through the catalog ([6e6a7b8](https://github.com/maxgfr/ultra11y/commit/6e6a7b83ba6f27be42da53da89e841f22641c91d))
* **report:** render NC criteria with the auditor conformance block ([15c86ab](https://github.com/maxgfr/ultra11y/commit/15c86abb38f9eeccf630c0ca91e7c2e15557e9eb))
* **standards:** decouple a pack's own locales from the UI frame's Lang ([b5e3084](https://github.com/maxgfr/ultra11y/commit/b5e30846c8214b4cd536238918cc2cf31fb0a2e5))
* **standards:** derive the real WCAG SC universe; classify out-of-core/removed instead of a single hardcoded exception ([705b548](https://github.com/maxgfr/ultra11y/commit/705b548cdb4511fbac9c08376d2313856f1fc75a))
* **standards:** surface out-of-scope pack criteria as manual, not a silent NA ([4caa32a](https://github.com/maxgfr/ultra11y/commit/4caa32a5137652a273f1b7d70eebcc55ab39c8ed))
* **wcag:** official French titles from the W3C authorized translation, resolved at render time ([8c88f46](https://github.com/maxgfr/ultra11y/commit/8c88f46d704e0e3795953794ce43c26ae5334bb6)), closes [--#issues](https://github.com/--/issues/issues)

# [2.8.0](https://github.com/maxgfr/ultra11y/compare/v2.7.1...v2.8.0) (2026-07-06)


### Features

* **prd:** default to an auditor conformance block, modular per-standard vocabulary ([373f438](https://github.com/maxgfr/ultra11y/commit/373f43850d60710c6f5e1402a111b8a406557d23))

## [2.7.1](https://github.com/maxgfr/ultra11y/compare/v2.7.0...v2.7.1) (2026-07-01)


### Bug Fixes

* **rules,cli:** kill static-audit false positives + CLI silent-flag failures ([749c2e8](https://github.com/maxgfr/ultra11y/commit/749c2e817afa5e5d4a80a94d7b5450ccd19b589d))

# [2.7.0](https://github.com/maxgfr/ultra11y/compare/v2.6.0...v2.7.0) (2026-07-01)


### Features

* **render:** finish capture pipeline — sourceLine, gitattributes, captureAs, Storybook; fix review findings ([b969717](https://github.com/maxgfr/ultra11y/commit/b9697174ffd845cc96b994ff053e67539389f418)), closes [#1](https://github.com/maxgfr/ultra11y/issues/1) [#2](https://github.com/maxgfr/ultra11y/issues/2) [#3](https://github.com/maxgfr/ultra11y/issues/3) [#4](https://github.com/maxgfr/ultra11y/issues/4) [#5](https://github.com/maxgfr/ultra11y/issues/5) [#8](https://github.com/maxgfr/ultra11y/issues/8)

# [2.6.0](https://github.com/maxgfr/ultra11y/compare/v2.5.0...v2.6.0) (2026-07-01)


### Features

* **render:** rendered-DOM capture pipeline for component-library a11y ([7610d44](https://github.com/maxgfr/ultra11y/commit/7610d44d966297b5cfc8bec02d95dd19a65beb74))

# [2.5.0](https://github.com/maxgfr/ultra11y/compare/v2.4.1...v2.5.0) (2026-07-01)


### Features

* **scan:** local no-Docker axe runtime + residual-criteria probes; 5 new static rules ([1d29dc3](https://github.com/maxgfr/ultra11y/commit/1d29dc3bb301cc1e2798115609db872bb3c44eb9))

## [2.4.1](https://github.com/maxgfr/ultra11y/compare/v2.4.0...v2.4.1) (2026-06-30)


### Bug Fixes

* **cli:** audit no longer writes audits/audit-latest.json unless --out is given ([5f0d39c](https://github.com/maxgfr/ultra11y/commit/5f0d39cbd03edfd2331920cf992d7a97d6648cbe))

# [2.4.0](https://github.com/maxgfr/ultra11y/compare/v2.3.0...v2.4.0) (2026-06-30)


### Bug Fixes

* **build:** rebuild bundle from formatted data files (check:build reproducibility) ([7936381](https://github.com/maxgfr/ultra11y/commit/793638109ea9251ae87f07cb2cfce6f60a22b8a6))
* **skill:** trim SKILL.md description under the 1000-char install cap ([08b55d1](https://github.com/maxgfr/ultra11y/commit/08b55d1c0a6891f6cb8ced39a6a0305974a6d9e3))


### Features

* **rules,guidance:** exhaustive RGAA pack — 6 new detectors (42→48) + guidance for 90/106 criteria ([f6f2e33](https://github.com/maxgfr/ultra11y/commit/f6f2e33b24e01dc1c689669d12237364e6d6c21c))

# [2.3.0](https://github.com/maxgfr/ultra11y/compare/v2.2.1...v2.3.0) (2026-06-30)


### Bug Fixes

* **build:** make the committed bundle reproducible across node_modules layouts ([79e1853](https://github.com/maxgfr/ultra11y/commit/79e185392b47cb38c777788b86fa8220c58e8f6b))


### Features

* **prd:** --gh-single files the whole audit as one consolidated GitHub issue ([665f145](https://github.com/maxgfr/ultra11y/commit/665f145fbeb3991e69fc6a1e1e8a9caddbf093f6)), closes [--#single](https://github.com/--/issues/single)

## [2.2.1](https://github.com/maxgfr/ultra11y/compare/v2.2.0...v2.2.1) (2026-06-29)


### Bug Fixes

* **rules:** drive confident-tier precision to 100% — kill component/dynamic/shell false positives ([d9a6e51](https://github.com/maxgfr/ultra11y/commit/d9a6e5166f03310a6c9bd65c24c44d8a349ae2e0)), closes [#app](https://github.com/maxgfr/ultra11y/issues/app)

# [2.2.0](https://github.com/maxgfr/ultra11y/compare/v2.1.0...v2.2.0) (2026-06-29)


### Bug Fixes

* **scan:** surface the container's real error instead of "Command failed" ([3c3f6b8](https://github.com/maxgfr/ultra11y/commit/3c3f6b8e5d2920e72c32ca2008f025696d74fc44))


### Features

* **audit:** preliminary SFC findings, default test-exclude, --json for report/prd/verify ([48a5684](https://github.com/maxgfr/ultra11y/commit/48a5684f84b5255046d160e4e093e8a1ba21d737))
* **rules:** component-aware auditing for JSX & .vue/.svelte/.astro ([551b767](https://github.com/maxgfr/ultra11y/commit/551b767530b5fc750855b91eebc4f05c12615a55))

# [2.1.0](https://github.com/maxgfr/ultra11y/compare/v2.0.0...v2.1.0) (2026-06-29)


### Features

* map rules to WCAG success criteria ([607133f](https://github.com/maxgfr/ultra11y/commit/607133f832d4ae6cda437d4e9213d3eb255259b4))

# [2.0.0](https://github.com/maxgfr/ultra11y/compare/v1.4.4...v2.0.0) (2026-06-29)


* feat!: cross-file graph audit, rendered-audit, PRD + judgment/correction loop; latest deps + Node 22 floor ([353cfa3](https://github.com/maxgfr/ultra11y/commit/353cfa35f5b6b649917e8c42b045dc75fa5108f6)), closes [--#issues](https://github.com/--/issues/issues)


### BREAKING CHANGES

* engines.node is now >=22.18 (was >=18). The bundled
@babel/parser 8 requires Node ^22.18 || >=24.11, so Node 18 and 20 are no longer
supported at runtime.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>

## [1.4.4](https://github.com/maxgfr/ultra11y/compare/v1.4.3...v1.4.4) (2026-06-28)


### Bug Fixes

* **scan:** validate AuditResult shape on --merge; add biome lint + coverage parity ([e5e2d84](https://github.com/maxgfr/ultra11y/commit/e5e2d84a8602c2738fc58e7f617ecdc3a50216a1))

## [1.4.3](https://github.com/maxgfr/ultra11y/compare/v1.4.2...v1.4.3) (2026-06-28)


### Bug Fixes

* **skill:** drop redundant .agents mirror, unify ultra11y on skills/ single source ([efcf9d1](https://github.com/maxgfr/ultra11y/commit/efcf9d134f81e799422f67bb5614c7f5f1a5ba9c))

## [1.4.2](https://github.com/maxgfr/ultra11y/compare/v1.4.1...v1.4.2) (2026-06-28)


### Bug Fixes

* **skill:** resync .agents/ ultra11y mirror (1043→1009) and guard it against drift ([fac516f](https://github.com/maxgfr/ultra11y/commit/fac516fa72aebd65bbf0d6175f35e13c7d482dbb))

## [1.4.1](https://github.com/maxgfr/ultra11y/compare/v1.4.0...v1.4.1) (2026-06-18)


### Bug Fixes

* **cli:** harden gates and flag parsing across audit/verify/init/check/scan ([3e7676a](https://github.com/maxgfr/ultra11y/commit/3e7676a120a0406bac7e5abb7afa592a58a3c7d9))

# [1.4.0](https://github.com/maxgfr/ultra11y/compare/v1.3.0...v1.4.0) (2026-06-17)


### Features

* **engine:** scale to huge repos, apply fixes, repo automation, WCAG view ([2faf4f2](https://github.com/maxgfr/ultra11y/commit/2faf4f2dcb09b59c2c83eebde57b23e98b2e41dc))

# [1.3.0](https://github.com/maxgfr/ultra11y/compare/v1.2.0...v1.3.0) (2026-06-17)


### Features

* **engine:** exhaustive coverage — multi-page crawl, static contrast, axe RGAA tags, more file types ([e3b3352](https://github.com/maxgfr/ultra11y/commit/e3b335232da530eff6b52d6fb8621161c61650d8))

# [1.2.0](https://github.com/maxgfr/ultra11y/compare/v1.1.0...v1.2.0) (2026-06-16)


### Features

* **scan:** scan --clean teardown + fully-dockerized dev/CI flow ([d8a5901](https://github.com/maxgfr/ultra11y/commit/d8a5901e56b140cda70f3ceecae81e7a18786af7))

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
