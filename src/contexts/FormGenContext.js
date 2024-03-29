import React, { useMemo } from "react";
import PropTypes from "prop-types";
import * as jsonld from "jsonld";
import Logger from "../util/Logger";

const FormGenContext = React.createContext({});

const FormGenContextProvider = ({ children, ...props }) => {
  let options = [];

  const loadFormOptions = async (id, query) => {
    const option = options[id];

    if (option && option.length) {
      return option;
    }

    const data = await props.fetchTypeAheadValues(query);

    if (data.length) {
      return jsonld.frame(data, {}, {}).then((framedData) => {
        const option = framedData["@graph"];
        options.push({ ...option, [id]: option });
        return option;
      });
    }

    Logger.warn(`No data received when loading options using id ${id}`);

    return [];
  };

  const getOptions = (id) => options[id] || [];

  const values = useMemo(
    () => ({
      loadFormOptions,
      getOptions,
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
  children: PropTypes.element.isRequired,
  fetchTypeAheadValues: PropTypes.func,
};

export { FormGenContext, FormGenContextProvider };
