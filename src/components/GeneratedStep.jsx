import React from 'react';
import PropTypes from 'prop-types';
import Question from './Question';

export default class GeneratedStep extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      question: this.props.getStepData(this.props.stepIndex)
    };
  }

  onChange = (index, change) => {
    this.props.updateStepData(this.props.stepIndex, { ...this.state.question, ...change });
    this.setState({ question: this.props.getStepData(this.props.stepIndex) });
  };

  render() {
    return <Question question={this.state.question} onChange={this.onChange} withoutCard={true} />;
  }
}

GeneratedStep.propTypes = {
  stepIndex: PropTypes.number.isRequired
};
