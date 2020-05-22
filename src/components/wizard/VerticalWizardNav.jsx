import React, { useContext } from 'react';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import PropTypes from 'prop-types';
import JsonLdUtils from 'jsonld-utils';
import { ConfigurationContext } from '../../contexts/ConfigurationContext';

//TODO add "disabled" to VerticalWizardNav
const VerticalWizardNav = ({ steps, onNavigate, currentStep }) => {
  const { options } = useContext(ConfigurationContext);

  return (
    <div className="wizard-nav col-2 p-0">
      <ListGroup>
        {steps.map((step, index) => (
          <ListGroupItem
            key={'nav' + index}
            onClick={() => onNavigate(index)}
            id={'wizard-nav-' + index}
            active={index === currentStep ? 'active' : ''}
          >
            {JsonLdUtils.getLocalized(step[JsonLdUtils.RDFS_LABEL], options.intl)}
          </ListGroupItem>
        ))}
      </ListGroup>
    </div>
  );
};

VerticalWizardNav.propTypes = {
  currentStep: PropTypes.number.isRequired,
  steps: PropTypes.array.isRequired,
  onNavigate: PropTypes.func.isRequired
};

export default VerticalWizardNav;
