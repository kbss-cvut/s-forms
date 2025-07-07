import { Card } from "react-bootstrap";
import React, { useContext, useEffect } from "react";
import { FormQuestionsContext } from "../../contexts/FormQuestionsContext.js";
import Question from "../Question.jsx";
import { ConfigurationContext } from "../../contexts/ConfigurationContext.js";
import { useIntl } from "react-intl";
import useScrollToElementById from "../../hooks/useScrollToElementById.jsx";

const Wizardless = () => {
  const intl = useIntl();

  const { updateFormQuestionsData, getFormQuestionsData } =
    useContext(FormQuestionsContext);

  const { options, mapComponent } = React.useContext(ConfigurationContext);

  useScrollToElementById(options.startingQuestionId);

  const handleStepChange = (question, index, change) => {
    updateFormQuestionsData(index, { ...question, ...change });
  };

  const _mapQuestion = (question, index) => {
    let component = mapComponent(question, Question);
    return React.createElement(component, {
      key: question["@id"],
      question: question,
      onChange: (index, change) => handleStepChange(question, index, change),
      index: index,
      intl: intl,
    });
  };

  const formQuestionsData = getFormQuestionsData();

  return (
    <Card className="p-3">
      {formQuestionsData.map((q, i) => _mapQuestion(q, i))}
    </Card>
  );
};

export default Wizardless;
