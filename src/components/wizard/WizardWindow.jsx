import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import Wizard from './Wizard';

const WizardWindow = React.forwardRef((props, ref) =>  {
  const properties = { ...props, onClose: props.onHide };

  const getModalProps = () => {
    const modalProps = { ...props };

    delete modalProps.steps;
    delete modalProps.data;
    delete modalProps.onFinish;
    delete modalProps.start;
    delete modalProps.enableForwardSkip;

    return modalProps;
  };

  return (
    <Modal {...getModalProps()} show={props.show} size="xl" title={props.title} animation={true}>
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
  onHide: PropTypes.func,
  title: PropTypes.string,
  show: PropTypes.bool
};

export default WizardWindow;
