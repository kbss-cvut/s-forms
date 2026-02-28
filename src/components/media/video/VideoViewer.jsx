import { useEffect, useMemo, useRef, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import enhancePlayer from "./enhancePlayer";
import { useAnnotationsEngine } from "../annotation/engine/useAnnotationsEngine.js";
import AnnotationOverlay from "../annotation/AnnotationOverlay.jsx";

/**
 * VideoViewer
 *
 * Stable annotation layer implementation.
 * Overlay is attached to .video-js root and aligned
 * using intrinsic video geometry (no DOM hacks).
 */
const VideoViewer = ({
  type,
  src,
  autoplay = false,
  muted = true,
  controls = true,
  responsive = true,
  aspectRatio = "16:9",
  onReady,
  annotations = [],
  onFullScreen,
}) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  const [videoSurface, setVideoSurface] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);

  // ---------------------------------------------------
  // Video.js options
  // ---------------------------------------------------
  const options = useMemo(
    () => ({
      autoplay,
      muted,
      controls,
      responsive,
      aspectRatio,
      controlBar: {
        fullscreenToggle: false,
        pictureInPictureToggle: false,
      },
      userActions: {
        doubleClick: false,
      },
      sources: [{ src, type }],
    }),
    [autoplay, muted, controls, responsive, aspectRatio, src, type]
  );

  // ---------------------------------------------------
  // Compute actual rendered video surface
  // ---------------------------------------------------
  const computeVideoSurface = () => {
    const player = playerRef.current;
    if (!player) return;

    const videoWidth = player.videoWidth();
    const videoHeight = player.videoHeight();

    if (!videoWidth || !videoHeight) return;

    const container = player.el();

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    const videoRatio = videoWidth / videoHeight;
    const containerRatio = containerWidth / containerHeight;

    let width, height, top, left;

    if (containerRatio > videoRatio) {
      // Pillarbox (vertical video)
      height = containerHeight;
      width = height * videoRatio;
      left = (containerWidth - width) / 2;
      top = 0;
    } else {
      // Letterbox (horizontal video)
      width = containerWidth;
      height = width / videoRatio;
      top = (containerHeight - height) / 2;
      left = 0;
    }

    setVideoSurface({
      width,
      height,
      top,
      left,
      intrinsicWidth: videoWidth,
      intrinsicHeight: videoHeight,
    });
  };

  // ---------------------------------------------------
  // Initialize Video.js
  // ---------------------------------------------------
  useEffect(() => {
    if (!videoRef.current) return;

    const player = videojs(videoRef.current, options, function () {
      enhancePlayer(player, { onFullScreen });
      onReady?.(player);
    });

    playerRef.current = player;

    player.on("loadedmetadata", computeVideoSurface);
    player.on("resize", computeVideoSurface);
    player.on("fullscreenchange", computeVideoSurface);
    player.on("timeupdate", () => setCurrentTime(player.currentTime()));

    window.addEventListener("resize", computeVideoSurface);

    return () => {
      window.removeEventListener("resize", computeVideoSurface);
      if (!player.isDisposed()) {
        player.dispose();
      }
    };
  }, [options]);

  // ---------------------------------------------------
  // Annotation engine uses intrinsic video resolution
  // ---------------------------------------------------
  const renderModels = useAnnotationsEngine({
    annotations,
    width: videoSurface?.intrinsicWidth,
    height: videoSurface?.intrinsicHeight,
    currentTime,
  });

  // ---------------------------------------------------
  // Render
  // ---------------------------------------------------
  return (
    <div className="video-wrapper" style={{ position: "relative" }}>
      <video ref={videoRef} className="video-js vjs-big-play-centered" />

      {videoSurface && (
        <div
          style={{
            position: "absolute",
            left: videoSurface.left,
            top: videoSurface.top,
            width: videoSurface.width,
            height: videoSurface.height,
            pointerEvents: "none",
          }}
        >
          <AnnotationOverlay
            renderModels={renderModels}
            viewBoxWidth={videoSurface.intrinsicWidth}
            viewBoxHeight={videoSurface.intrinsicHeight}
          />
        </div>
      )}
    </div>
  );
};

export default VideoViewer;
