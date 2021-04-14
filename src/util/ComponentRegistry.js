import Question from '../components/Question';

let components = [];

export default class ComponentRegistry {

  static registerComponent(component, mapRule) {
    components.push({ component, mapRule });
  }

  static mapComponent(question, index, def) {
    for (let { component, mapRule } of components) {
      if (mapRule(question, index)) {
        return component;
      }
    }

    if (def !== undefined) {
      return def;
    }

    return Question;
  }

}
