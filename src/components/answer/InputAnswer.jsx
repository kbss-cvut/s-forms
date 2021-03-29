import React, { useContext } from 'react';
import JsonLdUtils from 'jsonld-utils';
import PropTypes from 'prop-types';
import Constants from '../../constants/Constants';
import FormUtils from '../../util/FormUtils';
import YASQE from 'yasgui-yasqe';
import { ConfigurationContext } from '../../contexts/ConfigurationContext';

const NUMERIC_DATATYPES = [
  Constants.XSD.INT,
  Constants.XSD.INTEGER,
  Constants.XSD.NON_NEGATIVE_INTEGER,
  Constants.XSD.NON_POSITIVE_INTEGER,
  Constants.XSD.NEGATIVE_INTEGER,
  Constants.XSD.POSITIVE_INTEGER
];

const DECLARED_PREFIXES = 'http://onto.fel.cvut.cz/ontologies/form-spin/has-declared-prefix';

const NUMBER_RULES = {};
NUMBER_RULES[Constants.XSD.NON_NEGATIVE_INTEGER] = { min: 0 };
NUMBER_RULES[Constants.XSD.NON_POSITIVE_INTEGER] = { max: 0 };
NUMBER_RULES[Constants.XSD.NEGATIVE_INTEGER] = { max: -1 };
NUMBER_RULES[Constants.XSD.POSITIVE_INTEGER] = { min: 1 };

const tokenTypes = {
  'string-2': 'prefixed',
  atom: 'var'
};

class InputPropertiesResolver {
  static _resolveInputType(question, value) {
    if (
      FormUtils.isSparqlInput(question) ||
      FormUtils.isTurtleInput(question) ||
      FormUtils.isTextarea(question, value)
    ) {
      return 'textarea';
    } else if (InputPropertiesResolver._isNumeric(question)) {
      return 'number';
    }
    return 'text';
  }

  static _isNumeric(question) {
    for (let i = 0, len = NUMERIC_DATATYPES.length; i < len; i++) {
      if (JsonLdUtils.hasValue(question, Constants.HAS_DATATYPE, NUMERIC_DATATYPES[i])) {
        return true;
      }
    }
    return false;
  }

  static resolveInputProperties(question, value, componentsOptions) {
    let props = {};
    props.type = InputPropertiesResolver._resolveInputType(question, value);
    switch (props['type']) {
      case 'textarea':
        props.rows = 5;
        break;
      case 'number':
        props = {
          ...props,
          ...InputPropertiesResolver._resolveNumberRestrictions(question),
          ...this._resolveStepRestriction(question)
        };
        break;
      default:
        break;
    }
    props.disabled = componentsOptions.readOnly || FormUtils.isDisabled(question);
    if (question[Constants.HAS_VALID_ANSWER] === false) {
      props.validation = 'error';
      props.help = question[Constants.HAS_VALIDATION_MESSAGE];
    }

    return props;
  }

  static _resolveStepRestriction(question) {
    let restriction = {};
    if (question[Constants.STEP] !== undefined) {
      restriction['step'] = JsonLdUtils.getJsonAttValue(question, Constants.STEP);
    }
    return restriction;
  }

  static _resolveNumberRestrictions(question) {
    let restriction = {};
    Object.getOwnPropertyNames(NUMBER_RULES).forEach((key) => {
      if (JsonLdUtils.hasValue(question, Constants.HAS_DATATYPE, key)) {
        restriction = { ...restriction, ...NUMBER_RULES[key] };
      }
    });
    if (question[Constants.XSD.MIN_INCLUSIVE] !== undefined) {
      restriction['min'] = question[Constants.XSD.MIN_INCLUSIVE];
    }
    if (question[Constants.XSD.MIN_EXCLUSIVE] !== undefined) {
      restriction['min'] = question[Constants.XSD.MIN_EXCLUSIVE] + 1;
    }
    if (question[Constants.XSD.MAX_EXCLUSIVE] !== undefined) {
      restriction['max'] = question[Constants.XSD.MAX_EXCLUSIVE] - 1;
    }
    if (question[Constants.XSD.MAX_INCLUSIVE] !== undefined) {
      restriction['max'] = question[Constants.XSD.MAX_INCLUSIVE];
    }
    return restriction;
  }
}

const InputAnswer = (props) => {
  const { inputComponent, componentsOptions } = useContext(ConfigurationContext);

  const question = props.question;
  const answer = props.answer;
  let value = props.value;
  // When the value is an object_value, but the layout does not specify neither typeahead nor select,
  // show at least the value's label
  if (answer[Constants.HAS_OBJECT_VALUE] && answer[Constants.HAS_OBJECT_VALUE][JsonLdUtils.RDFS_LABEL]) {
    value = JsonLdUtils.getJsonAttValue(answer[Constants.HAS_OBJECT_VALUE], JsonLdUtils.RDFS_LABEL);
  }
  return React.createElement(inputComponent, {
    ...InputPropertiesResolver.resolveInputProperties(question, value, componentsOptions),
    label: props.label,
    title: props.title,
    value: value == null ? '' : value,
    onChange: (e) => {
      props.onChange(e.target.value);
      if (props.sparql || props.turtle) this.hide();
    },
    onFocus: (e) => {
      if (props.sparql) {
        const yasqe = YASQE.fromTextArea(e.target);
        yasqe.setValue(value);
        yasqe.on('change', () => {
          props.onChange(yasqe.getValue());
        });
        YASQE.Autocompleters.prefixes.appendPrefixIfNeeded = function (yasqe, completerName) {
          if (!yasqe.autocompleters.getTrie(completerName)) return; // no prefixed defined. just stop
          if (!yasqe.options.autocompleters || yasqe.options.autocompleters.indexOf(completerName) === -1) return; //this autocompleter is disabled
          const cur = yasqe.getCursor();

          const token = yasqe.getTokenAt(cur);
          if (tokenTypes[token.type] === 'prefixed') {
            const colonIndex = token.string.indexOf(':');
            if (colonIndex !== -1) {
              // check previous token isnt PREFIX, or a '<'(which would mean we are in a uri)
              //			const firstTokenString = yasqe.getNextNonWsToken(cur.line).string.toUpperCase();
              const lastNonWsTokenString = yasqe.getPreviousNonWsToken(cur.line, token).string.toUpperCase();
              const previousToken = yasqe.getTokenAt({
                line: cur.line,
                ch: token.start
              }); // needs to be null (beginning of line), or whitespace
              if (lastNonWsTokenString !== 'PREFIX' && (previousToken.type === 'ws' || previousToken.type == null)) {
                // check whether it isnt defined already (saves us from looping
                // through the array)
                const currentPrefix = token.string.substring(0, colonIndex + 1);
                const queryPrefixes = yasqe.getPrefixesFromQuery();
                if (queryPrefixes[currentPrefix.slice(0, -1)] == null) {
                  // ok, so it isnt added yet!
                  if (
                    props.question[Constants.HAS_DECLARED_PREFIX] &&
                    props.question[Constants.HAS_DECLARED_PREFIX].filter(
                      (p) => p[Constants.PREFIX] === currentPrefix.slice(0, -1)
                    ).length
                  ) {
                    const prefix = props.question[Constants.HAS_DECLARED_PREFIX].filter(
                      (p) => p[Constants.PREFIX] === currentPrefix.slice(0, -1)
                    );
                    const px = {};
                    px[prefix[0][Constants.PREFIX]] = prefix[0][Constants.NAMESPACE];
                    yasqe.addPrefixes(px);
                  } else {
                    const completions = yasqe.autocompleters.getTrie(completerName).autoComplete(currentPrefix);
                    if (completions.length > 0) {
                      yasqe.addPrefixes(completions[0]);
                    }
                  }
                }
              }
            }
          }
        };
      } else if (props.turtle) {
        console.log('TTL');
        const yate = YATE.fromTextArea(e.target);
        yate.setValue(value);
        yate.on('change', () => {
          props.onChange(yate.getValue());
        });
      }
    }
  });
};

InputAnswer.propTypes = {
  question: PropTypes.object.isRequired,
  answer: PropTypes.object.isRequired,
  label: PropTypes.object.isRequired,
  title: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired
};

export default InputAnswer;
