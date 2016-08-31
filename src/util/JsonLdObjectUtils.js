'use strict';

import jsonld from "jsonld";

export default class JsonLdObjectUtils {

    static getFirstObject(subject, predicate) {
        var values = jsonld.getValues(subject, predicate);

        if (values.length === 0) {
            //throw "Subject "  + subject[@id] + " does not have any value of property " + predicate;
            return null;
        }
        return values[0];
    }

    static compareValues(jsonLdValue1, jsonLdValue2) {
        jsonLdValue1 = (typeof(jsonLdValue1) === 'object') ? jsonLdValue1 : { '@value': jsonLdValue1};
        jsonLdValue2 = (typeof(jsonLdValue2) === 'object') ? jsonLdValue2 : { '@value': jsonLdValue2};

        return jsonld.compareValues(jsonLdValue1, jsonLdValue2);
    }

}