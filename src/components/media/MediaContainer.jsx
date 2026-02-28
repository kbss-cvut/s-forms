import { forwardRef, useEffect } from "react";
import { useObservedSize } from "../../hooks/useObservedSize.jsx";

const MediaContainer = forwardRef(
  ({ children, onResize, fullscreen = false }, ref) => {
    const size = useObservedSize(ref);

    useEffect(() => {
      if (size) onResize?.(size);
    }, [size, onResize]);

    return (
      <div
        ref={ref}
        className={`media-container ${fullscreen ? "fullscreen" : ""}`}
      >
        {children}
      </div>
    );
  }
);

export default MediaContainer;
