import React from 'react';
import JsonLdUtils from 'jsonld-utils';

import Answer from '../../src/components/Answer';
import Configuration from '../../src/model/Configuration';
import * as Constants from '../../src/constants/Constants';
import * as Generator from '../environment/Generator';
import { ConfigurationContext } from '../../src/contexts/ConfigurationContext';
import DefaultInput from '../../src/components/DefaultInput';

const LABEL = 'Input answer test';

describe('InputAnswer', () => {
  let question, answer, onChange;

  beforeEach(() => {
    question = {
      '@id': Generator.getRandomUri()
    };
    question[Constants.LAYOUT_CLASS] = [];
    question[JsonLdUtils.RDFS_LABEL] = {
      '@language': 'en',
      '@value': LABEL
    };
    question[JsonLdUtils.RDFS_COMMENT] = {
      '@language': 'en',
      '@value': 'Javascript sucks!!!'
    };
    onChange = jest.fn();
    Configuration.intl = {
      locale: 'en'
    };
    answer = {
      id: Generator.getRandomUri()
    };
    question[Constants.HAS_ANSWER] = [answer];
  });

  it('sets min on numeric input when xsd:minInclusive is used in question', () => {
    const min = 100;
    const value = 117;
    question[Constants.HAS_DATATYPE] = Constants.XSD.INT;
    question[Constants.XSD.MIN_INCLUSIVE] = min;
    answer[Constants.HAS_DATA_VALUE] = value;

    const component = mount(
      <ConfigurationContext.Provider
        value={{
          componentsOptions: { readOnly: false },
          inputComponent: DefaultInput
        }}
      >
        <Answer question={question} answer={answer} onChange={onChange} />
      </ConfigurationContext.Provider>
    );
    const input = component.find('input');

    expect(input.props().type).toEqual('number');
    expect(input.props().min).toEqual(min);
  });

  it('sets min on numeric input when xsd:minExclusive is used in question', () => {
    const min = 100;
    const value = 117;
    question[Constants.HAS_DATATYPE] = Constants.XSD.INT;
    question[Constants.XSD.MIN_EXCLUSIVE] = min;
    answer[Constants.HAS_DATA_VALUE] = value;

    const component = mount(
      <ConfigurationContext.Provider
        value={{
          componentsOptions: { readOnly: false },
          inputComponent: DefaultInput
        }}
      >
        <Answer question={question} answer={answer} onChange={onChange} />
      </ConfigurationContext.Provider>
    );
    const input = component.find('input');

    expect(input.props().type).toEqual('number');
    expect(input.props().min).toEqual(min + 1);
  });

  it('sets max on numeric input when xsd:maxExclusive is used in question', () => {
    const max = 1000;
    const value = 117;
    question[Constants.HAS_DATATYPE] = Constants.XSD.INT;
    question[Constants.XSD.MAX_EXCLUSIVE] = max;
    answer[Constants.HAS_DATA_VALUE] = value;

    const component = mount(
      <ConfigurationContext.Provider
        value={{
          componentsOptions: { readOnly: false },
          inputComponent: DefaultInput
        }}
      >
        <Answer question={question} answer={answer} onChange={onChange} />
      </ConfigurationContext.Provider>
    );
    const input = component.find('input');

    expect(input.props().type).toEqual('number');
    expect(input.props().max).toEqual(max - 1);
  });

  it('sets max on numeric input when xsd:maxInclusive is used in question', () => {
    const max = 1000;
    const value = 117;
    question[Constants.HAS_DATATYPE] = Constants.XSD.INT;
    question[Constants.XSD.MAX_INCLUSIVE] = max;
    answer[Constants.HAS_DATA_VALUE] = value;

    const component = mount(
      <ConfigurationContext.Provider
        value={{
          componentsOptions: { readOnly: false },
          inputComponent: DefaultInput
        }}
      >
        <Answer question={question} answer={answer} onChange={onChange} />
      </ConfigurationContext.Provider>
    );
    const input = component.find('input');

    expect(input.props().type).toEqual('number');
    expect(input.props().max).toEqual(max);
  });

  it('sets both min and max on numeric input when both are used in question', () => {
    const max = 1000;
    const min = 100;
    const value = 117;
    question[Constants.HAS_DATATYPE] = Constants.XSD.INT;
    question[Constants.XSD.MAX_INCLUSIVE] = max;
    question[Constants.XSD.MIN_INCLUSIVE] = min;
    answer[Constants.HAS_DATA_VALUE] = value;

    const component = mount(
      <ConfigurationContext.Provider
        value={{
          componentsOptions: { readOnly: false },
          inputComponent: DefaultInput
        }}
      >
        <Answer question={question} answer={answer} onChange={onChange} />
      </ConfigurationContext.Provider>
    );
    const input = component.find('input');

    expect(input.props().type).toEqual('number');
    expect(input.props().max).toEqual(max);
    expect(input.props().min).toEqual(min);
  });

  it('sets min when xsd:positiveInteger is used as question datatype', () => {
    const value = 117;
    question[Constants.HAS_DATATYPE] = Constants.XSD.POSITIVE_INTEGER;
    answer[Constants.HAS_DATA_VALUE] = value;

    const component = mount(
      <ConfigurationContext.Provider
        value={{
          componentsOptions: { readOnly: false },
          inputComponent: DefaultInput
        }}
      >
        <Answer question={question} answer={answer} onChange={onChange} />
      </ConfigurationContext.Provider>
    );
    const input = component.find('input');

    expect(input.props().type).toEqual('number');
    expect(input.props().min).toEqual(1);
  });
});
