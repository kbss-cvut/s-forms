import React from 'react';
import { Card } from 'react-bootstrap';
import JsonLdUtils from 'jsonld-utils';
import Constants from '../constants/Constants';
import FormUtils from '../util/FormUtils';
import Question from './Question';

export default class CompositeQuestion extends Question {

  constructor(props) {
    super(props);
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
        };
      }

    } else {
      subQuestions.forEach(subQuestion => {
        subQuestion[Constants.HAS_ANSWER][0][Constants.HAS_DATA_VALUE] = {
          '@value': ''
        };
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
    change[Constants.HAS_DATA_VALUE] = { '@value': compositePattern.trim() };
    this._onChange(Constants.HAS_ANSWER, 0, change);
  }

  render() {
    const question = this.props.question;

    if (FormUtils.isHidden(question)) {
      return null;
    }

    if (!FormUtils.isRelevant(question)) {
      return null;
    }

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

}
