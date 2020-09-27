import React from 'react';
import QuestionAnswerProcessor from '../model/QuestionAnswerProcessor';
import { WizardContext } from '../contexts/WizardContext';
import Wizard from './wizard/Wizard';
import { FormUtils } from '../s-forms';
import Question from './Question';

class FormManager extends React.Component {
  getFormData = () => {
    const data = this.context.getData();
    const stepData = this.context.getStepData();

    return QuestionAnswerProcessor.buildQuestionAnswerModel(data, stepData);
  };

  onStepChange = (question, index, change) => {
    this.context.updateStepData(index, { ...question, ...change });
  };

  render() {
    const stepData = this.context.getStepData();

    if (stepData.every((step) => !FormUtils.isWizardStep(step))) {
      return (
        <div className="p-4">
          {stepData.map((question, index) => (
            <Question
              key={question['@id']}
              question={question}
              onChange={(index, change) => this.onStepChange(question, index, change)}
              index={index}
            />
          ))}
        </div>
      );
    }

    return <Wizard {...this.props} />;
  }
}

FormManager.contextType = WizardContext;

export default FormManager;
