# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

> ⚠️ marks a breaking change that may require consumers to update their code or data.

## [0.9.1](https://kbss.felk.cvut.cz/git/s-forms/compare/v0.8.0...v0.9.1) (2026-06-25)

### Features

- Add media asset viewer for video, image, and embedded content, with SVG-based annotations, custom fullscreen handling, and responsive image/video viewers (#442)
- Add answer correctness ("hint") revealing for Typeahead and Select answers (#442)
- Support navigation by `questionOrigin` and `startingQuestionId`, including a new Wizardless component (#395, #397, #405)

### Bug Fixes

- ⚠️ Migrate Dublin Core namespace from `dc/elements/1.1/` to `dc/terms/` (dcterms); update form data/templates using `dc/elements/1.1/description` or `.../source` accordingly (#456)
- Harmonize intl provisioning by removing intl passed via the configuration context (#387, #193)
- Fix "Could not find required intl object" error when `IntlProvider` is missing (#394)
- Fix comment value errors (#393)
- Fix comment author label view (#406)
- Fix questions not being validated when they have no answer (#379)
- Fix failing tests (revert undici/jsonld bump, typeahead values sorting) (#448)

## [0.8.0](https://kbss.felk.cvut.cz/git/s-forms/compare/v0.7.2...v0.8.0) (2024-11-26)

- Migrate to Bootstrap 5.0.0
- Add timestamp format for datetime question (#363)
- Show icon display on keyboard focus (#319)

### [0.7.2](https://kbss.felk.cvut.cz/git/s-forms/compare/v0.7.1...v0.7.2) (2024-10-03)

- Fix support for tooltip in tree component (#347)

### [0.7.1](https://kbss.felk.cvut.cz/git/s-forms/compare/v0.6.4...v0.7.1) (2024-05-03)

- Add support decimal numbers in answers (#334)
- Add script to print form specifications (#293)

## 0.7.0 (2023-07-13)

- Migration to React v18

### [0.6.4](https://kbss.felk.cvut.cz/git/s-forms/compare/v0.6.3...v0.6.4) (2022-11-06)

### [0.6.3](https://kbss.felk.cvut.cz/git/s-forms/compare/v0.6.2...v0.6.3) (2022-11-04)

### 0.6.2 (2022-10-12)
