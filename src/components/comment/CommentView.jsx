import React, {useContext, useState} from "react";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import Constants from "../../constants/Constants";
import {ConfigurationContext} from "../../contexts/ConfigurationContext";

const UNKNOWN_AUTHOR = "Unknown author";

const CommentView = (props) => {
    const { options } = useContext(ConfigurationContext);

    TimeAgo.addLocale(en);
    const time = new TimeAgo('en-US');

    const [show, setShow] = useState(false);

    const getAuthor = () => {
        const users = options.users;
        const currentUser = options.currentUser;
        const currentUserId = users.find(c => c.id === currentUser);

        if (props.author && currentUserId.label) {
            return "... " + currentUserId.label;
        }

        if (props.author && !currentUserId.label || currentUserId.label === "") {
            return getShortenedAuthorIRI();
        }

        return UNKNOWN_AUTHOR;
    }

    const getShortenedAuthorIRI = () => {
        const fullAuthor = props.author[Constants.HAS_AUTHOR];

        if (fullAuthor.lastIndexOf("#") +1) {
            return "... " + fullAuthor.substring(fullAuthor.lastIndexOf("#") +1);
        }

        if (fullAuthor.lastIndexOf("/") +1) {
            return "... " + fullAuthor.substring(fullAuthor.lastIndexOf("/") +1);
        }

        return "Wrong IRI";
    }

    const getFullAuthor = () => {
        if (props.author) {
            return props.author[Constants.HAS_AUTHOR];
        }
        return UNKNOWN_AUTHOR;
    }

    const getTimeAgo = () => {
        return time.format(props.timestamp[Constants.HAS_TIMESTAMP]);
    }

    const onMouseEventHandler = () => {
        setShow(!show);
    }

    return (
        <div className="comment-content">
            <div className="row">
                <span className="col-auto comment-author" onMouseEnter={onMouseEventHandler} onMouseLeave={onMouseEventHandler}>
                    {show ? getFullAuthor() : getAuthor()}
                </span>
                <span className="col-auto text-muted comment-timestamp">{getTimeAgo()}</span>
            </div>
            <div className="row">
                <span className="col comment-value">{props.commentValue[Constants.HAS_COMMENT_VALUE]}</span>
            </div>
        </div>
    );
}

export default CommentView;