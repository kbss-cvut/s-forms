import React from 'react';
import PropTypes from 'prop-types';
import ExternalLink from '../styles/icons/ExternalLink';
import IconOverlay from './IconOverlay';

const LinkIcon = (props) => {
  return (
    <IconOverlay tooltipContent={props.url['@id'] || props.url} id="url-tooltip">
      <a href={props.url['@id'] || props.url} target="_blank" className={props.iconClassContainer}>
        <ExternalLink className={props.iconClass} />
      </a>
    </IconOverlay>
  );
};

LinkIcon.propTypes = {
  url: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.object.isRequired]),
  iconClassContainer: PropTypes.string,
  iconClass: PropTypes.string,
  overlayPlacement: PropTypes.string,
  absolutePosition: PropTypes.bool
};

LinkIcon.defaultProps = {
  iconClassContainer: '',
  iconClass: '',
  absolutePosition: true
};

export default LinkIcon;
