import { useEffect, useState, useCallback } from "react";

// Tracks and controls fullscreen state for a given element ref.
export const useFullscreen = (ref) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handler = () => setIsFullscreen(Boolean(document.fullscreenElement));

    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const toggle = useCallback(() => {
    if (!ref.current) return;

    if (!document.fullscreenElement) {
      ref.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, [ref]);

  return { isFullscreen, toggle };
};
