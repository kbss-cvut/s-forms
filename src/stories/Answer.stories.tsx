import React from "react";
import Answer from "../components/Answer";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import question from "./assets/questionWithMedia.json";
import questionWithMultipleChoice from "./assets/questionWithMultipleChoice.json";
import { ConfigurationContextProvider } from "../contexts/ConfigurationContext";
import Constants from "../constants/Constants";
import { FormGenContextProvider } from "../contexts/FormGenContext";
import possibleValues from "./assets/possibleValues.json";
import IntlContextProvider from "../contexts/IntlContextProvider";

export default {
  title: "Components/Answer",
  component: Answer,
} as ComponentMeta<typeof Answer>;

const Template: ComponentStory<typeof Answer> = (args) => {
  const options = {
    i18n: {
      "wizard.next": "Next",
      "wizard.previous": "Previous",
      "section.expand": "Expand",
      "section.collapse": "Collapse",
    },
    intl: {
      locale: Constants.LANG.cs.locale,
    },
    modalView: false,
    horizontalWizardNav: false,
    wizardStepButtons: true,
    enableForwardSkip: true,
    startingStep: 1,
    debugMode: false,
    users: [
      { id: "http://fel.cvut.cz/people/max-chopart", label: "Max Chopart" },
      {
        id: "http://fel.cvut.cz/people/miroslav-blasko",
        label: "Miroslav Blasko",
      },
    ],
    currentUser: "http://fel.cvut.cz/people/max-chopart",
    icons: [
      {
        id: Constants.ICONS.QUESTION_HELP,
        behavior: Constants.ICON_BEHAVIOR.ENABLE,
      },
      {
        id: Constants.ICONS.QUESTION_LINK,
        behavior: Constants.ICON_BEHAVIOR.ENABLE,
      },
      {
        id: Constants.ICONS.QUESTION_COMMENTS,
        behavior: Constants.ICON_BEHAVIOR.ENABLE,
      },
    ],
  };

  const fetchTypeAheadValues = () => {
    return new Promise((resolve) =>
      setTimeout(() => resolve(possibleValues), 1500)
    );
  };

  return (
    <FormGenContextProvider fetchTypeAheadValues={fetchTypeAheadValues}>
      <ConfigurationContextProvider options={options}>
        <IntlContextProvider>
          <Answer {...args} onChange={() => {}} onCommentChange={() => {}} />
        </IntlContextProvider>
      </ConfigurationContextProvider>
    </FormGenContextProvider>
  );
};

export const Text = Template.bind({});
Text.args = {
  answer: {
    "http://onto.fel.cvut.cz/ontologies/documentation/has_data_value": "",
  },
  question: question,
};

export const TypeHead = Template.bind({});
TypeHead.args = {
  answer: {},
  question: questionWithMultipleChoice,
};
