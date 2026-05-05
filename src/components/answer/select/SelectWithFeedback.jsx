import React, { useState, useEffect, useRef, useContext } from "react";
import PropTypes from "prop-types";

import Constants from "../../../constants/Constants";
import FormUtils from "../../../util/FormUtils";
import { ConfigurationContext } from "../../../contexts/ConfigurationContext";
import { generateSelectOptions } from "./select.utils.js";
import SelectFeedbackBadge from "./SelectFeedbackBadge.jsx";
import {
  applySelectFeedback,
  evaluateSelectAnswer,
} from "./select.feedback.js";
import { resolveOptionLabel } from "./select.utils.js";

const SelectWithFeedback = ({
  question,
  label,
  title,
  value,
  validation,
  onChange,
  hintRevealed,
}) => {
  const { inputComponent, componentsOptions } =
    useContext(ConfigurationContext);

  const wrapperRef = useRef(null);
  const [feedback, setFeedback] = useState(null);
  const [selectedValue, setSelectedValue] = useState(value ?? "");

  const getSelectEl = () => wrapperRef.current?.querySelector("select") ?? null;

  const checkCorrectness = (answerValue) => {
    const correctValue = FormUtils.getCorrectAnswerValue(question);
    const result = evaluateSelectAnswer(answerValue, correctValue);
    if (!result) return;
    applySelectFeedback(getSelectEl(), result === "correct");
    setFeedback(result);
  };

  useEffect(() => {
    if (!FormUtils.hasAnswer(question) || !value) return;
    const labelValue = resolveOptionLabel(
      question[Constants.HAS_OPTION] ?? [],
      value
    );
    setSelectedValue(labelValue);
    checkCorrectness(labelValue);
  }, []);

  const revealCorrectAnswer = () => {
    const correctValue = FormUtils.getCorrectAnswerValue(question);
    if (!correctValue) return;
    setSelectedValue(correctValue);
    onChange(correctValue);
    checkCorrectness(correctValue);
  };

  useEffect(() => {
    if (hintRevealed) revealCorrectAnswer();
  }, [hintRevealed]);

  const handleChange = (e) => {
    if (hintRevealed) {
      revealCorrectAnswer();
      return;
    }
    const labelValue = e.target.value;
    setSelectedValue(labelValue);
    onChange(labelValue);
    checkCorrectness(labelValue);
  };

  return (
    <div ref={wrapperRef} style={{ position: "relative" }}>
      {React.createElement(
        inputComponent,
        {
          type: "select",
          label,
          value: selectedValue,
          title,
          validation,
          onChange: handleChange,
          disabled:
            componentsOptions.readOnly || FormUtils.isDisabled(question),
        },
        generateSelectOptions(question[Constants.HAS_OPTION])
      )}
      <SelectFeedbackBadge status={feedback} />
    </div>
  );
};

SelectWithFeedback.propTypes = {
  question: PropTypes.object.isRequired,
  label: PropTypes.object.isRequired,
  title: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  validation: PropTypes.object,
  hintRevealed: PropTypes.bool,
};

export default SelectWithFeedback;
