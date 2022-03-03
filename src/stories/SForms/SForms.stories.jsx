import React, { useRef, useState } from "react";
import SForms from "../../components/SForms";
import form1 from "./form1.json"; // form with wizard steps
import form2 from "./form2.json"; // form without wizard steps (proudly assembled in Semantic Form Web Editor)
import possibleValues from "./possibleValues.json";

import queryString from "query-string";
import Constants from "../../constants/Constants";

const getP = (queryParameterName, defaultValue) => {
  return {
    [queryParameterName]: getQueryParameter(queryParameterName, defaultValue),
  };
};

const getQueryParameter = (parameterName, defaultValue) => {
  const value = queryString.parse(window.location.search)[parameterName];
  if (value) {
    return value;
  }
  return defaultValue;
};

const modalProps = {
  onHide: () => {},
  show: true,
  title: "Title",
};

const options = {
  i18n: {
    "wizard.next": "Next",
    "wizard.previous": "Previous",
    "section.expand": "Expand",
    "section.collapse": "Collapse",
  },
  intl: {
    locale: "cs",
  },
  modalView: false,
  modalProps,
  horizontalWizardNav: false,
  wizardStepButtons: true,
  enableForwardSkip: true,
  ...getP("startingQuestionId", "layout-options-65"),
  startingStep: 1,
  debugMode: false,
  users: [
    { id: "http://fel.cvut.cz/people/max-chopart", label: "Max Chopart" },
    {
      id: "http://fel.cvut.cz/people/miroslav-blasko",
      label: "Miroslav Blasko",
    },
  ],
  currentUser: "http://fel.cvut.cz/people/max-chopart",
  icons: [
    {
      id: Constants.ICONS.QUESTION_HELP,
      behavior: Constants.ICON_BEHAVIOR.ENABLE,
    },
    {
      id: Constants.ICONS.QUESTION_LINK,
      behavior: Constants.ICON_BEHAVIOR.ENABLE,
    },
    {
      id: Constants.ICONS.QUESTION_COMMENTS,
      behavior: Constants.ICON_BEHAVIOR.ENABLE,
    },
  ],
};

export default {
  title: "SForms",
  component: SForms,
};

const Template = (args) => {
  const [isFormValid, setIsFormValid] = useState(false);
  const [selectedForm, setSelectedForm] = useState(form1);
  const refForm = useRef();

  const fetchTypeAheadValues = (query) => {
    return new Promise((resolve) =>
        setTimeout(() => resolve(possibleValues), 1500)
    );
  };

  return (
      <div className="p-4">
        <SForms
            {...args}
            ref={refForm}
            form={selectedForm}
            fetchTypeAheadValues={fetchTypeAheadValues}
            isFormValid={(isFormValid) => setIsFormValid(isFormValid)}
        />
        <button
            disabled={!isFormValid}
            style={{
              width: "100px",
              margin: "1rem -50px",
              position: "relative",
              left: "50%",
            }}
            onClick={() => {
              setSelectedForm(selectedForm === form2 ? form1 : form2);
            }}
        >
          Switch form
        </button>
      </div>
  );
}

export const Default = Template.bind({})
Default.args = {
  options: options
}

