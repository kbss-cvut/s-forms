import React, { useState, useEffect } from "react";

import { FormGroup, Form } from "react-bootstrap";
import { IntelligentTreeSelect } from "intelligent-tree-select/lib/components/IntelligentTreeSelect";

import {
  buildControlStyle,
  createOptionRenderer,
  valueRendererWithFeedback,
} from "./typeahead.renderers";
import { evaluateAnswer } from "./typeahead.utils.js";
import PropTypes from "prop-types";
import FormUtils from "../../../util/FormUtils.js";

const TypeaheadWithFeedback = (props) => {
  const [selectedValue, setSelectedValue] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const correctValue = FormUtils.getCorrectAnswerValue(props.question);

  const handleChange = (option) => {
    const id = option?.id ?? null;
    setSelectedValue(option ?? null);
    props.onChange(id);
    setMenuOpen(false);
    setFeedback(evaluateAnswer(option?.label, props.question));
  };

  useEffect(() => {
    if (!props.optionsList.length) return;

    const matched = props.optionsList.find((o) => o.id === props.value);
    if (!matched) return;

    setSelectedValue(matched);
    setFeedback(evaluateAnswer(matched.label, props.question));
  }, [props.optionsList]);

  useEffect(() => {
    setMenuOpen(props.hintRevealed);
  }, [props.hintRevealed]);

  return (
    <FormGroup size="small" className="mb-3">
      <Form.Label>{props.label}</Form.Label>
      <IntelligentTreeSelect
        styles={buildControlStyle(props.validation, feedback)}
        valueKey={props.valueKey}
        labelKey={props.labelKey}
        valueRenderer={(children) =>
          valueRendererWithFeedback(feedback, children)
        }
        optionRenderer={createOptionRenderer({
          hintRevealed: props.hintRevealed,
          currentValue: selectedValue,
          correctValue: correctValue,
        })}
        value={selectedValue}
        options={props.optionsList}
        multi={false}
        isSearchable
        isLoading={props.isLoading}
        isClearable
        renderAsTree
        optionLeftOffset={5}
        isMenuOpen={menuOpen}
        onChange={handleChange}
        titleKey="description"
      />

      {props.validation?.message}
    </FormGroup>
  );
};

export default TypeaheadWithFeedback;

TypeaheadWithFeedback.propTypes = {
  question: PropTypes.object.isRequired,
  answer: PropTypes.object.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  validation: PropTypes.object,
  hintRevealed: PropTypes.bool.isRequired,
};
