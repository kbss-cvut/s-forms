import { format } from 'date-fns';

import Configuration from '../model/Configuration';
import * as Constants from '../constants/Constants';
import FormUtils from './FormUtils';

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
   * Resolves which format of date/time/datetime value should be used in the datetime picker.
   * @param question Question with format info
   * @param originalValue Value read from answer, not processed by the rendered component
   * @return {*} Format from Configuration
   */
  static resolveDateTimeFormat(question, originalValue) {
    if (typeof originalValue === 'number') {
      return Constants.DATETIME_NUMBER_FORMAT;
    }

    if (FormUtils.isDate(question)) {
      return Configuration.dateFormat;
    } else if (FormUtils.isTime(question)) {
      return Configuration.timeFormat;
    }
    return Configuration.dateTimeFormat;
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
}
