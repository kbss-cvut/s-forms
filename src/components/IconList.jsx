import React from "react";
import {Col} from "react-bootstrap";
import PropTypes from "prop-types";

const IconList = (props) => {
    return (
        React.Children.map(props.children, child => {
            if (child) return <Col className={props.className ? props.className : "icon-list" } lg="auto">{child}</Col>
            return null;
        })
    );
}

IconList.propTypes = {
    className: PropTypes.string
}

export default IconList;