/**
 * Stateless SVG component responsible for rendering a single polyline annotation.
 *
 * Receives fully resolved geometry and styling from the parent renderer and
 * performs no normalization, transformation, or time-based logic.
 *
 * @component
 *
 * @param {Object} props
 * @param {string} props.points - SVG polyline points string (e.g. "x1,y1 x2,y2 ...")
 * @param {string} props.stroke - Stroke color.
 * @param {number} props.strokeWidth - Width of the polyline stroke.
 * @param {string} props.fill - Fill color (typically "none").
 * @param {number} props.opacity - Opacity of the polyline.
 *
 * @returns {JSX.Element} SVG <polyline> element.
 */

const PolylineAnnotation = ({
  key,
  points,
  stroke,
  strokeWidth,
  fill,
  opacity,
}) => {
  return (
    <polyline
      key={key}
      points={points}
      stroke={stroke}
      strokeWidth={strokeWidth}
      fill={fill}
      opacity={opacity}
    />
  );
};

export default PolylineAnnotation;
