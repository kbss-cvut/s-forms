'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import Configuration from '../../src/model/Configuration';
import Constants from '../../src/constants/Constants';
import Question from '../../src/components/Question';

var question = {
    "@id": "http://onto.fel.cvut.cz/ontologies/eccairs/model/instance#instance-1223764187-q",
    "@type": "doc:question",
    "http://onto.fel.cvut.cz/ontologies/documentation/has_answer": [{
        "@id": "http://onto.fel.cvut.cz/ontologies/eccairs/model/instance#instance-636079211-a",
        "http://onto.fel.cvut.cz/ontologies/documentation/has_data_value": 1472197552242
    }],
    "http://onto.fel.cvut.cz/ontologies/form-layout/has-layout-class": "datetime",
    "http://www.w3.org/2000/01/rdf-schema#comment": {
        "@language": "en",
        "@value": "The identification of the entity or organisation that is responsible for the report."
    },
    "http://www.w3.org/2000/01/rdf-schema#label": {
        "@language": "en",
        "@value": "453 - Responsible entity"
    }
};

function onChange(index, change) {
    console.log(change);
}

class TestApp extends React.Component {
    constructor(props) {
        super(props);
        Configuration.dateFormat = "YYYY-MM-DD";
        Configuration.intl = {
            locale: navigator.language
        };
    }

    render() {
        return <div>
            <Question question={question} onChange={onChange}/>
        </div>;
    }
}

ReactDOM.render(<TestApp/>, document.getElementById('container'));
