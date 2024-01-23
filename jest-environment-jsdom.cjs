"use strict";

const { TextEncoder, TextDecoder } = require("util");
const {
  default: $JSDOMEnvironment,
  TestEnvironment,
} = require("jest-environment-jsdom");

Object.defineProperty(exports, "__esModule", {
  value: true,
});

// Using Jest 29, TextEncoder and TextDecoder do not have support, see https://github.com/jsdom/jsdom/issues/2524,
// Solution was found here: https://github.com/jsdom/jsdom/issues/2524#issuecomment-1480930523
class JSDOMEnvironment extends $JSDOMEnvironment {
  constructor(...args) {
    const { global } = super(...args);
    if (!global.TextEncoder) global.TextEncoder = TextEncoder;
    if (!global.TextDecoder) global.TextDecoder = TextDecoder;
    if (!global.Uint8Array) global.Uint8Array = Uint8Array;
  }
}

exports.default = JSDOMEnvironment;
exports.TestEnvironment =
  TestEnvironment === $JSDOMEnvironment ? JSDOMEnvironment : TestEnvironment;
