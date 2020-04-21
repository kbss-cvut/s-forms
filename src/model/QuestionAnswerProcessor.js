import JsonLdUtils from 'jsonld-utils';
import * as Constants from '../constants/Constants';

export default class QuestionAnswerProcessor {
  /**
   * Builds question answer model from the specified wizard data.
   * @param wizardData Global wizard data
   * @param stepData Data from individual wizard steps
   */
  static buildQuestionAnswerModel(wizardData, stepData) {
    const question = {
      subQuestions: []
    };
    let processedQuestion;
    if (wizardData) {
      question.uri = wizardData.root['@id'];
      question.origin = JsonLdUtils.getJsonAttValue(wizardData.root, Constants.HAS_QUESTION_ORIGIN, '@id');
    }
    if (stepData) {
      for (let i = 0; i < stepData.length; i++) {
        // This will skip questions corresponding to empty steps in the wizard
        processedQuestion = QuestionAnswerProcessor.processQuestionAnswerHierarchy(stepData[i]);
        if (processedQuestion) {
          question.subQuestions.push(processedQuestion);
        }
      }
    }
    return question;
  }

  /**
   * Transforms the QA hierarchy from JSON-LD-based structure to the object model-based one.
   * @param rootQuestion
   */
  static processQuestionAnswerHierarchy(rootQuestion) {
    if (!rootQuestion) {
      return null;
    }
    return QuestionAnswerProcessor._processQuestion(rootQuestion);
  }

  static _processQuestion(question) {
    const result = {};

    result.uri = question['@id'];
    result.origin = JsonLdUtils.getJsonAttValue(question, Constants.HAS_QUESTION_ORIGIN, '@id');
    if (question[Constants.HAS_SUBQUESTION]) {
      result.subQuestions = [];
      for (let i = 0; i < question[Constants.HAS_SUBQUESTION].length; i++) {
        result.subQuestions.push(QuestionAnswerProcessor._processQuestion(question[Constants.HAS_SUBQUESTION][i]));
      }
    }
    if (question[Constants.HAS_ANSWER]) {
      result.answers = [];
      if (!Array.isArray(question[Constants.HAS_ANSWER])) {
        question[Constants.HAS_ANSWER] = [question[Constants.HAS_ANSWER]];
      }
      for (let i = 0; i < question[Constants.HAS_ANSWER].length; i++) {
        result.answers.push(QuestionAnswerProcessor.processAnswer(question[Constants.HAS_ANSWER][i]));
      }
    }
    return result;
  }

  static processAnswer(answer) {
    const result = {};
    result.uri = answer['@id'];
    result.origin = JsonLdUtils.getJsonAttValue(answer, Constants.HAS_ANSWER_ORIGIN, '@id');
    if (answer[Constants.HAS_OBJECT_VALUE]) {
      result.codeValue = JsonLdUtils.getJsonAttValue(answer, Constants.HAS_OBJECT_VALUE, '@id');
    } else {
      result.textValue = JsonLdUtils.getJsonAttValue(answer, Constants.HAS_DATA_VALUE);
    }
    return result;
  }

  /**
   * Generates an empty answer for the specified question
   * @param question
   */
  static generateAnswer(question) {
    const answer = {};
    answer[Constants.HAS_DATA_VALUE] = '';
    return answer;
  }
}
