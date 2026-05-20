import React, { useState } from "react";
import Question from "../components/Question";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { ConfigurationContext } from "../contexts/ConfigurationContext";
import { FormGenContext } from "../contexts/FormGenContext.js";
import DefaultInput from "../components/DefaultInput";

import questionExpanded from "./assets/question/questionExpanded.json";
import questionCollapsed from "./assets/question/questionCollapsed.json";
import showHiddenQuestion from "./assets/question/showHiddenQuestion.json";
import hiddenQuestion from "./assets/question/testedQuestion.json";
import question from "./assets/question/question.json";
import answerableQuestion from "./assets/question/answerableQuestion.json";
import answerableQuestionExpanded from "./assets/question/answerableQuestionExpanded.json";
import questionWithMedia from "./assets/question/questionWithMedia.json";
import typeheadQuestionWithHint from "./assets/question/typeaheadQuestionWithHint.json";
import selectQuestionWithHint from "./assets/question/selectQuestionWithHint.json";
import queryString from "query-string";
import questionWithMediaWithHint from "./assets/question/questionWithMediaWithHint.json";

export default {
  title: "Components/Question",
  component: Question,
} as ComponentMeta<typeof Question>;

const getP = (queryParameterName: string, defaultValue: string) => ({
  [queryParameterName]: getQueryParameter(queryParameterName, defaultValue),
});

const getQueryParameter = (parameterName: string, defaultValue: string) => {
  const value = queryString.parse(window.location.search)[parameterName];
  return value ?? defaultValue;
};

const optionsWithDebugModeOn = {
  intl: { locale: "en" },
  debugMode: true,
};

const optionsWithStartingHiddenQuestion = {
  intl: { locale: "en" },
  ...getP("startingQuestionId", "hidden-question-1834"),
};

const Template: ComponentStory<typeof Question> = (
  args,
  { globals: { debugMode } }
) => {
  const inputComponent = DefaultInput;
  const componentsOptions = {
    readOnly: false,
    dateTimeAnswer: {
      dateFormat: "yyyy-MM-dd",
      timeFormat: "HH:mm:ss",
      dateTimeFormat: "yyyy-MM-dd HH:mm:ss",
    },
  };
  const options = {
    intl: { locale: "en" },
    debugMode: debugMode,
  };
  const mapComponent = (_q: any, defaultComponent: any) => defaultComponent;
  const getOptions = (_id: number) => [];
  const intl = {
    formatMessage: ({ defaultMessage }: { defaultMessage: string }) =>
      defaultMessage,
  };

  return (
    <ConfigurationContext.Provider
      value={{
        componentsOptions,
        inputComponent,
        mapComponent,
        options,
        ...args,
      }}
    >
      <FormGenContext.Provider value={{ getOptions }}>
        <Question {...args} onChange={() => {}} intl={intl} />
      </FormGenContext.Provider>
    </ConfigurationContext.Provider>
  );
};

const HintTemplate: ComponentStory<typeof Question> = (_args) => {
  const [typeaheadRevealed, setTypeaheadRevealed] = useState(false);
  const [selectRevealed, setSelectRevealed] = useState(false);
  const [mediaRevealed, setMediaRevealed] = useState(false);

  const inputComponent = DefaultInput;
  const componentsOptions = {
    readOnly: false,
    dateTimeAnswer: {
      dateFormat: "yyyy-MM-dd",
      timeFormat: "HH:mm:ss",
      dateTimeFormat: "yyyy-MM-dd HH:mm:ss",
    },
  };
  const options = {
    intl: { locale: "en" },
    debugMode: false,
    enableOptionQuestionFeedback: true,
    icons: [{ id: "questionHint", behavior: "enable" }],
  };

  const mapComponent = (_q: any, defaultComponent: any) => defaultComponent;
  const getOptions = (_id: number) => [];
  const intl = {
    formatMessage: ({ defaultMessage }: { defaultMessage: string }) =>
      defaultMessage,
  };

  const sharedProviderProps = {
    componentsOptions,
    inputComponent,
    mapComponent,
    options,
  };

  const noteStyle: React.CSSProperties = {
    marginBottom: "0.5rem",
    padding: "0.4rem 0.75rem",
    background: "#fffbe6",
    border: "1px solid #ffe58f",
    borderRadius: "4px",
    fontSize: "0.875rem",
    color: "#7c5e00",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <div>
        <div style={noteStyle}>
          💡 <strong>Click the hint bulb</strong> to reveal the correct answer.
        </div>
        <ConfigurationContext.Provider value={sharedProviderProps}>
          <FormGenContext.Provider value={{ getOptions }}>
            <Question
              question={typeheadQuestionWithHint}
              onChange={() => {}}
              intl={intl}
              hintRevealed={typeaheadRevealed}
              onRevealAnswer={() => setTypeaheadRevealed(true)}
            />
          </FormGenContext.Provider>
        </ConfigurationContext.Provider>
      </div>
      <div>
        <ConfigurationContext.Provider value={sharedProviderProps}>
          <FormGenContext.Provider value={{ getOptions }}>
            <Question
              question={selectQuestionWithHint}
              onChange={() => {}}
              intl={intl}
              hintRevealed={selectRevealed}
              onRevealAnswer={() => setSelectRevealed(true)}
            />
          </FormGenContext.Provider>
        </ConfigurationContext.Provider>
      </div>
      <div>
        <ConfigurationContext.Provider value={sharedProviderProps}>
          <FormGenContext.Provider value={{ getOptions }}>
            <Question
              question={{
                ...questionWithMediaWithHint,
                ["http://onto.fel.cvut.cz/ontologies/documentation/has_related_question"]:
                  [
                    {
                      ...questionWithMediaWithHint[
                        "http://onto.fel.cvut.cz/ontologies/documentation/has_related_question"
                      ]?.[0],
                      ["http://onto.fel.cvut.cz/ontologies/form/has-media-content"]:
                        questionWithMedia[
                          "http://onto.fel.cvut.cz/ontologies/form/has-media-content"
                        ],
                    },
                  ],
              }}
              onChange={() => {}}
              intl={intl}
              hintRevealed={mediaRevealed}
              onHintReveal={() => setMediaRevealed(true)}
            />
          </FormGenContext.Provider>
        </ConfigurationContext.Provider>
      </div>
    </div>
  );
};

export const TestedQuestionIsIrrelevant = Template.bind({});
TestedQuestionIsIrrelevant.args = { question: hiddenQuestion };

export const TestedQuestionIsRelevant = Template.bind({});
TestedQuestionIsRelevant.args = { question: showHiddenQuestion };

export const TestedQuestionIsIrrelevantWithDebugModeOn = Template.bind({});
TestedQuestionIsIrrelevantWithDebugModeOn.args = {
  question: hiddenQuestion,
  options: optionsWithDebugModeOn,
};

export const TestedQuestionIsIrrelevantAndStartingId = Template.bind({});
TestedQuestionIsIrrelevantAndStartingId.args = {
  question: hiddenQuestion,
  options: optionsWithStartingHiddenQuestion,
};

export const CollapsedQuestion = Template.bind({});
CollapsedQuestion.args = { question: questionCollapsed };

export const ExpandedQuestion = Template.bind({});
ExpandedQuestion.args = { question: questionExpanded };

export const QuestionWithoutHeader = Template.bind({});
QuestionWithoutHeader.args = { question: question };

export const AnswerableQuestion = Template.bind({});
AnswerableQuestion.args = { question: answerableQuestion };

export const AnswerableQuestionExpanded = Template.bind({});
AnswerableQuestionExpanded.args = { question: answerableQuestionExpanded };

export const QuestionWithOptionsAndHintReveal = HintTemplate.bind({});
QuestionWithOptionsAndHintReveal.storyName =
  "Hint reveal — Typeahead, Select and Media";
