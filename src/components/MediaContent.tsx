import React from "react";
import Constants from "../constants/Constants";
import MediaAssetViewer from "./media/MediaAssetViewer";

interface Props {
  question: object;
}

const MediaContent = ({ question }: Props) => {
  const renderMedia = () => {
    // @ts-ignore
    const mediaContents = question[Constants.HAS_MEDIA_CONTENT];
    if (mediaContents) {
      if (Array.isArray(mediaContents)) {
        return (
          <div className="col-6 ">
            {mediaContents.map((media, index) => (
              <div
                key={index}
                className="embed-responsive-21by9 media-content-video-container mb-3"
              >
                <MediaAssetViewer
                  src={media[Constants.HAS_SOURCE]}
                  allowFullScreen
                  annotations={media[Constants.HAS_ANNOTATION]}
                />
              </div>
            ))}
          </div>
        );
      }
      return (
        <div className="col-6">
          <MediaAssetViewer
            src={mediaContents[Constants.HAS_SOURCE]}
            allowFullScreen
            annotations={mediaContents[Constants.HAS_ANNOTATION]}
          />
        </div>
      );
    }
    return null;
  };

  return renderMedia();
};

export default MediaContent;
