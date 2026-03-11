import React, { useState } from "react";
import PropTypes from "prop-types";
import HintBulb from "../styles/icons/HintBulb.jsx";
import IconOverlay from "./IconOverlay";

const HintIcon = (props) => {
  const [overlayPlacement, setOverlayPlacement] = useState("right");

  const getOverlayPlacement = (el) => {
    if (!el) return;
    if (el.getBoundingClientRect().x > window.innerWidth / 2) {
      setOverlayPlacement("left");
    } else {
      setOverlayPlacement("right");
    }
  };

  return (
    <div ref={(el) => getOverlayPlacement(el)}>
      <span onClick={() => props.onHintClick()}>
        <IconOverlay
          id="hint-icon-tooltip"
          overlayPlacement={props.overlayPlacement || overlayPlacement}
          absolutePosition={props.absolutePosition}
          tooltipContent={
            props.text || props.revealed ? "Hide a hint." : "Reveal a hint."
          }
        >
          <HintBulb className={props.iconClass} enabled={!props.revealed} />
        </IconOverlay>
      </span>
    </div>
  );
};

HintIcon.propTypes = {
  text: PropTypes.string,
  iconClassContainer: PropTypes.string,
  iconClass: PropTypes.string,
  overlayPlacement: PropTypes.string,
  absolutePosition: PropTypes.bool,
  onHintClick: PropTypes.func,
  revealed: PropTypes.bool,
};

HintIcon.defaultProps = {
  iconClassContainer: "",
  iconClass: "",
  absolutePosition: true,
  revealed: false,
};

export default HintIcon;
