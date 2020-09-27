import jsonld from 'jsonld';
import * as Constants from '../constants/Constants';
import DefaultFormGenerator from './DefaultFormGenerator';
import FormUtils from '../util/FormUtils';
import Logger from '../util/Logger';
import JsonLdFramingUtils from '../util/JsonLdFramingUtils';
import JsonLdObjectUtils from '../util/JsonLdObjectUtils';
import JsonLdObjectMap from '../util/JsonLdObjectMap';

export default class WizardGenerator {
  /**
   * Generates a default, one-step wizard.
   *
   * @param intl Preferred language of questions
   *
   * @return Wizard steps definitions (an array of one element in this case) and form data
   */
  static createDefaultWizard(intl) {
    const defaultFormData = DefaultFormGenerator.generateForm();

    const [steps, form] = WizardGenerator._constructWizardSteps(defaultFormData, intl);

    return [steps, { root: form }];
  }

  /**
   * Generates wizard steps from the specified data-enriched template.
   *
   * @param structure The wizard structure in JSON-LD
   * @param intl Preferred language of questions
   *
   * @return Promise with generated wizard step definitions and form data
   */
  static createWizard(structure, intl) {
    return new Promise((resolve) =>
      jsonld.flatten(structure, {}, null, (err, structure) => {
        let wizardProperties;
        let form;
        if (err) {
          Logger.error(err);
        }
        try {
          const [steps, rootForm] = WizardGenerator._constructWizardSteps(structure, intl);
          form = rootForm;
          wizardProperties = {
            steps
          };
        } catch (e) {
          const [steps, rootForm] = WizardGenerator.createDefaultWizard(intl);
          form = rootForm;
          wizardProperties = {
            steps
          };
        }
        return resolve([wizardProperties, form]);
      })
    );
  }

  static _constructWizardSteps(structure, intl) {
    let form;
    let formElements;
    let id2ObjectMap;
    let stepQuestions = [];

    if (structure['@graph'][0]['@id'] !== undefined) {
      id2ObjectMap = JsonLdFramingUtils.expandStructure(structure); //TODO make as callback

      Object.keys(id2ObjectMap).map((key) => {
        JsonLdObjectMap.putObject(key, id2ObjectMap[key]);
      });
    } else {
      console.warn('default form is constructed.');
    }

    form = structure['@graph'].find((item) => FormUtils.isForm(item));
    formElements = form[Constants.HAS_SUBQUESTION];

    if (!formElements) {
      Logger.error('Could not find any questions in the received data.');
      throw 'No questions in the form';
    }

    stepQuestions = formElements.filter((item) => {
      if (FormUtils.isWizardStep(item) && !FormUtils.isHidden(item)) {
        return true;
      }

      Logger.warn('Item is not a wizard step: ' + item);
      return false;
    });

    if (!stepQuestions.length) {
      Logger.error('Could not find any wizard steps in the received data.');
      throw 'No wizard steps in form';
    }

    // sort by label
    stepQuestions.sort(JsonLdObjectUtils.getCompareLocalizedLabelFunction(intl));

    // sort by property
    JsonLdObjectUtils.orderPreservingToplogicalSort(stepQuestions, Constants.HAS_PRECEDING_QUESTION);

    return [stepQuestions, { root: form }];
  }
}
