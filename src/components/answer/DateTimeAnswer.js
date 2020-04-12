'use strict';

import React from "react";
import moment from "moment";
import DateTimePicker from "react-bootstrap-datetimepicker";
import PropTypes from "prop-types";
import Constants from '../../constants/Constants';
import Utils from "../../util/Utils";

const DateTimeAnswer = (props) => {
    var mode = Utils.resolveDateTimeMode(props.question),
        value = Utils.resolveDateTimeValue(props.question, props.value),
        format = Utils.resolveDateTimeFormat(props.question, props.value),
        pickerUiFormat = Utils.resolveDateTimePickerUiFormat(format);
    if (!value.isValid()) {
        value = moment();
    }
    return <div style={{position: 'relative'}}>
        <label className='control-label'>{props.label}</label>
        <DateTimePicker mode={mode} format={format} inputFormat={pickerUiFormat}
                        inputProps={{title: props.title, bsSize: 'small'}}
                        onChange={(date) => {
                            if (format === Constants.DATETIME_NUMBER_FORMAT) {
                                props.onChange(Number(date))
                            } else {
                                props.onChange(date);
                            }
                        }}
                        dateTime={format === Constants.DATETIME_NUMBER_FORMAT ? value.valueOf() : value.format(format)}/>
    </div>
};

DateTimeAnswer.propTypes = {
    question: PropTypes.object.isRequired,
    label: PropTypes.string.isRequired,
    title: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func.isRequired
};

export default DateTimeAnswer;
