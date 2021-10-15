import React from "react";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import Constants from "../../constants/Constants";

const CommentView = (props) => {
    const parseJsonComment = (value, constant) => {
        const jsonComment = JSON.parse(JSON.stringify(value));
        return jsonComment[constant];
    }

    TimeAgo.addLocale(en);
    const time = new TimeAgo('en-US');
    const timeAgo = time.format(parseJsonComment(props.timestamp, [Constants.HAS_TIMESTAMP]));
    return (
        <div className="comment-content">
            <div className="row">
                <span className="col-auto comment-author">{parseJsonComment(props.author, [Constants.HAS_AUTHOR])}</span>
                <span className="col-auto text-muted comment-timestamp">{timeAgo}</span>
            </div>
            <div className="row">
                <span className="col comment-value">{parseJsonComment(props.commentValue, [Constants.HAS_COMMENT_VALUE])}</span>
            </div>
        </div>
    );
}

export default CommentView;