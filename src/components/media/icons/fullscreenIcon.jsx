import React from "react";

/**
 * Standard "enter fullscreen" icon (Material Design `fullscreen`).
 *
 * Used for the fullscreen control on external media (image and video) so it
 * looks consistent with each other and with the native fullscreen button of
 * mediaCMS-provided players, which use the same iconography (issue #458).
 */
const PATH =
  "M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z";

// Markup string for consumers that render via innerHTML (e.g. Video.js buttons).
export const fullscreenIconSvg = `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="${PATH}"/></svg>`;

// React component for JSX consumers.
export const FullscreenIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="currentColor"
    aria-hidden="true"
    {...props}
  >
    <path d={PATH} />
  </svg>
);
