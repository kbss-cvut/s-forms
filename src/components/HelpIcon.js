import React from 'react';
import PropTypes from 'prop-types';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const HelpIcon = (props) => {
  const tooltip = (
    <Tooltip id="help-tooltip" className="tooltip-content">
      {props.text}
    </Tooltip>
  );

  return (
    <OverlayTrigger placement="right" overlay={tooltip}>
      <span className={`${props.glyph} ${props.iconClass}`} />
    </OverlayTrigger>
  );
};

HelpIcon.propTypes = {
  text: PropTypes.string.isRequired,
  glyph: PropTypes.string,
  iconClass: PropTypes.string
};

HelpIcon.defaultProps = {
  iconClass: '',
  glyph: 'icon-question-circle'
};

export default HelpIcon;
