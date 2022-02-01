import React from 'react';
import { Col } from 'react-bootstrap';
import PropTypes from 'prop-types';

const IconList = (props) => {
  return React.Children.map(props.children, (child) => {
    if (child) return <li className="icon-list-item">{child}</li>;
    return null;
  });
};

IconList.propTypes = {
  className: PropTypes.string
};

export default IconList;
