import React, { forwardRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormGenContextProvider } from '../contexts/FormGenContext';
import { FormQuestionsProvider } from '../contexts/FormQuestionsContext';
import { ConfigurationContextProvider } from '../contexts/ConfigurationContext';
import FormGenerator from '../model/FormGenerator';
import FormManager from './FormManager';
import { FormUtils } from '../s-forms';
import { Card } from 'react-bootstrap';

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
  }, []);

  if (loading) {
    return props.loader || <Card className="p-3 font-italic">Loading SForms...</Card>;
  }

  return (
    <ConfigurationContextProvider
      components={props.components}
      componentsOptions={props.componentsOptions}
      options={props.options}
    >
      <FormGenContextProvider fetchTypeAheadValues={props.fetchTypeAheadValues}>
        <FormQuestionsProvider data={form} formQuestions={formProperties.formQuestions} isFormValid={props.isFormValid}>
          <FormManager ref={ref} modalView={props.options && props.options.modalView} />
        </FormQuestionsProvider>
      </FormGenContextProvider>
    </ConfigurationContextProvider>
  );
});

SForms.propTypes = {
  form: PropTypes.object.isRequired,
  options: PropTypes.object.isRequired,
  components: PropTypes.object,
  componentsOptions: PropTypes.object,
  fetchTypeAheadValues: PropTypes.func,
  isFormValid: PropTypes.func,
  loader: PropTypes.element
};

export default SForms;
