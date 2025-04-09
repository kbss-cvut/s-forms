import React from "react";
import { cleanup, render, waitFor } from "@testing-library/react";
import { composeStories } from "@storybook/testing-react";
import { fireEvent } from "@storybook/testing-library";
import { expect } from "@storybook/jest";
import { IntlProvider, useIntl } from "react-intl";

import * as stories from "../../src/stories/QuestionCommentIcon.stories";

describe("QuestionCommentIcon", () => {
  afterEach(() => {
    cleanup();
  });

  const { Default, WithComment } = composeStories(stories);

  it("should have empty comment list", async () => {
    const component = render(
      <IntlProvider locale="en">
        <Default {...Default.args} />
      </IntlProvider>
    );

    fireEvent.click(component.container.querySelector(".comment-bubble"));
    await waitFor(() => {
      expect(component.queryByRole("tooltip")).toBeInTheDocument();
      expect(component.queryByText("Comment")).not.toBeInTheDocument();
    });
  });

  it("should have two comments", async () => {
    const component = render(
      <IntlProvider locale="en">
        <WithComment {...WithComment.args} />
      </IntlProvider>
    );

    fireEvent.click(component.container.querySelector(".comment-bubble"));
    await waitFor(async () => {
      expect(component.queryByRole("tooltip")).toBeInTheDocument();
      const comments = await component.findAllByText("Comment");
      expect(comments).toHaveLength(2);
    });
  });

  it("should show link icon when hover author comment", async () => {
    const component = render(
      <IntlProvider locale="en">
        <WithComment {...WithComment.args} />
      </IntlProvider>
    );

    fireEvent.click(component.container.querySelector(".comment-bubble"));

    await waitFor(async () => {
      const authors = await component.findAllByText("Unknown Author");
      const author = authors[0];

      expect(component.queryByRole("link")).not.toBeInTheDocument();
      fireEvent.mouseOver(author);
      expect(component.queryByRole("link")).toBeInTheDocument();
    });
  });

  it("should delete comment when click on recycle bin", async () => {
    const component = render(
      <IntlProvider locale="en">
        <WithComment {...WithComment.args} />
      </IntlProvider>
    );

    fireEvent.click(component.container.querySelector(".comment-bubble"));

    const authors = await component.findAllByText("Unknown Author");
    const author = authors[0];

    expect(
      component.container.querySelector(".comment-delete")
    ).not.toBeInTheDocument();

    fireEvent.mouseOver(author);
    await waitFor(() => {
      expect(
        component.container.querySelector(".comment-delete")
      ).toBeInTheDocument();
      expect(component.queryByTestId("rings-loading")).not.toBeInTheDocument();
    });

    fireEvent.click(component.container.querySelector(".comment-delete"));
    await waitFor(() => {
      expect(component.queryByTestId("rings-loading")).toBeInTheDocument();
    });

    await waitFor(
      () =>
        expect(
          component.queryByTestId("rings-loading")
        ).not.toBeInTheDocument(),
      { timeout: 2000 }
    );

    const comments = await component.findAllByText("Comment");
    await waitFor(() => {
      expect(comments).toHaveLength(1);
    });
  });
});
