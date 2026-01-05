import { useEffect, useMemo, useRef, useState } from "react";
import VideoJS from "./video/VideoJS";
import ViewerUtils from "../../util/MediaAssetViewerUtil.js";
import AnnotationRenderer from "./annotation/AnnotationRenderer.jsx";
import ImageViewer from "./image/ImageViewer.jsx";

/**
 * Media rendering component that displays video, image, or embedded
 * content.
 *
 * The component is responsible for:
 * - Detecting media type from the source URL
 * - Managing fullscreen state and container sizing
 * - Synchronizing playback time with annotation rendering
 * - Delegating rendering to specialized viewer components
 *
 * @component
 *
 * @param {Object} props
 * @param {string} props.src - Source URL of the media asset.
 * @param {Array<Object>} [props.annotations] - Optional list of annotations associated with the media.
 * @param {boolean} [props.allowFullScreen] - Whether fullscreen is allowed for embedded content.
 *
 * @returns {JSX.Element} Media viewer with optional annotation overlay.
 *
 * @remarks
 * - Uses ResizeObserver to keep annotation overlay aligned with media dimensions
 * - Video playback time is tracked and propagated to AnnotationRenderer
 * - Annotation rendering is skipped for iframe-based media
 */
const MediaAssetViewer = (props) => {
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const [myTime, setMyTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [containerSize, setContainerSize] = useState(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const updateSize = () => {
      const el = containerRef.current;
      setContainerSize({
        width: el.clientWidth,
        height: el.clientHeight,
      });
    };

    updateSize(); // initial measurement

    const ro = new ResizeObserver(updateSize);
    ro.observe(containerRef.current);

    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const handler = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", handler);
    // exit full screen event

    return () => {
      document.removeEventListener("fullscreenchange", handler);
    };
  }, []);

  const mediaInfo = useMemo(
    () => ViewerUtils.getMediaKindFromSource(props.src),
    [props.src]
  );

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
      containerRef.current.exitFullscreen();
    }
  };

  const handlePlayerReady = (player) => {
    playerRef.current = player;
    player.on("timeupdate", () => {
      setMyTime(player.currentTime());
    });
  };

  const mediaElement = useMemo(() => {
    switch (mediaInfo.kind) {
      case "video":
        return (
          <VideoJS
            type={mediaInfo.type}
            src={props.src}
            onReady={handlePlayerReady}
            onFullScreen={toggleFullscreen}
          />
        );
      case "image":
        return (
          <ImageViewer src={props.src} annotations={props?.annotations ?? []} />
        );

      default:
        return (
          <iframe
            src={props.src}
            title="Embedded content"
            style={{ width: "100%", height: "100%", border: 0 }}
            allowFullScreen={props.allowFullScreen}
          />
        );
    }
  }, [
    mediaInfo.kind,
    handlePlayerReady,
    toggleFullscreen,
    props.src,
    props.allowFullScreen,
  ]);
  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        maxWidth: isFullscreen ? "100%" : 640,
        maxHeight: isFullscreen ? "100%" : 640,
        background: "black",
      }}
    >
      {mediaElement}
      {mediaInfo.kind !== "iframe" && containerSize && (
        <AnnotationRenderer
          mediaAssetViewportWidth={containerSize.width}
          mediaAssetViewportHeight={containerSize.height}
          annotations={props?.annotations ?? []}
          playerCurrentTime={myTime}
        />
      )}
    </div>
  );
};
export default MediaAssetViewer;
