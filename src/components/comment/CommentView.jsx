import React, {useContext, useState} from "react";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import {ConfigurationContext} from "../../contexts/ConfigurationContext";
import LinkIcon from "../LinkIcon";
import IconOverlay from "../IconOverlay";
import PropTypes from "prop-types";
import RecycleBin from "../../styles/icons/RecycleBin";
import {motion} from 'framer-motion/dist/framer-motion';

const UNKNOWN_AUTHOR = "Unknown author";

const CommentView = (props) => {
    const { options } = useContext(ConfigurationContext);
    const [showIRI, setShowIRI] = useState(false);
    const [showRecycleBin, setShowRecycleBin] = useState(false);

    TimeAgo.addLocale(en);
    const time = new TimeAgo('en-US');

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
        const fullAuthor = props.author['@id'];

        return fullAuthor.replace(/.*[#\/]/, '... ');
    }

    const getAuthorIRI = () => {
        if (props.author) {
            return Object.values(props.author).toString();
        }
        return UNKNOWN_AUTHOR;
    }

    const renderAuthor = () => {
        return (
            <>
                {showIRI ?
                    <>
                        {getAuthorLabel()}
                        <LinkIcon iconClassContainer="emphasise-on-relevant-icon" url={getAuthorIRI()}/>
                    </>
                    : getAuthorLabel()
                }
            </>
        )
    };

    const renderTimeAgo = () => {
        const getTimeAgoFormat = () => {
            return time.format(parseInt(props.timestamp));
        }

        const getUTCFormat = () => {
            return new Date(parseInt(props.timestamp)).toUTCString();
        }

        return <IconOverlay id="exact-time-overlay" tooltipContent={getUTCFormat()}>
            {getTimeAgoFormat()}
        </IconOverlay>

    }

    const onMouseAuthorEventHandler = () => {
        setShowIRI(!showIRI);
    }

    const onMouseRecycleBinEventHandler = () => {
        setShowRecycleBin(!showRecycleBin)
    }

    const onClickDeleteCommentHandler = () => {
        props.onClickDeleteComment(props.index);
    }

    return (
        <div className="comment-content" onMouseEnter={onMouseRecycleBinEventHandler} onMouseLeave={onMouseRecycleBinEventHandler}>
            <div className="row">
                <div className="col-auto comment-author" onMouseEnter={onMouseAuthorEventHandler} onMouseLeave={onMouseAuthorEventHandler}>
                    {renderAuthor()}
                </div>
                <div className="col-auto text-muted comment-timestamp">{renderTimeAgo()}</div>
                {showRecycleBin ?
                    <motion.div
                        className="comment-delete emphasise-on-relevant-icon"
                        whileHover={{scale: 1.2}}
                        whileTap={{scale: 0.9}}
                        onClick={onClickDeleteCommentHandler}>
                        <RecycleBin/>
                    </motion.div>
                : null }
            </div>
            <div className="row">
                <div className="col comment-value">{props.commentValue}</div>
            </div>
        </div>
    );
};

CommentView.propTypes = {
    author: PropTypes.object.isRequired,
    timestamp: PropTypes.string.isRequired,
    commentValue: PropTypes.string.isRequired,
    onClickDeleteComment: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    comment: PropTypes.object.isRequired
};

export default CommentView;