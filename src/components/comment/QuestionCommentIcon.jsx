import React, {useContext, useRef, useState} from "react";
import CommentBubble from "../../styles/icons/CommentBubble";
import {Overlay, Tooltip} from "react-bootstrap";
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

    const onValueChange = (value) => {
        const change = {};
        _setValue(change, value);
        props.onChange(commentIndex, change);
    };

    const _setValue = (change, value) => {
        change[Constants.HAS_COMMENT_VALUE] = {
            '@id' : value
        }
        change[Constants.HAS_AUTHOR] = {
            '@value' : context.options.currentUser
        }
        change[Constants.HAS_TIMESTAMP] = {
            '@value' : Date.now()
        }
    };

    return (
        <>
            <span ref={target} onClick={() => setShow(!show)}>
                <CommentBubble />
            </span>

            <Overlay target={target.current} show={show} placement="right" rootClose={true} onHide={hideOverlay}>
                {(overlayProps) => (
                    <Tooltip className="comment-tooltip" {...overlayProps}>
                        <span>
                            <NewComment
                                onAddComment={addCommentHandler}
                                onChange={props.onChange}
                                onValueChange={onValueChange}
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