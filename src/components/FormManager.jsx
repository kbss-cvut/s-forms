import React, { useContext } from "react";
import QuestionAnswerProcessor from "../model/QuestionAnswerProcessor";
import { FormQuestionsContext } from "../contexts/FormQuestionsContext";
import Wizard from "./wizard/Wizard";
import FormWindow from "./FormWindow";
import { Card } from "react-bootstrap";
import Question from "./Question";
import FormUtils from "../util/FormUtils.js";
import ValidationProcessor from "../model/ValidationProcessor.js";
import { useIntl } from "react-intl";

const FormManager = (props) => {
  const { getFormQuestionsData, updateFormQuestionsData, getData } =
    useContext(FormQuestionsContext);
  const intl = useIntl();

  const getFormData = () => {
    const data = getData();
    const formQuestionsData = getFormQuestionsData();

    return QuestionAnswerProcessor.buildQuestionAnswerModel(
      data,
      formQuestionsData
    );
  };

  //TODO: Add optional argument "isRequiredForCompleteness"
  const validateForm = () => {
    const questions = getFormQuestionsData();

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      ValidationProcessor.updateQuestionValidation(
        questions,
        question,
        i,
        intl.locale
      );
    }

    updateFormQuestionsData(null, questions);
  };

  const getFormSpecification = () => {
    const questions = getFormQuestionsData();
    return FormUtils.getFormSpecification(questions);
  };

  const handleStepChange = (question, index, change) => {
    updateFormQuestionsData(index, { ...question, ...change });
  };

  const renderWizardlessForm = () => {
    const formQuestionsData = getFormQuestionsData();

    return (
      <Card className="p-3">
        {formQuestionsData.map((q, i) => _mapQuestion(q, i))}
      </Card>
    );
  };

  const _mapQuestion = (question, index) => {
    let component = props.mapComponent(question, Question);
    return React.createElement(component, {
      key: question["@id"],
      question: question,
      onChange: (index, change) => handleStepChange(question, index, change),
      index: index,
      intl: intl,
    });
  };

  const { modalView } = props;

  const formQuestionsData = getFormQuestionsData();

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
        {isWizardless ? renderWizardlessForm() : <Wizard />}
      </FormWindow>
    );
  }

  return isWizardless ? renderWizardlessForm() : <Wizard />;
};

export default FormManager;
