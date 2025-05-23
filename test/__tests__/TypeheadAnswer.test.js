import React from "react";
import * as JsonLdUtils from "jsonld-utils";

import * as Generator from "../environment/Generator";
import Constants from "../../src/constants/Constants";
import TypeaheadAnswer from "../../src/components/answer/TypeaheadAnswer";
import { FormGenContext } from "../../src/contexts/FormGenContext";
import { ConfigurationContext } from "../../src/contexts/ConfigurationContext";
import DefaultInput from "../../src/components/DefaultInput";
import { IntlProvider } from "react-intl";

describe("TypeaheadAnswer", () => {
  let question;
  let onChange;
  let loadFormOptions;
  let getOptions;

  beforeEach(() => {
    question = {
      "@id": Generator.getRandomUri(),
    };
    question[Constants.LAYOUT_CLASS] = [];
    question[Constants.RDFS_LABEL] = {
      "@language": "en",
      "@value": "1 - Aerodrome General",
    };
    question[Constants.RDFS_COMMENT] = {
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
    const options = createOptionsWithPartialOrder(
      ["3", "2", "1", "before2"],
      ["before2<2"]
    );
    const query = "SELECT * WHERE { ?x ?y ?z .}";

    question[Constants.LAYOUT_CLASS].push(Constants.LAYOUT.QUESTION_TYPEAHEAD);
    question[Constants.HAS_OPTIONS_QUERY] = query;

    const component = mount(
      <IntlProvider locale="en">
        <ConfigurationContext.Provider
          value={{
            componentsOptions: { readOnly: false },
            inputComponent: DefaultInput,
            options: {},
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
      </IntlProvider>
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

      options[secondIndex][Constants.HAS_PRECEDING_VALUE] = firstId;
    });
    return options;
  }
});
