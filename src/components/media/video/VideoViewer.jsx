import { useEffect, useMemo, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import enhancePlayer from "./enhancePlayer";
import { useObservedSize } from "../../../hooks/useObservedSize.jsx";

/**
 * VideoViewer
 *
 * Pure video renderer.
 *
 * Responsibilities:
 * - Initialize Video.js
 * - Report rendered size
 * - Notify parent about player readiness
 *
 * Does NOT:
 * - Manage fullscreen state
 * - Manage annotations
 * - Contain layout styling
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
  onFullScreen,
  onAssetChangesSize,
}) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const wrapperRef = useRef(null);

  const size = useObservedSize(wrapperRef);

  // Build options safely with correct deps
  const options = useMemo(() => {
    return {
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
    };
  }, [autoplay, muted, controls, responsive, aspectRatio, src, type]);

  // Initialize Video.js
  useEffect(() => {
    if (!videoRef.current) return;

    const player = videojs(videoRef.current, options, function () {
      enhancePlayer(player, { onFullScreen });
      onReady?.(player);
    });

    playerRef.current = player;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
      }
    };
  }, [options, onReady, onFullScreen]);

  // Report actual rendered size
  useEffect(() => {
    if (size) {
      onAssetChangesSize?.(size);
    }
  }, [size, onAssetChangesSize]);

  return (
    <div ref={wrapperRef} className="video-wrapper">
      <video ref={videoRef} className="video-js vjs-big-play-centered" />
    </div>
  );
};

export default VideoViewer;
