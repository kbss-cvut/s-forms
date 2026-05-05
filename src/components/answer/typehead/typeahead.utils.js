import * as JsonLdUtils from "jsonld-utils";
import Constants from "../../../constants/Constants.js";
import Utils from "../../../util/Utils.js";
import JsonLdObjectUtils from "../../../util/JsonLdObjectUtils.js";
import FormUtils from "../../../util/FormUtils.js";

const processTypeaheadOptions = (options, intl) => {
  if (options === undefined || !options.length) {
    return [];
  }

  // sort by label
  options.sort(JsonLdObjectUtils.getCompareLocalizedLabelFunction(intl));

  // sort by property
  JsonLdObjectUtils.orderPreservingToplogicalSort(
    options,
    Constants.HAS_PRECEDING_VALUE
  );

  return options;
};

export const buildOptionsTree = (possibleValues, intl) => {
  if (!possibleValues) {
    return [];
  }

  //Sort values
  possibleValues = processTypeaheadOptions(possibleValues, intl);
  const options = {};
  const relations = [];

  for (let pValue of possibleValues) {
    let label = JsonLdUtils.getLocalized(pValue[Constants.RDFS_LABEL], intl);
    let description = JsonLdUtils.getLocalized(
      pValue[Constants.RDFS_COMMENT],
      intl
    );

    options[pValue["@id"]] = {
      id: pValue["@id"],
      value: pValue["@id"],
      label: label,
      description: description,
      children: [],
    };
    for (let parent of Utils.asArray(pValue[Constants.BROADER])) {
      relations.push({
        type: "parent-child",
        parent: parent["@id"],
        child: pValue["@id"],
      });
    }
  }

  for (let relation of relations) {
    if (relation.type === "parent-child") {
      options[relation.parent]?.children.push(relation.child);
    }
  }

  return Object.values(options);
};

export const evaluateAnswer = (answerLabel, question) => {
  if (!answerLabel) return null;

  const correctValue = FormUtils.getCorrectAnswerValue(question);
  if (!correctValue) return null;

  return answerLabel.trim() === correctValue.trim() ? "correct" : "incorrect";
};
