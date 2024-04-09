import React from "react";
import * as JsonLdUtils from "jsonld-utils";
import PropTypes from "prop-types";

import Vocabulary from "../../constants/Vocabulary.js";
import FormUtils from "../../util/FormUtils";
import { ConfigurationContext } from "../../contexts/ConfigurationContext";

export default class SelectAnswer extends React.Component {
  _generateSelectOptions(options) {
    const rendered = [];
    options.sort(function (a, b) {
      const aLabel = JsonLdUtils.getJsonAttValue(a, Vocabulary.RDFS_LABEL),
        bLabel = JsonLdUtils.getJsonAttValue(b, Vocabulary.RDFS_LABEL);
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
          value={JsonLdUtils.getJsonAttValue(options[i], Vocabulary.RDFS_LABEL)}
          key={"opt-" + i}
        >
          {JsonLdUtils.getJsonAttValue(options[i], Vocabulary.RDFS_LABEL)}
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
        validation: this.props.validation,
        onChange: (e) => {
          this.props.onChange(e.target.value);
        },
        disabled:
          this.context.componentsOptions.readOnly ||
          FormUtils.isDisabled(question),
      },
      this._generateSelectOptions(question[Vocabulary.HAS_OPTION])
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
  validation: PropTypes.object,
};
