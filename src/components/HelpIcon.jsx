import React, { useState } from "react";
import PropTypes from "prop-types";
import { QuestionCircle } from "../styles/icons";
import IconOverlay from "./IconOverlay.jsx";

const HelpIcon = (props) => {
  const [overlayPlacement, setOverlayPlacement] = useState("right");

  const getOverlayPlacement = (el) => {
    if (!el) return;

    if (el.getBoundingClientRect().x > window.innerWidth / 2) {
      setOverlayPlacement("left");
    } else setOverlayPlacement("right");
  };

  return (
    <div ref={(el) => getOverlayPlacement(el)}>
      <IconOverlay
        id="help-icon-tooltip-"
        overlayPlacement={props.overlayPlacement || overlayPlacement}
        absolutePosition={props.absolutePosition}
        tooltipContent={props.text}
      >
        <QuestionCircle className={props.iconClass} />
      </IconOverlay>
    </div>
  );
};

HelpIcon.propTypes = {
  text: PropTypes.string.isRequired,
  iconClassContainer: PropTypes.string,
  iconClass: PropTypes.string,
  overlayPlacement: PropTypes.string,
  absolutePosition: PropTypes.bool,
};

HelpIcon.defaultProps = {
  iconClassContainer: "",
  iconClass: "",
  absolutePosition: true,
};

export default HelpIcon;
