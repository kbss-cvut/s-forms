import React, { forwardRef } from "react";

/**
 * Fullscreen-capable container for media elements.
 */
const MediaFullScreenContainer = forwardRef(
  ({ children, fullscreen = false }, ref) => {
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

export default MediaFullScreenContainer;
