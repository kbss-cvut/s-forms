import React, {useRef, useState} from "react";
import QuestionComment from "../../styles/icons/QuestionComment";
import {Overlay, Tooltip} from "react-bootstrap";
import CommentList from "./CommentList";
import NewComment from "./NewComment";
import JsonLdObjectUtils from "../../util/JsonLdObjectUtils";

const QuestionCommentIcon = () => {
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

        const commentJsonLd = {
            "@context" : "something"
        }
    }

    return (
        <>
            <span ref={target} onClick={() => setShow(!show)}>
                <QuestionComment />
            </span>

            <Overlay target={target.current} show={show} placement="right" rootClose={true} onHide={hideOverlay}>
                {(props) => (
                    <Tooltip className="comment-tooltip" {...props}>
                        <span>
                            <NewComment onAddComment={addCommentHandler}/>
                            <CommentList comments={comment}/>
                        </span>
                    </Tooltip>
                )}
            </Overlay>
        </>
    );
}

export default QuestionCommentIcon;