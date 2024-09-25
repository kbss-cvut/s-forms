import React, { useState, useEffect, useContext } from "react";
import * as JsonLdUtils from "jsonld-utils";
import PropTypes from "prop-types";
import Constants from "../../constants/Constants";
import FormUtils from "../../util/FormUtils";
import Utils from "../../util/Utils";
import JsonLdObjectUtils from "../../util/JsonLdObjectUtils";
import Logger from "../../util/Logger";
import { FormGroup, Form } from "react-bootstrap";
import { FormGenContext } from "../../contexts/FormGenContext";
import { ConfigurationContext } from "../../contexts/ConfigurationContext";
import { IntelligentTreeSelect } from "intelligent-tree-select/lib/components/IntelligentTreeSelect.js";

import "intelligent-tree-select/lib/styles.css";

const processTypeaheadOptions = (options, intl) => {
  if (!options || !options.length) {
    return [];
  }

  // sort by label
  options.sort(JsonLdObjectUtils.getCompareLocalizedLabelFunction(intl));

  // sort by property
  JsonLdObjectUtils.orderPreservingToplogicalSort(
    options,
    Constants.HAS_PRECEDING_VALUE
  );

  return options;
};

const TypeaheadAnswer = (props) => {
  const queryHash = Utils.getStringHash(
    FormUtils.getPossibleValuesQuery(props.question)
  );

  const formGenContext = useContext(FormGenContext);
  const configurationContext = useContext(ConfigurationContext);

  const intl = configurationContext.options.intl;

  const [isLoading, setLoading] = useState(true);
  const [optionsList, setOptionsList] = useState([
    processTypeaheadOptions(props.options, intl),
  ]);

  useEffect(() => {
    let isCancelled = false;
    const question = props.question;

    async function loadFormOptions() {
      try {
        const options = await formGenContext.loadFormOptions(
          queryHash,
          FormUtils.getPossibleValuesQuery(question)
        );
        if (!isCancelled) {
          setLoading(false);
          generateTreeOptions(options);
        }
      } catch (error) {
        Logger.error(
          `An error has occurred during loadFormOptions for query hash: ${queryHash}`
        );
      }
    }

    if (
      !question[Constants.HAS_OPTION] &&
      FormUtils.getPossibleValuesQuery(question)
    ) {
      loadFormOptions();
    } else {
      setLoading(false);
      generateTreeOptions(question[Constants.HAS_OPTION]);
    }

    return () => {
      isCancelled = true;
    };
  }, []);

  const generateTreeOptions = (possibleValues) => {
    if (!possibleValues) {
      return [];
    }

    //Sort values
    possibleValues = processTypeaheadOptions(possibleValues, intl);
    const options = {};
    const relations = [];

    for (let pValue of possibleValues) {
      let label = JsonLdUtils.getLocalized(pValue[Constants.RDFS_LABEL], intl);
      let comment = JsonLdUtils.getLocalized(
        pValue[Constants.RDFS_COMMENT],
        intl
      );

      options[pValue["@id"]] = {
        id: pValue["@id"],
        value: pValue["@id"],
        label: label,
        title: comment,
        children: [],
      };
      for (let parent of Utils.asArray(pValue[Constants.BROADER])) {
        relations.push({
          type: "parent-child",
          parent: parent["@id"],
          child: pValue["@id"],
          title: comment,
        });
      }
    }

    for (let relation of relations) {
      if (relation.type === "parent-child") {
        options[relation.parent]?.children.push(relation.child);
      }
    }

    const optionsTree = Object.values(options);
    setOptionsList(optionsTree);
  };

  const handleOptionSelectedChange = (option) => {
    props.onChange(option ? option.id : null);
  };

  const noLinksValueRenderer = (children) => <>{children}</>;

  const valueKey = Utils.findKeyInObjects(optionsList, ["name", "value"]);
  const labelKey = Utils.findKeyInObjects(optionsList, ["name", "label"]);

  const _getControlValidationStyle = () => {
    let borderColor;
    let boxShadow;
    if (props.validation.classname === "is-warning") {
      borderColor = "#dc9135";
      boxShadow = "0 0 0 0.2rem rgba(203, 127, 16, 0.25)";
    } else if (props.validation.classname === "is-invalid") {
      borderColor = "#dc3545";
      boxShadow = "0 0 0 .2rem rgba(220,53,69,.25)";
    }
    return {
      control: (provided) => ({
        ...provided,
        border: borderColor ? `1px solid ${borderColor}` : provided.border,
        boxShadow: provided.boxShadow,
        "&:hover": {
          border: `1px solid ${borderColor}`,
          boxShadow: boxShadow ? boxShadow : provided.boxShadow,
        },
      }),
    };
  };

  return (
    <FormGroup size="small">
      <Form.Label>{props.label}</Form.Label>
      <IntelligentTreeSelect
        styles={_getControlValidationStyle()}
        valueKey={valueKey}
        labelKey={labelKey}
        valueRenderer={
          props.question[Constants.PROVIDES_DEREFERENCEABLE_ANSWER_VALUES] ===
          false
            ? noLinksValueRenderer
            : null
        }
        valueIsControlled={true}
        value={optionsList.filter((option) => option.id === props.value)}
        multi={false}
        options={optionsList}
        isSearchable={true}
        isLoading={isLoading}
        isClearable={true}
        renderAsTree={true}
        optionLeftOffset={5}
        isDisabled={
          isLoading ||
          configurationContext.componentsOptions.readOnly ||
          FormUtils.isDisabled(props.question)
        }
        onChange={handleOptionSelectedChange}
      />
      {props.validation.message}
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
};

export default TypeaheadAnswer;
