import * as JsonLdUtils from "jsonld-utils";
import Constants from "../../../constants/Constants.js";
import Utils from "../../../util/Utils.js";
import JsonLdObjectUtils from "../../../util/JsonLdObjectUtils.js";

export const processTypeaheadOptions = (options, intl) => {
  if (!options?.length) return [];

  options.sort(JsonLdObjectUtils.getCompareLocalizedLabelFunction(intl));
  JsonLdObjectUtils.orderPreservingToplogicalSort(
    options,
    Constants.HAS_PRECEDING_VALUE
  );

  return options;
};

export const buildOptionsTree = (possibleValues, intl) => {
  if (!possibleValues) return [];

  const sorted = processTypeaheadOptions(possibleValues, intl);
  const options = {};
  const relations = [];

  for (const pValue of sorted) {
    const label = JsonLdUtils.getLocalized(pValue[Constants.RDFS_LABEL], intl);
    const description = JsonLdUtils.getLocalized(
      pValue[Constants.RDFS_COMMENT],
      intl
    );

    options[pValue["@id"]] = {
      id: pValue["@id"],
      value: pValue["@id"],
      label,
      description,
      children: [],
    };

    for (const parent of Utils.asArray(pValue[Constants.BROADER])) {
      relations.push({ parent: parent["@id"], child: pValue["@id"] });
    }
  }

  for (const { parent, child } of relations) {
    options[parent]?.children.push(child);
  }

  return Object.values(options);
};
