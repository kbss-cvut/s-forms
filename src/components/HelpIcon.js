'use strict';

import React from 'react';
import {Glyphicon, OverlayTrigger, Tooltip} from 'react-bootstrap';

const HelpIcon = (props) => {
    const tooltip = <Tooltip id='help-tooltip' className='tooltip-content'>{props.text}</Tooltip>;

    return <OverlayTrigger placement='right' overlay={tooltip}>
        <Glyphicon glyph={props.glyph} className={props.iconClass}/>
    </OverlayTrigger>;
};

HelpIcon.propTypes = {
    text: React.PropTypes.string.isRequired,
    glyph: React.PropTypes.string,
    iconClass: React.PropTypes.string
};

HelpIcon.defaultProps = {
    iconClass: '',
    glyph: 'question-sign'
};

export default HelpIcon;
