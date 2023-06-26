import React, { useContext, useEffect, useRef, useState } from "react";
import CommentBubble from "../../styles/icons/CommentBubble";
import { Badge, Overlay, Tooltip } from "react-bootstrap";
import CommentList from "./CommentList";
import PropTypes from "prop-types";
import Constants from "../../constants/Constants";
import { ConfigurationContext } from "../../contexts/ConfigurationContext";
import CommentForm from "./CommentForm";
import { motion } from "framer-motion";
import Close from "../../styles/icons/Close";

const QuestionCommentIcon = (props) => {
  const context = useContext(ConfigurationContext);
  const target = useRef(null);
  const dragRef = useRef(null);
  const overlayTarget = useRef(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayPlacement, setOverlayPlacement] = useState("right");

  useEffect(() => {
    getOverlayPlacement(overlayTarget.current);
  });

  const handleHideOverlayClick = () => {
    setShowOverlay(false);
  };

  // TODO make util function
  const _getComments = () => {
    const question = props.question;

    if (!question[Constants.HAS_COMMENT]) {
      question[Constants.HAS_COMMENT] = [];
    }
    if (!Array.isArray(question[Constants.HAS_COMMENT])) {
      question[Constants.HAS_COMMENT] = [question[Constants.HAS_COMMENT]];
    }

    return question[Constants.HAS_COMMENT];
  };

  const handleCommentValueChange = (value) => {
    const change = {};
    _setComment(change, value);
    props.onChange(getCommentsLength(), change);
  };

  const _setComment = (change, value) => {
    if (context.options.currentUser) {
      change[Constants.HAS_AUTHOR] = { "@id": context.options.currentUser };
    }
    change[Constants.HAS_COMMENT_VALUE] = value;
    change[Constants.HAS_TIMESTAMP] = Date.now().toString();
  };

  const handleDeleteQuestionCommentClick = (index) => {
    const comment = _getComments();
    comment.splice(index, 1);
  };

  const handleStopPropagationClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleOverlayClick = (e) => {
    handleStopPropagationClick(e);
    setShowOverlay(!showOverlay);
  };

  const getCommentsLength = () => {
    return _getComments().length;
  };

  const getOverlayPlacement = (overlayTarget) => {
    if (!overlayTarget) return;

    if (overlayTarget.getBoundingClientRect().x > window.innerWidth / 2) {
      setOverlayPlacement("left");
    } else setOverlayPlacement("right");
  };

  const handleEscapeKeyDown = (e) => {
    if (e.key === "Escape") {
      handleHideOverlayClick();
    }
  };

  return (
    <div ref={overlayTarget} onClick={handleStopPropagationClick}>
      <span
        className="comment-bubble"
        ref={target}
        onClick={handleOverlayClick}
      >
        <CommentBubble />
        {getCommentsLength() > 0 ? (
          <Badge className="comment-badge" pill variant="primary">
            {getCommentsLength()}
          </Badge>
        ) : null}
      </span>

      <motion.div
        className="overlay-comment"
        ref={dragRef}
        drag
        dragConstraints={{
          top: -50,
          left: -50,
          right: 50,
          bottom: 50,
        }}
      >
        <Overlay
          target={target.current}
          show={showOverlay}
          placement={overlayPlacement}
          rootClose={false}
          onHide={handleHideOverlayClick}
          container={dragRef}
        >
          {(overlayProps) => (
            <Tooltip className="comment-tooltip" {...overlayProps}>
              <span
                onKeyDown={(e) => {
                  handleEscapeKeyDown(e);
                }}
              >
                <motion.div
                  className="close-comment-icon"
                  onClick={handleHideOverlayClick}
                  whileHover={{ scale: 1.1, transition: { duration: 0.1 } }}
                >
                  <Close />
                </motion.div>
                <CommentList
                  comments={_getComments()}
                  onDeleteCommentClick={handleDeleteQuestionCommentClick}
                />
                <CommentForm onChange={handleCommentValueChange} />
              </span>
            </Tooltip>
          )}
        </Overlay>
      </motion.div>
    </div>
  );
};

QuestionCommentIcon.propTypes = {
  question: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default QuestionCommentIcon;
