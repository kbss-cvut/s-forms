import AnnotationRenderer from "../annotation/AnnotationRenderer.jsx";
import { useRef } from "react";
import { useObservedSize } from "../../../hooks/useObservedSize.jsx";

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
  const imageBoxRef = useRef(null);
  const size = useObservedSize(imageBoxRef);

  return (
    <div
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
        onClick={onClose}
        style={{
          width: "90vw",
          height: "90vh",
          maxWidth: "1200px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
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
          {size && (
            <AnnotationRenderer
              mediaAssetViewportWidth={size.width}
              mediaAssetViewportHeight={size.height}
              annotations={annotations}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageOverlay;
