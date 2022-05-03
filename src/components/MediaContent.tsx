import React from "react";
import Constants from "../constants/Constants";

interface Props {
  question: object;
}

const MediaContent = ({ question }: Props) => {
  const getEmbedLink = (mediaContentLink: string) => {
    if (mediaContentLink.includes("/view?")) {
      const view: string = mediaContentLink.substring(
        mediaContentLink.indexOf("/view?")
      );
      return mediaContentLink.replaceAll(view, "/preview");
    }
    return mediaContentLink;
  };

  const renderMedia = () => {
    const mediaContent = question[Constants.HAS_MEDIA_CONTENT];

    if (Array.isArray(mediaContent)) {
      return (
        <div className="col-6">
          {mediaContent.map((src: string, index: number) => (
            <div
              key={index}
              className="row embed-responsive-21by9 media-content-video-container mb-3"
            >
              <iframe
                src={getEmbedLink(mediaContent[index])}
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
          src={getEmbedLink(mediaContent)}
          className="embed-responsive-item"
          allowFullScreen
        />
      </div>
    );
  };

  return renderMedia();
};

export default MediaContent;
