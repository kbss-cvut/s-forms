import Constants from '../../src/constants/Constants';
import FormGenerator from '../../src/model/FormGenerator';
import DefaultFormGenerator from '../../src/model/DefaultFormGenerator';

describe('Default form generator', () => {
  let textValue;

  beforeEach(() => {
    textValue = 'masterchief';
  });

  it('generates empty one-step wizard as a default form', async () => {
    const form = DefaultFormGenerator.generateForm();
    const [formProperties, structure] = await FormGenerator.constructDefaultForm(null);

    expect(formProperties.formQuestions.length).toEqual(1);

    expect(structure).toEqual({ root: form['@graph'][0] });

    expect(formProperties.formQuestions[0][Constants.HAS_SUBQUESTION]).toEqual([
      form['@graph'][0][Constants.HAS_SUBQUESTION][0][Constants.HAS_SUBQUESTION][0]
    ]);
  });

  it('creates a clone of the form template, so that modifications to the form do not affect the original template', () => {
    const formOne = DefaultFormGenerator.generateForm();
    let formTwo;
    formOne['newAttribute'] = 12345;
    formTwo = DefaultFormGenerator.generateForm();
    expect(formTwo['newAttribute']).not.toBeDefined();
  });
});
