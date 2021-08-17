import React from "react";
import {Accordion, Button, Card} from "react-bootstrap";
import {ConfigurationContext} from "../contexts/ConfigurationContext";
import PropTypes, {string} from "prop-types";

class SubmittedComment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUserLabel: '',
            timestamp: '',
            comment: ''
        }
    }

    renderAccordion() {
        return (
            <Accordion>
                <Card text="dark">
                    <Card.Header>
                        <Accordion.Toggle as={Button} variant="outline-primary" eventKey="0">
                            {this.props.currentUserLabel} comment
                        </Accordion.Toggle>
                    </Card.Header>
                    <Card.Footer>{this.props.timestamp}</Card.Footer>
                    <Accordion.Collapse eventKey="0">
                        <Card.Text>{this.props.commentValue}</Card.Text>
                    </Accordion.Collapse>
                </Card>
            </Accordion>
        )
    }

    render() {
        return this.renderAccordion()
    }
}

SubmittedComment.contextType = ConfigurationContext;

SubmittedComment.propTypes = {
    currentUserLabel: PropTypes.string,
    timestamp: PropTypes.string.isRequired,
    commentValue: PropTypes.string
}

export default SubmittedComment