import React from 'react';
import JsonLdObjectUtils from '../../src/util/JsonLdObjectUtils';

describe('JsonLd object utils', () => {
  let trueValues, falseValues;

  beforeEach(() => {
    trueValues = [true, { '@value': true }, { '@value': 'true' }, { '@value': 'true', '@language': 'en' }];
    falseValues = [false, { '@value': false }, { '@value': 'false' }, { '@value': 'false', '@language': 'en' }];
  });

  it('returns true for comparison of json-ld objects with same @id-s', () => {
    const value1 = { '@id': 'http://vfn.cz/ontologies/study-model/answer-value-yes' };
    const value2 = { '@id': 'http://vfn.cz/ontologies/study-model/answer-value-yes' };

    expect(JsonLdObjectUtils.compareValues(value1, value2)).toBe(true);
    expect(JsonLdObjectUtils.compareValues(value2, value1)).toBe(true);
  });

  it('returns false for comparison of json-ld objects with different @id-s', () => {
    const value1 = { '@id': 'http://vfn.cz/ontologies/study-model/answer-value-no' };
    const value2 = { '@id': 'http://vfn.cz/ontologies/study-model/answer-value-yes' };

    expect(JsonLdObjectUtils.compareValues(value1, value2)).toBe(false);
    expect(JsonLdObjectUtils.compareValues(value2, value1)).toBe(false);
  });

  it('returns true for comparison of same boolean values represented as string', () => {
    for (let i = 0; i < trueValues.length; i++) {
      for (let j = 0; j < trueValues.length; j++) {
        expect(JsonLdObjectUtils.compareValues(trueValues[i], trueValues[j])).toBe(
          true,
          'when comparing ' + JSON.stringify(trueValues[i]) + ' with ' + JSON.stringify(trueValues[j])
        );
      }
    }
  });

  it('returns false for comparison of different boolean values represented as string', () => {
    for (let i = 0; i < trueValues.length; i++) {
      for (let j = 0; j < falseValues.length; j++) {
        expect(JsonLdObjectUtils.compareValues(trueValues[i], falseValues[j])).toBe(
          false,
          'when comparing ' + JSON.stringify(trueValues[i]) + ' with ' + JSON.stringify(falseValues[j])
        );
        expect(JsonLdObjectUtils.compareValues(falseValues[j], trueValues[i])).toBe(
          false,
          'when comparing ' + JSON.stringify(falseValues[j]) + ' with ' + JSON.stringify(trueValues[i])
        );
      }
    }
  });
});
