import React from "react";
import CommentForm from "./CommentForm";

const NewComment = (props) => {
    const saveCommentHandler = (enteredComment) => {
        const comment = {
            ...enteredComment,
            id: Math.random().toString()
        }
        props.onAddComment(comment);
    }

    return (
        <CommentForm onSaveComment={saveCommentHandler}/>
    )
}

export default NewComment;