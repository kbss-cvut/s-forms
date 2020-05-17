import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { FormGenContextProvider } from '../../contexts/FormGenContext';
import { WizardContextProvider } from '../../contexts/WizardContext';
import Wizard from './Wizard';
import WizardWindow from './WizardWindow';
import Configuration from '../../model/Configuration';

const WizardContainer = forwardRef((props, ref) => (
  <WizardContextProvider {...props}>
    <FormGenContextProvider>
      {Configuration.modalView ? <WizardWindow {...props} ref={ref} /> : <Wizard {...props} ref={ref} />}
    </FormGenContextProvider>
  </WizardContextProvider>
));

WizardContainer.propTypes = {
  start: PropTypes.number,
  steps: PropTypes.array,
  onFinish: PropTypes.func,
  onClose: PropTypes.func,
  enableForwardSkip: PropTypes.bool,
  onHide: PropTypes.func,
  show: PropTypes.bool,
  title: PropTypes.string
};

export default WizardContainer;
