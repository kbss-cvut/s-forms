import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import CommentForm from "../components/comment/CommentForm";

export default {
  title: "Components/CommentForm",
  component: CommentForm,
} as ComponentMeta<typeof CommentForm>;

const Template: ComponentStory<typeof CommentForm> = (
  args,
  { globals: { locale } }
) => {
  <CommentForm {...args} />;
};

export const Default = Template.bind({});
