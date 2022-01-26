import React, {useContext, useEffect, useRef, useState} from "react";
import CommentBubble from "../../styles/icons/CommentBubble";
import {Badge, Overlay, Tooltip} from "react-bootstrap";
import CommentList from "./CommentList";
import PropTypes from "prop-types";
import Constants from "../../constants/Constants";
import {ConfigurationContext} from "../../contexts/ConfigurationContext";
import CommentForm from "./CommentForm";
import {motion} from 'framer-motion/dist/framer-motion';

const QuestionCommentIcon = (props) => {
    const context = useContext(ConfigurationContext);
    const target = useRef(null);
    const dragRef = useRef(null);
    const [show, setShow] = useState(false);
    const [overlayPlacement, setOverlayPlacement] = useState("right");

    const hideOverlay = () => {
        setShow(false);
    }

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

    const onCommentValueChangeHandler = (value) => {
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

    const onClickHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setShow(!show);
    }

    const getCommentsLength = () => {
        return _getComments().length;
    }

    const getOverlayPlacement = (el) => {
        if (!el) return;

        if (el.getBoundingClientRect().x > window.innerWidth / 2) {
            setOverlayPlacement("left");
        } else setOverlayPlacement("right");
    };

    return (
        <div ref={el => getOverlayPlacement(el)}>
            <span ref={target} onClick={onClickHandler}>
                <CommentBubble/>
                {getCommentsLength() > 0 ? <Badge className="comment-badge" pill variant="primary">{getCommentsLength()}</Badge> : null}
            </span>

            <motion.div className="overlay-comment" ref={dragRef} drag dragConstraints={{
                top: -50,
                left: -50,
                right: 50,
                bottom: 50,
            }}>
                <Overlay target={target.current} show={show} placement={overlayPlacement} rootClose={false} onHide={hideOverlay} container={dragRef}>
                    {(overlayProps) => (
                        <Tooltip className="comment-tooltip" {...overlayProps}>
                        <span>
                            <CommentForm onChange={onCommentValueChangeHandler} />
                            <CommentList comment={_getComments()} />
                        </span>
                        </Tooltip>
                    )}
                </Overlay>
            </motion.div>
        </div>
    );
}

QuestionCommentIcon.propTypes = {
    question: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
};

export default QuestionCommentIcon;