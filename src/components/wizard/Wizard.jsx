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

  const onAdvance = () => {
    if (currentStep !== wizardContext.getStepData().length - 1) {
      wizardContext.getStepData()[currentStep + 1].visited = true;
      setCurrentStep((prevCurrentStep) => prevCurrentStep + 1);
    }
  };

  const onRetreat = () => {
    if (currentStep === 0) {
      return;
    }
    setCurrentStep((prevCurrentStep) => prevCurrentStep - 1);
  };

  const onFinish = (errCallback) => {
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
  const onInsertStepAfterCurrent = (step) => {
    configurationContext.getStepData().splice(currentStep + 1, 0, step);
    configurationContext.insertStep(currentStep + 1, step);
  };

  /**
   * Adds the specified step to the end of this wizard.
   * @param step The step to add
   */
  const onAddStep = (step) => {
    wizardContext.getStepData().push(step);
    wizardContext.insertStep(wizardContext.getStepData().length - 1, step);
  };

  const onRemoveStep = (stepId) => {
    const stepData = wizardContext.getStepData();

    for (let i = 0; i < stepData.length; i++) {
      if (stepData[i].id === stepId) {
        wizardContext.getStepData().splice(i, 1);
        wizardContext.removeStep(i);
        if (i === currentStep && i !== 0) {
          setCurrentStep((prevCurrentStep) => prevCurrentStep - 1);
        }
        break;
      }
    }
  };

  const navigate = (stepIndex) => {
    if (stepIndex === currentStep || stepIndex >= wizardContext.getStepData().length) {
      return;
    }
    // Can we jump forward?
    if (stepIndex > currentStep && !wizardContext.getStepData()[stepIndex].visited && !props.enableForwardSkip) {
      return;
    }
    setCurrentStep(stepIndex);
  };

  const renderNav = () => {
    if (wizardContext.getStepData().length <= 1) {
      return null;
    }

    return configurationContext.options.horizontalWizardNav ? (
      <HorizontalWizardNav currentStep={currentStep} steps={wizardContext.getStepData()} onNavigate={navigate} />
    ) : (
      <VerticalWizardNav currentStep={currentStep} steps={wizardContext.getStepData()} onNavigate={navigate} />
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
        onFinish={onFinish}
        onAdvance={onAdvance}
        onRetreat={onRetreat}
        onInsertStepAfterCurrent={onInsertStepAfterCurrent}
        onAddStep={onAddStep}
        onRemoveStep={onRemoveStep}
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
  onFinish: PropTypes.func,
  onClose: PropTypes.func,
  enableForwardSkip: PropTypes.bool // Whether to allow forward step skipping
};

export default Wizard;
