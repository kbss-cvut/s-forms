import * as Constants from '../constants/Constants';

export default class DefaultFormGenerator {
  /**
   * Generates default form for the wizard framework.
   *
   * The form consists of a single step, which contains one text area for the description.
   *
   * @param rootQuestion Optional, contains root question with data for the default form template
   */
  static generateForm(rootQuestion) {
    let formTemplate = require('./defaultForm');
    // Deep copy of the form template to prevent modifications
    formTemplate = JSON.parse(JSON.stringify(formTemplate));
    if (!rootQuestion) {
      return formTemplate;
    }
    const form = formTemplate['@graph'][0];
    const formStep = form[Constants.HAS_SUBQUESTION][0];
    const stepQuestion = formStep[Constants.HAS_SUBQUESTION][0];
    const questionAnswer = stepQuestion[Constants.HAS_ANSWER];

    const step = rootQuestion.subQuestions ? rootQuestion.subQuestions[0] : null;
    form['@id'] = rootQuestion.uri;
    if (!step) {
      return formTemplate;
    }
    formStep['@id'] = step.uri;
    const question = step.subQuestions ? step.subQuestions[0] : null;
    if (!question) {
      return formTemplate;
    }
    stepQuestion['@id'] = question.uri;
    const answer = question.answers ? question.answers[0] : {};
    if (answer) {
      questionAnswer['@id'] = answer.uri;
      questionAnswer[Constants.HAS_DATA_VALUE] = answer.textValue;
    }
    return formTemplate;
  }
}
