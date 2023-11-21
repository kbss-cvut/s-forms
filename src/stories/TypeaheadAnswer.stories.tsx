import React from "react";
import TypeaheadAnswer from "../components/answer/TypeaheadAnswer";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import questionExpanded from "./assets/question/questionExpanded.json";
import possibleValues from "./assets/possibleValues.json";
import tree from "./assets/question/simple-single-tree-select.json";

export default {
  title: "Components/TypeaheadAnswer",
  component: TypeaheadAnswer,
} as ComponentMeta<typeof TypeaheadAnswer>;

const Template: ComponentStory<typeof TypeaheadAnswer> = () => {
  return (
    <TypeaheadAnswer
      question={tree}
      answer={tree}
      label={""}
      onChange={() => void undefined}
    />
  );
};

export const TypeaheadAnswerTree = Template.bind({});
