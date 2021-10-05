import React from "react";
import CommentView from "./CommentView";
import PropTypes from "prop-types";


const CommentList = (props) => {
    return (
        <>
            {props.comment.map((comment) => (
                <div key={comment.timestamp}
                    className="comment-list-items">
                    <CommentView
                        commentValue={comment.commentValue}
                        author={comment.author}
                        timestamp={comment.timestamp}
                    />
                </div>
            ))}
        </>
    )
};

CommentList.propTypes = {
    question: PropTypes.object.isRequired,
    comment: PropTypes.array.isRequired
};

export default CommentList;