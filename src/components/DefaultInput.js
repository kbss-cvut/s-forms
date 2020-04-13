import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { FormText, FormLabel, FormControl, FormGroup, Form } from 'react-bootstrap';

export default class DefaultInput extends React.Component {
  focus() {
    ReactDOM.findDOMNode(this.input).focus();
  }

  getInputDOMNode() {
    return ReactDOM.findDOMNode(this.input);
  }

  render() {
    switch (this.props.type) {
      case 'radio':
        return this._renderRadio();
      case 'checkbox':
        return this._renderCheckbox();
      case 'select':
        return this._renderSelect();
      case 'textarea':
        return this._renderTextArea();
      default:
        return this._renderInput();
    }
  }

  _renderCheckbox() {
    return (
      <FormGroup size="small">
        <Form.Check type="checkbox" ref={(c) => (this.input = c)} {...this.props} label={this.props.label} />
      </FormGroup>
    );
  }

  _renderRadio() {
    return (
      <FormGroup size="small">
        <Form.Check type="radio" ref={(c) => (this.input = c)} {...this.props} label={this.props.label} />
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
    return this.props.label ? <FormLabel>{this.props.label}</FormLabel> : null;
  }

  _renderTextArea() {
    // TODO validation
    return (
      <FormGroup size="small">
        {this._renderLabel()}
        <FormControl as="textarea" style={{ height: 'auto' }} ref={(c) => (this.input = c)} {...this.props} />
        {this.props.validation && <FormControl.Feedback />}
        {this._renderHelp()}
      </FormGroup>
    );
  }

  _renderHelp() {
    return this.props.help ? <FormText>{this.props.help}</FormText> : null;
  }

  _renderInput() {
    // TODO validation

    return (
      <FormGroup size="small">
        {this._renderLabel()}
        <FormControl ref={(c) => (this.input = c)} as="input" {...this.props} />
        {this.props.validation && <FormControl.Feedback />}
        {this._renderHelp()}
      </FormGroup>
    );
  }
}

DefaultInput.propTypes = {
  type: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func,
  help: PropTypes.string,
  validation: PropTypes.oneOf(['success', 'warning', 'error'])
};

DefaultInput.defaultProps = {
  type: 'text'
};
