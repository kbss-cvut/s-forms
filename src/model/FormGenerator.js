import * as jsonld from "jsonld";
import Vocabulary from "../constants/Vocabulary.js";
import DefaultFormGenerator from "./DefaultFormGenerator";
import FormUtils from "../util/FormUtils";
import Logger from "../util/Logger";
import JsonLdFramingUtils from "../util/JsonLdFramingUtils";
import JsonLdObjectUtils from "../util/JsonLdObjectUtils";
import JsonLdObjectMap from "../util/JsonLdObjectMap";

export default class FormGenerator {
  /**
   * Generates a default form with one-step wizard.
   *
   * @param intl Preferred language of questions
   *
   * @return Form definition (a one-step wizard with one question) and form data
   */
  static constructDefaultForm(intl) {
    const defaultFormData = DefaultFormGenerator.generateForm();

    return FormGenerator._constructFormQuestions(defaultFormData, intl);
  }

  /**
   * Asynchronously generates form definition from the specified data-enriched template.
   *
   * @param {Object} structure The form structure in JSON-LD
   * @param {string} intl Preferred language of questions
   *
   * @return {Promise<Object>} Promise with generated form definition and form data
   */
  static async constructForm(structure, intl) {
    let formProperties;
    let form;
    return jsonld
      .flatten(structure, {})
      .then((flattenedStructure) => {
        try {
          const [formQuestions, rootForm] =
            FormGenerator._constructFormQuestions(flattenedStructure, intl);
          form = rootForm;
          formProperties = {
            formQuestions,
          };
        } catch (e) {
          console.error(
            "Error while constructing form questions from the provided structure:",
            e
          );
        }

        if (!form) {
          const [formQuestions, rootForm] =
            FormGenerator.constructDefaultForm(intl);
          form = rootForm;
          formProperties = {
            formQuestions,
          };
        }
        return [formProperties, form];
      })
      .catch((error) => {
        console.error(
          "Failed to flatten the JSON-LD structure. Expected to transform a nested JSON-LD document into a flattened array of node objects:",
          error
        );
        return [formProperties, form];
      });
  }

  static _constructFormQuestions(structure, intl) {
    let form;
    let formElements;
    let id2ObjectMap;
    let formQuestions = [];

    if (structure["@graph"][0]["@id"] !== undefined) {
      id2ObjectMap = JsonLdFramingUtils.expandStructure(structure); //TODO make as callback

      Object.keys(id2ObjectMap).map((key) => {
        JsonLdObjectMap.putObject(key, id2ObjectMap[key]);
      });
    } else {
      console.warn("default form is constructed.");
    }

    form = structure["@graph"].find((item) => FormUtils.isForm(item));
    formElements = form[Vocabulary.HAS_SUBQUESTION];

    if (!formElements) {
      Logger.error("Could not find any questions in the received data.");
      throw "No questions in the form";
    }

    formQuestions = formElements.filter((item) => {
      if (FormUtils.isWizardStep(item) && !FormUtils.isHidden(item)) {
        return true;
      }

      Logger.warn("Item is not a wizard step: " + item);
      return false;
    });

    if (!formQuestions.length) {
      Logger.log(
        "Could not find any wizard steps in the received data. Building form without steps"
      );

      form[Vocabulary.HAS_SUBQUESTION].forEach((question) =>
        formQuestions.push(question)
      );
    }

    // sort by label
    formQuestions.sort(
      JsonLdObjectUtils.getCompareLocalizedLabelFunction(intl)
    );

    // sort by property
    JsonLdObjectUtils.orderPreservingToplogicalSort(
      formQuestions,
      Vocabulary.HAS_PRECEDING_QUESTION
    );

    return [formQuestions, { root: form }];
  }
}
