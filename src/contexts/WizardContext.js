import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';

const INITIAL_DATA = {};
const INITIAL_STEP_DATA = [];

const WizardContext = React.createContext({});

const WizardContextProvider = (props) => {
  const [data, setData] = useState(props.data || {});
  const [stepData, setStepData] = useState(props.steps ? props.steps.map((item) => item.data) : []);

  const updateData = (update) => {
    if (!update) return;

    setData({ ...data, ...update });
  };

  const updateStepData = (index, update) => {
    if (!update || index < 0 || index >= stepData.length) return;

    const newStepData = [...stepData];
    newStepData[index] = { ...newStepData[index], ...update };

    setStepData(newStepData);
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
    [getData, getStepData, removeStep, insertStep, updateData, updateStepData]
  );

  return (
    <WizardContext.Provider value={values} {...props}>
      {props.children}
    </WizardContext.Provider>
  );
};

WizardContextProvider.propTypes = {
  children: PropTypes.element.isRequired,
  data: PropTypes.object,
  stepData: PropTypes.array
};

export { WizardContext, WizardContextProvider };
