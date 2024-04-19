import React, { useContext } from "react";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import PropTypes from "prop-types";
import * as JsonLdUtils from "jsonld-utils";
import { ConfigurationContext } from "../../contexts/ConfigurationContext";
import FormUtils from "../../util/FormUtils";
import Question from "../Question";
import classNames from "classnames";
import IconOverlay from "../IconOverlay.jsx";
import { useIntl } from "react-intl";

const VerticalWizardNav = ({ steps, onNavigate, currentStep }) => {
  const { options } = useContext(ConfigurationContext);
  const intl = useIntl();

  return (
    <div className="wizard-nav col-2 p-0">
      <ListGroup>
        {steps.map((step, index) => (
          <IconOverlay
            id="step-disabled"
            tooltipContent={intl.formatMessage({ id: "wizard.nav.tooltip" })}
            show={!options.enableWizardStepSkip}
          >
            <ListGroupItem
              hidden={options.debugMode ? false : !FormUtils.isRelevant(step)}
              key={"nav" + index}
              onClick={() => onNavigate(index)}
              id={"wizard-nav-" + index}
              action={true}
              active={index === currentStep ? "active" : ""}
              disabled={!options.enableWizardStepSkip}
              variant={"default"}
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
            </ListGroupItem>
          </IconOverlay>
        ))}
      </ListGroup>
    </div>
  );
};

VerticalWizardNav.propTypes = {
  currentStep: PropTypes.number.isRequired,
  steps: PropTypes.array.isRequired,
  onNavigate: PropTypes.func.isRequired,
};

export default VerticalWizardNav;
