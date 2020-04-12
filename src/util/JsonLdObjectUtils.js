import jsonld from "jsonld";
import JsonLdUtils from "jsonld-utils";
import Utils from "./Utils";
import tsort from 'tsort';

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

        // TODO remove: workaround for bad persistance of boolean values -- { @value: "true" } instead of { @value: true }
        if (jsonLdValue1 && jsonLdValue1['@value'] && jsonLdValue2 && jsonLdValue2['@value']) {
            const strValue1 = (typeof(jsonLdValue1)['@value'] === 'string') ? jsonLdValue1['@value'] : JSON.stringify(jsonLdValue1['@value']);
            const strValue2 = (typeof(jsonLdValue2)['@value'] === 'string') ? jsonLdValue2['@value'] : JSON.stringify(jsonLdValue2['@value']);

            if (strValue1 === strValue2) {
                return true;
            }
        }
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
                    if (data[i][gtProperty]) {
                        let gtId = (typeof data[i][gtProperty] === 'object') ? data[i][gtProperty]['@id'] : data[i][gtProperty];
                        if (gtId === data[j]['@id']) {
                            var tmp = data[i];
                            data[i] = data[j];
                            data[j] = tmp;
                            swapped = true;
                            break;
                        }
                    }
                }
            }
        } while (swapped);

        return data;
    }

    /**
     * Sorts the specified JSON-LD data using a topological sort over partially ordered set defined by gtProperty,
     * while preserving original order.
     *
     * This is useful for situations where each item only knows its immediate neighbour in the list.
     * @param data The data to sort, should be an array
     * @param gtProperty Property specifying that an item is greater than another item. It is used for comparison.
     *
     */
    static orderPreservingToplogicalSort(data, gtProperty) {
        let graph = tsort(),
            id2ObjectMap = {};

        for (let i = 0, len = data.length; i < len; i++) {
            let currentId = data[i]['@id'];
            graph.add(currentId);
            id2ObjectMap[currentId] = data[i];

            Utils.asArray(data[i][gtProperty])
                .map(val => (typeof val === 'object') ? val['@id'] : val)
                .map(val => [val, currentId])
                .forEach(edge => graph.add(edge));
        }

        let sortedIds = graph.sort();
        for (let i = 0, len = sortedIds.length; i < len; i++) {
            data[i] = id2ObjectMap[sortedIds[i]];

        }
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
