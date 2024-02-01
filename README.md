# SForms
[![Netlify Status](https://api.netlify.com/api/v1/badges/004d6408-4ff5-4719-905e-5d83d5feef01/deploy-status)](https://app.netlify.com/sites/s-forms-kbss/deploys)

**S**emantic **form** generator and processor for ontology-based smart forms. Beside this core library, there exists also [library of advanced components](https://github.com/kbss-cvut/s-forms-components).

## Live Demo

Checkout [live demo using storybook](https://s-forms-kbss.netlify.app).

## Supported features

- Input/Textarea
- Tree Typeahead
- Datetime picker
- Select
- Checkbox
- Numeric input

## Representation in JSON-LD

Semantic form is structure that holds a form (set of questions) as well as its data (set of answers).
A conceptual model of Semantic forms is [questions/answers model]([https://kbss.felk.cvut.cz/gitblit/summary/s-forms-model.git](https://github.com/kbss-cvut/s-forms-model).
The conceptual model is described in RDF language. This library processes and generates Semantic forms using JSON-LD
format which is JSON compatible serialization of the RDF language.

## Development

Building SForms library can be done using `npm run build:lib`.

### Debugging a form & components with StorybookJS

Storybook is an open source tool for building UI components and pages in isolation. Rendering of a form or a specific component can be tested through a story provided in `./src/stories/`. The application can be started by executing npm script through `npm run dev` and then accessing `localhost:6006` from a browser. It renders the forms provided by the file `./src/stories/assets/`. See `./src/stories/SForms/SForms.stories.tsx` for more details.

### NPM release worklow

NPM packages are created automatically for each commit to this repository, see [npm release workflow guide](./docs/npm-release-workflow.md).
