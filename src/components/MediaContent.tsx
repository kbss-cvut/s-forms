import React from "react";
import Constants from "../constants/Constants";
import LinkIcon from "./LinkIcon";

interface Props {
  question: object;

  // Added only for example in story
  hardcodedLink?: string;
  iFrame?: boolean;
}

const YOUTUBE_URL = "https://www.youtube.com/";
const GOOGLE_DRIVE_URL = "https://drive.google.com/";

const MediaContent = ({ question, hardcodedLink, iFrame }: Props) => {
  const isGoogleDriveImage = (mediaContentUrl: string) => {
    return (
      mediaContentUrl.includes("/file/d/") &&
      mediaContentUrl.includes(GOOGLE_DRIVE_URL)
    );
  };

  const isYoutubeVideo = (mediaContentUrl: string) => {
    return (
      mediaContentUrl.includes("watch?v=") &&
      mediaContentUrl.includes(YOUTUBE_URL)
    );
  };

  const getMediaId = (mediaContentUrl: string) => {
    if (isGoogleDriveImage(mediaContentUrl)) {
      return mediaContentUrl.substring(
        mediaContentUrl.indexOf("/file/d/") + 8,
        mediaContentUrl.lastIndexOf("/")
      );
    }
    if (isYoutubeVideo(mediaContentUrl)) {
      return mediaContentUrl.substring(mediaContentUrl.indexOf("watch?v=") + 8);
    }
  };

  const getEmbedLink = (mediaContentUrl: string) => {
    if (isGoogleDriveImage(mediaContentUrl)) {
      return (
        GOOGLE_DRIVE_URL + "uc?export=view&id=" + getMediaId(mediaContentUrl)
      );
    }
    if (isYoutubeVideo(mediaContentUrl)) {
      return YOUTUBE_URL + "embed/" + getMediaId(mediaContentUrl);
    }
    return mediaContentUrl;
  };

  const getMediaType = (mediaContentUrl: string) => {
    if (mediaContentUrl.includes(YOUTUBE_URL)) {
      return <iframe src={getEmbedLink(mediaContentUrl)} allowFullScreen />;
    }
    return (
      <div className="media-content-image">
        <LinkIcon
          url={mediaContentUrl}
          iconClassContainer="media-content-link"
          showOverlay={false}
        />
        <img src={getEmbedLink(mediaContentUrl)} alt={mediaContentUrl} />
      </div>
    );
  };

  const renderMediaContent = () => {
    // @ts-ignore
    const mediaContent = question[Constants.HAS_MEDIA_CONTENT];

    if (mediaContent) {
      if (Array.isArray(mediaContent)) {
        return (
          <div className="media-content-items">
            {mediaContent.map((src: string, index: number) => (
              <div key={index} className="media-content-item">
                {getMediaType(mediaContent[index])}
              </div>
            ))}
          </div>
        );
      }
      return (
        <div className="media-content-item">{getMediaType(mediaContent)}</div>
      );
    }
    return null;
  };

  // Added only for example in story
  const isHardcoded = () => {
    return !!hardcodedLink;
  };

  // Added only for example in story
  const isIframe = () => {
    return iFrame;
  };

  // Added only for example in story
  return (
    <>
      {isHardcoded() && !isIframe() && (
        <img
          className="media-content"
          src={hardcodedLink}
          alt={hardcodedLink}
        />
      )}
      {isHardcoded() && isIframe() && (
        <iframe className="media-content" src={hardcodedLink} />
      )}
      {!isHardcoded() && (
        <div className="media-content">{renderMediaContent()}</div>
      )}
    </>
  );
};

export default MediaContent;
