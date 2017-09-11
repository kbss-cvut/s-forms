'use strict';

import React from 'react';
import TestUtils from 'react-addons-test-utils';

import Configuration from "../../src/model/Configuration";

export default class Environment {

    static render(component) {
        return TestUtils.renderIntoDocument(component);
    }

    static mockIntl() {
        Configuration.intl = {
            locale: 'en'
        };
    }
}
