import React from "react";
import * as JsonLdUtils from "jsonld-utils";
import Constants from "../../../constants/Constants";

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
