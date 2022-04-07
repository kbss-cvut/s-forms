import React, { useState, useEffect, useContext } from "react";
import JsonLdUtils from "jsonld-utils";
import Select, { components } from "react-select";
import PropTypes from "prop-types";
import Constants from "../../constants/Constants";
import FormUtils from "../../util/FormUtils";
import Utils from "../../util/Utils";
import JsonLdObjectUtils from "../../util/JsonLdObjectUtils";
import Logger from "../../util/Logger";
import { FormGroup, Form } from "react-bootstrap";
import { FormGenContext } from "../../contexts/FormGenContext";
import { ConfigurationContext } from "../../contexts/ConfigurationContext";
import OptimizedMenuList from "./OptimizedMenuList";

const processTypeaheadOptions = (options, intl) => {
  if (!options) {
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
  const [options, setOptions] = useState(
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
          setOptions(processTypeaheadOptions(options, intl));
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
      setOptions(processTypeaheadOptions(question[Constants.HAS_OPTION], intl));
    }

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    setOptions(
      processTypeaheadOptions(props.question[Constants.HAS_OPTION], intl)
    );
  }, [intl]);

  const handleOptionSelectedChange = (option) => {
    props.onChange(option ? option.id : null);
  };

  const { Option } = components;

  const DescriptionOption = (props) => {
    const innerProps = { ...props.innerProps, title: props.data.description };

    return (
      <Option
        {...props}
        title={props.data.description}
        innerProps={innerProps}
      />
    );
  };

  return (
    <FormGroup size="small">
      <Form.Label>{props.label}</Form.Label>
      <Select
        options={options}
        isSearchable={true}
        isLoading={isLoading}
        isClearable={true}
        isDisabled={
          isLoading ||
          configurationContext.componentsOptions.readOnly ||
          FormUtils.isDisabled(props.question)
        }
        value={options.filter((option) => option.id === props.value)}
        placeholder={""}
        getOptionLabel={(option) => option.name}
        getOptionValue={(option) => option.id}
        onChange={handleOptionSelectedChange}
        components={{ MenuList: OptimizedMenuList, Option: DescriptionOption }}
      />
    </FormGroup>
  );
};

TypeaheadAnswer.propTypes = {
  question: PropTypes.object.isRequired,
  answer: PropTypes.object.isRequired,
  label: PropTypes.object.isRequired,
  title: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default TypeaheadAnswer;
