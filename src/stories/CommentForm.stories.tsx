import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import IntlContextProvider from "../contexts/IntlContextProvider";

import CommentForm from "../components/comment/CommentForm";

export default {
  title: "Components/CommentForm",
  component: CommentForm,
} as ComponentMeta<typeof CommentForm>;

const Template: ComponentStory<typeof CommentForm> = (
  args,
  { globals: { locale } }
) => {
  return (
    <IntlContextProvider locale={locale}>
      <CommentForm {...args} />
    </IntlContextProvider>
  );
};

export const Default = Template.bind({});
