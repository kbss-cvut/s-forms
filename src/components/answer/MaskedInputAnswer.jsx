import React, { useContext } from "react";
import * as JsonLdUtils from "jsonld-utils";
import PropTypes from "prop-types";

import Vocabulary from "../../constants/Vocabulary.js";
import FormUtils from "../../util/FormUtils";
import InputAnswer from "./InputAnswer";
import Logger from "../../util/Logger";
import MaskedInput from "../MaskedInput";
import { ConfigurationContext } from "../../contexts/ConfigurationContext";

const MaskedInputAnswer = (props) => {
  const { componentsOptions } = useContext(ConfigurationContext);

  const question = props.question;
  const value = props.value;
  const mask = JsonLdUtils.getJsonAttValue(question, Vocabulary.INPUT_MASK);

  if (!mask) {
    Logger.warn("Input mask not provided. Falling back to regular input.");
    return <InputAnswer {...props} />;
  }

  return (
    <MaskedInput
      mask={mask}
      value={value}
      label={props.label}
      title={props.title}
      placeholder={mask}
      onChange={(e) => props.onChange(e.target.value)}
      disabled={componentsOptions.readOnly || FormUtils.isDisabled(question)}
      validation={props.validation}
    />
  );
};

MaskedInputAnswer.propTypes = {
  question: PropTypes.object.isRequired,
  answer: PropTypes.object.isRequired,
  label: PropTypes.object.isRequired,
  title: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  validation: PropTypes.object,
};

export default MaskedInputAnswer;
