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
 * - Performs image scaling itself
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
  const [imageBox, setImageBox] = useState(null);
  const imgRef = useRef(null);

  // Compute rendered image size deterministically
  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const update = () => {
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      if (!iw || !ih) return;

      const scale = Math.min(width / iw, height / ih);

      const w = iw * scale;
      const h = ih * scale;

      setImageBox({ width: w, height: h });
      onAssetChangesSize?.({ width: w, height: h });
    };

    if (img.complete) update();
    else img.onload = update;

    return () => {
      img.onload = null;
    };
  }, [src, width, height, onAssetChangesSize]);

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
        {imageBox && (
          <div
            style={{
              position: "relative",
              width: imageBox.width,
              height: imageBox.height,
            }}
          >
            <img
              ref={imgRef}
              src={src}
              alt=""
              style={{
                width: "100%",
                height: "100%",
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
        )}

        {/* preload image to read natural size */}
        {!imageBox && (
          <img ref={imgRef} src={src} alt="" style={{ display: "none" }} />
        )}
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
