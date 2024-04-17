import React from "react";
import { format } from "date-fns";

import * as Generator from "../environment/Generator";
import Answer from "../../src/components/Answer";
import Constants from "../../src/constants/Constants";
import { FormGenContext } from "../../src/contexts/FormGenContext";
import { ConfigurationContext } from "../../src/contexts/ConfigurationContext";
import DefaultInput from "../../src/components/DefaultInput";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

describe("Answer component", () => {
  let question,
    onChange,
    answer,
    getOptions,
    loadFormOptions,
    options,
    inputComponent,
    componentsOptions;

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
    question[Constants.HAS_ANSWER] = [answer];
    getOptions = jest.fn(() => []);
    loadFormOptions = jest.fn();
  });

  test("renders a Typeahead when layout class is typeahead", async () => {
    question[Constants.LAYOUT_CLASS].push(Constants.LAYOUT.QUESTION_TYPEAHEAD);
    render(
      <ConfigurationContext.Provider
        value={{
          componentsOptions,
          inputComponent,
          options,
        }}
      >
        <FormGenContext.Provider value={{ getOptions, loadFormOptions }}>
          <Answer
            answer={{}}
            question={question}
            onChange={onChange}
            onCommentChange={() => void undefined}
          />
        </FormGenContext.Provider>
      </ConfigurationContext.Provider>
    );

    await waitFor(() => {
      const typeahead = screen.getByRole("combobox");
      expect(typeahead).toBeInTheDocument();
    });
  });

  it("maps answer object value to string label for the typeahead component", async () => {
    const value = Generator.getRandomUri();
    const valueLabel = "masterchief";
    const typeAheadOptions = Generator.generateTypeaheadOptions(
      value,
      valueLabel
    );
    answer = answerWithCodeValue(value);
    getOptions = jest.fn(() => typeAheadOptions);

    question[Constants.HAS_ANSWER] = [answer];
    question[Constants.LAYOUT_CLASS].push(Constants.LAYOUT.QUESTION_TYPEAHEAD);
    question[Constants.HAS_OPTIONS_QUERY] = "SELECT * WHERE {?x ?y ?z. }";

    render(
      <ConfigurationContext.Provider
        value={{
          componentsOptions,
          inputComponent,
          options,
        }}
      >
        <FormGenContext.Provider
          value={{ getOptions, loadFormOptions: () => typeAheadOptions }}
        >
          <Answer
            answer={answer}
            question={question}
            onChange={onChange}
            onCommentChange={() => void undefined}
          />
        </FormGenContext.Provider>
      </ConfigurationContext.Provider>
    );

    await waitFor(() => {
      const typeahead = screen.getByRole("combobox");

      fireEvent.click(typeahead);
      fireEvent.click(screen.getByText(valueLabel));

      expect(typeahead).toBeInTheDocument();
      expect(screen.getByText(valueLabel)).toBeInTheDocument();
    });
  });

  it("loads typeahead options when layout class is typeahead and no possible values are specified", async () => {
    question[Constants.LAYOUT_CLASS].push(Constants.LAYOUT.QUESTION_TYPEAHEAD);
    const query = "SELECT * WHERE { ?x ?y ?z .}";
    question[Constants.HAS_OPTIONS_QUERY] = query;

    render(
      <ConfigurationContext.Provider
        value={{
          componentsOptions,
          inputComponent,
          options,
        }}
      >
        <FormGenContext.Provider value={{ getOptions, loadFormOptions }}>
          <Answer
            answer={{}}
            question={question}
            onChange={onChange}
            onCommentChange={() => void undefined}
          />
        </FormGenContext.Provider>
      </ConfigurationContext.Provider>
    );

    await waitFor(() => {
      expect(loadFormOptions).toHaveBeenCalled();
      expect(loadFormOptions.mock.calls[0][1]).toEqual(query);
    });
  });

  function answerWithCodeValue(value) {
    const res = {
      "@id": Generator.getRandomUri(),
    };
    res[Constants.HAS_OBJECT_VALUE] = {
      "@id": value,
    };
    return res;
  }

  it("shows input with text value of the answer when no layout class is specified", () => {
    const value = "masterchief";
    answer = answerWithTextValue(value);
    question[Constants.HAS_ANSWER] = [answer];

    render(
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

    const input = screen.getByRole("textbox");

    expect(input).not.toBeNull();
    expect(input.type).toEqual("text");
    expect(input.value).toEqual(value);
  });

  function answerWithTextValue(value) {
    const res = {
      "@id": Generator.getRandomUri(),
    };
    res[Constants.HAS_DATA_VALUE] = {
      "@language": "en",
      "@value": value,
    };
    return res;
  }

  it.skip("renders date picker with answer value when date layout class is specified", () => {
    const date = new Date("2000-01-01");
    const value = format(date, "yyyy-MM-dd HH:mm:ss");

    answer = answerWithTextValue(value);
    question[Constants.HAS_ANSWER] = [answer];
    question[Constants.LAYOUT_CLASS].push(Constants.LAYOUT.DATE);

    render(
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

    const picker = screen.getByPlaceholderText("yyyy-MM-dd");

    expect(picker).not.toBeNull();
    expect(screen.queryByLabelText("month 2000-01")).toBeNull();
    expect(picker.value).toEqual(format(date, "yyyy-MM-dd"));
  });

  it.skip("renders time picker with answer value when time layout class is specified", () => {
    const date = new Date();
    const value = format(date, "HH:mm:ss");

    answer = answerWithTextValue(date);
    question[Constants.HAS_ANSWER] = [answer];
    question[Constants.LAYOUT_CLASS].push(Constants.LAYOUT.TIME);

    render(
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

    const picker = screen.getByPlaceholderText("HH:mm:ss");

    expect(picker).not.toBeNull();
    expect(screen.queryByText("Time")).toBeNull();
    expect(picker.value).toEqual(value);
  });

  it("renders datetime picker with answer value when datetime layout class is specified", () => {
    const date = new Date();
    const testDate = format(date, "yyyy-MM");
    const value = format(date, "yyyy-MM-dd HH:mm:ss");
    answer = answerWithTextValue(value);
    question[Constants.HAS_ANSWER] = [answer];
    question[Constants.LAYOUT_CLASS].push(Constants.LAYOUT.DATETIME);

    render(
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

    const picker = screen.getByPlaceholderText("yyyy-MM-dd HH:mm:ss");

    expect(picker).not.toBeNull();
    expect(screen.queryByText("Time")).toBeNull();
    expect(screen.queryByLabelText("month " + testDate)).toBeNull();
    expect(picker.value).toEqual(value);
  });

  it.skip("renders datetime picker with answer value when no layout class is specified and numeric answer value is used", () => {
    const date = new Date();
    const value = Number(date);
    const testDate = format(date, "yyyy-MM");
    answer = {
      "@id": Generator.getRandomUri(),
    };
    answer[Constants.HAS_DATA_VALUE] = value;
    question[Constants.HAS_ANSWER] = [answer];
    question[Constants.LAYOUT_CLASS].push(Constants.LAYOUT.DATETIME);

    console.log(date);

    render(
      <ConfigurationContext.Provider
        value={{
          componentsOptions,
          inputComponent: { inputComponent },
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

    const picker = screen.getByPlaceholderText("yyyy-MM-dd HH:mm:ss");

    expect(picker).not.toBeNull();
    expect(screen.queryByText("Time")).toBeNull();
    expect(screen.queryByLabelText("month " + testDate)).toBeNull();
    expect(picker.value).toEqual(
      format(new Date(value), "yyyy-MM-dd HH:mm:ss")
    );
  });

  it("renders checkbox with answer value when checkbox layout class is specified", () => {
    const answer = {
      "@id": Generator.getRandomUri(),
    };
    answer[Constants.HAS_DATA_VALUE] = true;
    question[Constants.HAS_ANSWER] = [answer];
    question[Constants.LAYOUT_CLASS].push(Constants.LAYOUT.CHECKBOX);

    render(
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
    const input = screen.getByRole("checkbox");

    expect(input).toBeDefined();
    expect(input.checked).toBeTruthy();
  });

  it("renders numeric input with answer value when number layout class is specified", () => {
    const value = 117;
    const answer = {
      "@id": Generator.getRandomUri(),
    };
    answer[Constants.HAS_DATA_VALUE] = value;
    question[Constants.HAS_ANSWER] = [answer];
    question[Constants.HAS_DATATYPE] = Constants.XSD.INT;

    render(
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

    // Spinbutton is aria role for input with restricted inputs
    const input = screen.getByRole("spinbutton");

    expect(input).toBeDefined();
    expect(Number(input.value)).toEqual(value);
  });

  it("renders textarea for answer with long value", () => {
    let value = "";
    for (let i = 0; i < Constants.INPUT_LENGTH_THRESHOLD + 1; i++) {
      value += "a";
    }
    answer = answerWithTextValue(value);
    answer[Constants.HAS_DATA_VALUE] = value;
    question[Constants.HAS_ANSWER] = [answer];

    render(
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
    const input = screen.getByRole("textbox");

    expect(input).toBeDefined();
    expect(input.value).toEqual(value);
  });

  it("renders masked input for question with masked-input layout class", () => {
    const value = "08/2016";
    const mask = "11/1111";
    const answer = {
      "@id": Generator.getRandomUri(),
    };
    answer[Constants.HAS_DATA_VALUE] = value;
    question[Constants.HAS_ANSWER] = [answer];
    question[Constants.LAYOUT_CLASS].push(Constants.LAYOUT.MASKED_INPUT);
    question[Constants.INPUT_MASK] = mask;

    const container = render(
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
    const input = screen.getByRole("textbox");

    expect(input).toBeDefined();
    expect(input.value).toEqual(value);
    expect(document.querySelector("input").getAttribute("mask")).toEqual(mask);
  });
});
