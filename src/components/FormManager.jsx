import React from 'react';
import QuestionAnswerProcessor from '../model/QuestionAnswerProcessor';
import { FormQuestionsContext } from '../contexts/FormQuestionsContext';
import Wizard from './wizard/Wizard';
import { FormUtils } from '../s-forms';
import Question from './Question';
import FormWindow from './FormWindow';
import Card from 'react-bootstrap/Card';
import JsonLdUtils from 'jsonld-utils';
import Constants from '../constants/Constants';
import CompositeQuestion from './CompositeQuestion';

class FormManager extends React.Component {
  getFormData = () => {
    const data = this.context.getData();
    const formQuestionsData = this.context.getFormQuestionsData();

    return QuestionAnswerProcessor.buildQuestionAnswerModel(data, formQuestionsData);
  };

  getFormQuestionsData = () => {
    return this.context.getFormQuestionsData();
  };

  onStepChange = (question, index, change) => {
    this.context.updateFormQuestionsData(index, { ...question, ...change });
  };

  renderWizardlessForm = () => {
    const formQuestionsData = this.context.getFormQuestionsData();

    return (
      <Card className="p-3">
        {formQuestionsData.map((q, i) => this._mapQuestion(q, i))}
      </Card>
    );
  };

  _mapQuestion(question, index) {

    if (JsonLdUtils.getJsonAttValue(question, Constants.COMPOSITE_PATTERN)) {
      return (<CompositeQuestion
        key={question['@id']}
        question={question}
        onChange={(index, change) => this.onStepChange(question, index, change)}
        index={index}
      />);
    }

    return (<Question
      key={question['@id']}
      question={question}
      onChange={(index, change) => this.onStepChange(question, index, change)}
      index={index}
    />);
  }

  render() {
    const { modalView } = this.props;

    const formQuestionsData = this.context.getFormQuestionsData();

    if (!formQuestionsData.length) {
      return <Card className="p-3 font-italic">There are no questions available...</Card>;
    }

    const isWizardless = formQuestionsData.every((question) => !FormUtils.isWizardStep(question));

    if (modalView) {
      return <FormWindow>{isWizardless ? this.renderWizardlessForm() : <Wizard />}</FormWindow>;
    }

    return isWizardless ? this.renderWizardlessForm() : <Wizard />;
  }
}

FormManager.contextType = FormQuestionsContext;

export default FormManager;
