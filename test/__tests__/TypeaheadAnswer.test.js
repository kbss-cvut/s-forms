import React from 'react';
import JsonLdUtils from 'jsonld-utils';

import * as Generator from '../environment/Generator';
import Configuration from '../../src/model/Configuration';
import * as Constants from '../../src/constants/Constants';
import TypeaheadAnswer from '../../src/components/answer/TypeaheadAnswer';
import { FormGenContext } from '../../src/contexts/FormGenContext';

describe('TypeaheadAnswer', () => {
  let question;
  let onChange;
  let loadFormOptions;
  let getOptions;

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
    loadFormOptions = jest.fn();
    getOptions = jest.fn(() => [
      {
        id: '123',
        name: '123'
      }
    ]);
  });

  // contextType not yet supported by enzyme https://github.com/enzymejs/enzyme/issues/2189
  it('orders options using partial ordering with alphabetical ordering', () => {
    // create options
    const options = createOptionsWithPartialOrder(['3', '2', '1', 'before2'], ['before2<2']);
    const query = 'SELECT * WHERE { ?x ?y ?z .}';

    question[Constants.LAYOUT_CLASS].push(Constants.LAYOUT.QUESTION_TYPEAHEAD);
    question[Constants.HAS_OPTIONS_QUERY] = query;

    const component = mount(
      <TypeaheadAnswer answer={{}} question={question} onChange={onChange} label="TestLabel" options={options} />
    );

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
