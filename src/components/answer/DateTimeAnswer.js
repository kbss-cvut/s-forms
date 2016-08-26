'use strict';

import React from "react";
import moment from "moment";
import DateTimePicker from "kbss-react-bootstrap-datetimepicker";
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
    question: React.PropTypes.object.isRequired,
    label: React.PropTypes.string.isRequired,
    title: React.PropTypes.string,
    value: React.PropTypes.string,
    onChange: React.PropTypes.func.isRequired
};

export default DateTimeAnswer;
