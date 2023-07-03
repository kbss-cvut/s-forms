import React from "react";
import Answer from "../components/Answer";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { preview } from "../../.storybook/preview";

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
  decorators: preview.decorators,
};

const Template: ComponentStory<typeof Answer> = (args) => {
  return (
    <Answer
      {...args}
      answer={{}}
      onChange={() => {}}
      onCommentChange={() => {}}
    />
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
