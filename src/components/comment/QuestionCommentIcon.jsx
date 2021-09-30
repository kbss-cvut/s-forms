import React, {useRef, useState} from "react";
import CommentBubble from "../../styles/icons/CommentBubble";
import {Overlay, Tooltip} from "react-bootstrap";
import CommentList from "./CommentList";
import NewComment from "./NewComment";
import PropTypes from "prop-types";

const QuestionCommentIcon = (props) => {
    const target = useRef(null);

    const [show, setShow] = useState(false);
    const [comment, setComment] = useState([]);

    const hideOverlay = () => {
        setShow(false);
    }

    const addCommentHandler = (comment) => {
        setComment(prevComment => {
            return [comment, ...prevComment];
        });
    }

    return (
        <>
            <span ref={target} onClick={() => setShow(!show)}>
                <CommentBubble />
            </span>

            <Overlay target={target.current} show={show} placement="right" rootClose={true} onHide={hideOverlay}>
                {(overlayProps) => (
                    <Tooltip className="comment-tooltip" {...overlayProps}>
                        <span>
                            <NewComment onAddComment={addCommentHandler}/>
                            <CommentList question={props.question} comments={comment}/>
                        </span>
                    </Tooltip>
                )}
            </Overlay>
        </>
    );
}

QuestionCommentIcon.propTypes = {
    question: PropTypes.object.isRequired
};

export default QuestionCommentIcon;