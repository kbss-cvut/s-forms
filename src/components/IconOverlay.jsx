import React, { useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import PropTypes from 'prop-types';
import LinkIcon from './LinkIcon';

const IconOverlay = (props) => {
  const [overlayPlacement, setOverlayPlacement] = useState('right');

  const getOverlayPlacement = (el) => {
    if (!el) return;

    if (el.getBoundingClientRect().x > window.innerWidth / 2) {
      setOverlayPlacement('left');
    } else setOverlayPlacement('right');
  };

  const tooltip = (
    <Tooltip className="tooltip-content" id={props.id}>
      {props.tooltipContent}
    </Tooltip>
  );

  return (
    <span ref={(el) => getOverlayPlacement(el)}>
      <OverlayTrigger overlay={tooltip} placement={props.overlayPlacement || overlayPlacement}>
        <span>{props.children}</span>
      </OverlayTrigger>
    </span>
  );
};

IconOverlay.propTypes = {
  tooltipContent: PropTypes.oneOfType([PropTypes.object.isRequired, PropTypes.string.isRequired]),
  id: PropTypes.string.isRequired,
  overlayPlacement: PropTypes.string,
  absolutePosition: PropTypes.bool
};

IconOverlay.defaultProps = {
  iconClassContainer: '',
  iconClass: '',
  absolutePosition: true
};

export default IconOverlay;
