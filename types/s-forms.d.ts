import * as React from 'react';
import { Modal } from 'react-bootstrap';
import { JsonLdObj } from 'jsonld/jsonld-spec';

export interface SOptions {
  intl?: { locale: string }; // default 'en'
  i18n?: {
    'wizard.next': string; // default 'Next'
    'wizard.previous': string; // default 'Previous'
  };
  modalView?: boolean; // default false
  modalProps?: Modal;
  horizontalWizardNav?: boolean; // default true
  wizardStepButtons?: boolean; // default true
  enableForwardSkip?: boolean; // default false
  startingStep?: number; // default 0; indexed from 0
  startingQuestionId?: string; // default undefined; overrides startingStep
}

export interface SComponents {
  inputComponent?: React.ElementType;
}

export interface SComponentsOptions {
  dateTimeAnswer?: {
    dateFormat: string; // default 'yyyy-MM-dd'
    timeFormat: string; // default 'HH:mm:ss'
    dateTimeFormat: string; // default 'yyyy-MM-dd HH:mm:ss'
  };
  readOnly?: boolean; // default false
}

export interface SFormsProps {
  form: object;
  formData?: object;
  options?: SOptions;
  components?: SComponents;
  componentsOptions?: SComponentsOptions;
  fetchTypeAheadValues: (query: string) => Promise<object>;
  isFormValid?: (isFormValid: boolean) => void;
  loader?: React.ElementType; // default <div>Loading SForms...</div>
}

export module Constants {
  const COLUMN_COUNT: unique symbol;
  const INPUT_LENGTH_THRESHOLD: unique symbol;
  const DATETIME_NUMBER_FORMAT: unique symbol;
  const FORM: unique symbol;
  const HAS_SUBQUESTION: unique symbol;
  const HAS_ANSWER: unique symbol;
  const HAS_OPTION: unique symbol;
  const HAS_OPTIONS_QUERY: unique symbol;
  const HAS_VALUE_TYPE: unique symbol;
  const IS_DISABLED: unique symbol;
  const INPUT_MASK: unique symbol;
  const LAYOUT_CLASS: unique symbol;
  const LAYOUT: {
    FORM: string;
    QUESTION_TYPEAHEAD: string;
    QUESTION_SECTION: string;
    WIZARD_STEP: string;
    DISABLED: string;
    HIDDEN: string;
    TEXTAREA: string;
    DATE: string;
    TIME: string;
    DATETIME: string;
    CHECKBOX: string;
    ANSWERABLE: string;
    MASKED_INPUT: string;
    COLLAPSED: string;
    SPARQL: string;
    TURTLE: string;
  };
  const VALUE_TYPE_CODE: unique symbol;
  const VALUE_TYPE_TEXT: unique symbol;
  const GENERATED_ROW_SIZE: unique symbol;
  const HAS_QUESTION_ORIGIN: unique symbol;
  const HAS_ANSWER_ORIGIN: unique symbol;
  const HAS_DATA_VALUE: unique symbol;
  const HAS_OBJECT_VALUE: unique symbol;
  const HELP_DESCRIPTION: unique symbol;
  const XSD: {
    MAX_EXCLUSIVE: string;
    MAX_INCLUSIVE: string;
    MIN_EXCLUSIVE: string;
    MIN_INCLUSIVE: string;
    INT: string;
    INTEGER: string;
    NEGATIVE_INTEGER: string;
    NON_NEGATIVE_INTEGER: string;
    NON_POSITIVE_INTEGER: string;
    POSITIVE_INTEGER: string;
  };
  const ACCEPTS_ANSWER_VALUE: unique symbol;
  const HAS_DATATYPE: unique symbol;
  const HAS_LAYOUT_CLASS: unique symbol;
  const HAS_POSSIBLE_VALUES_QUERY: unique symbol;
  const HAS_REQUIRED_VALUE: unique symbol;
  const HAS_TESTED_QUESTION: unique symbol;
  const HAS_UNIT: unique symbol;
  const HAS_VALID_ANSWER: unique symbol;
  const IS_RELEVANT_IF: unique symbol;
  const ACCEPTS_VALIDATION_VALUE: unique symbol;
  const HAS_VALIDATION_MESSAGE: unique symbol;
  const NEGATIVE_CONDITION: unique symbol;
  const REQUIRES_ANSWER: unique symbol;
  const REQUIRES_ANSWER_DESCRIPTION_IF: unique symbol;
  const REQUIRES_ANSWER_IF: unique symbol;
  const REQUIRES_ANSWER_VALUE: unique symbol;
  const REQUIRES_DESCRIPTION: unique symbol;
  const HAS_PRECEDING_QUESTION: unique symbol;
  const HAS_PRECEDING_VALUE: unique symbol;
  const HAS_MEDIA_CONTENT: unique symbol;
  const CONDITION: unique symbol;
  const HAS_PATTERN: unique symbol;
  const HAS_DECLARED_PREFIX: unique symbol;
  const PREFIX: unique symbol;
  const NAMESPACE: unique symbol;

  const RDFS_LABEL: unique symbol;
  const RDFS_COMMENT: unique symbol;
  const DEFAULT_HAS_CHILD: unique symbol;
}

export class JsonLdObjectUtils {
  static getFirstObject(subject, predicate): any;
  static compareValues(jsonLdValue1, jsonLdValue2): any;
  static toplogicalSort(data, gtProperty): any;
  static orderPreservingToplogicalSort(data, gtProperty): any;
  static getCompareLocalizedLabelFunction(intl): any;
  static orderByLocalizedLabels(data, intl): any;
}

export class JsonLdFramingUtils {
  static customFrame(input, shape, callback): any;
  static expandStructure(structure: JsonLdObj): JsonLdObj;
  static compressStructure(structure: JsonLdObj): JsonLdObj;
}

export class JsonLdObjectMap {
  static putObject(id, question): void;
  static getObject(id): any;
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

declare const SForms: React.ForwardRefExoticComponent<SFormsProps>;

export default SForms;
