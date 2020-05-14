import React from 'react';
import ReactDOM from 'react-dom';
import Configuration from '../../src/model/Configuration';
import WizardGenerator from '../../src/model/WizardGenerator';
import WizardContainer from '../../src/components/wizard/WizardContainer';

import '../../src/styles/s-forms.css';

const form = require('./form.json');
const possibleValues = require('./possibleValues.json');

function onChange(index, change) {
  console.log(change);
}

class TestApp extends React.Component {
  state = {
    wizardProperties: null,
    wizard: null
  };

  async componentDidMount() {
    Configuration.dateFormat = 'yyyy-MM-dd';
    Configuration.intl = {
      locale: navigator.language
    };
    Configuration.fetchTypeAheadValues = () => new Promise((resolve) => setTimeout(resolve(possibleValues), 1500));
    Configuration.i18n = {
      'wizard.next': 'Další',
      'wizard.previous': 'Předchozí'
    };
    Configuration.horizontalWizardNav = true;
    Configuration.modalView = true;

    const wizardProperties = await WizardGenerator.createWizard(form, null, null);
    this.setState({ wizardProperties, form });
  }

  render() {
    if (!this.state.wizardProperties) {
      return <div>'Loading wizard...'</div>;
    }

    return (
      <WizardContainer
        steps={this.state.wizardProperties.steps}
        data={{
          root: form
        }}
        enableForwardSkip={true}
        onHide={() => {
          console.log('hide');
        }}
        show={true}
        title={'Title'}
      />
    );
  }
}

ReactDOM.render(<TestApp />, document.getElementById('container'));
