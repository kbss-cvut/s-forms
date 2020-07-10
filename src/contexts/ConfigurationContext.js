import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

const ConfigurationContext = React.createContext({});

const defaultProps = {
  components: {
    inputComponent: require('../components/DefaultInput').default
  },
  componentsOptions: {
    dateTimeAnswer: { dateFormat: 'yyyy-MM-dd', timeFormat: 'HH:mm:ss', dateTimeFormat: 'yyyy-MM-dd HH:mm:ss' },
    readOnly: false
  },
  options: {
    intl: { locale: 'en' },
    i18n: {
      'wizard.next': 'Next',
      'wizard.previous': 'Previous'
    },
    modalView: false,
    modalProps: {},
    horizontalWizardNav: true,
    wizardStepButtons: true
  }
};

const ConfigurationContextProvider = ({ children, ...props }) => {
  const values = useMemo(
    () => ({
      inputComponent: (props.components && props.components.inputComponent) || defaultProps.components.inputComponent,
      componentsOptions: { ...defaultProps.componentsOptions, ...props.componentsOptions },
      options: { ...defaultProps.options, ...props.options }
    }),
    []
  );

  return <ConfigurationContext.Provider value={values}>{children}</ConfigurationContext.Provider>;
};

ConfigurationContextProvider.propTypes = {
  children: PropTypes.element.isRequired,
  components: PropTypes.object,
  componentsOptions: PropTypes.object,
  options: PropTypes.object
};

export { ConfigurationContext, ConfigurationContextProvider };
