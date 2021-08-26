import React from "react";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";

const CommentView = (props) => {
    TimeAgo.addDefaultLocale(en);
    const time = new TimeAgo('en-US');
    const timeAgo = time.format(props.timestamp)

    return (
        <div className="comment-content">
            <div className="row">
                <span className="col-md-auto comment-author">{props.author}</span>
                <span className="text-muted col-sm-auto timestamp">{timeAgo}</span>
            </div>
            <div className="row">
                <span className="comment-value col">{props.commentValue}</span>
            </div>
        </div>
    );
}

export default CommentView;