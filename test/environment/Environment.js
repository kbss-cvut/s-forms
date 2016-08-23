'use strict';

import React from 'react';
import TestUtils from 'react-addons-test-utils';

export default class Environment {

    static render(component) {
        return TestUtils.renderIntoDocument(component);
    }
}
