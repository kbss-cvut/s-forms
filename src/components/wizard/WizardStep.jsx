import React from 'react';
import { Button, ButtonToolbar, Card } from 'react-bootstrap';
import JsonLdUtils from 'jsonld-utils';
import PropTypes from 'prop-types';
import Constants from '../../constants/Constants';
import HelpIcon from '../HelpIcon';
import { FormQuestionsContext } from '../../contexts/FormQuestionsContext';
import Question from '../Question';
import ComponentRegistry from '../../util/ComponentRegistry';


export default class WizardStep extends React.Component {

  constructor(props) {
    super(props);
  }

  onNextStep = () => {
    this.context.updateFormQuestionsData(this.props.stepIndex, this.context.getFormQuestionsData());
    this.props.onNextStep();
  };

  onPreviousStep = () => {
    this.props.onPreviousStep();
  };

  _renderHelpIcon = () => {
    const question = this.context.getFormQuestionsData([this.props.stepIndex]);

    return question[Constants.HELP_DESCRIPTION] ? (
      <HelpIcon
        text={JsonLdUtils.getLocalized(question[Constants.HELP_DESCRIPTION], this.props.options.intl)}
        iconClass="help-icon-section"
      />
    ) : null;
  };

  _renderWizardStepButtons = () => {
    return (
      <ButtonToolbar className="m-3 float-right">
        {!this.props.isFirstStep && (
          <Button className="mr-2" onClick={this.onPreviousStep} variant="primary" size="sm">
            {this.props.options.i18n['wizard.previous']}
          </Button>
        )}
        {!this.props.isLastStep && (
          <Button onClick={this.onNextStep} variant="primary" size="sm">
            {this.props.options.i18n['wizard.next']}
          </Button>
        )}
      </ButtonToolbar>
    );
  };

  onChange = (index, change) => {
    this.context.updateFormQuestionsData(this.props.stepIndex || index, { ...this.props.step, ...change });
  };

  render() {

    const categoryClass = Question._getQuestionCategoryClass(this.props.step);

    let questionComponent = ComponentRegistry.mapQuestion(this.props.step, 0);
    let questionElement = React.createElement(questionComponent, {
      question: this.props.step,
      onChange: this.onChange,
      withoutCard: true,
      index: this.props.stepIndex
    });

    return (
      <div className="wizard-step">
        <Card className="wizard-step-content">
          <Card.Header className="bg-primary text-white" as="h6" id={this.props.step['@id']}>
            {JsonLdUtils.getLocalized(this.props.step[JsonLdUtils.RDFS_LABEL], this.props.options.intl)}
            {this._renderHelpIcon()}
          </Card.Header>
          <Card.Body className={categoryClass}>
            {questionElement}
          </Card.Body>
        </Card>

        {this.props.options.wizardStepButtons && this._renderWizardStepButtons()}
      </div>
    );


  }

}

WizardStep.contextType = FormQuestionsContext;

WizardStep.propTypes = {
  options: PropTypes.object.isRequired,
  step: PropTypes.object.isRequired,
  onNextStep: PropTypes.func,
  onPreviousStep: PropTypes.func,
  stepIndex: PropTypes.number.isRequired,
  isFirstStep: PropTypes.bool,
  isLastStep: PropTypes.bool
};