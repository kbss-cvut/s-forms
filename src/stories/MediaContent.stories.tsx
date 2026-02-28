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
      "@id":
        "asset-external-https://a0.anyrgb.com/pngimg/1734/1834/historic-centre-historic-centre-of-rome-ancient-roman-architecture-colosseum-ancient-rome-classical-architecture-historic-site-rome-ancient-history-medieval-architecture-thumbnail.png",
      "@type": "http://onto.fel.cvut.cz/ontologies/form/media/asset",
      "http://onto.fel.cvut.cz/ontologies/form/media/has-source":
        "https://a0.anyrgb.com/pngimg/1734/1834/historic-centre-historic-centre-of-rome-ancient-roman-architecture-colosseum-ancient-rome-classical-architecture-historic-site-rome-ancient-history-medieval-architecture-thumbnail.png",
      "http://onto.fel.cvut.cz/ontologies/form/media/has-annotation": [
        {
          "@id":
            "annotation-external-https://a0.anyrgb.com/pngimg/1734/1834/historic-centre-historic-centre-of-rome-ancient-roman-architecture-colosseum-ancient-rome-classical-architecture-historic-site-rome-ancient-history-medieval-architecture-thumbnail.png-0",
          "@type": "http://onto.fel.cvut.cz/ontologies/form/media/annotation",
          "http://onto.fel.cvut.cz/ontologies/form/media/annotation/has-annotation-type":
            "polyline",
          "http://onto.fel.cvut.cz/ontologies/form/media/annotation/has-start-time": 0,
          "http://onto.fel.cvut.cz/ontologies/form/media/annotation/has-end-time": 0,
          "http://onto.fel.cvut.cz/ontologies/form/media/annotation/has-geometry-points":
            "0.09826589595375723,0.16880341880341881 0.08959537572254335,0.7029914529914529 0.4797687861271676,0.7927350427350427 0.9104046242774566,0.7115384615384616 0.9075144508670521,0.4081196581196581 0.6184971098265896,0.3141025641025641 0.476878612716763,0.344017094017094 0.45664739884393063,0.17735042735042736 0.37572254335260113,0.002136752136752137 0.23699421965317918,0.03205128205128205 0.09826589595375723,0.16880341880341881",
          "http://onto.fel.cvut.cz/ontologies/form/media/annotation/has-color":
            "#00ff00",
          "http://onto.fel.cvut.cz/ontologies/form/media/annotation/has-opacity": 0.71,
          "http://onto.fel.cvut.cz/ontologies/form/media/annotation/has-stroke-width": 0.017341040462427744,
          "http://onto.fel.cvut.cz/ontologies/form/media/annotation/has-fill-color":
            "rgba(0,255,0,0.2)",
        },
        {
          "@id":
            "annotation-external-https://a0.anyrgb.com/pngimg/1734/1834/historic-centre-historic-centre-of-rome-ancient-roman-architecture-colosseum-ancient-rome-classical-architecture-historic-site-rome-ancient-history-medieval-architecture-thumbnail.png-1",
          "@type": "http://onto.fel.cvut.cz/ontologies/form/media/annotation",
          "http://onto.fel.cvut.cz/ontologies/form/media/annotation/has-annotation-type":
            "text",
          "http://onto.fel.cvut.cz/ontologies/form/media/annotation/has-start-time": 0,
          "http://onto.fel.cvut.cz/ontologies/form/media/annotation/has-end-time": 0,
          "http://onto.fel.cvut.cz/ontologies/form/media/annotation/has-geometry-points":
            "0.014450867052023121,0.8012820512820513",
          "http://onto.fel.cvut.cz/ontologies/form/media/annotation/has-color":
            "#0029ff",
          "http://onto.fel.cvut.cz/ontologies/form/media/annotation/has-opacity": 1,
          "http://onto.fel.cvut.cz/ontologies/form/media/annotation/has-text":
            "The Colosseum, Rome (1st century AD)",
          "http://onto.fel.cvut.cz/ontologies/form/media/annotation/has-font-size": 0.07692307692307693,
          "http://onto.fel.cvut.cz/ontologies/form/media/annotation/has-font-weight": 900,
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
