import Constants from "../../../../constants/Constants.js";
import MediaAssetViewerUtil from "../../../../util/MediaAssetViewerUtil.js";

const buildBaseModel = (annotation) => {
  const type = annotation[Constants.ANNOTATION.HAS_ANNOTATION_TYPE];

  const opacity = annotation[Constants.ANNOTATION.HAS_OPACITY];

  return {
    id: annotation.id ?? crypto.randomUUID(),
    type,
    opacity: opacity ?? 1.0,
  };
};

const buildPolylineModel = (annotation, width, height, base) => {
  const points = annotation[Constants.ANNOTATION.HAS_GEOMETRY_POINTS];

  const defaultStyle =
    Constants.POLYLINE_ANNOTATION.DEFAULT_POLYLINE_ANNOTATION_STYLE;

  return {
    ...base,
    geometry: {
      points: MediaAssetViewerUtil.denormalizePointsFromStringToString(
        points,
        width,
        height
      ),
    },
    style: {
      stroke: annotation[Constants.ANNOTATION.HAS_COLOR] ?? defaultStyle.color,
      strokeWidth:
        (annotation[Constants.POLYLINE_ANNOTATION.HAS_STROKE_WIDTH] ??
          defaultStyle.strokeWidth) * width,
      fill:
        annotation[Constants.POLYLINE_ANNOTATION.HAS_FILL_COLOR] ??
        defaultStyle.fillColor,
    },
  };
};

const buildTextModel = (annotation, width, height, base) => {
  const points = annotation[Constants.ANNOTATION.HAS_GEOMETRY_POINTS];

  const defaultStyle = Constants.TEXT_ANNOTATION.DEFAULT_TEXT_ANNOTATION_STYLE;

  const [[nx, ny]] = MediaAssetViewerUtil.getArrayPointsFromString(points);

  return {
    ...base,
    geometry: {
      x: nx * width,
      y: ny * height,
    },
    style: {
      fontSize:
        (annotation[Constants.TEXT_ANNOTATION.HAS_FONT_SIZE] ??
          defaultStyle.fontSizeInNormalizedPx) * height,
      fontWeight:
        annotation[Constants.TEXT_ANNOTATION.HAS_FONT_WEIGHT] ??
        defaultStyle.fontWeight,
      fontFamily: defaultStyle.fontFamily,
      color: annotation[Constants.ANNOTATION.HAS_COLOR] ?? defaultStyle.color,
    },
    payload: {
      text: annotation[Constants.TEXT_ANNOTATION.HAS_TEXT] ?? defaultStyle.text,
    },
  };
};

const annotationBuildersRegistry = {
  [Constants.POLYLINE_ANNOTATION.IMPLICIT_TYPE_LABEL]: buildPolylineModel,

  [Constants.TEXT_ANNOTATION.IMPLICIT_TYPE_LABEL]: buildTextModel,
};

// Converts a raw annotation into a renderer-ready model.
// Returns null for unknown types.
export const buildRenderModel = (annotation, width, height) => {
  const type = annotation[Constants.ANNOTATION.HAS_ANNOTATION_TYPE];

  const builder = annotationBuildersRegistry[type];

  if (!builder) return null;

  const base = buildBaseModel(annotation);

  return builder(annotation, width, height, base);
};
