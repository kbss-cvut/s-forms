'use strict';

import React from 'react';
import JsonLdUtils from 'jsonld-utils';
import Typeahead from 'react-bootstrap-typeahead';

import Configuration from '../../model/Configuration';
import Constants from '../../constants/Constants';
import FormUtils from '../../util/FormUtils';
import Utils from '../../util/Utils';
import JsonLdObjectUtils from "../../util/JsonLdObjectUtils";

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
            options: this._queryHash ? this._processTypeaheadOptions(Configuration.optionsStore.getOptions(this._queryHash)) : []
        }
    }

    componentWillMount() {
        const question = this.props.question;
        if (!question[Constants.HAS_OPTION] && FormUtils.getPossibleValuesQuery(question)) {
            Configuration.actions.loadFormOptions(this._queryHash, FormUtils.getPossibleValuesQuery(question));
        } else {
            this.setState({options: this._processTypeaheadOptions(question[Constants.HAS_OPTION])});
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
        options = this._processTypeaheadOptions(options);
        const value = FormUtils.resolveValue(this.props.answer),
            selected = options.find((item) => {
                return item.id === value;
            });
        this.setState({options: options});
        if (selected) {
            this.typeahead.selectOption(selected);
        }
    };

    _onOptionSelected = (option) => {
        this.props.onChange(option ? option.id : null);
    };

    _processTypeaheadOptions(options) {
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
        const value = Utils.idToName(this.state.options, this.props.value),
            question = this.props.question;
        return <div>
            <Typeahead ref={(c) => this.typeahead = c} className='form-group form-group-sm' formInputOption='id'
                       inputProps={{title: this.props.title}} disabled={FormUtils.isDisabled(question)}
                       value={value} label={this.props.label} placeholder={this.props.label} filterOption='name'
                       size='small' displayOption='name' onOptionSelected={this._onOptionSelected} optionsButton={true}
                       allowReset={true} options={this.state.options}
                       customListComponent={Configuration.typeaheadResultList}/>
        </div>;
    }
}
