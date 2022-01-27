import React from "react";
import CommentView from "./CommentView";
import PropTypes from "prop-types";
import Constants from "../../constants/Constants";


const CommentList = (props) => {
    return (
        <div className="comment-list-items">
            {props.comment.map((comment, index) => (
                <div key={index}
                     className="comment-list-item">
                    <CommentView
                        commentValue={comment[Constants.HAS_COMMENT_VALUE]}
                        author={comment[Constants.HAS_AUTHOR] ? comment[Constants.HAS_AUTHOR] : null}
                        timestamp={comment[Constants.HAS_TIMESTAMP]}
                        onClickDeleteComment={props.onClickDeleteComment}
                        index={index}
                        comment={comment}
                    />
                </div>
            ))}
        </div>);
};

CommentList.propTypes = {
    comment: PropTypes.array.isRequired,
    onClickDeleteComment: PropTypes.func.isRequired
};

export default CommentList;