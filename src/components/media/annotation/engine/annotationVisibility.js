import Constants from "../../../../constants/Constants.js";

export const isAnnotationVisible = (annotation, currentTime) => {
  if (currentTime == null) return true;

  const start = annotation[Constants.ANNOTATION.HAS_START_TIME];

  const end = annotation[Constants.ANNOTATION.HAS_END_TIME];

  if (start != null && currentTime < start) return false;
  if (end != null && currentTime > end) return false;

  return true;
};
