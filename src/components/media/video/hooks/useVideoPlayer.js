import { useEffect, useRef } from "react";
import videojs from "video.js";
import enhancePlayer from "./enhancePlayer";

//Handles Video.js lifecycle.
export const useVideoPlayer = ({
  videoRef,
  options,
  onReady,
  onFullScreen,
  onTimeUpdate,
}) => {
  const playerRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current) return;

    const player = videojs(videoRef.current, options, function () {
      enhancePlayer(player, { onFullScreen });
      onReady?.(player);
    });

    playerRef.current = player;

    if (onTimeUpdate) {
      player.on("timeupdate", () => onTimeUpdate(player.currentTime()));
    }

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
      }
    };
  }, [videoRef, options, onReady, onFullScreen, onTimeUpdate]);

  return playerRef;
};
