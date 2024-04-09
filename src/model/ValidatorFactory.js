/**
 * Created by blcha on 4.11.16.
 */

import * as JsonLdUtils from "jsonld-utils";

import Vocabulary from "../constants/Vocabulary.js";
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
        result[Vocabulary.HAS_VALID_ANSWER] = false;
        result[Vocabulary.HAS_VALIDATION_MESSAGE] = validationResult.message;
        result[Vocabulary.HAS_VALIDATION_SEVERITY] =
          validationResult.validationSeverity;
        return result;
      }
      if (result[Vocabulary.HAS_VALID_ANSWER] === false) {
        break;
      }
    }
    result[Vocabulary.HAS_VALID_ANSWER] = true;
    result[Vocabulary.HAS_VALIDATION_MESSAGE] = "";
    result[Vocabulary.HAS_VALIDATION_SEVERITY] = "";
    return result;
  }

  static _patternValidator(question, intl) {
    const answerValue = FormUtils.getAnswerValue(question);
    if (answerValue && answerValue.length > 0) {
      if (question[Vocabulary.PATTERN]) {
        let pattern = question[Vocabulary.PATTERN];
        const regExp = new RegExp(pattern);
        const isValid =
          regExp.test(answerValue) || !FormUtils.hasAnswer(question);
        if (!isValid) {
          return {
            isValid: false,
            validationSeverity: Vocabulary.VALIDATION_SEVERITY.ERROR,
            message: question[Vocabulary.HAS_VALIDATION_MESSAGE]
              ? question[Vocabulary.HAS_VALIDATION_MESSAGE]
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
      question[Vocabulary.REQUIRES_ANSWER] &&
      !question[Vocabulary.USED_ONLY_FOR_COMPLETENESS]
    ) {
      const isValid = FormUtils.hasAnswer(question);
      if (!isValid) {
        return {
          isValid: false,
          validationSeverity: Vocabulary.VALIDATION_SEVERITY.ERROR,
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
      if (question[Vocabulary.REQUIRES_ANSWER]) {
        const isValid = FormUtils.hasAnswer(question);
        if (!isValid) {
          return {
            isValid: false,
            validationSeverity: Vocabulary.VALIDATION_SEVERITY.ERROR,
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
      question[Vocabulary.REQUIRES_ANSWER] &&
      question[Vocabulary.USED_ONLY_FOR_COMPLETENESS]
    ) {
      const isValid = FormUtils.hasAnswer(question);
      if (!isValid) {
        return {
          isValid: false,
          validationSeverity: Vocabulary.VALIDATION_SEVERITY.WARNING,
          message:
            JsonLdUtils.getLocalized(question[JsonLdUtils.RDFS_LABEL], intl) +
            " should be filled to complete the form.",
        };
      }
    }
    return { isValid: true };
  }

  static _intMinInclusiveValidator(question, intl) {
    if (question[Vocabulary.XSD.MIN_INCLUSIVE]) {
      const answerValue = FormUtils.getAnswerValue(question);
      if (answerValue && answerValue.length > 0) {
        const minInclusive = question[Vocabulary.XSD.MIN_INCLUSIVE];

        const isValid =
          Number.isInteger(parseInt(answerValue)) &&
          answerValue >= minInclusive;

        if (!isValid) {
          return {
            isValid: false,
            validationSeverity: Vocabulary.VALIDATION_SEVERITY.ERROR,
            message:
              "The answer should be a number equal or greater than " +
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
    if (question[Vocabulary.XSD.MAX_INCLUSIVE]) {
      if (answerValue && answerValue.length > 0) {
        const maxInclusive = question[Vocabulary.XSD.MAX_INCLUSIVE];

        const isValid =
          Number.isInteger(parseInt(answerValue)) &&
          answerValue <= maxInclusive;

        if (!isValid) {
          return {
            isValid: false,
            validationSeverity: Vocabulary.VALIDATION_SEVERITY.ERROR,
            message:
              "The answer should be a number equal or lower than " +
              maxInclusive +
              ".",
          };
        }
      }
    }
    return { isValid: true };
  }
}
