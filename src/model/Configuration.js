let intl = null;
let i18n = { 'wizard.next': 'Next', 'wizard.previous': 'Previous' };
let inputComponent = null;
let dateFormat = null;
let timeFormat = null;
let dateTimeFormat = null;
let readOnly = false;
let fetchTypeAheadValues = null;
let horizontalWizardNav = true;
let modalView = false;

export default class Configuration {
  static get intl() {
    return intl;
  }

  static set intl(value) {
    intl = value;
  }

  static get i18n() {
    return i18n;
  }

  static set i18n(object) {
    i18n = object;
  }

  static get inputComponent() {
    return inputComponent ? inputComponent : require('../components/DefaultInput').default;
  }

  static set inputComponent(component) {
    inputComponent = component;
  }

  static get dateFormat() {
    return dateFormat ? dateFormat : 'yyyy-MM-dd';
  }

  static set dateFormat(format) {
    dateFormat = format;
  }

  static get timeFormat() {
    return timeFormat ? timeFormat : 'HH:mm:ss';
  }

  static set timeFormat(format) {
    timeFormat = format;
  }

  static get dateTimeFormat() {
    return dateTimeFormat ? dateTimeFormat : 'yyyy-MM-dd HH:mm:ss';
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

  static get fetchTypeAheadValues() {
    return fetchTypeAheadValues;
  }

  static set fetchTypeAheadValues(func) {
    fetchTypeAheadValues = func;
  }

  static get horizontalWizardNav() {
    return horizontalWizardNav;
  }

  static set horizontalWizardNav(boolean) {
    horizontalWizardNav = boolean;
  }

  static get modalView() {
    return modalView;
  }

  static set modalView(boolean) {
    modalView = boolean;
  }
}
