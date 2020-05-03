import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FormGroup, Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Utils from '../../util/Utils';
import FormUtils from '../../util/FormUtils';
import moment from 'moment';

const DateTimeAnswer = (props) => {
  // TODO format === "x", timestamp?, locale
  const format = Utils.resolveDateTimeFormat(props.question, props.value);

  const isDate = FormUtils.isDate(props.question);
  const isTime = FormUtils.isTime(props.question);

  console.log(props.value);
  return (
    <FormGroup size="small">
      <Form.Label>{props.label}</Form.Label>
      <DatePicker
        selected={props.value ? new Date(props.value) : new Date()}
        onChange={(date) => {
          props.onChange(moment(date).format(format.replace('yyyy', 'YYYY').replace('dd', 'DD')));
        }}
        showTimeSelect={!isDate}
        showTimeSelectOnly={isTime}
        timeFormat="HH:mm"
        timeIntervals={1}
        timeCaption="Time"
        dateFormat={format}
        className="form-control"
        disabled={FormUtils.isDisabled(props.question)}
      />
    </FormGroup>
  );
};

DateTimeAnswer.propTypes = {
  question: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  title: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired
};

export default DateTimeAnswer;
