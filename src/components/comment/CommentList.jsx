import React from "react";
import CommentView from "./CommentView";
import PropTypes from "prop-types";
import Constants from "../../constants/Constants";


const CommentList = (props) => {
    return (
        <>
            {props.comment.map((comment) => (
                <div key={JSON.stringify(comment[Constants.HAS_TIMESTAMP])}
                    className="comment-list-items">
                    <CommentView
                        commentValue={comment[Constants.HAS_COMMENT_VALUE]}
                        author={comment[Constants.HAS_AUTHOR]}
                        timestamp={comment[Constants.HAS_TIMESTAMP]}
                    />
                </div>
            ))}
        </>
    )
};

CommentList.propTypes = {
    comment: PropTypes.array.isRequired
};

export default CommentList;