import React from "react";
/**
 * Stateless SVG component responsible for rendering a single polyline annotation.
 * Receives fully resolved geometry and styling from the parent renderer and
 * performs no normalization, transformation, or time-based logic.
 */
const PolylineAnnotation = ({ points, stroke, strokeWidth, fill, opacity }) => {
  return (
    <polyline
      points={points}
      stroke={stroke}
      strokeWidth={strokeWidth}
      fill={fill}
      opacity={opacity}
    />
  );
};

export default PolylineAnnotation;
