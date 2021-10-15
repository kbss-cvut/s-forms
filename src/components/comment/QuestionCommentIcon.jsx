import React, {useContext, useRef, useState} from "react";
import CommentBubble from "../../styles/icons/CommentBubble";
import {Badge, Overlay, Tooltip} from "react-bootstrap";
import CommentList from "./CommentList";
import PropTypes from "prop-types";
import Constants from "../../constants/Constants";
import {ConfigurationContext} from "../../contexts/ConfigurationContext";
import CommentForm from "./CommentForm";

const QuestionCommentIcon = (props) => {
    const context = useContext(ConfigurationContext);
    const target = useRef(null);
    const [show, setShow] = useState(false);

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
        change[Constants.HAS_COMMENT_VALUE] = {
            [Constants.HAS_COMMENT_VALUE] : value
        }
        change[Constants.HAS_AUTHOR] = {
            [Constants.HAS_AUTHOR] : context.options.currentUser
        }
        change[Constants.HAS_TIMESTAMP] = {
            [Constants.HAS_TIMESTAMP] : Date.now()
        }
    };

    const onClickHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setShow(!show);
    }

    const getCommentsLength = () => {
       return _getComments().length;
    }

    return (
        <>
            <span ref={target} onClick={onClickHandler}>
                <CommentBubble/>
                {getCommentsLength() > 0 ? <Badge className="comment-badge" pill variant="primary">{getCommentsLength()}</Badge> : null}
            </span>

            <Overlay target={target.current} show={show} placement="right" rootClose={true} onHide={hideOverlay}>
                {(overlayProps) => (
                    <Tooltip className="comment-tooltip" {...overlayProps}>
                        <span>
                            <CommentForm onChange={onCommentValueChangeHandler} />
                            <CommentList comment={_getComments()} />
                        </span>
                    </Tooltip>
                )}
            </Overlay>
        </>
    );
}

QuestionCommentIcon.propTypes = {
    question: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
};

export default QuestionCommentIcon;