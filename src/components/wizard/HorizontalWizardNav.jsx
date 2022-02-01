import React, { useContext } from 'react';
import { Nav, NavItem, NavLink, Card } from 'react-bootstrap';
import PropTypes from 'prop-types';
import JsonLdUtils from 'jsonld-utils';
import FormUtils from '../../util/FormUtils';
import { ConfigurationContext } from '../../contexts/ConfigurationContext';
import Question from '../Question';

const HorizontalWizardNav = ({ steps, onNavigate, currentStep }) => {
  const { options } = useContext(ConfigurationContext);

  return (
    <Card.Header>
      <Nav variant="tabs" activeKey={currentStep} onSelect={(key) => onNavigate(parseInt(key))}>
        {steps.map((step, index) => (
          <NavItem key={'nav' + index} id={'wizard-nav-' + index} className={Question.getEmphasizedClass(step)}>
            <NavLink eventKey={index} active={index === currentStep} disabled={!FormUtils.isRelevant(step)}>
              {JsonLdUtils.getLocalized(step[JsonLdUtils.RDFS_LABEL], options.intl)}
            </NavLink>
          </NavItem>
        ))}
      </Nav>
    </Card.Header>
  );
};

HorizontalWizardNav.propTypes = {
  currentStep: PropTypes.number.isRequired,
  steps: PropTypes.array.isRequired,
  onNavigate: PropTypes.func.isRequired
};

export default HorizontalWizardNav;
