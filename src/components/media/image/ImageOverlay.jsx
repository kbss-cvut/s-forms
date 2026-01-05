import AnnotationRenderer from "../annotation/AnnotationRenderer.jsx";
import { useRef, useState, useEffect } from "react";

/**
 * Displays an image in a full-screen modal overlay and renders annotations on top of it.
 *
 * The component is responsible only for layout and sizing. Annotation filtering,
 * geometry handling, and rendering are delegated to AnnotationRenderer.
 *
 * @component
 *
 * @param {Object} props
 * @param {string} props.src - Source URL of the image to display.
 * @param {Array<Object>} props.annotations - List of annotations associated with the image.
 * @param {Function} props.onClose - Callback invoked when the overlay is dismissed.
 *
 * @returns {JSX.Element} Full-screen image overlay with annotations.
 */
const ImageOverlay = ({ src, annotations, onClose }) => {
  const containerRef = useRef(null);
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.85)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        ref={containerRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          width: "90vw",
          height: "90vh",
          maxWidth: "1200px",
          background: "black",
        }}
      >
        <img
          src={src}
          alt=""
          style={{
            width: "100%",
            height: "100%",
            display: "block",
          }}
        />
        <AnnotationRenderer
          mediaAssetViewportWidth={containerRef?.current?.clientWidth}
          mediaAssetViewportHeight={containerRef?.current?.clientHeight}
          annotations={annotations}
        />
      </div>
    </div>
  );
};

export default ImageOverlay;
