'use strict';

import React from 'react';
import JsonLdUtils from 'jsonld-utils';

import Constants from '../../constants/Constants';
import InputAnswer from './InputAnswer';
import Logger from '../../util/Logger';
import MaskedInput from '../MaskedInput';

const MaskedInputAnswer = (props) => {
    var question = props.question,
        value = props.value,
        mask = JsonLdUtils.getJsonAttValue(question, Constants.INPUT_MASK);

    if (!mask) {
        Logger.warn('Input mask not provided. Falling back to regular input.');
        return <InputAnswer {...props}/>;
    }
    return <MaskedInput mask={mask} value={value} label={props.label} title={props.title} placeholder={props.label}
                        onChange={(e) => props.onChange(e.target.value)}/>;
};

MaskedInputAnswer.propTypes = {
    question: React.PropTypes.object.isRequired,
    answer: React.PropTypes.object.isRequired,
    label: React.PropTypes.string.isRequired,
    title: React.PropTypes.string,
    value: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
    onChange: React.PropTypes.func.isRequired
};

export default MaskedInputAnswer;
