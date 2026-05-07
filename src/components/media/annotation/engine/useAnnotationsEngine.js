import { useMemo } from "react";
import { isAnnotationVisible } from "./annotationVisibility.js";
import { buildRenderModel } from "./buildRenderModel.js";

// Transforms raw annotations into renderer-ready models for the current frame.
export const useAnnotationsEngine = ({
  annotations = [],
  width,
  height,
  currentTime,
}) => {
  return useMemo(() => {
    if (!width || !height) return [];
    if (!annotations.length) return [];

    return annotations
      .filter((a) => isAnnotationVisible(a, currentTime))
      .map((a) => buildRenderModel(a, width, height))
      .filter(Boolean);
  }, [annotations, width, height, currentTime]);
};
