import MediaAssetViewerUtils from "../../src/util/MediaAssetViewerUtils";

describe("MediaAssetViewerUtils media kind detection", () => {
  // Mimics a mediaCMS asset: an extension-less `/by-id/<id>` source whose kind
  // is only discoverable from the `@id` (or the response Content-Type).
  const cmsVideoSrc = "https://media.example.com/by-id/video-id";
  const cmsVideoId =
    "http://example.com/ontologies/media-metadata/video/video-id/asset";
  const cmsImageSrc = "https://media.example.com/by-id/image-id";
  const cmsImageId =
    "http://example.com/ontologies/media-metadata/image/image-id/asset";

  describe("getMediaKindFromSource", () => {
    it("detects image and video extensions", () => {
      expect(MediaAssetViewerUtils.getMediaKindFromSource("a/b.png").kind).toBe(
        "image"
      );
      expect(MediaAssetViewerUtils.getMediaKindFromSource("a/b.mp4").kind).toBe(
        "video"
      );
    });

    it("falls back to iframe for extension-less mediaCMS URLs", () => {
      expect(
        MediaAssetViewerUtils.getMediaKindFromSource(cmsVideoSrc).kind
      ).toBe("iframe");
      expect(
        MediaAssetViewerUtils.getMediaKindFromSource(cmsImageSrc).kind
      ).toBe("iframe");
    });
  });

  describe("getMediaKindFromId", () => {
    it("reads the kind encoded in the mediaCMS asset @id", () => {
      expect(MediaAssetViewerUtils.getMediaKindFromId(cmsVideoId).kind).toBe(
        "video"
      );
      expect(MediaAssetViewerUtils.getMediaKindFromId(cmsImageId).kind).toBe(
        "image"
      );
    });

    it("returns null when the @id carries no kind", () => {
      expect(MediaAssetViewerUtils.getMediaKindFromId(undefined)).toBeNull();
      expect(
        MediaAssetViewerUtils.getMediaKindFromId("http://example.com/asset")
      ).toBeNull();
    });
  });

  describe("getMediaKind", () => {
    it("resolves extension-less mediaCMS sources via the @id hint", () => {
      expect(
        MediaAssetViewerUtils.getMediaKind(cmsVideoSrc, cmsVideoId).kind
      ).toBe("video");
      expect(
        MediaAssetViewerUtils.getMediaKind(cmsImageSrc, cmsImageId).kind
      ).toBe("image");
    });

    it("prefers the URL extension over the @id hint", () => {
      expect(
        MediaAssetViewerUtils.getMediaKind("a/b.png", cmsVideoId).kind
      ).toBe("image");
    });
  });

  describe("getMediaKindFromContentType", () => {
    it("maps image and video content types", () => {
      expect(
        MediaAssetViewerUtils.getMediaKindFromContentType("image/png").kind
      ).toBe("image");
      const video =
        MediaAssetViewerUtils.getMediaKindFromContentType("video/mp4");
      expect(video.kind).toBe("video");
      expect(video.type).toBe("video/mp4");
    });

    it("returns null for non-media content types", () => {
      expect(
        MediaAssetViewerUtils.getMediaKindFromContentType("text/html")
      ).toBeNull();
      expect(
        MediaAssetViewerUtils.getMediaKindFromContentType(null)
      ).toBeNull();
    });
  });
});
