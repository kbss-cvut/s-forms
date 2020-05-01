import * as Constants from '../../src/constants/Constants';
import Configuration from '../../src/model/Configuration';
import * as Generator from '../environment/Generator';
import WizardGenerator from '../../src/model/WizardGenerator';
import DefaultFormGenerator from '../../src/model/DefaultFormGenerator';

describe('Default form generator', () => {
  let initWizard;
  let textValue;

  beforeEach(() => {
    initWizard = jest.fn();
    Configuration.initWizard = initWizard;
    Configuration.intl = {
      locale: 'en'
    };
    textValue = 'masterchief';
  });

  it('generates empty one-step wizard as a default form', () => {
    const form = DefaultFormGenerator.generateForm();
    let wizardSteps = null;
    WizardGenerator.createDefaultWizard(null, null, (props) => (wizardSteps = props.steps));

    expect(wizardSteps.length).toEqual(1);
    expect(initWizard).toHaveBeenCalledWith({ root: form['@graph'][0] }, [
      form['@graph'][0][Constants.HAS_SUBQUESTION][0]
    ]);
  });

  it('generates wizard with data for which report with QA was provided', () => {
    const rootQuestion = {
      // form
      subQuestions: [
        {
          // step
          subQuestions: [
            {
              // actuall question
              answers: [
                {
                  textValue: textValue
                }
              ]
            }
          ]
        }
      ]
    };
    const form = DefaultFormGenerator.generateForm(rootQuestion);

    const answer = form['@graph'][0][Constants.HAS_SUBQUESTION][0][Constants.HAS_SUBQUESTION][0][Constants.HAS_ANSWER];
    expect(answer).not.toBeNull();
    expect(answer[Constants.HAS_DATA_VALUE]).toEqual(textValue);
  });

  it('sets IDs of questions and answers from existing form values', () => {
    const formRoot = {
      // form
      uri: Generator.getRandomUri(),
      subQuestions: [
        {
          // step
          uri: Generator.getRandomUri(),
          subQuestions: [
            {
              // actuall question
              uri: Generator.getRandomUri(),
              answers: [
                {
                  uri: Generator.getRandomUri(),
                  textValue: textValue
                }
              ]
            }
          ]
        }
      ]
    };

    const form = DefaultFormGenerator.generateForm(formRoot);
    const rootQuestion = form['@graph'][0];
    expect(rootQuestion['@id']).toEqual(formRoot.uri);
    expect(rootQuestion[Constants.HAS_SUBQUESTION][0]['@id']).toEqual(formRoot.subQuestions[0].uri);
    expect(rootQuestion[Constants.HAS_SUBQUESTION][0][Constants.HAS_SUBQUESTION][0]['@id']).toEqual(
      formRoot.subQuestions[0].subQuestions[0].uri
    );
    expect(
      rootQuestion[Constants.HAS_SUBQUESTION][0][Constants.HAS_SUBQUESTION][0][Constants.HAS_ANSWER]['@id']
    ).toEqual(formRoot.subQuestions[0].subQuestions[0].answers[0].uri);
  });

  it('creates a clone of the form template, so that modifications to the form do not affect the original template', () => {
    const formOne = DefaultFormGenerator.generateForm();
    let formTwo;
    formOne['newAttribute'] = 12345;
    formTwo = DefaultFormGenerator.generateForm();
    expect(formTwo['newAttribute']).not.toBeDefined();
  });
});
