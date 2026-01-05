import Constants from "../../../constants/Constants.js";

/**
 * Stateless SVG component responsible for rendering a single text annotation.
 *
 * Receives fully resolved position, styling, and content from the parent renderer.
 * This component performs no normalization, scaling, or time-based logic.
 *
 * @component
 *
 * @param {Object} props
 * @param {string} props.text - Text content to render.
 * @param {number} props.x - X coordinate in viewport pixel space.
 * @param {number} props.y - Y coordinate in viewport pixel space.
 * @param {number} props.fontSize - Font size in pixels.
 * @param {string} props.fontFamily - Font family name.
 * @param {string|number} props.fontWeight - Font weight.
 * @param {string} props.color - Text color.
 * @param {number} props.opacity - Opacity of the text.
 *
 * @returns {JSX.Element} SVG <text> element.
 */
const TextAnnotation = ({
  key,
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
      key={key}
      x={x}
      y={y}
      fill={color}
      fontSize={`${fontSize}px`}
      fontFamily={fontFamily}
      fontWeight={fontWeight}
      dominantBaseline="hanging"
      opacity={opacity}
    >
      {text}
    </text>
  );
};

export default TextAnnotation;
