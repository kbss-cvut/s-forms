import * as JsonLdUtils from "jsonld-utils";
import Constants from "../../../constants/Constants";

/**
 * Finds an option object from HAS_OPTION list by its @id.
 */
export const findOptionById = (options = [], id) =>
  options.find((o) => o["@id"] === id) ?? null;

/**
 * Resolves an option @id to its label string.
 * Falls back to the raw id if no matching option is found.
 */
export const resolveOptionLabel = (options = [], id) => {
  const option = findOptionById(options, id);
  return option
    ? JsonLdUtils.getJsonAttValue(option, Constants.RDFS_LABEL)
    : id;
};
