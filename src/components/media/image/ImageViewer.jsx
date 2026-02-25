import { useEffect, useRef, useState } from "react";
import { useObservedSize } from "../../../hooks/useObservedSize.jsx";
import ImageOverlay from "./ImageOverlay.jsx";

const ImageViewer = ({ src, annotations = [], onAssetChangesSize }) => {
  const wrapperRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const size = useObservedSize(wrapperRef);

  useEffect(() => {
    if (size) {
      onAssetChangesSize?.(size);
    }
  }, [size, onAssetChangesSize]);

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
