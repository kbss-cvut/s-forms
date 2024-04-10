import React, { useState, useRef, useEffect } from "react";
import CommentView from "./CommentView";
import Vocabulary from "../../constants/Vocabulary";
import { Rings } from "react-loader-spinner";

interface Props {
  comments: Array<any>;
  onDeleteCommentClick: (index: number) => void;
}

const CommentList = ({ comments, onDeleteCommentClick }: Props) => {
  const commentEndRef = useRef<null | HTMLDivElement>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const handleDeleteViewComment = () => {
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
                commentValue={comment[Vocabulary.HAS_COMMENT_VALUE]}
                author={
                  comment[Vocabulary.HAS_AUTHOR]
                    ? comment[Vocabulary.HAS_AUTHOR]
                    : null
                }
                timestamp={comment[Vocabulary.HAS_TIMESTAMP]}
                onDeleteQuestionComment={onDeleteCommentClick}
                onDeleteViewComment={handleDeleteViewComment}
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
