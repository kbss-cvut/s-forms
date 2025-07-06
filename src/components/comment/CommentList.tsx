import React, { useState, useRef, useEffect } from "react";
import CommentView from "./CommentView";
import Constants from "../../constants/Constants";
import { Rings } from "react-loader-spinner";
import * as JsonLdUtils from "jsonld-utils";

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
                commentValue={JsonLdUtils.getJsonAttValue(
                  comment,
                  Constants.HAS_COMMENT_VALUE
                )}
                author={
                  comment[Constants.HAS_AUTHOR]
                    ? comment[Constants.HAS_AUTHOR]
                    : null
                }
                timestamp={JsonLdUtils.getJsonAttValue(
                  comment,
                  Constants.HAS_TIMESTAMP
                )}
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
