import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { FormText, FormControl, FormGroup, Form } from "react-bootstrap";

export default class DefaultInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cursorPosition: 0,
    };
  }

  focus() {
    ReactDOM.findDOMNode(this.input).focus();
  }

  getInputDOMNode() {
    return ReactDOM.findDOMNode(this.input);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.fieldDidShrink(prevProps) || this.fieldDidExpand(prevProps)) {
      this.updateFieldCursorPosition();
    }
  }

  fieldDidExpand(prevProps) {
    return this.props.type === "textarea" && prevProps.type !== "textarea";
  }

  fieldDidShrink(prevProps) {
    return this.props.type === "text" && prevProps.type !== "text";
  }

  updateFieldCursorPosition() {
    this.focus();
    this.getInputDOMNode().setSelectionRange(
      this.state.cursorPosition,
      this.state.cursorPosition
    );
  }

  saveCursorPosition(e) {
    this.props.onChange(e);
    this.setState({
      cursorPosition: e.target.selectionStart,
    });
  }

  render() {
    switch (this.props.type) {
      case "radio":
        return this._renderRadio();
      case "checkbox":
        return this._renderCheckbox();
      case "select":
        return this._renderSelect();
      case "textarea":
        return this._renderTextArea();
      default:
        return this._renderInput();
    }
  }

  _renderCheckbox() {
    // TODO change control id to hash of label
    return (
      <Form.Group
        size="small"
        controlId={Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)}
      >
        <Form.Check
          type="checkbox"
          ref={(c) => (this.input = c)}
          {...this.props}
          label={this.props.label}
        />
      </Form.Group>
    );
  }

  _renderRadio() {
    return (
      <FormGroup size="small">
        <Form.Check
          type="radio"
          ref={(c) => (this.input = c)}
          {...this.props}
          label={this.props.label}
        />
      </FormGroup>
    );
  }

  _renderSelect() {
    // TODO validation
    return (
      <FormGroup size="small">
        {this._renderLabel()}
        <FormControl as="select" ref={(c) => (this.input = c)} {...this.props}>
          {this.props.children}
        </FormControl>
        {this.props.validation && <FormControl.Feedback />}
        {this._renderHelp()}
      </FormGroup>
    );
  }

  _renderLabel() {
    return this.props.label ? (
      <Form.Label>{this.props.label}</Form.Label>
    ) : null;
  }

  _renderTextArea() {
    // TODO validation
    return (
      <FormGroup size="small">
        {this._renderLabel()}
        <FormControl
          ref={(c) => (this.input = c)}
          as="textarea"
          {...this.props}
          onChange={(e) => this.saveCursorPosition(e)}
        />
        {this.props.validation && <FormControl.Feedback />}
        {this._renderHelp()}
      </FormGroup>
    );
  }

  _renderHelp(classname = "") {
    return this.props.help ? (
      <FormText className={classname}>{this.props.help}</FormText>
    ) : null;
  }

  _hasValidationWarning() {
    return this.props.validation && this.props.validation === "warning";
  }

  _hasValidationError() {
    return this.props.validation && this.props.validation === "error";
  }

  _hasValidationSuccess() {
    return this.props.validation && this.props.validation === "success";
  }

  _getValidationClassname() {
    if (this.props.validation && this.props.validation === "error") {
      return "is-invalid";
    }

    if (this.props.validation && this.props.validation === "warning") {
      return "is-warning";
    }

    return "";
  }

  _renderInput() {
    // TODO validation

    return (
      <FormGroup size="small">
        {this._renderLabel()}
        <FormControl
          className={this._getValidationClassname()}
          ref={(c) => (this.input = c)}
          as="input"
          {...this.props}
          onChange={(e) => this.saveCursorPosition(e)}
        />
        {(this._hasValidationSuccess() || this._hasValidationWarning()) &&
          this._renderHelp(this._getValidationClassname())}
        {this._hasValidationError() && (
          <FormControl.Feedback type={"invalid"}>
            {this.props.help}
          </FormControl.Feedback>
        )}
        {!this.props.validation && this._renderHelp()}
      </FormGroup>
    );
  }
}

DefaultInput.propTypes = {
  type: PropTypes.string,
  label: PropTypes.object,
  value: PropTypes.any,
  onChange: PropTypes.func,
  help: PropTypes.string,
  validation: PropTypes.oneOf(["success", "warning", "error"]),
};

DefaultInput.defaultProps = {
  type: "text",
};
