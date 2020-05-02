let intl = null;
let loadFormOptions = null;
let getOptions = null;
let initWizard = null;
let inputComponent = null;
let dateFormat = null;
let timeFormat = null;
let dateTimeFormat = null;
let readOnly = false;

export default class Configuration {
  static get intl() {
    return intl;
  }

  static set intl(value) {
    intl = value;
  }

  static set loadFormOptions(func) {
    loadFormOptions = func;
  }

  static get loadFormOptions() {
    return loadFormOptions;
  }

  static set getOptions(func) {
    getOptions = func;
  }

  static get getOptions() {
    return getOptions;
  }

  static set initWizard(func) {
    initWizard = func;
  }

  static get initWizard() {
    return initWizard;
  }

  static get inputComponent() {
    return inputComponent ? inputComponent : require('../components/DefaultInput').default;
  }

  static set inputComponent(component) {
    inputComponent = component;
  }

  static get dateFormat() {
    return dateFormat ? dateFormat : 'YYYY-MM-DD';
  }

  static set dateFormat(format) {
    dateFormat = format;
  }

  static get timeFormat() {
    return timeFormat ? timeFormat : 'hh:mm:ss';
  }

  static set timeFormat(format) {
    timeFormat = format;
  }

  static get dateTimeFormat() {
    return dateTimeFormat ? dateTimeFormat : 'YYYY-MM-DD hh:mm:ss';
  }

  static set dateTimeFormat(format) {
    dateTimeFormat = format;
  }

  static get readOnly() {
    return readOnly;
  }

  static set readOnly(newValue) {
    readOnly = newValue;
  }
}
