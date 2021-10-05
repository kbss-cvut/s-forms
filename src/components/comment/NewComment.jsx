import React from "react";
import CommentForm from "./CommentForm";
import PropTypes from "prop-types";

const NewComment = (props) => {
    const saveCommentHandler = (enteredComment) => {
        const comment = {
            ...enteredComment,
            id: enteredComment.timestamp
        }
        props.onAddComment(comment);
    }

    return (
        <CommentForm
            onSaveComment={saveCommentHandler}
            onChange={props.onValueChange}
        />
    )
}

NewComment.propTypes = {
    onAddComment: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onValueChange: PropTypes.func.isRequired,
    comment: PropTypes.array.isRequired
};

export default NewComment;