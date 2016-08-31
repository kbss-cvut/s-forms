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

    static testCondition(condition) {

        var questionsWithValidAnswer = condition[Constants.HAS_VALID_ANSWER],
            acceptedAnswerValues = condition[Constants.ACCEPTS_ANSWER_VALUE],
            testedQuestion = condition[Constants.HAS_TESTED_QUESTION];

        // valid answers
        if (questionsWithValidAnswer) {
            for (var question of Utils.asArray(questionsWithValidAnswer)) {
                return true; //TODO not implemented
            }
        }

        // concrete values
        if (acceptedAnswerValues && testedQuestion) {
            var question =  JsonObjectMap.getObject(testedQuestion["@id"]);
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