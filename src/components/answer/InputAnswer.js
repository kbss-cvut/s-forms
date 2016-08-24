'use strict';

import React from 'react';
import JsonLdUtils from 'jsonld-utils';

import Configuration from '../../model/Configuration';
import Constants from '../../constants/Constants';
import FormUtils from '../../util/FormUtils';
import Utils from '../../util/Utils';

const InputAnswer = (props) => {
    var question = props.question,
        answer = props.answer,
        value = props.value;
    // When the value is an object_value, but the layout does not specify neither typeahead nor select,
    // show at least the value's label
    if (answer[Constants.HAS_OBJECT_VALUE] && answer[Constants.HAS_OBJECT_VALUE][JsonLdUtils.RDFS_LABEL]) {
        value = JsonLdUtils.getJsonAttValue(answer[Constants.HAS_OBJECT_VALUE], JsonLdUtils.RDFS_LABEL);
    }
    return React.createElement(Configuration.inputComponent, {
        type: Utils.resolveInputType(question, value),
        label: props.label,
        title: props.title,
        value: value,
        onChange: (e) => {
            props.onChange(e.target.value)
        },
        disabled: FormUtils.isDisabled(question),
        rows: 5
    });
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
