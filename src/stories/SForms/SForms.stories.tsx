import React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";

import SForms from "../../components/SForms";
import form1 from "../assets/form1.json"; // form with wizard steps
import form2 from "../assets/form2.json"; // form without wizard steps (proudly assembled in Semantic Form Web Editor)
import touristDestinationForm1 from "../assets/touristDestinationForm1.json";
import touristDestinationForm2 from "../assets/touristDestinationForm2.json";

import queryString from "query-string";
import Constants from "../../constants/Constants";
import IntlContextProvider from "../../contexts/IntlContextProvider";

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

const modalProps = {
  show: true,
  title: "Title",
};

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
  modalProps,
  horizontalWizardNav: false,
  wizardStepButtons: true,
  enableForwardSkip: true,
  ...getP("startingQuestionId", "layout-options-65"),
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

export default {
  title: "SForms",
  component: SForms,
} as ComponentMeta<typeof SForms>;

const Template: ComponentStory<typeof SForms> = (args) => {
  return (
    <IntlContextProvider locale={args.options.intl.locale}>
      <SForms {...args} />
    </IntlContextProvider>
  );
};

export const Form1 = Template.bind({});
Form1.args = {
  form: form1,
  options: options,
};

export const Form2 = Template.bind({});
Form2.args = {
  form: form2,
  options: options,
};

export const TouristDestinationForm1 = Template.bind({});
TouristDestinationForm1.args = {
  form: touristDestinationForm1,
  options: options,
};

export const TouristDestinationForm2 = Template.bind({});
TouristDestinationForm2.args = {
  form: touristDestinationForm2,
  options: options,
};
