/**
 *
 * Utility class providing helper functions for media asset.
 */
export default class MediaAssetViewerUtil {
  /**
   * Determines the media kind and MIME type based on the source URL.
   *
   * @param {string} source - Media source URL.
   * @returns {{ kind: "video" | "image" | "iframe", type: string | null }}
   * Object describing the media kind and optional MIME type.
   *
   * @remarks
   * - Video formats are mapped to Video.js-compatible MIME types
   * - Unsupported or unknown formats fall back to iframe rendering
   */
  static getMediaKindFromSource(source) {
    const lower = source.toLowerCase();

    // ---- VIDEO (video.js) ----
    if (lower.includes("m3u8")) {
      return { kind: "video", type: "application/x-mpegURL" };
    }

    if (lower.includes("mp4")) {
      return { kind: "video", type: "video/mp4" };
    }

    if (lower.includes("webm")) {
      return { kind: "video", type: "video/webm" };
    }

    if (lower.includes("mov")) {
      return { kind: "video", type: "video/quicktime" };
    }

    // ---- IMAGE ----
    if (/\b(png|jpg|jpeg|webp|gif|bmp)\b/.test(lower)) {
      return { kind: "image", type: null };
    }

    // ---- FALLBACK ----
    return { kind: "iframe", type: null };
  }

  /**
   * Converts normalized annotation points into viewport pixel coordinates.
   *
   * Input points are expected to be normalized (range 0–1) and encoded as
   * an SVG-compatible string (e.g. "0.1,0.2 0.3,0.4").
   *
   * @param {string} pointsString - Normalized SVG point string.
   * @param {number} mediaWidth - Media viewport width in pixels.
   * @param {number} mediaHeight - Media viewport height in pixels.
   * @returns {string} Denormalized SVG point string in pixel space.
   */
  static denormalizePointsFromStringToString(
    pointsString,
    mediaWidth,
    mediaHeight
  ) {
    return pointsString
      .trim()
      .split(/\s+/)
      .map((pair) => {
        const [nx, ny] = pair.split(",").map(Number);
        return `${nx * mediaWidth},${ny * mediaHeight}`;
      })
      .join(" ");
  }

  /**
   * Parses an SVG-compatible points string into a numeric coordinate array.
   *
   * @param {string} pointsString - SVG point string (e.g. "100,200 300,400").
   * @returns {number[][]} Array of coordinate pairs [[x, y], ...].
   *
   * @remarks
   * - Assumes input is already denormalized into pixel space
   */
  static getArrayPointsFromString(pointsString) {
    return pointsString
      .trim()
      .split(/\s+/)
      .map((pair) => {
        return pair.split(",").map(Number);
      });
  }
}
