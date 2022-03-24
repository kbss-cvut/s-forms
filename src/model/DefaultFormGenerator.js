import formTemplate from "./defaultForm.json"

export default class DefaultFormGenerator {
  /**
   * Generates default form for the wizard framework.
   *
   * The form consists of a single step, which contains one text area for the description.
   */
  static generateForm() {
    // Deep copy of the form template to prevent modifications
    return JSON.parse(JSON.stringify(formTemplate));
  }
}
