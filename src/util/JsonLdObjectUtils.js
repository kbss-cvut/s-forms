'use strict';

import jsonld from "jsonld";
import JsonLdUtils from "jsonld-utils";

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

    /**
     * Sorts the specified JSON-LD data using a topological sort over partially ordered set defined by gtProperty.
     *
     * This is useful for situations where each item only knows its immediate neighbour in the list.
     * @param data The data to sort, should be an array
     * @param gtProperty Property specifying that an item is greater than another item. It is used for comparison.
     *
     */
    static toplogicalSort(data, gtProperty) {
        var swapped;
        do {
            swapped = false;
            for (var i = 0, len = data.length; i < len; i++) {
                for (var j = i; j < len; j++) {
                    if (data[i][gtProperty] && data[i][gtProperty]['@id'] === data[j]['@id']) {
                        var tmp = data[i];
                        data[i] = data[j];
                        data[j] = tmp;
                        swapped = true;
                        break;
                    }
                }
            }
        } while (swapped);

        return data;
    }

    static getCompareLocalizedLabelFunction(intl) {
        return (a, b) => {
            var aLabel = JsonLdUtils.getLocalized(a[JsonLdUtils.RDFS_LABEL], intl),
                bLabel = JsonLdUtils.getLocalized(b[JsonLdUtils.RDFS_LABEL], intl);
            if (aLabel < bLabel) {
                return -1;
            } else if (aLabel > bLabel) {
                return 1;
            }
            return 0;
        };
    }

}