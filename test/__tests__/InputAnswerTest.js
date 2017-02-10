'use strict';

import React from "react";
import TestUtils from "react-addons-test-utils";
import JsonLdUtils from "jsonld-utils";
import Answer from "../../src/components/Answer";
import Configuration from "../../src/model/Configuration";
import Constants from "../../src/constants/Constants";
import Environment from "../environment/Environment";
import Generator from "../environment/Generator";

const LABEL = 'Input answer test';

describe('InputAnswer', () => {

    let question,
        answer,
        onChange;

    beforeEach(() => {
        question = {
            "@id": Generator.getRandomUri()
        };
        question[Constants.LAYOUT_CLASS] = [];
        question[JsonLdUtils.RDFS_LABEL] = {
            "@language": "en",
            "@value": LABEL
        };
        question[JsonLdUtils.RDFS_COMMENT] = {
            "@language": "en",
            "@value": "Javascript sucks!!!"
        };
        onChange = jasmine.createSpy('onChange');
        Configuration.intl = {
            locale: 'en'
        };
        answer = {
            "id": Generator.getRandomUri()
        };
        question[Constants.HAS_ANSWER] = [answer];
    });

    it('sets min on numeric input when xsd:minInclusive is used in question', () => {
        const min = 100,
            value = 117;
        question[Constants.HAS_DATATYPE] = Constants.XSD.INT;
        question[Constants.XSD.MIN_INCLUSIVE] = min;
        answer[Constants.HAS_DATA_VALUE] = value;

        const component = Environment.render(<Answer question={question} answer={answer} onChange={onChange}/>),

            input = TestUtils.findRenderedDOMComponentWithTag(component, 'input');
        expect(input.type).toEqual('number');
        expect(input.min).toEqual(min.toString());
    });

    it('sets min on numeric input when xsd:minExclusive is used in question', () => {
        const min = 100,
            value = 117;
        question[Constants.HAS_DATATYPE] = Constants.XSD.INT;
        question[Constants.XSD.MIN_EXCLUSIVE] = min;
        answer[Constants.HAS_DATA_VALUE] = value;

        const component = Environment.render(<Answer question={question} answer={answer} onChange={onChange}/>),

            input = TestUtils.findRenderedDOMComponentWithTag(component, 'input');
        expect(input.type).toEqual('number');
        expect(input.min).toEqual((min + 1).toString());
    });

    it('sets max on numeric input when xsd:maxExclusive is used in question', () => {
        const max = 1000,
            value = 117;
        question[Constants.HAS_DATATYPE] = Constants.XSD.INT;
        question[Constants.XSD.MAX_EXCLUSIVE] = max;
        answer[Constants.HAS_DATA_VALUE] = value;

        const component = Environment.render(<Answer question={question} answer={answer} onChange={onChange}/>),

            input = TestUtils.findRenderedDOMComponentWithTag(component, 'input');
        expect(input.type).toEqual('number');
        expect(input.max).toEqual((max - 1).toString());
    });

    it('sets max on numeric input when xsd:maxInclusive is used in question', () => {
        const max = 1000,
            value = 117;
        question[Constants.HAS_DATATYPE] = Constants.XSD.INT;
        question[Constants.XSD.MAX_INCLUSIVE] = max;
        answer[Constants.HAS_DATA_VALUE] = value;

        const component = Environment.render(<Answer question={question} answer={answer} onChange={onChange}/>),

            input = TestUtils.findRenderedDOMComponentWithTag(component, 'input');
        expect(input.type).toEqual('number');
        expect(input.max).toEqual(max.toString());
    });

    it('sets both min and max on numeric input when both are used in question', () => {
        const max = 1000,
            min = 100,
            value = 117;
        question[Constants.HAS_DATATYPE] = Constants.XSD.INT;
        question[Constants.XSD.MAX_INCLUSIVE] = max;
        question[Constants.XSD.MIN_INCLUSIVE] = min;
        answer[Constants.HAS_DATA_VALUE] = value;

        const component = Environment.render(<Answer question={question} answer={answer} onChange={onChange}/>),

            input = TestUtils.findRenderedDOMComponentWithTag(component, 'input');
        expect(input.type).toEqual('number');
        expect(input.max).toEqual(max.toString());
        expect(input.min).toEqual(min.toString());
    });

    it('sets min when xsd:positiveInteger is used as question datatype', () => {
        const value = 117;
        question[Constants.HAS_DATATYPE] = Constants.XSD.POSITIVE_INTEGER;
        answer[Constants.HAS_DATA_VALUE] = value;

        const component = Environment.render(<Answer question={question} answer={answer} onChange={onChange}/>),

            input = TestUtils.findRenderedDOMComponentWithTag(component, 'input');
        expect(input.type).toEqual('number');
        expect(input.min).toEqual('1');
    });

    it('displays question label as input placeholder', () => {
        const component = Environment.render(<Answer question={question} answer={answer} onChange={onChange}/>),

            input = TestUtils.findRenderedDOMComponentWithTag(component, 'input');
        expect(input.placeholder).toEqual(LABEL);
    });
});
