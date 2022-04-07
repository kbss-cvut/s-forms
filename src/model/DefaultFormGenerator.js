export default class DefaultFormGenerator {
  /**
   * Generates default form for the wizard framework.
   *
   * The form consists of a single step, which contains one text area for the description.
   */
  static generateForm() {
    let formTemplate = fetch("./defaultForm.json").then((response) => {
      return response.json();
    });
    // Deep copy of the form template to prevent modifications
    formTemplate = JSON.parse(JSON.stringify(formTemplate));

    return formTemplate;
  }
}
