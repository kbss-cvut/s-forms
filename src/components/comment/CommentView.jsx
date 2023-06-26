import React, { useContext, useState } from "react";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import cs from "javascript-time-ago/locale/cs";
import { ConfigurationContext } from "../../contexts/ConfigurationContext";
import LinkIcon from "../LinkIcon";
import IconOverlay from "../IconOverlay";
import PropTypes from "prop-types";
import RecycleBin from "../../styles/icons/RecycleBin";
import { motion } from "framer-motion";
import Constants from "../../constants/Constants";

const UNKNOWN_AUTHOR = "Unknown author";

const CommentView = (props) => {
  const { options } = useContext(ConfigurationContext);
  const [showIRI, setShowIRI] = useState(false);
  const [showRecycleBin, setShowRecycleBin] = useState(false);

  TimeAgo.addLocale(cs);
  TimeAgo.addLocale(en);
  TimeAgo.setDefaultLocale(Constants.LANG.en.locale);

  const time = new TimeAgo(options.intl.locale);

  const getAuthorLabel = () => {
    if (options && options.users) {
      const users = options.users;
      const currentUser = users.find((c) => c.id === options.currentUser);

      if (props.author) {
        if (currentUser.label) {
          return currentUser.label;
        } else {
          return getAuthorIRIAbbreviation();
        }
      }
    }

    return UNKNOWN_AUTHOR;
  };

  const getAuthorIRIAbbreviation = () => {
    const fullAuthor = props.author["@id"];

    return fullAuthor.replace(/.*[#\/]/, "... ");
  };

  const getAuthorIRI = () => {
    if (props.author) {
      return Object.values(props.author).toString();
    }
    return UNKNOWN_AUTHOR;
  };

  const renderAuthor = () => {
    return (
      <React.Fragment>
        {showIRI ? (
          <React.Fragment>
            {getAuthorLabel()}
            <LinkIcon
              iconClassContainer="emphasise-on-relevant-icon"
              url={getAuthorIRI()}
            />
          </React.Fragment>
        ) : (
          getAuthorLabel()
        )}
      </React.Fragment>
    );
  };

  const renderTimeAgo = () => {
    const getTimeAgoFormat = () => {
      return time.format(parseInt(props.timestamp));
    };

    const getUTCFormat = () => {
      let dateOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      };
      const date = new Date(parseInt(props.timestamp));
      return new Intl.DateTimeFormat(options.intl.locale, dateOptions).format(
        date
      );
    };

    return (
      <IconOverlay id="exact-time-overlay" tooltipContent={getUTCFormat()}>
        {getTimeAgoFormat()}
      </IconOverlay>
    );
  };

  const handleCommentAuthorMouseEnter = () => {
    setShowIRI(!showIRI);
  };

  const handleCommentBinMouseEnter = () => {
    setShowRecycleBin(true);
  };

  const handleCommentBinMouseLeave = () => {
    setShowRecycleBin(false);
  };

  const handleDeleteCommentClick = () => {
    props.onDeleteQuestionComment(props.index);
    props.onDeleteViewComment();
  };

  return (
    <div
      className="comment-content"
      onMouseEnter={handleCommentBinMouseEnter}
      onMouseLeave={handleCommentBinMouseLeave}
    >
      <div className="row">
        <div
          className="col-auto comment-author"
          onMouseEnter={handleCommentAuthorMouseEnter}
          onMouseLeave={handleCommentAuthorMouseEnter}
        >
          {renderAuthor()}
        </div>
        <div className="col-auto text-muted comment-timestamp">
          {renderTimeAgo()}
        </div>
        {showRecycleBin ? (
          <motion.div
            className="comment-delete emphasise-on-relevant-icon"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleDeleteCommentClick}
          >
            <RecycleBin />
          </motion.div>
        ) : null}
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
  onDeleteQuestionComment: PropTypes.func.isRequired,
  onDeleteViewComment: PropTypes.func,
  index: PropTypes.number.isRequired,
};

export default CommentView;
