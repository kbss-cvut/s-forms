import { useEffect, useRef, useState } from "react";
import ImageOverlay from "./ImageOverlay.jsx";
import { useObservedSize } from "../../../hooks/useObservedSize.jsx";

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

const ImageViewer = ({
  src,
  width = 640,
  height = 640,
  onAssetChangesSize,
  annotations,
}) => {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  const imageBoxRef = useRef(null);
  const size = useObservedSize(imageBoxRef);

  useEffect(() => {
    if (size) onAssetChangesSize(size);
  }, [size, onAssetChangesSize]);

  return (
    <>
      <div
        style={{
          width,
          height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* IMAGE BOX (exact image size) */}
        <div
          ref={imageBoxRef}
          style={{
            position: "relative",
            width: "fit-content",
            height: "fit-content",
            maxWidth: "100%",
            maxHeight: "100%",
          }}
        >
          <img
            src={src}
            alt=""
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              width: "auto",
              height: "auto",
              display: "block",
            }}
          />

          {hovered && (
            <button
              onClick={() => setOpen(true)}
              style={{
                position: "absolute",
                right: 8,
                bottom: 8,
                background: "rgba(0,0,0,0.6)",
                padding: "6px 10px",
                color: "white",
                borderRadius: 6,
                border: "none",
                cursor: "pointer",
              }}
            >
              Full
            </button>
          )}
        </div>
      </div>

      {open && (
        <ImageOverlay
          src={src}
          annotations={annotations}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default ImageViewer;
