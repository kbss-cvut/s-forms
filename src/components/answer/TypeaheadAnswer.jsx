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

  return JsonLdUtils.processTypeaheadOptions(options, intl);
};

const TypeaheadAnswer = (props) => {
  const queryHash = Utils.getStringHash(
    FormUtils.getPossibleValuesQuery(props.question)
  );

  const formGenContext = useContext(FormGenContext);
  const configurationContext = useContext(ConfigurationContext);

  const intl = configurationContext.options.intl;

  const [isLoading, setLoading] = useState(true);
  const [optionsList, setOptionsList] = useState(
    processTypeaheadOptions(props.options, intl)
  );

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
          setOptionsList(processTypeaheadOptions(options, intl));
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
      setOptionsList(
        processTypeaheadOptions(question[Constants.HAS_OPTION], intl)
      );
    }

    return () => {
      isCancelled = true;
    };
  }, []);

  const checkNonSelectableOptions = (tree) => {
    const question = props.question;

    for (let o of Object.values(tree)) {
      if (
        JsonLdUtils.hasValue(
          question,
          Constants.HAS_NON_SELECTABLE_VALUE,
          o.value
        )
      ) {
        o.isDisabled = true;
      }
    }
  };

  const generateOptions = () => {
    const question = props.question;
    const possibleValues = question[Constants.HAS_OPTION];
    if (!possibleValues || !possibleValues.length) {
      return [];
    }

    const options = {};
    const relations = [];

    for (let pValue of possibleValues) {
      let label = JsonLdUtils.getLocalized(
        pValue[Constants.RDFS_LABEL],
        configurationContext.options.intl
      );

      options[pValue["@id"]] = {
        value: pValue["@id"],
        label: label,
        children: [],
        disjoint: [],
      };
      for (let parent of Utils.asArray(pValue[Constants.BROADER])) {
        relations.push({
          type: "parent-child",
          parent: parent["@id"],
          child: pValue["@id"],
        });
      }
    }

    for (let relation of relations) {
      if (relation.type === "parent-child") {
        options[relation.parent]?.children.push(relation.child);
      }
    }

    checkNonSelectableOptions(options);
    setOptionsList(Object.values(options));
  };

  useEffect(() => {
    generateOptions();
  }, []);

  const handleOptionSelectedChange = (option) => {
    props.onChange(option ? option.id : null);
  };

  const valueKey = Utils.findKeyInObjects(optionsList, ["name", "value"]);
  const labelKey = Utils.findKeyInObjects(optionsList, ["name", "label"]);

  return (
    <FormGroup size="small">
      <Form.Label>{props.label}</Form.Label>
      <IntelligentTreeSelect
        valueKey={valueKey}
        labelKey={labelKey}
        valueIsControlled={false}
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
};

export default TypeaheadAnswer;
