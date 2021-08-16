import React from "react";
import {Button, Form} from "react-bootstrap";
import {ConfigurationContext} from "../contexts/ConfigurationContext";

class CommentForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            commentValue: ''
        }

        this.handleCommentChange = this.handleCommentChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleCommentChange(e) {
        this.setState({commentValue: e.target.value})
    }

    // TODO: handle submit
    handleSubmit(e) {
        e.preventDefault()
    }

    render() {
        return (
            <Form onSubmit={this.handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicComment">
                    <Form.Label>Comments</Form.Label>
                    <Form.Control
                        name="comment"
                        as="textarea"
                        placeholder="Write your comments here"
                        required
                        value={this.state.commentValue}
                        onChange={e => this.handleCommentChange(e)}
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        )
    }
}

CommentForm.contextType = ConfigurationContext;

export default CommentForm