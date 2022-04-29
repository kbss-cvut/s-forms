import * as React from "react";
import { Modal } from "react-bootstrap";
import { JsonLdObj } from "jsonld/jsonld-spec";

export type Intl = {
  locale?: string;
};

export interface SOptions {
  intl?: Intl; // default 'en'
  i18n?: {
    "wizard.next": string; // default 'Next'
    "wizard.previous": string; // default 'Previous'
    "section.expand": string; // default 'Expand'
    "section.collapse": string; // default 'Collapse'
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
  ref?: React.RefObject<HTMLDivElement>;
  form: object;
  options?: SOptions;
  components?: SComponents;
  componentsOptions?: SComponentsOptions;
  fetchTypeAheadValues: (query: string) => Promise<object>;
  isFormValid?: (isFormValid: boolean) => void;
  loader?: React.ElementType; // default <div>Loading SForms...</div>
}

type ArrayLengthMutationKeys =
  | "category-1"
  | "category-2"
  | "category-3"
  | "category-4"
  | "category-5";
type ArrayItems<T extends Array<any>> = T extends Array<infer TItems>
  ? TItems
  : never;
type FixedLengthArray<T extends any[]> = Pick<
  T,
  Exclude<keyof T, ArrayLengthMutationKeys>
> & {
  [Symbol.iterator]: () => IterableIterator<ArrayItems<T>>;
};

export class Constants {
  static COLUMN_COUNT: string;
  static INPUT_LENGTH_THRESHOLD: string;
  static DATETIME_NUMBER_FORMAT: string;
  static FORM: string;
  static HAS_SUBQUESTION: string;
  static HAS_ANSWER: string;
  static HAS_OPTION: string;
  static HAS_OPTIONS_QUERY: string;
  static HAS_VALUE_TYPE: string;
  static IS_DISABLED: string;
  static INPUT_MASK: string;
  static LAYOUT_CLASS: string;
  static LAYOUT: {
    FORM: string;
    QUESTION_SECTION: string;
    WIZARD_STEP: string;
    DATE: string;
    TIME: string;
    DATETIME: string;
    TEXTAREA: string;
    TEXT: string;
    CHECKBOX: string;
    QUESTION_TYPEAHEAD: string;
    MASKED_INPUT: string;
    SPARQL: string;
    TURTLE: string;
    ANSWERABLE: string;
    COLLAPSED: string;
    DISABLED: string;
    EMPHASISED: string;
    HIDDEN: string;
    CATEGORY: FixedLengthArray<[string, string, string, string, string]>;
  };
  static VALUE_TYPE_CODE: string;
  static VALUE_TYPE_TEXT: string;
  static GENERATED_ROW_SIZE: string;
  static HAS_QUESTION_ORIGIN: string;
  static HAS_ANSWER_ORIGIN: string;
  static HAS_DATA_VALUE: string;
  static HAS_OBJECT_VALUE: string;
  static HELP_DESCRIPTION: string;
  static XSD: {
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
    BOOLEAN: string;
  };
  static ACCEPTS_ANSWER_VALUE: string;
  static HAS_DATATYPE: string;
  static HAS_LAYOUT_CLASS: string;
  static HAS_POSSIBLE_VALUES_QUERY: string;
  static HAS_REQUIRED_VALUE: string;
  static HAS_TESTED_QUESTION: string;
  static HAS_UNIT: string;
  static HAS_VALID_ANSWER: string;
  static IS_RELEVANT_IF: string;
  static ACCEPTS_VALIDATION_VALUE: string;
  static HAS_VALIDATION_MESSAGE: string;
  static NEGATIVE_CONDITION: string;
  static REQUIRES_ANSWER: string;
  static REQUIRES_ANSWER_DESCRIPTION_IF: string;
  static REQUIRES_ANSWER_IF: string;
  static REQUIRES_ANSWER_VALUE: string;
  static REQUIRES_DESCRIPTION: string;
  static HAS_PRECEDING_QUESTION: string;
  static HAS_PRECEDING_VALUE: string;
  static HAS_MEDIA_CONTENT: string;
  static CONDITION: string;
  static HAS_PATTERN: string;
  static HAS_DECLARED_PREFIX: string;
  static PREFIX: string;
  static NAMESPACE: string;

  static RDFS_LABEL: string;
  static RDFS_COMMENT: string;
  static DEFAULT_HAS_CHILD: string;

  static ICONS: {
    QUESTION_COMMENTS: string;
    QUESTION_HELP: string;
    QUESTION_LINK: string;
  };

  static ICON_BEHAVIOR: {
    ENABLE: string;
    DISABLE: string;
    ON_HOVER: string;
  };
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
  static isText(question): boolean;
  static isCalendar(question): boolean;
  static isDate(question): boolean;
  static isTime(question): boolean;
  static isDateTime(question): boolean;
  static isCheckbox(question): boolean;
  static isMaskedInput(question): boolean;
  static isSparqlInput(question): boolean;
  static isTurtleInput(question): boolean;
  static isCollapsed(question): boolean;
  static getCategory(question): string;
  static isEmphasised(question): boolean;
  static resolveValue(answer): any;
  static resolveValueObject(answer): any;
  static isRelevant(question): boolean;
  static hasValidationLogic(question): boolean;
  static isValid(question): boolean;
  static testCondition(condition): boolean;
}

declare const SForms: React.ForwardRefExoticComponent<SFormsProps>;

export default SForms;
