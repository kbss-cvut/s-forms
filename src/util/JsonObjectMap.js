'use strict';

import JsonLdUtils from "jsonld-utils";

import Constants from "../constants/Constants";
import Utils from "./Utils";

export default class JsonObjectMap {

    static objectMap = {};

    static addObject(id, question) {
        JsonObjectMap.objectMap[id] = question;
    }

    static getObject(id) {
        return JsonObjectMap.objectMap[id];
    }


}