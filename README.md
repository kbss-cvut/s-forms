# SForms

**S**emantic **form** generator and processor for ontology-based smart forms.

## Deployment status

Checkout the live version of the app with the link below:

[![Netlify Status](https://api.netlify.com/api/v1/badges/76108e0e-d74c-417a-85e8-863109114c0c/deploy-status)](https://app.netlify.com/sites/clever-bohr-4e69b7/deploys)


## Supported features

- Input/Textarea
- Typeahead
- Datetime picker
- Select
- Checkbox
- Numeric input

## Representation in JSON-LD

Semantic form is structure that holds a form (set of questions) as well as its data (set of answers).
A conceptual model of Semantic forms is [questions/answers model](https://kbss.felk.cvut.cz/gitblit/summary/s-forms-model.git).
The conceptual model is described in RDF language. This library processes and generates Semantic forms using JSON-LD
format which is JSON compatible serialization of the RDF language.

## Development

Building SForms library can be done using `npm run build:lib`.

### Debugging content of a form

Rendering of a form can be easily tested through sample react application provided in `./test` folder. The application can be started by executing npm script through `npm run dev` and then accessing `loaclhost:8888` from a browser. It renders the form provided by the file `./test/rendering/form.json`. See `./test/rendering/TestApp.jsx` for more details.
