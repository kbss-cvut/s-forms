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

    it('orders options using partial ordering with alphabetical ordering', () => {
        // create options
        const options = createOptionsWithPartialOrder(['3', '2', '1', 'before2'], ['before2<2']),
            query = 'SELECT * WHERE { ?x ?y ?z .}';

        optionsStore.getOptions.and.returnValue(options);
        question[Constants.LAYOUT_CLASS].push(Constants.LAYOUT.QUESTION_TYPEAHEAD);
        question[Constants.HAS_OPTIONS_QUERY] = query;

        const component = Environment.render(<TypeaheadAnswer answer={{}} question={question} onChange={onChange} label="TestLabel"/>),
            typeahead = TestUtils.findRenderedComponentWithType(component, require('react-bootstrap-typeahead'));

        expect(optionsStore.getOptions).toHaveBeenCalled();
        expect(actions.loadFormOptions).toHaveBeenCalled();
        expect(component).not.toBeNull();
        expect(component.state.options.map(i => i['id'])).toEqual(['1', 'before2', '2', '3']);
    });

    function createOptionsWithPartialOrder(ids, orderingRules) {
        let options = ids
            .map((i) => {
                let obj = {'@id': i};
                obj[JsonLdUtils.RDFS_LABEL] = i + '. value';
                return obj;
            });
        orderingRules.forEach(
            rule => {
                const firstId = rule.substring(0, rule.indexOf('<'));
                const secondId = rule.substring(rule.indexOf('<')+1);
                const secondIndex = ids.indexOf(secondId);

                options[secondIndex][Constants.HAS_PRECEDING_VALUE] = firstId;
            }
        );
        return options;
    }
});