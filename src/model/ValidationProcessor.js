import Vocabulary from "../constants/Vocabulary.js";
import ValidatorFactory from "./ValidatorFactory.js";

export default class ValidationProcessor {
  /**
   * Updates the validation status of a question within an array of questions.
   * @param {Array} questions - The array of questions to update.
   * @param {Object} question - The question object to validate and update.
   * @param {number} index - The index of the question in the array.
   * @param {Object} intl - The object used for internationalization.
   */
  static updateQuestionValidation = (questions, question, index, intl) => {
    if (question[Vocabulary.HAS_ANSWER]) {
      const validator = ValidatorFactory.createValidator(question, intl);
      const update = validator();

      if (update) {
        questions[index] = { ...question, ...update };
      }
    }
  };

  /**
   * Updates the validation status of sub-questions within a parent question.
   * @param {Object} question - The parent question object containing sub-questions.
   * @param {Object} intl - The object used for internationalization.
   */
  static updateSubQuestionsValidation = (question, intl) => {
    if (
      question[Vocabulary.HAS_SUBQUESTION] &&
      question[Vocabulary.HAS_SUBQUESTION].length > 0
    ) {
      const subQuestions = question[Vocabulary.HAS_SUBQUESTION];

      for (let j = 0; j < subQuestions.length; j++) {
        const subQuestion = subQuestions[j];
        this.updateQuestionValidation(subQuestions, subQuestion, j, intl);
      }
    }
  };
}
