import JsonLdUtils from 'jsonld-utils';

import * as Constants from '../../src/constants/Constants';
import * as Generator from '../environment/Generator';
import QuestionAnswerProcessor from '../../src/model/QuestionAnswerProcessor';

describe('Question answer processor', () => {
  it('transforms answers for a question', () => {
    const question = {};
    generateAnswers(question);
    const result = QuestionAnswerProcessor.processQuestionAnswerHierarchy(question);
    verifyAnswers(question, result);
  });

  function generateAnswers(question) {
    question[Constants.HAS_ANSWER] = [];
    for (let i = 0; i < Generator.getRandomPositiveInt(1, 5); i++) {
      const codeValue = Generator.getRandomBoolean();
      const answer = {};
      answer['@id'] = Generator.getRandomUri();
      answer[Constants.HAS_ANSWER_ORIGIN] = Generator.getRandomUri();
      if (codeValue) {
        answer[Constants.HAS_OBJECT_VALUE] = {
          '@id': Generator.getRandomUri()
        };
      } else {
        answer[Constants.HAS_DATA_VALUE] = {
          '@value': i
        };
      }
      question[Constants.HAS_ANSWER].push(answer);
    }
  }

  function verifyAnswers(expectedQuestion, actualQuestion) {
    if (!expectedQuestion[Constants.HAS_ANSWER]) {
      return;
    }
    expect(actualQuestion.answers).toBeDefined();
    expect(actualQuestion.answers.length).toEqual(expectedQuestion[Constants.HAS_ANSWER].length);

    for (let i = 0; i < actualQuestion.answers.length; i++) {
      expect(actualQuestion.answers[i].uri).toEqual(expectedQuestion[Constants.HAS_ANSWER][i]['@id']);

      if (expectedQuestion[Constants.HAS_ANSWER][i][Constants.HAS_DATA_VALUE]) {
        expect(actualQuestion.answers[i].textValue).toEqual(
          expectedQuestion[Constants.HAS_ANSWER][i][Constants.HAS_DATA_VALUE]['@value']
        );
      } else {
        expect(actualQuestion.answers[i].codeValue).toEqual(
          expectedQuestion[Constants.HAS_ANSWER][i][Constants.HAS_OBJECT_VALUE]['@id']
        );
      }
    }
  }

  it('transforms hierarchy of questions and answers', () => {
    const question = generateQuestions();
    const result = QuestionAnswerProcessor.processQuestionAnswerHierarchy(question);

    verifyQuestions(question, result);
  });

  function generateQuestions() {
    const question = {};
    question['@id'] = Generator.getRandomUri();
    question[JsonLdUtils.RDFS_LABEL] = 'Test0';
    question[JsonLdUtils.RDFS_COMMENT] = 'Test0 Comment';
    question[Constants.HAS_QUESTION_ORIGIN] = Generator.getRandomUri();
    question[Constants.HAS_SUBQUESTION] = [];
    for (let i = 0; i < Generator.getRandomPositiveInt(1, 5); i++) {
      question[Constants.HAS_SUBQUESTION].push(generateSubQuestions(0, 5));
    }
    return question;
  }

  function generateSubQuestions(depth, maxDepth) {
    const question = {};
    question['@id'] = Generator.getRandomUri();
    question[Constants.HAS_QUESTION_ORIGIN] = Generator.getRandomUri();
    question[JsonLdUtils.RDFS_LABEL] = 'Test' + Generator.getRandomInt();
    question[JsonLdUtils.RDFS_COMMENT] = 'Test Comment';
    if (depth < maxDepth) {
      question[Constants.HAS_SUBQUESTION] = [];
      for (let i = 0; i < Generator.getRandomPositiveInt(1, 5); i++) {
        question[Constants.HAS_SUBQUESTION].push(generateSubQuestions(depth + 1, maxDepth));
      }
    }
    generateAnswers(question);
    return question;
  }

  function verifyQuestions(expected, actual) {
    expect(actual.uri).toEqual(expected['@id']);
    verifyAnswers(expected, actual);
    if (expected[Constants.HAS_SUBQUESTION]) {
      expect(actual.subQuestions).toBeDefined();
      expect(actual.subQuestions.length).toEqual(expected[Constants.HAS_SUBQUESTION].length);
      for (let i = 0; i < actual.subQuestions.length; i++) {
        verifyQuestions(expected[Constants.HAS_SUBQUESTION][i], actual.subQuestions[i]);
      }
    }
  }

  it('Stores origin of questions', () => {
    const question = generateQuestions();
    const result = QuestionAnswerProcessor.processQuestionAnswerHierarchy(question);

    verifyPresenceOfQuestionOrigin(question, result);
  });

  function verifyPresenceOfQuestionOrigin(expected, actual) {
    expect(actual.origin).toBeDefined();
    expect(actual.origin).toEqual(expected[Constants.HAS_QUESTION_ORIGIN]);
    if (expected[Constants.HAS_SUBQUESTION]) {
      for (let i = 0; i < actual.subQuestions.length; i++) {
        verifyQuestions(expected[Constants.HAS_SUBQUESTION][i], actual.subQuestions[i]);
      }
    }
  }

  it('Stores origin of answers', () => {
    const question = {};
    generateAnswers(question);
    const result = QuestionAnswerProcessor.processQuestionAnswerHierarchy(question);
    verifyPresenceOfAnswerOrigin(question, result);
  });

  function verifyPresenceOfAnswerOrigin(actualQuestion, expectedQuestion) {
    if (!expectedQuestion[Constants.HAS_ANSWER]) {
      return;
    }
    expect(actualQuestion.answers).toBeDefined();
    expect(actualQuestion.answers.length).toEqual(expectedQuestion[Constants.HAS_ANSWER].length);
    for (let i = 0; i < actualQuestion.answers.length; i++) {
      expect(actualQuestion.answers[i].origin).toEqual(
        expectedQuestion[Constants.HAS_ANSWER][i][Constants.HAS_ANSWER_ORIGIN]
      );
    }
  }

  it('builds QAM from the specified questions and answers, including form root', () => {
    const data = {
      root: {}
    };
    const questions = [generateQuestions()];
    data.root['@id'] = Generator.getRandomUri();
    data.root[Constants.HAS_QUESTION_ORIGIN] = Generator.getRandomUri();

    const result = QuestionAnswerProcessor.buildQuestionAnswerModel(data, questions);
    expect(result.uri).toEqual(data.root['@id']);
    expect(result.origin).toEqual(data.root[Constants.HAS_QUESTION_ORIGIN]);
    expect(result.subQuestions.length).toEqual(1);
    verifyQuestions(questions[0], result.subQuestions[0]);
  });
});
