import React from "react";
import {Col} from "react-bootstrap";
import PropTypes from "prop-types";

const IconsLayout = (props) => {
    return (
        React.Children.map(props.children, child => {
            if (child) return <Col className={props.layout} lg="auto">{child}</Col>
            return null;
        })
    );
}

IconsLayout.propTypes = {
    layout: PropTypes.string.isRequired
}

export default IconsLayout;