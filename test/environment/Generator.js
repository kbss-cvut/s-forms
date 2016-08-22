'use strict';

export default class Generator {

    static _uriBase = 'http://onto.fel.cvut.cz/ontologies/forms';

    static getRandomInt() {
        var min = 0,
            bound = Number.MAX_SAFE_INTEGER;
        return Math.floor(Math.random() * (bound - min)) + min;
    }

    static getRandomPositiveInt(min, max) {
        var bound = max ? max : Number.MAX_SAFE_INTEGER;
        if (min === null || min === undefined) {
            min = 1;
        }
        return Math.floor(Math.random() * (bound - min)) + min;
    }

    static getRandomBoolean() {
        return Math.random() < 0.5;
    }

    static getRandomUri() {
        return Generator._uriBase + Generator.getRandomInt();
    }
}
