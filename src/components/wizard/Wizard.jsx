import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'react-bootstrap';
import WizardStep from './WizardStep';
import HorizontalWizardNav from './HorizontalWizardNav';
import VerticalWizardNav from './VerticalWizardNav';
import { ConfigurationContext } from '../../contexts/ConfigurationContext';
import WizardWindow from './WizardWindow';
import { WizardContext } from '../../contexts/WizardContext';

const Wizard = (props) => {
  const [currentStep, setCurrentStep] = React.useState(props.start || 0);

  const wizardContext = React.useContext(WizardContext);
  const configurationContext = React.useContext(ConfigurationContext);

  const onNextStep = () => {
    const stepData = wizardContext.getStepData();
    if (currentStep !== stepData.length - 1) {
      stepData[currentStep + 1].visited = true;
      setCurrentStep((prevCurrentStep) => prevCurrentStep + 1);
    }
  };

  const onPreviousStep = () => {
    if (currentStep === 0) {
      return;
    }
    setCurrentStep((prevCurrentStep) => prevCurrentStep - 1);
  };

  const navigate = (stepIndex) => {
    const stepData = wizardContext.getStepData();

    if (stepIndex === currentStep || stepIndex >= stepData.length) {
      return;
    }
    // Can we jump forward?
    if (stepIndex > currentStep && !stepData[stepIndex].visited && !props.enableForwardSkip) {
      return;
    }
    setCurrentStep(stepIndex);
  };

  const renderNav = () => {
    if (wizardContext.getStepData().length <= 1) {
      return null;
    }

    const stepData = wizardContext.getStepData();

    return configurationContext.options.horizontalWizardNav ? (
      <HorizontalWizardNav currentStep={currentStep} steps={stepData} onNavigate={navigate} />
    ) : (
      <VerticalWizardNav currentStep={currentStep} steps={stepData} onNavigate={navigate} />
    );
  };

  const renderWizard = () => {
    const isHorizontal = configurationContext.options.horizontalWizardNav;

    const cardClassname = isHorizontal ? '' : 'flex-row p-2';
    const containerClassname = isHorizontal ? 'card-body' : 'col-10 p-0';

    return (
      <Card className={cardClassname}>
        {renderNav()}
        <div className={containerClassname}>{initComponent()}</div>
      </Card>
    );
  };

  const initComponent = () => {
    const stepData = wizardContext.getStepData();

    if (stepData.length === 0) {
      return <div className="font-italic">There are no steps in this wizard.</div>;
    }

    const step = stepData[currentStep];

    return (
      <WizardStep
        key={'step' + currentStep}
        step={step}
        onNext={onNextStep}
        onPrevious={onPreviousStep}
        stepIndex={currentStep}
        isFirstStep={currentStep === 0}
        isLastStep={currentStep === wizardContext.getStepData().length - 1}
      />
    );
  };

  if (configurationContext.options.modalView) {
    return <WizardWindow>{renderWizard()}</WizardWindow>;
  }

  return renderWizard();
};

Wizard.propTypes = {
  start: PropTypes.number,
  enableForwardSkip: PropTypes.bool // Whether to allow forward step skipping
};

export default Wizard;
