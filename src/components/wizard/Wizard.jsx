import React from 'react';
import { Card } from 'react-bootstrap';
import WizardStep from './WizardStep';
import HorizontalWizardNav from './HorizontalWizardNav';
import VerticalWizardNav from './VerticalWizardNav';
import { ConfigurationContext } from '../../contexts/ConfigurationContext';
import FormWindow from '../FormWindow';
import { FormQuestionsContext } from '../../contexts/FormQuestionsContext';

const Wizard = () => {
  const wizardContext = React.useContext(FormQuestionsContext);
  const { options } = React.useContext(ConfigurationContext);

  const start = options.startingStep < wizardContext.getFormQuestionsData().length ? options.startingStep : 0;

  const [currentStep, setCurrentStep] = React.useState(start);

  const onNextStep = () => {
    const stepData = wizardContext.getFormQuestionsData();
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
    const stepData = wizardContext.getFormQuestionsData();

    if (stepIndex === currentStep || stepIndex >= stepData.length) {
      return;
    }
    // Can we jump forward?
    if (stepIndex > currentStep && !stepData[stepIndex].visited && !options.enableForwardSkip) {
      return;
    }
    setCurrentStep(stepIndex);
  };

  const renderNav = () => {
    if (wizardContext.getFormQuestionsData().length <= 1) {
      return null;
    }

    const formQuestionsData = wizardContext.getFormQuestionsData();

    return options.horizontalWizardNav ? (
      <HorizontalWizardNav currentStep={currentStep} steps={formQuestionsData} onNavigate={navigate} />
    ) : (
      <VerticalWizardNav currentStep={currentStep} steps={formQuestionsData} onNavigate={navigate} />
    );
  };

  const renderWizard = () => {
    const isHorizontal = options.horizontalWizardNav;

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
    const stepData = wizardContext.getFormQuestionsData();

    const step = stepData[currentStep];

    return (
      <WizardStep
        key={'step' + currentStep}
        step={step}
        onNextStep={onNextStep}
        onPreviousStep={onPreviousStep}
        stepIndex={currentStep}
        isFirstStep={currentStep === 0}
        isLastStep={currentStep === wizardContext.getFormQuestionsData().length - 1}
      />
    );
  };

  if (options.modalView) {
    return <FormWindow>{renderWizard()}</FormWindow>;
  }

  return renderWizard();
};

export default Wizard;
