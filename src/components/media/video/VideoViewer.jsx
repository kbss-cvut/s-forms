import React, { useMemo, useRef, useState } from "react";
import "video.js/dist/video-js.css";

import { useVideoPlayer } from "./hooks/useVideoPlayer";
import { useMediaSurface } from "../hooks/useMediaSurface.js";
import AnnotationOverlay from "../annotation/AnnotationOverlay";

/**
 * Viewer for displaying video with annotations.
 */
const VideoViewer = ({
  type,
  src,
  autoplay = false,
  muted = true,
  controls = true,
  responsive = true,
  aspectRatio = "16:9",
  annotations = [],
  showAnnotations,
  onFullScreen,
}) => {
  const videoRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);

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

  const playerRef = useVideoPlayer({
    videoRef,
    options,
    onFullScreen,
    onTimeUpdate: setCurrentTime,
    annotations,
    showAnnotations,
  });

  const surface = useMediaSurface({
    type: "video",
    containerRef: playerRef,
  });

  return (
    <div className="video-wrapper" style={{ position: "relative" }}>
      <video ref={videoRef} className="video-js vjs-big-play-centered" />
      {surface && (
        <AnnotationOverlay
          annotations={annotations}
          showAnnotations={showAnnotations}
          surface={surface}
          currentTime={currentTime}
        />
      )}
    </div>
  );
};

export default VideoViewer;
