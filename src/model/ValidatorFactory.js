/**
 * Created by blcha on 4.11.16.
 */
import Constants from "../constants/Constants";
import FormUtils from "../util/FormUtils";

const createValidator = (question, intl) => {
  const validators = [
    _intMaxInclusiveValidator,
    _intMinInclusiveValidator,
    _patternValidator,
    _checkboxValidator,
    _requiredValidator,
    _completenessValidator,
  ];

  return () => {
    if (FormUtils.hasValidationLogic(question, intl)) {
      const answerValue = FormUtils.getAnswerValue(question);
      // console.log(question);
      // console.log(intl);
      return _validateAnswer(question, intl, answerValue, validators);
    }
  };
};

const _validateAnswer = (question, intl, answerValue, validators) => {
  const result = {};
  for (const validator of validators) {
    const validationResult = validator(question, intl);
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
};

const _patternValidator = (question, intl) => {
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
            : intl.formatMessage({ id: "validation.invalid" }),
        };
      }
    }
  }
  return { isValid: true };
};

const _requiredValidator = (question, intl) => {
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
          : intl.formatMessage({ id: "validation.required" }),
      };
    }
  }
  return { isValid: true };
};

const _checkboxValidator = (question, intl) => {
  if (FormUtils.isCheckbox(question)) {
    if (question[Constants.REQUIRES_ANSWER]) {
      const isValid = FormUtils.hasAnswer(question);
      if (!isValid) {
        return {
          isValid: false,
          validationSeverity: Constants.VALIDATION.SEVERITY.ERROR,
          message: question[Constants.HAS_VALIDATION_MESSAGE]
            ? question[Constants.HAS_VALIDATION_MESSAGE]
            : intl.formatMessage({ id: "validation.check" }),
        };
      }
    }
  }
  return { isValid: true };
};

const _completenessValidator = (question, intl) => {
  // console.log(intl);
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
          : intl.formatMessage({
              id: "validation.required_only_for_completeness",
            }),
      };
    }
  }
  return { isValid: true };
};

const _intMinInclusiveValidator = (question, intl) => {
  if (question[Constants.XSD.MIN_INCLUSIVE]) {
    const answerValue = FormUtils.getAnswerValue(question);
    if (answerValue && answerValue.length > 0) {
      const minInclusive = question[Constants.XSD.MIN_INCLUSIVE];

      const isValid =
        Number.isInteger(parseInt(answerValue)) && answerValue >= minInclusive;

      if (!isValid) {
        return {
          isValid: false,
          validationSeverity: Constants.VALIDATION.SEVERITY.ERROR,
          message: question[Constants.HAS_VALIDATION_MESSAGE]
            ? question[Constants.HAS_VALIDATION_MESSAGE]
            : intl.formatMessage({ id: "validation.greater_or_equal" }) +
              minInclusive +
              ".",
        };
      }
    }
  }
  return { isValid: true };
};

const _intMaxInclusiveValidator = (question, intl) => {
  const answerValue = FormUtils.getAnswerValue(question);
  if (question[Constants.XSD.MAX_INCLUSIVE]) {
    if (answerValue && answerValue.length > 0) {
      const maxInclusive = question[Constants.XSD.MAX_INCLUSIVE];

      const isValid =
        Number.isInteger(parseInt(answerValue)) && answerValue <= maxInclusive;

      if (!isValid) {
        return {
          isValid: false,
          validationSeverity: Constants.VALIDATION.SEVERITY.ERROR,
          message: question[Constants.HAS_VALIDATION_MESSAGE]
            ? question[Constants.HAS_VALIDATION_MESSAGE]
            : intl.formatMessage({ id: "validation.lower_or_equal" }) +
              maxInclusive +
              ".",
        };
      }
    }
  }
  return { isValid: true };
};

export { createValidator };
