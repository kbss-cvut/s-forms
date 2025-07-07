import React, { forwardRef } from "react";
import IntlContextProvider from "../contexts/IntlContextProvider.tsx";
import "../styles/s-forms.css";
import SFormsInner from "./SFormsInner.jsx";
import PropTypes from "prop-types";

const SForms = forwardRef((props, ref) => {
  return (
    <IntlContextProvider locale={props.options?.intl?.locale}>
      <SFormsInner ref={ref} {...props} />
    </IntlContextProvider>
  );
});

SForms.propTypes = {
  form: PropTypes.object.isRequired,
  options: PropTypes.object.isRequired,
  componentMapRules: PropTypes.array,
  components: PropTypes.object,
  componentsOptions: PropTypes.object,
  fetchTypeAheadValues: PropTypes.func,
  isFormValid: PropTypes.func,
  loader: PropTypes.element,
};

export default SForms;
