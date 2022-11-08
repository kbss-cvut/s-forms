import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { ConfigurationContextProvider } from "../contexts/ConfigurationContext";

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
    <>
      <ConfigurationContextProvider
        options={{
          intl: {
            locale: locale,
          },
        }}
      >
        <CommentForm {...args} />
      </ConfigurationContextProvider>
    </>
  );
};

export const Default = Template.bind({});
