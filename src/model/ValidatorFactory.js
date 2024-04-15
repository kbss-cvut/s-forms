/**
 * Created by blcha on 4.11.16.
 */

import * as JsonLdUtils from "jsonld-utils";

import Constants from "../constants/Constants";
import FormUtils from "../util/FormUtils";

export default class ValidatorFactory {
  static createValidator(question, intl) {
    const validators = [
      this._intMaxInclusiveValidator,
      this._intMinInclusiveValidator,
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

  static _patternValidator(question, intl) {
    const answerValue = FormUtils.getAnswerValue(question);
    if (answerValue && answerValue.length > 0) {
      if (question[Constants.PATTERN]) {
        let pattern = question[Constants.PATTERN];
        const regExp = new RegExp(pattern);
        const isValid =
          regExp.test(answerValue) || !FormUtils.hasAnswer(question);
        if (!isValid) {
          return {
            isValid: false,
            validationSeverity: Constants.VALIDATION.SEVERITY.ERROR,
            message: question[Constants.HAS_VALIDATION_MESSAGE]
              ? question[Constants.HAS_VALIDATION_MESSAGE]
              : Constants.VALIDATION.DEFAULT_MESSAGE.INVALID,
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
          validationSeverity: Constants.VALIDATION.SEVERITY.ERROR,
          message: question[Constants.HAS_VALIDATION_MESSAGE]
            ? question[Constants.HAS_VALIDATION_MESSAGE]
            : Constants.VALIDATION.DEFAULT_MESSAGE.REQUIRED,
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
            validationSeverity: Constants.VALIDATION.SEVERITY.ERROR,
            message: question[Constants.HAS_VALIDATION_MESSAGE]
              ? question[Constants.HAS_VALIDATION_MESSAGE]
              : Constants.VALIDATION.DEFAULT_MESSAGE.CHECK,
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
          validationSeverity: Constants.VALIDATION.SEVERITY.WARNING,
          message: question[Constants.HAS_VALIDATION_MESSAGE]
            ? question[Constants.HAS_VALIDATION_MESSAGE]
            : Constants.VALIDATION.DEFAULT_MESSAGE
                .REQUIRED_ONLY_FOR_COMPLETENESS,
        };
      }
    }
    return { isValid: true };
  }

  static _intMinInclusiveValidator(question, intl) {
    if (question[Constants.XSD.MIN_INCLUSIVE]) {
      const answerValue = FormUtils.getAnswerValue(question);
      if (answerValue && answerValue.length > 0) {
        const minInclusive = question[Constants.XSD.MIN_INCLUSIVE];

        const isValid =
          Number.isInteger(parseInt(answerValue)) &&
          answerValue >= minInclusive;

        if (!isValid) {
          return {
            isValid: false,
            validationSeverity: Constants.VALIDATION.SEVERITY.ERROR,
            message: question[Constants.HAS_VALIDATION_MESSAGE]
              ? question[Constants.HAS_VALIDATION_MESSAGE]
              : Constants.VALIDATION.DEFAULT_MESSAGE.GREATER_OR_EQUAL +
                minInclusive +
                ".",
          };
        }
      }
    }
    return { isValid: true };
  }

  static _intMaxInclusiveValidator(question, intl) {
    const answerValue = FormUtils.getAnswerValue(question);
    if (question[Constants.XSD.MAX_INCLUSIVE]) {
      if (answerValue && answerValue.length > 0) {
        const maxInclusive = question[Constants.XSD.MAX_INCLUSIVE];

        const isValid =
          Number.isInteger(parseInt(answerValue)) &&
          answerValue <= maxInclusive;

        if (!isValid) {
          return {
            isValid: false,
            validationSeverity: Constants.VALIDATION.SEVERITY.ERROR,
            message: question[Constants.HAS_VALIDATION_MESSAGE]
              ? question[Constants.HAS_VALIDATION_MESSAGE]
              : Constants.VALIDATION.DEFAULT_MESSAGE.LOWER_OR_EQUAL +
                maxInclusive +
                ".",
          };
        }
      }
    }
    return { isValid: true };
  }
}
