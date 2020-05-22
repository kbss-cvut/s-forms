/**
 * Created by blcha on 4.11.16.
 */

import JsonLdUtils from 'jsonld-utils';

import * as Constants from '../constants/Constants';
import FormUtils from '../util/FormUtils';

export default class ValidatorFactory {
  static createValidator(question, intl) {
    if (question[Constants.REQUIRES_ANSWER]) {
      if (FormUtils.isCheckbox(question)) {
        //TODO revise
        return ValidatorFactory._generateRequiresAnswerCheckBoxValidator(question, intl);
      }
      return ValidatorFactory._generateRequiresAnswerValidator(question, intl);
    } else {
      return () => {
        const result = {};
        result[Constants.HAS_VALID_ANSWER] = true;
        delete result[Constants.HAS_VALIDATION_MESSAGE];
        return result;
      };
    }
  }

  static _generateRequiresAnswerValidator(question, intl) {
    return (answer) => {
      let val = null;
      if (answer[Constants.HAS_DATA_VALUE]) {
        val = JsonLdUtils.getJsonAttValue(answer, Constants.HAS_DATA_VALUE);
      } else if (answer[Constants.HAS_OBJECT_VALUE]) {
        val = JsonLdUtils.getJsonAttValue(answer, Constants.HAS_OBJECT_VALUE, '@id');
      }
      const isValid = val !== null && val !== undefined && val !== '';
      const result = {};
      result[Constants.HAS_VALID_ANSWER] = isValid;
      result[Constants.HAS_VALIDATION_MESSAGE] = isValid
        ? null
        : JsonLdUtils.getLocalized(question[JsonLdUtils.RDFS_LABEL], intl) + ' is missing a value.';
      return result;
    };
  }

  static _generateRequiresAnswerCheckBoxValidator(question, intl) {
    return (answer) => {
      let val = null;
      if (answer[Constants.HAS_DATA_VALUE]) {
        val = JsonLdUtils.getJsonAttValue(answer, Constants.HAS_DATA_VALUE);
      } else if (answer[Constants.HAS_OBJECT_VALUE]) {
        val = JsonLdUtils.getJsonAttValue(answer, Constants.HAS_OBJECT_VALUE, '@id');
      }
      const isValid = val !== null && val !== undefined && val !== '' && val !== false;
      const result = {};
      result[Constants.HAS_VALID_ANSWER] = isValid;
      result[Constants.HAS_VALIDATION_MESSAGE] = isValid
        ? null
        : JsonLdUtils.getLocalized(question[JsonLdUtils.RDFS_LABEL], intl) + ' must be checked.';
      return result;
    };
  }
}
