import Vocabulary from "../../src/constants/Vocabulary.js";
import * as Generator from "../environment/Generator";
import QuestionAnswerProcessor from "../../src/model/QuestionAnswerProcessor";

describe("Question answer processor", () => {
  it("transforms answers for a question", () => {
    const question = {};
    generateAnswers(question);
    const result =
      QuestionAnswerProcessor.processQuestionAnswerHierarchy(question);
    verifyAnswers(question, result);
  });

  function generateAnswers(question) {
    question[Vocabulary.HAS_ANSWER] = [];
    for (let i = 0; i < Generator.getRandomPositiveInt(1, 5); i++) {
      const codeValue = Generator.getRandomBoolean();
      const answer = {};
      answer["@id"] = Generator.getRandomUri();
      answer[Vocabulary.HAS_ANSWER_ORIGIN] = Generator.getRandomUri();
      if (codeValue) {
        answer[Vocabulary.HAS_OBJECT_VALUE] = {
          "@id": Generator.getRandomUri(),
        };
      } else {
        answer[Vocabulary.HAS_DATA_VALUE] = {
          "@value": i,
        };
      }
      question[Vocabulary.HAS_ANSWER].push(answer);
    }
  }

  function verifyAnswers(expectedQuestion, actualQuestion) {
    if (!expectedQuestion[Vocabulary.HAS_ANSWER]) {
      return;
    }
    expect(actualQuestion.answers).toBeDefined();
    expect(actualQuestion.answers.length).toEqual(
      expectedQuestion[Vocabulary.HAS_ANSWER].length
    );

    for (let i = 0; i < actualQuestion.answers.length; i++) {
      expect(actualQuestion.answers[i].uri).toEqual(
        expectedQuestion[Vocabulary.HAS_ANSWER][i]["@id"]
      );

      if (
        expectedQuestion[Vocabulary.HAS_ANSWER][i][Vocabulary.HAS_DATA_VALUE]
      ) {
        expect(actualQuestion.answers[i].textValue).toEqual(
          expectedQuestion[Vocabulary.HAS_ANSWER][i][Vocabulary.HAS_DATA_VALUE][
            "@value"
          ]
        );
      } else {
        expect(actualQuestion.answers[i].codeValue).toEqual(
          expectedQuestion[Vocabulary.HAS_ANSWER][i][
            Vocabulary.HAS_OBJECT_VALUE
          ]["@id"]
        );
      }
    }
  }

  it("transforms hierarchy of questions and answers", () => {
    const question = generateQuestions();
    const result =
      QuestionAnswerProcessor.processQuestionAnswerHierarchy(question);

    verifyQuestions(question, result);
  });

  function generateQuestions() {
    const question = {};
    question["@id"] = Generator.getRandomUri();
    question[Vocabulary.RDFS_LABEL] = "Test0";
    question[Vocabulary.RDFS_COMMENT] = "Test0 Comment";
    question[Vocabulary.HAS_QUESTION_ORIGIN] = Generator.getRandomUri();
    question[Vocabulary.HAS_SUBQUESTION] = [];
    for (let i = 0; i < Generator.getRandomPositiveInt(1, 5); i++) {
      question[Vocabulary.HAS_SUBQUESTION].push(generateSubQuestions(0, 5));
    }
    return question;
  }

  function generateSubQuestions(depth, maxDepth) {
    const question = {};
    question["@id"] = Generator.getRandomUri();
    question[Vocabulary.HAS_QUESTION_ORIGIN] = Generator.getRandomUri();
    question[Vocabulary.RDFS_LABEL] = "Test" + Generator.getRandomInt();
    question[Vocabulary.RDFS_COMMENT] = "Test Comment";
    if (depth < maxDepth) {
      question[Vocabulary.HAS_SUBQUESTION] = [];
      for (let i = 0; i < Generator.getRandomPositiveInt(1, 5); i++) {
        question[Vocabulary.HAS_SUBQUESTION].push(
          generateSubQuestions(depth + 1, maxDepth)
        );
      }
    }
    generateAnswers(question);
    return question;
  }

  function verifyQuestions(expected, actual) {
    expect(actual.uri).toEqual(expected["@id"]);
    verifyAnswers(expected, actual);
    if (expected[Vocabulary.HAS_SUBQUESTION]) {
      expect(actual.subQuestions).toBeDefined();
      expect(actual.subQuestions.length).toEqual(
        expected[Vocabulary.HAS_SUBQUESTION].length
      );
      for (let i = 0; i < actual.subQuestions.length; i++) {
        verifyQuestions(
          expected[Vocabulary.HAS_SUBQUESTION][i],
          actual.subQuestions[i]
        );
      }
    }
  }

  it("Stores origin of questions", () => {
    const question = generateQuestions();
    const result =
      QuestionAnswerProcessor.processQuestionAnswerHierarchy(question);

    verifyPresenceOfQuestionOrigin(question, result);
  });

  function verifyPresenceOfQuestionOrigin(expected, actual) {
    expect(actual.origin).toBeDefined();
    expect(actual.origin).toEqual(expected[Vocabulary.HAS_QUESTION_ORIGIN]);
    if (expected[Vocabulary.HAS_SUBQUESTION]) {
      for (let i = 0; i < actual.subQuestions.length; i++) {
        verifyQuestions(
          expected[Vocabulary.HAS_SUBQUESTION][i],
          actual.subQuestions[i]
        );
      }
    }
  }

  it("Stores origin of answers", () => {
    const question = {};
    generateAnswers(question);
    const result =
      QuestionAnswerProcessor.processQuestionAnswerHierarchy(question);
    verifyPresenceOfAnswerOrigin(question, result);
  });

  function verifyPresenceOfAnswerOrigin(actualQuestion, expectedQuestion) {
    if (!expectedQuestion[Vocabulary.HAS_ANSWER]) {
      return;
    }
    expect(actualQuestion.answers).toBeDefined();
    expect(actualQuestion.answers.length).toEqual(
      expectedQuestion[Vocabulary.HAS_ANSWER].length
    );
    for (let i = 0; i < actualQuestion.answers.length; i++) {
      expect(actualQuestion.answers[i].origin).toEqual(
        expectedQuestion[Vocabulary.HAS_ANSWER][i][Vocabulary.HAS_ANSWER_ORIGIN]
      );
    }
  }

  it("builds QAM from the specified questions and answers, including form root", () => {
    const data = {
      root: {},
    };
    const questions = [generateQuestions()];
    data.root["@id"] = Generator.getRandomUri();
    data.root[Vocabulary.HAS_QUESTION_ORIGIN] = Generator.getRandomUri();

    const result = QuestionAnswerProcessor.buildQuestionAnswerModel(
      data,
      questions
    );
    expect(result.uri).toEqual(data.root["@id"]);
    expect(result.origin).toEqual(data.root[Vocabulary.HAS_QUESTION_ORIGIN]);
    expect(result.subQuestions.length).toEqual(1);
    verifyQuestions(questions[0], result.subQuestions[0]);
  });
});
