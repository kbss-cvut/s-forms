export default class Constants {
  // Default bootstrap column count
  static COLUMN_COUNT = 12;
  static INPUT_LENGTH_THRESHOLD = 50;
  static DATETIME_NUMBER_FORMAT = "x";

  static ICONS = {
    QUESTION_COMMENTS: "questionComments",
    QUESTION_HELP: "questionHelp",
    QUESTION_LINK: "questionLink",
  };

  static ICON_BEHAVIOR = {
    ENABLE: "enable",
    DISABLE: "disable",
    ON_HOVER: "onHover",
  };

  // Default form options
  static DEFAULT_OPTIONS = {
    icons: [
      {
        id: Constants.ICONS.QUESTION_HELP,
        behavior: Constants.ICON_BEHAVIOR.ENABLE,
      },
      {
        id: Constants.ICONS.QUESTION_COMMENTS,
        behavior: Constants.ICON_BEHAVIOR.ON_HOVER,
      },
      {
        id: Constants.ICONS.QUESTION_LINK,
        behavior: Constants.ICON_BEHAVIOR.ON_HOVER,
      },
    ],
  };

  static LANG = {
    cs: {
      locale: "cs",
      label: "Čestina",
    },
    en: {
      locale: "en",
      label: "English",
    },
  };

  static VALIDATION_SEVERITY = {
    ERROR: "error",
    WARNING: "warning",
  };
}
