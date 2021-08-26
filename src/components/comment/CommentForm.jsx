import React, {useContext, useState} from "react";
import {Button, Form} from "react-bootstrap";
import {ConfigurationContext} from "../../contexts/ConfigurationContext";

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

    const commentValueChangeHandler = (e) => {
        setCommentValue(e.target.value);
        getTimeStamp();
        getAuthor();
    }

    const submitHandler = (e) => {
        e.preventDefault();

        const comment = {
            author: author,
            timestamp: timestamp,
            commentValue: commentValue
        };
        props.onSaveComment(comment);
        console.log(comment)
        setCommentValue('');
    }
    return (
        <Form onSubmit={submitHandler}>
            <Form.Group className="mb-3" controlId="formBasicComment">
                <Form.Label>Comments</Form.Label>
                <Form.Control
                    name="comment"
                    as="textarea"
                    placeholder="Write your comments here"
                    required
                    value={commentValue}
                    onChange={commentValueChangeHandler}
                />
            </Form.Group>
            <Button variant="primary" type="submit">
                Submit
            </Button>
        </Form>
    )
}

export default CommentForm;