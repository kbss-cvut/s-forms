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

  static findQuestionById(id, question, reflexive, asserted, transitive) {
    if (reflexive) {
      if (question["@id"] === id) {
        return question;
      }
    }

    const subQuestions = Utils.asArray(question[Constants.HAS_SUBQUESTION]); // we have such method in some kind of json-ld utils
    if (asserted) {
      for (let q of subQuestions) {
        let foundQ = Utils.findQuestionById(id, q, true, false, false);
        if (foundQ) return foundQ;
      }
    }

    if (transitive) {
      for (let q of subQuestions) {
        let foundQ = Utils.findQuestionById(id, q, false, true, true);
        if (foundQ) return foundQ;
      }
    }

    return null;
  }
}
