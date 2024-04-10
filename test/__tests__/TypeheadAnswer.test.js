import React from "react";
import * as JsonLdUtils from "jsonld-utils";

import * as Generator from "../environment/Generator";
import Vocabulary from "../../src/constants/Vocabulary.js";
import TypeaheadAnswer from "../../src/components/answer/TypeaheadAnswer";
import { FormGenContext } from "../../src/contexts/FormGenContext";
import { ConfigurationContext } from "../../src/contexts/ConfigurationContext";
import DefaultInput from "../../src/components/DefaultInput";

describe("TypeaheadAnswer", () => {
  let question;
  let onChange;
  let loadFormOptions;
  let getOptions;

  beforeEach(() => {
    question = {
      "@id": Generator.getRandomUri(),
    };
    question[Vocabulary.LAYOUT_CLASS] = [];
    question[Vocabulary.RDFS_LABEL] = {
      "@language": "en",
      "@value": "1 - Aerodrome General",
    };
    question[Vocabulary.RDFS_COMMENT] = {
      "@language": "en",
      "@value":
        "The identification of the aerodrome/helicopter landing area by name, location and status.",
    };
    onChange = jest.fn();
    loadFormOptions = jest.fn();
    getOptions = jest.fn(() => [
      {
        id: "123",
        name: "123",
      },
    ]);
  });

  it("orders options using partial ordering with alphabetical ordering", () => {
    // create options
    const options = createOptionsWithPartialOrder(
      ["3", "2", "1", "before2"],
      ["before2<2"]
    );
    const query = "SELECT * WHERE { ?x ?y ?z .}";

    question[Vocabulary.LAYOUT_CLASS].push(
      Vocabulary.LAYOUT.QUESTION_TYPEAHEAD
    );
    question[Vocabulary.HAS_OPTIONS_QUERY] = query;

    const component = mount(
      <ConfigurationContext.Provider
        value={{
          componentsOptions: { readOnly: false },
          inputComponent: DefaultInput,
          options: {
            intl: {
              locale: "en",
            },
          },
        }}
      >
        <FormGenContext.Provider value={{ getOptions, loadFormOptions }}>
          <TypeaheadAnswer
            answer={{}}
            question={question}
            onChange={onChange}
            label="TestLabel"
            options={options}
            validation={{}}
          />
        </FormGenContext.Provider>
      </ConfigurationContext.Provider>
    );

    waitForComponentToPaint(component);

    const select = component.find(TypeaheadAnswer);
    expect(select).not.toBeNull();
    let optionArray = [];
    select.prop("options").forEach((i) => {
      optionArray.push(i["@id"]);
    });
    expect(optionArray).toEqual(["1", "before2", "2", "3"]);
  });

  function createOptionsWithPartialOrder(ids, orderingRules) {
    let options = ids.map((i) => {
      let obj = { "@id": i };
      obj[JsonLdUtils.RDFS_LABEL] = i + ". value";
      return obj;
    });
    orderingRules.forEach((rule) => {
      const firstId = rule.substring(0, rule.indexOf("<"));
      const secondId = rule.substring(rule.indexOf("<") + 1);
      const secondIndex = ids.indexOf(secondId);

      options[secondIndex][Vocabulary.HAS_PRECEDING_VALUE] = firstId;
    });
    return options;
  }
});
