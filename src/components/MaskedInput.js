import React from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import InputMask from "inputmask-core";
import {getSelection, setSelection} from "react/lib/ReactInputSelection";
import assign from "object-assign";
import Configuration from "../model/Configuration";
import MaskMapper from "../util/MaskMapper";

const KEYCODE_Z = 90;
const KEYCODE_Y = 89;

function isUndo(e) {
    return e.ctrlKey && e.keyCode === KEYCODE_Z;
}

function isRedo(e) {
    return e.ctrlKey && e.keyCode === KEYCODE_Y;
}

// Copied from https://github.com/insin/react-maskedinput

export default class MaskedInput extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const options = {
            pattern: MaskMapper.mapMask(this.props.mask),
            value: this.props.value,
            formatCharacters: this.props.formatCharacters
        };
        if (this.props.placeholderChar) {
            options.placeholderChar = this.props.placeholderChar
        }
        this.mask = new InputMask(options);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.mask !== nextProps.mask && this.props.value !== nextProps.mask) {
            // if we get a new value and a new mask at the same time
            // check if the mask.value is still the initial value
            // - if so use the nextProps value
            // - otherwise the `this.mask` has a value for us (most likely from paste action)
            if (this.mask.getValue() === this.mask.emptyValue) {
                this.mask.setPattern(MaskMapper.mapMask(nextProps.mask), {value: nextProps.value})
            } else {
                this.mask.setPattern(MaskMapper.mapMask(nextProps.mask), {value: this.mask.getRawValue()})
            }
        } else if (this.props.mask !== nextProps.mask) {
            this.mask.setPattern(MaskMapper.mapMask(nextProps.mask), {value: this.mask.getRawValue()})
        } else if (this.props.value !== nextProps.value) {
            this.mask.setValue(nextProps.value)
        }
    }

    componentWillUpdate(nextProps) {
        if (nextProps.mask !== this.props.mask) {
            this._updatePattern(nextProps)
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.mask !== this.props.mask && this.mask.selection.start) {
            this._updateInputSelection()
        }
    }

    _updatePattern(props) {
        this.mask.setPattern(MaskMapper.mapMask(props.mask), {
            value: this.mask.getRawValue(),
            selection: getSelection(this.input)
        });
    }

    _updateMaskSelection() {
        this.mask.selection = getSelection(this.input);
    }

    _updateInputSelection() {
        setSelection(this.input, this.mask.selection);
    }

    _onChange = (e) => {
        const maskValue = this.mask.getValue();
        if (e.target.value !== maskValue) {
            // Cut or delete operations will have shortened the value
            if (e.target.value.length < maskValue.length) {
                const sizeDiff = maskValue.length - e.target.value.length;
                this._updateMaskSelection();
                this.mask.selection.end = this.mask.selection.start + sizeDiff;
                this.mask.backspace();
            }
            const value = this._getDisplayValue();
            e.target.value = value;
            if (value) {
                this._updateInputSelection();
            }
        }
        if (this.props.onChange) {
            this.props.onChange(e);
        }
    };

    _onKeyDown = (e) => {
        if (isUndo(e)) {
            e.preventDefault();
            if (this.mask.undo()) {
                e.target.value = this._getDisplayValue();
                this._updateInputSelection();
                if (this.props.onChange) {
                    this.props.onChange(e);
                }
            }
        } else if (isRedo(e)) {
            e.preventDefault();
            if (this.mask.redo()) {
                e.target.value = this._getDisplayValue();
                this._updateInputSelection();
                if (this.props.onChange) {
                    this.props.onChange(e);
                }
            }
        } else if (e.key === 'Backspace') {
            e.preventDefault();
            this._updateMaskSelection();
            if (this.mask.backspace()) {
                const value = this._getDisplayValue();
                e.target.value = value;
                if (value) {
                    this._updateInputSelection();
                }
                if (this.props.onChange) {
                    this.props.onChange(e);
                }
            }
        }
    };

    _onKeyPress = (e) => {
        // Ignore modified key presses
        // Ignore enter key to allow form submission
        if (e.metaKey || e.altKey || e.ctrlKey || e.key === 'Enter') {
            return
        }

        e.preventDefault();
        this._updateMaskSelection();
        if (this.mask.input(e.key)) {
            e.target.value = this.mask.getValue();
            this._updateInputSelection();
            if (this.props.onChange) {
                this.props.onChange(e);
            }
        }
    };

    _onPaste(e) {
        e.preventDefault();
        this._updateMaskSelection();
        // getData value needed for IE also works in FF & Chrome
        if (this.mask.paste(e.clipboardData.getData('Text'))) {
            e.target.value = this.mask.getValue();
            // Timeout needed for IE
            setTimeout(this._updateInputSelection, 0);
            if (this.props.onChange) {
                this.props.onChange(e)
            }
        }
    }

    _getDisplayValue() {
        const value = this.mask.getValue();
        return value === this.mask.emptyValue ? '' : value;
    }

    focus() {
        this.input.focus();
    }

    blur() {
        this.input.blur();
    }

    render() {
        const {size, placeholder, ...props} = this.props,
            patternLength = this.mask.pattern.length;
        return React.createElement(Configuration.inputComponent, assign({}, props, {
            ref: (r) => {
                if (r) {
                    this.input = r.input ? ReactDOM.findDOMNode(r.input) : r;
                }
            },
            maxLength: patternLength,
            onChange: this._onChange,
            onKeyDown: this._onKeyDown,
            onKeyPress: this._onKeyPress,
            onPaste: this._onPaste,
            placeholder: placeholder || this.mask.emptyValue,
            size: size || patternLength,
            value: this._getDisplayValue(),
            type: 'text'
        }));
    }
}

MaskedInput.propTypes = {
    mask: PropTypes.string.isRequired,
};

MaskedInput.defaultProps = {
    value: ''
};
