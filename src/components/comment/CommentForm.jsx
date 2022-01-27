import React, {useEffect, useRef, useState} from "react";
import {Button, Form, Col, Row} from "react-bootstrap";
import PropTypes from "prop-types";
import ArrowRight from "../../styles/icons/ArrowRight";

const CommentForm = (props) => {
    const [commentValue, setCommentValue] = useState('');
    const formInputRef = useRef(null);

    useEffect(() => {
        formInputRef.current.focus();
    }, []);

    const onValueChange = (e) => {
        setCommentValue(e.target.value);
    }

    const submitHandler = (e) => {
        e.preventDefault();
        props.onChange(commentValue);
        setCommentValue('');
    }

    const onKeyUpHandler = (e) => {
        if (e.key === 'Enter'&& e.ctrlKey && commentValue.trim()) submitHandler(e);
    }

    const onClickHandler = (e) => {
        e.stopPropagation();
    }

    return (
        <Form onSubmit={submitHandler} onKeyUp={onKeyUpHandler} onClick={onClickHandler}>
            <Form.Group className="m-2" controlId="formBasicComment">
                <Col className="col-lg-12 p-0">
                    <Row className="container-fluid p-0 m-0">
                        <div className="comment-form">
                            <Form.Control
                                className="comment-form-control"
                                name="comment"
                                as="textarea"
                                placeholder="Write your comments here  (Ctrl+Enter to confirm)"
                                required
                                value={commentValue}
                                onChange={onValueChange}
                                ref={formInputRef}
                            />
                            <Button className="comment-form-button" variant="primary" type="submit" >
                                <ArrowRight/>
                            </Button>
                        </div>
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