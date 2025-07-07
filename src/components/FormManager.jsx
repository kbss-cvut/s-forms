import React, { forwardRef, useContext, useImperativeHandle } from "react";
import QuestionAnswerProcessor from "../model/QuestionAnswerProcessor";
import { FormQuestionsContext } from "../contexts/FormQuestionsContext";
import Wizard from "./wizard/Wizard";
import FormWindow from "./FormWindow";
import { Card } from "react-bootstrap";
import FormUtils from "../util/FormUtils.js";
import ValidationProcessor from "../model/ValidationProcessor.js";
import { useIntl } from "react-intl";
import Wizardless from "./wizard/Wizardless.jsx";

const FormManager = forwardRef((props, ref) => {
  const { getFormQuestionsData, updateFormQuestionsData, getData } =
    useContext(FormQuestionsContext);
  const intl = useIntl();

  // Used to expose function as a ref.
  // See https://react.dev/reference/react/useImperativeHandle
  useImperativeHandle(
    ref,
    () => {
      return {
        validateForm,
        getFormSpecification,
        getFormQuestionsData,
        getFormData,
      };
    },
    []
  );

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
        intl
      );
    }

    updateFormQuestionsData(null, questions);
  };

  const getFormSpecification = () => {
    const questions = getFormQuestionsData();
    return FormUtils.getFormSpecification(questions);
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

  const content = isWizardless ? <Wizardless /> : <Wizard />;

  return modalView ? <FormWindow>{content}</FormWindow> : content;
});

export default FormManager;
