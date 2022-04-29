import React from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import { ConfigurationContext } from "../contexts/ConfigurationContext";

const FormWindow = React.forwardRef((props, ref) => {
  const { options } = React.useContext(ConfigurationContext);

  return (
    <Modal size="xl" animation={true} {...options.modalProps}>
      <Modal.Header closeButton>
        <Modal.Title>{options.modalProps.title}</Modal.Title>
      </Modal.Header>

      <Modal.Body className="overflow-hidden p-0">{props.children}</Modal.Body>
    </Modal>
  );
});

FormWindow.propTypes = {
  children: PropTypes.element.isRequired,
};

export default FormWindow;
