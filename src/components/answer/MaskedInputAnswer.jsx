import React from 'react';
import JsonLdUtils from 'jsonld-utils';
import PropTypes from 'prop-types';

import * as Constants from '../../constants/Constants';
import FormUtils from '../../util/FormUtils';
import InputAnswer from './InputAnswer';
import Logger from '../../util/Logger';
import MaskedInput from '../MaskedInput';

const MaskedInputAnswer = (props) => {
  const question = props.question;
  const value = props.value;
  const mask = JsonLdUtils.getJsonAttValue(question, Constants.INPUT_MASK);

  if (!mask) {
    Logger.warn('Input mask not provided. Falling back to regular input.');
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
      disabled={FormUtils.isDisabled(question)}
    />
  );

  return null;
};

MaskedInputAnswer.propTypes = {
  question: PropTypes.object.isRequired,
  answer: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  title: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired
};

export default MaskedInputAnswer;
