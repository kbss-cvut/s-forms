import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import jsonld from 'jsonld';
import Logger from '../util/Logger';
import Configuration from '../model/Configuration';

const FormGenContext = React.createContext({});

const FormGenContextProvider = ({ children, ...props }) => {
  const [options, setOptions] = useState({});

  const loadFormOptions = async (id, query) => {
    const option = options[id];

    if (option && option.length) {
      return option;
    }

    const data = await Configuration.fetchTypeAheadValues(query);

    if (data.length) {
      return new Promise((resolve) => {
        jsonld.frame(data, {}, null, (err, framed) => {
          const option = framed['@graph'];

          setOptions((prevState) => ({
            ...prevState,
            [id]: option
          }));
          
          return resolve(option);
        });
      });
    }

    Logger.warn(`No data received when loading options using id ${id}`);

    return [];
  };

  const getOptions = (id) => options[id] || [];

  const values = useMemo(
    () => ({
      loadFormOptions,
      getOptions
    }),
    [loadFormOptions, getOptions]
  );

  return (
    <FormGenContext.Provider value={values} {...props}>
      {children}
    </FormGenContext.Provider>
  );
};

FormGenContextProvider.propTypes = {
  children: PropTypes.element.isRequired
};

export { FormGenContext, FormGenContextProvider };
