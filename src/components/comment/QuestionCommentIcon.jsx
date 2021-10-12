import React, {useContext, useRef, useState} from "react";
import CommentBubble from "../../styles/icons/CommentBubble";
import {Badge, Overlay, Tooltip} from "react-bootstrap";
import CommentList from "./CommentList";
import NewComment from "./NewComment";
import PropTypes from "prop-types";
import Constants from "../../constants/Constants";
import {ConfigurationContext} from "../../contexts/ConfigurationContext";

const QuestionCommentIcon = (props) => {
    const context = useContext(ConfigurationContext);

    const target = useRef(null);

    const [show, setShow] = useState(false);
    const [comment, setComment] = useState([]);
    const [commentIndex, setCommentIndex] = useState(0);

    const hideOverlay = () => {
        setShow(false);
    }

    const addCommentHandler = (comment) => {
        setComment(prevComment => {
            return [comment, ...prevComment];
        });

        setCommentIndex(commentIndex + 1);
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
        props.onChange(commentIndex, change);
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

    return (
        <>
            <span ref={target} onClick={onClickHandler}>
                <CommentBubble/>
                {commentIndex > 0 ? <Badge className="comment-badge" pill variant="primary">{commentIndex}</Badge> : null}
            </span>

            <Overlay target={target.current} show={show} placement="right" rootClose={true} onHide={hideOverlay}>
                {(overlayProps) => (
                    <Tooltip className="comment-tooltip" {...overlayProps}>
                        <span>
                            <NewComment
                                onAddComment={addCommentHandler}
                                onChange={props.onChange}
                                onCommentValueChange={onCommentValueChangeHandler}
                                comment={_getComments()}
                            />
                            <CommentList
                                question={props.question}
                                comment={comment}
                            />
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