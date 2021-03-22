import React, { useEffect } from 'react';
import { Card } from 'react-bootstrap';
import WizardStep from './WizardStep';
import HorizontalWizardNav from './HorizontalWizardNav';
import VerticalWizardNav from './VerticalWizardNav';
import { ConfigurationContext } from '../../contexts/ConfigurationContext';
import { FormQuestionsContext } from '../../contexts/FormQuestionsContext';
import Utils from '../../util/Utils';
import Constants from '../../constants/Constants';
import ComponentRegistry from '../../util/ComponentRegistry';

const findStepByQuestionId = (stepData, id) => {
  const findQuestionTraversal = (question, index) => {
    if (!question) {
      return -1;
    }

    if (question['@id'] === id) {
      return index;
    }

    const subQuestions = Utils.asArray(question[Constants.HAS_SUBQUESTION]);

    return subQuestions.findIndex((q, index) => findQuestionTraversal(q, index) !== -1);
  };

  return stepData.findIndex((step, index) => findQuestionTraversal(step, index) !== -1);
};

const Wizard = () => {
  const formQuestionsContext = React.useContext(FormQuestionsContext);
  const { options } = React.useContext(ConfigurationContext);

  let startingStep = 0;
  if (options.startingQuestionId) {
    startingStep = findStepByQuestionId(formQuestionsContext.getFormQuestionsData(), options.startingQuestionId);

    if (startingStep === -1) {
      console.warn(`Question with id ${options.startingQuestionId} not found!`);
      startingStep = 0;
    }
  } else if (options.startingStep) {
    startingStep = options.startingStep < formQuestionsContext.getFormQuestionsData().length ? options.startingStep : 0;
  }

  const [currentStep, setCurrentStep] = React.useState(startingStep);

  const [scrolledToStartingQuestionId, setScrolledToStartingQuestionId] = React.useState(false);

  useEffect(() => {
    if (options.startingQuestionId && !scrolledToStartingQuestionId) {
      const element = document.getElementById(options.startingQuestionId);
      if (element) {
        element.scrollIntoView();
        element.classList.add('text-danger');
        setScrolledToStartingQuestionId(true);
      }
    }
  });

  const onNextStep = () => {
    const stepData = formQuestionsContext.getFormQuestionsData();
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
    const stepData = formQuestionsContext.getFormQuestionsData();

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
    const formQuestionsData = formQuestionsContext.getFormQuestionsData();

    return options.horizontalWizardNav ? (
      <HorizontalWizardNav currentStep={currentStep} steps={formQuestionsData} onNavigate={navigate} />
    ) : (
      <VerticalWizardNav currentStep={currentStep} steps={formQuestionsData} onNavigate={navigate} />
    );
  };

  const initComponent = () => {
    const stepData = formQuestionsContext.getFormQuestionsData();

    const step = stepData[currentStep];

    let stepComponent = ComponentRegistry.mapWizardStep(step);
    return React.createElement(stepComponent, {
      options: options,
      key: 'step' + currentStep,
      step: step,
      onNextStep: onNextStep,
      onPreviousStep: onPreviousStep,
      stepIndex: currentStep,
      isFirstStep: currentStep === 0,
      isLastStep: currentStep === formQuestionsContext.getFormQuestionsData().length - 1
    });
  };

  let nav = null;
  if (formQuestionsContext.getFormQuestionsData().length > 1) {
    nav = renderNav();
  }

  const isHorizontal = options.horizontalWizardNav;
  const cardClassname = isHorizontal ? '' : 'flex-row p-3';
  const containerClassname = isHorizontal ? 'card-body p-3' : nav ? 'col-10 p-0 pl-3' : 'col-12 p-0';

  return (
    <Card className={cardClassname}>
      {nav}
      <div className={containerClassname}>{initComponent()}</div>
    </Card>
  );
};

export default Wizard;
