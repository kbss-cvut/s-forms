import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { FormText, FormControl, FormGroup, Form } from 'react-bootstrap';

export default class DefaultInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cursorPositionOnFocus: 0
    };
  }

  focus() {
    ReactDOM.findDOMNode(this.input).focus();
  }

  getInputDOMNode() {
    return ReactDOM.findDOMNode(this.input);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const cursorPositionOnFocus = this.state.cursorPositionOnFocus

    if (this.props.type === "textarea" && prevProps.type !== "textarea") {
      this.focus();
      console.log(cursorPositionOnFocus)
      this.getInputDOMNode().setSelectionRange(
          cursorPositionOnFocus,
          cursorPositionOnFocus
      );
    }
    if (this.props.type === "text" && prevProps.type !== "text") {
      this.focus();
      this.getInputDOMNode().setSelectionRange(
          cursorPositionOnFocus,
          cursorPositionOnFocus
      );
    }
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
    // TODO change control id to hash of label
    return (
      <Form.Group size="small" controlId={Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)}>
        <Form.Check type="checkbox" ref={(c) => (this.input = c)} {...this.props} label={this.props.label} />
      </Form.Group>
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
    return this.props.label ? <Form.Label>{this.props.label}</Form.Label> : null;
  }

  _renderTextArea() {
    // TODO validation
    return(
        <FormGroup size="small">
          {this._renderLabel()}
          <FormControl ref={(c) => (this.input = c)}
                       as="textarea"
                       {...this.props}
                       onChange={e => {
                         this.props.onChange(e)
                         this.setState({
                           inputLength: e.target.value.length,
                           cursorPositionOnFocus: e.target.selectionStart
                         })
                       }}

          />
          {this.props.validation && <FormControl.Feedback />}
          {this._renderHelp()}
        </FormGroup>
    )
  }

  _renderHelp() {
    return this.props.help ? <FormText>{this.props.help}</FormText> : null;
  }

  _renderInput() {
    // TODO validation

    return (
      <FormGroup size="small">
        {this._renderLabel()}
        <FormControl ref={(c) => (this.input = c)}
                     as="input"
                     {...this.props}
                     onChange={e => {
                       this.props.onChange(e)
                       this.setState({
                         inputLength: e.target.value.length,
                         cursorPositionOnFocus: e.target.selectionStart
                       })
                     }}
        />
        {this.props.validation && <FormControl.Feedback />}
        {this._renderHelp()}
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
  validation: PropTypes.oneOf(['success', 'warning', 'error'])
};

DefaultInput.defaultProps = {
  type: 'text'
};
