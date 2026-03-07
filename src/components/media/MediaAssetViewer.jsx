import React, { useRef } from "react";
import ViewerUtils from "../../util/MediaAssetViewerUtil.js";
import "../../styles/media.css";
import VideoViewer from "./video/VideoViewer.jsx";
import { useFullscreen } from "./hooks/useFullscreen.js";
import ImageViewer from "./image/ImageViewer.jsx";
import MediaFullScreenContainer from "./MediaFullScreenContainer.jsx";

const mediaRegistry = {
  video: VideoViewer,
  image: ImageViewer,
};

const IframeViewer = ({ src, allowFullScreen }) => (
  <iframe
    src={src}
    title="Embedded content"
    allowFullScreen={allowFullScreen}
    className="media-iframe"
  />
);

/**
 * Orchestrates the rendering of media assets based on their type and manages fullscreen state.
 * Defaults to an iframe viewer for unsupported types.
 */
const MediaAssetViewer = ({ src, annotations = [], allowFullScreen }) => {
  const containerRef = useRef(null);
  const { isFullscreen, toggle } = useFullscreen(containerRef);

  if (!src) return null;

  const { kind } = ViewerUtils.getMediaKindFromSource(src);
  const MediaComponent = mediaRegistry[kind] || IframeViewer;

  return (
    <MediaFullScreenContainer ref={containerRef} fullscreen={isFullscreen}>
      <MediaComponent
        src={src}
        annotations={annotations}
        allowFullScreen={allowFullScreen}
        onFullScreen={toggle}
      />
    </MediaFullScreenContainer>
  );
};

export default MediaAssetViewer;
