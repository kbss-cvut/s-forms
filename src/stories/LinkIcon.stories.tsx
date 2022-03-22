import React from "react";
import LinkIcon from "../components/LinkIcon";
import { ComponentMeta, ComponentStory } from "@storybook/react";

export default {
  title: "Components/LinkIcon",
  component: LinkIcon,
  argTypes: {
    overlayPlacement: {
      options: ["left", "right", "bottom", "top"],
      control: { type: "radio" },
      defaultValue: "right",
    },
  },
} as ComponentMeta<typeof LinkIcon>;

const Template: ComponentStory<typeof LinkIcon> = (args) => {
  return <LinkIcon {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  url: "https://clever-bohr-4e69b7.netlify.app/",
};
