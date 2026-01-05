import { useState, useCallback } from "react";
import ImageOverlay from "./ImageOverlay.jsx";

/**
 * Renders an image preview with optional annotations and provides a mechanism
 * to open the image in a full-screen overlay view.
 *
 * @component
 *
 * @param {Object} props
 * @param {string} props.src - Source URL of the image to display.
 * @param {number} [props.width=640] - Maximum width of the image container in pixels.
 * @param {number} [props.height=640] - Maximum height of the image container in pixels.
 * @param {Array<Object>} [props.annotations=[]] - Optional list of annotations to render in the overlay view.
 *
 * @returns {JSX.Element} Image preview with optional full-screen overlay.
 *
 * @remarks
 * - Displays a hover-based control to open the full-screen overlay
 * - Does not perform image scaling or annotation processing itself
 */
const ImageViewer = ({ src, width = 640, height = 640, annotations = [] }) => {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  const openOverlay = useCallback(() => {
    setOpen(true);
  }, []);

  const closeOverlay = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <>
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: width,
          maxHeight: height,
          background: "black",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <img
          src={src}
          alt=""
          style={{ width: "100%", height: "100%", display: "block" }}
        />

        {hovered && (
          <div
            onClick={openOverlay}
            style={{
              position: "absolute",
              right: 12,
              bottom: 12,
              background: "rgba(0,0,0,0.6)",
              padding: 6,
              color: "white",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            Full
          </div>
        )}
      </div>
      {open && (
        <ImageOverlay
          src={src}
          annotations={annotations}
          onClose={closeOverlay}
        />
      )}
    </>
  );
};

export default ImageViewer;
