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
import { useIntl } from "react-intl";

const CommentView = (props) => {
  const { options } = useContext(ConfigurationContext);
  const [showIRI, setShowIRI] = useState(false);
  const [showRecycleBin, setShowRecycleBin] = useState(false);
  const intl = useIntl();

  TimeAgo.addLocale(cs);
  TimeAgo.addLocale(en);
  TimeAgo.setDefaultLocale(Constants.LANG.en.locale);

  const time = new TimeAgo(intl.locale);

  const getAuthorLabel = () => {
    if (options && options.users && props.author) {
      const users = options.users;
      const author = users.find((u) => u.id === props.author["@id"]);

      if (author && author.label) {
        return author.label;
      }
    }
    return intl.formatMessage({
      id: "comment.unknownAuthor",
    });
  };

  const getAuthorIRIAbbreviation = () => {
    const fullAuthor = props.author["@id"];
    return fullAuthor.replace(/.*[#\/]/, "... ");
  };

  const getAuthorIRI = () => {
    if (props.author) {
      return Object.values(props.author).toString();
    }
    return intl.formatMessage({
      id: "comment.unknownAuthor",
    });
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
    const numericTimestamp = Number(props.timestamp);
    const parsedDate = isNaN(numericTimestamp)
      ? new Date(props.timestamp)
      : new Date(numericTimestamp);

    const getTimeAgoFormat = () => {
      return time.format(parsedDate);
    };

    const getUTCFormat = () => {
      return new Intl.DateTimeFormat(intl.locale, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      }).format(new Date(parsedDate));
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
  author: PropTypes.object,
  timestamp: PropTypes.string.isRequired,
  commentValue: PropTypes.string.isRequired,
  onDeleteQuestionComment: PropTypes.func.isRequired,
  onDeleteViewComment: PropTypes.func,
  index: PropTypes.number.isRequired,
};

export default CommentView;
