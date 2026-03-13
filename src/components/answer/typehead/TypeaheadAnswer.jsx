import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";

import Constants from "../../../constants/Constants";
import FormUtils from "../../../util/FormUtils";
import Utils from "../../../util/Utils";
import Logger from "../../../util/Logger";

import { FormGenContext } from "../../../contexts/FormGenContext";
import { ConfigurationContext } from "../../../contexts/ConfigurationContext";

import { useIntl } from "react-intl";

import { buildOptionsTree } from "./typeahead.utils";

import TypeaheadDefault from "./TypeheadDefault";
import TypeaheadWithFeedback from "./TypeaheadWithFeedback";
import "intelligent-tree-select/lib/styles.css";

const TypeaheadAnswer = (props) => {
  const intl = useIntl();

  const formGenContext = useContext(FormGenContext);
  const configurationContext = useContext(ConfigurationContext);

  const queryHash = Utils.getStringHash(
    FormUtils.getPossibleValuesQuery(props.question)
  );

  const [isLoading, setLoading] = useState(true);
  const [optionsList, setOptionsList] = useState([]);

  const learningEnabled = Utils.isOptionQuestionFeedbackEnabled(
    configurationContext?.options
  );

  useEffect(() => {
    let isCancelled = false;

    async function loadOptions() {
      try {
        const options = await formGenContext.loadFormOptions(
          queryHash,
          FormUtils.getPossibleValuesQuery(props.question)
        );

        if (!isCancelled) {
          setOptionsList(buildOptionsTree(options, intl));
          setLoading(false);
        }
      } catch (error) {
        Logger.error(
          `Typeahead: options loading failed for query hash ${queryHash}`
        );
      }
    }

    if (
      !props.question[Constants.HAS_OPTION] &&
      FormUtils.getPossibleValuesQuery(props.question)
    ) {
      loadOptions();
    } else {
      setOptionsList(
        buildOptionsTree(props.question[Constants.HAS_OPTION], intl)
      );
      setLoading(false);
    }

    return () => {
      isCancelled = true;
    };
  }, [queryHash, formGenContext, props.question, intl]);

  const valueKey = Utils.findKeyInObjects(optionsList, ["name", "value"]);
  const labelKey = Utils.findKeyInObjects(optionsList, ["name", "label"]);

  const sharedProps = {
    ...props,
    optionsList,
    valueKey,
    labelKey,
    isLoading,
    configurationContext,
  };

  if (learningEnabled) {
    return <TypeaheadWithFeedback {...sharedProps} />;
  }

  return <TypeaheadDefault {...sharedProps} />;
};

TypeaheadAnswer.propTypes = {
  question: PropTypes.object.isRequired,
  answer: PropTypes.object.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  validation: PropTypes.object,
  hintRevealed: PropTypes.bool,
};

export default TypeaheadAnswer;
