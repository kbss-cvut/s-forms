import React from 'react';
import ReactDOM from 'react-dom';
import SForms from '../../src/components/SForms';

import '../../src/styles/s-forms.css';
import 'react-datepicker/dist/react-datepicker.css';
import queryString from 'query-string';

const form1 = require('./form1.json'); // form with wizard steps
const form2 = require('./form2.json'); // form without wizard steps (proudly assembled in Semantic Form Web Editor)

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

class TestApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFormValid: false
    };
    this.refForm = React.createRef();
  }

  fetchTypeAheadValues = (query) => {
    const possibleValues = require('./possibleValues.json');
    return new Promise((resolve) => setTimeout(() => resolve(possibleValues), 1500));
  };

  render() {
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
      startingStep: 1
    };

    return (
      <div className="p-4">
        <SForms
          ref={this.refForm}
          form={form1}
          options={options}
          fetchTypeAheadValues={this.fetchTypeAheadValues}
          isFormValid={(isFormValid) => this.setState({ isFormValid })}
        />
        <button
          disabled={!this.state.isFormValid}
          style={{ width: '100px', margin: '1rem -50px', position: 'relative', left: '50%' }}
          onClick={() => console.log(this.refForm.current.getFormData())}
        >
          Save
        </button>
      </div>
    );
  }
}

ReactDOM.render(<TestApp />, document.getElementById('container'));
