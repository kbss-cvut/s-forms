import React, {useContext, useState} from "react";
import {Button, Form} from "react-bootstrap";
import {ConfigurationContext} from "../../contexts/ConfigurationContext";
import PropTypes from "prop-types";

const CommentForm = (props) => {
    const context = useContext(ConfigurationContext);

    const [author, setAuthor] = useState('');
    const [timestamp, setTimestamp] = useState(null);
    const [commentValue, setCommentValue] = useState('');

    const getAuthor = () => {
        const users = context.options.users;
        const currentUser = context.options.currentUser;

        const currentUserId = users.find(c => c.id === currentUser);
        setAuthor(currentUserId.label)
    }

    const getTimeStamp = () => {
        setTimestamp(Date.now());
    }

    const onValueChange = (e) => {
        setCommentValue(e.target.value);
        getAuthor();
        getTimeStamp();
    }

    const submitHandler = (e) => {
        e.preventDefault();

        props.onChange(commentValue);

        const comment = {
            author: author,
            timestamp: timestamp,
            commentValue: commentValue
        };
        props.onSaveComment(comment);
        setCommentValue('');
    }
    return (
        <Form onSubmit={submitHandler} className="comment-form">
            <Form.Group className="mb-3" controlId="formBasicComment">
                <Form.Label>Comments</Form.Label>
                <Form.Control
                    name="comment"
                    as="textarea"
                    placeholder="Write your comments here"
                    required
                    value={commentValue}
                    onChange={onValueChange}
                />
            </Form.Group>
            <Button className="comment-button" variant="primary" type="submit" >
                Submit
            </Button>
        </Form>
    )
}

CommentForm.propTypes = {
    onSaveComment: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired
};

export default CommentForm;