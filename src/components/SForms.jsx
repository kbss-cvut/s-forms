import React, { forwardRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormGenContextProvider } from '../contexts/FormGenContext';
import { WizardContextProvider } from '../contexts/WizardContext';
import { ConfigurationContextProvider } from '../contexts/ConfigurationContext';
import Wizard from './wizard/Wizard';
import WizardWindow from './wizard/WizardWindow';
import WizardGenerator from '../model/WizardGenerator';

const SForms = forwardRef((props, ref) => {
  const [loading, setLoading] = useState(true);
  const [wizardProperties, setWizardProperties] = useState(null);
  const [form, setForm] = useState(null);

  useEffect(() => {
    const buildWizard = async () => {
      const intl = props.options.intl;
      const [wizardProperties, structure] = await WizardGenerator.createWizard(props.form, props.formData, null, intl);

      if (wizardProperties.steps.length > 0) {
        wizardProperties.steps[0].visited = true;
      }

      setWizardProperties(wizardProperties);
      setForm(structure);
      setLoading(false);
    };

    buildWizard();
  }, []);

  if (loading) {
    return props.loader || <div>'Loading SForms...'</div>;
  }

  return (
    <ConfigurationContextProvider
      components={props.components}
      componentsOptions={props.componentsOptions}
      options={props.options}
    >
      <FormGenContextProvider fetchTypeAheadValues={props.fetchTypeAheadValues}>
        <WizardContextProvider data={form} steps={wizardProperties.steps} isFormValid={props.isFormValid}>
          {props.modalView ? <WizardWindow {...props} ref={ref} /> : <Wizard {...props} ref={ref} />}
        </WizardContextProvider>
      </FormGenContextProvider>
    </ConfigurationContextProvider>
  );
});

SForms.defaultProps = {
  modalView: false
};

SForms.propTypes = {
  form: PropTypes.object.isRequired,
  formData: PropTypes.object,
  options: PropTypes.object.isRequired,
  components: PropTypes.object,
  componentsOptions: PropTypes.object,
  fetchTypeAheadValues: PropTypes.func,
  isFormValid: PropTypes.func,
  modalView: PropTypes.bool,
  modalProps: PropTypes.object,
  loader: PropTypes.element
};

export default SForms;
