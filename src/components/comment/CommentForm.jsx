import React, { useEffect, useRef, useState } from "react";
import { Button, Form, Col, Row } from "react-bootstrap";
import PropTypes from "prop-types";
import ArrowRight from "../../styles/icons/ArrowRight";
import { useIntl } from "react-intl";

const MAX_TEXT_AREA_HEIGHT = "300px";

const CommentForm = (props) => {
  const [commentValue, setCommentValue] = useState("");
  const formInputRef = useRef(null);
  const intl = useIntl();

  useEffect(() => {
    formInputRef.current.focus();
  }, []);

  const handleValueChange = (e) => {
    setCommentValue(e.target.value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    props.onChange(commentValue);
    setCommentValue("");
  };

  const handleFormKeyUp = (e) => {
    if (e.key === "Enter" && e.ctrlKey && commentValue.trim())
      handleFormSubmit(e);
  };

  const handleFormClick = (e) => {
    e.stopPropagation();
  };

  const handleTextAreaKeyPress = () => {
    const textArea = formInputRef.current;
    textArea.style.height = "auto";
    autoResizeTextArea(textArea);
  };

  const autoResizeTextArea = (textArea) => {
    let scrollHeight = textArea.scrollHeight;
    textArea.style.height = `${scrollHeight}px`;
    if (parseInt(textArea.style.height) > parseInt(MAX_TEXT_AREA_HEIGHT)) {
      textArea.style.height = MAX_TEXT_AREA_HEIGHT;
    }
  };

  return (
    <Form
      onSubmit={handleFormSubmit}
      onKeyUp={handleFormKeyUp}
      onClick={handleFormClick}
    >
      <Form.Group className="m-2" controlId="formBasicComment">
        <Col className="col-lg-12 p-0">
          <Row className="container-fluid p-0 m-0">
            <div id="comment-form">
              <Form.Control
                className="comment-form-control"
                name="comment"
                as="textarea"
                placeholder={intl.formatMessage({
                  id: "comment.form.placeholder",
                })}
                required
                value={commentValue}
                onChange={handleValueChange}
                ref={formInputRef}
                onKeyPress={handleTextAreaKeyPress}
                onKeyDown={handleTextAreaKeyPress}
              />
              <Button
                className="comment-form-button"
                variant="primary"
                type="submit"
              >
                <ArrowRight />
              </Button>
            </div>
          </Row>
        </Col>
      </Form.Group>
    </Form>
  );
};

CommentForm.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default CommentForm;
