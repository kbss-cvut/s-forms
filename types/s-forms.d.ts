import { FunctionComponent, ReactElement } from 'react';

/* Temporary version */
export interface Question {
  [x: string]: any;
}
export interface Answer {
  [x: string]: any;
}

export module Constants {
  const COLUMN_COUNT,
    INPUT_LENGTH_THRESHOLD,
    DATETIME_NUMBER_FORMAT,
    FORM,
    HAS_SUBQUESTION,
    HAS_ANSWER,
    HAS_OPTION,
    HAS_OPTIONS_QUERY,
    HAS_VALUE_TYPE,
    IS_DISABLED,
    INPUT_MASK,
    LAYOUT_CLASS,
    LAYOUT: {
      FORM;
      QUESTION_TYPEAHEAD;
      QUESTION_SECTION;
      WIZARD_STEP;
      DISABLED;
      HIDDEN;
      TEXTAREA;
      DATE;
      TIME;
      DATETIME;
      CHECKBOX;
      ANSWERABLE;
      MASKED_INPUT;
      COLLAPSED;
      SPARQL;
      TURTLE;
    },
    VALUE_TYPE_CODE,
    VALUE_TYPE_TEXT,
    GENERATED_ROW_SIZE,
    HAS_QUESTION_ORIGIN,
    HAS_ANSWER_ORIGIN,
    HAS_DATA_VALUE,
    HAS_OBJECT_VALUE,
    HELP_DESCRIPTION,
    XSD: {
      MAX_EXCLUSIVE;
      MAX_INCLUSIVE;
      MIN_EXCLUSIVE;
      MIN_INCLUSIVE;
      INT;
      INTEGER;
      NEGATIVE_INTEGER;
      NON_NEGATIVE_INTEGER;
      NON_POSITIVE_INTEGER;
      POSITIVE_INTEGER;
    },
    ACCEPTS_ANSWER_VALUE,
    HAS_DATATYPE,
    HAS_LAYOUT_CLASS,
    HAS_POSSIBLE_VALUES_QUERY,
    HAS_REQUIRED_VALUE,
    HAS_TESTED_QUESTION,
    HAS_UNIT,
    HAS_VALID_ANSWER,
    IS_RELEVANT_IF,
    ACCEPTS_VALIDATION_VALUE,
    HAS_VALIDATION_MESSAGE,
    NEGATIVE_CONDITION,
    REQUIRES_ANSWER,
    REQUIRES_ANSWER_DESCRIPTION_IF,
    REQUIRES_ANSWER_IF,
    REQUIRES_ANSWER_VALUE,
    REQUIRES_DESCRIPTION,
    HAS_PRECEDING_QUESTION,
    HAS_MEDIA_CONTENT,
    CONDITION,
    HAS_PATTERN,
    HAS_DECLARED_PREFIX,
    PREFIX,
    NAMESPACE;
}

export class WizardGenerator {
  /**
   * Generates a default, one-step wizard.
   *
   * @param data Optional, data for which the wizard should be generated (i.e. the root question)
   * @param title Optional, title of the wizard
   * @param callback Callback called with wizard steps definitions (an array of one element in this case)
   */
  createDefaultWizard(data, title, callback): void;

  /**
   * Generates wizard steps from the specified data-enriched template.
   * @param structure The wizard structure in JSON-LD
   * @param data Optional, data for which the wizard will be generated (i.e. the root question)
   * @param title Optional, wizard title
   * @param callback Callback called with generated wizard step definitions when ready
   */
  createWizard(structure, data, title, callback): void;

  _constructWizardSteps(structure): void;
}

export class Configuration {
  static intl: any;
  static loadFormOptions: Function;
  static getOptions: Function;
  static initWizard: Function;
  static inputComponent: ReactElement;
  static dateFormat: string;
  static timeFormat: string;
  static dateTimeFormat: string;
  static readOnly: boolean;
}

export class QuestionAnswerProcessor {
  /**
   * Builds question answer model from the specified wizard data.
   * @param wizardData Global wizard data
   * @param stepData Data from individual wizard steps
   */
  buildQuestionAnswerModel(wizardData, stepData): Question;

  /**
   * Transforms the QA hierarchy from JSON-LD-based structure to the object model-based one.
   * @param rootQuestion
   */
  processQuestionAnswerHierarchy(rootQuestion): Question;

  _processQuestion(question): Question;

  processAnswer(answer): Answer;

  /**
   * Generates an empty answer for the specified question
   * @param question
   */
  generateAnswer(question): Answer;
}

export class FormUtils {
  static isForm(structure): boolean;
  static isWizardStep(structure): boolean;
  static isSection(question): boolean;
  static isAnswerable(question): boolean;
  static isTypeahead(question): boolean;
  static getPossibleValuesQuery(question): boolean;
  static isDisabled(question): boolean;
  static isHidden(question): boolean;
  static isTextarea(question, answerValue): boolean;
  static isCalendar(question): boolean;
  static isDate(question): boolean;
  static isTime(question): boolean;
  static isDateTime(question): boolean;
  static isCheckbox(question): boolean;
  static isMaskedInput(question): boolean;
  static isSparqlInput(question): boolean;
  static isTurtleInput(question): boolean;
  static isCollapsed(question): boolean;
  static resolveValue(answer): any;
  static resolveValueObject(answer): any;
  static isRelevant(question): boolean;
  static hasValidationLogic(question): boolean;
  static isValid(question): boolean;
  static testCondition(condition): boolean;
}

export interface HelpIconProps {
  text: string;
  iconClassContainer?: string;
  iconClass?: string;
}

export const HelpIcon: FunctionComponent<HelpIconProps>;
