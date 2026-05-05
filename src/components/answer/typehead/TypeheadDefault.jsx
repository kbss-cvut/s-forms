import React from "react";
import PropTypes from "prop-types";

import { FormGroup, Form } from "react-bootstrap";
import { IntelligentTreeSelect } from "intelligent-tree-select/lib/components/IntelligentTreeSelect";

import Constants from "../../../constants/Constants";
import FormUtils from "../../../util/FormUtils";
import TypeaheadWithFeedback from "./TypeaheadWithFeedback.jsx";
import { buildControlStyle } from "./typeahead.renderers.jsx";

const noLinksValueRenderer = (children) => <>{children}</>;

const TypeaheadDefault = (props) => {
  const handleChange = (option) => {
    props.onChange(option ? option.id : null);
  };

  return (
    <FormGroup size="small" className="mb-3">
      <Form.Label>{props.label}</Form.Label>
      <IntelligentTreeSelect
        valueKey={props.valueKey}
        labelKey={props.labelKey}
        styles={buildControlStyle()}
        value={props.optionsList.find((o) => o.id === props.value) || null}
        options={props.optionsList}
        multi={false}
        isSearchable={true}
        isLoading={props.isLoading}
        isClearable={true}
        renderAsTree={true}
        optionLeftOffset={5}
        valueRenderer={
          props.question[Constants.PROVIDES_DEREFERENCEABLE_ANSWER_VALUES] ===
          false
            ? noLinksValueRenderer
            : null
        }
        isDisabled={
          props.isLoading ||
          props.configurationContext.componentsOptions.readOnly ||
          FormUtils.isDisabled(props.question)
        }
        onChange={handleChange}
        titleKey="description"
      />

      {props.validation?.message}
    </FormGroup>
  );
};

TypeaheadWithFeedback.propTypes = {
  question: PropTypes.object.isRequired,
  answer: PropTypes.object.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  validation: PropTypes.object,
};

export default TypeaheadDefault;
