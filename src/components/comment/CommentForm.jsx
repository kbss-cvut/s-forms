import React, {useState} from "react";
import {Button, Form, Col, Row} from "react-bootstrap";
import PropTypes from "prop-types";
import ArrowRight from "../../styles/icons/ArrowRight";

const CommentForm = (props) => {
    const [commentValue, setCommentValue] = useState('');

    const onValueChange = (e) => {
        setCommentValue(e.target.value);
    }

    const submitHandler = (e) => {
        e.preventDefault();
        props.onChange(commentValue);
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
    onChange: PropTypes.func.isRequired
};

export default CommentForm;