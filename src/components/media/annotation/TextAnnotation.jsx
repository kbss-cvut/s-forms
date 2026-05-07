import React from "react";
/**
 * Stateless SVG component responsible for rendering a single text annotation.
 * Receives fully resolved position, styling, and content from the parent renderer.
 * This component performs no normalization, scaling, or time-based logic.
 */
const TextAnnotation = ({
  text,
  fontFamily = "Arial",
  fontWeight = 400,
  opacity = 1,
  fontSize,
  x,
  y,
  color = "#00ff00",
  lineHeight = 1.15,
}) => {
  const lines = (text ?? "").split(/\r?\n/);
  const lineHeightPx = fontSize * lineHeight;
  const correctedY = y - fontSize * 0.2;

  return (
    <text
      fill={color}
      fontSize={`${fontSize}px`}
      fontFamily={fontFamily}
      fontWeight={fontWeight}
      textAnchor="start"
      opacity={opacity}
    >
      {lines.map((line, index) => (
        <tspan
          key={index}
          x={x}
          y={correctedY + index * lineHeightPx}
          dominantBaseline="hanging"
        >
          {line || "\u00A0"}
        </tspan>
      ))}
    </text>
  );
};

export default TextAnnotation;
