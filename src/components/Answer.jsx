import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import CheckboxAnswer from "./answer/CheckboxAnswer";
import DateTimeAnswer from "./answer/DateTimeAnswer";
import InputAnswer from "./answer/InputAnswer";
import * as JsonldUtils from "jsonld-utils";
import MaskedInputAnswer from "./answer/MaskedInputAnswer";
import SelectAnswer from "./answer/SelectAnswer";
import FormUtils from "../util/FormUtils";
import Utils from "../util/Utils";
import TypeaheadAnswer from "./answer/TypeaheadAnswer";
import Vocabulary from "../constants/Vocabulary.js";
import { FormGenContext } from "../contexts/FormGenContext";
import { ConfigurationContext } from "../contexts/ConfigurationContext";
import QuestionStatic from "./QuestionStatic.jsx";
import { FormText } from "react-bootstrap";

const Answer = (props) => {
  const formGenContext = React.useContext(FormGenContext);
  const { options } = React.useContext(ConfigurationContext);
  const [validation, setValidation] = useState({
    severity: "",
    classname: "",
    message: null,
  });

  useEffect(() => {
    _resolveValidationProps();
  }, [props.question]);

  const handleValueChange = (value) => {
    const change = { ...props.answer };
    _setValue(change, value);
    props.onChange(props.index, change);
  };

  const _setValue = (change, value) => {
    if (value === null) {
      change[Vocabulary.HAS_OBJECT_VALUE] = null;
      change[Vocabulary.HAS_DATA_VALUE] = null;
    } else if (
      props.answer[Vocabulary.HAS_OBJECT_VALUE] ||
      FormUtils.isTypeahead(props.question)
    ) {
      change[Vocabulary.HAS_OBJECT_VALUE] = {
        "@id": value,
      };
    } else {
      change[Vocabulary.HAS_DATA_VALUE] = {
        "@value": value,
      };
    }
  };

  const _hasOptions = (item) => {
    return (
      item[Vocabulary.HAS_OPTION] && item[Vocabulary.HAS_OPTION].length !== 0
    );
  };

  const _renderTypeahead = (value, label, title) => {
    const queryHash = Utils.getStringHash(
      FormUtils.getPossibleValuesQuery(props.question)
    );
    const options = formGenContext.getOptions(queryHash) || [];

    return (
      <TypeaheadAnswer
        question={props.question}
        answer={props.answer}
        label={label}
        title={title}
        value={value}
        onChange={handleValueChange}
        options={options}
        validation={validation}
      />
    );
  };

  const _renderSelect = (value, label, title) => {
    return (
      <SelectAnswer
        question={props.question}
        label={label}
        title={title}
        value={value}
        onChange={handleValueChange}
        validation={validation}
      />
    );
  };

  const _renderDateTimePicker = (value, label, title) => {
    return (
      <DateTimeAnswer
        question={props.question}
        value={value}
        title={title}
        label={label}
        onChange={handleValueChange}
        validation={validation}
      />
    );
  };

  const _renderCheckbox = (value, label, title) => {
    return (
      <CheckboxAnswer
        label={label}
        title={title}
        value={value}
        onChange={handleValueChange}
        question={props.question}
        validation={validation}
      />
    );
  };

  const _renderMaskedInput = (value, label, title) => {
    return (
      <MaskedInputAnswer
        label={label}
        title={title}
        value={value}
        onChange={handleValueChange}
        question={props.question}
        answer={props.answer}
        validation={validation}
      />
    );
  };

  const _renderRegularInput = (value, label, title) => {
    return (
      <InputAnswer
        question={props.question}
        answer={props.answer}
        label={label}
        title={title}
        value={value}
        onChange={handleValueChange}
        validation={validation}
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
        onChange={handleValueChange}
        sparql={true}
        validation={validation}
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
        onChange={handleValueChange}
        turtle={true}
        validation={validation}
      />
    );
  };

  const _getLabel = (question) => {
    const label = JsonldUtils.getLocalized(
      question[Vocabulary.RDFS_LABEL],
      options.intl
    );

    return (
      <div className="question-header">
        {label}
        {QuestionStatic.renderIcons(
          props.question,
          options,
          props.onCommentChange,
          props.showIcon
        )}
      </div>
    );
  };

  const _resolveValidationProps = () => {
    setValidation({
      severity: "",
      classname: "",
      message: null,
    });
    if (question[Vocabulary.HAS_VALID_ANSWER] === false) {
      if (
        question[Vocabulary.HAS_VALIDATION_SEVERITY] ===
        Vocabulary.VALIDATION_SEVERITY.WARNING
      ) {
        setValidation({
          severity: "warning",
          classname: "is-warning",
          message: (
            <FormText className="is-warning">
              {question[Vocabulary.HAS_VALIDATION_MESSAGE]}
            </FormText>
          ),
        });
      } else {
        setValidation({
          severity: "error",
          classname: "is-invalid",
          message: (
            <FormText className="is-invalid">
              {question[Vocabulary.HAS_VALIDATION_MESSAGE]}
            </FormText>
          ),
        });
      }
    }
  };

  const question = props.question;
  const value = FormUtils.resolveValue(props.answer);

  const label = _getLabel(question);
  const title = JsonldUtils.getLocalized(
    question[Vocabulary.RDFS_COMMENT],
    options.intl
  );
  let component;

  if (FormUtils.isTypeahead(question)) {
    component = _renderTypeahead(value, label, title, validation);
  } else if (_hasOptions(question)) {
    component = _renderSelect(value, label, title, validation);
  } else if (FormUtils.isCalendar(question)) {
    component = _renderDateTimePicker(value, label, title, validation);
  } else if (FormUtils.isCheckbox(question)) {
    component = _renderCheckbox(value, label, title, validation);
  } else if (FormUtils.isMaskedInput(question)) {
    component = _renderMaskedInput(value, label, title, validation);
  } else if (FormUtils.isSparqlInput(question)) {
    component = _renderSparqlInput(value, label, title, validation);
  } else if (FormUtils.isTurtleInput(question)) {
    component = _renderTurtleInput(value, label, title, validation);
  } else {
    component = _renderRegularInput(value, label, title, validation);
  }

  return component;
};

Answer.propTypes = {
  answer: PropTypes.object.isRequired,
  question: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onCommentChange: PropTypes.func.isRequired,
  index: PropTypes.number,
  icons: PropTypes.object,
};

export default Answer;
