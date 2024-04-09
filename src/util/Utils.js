import Vocabulary from "../constants/Vocabulary.js";

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

    const subQuestions = Utils.asArray(question[Vocabulary.HAS_SUBQUESTION]); // we have such method in some kind of json-ld utils
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

  /**
   * Finds the first key in an array of objects that matches any of the specified keys.
   *
   * @param {Object[]} objectList - The array of objects to search through.
   * @param {string[]} keysToCheck - An array of keys to check in each object.
   * @returns {?string} - The first key that exists in any of the objects, or null if none are found.
   */
  static findKeyInObjects(objectList, keysToCheck) {
    for (let i = 0; i < objectList.length; i++) {
      for (let j = 0; j < keysToCheck.length; j++) {
        if (objectList[i].hasOwnProperty(keysToCheck[j])) {
          return keysToCheck[j];
        }
      }
    }
    return null;
  }
}
