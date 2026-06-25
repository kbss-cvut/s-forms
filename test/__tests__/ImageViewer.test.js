import React from "react";
import { fireEvent, render } from "@testing-library/react";
import "@testing-library/jest-dom";

import ImageViewer from "../../src/components/media/image/ImageViewer";

describe("ImageViewer", () => {
  const src = "https://example.com/picture.png";

  it("renders the image from the given source", () => {
    const { container } = render(<ImageViewer src={src} annotations={[]} />);
    const img = container.querySelector("img");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", src);
  });

  it("renders a fullscreen button and triggers onFullScreen when clicked", () => {
    const onFullScreen = jest.fn();
    const { container } = render(
      <ImageViewer src={src} annotations={[]} onFullScreen={onFullScreen} />
    );

    const button = container.querySelector(".media-fullscreen-button");
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(onFullScreen).toHaveBeenCalledTimes(1);
  });
});
