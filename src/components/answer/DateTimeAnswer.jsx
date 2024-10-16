import React, { useContext, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { FormGroup, Form } from "react-bootstrap";
import PropTypes from "prop-types";
import { format, parse } from "date-fns";
import FormUtils from "../../util/FormUtils";
import { ConfigurationContext } from "../../contexts/ConfigurationContext";
import classNames from "classnames";

const DateTimeAnswer = (props) => {
  const { componentsOptions } = useContext(ConfigurationContext);
  const [date, setDate] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const dateFormat = FormUtils.resolveDateTimeFormat(
    props.question,
    props.value,
    componentsOptions.dateTimeAnswer
  );

  const isDate = FormUtils.isDate(props.question);
  const isTime = FormUtils.isTime(props.question);
  const isTimestampFormat = FormUtils.isTimestamp(props.question);

  useEffect(() => {
    const parsedDate = parseDate(props.value);
    if (parsedDate) {
      setDate(parsedDate);
    } else {
      setDate(null);
      setErrorMessage(
        `Invalid date value ${props.value} of question ${props.question["@id"]}.`
      );
      console.error(errorMessage);
    }
  }, [props.value, dateFormat]);

  const parseDate = (value) => {
    if (!value) return null;

    const parsed = isTimestampFormat
      ? new Date(value)
      : parse(value, dateFormat, new Date());
    return isNaN(parsed.getTime()) ? null : parsed;
  };

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
    const timeValue = selectedDate
      ? isTimestampFormat
        ? selectedDate.getTime()
        : format(selectedDate, dateFormat)
      : "";

    props.onChange(timeValue);
  };

  return (
    <FormGroup size="small">
      <Form.Label className={"w-100"}>{props.label}</Form.Label>
      <DatePicker
        selected={date}
        placeholderText={dateFormat}
        onChange={handleDateChange}
        showTimeSelect={!isDate}
        showTimeSelectOnly={isTime}
        timeFormat="HH:mm"
        timeIntervals={1}
        timeCaption="Time"
        dateFormat={dateFormat}
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
