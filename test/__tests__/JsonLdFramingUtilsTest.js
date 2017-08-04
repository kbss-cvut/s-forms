'use strict';

import React from 'react';
import Configuration from '../../src/model/Configuration';
import JsonLdFramingUtils from '../../src/util/JsonLdFramingUtils';
import JsonLdObjectMap from '../../src/util/JsonLdObjectMap';

describe('JsonLd framing utils', () => {

    var formDocument,
        formQuestion;

    beforeEach(() => {
        formQuestion = {
            "@id": "http://onto.fel.cvut.cz/ontologies/eccairs/model/instance#instance-1223764187-q",
            "@type": "http://onto.fel.cvut.cz/ontologies/documentation/question",
            "http://onto.fel.cvut.cz/ontologies/form-layout/has-layout-class": "form",
            "http://www.w3.org/2000/01/rdf-schema#label": {
                "@language": "en",
                "@value": "453 - Responsible entity"
            }
        };
        formDocument = {
            "@graph": [
                formQuestion
             ]
        };
        Configuration.intl = {
            locale: 'en'
        };
    });

    it('returns jsonld object map from modifyStructure', () => {
        const id2objectMap = JsonLdFramingUtils.modifyStructure(formDocument);
        expect(id2objectMap[formQuestion["@id"]]).toBe(formQuestion);
    });

});
