import Constants from "../../../constants/Constants.js";
import ViewerUtils from "../../../util/MediaAssetViewerUtil.js";
import TextAnnotation from "./TextAnnotation.jsx";
import PolylineAnnotation from "./PolylineAnnotation.jsx";

const isAnnotationVisible = (annotation, currentTime) => {
  if (currentTime == null) return true;

  const start = annotation[Constants.ANNOTATION.HAS_START_TIME];
  const end = annotation[Constants.ANNOTATION.HAS_END_TIME];

  if (start == null && end == null) return true;
  return currentTime >= start && currentTime <= end;
};

const denormalizePoints = (annotation, width, height) =>
  ViewerUtils.denormalizePointsFromStringToString(
    annotation[Constants.ANNOTATION.HAS_GEOMETRY_POINTS],
    width,
    height
  );

const renderPolyline = (annotation, points) => {
  const defaultStyle =
    Constants.POLYLINE_ANNOTATION.DEFAULT_POLYLINE_ANNOTATION_STYLE;

  return (
    <PolylineAnnotation
      points={points}
      opacity={
        annotation[Constants.ANNOTATION.HAS_OPACITY] ?? defaultStyle.opacity
      }
      stroke={annotation[Constants.ANNOTATION.HAS_COLOR] || defaultStyle.stroke}
      strokeWidth={
        annotation[Constants.POLYLINE_ANNOTATION.HAS_STROKE_WIDTH] ||
        defaultStyle.strokeWidth
      }
      fill={
        annotation[Constants.POLYLINE_ANNOTATION.HAS_FILL_COLOR] ||
        defaultStyle.fill
      }
    />
  );
};

const renderText = (annotation, points, viewportHeight) => {
  const defaultStyle = Constants.TEXT_ANNOTATION.DEFAULT_TEXT_ANNOTATION_STYLE;
  const [[x, y]] = ViewerUtils.getArrayPointsFromString(points);

  const normalizedFontSize =
    annotation[Constants.TEXT_ANNOTATION.HAS_FONT_SIZE] ??
    defaultStyle.fontSizeInNormalizedPx;

  return (
    <TextAnnotation
      text={annotation[Constants.TEXT_ANNOTATION.HAS_TEXT] || defaultStyle.text}
      x={x}
      y={y}
      fontSize={normalizedFontSize * viewportHeight}
      fontFamily={defaultStyle.fontFamily}
      fontWeight={
        annotation[Constants.TEXT_ANNOTATION.HAS_FONT_WEIGHT] ||
        defaultStyle.fontWeight
      }
      color={annotation[Constants.ANNOTATION.HAS_COLOR] || defaultStyle.color}
      opacity={
        annotation[Constants.ANNOTATION.HAS_OPACITY] ?? defaultStyle.opacity
      }
    />
  );
};

/**
 * Renders time-based visual annotations as an SVG overlay on top of a media asset.
 *
 * The component is purely presentational and does not manage interaction or state.
 * It filters annotations by playback time, denormalizes geometry into viewport
 * pixel space, and delegates rendering to annotation-specific components.
 *
 * @component
 *
 * @param {number} mediaAssetViewportWidth - Width of the media asset viewport in pixels.
 * @param {number} mediaAssetViewportHeight - Height of the media asset viewport in pixels.
 * @param {Array<Object>} annotations - List of annotations using normalized coordinates (0–1).
 * @param {number|null} playerCurrentTime - Current playback time in seconds; if null, all annotations are rendered.
 *
 * @returns {JSX.Element} SVG overlay containing rendered annotations.
 *
 * @remarks
 * - Accepts annotations defined in a normalized coordinate system (0–1)
 * - Default styles are resolved via Constants to ensure consistency
 * - Supports polyline and text annotation types
 */
const AnnotationRenderer = ({
  mediaAssetViewportWidth,
  mediaAssetViewportHeight,
  annotations,
  playerCurrentTime,
}) => {
  const visibleAnnotations = annotations.filter((a) =>
    isAnnotationVisible(a, playerCurrentTime)
  );

  return (
    <svg
      width={mediaAssetViewportWidth}
      height={mediaAssetViewportHeight}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    >
      {visibleAnnotations.map((annotation, idx) => {
        const points = denormalizePoints(
          annotation,
          mediaAssetViewportWidth,
          mediaAssetViewportHeight
        );

        switch (annotation[Constants.ANNOTATION.HAS_ANNOTATION_TYPE]) {
          case Constants.POLYLINE_ANNOTATION.HAS_IMPLICIT_TYPE_LABEL:
            return <g key={idx}>{renderPolyline(annotation, points)}</g>;

          case Constants.TEXT_ANNOTATION.HAS_IMPLICIT_TYPE_LABEL:
            return (
              <g key={idx}>
                {renderText(annotation, points, mediaAssetViewportHeight)}
              </g>
            );

          default:
            return null;
        }
      })}
    </svg>
  );
};

export default AnnotationRenderer;
