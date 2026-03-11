import React, { useState, useEffect, useRef, useContext } from "react";
import PropTypes from "prop-types";

import Constants from "../../../constants/Constants";
import FormUtils from "../../../util/FormUtils";
import Utils from "../../../util/Utils";
import { ConfigurationContext } from "../../../contexts/ConfigurationContext";

import { generateSelectOptions } from "./select.options.jsx";
import SelectFeedbackBadge from "./SelectFeedbackBadge.jsx";
import {
  applySelectFeedback,
  evaluateSelectAnswer,
} from "./select.feedback.js";
import { resolveOptionLabel } from "./select.utils.js";

const SelectAnswer = (props) => {
  const { question, label, title, value, validation, onChange, hintRevealed } =
    props;

  const configurationContext = useContext(ConfigurationContext);
  const { inputComponent, componentsOptions } = configurationContext;
  const feedbackEnabled = Utils.isOptionQuestionFeedbackEnabled(
    configurationContext?.options
  );

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
    if (!feedbackEnabled) return;
    if (!FormUtils.hasAnswer(question)) return;
    if (!value) return;

    const options = question[Constants.HAS_OPTION] ?? [];
    const labelValue = resolveOptionLabel(options, value);

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
    if (hintRevealed) {
      revealCorrectAnswer();
    }
  }, [hintRevealed]);

  const handleChange = (e) => {
    if (hintRevealed) {
      revealCorrectAnswer();
      return;
    }

    const labelValue = e.target.value;

    setSelectedValue(labelValue);
    onChange(labelValue);

    if (feedbackEnabled) {
      checkCorrectness(labelValue);
    }
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

SelectAnswer.propTypes = {
  question: PropTypes.object.isRequired,
  label: PropTypes.object.isRequired,
  title: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  validation: PropTypes.object,
  hintRevealed: PropTypes.bool,
  onRevealHint: PropTypes.func,
};

export default SelectAnswer;
