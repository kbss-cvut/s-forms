import React from 'react';
import ReactDOM from 'react-dom';
import SForms from '../../src/components/SForms';

import '../../src/styles/s-forms.css';
import 'react-datepicker/dist/react-datepicker.css';

const form = require('./form.json');

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
        'wizard.previous': 'Previous'
      },
      intl: {
        locale: 'cs'
      },
      modalView: false,
      modalProps,
      horizontalWizardNav: true,
      wizardStepButtons: true,
      enableForwardSkip: true,
      startingStep: 1,
      startingQuestionId:
        'http://onto.fel.cvut.cz/ontologies/documentation/question-c69219f6-f68a-4caa-a1aa-1705695faba1'
    };

    return (
      <React.Fragment>
        <SForms
          ref={this.refForm}
          form={form}
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
      </React.Fragment>
    );
  }
}

ReactDOM.render(<TestApp />, document.getElementById('container'));
