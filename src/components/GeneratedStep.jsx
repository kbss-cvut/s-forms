import React from 'react';
import PropTypes from 'prop-types';
import Question from './Question';
import { WizardContext } from '../contexts/WizardContext';

const GeneratedStep = (props) => {
  const wizardContext = React.useContext(WizardContext);

  const onChange = (index, change) => {
    wizardContext.updateStepData(props.stepIndex, { ...question, ...change });
  };

  const question = wizardContext.getStepData(props.stepIndex);

  return <Question question={question} onChange={onChange} withoutCard={true} />;
};

GeneratedStep.propTypes = {
  stepIndex: PropTypes.number.isRequired
};

export default GeneratedStep;
