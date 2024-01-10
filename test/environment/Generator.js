import * as JsonLdUtils from "jsonld-utils";

const _uriBase = "http://onto.fel.cvut.cz/ontologies/forms";

export const getRandomInt = () => {
  const min = 0;
  const bound = Number.MAX_SAFE_INTEGER;
  return Math.floor(Math.random() * (bound - min)) + min;
};

export const getRandomPositiveInt = (min, max) => {
  const bound = max ? max : Number.MAX_SAFE_INTEGER;
  if (min === null || min === undefined) {
    min = 1;
  }
  return Math.floor(Math.random() * (bound - min)) + min;
};

export const getRandomBoolean = () => {
  return Math.random() < 0.5;
};

export const getRandomUri = () => {
  return _uriBase + getRandomInt();
};

export const generateTypeaheadOptions = (value, valueLabel) => {
  const options = [];
  let option;

  for (let i = 0; i < getRandomPositiveInt(3, 10); i++) {
    option = {
      "@id": getRandomUri(),
    };
    option[JsonLdUtils.RDFS_LABEL] = "RandomLabel" + i;
    options.push(option);
  }
  option = {
    "@id": value,
  };
  option[JsonLdUtils.RDFS_LABEL] = valueLabel;
  options.push(option);
  return options;
};
