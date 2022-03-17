import React from "react";
import MediaContent from "../components/MediaContent";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import questionWithMedia from "./assets/question/questionWithMedia.json";

export default {
  title: "Components/MediaContent",
  component: MediaContent,
} as ComponentMeta<typeof MediaContent>;

const Template: ComponentStory<typeof MediaContent> = (args) => {
  return <MediaContent {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  question: questionWithMedia,
};
