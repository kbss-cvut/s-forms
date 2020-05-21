import React from 'react';
import JsonLdUtils from 'jsonld-utils';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import Select from 'react-select';

import * as Generator from '../environment/Generator';
import Answer from '../../src/components/Answer';
import Configuration from '../../src/model/Configuration';
import * as Constants from '../../src/constants/Constants';
import TypeaheadAnswer from '../../src/components/answer/TypeaheadAnswer';
import MaskedInput from '../../src/components/MaskedInput';
import { FormGenContext } from '../../src/contexts/FormGenContext';
import { ComponentsContext } from '../../src/contexts/ComponentsContext';
import DefaultInput from '../../src/components/DefaultInput';

describe('Answer component', () => {
  let question, onChange, answer, getOptions, loadFormOptions;

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
    getOptions = jest.fn(() => []);
    loadFormOptions = jest.fn();
  });

  it('renders a Typeahead when layout class is typeahead', () => {
    question[Constants.LAYOUT_CLASS].push(Constants.LAYOUT.QUESTION_TYPEAHEAD);
    const component = mount(
      <ComponentsContext.Provider
        value={{
          options: { readOnly: false },
          inputComponent: DefaultInput
        }}
      >
        <FormGenContext.Provider value={{ getOptions, loadFormOptions }}>
          <Answer answer={{}} question={question} onChange={onChange}/>
        </FormGenContext.Provider>
      </ComponentsContext.Provider>
    );

    const typeahead = component.find(Select);
    expect(typeahead).not.toBeNull();
  });

  it('maps answer object value to string label for the typeahead component', () => {
    const value = Generator.getRandomUri();
    const valueLabel = 'masterchief';
    const options = Generator.generateTypeaheadOptions(value, valueLabel);
    answer = answerWithCodeValue(value);
    getOptions = jest.fn(() => options);
    question[Constants.HAS_ANSWER] = [answer];
    question[Constants.LAYOUT_CLASS].push(Constants.LAYOUT.QUESTION_TYPEAHEAD);
    question[Constants.HAS_OPTIONS_QUERY] = 'SELECT * WHERE {?x ?y ?z. }';

    const component = mount(
      <ComponentsContext.Provider
        value={{
          options: { readOnly: false },
          inputComponent: DefaultInput
        }}
      >
        <FormGenContext.Provider value={{ getOptions, loadFormOptions: () => options }}>
          <Answer answer={answer} question={question} onChange={onChange}/>
        </FormGenContext.Provider>
      </ComponentsContext.Provider>
    );

    waitForComponentToPaint(component);
    const typeahead = component.find(Answer).find(TypeaheadAnswer).find(Select);

    expect(typeahead).not.toBeNull();

    expect(typeahead.state('value')[0].name).toEqual(valueLabel);
  });

  it('loads typeahead options when layout class is typeahead and no possible values are specified', () => {
    question[Constants.LAYOUT_CLASS].push(Constants.LAYOUT.QUESTION_TYPEAHEAD);
    const query = 'SELECT * WHERE { ?x ?y ?z .}';
    question[Constants.HAS_OPTIONS_QUERY] = query;

    const component = mount(
      <ComponentsContext.Provider
        value={{
          options: { readOnly: false },
          inputComponent: DefaultInput
        }}
      >
        <FormGenContext.Provider value={{ getOptions, loadFormOptions }}>
          <Answer answer={{}} question={question} onChange={onChange}/>
        </FormGenContext.Provider>
      </ComponentsContext.Provider>
    );

    waitForComponentToPaint(component);

    expect(loadFormOptions).toHaveBeenCalled();
    expect(loadFormOptions.mock.calls[0][1]).toEqual(query);
  });

  function answerWithCodeValue(value) {
    const res = {
      '@id': Generator.getRandomUri()
    };
    res[Constants.HAS_OBJECT_VALUE] = {
      '@id': value
    };
    return res;
  }

  it('shows input with text value of the answer when no layout class is specified', () => {
    const value = 'masterchief';
    answer = answerWithTextValue(value);
    question[Constants.HAS_ANSWER] = [answer];

    const component = mount(
      <ComponentsContext.Provider
        value={{
          options: { readOnly: false },
          inputComponent: DefaultInput
        }}
      >
        <Answer answer={answer} question={question} onChange={onChange}/>s
      </ComponentsContext.Provider>
    );
    const input = component.find('input');

    expect(input).not.toBeNull();
    expect(input.props().type).toEqual('text');
    expect(input.props().value).toEqual(value);
  });

  function answerWithTextValue(value) {
    const res = {
      '@id': Generator.getRandomUri()
    };
    res[Constants.HAS_DATA_VALUE] = {
      '@language': 'en',
      '@value': value
    };
    return res;
  }

  it('renders date picker with answer value when date layout class is specified', () => {
    const date = new Date('2000-01-01');
    const value = format(date, 'yyyy-MM-dd HH:mm:ss');

    answer = answerWithTextValue(value);
    question[Constants.HAS_ANSWER] = [answer];
    question[Constants.LAYOUT_CLASS].push(Constants.LAYOUT.DATE);

    const component = mount(
      <ComponentsContext.Provider
        value={{
          options: {
            readOnly: false,
            dateTimeAnswer: { dateFormat: 'yyyy-MM-dd', timeFormat: 'HH:mm:ss', dateTimeFormat: 'yyyy-MM-dd HH:mm:ss' }
          },
          inputComponent: DefaultInput
        }}
      >
        <Answer answer={answer} question={question} onChange={onChange}/>
      </ComponentsContext.Provider>
    );
    const picker = component.find(DatePicker);

    expect(picker).not.toBeNull();
    expect(picker.props().showTimeSelect).toEqual(false);
    expect(picker.props().showTimeSelectOnly).toEqual(false);
    expect(picker.props().selected).toEqual(date);
  });

  it('renders time picker with answer value when time layout class is specified', () => {
    const date = new Date();
    const value = format(date, 'HH:mm:ss');

    answer = answerWithTextValue(value);
    question[Constants.HAS_ANSWER] = [answer];
    question[Constants.LAYOUT_CLASS].push(Constants.LAYOUT.TIME);

    const component = mount(
      <ComponentsContext.Provider
        value={{
          options: {
            readOnly: false,
            dateTimeAnswer: { dateFormat: 'yyyy-MM-dd', timeFormat: 'HH:mm:ss', dateTimeFormat: 'yyyy-MM-dd HH:mm:ss' }
          },
          inputComponent: DefaultInput
        }}
      >
        <Answer answer={answer} question={question} onChange={onChange}/>
      </ComponentsContext.Provider>
    );
    const picker = component.find(DatePicker);

    expect(picker).not.toBeNull();
    expect(picker.props().showTimeSelect).toEqual(true);
    expect(picker.props().showTimeSelectOnly).toEqual(true);
    expect(picker.props().selected).toEqual(new Date(`0 ${value}`));
  });

  it('renders datetime picker with answer value when datetime layout class is specified', () => {
    const date = new Date();
    const value = format(date, 'yyyy-MM-dd HH:mm:ss');
    answer = answerWithTextValue(value);
    question[Constants.HAS_ANSWER] = [answer];
    question[Constants.LAYOUT_CLASS].push(Constants.LAYOUT.DATETIME);

    const component = mount(
      <ComponentsContext.Provider
        value={{
          options: {
            readOnly: false,
            dateTimeAnswer: { dateFormat: 'yyyy-MM-dd', timeFormat: 'HH:mm:ss', dateTimeFormat: 'yyyy-MM-dd HH:mm:ss' }
          },
          inputComponent: { inputComponent: DefaultInput }
        }}
      >
        <Answer answer={answer} question={question} onChange={onChange}/>
      </ComponentsContext.Provider>
    );
    const picker = component.find(DatePicker);

    expect(picker).not.toBeNull();
    expect(picker.props().showTimeSelect).toEqual(true);
    expect(picker.props().showTimeSelectOnly).toEqual(false);
    expect(picker.props().selected).toEqual(new Date(value));
  });

  it('renders datetime picker with answer value when no layout class is specified and numeric answer value is used', () => {
    const value = Number(new Date());
    answer = {
      '@id': Generator.getRandomUri()
    };
    answer[Constants.HAS_DATA_VALUE] = value;
    question[Constants.HAS_ANSWER] = [answer];
    question[Constants.LAYOUT_CLASS].push(Constants.LAYOUT.DATETIME);

    const component = mount(
      <ComponentsContext.Provider
        value={{
          options: {
            readOnly: false,
            dateTimeAnswer: { dateFormat: 'yyyy-MM-dd', timeFormat: 'HH:mm:ss', dateTimeFormat: 'yyyy-MM-dd HH:mm:ss' }
          },
          inputComponent: { inputComponent: DefaultInput }
        }}
      >
        <Answer answer={answer} question={question} onChange={onChange}/>
      </ComponentsContext.Provider>
    );
    const picker = component.find(DatePicker);

    expect(picker).not.toBeNull();
    expect(picker.props().showTimeSelect).toEqual(true);
    expect(picker.props().showTimeSelectOnly).toEqual(false);
    expect(picker.props().selected).toEqual(new Date(value));
  });

  it('renders checkbox with answer value when checkbox layout class is specified', () => {
    const answer = {
      '@id': Generator.getRandomUri()
    };
    answer[Constants.HAS_DATA_VALUE] = true;
    question[Constants.HAS_ANSWER] = [answer];
    question[Constants.LAYOUT_CLASS].push(Constants.LAYOUT.CHECKBOX);

    const component = mount(
      <ComponentsContext.Provider
        value={{
          options: {
            readOnly: false
          },
          inputComponent: DefaultInput
        }}
      >
        <Answer answer={answer} question={question} onChange={onChange}/>
      </ComponentsContext.Provider>
    );
    const input = component.find('input');

    expect(input).toBeDefined();
    expect(input.props().type).toEqual('checkbox');
    expect(input.props().checked).toBeTruthy();
  });

  it('renders numeric input with answer value when number layout class is specified', () => {
    const value = 117;
    const answer = {
      '@id': Generator.getRandomUri()
    };
    answer[Constants.HAS_DATA_VALUE] = value;
    question[Constants.HAS_ANSWER] = [answer];
    question[Constants.HAS_DATATYPE] = Constants.XSD.INT;

    const component = mount(
      <ComponentsContext.Provider
        value={{
          options: {
            readOnly: false
          },
          inputComponent: DefaultInput
        }}
      >
        <Answer answer={answer} question={question} onChange={onChange}/>
      </ComponentsContext.Provider>
    );
    const input = component.find('input');

    expect(input).toBeDefined();
    expect(input.props().type).toEqual('number');
    expect(input.props().value).toEqual(value);
  });

  it('renders textarea for answer with long value', () => {
    let value = '';
    for (let i = 0; i < Constants.INPUT_LENGTH_THRESHOLD + 1; i++) {
      value += 'a';
    }
    answer = answerWithTextValue(value);
    answer[Constants.HAS_DATA_VALUE] = value;
    question[Constants.HAS_ANSWER] = [answer];

    const component = mount(
      <ComponentsContext.Provider
        value={{
          options: {
            readOnly: false
          },
          inputComponent: DefaultInput
        }}
      >
        <Answer answer={answer} question={question} onChange={onChange}/>
      </ComponentsContext.Provider>
    );
    const input = component.find('textarea');

    expect(input).toBeDefined();
    expect(input.props().value).toEqual(value);
  });

  it('renders masked input for question with masked-input layout class', () => {
    const value = '08/2016';
    const mask = '11/1111';
    const answer = {
      '@id': Generator.getRandomUri()
    };
    answer[Constants.HAS_DATA_VALUE] = value;
    question[Constants.HAS_ANSWER] = [answer];
    question[Constants.LAYOUT_CLASS].push(Constants.LAYOUT.MASKED_INPUT);
    question[Constants.INPUT_MASK] = mask;

    const component = mount(
      <ComponentsContext.Provider
        value={{
          options: { readOnly: false },
          inputComponent: DefaultInput
        }}
      >
        <Answer answer={answer} question={question} onChange={onChange}/>
      </ComponentsContext.Provider>
    );
    const input = component.find(MaskedInput);

    expect(input).toBeDefined();
    expect(input.props().value).toEqual(value);
    expect(input.props().mask).toEqual(mask);
  });
});
