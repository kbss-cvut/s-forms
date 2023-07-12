import React from "react";
import { cleanup, render } from "@testing-library/react";
import { composeStories } from "@storybook/testing-react";
import { fireEvent } from "@storybook/testing-library";
import { expect } from "@storybook/jest";

import * as stories from "../../src/stories/QuestionCommentIcon.stories";

describe("QuestionCommentIcon", () => {
  afterEach(() => {
    cleanup();
  });

  const { Default, WithComment } = composeStories(stories);

  it("should have empty comment list", async () => {
    const component = render(<Default {...Default.args} />);

    fireEvent.click(component.container.querySelector(".comment-bubble"));
    await expect(component.queryByRole("tooltip")).toBeInTheDocument();
    await expect(component.queryByText("Comment")).not.toBeInTheDocument();
  });

  it("should have two comments", async () => {
    const component = render(<WithComment {...WithComment.args} />);

    fireEvent.click(component.container.querySelector(".comment-bubble"));
    await expect(component.queryByRole("tooltip")).toBeInTheDocument();
    const comments = await component.findAllByText("Comment");
    await expect(comments).toHaveLength(2);
  });

  it("should show link icon when hover author comment", async () => {
    const component = render(<WithComment {...WithComment.args} />);

    fireEvent.click(component.container.querySelector(".comment-bubble"));
    const authors = await component.queryAllByText("Unknown author");
    const author = authors[0];

    await expect(component.queryByRole("link")).not.toBeInTheDocument();
    fireEvent.mouseOver(author);
    await expect(component.queryByRole("link")).toBeInTheDocument();
  });

  it("should delete comment when click on recycle bin", async () => {
    const component = render(<WithComment {...WithComment.args} />);

    fireEvent.click(component.container.querySelector(".comment-bubble"));
    const authors = await component.queryAllByText("Unknown author");
    const author = authors[0];

    await expect(
      component.container.querySelector(".comment-delete")
    ).not.toBeInTheDocument();
    fireEvent.mouseOver(author);
    await expect(
      component.container.querySelector(".comment-delete")
    ).toBeInTheDocument();
    await expect(
      component.queryByTestId("rings-loading")
    ).not.toBeInTheDocument();
    fireEvent.click(component.container.querySelector(".comment-delete"));
    await expect(component.queryByTestId("rings-loading")).toBeInTheDocument();
    await new Promise((resolve) => {
      setTimeout(() => {
        console.log("time is up");
        resolve();
      }, 2000);
    });
    await expect(
      component.queryByTestId("rings-loading")
    ).not.toBeInTheDocument();
    const comments = await component.findAllByText("Comment");
    await expect(comments).toHaveLength(1);
  });
});
