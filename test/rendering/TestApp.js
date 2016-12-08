'use strict';

import React from "react";
import ReactDOM from "react-dom";
import Configuration from "../../src/model/Configuration";
import Question from "../../src/components/Question";
import WizardGenerator from "../../src/model/WizardGenerator";

var wizard = require('./form.json');

function onChange(index, change) {
    console.log(change);
}

var wizardStore = {
    initWizard() {
    }
};

class TestApp extends React.Component {
    constructor(props) {
        super(props);
        Configuration.dateFormat = "YYYY-MM-DD";
        Configuration.intl = {
            locale: navigator.language
        };
        Configuration.wizardStore = wizardStore;
        this.state = {
            step: null
        };
        WizardGenerator.createWizard(wizard, null, null, (props) => {
            this.setState({step: props.steps[5].data});
        });
    }

    render() {
        if (!this.state.step) {
            return <div>'Loading wizard...'</div>;
        }
        return <div>
            <Question question={this.state.step} onChange={onChange} indent={0}/>
        </div>;
    }
}

ReactDOM.render(<TestApp/>, document.getElementById('container'));
