'use strict';

import React from 'react';

import Configuration from '../../model/Configuration';
import FormUtils from '../../util/FormUtils';

const CheckboxAnswer = (props) => {
    var question = props.question;
    return React.createElement(Configuration.inputComponent, {
        type: 'checkbox',
        label: props.label,
        title: props.title,
        checked: props.value === true || props.value === 'true',
        onChange: (e) => {
            props.onChange(e.target.checked);
        },
        disabled: FormUtils.isDisabled(question),
    });
};

CheckboxAnswer.propTypes = {
    question: React.PropTypes.object.isRequired,
    label: React.PropTypes.string.isRequired,
    title: React.PropTypes.string,
    value: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.bool]),
    onChange: React.PropTypes.func.isRequired
};

export default CheckboxAnswer;
