import { useEffect, useState } from "react";

/**
 * Computes real rendered video surface inside container.
 */
export const useVideoSurface = (playerRef) => {
  const [surface, setSurface] = useState(null);

  // Function to calculate and set the dimensions and position of the video surface
  // relative to its container, ensuring proper aspect ratio and centering.
  const computeSurface = () => {
    const player = playerRef.current;
    if (!player) return;

    // Get the intrinsic dimensions of the video
    const videoWidth = player.videoWidth();
    const videoHeight = player.videoHeight();
    if (!videoWidth || !videoHeight) return;

    // Get the dimensions of the container element
    const container = player.el();
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const videoRatio = videoWidth / videoHeight;
    const containerRatio = containerWidth / containerHeight;

    let width, height, top, left;

    // Adjust dimensions and position based on aspect ratio comparison
    if (containerRatio > videoRatio) {
      // Container is wider than the video; fit height and center horizontally
      height = containerHeight;
      width = height * videoRatio;
      left = (containerWidth - width) / 2;
      top = 0;
    } else {
      // Container is taller than the video; fit width and center vertically
      width = containerWidth;
      height = width / videoRatio;
      top = (containerHeight - height) / 2;
      left = 0;
    }

    setSurface({
      width,
      height,
      top,
      left,
      intrinsicWidth: videoWidth,
      intrinsicHeight: videoHeight,
    });
  };
  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    player.on("loadedmetadata", computeSurface);
    player.on("resize", computeSurface);
    player.on("fullscreenchange", computeSurface);

    window.addEventListener("resize", computeSurface);

    return () => {
      window.removeEventListener("resize", computeSurface);
    };
  }, [playerRef]);

  return surface;
};
