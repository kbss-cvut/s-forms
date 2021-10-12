import React from "react";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";

const CommentView = (props) => {
    TimeAgo.addLocale(en);
    const time = new TimeAgo('en-US');
    const timeAgo = time.format(parseInt(props.timestamp));

    return (
        <div className="comment-content">
            <div className="row">
                <span className="col-auto comment-author">{props.author}</span>
                <span className="col-auto text-muted comment-timestamp">{timeAgo}</span>
            </div>
            <div className="row">
                <span className="col comment-value" style={ { whiteSpace: "pre-line" } }>{props.commentValue}</span>
            </div>
        </div>
    );
}

export default CommentView;