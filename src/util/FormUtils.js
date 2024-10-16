import * as JsonLdUtils from "jsonld-utils";
import * as jsonld from "jsonld";

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

  static isTimestamp(question) {
    return JsonLdUtils.hasValue(
      question,
      Constants.TIMESTAMP_FORMAT,
      Constants.EPOCH_MILLISECONDS
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
    if (question[Constants.REQUIRES_ANSWER]) {
      return true;
    }
    if (question[Constants.REQUIRES_ANSWER_IF]) {
      return true;
    }
    if (question[Constants.PATTERN]) {
      return true;
    }
    if (this.containsXSDProperty(question)) {
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

  static getAnswerValue(question) {
    if (!question) {
      return null;
    }

    if (question.hasOwnProperty(Constants.HAS_ANSWER)) {
      const answers = jsonld.getValues(question, Constants.HAS_ANSWER);
      if (answers.length) {
        const qValue = FormUtils.resolveValueObject(answers[0]);
        if (qValue) {
          if (qValue["@value"] || qValue["@id"]) {
            return qValue["@value"] || qValue["@id"];
          }
        }
      }
    }

    for (const subQ of Utils.asArray(question[Constants.HAS_SUBQUESTION])) {
      const subQAnswer = FormUtils.getAnswerValue(subQ);
      if (subQAnswer) {
        return subQAnswer;
      }
    }

    return null;
  }

  /**
   * Resolves which format of date/time/datetime value should be used in the datetime picker.
   * @param question Question with format info
   * @param originalValue Value read from answer, not processed by the rendered component
   * @param options Object with datetime formats
   * @return {*} Format from Configuration
   */
  static resolveDateTimeFormat(question, originalValue, options) {
    const isDate = FormUtils.isDate(question);
    const isTime = FormUtils.isTime(question);
    const isDatetime = FormUtils.isDateTime(question);

    switch (true) {
      case isDate:
        return question[Constants.DATE_FORMAT] || options.dateFormat;

      case isTime:
        return question[Constants.TIME_FORMAT] || options.timeFormat;

      case isDatetime:
        return question[Constants.DATETIME_FORMAT] || options.dateTimeFormat;
      default:
        return null;
    }
  }

  /**
   * Traverse provided array of questions recursively by DFS algorithm
   * and execute on each traversed question provided function.
   * @param {Array<Object>} questions - The array of questions to be traversed.
   * @param {Function} onEnterQuestion - The callback function to execute when entering a question.
   * @param {Function} [onLeaveQuestion = () => {}] - The callback function to execute when leaving a question.
   */
  static dfsTraverseQuestionTree(
    questions,
    onEnterQuestion,
    onLeaveQuestion = () => {}
  ) {
    function recursiveTraverse(question) {
      onEnterQuestion(question);
      Utils.asArray(question[Constants.HAS_SUBQUESTION]).forEach((q) => {
        recursiveTraverse(q);
      });
      onLeaveQuestion(question);
    }

    questions.forEach((q) => {
      recursiveTraverse(q);
    });
  }

  static getFormSpecification(questions) {
    let level = -1;
    const indentation = "    ";
    const propertyIndentation = "..";
    let output = "";

    function onEnterQuestion(q) {
      level += 1;
      const ind = indentation.repeat(level);
      let requiredValue = "";
      if (
        q[Constants.REQUIRES_ANSWER] &&
        !q[Constants.USED_ONLY_FOR_COMPLETENESS]
      ) {
        requiredValue =
          ind +
          propertyIndentation +
          "required: " +
          q[Constants.REQUIRES_ANSWER] +
          "\n";
      } else if (q[Constants.USED_ONLY_FOR_COMPLETENESS]) {
        requiredValue =
          ind +
          propertyIndentation +
          "required only for completeness: " +
          q[Constants.USED_ONLY_FOR_COMPLETENESS] +
          "\n";
      }

      let description = q[Constants.HELP_DESCRIPTION]
        ? ind +
          propertyIndentation +
          "description: " +
          q[Constants.HELP_DESCRIPTION] +
          "\n"
        : "";

      let pattern = q[Constants.PATTERN]
        ? ind + propertyIndentation + "pattern: " + q[Constants.PATTERN] + "\n"
        : "";

      let mask = q[Constants.INPUT_MASK]
        ? ind + propertyIndentation + "mask: " + q[Constants.INPUT_MASK] + "\n"
        : "";

      let validationMessage = q[Constants.HAS_VALIDATION_MESSAGE]
        ? ind +
          propertyIndentation +
          "validation-message: " +
          q[Constants.HAS_VALIDATION_MESSAGE] +
          "\n"
        : "";

      let minInclusive = q[Constants.XSD.MIN_INCLUSIVE]
        ? ind +
          propertyIndentation +
          "This field must be greater or equal to " +
          q[Constants.XSD.MIN_INCLUSIVE] +
          "\n"
        : "";

      let maxInclusive = q[Constants.XSD.MAX_INCLUSIVE]
        ? ind +
          propertyIndentation +
          "This field should be a number equal or lower to " +
          q[Constants.XSD.MAX_INCLUSIVE] +
          "\n"
        : "";

      output += ind + q["http://www.w3.org/2000/01/rdf-schema#label"] + "\n";
      output += description;
      output += requiredValue;
      output += pattern;
      output += mask;
      output += maxInclusive;
      output += minInclusive;
      output += validationMessage;
      output += "\n";
    }

    function onLeaveQuestion() {
      level -= 1;
    }

    FormUtils.dfsTraverseQuestionTree(
      questions,
      onEnterQuestion,
      onLeaveQuestion
    );

    return output;
  }

  /**
   * Checks if the keys of a question contain any of the values from the XSD object.
   * @param {Object} question - The question to check.
   * @returns {boolean} - True if any XSD value is found among the keys, otherwise false.
   */
  static containsXSDProperty(question) {
    const objKeys = Object.keys(question);
    const xsdValues = Object.values(Constants.XSD);

    for (const value of xsdValues) {
      if (objKeys.includes(value)) {
        return true;
      }
    }
    return false;
  }

  static getInputMask(question) {
    if (question[Constants.INPUT_MASK]) {
      return question[Constants.INPUT_MASK];
    }
  }
}
