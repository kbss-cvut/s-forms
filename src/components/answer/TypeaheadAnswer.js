'use strict';

import React from 'react';
import JsonLdUtils from 'jsonld-utils';
import Typeahead from 'react-bootstrap-typeahead';

import Configuration from '../../model/Configuration';
import Constants from '../../constants/Constants';
import FormUtils from '../../util/FormUtils';
import Utils from '../../util/Utils';

export default class TypeaheadAnswer extends React.Component {
    static propTypes = {
        question: React.PropTypes.object.isRequired,
        answer: React.PropTypes.object.isRequired,
        label: React.PropTypes.string.isRequired,
        title: React.PropTypes.string,
        value: React.PropTypes.string,
        onChange: React.PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this._queryHash = Utils.getStringHash(FormUtils.getPossibleValuesQuery(this.props.question));
        this.state = {
            options: this._queryHash ? JsonLdUtils.processTypeaheadOptions(Configuration.optionsStore.getOptions(this._queryHash)) : []
        }
    }

    componentWillMount() {
        var question = this.props.question;
        if (!question[Constants.HAS_OPTION] && FormUtils.getPossibleValuesQuery(question)) {
            Configuration.actions.loadFormOptions(this._queryHash, FormUtils.getPossibleValuesQuery(question));
        } else {
            this.setState({options: JsonLdUtils.processTypeaheadOptions(question[Constants.HAS_OPTION])});
        }
    }

    componentDidMount() {
        this.unsubscribe = Configuration.optionsStore.listen(this._onOptionsLoaded);
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    _onOptionsLoaded = (type, options) => {
        if (type !== this._queryHash) {
            return;
        }
        options = JsonLdUtils.processTypeaheadOptions(options);
        var value = FormUtils.resolveValue(this.props.answer),
            selected = options.find((item) => {
                return item.id === value;
            });
        this.setState({options: options});
        if (selected) {
            this.typeahead.selectOption(selected);
        }
    };

    _onOptionSelected = (option) => {
        this.props.onChange(option.id);
    };

    render() {
        var value = Utils.idToName(this.state.options, this.props.value),
            question = this.props.question,
            inputProps = {
                disabled: FormUtils.isDisabled(question)
            };
        return <div>
            <label className='control-label'>{this.props.label}</label>
            <Typeahead ref={(c) => this.typeahead = c} className='form-group form-group-sm' formInputOption='id'
                       inputProps={inputProps}
                       title={this.props.title} value={value} label={this.props.label}
                       placeholder={this.props.label} filterOption='name'
                       displayOption='name' onOptionSelected={this._onOptionSelected} optionsButton={true}
                       options={this.state.options} customListComponent={Configuration.typeaheadResultList}/>
        </div>;
    }
}
