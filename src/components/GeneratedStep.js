'use strict';

import React from "react";
import assign from "object-assign";
import PropTypes from "prop-types";
import Question from "./Question";
import Configuration from "../model/Configuration";

export default class GeneratedStep extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            question: Configuration.wizardStore.getStepData([this.props.stepIndex])
        };
    }

    componentDidMount() {
        this.unsubscribe = Configuration.wizardStore.listen(this._onStoreTrigger);
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    _onStoreTrigger = () => {
        this.setState({question: Configuration.wizardStore.getStepData(this.props.stepIndex)});
    };

    onChange = (index, change) => {
        Configuration.wizardStore.updateStepData(this.props.stepIndex, assign(this.state.question, change));
    };

    render() {
        return <Question question={this.state.question} onChange={this.onChange} withoutPanel={true}/>;
    }
}

GeneratedStep.propTypes = {
    stepIndex: PropTypes.number.isRequired
};
