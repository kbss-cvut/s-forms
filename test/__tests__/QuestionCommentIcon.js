import React from "react";
import QuestionCommentIcon from "../../src/components/comment/QuestionCommentIcon";
import { cleanup, render } from "@testing-library/react";
import { composeStories } from "@storybook/testing-react";
import { fireEvent, screen } from "@storybook/testing-library";
import { expect } from "@storybook/jest";

import * as stories from "../../src/stories/QuestionCommentIcon.stories";

describe("QuestionCommentIcon", () => {
    afterEach(() => {
        cleanup();
    });

    const { Default, WithComment } = composeStories(stories);

    it("should have empty comment list", async () => {
        render(<Default {...Default.args} />);

        fireEvent.click(screen.queryByTestId("comment-bubble"));
        await expect(screen.queryByRole("tooltip")).toBeInTheDocument();
        await expect(screen.queryByText("Comment")).not.toBeInTheDocument();
    });

    it("should have two comments", async () => {
        render(<WithComment {...WithComment.args} />);

        fireEvent.click(screen.queryByTestId("comment-bubble"));
        await expect(screen.queryByRole("tooltip")).toBeInTheDocument();
        const comments = await screen.findAllByText("Comment");
        await expect(comments).toHaveLength(2);
    });
});
