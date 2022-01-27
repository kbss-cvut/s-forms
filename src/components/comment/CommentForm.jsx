import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, Col, Row } from 'react-bootstrap';
import PropTypes from 'prop-types';
import ArrowRight from '../../styles/icons/ArrowRight';

const CommentForm = (props) => {
  const [commentValue, setCommentValue] = useState('');
  const formInputRef = useRef(null);

  useEffect(() => {
    formInputRef.current.focus();
  }, []);

  const onValueChange = (e) => {
    setCommentValue(e.target.value);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    props.onChange(commentValue);
    setCommentValue('');
  };

  const onKeyUpHandler = (e) => {
    if (e.key === 'Enter' && e.ctrlKey && commentValue.trim()) submitHandler(e);
  };

  const onClickHandler = (e) => {
    e.stopPropagation();
  };

  return (
    <Form
      onSubmit={submitHandler}
      className="comment-form"
      onKeyUp={onKeyUpHandler}
      onClick={onClickHandler}
    >
      <Form.Group className="mb-3" controlId="formBasicComment">
        <Col className="col-lg-12">
          <Row className="col-lg-12">
            <Form.Control
              name="comment"
              as="textarea"
              placeholder="Write your comments here  (Ctrl+Enter to confirm)"
              required
              value={commentValue}
              onChange={onValueChange}
              ref={formInputRef}
            />
          </Row>
          <Row className="send-comment-arrow col-lg-12">
            <Button className="comment-button" variant="primary" type="submit">
              <ArrowRight />
            </Button>
          </Row>
        </Col>
      </Form.Group>
    </Form>
  );
};

CommentForm.propTypes = {
  onChange: PropTypes.func.isRequired
};

export default CommentForm;
