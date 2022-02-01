import React, { useState, useRef, useEffect } from 'react';
import CommentView from './CommentView';
import Constants from '../../constants/Constants';
import { Rings } from 'react-loader-spinner';

interface Props {
    comments: Array<any>,
    deleteQuestionComment: () => void;
}

const CommentList = ({comments, deleteQuestionComment}: Props) => {
  const commentEndRef = useRef(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const deleteCommentViewHandler = () => {
    setIsDeleting(true);
    setTimeout(() => {
      setIsDeleting(false);
    }, 2000);
  };

  useEffect(() => {
    if (commentEndRef.current === null) {
      return;
    }
    commentEndRef.current.scrollTop = commentEndRef.current.scrollHeight;
  }, [JSON.stringify(comments)]);

  return (
    <span>
      {isDeleting ? (
        <div className="comment-delete">
          <Rings color="#00BFFF" height={80} width={80} />
          <p>Deleting comment...</p>
        </div>
      ) : (
        <div className="comment-list-items" ref={commentEndRef}>
          {comments.map((comment, index) => (
            <div key={index} className="comment-list-item">
              <CommentView
                commentValue={comment[Constants.HAS_COMMENT_VALUE]}
                author={comment[Constants.HAS_AUTHOR] ? comment[Constants.HAS_AUTHOR] : null}
                timestamp={comment[Constants.HAS_TIMESTAMP]}
                deleteQuestionComment={deleteQuestionComment}
                deleteCommentView={deleteCommentViewHandler}
                index={index}
              />
            </div>
          ))}
        </div>
      )}
    </span>
  );
};

export default CommentList;