import React, {useContext, useState} from "react";
import {Button, Form, Col, Row} from "react-bootstrap";
import {ConfigurationContext} from "../../contexts/ConfigurationContext";
import PropTypes from "prop-types";
import ArrowRight from "../../styles/icons/ArrowRight";

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

    const onKeyUpHandler = (e) => {
        if (e.key === 'Enter'&& e.ctrlKey) submitHandler(e)
    }

    return (
        <Form onSubmit={submitHandler} className="comment-form" onKeyUp={onKeyUpHandler}>
            <Form.Group className="mb-3" controlId="formBasicComment">
                <Col className="col-lg-12">
                    <Row className="col-lg-12">
                        <Form.Control
                            name="comment"
                            as="textarea"
                            placeholder="Write your comments here"
                            required
                            value={commentValue}
                            onChange={onValueChange}
                        />
                    </Row>
                    <Row className="send-comment-arrow col-lg-12">
                        <Button className="comment-button" variant="primary" type="submit" >
                            <ArrowRight />
                        </Button>
                    </Row>
                </Col>
            </Form.Group>
        </Form>
    );
}

CommentForm.propTypes = {
    onSaveComment: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired
};

export default CommentForm;