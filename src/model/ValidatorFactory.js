/**
 * Created by blcha on 4.11.16.
 */

import JsonLdUtils from 'jsonld-utils';

import Constants from "../constants/Constants";
import Configuration from "../model/Configuration";
import FormUtils from "../util/FormUtils";

export default class ValidatorFactory {

    static createValidator(question) {
        if (question[Constants.REQUIRES_ANSWER]) {
            if (FormUtils.isCheckbox(question)) { //TODO revise
                return ValidatorFactory._generateRequiresAnswerCheckBoxValidator(question);
            }
            return ValidatorFactory._generateRequiresAnswerValidator(question);
        } else {
            return () => {
                const result = {};
                result[Constants.HAS_VALID_ANSWER] = true;
                delete result[Constants.HAS_VALIDATION_MESSAGE];
                return result;
            }
        }
    }

    static _generateRequiresAnswerValidator(question) {
        return (answer) => {
            let val = null;
            if (answer[Constants.HAS_DATA_VALUE]) {
                val = JsonLdUtils.getJsonAttValue(answer, Constants.HAS_DATA_VALUE);
            } else if (answer[Constants.HAS_OBJECT_VALUE]) {
                val = JsonLdUtils.getJsonAttValue(answer, Constants.HAS_OBJECT_VALUE, "@id");
            }
            const isValid = val !== null && val !== undefined && val !== "";
            const result = {};
            result[Constants.HAS_VALID_ANSWER] = isValid;
            result[Constants.HAS_VALIDATION_MESSAGE] = isValid ? null : JsonLdUtils.getLocalized(question[JsonLdUtils.RDFS_LABEL], Configuration.intl) + ' is missing a value.';
            return result;
        }
    }

    static _generateRequiresAnswerCheckBoxValidator(question) {
        return (answer) => {
            let val = null;
            if (answer[Constants.HAS_DATA_VALUE]) {
                val = JsonLdUtils.getJsonAttValue(answer, Constants.HAS_DATA_VALUE);
            } else if (answer[Constants.HAS_OBJECT_VALUE]) {
                val = JsonLdUtils.getJsonAttValue(answer, Constants.HAS_OBJECT_VALUE, "@id");
            }
            const isValid = val !== null && val !== undefined && val !== "" && val !== false;
            const result = {};
            result[Constants.HAS_VALID_ANSWER] = isValid;
            result[Constants.HAS_VALIDATION_MESSAGE] = isValid ? null : JsonLdUtils.getLocalized(question[JsonLdUtils.RDFS_LABEL], Configuration.intl) + ' must be checked.';
            return result;
        }
    }

}
