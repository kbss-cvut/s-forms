import React, { useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import PropTypes from "prop-types";

const IconOverlay = (props) => {
  const [overlayPlacement, setOverlayPlacement] = useState("right");

  const getOverlayPlacement = (el) => {
    if (!el) return;

    if (el.getBoundingClientRect().x > window.innerWidth / 2) {
      setOverlayPlacement("left");
    } else setOverlayPlacement("right");
  };

  const tooltip = props.show ? (
    <Tooltip className="tooltip-content" id={props.id}>
      {props.tooltipContent}
    </Tooltip>
  ) : (
    <span />
  );

  return (
    <span ref={(el) => getOverlayPlacement(el)}>
      <OverlayTrigger
        overlay={tooltip}
        placement={props.overlayPlacement || overlayPlacement}
      >
        <span>{props.children}</span>
      </OverlayTrigger>
    </span>
  );
};

IconOverlay.propTypes = {
  tooltipContent: PropTypes.oneOfType([
    PropTypes.object.isRequired,
    PropTypes.string.isRequired,
  ]),
  id: PropTypes.string.isRequired,
  overlayPlacement: PropTypes.string,
  absolutePosition: PropTypes.bool,
  show: PropTypes.bool,
};

IconOverlay.defaultProps = {
  iconClassContainer: "",
  iconClass: "",
  absolutePosition: true,
  show: true,
};

export default IconOverlay;
