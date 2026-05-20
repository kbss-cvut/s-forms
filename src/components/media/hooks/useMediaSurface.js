import { useEffect, useState } from "react";

const computeVideoSurface = (player) => {
  const videoWidth = player.videoWidth();
  const videoHeight = player.videoHeight();
  if (!videoWidth || !videoHeight) return null;

  const container = player.el();
  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;

  const videoRatio = videoWidth / videoHeight;
  const containerRatio = containerWidth / containerHeight;

  let width, height, top, left;

  if (containerRatio > videoRatio) {
    height = containerHeight;
    width = height * videoRatio;
    left = (containerWidth - width) / 2;
    top = 0;
  } else {
    width = containerWidth;
    height = width / videoRatio;
    top = (containerHeight - height) / 2;
    left = 0;
  }

  return {
    width,
    height,
    intrinsicWidth: videoWidth,
    intrinsicHeight: videoHeight,
    top,
    left,
  };
};

const useVideoSurface = (containerRef) => {
  const [surface, setSurface] = useState(null);

  useEffect(() => {
    const player = containerRef?.current;
    if (!player) return;

    const update = () => setSurface(computeVideoSurface(player));

    player.on("loadedmetadata", update);
    player.on("resize", update);
    player.on("fullscreenchange", update);
    window.addEventListener("resize", update);

    return () => {
      player.off("loadedmetadata", update);
      player.off("resize", update);
      player.off("fullscreenchange", update);
      window.removeEventListener("resize", update);
    };
  }, [containerRef]);

  return surface;
};

const computeImageSurface = (containerRef) => {
  const container = containerRef?.current;
  if (!container) return null;

  const img = container.querySelector("img");
  if (!img) return null;

  const rect = container.getBoundingClientRect();

  return {
    width: rect.width,
    height: rect.height,
    intrinsicWidth: img.naturalWidth || rect.width,
    intrinsicHeight: img.naturalHeight || rect.height,
    top: 0,
    left: 0,
  };
};

const useImageSurface = (containerRef) => {
  const [surface, setSurface] = useState(null);

  useEffect(() => {
    const container = containerRef?.current;
    if (!container) return;

    const img = container.querySelector("img");
    if (!img) return;

    const update = () => setSurface(computeImageSurface(containerRef));

    if (img.complete) update();
    else img.addEventListener("load", update);

    window.addEventListener("resize", update);

    return () => {
      img.removeEventListener("load", update);
      window.removeEventListener("resize", update);
    };
  }, [containerRef]);

  return surface;
};

// Calculates the rendered intrinsic dimensions
// for the current media type and container ref.
export const useMediaSurface = ({ type, containerRef }) => {
  const imageSurface = useImageSurface(type === "image" ? containerRef : null);
  const videoSurface = useVideoSurface(type === "video" ? containerRef : null);

  return type === "image"
    ? imageSurface
    : type === "video"
    ? videoSurface
    : null;
};
