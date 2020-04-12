import moment from 'moment';

import Configuration from '../model/Configuration';
import Constants from '../constants/Constants';
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
   * Maps the specified id to a name based on a matching item.
   *
   * This function assumes that the items have been processed by {@link #jsonLdToTypeaheadOption), so the id should
   * be equal to one of the item's 'id' attribute, and if it is, the item's 'name' is returned.
   * @param items The items containing also mapping for the specified value (presumably)
   * @param id The id to map, probably a URI
   */
  static idToName(items, id) {
    if (!items) {
      return id;
    }
    for (let i = 0, len = items.length; i < len; i++) {
      if (items[i].id === id) {
        return items[i].name;
      }
    }
    return id;
  }

  /**
   * Resolves mode for the date time picker.
   * @param question Question specifying the mode
   * @return {*} mode for react-bootstrap-datetimepicker
   */
  static resolveDateTimeMode(question) {
    if (FormUtils.isDateTime(question)) {
      return 'datetime';
    } else if (FormUtils.isDate(question)) {
      return 'date';
    } else if (FormUtils.isTime(question)) {
      return 'time';
    }
    return 'datetime';
  }

  static resolveDateTimePickerUiFormat(format) {
    if (format === Constants.DATETIME_NUMBER_FORMAT) {
      return Configuration.dateTimeFormat;
    }
    return format;
  }

  /**
   * Resolves the specified value as a moment instance.
   * @param question Question supplying context info to the resolution
   * @param value The value to parse
   * @return {*} moment instance
   */
  static resolveDateTimeValue(question, value) {
    if (typeof value === 'number') {
      return moment(value);
    }
    if (FormUtils.isDateTime(question)) {
      return moment(value, Configuration.dateTimeFormat);
    } else if (FormUtils.isDate(question)) {
      return moment(value, Configuration.dateFormat);
    }
    return moment(value, Configuration.timeFormat);
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
