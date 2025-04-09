import React from "react";
import { cleanup, render } from "@testing-library/react";
import { composeStories } from "@storybook/testing-react";
import { expect } from "@storybook/jest";
import * as stories from "../../src/stories/Question.stories";
import { IntlProvider } from "react-intl";

describe("Question", () => {
  afterEach(() => {
    cleanup();
  });

  const {
    TestedQuestionIsIrrelevant,
    TestedQuestionIsRelevant,
    CollapsedQuestion,
    ExpandedQuestion,
    TestedQuestionIsIrrelevantWithDebugModeOn,
    QuestionWithoutHeader,
    TestedQuestionIsIrrelevantAndStartingId,
    AnswerableQuestion,
    AnswerableQuestionExpanded,
  } = composeStories(stories);

  it("renders section collapsed when layout class is set to collapsed", () => {
    const component = render(
      <IntlProvider locale="en">
        <CollapsedQuestion {...CollapsedQuestion.args} />
      </IntlProvider>
    );
    const expandedSection =
      component.container.getElementsByClassName("collapse show");

    expect(expandedSection.length).toBeLessThanOrEqual(0);
  });

  it("renders section by default expanded", () => {
    const component = render(
      <IntlProvider locale="en">
        <ExpandedQuestion {...ExpandedQuestion.args} />
      </IntlProvider>
    );
    const expandedSectionElement =
      component.container.getElementsByClassName("collapse show");

    expect(expandedSectionElement.length).toBeGreaterThan(0);
  });

  it("does not render hidden question when debug mode is off", () => {
    const component = render(
      <IntlProvider locale="en">
        <TestedQuestionIsIrrelevant {...TestedQuestionIsIrrelevant.args} />
      </IntlProvider>
    );
    const hiddenQuestionElement = component.queryByText("Hidden question");

    expect(hiddenQuestionElement).not.toBeInTheDocument();
  });

  it("renders irrelevant question when debug mode is on with irrelevant styling", () => {
    const component = render(
      <IntlProvider locale="en">
        <TestedQuestionIsIrrelevantWithDebugModeOn
          {...TestedQuestionIsIrrelevantWithDebugModeOn.args}
        />
      </IntlProvider>
    );
    const hiddenQuestionElement = component.queryByText("Hidden question");
    const irrelevantSectionElement =
      component.container.getElementsByClassName("show-irrelevant");

    expect(hiddenQuestionElement).toBeInTheDocument();
    expect(irrelevantSectionElement.length).toBeGreaterThan(0);
  });

  it("renders hidden question when relevant with regular styling", () => {
    const component = render(
      <IntlProvider locale="en">
        <TestedQuestionIsIrrelevant {...TestedQuestionIsRelevant.args} />
      </IntlProvider>
    );
    const hiddenQuestionElement = component.queryByText("Hidden question");
    const irrelevantSectionElement =
      component.container.getElementsByClassName("show-irrelevant");

    expect(hiddenQuestionElement).toBeInTheDocument();
    expect(irrelevantSectionElement.length).toBeLessThanOrEqual(0);
  });

  it("does not have a header", () => {
    const component = render(
      <IntlProvider locale="en">
        <QuestionWithoutHeader {...QuestionWithoutHeader.args} />
      </IntlProvider>
    );
    const questionHeaderElement =
      component.container.getElementsByClassName("card-header");

    expect(questionHeaderElement.length).toBeLessThanOrEqual(0);
  });

  it("renders irrelevant question when it is the starting-question-id", () => {
    const component = render(
      <IntlProvider locale="en">
        <TestedQuestionIsIrrelevantAndStartingId
          {...TestedQuestionIsIrrelevantAndStartingId.args}
        />
      </IntlProvider>
    );
    const hiddenQuestionElement = component.queryByText("Hidden question");
    const irrelevantSectionElement =
      component.container.getElementsByClassName("show-irrelevant");

    expect(hiddenQuestionElement).toBeInTheDocument();
    expect(irrelevantSectionElement.length).toBeGreaterThan(0);
  });

  it("does not render sub-questions when answerable question is not answered", () => {
    const component = render(
      <IntlProvider locale="en">
        <AnswerableQuestion {...AnswerableQuestion.args} />
      </IntlProvider>
    );
    const expandedSection =
      component.container.getElementsByClassName("collapse show");

    expect(expandedSection.length).toBeLessThanOrEqual(0);
  });

  it("renders sub-question when answerable question is answered", () => {
    const component = render(
      <IntlProvider locale="en">
        <AnswerableQuestionExpanded {...AnswerableQuestionExpanded.args} />
      </IntlProvider>
    );
    const expandedSection =
      component.container.getElementsByClassName("collapse show");

    expect(expandedSection.length).toBeGreaterThan(0);
  });
});
