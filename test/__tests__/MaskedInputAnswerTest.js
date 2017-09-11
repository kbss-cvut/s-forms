'use strict';

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import JsonLdUtils from 'jsonld-utils';

import Answer from '../../src/components/Answer';
import Configuration from '../../src/model/Configuration';
import Constants from '../../src/constants/Constants';
import Environment from '../environment/Environment';
import Generator from '../environment/Generator';

describe('MaskedInputAnswer', () => {

    let question,
        onChange;

    beforeEach(() => {
        question = {};
        onChange = jasmine.createSpy('onChange');
        Environment.mockIntl();
    });

    it('renders a regular input when question contains no mask', () => {
        const value = '08/2016',
            answer = {
                '@id': Generator.getRandomUri()
            };
        answer[Constants.HAS_DATA_VALUE] = value;
        question[Constants.HAS_ANSWER] = [answer];
        question[JsonLdUtils.RDFS_LABEL] = 'Test';
        question[Constants.LAYOUT_CLASS] = [Constants.LAYOUT.MASKED_INPUT];
        const component = Environment.render(<Answer answer={answer} question={question} onChange={onChange}/>),

            input = TestUtils.findRenderedDOMComponentWithTag(component, 'input');
        expect(input.value).toEqual(value);
    });

    it('render disabled masked input with value when disabled layout class is specified', () => {
        const value = '08/2016',
            mask = '11/1111',
            answer = {
                '@id': Generator.getRandomUri()
            };
        answer[Constants.HAS_DATA_VALUE] = value;
        question[Constants.HAS_ANSWER] = [answer];
        question[JsonLdUtils.RDFS_LABEL] = 'Test';
        question[Constants.INPUT_MASK] = mask;
        question[Constants.LAYOUT_CLASS] = [Constants.LAYOUT.MASKED_INPUT, Constants.LAYOUT.DISABLED];
        const component = Environment.render(<Answer answer={answer} question={question} onChange={onChange}/>),

            input = TestUtils.findRenderedDOMComponentWithTag(component, 'input');
        expect(input.value).toEqual(value);
        expect(input.disabled).toBeTruthy();
    });
});
