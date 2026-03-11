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

export const buildControlStyle = (validation, feedback) => {
  const styles =
    VALIDATION_STYLES[validation?.classname] ?? FEEDBACK_STYLES[feedback] ?? {};

  const { borderColor, boxShadow } = styles;

  return {
    control: (provided) => ({
      ...provided,
      border: borderColor ? `1px solid ${borderColor}` : provided.border,
      boxShadow: boxShadow ?? provided.boxShadow,
      "&:hover": {
        border: borderColor ? `1px solid ${borderColor}` : provided.border,
        boxShadow: boxShadow ?? provided.boxShadow,
      },
    }),
  };
};
