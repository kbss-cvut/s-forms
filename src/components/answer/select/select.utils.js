import * as JsonLdUtils from "jsonld-utils";
import Constants from "../../../constants/Constants";
import React from "react";

export const findOptionById = (options = [], id) =>
  options.find((o) => o["@id"] === id) ?? null;

export const resolveOptionLabel = (options = [], id) => {
  const option = findOptionById(options, id);
  return option
    ? JsonLdUtils.getJsonAttValue(option, Constants.RDFS_LABEL)
    : id;
};

export const generateSelectOptions = (
  options,
  placeholder = "-- Select --"
) => {
  const sorted = [...options].sort((a, b) => {
    const aLabel = JsonLdUtils.getJsonAttValue(a, Constants.RDFS_LABEL);
    const bLabel = JsonLdUtils.getJsonAttValue(b, Constants.RDFS_LABEL);
    return aLabel < bLabel ? -1 : aLabel > bLabel ? 1 : 0;
  });

  const optionEls = sorted.map((option, i) => {
    const label = JsonLdUtils.getJsonAttValue(option, Constants.RDFS_LABEL);
    return (
      <option value={label} key={`opt-${i}`}>
        {label}
      </option>
    );
  });

  return [
    <option value="" key="opt-placeholder" disabled hidden>
      {placeholder}
    </option>,
    ...optionEls,
  ];
};
