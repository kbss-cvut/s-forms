'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getPrototypeOf = require("babel-runtime/core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _objectAssign = require("object-assign");

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _reactBootstrapTypeahead = require("react-bootstrap-typeahead");

var _reactBootstrapTypeahead2 = _interopRequireDefault(_reactBootstrapTypeahead);

var _jsonldUtils = require("jsonld-utils");

var _jsonldUtils2 = _interopRequireDefault(_jsonldUtils);

var _Configuration = require("../model/Configuration");

var _Configuration2 = _interopRequireDefault(_Configuration);

var _Constants = require("../constants/Constants");

var _Constants2 = _interopRequireDefault(_Constants);

var _FormUtils = require("../util/FormUtils");

var _FormUtils2 = _interopRequireDefault(_FormUtils);

var _Utils = require("../util/Utils");

var _Utils2 = _interopRequireDefault(_Utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Answer = function (_React$Component) {
    (0, _inherits3.default)(Answer, _React$Component);

    function Answer(props) {
        (0, _classCallCheck3.default)(this, Answer);

        var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Answer).call(this, props));

        _this._onOptionsLoaded = function (type, options) {
            if (type !== _this._queryHash) {
                return;
            }
            options = _jsonldUtils2.default.processTypeaheadOptions(options);
            var value = _FormUtils2.default.resolveValue(_this.props.answer),
                selected = options.find(function (item) {
                return item.id === value;
            });
            _this.setState({ options: options });
            _this.refs.typeahead.selectOption(selected);
        };

        _this.onChange = function (e) {
            var change = (0, _objectAssign2.default)({}, _this.props.answer);
            _this._setValue(change, e.target.value);
            _this.props.onChange(_this.props.index, change);
        };

        _this._onOptionSelected = function (option) {
            var change = (0, _objectAssign2.default)({}, _this.props.answer);
            _this._setValue(change, option.id);
            _this.props.onChange(_this.props.index, change);
        };

        if (_FormUtils2.default.isTypeahead(_this.props.question)) {
            _this._queryHash = _Utils2.default.getStringHash(_FormUtils2.default.getPossibleValuesQuery(_this.props.question));
        }
        _this.state = {
            options: _this._queryHash ? _Configuration2.default.optionsStore.getOptions(_this._queryHash) : []
        };
        return _this;
    }

    (0, _createClass3.default)(Answer, [{
        key: "componentWillMount",
        value: function componentWillMount() {
            var question = this.props.question;
            if (_FormUtils2.default.isTypeahead(question)) {
                if (!question[_Constants2.default.FORM.HAS_OPTION] && _FormUtils2.default.getPossibleValuesQuery(question)) {
                    _Configuration2.default.actions.loadFormOptions(this._queryHash, _FormUtils2.default.getPossibleValuesQuery(question));
                } else {
                    this.setState({ options: _jsonldUtils2.default.processTypeaheadOptions(question[_Constants2.default.FORM.HAS_OPTION]) });
                }
            }
        }
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            this.unsubscribe = _Configuration2.default.optionsStore.listen(this._onOptionsLoaded);
        }
    }, {
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
            this.unsubscribe();
        }
    }, {
        key: "_setValue",
        value: function _setValue(change, value) {
            if (this.props.answer[_Constants2.default.FORM.HAS_OBJECT_VALUE]) {
                change[_Constants2.default.FORM.HAS_OBJECT_VALUE] = {
                    '@id': value
                };
            } else {
                change[_Constants2.default.FORM.HAS_DATA_VALUE] = {
                    '@value': value
                };
            }
        }
    }, {
        key: "render",
        value: function render() {
            return this._renderInputComponent();
        }
    }, {
        key: "_renderInputComponent",
        value: function _renderInputComponent() {
            var question = this.props.question,
                value = _FormUtils2.default.resolveValue(this.props.answer),
                label = _jsonldUtils2.default.getLocalized(question[_jsonldUtils2.default.RDFS_LABEL], _Configuration2.default.intl),
                title = _jsonldUtils2.default.getLocalized(question[_jsonldUtils2.default.RDFS_COMMENT], _Configuration2.default.intl),
                component;

            if (_FormUtils2.default.isTypeahead(question)) {
                value = _Utils2.default.idToName(this.state.options, value);
                var inputProps = {
                    disabled: _FormUtils2.default.isDisabled(question)
                };
                component = _react2.default.createElement(
                    "div",
                    null,
                    _react2.default.createElement(
                        "label",
                        { className: "control-label" },
                        label
                    ),
                    _react2.default.createElement(_reactBootstrapTypeahead2.default, { ref: "typeahead", className: "form-group form-group-sm", formInputOption: "id",
                        inputProps: inputProps,
                        title: title, value: value, label: label, placeholder: label, filterOption: "name",
                        displayOption: "name", onOptionSelected: this._onOptionSelected, optionsButton: true,
                        options: this.state.options, customListComponent: _Configuration2.default.typeaheadResultList })
                );
            } else if (Answer._hasOptions(question)) {
                component = _react2.default.createElement(_Configuration2.default.inputComponent, {
                    type: 'select',
                    label: label,
                    value: value,
                    title: title,
                    onChange: this.onChange,
                    disabled: _FormUtils2.default.isDisabled(question)
                }, this._generateSelectOptions(question[_Constants2.default.FORM.HAS_OPTION]));
            } else {
                var answer = this.props.answer;
                // TODO This is temporary to show labels for IRI-based values
                if (answer[_Constants2.default.FORM.HAS_OBJECT_VALUE] && answer[_Constants2.default.FORM.HAS_OBJECT_VALUE][_jsonldUtils2.default.RDFS_LABEL]) {
                    value = _jsonldUtils2.default.getJsonAttValue(answer[_Constants2.default.FORM.HAS_OBJECT_VALUE], _jsonldUtils2.default.RDFS_LABEL);
                }
                var inputType = _FormUtils2.default.isTextarea(question, value) ? 'textarea' : 'text';
                component = _react2.default.createElement(_Configuration2.default.inputComponent, {
                    type: inputType,
                    label: label,
                    title: title,
                    value: value,
                    onChange: this.onChange,
                    disabled: _FormUtils2.default.isDisabled(question),
                    rows: 5
                });
            }
            return component;
        }
    }, {
        key: "_generateSelectOptions",
        value: function _generateSelectOptions(options) {
            var rendered = [];
            options.sort(function (a, b) {
                var aLabel = _jsonldUtils2.default.getJsonAttValue(a, _jsonldUtils2.default.RDFS_LABEL),
                    bLabel = _jsonldUtils2.default.getJsonAttValue(b, _jsonldUtils2.default.RDFS_LABEL);
                if (aLabel < bLabel) {
                    return -1;
                }
                if (aLabel > bLabel) {
                    return 1;
                }
                return 0;
            });
            for (var i = 0, len = options.length; i < len; i++) {
                rendered.push(_react2.default.createElement(
                    "option",
                    { value: _jsonldUtils2.default.getJsonAttValue(options[i], _jsonldUtils2.default.RDFS_LABEL),
                        key: 'opt-' + i },
                    _jsonldUtils2.default.getJsonAttValue(options[i], _jsonldUtils2.default.RDFS_LABEL)
                ));
            }
            return rendered;
        }
    }], [{
        key: "_hasOptions",
        value: function _hasOptions(item) {
            return item[_Constants2.default.FORM.HAS_OPTION] && item[_Constants2.default.FORM.HAS_OPTION].length !== 0;
        }
    }]);
    return Answer;
}(_react2.default.Component);

Answer.propTypes = {
    answer: _react2.default.PropTypes.object.isRequired,
    question: _react2.default.PropTypes.object.isRequired,
    onChange: _react2.default.PropTypes.func.isRequired,
    index: _react2.default.PropTypes.number
};
exports.default = Answer;