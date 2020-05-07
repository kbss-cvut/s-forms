import React from 'react';
import ReactDOM from 'react-dom';
import Configuration from '../../src/model/Configuration';
import Question from '../../src/components/Question';
import WizardGenerator from '../../src/model/WizardGenerator';
import '../../src/styles/s-forms.css';

const wizard = require('./form.json');

function onChange(index, change) {
  console.log(change);
}

class TestApp extends React.Component {
  state = {
    step: null
  };

  async componentDidMount() {
    Configuration.dateFormat = 'yyyy-MM-dd';
    Configuration.intl = {
      locale: navigator.language
    };
    Configuration.initWizard = () => {};
    Configuration.readOnly = true;

    const wizardProperties = await WizardGenerator.createWizard(wizard, null, null);
    this.setState({ step: wizardProperties.steps[5].data });
  }

  render() {
    if (!this.state.step) {
      return <div>'Loading wizard...'</div>;
    }
    return (
      <div>
        <Question question={this.state.step} onChange={onChange} indent={0} />
      </div>
    );
  }
}

ReactDOM.render(<TestApp />, document.getElementById('container'));
