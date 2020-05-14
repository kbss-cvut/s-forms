import React, { useState } from 'react';
import { Alert, Button, ButtonToolbar, Card } from 'react-bootstrap';
import * as Constants from '../../constants/Constants';
import HelpIcon from '../HelpIcon';
import JsonLdUtils from 'jsonld-utils';
import PropTypes from 'prop-types';
import { WizardContext } from '../../contexts/WizardContext';
import { FormGenContext } from '../../contexts/FormGenContext';
import Configuration from '../../model/Configuration';

const WizardStep = (props) => {
  const generatedStep = React.createRef();
  const wizardContext = React.useContext(WizardContext);
  const formGenContext = React.useContext(FormGenContext);

  const [advanceDisabled, setAdvanceDisabled] = useState(
    props.defaultNextDisabled != null ? props.defaultNextDisabled : false
  );
  const [retreatDisabled, setRetreatDisabled] = useState(false);
  const [currentError, setCurrentError] = useState(null);

  const onAdvance = (err) => {
    if (err) {
      setAdvanceDisabled(true);
      setRetreatDisabled(true);
      setCurrentError(err);
    } else {
      wizardContext.updateStepData(props.stepIndex, getStepData());
      props.onAdvance();
    }
  };

  const getStepData = () => {
    return generatedStep.current.getData ? generatedStep.current.getData() : null;
  };

  const onNext = () => {
    setAdvanceDisabled(true);
    setRetreatDisabled(true);

    if (props.onNext) {
      props.onNext.apply(this, [onAdvance]);
    } else {
      wizardContext.updateStepData(props.stepIndex, getStepData());
      props.onAdvance();
    }
  };

  const onPrevious = () => {
    if (props.onPrevious) {
      props.onPrevious.apply(this, [props.onRetreat]);
    } else {
      props.onRetreat();
    }
  };

  const onFinish = () => {
    wizardContext.updateStepData(props.stepIndex, getStepData());
    props.onFinish();
  };

  const enableNext = () => setAdvanceDisabled(false);

  const disableNext = () => setAdvanceDisabled(true);

  const renderAdvanceButton = () => {
    if (!props.isLastStep) {
      return (
        <Button onClick={onNext} disabled={advanceDisabled} variant="primary" size="sm">
          {Configuration.i18n['wizard.next']}
        </Button>
      );
    }
    return null;
  };

  const renderComponent = () => {
    const PropsComponent = props.component;

    return (
      <PropsComponent
        ref={generatedStep}
        stepIndex={props.stepIndex}
        getStepData={wizardContext.getStepData}
        updateStepData={wizardContext.updateStepData}
        getOptions={formGenContext.getOptions}
        loadFormOptions={formGenContext.loadFormOptions}
      />
    );
  };

  const _renderHelpIcon = () => {
    const question = wizardContext.getStepData([props.stepIndex]);

    return question[Constants.HELP_DESCRIPTION] ? (
      <HelpIcon
        text={JsonLdUtils.getLocalized(question[Constants.HELP_DESCRIPTION], props.intl)}
        iconClass="help-icon-section"
      />
    ) : null;
  };

  return (
    <div className="wizard-step">
      <Card className="wizard-step-content">
        <Card.Header className="bg-info text-white" as="h6">
          {props.title}
          {_renderHelpIcon()}
        </Card.Header>
        <Card.Body>{renderComponent()}</Card.Body>
      </Card>

      <ButtonToolbar className="m-3 float-right">
        {!props.isFirstStep && (
          <Button className="mr-2" onClick={onPrevious} disabled={retreatDisabled} variant="primary" size="sm">
            {Configuration.i18n['wizard.previous']}
          </Button>
        )}
        {renderAdvanceButton()}
      </ButtonToolbar>
      {currentError && (
        <Alert variant="danger">
          <p>{currentError.message}</p>
        </Alert>
      )}
    </div>
  );
};

WizardStep.propTypes = {
  onClose: PropTypes.func,
  onFinish: PropTypes.func.isRequired,
  onAdvance: PropTypes.func,
  onRetreat: PropTypes.func,
  onNext: PropTypes.func,
  onPrevious: PropTypes.func,
  title: PropTypes.string,
  stepIndex: PropTypes.number.isRequired,
  isFirstStep: PropTypes.bool,
  isLastStep: PropTypes.bool,
  defaultNextDisabled: PropTypes.bool
};

export default WizardStep;
