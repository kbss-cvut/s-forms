import React from 'react';
import { Card, Accordion } from 'react-bootstrap';
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
import { CaretSquareUp, CaretSquareDown, InfoCircle } from '../styles/icons';
import { ConfigurationContext } from '../contexts/ConfigurationContext';
import classNames from 'classnames';
import QuestionCommentIcon from "./comment/QuestionCommentIcon";

// TODO Remove once the pretty layout is tested
const PRETTY_ANSWERABLE_LAYOUT = true;

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

  componentDidUpdate() {
    const question = this.props.question;

    if (FormUtils.isSection(question) && FormUtils.isAnswerable(question)) {
      const answerValue = this._getFirstAnswerValue();
      if (this.state.expanded && !answerValue) {
        // close expanded answerable section that does not have positive answer
        this.setState({ expanded: false });
      }

    }
  }

  onAnswerChange = (answerIndex, change) => {

    // is answerable section
    if (FormUtils.isSection(this.props.question)) {
      let expanded = !!FormUtils.resolveValue(change);
      this.setState({ expanded: expanded });
    }

    this._onChange(Constants.HAS_ANSWER, answerIndex, change);
  };

  onSubQuestionChange = (subQuestionIndex, change) => {
    this._onChange(Constants.HAS_SUBQUESTION, subQuestionIndex, change);
  };

  onCommentChange = (commentIndex, change) => {
    this._onChange(Constants.HAS_COMMENT, commentIndex, change)
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

      const question = this.props.question;
      if (FormUtils.isAnswerable(question) && FormUtils.isSection(question)) {

        if (!this._getFirstAnswerValue()) {
          // prevent expanding/collapsing when the checkbox is not checked
          return;
        }
      }


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
    if (FormUtils.isAnswerable(question) && !FormUtils.isSection(question)) {
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
    if (FormUtils.isSection(question)) {
      const { collapsible, withoutCard } = this.props;
      const categoryClass = Question._getQuestionCategoryClass(question);

      if (withoutCard) {
        return <div>{this._renderQuestionContent()}</div>;
      }
      const label = JsonLdUtils.getLocalized(question[JsonLdUtils.RDFS_LABEL], this.context.options.intl);

      const headerClassName = classNames(
        FormUtils.isEmphasised(question) ? Question.getEmphasizedClass(question) : 'section-background',
        collapsible ? 'cursor-pointer' : '',
        Question.getEmphasizedOnRelevantClass(question)
      );

      if (FormUtils.isAnswerable(question)) {
        return this.renderAnswerableSection();
      }

      const cardBody = (
        <Card.Body className={classNames('p-3', categoryClass)}>{this._renderQuestionContent()}</Card.Body>
      );

      // TODO change defaultActiveKey to label when expanded + add eventKey to Accordion.Collapse
      return (
          <Accordion defaultActiveKey={!this.state.expanded ? label : undefined}>
            <Card className="mb-3">
              <Accordion.Toggle as={Card.Header} onClick={this._toggleCollapse} className={headerClassName}>
                <div className="row">
                  <div className="col-sm-auto">
                    <h6 className="d-inline" id={question['@id']}>
                      {collapsible && this._renderCollapseToggle()}
                      {label}
                    </h6>
                  </div>
                  {this._renderQuestionHelp() ?
                      <>
                        <div className="col-sm-auto">
                          {this._renderQuestionHelp()}
                        </div>
                        <div className="col-sm-auto">
                          {this._renderQuestionComment()}
                        </div>
                      </>
                      : this._renderQuestionComment()}
                </div>
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

  renderAnswerableSection() {
    const question = this.props.question;
    const collapsible = this.props.collapsible;
    const categoryClass = Question._getQuestionCategoryClass(question);
    let headerClassNames = [
      FormUtils.isEmphasised(question) ? Question.getEmphasizedClass(question) : 'section-background',
      this.state.expanded ? 'section-expanded' : 'section-collapsed',
      Question.getEmphasizedOnRelevantClass(question)
    ];

    if (collapsible && this._getFirstAnswerValue()) {
      headerClassNames.push('cursor-pointer');
    }

    const cardBody = (
      <Card.Body className={classNames('p-3', categoryClass)}>{this.renderSubQuestions()}</Card.Body>
    );

    return (
      <Accordion activeKey={this.state.expanded ? question['@id'] : undefined} className="answerable-section">
        <Card className="mb-3">
          <Card.Header onClick={this._toggleCollapse} className={classNames(headerClassNames)}>
            {this.renderAnswers()}
          </Card.Header>
          {collapsible ? <Accordion.Collapse eventKey={question['@id']}>{cardBody}</Accordion.Collapse> : { cardBody }}
        </Card>
      </Accordion>
    );
  }

  renderAnswers() {
    const question = this.props.question,
      children = [],
      answers = this._getAnswers();
    let cls;
    let isTextarea;

    for (let i = 0, len = answers.length; i < len; i++) {
      isTextarea =
        FormUtils.isTextarea(question, FormUtils.resolveValue(answers[i])) ||
        FormUtils.isSparqlInput(question) ||
        FormUtils.isTurtleInput(question);
      cls = classNames(
        'answer',
        Question._getQuestionCategoryClass(question),
        Question.getEmphasizedOnRelevantClass(question)
      );
      children.push(
        <div key={'row-item-' + i} className={cls} id={question['@id']}>
          <div className="answer-content" style={this._getAnswerWidthStyle()}>
            <Answer
                index={i}
                answer={answers[i]}
                question={question}
                onChange={this.onAnswerChange}
                onCommentChange={this.onCommentChange}/>
          </div>
          {this._renderUnits()}
          {this._renderPrefixes()}
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

  _getAnswerWidthStyle() {
    const length = Number(this.props.question[Constants.HAS_INITIAL_INPUT_LENGTH]);
    if (!length) {
      return {};
    }

    return {
      flexGrow: 0,
      maxWidth: 'none',
      width: `calc(${length}ch + 1.5rem + 2px)`
    }
  }

  static _getAnswerClass(question, isTextarea) {
    let columns = isTextarea
      ? 'col-12'
      : Constants.GENERATED_ROW_SIZE === 1
      ? 'col-6'
      : 'col-' + Constants.COLUMN_COUNT / Constants.GENERATED_ROW_SIZE;

    return columns;
  }

  static _getQuestionCategoryClass(question) {
    const layoutCategory = FormUtils.getCategory(question);
    return layoutCategory ? 'question-' + layoutCategory : '';
  }

  static getEmphasizedClass(question) {
    return FormUtils.isEmphasised(question) ? 'bg-warning' : '';
  }

  static getEmphasizedOnRelevantClass(question) {
    if (JsonLdUtils.hasValue(question, Constants.LAYOUT_CLASS, Constants.LAYOUT.EMPHASISE_ON_RELEVANT)) {
      return 'emphasise-on-relevant';
    }

    return '';
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

  _renderQuestionComment() {
    return <QuestionCommentIcon
        question={this.props.question}
        onChange={this.onCommentChange}
    />
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

      let question = subQuestions[i];
      let component = this.context.mapComponent(question, Question);

      let element = React.createElement(component, {
        key: 'sub-question-' + i,
        question: question,
        onChange: this.onSubQuestionChange,
        index: i
      });

      children.push(element);
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

  _getFirstAnswerValue() {
    return FormUtils.resolveValue(this._getAnswers()[0]);
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
