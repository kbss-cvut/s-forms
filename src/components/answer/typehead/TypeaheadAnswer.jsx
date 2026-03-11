import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";

import Constants from "../../../constants/Constants.js";
import FormUtils from "../../../util/FormUtils.js";
import Utils from "../../../util/Utils.js";
import Logger from "../../../util/Logger.js";

import { FormGroup, Form } from "react-bootstrap";
import { FormGenContext } from "../../../contexts/FormGenContext.js";
import { ConfigurationContext } from "../../../contexts/ConfigurationContext.js";
import { IntelligentTreeSelect } from "intelligent-tree-select/lib/components/IntelligentTreeSelect.js";
import { useIntl } from "react-intl";

import "intelligent-tree-select/lib/styles.css";

import { buildOptionsTree } from "./typeahead.utils.js";
import { evaluateAnswer } from "./typeahead.feedback.js";
import { buildControlStyle } from "./typeahead.styles.js";
import {
  createOptionRenderer,
  valueRendererWithFeedback,
} from "./typeahead.renderers.jsx";

const TypeaheadAnswer = (props) => {
  const intl = useIntl();
  const formGenContext = useContext(FormGenContext);
  const configurationContext = useContext(ConfigurationContext);
  const feedbackEnabled = Utils.isOptionQuestionFeedbackEnabled(
    configurationContext?.options
  );

  const queryHash = Utils.getStringHash(
    FormUtils.getPossibleValuesQuery(props.question)
  );

  const [feedback, setFeedback] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [previousSelectedId, setPreviousSelectedId] = useState(null);
  const [optionsList, setOptionsList] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const valueKey = Utils.findKeyInObjects(optionsList, ["name", "value"]);
  const labelKey = Utils.findKeyInObjects(optionsList, ["name", "label"]);

  useEffect(() => {
    let isCancelled = false;
    const question = props.question;

    const applyOptions = (rawOptions) => {
      if (isCancelled) return;
      setOptionsList(buildOptionsTree(rawOptions, intl));
      setLoading(false);
    };

    const loadFormOptions = async () => {
      try {
        const options = await formGenContext.loadFormOptions(
          queryHash,
          FormUtils.getPossibleValuesQuery(question)
        );
        applyOptions(options);
      } catch (error) {
        Logger.error(
          `TypeaheadAnswer: loadFormOptions failed for query hash: ${queryHash}`
        );
      }
    };

    if (
      !question[Constants.HAS_OPTION] &&
      FormUtils.getPossibleValuesQuery(question)
    ) {
      loadFormOptions();
    } else {
      applyOptions(question[Constants.HAS_OPTION]);
    }

    return () => {
      isCancelled = true;
    };
  }, [queryHash, formGenContext, props.question, intl]);

  useEffect(() => {
    if (!props.hintRevealed || !optionsList.length) return;

    const correctValue = FormUtils.getCorrectAnswerValue(props.question);
    const correctOption = optionsList.find(
      (o) => o.label.trim() === correctValue?.trim()
    );

    if (!correctOption) {
      Logger.warn(
        `TypeaheadAnswer: correct option not found for value "${correctValue}"`
      );
      return;
    }

    setSelectedId(correctOption.id);
    setFeedback("correct");
    props.onChange(correctOption.id);
  }, [props.hintRevealed, optionsList]);

  const handleChange = (option) => {
    if (props.hintRevealed) return;

    const id = option?.id ?? null;

    setSelectedId(id);
    setPreviousSelectedId(id);
    props.onChange(id);

    if (feedbackEnabled) {
      setFeedback(evaluateAnswer(option?.label, props.question));
    }
  };

  const selectedOption =
    optionsList.find((o) => o.id === (selectedId ?? props.value)) || null;

  useEffect(() => {
    if (!optionsList.length) return;
    if (!feedbackEnabled) return;
    if (!FormUtils.hasAnswer(props.question)) return;

    const existingValue = props.value;
    if (!existingValue) return;

    const matchedOption = optionsList.find((o) => o.id === existingValue);
    if (!matchedOption) return;

    setSelectedId(matchedOption.id);
    setPreviousSelectedId(matchedOption.id);
    setFeedback(evaluateAnswer(matchedOption.label, props.question));
  }, [optionsList]);

  return (
    <FormGroup size="small" className="mb-3">
      <Form.Label>{props.label}</Form.Label>
      <IntelligentTreeSelect
        key={selectedId ?? props.value ?? "empty"}
        valueIsControlled
        optionRenderer={createOptionRenderer({
          feedback,
          previousSelectedId,
          question: props.question,
        })}
        styles={buildControlStyle(props.validation, feedback)}
        valueKey={valueKey}
        labelKey={labelKey}
        valueRenderer={(children) =>
          valueRendererWithFeedback(feedback, children)
        }
        value={selectedOption}
        multi={false}
        options={optionsList}
        isSearchable
        isLoading={isLoading}
        isClearable
        renderAsTree
        optionLeftOffset={5}
        isDisabled={
          isLoading ||
          configurationContext.componentsOptions.readOnly ||
          FormUtils.isDisabled(props.question)
        }
        onChange={handleChange}
        titleKey="description"
      />

      {props.validation?.message}
    </FormGroup>
  );
};

TypeaheadAnswer.propTypes = {
  question: PropTypes.object.isRequired,
  answer: PropTypes.object.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  title: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  validation: PropTypes.object,
  hintRevealed: PropTypes.bool,
};

export default TypeaheadAnswer;
