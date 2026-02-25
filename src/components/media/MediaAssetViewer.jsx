import { useMemo, useRef, useState } from "react";
import ViewerUtils from "../../util/MediaAssetViewerUtil.js";
import "../../styles/media.css";

import MediaContainer from "./MediaContainer.jsx";
import VideoViewer from "./video/VideoViewer.jsx";
import AnnotationOverlay from "./annotation/AnnotationOverlay.jsx";

import { useAnnotationsEngine } from "./annotation/engine/useAnnotationsEngine.js";
import { useFullscreen } from "./hooks/useFullscreen.js";
import ImageViewer from "./image/ImageViewer.jsx";

const MediaAssetViewer = ({ src, annotations = [], allowFullScreen }) => {
  const containerRef = useRef(null);
  const playerRef = useRef(null);

  const { isFullscreen, toggle } = useFullscreen(containerRef);

  const [time, setTime] = useState(0);
  const [assetSize, setAssetSize] = useState(null);

  if (!src) return null;

  // ---------------------------
  // Detect media type
  // ---------------------------
  const mediaInfo = useMemo(
    () => ViewerUtils.getMediaKindFromSource(src),
    [src]
  );

  // ---------------------------
  // Annotation engine
  // ---------------------------
  const renderModels = useAnnotationsEngine({
    annotations,
    width: assetSize?.width,
    height: assetSize?.height,
    currentTime: time,
  });

  // ---------------------------
  // Media element
  // ---------------------------
  const mediaElement = useMemo(() => {
    switch (mediaInfo.kind) {
      case "video":
        return (
          <VideoViewer
            type={mediaInfo.type}
            src={src}
            onReady={(player) => {
              playerRef.current = player;
              player.on("timeupdate", () => setTime(player.currentTime()));
            }}
            onFullScreen={toggle}
            onAssetChangesSize={setAssetSize}
          />
        );

      case "image":
        return (
          <ImageViewer
            src={src}
            annotations={annotations}
            onAssetChangesSize={setAssetSize}
          />
        );

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
  }, [mediaInfo.kind, mediaInfo.type, src, allowFullScreen, toggle]);

  return (
    <>
      <MediaContainer
        ref={containerRef}
        fullscreen={isFullscreen}
        onResize={setAssetSize}
        overlay={
          mediaInfo.kind !== "iframe" &&
          renderModels.length > 0 && (
            <AnnotationOverlay renderModels={renderModels} />
          )
        }
      >
        {mediaElement}
      </MediaContainer>
    </>
  );
};

export default MediaAssetViewer;
