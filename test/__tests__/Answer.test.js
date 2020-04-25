import React from 'react';
import JsonLdUtils from 'jsonld-utils';
import moment from 'moment';
import { shallow } from 'enzyme';
import Typeahead from 'react-bootstrap-typeahead';
import DateTimePicker from 'react-bootstrap-datetimepicker';

import * as Generator from '../environment/Generator';
import Answer from '../../src/components/Answer';
import Configuration from '../../src/model/Configuration';
import * as Constants from '../../src/constants/Constants';
import TypeaheadAnswer from '../../src/components/answer/TypeaheadAnswer';
import MaskedInput from '../../src/components/MaskedInput';

describe('Answer component', () => {
  let question, onChange, answer;

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
    Configuration.getOptions = jest.fn(() => []);
    Configuration.loadFormOptions = jest.fn();
  });

  it('renders a Typeahead when layout class is typeahead', () => {
    question[Constants.LAYOUT_CLASS].push(Constants.LAYOUT.QUESTION_TYPEAHEAD);
    const component = shallow(<Answer answer={{}} question={question} onChange={onChange} />);
    const typeahead = component.find(Typeahead);
    expect(typeahead).not.toBeNull();
  });

  it('loads typeahead options when layout class is typeahead and no possible values are specified', () => {
    question[Constants.LAYOUT_CLASS].push(Constants.LAYOUT.QUESTION_TYPEAHEAD);
    const query = 'SELECT * WHERE { ?x ?y ?z .}';
    question[Constants.HAS_OPTIONS_QUERY] = query;
    mount(<Answer answer={{}} question={question} onChange={onChange} />);

    expect(Configuration.loadFormOptions).toHaveBeenCalled();
    expect(Configuration.loadFormOptions.mock.calls[0][1]).toEqual(query);
  });

  it('maps answer object value to string label for the typeahead component', () => {
    const value = Generator.getRandomUri();
    const valueLabel = 'masterchief';
    const options = Generator.generateTypeaheadOptions(value, valueLabel);
    answer = answerWithCodeValue(value);
    Configuration.getOptions = jest.fn(() => options);
    question[Constants.HAS_ANSWER] = [answer];
    question[Constants.LAYOUT_CLASS].push(Constants.LAYOUT.QUESTION_TYPEAHEAD);
    question[Constants.HAS_OPTIONS_QUERY] = 'SELECT * WHERE {?x ?y ?z. }';

    const component = shallow(<Answer answer={answer} question={question} onChange={onChange} />);
    const typeahead = component.find(TypeaheadAnswer).dive().find(Typeahead);

    expect(typeahead).not.toBeNull();
    expect(typeahead.dive().state('entryValue')).toEqual(valueLabel);
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

    const component = mount(<Answer answer={answer} question={question} onChange={onChange} />);
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
    Configuration.dateTimeFormat = 'YYYY-MM-DD';
    const date = new Date();
    const value = moment(date).format(Configuration.dateTimeFormat);
    answer = answerWithTextValue(value);
    question[Constants.HAS_ANSWER] = [answer];
    question[Constants.LAYOUT_CLASS].push(Constants.LAYOUT.DATE);

    const component = mount(<Answer answer={answer} question={question} onChange={onChange} />);
    const picker = component.find(DateTimePicker);

    expect(picker).not.toBeNull();
    expect(picker.props().mode).toEqual('date');
    expect(picker.props().dateTime).toEqual(value);
  });

  it('renders time picker with answer value when time layout class is specified', () => {
    Configuration.dateTimeFormat = 'hh:mm:ss';
    const date = new Date();
    const value = moment(date).format(Configuration.dateTimeFormat);
    answer = answerWithTextValue(value);
    question[Constants.HAS_ANSWER] = [answer];
    question[Constants.LAYOUT_CLASS].push(Constants.LAYOUT.TIME);

    const component = mount(<Answer answer={answer} question={question} onChange={onChange} />);
    const picker = component.find(DateTimePicker);

    expect(picker).not.toBeNull();
    expect(picker.props().mode).toEqual('time');
    expect(picker.props().dateTime).toEqual(value);
  });

  it('renders datetime picker with answer value when datetime layout class is specified', () => {
    Configuration.dateTimeFormat = 'YYYY-MM-DD hh:mm:ss';
    const date = new Date();
    const value = moment(date).format(Configuration.dateTimeFormat);
    answer = answerWithTextValue(value);
    question[Constants.HAS_ANSWER] = [answer];
    question[Constants.LAYOUT_CLASS].push(Constants.LAYOUT.DATETIME);

    const component = mount(<Answer answer={answer} question={question} onChange={onChange} />);
    const picker = component.find(DateTimePicker);

    expect(picker).not.toBeNull();
    expect(picker.props().mode).toEqual('datetime');
    expect(picker.props().dateTime).toEqual(value);
  });

  it('renders datetime picker with answer value when no layout class is specified and numeric answer value is used', () => {
    const value = Date.now();
    answer = {
      '@id': Generator.getRandomUri()
    };
    answer[Constants.HAS_DATA_VALUE] = value;
    question[Constants.HAS_ANSWER] = [answer];
    question[Constants.LAYOUT_CLASS].push(Constants.LAYOUT.DATETIME);

    const component = mount(<Answer answer={answer} question={question} onChange={onChange} />);
    const picker = component.find(DateTimePicker);

    expect(picker).not.toBeNull();
    expect(picker.props().mode).toEqual('datetime');
    expect(picker.props().dateTime).toEqual(value);
    expect(picker.props().format).toEqual(Constants.DATETIME_NUMBER_FORMAT);
  });

  it('renders checkbox with answer value when checkbox layout class is specified', () => {
    const answer = {
      '@id': Generator.getRandomUri()
    };
    answer[Constants.HAS_DATA_VALUE] = true;
    question[Constants.HAS_ANSWER] = [answer];
    question[Constants.LAYOUT_CLASS].push(Constants.LAYOUT.CHECKBOX);

    const component = mount(<Answer answer={answer} question={question} onChange={onChange} />);
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

    const component = mount(<Answer answer={answer} question={question} onChange={onChange} />);
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

    const component = mount(<Answer answer={answer} question={question} onChange={onChange} />);
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

    const component = mount(<Answer answer={answer} question={question} onChange={onChange} />);
    const input = component.find(MaskedInput);

    expect(input).toBeDefined();
    expect(input.props().value).toEqual(value);
    expect(input.props().mask).toEqual(mask);
  });

  it('sets typeahead answer as code value', () => {
    question[Constants.LAYOUT_CLASS].push(Constants.LAYOUT.QUESTION_TYPEAHEAD);
    const component = mount(<Answer answer={{}} question={question} onChange={onChange} />);

    const value = Generator.getRandomUri();
    component.instance().onValueChange(value);
    expect(onChange).toHaveBeenCalled();

    const change = onChange.mock.calls[0][1];
    expect(change[Constants.HAS_OBJECT_VALUE]['@id']).toEqual(value);
  });
});
