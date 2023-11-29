import React from "react";
import Answer from "../components/Answer";
import { Meta, StoryObj } from "@storybook/react";

import question from "./assets/question/questionWithMedia.json";
import questionTypeahead from "./assets/question/questionTypeHead.json";
import questionTypeaheadWithTree from "./assets/question/simple-single-tree-select.json";
import questionDate from "./assets/question/questionDate.json";
import questionCheckBox from "./assets/question/questionCheckBox.json";
import questionMaskedInput from "./assets/question/questionMaskedInput.json";
import questionSparqlInput from "./assets/question/questionSparqlInput.json";
import questionTurtleInput from "./assets/question/questionTurtleInput.json";

const meta: Meta<typeof Answer> = {
  title: "Components/Answer",
  component: Answer,
  argTypes: {
    onChange: {
      table: {
        disable: true,
      },
    },
    onCommentChange: {
      table: {
        disable: true,
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Answer>;

const Template: Story = {
  args: {
    answer: {},
    onChange: () => {},
    onCommentChange: () => {},
  },
};

export const RegularInput: Story = {
  args: {
    ...Template.args,
    answer: {
      "http://onto.fel.cvut.cz/ontologies/documentation/has_data_value": "",
    },
    question: question,
  },
};

export const Typeahead: Story = {
  args: {
    ...Template.args,
    question: questionTypeahead,
  },
};

export const TypeaheadWithTree: Story = {
  args: {
    ...Template.args,
    question: questionTypeaheadWithTree,
  },
};

export const DateTimePicker: Story = {
  args: {
    ...Template.args,
    question: questionDate,
  },
};

export const CheckBox: Story = {
  args: {
    ...Template.args,
    question: questionCheckBox,
  },
};

export const MaskedInput: Story = {
  args: {
    ...Template.args,
    question: questionMaskedInput,
  },
};

export const SparqlInput: Story = {
  args: {
    ...Template.args,
    question: questionSparqlInput,
  },
};

export const TurtleInput: Story = {
  args: {
    ...Template.args,
    question: questionTurtleInput,
  },
};
