import Constants from "../src/constants/Constants";
import { addDecorator } from "@storybook/react";
import IntlContextProvider from "../src/contexts/IntlContextProvider";
import { FormGenContextProvider } from "../src/contexts/FormGenContext";
import { ConfigurationContextProvider } from "../src/contexts/ConfigurationContext";

import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../src/styles/s-forms.css";
import possibleValues from "../src/stories/assets/possibleValues.json";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

export const globalTypes = {
  iconBehavior: {
    name: "Icon behavior",
    description: "Set the behavior for the icons",
    defaultValue: Constants.ICON_BEHAVIOR.ON_HOVER,
    options: [
      Constants.ICON_BEHAVIOR.ON_HOVER,
      Constants.ICON_BEHAVIOR.ENABLE,
      Constants.ICON_BEHAVIOR.DISABLE,
    ],
    control: { type: "radio" },
  },
  locale: {
    name: "Locale",
    description: "Internationalization locale",
    defaultValue: "en",
    options: ["en", "cs"],
    control: { type: "radio" },
  },
  debugMode: {
    name: "Debug Mode",
    description: "Show irrelevant questions",
    defaultValue: false,
    control: { type: "boolean" },
  },
  horizontalNavBar: {
    name: "Toggle Horizontal Navigation Bar",
    description: "Set the navigation bar to horizontal",
    defaultValue: true,
    control: { type: "boolean" },
  },
  timeOut: {
    name: "Time Out (ms)",
    description: "Set time-out for possible values (in ms)",
    defaultValue: 1500,
    control: { type: "number", min: 0, max: 10000, step: 500 },
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
    locale: "en",
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

addDecorator((story) => (
  <ConfigurationContextProvider options={options}>
    <FormGenContextProvider fetchTypeAheadValues={fetchTypeAheadValues}>
      <IntlContextProvider locale={globalTypes.locale.defaultValue}>
        {story()}
      </IntlContextProvider>
    </FormGenContextProvider>
  </ConfigurationContextProvider>
));
