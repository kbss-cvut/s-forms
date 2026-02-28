import { useMemo, useRef } from "react";
import ViewerUtils from "../../util/MediaAssetViewerUtil.js";
import "../../styles/media.css";
import VideoViewer from "./video/VideoViewer.jsx";
import { useFullscreen } from "./hooks/useFullscreen.js";
import ImageViewer from "./image/ImageViewer.jsx";
import MediaContainer from "./MediaContainer.jsx";

const MediaAssetViewer = ({ src, annotations = [], allowFullScreen }) => {
  const containerRef = useRef(null);

  const { isFullscreen, toggle } = useFullscreen(containerRef);

  if (!src) return null;

  const mediaInfo = useMemo(
    () => ViewerUtils.getMediaKindFromSource(src),
    [src]
  );

  const mediaElement = useMemo(() => {
    switch (mediaInfo.kind) {
      case "video":
        return (
          <VideoViewer
            annotations={annotations}
            src={src}
            onFullScreen={toggle}
          />
        );

      case "image":
        return <ImageViewer src={src} annotations={annotations} />;

      default:
        return (
          <iframe
            src={src}
            title="Embedded content"
            allowFullScreen={allowFullScreen}
            className="media-iframe"
          />
        );
    }
  }, [
    mediaInfo.kind,
    mediaInfo.type,
    src,
    annotations,
    allowFullScreen,
    toggle,
  ]);

  return (
    <MediaContainer ref={containerRef} fullscreen={isFullscreen}>
      {mediaElement}
    </MediaContainer>
  );
};

export default MediaAssetViewer;
