import React from 'react';
import JsonLdUtils from 'jsonld-utils';
import Select, { components } from 'react-select';
import PropTypes from 'prop-types';
import Configuration from '../../model/Configuration';
import * as Constants from '../../constants/Constants';
import FormUtils from '../../util/FormUtils';
import Utils from '../../util/Utils';
import JsonLdObjectUtils from '../../util/JsonLdObjectUtils';
import Logger from '../../util/Logger';
import { FormGroup, Form } from 'react-bootstrap';
import { FormGenContext } from '../../contexts/FormGenContext';

class TypeaheadAnswer extends React.Component {
  constructor(props) {
    super(props);
    this.queryHash = Utils.getStringHash(FormUtils.getPossibleValuesQuery(props.question));

    this.state = {
      isLoading: true,
      options: this.processTypeaheadOptions(props.options)
    };
    this.mounted = true;
  }

  async componentDidMount() {
    const question = this.props.question;

    if (!question[Constants.HAS_OPTION] && FormUtils.getPossibleValuesQuery(question)) {
      try {
        const options = await this.context.loadFormOptions(this.queryHash, FormUtils.getPossibleValuesQuery(question));
        if (this.mounted) {
          this.setState({ options: this.processTypeaheadOptions(options), isLoading: false });
        }
      } catch (error) {
        Logger.error(`An error has occurred during loadFormOptions for query hash: ${this.queryHash}`);
      }
    } else {
      this.setState({ options: this.processTypeaheadOptions(question[Constants.HAS_OPTION]), isLoading: false });
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

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
    const { Option } = components;

    const DescriptionOption = (props) => {
      const innerProps = { ...props.innerProps, title: props.data.description };

      return <Option {...props} title={props.data.description} innerProps={innerProps} />;
    };

    return (
      <FormGroup size="small">
        <Form.Label>{this.props.label}</Form.Label>
        <Select
          options={this.state.options}
          isSearchable={true}
          isLoading={this.state.isLoading}
          isClearable={true}
          isDisabled={FormUtils.isDisabled(this.props.question)}
          value={this.state.options.filter((option) => option.id === this.props.value)}
          placeholder={!this.state.isLoading ? this.props.label : ''}
          getOptionLabel={(option) => option.name}
          getOptionValue={(option) => option.id}
          onChange={this.onOptionSelected}
          components={{ Option: DescriptionOption }}
        />
      </FormGroup>
    );
  }
}

TypeaheadAnswer.contextType = FormGenContext;

TypeaheadAnswer.propTypes = {
  question: PropTypes.object.isRequired,
  answer: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  title: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired
};

export default TypeaheadAnswer;
