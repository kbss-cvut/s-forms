'use strict';

import React from "react";
import assign from "object-assign";
import {Panel} from "react-bootstrap";
import JsonLdUtils from "jsonld-utils";
import Answer from "./Answer";
import Configuration from "../model/Configuration";
import Constants from "../constants/Constants";
import FormUtils from "../util/FormUtils";
import QuestionAnswerProcessor from "../model/QuestionAnswerProcessor";

export default class Question extends React.Component {
    static propTypes = {
        question: React.PropTypes.object.isRequired,
        onChange: React.PropTypes.func.isRequired,
        index: React.PropTypes.number,
        withoutPanel: React.PropTypes.bool
    };

    constructor(props) {
        super(props);
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
        this.props.onChange(this.props.index, newState);
    }

    render() {
        if (FormUtils.isHidden(this.props.question)) {
            return null;
        }
        if (FormUtils.isSection(this.props.question)) {
            if (this.props.withoutPanel) {
                return <div>
                    {this.renderAnswers()}
                    {this.renderSubQuestions()}
                </div>;
            } else {
                var label = JsonLdUtils.getLocalized(this.props.question[JsonLdUtils.RDFS_LABEL], Configuration.intl);
                return <Panel header={<h5>{label}</h5>} bsStyle='info'>
                    {this.renderAnswers()}
                    {this.renderSubQuestions()}
                </Panel>;
            }
        } else {
            return <div>{this.renderAnswers()}</div>;
        }
    }

    renderAnswers() {
        var question = this.props.question,
            children = [], row = [], cls, isTextarea;
        var answers = this._getAnswers();
        for (var i = 0, len = answers.length; i < len; i++) {
            isTextarea = FormUtils.isTextarea(this.props.question, FormUtils.resolveValue(answers[i]));
            cls = Question._getAnswerClass(isTextarea);
            row.push(<div key={'row-item-' + i} className={cls}>
                <Answer index={i} answer={answers[i]} question={question} onChange={this.onAnswerChange}/>
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
            if (FormUtils.isSection(question) || FormUtils.isWizardStep(question)) {
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
            Constants.GENERATED_ROW_SIZE === 1 ? 'col-xs-6' : 'col-xs-' + (Constants.COLUMN_COUNT / Constants.GENERATED_ROW_SIZE));
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
        // TODO Temporary sorting
        question[Constants.HAS_SUBQUESTION].sort(function (a, b) {
            var aLabel = JsonLdUtils.getJsonAttValue(a, JsonLdUtils.RDFS_LABEL),
                bLabel = JsonLdUtils.getJsonAttValue(b, JsonLdUtils.RDFS_LABEL);
            if (aLabel < bLabel) {
                return -1;
            } else if (aLabel > bLabel) {
                return 1;
            }
            return 0;
        });
        return question[Constants.HAS_SUBQUESTION];
    }
}
