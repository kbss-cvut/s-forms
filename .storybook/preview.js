import Constants from '../src/constants/Constants';

import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../src/styles/s-forms.css';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  }
};

export const globalTypes = {
  iconBehavior: {
    name: 'Icon behavior',
    description: 'Set the behavior for the icons',
    defaultValue: Constants.ICON_BEHAVIOR.ON_HOVER,
    options: [Constants.ICON_BEHAVIOR.ON_HOVER, Constants.ICON_BEHAVIOR.ENABLE, Constants.ICON_BEHAVIOR.DISABLE],
    control: { type: 'radio' }
  },
  locale: {
    name: 'Locale',
    description: 'Internationalization locale',
    defaultValue: 'en',
    options: ['en', 'cs'],
    control: { type: 'radio' }
  },
  debugMode: {
    name: 'Debug Mode',
    description: 'Show irrelevant questions',
    defaultValue: false,
    control: { type: 'boolean' }
  }
};
