import React from "react";
import MediaContent from "../components/MediaContent";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import questionWithMedia from "./assets/question/questionWithMedia.json";

const question = {
  "@id": "job-9002",
  "@type": "doc:question",
  "http://www.w3.org/2000/01/rdf-schema#label": "Job",
  "http://onto.fel.cvut.cz/ontologies/form/has-media-content": [
    "https://www.youtube.com/embed/yzXRaJCZdFI",
    "https://drive.google.com/file/d/1C8vvDQX90vFDno0HpUCUNmVhW1_EchaX/preview",
    "https://drive.google.com/file/d/1ItZqsUm82nKW4ZqvKaiGUn202NEF79FC/view?usp=sharing",
    "https://drive.google.com/file/d/1ItZqsUm82nKW4ZqvKaiGUn202NEF79FC/preview",
  ],
};

export default {
  title: "Components/MediaContent",
  component: MediaContent,
} as ComponentMeta<typeof MediaContent>;

const Template: ComponentStory<typeof MediaContent> = (args) => {
  return <MediaContent {...args} />;
};

export const YoutubeVideo = Template.bind({});
YoutubeVideo.args = {
  question: questionWithMedia,
};

export const ParsedUrl = Template.bind({});
ParsedUrl.args = {
  question: question,
};

export const PreviewUrl = Template.bind({});
PreviewUrl.args = {
  iFrame: true,
  hardcodedLink:
    "https://drive.google.com/file/d/1ItZqsUm82nKW4ZqvKaiGUn202NEF79FC/preview",
};

export const ViewUrl = Template.bind({});
ViewUrl.args = {
  iFrame: true,
  hardcodedLink:
    "https://drive.google.com/file/d/1ItZqsUm82nKW4ZqvKaiGUn202NEF79FC/view?usp=sharing",
};

export const ExportViewUrl = Template.bind({});
ExportViewUrl.args = {
  iFrame: true,
  hardcodedLink:
    "https://drive.google.com/uc?export=view&id=1ItZqsUm82nKW4ZqvKaiGUn202NEF79FC",
};
