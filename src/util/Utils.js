import Constants from "../constants/Constants.js";

export default class Utils {
  /**
   * Calculates a simple hash of the specified string, much like usual Java implementations.
   * @param str The string to compute has for
   * @return {number}
   */
  static getStringHash(str) {
    let hash = 0;
    const strlen = str ? str.length : 0;

    if (strlen === 0) {
      return hash;
    }
    for (let i = 0; i < strlen; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash = hash & hash; // Convert to 32bit integer
    }

    return hash;
  }

  /**
   * Wraps passed object into new array if it is not array already.
   * @param object_or_array An object or array.
   * @returns {*} New array containing passed object or passed array.
   */
  static asArray(object_or_array) {
    if (!object_or_array) {
      return [];
    }
    if (object_or_array.constructor === Array) {
      return object_or_array;
    }
    return [object_or_array];
  }

  static findChildren(question, id, transitive, reflexive) {
    const subQuestions = question[Constants.HAS_SUBQUESTION];
    let questions = [];

    if (!question) {
      return null;
    }

    if (transitive || (!transitive && !reflexive)) {
      if (question["@id"] === id) {
        questions.push(question);
      }
      if (subQuestions && subQuestions.length) {
        for (let subQuestion of subQuestions) {
          questions.push(Utils.findChildren(subQuestion, id));
        }
      }
    }

    if (reflexive && !transitive) {
      if (subQuestions && subQuestions.length) {
        for (let i = 0; i < subQuestions.length; i++) {
          if (subQuestions[i]["@id"] === id) {
            questions.push(subQuestions[i]);
          }
        }
      }
    }
    return questions;
  }
}
