const REPLACEMENTS = {
  D: "1",
  M: "1",
  Y: "1",
  h: "1",
  m: "1",
  s: "1",
};

export default class MaskMapper {
  /**
   * Attempts to map regular mask (e.g. date) to the format supported by inputmask-core.
   *
   * E.g. it maps (DD-MM-YYYY) to 11-11-1111.
   *
   * If an unsupported mask character is encountered, it is simply skipped. Datetime masks are processed according to
   * ISO 8601 acronyms (e.g. M for month and m for minute).
   * @param mask The mask to map
   */
  static mapMask(mask) {
    if (!mask) {
      return mask;
    }
    let result = "",
      character;
    for (let i = 0, len = mask.length; i < len; i++) {
      character = mask.charAt(i);
      result += REPLACEMENTS[character] ? REPLACEMENTS[character] : character;
    }
    return result;
  }
}
