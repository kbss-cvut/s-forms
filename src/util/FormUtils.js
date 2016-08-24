'use strict';

import JsonLdUtils from "jsonld-utils";

import Constants from "../constants/Constants";

export default class FormUtils {

    static isForm(structure) {
        return JsonLdUtils.hasValue(structure, Constants.LAYOUT_CLASS, Constants.LAYOUT.FORM);
    }

    static isWizardStep(structure) {
        return JsonLdUtils.hasValue(structure, Constants.LAYOUT_CLASS, Constants.LAYOUT.WIZARD_STEP);
    }

    static isSection(question) {
        return JsonLdUtils.hasValue(question, Constants.LAYOUT_CLASS, Constants.LAYOUT.QUESTION_SECTION);
    }

    static isTypeahead(question) {
        return JsonLdUtils.hasValue(question, Constants.LAYOUT_CLASS, Constants.LAYOUT.QUESTION_TYPEAHEAD);
    }

    static getPossibleValuesQuery(question) {
        return JsonLdUtils.getJsonAttValue(question, Constants.HAS_OPTIONS_QUERY);
    }

    static isDisabled(question) {
        return JsonLdUtils.hasValue(question, Constants.LAYOUT_CLASS, Constants.LAYOUT.DISABLED);
    }

    static isHidden(question) {
        return JsonLdUtils.hasValue(question, Constants.LAYOUT_CLASS, Constants.LAYOUT.HIDDEN);
    }

    static isTextarea(question, answerValue) {
        return answerValue && answerValue.length > Constants.INPUT_LENGTH_THRESHOLD
            || JsonLdUtils.hasValue(question, Constants.LAYOUT_CLASS, Constants.LAYOUT.TEXTAREA);
    }

    static isCalendar(question) {
        return FormUtils.isDate(question) || FormUtils.isTime(question) || FormUtils.isDateTime(question);
    }

    static isDate(question) {
        return JsonLdUtils.hasValue(question, Constants.LAYOUT_CLASS, Constants.LAYOUT.DATE);
    }

    static isTime(question) {
        return JsonLdUtils.hasValue(question, Constants.LAYOUT_CLASS, Constants.LAYOUT.TIME);
    }

    static isDateTime(question) {
        return JsonLdUtils.hasValue(question, Constants.LAYOUT_CLASS, Constants.LAYOUT.DATETIME);
    }

    static isCheckbox(question) {
        return JsonLdUtils.hasValue(question, Constants.LAYOUT_CLASS, Constants.LAYOUT.CHECKBOX);
    }

    static resolveValue(answer) {
        if (!answer) {
            return null;
        }
        if (answer[Constants.HAS_OBJECT_VALUE]) {
            return answer[Constants.HAS_OBJECT_VALUE]['@id'];
        } else {
            return JsonLdUtils.getJsonAttValue(answer, Constants.HAS_DATA_VALUE);
        }
    }
}
