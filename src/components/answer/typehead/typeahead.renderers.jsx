import React from "react";
import Option from "intelligent-tree-select/lib/components/Option";
import FormUtils from "../../../util/FormUtils.js";

const FEEDBACK_COLORS = {
  correct: "#d4edda",
  incorrect: "#f8d7da",
};

const VALIDATION_STYLES = {
  "is-warning": {
    borderColor: "#dc9135",
    boxShadow: "0 0 0 0.2rem rgba(203,127,16,.25)",
  },
  "is-invalid": {
    borderColor: "#dc3545",
    boxShadow: "0 0 0 0.2rem rgba(220,53,69,.25)",
  },
};

const FEEDBACK_STYLES = {
  correct: {
    borderColor: "#28a745",
    boxShadow: "0 0 0 0.2rem rgba(40,167,69,.25)",
  },
  incorrect: {
    borderColor: "#dc3545",
    boxShadow: "0 0 0 0.2rem rgba(220,53,69,.25)",
  },
};

const buildControlOverride = ({ borderColor, boxShadow } = {}) => ({
  control: (provided) => ({
    ...provided,
    border: borderColor ? `1px solid ${borderColor}` : provided.border,
    boxShadow: boxShadow ?? provided.boxShadow,
    "&:hover": {
      border: borderColor ? `1px solid ${borderColor}` : provided.border,
      boxShadow: boxShadow ?? provided.boxShadow,
    },
  }),
});

export const buildControlStyle = (validation, feedback) => {
  const styles =
    VALIDATION_STYLES[validation?.classname] ?? FEEDBACK_STYLES[feedback] ?? {};
  return buildControlOverride(styles);
};

export const createOptionRenderer =
  ({ hintRevealed, correctValue, currentValue }) =>
  (optionProps) => {
    const isCorrect = optionProps.label?.trim() === correctValue?.trim();
    const isCurrent = optionProps.label?.trim() === currentValue?.label?.trim();

    let background = "transparent";
    if (hintRevealed && isCorrect) background = FEEDBACK_COLORS.correct;
    if (isCurrent)
      background = isCorrect
        ? FEEDBACK_COLORS.correct
        : FEEDBACK_COLORS.incorrect;

    return (
      <div style={{ backgroundColor: background }}>
        <Option {...optionProps} />
      </div>
    );
  };

export const valueRendererWithFeedback = (feedback, children) => (
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
