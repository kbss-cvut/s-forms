import React, { useContext } from "react";
import PropTypes from "prop-types";

import Constants from "../../../constants/Constants";
import FormUtils from "../../../util/FormUtils";
import { ConfigurationContext } from "../../../contexts/ConfigurationContext";
import { generateSelectOptions } from "./select.utils.js";

const SelectDefault = ({
  question,
  label,
  title,
  value,
  validation,
  onChange,
}) => {
  const { inputComponent, componentsOptions } =
    useContext(ConfigurationContext);

  const handleChange = (e) => onChange(e.target.value);

  return React.createElement(
    inputComponent,
    {
      type: "select",
      label,
      value,
      title,
      validation,
      onChange: handleChange,
      disabled: componentsOptions.readOnly || FormUtils.isDisabled(question),
    },
    generateSelectOptions(question[Constants.HAS_OPTION])
  );
};

SelectDefault.propTypes = {
  question: PropTypes.object.isRequired,
  label: PropTypes.object.isRequired,
  title: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  validation: PropTypes.object,
};

export default SelectDefault;
