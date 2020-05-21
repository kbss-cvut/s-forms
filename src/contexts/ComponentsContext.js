import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

const ComponentsContext = React.createContext({});

const ComponentsContextProvider = ({ children, ...props }) => {
  const values = useMemo(
    () => ({
      inputComponent: props.components.inputComponent || require('../components/DefaultInput').default,
      options: props.componentsOptions
    }),
    []
  );

  return <ComponentsContext.Provider value={values}>{children}</ComponentsContext.Provider>;
};

ComponentsContextProvider.defaultProps = {
  components: {},
  componentsOptions: {
    dateTimeAnswer: { dateFormat: 'yyyy-MM-dd', timeFormat: 'HH:mm:ss', dateTimeFormat: 'yyyy-MM-dd HH:mm:ss' },
    readOnly: false
  }
};

ComponentsContextProvider.propTypes = {
  children: PropTypes.element.isRequired,
  components: PropTypes.object,
  componentsOptions: PropTypes.object
};

export { ComponentsContext, ComponentsContextProvider };
