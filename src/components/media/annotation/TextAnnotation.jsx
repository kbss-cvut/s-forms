import React from "react";
/**
 * Stateless SVG component responsible for rendering a single text annotation.
 * Receives fully resolved position, styling, and content from the parent renderer.
 * This component performs no normalization, scaling, or time-based logic.
 */
const TextAnnotation = ({
  text,
  fontFamily,
  fontWeight,
  opacity,
  fontSize,
  x,
  y,
  color,
}) => {
  return (
    <text
      x={x}
      y={y}
      fill={color}
      fontSize={`${fontSize}px`}
      fontFamily={fontFamily}
      fontWeight={fontWeight}
      dominantBaseline="text-before-edge"
      textAnchor="start"
      opacity={opacity}
    >
      {text}
    </text>
  );
};

export default TextAnnotation;
