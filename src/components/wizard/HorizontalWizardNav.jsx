import React from 'react';
import { Nav, NavItem, NavLink, Card } from 'react-bootstrap';
import PropTypes from 'prop-types';
import JsonLdUtils from 'jsonld-utils';
import FormUtils from '../../util/FormUtils';
import Configuration from '../../model/Configuration';

const HorizontalWizardNav = ({ steps, onNavigate, currentStep }) => (
  <Card.Header>
    <Nav variant="tabs" activeKey={currentStep} onSelect={(key) => onNavigate(parseInt(key))}>
      {steps.map((step, index) => (
        <NavItem key={'nav' + index} id={'wizard-nav-' + index}>
          <NavLink eventKey={index} active={index === currentStep} disabled={!FormUtils.isRelevant(step)}>
            {JsonLdUtils.getLocalized(step[JsonLdUtils.RDFS_LABEL], Configuration.intl)}
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
