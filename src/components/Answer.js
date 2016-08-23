'use strict';

import React from "react";
import assign from "object-assign";
import DateTimePicker from 'kbss-react-bootstrap-datetimepicker';
import JsonldUtils from "jsonld-utils";
import Typeahead from "react-bootstrap-typeahead";
import Configuration from "../model/Configuration";
import Constants from "../constants/Constants";
import FormUtils from "../util/FormUtils";
import Utils from "../util/Utils";

export default class Answer extends React.Component {
    static propTypes = {
        answer: React.PropTypes.object.isRequired,
        question: React.PropTypes.object.isRequired,
        onChange: React.PropTypes.func.isRequired,
        index: React.PropTypes.number
    };

    constructor(props) {
        super(props);
        if (FormUtils.isTypeahead(this.props.question)) {
            this._queryHash = Utils.getStringHash(FormUtils.getPossibleValuesQuery(this.props.question));
        }
        this.state = {
            options: this._queryHash ? JsonldUtils.processTypeaheadOptions(Configuration.optionsStore.getOptions(this._queryHash)) : []
        }
    }

    componentWillMount() {
        var question = this.props.question;
        if (FormUtils.isTypeahead(question)) {
            if (!question[Constants.HAS_OPTION] && FormUtils.getPossibleValuesQuery(question)) {
                Configuration.actions.loadFormOptions(this._queryHash, FormUtils.getPossibleValuesQuery(question));
            } else {
                this.setState({options: JsonldUtils.processTypeaheadOptions(question[Constants.HAS_OPTION])});
            }
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
        options = JsonldUtils.processTypeaheadOptions(options);
        var value = FormUtils.resolveValue(this.props.answer),
            selected = options.find((item) => {
                return item.id === value;
            });
        this.setState({options: options});
        this.refs.typeahead.selectOption(selected);
    };

    onChange = (e) => {
        var change = assign({}, this.props.answer);
        this._setValue(change, e.target.value);
        this.props.onChange(this.props.index, change);
    };

    _setValue(change, value) {
        if (this.props.answer[Constants.HAS_OBJECT_VALUE]) {
            change[Constants.HAS_OBJECT_VALUE] = {
                '@id': value
            };
        } else {
            change[Constants.HAS_DATA_VALUE] = {
                '@value': value
            };
        }
    }

    _onOptionSelected = (option) => {
        var change = assign({}, this.props.answer);
        this._setValue(change, option.id);
        this.props.onChange(this.props.index, change);
    };


    render() {
        return this._renderInputComponent();
    }

    _renderInputComponent() {
        var question = this.props.question,
            value = FormUtils.resolveValue(this.props.answer),
            label = JsonldUtils.getLocalized(question[JsonldUtils.RDFS_LABEL], Configuration.intl),
            title = JsonldUtils.getLocalized(question[JsonldUtils.RDFS_COMMENT], Configuration.intl),
            component;

        if (FormUtils.isTypeahead(question)) {
            value = Utils.idToName(this.state.options, value);
            var inputProps = {
                disabled: FormUtils.isDisabled(question)
            };
            component = <div>
                <label className='control-label'>{label}</label>
                <Typeahead ref='typeahead' className='form-group form-group-sm' formInputOption='id'
                           inputProps={inputProps}
                           title={title} value={value} label={label} placeholder={label} filterOption='name'
                           displayOption='name' onOptionSelected={this._onOptionSelected} optionsButton={true}
                           options={this.state.options} customListComponent={Configuration.typeaheadResultList}/>
            </div>;
        } else if (Answer._hasOptions(question)) {
            component = React.createElement(Configuration.inputComponent, {
                    type: 'select',
                    label: label,
                    value: value,
                    title: title,
                    onChange: this.onChange,
                    disabled: FormUtils.isDisabled(question)
                }, this._generateSelectOptions(question[Constants.HAS_OPTION])
            );
        } else if (FormUtils.isCalendar(question)) {
            component = this._renderDateTimePicker();
        }
        else {
            var answer = this.props.answer;
            // TODO This is temporary to show labels for IRI-based values
            if (answer[Constants.HAS_OBJECT_VALUE] && answer[Constants.HAS_OBJECT_VALUE][JsonldUtils.RDFS_LABEL]) {
                value = JsonldUtils.getJsonAttValue(answer[Constants.HAS_OBJECT_VALUE], JsonldUtils.RDFS_LABEL);
            }
            var inputType = FormUtils.isTextarea(question, value) ? 'textarea' : 'text';
            component = React.createElement(Configuration.inputComponent, {
                type: inputType,
                label: label,
                title: title,
                value: value,
                onChange: this.onChange,
                disabled: FormUtils.isDisabled(question),
                rows: 5
            });
        }
        return component;
    }

    static _hasOptions(item) {
        return item[Constants.HAS_OPTION] && item[Constants.HAS_OPTION].length !== 0;
    }

    _generateSelectOptions(options) {
        var rendered = [];
        options.sort(function (a, b) {
            var aLabel = JsonldUtils.getJsonAttValue(a, JsonldUtils.RDFS_LABEL),
                bLabel = JsonldUtils.getJsonAttValue(b, JsonldUtils.RDFS_LABEL);
            if (aLabel < bLabel) {
                return -1;
            }
            if (aLabel > bLabel) {
                return 1;
            }
            return 0;
        });
        for (var i = 0, len = options.length; i < len; i++) {
            rendered.push(<option value={JsonldUtils.getJsonAttValue(options[i], JsonldUtils.RDFS_LABEL)}
                                  key={'opt-' + i}>{JsonldUtils.getJsonAttValue(options[i], JsonldUtils.RDFS_LABEL)}</option>);
        }
        return rendered;
    }

    _renderDateTimePicker() {
        var question = this.props.question,
            value = FormUtils.resolveValue(this.props.answer),
            label = JsonldUtils.getLocalized(question[JsonldUtils.RDFS_LABEL], Configuration.intl),
            title = JsonldUtils.getLocalized(question[JsonldUtils.RDFS_COMMENT], Configuration.intl),
            mode = Utils.resolveDateTimeMode(question);
        return <div style={{position: 'relative'}}>
            <label className='control-label'>label</label>
            <DateTimePicker mode={mode} inputFormat={Configuration.dateTimeFormat ? Configuration.dateTimeFormat : null}
                            inputProps={{title: title, bsSize: 'small'}}
                            onChange={this.onChange} dateTime={value}/>
        </div>
    }
}
