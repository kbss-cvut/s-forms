import React from "react";
import HelpIcon from "../components/HelpIcon";
import { ComponentMeta, ComponentStory } from "@storybook/react";

export default {
  title: "Components/HelpIcon",
  component: HelpIcon,
  argTypes: {
    overlayPlacement: {
      options: ["left", "right", "bottom", "top"],
      control: { type: "radio" },
      defaultValue: "right",
    },
  },
} as ComponentMeta<typeof HelpIcon>;

const Template: ComponentStory<typeof HelpIcon> = (args) => {
  return <HelpIcon {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  text: "You can edit me with the controls below.",
};

export const LongText = Template.bind({});
LongText.args = {
  text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
};
