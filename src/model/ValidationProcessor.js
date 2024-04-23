import Constants from "../constants/Constants";
import { createValidator } from "./ValidatorFactory.js";
import Utils from "../util/Utils.js";

export default class ValidationProcessor {
  /**
   * Updates the validation status of a question within an array of questions.
   * @param {Array} questions - The array of questions to update.
   * @param {Object} question - The question object to validate and update.
   * @param {number} index - The index of the question in the array.
   * @param {Object} intl - The object used for internationalization.
   */
  static updateQuestionValidation = (questions, question, index, intl) => {
    if (question[Constants.HAS_ANSWER]) {
      const validator = createValidator(question, intl);
      const update = validator();

      if (update) {
        questions[index] = { ...question, ...update };
      }
    }
    for (const question of questions) {
      this.updateSubQuestionsValidation(question, intl);
    }
  };

  /**
   * Updates the validation status of sub-questions within a parent question.
   * @param {Object} question - The parent question object containing sub-questions.
   * @param {Object} intl - The object used for internationalization.
   */
  static updateSubQuestionsValidation = (question, intl) => {
    const subQuestions = Utils.asArray(question[Constants.HAS_SUBQUESTION]);
    for (let index = 0; index < subQuestions.length; index++) {
      const subQuestion = subQuestions[index];
      this.updateQuestionValidation(subQuestions, subQuestion, index, intl);
    }
  };
}
