import React from 'react';
import { Card, Accordion } from 'react-bootstrap';
import JsonLdUtils from 'jsonld-utils';

import * as Constants from '../../src/constants/Constants';
import Question from '../../src/components/Question';
import { ConfigurationContext } from '../../src/contexts/ConfigurationContext';
import DefaultInput from '../../src/components/DefaultInput';

describe('Question', () => {
  let question, onChange, options, inputComponent, componentsOptions;

  beforeEach(() => {
    question = {
      '@id': 'http://onto.fel.cvut.cz/ontologies/eccairs/model/instance#instance-1223764187-q',
      '@type': 'doc:question',
      'http://onto.fel.cvut.cz/ontologies/documentation/has_answer': {
        '@id': 'http://onto.fel.cvut.cz/ontologies/eccairs/model/instance#instance-636079211-a',
        'http://onto.fel.cvut.cz/ontologies/documentation/has_data_value': 'test'
      },
      'http://onto.fel.cvut.cz/ontologies/form/has-origin-type':
        'http://onto.fel.cvut.cz/ontologies/eccairs/aviation-3.4.0.2/a-453',
      'http://onto.fel.cvut.cz/ontologies/form/has-template-origin':
        'http://onto.fel.cvut.cz/ontologies/eccairs/model/instance#instance-1223764187',
      'http://onto.fel.cvut.cz/ontologies/form/has-template':
        'http://onto.fel.cvut.cz/ontologies/eccairs/aviation-3.4.0.2/a-453-qt',
      'http://www.w3.org/2000/01/rdf-schema#comment': {
        '@language': 'en',
        '@value': 'The identification of the entity or organisation that is responsible for the report.'
      },
      'http://www.w3.org/2000/01/rdf-schema#label': {
        '@language': 'en',
        '@value': '453 - Responsible entity'
      }
    };
    onChange = jest.fn();
    options = {
      intl: {
        locale: 'en'
      }
    };
    componentsOptions = {
      readOnly: false,
      dateTimeAnswer: { dateFormat: 'yyyy-MM-dd', timeFormat: 'HH:mm:ss', dateTimeFormat: 'yyyy-MM-dd HH:mm:ss' }
    };
    inputComponent = DefaultInput;
  });

  it('renders section collapsed when layout class is set to collapsed', () => {
    question[Constants.LAYOUT_CLASS] = [Constants.LAYOUT.QUESTION_SECTION, Constants.LAYOUT.COLLAPSED];

    const result = mount(
      <ConfigurationContext.Provider
        value={{
          componentsOptions,
          inputComponent,
          options
        }}
      >
        <Question question={question} onChange={onChange} />
      </ConfigurationContext.Provider>
    );
    const card = result.find(Accordion);
    const label = JsonLdUtils.getLocalized(question[JsonLdUtils.RDFS_LABEL], options.intl);

    expect(card.prop('defaultActiveKey')).toBe(label);
  });

  it('renders section by default expanded', () => {
    question[Constants.LAYOUT_CLASS] = [Constants.LAYOUT.QUESTION_SECTION];

    const result = mount(
      <ConfigurationContext.Provider
        value={{
          componentsOptions,
          inputComponent,
          options
        }}
      >
        <Question question={question} onChange={onChange} />
      </ConfigurationContext.Provider>
    );
    const card = result.find(Card);

    expect(card.prop('defaultActiveKey')).toBe(undefined);
  });
});
