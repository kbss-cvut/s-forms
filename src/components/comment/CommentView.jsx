import React, {useState} from "react";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import Constants from "../../constants/Constants";

const UNKNOWN_AUTHOR = "Unknown author";

const CommentView = (props) => {
    TimeAgo.addLocale(en);
    const time = new TimeAgo('en-US');

    const [show, setShow] = useState(false);

    const parseJsonComment = (value, constant) => {
        const jsonComment = JSON.parse(JSON.stringify(value));
        return jsonComment[constant];
    }

    const getAuthor = () => {
        if (props.author) {
            return parseJsonComment(props.author, [Constants.HAS_AUTHOR]);
        } else return UNKNOWN_AUTHOR;
    }

    const getSplitAuthor = () => {
        let commentAuthor = {};
        if (props.author) {
            commentAuthor = parseJsonComment(props.author, [Constants.HAS_AUTHOR]);
            return "..." + commentAuthor.split('/people/').pop();
        } else return UNKNOWN_AUTHOR;
    }

    const getTimeAgo = () => {
        return time.format(parseJsonComment(props.timestamp, [Constants.HAS_TIMESTAMP]));
    }

    const onMouseEventHandler = () => {
        setShow(!show);
    }

    return (
        <div className="comment-content">
            <div className="row">
                <span className="col-auto comment-author" onMouseEnter={onMouseEventHandler} onMouseLeave={onMouseEventHandler}>
                    {show ? getAuthor() : getSplitAuthor()}
                </span>
                <span className="col-auto text-muted comment-timestamp">{getTimeAgo()}</span>
            </div>
            <div className="row">
                <span className="col comment-value">{parseJsonComment(props.commentValue, [Constants.HAS_COMMENT_VALUE])}</span>
            </div>
        </div>
    );
}

export default CommentView;