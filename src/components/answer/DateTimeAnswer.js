'use strict';

import React from "react";
import moment from "moment";
import DateTimePicker from "kbss-react-bootstrap-datetimepicker";
import Configuration from "../../model/Configuration";
import Utils from "../../util/Utils";

const DateTimeAnswer = (props) => {
    var mode = Utils.resolveDateTimeMode(props.question),
        value = Utils.resolveDateTimeValue(props.question, props.value);
    if (!value.isValid()) {
        value = moment();
    }
    return <div style={{position: 'relative'}}>
        <label className='control-label'>{props.label}</label>
        <DateTimePicker mode={mode} inputFormat={Configuration.dateTimeFormat}
                        inputProps={{title: props.title, bsSize: 'small'}}
                        onChange={(date) => {
                            props.onChange(Number(date))
                        }} dateTime={value.format(Configuration.dateTimeFormat)}/>
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
