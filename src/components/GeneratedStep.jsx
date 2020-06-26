import React from 'react';
import PropTypes from 'prop-types';
import Question from './Question';
import { WizardContext } from '../contexts/WizardContext';

const GeneratedStep = (props) => {
  const wizardContext = React.useContext(WizardContext);

  const onChange = (index, change) => {
    wizardContext.updateStepData(props.stepIndex, { ...props.question, ...change });
  };

  return <Question question={props.question} onChange={onChange} withoutCard={true} />;
};

GeneratedStep.propTypes = {
  stepIndex: PropTypes.number.isRequired,
  question: PropTypes.object.isRequired
};

export default GeneratedStep;
