import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { QuestionCircle } from '../styles/icons';

const HelpIcon = (props) => {
  const [overlayPlacement, setOverlayPlacement] = useState('right');

  const getOverlayPlacement = (el) => {
    if (!el) return;

    if (el.getBoundingClientRect().x > window.innerWidth / 2) {
      setOverlayPlacement('left');
    } else setOverlayPlacement('right');
  };

  const tooltip = (
    <Tooltip id="help-tooltip" className="tooltip-content">
      {props.text}
    </Tooltip>
  );

  return (
    <div ref={(el) => getOverlayPlacement(el)}>
      <OverlayTrigger placement={props.overlayPlacement || overlayPlacement} overlay={tooltip}>
        <span
          className={props.iconClassContainer}
          style={{ position: props.absolutePosition ? 'absolute' : null }}
        >
          <QuestionCircle className={props.iconClass} />
        </span>
      </OverlayTrigger>
    </div>
  );
};

HelpIcon.propTypes = {
  text: PropTypes.string.isRequired,
  iconClassContainer: PropTypes.string,
  iconClass: PropTypes.string,
  overlayPlacement: PropTypes.string,
  absolutePosition: PropTypes.bool
};

HelpIcon.defaultProps = {
  iconClassContainer: '',
  iconClass: '',
  absolutePosition: true
};

export default HelpIcon;
