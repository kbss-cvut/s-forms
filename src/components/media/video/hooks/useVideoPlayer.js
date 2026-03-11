import { useEffect, useRef } from "react";
import videojs from "video.js";
import enhancePlayer from "./enhancePlayer";
import Constants from "../../../../constants/Constants.js";

//Handles Video.js lifecycle.
export const useVideoPlayer = ({
  videoRef,
  options,
  onReady,
  onFullScreen,
  onTimeUpdate,
  showAnnotations,
  annotations = [],
}) => {
  const playerRef = useRef(null);

  useEffect(() => {
    const player = playerRef.current;
    if (!player || !showAnnotations) return;

    const firstAnnotation = annotations.reduce((earliest, current) => {
      const currentStartTime = current[Constants.ANNOTATION.HAS_START_TIME];
      if (
        currentStartTime != null &&
        (earliest == null || currentStartTime < earliest.startTime)
      ) {
        return { annotation: current, startTime: currentStartTime };
      }
      return earliest;
    }, null);

    if (firstAnnotation) {
      player.currentTime(firstAnnotation.startTime);
      player.pause();
    }
  }, [showAnnotations]);

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
