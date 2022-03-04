import React from 'react';
import SForms from '../../components/SForms';
import form1 from './form1.json'; // form with wizard steps
import form2 from './form2.json'; // form without wizard steps (proudly assembled in Semantic Form Web Editor)
import example_turisticky_cil from './example_turisticky_cil.json';

import queryString from 'query-string';
import Constants from '../../constants/Constants';

const getP = (queryParameterName, defaultValue) => {
  return {
    [queryParameterName]: getQueryParameter(queryParameterName, defaultValue)
  };
};

const getQueryParameter = (parameterName, defaultValue) => {
  const value = queryString.parse(window.location.search)[parameterName];
  if (value) {
    return value;
  }
  return defaultValue;
};

const modalProps = {
  onHide: () => {},
  show: true,
  title: 'Title'
};

const options = {
  i18n: {
    'wizard.next': 'Next',
    'wizard.previous': 'Previous',
    'section.expand': 'Expand',
    'section.collapse': 'Collapse'
  },
  intl: {
    locale: 'cs'
  },
  modalView: false,
  modalProps,
  horizontalWizardNav: false,
  wizardStepButtons: true,
  enableForwardSkip: true,
  ...getP('startingQuestionId', 'layout-options-65'),
  startingStep: 1,
  debugMode: false,
  users: [
    { id: 'http://fel.cvut.cz/people/max-chopart', label: 'Max Chopart' },
    {
      id: 'http://fel.cvut.cz/people/miroslav-blasko',
      label: 'Miroslav Blasko'
    }
  ],
  currentUser: 'http://fel.cvut.cz/people/max-chopart',
  icons: [
    {
      id: Constants.ICONS.QUESTION_HELP,
      behavior: Constants.ICON_BEHAVIOR.ENABLE
    },
    {
      id: Constants.ICONS.QUESTION_LINK,
      behavior: Constants.ICON_BEHAVIOR.ENABLE
    },
    {
      id: Constants.ICONS.QUESTION_COMMENTS,
      behavior: Constants.ICON_BEHAVIOR.ON_HOVER
    }
  ]
};

export default {
  title: 'SForms',
  component: SForms,
  argTypes: {
    options: {
      table: {
        type: {
          summary: 'object',
          detail: 'icons_behavior_options: enable || <onHover> || disable'
        }
      }
    }
  }
};

const Template = (args) => {
  return <SForms {...args} />;
};

export const Form1 = Template.bind({});
Form1.args = {
  options: options,
  form: form1
};

export const Form2 = Template.bind({});
Form2.args = {
  options: options,
  form: form2
};

export const Form3 = Template.bind({});
Form3.args = {
  options: options,
  form: example_turisticky_cil
};
