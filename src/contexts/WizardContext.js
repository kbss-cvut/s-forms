import React, { useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import FormUtils from '../util/FormUtils';

const INITIAL_DATA = {};
const INITIAL_STEP_DATA = [];

const WizardContext = React.createContext({});

const WizardContextProvider = (props) => {
  const [data, setData] = useState(props.data || INITIAL_DATA);
  const [stepData, setStepData] = useState(props.steps || INITIAL_STEP_DATA);

  useEffect(() => {
    if (props.isFormValid) {
      const isValid = FormUtils.isValid(data);
      props.isFormValid(isValid);
    }
  }, []);

  const updateData = (update) => {
    if (!update) return;

    setData({ ...data, ...update });
  };

  const updateStepData = (index, update) => {
    if (!update || index < 0 || index >= stepData.length) return;

    const newStepData = [...stepData];
    newStepData[index] = { ...newStepData[index], ...update };

    setStepData(newStepData);

    if (props.isFormValid) {
      const isValid = FormUtils.isValid(data);
      props.isFormValid(isValid);
    }
  };

  const insertStep = (index, update) => {
    const newStepData = [...stepData];

    newStepData.splice(index, 0, update || {});
    setStepData(newStepData);
  };

  const removeStep = (index) => {
    const newStepData = [...stepData];

    newStepData.splice(index, 1);
    setStepData(newStepData);
  };

  const reset = () => {
    setData(INITIAL_DATA);
    setStepData(INITIAL_STEP_DATA);
  };

  const getData = () => {
    return data;
  };

  const getStepData = (index) => {
    return index === null || index === undefined ? stepData : stepData[index];
  };

  const values = useMemo(
    () => ({
      updateData,
      updateStepData,
      insertStep,
      removeStep,
      reset,
      getData,
      getStepData
    }),
    [getStepData, getData]
  );

  return (
    <WizardContext.Provider value={values} {...props}>
      {props.children}
    </WizardContext.Provider>
  );
};

WizardContextProvider.propTypes = {
  children: PropTypes.element.isRequired,
  data: PropTypes.object.isRequired,
  stepData: PropTypes.array.isRequired,
  isFormValid: PropTypes.func
};

export { WizardContext, WizardContextProvider };