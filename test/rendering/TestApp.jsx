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
  constructor(props) {
    super(props);
    this.state = {
      wizardProperties: null,
      wizard: null
    };
    this.form = React.createRef();
  }

  async componentDidMount() {
    Configuration.dateFormat = 'yyyy-MM-dd';
    Configuration.intl = {
      locale: navigator.language
    };
    Configuration.fetchTypeAheadValues = () =>
      new Promise((resolve) => setTimeout(resolve({ data: possibleValues }), 1500));
    Configuration.i18n = {
      'wizard.next': 'Další',
      'wizard.previous': 'Předchozí'
    };
    Configuration.horizontalWizardNav = true;
    Configuration.modalView = false;

    const [wizardProperties, structure] = await WizardGenerator.createWizard(form, null, null);
    this.setState({ wizardProperties, form: structure });
  }

  render() {
    if (!this.state.wizardProperties) {
      return <div>'Loading wizard...'</div>;
    }

    return (
      <React.Fragment>
        <WizardContainer
          ref={this.form}
          steps={this.state.wizardProperties.steps}
          data={this.state.form}
          enableForwardSkip={true}
          onHide={() => {}}
          show={true}
          title={'Title'}
        />
        <button
          style={{ width: '100px', margin: '1rem -50px', position: 'relative', left: '50%' }}
          onClick={() => console.log(this.form.current.getFormData())}
        >
          Save
        </button>
      </React.Fragment>
    );
  }
}

ReactDOM.render(<TestApp />, document.getElementById('container'));
