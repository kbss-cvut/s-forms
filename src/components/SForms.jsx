import React, { forwardRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormGenContextProvider } from '../contexts/FormGenContext';
import { FormQuestionsProvider } from '../contexts/FormQuestionsContext';
import { ConfigurationContextProvider } from '../contexts/ConfigurationContext';
import FormGenerator from '../model/FormGenerator';
import FormManager from './FormManager';
import { Card } from 'react-bootstrap';
import FormUtils from "../util/FormUtils.js";

import "../styles/s-forms.css";

const SForms = forwardRef((props, ref) => {
  const [loading, setLoading] = useState(true);
  const [formProperties, setFormProperties] = useState(null);
  const [form, setForm] = useState(null);

  useEffect(() => {
    const initialiseSForms = async () => {
      const intl = props.options.intl;
      const [formProperties, structure] = await FormGenerator.constructForm(props.form, intl);

      if (formProperties.formQuestions.some((step) => FormUtils.isWizardStep(step))) {
        formProperties.formQuestions[0].visited = true;
      }

      setFormProperties(formProperties);
      setForm(structure);
      setLoading(false);
    };

    initialiseSForms();
  }, [props.form]);

  if (loading) {
    return props.loader || <Card className="p-3 font-italic">Loading SForms...</Card>;
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

  const _mapComponent = _getComponentMappingFunction(props.componentMapRules, form);

  return (
    <ConfigurationContextProvider
      components={props.components}
      componentsOptions={props.componentsOptions}
      mapComponent={_mapComponent}
      options={props.options}
    >
      <FormGenContextProvider fetchTypeAheadValues={props.fetchTypeAheadValues}>
        <FormQuestionsProvider data={form} formQuestions={formProperties.formQuestions} isFormValid={props.isFormValid}>
          <FormManager ref={ref} modalView={props.options && props.options.modalView} mapComponent={_mapComponent} />
        </FormQuestionsProvider>
      </FormGenContextProvider>
    </ConfigurationContextProvider>
  );
});

SForms.propTypes = {
  form: PropTypes.object.isRequired,
  options: PropTypes.object.isRequired,
  componentMapRules: PropTypes.array,
  components: PropTypes.object,
  componentsOptions: PropTypes.object,
  fetchTypeAheadValues: PropTypes.func,
  isFormValid: PropTypes.func,
  loader: PropTypes.element
};

export default SForms;
