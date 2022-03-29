import React, { useContext } from "react";
import Question from "../components/Question";
import { ComponentMeta, ComponentStory } from "@storybook/react";

const questionExpanded = {
  "@id":
    "http://onto.fel.cvut.cz/ontologies/eccairs/model/instance#instance-1223764187-q",
  "@type": "doc:question",
  "http://onto.fel.cvut.cz/ontologies/documentation/has_answer": {
    "@id":
      "http://onto.fel.cvut.cz/ontologies/eccairs/model/instance#instance-636079211-a",
    "http://onto.fel.cvut.cz/ontologies/documentation/has_data_value": "test",
  },
  "http://onto.fel.cvut.cz/ontologies/form/has-origin-type":
    "http://onto.fel.cvut.cz/ontologies/eccairs/aviation-3.4.0.2/a-453",
  "http://onto.fel.cvut.cz/ontologies/form/has-template-origin":
    "http://onto.fel.cvut.cz/ontologies/eccairs/model/instance#instance-1223764187",
  "http://onto.fel.cvut.cz/ontologies/form/has-template":
    "http://onto.fel.cvut.cz/ontologies/eccairs/aviation-3.4.0.2/a-453-qt",
  "http://www.w3.org/2000/01/rdf-schema#comment": {
    "@language": "en",
    "@value":
      "The identification of the entity or organisation that is responsible for the report.",
  },
  "http://www.w3.org/2000/01/rdf-schema#label": {
    "@language": "en",
    "@value": "453 - Responsible entity",
  },
  "http://onto.fel.cvut.cz/ontologies/form-layout/has-layout-class": "section",
};
const questionCollapsed = {
  "@id":
    "http://onto.fel.cvut.cz/ontologies/eccairs/model/instance#instance-1223764187-q",
  "@type": "doc:question",
  "http://onto.fel.cvut.cz/ontologies/documentation/has_answer": {
    "@id":
      "http://onto.fel.cvut.cz/ontologies/eccairs/model/instance#instance-636079211-a",
    "http://onto.fel.cvut.cz/ontologies/documentation/has_data_value": "test",
  },
  "http://onto.fel.cvut.cz/ontologies/form/has-origin-type":
    "http://onto.fel.cvut.cz/ontologies/eccairs/aviation-3.4.0.2/a-453",
  "http://onto.fel.cvut.cz/ontologies/form/has-template-origin":
    "http://onto.fel.cvut.cz/ontologies/eccairs/model/instance#instance-1223764187",
  "http://onto.fel.cvut.cz/ontologies/form/has-template":
    "http://onto.fel.cvut.cz/ontologies/eccairs/aviation-3.4.0.2/a-453-qt",
  "http://www.w3.org/2000/01/rdf-schema#comment": {
    "@language": "en",
    "@value":
      "The identification of the entity or organisation that is responsible for the report.",
  },
  "http://www.w3.org/2000/01/rdf-schema#label": {
    "@language": "en",
    "@value": "453 - Responsible entity",
  },
  "http://onto.fel.cvut.cz/ontologies/form-layout/has-layout-class": [
    "section",
    "collapsed",
  ],
};

export default {
  title: "Components/Question",
  component: Question,
} as ComponentMeta<typeof Question>;

const Template: ComponentStory<typeof Question> = (args) => {
  return <Question {...args} onChange={{}} />;
};

export const CollapsedQuestion = Template.bind({});
CollapsedQuestion.args = {
  question: questionCollapsed,
};
export const ExpandedQuestion = Template.bind({});
ExpandedQuestion.args = {
  question: questionExpanded,
};
