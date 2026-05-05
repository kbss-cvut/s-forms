import React from "react";
import HintIcon from "../components/HintIcon";
import { ComponentMeta, ComponentStory } from "@storybook/react";

export default {
  title: "Components/HintIcon",
  component: HintIcon,
  argTypes: {
    overlayPlacement: {
      options: ["left", "right", "bottom", "top"],
      control: { type: "radio" },
      defaultValue: "right",
    },
  },
} as ComponentMeta<typeof HintIcon>;

const Template: ComponentStory<typeof HintIcon> = (args) => {
  return <HintIcon {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  text: "Reveal the correct answer.",
};

export const LongText = Template.bind({});
LongText.args = {
  text: "This hint reveals the correct answer for the question. Use it only when you want to check your solution.",
};
