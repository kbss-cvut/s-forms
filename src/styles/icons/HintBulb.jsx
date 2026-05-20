import React from "react";

const BULB_PATH =
  "M9 21h6v2H9zm3-21C7.03 0 3 4.03 3 9c0 3.04 1.53 5.73 3.86 7.36.74.52 1.14 1.35 1.14 2.24V19h8v-.4c0-.9.39-1.73 1.14-2.24C19.47 14.73 21 12.04 21 9c0-4.97-4.03-9-9-9z";

const SVG_SIZE = {
  width: 24,
  height: 28,
  viewBox: "0 0 24 28",
};

const DISABLED_LINE = {
  x1: 2,
  y1: 2,
  x2: 21,
  y2: 19,
  stroke: "#f15050",
  strokeWidth: 3,
  strokeLinecap: "round",
};

const DISABLED_BULB_OPACITY = 0.35;

const HintEnabled = () => <path d={BULB_PATH} />;

const HintDisabled = () => (
  <>
    <path d={BULB_PATH} opacity={DISABLED_BULB_OPACITY} />
    <line {...DISABLED_LINE} />
  </>
);

const HintBulb = ({ title, enabled, className }) => (
  <svg
    className={`hint-icon${className ? ` ${className}` : ""}`}
    xmlns="http://www.w3.org/2000/svg"
    width={SVG_SIZE.width}
    height={SVG_SIZE.height}
    viewBox={SVG_SIZE.viewBox}
    aria-label={title}
  >
    <title>{title}</title>
    {enabled ? <HintEnabled /> : <HintDisabled />}
  </svg>
);

export default HintBulb;
