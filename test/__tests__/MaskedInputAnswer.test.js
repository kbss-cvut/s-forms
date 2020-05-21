import React from 'react';
import JsonLdUtils from 'jsonld-utils';

import Answer from '../../src/components/Answer';
import * as Constants from '../../src/constants/Constants';
import * as Environment from '../environment/Environment';
import * as Generator from '../environment/Generator';
import { ConfigurationContext } from '../../src/contexts/ConfigurationContext';
import DefaultInput from '../../src/components/DefaultInput';

describe('MaskedInputAnswer', () => {
  let question, onChange;

  beforeEach(() => {
    question = {};
    onChange = jest.fn();
    Environment.mockIntl();
  });

  it('renders a regular input when question contains no mask', () => {
    const value = '08/2016';
    const answer = {
      '@id': Generator.getRandomUri()
    };

    answer[Constants.HAS_DATA_VALUE] = value;
    question[Constants.HAS_ANSWER] = [answer];
    question[JsonLdUtils.RDFS_LABEL] = 'Test';
    question[Constants.LAYOUT_CLASS] = [Constants.LAYOUT.MASKED_INPUT];

    const component = mount(
      <ConfigurationContext.Provider
        value={{
          componentsOptions: { readOnly: false },
          inputComponent: DefaultInput
        }}
      >
        <Answer answer={answer} question={question} onChange={onChange} />
      </ConfigurationContext.Provider>
    );
    const input = component.find('input');

    expect(input.props().value).toEqual(value);
  });

  it('render disabled masked input with value when disabled layout class is specified', () => {
    const value = '08/2016';
    const mask = '11/1111';
    const answer = {
      '@id': Generator.getRandomUri()
    };
    answer[Constants.HAS_DATA_VALUE] = value;
    question[Constants.HAS_ANSWER] = [answer];
    question[JsonLdUtils.RDFS_LABEL] = 'Test';
    question[Constants.INPUT_MASK] = mask;
    question[Constants.LAYOUT_CLASS] = [Constants.LAYOUT.MASKED_INPUT, Constants.LAYOUT.DISABLED];

    const component = mount(
      <ConfigurationContext.Provider
        value={{
          componentsOptions: { readOnly: true },
          inputComponent: DefaultInput
        }}
      >
        <Answer answer={answer} question={question} onChange={onChange} />
      </ConfigurationContext.Provider>
    );
    const input = component.find('input');

    expect(input.props().value).toEqual(value);
    expect(input.props().disabled).toBeTruthy();
  });
});
