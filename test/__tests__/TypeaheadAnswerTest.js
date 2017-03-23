'use strict';

import React from "react";
import JsonLdUtils from "jsonld-utils";
import TestUtils from "react-addons-test-utils";

import Environment from "../environment/Environment";
import Generator from "../environment/Generator";

import Configuration from "../../src/model/Configuration";
import Constants from "../../src/constants/Constants";
import TypeaheadAnswer from "../../src/components/answer/TypeaheadAnswer";

describe('TypeaheadAnswer', () => {

    let question,
        onChange,
        optionsStore,
        actions;

    beforeEach(() => {
        question = {
            "@id": Generator.getRandomUri()
        };
        question[Constants.LAYOUT_CLASS] = [];
        question[JsonLdUtils.RDFS_LABEL] = {
            "@language": "en",
            "@value": "1 - Aerodrome General"
        };
        question[JsonLdUtils.RDFS_COMMENT] = {
            "@language": "en",
            "@value": "The identification of the aerodrome/helicopter landing area by name, location and status."
        };
        onChange = jasmine.createSpy('onChange');
        Configuration.intl = {
            locale: 'en'
        };
        optionsStore = jasmine.createSpyObj('OptionsStore', ['listen', 'getOptions']);
        optionsStore.getOptions.and.returnValue([{
            id: '123',
            name: '123'
        }]);
        Configuration.optionsStore = optionsStore;
        actions = jasmine.createSpyObj('Actions', ['loadFormOptions']);
        Configuration.actions = actions;
    });

    it('passes null to onChange when value is reset', () => {
        question[Constants.LAYOUT_CLASS].push(Constants.LAYOUT.QUESTION_TYPEAHEAD);
        const component = Environment.render(<TypeaheadAnswer answer={{}} question={question} label="Test" value="123"
                                                              onChange={onChange}/>);

        const resetButton = TestUtils.scryRenderedDOMComponentsWithTag(component, 'button')[0];
        TestUtils.Simulate.click(resetButton);
        expect(onChange).toHaveBeenCalledWith(null);
    });
});