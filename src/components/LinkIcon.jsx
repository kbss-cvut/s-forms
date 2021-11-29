import React, {useState} from 'react';
import PropTypes from 'prop-types';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import ExternalLink from "../styles/icons/ExternalLink";

const LinkIcon = (props) => {
  const [overlayPlacement, setOverlayPlacement] = useState("right");

  const getOverlayPlacement = (el) => {
    if (!el) return;

    if (el.getBoundingClientRect().x > window.innerWidth / 2) {
      setOverlayPlacement("left");
    } else setOverlayPlacement("right");
  }

  const tooltip = (
    <Tooltip id="url-tooltip" className="tooltip-content">
      {props.url}
    </Tooltip>
  );

  return (
      <div ref={el => getOverlayPlacement(el)}>
        <OverlayTrigger placement={props.overlayPlacement || overlayPlacement} overlay={tooltip}>
      <a href={props.url} target="_blank" className={props.iconClassContainer} >
        <ExternalLink className={props.iconClass} />
      </a>
        </OverlayTrigger>
      </div>
  );
};

LinkIcon.propTypes = {
  url: PropTypes.string.isRequired,
  iconClassContainer: PropTypes.string,
  iconClass: PropTypes.string,
  overlayPlacement: PropTypes.string,
  absolutePosition: PropTypes.bool,
};

LinkIcon.defaultProps = {
  iconClassContainer: '',
  iconClass: '',
  absolutePosition: true
};

export default LinkIcon;
