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

    return (answer) => {
      if (FormUtils.hasValidationLogic(question)) {
        const answerValue = this._getAnswerValue(answer);
        return this._validateAnswer(question, intl, answerValue, validators);
      }
    };
  }

  static _isQuestionAnswered(answerValue) {
    return (
      answerValue !== null && answerValue !== undefined && answerValue !== ""
    );
  }

  static _isCheckboxAnswered(answerValue) {
    return (
      answerValue !== null &&
      answerValue !== undefined &&
      answerValue !== "" &&
      answerValue !== false
    );
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
    return result;
  }

  static _patternValidator(question, intl, answerValue) {
    if (answerValue && answerValue.length > 0) {
      if (question[Constants.PATTERN]) {
        let pattern = question[Constants.PATTERN];
        const regExp = new RegExp(pattern);
        const isValid =
          regExp.test(answerValue) ||
          !ValidatorFactory._isQuestionAnswered(answerValue);
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

  static _requiredValidator(question, intl, answerValue) {
    if (
      question[Constants.REQUIRES_ANSWER] &&
      !question[Constants.USED_ONLY_FOR_COMPLETENESS]
    ) {
      const isValid = ValidatorFactory._isQuestionAnswered(answerValue);
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

  static _checkboxValidator(question, intl, answerValue) {
    if (FormUtils.isCheckbox(question)) {
      if (question[Constants.REQUIRES_ANSWER]) {
        const isValid = ValidatorFactory._isCheckboxAnswered(answerValue);
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

  static _completenessValidator(question, intl, answerValue) {
    if (
      question[Constants.REQUIRES_ANSWER] &&
      question[Constants.USED_ONLY_FOR_COMPLETENESS]
    ) {
      const isValid = ValidatorFactory._isQuestionAnswered(answerValue);
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

  static _getAnswerValue(answer) {
    let val = null;
    if (answer[Constants.HAS_DATA_VALUE]) {
      val = JsonLdUtils.getJsonAttValue(answer, Constants.HAS_DATA_VALUE);
    } else if (answer[Constants.HAS_OBJECT_VALUE]) {
      val = JsonLdUtils.getJsonAttValue(
        answer,
        Constants.HAS_OBJECT_VALUE,
        "@id"
      );
    }
    return val;
  }
}
