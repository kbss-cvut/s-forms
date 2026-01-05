import React from "react";
import MediaContent from "../components/MediaContent";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import questionWithMedia from "./assets/question/questionWithMedia.json";

const question = {
  "@id": "job-9002",
  "@type": "doc:question",
  "http://www.w3.org/2000/01/rdf-schema#label": "Job",

  "http://onto.fel.cvut.cz/ontologies/form/has-media-content": [
    questionWithMedia[
      "http://onto.fel.cvut.cz/ontologies/form/has-media-content"
    ],
    {
      "@id": "asset-image-1",
      "@type": "http://onto.fel.cvut.cz/ontologies/form/media/asset",

      "http://onto.fel.cvut.cz/ontologies/form/media/has-source":
        "https://media.istockphoto.com/id/2152051264/vector/rome-the-coliseum-from-the-palantine-hill.jpg?s=612x612&w=0&k=20&c=Mq_Rm5MfkcQGN5MggUCc35Wj7DGwPZrZXAZRS-7vgm4=",

      "http://onto.fel.cvut.cz/ontologies/form/media/has-annotation": [
        {
          "@id": "annotation-image-polyline-1",
          "@type": "http://onto.fel.cvut.cz/ontologies/form/media/annotation",

          "http://onto.fel.cvut.cz/ontologies/form/media/annotation/has-annotation-type":
            "polyline",

          "http://onto.fel.cvut.cz/ontologies/form/media/annotation/has-geometry-points":
            "0.07,0.35 0.75,0.35 0.75,0.7 0.07,0.7 0.07,0.35",

          "http://onto.fel.cvut.cz/ontologies/form/media/annotation/has-color":
            "#0066f8",
          "http://onto.fel.cvut.cz/ontologies/form/media/annotation/has-stroke-width":
            "4",
          "http://onto.fel.cvut.cz/ontologies/form/media/annotation/has-fill-color":
            "#5690ef",
          "http://onto.fel.cvut.cz/ontologies/form/media/annotation/has-opacity":
            "0.4",
        },

        {
          "@id": "annotation-image-text-1",
          "@type": "http://onto.fel.cvut.cz/ontologies/form/media/annotation",

          "http://onto.fel.cvut.cz/ontologies/form/media/annotation/has-annotation-type":
            "text",

          "http://onto.fel.cvut.cz/ontologies/form/media/annotation/has-geometry-points":
            "0.2,0.6",

          "http://onto.fel.cvut.cz/ontologies/form/media/annotation/has-text":
            "The Colosseum, Rome (1st century AD)",

          "http://onto.fel.cvut.cz/ontologies/form/media/annotation/has-font-size":
            "0.054343",
          "http://onto.fel.cvut.cz/ontologies/form/media/annotation/has-font-weight":
            "600",

          "http://onto.fel.cvut.cz/ontologies/form/media/annotation/has-color":
            "#ff3c00",
        },
      ],
    },
  ],
};

export default {
  title: "Components/MediaContent",
  component: MediaContent,
} as ComponentMeta<typeof MediaContent>;

const Template: ComponentStory<typeof MediaContent> = (args) => {
  return <MediaContent {...args} />;
};

export const Video = Template.bind({});
Video.args = {
  question: questionWithMedia,
};

export const ImageAndVideo = Template.bind({});
ImageAndVideo.args = {
  question: question,
};
