import React from 'react';
import PropTypes from 'prop-types';
import CheckboxAnswer from './answer/CheckboxAnswer';
import DateTimeAnswer from './answer/DateTimeAnswer';
import InputAnswer from './answer/InputAnswer';
import JsonldUtils from 'jsonld-utils';
import MaskedInputAnswer from './answer/MaskedInputAnswer';
import SelectAnswer from './answer/SelectAnswer';
import FormUtils from '../util/FormUtils';
import Utils from '../util/Utils';
import TypeaheadAnswer from './answer/TypeaheadAnswer';
import * as Constants from '../constants/Constants';
import { FormGenContext } from '../contexts/FormGenContext';
import { ConfigurationContext } from '../contexts/ConfigurationContext';

const Answer = (props) => {
  const formGenContext = React.useContext(FormGenContext);
  const { options } = React.useContext(ConfigurationContext);

  const onValueChange = (value) => {
    const change = { ...props.answer };
    _setValue(change, value);
    props.onChange(props.index, change);
  };

  const _setValue = (change, value) => {
    if (value === null) {
      change[Constants.HAS_OBJECT_VALUE] = null;
      change[Constants.HAS_DATA_VALUE] = null;
    } else if (props.answer[Constants.HAS_OBJECT_VALUE] || FormUtils.isTypeahead(props.question)) {
      change[Constants.HAS_OBJECT_VALUE] = {
        '@id': value
      };
    } else {
      change[Constants.HAS_DATA_VALUE] = {
        '@value': value
      };
    }
  };

  const _hasOptions = (item) => {
    return item[Constants.HAS_OPTION] && item[Constants.HAS_OPTION].length !== 0;
  };

  const _renderTypeahead = (value, label, title) => {
    const queryHash = Utils.getStringHash(FormUtils.getPossibleValuesQuery(props.question));
    const options = formGenContext.getOptions(queryHash) || [];

    return (
      <TypeaheadAnswer
        question={props.question}
        answer={props.answer}
        label={label}
        title={title}
        value={value}
        onChange={onValueChange}
        options={options}
      />
    );
  };

  const _renderSelect = (value, label, title) => {
    return (
      <SelectAnswer question={props.question} label={label} title={title} value={value} onChange={onValueChange} />
    );
  };

  const _renderDateTimePicker = (value, label, title) => {
    return (
      <DateTimeAnswer question={props.question} value={value} title={title} label={label} onChange={onValueChange} />
    );
  };

  const _renderCheckbox = (value, label, title) => {
    return (
      <CheckboxAnswer label={label} title={title} value={value} onChange={onValueChange} question={props.question} />
    );
  };

  const _renderMaskedInput = (value, label, title) => {
    return (
      <MaskedInputAnswer
        label={label}
        title={title}
        value={value}
        onChange={onValueChange}
        question={props.question}
        answer={props.answer}
      />
    );
    return null;
  };

  const _renderRegularInput = (value, label, title) => {
    return (
      <InputAnswer
        question={props.question}
        answer={props.answer}
        label={label}
        title={title}
        value={value}
        onChange={onValueChange}
      />
    );
  };

  const _renderSparqlInput = (value, label, title) => {
    return (
      <InputAnswer
        question={props.question}
        answer={props.answer}
        label={label}
        title={title}
        value={value}
        onChange={onValueChange}
        sparql={true}
      />
    );
  };

  const _renderTurtleInput = (value, label, title) => {
    return (
      <InputAnswer
        question={props.question}
        answer={props.answer}
        label={label}
        title={title}
        value={value}
        onChange={onValueChange}
        turtle={true}
      />
    );
  };

  const question = props.question;
  const value = FormUtils.resolveValue(props.answer);

  const label = JsonldUtils.getLocalized(question[JsonldUtils.RDFS_LABEL], options.intl);
  const title = JsonldUtils.getLocalized(question[JsonldUtils.RDFS_COMMENT], options.intl);
  let component;

  if (FormUtils.isTypeahead(question)) {
    component = _renderTypeahead(value, label, title);
  } else if (_hasOptions(question)) {
    component = _renderSelect(value, label, title);
  } else if (FormUtils.isCalendar(question)) {
    component = _renderDateTimePicker(value, label, title);
  } else if (FormUtils.isCheckbox(question)) {
    component = _renderCheckbox(value, label, title);
  } else if (FormUtils.isMaskedInput(question)) {
    component = _renderMaskedInput(value, label, title);
  } else if (FormUtils.isSparqlInput(question)) {
    component = _renderSparqlInput(value, label, title);
  } else if (FormUtils.isTurtleInput(question)) {
    component = _renderTurtleInput(value, label, title);
  } else {
    component = _renderRegularInput(value, label, title);
  }

  return component;
};

Answer.propTypes = {
  answer: PropTypes.object.isRequired,
  question: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  index: PropTypes.number
};

export default Answer;
