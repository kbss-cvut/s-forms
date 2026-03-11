import FormUtils from "../../../util/FormUtils.js";

export const evaluateAnswer = (answerLabel, question) => {
  if (!answerLabel) return null;

  const correctValue = FormUtils.getCorrectAnswerValue(question);
  if (!correctValue) return null;

  return answerLabel.trim() === correctValue.trim() ? "correct" : "incorrect";
};
