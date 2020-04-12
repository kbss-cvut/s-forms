import React from 'react';
import PropTypes from 'prop-types';
import { Glyphicon, OverlayTrigger, Tooltip } from 'react-bootstrap';

const HelpIcon = (props) => {
  const tooltip = (
    <Tooltip id="help-tooltip" className="tooltip-content">
      {props.text}
    </Tooltip>
  );

  return (
    <OverlayTrigger placement="right" overlay={tooltip}>
      <Glyphicon glyph={props.glyph} className={props.iconClass} />
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
  glyph: 'question-sign'
};

export default HelpIcon;
