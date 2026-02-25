import PolylineAnnotation from "./PolylineAnnotation.jsx";
import TextAnnotation from "./TextAnnotation.jsx";

/**
 * Pure SVG overlay renderer.
 * Receives already-prepared renderModels from engine.
 */
const AnnotationOverlay = ({ renderModels = [] }) => {
  if (!renderModels.length) return null;

  return (
    <svg
      className="annotation-overlay"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    >
      {renderModels.map((model) => {
        switch (model.type) {
          case "polyline":
            return (
              <PolylineAnnotation
                key={model.id}
                points={model.geometry.points}
                stroke={model.style.stroke}
                strokeWidth={model.style.strokeWidth}
                fill={model.style.fill}
                opacity={model.opacity}
              />
            );

          case "text":
            return (
              <TextAnnotation
                key={model.id}
                text={model.payload.text}
                x={model.geometry.x}
                y={model.geometry.y}
                fontSize={model.style.fontSize}
                fontFamily={model.style.fontFamily}
                fontWeight={model.style.fontWeight}
                color={model.style.color}
                opacity={model.opacity}
              />
            );

          default:
            return null;
        }
      })}
    </svg>
  );
};

export default AnnotationOverlay;
