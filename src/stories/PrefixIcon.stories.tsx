import React from "react";
import PrefixIcon from "../components/PrefixIcon";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { InfoCircle } from "../styles/icons";

export default {
  title: "Components/PrefixIcon",
  component: PrefixIcon,
} as ComponentMeta<typeof PrefixIcon>;

const Template: ComponentStory<typeof PrefixIcon> = (args) => {
  return (
    <PrefixIcon {...args}>
      <InfoCircle />
    </PrefixIcon>
  );
};

export const Default = Template.bind({});
Default.args = {
  prefixes: [
    {
      "@id": "_:b19",
    },
    {
      "@id": "_:b20",
    },
    {
      "@id": "_:b22",
    },
  ],
  iconClass: "help-icon-checkbox",
};
