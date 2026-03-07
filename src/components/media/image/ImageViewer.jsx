import React, { useRef } from "react";
import { useMediaSurface } from "../hooks/useMediaSurface.js";
import AnnotationOverlay from "../annotation/AnnotationOverlay.jsx";

/**
 * Viewer for displaying images with annotations.
 */
const ImageViewer = ({ src, annotations, onFullScreen }) => {
  const wrapperRef = useRef(null);

  const surface = useMediaSurface({
    type: "image",
    containerRef: wrapperRef,
  });

  return (
    <div className="media-image-container">
      <div ref={wrapperRef} className="media-image-wrapper">
        <img src={src} alt="Beautiful Image" />
        <AnnotationOverlay
          annotations={annotations}
          surface={surface}
          currentTime={null}
        />
      </div>
      <button className="media-fullscreen-button" onClick={onFullScreen}>
        ⛶
      </button>
    </div>
  );
};

export default ImageViewer;
