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

  const onNextStep = () => {
    wizardContext.updateStepData(props.stepIndex, wizardContext.getStepData());
    props.onNextStep();
  };

  const onPreviousStep = () => {
    props.onPreviousStep();
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

  const _renderWizardStepButtons = () => {
    return (
      <ButtonToolbar className="m-3 float-right">
        {!props.isFirstStep && (
          <Button className="mr-2" onClick={onPreviousStep} variant="primary" size="sm">
            {options.i18n['wizard.previous']}
          </Button>
        )}
        {!props.isLastStep && (
          <Button onClick={onNextStep} variant="primary" size="sm">
            {options.i18n['wizard.next']}
          </Button>
        )}
      </ButtonToolbar>
    );
  };

  return (
    <div className="wizard-step">
      <Card className="wizard-step-content">
        <Card.Header className="bg-primary text-white" as="h6">
          {JsonLdUtils.getLocalized(props.step[JsonLdUtils.RDFS_LABEL], options.intl)}
          {_renderHelpIcon()}
        </Card.Header>
        <Card.Body>
          <GeneratedStep stepIndex={props.stepIndex} question={props.step} />
        </Card.Body>
      </Card>

      {options.wizardStepButtons && _renderWizardStepButtons()}
    </div>
  );
};

WizardStep.propTypes = {
  step: PropTypes.object.isRequired,
  onNextStep: PropTypes.func,
  onPreviousStep: PropTypes.func,
  stepIndex: PropTypes.number.isRequired,
  isFirstStep: PropTypes.bool,
  isLastStep: PropTypes.bool
};

export default WizardStep;
