import React from 'react';
import CommentView from './CommentView';
import PropTypes from 'prop-types';
import Constants from '../../constants/Constants';

const CommentList = (props) => {
  const addComments = () => {
    return props.comment.map((comment, index) => (
      <div key={index} className="comment-list-items">
        <CommentView
          commentValue={comment[Constants.HAS_COMMENT_VALUE]}
          author={comment[Constants.HAS_AUTHOR] ? comment[Constants.HAS_AUTHOR] : null}
          timestamp={comment[Constants.HAS_TIMESTAMP]}
        />
      </div>
    ));
  };

  const renderSortedComments = () => {
    return addComments()
      .sort((a, b) => {
        return new Date(a.HAS_TIMESTAMP).getTime() - new Date(b.HAS_TIMESTAMP).getTime();
      })
      .reverse();
  };

  return renderSortedComments();
};

CommentList.propTypes = {
  comment: PropTypes.array.isRequired
};

export default CommentList;
