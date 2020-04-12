let actions = null;
let intl = null;
let optionsStore = null;
let wizardStore = null;
let typeaheadResultList = null;
let inputComponent = null;
let dateFormat = null;
let timeFormat = null;
let dateTimeFormat = null;
let readOnly = false;

export default class Configuration {
  static get actions() {
    return actions;
  }

  static set actions(a) {
    actions = a;
  }

  static get intl() {
    return intl;
  }

  static set intl(value) {
    intl = value;
  }

  static get optionsStore() {
    return optionsStore;
  }

  static set optionsStore(store) {
    optionsStore = store;
  }

  static get wizardStore() {
    return wizardStore;
  }

  static set wizardStore(store) {
    wizardStore = store;
  }

  static get typeaheadResultList() {
    return typeaheadResultList;
  }

  static set typeaheadResultList(component) {
    typeaheadResultList = component;
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
