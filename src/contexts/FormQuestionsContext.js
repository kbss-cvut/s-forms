import React, { useMemo, useState, useEffect } from "react";
import PropTypes from "prop-types";
import FormUtils from "../util/FormUtils";

const INITIAL_DATA = {};
const INITIAL_FORM_QUESTIONS_DATA = [];

const FormQuestionsContext = React.createContext({});

const FormQuestionsProvider = (props) => {
  const [data, setData] = useState(props.data || INITIAL_DATA);
  const [formQuestionsData, setFormQuestionsData] = useState(
    props.formQuestions || INITIAL_FORM_QUESTIONS_DATA
  );

  useEffect(() => {
    if (props.isFormValid) {
      const isValid = FormUtils.isValid(data);
      props.isFormValid(isValid);
    }
  }, []);

  useEffect(() => {
    setData(props.data || INITIAL_DATA);
    setFormQuestionsData(props.formQuestions || INITIAL_FORM_QUESTIONS_DATA);
  }, [props.data, props.formQuestions]);

  const updateData = (update) => {
    if (!update) return;

    setData({ ...data, ...update });
  };

  const updateFormQuestionsData = (index, update) => {
    if (!update || index < 0 || index >= formQuestionsData.length) return;

    const newFormQuestionsData = [...formQuestionsData];
    newFormQuestionsData[index] = { ...newFormQuestionsData[index], ...update };

    setFormQuestionsData(newFormQuestionsData);

    if (props.isFormValid) {
      const isValid = FormUtils.isValid(data);
      props.isFormValid(isValid);
    }
  };

  const getData = () => {
    return data;
  };

  const getFormQuestionsData = (index) => {
    return index === null || index === undefined
      ? formQuestionsData
      : formQuestionsData[index];
  };

  const values = useMemo(
    () => ({
      updateData,
      updateFormQuestionsData,
      getData,
      getFormQuestionsData,
    }),
    [getFormQuestionsData, getData]
  );

  return (
    <FormQuestionsContext.Provider value={values} {...props}>
      {props.children}
    </FormQuestionsContext.Provider>
  );
};

FormQuestionsProvider.propTypes = {
  children: PropTypes.element.isRequired,
  data: PropTypes.object.isRequired,
  formQuestions: PropTypes.array.isRequired,
  isFormValid: PropTypes.func,
};

export { FormQuestionsContext, FormQuestionsProvider };
