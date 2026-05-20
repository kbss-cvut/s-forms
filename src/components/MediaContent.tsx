import React from "react";
import Constants from "../constants/Constants";
import MediaAssetViewer from "./media/MediaAssetViewer";
import MediaAssetViewerUtils from "../util/MediaAssetViewerUtils";

interface Props {
  question: object;
  displayAnnotations?: boolean;
}

const MediaContent = ({ question, displayAnnotations }: Props) => {
  const normalizedQuestion =
    MediaAssetViewerUtils.stripExpandedLiterals(question);
  const mediaContents = MediaAssetViewerUtils.normalizeMediaContents(
    normalizedQuestion[Constants.HAS_MEDIA_CONTENT],
    Constants.HAS_SOURCE
  );
  if (mediaContents.length > 0) {
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
              annotations={media[Constants.HAS_ANNOTATION] ?? []}
              showAnnotations={displayAnnotations}
            />
          </div>
        ))}
      </div>
    );
  }
  return <></>;
};

export default MediaContent;
