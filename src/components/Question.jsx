import React from 'react';
import { Accordion, Card } from 'react-bootstrap';
import JsonLdUtils from 'jsonld-utils';
import PropTypes from 'prop-types';
import Answer from './Answer';
import Constants from '../constants/Constants';
import FormUtils from '../util/FormUtils';
import HelpIcon from './HelpIcon';
import JsonLdObjectMap from '../util/JsonLdObjectMap';
import QuestionAnswerProcessor from '../model/QuestionAnswerProcessor';
import ValidatorFactory from '../model/ValidatorFactory';
import JsonLdObjectUtils from '../util/JsonLdObjectUtils';
import PrefixIcon from './PrefixIcon';
import MediaContent from './MediaContent';
import { CaretSquareDown, CaretSquareUp, InfoCircle } from '../styles/icons';
import { ConfigurationContext } from '../contexts/ConfigurationContext';
import classNames from 'classnames';

// TODO Remove once the pretty layout is tested
const PRETTY_ANSWERABLE_LAYOUT = false;

export default class Question extends React.Component {
  constructor(props) {
    super(props);
    JsonLdObjectMap.putObject(props.question['@id'], props.question);
    this.state = {
      validator: null,
      expanded: !FormUtils.isCollapsed(props.question)
    };
  }

  componentDidMount() {
    this.setState({ validator: ValidatorFactory.createValidator(this.props.question, this.context.options.intl) });
  }

  onAnswerChange = (answerIndex, change) => {
    this._onChange(Constants.HAS_ANSWER, answerIndex, change);

    const question = this.props.question;
    if (JsonLdUtils.getJsonAttValue(question, Constants.COMPOSITE_PATTERN)) {
      this._updateExpandedParts(change);
    }
  };

  onSubQuestionChange = (subQuestionIndex, change) => {
    this._onChange(Constants.HAS_SUBQUESTION, subQuestionIndex, change);

    const question = this.props.question;
    if (JsonLdUtils.getJsonAttValue(question, Constants.COMPOSITE_PATTERN)) {
      this._updateCollapsedComposite();
    }
  };

  _updateExpandedParts() {
    const question = this.props.question;
    const subQuestions = this._getSubQuestions();

    const patternVariables = question[Constants.COMPOSITE_VARIABLES];

    let regex = new RegExp(question[Constants.PATTERN]);
    /**
     * @var {string} value
     */
    let value = question[Constants.HAS_ANSWER][0][Constants.HAS_DATA_VALUE]['@value'];
    let match = value.match(regex);

    if (match) {

      for (let i = 1; i < match.length; i++) {
        let subValue = match[i];
        if (!subValue) {
          subValue = '';
        }

        let id = patternVariables[i - 1];
        let subQuestion = this._findById(subQuestions, id);

        subQuestion[Constants.HAS_ANSWER][0][Constants.HAS_DATA_VALUE] = {
          '@value': subValue.trim()
        }
      }

    } else {
      subQuestions.forEach(subQuestion => {
        subQuestion[Constants.HAS_ANSWER][0][Constants.HAS_DATA_VALUE] = {
          '@value': ''
        }
      });
    }

  }

  _findById(arr, id) {
    return arr.find(el => el['@id'] === id);
  }

  _updateCollapsedComposite() {
    const question = this.props.question;
    const subQuestions = this._getSubQuestions();

    /**
     * @var {string} compositePattern
     */
    let compositePattern = question[Constants.COMPOSITE_PATTERN];
    const patternVariables = question[Constants.COMPOSITE_VARIABLES];

    for (let i = patternVariables.length; i >= 1; i--) {

      let id = patternVariables[i - 1];
      let subQuestion = this._findById(subQuestions, id);

      let val = subQuestion[Constants.HAS_ANSWER][0][Constants.HAS_DATA_VALUE]['@value'];
      if (!val) {
        val = '';
      }

      compositePattern = compositePattern.replace('?' + i, val.trim());
    }

    let change = {};
    change[Constants.HAS_DATA_VALUE] = {'@value': compositePattern.trim()}
    this._onChange(Constants.HAS_ANSWER, 0, change);
  }

  _onChange(att, valueIndex, newValue) {
    let newState = { ...this.props.question };
    newState[att][valueIndex] = newValue;
    if (att === Constants.HAS_ANSWER) {
      const result = this.state.validator(newValue);
      newState = { ...newState, ...result };
    }

    JsonLdObjectMap.putObject(newState['@id'], newState);
    this.props.onChange(this.props.index, newState);
  }

  _toggleCollapse = () => {
    if (this.props.collapsible) {
      this.setState({ expanded: !this.state.expanded });
    }
  };

  render() {
    const question = this.props.question;
    if (FormUtils.isHidden(question)) {
      return null;
    }
    if (!FormUtils.isRelevant(question)) {
      return null;
    }
    if (FormUtils.isAnswerable(question)) {
      if (PRETTY_ANSWERABLE_LAYOUT) {
        return (
          <div id={question['@id']}>
            <div className="panel-title answerable-question">{this.renderAnswers()}</div>
            <div className="answerable-subquestions">{this.renderSubQuestions()}</div>
          </div>
        );
      } else {
        return (
          <div id={question['@id']}>
            {this.renderAnswers()}
            <div className="ml-4 mt-n2">{this.renderSubQuestions()}</div>
          </div>
        );
      }
    }

    if (JsonLdUtils.getJsonAttValue(question, Constants.COMPOSITE_PATTERN)) {
      return (
        <Card className="mb-3">
          <div className="p-3">
            {this.renderAnswers()}
            <div className="p-3">
              {this.renderSubQuestions()}
            </div>
          </div>
        </Card>
      );
    }

    if (FormUtils.isSection(question)) {
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

      // TODO change defaultActiveKey to label when expanded + add eventKey to Accordion.Collapse
      return (
        <Accordion defaultActiveKey={!this.state.expanded ? label : undefined}>
          <Card className="mb-3">
            <Accordion.Toggle as={Card.Header} onClick={this._toggleCollapse} className={headerClassName}>
              <h6 className="d-inline" id={question['@id']}>
                {collapsible && this._renderCollapseToggle()}
                {label}
              </h6>
              {this._renderQuestionHelp()}
            </Accordion.Toggle>
            {collapsible ? <Accordion.Collapse>{cardBody}</Accordion.Collapse> : { cardBody }}
          </Card>
        </Accordion>
      );
    } else {
      return <div>{this._renderQuestionContent()}</div>;
    }
  }

  _renderQuestionContent() {
    let content = [];
    if (this.state.expanded) {
      content.push(<MediaContent key={this.props.question['@id'] + '-media'} question={this.props.question} />);
    }
    content.push(this.renderAnswers());
    content.push(this.renderSubQuestions());
    return content;
  }

  renderAnswers() {
    const question = this.props.question,
      children = [],
      answers = this._getAnswers();
    let row = [],
      cls,
      isTextarea;

    for (let i = 0, len = answers.length; i < len; i++) {
      isTextarea =
        FormUtils.isTextarea(question, FormUtils.resolveValue(answers[i])) ||
        FormUtils.isSparqlInput(question) ||
        FormUtils.isTurtleInput(question);
      cls = classNames(Question._getAnswerClass(isTextarea), Question._getQuestionCategoryClass(question));


      row.push(
        <div key={'row-item-' + i} className={cls} id={question['@id']}>
          <div className="row">
            <div className="col-10">
              <Answer index={i} answer={answers[i]} question={question} onChange={this.onAnswerChange} />
            </div>
            <div>
              {this._renderUnits()}
              {this._renderQuestionHelp()}
              {this._renderPrefixes()}
            </div>
          </div>
        </div>
      );
      if (row.length === Constants.GENERATED_ROW_SIZE || isTextarea) {
        children.push(
          <div className="row" key={'question-row-' + i}>
            {row}
          </div>
        );
        row = [];
      }
    }
    if (row.length > 0) {
      children.push(
        <div className="row" key={'question-row-' + i}>
          {row}
        </div>
      );
    }
    return children;
  }

  _getAnswers() {
    const question = this.props.question;
    if (!question[Constants.HAS_ANSWER]) {
      question[Constants.HAS_ANSWER] = [];
    }
    if (!Array.isArray(question[Constants.HAS_ANSWER])) {
      question[Constants.HAS_ANSWER] = [question[Constants.HAS_ANSWER]];
    }
    if (question[Constants.HAS_ANSWER].length === 0) {
      if ((FormUtils.isSection(question) && !FormUtils.isAnswerable(question)) || FormUtils.isWizardStep(question)) {
        question[Constants.HAS_ANSWER] = [];
      } else {
        question[Constants.HAS_ANSWER] = [QuestionAnswerProcessor.generateAnswer(question)];
      }
    }
    return question[Constants.HAS_ANSWER];
  }

  static _getAnswerClass(isTextarea) {
    return isTextarea
      ? 'col-12'
      : Constants.GENERATED_ROW_SIZE === 1
      ? 'col-6'
      : 'col-' + Constants.COLUMN_COUNT / Constants.GENERATED_ROW_SIZE;
  }

  static _getQuestionCategoryClass(question) {
    const layoutCategory = FormUtils.getCategory(question);
    return layoutCategory ? 'question-' + layoutCategory : '';
  }

  static getEmphasizedClass(question) {
    return FormUtils.isEmphasised(question) ? 'bg-warning' : '';
  }

  _renderCollapseToggle() {
    const { options } = this.context;

    const title = this.state.expanded ? options.i18n['section.collapse'] : options.i18n['section.expand'];

    return (
      <span onClick={this._toggleCollapse} title={title}>
        {this.state.expanded ? <CaretSquareUp title={title} /> : <CaretSquareDown title={title} />}
      </span>
    );
  }

  _renderQuestionHelp() {
    const question = this.props.question;
    let helpClass = FormUtils.isCheckbox(question) ? 'help-icon-checkbox' : 'help-icon-text-input';
    if (FormUtils.isSection(question)) {
      helpClass = 'help-icon-section';
    }
    return question[Constants.HELP_DESCRIPTION] ? (
      <HelpIcon
        text={JsonLdUtils.getLocalized(question[Constants.HELP_DESCRIPTION], this.context.options.intl)}
        iconClassContainer={helpClass}
      />
    ) : null;
  }

  _renderPrefixes() {
    const question = this.props.question;
    return question[Constants.HAS_DECLARED_PREFIX] && question[Constants.HAS_DECLARED_PREFIX].length ? (
      <PrefixIcon prefixes={question[Constants.HAS_DECLARED_PREFIX]} iconClass={'help-icon-checkbox'}>
        <InfoCircle />
      </PrefixIcon>
    ) : null;
  }

  _renderUnits() {
    const question = this.props.question;
    return question[Constants.HAS_UNIT] ? <div className="has-unit-label">{question[Constants.HAS_UNIT]}</div> : null;
  }

  renderSubQuestions() {
    const children = [];
    const subQuestions = this._getSubQuestions();

    for (let i = 0; i < subQuestions.length; i++) {
      children.push(
        <Question key={'sub-question-' + i} index={i} question={subQuestions[i]} onChange={this.onSubQuestionChange} />
      );
    }
    return children;
  }

  _getSubQuestions() {
    const question = this.props.question;
    if (!question[Constants.HAS_SUBQUESTION]) {
      question[Constants.HAS_SUBQUESTION] = [];
    }
    if (!Array.isArray(question[Constants.HAS_SUBQUESTION])) {
      question[Constants.HAS_SUBQUESTION] = [question[Constants.HAS_SUBQUESTION]];
    }

    // sort by label
    JsonLdObjectUtils.orderByLocalizedLabels(question[Constants.HAS_SUBQUESTION], this.context.options.intl);

    // sort by property
    JsonLdObjectUtils.orderPreservingToplogicalSort(
      question[Constants.HAS_SUBQUESTION],
      Constants.HAS_PRECEDING_QUESTION
    );

    return question[Constants.HAS_SUBQUESTION];
  }
}

Question.contextType = ConfigurationContext;

Question.propTypes = {
  question: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  index: PropTypes.number,
  withoutCard: PropTypes.bool,
  collapsible: PropTypes.bool // Whether the section is collapsible (if the question is a section)
};

Question.defaultProps = {
  withoutCard: false,
  collapsible: true
};
