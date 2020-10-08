import React from 'react';
import { Button, ButtonToolbar, Card } from 'react-bootstrap';
import JsonLdUtils from 'jsonld-utils';
import PropTypes from 'prop-types';
import Constants from '../../constants/Constants';
import HelpIcon from '../HelpIcon';
import { FormQuestionsContext } from '../../contexts/FormQuestionsContext';
import { ConfigurationContext } from '../../contexts/ConfigurationContext';
import Question from '../Question';

const WizardStep = (props) => {
  const formQuestionsContext = React.useContext(FormQuestionsContext);
  const { options } = React.useContext(ConfigurationContext);

  const onNextStep = () => {
    formQuestionsContext.updateFormQuestionsData(props.stepIndex, formQuestionsContext.getFormQuestionsData());
    props.onNextStep();
  };

  const onPreviousStep = () => {
    props.onPreviousStep();
  };

  const _renderHelpIcon = () => {
    const question = formQuestionsContext.getFormQuestionsData([props.stepIndex]);

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

  const onChange = (index, change) => {
    formQuestionsContext.updateFormQuestionsData(props.stepIndex || index, { ...props.step, ...change });
  };

  const categoryClass = Question._getQuestionCategoryClass(props.step);

  return (
    <div className="wizard-step">
      <Card className="wizard-step-content">
        <Card.Header className="bg-primary text-white" as="h6" id={props.step['@id']}>
          {JsonLdUtils.getLocalized(props.step[JsonLdUtils.RDFS_LABEL], options.intl)}
          {_renderHelpIcon()}
        </Card.Header>
        <Card.Body className={categoryClass}>
          <Question question={props.step} onChange={onChange} withoutCard={true} index={props.stepIndex} />
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
