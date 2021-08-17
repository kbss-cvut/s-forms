import React from "react";
import {Accordion, Button, Card} from "react-bootstrap";
import PropTypes from "prop-types";

class SubmittedComment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUserLabel: '',
            timestamp: '',
            submittedCommentValue: ''
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
                        <Card.Body>{this.props.submittedCommentValue}</Card.Body>
                    </Accordion.Collapse>
                </Card>
            </Accordion>
        )
    }

    render() {
        return this.renderAccordion()
    }
}

SubmittedComment.propTypes = {
    currentUserLabel: PropTypes.string,
    timestamp: PropTypes.string.isRequired,
    submittedCommentValue: PropTypes.string.isRequired
}

export default SubmittedComment