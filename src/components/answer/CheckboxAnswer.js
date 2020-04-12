import React from 'react';
import PropTypes from "prop-types";
import Configuration from '../../model/Configuration';
import FormUtils from '../../util/FormUtils';
import Constants from "../../constants/Constants";
import assign from "object-assign";

class InputPropertiesResolver {

    static resolveValidationProperties(question) {
        const props = {};
        if (question[Constants.HAS_VALID_ANSWER] === false) {
            props['validation'] = 'error';
            props['help'] = question[Constants.HAS_VALIDATION_MESSAGE];
        }
        return props;
    }
}


const CheckboxAnswer = (props) => {
    const question = props.question;
    return React.createElement(Configuration.inputComponent,  assign({}, InputPropertiesResolver.resolveValidationProperties(question), {
        type: 'checkbox',
        label: props.label,
        title: props.title,
        checked: props.value === true || props.value === 'true',
        onChange: (e) => {
            props.onChange(e.target.checked);
        },
        disabled: FormUtils.isDisabled(question),
    }));
};

CheckboxAnswer.propTypes = {
    question: PropTypes.object.isRequired,
    label: PropTypes.string.isRequired,
    title: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    onChange: PropTypes.func.isRequired
};

export default CheckboxAnswer;
