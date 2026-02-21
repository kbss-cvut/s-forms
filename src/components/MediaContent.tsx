import React from "react";
import Constants from "../constants/Constants";
import MediaAssetViewer from "./media/MediaAssetViewer";
import MediaAssetViewerUtil from "../util/MediaAssetViewerUtil";

interface Props {
  question: object;
}

const MediaContent = ({ question }: Props) => {
  const renderMedia = () => {
    const normalizedQuestion =
      MediaAssetViewerUtil.stripExpandedLiterals(question);
    const mediaContents =
      // @ts-ignore
      normalizedQuestion[Constants.HAS_MEDIA_CONTENT];
    if (mediaContents) {
      if (Array.isArray(mediaContents)) {
        return (
          <div className="col-6 ">
            {mediaContents.map((media, index) => {
              return (
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
              );
            })}
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
