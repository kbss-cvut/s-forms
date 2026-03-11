const CORRECT_CLASS = "select-correct";
const INCORRECT_CLASS = "select-incorrect";

export const applySelectFeedback = (selectEl, isCorrect) => {
  if (!selectEl) return;
  selectEl.classList.remove(CORRECT_CLASS, INCORRECT_CLASS);
  selectEl.classList.add(isCorrect ? CORRECT_CLASS : INCORRECT_CLASS);
};

export const evaluateSelectAnswer = (answerValue, correctValue) => {
  if (!correctValue) return null;
  return answerValue.trim() === correctValue.trim() ? "correct" : "incorrect";
};
