import React from 'react';
import PropTypes from 'prop-types';
import WizardStep from './WizardStep';
import HorizontalWizardNav from './HorizontalWizardNav';
import VerticalWizardNav from './VerticalWizardNav';
import { Card } from 'react-bootstrap';
import { WizardContext } from '../../contexts/WizardContext';
import Configuration from '../../model/Configuration';

class Wizard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentStep: this.props.start || 0,
      nextDisabled: false,
      previousDisabled: false
    };
  }

  onAdvance = () => {
    const change = {};
    if (this.state.currentStep !== this.props.steps.length - 1) {
      this.props.steps[this.state.currentStep + 1].visited = true;
      change.currentStep = this.state.currentStep + 1;
    }
    this.setState(change);
  };

  onRetreat = () => {
    if (this.state.currentStep === 0) {
      return;
    }
    this.setState({
      currentStep: this.state.currentStep - 1
    });
  };

  onFinish = (errCallback) => {
    const data = {
      data: this.context.getData(),
      stepData: this.context.getStepData()
    };
    this.context.reset();
    this.props.onFinish(data, this.props.onClose, errCallback);
  };

  /**
   * Insert the specified step after the current one.
   * @param step The step to insert
   */
  onInsertStepAfterCurrent = (step) => {
    this.props.steps.splice(this.state.currentStep + 1, 0, step);
    this.context.insertStep(this.state.currentStep + 1, step.data);
  };

  /**
   * Adds the specified step to the end of this wizard.
   * @param step The step to add
   */
  onAddStep = (step) => {
    this.props.steps.push(step);
    this.context.insertStep(this.props.steps.length - 1, step.data);
  };

  onRemoveStep = (stepId) => {
    const stateUpdate = {};
    for (let i = 0, len = this.props.steps.length; i < len; i++) {
      if (this.props.steps[i].id === stepId) {
        this.props.steps.splice(i, 1);
        this.context.removeStep(i);
        if (i === this.state.currentStep && i !== 0) {
          stateUpdate.currentStep = this.state.currentStep - 1;
        }
        break;
      }
    }
    this.setState(stateUpdate);
  };

  render() {
    const cardClassname = Configuration.horizontalWizardNav ? '' : 'flex-row p-2';
    const containerClassname = Configuration.horizontalWizardNav ? 'card-body' : 'col-10 p-0';
    return (
      <Card className={cardClassname}>
        {Configuration.horizontalWizardNav ? (
          <HorizontalWizardNav
            currentStep={this.state.currentStep}
            steps={this.props.steps}
            onNavigate={this.navigate}
          />
        ) : (
          <VerticalWizardNav currentStep={this.state.currentStep} steps={this.props.steps} onNavigate={this.navigate} />
        )}
        <div className={containerClassname}>{this.initComponent()}</div>
      </Card>
    );

    // <VerticalWizardNav currentStep={this.state.currentStep} steps={this.props.steps} onNavigate={this.navigate} />
  }

  navigate = (stepIndex) => {
    if (stepIndex === this.state.currentStep || stepIndex >= this.props.steps.length) {
      return;
    }
    // Can we jump forward?
    if (stepIndex > this.state.currentStep && !this.props.steps[stepIndex].visited && !this.props.enableForwardSkip) {
      return;
    }
    this.setState({
      currentStep: stepIndex
    });
  };

  initComponent = () => {
    if (this.props.steps.length === 0) {
      return <div className="font-italic">There are no steps in this wizard.</div>;
    }
    const step = this.props.steps[this.state.currentStep];

    return (
      <WizardStep
        key={'step' + this.state.currentStep}
        onClose={this.props.onClose}
        onFinish={this.onFinish}
        onAdvance={this.onAdvance}
        onRetreat={this.onRetreat}
        onNext={step.onNext}
        onPrevious={step.onPrevious}
        onInsertStepAfterCurrent={this.onInsertStepAfterCurrent}
        onAddStep={this.onAddStep}
        onRemoveStep={this.onRemoveStep}
        component={step.component}
        title={step.name}
        stepIndex={this.state.currentStep}
        isFirstStep={this.state.currentStep === 0}
        isLastStep={this.state.currentStep === this.props.steps.length - 1}
        defaultNextDisabled={step.defaultNextDisabled}
      />
    );
  };
}

Wizard.propTypes = {
  start: PropTypes.number,
  steps: PropTypes.array,
  onFinish: PropTypes.func,
  onClose: PropTypes.func,
  enableForwardSkip: PropTypes.bool // Whether to allow forward step skipping
};

Wizard.contextType = WizardContext;

export default Wizard;
