import JsonLdUtils from "jsonld-utils";
import jsonld from "jsonld";

import Constants from "../constants/Constants";
import Utils from "./Utils";
import JsonLdObjectMap from "./JsonLdObjectMap";
import JsonLdObjectUtils from "./JsonLdObjectUtils";

export default class FormUtils {
  static isForm(structure) {
    return JsonLdUtils.hasValue(
      structure,
      Constants.LAYOUT_CLASS,
      Constants.LAYOUT.FORM
    );
  }

  static isWizardStep(structure) {
    return JsonLdUtils.hasValue(
      structure,
      Constants.LAYOUT_CLASS,
      Constants.LAYOUT.WIZARD_STEP
    );
  }

  static isSection(question) {
    return JsonLdUtils.hasValue(
      question,
      Constants.LAYOUT_CLASS,
      Constants.LAYOUT.QUESTION_SECTION
    );
  }

  static isAnswerable(question) {
    return JsonLdUtils.hasValue(
      question,
      Constants.LAYOUT_CLASS,
      Constants.LAYOUT.ANSWERABLE
    );
  }

  static isTypeahead(question) {
    return JsonLdUtils.hasValue(
      question,
      Constants.LAYOUT_CLASS,
      Constants.LAYOUT.QUESTION_TYPEAHEAD
    );
  }

  static getPossibleValuesQuery(question) {
    return JsonLdUtils.getJsonAttValue(question, Constants.HAS_OPTIONS_QUERY);
  }

  static isDisabled(question) {
    return JsonLdUtils.hasValue(
      question,
      Constants.LAYOUT_CLASS,
      Constants.LAYOUT.DISABLED
    );
  }

  static isHidden(question) {
    return JsonLdUtils.hasValue(
      question,
      Constants.LAYOUT_CLASS,
      Constants.LAYOUT.HIDDEN
    );
  }

  static isTextarea(question, answerValue) {
    return (
      (answerValue &&
        answerValue.length > Constants.INPUT_LENGTH_THRESHOLD &&
        !FormUtils.isTypeahead(question)) ||
      JsonLdUtils.hasValue(
        question,
        Constants.LAYOUT_CLASS,
        Constants.LAYOUT.TEXTAREA
      )
    );
  }

  static isText(question) {
    return JsonLdUtils.hasValue(
      question,
      Constants.LAYOUT_CLASS,
      Constants.LAYOUT.TEXT
    );
  }

  static isCalendar(question) {
    return (
      FormUtils.isDate(question) ||
      FormUtils.isTime(question) ||
      FormUtils.isDateTime(question)
    );
  }

  static isDate(question) {
    return JsonLdUtils.hasValue(
      question,
      Constants.LAYOUT_CLASS,
      Constants.LAYOUT.DATE
    );
  }

  static isTime(question) {
    return JsonLdUtils.hasValue(
      question,
      Constants.LAYOUT_CLASS,
      Constants.LAYOUT.TIME
    );
  }

  static isDateTime(question) {
    return JsonLdUtils.hasValue(
      question,
      Constants.LAYOUT_CLASS,
      Constants.LAYOUT.DATETIME
    );
  }

  static isCheckbox(question) {
    return JsonLdUtils.hasValue(
      question,
      Constants.LAYOUT_CLASS,
      Constants.LAYOUT.CHECKBOX
    );
  }

  static isMaskedInput(question) {
    return JsonLdUtils.hasValue(
      question,
      Constants.LAYOUT_CLASS,
      Constants.LAYOUT.MASKED_INPUT
    );
  }

  static isSparqlInput(question) {
    return JsonLdUtils.hasValue(
      question,
      Constants.LAYOUT_CLASS,
      Constants.LAYOUT.SPARQL
    );
  }

  static isTurtleInput(question) {
    return JsonLdUtils.hasValue(
      question,
      Constants.LAYOUT_CLASS,
      Constants.LAYOUT.TURTLE
    );
  }

  static isCollapsed(question) {
    return JsonLdUtils.hasValue(
      question,
      Constants.LAYOUT_CLASS,
      Constants.LAYOUT.COLLAPSED
    );
  }

  static isEmphasised(question) {
    return JsonLdUtils.hasValue(
      question,
      Constants.LAYOUT_CLASS,
      Constants.LAYOUT.EMPHASISED
    );
  }

  static getCategory(question) {
    return Constants.LAYOUT.CATEGORY.find((c) =>
      JsonLdUtils.hasValue(question, Constants.LAYOUT_CLASS, c)
    );
  }

  static resolveValue(answer) {
    if (!answer) {
      return null;
    }
    if (answer[Constants.HAS_OBJECT_VALUE]) {
      return answer[Constants.HAS_OBJECT_VALUE]["@id"];
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

    for (let cond of Utils.asArray(question[Constants.IS_RELEVANT_IF])) {
      if (!FormUtils.testCondition(cond)) {
        return false;
      }
    }

    return true;
  }

  static hasValidationLogic(question) {
    if (question[Constants.REQUIRES_ANSWER_VALUE]) {
      return true;
    }
    if (question[Constants.REQUIRES_ANSWER]) {
      return true;
    }
    if (question[Constants.REQUIRES_ANSWER_IF]) {
      return true;
    }
    return false;
  }

  static isValid(question) {
    if (question[Constants.HAS_VALID_ANSWER] === false) {
      return false;
    }
    for (const subQ of Utils.asArray(question[Constants.HAS_SUBQUESTION])) {
      if (this.isValid(subQ) === false) {
        return false;
      }
    }

    return true;
  }

  static testOrCondition(condition) {
    const hasSubCondition = condition[Constants.HAS_SUB_CONDITION];
    if (!hasSubCondition) {
      console.warn("Or condition does not have any sub-condition !");
    }
    for (const subC of this._getMappedObjectsArray(hasSubCondition)) {
      if (this.testCondition(subC)) {
        return true;
      }
    }
    return false;
  }

  static testCondition(condition) {
    const isOrCondition = condition[Constants.HAS_SUB_CONDITION];
    const acceptedValidationsValues =
      condition[Constants.ACCEPTS_VALIDATION_VALUE];
    const acceptedAnswerValues = condition[Constants.ACCEPTS_ANSWER_VALUE];
    const accepts = condition[Constants.ACCEPTS];
    const testedQuestions = condition[Constants.HAS_TESTED_QUESTION];
    let question;

    if (isOrCondition) {
      return this.testOrCondition(condition);
    }

    if (acceptedValidationsValues && acceptedAnswerValues) {
      console.warn(
        "Support for validation and requirement constraints at same time is not implemented !"
      );
    }

    // any answer within all subquestions
    if (accepts && testedQuestions) {
      const arr = Utils.asArray(accepts);
      if (arr.length !== 1) {
        console.warn(
          "Support for multiple accepts values is not implemented !"
        );
      }
      if (arr[0]["@id"] === Constants.ANSWERED_QUESTION) {
        if (acceptedAnswerValues || acceptedValidationsValues) {
          console.warn(
            "Support for accepted answer/validations values is not implemented !"
          );
        }
        for (const q of this._getMappedObjectsArray(testedQuestions)) {
          if (!this.hasAnswer(q)) {
            return false;
          }
        }
        return true;
      }
      console.warn(
        "No support to accept question of type " + arr[0]["@id"] + " !"
      );
    }

    // valid answers
    if (acceptedValidationsValues && testedQuestions) {
      const arr = Utils.asArray(acceptedValidationsValues);
      if (arr.length !== 1 || (arr[0] !== true && arr[0] !== "true")) {
        console.warn(
          'Validation values other than "true" are not implemented !'
        );
      }
      for (const q of Utils.asArray(testedQuestions)) {
        question = JsonLdObjectMap.getObject(q["@id"]);
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
      question = JsonLdObjectMap.getObject(testedQuestions["@id"]);
      for (const expValue of Utils.asArray(acceptedAnswerValues)) {
        if (!question) {
          console.warn("Question is not defined.");
          return true;
        }
        if (!question.hasOwnProperty(Constants.HAS_ANSWER)) {
          //console.warn('Question does not have answer value defined.');
          return false;
        }
        const answers = jsonld.getValues(question, Constants.HAS_ANSWER);

        if (answers.length === 0) {
          return false;
        }
        const qValue = FormUtils.resolveValueObject(answers[0]);

        if (
          qValue &&
          expValue &&
          qValue.hasOwnProperty("@value") &&
          expValue.hasOwnProperty("@id") &&
          qValue["@value"] == expValue["@id"]
        ) {
          // TODO remove !, this is temporary fix as type-ahead component returns data-value instead of
          // code-value
          return true;
        }

        if (JsonLdObjectUtils.compareValues(qValue, expValue)) {
          return true;
        }
      }
    }
    return false;
  }

  //returns array of valid object while ignoring
  static _getMappedObjectsArray(jsonObjects, objectType) {
    return Utils.asArray(jsonObjects)
      .map((o) => {
        const obj = JsonLdObjectMap.getObject(o["@id"]);
        if (obj === undefined) {
          const ot = objectType ? objectType : "Object";
          console.warn(
            (objectType ? objectType : "Object") +
              ' "' +
              o["@id"] +
              '"' +
              " is not loaded in an object map."
          );
          return null;
        }
        return obj;
      })
      .filter(function (o) {
        return o !== null;
      });
  }

  static hasAnswer(question) {
    if (!question) {
      return false;
    }

    if (question.hasOwnProperty(Constants.HAS_ANSWER)) {
      const answers = jsonld.getValues(question, Constants.HAS_ANSWER);
      if (answers.length) {
        const qValue = FormUtils.resolveValueObject(answers[0]);
        if (qValue) {
          if (qValue["@value"] || qValue["@id"]) {
            return true;
          }
        }
      }
    }

    for (const subQ of Utils.asArray(question[Constants.HAS_SUBQUESTION])) {
      if (FormUtils.hasAnswer(subQ)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Resolves which format of date/time/datetime value should be used in the datetime picker.
   * @param question Question with format info
   * @param originalValue Value read from answer, not processed by the rendered component
   * @param options Object with datetime formats
   * @return {*} Format from Configuration
   */
  static resolveDateTimeFormat(question, originalValue, options) {
    const isNumber = typeof originalValue === "number";
    const isDate = FormUtils.isDate(question);
    const isTime = FormUtils.isTime(question);
    const isDatetime = FormUtils.isDateTime(question);

    if (isNumber) {
      return Constants.DATETIME_NUMBER_FORMAT;
    }
    if (isDate) {
      return question[Constants.DATE_FORMAT] || options.dateTimeFormat;
    }
    if (isTime) {
      return question[Constants.TIME_FORMAT] || options.timeFormat;
    }
    if (isDatetime) {
      console.log(question[Constants.DATETIME_FORMAT]);
      return question[Constants.DATETIME_FORMAT] || options.dateTimeFormat;
    }
    return null;
  }
}
