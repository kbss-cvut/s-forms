'use strict';

import JsonLdUtils from "jsonld-utils";
import jsonld from "jsonld";

import Constants from "../constants/Constants";
import Utils from "./Utils";
import JsonObjectMap from "./JsonObjectMap";
import JsonLdObjectUtils from "./JsonLdObjectUtils"

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

    static isAnswerable(question) {
        return JsonLdUtils.hasValue(question, Constants.LAYOUT_CLASS, Constants.LAYOUT.ANSWERABLE);
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
        return answerValue && answerValue.length > Constants.INPUT_LENGTH_THRESHOLD && !FormUtils.isTypeahead(question)
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

    static isMaskedInput(question) {
        return JsonLdUtils.hasValue(question, Constants.LAYOUT_CLASS, Constants.LAYOUT.MASKED_INPUT);
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

    static resolveValueObject(answer) {
        if (!answer) {
            return null;
        }
        if (answer[Constants.HAS_OBJECT_VALUE]) {
            return Utils.asArray(answer[Constants.HAS_OBJECT_VALUE])[0];
        }
        if (answer[Constants.HAS_DATA_VALUE]) {
            return Utils.asArray(answer[Constants.HAS_DATA_VALUE])[0];
        }
        return null;
    }

    static isRelevant(question) {

        if (!question[Constants.IS_RELEVANT_IF]) {
            return true;
        }

        for (var cond of Utils.asArray(question[Constants.IS_RELEVANT_IF])) {

            if (FormUtils.testCondition(cond)) {
                return true;
            }
        }
        return false;
    }

    static isValid(question) {
        var subQ;

        if (question[Constants.HAS_VALID_ANSWER] === false) {
            return false;
        }
        for (subQ of Utils.asArray(question[Constants.HAS_SUBQUESTION])) {
            if (this.isValid(subQ) === false) {
                return false;
            }
        }

        return true;
    }

    static testCondition(condition) {

        var acceptedValidationsValues = condition[Constants.ACCEPTS_VALIDATION_VALUE],
            acceptedAnswerValues = condition[Constants.ACCEPTS_ANSWER_VALUE],
            testedQuestions = condition[Constants.HAS_TESTED_QUESTION],
            q, question;

        if (acceptedValidationsValues && acceptedAnswerValues) {
            console.warn("Support for validation and requirement constraints at same time is not implemented !");
        }

        // valid answers
        if (acceptedValidationsValues && testedQuestions) {

            var arr = Utils.asArray(acceptedValidationsValues);
            if ((arr.length !== 1) || ((arr[0] !== true) && (arr[0] !== "true"))) {
                console.warn("Validation values other than \"true\" are not implemented !");
            }
            for (q of Utils.asArray(testedQuestions)) {
                question = JsonObjectMap.getObject(q["@id"]);
                if (question === undefined) {
                    console.warn("Questions is not loaded in an object map.");
                    return true;
                }
                if (this.isValid(question) === false) {
                    return false;
                }
            }
            return true;
        }

        // concrete values
        if (acceptedAnswerValues && testedQuestions) {
            question = JsonObjectMap.getObject(testedQuestions["@id"]);
            for (var expValue of Utils.asArray(acceptedAnswerValues)) {
                var answers = jsonld.getValues(question, Constants.HAS_ANSWER);

                if (answers.length === 0) {
                    return false;
                }
                var qValue = FormUtils.resolveValueObject(answers[0]);

                if (JsonLdObjectUtils.compareValues(qValue, expValue)) {
                    return true;
                }
            }
        }
        return false;
    }

}