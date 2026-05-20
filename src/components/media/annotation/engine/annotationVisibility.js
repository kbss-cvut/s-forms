import Constants from "../../../../constants/Constants.js";

// Returns true if the annotation should be visible at the given playback time.
// If no currentTime is provided (e.g. for images), the annotation is always shown.
export const isAnnotationVisible = (annotation, currentTime) => {
  if (currentTime == null) return true;

  const start = annotation[Constants.ANNOTATION.HAS_START_TIME];
  const end = annotation[Constants.ANNOTATION.HAS_END_TIME];

  if (start != null && currentTime < start) return false;

  if (end != null && currentTime > end) return false;

  return true;
};
