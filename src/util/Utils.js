'use strict';

import FormUtils from './FormUtils';

export default class Utils {

    /**
     * Calculates a simple hash of the specified string, much like usual Java implementations.
     * @param str The string to compute has for
     * @return {number}
     */
    static getStringHash(str) {
        var hash = 0,
            strlen = str ? str.length : 0,
            i,
            c;
        if (strlen === 0) {
            return hash;
        }
        for (i = 0; i < strlen; i++) {
            c = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + c;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    }

    /**
     * Maps the specified id to a name based on a matching item.
     *
     * This function assumes that the items have been processed by {@link #jsonLdToTypeaheadOption), so the id should
     * be equal to one of the item's 'id' attribute, and if it is, the item's 'name' is returned.
     * @param items The items containing also mapping for the specified value (presumably)
     * @param id The id to map, probably a URI
     * @return {*}
     */
    static idToName(items, id) {
        if (!items) {
            return id;
        }
        for (var i = 0, len = items.length; i < len; i++) {
            if (items[i].id === id) {
                return items[i].name;
            }
        }
        return id;
    }

    /**
     * Resolves mode for the date time picker.
     * @param question Question specifying the mode
     * @return {*} mode for kbss-react-bootstrap-datetimepicker
     */
    static resolveDateTimeMode(question) {
        if (FormUtils.isDate(question)) {
            return 'date';
        } else if (FormUtils.isTime(question)) {
            return 'time';
        } else {
            return 'datetime';
        }
    }
}
