import React, { useEffect, useRef, useState } from "react";
import ViewerUtils from "../../util/MediaAssetViewerUtils.js";
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
  <div className="media-iframe-container">
    <div className="media-iframe-wrapper">
      <iframe
        src={src}
        title="Embedded content"
        allowFullScreen={allowFullScreen}
      />
    </div>
  </div>
);
/**
 * Orchestrates the rendering of media assets based on their type and manages fullscreen state.
 * Defaults to an iframe viewer for unsupported types.
 */
const MediaAssetViewer = ({
  src,
  mediaId,
  annotations = [],
  allowFullScreen,
  showAnnotations = true,
}) => {
  const containerRef = useRef(null);
  const { isFullscreen, toggle } = useFullscreen(containerRef);

  // Resolve synchronously from the URL/`@id` hints; fall back to an async probe
  // only when those are inconclusive (e.g. an extension-less, hint-less URL).
  const [resolved, setResolved] = useState(() => {
    const known = ViewerUtils.getMediaKind(src, mediaId);
    return known && known.kind !== "iframe" ? known : null;
  });

  useEffect(() => {
    let cancelled = false;
    const known = ViewerUtils.getMediaKind(src, mediaId);
    if (known && known.kind !== "iframe") {
      setResolved(known);
      return;
    }
    setResolved(null);
    ViewerUtils.resolveMediaKind(src, mediaId).then((res) => {
      if (!cancelled) setResolved(res ?? { kind: "iframe", type: null });
    });
    return () => {
      cancelled = true;
    };
  }, [src, mediaId]);

  if (!src) return null;

  const MediaComponent = resolved
    ? mediaRegistry[resolved.kind] || IframeViewer
    : null;

  return (
    <MediaFullScreenContainer ref={containerRef} fullscreen={isFullscreen}>
      {MediaComponent && (
        <MediaComponent
          src={src}
          type={resolved.type}
          annotations={annotations}
          allowFullScreen={allowFullScreen}
          onFullScreen={toggle}
          showAnnotations={showAnnotations}
        />
      )}
    </MediaFullScreenContainer>
  );
};

export default MediaAssetViewer;
