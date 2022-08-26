import React from "react";
import Question from "../components/Question";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { ConfigurationContext } from "../contexts/ConfigurationContext";
import { FormGenContext } from "../contexts/FormGenContext.js";
import DefaultInput from "../components/DefaultInput";

import questionExpanded from "./assets/question/questionExpanded.json";
import questionCollapsed from "./assets/question/questionCollapsed.json";
import showHiddenQuestion from "./assets/question/showHiddenQuestion.json";
import hiddenQuestion from "./assets/question/hiddenQuestion.json";

export default {
  title: "Components/Question",
  component: Question,
} as ComponentMeta<typeof Question>;

const optionsWithDebugModeOn = {
  intl: {
    locale: "en",
  },
  i18n: {},
  debugMode: true,
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
    i18n: {},
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

export const HiddenQuestion = Template.bind({});
HiddenQuestion.args = {
  question: hiddenQuestion,
};

export const ShowHiddenQuestion = Template.bind({});
ShowHiddenQuestion.args = {
  question: showHiddenQuestion,
};

export const HiddenQuestionWithDebugModeOn = Template.bind({
  question: hiddenQuestion,
});
HiddenQuestionWithDebugModeOn.args = {
  question: hiddenQuestion,
  options: optionsWithDebugModeOn,
};

export const CollapsedQuestion = Template.bind({});
CollapsedQuestion.args = {
  question: questionCollapsed,
};

export const ExpandedQuestion = Template.bind({});
ExpandedQuestion.args = {
  question: questionExpanded,
};
