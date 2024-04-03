import React, { useContext } from "react";
import PropTypes from "prop-types";
import FormUtils from "../../util/FormUtils";
import { ConfigurationContext } from "../../contexts/ConfigurationContext";

const CheckboxAnswer = (props) => {
  const { inputComponent, componentsOptions } =
    useContext(ConfigurationContext);

  const question = props.question;

  return React.createElement(inputComponent, {
    type: "checkbox",
    label: props.label,
    title: props.title,
    checked: props.value === true || props.value === "true",
    validation: props.validation,
    onChange: (e) => {
      props.onChange(e.target.checked);
    },
    disabled: componentsOptions.readOnly || FormUtils.isDisabled(question),
  });
};

CheckboxAnswer.propTypes = {
  question: PropTypes.object.isRequired,
  label: PropTypes.object.isRequired,
  title: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  onChange: PropTypes.func.isRequired,
  mouseHover: PropTypes.bool,
  validation: PropTypes.object,
};

export default CheckboxAnswer;
