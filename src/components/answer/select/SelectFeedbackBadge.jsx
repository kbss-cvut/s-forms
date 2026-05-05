import React from "react";
import PropTypes from "prop-types";
import CrossIcon from "../../../styles/icons/CrossIcon.jsx";
import CheckIcon from "../../../styles/icons/CheckIcon.jsx";

const SelectFeedbackBadge = ({ status }) => {
  if (status === "correct")
    return <CheckIcon className="select-feedback-badge correct visible" />;
  if (status === "incorrect")
    return <CrossIcon className="select-feedback-badge incorrect visible" />;
  return null;
};

SelectFeedbackBadge.displayName = "SelectFeedbackBadge";

SelectFeedbackBadge.propTypes = {
  status: PropTypes.oneOf(["correct", "incorrect", null]),
};

export default SelectFeedbackBadge;
