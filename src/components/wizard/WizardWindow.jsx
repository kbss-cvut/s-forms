import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import Wizard from './Wizard';

const WizardWindow = React.forwardRef((props, ref) => {
  const properties = { ...props, onClose: props.onHide };

  return (
    <Modal {...props.modalProps} show={props.show} size="xl" title={props.title} animation={true}>
      <Modal.Header closeButton>
        <Modal.Title>{props.title}</Modal.Title>
      </Modal.Header>

      <Modal.Body className="overflow-hidden p-0">
        <Wizard {...properties} ref={ref} />
      </Modal.Body>
    </Modal>
  );
});

WizardWindow.propTypes = {
  modalProps: PropTypes.shape({
    onHide: PropTypes.func,
    title: PropTypes.string,
    show: PropTypes.bool
  })
};

export default WizardWindow;
