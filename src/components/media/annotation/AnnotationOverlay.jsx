import React, { useEffect, useMemo, useState } from "react";
import PolylineAnnotation from "./PolylineAnnotation";
import TextAnnotation from "./TextAnnotation";
import { useAnnotationsEngine } from "./engine/useAnnotationsEngine";

const ANNOTATION_COMPONENTS = {
  polyline: PolylineAnnotation,
  text: TextAnnotation,
};

// Maps annotation type to its SVG component
const AnnotationOverlay = ({
  annotations = [],
  surface,
  currentTime,
  showAnnotations,
}) => {
  const intrinsicWidth = surface?.intrinsicWidth;
  const intrinsicHeight = surface?.intrinsicHeight;
  const [pulseClass, setPulseClass] = useState("");

  useEffect(() => {
    if (!showAnnotations) return;
    setPulseClass("annotation-overlay-revealed");
    const timer = setTimeout(() => setPulseClass(""), 700);
    return () => clearTimeout(timer);
  }, [showAnnotations]);

  const renderModels = useAnnotationsEngine({
    annotations,
    width: intrinsicWidth,
    height: intrinsicHeight,
    currentTime,
  });

  const viewBox = useMemo(
    () => `0 0 ${intrinsicWidth} ${intrinsicHeight}`,
    [intrinsicWidth, intrinsicHeight]
  );

  if (!intrinsicWidth || !intrinsicHeight) return null;
  if (!renderModels.length) return null;

  if (!showAnnotations) {
    return <></>;
  }

  return (
    <svg viewBox={viewBox} className={`annotation-overlay ${pulseClass}`}>
      {renderModels.map((model) => {
        const Component = ANNOTATION_COMPONENTS[model.type];
        if (!Component) return null;
        return (
          <Component
            key={model.id}
            {...model.geometry}
            {...model.style}
            {...model.payload}
            opacity={model.opacity}
          />
        );
      })}
    </svg>
  );
};

export default AnnotationOverlay;
