import React, { useContext } from "react";
import Constants from "../constants/Constants";
import LinkIcon from "./LinkIcon";
// @ts-ignore
import ImageZoom from "react-image-zooom";
import { ConfigurationContext } from "../contexts/ConfigurationContext";

interface Props {
  question: object;
}

const YOUTUBE_URL = "https://www.youtube.com/";
const YOUTUBE_WATCH_URL_PARAMETER = "watch?v=";
const GOOGLE_DRIVE_URL = "https://drive.google.com/";
const EMBED_URL_PARAMETER = "embed/";
const GOOGLE_DRIVE_FILE_PATH = "/file/d/";
const GOOGLE_DRIVE = "uc?export=view&id=";

const MediaContent = ({ question }: Props) => {
  // @ts-ignore
  const { options } = useContext(ConfigurationContext);

  const isGoogleDriveImage = (mediaContentUrl: string) => {
    return (
      mediaContentUrl.includes(GOOGLE_DRIVE_FILE_PATH) &&
      mediaContentUrl.includes(GOOGLE_DRIVE_URL)
    );
  };

  const isYoutubeVideo = (mediaContentUrl: string) => {
    return (
      mediaContentUrl.includes(YOUTUBE_URL) &&
      (mediaContentUrl.includes(YOUTUBE_WATCH_URL_PARAMETER) ||
        mediaContentUrl.includes(EMBED_URL_PARAMETER))
    );
  };

  const getMediaId = (mediaContentUrl: string) => {
    if (isGoogleDriveImage(mediaContentUrl)) {
      return mediaContentUrl.substring(
        mediaContentUrl.indexOf(GOOGLE_DRIVE_FILE_PATH) +
          GOOGLE_DRIVE_FILE_PATH.length,
        mediaContentUrl.lastIndexOf("/")
      );
    }
    if (isYoutubeVideo(mediaContentUrl)) {
      return mediaContentUrl.substring(
        mediaContentUrl.indexOf(YOUTUBE_WATCH_URL_PARAMETER) +
          YOUTUBE_WATCH_URL_PARAMETER.length
      );
    }
  };

  const getEmbedLink = (mediaContentUrl: string) => {
    if (isGoogleDriveImage(mediaContentUrl)) {
      return GOOGLE_DRIVE_URL + GOOGLE_DRIVE + getMediaId(mediaContentUrl);
    }
    if (
      isYoutubeVideo(mediaContentUrl) &&
      !mediaContentUrl.includes(EMBED_URL_PARAMETER)
    ) {
      return YOUTUBE_URL + EMBED_URL_PARAMETER + getMediaId(mediaContentUrl);
    }
    return mediaContentUrl;
  };

  const getMediaType = (mediaContentUrl: string) => {
    if (
      isYoutubeVideo(mediaContentUrl) ||
      (isGoogleDriveImage(mediaContentUrl) && options.unifyMediaContent)
    ) {
      return (
        <div className="media-content-image">
          <LinkIcon
            url={mediaContentUrl}
            iconClassContainer="media-content-link"
            showOverlay={false}
          />
          <iframe src={getEmbedLink(mediaContentUrl)} allowFullScreen />
        </div>
      );
    }
    return (
      <div className="media-content-image">
        <LinkIcon
          url={mediaContentUrl}
          iconClassContainer="media-content-link"
          showOverlay={false}
        />
        <ImageZoom
          className="media-content-item-image"
          src={getEmbedLink(mediaContentUrl)}
          alt={mediaContentUrl}
          width="100%"
          height="100%"
        />
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

  return <div className="media-content">{renderMediaContent()}</div>;
};

export default MediaContent;
