import { useRef } from "react";
import { createPortal } from "react-dom";
import { useObservedSize } from "../../../hooks/useObservedSize.jsx";
import { useAnnotationsEngine } from "../annotation/engine/useAnnotationsEngine.js";
import AnnotationOverlay from "../annotation/AnnotationOverlay.jsx";

const ImageOverlay = ({ src, annotations = [], onClose }) => {
  const wrapperRef = useRef(null);
  const size = useObservedSize(wrapperRef);

  const renderModels = useAnnotationsEngine({
    annotations,
    width: size?.width,
    height: size?.height,
    currentTime: null,
  });

  return createPortal(
    <div className="media-modal" onClick={onClose}>
      <div
        className="media-modal-content"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div ref={wrapperRef} className="media-modal-image-wrapper">
          <img src={src} alt="" />

          {renderModels.length > 0 && (
            <AnnotationOverlay renderModels={renderModels} />
          )}

          {/* EXIT BUTTON */}
          <button
            className="media-fullscreen-button media-fullscreen-exit"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ImageOverlay;
