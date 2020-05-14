import React from 'react';
import { Nav, NavItem, NavLink, Card } from 'react-bootstrap';
import FormUtils from '../../util/FormUtils';
import PropTypes from 'prop-types';

const HorizontalWizardNav = ({ steps, onNavigate, currentStep }) => (
  <Card.Header>
    <Nav variant="tabs" activeKey={currentStep} onSelect={(key) => onNavigate(parseInt(key))}>
      {steps.map((step, index) => (
        <NavItem key={'nav' + index} id={'wizard-nav-' + index}>
          <NavLink eventKey={index} active={index === currentStep} disabled={!FormUtils.isRelevant(step.data)}>
            {step.name}
          </NavLink>
        </NavItem>
      ))}
    </Nav>
  </Card.Header>
);

HorizontalWizardNav.propTypes = {
  currentStep: PropTypes.number.isRequired,
  steps: PropTypes.array.isRequired,
  onNavigate: PropTypes.func.isRequired
};

export default HorizontalWizardNav;
