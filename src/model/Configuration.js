let intl = null;

export default class Configuration {
  static get intl() {
    return intl;
  }

  static set intl(value) {
    intl = value;
  }
}
