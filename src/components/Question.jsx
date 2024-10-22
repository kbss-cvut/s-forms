import React from "react";
import { Card, Accordion } from "react-bootstrap";
import * as JsonLdUtils from "jsonld-utils";
import PropTypes from "prop-types";
import Answer from "./Answer";
import Constants from "../constants/Constants";
import FormUtils from "../util/FormUtils";
import JsonLdObjectMap from "../util/JsonLdObjectMap";
import QuestionAnswerProcessor from "../model/QuestionAnswerProcessor";
import { createValidator } from "../model/ValidatorFactory";
import JsonLdObjectUtils from "../util/JsonLdObjectUtils";
import PrefixIcon from "./PrefixIcon";
import MediaContent from "./MediaContent";
import { CaretSquareDown, CaretSquareUp, InfoCircle } from "../styles/icons";
import { ConfigurationContext } from "../contexts/ConfigurationContext";
import classNames from "classnames";
import QuestionStatic from "./QuestionStatic.jsx";
import Utils from "../util/Utils.js";

// TODO Remove once the pretty layout is tested
const PRETTY_ANSWERABLE_LAYOUT = true;

export default class Question extends React.Component {
  constructor(props) {
    super(props);
    JsonLdObjectMap.putObject(props.question["@id"], props.question);
    this.state = {
      validator: {},
      expanded: !FormUtils.isCollapsed(props.question),
      showIcon: false,
    };
  }

  componentDidMount() {
    this.setState({
      validator: createValidator(this.props.question, this.props.intl),
    });
  }

  componentDidUpdate() {
    const question = this.props.question;
    const startingQuestionId = this.context.options.startingQuestionId;
    const subQuestions = question[Constants.HAS_SUBQUESTION];
    const isSubQuestionStartingQuestionId = subQuestions.find(
      (o) => o["@id"] === startingQuestionId
    );

    if (FormUtils.isSection(question) && FormUtils.isAnswerable(question)) {
      const answerValue = this._getFirstAnswerValue();

      // Irrelevant questions are expanded if debugMode is on
      if (this.context.options.debugMode) {
        return null;
      }

      if (isSubQuestionStartingQuestionId) {
        return null;
      } else if (this.state.expanded && !answerValue) {
        // close expanded answerable section that does not have positive answer
        this.setState({ expanded: false });
      }
    }
  }

  handleAnswerChange = (answerIndex, change) => {
    if (FormUtils.isSection(this.props.question)) {
      let expanded = !!FormUtils.resolveValue(change);
      this.setState({ expanded: expanded });
    }

    this._handleChange(Constants.HAS_ANSWER, answerIndex, change);
  };

  handleSubQuestionChange = (subQuestionIndex, change) => {
    this._handleChange(Constants.HAS_SUBQUESTION, subQuestionIndex, change);
  };

  handleCommentChange = (commentIndex, change) => {
    this._handleChange(Constants.HAS_COMMENT, commentIndex, change);
  };

  _handleChange(att, valueIndex, newValue) {
    let newState = { ...this.props.question };
    newState[att][valueIndex] = newValue;
    if (att === Constants.HAS_ANSWER) {
      const result = this.state.validator(newValue);
      newState = { ...newState, ...result };
    }

    JsonLdObjectMap.putObject(newState["@id"], newState);
    this.props.onChange(this.props.index, newState);
  }

  isDebugged(question) {
    const startingQuestionId = this.context.options.startingQuestionId;

    if (FormUtils.isRelevant(question)) {
      return false;
    }
    if (this.context.options.debugMode) {
      return true;
    }

    if (startingQuestionId == null) {
      return false;
    }

    let questionById = Utils.findQuestionById(
      startingQuestionId,
      question,
      true,
      false,
      false
    );
    return !!questionById;
  }

  _toggleCollapse = () => {
    if (this.props.collapsible) {
      this.setState({ expanded: !this.state.expanded });
    }
  };

  _onEnterHandler = () => {
    this.setState({ showIcon: true });
  };

  _onLeaveHandler = () => {
    this.setState({ showIcon: false });
  };

  _getHeaderClassName = () => {
    const question = this.props.question;
    const collapsible = this.props.collapsible;

    let headerClassName = [];

    headerClassName.push(
      Question.getEmphasizedOnRelevantClass(question),
      "question-header"
    );

    if (FormUtils.isWizardStep(question))
      headerClassName.push("wizard-step bg-primary text-white");
    if (FormUtils.isEmphasised(question))
      headerClassName.push(Question.getEmphasizedClass(question));
    if (FormUtils.isSection(question))
      headerClassName.push("section-background");
    if (collapsible) headerClassName.push("cursor-pointer");
    if (this.isDebugged(question)) {
      headerClassName.push("show-irrelevant");
    }
    return headerClassName;
  };

  render() {
    const question = this.props.question;
    const questionComponent = this.renderQuestion(question);

    if (this.isDebugged(question)) {
      return <div className="show-irrelevant">{questionComponent}</div>;
    }
    if (FormUtils.isHidden(question)) {
      return null;
    }
    if (!FormUtils.isRelevant(question)) {
      return null;
    }
    return questionComponent;
  }

  renderQuestion(question) {
    if (FormUtils.isAnswerable(question) && !FormUtils.isSection(question)) {
      if (PRETTY_ANSWERABLE_LAYOUT) {
        return (
          <div id={question["@id"]}>
            <div className="panel-title answerable-question">
              {this.renderAnswers()}
            </div>
            <div className="answerable-subquestions">
              {this.renderSubQuestions()}
            </div>
          </div>
        );
      } else {
        return (
          <div id={question["@id"]}>
            {this.renderAnswers()}
            <div className="ml-4 mt-n2">{this.renderSubQuestions()}</div>
          </div>
        );
      }
    }
    if (FormUtils.isAnswerable(question)) {
      return this.renderAnswerableSection();
    }
    if (FormUtils.isSection(question)) {
      const { collapsible, withoutCard } = this.props;
      const categoryClass = Question._getQuestionCategoryClass(question);

      if (withoutCard) {
        return <div>{this._renderQuestionContent()}</div>;
      }
      const label = JsonLdUtils.getLocalized(
        question[JsonLdUtils.RDFS_LABEL],
        this.context.options.intl
      );

      const cardBody = (
        <Card.Body className={classNames("p-3", categoryClass)}>
          {this._renderQuestionContent()}
        </Card.Body>
      );

      return (
        <>
          <Accordion
            activeKey={this.state.expanded ? label : undefined}
            className="mb-3"
          >
            <Accordion.Item eventKey={label}>
              <Card className="">
                <Accordion.Button
                  as={Card.Header}
                  onClick={this._toggleCollapse}
                  className={this._getHeaderClassName()}
                  onMouseEnter={this._onEnterHandler}
                  onMouseLeave={this._onLeaveHandler}
                  onFocus={this._onEnterHandler}
                  onBlur={this._onLeaveHandler}
                >
                  <div className="d-inline" id={question["@id"]}>
                    {collapsible &&
                      !FormUtils.isWizardStep(question) &&
                      this._renderCollapseToggle()}
                    {label}
                  </div>
                  {this.renderQuestionIcons()}
                  {this.props.children}
                </Accordion.Button>
                <Accordion.Body className="p-0">
                  {collapsible ? cardBody : <>{cardBody}</>}
                </Accordion.Body>
              </Card>
            </Accordion.Item>
          </Accordion>
        </>
      );
    } else {
      return <div>{this._renderQuestionContent()}</div>;
    }
  }

  _renderQuestionContent() {
    let content = [];
    if (this.state.expanded) {
      content.push(
        <MediaContent
          key={this.props.question["@id"] + "-media"}
          question={this.props.question}
        />
      );
    }
    content.push(this.renderAnswers());
    content.push(this.renderSubQuestions());
    return content;
  }

  renderQuestionIcons() {
    const question = this.props.question;
    const options = this.context.options;
    return QuestionStatic.renderIcons(
      question,
      options,
      this.handleCommentChange,
      this.state.showIcon
    );
  }

  renderAnswerableSection() {
    const question = this.props.question;
    const collapsible = this.props.collapsible;
    const categoryClass = Question._getQuestionCategoryClass(question);

    let classname = this.getShowIrrelevantClassname(question);

    const cardBody = (
      <Card.Body className={classNames("p-3", categoryClass)}>
        {this.renderSubQuestions(classname)}
      </Card.Body>
    );
    const answerableSectionStyles = this._getHeaderClassName();

    if (this.state.expanded) answerableSectionStyles.push("text-primary");

    return (
      <Accordion
        activeKey={this.state.expanded ? question["@id"] : undefined}
        className="answerable-section"
      >
        <Card className="mb-3">
          <Card.Header
            onClick={this._toggleCollapse}
            className={answerableSectionStyles}
          >
            {this.renderAnswers()}
          </Card.Header>
          {collapsible ? (
            <Accordion.Collapse
              className={classname}
              eventKey={question["@id"]}
            >
              {cardBody}
            </Accordion.Collapse>
          ) : (
            { cardBody }
          )}
        </Card>
      </Accordion>
    );
  }

  getShowIrrelevantClassname(question) {
    const debugMode = this.context.options.debugMode;
    const startingQuestionId = this.context.options.startingQuestionId;
    const subQuestion = question[Constants.HAS_SUBQUESTION];

    if (
      (debugMode ||
        JsonLdObjectUtils.checkId(subQuestion, startingQuestionId)) &&
      !FormUtils.hasAnswer(question)
    ) {
      return "show-irrelevant";
    }
    return "";
  }

  renderAnswers() {
    const question = this.props.question,
      children = [],
      answers = this._getAnswers(),
      options = this.context.options;
    let cls;
    let isTextarea;

    for (let i = 0, len = answers.length; i < len; i++) {
      isTextarea =
        FormUtils.isTextarea(question, FormUtils.resolveValue(answers[i])) ||
        FormUtils.isSparqlInput(question) ||
        FormUtils.isTurtleInput(question);
      cls = classNames(
        "answer",
        Question._getQuestionCategoryClass(question),
        Question.getEmphasizedOnRelevantClass(question)
      );
      children.push(
        <div
          key={"row-item-" + i}
          className={cls}
          id={question["@id"]}
          onMouseEnter={this._onEnterHandler}
          onMouseLeave={this._onLeaveHandler}
          onFocus={this._onEnterHandler}
          onBlur={this._onLeaveHandler}
        >
          <div className="answer-content" style={this._getAnswerWidthStyle()}>
            <Answer
              index={i}
              answer={answers[i]}
              question={question}
              onChange={this.handleAnswerChange}
              onCommentChange={this.handleCommentChange}
              showIcon={this.state.showIcon}
            />
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
      if (FormUtils.isSection(question) && !FormUtils.isAnswerable(question)) {
        question[Constants.HAS_ANSWER] = [];
      } else {
        question[Constants.HAS_ANSWER] = [
          QuestionAnswerProcessor.generateAnswer(question),
        ];
      }
    }
    return question[Constants.HAS_ANSWER];
  }

  _getAnswerWidthStyle() {
    const length = Number(
      this.props.question[Constants.HAS_INITIAL_INPUT_LENGTH]
    );
    if (!length) {
      return {};
    }

    return {
      flexGrow: 0,
      maxWidth: "none",
      width: `calc(${length}ch + 1.5rem + 2px)`,
    };
  }

  static _getAnswerClass(question, isTextarea) {
    let columns = isTextarea
      ? "col-12"
      : Constants.GENERATED_ROW_SIZE === 1
      ? "col-6"
      : "col-" + Constants.COLUMN_COUNT / Constants.GENERATED_ROW_SIZE;

    return columns;
  }

  static _getQuestionCategoryClass(question) {
    const layoutCategory = FormUtils.getCategory(question);
    return layoutCategory ? "question-" + layoutCategory : "";
  }

  static getEmphasizedClass(question) {
    return FormUtils.isEmphasised(question) ? "bg-warning" : "";
  }

  static getEmphasizedOnRelevantClass(question) {
    if (
      JsonLdUtils.hasValue(
        question,
        Constants.LAYOUT_CLASS,
        Constants.LAYOUT.EMPHASISE_ON_RELEVANT
      )
    ) {
      return "emphasise-on-relevant";
    }

    return "";
  }

  _renderCollapseToggle() {
    const title = this.state.expanded
      ? this.props.intl.formatMessage({ id: "section.collapse" })
      : this.props.intl.formatMessage({ id: "section.expand" });

    return (
      <span onClick={this._toggleCollapse} title={title}>
        {this.state.expanded ? (
          <CaretSquareUp title={title} />
        ) : (
          <CaretSquareDown title={title} />
        )}
      </span>
    );
  }

  _renderPrefixes() {
    const question = this.props.question;
    return question[Constants.HAS_DECLARED_PREFIX] &&
      question[Constants.HAS_DECLARED_PREFIX].length ? (
      <PrefixIcon
        prefixes={question[Constants.HAS_DECLARED_PREFIX]}
        iconClass={"help-icon-checkbox"}
      >
        <InfoCircle />
      </PrefixIcon>
    ) : null;
  }

  _renderUnits() {
    const question = this.props.question;
    return question[Constants.HAS_UNIT] ? (
      <div className="has-unit-label">{question[Constants.HAS_UNIT]}</div>
    ) : null;
  }

  renderSubQuestions(classname) {
    const children = [];
    const subQuestions = this._getSubQuestions();
    const debugMode = this.context.options.debugMode;
    const startingQuestionId = this.context.options.startingQuestionId;

    for (let i = 0; i < subQuestions.length; i++) {
      let question = subQuestions[i];
      let component = this.context.mapComponent(question, Question);
      let element = null;

      if (
        debugMode ||
        classname !== "show-irrelevant" ||
        Utils.findQuestionById(startingQuestionId, question, true, false, false)
      ) {
        element = React.createElement(component, {
          key: "sub-question-" + i,
          question: question,
          onChange: this.handleSubQuestionChange,
          index: i,
          intl: this.props.intl,
        });
      }
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
      question[Constants.HAS_SUBQUESTION] = [
        question[Constants.HAS_SUBQUESTION],
      ];
    }

    // sort by label
    JsonLdObjectUtils.orderByLocalizedLabels(
      question[Constants.HAS_SUBQUESTION],
      this.context.options.intl
    );

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
  collapsible: PropTypes.bool, // Whether the section is collapsible (if the question is a section)
};

Question.defaultProps = {
  withoutCard: false,
  collapsible: true,
};
