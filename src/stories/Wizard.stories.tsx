import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import DefaultInput from "../components/DefaultInput";
import Wizard from "../components/wizard/Wizard";
import { FormQuestionsContext } from "../contexts/FormQuestionsContext";
import { ConfigurationContext } from "../contexts/ConfigurationContext";

import wizardForm from "./assets/form/wizardForm.json";
import Constants from "../constants/Constants";

export default {
  title: "Components/Wizard",
  component: Wizard,
} as ComponentMeta<typeof Wizard>;

const Template: ComponentStory<typeof Wizard> = (
  args,
  { globals: { iconBehavior, locale, debugMode, horizontalNavBar } }
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
    i18n: {
      "wizard.next": "Next",
      "wizard.previous": "Previous",
      "section.expand": "Expand",
      "section.collapse": "Collapse",
    },
    intl: {
      locale: locale,
    },
    modalView: false,
    horizontalWizardNav: horizontalNavBar,
    wizardStepButtons: true,
    enableForwardSkip: true,
    startingStep: 1,
    debugMode: debugMode,
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
        behavior: iconBehavior,
      },
      {
        id: Constants.ICONS.QUESTION_LINK,
        behavior: iconBehavior,
      },
      {
        id: Constants.ICONS.QUESTION_COMMENTS,
        behavior: iconBehavior,
      },
    ],
  };

  const getFormQuestionsData = () => {
    return wizardForm;
  };
  const _getComponentMappingFunction = () => {
    return (question: any, defaultComponent: any) => {
      return defaultComponent;
    };
  };
  const mapComponent = _getComponentMappingFunction();
  return (
    <ConfigurationContext.Provider
      value={{
        componentsOptions,
        inputComponent,
        mapComponent,
        options,
      }}
    >
      <FormQuestionsContext.Provider value={{ getFormQuestionsData }}>
        <Wizard />
      </FormQuestionsContext.Provider>
    </ConfigurationContext.Provider>
  );
};

export const Default = Template.bind({});
