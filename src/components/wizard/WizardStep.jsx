import React, { useContext } from "react";
import { Button, ButtonToolbar } from "react-bootstrap";
import { FormQuestionsContext } from "../../contexts/FormQuestionsContext";
import Question from "../Question";
import PropTypes from "prop-types";
import FormUtils from "../../util/FormUtils.js";
import { useIntl } from "react-intl";

const WizardStep = (props) => {
  const { updateFormQuestionsData, getFormQuestionsData } =
    useContext(FormQuestionsContext);
  const intl = useIntl();

  const onNextStep = () => {
    updateFormQuestionsData(props.index, getFormQuestionsData());
    props.onNextStep();
  };

  const onPreviousStep = () => {
    props.onPreviousStep();
  };

  const _renderWizardStepButtons = () => {
    return (
      <ButtonToolbar className="m-3 float-right">
        {!props.isFirstStep && (
          <Button
            className="mr-2"
            onClick={onPreviousStep}
            variant="primary"
            size="sm"
          >
            {intl.formatMessage({ id: "wizard.previous" })}
          </Button>
        )}
        {!props.isLastStep && (
          <Button onClick={onNextStep} variant="primary" size="sm">
            {intl.formatMessage({ id: "wizard.next" })}
          </Button>
        )}
      </ButtonToolbar>
    );
  };

  const onChange = (index, change) => {
    updateFormQuestionsData(props.index || index, {
      ...props.question,
      ...change,
    });
  };

  const question = getFormQuestionsData([props.index]);

  return (
    <React.Fragment>
      <Question
        question={question}
        onChange={onChange}
        collapsible={FormUtils.isAnswerable(question)}
      />
      {props.options.wizardStepButtons && _renderWizardStepButtons()}
    </React.Fragment>
  );
};

WizardStep.propTypes = {
  options: PropTypes.object.isRequired,
  question: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  onNextStep: PropTypes.func,
  onPreviousStep: PropTypes.func,
  mapComponent: PropTypes.func,
  isFirstStep: PropTypes.bool,
  isLastStep: PropTypes.bool,
};

export default WizardStep;
