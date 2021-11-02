import React from 'react';
import {Button, ButtonToolbar, Card, Col, Row} from 'react-bootstrap';
import JsonLdUtils from 'jsonld-utils';
import PropTypes from 'prop-types';
import Constants from '../../constants/Constants';
import { FormQuestionsContext } from '../../contexts/FormQuestionsContext';
import Question from '../Question';
import QuestionCommentIcon from "../comment/QuestionCommentIcon";
import JsonLdObjectMap from "../../util/JsonLdObjectMap";
import IconList from "../IconList";


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

  _renderQuestionComment = () => {
    const question = this.context.getFormQuestionsData([this.props.stepIndex]);
    const comments = this.props.options.questionComments;

    if (comments === "enable") {
      return <QuestionCommentIcon
                question={question}
                onChange={this.onCommentChange}/>
    } else return null;
  }

  onCommentChange = (commentIndex, change) => {
    this._onChange(Constants.HAS_COMMENT, commentIndex, change)
  }

  _onChange(att, valueIndex, newValue) {
    let newState = { ...this.props.step};
    newState[att][valueIndex] = newValue;

    JsonLdObjectMap.putObject(newState['@id'], newState);
    this.onChange(this.props.index, newState);
  }

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

  _renderIcons = () => {
    const question = this.context.getFormQuestionsData([this.props.stepIndex]);
    const intl = this.props.options.intl;

    const renderQuestionHelp = Question._renderQuestionHelp(question, intl);
    const renderQuestionComment = this._renderQuestionComment();

    return (
        <IconList>
          {renderQuestionHelp}
          {renderQuestionComment}
        </IconList>
    );
  }

  render() {

    const categoryClass = Question._getQuestionCategoryClass(this.props.step);

    let questionComponent = this.props.mapComponent(this.props.step, Question);
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
            <Row>
              <Col className="no-padding-right" lg="auto">{JsonLdUtils.getLocalized(this.props.step[JsonLdUtils.RDFS_LABEL], this.props.options.intl)}</Col>
              {this._renderIcons()}
            </Row>
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
  mapComponent: PropTypes.func,
  stepIndex: PropTypes.number.isRequired,
  isFirstStep: PropTypes.bool,
  isLastStep: PropTypes.bool
};
