import { forwardRef } from "react";

const MediaContainer = forwardRef(({ children, fullscreen = false }, ref) => {
  return (
    <div
      ref={ref}
      className={`media-container ${fullscreen ? "fullscreen" : ""}`}
    >
      {children}
    </div>
  );
});

export default MediaContainer;
