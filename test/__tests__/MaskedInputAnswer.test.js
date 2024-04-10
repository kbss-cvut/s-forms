import React from "react";
import * as JsonLdUtils from "jsonld-utils";

import Answer from "../../src/components/Answer";
import Vocabulary from "../../src/constants/Vocabulary.js";
import * as Generator from "../environment/Generator";
import { ConfigurationContext } from "../../src/contexts/ConfigurationContext";
import DefaultInput from "../../src/components/DefaultInput";

describe("MaskedInputAnswer", () => {
  let question, onChange, options, inputComponent, componentsOptions;

  beforeEach(() => {
    question = {};
    onChange = jest.fn();
    options = {
      intl: {
        locale: "en",
      },
    };
    componentsOptions = {
      readOnly: false,
      dateTimeAnswer: {
        dateFormat: "yyyy-MM-dd",
        timeFormat: "HH:mm:ss",
        dateTimeFormat: "yyyy-MM-dd HH:mm:ss",
      },
    };
    inputComponent = DefaultInput;
  });

  it("renders a regular input when question contains no mask", () => {
    const value = "08/2016";
    const answer = {
      "@id": Generator.getRandomUri(),
    };

    answer[Vocabulary.HAS_DATA_VALUE] = value;
    question[Vocabulary.HAS_ANSWER] = [answer];
    question[JsonLdUtils.RDFS_LABEL] = "Test";
    question[Vocabulary.LAYOUT_CLASS] = [Vocabulary.LAYOUT.MASKED_INPUT];

    const component = mount(
      <ConfigurationContext.Provider
        value={{
          componentsOptions,
          inputComponent,
          options,
        }}
      >
        <Answer
          answer={answer}
          question={question}
          onChange={onChange}
          onCommentChange={() => void undefined}
        />
      </ConfigurationContext.Provider>
    );
    const input = component.find("input");

    expect(input.props().value).toEqual(value);
  });

  it("render disabled masked input with value when disabled layout class is specified", () => {
    const value = "08/2016";
    const mask = "11/1111";
    const answer = {
      "@id": Generator.getRandomUri(),
    };
    answer[Vocabulary.HAS_DATA_VALUE] = value;
    question[Vocabulary.HAS_ANSWER] = [answer];
    question[JsonLdUtils.RDFS_LABEL] = "Test";
    question[Vocabulary.INPUT_MASK] = mask;
    question[Vocabulary.LAYOUT_CLASS] = [
      Vocabulary.LAYOUT.MASKED_INPUT,
      Vocabulary.LAYOUT.DISABLED,
    ];

    const component = mount(
      <ConfigurationContext.Provider
        value={{
          componentsOptions,
          inputComponent,
          options,
        }}
      >
        <Answer
          answer={answer}
          question={question}
          onChange={onChange}
          onCommentChange={() => void undefined}
        />
      </ConfigurationContext.Provider>
    );
    const input = component.find("input");

    expect(input.props().value).toEqual(value);
    expect(input.props().disabled).toBeTruthy();
  });
});
