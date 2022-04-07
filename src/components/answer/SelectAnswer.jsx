import React from "react";
import JsonLdUtils from "jsonld-utils";
import PropTypes from "prop-types";

import Constants from "../../constants/Constants";
import FormUtils from "../../util/FormUtils";
import { ConfigurationContext } from "../../contexts/ConfigurationContext";

export default class SelectAnswer extends React.Component {
  _generateSelectOptions(options) {
    const rendered = [];
    options.sort(function (a, b) {
      const aLabel = JsonLdUtils.getJsonAttValue(a, Constants.RDFS_LABEL),
        bLabel = JsonLdUtils.getJsonAttValue(b, Constants.RDFS_LABEL);
      if (aLabel < bLabel) {
        return -1;
      }
      if (aLabel > bLabel) {
        return 1;
      }
      return 0;
    });

    for (let i = 0; i < options.length; i++) {
      rendered.push(
        <option
          value={JsonLdUtils.getJsonAttValue(options[i], Constants.RDFS_LABEL)}
          key={"opt-" + i}
        >
          {JsonLdUtils.getJsonAttValue(options[i], Constants.RDFS_LABEL)}
        </option>
      );
    }
    return rendered;
  }

  render() {
    const question = this.props.question;

    return React.createElement(
      this.context.inputComponent,
      {
        type: "select",
        label: this.props.label,
        value: this.props.value,
        title: this.props.title,
        onChange: (e) => {
          this.props.onChange(e.target.value);
        },
        disabled:
          this.context.componentsOptions.readOnly ||
          FormUtils.isDisabled(question),
      },
      this._generateSelectOptions(question[Constants.HAS_OPTION])
    );
  }
}

SelectAnswer.contextType = ConfigurationContext;

SelectAnswer.propTypes = {
  question: PropTypes.object.isRequired,
  label: PropTypes.object.isRequired,
  title: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};
