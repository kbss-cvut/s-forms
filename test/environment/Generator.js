'use strict';

import JsonLdUtils from 'jsonld-utils';

export default class Generator {

    static _uriBase = 'http://onto.fel.cvut.cz/ontologies/forms';

    static getRandomInt() {
        const min = 0;
        const bound = Number.MAX_SAFE_INTEGER;
        return Math.floor(Math.random() * (bound - min)) + min;
    }

    static getRandomPositiveInt(min, max) {
        const bound = max ? max : Number.MAX_SAFE_INTEGER;
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

    static generateTypeaheadOptions(value, valueLabel) {
        const options = [];
        let option;

        for (let i = 0; i < Generator.getRandomPositiveInt(3, 10); i++) {
            option = {
                '@id': Generator.getRandomUri()
            };
            option[JsonLdUtils.RDFS_LABEL] = 'RandomLabel' + i;
            options.push(option);
        }
        option = {
            '@id': value
        };
        option[JsonLdUtils.RDFS_LABEL] = valueLabel;
        options.push(option);
        return options;
    }
}
