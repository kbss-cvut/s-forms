import { useEffect, useMemo, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import enhancePlayer from "./enhancePlayer";

/**
 * VideoJS
 *
 * React wrapper component for initializing and managing a Video.js player
 * instance.
 *
 * @component
 *
 * @param {Object} props
 * @param {string} props.type - MIME type of the video source (e.g. "application/x-mpegURL").
 * @param {string} props.src - Source URL of the video stream.
 * @param {boolean} [props.autoplay=false] - Whether playback should start automatically.
 * @param {boolean} [props.muted=true] - Whether the video should start muted.
 * @param {boolean} [props.controls=true] - Whether player controls should be visible.
 * @param {boolean} [props.allowFullScreen=false] - Enables custom fullscreen handling.
 * @param {boolean} [props.responsive=true] - Enables responsive resizing.
 * @param {string} [props.aspectRatio="16:9"] - Aspect ratio used for fluid layout.
 * @param {Function} [props.onReady] - Callback invoked when the player is ready.
 * @param {Function} [props.onFullScreen] - Optional callback for custom fullscreen handling.
 *
 * @returns {JSX.Element} Video.js player container.
 *
 * @see https://videojs.org/guides/react/
 */
const VideoJS = ({
  type,
  src,
  autoplay,
  muted,
  controls,
  allowFullScreen,
  responsive,
  aspectRatio,
  onReady,
  onFullScreen,
}) => {
  const videoContainerRef = useRef(null);
  const playerRef = useRef(null);

  const options = useMemo(
    () => ({
      autoplay: autoplay ?? false,
      muted: muted ?? true,
      controls: controls ?? true,
      responsive: responsive ?? true,
      allowFullScreen: allowFullScreen ?? false,
      fluid: true,
      aspectRatio: aspectRatio ?? "16:9",
      controlBar: {
        fullscreenToggle: false,
        pictureInPictureToggle: false,
      },
      userActions: {
        doubleClick: false,
      },
      sources: [{ src, type }],
    }),
    []
  );

  useEffect(() => {
    if (!playerRef.current) {
      const videoElement = document.createElement("video-js");
      videoElement.classList.add("vjs-big-play-centered");
      if (videoContainerRef.current) {
        videoContainerRef.current.appendChild(videoElement);
      }
      const player = (playerRef.current = videojs(videoElement, options, () => {
        videojs.log("player is ready");
        enhancePlayer(player, { onFullScreen });
        if (onReady) {
          onReady(player);
        }
      }));
    } else {
      const player = playerRef.current;
      player.autoplay(options.autoplay);
      player.src(options.sources);
    }
  }, [options]);

  useEffect(() => {
    const player = playerRef.current;
    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  return (
    <div className="video-player" data-vjs-player>
      <div ref={videoContainerRef} />
    </div>
  );
};

export default VideoJS;
