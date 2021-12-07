import React, {useContext, useState} from "react";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import {ConfigurationContext} from "../../contexts/ConfigurationContext";
import LinkIcon from "../LinkIcon";
import IconOverlay from "../IconOverlay";
import PropTypes from "prop-types";

const UNKNOWN_AUTHOR = "Unknown author";

const CommentView = (props) => {
    const { options } = useContext(ConfigurationContext);
    const [showIRI, setShowIRI] = useState(false);

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
        const fullAuthor = props.author;

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

    return (
        <div className="comment-content">
            <div className="row">
                <span className="col-auto comment-author" onMouseEnter={onMouseAuthorEventHandler} onMouseLeave={onMouseAuthorEventHandler}>
                    {renderAuthor()}
                </span>
                <span className="col-auto text-muted comment-timestamp">{renderTimeAgo()}</span>
            </div>
            <div className="row">
                <span className="col comment-value">{props.commentValue}</span>
            </div>
        </div>
    );
};

CommentView.propTypes = {
    author: PropTypes.object.isRequired,
    timestamp: PropTypes.string.isRequired,
    commentValue: PropTypes.string.isRequired
};

export default CommentView;