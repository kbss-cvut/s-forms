'use strict';

import React from "react";
import assign from "object-assign";
import {Panel} from "react-bootstrap";
import JsonLdUtils from "jsonld-utils";
import Answer from "./Answer";
import Configuration from "../model/Configuration";
import Constants from "../constants/Constants";
import FormUtils from "../util/FormUtils";
import HelpIcon from "./HelpIcon";
import JsonObjectMap from "../util/JsonObjectMap";
import QuestionAnswerProcessor from "../model/QuestionAnswerProcessor";
import ValidatorFactory from "../model/ValidatorFactory";
import JsonLdObjectUtils from "../util/JsonLdObjectUtils";

export default class Question extends React.Component {
    static propTypes = {
        question: React.PropTypes.object.isRequired,
        onChange: React.PropTypes.func.isRequired,
        index: React.PropTypes.number,
        withoutPanel: React.PropTypes.bool
    };

    constructor(props) {
        super(props);
        JsonObjectMap.addObject(props.question["@id"], props.question);
        this.state = {
            validator: ValidatorFactory.createValidator(props.question)
        };
    }

    onAnswerChange = (answerIndex, change) => {
        this._onChange(Constants.HAS_ANSWER, answerIndex, change);
    };

    onSubQuestionChange = (subQuestionIndex, change) => {
        this._onChange(Constants.HAS_SUBQUESTION, subQuestionIndex, change);
    };

    _onChange(att, valueIndex, newValue) {
        var newState = assign({}, this.props.question);
        newState[att][valueIndex] = newValue;
        if (att === Constants.HAS_ANSWER) {
            var result = this.state.validator(newValue);
            newState = assign(newState, result);
        }

        JsonObjectMap.addObject(newState["@id"], newState);
        this.props.onChange(this.props.index, newState);
    }

    render() {
        var question = this.props.question;
        if (FormUtils.isHidden(question)) {
            return null;
        }
        if (! FormUtils.isRelevant(question)) {
            return null;
        }
        if (FormUtils.isAnswerable(question)) {
            return <div>
                {this.renderAnswers()}
                <div style={{padding: '0 0 0 3em'}}>
                    {this.renderSubQuestions()}
                </div>
            </div>
        }
        if (FormUtils.isSection(question)) {
            if (this.props.withoutPanel) {
                return <div>
                    {this._renderQuestionContent()}
                </div>;
            } else {
                var label = JsonLdUtils.getLocalized(question[JsonLdUtils.RDFS_LABEL], Configuration.intl);
                return <Panel header={<h5>{label}</h5>} bsStyle='info'>
                    {this._renderQuestionContent()}
                </Panel>;
            }
        } else {
            return <div>{this._renderQuestionContent()}</div>;
        }
    }

    _renderQuestionContent() {
        return [
            this.renderAnswers(),
            this.renderSubQuestions()
        ];
    }

    renderAnswers() {
        var question = this.props.question,
            children = [], row = [], cls, isTextarea;
        var answers = this._getAnswers();
        for (var i = 0, len = answers.length; i < len; i++) {
            isTextarea = FormUtils.isTextarea(this.props.question, FormUtils.resolveValue(answers[i]));
            cls = Question._getAnswerClass(isTextarea);
            row.push(<div key={'row-item-' + i} className={cls}>
                <div className="row">
                    <div className="col-xs-10">
                        <Answer index={i} answer={answers[i]} question={question} onChange={this.onAnswerChange}/>
                    </div>
                    <div>
                        {this._renderUnits()}
                        {this._renderQuestionHelp()}
                    </div>
                </div>
            </div>);
            if (row.length === Constants.GENERATED_ROW_SIZE || isTextarea) {
                children.push(<div className='row' key={'question-row-' + i}>{row}</div>);
                row = [];
            }
        }
        if (row.length > 0) {
            children.push(<div className='row' key={'question-row-' + i}>{row}</div>);
        }
        return children;
    }

    _getAnswers() {
        var question = this.props.question;
        if (!question[Constants.HAS_ANSWER]) {
            if (FormUtils.isSection(question) && !FormUtils.isAnswerable(question) || FormUtils.isWizardStep(question)) {
                question[Constants.HAS_ANSWER] = [];
            } else {
                question[Constants.HAS_ANSWER] = [QuestionAnswerProcessor.generateAnswer(question)];
            }
        }
        if (!Array.isArray(question[Constants.HAS_ANSWER])) {
            question[Constants.HAS_ANSWER] = [question[Constants.HAS_ANSWER]];
        }
        return question[Constants.HAS_ANSWER];
    }

    static _getAnswerClass(isTextarea) {
        return isTextarea ? 'col-xs-12' : (
            Constants.GENERATED_ROW_SIZE === 1 ? 'col-xs-5' : 'col-xs-' + (Constants.COLUMN_COUNT / Constants.GENERATED_ROW_SIZE));
    }

    _renderQuestionHelp() {
        var question = this.props.question,
            helpClass = FormUtils.isCheckbox(question) ? 'help-icon-checkbox' : 'help-icon-text-input';
        return question[Constants.HELP_DESCRIPTION] ?
            <HelpIcon
                text={JsonLdUtils.getLocalized(question[Constants.HELP_DESCRIPTION], Configuration.intl)}
                iconClass={helpClass}/> : null;
    }

    _renderUnits() {
        var question = this.props.question;
        return question[Constants.HAS_UNIT] ?
            <div className="has-unit-label">{question[Constants.HAS_UNIT]}</div> : null;
    }

    renderSubQuestions() {
        var children = [],
            subQuestions = this._getSubQuestions();
        for (var i = 0, len = subQuestions.length; i < len; i++) {
            children.push(<Question key={'sub-question-' + i} index={i} question={subQuestions[i]}
                                    onChange={this.onSubQuestionChange}/>);
        }
        return children;
    }

    _getSubQuestions() {
        var question = this.props.question;
        if (!question[Constants.HAS_SUBQUESTION]) {
            question[Constants.HAS_SUBQUESTION] = [];
        }
        if (!Array.isArray(question[Constants.HAS_SUBQUESTION])) {
            question[Constants.HAS_SUBQUESTION] = [question[Constants.HAS_SUBQUESTION]];
        }

        // sort by label
        question[Constants.HAS_SUBQUESTION].sort(JsonLdObjectUtils.getCompareLocalizedLabelFunction(Configuration.intl));

        // sort by property
        JsonLdObjectUtils.toplogicalSort(question[Constants.HAS_SUBQUESTION], Constants.HAS_PRECEDING_QUESTION);

        return question[Constants.HAS_SUBQUESTION];
    }
}
