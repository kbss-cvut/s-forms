import React from "react";
import CommentView from "./CommentView";

const CommentList = (props) => {
    return (
        <>
            {props.comments.map((comment) => (
                <div className="comment-list-items" key={comment.id}>
                    <CommentView
                        author={comment.author}
                        timestamp={comment.timestamp}
                        commentValue={comment.commentValue}
                    />
                </div>
            ))}
        </>
    )
}

export default CommentList;