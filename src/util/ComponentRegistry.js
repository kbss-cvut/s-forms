let components = [];

export default class ComponentRegistry {

  static registerComponent(component, mapRule) {
    components.push({ component, mapRule });
  }

  static mapQuestion(question, index) {

    for (let { component, mapRule } of components) {
      if (mapRule(question, index)) {
        return component;
      }
    }

    return null;
  }

}