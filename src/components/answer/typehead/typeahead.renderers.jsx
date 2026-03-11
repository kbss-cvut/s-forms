import React from "react";
import FormUtils from "../../../util/FormUtils.js";

const FEEDBACK_COLORS = {
  correct: "#d4edda",
  incorrect: "#f8d7da",
};

export const createOptionRenderer =
  ({ feedback, previousSelectedId, question }) =>
  (optionProps) => {
    const correctValue = FormUtils.getCorrectAnswerValue(question);

    let background = "transparent";

    const isCorrectOption = optionProps.label === correctValue;
    const wasSelectedWrong =
      optionProps.data.id === previousSelectedId && !isCorrectOption;
    const isSelectedOption = optionProps.data.id === previousSelectedId;

    if (feedback === "correct" && isCorrectOption) {
      background = "#d4edda";
    }

    if (feedback === "correct" && wasSelectedWrong) {
      background = "#f8d7da";
    }

    if (feedback === "incorrect" && isSelectedOption) {
      background = "#f8d7da";
    }

    return (
      <div
        style={{
          backgroundColor: background,
          cursor: "pointer",
        }}
        onClick={() => optionProps.selectOption(optionProps.data)}
      >
        {optionProps.label}
      </div>
    );
  };

export const valueRendererWithFeedback = (feedback, children) => {
  return (
    <div
      style={{
        backgroundColor: FEEDBACK_COLORS[feedback] ?? "transparent",
        padding: "2px 6px",
        borderRadius: "4px",
        display: "inline-block",
      }}
    >
      {children}
    </div>
  );
};
