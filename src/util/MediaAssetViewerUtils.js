// Assumed MIME type for a video whose exact type cannot be determined (an
// extension-less source resolved from the @id, with the Content-Type probe
// unavailable). Video.js needs a type or it reports "No compatible source".
const DEFAULT_VIDEO_TYPE = "video/mp4";

/**
 *
 * Utility class providing helper functions for media asset.
 */
export default class MediaAssetViewerUtils {
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
    if (!source) return;
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
   * Determines the media kind from an asset identifier. MediaCMS-provided
   * assets encode the kind in their `@id`
   * (e.g. `.../media-metadata/video/<id>/asset`), so the kind can be resolved
   * without inspecting the (extension-less) source URL.
   *
   * @param {string} id - Asset `@id`.
   * @returns {{ kind: "video" | "image", type: string | null } | null}
   */
  static getMediaKindFromId(id) {
    if (!id || typeof id !== "string") return null;
    const lower = id.toLowerCase();

    if (/\/video\//.test(lower)) {
      return { kind: "video", type: null };
    }
    if (/\/image\//.test(lower)) {
      return { kind: "image", type: null };
    }
    return null;
  }

  /**
   * Resolves the media kind synchronously from the information available in the
   * form data: the source URL extension first, then the asset `@id` hint.
   * Returns an `iframe` fallback when neither is conclusive.
   *
   * @returns {{ kind: "video" | "image" | "iframe", type: string | null }}
   */
  static getMediaKind(src, id) {
    const byUrl = MediaAssetViewerUtils.getMediaKindFromSource(src);
    if (byUrl && byUrl.kind !== "iframe") {
      return byUrl;
    }
    return MediaAssetViewerUtils.getMediaKindFromId(id) ?? byUrl;
  }

  /**
   * Maps an HTTP Content-Type to a media kind.
   *
   * @param {string|null} contentType - Raw `Content-Type` header value.
   * @returns {{ kind: "video" | "image", type: string | null } | null}
   * The resolved kind, or `null` when the type is not a renderable media type.
   */
  static getMediaKindFromContentType(contentType) {
    if (!contentType) return null;
    const lower = contentType.toLowerCase();

    if (lower.includes("mpegurl")) {
      return { kind: "video", type: "application/x-mpegURL" };
    }
    if (lower.startsWith("image/")) {
      return { kind: "image", type: null };
    }
    if (lower.startsWith("video/")) {
      return { kind: "video", type: lower.split(";")[0].trim() };
    }
    return null;
  }

  /**
   * Reads the `Content-Type` of a source via a lightweight HEAD request.
   * Returns `null` on any failure (network error, CORS, non-OK response).
   */
  static async probeContentType(src) {
    try {
      const res = await fetch(src, { method: "HEAD", credentials: "include" });
      if (!res.ok) return null;
      return res.headers.get("Content-Type");
    } catch (e) {
      return null;
    }
  }

  /**
   * Checks whether a source loads as an image. Works cross-origin without CORS
   * (an `<img>` load is not CORS-gated), so it is a reliable fallback when the
   * Content-Type probe is blocked.
   */
  static probeIsImage(src) {
    return new Promise((resolve) => {
      if (typeof Image === "undefined") {
        resolve(false);
        return;
      }
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = src;
    });
  }

  /**
   * Resolves the media kind for a source. Uses the synchronous hints (URL
   * extension and asset `@id`) first; only when those are inconclusive does it
   * fall back to the response Content-Type and, if that is unavailable (e.g.
   * blocked by CORS), to an image-load probe.
   *
   * @returns {Promise<{ kind: "video" | "image" | "iframe", type: string | null }>}
   */
  static async resolveMediaKind(src, id) {
    const known = MediaAssetViewerUtils.getMediaKind(src, id);

    // A known video without an explicit MIME type (e.g. an extension-less
    // source resolved from the @id) needs its type filled in, otherwise
    // Video.js reports "No compatible source was found for this media".
    if (known && known.kind === "video" && !known.type) {
      const byContentType = MediaAssetViewerUtils.getMediaKindFromContentType(
        await MediaAssetViewerUtils.probeContentType(src)
      );
      return { kind: "video", type: byContentType?.type ?? DEFAULT_VIDEO_TYPE };
    }

    if (known && known.kind !== "iframe") {
      return known;
    }

    const byContentType = MediaAssetViewerUtils.getMediaKindFromContentType(
      await MediaAssetViewerUtils.probeContentType(src)
    );
    if (byContentType) {
      return byContentType;
    }

    if (await MediaAssetViewerUtils.probeIsImage(src)) {
      return { kind: "image", type: null };
    }

    return known;
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

  static stripExpandedLiterals(input) {
    if (Array.isArray(input)) {
      return input.map(MediaAssetViewerUtils.stripExpandedLiterals);
    }

    if (input && typeof input === "object") {
      // Case 1: Typed literal object
      if (
        Object.prototype.hasOwnProperty.call(input, "@value") &&
        Object.keys(input).length <= 2 // usually @value + @type
      ) {
        return MediaAssetViewerUtils.castLiteral(
          input["@value"],
          input["@type"]
        );
      }

      // Case 2: Normal object → recurse
      const result = {};
      for (const key in input) {
        result[key] = MediaAssetViewerUtils.stripExpandedLiterals(input[key]);
      }
      return result;
    }

    return input;
  }

  static castLiteral(value, type) {
    if (!type) return value;

    if (type.includes("#decimal")) {
      return parseFloat(value);
    }

    if (type.includes("#integer")) {
      return parseInt(value, 10);
    }

    if (type.includes("#boolean")) {
      return value === true || value === "true";
    }

    return value;
  }

  /**
   * Normalizes the HAS_MEDIA_CONTENT value into a uniform array of media objects.
   * Accepts:
   * - A plain URL string wrapped into a single-element array with HAS_SOURCE set
   * - An array of strings/objects: strings are wrapped, objects are passed through
   * - A single object is wrapped into a single-element array
   */
  static normalizeMediaContents(mediaContents, hasSourceKey) {
    if (!mediaContents) return [];

    const asArray = Array.isArray(mediaContents)
      ? mediaContents
      : [mediaContents];

    return asArray.map((item) =>
      typeof item === "string" ? { [hasSourceKey]: item } : item
    );
  }
}
