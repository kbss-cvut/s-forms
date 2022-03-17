import React from "react";
import Answer from "../components/Answer";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { ConfigurationContextProvider } from "../contexts/ConfigurationContext";
import Constants from "../constants/Constants";
import { FormGenContextProvider } from "../contexts/FormGenContext";

import possibleValues from "./assets/possibleValues.json";
import question from "./assets/question/questionWithMedia.json";
import questionTypeHead from "./assets/question/questionTypeHead.json";
import questionDate from "./assets/question/questionDate.json";
import questionCheckBox from "./assets/question/questionCheckBox.json";
import questionMaskedInput from "./assets/question/questionMaskedInput.json";
import questionSparqlInput from "./assets/question/questionSparqlInput.json";
import questionTurtleInput from "./assets/question/questionTurtleInput.json";

export default {
  title: "Components/Answer",
  component: Answer,
} as ComponentMeta<typeof Answer>;

const Template: ComponentStory<typeof Answer> = (args) => {
  const options = {
    intl: {
      locale: Constants.LANG.cs.locale,
    },
  };

  const fetchTypeAheadValues = () => {
    return new Promise((resolve) =>
      setTimeout(() => resolve(possibleValues), 1500)
    );
  };

  return (
    <FormGenContextProvider fetchTypeAheadValues={fetchTypeAheadValues}>
      <ConfigurationContextProvider options={options}>
        <Answer
          {...args}
          answer={{}}
          onChange={() => {}}
          onCommentChange={() => {}}
        />
      </ConfigurationContextProvider>
    </FormGenContextProvider>
  );
};

export const RegularInput = Template.bind({});
RegularInput.args = {
  answer: {
    "http://onto.fel.cvut.cz/ontologies/documentation/has_data_value": "",
  },
  question: question,
};

export const TypeHead = Template.bind({});
TypeHead.args = {
  question: questionTypeHead,
};

export const DateTimePicker = Template.bind({});
DateTimePicker.args = {
  question: questionDate,
};

export const CheckBox = Template.bind({});
CheckBox.args = {
  question: questionCheckBox,
};

export const MaskedInput = Template.bind({});
MaskedInput.args = {
  question: questionMaskedInput,
};

export const SparqlInput = Template.bind({});
SparqlInput.args = {
  question: questionSparqlInput,
};

export const TurtleInput = Template.bind({});
TurtleInput.args = {
  question: questionTurtleInput,
};