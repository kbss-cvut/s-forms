import React from "react";
import PropTypes from "prop-types";
import ExternalLink from "../styles/icons/ExternalLink";
import IconOverlay from "./IconOverlay";

const LinkIcon = (props) => {
  return props.showOverlay ? (
    <IconOverlay
      tooltipContent={props.url["@id"] || props.url}
      id="url-tooltip"
      overlayPlacement={props.overlayPlacement}
    >
      <a
        href={props.url["@id"] || props.url}
        target="_blank"
        className={props.iconClassContainer}
      >
        <ExternalLink className={props.iconClass} />
      </a>
    </IconOverlay>
  ) : (
    <a
      href={props.url["@id"] || props.url}
      target="_blank"
      className={props.iconClassContainer}
    >
      <ExternalLink className={props.iconClass} />
    </a>
  );
};

LinkIcon.propTypes = {
  url: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.object.isRequired,
  ]),
  iconClassContainer: PropTypes.string,
  iconClass: PropTypes.string,
  overlayPlacement: PropTypes.string,
  absolutePosition: PropTypes.bool,
  showOverlay: PropTypes.bool,
};

LinkIcon.defaultProps = {
  iconClassContainer: "",
  iconClass: "",
  absolutePosition: true,
  showOverlay: true,
};

export default LinkIcon;
