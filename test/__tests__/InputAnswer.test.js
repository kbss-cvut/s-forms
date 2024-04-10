import React from "react";

import Answer from "../../src/components/Answer";
import Vocabulary from "../../src/constants/Vocabulary.js";
import * as Generator from "../environment/Generator";
import { ConfigurationContext } from "../../src/contexts/ConfigurationContext";
import DefaultInput from "../../src/components/DefaultInput";

const LABEL = "Input answer test";

describe("InputAnswer", () => {
  let question, answer, onChange, options, componentsOptions, inputComponent;

  beforeEach(() => {
    question = {
      "@id": Generator.getRandomUri(),
    };
    question[Vocabulary.LAYOUT_CLASS] = [];
    question[Vocabulary.RDFS_LABEL] = {
      "@language": "en",
      "@value": LABEL,
    };
    question[Vocabulary.RDFS_COMMENT] = {
      "@language": "en",
      "@value": "Javascript sucks!!!",
    };
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
    answer = {
      id: Generator.getRandomUri(),
    };
    question[Vocabulary.HAS_ANSWER] = [answer];
  });

  it("sets min on numeric input when xsd:minInclusive is used in question", () => {
    const min = 100;
    const value = 117;
    question[Vocabulary.HAS_DATATYPE] = Vocabulary.XSD.INT;
    question[Vocabulary.XSD.MIN_INCLUSIVE] = min;
    answer[Vocabulary.HAS_DATA_VALUE] = value;

    const component = mount(
      <ConfigurationContext.Provider
        value={{
          componentsOptions,
          inputComponent,
          options,
        }}
      >
        <Answer
          question={question}
          answer={answer}
          onChange={onChange}
          onCommentChange={() => void undefined}
        />
      </ConfigurationContext.Provider>
    );
    const input = component.find("input");

    expect(input.props().type).toEqual("number");
    expect(input.props().min).toEqual(min);
  });

  it("sets min on numeric input when xsd:minExclusive is used in question", () => {
    const min = 100;
    const value = 117;
    question[Vocabulary.HAS_DATATYPE] = Vocabulary.XSD.INT;
    question[Vocabulary.XSD.MIN_EXCLUSIVE] = min;
    answer[Vocabulary.HAS_DATA_VALUE] = value;

    const component = mount(
      <ConfigurationContext.Provider
        value={{
          componentsOptions,
          inputComponent,
          options,
        }}
      >
        <Answer
          question={question}
          answer={answer}
          onChange={onChange}
          onCommentChange={() => void undefined}
        />
      </ConfigurationContext.Provider>
    );
    const input = component.find("input");

    expect(input.props().type).toEqual("number");
    expect(input.props().min).toEqual(min + 1);
  });

  it("sets max on numeric input when xsd:maxExclusive is used in question", () => {
    const max = 1000;
    const value = 117;
    question[Vocabulary.HAS_DATATYPE] = Vocabulary.XSD.INT;
    question[Vocabulary.XSD.MAX_EXCLUSIVE] = max;
    answer[Vocabulary.HAS_DATA_VALUE] = value;

    const component = mount(
      <ConfigurationContext.Provider
        value={{
          componentsOptions,
          inputComponent,
          options,
        }}
      >
        <Answer
          question={question}
          answer={answer}
          onChange={onChange}
          onCommentChange={() => void undefined}
        />
      </ConfigurationContext.Provider>
    );
    const input = component.find("input");

    expect(input.props().type).toEqual("number");
    expect(input.props().max).toEqual(max - 1);
  });

  it("sets max on numeric input when xsd:maxInclusive is used in question", () => {
    const max = 1000;
    const value = 117;
    question[Vocabulary.HAS_DATATYPE] = Vocabulary.XSD.INT;
    question[Vocabulary.XSD.MAX_INCLUSIVE] = max;
    answer[Vocabulary.HAS_DATA_VALUE] = value;

    const component = mount(
      <ConfigurationContext.Provider
        value={{
          componentsOptions,
          inputComponent,
          options,
        }}
      >
        <Answer
          question={question}
          answer={answer}
          onChange={onChange}
          onCommentChange={() => void undefined}
        />
      </ConfigurationContext.Provider>
    );
    const input = component.find("input");

    expect(input.props().type).toEqual("number");
    expect(input.props().max).toEqual(max);
  });

  it("sets both min and max on numeric input when both are used in question", () => {
    const max = 1000;
    const min = 100;
    const value = 117;
    question[Vocabulary.HAS_DATATYPE] = Vocabulary.XSD.INT;
    question[Vocabulary.XSD.MAX_INCLUSIVE] = max;
    question[Vocabulary.XSD.MIN_INCLUSIVE] = min;
    answer[Vocabulary.HAS_DATA_VALUE] = value;

    const component = mount(
      <ConfigurationContext.Provider
        value={{
          componentsOptions,
          inputComponent,
          options,
        }}
      >
        <Answer
          question={question}
          answer={answer}
          onChange={onChange}
          onCommentChange={() => void undefined}
        />
      </ConfigurationContext.Provider>
    );
    const input = component.find("input");

    expect(input.props().type).toEqual("number");
    expect(input.props().max).toEqual(max);
    expect(input.props().min).toEqual(min);
  });

  it("sets min when xsd:positiveInteger is used as question datatype", () => {
    const value = 117;
    question[Vocabulary.HAS_DATATYPE] = Vocabulary.XSD.POSITIVE_INTEGER;
    answer[Vocabulary.HAS_DATA_VALUE] = value;

    const component = mount(
      <ConfigurationContext.Provider
        value={{
          componentsOptions,
          inputComponent,
          options,
        }}
      >
        <Answer
          question={question}
          answer={answer}
          onChange={onChange}
          onCommentChange={() => void undefined}
        />
      </ConfigurationContext.Provider>
    );
    const input = component.find("input");

    expect(input.props().type).toEqual("number");
    expect(input.props().min).toEqual(1);
  });
});
