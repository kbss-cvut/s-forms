'use strict';

import React from "react";
import assign from "object-assign";
import JsonLdUtils from "jsonld-utils";
import Configuration from "../../model/Configuration";
import Constants from "../../constants/Constants";
import FormUtils from "../../util/FormUtils";

const NUMERIC_DATATYPES = [Constants.XSD.INT, Constants.XSD.INTEGER, Constants.XSD.NON_NEGATIVE_INTEGER,
    Constants.XSD.NON_POSITIVE_INTEGER, Constants.XSD.NEGATIVE_INTEGER, Constants.XSD.POSITIVE_INTEGER];

const NUMBER_RULES = {};
NUMBER_RULES[Constants.XSD.NON_NEGATIVE_INTEGER] = {min: 0};
NUMBER_RULES[Constants.XSD.NON_POSITIVE_INTEGER] = {max: 0};
NUMBER_RULES[Constants.XSD.NEGATIVE_INTEGER] = {max: -1};
NUMBER_RULES[Constants.XSD.POSITIVE_INTEGER] = {min: 1};

class InputPropertiesResolver {

    static _resolveInputType(question, value) {
        if (FormUtils.isTextarea(question, value)) {
            return 'textarea';
        } else if (InputPropertiesResolver._isNumeric(question)) {
            return 'number';
        } else {
            return 'text';
        }
    }

    static _isNumeric(question) {
        for (var i = 0, len = NUMERIC_DATATYPES.length; i < len; i++) {
            if (JsonLdUtils.hasValue(question, Constants.HAS_DATATYPE, NUMERIC_DATATYPES[i])) {
                return true;
            }
        }
        return false;
    }

    static resolveInputProperties(question, value) {
        var props = {};
        props['type'] = InputPropertiesResolver._resolveInputType(question, value);
        switch (props['type']) {
            case 'textarea':
                props['rows'] = 5;
                break;
            case 'number':
                assign(props, InputPropertiesResolver._resolveNumberRestrictions(question));
                break;
            default:
                props['disabled'] = FormUtils.isDisabled(question);
                break;
        }
        if (question[Constants.IS_VALID_ANSWER] === false) {
            props['validation'] = 'error';
            props['help'] = question[Constants.HAS_VALIDATION_MESSAGE];
        }

        return props;
    }

    static _resolveNumberRestrictions(question) {
        var restriction = {};
        Object.getOwnPropertyNames(NUMBER_RULES).forEach(key => {
            if (JsonLdUtils.hasValue(question, Constants.HAS_DATATYPE, key)) {
                assign(restriction, NUMBER_RULES[key]);
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
    var question = props.question,
        answer = props.answer,
        value = props.value;
    // When the value is an object_value, but the layout does not specify neither typeahead nor select,
    // show at least the value's label
    if (answer[Constants.HAS_OBJECT_VALUE] && answer[Constants.HAS_OBJECT_VALUE][JsonLdUtils.RDFS_LABEL]) {
        value = JsonLdUtils.getJsonAttValue(answer[Constants.HAS_OBJECT_VALUE], JsonLdUtils.RDFS_LABEL);
    }
    return React.createElement(Configuration.inputComponent, assign({}, InputPropertiesResolver.resolveInputProperties(question, value), {
        label: props.label,
        title: props.title,
        value: value,
        onChange: (e) => props.onChange(e.target.value)
    }));
};

InputAnswer.propTypes = {
    question: React.PropTypes.object.isRequired,
    answer: React.PropTypes.object.isRequired,
    label: React.PropTypes.string.isRequired,
    title: React.PropTypes.string,
    value: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
    onChange: React.PropTypes.func.isRequired
};

export default InputAnswer;
