import React, { useContext } from "react";
import { Nav, NavItem, NavLink, Card } from "react-bootstrap";
import PropTypes from "prop-types";
import * as JsonLdUtils from "jsonld-utils";
import FormUtils from "../../util/FormUtils";
import { ConfigurationContext } from "../../contexts/ConfigurationContext";
import Question from "../Question";
import classNames from "classnames";
import IconOverlay from "../IconOverlay.jsx";
import { useIntl } from "react-intl";

const HorizontalWizardNav = ({ steps, onNavigate, currentStep }) => {
  const { options } = useContext(ConfigurationContext);
  const intl = useIntl();

  return (
    <Card.Header>
      <Nav
        variant="tabs"
        activeKey={currentStep}
        onSelect={(key) => onNavigate(parseInt(key))}
      >
        {steps.map((step, index) => (
          <IconOverlay
            id="step-disabled"
            tooltipContent={intl.formatMessage({ id: "wizard.nav.tooltip" })}
            show={!options.enableWizardStepSkip}
          >
            <NavItem key={"nav" + index} id={"wizard-nav-" + index}>
              <NavLink
                eventKey={index}
                active={index === currentStep ? "active" : ""}
                hidden={options.debugMode ? false : !FormUtils.isRelevant(step)}
                disabled={!options.enableWizardStepSkip}
                className={classNames([
                  options.debugMode && !FormUtils.isRelevant(step)
                    ? "show-irrelevant"
                    : Question.getEmphasizedClass(step),
                  "wizard-nav",
                ])}
              >
                {JsonLdUtils.getLocalized(
                  step[JsonLdUtils.RDFS_LABEL],
                  options.intl
                )}
              </NavLink>
            </NavItem>
          </IconOverlay>
        ))}
      </Nav>
    </Card.Header>
  );
};

HorizontalWizardNav.propTypes = {
  currentStep: PropTypes.number.isRequired,
  steps: PropTypes.array.isRequired,
  onNavigate: PropTypes.func.isRequired,
};

export default HorizontalWizardNav;
