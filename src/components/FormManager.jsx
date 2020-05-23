import React from 'react';
import QuestionAnswerProcessor from '../model/QuestionAnswerProcessor';
import { WizardContext } from '../contexts/WizardContext';
import Wizard from './wizard/Wizard';

class FormManager extends React.Component {
  getFormData = () => {
    const data = this.context.getData();
    const stepData = this.context.getStepData();

    return QuestionAnswerProcessor.buildQuestionAnswerModel(data, stepData);
  };

  render() {
    return <Wizard {...this.props} />;
  }
}

FormManager.contextType = WizardContext;

export default FormManager;
