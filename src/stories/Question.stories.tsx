import React from "react";
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
import queryString from "query-string";

export default {
  title: "Components/Question",
  component: Question,
} as ComponentMeta<typeof Question>;

const getP = (queryParameterName: string, defaultValue: string) => {
  return {
    [queryParameterName]: getQueryParameter(queryParameterName, defaultValue),
  };
};

const getQueryParameter = (parameterName: string, defaultValue: string) => {
  const value = queryString.parse(window.location.search)[parameterName];
  if (value) {
    return value;
  }
  return defaultValue;
};

const optionsWithDebugModeOn = {
  intl: {
    locale: "en",
  },
  debugMode: true,
};

const optionsWithStartingHiddenQuestion = {
  intl: {
    locale: "en",
  },
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
    intl: {
      locale: "en",
    },
    debugMode: debugMode,
  };
  const _getComponentMappingFunction = () => {
    return (question: any, defaultComponent: any) => {
      return defaultComponent;
    };
  };
  const mapComponent = _getComponentMappingFunction();
  const getOptions = (id: number) => options[id] || [];

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
        <Question {...args} onChange={() => {}} />
      </FormGenContext.Provider>
    </ConfigurationContext.Provider>
  );
};

export const TestedQuestionIsIrrelevant = Template.bind({});
TestedQuestionIsIrrelevant.args = {
  question: hiddenQuestion,
};

export const TestedQuestionIsRelevant = Template.bind({});
TestedQuestionIsRelevant.args = {
  question: showHiddenQuestion,
};

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
CollapsedQuestion.args = {
  question: questionCollapsed,
};

export const ExpandedQuestion = Template.bind({});
ExpandedQuestion.args = {
  question: questionExpanded,
};

export const QuestionWithoutHeader = Template.bind({});
QuestionWithoutHeader.args = {
  question: question,
};

export const AnswerableQuestion = Template.bind({});
AnswerableQuestion.args = {
  question: answerableQuestion,
};

export const AnswerableQuestionExpanded = Template.bind({});
AnswerableQuestionExpanded.args = {
  question: answerableQuestionExpanded,
};
