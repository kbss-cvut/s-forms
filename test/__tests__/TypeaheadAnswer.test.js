import React from 'react';
import JsonLdUtils from 'jsonld-utils';

import * as Generator from '../environment/Generator';
import Configuration from '../../src/model/Configuration';
import * as Constants from '../../src/constants/Constants';
import TypeaheadAnswer from '../../src/components/answer/TypeaheadAnswer';

describe('TypeaheadAnswer', () => {
  let question;
  let onChange;

  beforeEach(() => {
    question = {
      '@id': Generator.getRandomUri()
    };
    question[Constants.LAYOUT_CLASS] = [];
    question[JsonLdUtils.RDFS_LABEL] = {
      '@language': 'en',
      '@value': '1 - Aerodrome General'
    };
    question[JsonLdUtils.RDFS_COMMENT] = {
      '@language': 'en',
      '@value': 'The identification of the aerodrome/helicopter landing area by name, location and status.'
    };
    onChange = jest.fn();
    Configuration.intl = {
      locale: 'en'
    };
    Configuration.loadFormOptions = jest.fn();
    Configuration.getOptions = jest.fn(() => [
      {
        id: '123',
        name: '123'
      }
    ]);
  });

  it('orders options using partial ordering with alphabetical ordering', () => {
    // create options
    const options = createOptionsWithPartialOrder(['3', '2', '1', 'before2'], ['before2<2']);
    const query = 'SELECT * WHERE { ?x ?y ?z .}';

    Configuration.getOptions = jest.fn(() => options);

    question[Constants.LAYOUT_CLASS].push(Constants.LAYOUT.QUESTION_TYPEAHEAD);
    question[Constants.HAS_OPTIONS_QUERY] = query;

    const component = shallow(
      <TypeaheadAnswer answer={{}} question={question} onChange={onChange} label="TestLabel" />
    );

    expect(Configuration.getOptions).toHaveBeenCalled();
    expect(component).not.toBeNull();
    expect(component.state('options').map((i) => i['id'])).toEqual(['1', 'before2', '2', '3']);
  });

  function createOptionsWithPartialOrder(ids, orderingRules) {
    let options = ids.map((i) => {
      let obj = { '@id': i };
      obj[JsonLdUtils.RDFS_LABEL] = i + '. value';
      return obj;
    });
    orderingRules.forEach((rule) => {
      const firstId = rule.substring(0, rule.indexOf('<'));
      const secondId = rule.substring(rule.indexOf('<') + 1);
      const secondIndex = ids.indexOf(secondId);

      options[secondIndex][Constants.HAS_PRECEDING_VALUE] = firstId;
    });
    return options;
  }
});
