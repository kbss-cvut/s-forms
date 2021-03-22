import Question from '../components/Question';
import WizardStep from '../components/wizard/WizardStep';

let components = [];
let wizardSteps = [];

export default class ComponentRegistry {

  static registerComponent(component, mapRule) {
    components.push({ component, mapRule });
  }

  static registerWizardStep(component, mapRule) {
    wizardSteps.push({ component, mapRule });
  }

  static mapQuestion(question, index) {

    for (let { component, mapRule } of components) {
      if (mapRule(question, index)) {
        return component;
      }
    }

    return Question;
  }

  static mapWizardStep(step) {

    for (let { component, mapRule } of wizardSteps) {
      if (mapRule(step)) {
        return component;
      }
    }

    return WizardStep;
  }

}