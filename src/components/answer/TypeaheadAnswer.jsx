import React from 'react';
import JsonLdUtils from 'jsonld-utils';
import Typeahead from 'react-bootstrap-typeahead';
import PropTypes from 'prop-types';
import Configuration from '../../model/Configuration';
import * as Constants from '../../constants/Constants';
import FormUtils from '../../util/FormUtils';
import Utils from '../../util/Utils';
import JsonLdObjectUtils from '../../util/JsonLdObjectUtils';
import Logger from '../../util/Logger';

export default class TypeaheadAnswer extends React.Component {
  constructor(props) {
    super(props);
    this.queryHash = Utils.getStringHash(FormUtils.getPossibleValuesQuery(this.props.question));

    this.state = {
      options: this.queryHash ? this.processTypeaheadOptions(Configuration.getOptions(this.queryHash)) : []
    };
  }

  async componentDidMount() {
    const question = this.props.question;

    if (!question[Constants.HAS_OPTION] && FormUtils.getPossibleValuesQuery(question)) {
      try {
        const options = await Configuration.loadFormOptions(this.queryHash, FormUtils.getPossibleValuesQuery(question));
        this.onOptionsLoaded(options);
      } catch (error) {
        Logger.error(`An error has occurred during loadFormOptions for query hash: ${this.queryHash}`);
      }
    } else {
      this.setState({ options: this.processTypeaheadOptions(question[Constants.HAS_OPTION]) });
    }
  }

  onOptionsLoaded = (options) => {
    options = this.processTypeaheadOptions(options);

    const value = FormUtils.resolveValue(this.props.answer);
    const selected = options.find((item) => item.id === value);

    this.setState({ options: options });

    if (selected) {
      this.typeahead.selectOption(selected);
    }
  };

  onOptionSelected = (option) => {
    this.props.onChange(option ? option.id : null);
  };

  processTypeaheadOptions(options) {
    if (!options) {
      return [];
    }

    // sort by label
    options.sort(JsonLdObjectUtils.getCompareLocalizedLabelFunction(Configuration.intl));

    // sort by property
    JsonLdObjectUtils.orderPreservingToplogicalSort(options, Constants.HAS_PRECEDING_VALUE);

    return JsonLdUtils.processTypeaheadOptions(options);
  }

  render() {
    const value = Utils.idToName(this.state.options, this.props.value);

    return (
      <div>
        <Typeahead
          ref={(c) => (this.typeahead = c)}
          className="form-group form-group-sm"
          formInputOption="id"
          inputProps={{ title: this.props.title }}
          disabled={FormUtils.isDisabled(this.props.question)}
          value={value || ''}
          label={this.props.label}
          placeholder={this.props.label}
          filterOption="name"
          size="small"
          displayOption="name"
          onOptionSelected={this.onOptionSelected}
          optionsButton={true}
          allowReset={true}
          options={this.state.options}
          customListComponent={Configuration.typeaheadResultList}
        />
      </div>
    );
  }
}

TypeaheadAnswer.propTypes = {
  question: PropTypes.object.isRequired,
  answer: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  title: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired
};
