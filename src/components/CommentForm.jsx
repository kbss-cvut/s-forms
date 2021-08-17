import React from "react";
import {Button, Form} from "react-bootstrap";
import PropTypes from "prop-types";

const CommentForm = (props) => {
    return (
        <Form onSubmit={props.handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicComment">
                <Form.Label>Comments</Form.Label>
                <Form.Control
                    name="comment"
                    as="textarea"
                    placeholder="Write your comments here"
                    required
                    value={props.commentValue}
                    onChange={props.handleCommentChange}
                />
            </Form.Group>
            <Button variant="primary" type="submit">
                Submit
            </Button>
        </Form>
    )
}

CommentForm.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    handleCommentChange: PropTypes.func.isRequired,
    commentValue: PropTypes.string.isRequired
}

export default CommentForm