import React from "react";
import CommentView from "./CommentView";
import Constants from "../../constants/Constants";

interface Props {
    comment: Array<any>
}

const CommentList = ({comment}: Props) => {
    console.log(comment)
    const addComments = () => {
        return (
            comment.map((comment, index) => (
                <div key={index}
                     className="comment-list-items">
                    <CommentView
                        commentValue={comment[Constants.HAS_COMMENT_VALUE]}
                        author={comment[Constants.HAS_AUTHOR] ? comment[Constants.HAS_AUTHOR] : null}
                        timestamp={comment[Constants.HAS_TIMESTAMP]}
                    />
                </div>
            )));
    }

    const renderSortedComments = () => {
        return addComments().sort((a: any, b: any) => {
            return new Date(a.HAS_TIMESTAMP).getTime()
                - new Date(b.HAS_TIMESTAMP).getTime()
        }).reverse();
    }

    return renderSortedComments();
};

export default CommentList;