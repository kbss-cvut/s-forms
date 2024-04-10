import React from "react";
import Vocabulary from "../constants/Vocabulary";

interface Props {
  question: object;
}

const MediaContent = ({ question }: Props) => {
  const renderMedia = () => {
    // @ts-ignore
    const mediaContent = question[Vocabulary.HAS_MEDIA_CONTENT];

    if (mediaContent) {
      if (Array.isArray(mediaContent)) {
        return (
          <div className="col-6">
            {mediaContent.map((src: string, index: number) => (
              <div
                key={index}
                className="row embed-responsive-21by9 media-content-video-container mb-3"
              >
                <iframe
                  src={mediaContent[index]}
                  className="embed-responsive-item"
                  allowFullScreen
                />
              </div>
            ))}
          </div>
        );
      }
      return (
        <div className="col-6">
          <iframe
            src={mediaContent}
            className="embed-responsive-item"
            allowFullScreen
          />
        </div>
      );
    }
    return null;
  };

  return renderMedia();
};

export default MediaContent;
