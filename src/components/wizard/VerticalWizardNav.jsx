import React, { useContext } from 'react';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import PropTypes from 'prop-types';
import JsonLdUtils from 'jsonld-utils';
import { ConfigurationContext } from '../../contexts/ConfigurationContext';
import FormUtils from '../../util/FormUtils';
import Question from "../Question";
import EnhancedHotKeysComponent from "../HOC/EnhancedHotKeysComponent";

const VerticalWizardNav = ({ steps, onNavigate, currentStep, debugMode }) => {
  const { options } = useContext(ConfigurationContext);

  return (
    <div className="wizard-nav col-2 p-0">
      <ListGroup>
        {steps.map((step, index) => (
          <ListGroupItem
            hidden={debugMode ? false : !FormUtils.isRelevant(step)}
            key={'nav' + index}
            onClick={() => onNavigate(index)}
            id={'wizard-nav-' + index}
            action={true}
            active={index === currentStep ? 'active' : ''}
            variant={'default'}
            className={debugMode && !FormUtils.isRelevant(step) ? "debugMode" : Question.getEmphasizedClass(step)}
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

export default EnhancedHotKeysComponent(VerticalWizardNav);
