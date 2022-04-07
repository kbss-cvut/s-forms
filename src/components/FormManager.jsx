import React from "react";
import QuestionAnswerProcessor from "../model/QuestionAnswerProcessor";
import { FormQuestionsContext } from "../contexts/FormQuestionsContext";
import Wizard from "./wizard/Wizard";
import FormWindow from "./FormWindow";
import Card from "react-bootstrap/Card";
import Question from "./Question";
import FormUtils from "../util/FormUtils.js";

class FormManager extends React.Component {
  getFormData = () => {
    const data = this.context.getData();
    const formQuestionsData = this.context.getFormQuestionsData();

    return QuestionAnswerProcessor.buildQuestionAnswerModel(
      data,
      formQuestionsData
    );
  };

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
