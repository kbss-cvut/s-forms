import React, { forwardRef, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import FormGenerator from "../model/FormGenerator.js";
import FormUtils from "../util/FormUtils.js";
import { Card } from "react-bootstrap";
import { ConfigurationContextProvider } from "../contexts/ConfigurationContext.js";
import ErrorBoundaries from "./ErrorBoundary.jsx";
import { FormGenContextProvider } from "../contexts/FormGenContext.js";
import { FormQuestionsProvider } from "../contexts/FormQuestionsContext.js";
import FormManager from "./FormManager.jsx";
import PropTypes from "prop-types";

const SFormsInner = forwardRef((props, ref) => {
  const [loading, setLoading] = useState(true);
  const [formProperties, setFormProperties] = useState(null);
  const [form, setForm] = useState(null);
  const intl = useIntl();

  useEffect(() => {
    const initialiseSForms = async () => {
      const [formProperties, structure] = await FormGenerator.constructForm(
        props.form,
        intl
      );

      if (
        formProperties.formQuestions.some((step) =>
          FormUtils.isWizardStep(step)
        )
      ) {
        formProperties.formQuestions[0].visited = true;
      }

      setFormProperties(formProperties);
      setForm(structure);
      setLoading(false);
    };

    initialiseSForms();
  }, [props.form, intl]);

  if (loading) {
    return (
      props.loader || <Card className="p-3 font-italic">Loading SForms...</Card>
    );
  }

  const _getComponentMappingFunction = (components, form) => {
    return (question, defaultComponent) => {
      if (!components) {
        return defaultComponent;
      }

      for (let { component, mapRule } of components) {
        if (mapRule(question, form)) {
          return component;
        }
      }

      return defaultComponent;
    };
  };

  const _mapComponent = _getComponentMappingFunction(
    props.componentMapRules,
    form
  );

  return (
    <ConfigurationContextProvider
      components={props.components}
      componentsOptions={props.componentsOptions}
      mapComponent={_mapComponent}
      options={props.options}
    >
      <ErrorBoundaries>
        <FormGenContextProvider
          fetchTypeAheadValues={props.fetchTypeAheadValues}
        >
          <FormQuestionsProvider
            data={form}
            formQuestions={formProperties.formQuestions}
            isFormValid={props.isFormValid}
          >
            <FormManager
              ref={ref}
              modalView={props.options && props.options.modalView}
              mapComponent={_mapComponent}
            />
          </FormQuestionsProvider>
        </FormGenContextProvider>
      </ErrorBoundaries>
    </ConfigurationContextProvider>
  );
});

SFormsInner.propTypes = {
  form: PropTypes.object.isRequired,
  options: PropTypes.object.isRequired,
  componentMapRules: PropTypes.array,
  components: PropTypes.object,
  componentsOptions: PropTypes.object,
  fetchTypeAheadValues: PropTypes.func,
  isFormValid: PropTypes.func,
  loader: PropTypes.element,
};

export default SFormsInner;
