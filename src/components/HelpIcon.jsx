import React from 'react';
import PropTypes from 'prop-types';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { QuestionCircle } from '../styles/icons';

const HelpIcon = (props) => {
  const tooltip = (
    <Tooltip id="help-tooltip" className="tooltip-content">
      {props.text}
    </Tooltip>
  );

  return (
    <OverlayTrigger placement="right" overlay={tooltip}>
      <span className={props.iconClassContainer} style={{ position: 'absolute' }}>
        <QuestionCircle className={props.iconClass} />
      </span>
    </OverlayTrigger>
  );
};

HelpIcon.propTypes = {
  text: PropTypes.string.isRequired,
  iconClassContainer: PropTypes.string,
  iconClass: PropTypes.string
};

HelpIcon.defaultProps = {
  iconClassContainer: '',
  iconClass: ''
};

export default HelpIcon;
