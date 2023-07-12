import Constants from "../src/constants/Constants";
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
    toolbar: {
      icon: "photo",
      items: [
        { value: Constants.ICON_BEHAVIOR.ON_HOVER, title: "onHover" },
        { value: Constants.ICON_BEHAVIOR.ENABLE, title: "Enabled" },
        { value: Constants.ICON_BEHAVIOR.DISABLE, title: "Disabled" },
      ],
      dynamicTitle: true,
    },
  },
  locale: {
    description: "Internationalization locale",
    defaultValue: "en",
    toolbar: {
      icon: "globe",
      items: [
        { value: "en", right: "🇺🇸", title: "English" },
        { value: "cs", right: "🇨🇿", title: "Česky" },
      ],
      dynamicTitle: true,
    },
  },
  debugMode: {
    name: "Debug Mode",
    description: "Show irrelevant questions",
    defaultValue: false,
    toolbar: {
      title: "Debug mode",
      icon: "beaker",
      items: [
        { value: true, title: "On" },
        { value: false, title: "Off" },
      ],
    },
  },
  horizontalNavBar: {
    name: "Toggle Horizontal Navigation Bar",
    description: "Set the navigation bar to horizontal",
    defaultValue: false,
    toolbar: {
      icon: "expandalt",
      items: [
        { value: true, title: "On" },
        { value: false, title: "Off" },
      ],
    },
  },
  timeOut: {
    name: "Time Out (ms)",
    description: "Set time-out for possible values (in ms)",
    defaultValue: 1500,
    toolbar: {
      title: "Time Out (ms)",
      icon: "timer",
      items: [
        { value: 200, title: "200 ms" },
        { value: 500, title: "500 ms" },
        { value: 1000, title: "1000 ms" },
        { value: 1500, title: "1500 ms" },
        { value: 2000, title: "2000 ms" },
        { value: 2500, title: "2500 ms" },
      ],
    },
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

const preview = {
  decorators: [
    (Story, context) => (
      <ConfigurationContextProvider options={options}>
        <FormGenContextProvider fetchTypeAheadValues={fetchTypeAheadValues}>
          <IntlContextProvider locale={context.globals.locale}>
            <Story />
          </IntlContextProvider>
        </FormGenContextProvider>
      </ConfigurationContextProvider>
    ),
  ],
  parameters: {
    options: {
      storySort: {
        order: ["Stories", "Components"],
      },
    },
  },
};
export default preview;
