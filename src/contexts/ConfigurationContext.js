import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

const ConfigurationContext = React.createContext({});

const ConfigurationContextProvider = ({ children, ...props }) => {
  const values = useMemo(
    () => ({
      inputComponent: props.components.inputComponent || require('../components/DefaultInput').default,
      componentsOptions: props.componentsOptions
    }),
    []
  );

  return <ConfigurationContext.Provider value={values}>{children}</ConfigurationContext.Provider>;
};

ConfigurationContextProvider.defaultProps = {
  components: {},
  componentsOptions: {
    dateTimeAnswer: { dateFormat: 'yyyy-MM-dd', timeFormat: 'HH:mm:ss', dateTimeFormat: 'yyyy-MM-dd HH:mm:ss' },
    readOnly: false
  }
};

ConfigurationContextProvider.propTypes = {
  children: PropTypes.element.isRequired,
  components: PropTypes.object,
  componentsOptions: PropTypes.object
};

export { ConfigurationContext, ConfigurationContextProvider };
