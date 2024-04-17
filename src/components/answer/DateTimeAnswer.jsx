import React, { useContext, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { FormGroup, Form } from "react-bootstrap";
import PropTypes from "prop-types";
import { format, parse } from "date-fns";
import FormUtils from "../../util/FormUtils";
import Constants from "../../constants/Constants";
import { ConfigurationContext } from "../../contexts/ConfigurationContext";
import classNames from "classnames";

const DateTimeAnswer = (props) => {
  const { componentsOptions } = useContext(ConfigurationContext);
  const [date, setDate] = useState(null);

  useEffect(() => {
    if (props.value) {
      setDate(new Date(parse(props.value, datePickerFormat, new Date())));
    }
  }, []);

  const dateFormat = FormUtils.resolveDateTimeFormat(
    props.question,
    props.value,
    componentsOptions.dateTimeAnswer
  );

  const isDate = FormUtils.isDate(props.question);
  const isTime = FormUtils.isTime(props.question);

  // DatePicker does not know dateFormat "x", translate to datetime
  const datePickerFormat =
    dateFormat === "x"
      ? componentsOptions.dateTimeAnswer.dateTimeFormat
      : dateFormat;

  const handleDateChange = (date) => {
    setDate(date);
    if (!date) {
      props.onChange("");
    }
    if (dateFormat === Constants.DATETIME_NUMBER_FORMAT) {
      props.onChange(Number(date));
    } else {
      props.onChange(format(date, dateFormat));
    }
  };

  return (
    <FormGroup size="small">
      <Form.Label className={"w-100"}>{props.label}</Form.Label>
      <DatePicker
        selected={date}
        placeholderText={datePickerFormat}
        onChange={handleDateChange}
        showTimeSelect={!isDate}
        showTimeSelectOnly={isTime}
        timeFormat="HH:mm"
        timeIntervals={1}
        timeCaption="Time"
        dateFormat={datePickerFormat}
        className={classNames("form-control", props.validation.classname)}
        disabled={
          componentsOptions.readOnly || FormUtils.isDisabled(props.question)
        }
      />
      {props.validation.message}
    </FormGroup>
  );
};

DateTimeAnswer.propTypes = {
  question: PropTypes.object.isRequired,
  label: PropTypes.object.isRequired,
  title: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  validation: PropTypes.object,
};

export default DateTimeAnswer;
