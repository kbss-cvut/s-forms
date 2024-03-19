/**
 * Created by blcha on 4.11.16.
 */

import * as JsonLdUtils from "jsonld-utils";

import Constants from "../constants/Constants";
import FormUtils from "../util/FormUtils";

export default class ValidatorFactory {
  static createValidator(question, intl) {
    const validators = [
      this._patternValidator,
      this._checkboxValidator,
      this._requiredValidator,
      this._completenessValidator,
    ];

    return () => {
      if (FormUtils.hasValidationLogic(question)) {
        const answerValue = FormUtils.getAnswerValue(question);
        return this._validateAnswer(question, intl, answerValue, validators);
      }
    };
  }

  static _validateAnswer(question, intl, answerValue, validators) {
    const result = {};
    for (const validator of validators) {
      const validationResult = validator(question, intl, answerValue);
      if (!validationResult.isValid) {
        result[Constants.HAS_VALID_ANSWER] = false;
        result[Constants.HAS_VALIDATION_MESSAGE] = validationResult.message;
        result[Constants.HAS_VALIDATION_SEVERITY] =
          validationResult.validationSeverity;
        return result;
      }
      if (result[Constants.HAS_VALID_ANSWER] === false) {
        break;
      }
    }
    result[Constants.HAS_VALID_ANSWER] = true;
    result[Constants.HAS_VALIDATION_MESSAGE] = "";
    result[Constants.HAS_VALIDATION_SEVERITY] = "";
    return result;
  }

  static _patternValidator(question, intl, answerValue) {
    if (answerValue && answerValue.length > 0) {
      if (question[Constants.PATTERN]) {
        let pattern = question[Constants.PATTERN];
        const regExp = new RegExp(pattern);
        const isValid =
          regExp.test(answerValue) || !FormUtils.hasAnswer(question);
        if (!isValid) {
          return {
            isValid: false,
            validationSeverity: Constants.VALIDATION_SEVERITY.ERROR,
            message: question[Constants.HAS_VALIDATION_MESSAGE]
              ? question[Constants.HAS_VALIDATION_MESSAGE]
              : "Please enter a valid answer to " +
                JsonLdUtils.getLocalized(
                  question[JsonLdUtils.RDFS_LABEL],
                  intl
                ),
          };
        }
      }
    }
    return { isValid: true };
  }

  static _requiredValidator(question, intl) {
    if (
      question[Constants.REQUIRES_ANSWER] &&
      !question[Constants.USED_ONLY_FOR_COMPLETENESS]
    ) {
      const isValid = FormUtils.hasAnswer(question);
      if (!isValid) {
        return {
          isValid: false,
          validationSeverity: Constants.VALIDATION_SEVERITY.ERROR,
          message:
            JsonLdUtils.getLocalized(question[JsonLdUtils.RDFS_LABEL], intl) +
            " is required",
        };
      }
    }
    return { isValid: true };
  }

  static _checkboxValidator(question, intl) {
    if (FormUtils.isCheckbox(question)) {
      if (question[Constants.REQUIRES_ANSWER]) {
        const isValid = FormUtils.hasAnswer(question);
        if (!isValid) {
          return {
            isValid: false,
            validationSeverity: Constants.VALIDATION_SEVERITY.ERROR,
            message:
              JsonLdUtils.getLocalized(question[JsonLdUtils.RDFS_LABEL], intl) +
              " must be checked",
          };
        }
      }
    }
    return { isValid: true };
  }

  static _completenessValidator(question, intl) {
    if (
      question[Constants.REQUIRES_ANSWER] &&
      question[Constants.USED_ONLY_FOR_COMPLETENESS]
    ) {
      const isValid = FormUtils.hasAnswer(question);
      if (!isValid) {
        return {
          isValid: false,
          validationSeverity: Constants.VALIDATION_SEVERITY.WARNING,
          message:
            JsonLdUtils.getLocalized(question[JsonLdUtils.RDFS_LABEL], intl) +
            " should be filled to complete the form.",
        };
      }
    }
    return { isValid: true };
  }

  /**
   * Updates the validation status of a question within an array of questions.
   * @param {Array} questions - The array of questions to update.
   * @param {Object} question - The question object to validate and update.
   * @param {number} index - The index of the question in the array.
   * @param {Object} intl - The object used for internationalization.
   */
  static updateQuestionValidation = (questions, question, index, intl) => {
    if (question[Constants.HAS_ANSWER]) {
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
      question[Constants.HAS_SUBQUESTION] &&
      question[Constants.HAS_SUBQUESTION].length > 0
    ) {
      const subQuestions = question[Constants.HAS_SUBQUESTION];

      for (let j = 0; j < subQuestions.length; j++) {
        const subQuestion = subQuestions[j];
        this.updateQuestionValidation(subQuestions, subQuestion, j, intl);
      }
    }
  };
}
