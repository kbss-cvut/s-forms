import React from "react";
import { Button, ButtonToolbar } from "react-bootstrap";
import JsonLdUtils from "jsonld-utils";
import { FormQuestionsContext } from "../../contexts/FormQuestionsContext";
import Question from "../Question";

export default class WizardStep extends React.Component {
  constructor(props) {
    super(props);
  }

  onNextStep = () => {
    this.context.updateFormQuestionsData(
      this.props.index,
      this.context.getFormQuestionsData()
    );
    this.props.onNextStep();
  };

  onPreviousStep = () => {
    this.props.onPreviousStep();
  };

  _renderWizardStepButtons = () => {
    return (
      <ButtonToolbar className="m-3 float-right">
        {!this.props.isFirstStep && (
          <Button
            className="mr-2"
            onClick={this.onPreviousStep}
            variant="primary"
            size="sm"
          >
            {this.props.options.i18n["wizard.previous"]}
          </Button>
        )}
        {!this.props.isLastStep && (
          <Button onClick={this.onNextStep} variant="primary" size="sm">
            {this.props.options.i18n["wizard.next"]}
          </Button>
        )}
      </ButtonToolbar>
    );
  };

  onChange = (index, change) => {
    this.context.updateFormQuestionsData(this.props.index || index, {
      ...this.props.question,
      ...change,
    });
  };

  render() {
    const question = this.context.getFormQuestionsData([this.props.index]);

    return (
      <React.Fragment>
        <Question question={question} onChange={this.onChange} />
        {JsonLdUtils.getLocalized(
          this.props.question[JsonLdUtils.RDFS_LABEL],
          this.props.options.intl
        )}
        {this.props.options.wizardStepButtons &&
          this._renderWizardStepButtons()}
      </React.Fragment>
    );
  }
}

WizardStep.contextType = FormQuestionsContext;
