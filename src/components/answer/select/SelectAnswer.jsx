import React, { useContext } from "react";
import PropTypes from "prop-types";

import Utils from "../../../util/Utils";
import { ConfigurationContext } from "../../../contexts/ConfigurationContext";

import SelectDefault from "./SelectDefault";
import SelectWithFeedback from "./SelectWithFeedback";

const SelectAnswer = (props) => {
  const configurationContext = useContext(ConfigurationContext);
  const feedbackEnabled = Utils.isOptionQuestionFeedbackEnabled(
    configurationContext?.options
  );

  if (feedbackEnabled) {
    return <SelectWithFeedback {...props} />;
  }

  return <SelectDefault {...props} />;
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
