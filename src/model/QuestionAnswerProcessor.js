import * as JsonLdUtils from "jsonld-utils";
import Vocabulary from "../constants/Vocabulary.js";

export default class QuestionAnswerProcessor {
  /**
   * Builds question answer model from the specified wizard data.
   * @param wizardData Global wizard data
   * @param stepData Data from individual wizard steps
   */
  static buildQuestionAnswerModel(wizardData, stepData) {
    const question = {
      subQuestions: [],
    };
    let processedQuestion;
    if (wizardData) {
      question.uri = wizardData.root["@id"];
      question.origin = JsonLdUtils.getJsonAttValue(
        wizardData.root,
        Vocabulary.HAS_QUESTION_ORIGIN,
        "@id"
      );
    }
    if (stepData) {
      for (let i = 0; i < stepData.length; i++) {
        // This will skip questions corresponding to empty steps in the wizard
        processedQuestion =
          QuestionAnswerProcessor.processQuestionAnswerHierarchy(stepData[i]);
        if (processedQuestion) {
          question.subQuestions.push(processedQuestion);
        }
      }
    }
    return question;
  }

  /**
   * Transforms the QA hierarchy from JSON-LD-based structure to the object model-based one.
   * @param rootQuestion
   */
  static processQuestionAnswerHierarchy(rootQuestion) {
    if (!rootQuestion) {
      return null;
    }
    return QuestionAnswerProcessor._processQuestion(rootQuestion);
  }

  static _processQuestion(question) {
    const result = {};

    result.uri = question["@id"];
    result.origin = JsonLdUtils.getJsonAttValue(
      question,
      Vocabulary.HAS_QUESTION_ORIGIN,
      "@id"
    );
    if (question[Vocabulary.HAS_SUBQUESTION]) {
      result.subQuestions = [];
      for (let i = 0; i < question[Vocabulary.HAS_SUBQUESTION].length; i++) {
        result.subQuestions.push(
          QuestionAnswerProcessor._processQuestion(
            question[Vocabulary.HAS_SUBQUESTION][i]
          )
        );
      }
    }
    if (question[Vocabulary.HAS_ANSWER]) {
      result.answers = [];
      if (!Array.isArray(question[Vocabulary.HAS_ANSWER])) {
        question[Vocabulary.HAS_ANSWER] = [question[Vocabulary.HAS_ANSWER]];
      }
      for (let i = 0; i < question[Vocabulary.HAS_ANSWER].length; i++) {
        result.answers.push(
          QuestionAnswerProcessor.processAnswer(
            question[Vocabulary.HAS_ANSWER][i]
          )
        );
      }
    }

    if (question[Vocabulary.HAS_COMMENT]) {
      result.comments = [];
      if (!Array.isArray(question[Vocabulary.HAS_COMMENT])) {
        question[Vocabulary.HAS_COMMENT] = [question[Vocabulary.HAS_COMMENT]];
      }
      for (let i = 0; i < question[Vocabulary.HAS_COMMENT].length; i++) {
        result.comments.push(
          QuestionAnswerProcessor.processComment(
            question[Vocabulary.HAS_COMMENT][i]
          )
        );
      }
    }

    return result;
  }

  static processComment(comment) {
    const result = {};
    result.author = JsonLdUtils.getJsonAttValue(
      comment,
      Vocabulary.HAS_AUTHOR,
      "@id"
    );
    result.value = JsonLdUtils.getJsonAttValue(
      comment,
      Vocabulary.HAS_COMMENT_VALUE
    );
    result.timestamp = JsonLdUtils.getJsonAttValue(
      comment,
      Vocabulary.HAS_TIMESTAMP,
      "@id"
    );
    return result;
  }

  static processAnswer(answer) {
    const result = {};
    result.uri = answer["@id"];
    result.origin = JsonLdUtils.getJsonAttValue(
      answer,
      Vocabulary.HAS_ANSWER_ORIGIN,
      "@id"
    );
    if (answer[Vocabulary.HAS_OBJECT_VALUE]) {
      result.codeValue = JsonLdUtils.getJsonAttValue(
        answer,
        Vocabulary.HAS_OBJECT_VALUE,
        "@id"
      );
    } else {
      result.textValue = JsonLdUtils.getJsonAttValue(
        answer,
        Vocabulary.HAS_DATA_VALUE
      );
    }
    return result;
  }

  /**
   * Generates an empty answer for the specified question
   * @param question
   */
  static generateAnswer(question) {
    const answer = {};
    answer[Vocabulary.HAS_DATA_VALUE] = "";
    return answer;
  }
}
