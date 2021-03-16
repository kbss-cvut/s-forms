import React from 'react';
import { Accordion, Card, Form } from 'react-bootstrap';
import JsonLdUtils from 'jsonld-utils';
import Constants from '../constants/Constants';
import FormUtils from '../util/FormUtils';
import Question from './Question';
import classNames from 'classnames';
import { ConfigurationContext } from '../contexts/ConfigurationContext';
import JsonldUtils from 'jsonld-utils';

export default class QuestionWithAdvanced extends Question {

  constructor(props) {
    super(props);

    this.state.showAdvanced = this._getShowAdvancedState();
  }

  onSubQuestionChange = (subQuestionIndex, change) => {
    this._onChange(Constants.HAS_SUBQUESTION, subQuestionIndex, change);
  };

  componentDidMount() {
    super.componentDidMount();

    let { index, question } = this._getShowAdvancedQuestion();
    if (question[Constants.LAYOUT_CLASS] !== Constants.LAYOUT.HIDDEN) {
      question[Constants.LAYOUT_CLASS] = Constants.LAYOUT.HIDDEN;
      this._onChange(Constants.HAS_SUBQUESTION, index, question);
    }
  }

  _getShowAdvancedQuestion() {
    const question = this.props.question;
    let subQuestions = question[Constants.HAS_SUBQUESTION];
    if (subQuestions && subQuestions.length) {
      for (let i = 0; i < subQuestions.length; i++) {
        if (JsonLdUtils.hasValue(subQuestions[i], Constants.SHOW_ADVANCED_QUESTION, true)) {
          return { index: i, question: subQuestions[i] };
        }
      }
    }
    return null;
  }

  _getShowAdvancedState() {
    let { question } = this._getShowAdvancedQuestion();

    let value = false;

    if (question[Constants.HAS_ANSWER] && question[Constants.HAS_ANSWER].length) {
      let answer = question[Constants.HAS_ANSWER][0];
      if (answer[Constants.HAS_DATA_VALUE]) {
        value = !!answer[Constants.HAS_DATA_VALUE]['@value'];
      }
    }

    return value;
  }

  _toggleAdvanced = (e) => {
    e.stopPropagation();

    let { index, question } = this._getShowAdvancedQuestion();

    let value = this._getShowAdvancedState();

    console.log(question);

    question[Constants.HAS_ANSWER] = [{}];
    question[Constants.HAS_ANSWER][0][Constants.HAS_DATA_VALUE] = { '@value': !value }
    question[Constants.HAS_VALID_ANSWER] = true;

    this.state.showAdvanced = !value;

    this._onChange(Constants.HAS_SUBQUESTION, index, question);
  };

  render() {
    const question = this.props.question;

    if (FormUtils.isHidden(question)) {
      return null;
    }

    if (!FormUtils.isRelevant(question)) {
      return null;
    }

    const { collapsible, withoutCard } = this.props;
    const categoryClass = Question._getQuestionCategoryClass(question);

    if (withoutCard) {
      return <div>{this._renderQuestionContent()}</div>;
    }
    const label = JsonLdUtils.getLocalized(question[JsonLdUtils.RDFS_LABEL], this.context.options.intl);

    const cardBody = (
      <Card.Body className={classNames('p-3', categoryClass)}>{this._renderQuestionContent()}</Card.Body>
    );

    const headerClassName = classNames(
      FormUtils.isEmphasised(question) ? Question.getEmphasizedClass(question) : 'bg-info',
      collapsible ? 'cursor-pointer' : ''
    );

    const showAdvancedQuestion = this._getShowAdvancedQuestion(question).question;
    const advancedQuestionLabel = JsonldUtils.getLocalized(showAdvancedQuestion[Constants.RDFS_LABEL], this.context.options.intl);

    return (
      <Accordion defaultActiveKey={!this.state.expanded ? label : undefined}>
        <Card className="mb-3">
          <Accordion.Toggle as={Card.Header} onClick={this._toggleCollapse} className={headerClassName}>
            <h6 className="d-inline" id={question['@id']}>
              {collapsible && this._renderCollapseToggle()}
              {label}
            </h6>

            <Form.Switch
              onChange={this._toggleAdvanced}
              id={'--switch-' + showAdvancedQuestion['@id']}
              label={advancedQuestionLabel}
              checked={this.state.showAdvanced}
              inline
              style={{float: 'right'}}
            />

            {this._renderQuestionHelp()}
          </Accordion.Toggle>
          {collapsible ? <Accordion.Collapse>{cardBody}</Accordion.Collapse> : { cardBody }}

        </Card>
      </Accordion>
    );
  }

}

QuestionWithAdvanced.contextType = ConfigurationContext;
