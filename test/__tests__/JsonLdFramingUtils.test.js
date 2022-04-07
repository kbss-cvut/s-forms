import React from "react";
import JsonLdFramingUtils from "../../src/util/JsonLdFramingUtils";

describe("JsonLd framing utils", () => {
  let formDocument;
  let formQuestion;

  beforeEach(() => {
    formQuestion = {
      "@id":
        "http://onto.fel.cvut.cz/ontologies/eccairs/model/instance#instance-1223764187-q",
      "@type": "http://onto.fel.cvut.cz/ontologies/documentation/question",
      "http://onto.fel.cvut.cz/ontologies/form-layout/has-layout-class": "form",
      "http://www.w3.org/2000/01/rdf-schema#label": {
        "@language": "en",
        "@value": "453 - Responsible entity",
      },
    };
    formDocument = {
      "@graph": [formQuestion],
    };
  });

  it("returns expanded jsonld object map from expandStructure", () => {
    const id2objectMap = JsonLdFramingUtils.expandStructure(formDocument);

    expect(id2objectMap[formQuestion["@id"]]).toBe(formQuestion);
  });
});
