import { useEffect, useRef, useState } from "react";
import { useObservedSize } from "../../../hooks/useObservedSize.jsx";
import ImageOverlay from "./ImageOverlay.jsx";
import AnnotationOverlay from "../annotation/AnnotationOverlay.jsx";
import { useAnnotationsEngine } from "../annotation/engine/useAnnotationsEngine.js";

const ImageViewer = ({ src, annotations = [], onAssetChangesSize }) => {
  const wrapperRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const size = useObservedSize(wrapperRef);

  useEffect(() => {
    if (size) {
      onAssetChangesSize?.(size);
    }
  }, [size, onAssetChangesSize]);

  const renderModels = useAnnotationsEngine({
    annotations,
    width: size?.width,
    height: size?.height,
    currentTime: null,
  });

  return (
    <>
      <div className="media-image-container">
        <div ref={wrapperRef} className="media-image-wrapper">
          <img src={src} alt="" />
        </div>

        <button
          className="media-fullscreen-button"
          onClick={() => setIsOpen(true)}
        >
          ⛶
        </button>
      </div>
      {renderModels.length > 0 && (
        <AnnotationOverlay renderModels={renderModels} />
      )}
      {isOpen && (
        <ImageOverlay
          src={src}
          annotations={annotations}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default ImageViewer;
