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

var _reactBootstrap = require("react-bootstrap");

var _jsonldUtils = require("jsonld-utils");

var _jsonldUtils2 = _interopRequireDefault(_jsonldUtils);

var _Answer = require("./Answer");

var _Answer2 = _interopRequireDefault(_Answer);

var _Configuration = require("../model/Configuration");

var _Configuration2 = _interopRequireDefault(_Configuration);

var _Constants = require("../constants/Constants");

var _Constants2 = _interopRequireDefault(_Constants);

var _FormUtils = require("../util/FormUtils");

var _FormUtils2 = _interopRequireDefault(_FormUtils);

var _QuestionAnswerProcessor = require("../model/QuestionAnswerProcessor");

var _QuestionAnswerProcessor2 = _interopRequireDefault(_QuestionAnswerProcessor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Question = function (_React$Component) {
    (0, _inherits3.default)(Question, _React$Component);

    function Question(props) {
        (0, _classCallCheck3.default)(this, Question);

        var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Question).call(this, props));

        _this.onAnswerChange = function (answerIndex, change) {
            _this._onChange(_Constants2.default.FORM.HAS_ANSWER, answerIndex, change);
        };

        _this.onSubQuestionChange = function (subQuestionIndex, change) {
            _this._onChange(_Constants2.default.FORM.HAS_SUBQUESTION, subQuestionIndex, change);
        };

        return _this;
    }

    (0, _createClass3.default)(Question, [{
        key: "_onChange",
        value: function _onChange(att, valueIndex, newValue) {
            var newState = (0, _objectAssign2.default)({}, this.props.question);
            newState[att][valueIndex] = newValue;
            this.props.onChange(this.props.index, newState);
        }
    }, {
        key: "render",
        value: function render() {
            if (_FormUtils2.default.isHidden(this.props.question)) {
                return null;
            }
            if (_FormUtils2.default.isSection(this.props.question)) {
                if (this.props.withoutPanel) {
                    return _react2.default.createElement(
                        "div",
                        null,
                        this.renderAnswers(),
                        this.renderSubQuestions()
                    );
                } else {
                    var label = _jsonldUtils2.default.getLocalized(this.props.question[_jsonldUtils2.default.RDFS_LABEL], _Configuration2.default.intl);
                    return _react2.default.createElement(
                        _reactBootstrap.Panel,
                        { header: _react2.default.createElement(
                                "h5",
                                null,
                                label
                            ), bsStyle: "info" },
                        this.renderAnswers(),
                        this.renderSubQuestions()
                    );
                }
            } else {
                return _react2.default.createElement(
                    "div",
                    null,
                    this.renderAnswers()
                );
            }
        }
    }, {
        key: "renderAnswers",
        value: function renderAnswers() {
            var question = this.props.question,
                children = [],
                row = [],
                cls,
                isTextarea;
            var answers = this._getAnswers();
            for (var i = 0, len = answers.length; i < len; i++) {
                isTextarea = _FormUtils2.default.isTextarea(this.props.question, _FormUtils2.default.resolveValue(answers[i]));
                cls = Question._getAnswerClass(isTextarea);
                row.push(_react2.default.createElement(
                    "div",
                    { key: 'row-item-' + i, className: cls },
                    _react2.default.createElement(_Answer2.default, { index: i, answer: answers[i], question: question, onChange: this.onAnswerChange })
                ));
                if (row.length === _Constants2.default.FORM.GENERATED_ROW_SIZE || isTextarea) {
                    children.push(_react2.default.createElement(
                        "div",
                        { className: "row", key: 'question-row-' + i },
                        row
                    ));
                    row = [];
                }
            }
            if (row.length > 0) {
                children.push(_react2.default.createElement(
                    "div",
                    { className: "row", key: 'question-row-' + i },
                    row
                ));
            }
            return children;
        }
    }, {
        key: "_getAnswers",
        value: function _getAnswers() {
            var question = this.props.question;
            if (!question[_Constants2.default.FORM.HAS_ANSWER]) {
                if (_FormUtils2.default.isSection(question) || _FormUtils2.default.isWizardStep(question)) {
                    question[_Constants2.default.FORM.HAS_ANSWER] = [];
                } else {
                    question[_Constants2.default.FORM.HAS_ANSWER] = [_QuestionAnswerProcessor2.default.generateAnswer(question)];
                }
            }
            if (!Array.isArray(question[_Constants2.default.FORM.HAS_ANSWER])) {
                question[_Constants2.default.FORM.HAS_ANSWER] = [question[_Constants2.default.FORM.HAS_ANSWER]];
            }
            return question[_Constants2.default.FORM.HAS_ANSWER];
        }
    }, {
        key: "renderSubQuestions",
        value: function renderSubQuestions() {
            var children = [],
                subQuestions = this._getSubQuestions();
            for (var i = 0, len = subQuestions.length; i < len; i++) {
                children.push(_react2.default.createElement(Question, { key: 'sub-question-' + i, index: i, question: subQuestions[i],
                    onChange: this.onSubQuestionChange }));
            }
            return children;
        }
    }, {
        key: "_getSubQuestions",
        value: function _getSubQuestions() {
            var question = this.props.question;
            if (!question[_Constants2.default.FORM.HAS_SUBQUESTION]) {
                question[_Constants2.default.FORM.HAS_SUBQUESTION] = [];
            }
            if (!Array.isArray(question[_Constants2.default.FORM.HAS_SUBQUESTION])) {
                question[_Constants2.default.FORM.HAS_SUBQUESTION] = [question[_Constants2.default.FORM.HAS_SUBQUESTION]];
            }
            // TODO Temporary sorting
            question[_Constants2.default.FORM.HAS_SUBQUESTION].sort(function (a, b) {
                var aLabel = _jsonldUtils2.default.getJsonAttValue(a, _jsonldUtils2.default.RDFS_LABEL),
                    bLabel = _jsonldUtils2.default.getJsonAttValue(b, _jsonldUtils2.default.RDFS_LABEL);
                if (aLabel < bLabel) {
                    return -1;
                } else if (aLabel > bLabel) {
                    return 1;
                }
                return 0;
            });
            return question[_Constants2.default.FORM.HAS_SUBQUESTION];
        }
    }], [{
        key: "_getAnswerClass",
        value: function _getAnswerClass(isTextarea) {
            return isTextarea ? 'col-xs-12' : _Constants2.default.FORM.GENERATED_ROW_SIZE === 1 ? 'col-xs-6' : 'col-xs-' + _Constants2.default.COLUMN_COUNT / _Constants2.default.FORM.GENERATED_ROW_SIZE;
        }
    }]);
    return Question;
}(_react2.default.Component);

Question.propTypes = {
    question: _react2.default.PropTypes.object.isRequired,
    onChange: _react2.default.PropTypes.func.isRequired,
    index: _react2.default.PropTypes.number,
    withoutPanel: _react2.default.PropTypes.bool
};
exports.default = Question;