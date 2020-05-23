import React, { useState } from 'react';
import { Alert, Button, ButtonToolbar, Card } from 'react-bootstrap';
import JsonLdUtils from 'jsonld-utils';
import PropTypes from 'prop-types';
import * as Constants from '../../constants/Constants';
import HelpIcon from '../HelpIcon';
import { WizardContext } from '../../contexts/WizardContext';
import GeneratedStep from '../GeneratedStep';
import { ConfigurationContext } from '../../contexts/ConfigurationContext';

const WizardStep = (props) => {
  const wizardContext = React.useContext(WizardContext);
  const { options } = React.useContext(ConfigurationContext);

  const [advanceDisabled, setAdvanceDisabled] = useState(
    props.step.defaultNextDisabled != null ? props.step.defaultNextDisabled : false
  );
  const [retreatDisabled, setRetreatDisabled] = useState(false);
  const [currentError, setCurrentError] = useState(null);

  const onAdvance = (err) => {
    if (err) {
      setAdvanceDisabled(true);
      setRetreatDisabled(true);
      setCurrentError(err);
    } else {
      wizardContext.updateStepData(props.stepIndex, wizardContext.getStepData());
      props.onAdvance();
    }
  };

  const onNext = () => {
    setAdvanceDisabled(true);
    setRetreatDisabled(true);

    if (props.step.onNext) {
      props.step.onNext.apply(this, [onAdvance]);
    } else {
      wizardContext.updateStepData(props.stepIndex, wizardContext.getStepData());
      props.onAdvance();
    }
  };

  const onPrevious = () => {
    if (props.step.onPrevious) {
      props.step.onPrevious.apply(this, [props.onRetreat]);
    } else {
      props.onRetreat();
    }
  };

  const onFinish = () => {
    wizardContext.updateStepData(props.stepIndex, wizardContext.getStepData());
    props.onFinish();
  };

  const enableNext = () => setAdvanceDisabled(false);

  const disableNext = () => setAdvanceDisabled(true);

  const renderAdvanceButton = () => {
    if (!props.isLastStep) {
      return (
        <Button onClick={onNext} disabled={advanceDisabled} variant="primary" size="sm">
          {options.i18n['wizard.next']}
        </Button>
      );
    }
    return null;
  };

  const _renderHelpIcon = () => {
    const question = wizardContext.getStepData([props.stepIndex]);

    return question[Constants.HELP_DESCRIPTION] ? (
      <HelpIcon
        text={JsonLdUtils.getLocalized(question[Constants.HELP_DESCRIPTION], options.intl)}
        iconClass="help-icon-section"
      />
    ) : null;
  };

  return (
    <div className="wizard-step">
      <Card className="wizard-step-content">
        <Card.Header className="bg-info text-white" as="h6">
          {JsonLdUtils.getLocalized(props.step[JsonLdUtils.RDFS_LABEL], options.intl)}
          {_renderHelpIcon()}
        </Card.Header>
        <Card.Body>
          <GeneratedStep stepIndex={props.stepIndex} question={wizardContext.getStepData(props.stepIndex)} />
        </Card.Body>
      </Card>

      <ButtonToolbar className="m-3 float-right">
        {!props.isFirstStep && (
          <Button className="mr-2" onClick={onPrevious} disabled={retreatDisabled} variant="primary" size="sm">
            {options.i18n['wizard.previous']}
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
  step: PropTypes.object.isRequired,
  onFinish: PropTypes.func.isRequired,
  onAdvance: PropTypes.func,
  onRetreat: PropTypes.func,
  stepIndex: PropTypes.number.isRequired,
  isFirstStep: PropTypes.bool,
  isLastStep: PropTypes.bool
};

export default WizardStep;