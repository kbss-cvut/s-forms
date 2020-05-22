import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { FormGenContextProvider } from '../contexts/FormGenContext';
import { WizardContextProvider } from '../contexts/WizardContext';
import { ConfigurationContextProvider } from '../contexts/ConfigurationContext';
import Wizard from './wizard/Wizard';
import WizardWindow from './wizard/WizardWindow';

const SForms = forwardRef((props, ref) => (
  <ConfigurationContextProvider
    components={props.components}
    componentsOptions={props.componentsOptions}
    options={props.options}
  >
    <FormGenContextProvider fetchTypeAheadValues={props.fetchTypeAheadValues}>
      <WizardContextProvider {...props}>
        {props.modalView ? <WizardWindow {...props} ref={ref} /> : <Wizard {...props} ref={ref} />}
      </WizardContextProvider>
    </FormGenContextProvider>
  </ConfigurationContextProvider>
));

SForms.defaultProps = {
  modalView: false
};

SForms.propTypes = {
  start: PropTypes.number,
  steps: PropTypes.array,
  onFinish: PropTypes.func,
  onClose: PropTypes.func,
  enableForwardSkip: PropTypes.bool,
  onHide: PropTypes.func,
  show: PropTypes.bool,
  title: PropTypes.string,
  isFormValid: PropTypes.func,
  modalView: PropTypes.bool
};

export default SForms;
