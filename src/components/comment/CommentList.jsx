import React from "react";
import CommentView from "./CommentView";

const CommentList = (props) => {
    return (
        <>
            {props.comments.map((comment) => (
                <>
                    <CommentView
                        author={comment.author}
                        timestamp={comment.timestamp}
                        commentValue={comment.commentValue}
                    />
                    <br/>
                </>
            ))}
        </>
    )
}

export default CommentList;