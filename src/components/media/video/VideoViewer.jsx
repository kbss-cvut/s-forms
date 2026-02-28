import { useMemo, useRef, useState, useCallback } from "react";
import "video.js/dist/video-js.css";

import { useVideoPlayer } from "./hooks/useVideoPlayer";
import { useVideoSurface } from "./hooks/useVideoSurface";
import { useAnnotationsEngine } from "../annotation/engine/useAnnotationsEngine";
import AnnotationOverlay from "../annotation/AnnotationOverlay";

const VideoViewer = ({
  type,
  src,
  autoplay = false,
  muted = true,
  controls = true,
  responsive = true,
  aspectRatio = "16:9",
  annotations = [],
  onFullScreen,
  onTimeChange, // optional external observer
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

  const handleTimeUpdate = useCallback(
    (time) => {
      setCurrentTime(time);
      onTimeChange?.(time);
    },
    [onTimeChange]
  );

  const playerRef = useVideoPlayer({
    videoRef,
    options,
    onFullScreen,
    onTimeUpdate: handleTimeUpdate,
  });

  const surface = useVideoSurface(playerRef);

  const renderModels = useAnnotationsEngine({
    annotations,
    width: surface?.intrinsicWidth,
    height: surface?.intrinsicHeight,
    currentTime,
  });

  return (
    <div className="video-wrapper" style={{ position: "relative" }}>
      <video ref={videoRef} className="video-js vjs-big-play-centered" />
      {surface && (
        <AnnotationOverlay
          renderModels={renderModels}
          viewBoxWidth={surface.intrinsicWidth}
          viewBoxHeight={surface.intrinsicHeight}
        />
      )}
    </div>
  );
};

export default VideoViewer;
