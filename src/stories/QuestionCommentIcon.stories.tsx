import React from "react";
import QuestionCommentIcon from "../components/comment/QuestionCommentIcon";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import IntlContextProvider from "../contexts/IntlContextProvider";
import Constants from "../constants/Constants";
import { ConfigurationContextProvider } from "../contexts/ConfigurationContext";

import question from "./assets/question/question.json";
import questionWithComment from "./assets/question/questionWithComment.json";

export default {
  title: "Components/QuestionCommentIcon",
  component: QuestionCommentIcon,
} as ComponentMeta<typeof QuestionCommentIcon>;

const options = {
  intl: {
    locale: Constants.LANG.en.locale,
  },
  users: [
    { id: "http://fel.cvut.cz/people/max-chopart", label: "Max Chopart" },
    {
      id: "http://fel.cvut.cz/people/miroslav-blasko",
      label: "Miroslav Blasko",
    },
  ],
  currentUser: "http://fel.cvut.cz/people/max-chopart",
};

const Template: ComponentStory<typeof QuestionCommentIcon> = (args) => {
  return (
    <ConfigurationContextProvider options={options}>
      <IntlContextProvider locale={args.options.intl.locale}>
        <QuestionCommentIcon {...args} />
      </IntlContextProvider>
    </ConfigurationContextProvider>
  );
};

export const Default = Template.bind({});
Default.args = {
  question: question,
  options: options,
};

export const WithComment = Template.bind({});
WithComment.args = {
  question: questionWithComment,
  options: options,
};
