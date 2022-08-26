import React from "react";
import Question from "../../src/components/Question";
import { cleanup, render } from "@testing-library/react";
import { composeStories } from "@storybook/testing-react";
import { expect } from "@storybook/jest";
import * as stories from "../../src/stories/Question.stories";

describe("Question", () => {
  afterEach(() => {
    cleanup();
  });

  const {
    HiddenQuestion,
    ShowHiddenQuestion,
    CollapsedQuestion,
    ExpandedQuestion,
    HiddenQuestionWithDebugModeOn,
  } = composeStories(stories);

  it("renders section collapsed when layout class is set to collapsed", () => {
    const component = render(<CollapsedQuestion {...CollapsedQuestion.args} />);
    const expandedSection =
      component.container.getElementsByClassName("collapse show");

    expect(expandedSection).toHaveLength(0);
  });

  it("renders section by default expanded", () => {
    const component = render(<ExpandedQuestion {...ExpandedQuestion.args} />);
    const expandedSectionElement =
      component.container.getElementsByClassName("collapse show");

    expect(expandedSectionElement).toHaveLength(1);
  });

  it("does not render hidden question when debug mode is off", () => {
    const component = render(<HiddenQuestion {...HiddenQuestion.args} />);
    const hiddenQuestionElement = component.queryByText("Hidden question");

    expect(hiddenQuestionElement).not.toBeInTheDocument();
  });

  it("renders irrelevant question when debug mode is on with irrelevant styling", () => {
    const component = render(
      <HiddenQuestionWithDebugModeOn {...HiddenQuestionWithDebugModeOn.args} />
    );
    const hiddenQuestionElement = component.queryByText("Hidden question");
    const irrelevantSectionElement =
      component.container.getElementsByClassName("show-irrelevant");

    expect(hiddenQuestionElement).toBeInTheDocument();
    expect(irrelevantSectionElement).toHaveLength(1);
  });

  it("renders hidden-question when relevant with regular styling", () => {
    const component = render(
      <ShowHiddenQuestion {...ShowHiddenQuestion.args} />
    );
    const hiddenQuestionElement = component.queryByText("Hidden question");
    const irrelevantSectionElement =
      component.container.getElementsByClassName("show-irrelevant");

    expect(hiddenQuestionElement).toBeInTheDocument();
    expect(irrelevantSectionElement).toHaveLength(0);
  });
});
