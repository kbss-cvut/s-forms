import React from "react";
import QuestionAnswerProcessor from "../model/QuestionAnswerProcessor";
import { FormQuestionsContext } from "../contexts/FormQuestionsContext";
import Wizard from "./wizard/Wizard";
import FormWindow from "./FormWindow";
import { Card } from "react-bootstrap";
import Question from "./Question";
import FormUtils from "../util/FormUtils.js";
import ValidatorFactory from "../model/ValidatorFactory.js";
import Constants from "../constants/Constants.js";

class FormManager extends React.Component {
  getFormData = () => {
    const data = this.context.getData();
    const formQuestionsData = this.context.getFormQuestionsData();

    return QuestionAnswerProcessor.buildQuestionAnswerModel(
      data,
      formQuestionsData
    );
  };

  validateForm = () => {
    const questions = this.context.getFormQuestionsData();
    const updatedQuestions = [];
    let index = 0;
    for (let question of questions) {
      const updatedQuestion = this.extractedQuestionValidator(question);
      if (updatedQuestion) {
        updatedQuestions.push(updatedQuestion);
      }
      if (
        question[Constants.HAS_SUBQUESTION] &&
        question[Constants.HAS_SUBQUESTION].length > 0
      ) {
        const subQuestions = question[Constants.HAS_SUBQUESTION];
        for (let subQuestion of subQuestions) {
          const updatedSubQuestion =
            this.extractedQuestionValidator(subQuestion);
          if (updatedSubQuestion) {
            updatedQuestions.push(updatedSubQuestion);
          }
        }
      }
      if (updatedQuestions.length > 0) {
        const newFormQuestionsData = questions.map(
          (question, index) => updatedQuestions[index] || question
        );
        this.context.updateFormQuestionsData(index, newFormQuestionsData);
      }
    }
  };

  extractedQuestionValidator(question) {
    if (question[Constants.HAS_ANSWER]) {
      let answer = question[Constants.HAS_ANSWER][0] || [];
      let answerValue = answer[Constants.HAS_DATA_VALUE] || [];

      if (answerValue.length > 0 || Object.keys(answerValue).length > 0) {
        let validator = ValidatorFactory.createValidator(question, "en");
        const update = validator(answerValue || answerValue["@value"]);

        if (update) {
          return { ...question, ...update };
        }
        return null;
      }
    }
  }

  getFormQuestionsData = () => {
    return this.context.getFormQuestionsData();
  };

  handleStepChange = (question, index, change) => {
    this.context.updateFormQuestionsData(index, { ...question, ...change });
  };

  renderWizardlessForm = () => {
    const formQuestionsData = this.context.getFormQuestionsData();

    return (
      <Card className="p-3">
        {formQuestionsData.map((q, i) => this._mapQuestion(q, i))}
      </Card>
    );
  };

  _mapQuestion(question, index) {
    let component = this.props.mapComponent(question, Question);
    return React.createElement(component, {
      key: question["@id"],
      question: question,
      onChange: (index, change) =>
        this.handleStepChange(question, index, change),
      index: index,
    });
  }

  render() {
    const { modalView } = this.props;

    const formQuestionsData = this.context.getFormQuestionsData();

    if (!formQuestionsData.length) {
      return (
        <Card className="p-3 font-italic">
          There are no questions available...
        </Card>
      );
    }

    const isWizardless = formQuestionsData.every(
      (question) => !FormUtils.isWizardStep(question)
    );

    if (modalView) {
      return (
        <FormWindow>
          {isWizardless ? this.renderWizardlessForm() : <Wizard />}
        </FormWindow>
      );
    }

    return isWizardless ? this.renderWizardlessForm() : <Wizard />;
  }
}

FormManager.contextType = FormQuestionsContext;

export default FormManager;
