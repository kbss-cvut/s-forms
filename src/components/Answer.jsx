import React from 'react';
import PropTypes from 'prop-types';
import CheckboxAnswer from './answer/CheckboxAnswer';
import DateTimeAnswer from './answer/DateTimeAnswer';
import InputAnswer from './answer/InputAnswer';
import JsonldUtils from 'jsonld-utils';
import Configuration from '../model/Configuration';
import MaskedInputAnswer from './answer/MaskedInputAnswer';
import SelectAnswer from './answer/SelectAnswer';
import FormUtils from '../util/FormUtils';
import TypeaheadAnswer from './answer/TypeaheadAnswer';
import * as Constants from '../constants/Constants';

export default class Answer extends React.Component {
  onValueChange = (value) => {
    const change = { ...this.props.answer };
    this._setValue(change, value);
    this.props.onChange(this.props.index, change);
  };

  _setValue(change, value) {
    if (value === null) {
      change[Constants.HAS_OBJECT_VALUE] = null;
      change[Constants.HAS_DATA_VALUE] = null;
    } else if (this.props.answer[Constants.HAS_OBJECT_VALUE] || FormUtils.isTypeahead(this.props.question)) {
      change[Constants.HAS_OBJECT_VALUE] = {
        '@id': value
      };
    } else {
      change[Constants.HAS_DATA_VALUE] = {
        '@value': value
      };
    }
  }

  render() {
    const question = this.props.question,
      value = FormUtils.resolveValue(this.props.answer),
      label = JsonldUtils.getLocalized(question[JsonldUtils.RDFS_LABEL], Configuration.intl),
      title = JsonldUtils.getLocalized(question[JsonldUtils.RDFS_COMMENT], Configuration.intl);
    let component;

    if (FormUtils.isTypeahead(question)) {
      component = this._renderTypeahead(value, label, title);
    } else if (Answer._hasOptions(question)) {
      component = this._renderSelect(value, label, title);
    } else if (FormUtils.isCalendar(question)) {
      component = this._renderDateTimePicker(value, label, title);
    } else if (FormUtils.isCheckbox(question)) {
      component = this._renderCheckbox(value, label, title);
    } else if (FormUtils.isMaskedInput(question)) {
      component = this._renderMaskedInput(value, label, title);
    } else if (FormUtils.isSparqlInput(question)) {
      component = this._renderSparqlInput(value, label, title);
    } else if (FormUtils.isTurtleInput(question)) {
      component = this._renderTurtleInput(value, label, title);
    } else {
      component = this._renderRegularInput(value, label, title);
    }
    return component;
  }

  static _hasOptions(item) {
    return item[Constants.HAS_OPTION] && item[Constants.HAS_OPTION].length !== 0;
  }

  _renderTypeahead(value, label, title) {
    return (
      <TypeaheadAnswer
        question={this.props.question}
        answer={this.props.answer}
        label={label}
        title={title}
        value={value}
        onChange={this.onValueChange}
      />
    );
  }

  _renderSelect(value, label, title) {
    return (
      <SelectAnswer
        question={this.props.question}
        label={label}
        title={title}
        value={value}
        onChange={this.onValueChange}
      />
    );
  }

  _renderDateTimePicker(value, label, title) {
    return (
      <DateTimeAnswer
        question={this.props.question}
        value={value}
        title={title}
        label={label}
        onChange={this.onValueChange}
      />
    );
  }

  _renderCheckbox(value, label, title) {
    return (
      <CheckboxAnswer
        label={label}
        title={title}
        value={value}
        onChange={this.onValueChange}
        question={this.props.question}
      />
    );
  }

  _renderMaskedInput(value, label, title) {
    return (
      <MaskedInputAnswer
        label={label}
        title={title}
        value={value}
        onChange={this.onValueChange}
        question={this.props.question}
        answer={this.props.answer}
      />
    );
    return null;
  }

  _renderRegularInput(value, label, title) {
    return (
      <InputAnswer
        question={this.props.question}
        answer={this.props.answer}
        label={label}
        title={title}
        value={value}
        onChange={this.onValueChange}
      />
    );
  }

  _renderSparqlInput(value, label, title) {
    return (
      <InputAnswer
        question={this.props.question}
        answer={this.props.answer}
        label={label}
        title={title}
        value={value}
        onChange={this.onValueChange}
        sparql={true}
      />
    );
  }

  _renderTurtleInput(value, label, title) {
    return (
      <InputAnswer
        question={this.props.question}
        answer={this.props.answer}
        label={label}
        title={title}
        value={value}
        onChange={this.onValueChange}
        turtle={true}
      />
    );
  }
}

Answer.propTypes = {
  answer: PropTypes.object.isRequired,
  question: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  index: PropTypes.number
};
