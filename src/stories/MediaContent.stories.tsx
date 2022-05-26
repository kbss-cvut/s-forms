import React from "react";
import MediaContent from "../components/MediaContent";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { ConfigurationContextProvider } from "../contexts/ConfigurationContext";

const question = {
  "@id": "job-9002",
  "@type": "doc:question",
  "http://www.w3.org/2000/01/rdf-schema#label": "Job",
  "http://onto.fel.cvut.cz/ontologies/form/has-media-content": [
    "https://www.youtube.com/embed/yzXRaJCZdFI",
    "https://www.youtube.com/watch?v=yzXRaJCZdFI",
    "https://drive.google.com/file/d/1C8vvDQX90vFDno0HpUCUNmVhW1_EchaX/preview",
    "https://drive.google.com/file/d/1ItZqsUm82nKW4ZqvKaiGUn202NEF79FC/view?usp=sharing",
    "https://drive.google.com/file/d/1ItZqsUm82nKW4ZqvKaiGUn202NEF79FC/preview",
    "https://medecine.univ-lorraine.fr/sites/medecine.univ-lorraine.fr/files/users/documents/schema-etudes.png",
  ],
};

export default {
  title: "Components/MediaContent",
  component: MediaContent,
} as ComponentMeta<typeof MediaContent>;

const Template: ComponentStory<typeof MediaContent> = (
  args,
  { globals: { unifyMediaContent } }
) => {
  const options = {
    unifyMediaContent: unifyMediaContent,
  };
  return (
    <ConfigurationContextProvider options={options}>
      <MediaContent {...args} />
    </ConfigurationContextProvider>
  );
};

export const Default = Template.bind({});
Default.args = {
  question: question,
};
