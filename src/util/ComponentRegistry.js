import Question from '../components/Question';

let components = [];

export default class ComponentRegistry {

  static registerComponent(component, mapRule) {
    components.push({ component, mapRule });
  }

  static mapComponent(question, index, defaultComponent) {
    for (let { component, mapRule } of components) {
      if (mapRule(question, index)) {
        return component;
      }
    }

    if (defaultComponent !== undefined) {
      return defaultComponent;
    }

    return Question;
  }

}
