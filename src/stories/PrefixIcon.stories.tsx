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
      "shacl:prefix": "form-ecc-lib",
      "@type": "shacl:PrefixDeclaration",
      "shacl:namespace": "http://onto.fel.cvut.cz/ontologies/aviation/eccairs-form-lib/",
    },
    {
      "shacl:prefix": "form-ecc-cfg-0.2",
      "shacl:namespace": "http://onto.fel.cvut.cz/ontologies/aviation/eccairs-form-config-0.2/",
      "@id": "_:b20",
      "@type": "shacl:PrefixDeclaration"
    },
    {
      "@type": "shacl:PrefixDeclaration",
      "@id": "_:b22",
      "shacl:namespace": "http://www.semanticweb.org/owl/owlapi/turtle#",
      "shacl:prefix": "turtle"
    },
  ],
  iconClass: "help-icon-checkbox",
};
