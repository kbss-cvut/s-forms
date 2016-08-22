'use strict';

var actions = null;
var intl = null;
var optionsStore = null;
var wizardStore = null;
var typeaheadResultList = null;
var inputComponent = null;

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
        return inputComponent ? inputComponent : require('react-bootstrap').Input;
    }

    static set inputComponent(component) {
        inputComponent = component;
    }
}
