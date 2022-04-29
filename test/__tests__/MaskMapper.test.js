import MaskMapper from "../../src/util/MaskMapper";

describe("MaskMapper", () => {
  it("maps date/time/datetime masks to numeric input mask", () => {
    const data = [
      {
        mask: "DD-MM-YYYY",
        expected: "11-11-1111",
      },
      {
        mask: "hh:mm:ss",
        expected: "11:11:11",
      },
      {
        mask: "DD/MM/YYYY hh:mm:ss",
        expected: "11/11/1111 11:11:11",
      },
    ];

    data.forEach((d) => {
      expect(MaskMapper.mapMask(d.mask)).toEqual(d.expected);
    });
  });

  it("returns null form null value passed in", () => {
    expect(MaskMapper.mapMask(null)).toBeNull();
  });

  it("returns undefined for undefined passed in", () => {
    expect(MaskMapper.mapMask(undefined)).not.toBeDefined();
  });
});
