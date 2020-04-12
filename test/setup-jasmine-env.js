'use strict';

/**
 * Jasmine configuration.
 */

jasmine.VERBOSE = true;

const reporters = require('jasmine-reporters');
const reporter = new reporters.JUnitXmlReporter({
  savePath: 'test/reports/',
  consolidateAll: false
});
jasmine.getEnv().addReporter(reporter);
