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

    const [showIRI, setShowIRI] = useState(false);

    const getAuthorLabel = () => {
        const users = options.users;
        const currentUser = users.find(c => c.id === options.currentUser);


        if (props.author) {
            if (currentUser.label) {
                return currentUser.label;
            } else {
                return getAuthorIRIAbbreviation();
            }
        }

        return UNKNOWN_AUTHOR;
    }

    const getAuthorIRIAbbreviation = () => {
        const fullAuthor = props.author[Constants.HAS_AUTHOR];

        return fullAuthor.replace(/.*[#\/]/, '... ');
    }

    const getAuthorIRI = () => {
        if (props.author) {
            return props.author[Constants.HAS_AUTHOR];
        }
        return UNKNOWN_AUTHOR;
    }

    const getTimeAgo = () => {
        return time.format(props.timestamp[Constants.HAS_TIMESTAMP]);
    }

    const onMouseEventHandler = () => {
        setShowIRI(!showIRI);
    }

    return (
        <div className="comment-content">
            <div className="row">
                <span className="col-auto comment-author" onMouseEnter={onMouseEventHandler} onMouseLeave={onMouseEventHandler}>
                    {showIRI ? getAuthorIRI() : getAuthorLabel()}
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