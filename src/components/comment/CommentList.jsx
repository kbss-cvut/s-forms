import React from "react";
import CommentView from "./CommentView";
import Constants from "../../constants/Constants";

// TODO make util function
const _getComments = (question) => {

    if (!question[Constants.HAS_COMMENT]) {
        question[Constants.HAS_COMMENT] = [];
    }
    if (!Array.isArray(question[Constants.HAS_COMMENT])) {
        question[Constants.HAS_COMMENT] = [question[Constants.HAS_COMMENT]];
    }

    return question[Constants.HAS_COMMENT];
};


const CommentList = (props) => {
    return (
        <>
            {_getComments(props.question).map((comment) => (
                <div key={comment["@id"]}
                    className="comment-list-items">
                    <CommentView
                        commentValue={comment[Constants.HAS_COMMENT_VALUE]}
                        author={comment[Constants.HAS_AUTHOR]["@id"]}
                        timestamp={comment[Constants.HAS_TIMESTAMP]}
                    />
                </div>
            ))}
        </>
    )
};

export default CommentList;