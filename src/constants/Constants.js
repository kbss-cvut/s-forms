import JsonLdUtils from 'jsonld-utils';

// Default bootstrap column count
export const COLUMN_COUNT = 12;
export const INPUT_LENGTH_THRESHOLD = 50;
export const DATETIME_NUMBER_FORMAT = 'x';

/**
 * Contains mainly definition of constants used to parse the form declaration.
 */
export const FORM = 'http://onto.fel.cvut.cz/ontologies/documentation/form';
export const HAS_SUBQUESTION = 'http://onto.fel.cvut.cz/ontologies/documentation/has_related_question';
export const HAS_ANSWER = 'http://onto.fel.cvut.cz/ontologies/documentation/has_answer';
export const HAS_OPTION = 'http=//onto.fel.cvut.cz/ontologies/form/has-possible-value';
export const HAS_OPTIONS_QUERY = 'http://onto.fel.cvut.cz/ontologies/form/has-possible-values-query';
export const HAS_VALUE_TYPE = 'http://onto.fel.cvut.cz/ontologies/form/has-value-type';
export const IS_DISABLED = 'http://onto.fel.cvut.cz/ontologies/aviation/form-376/is-disabled';
export const INPUT_MASK = 'http://onto.fel.cvut.cz/ontologies/form/has-input-mask';
export const LAYOUT_CLASS = 'http://onto.fel.cvut.cz/ontologies/form-layout/has-layout-class';
export const LAYOUT = {
  FORM: 'form',
  QUESTION_TYPEAHEAD: 'type-ahead',
  QUESTION_SECTION: 'section',
  WIZARD_STEP: 'wizard-step',
  DISABLED: 'disabled',
  HIDDEN: 'hidden',
  TEXTAREA: 'textarea',
  DATE: 'date',
  TIME: 'time',
  DATETIME: 'datetime',
  CHECKBOX: 'checkbox',
  ANSWERABLE: 'answerable',
  MASKED_INPUT: 'masked-input',
  COLLAPSED: 'collapsed',
  SPARQL: 'sparql',
  TURTLE: 'ttl'
};
export const VALUE_TYPE_CODE = 'code';
export const VALUE_TYPE_TEXT = 'text';
export const GENERATED_ROW_SIZE = 1;
export const HAS_QUESTION_ORIGIN = 'http://onto.fel.cvut.cz/ontologies/form/has-question-origin';
export const HAS_ANSWER_ORIGIN = 'http://onto.fel.cvut.cz/ontologies/form/has-answer-origin';
export const HAS_DATA_VALUE = 'http://onto.fel.cvut.cz/ontologies/documentation/has_data_value';
export const HAS_OBJECT_VALUE = 'http://onto.fel.cvut.cz/ontologies/documentation/has_object_value';
export const HELP_DESCRIPTION = 'http://purl.org/dc/elements/1.1/description';
export const XSD = {
  MAX_EXCLUSIVE: 'http://www.w3.org/2001/XMLSchema#maxExclusive',
  MAX_INCLUSIVE: 'http://www.w3.org/2001/XMLSchema#maxInclusive',
  MIN_EXCLUSIVE: 'http://www.w3.org/2001/XMLSchema#minExclusive',
  MIN_INCLUSIVE: 'http://www.w3.org/2001/XMLSchema#minInclusive',

  INT: 'http://www.w3.org/2001/XMLSchema#int',
  INTEGER: 'http://www.w3.org/2001/XMLSchema#integer',
  NEGATIVE_INTEGER: 'http://www.w3.org/2001/XMLSchema#negativeInteger',
  NON_NEGATIVE_INTEGER: 'http://www.w3.org/2001/XMLSchema#nonNegativeInteger',
  NON_POSITIVE_INTEGER: 'http://www.w3.org/2001/XMLSchema#nonPositiveInteger',
  POSITIVE_INTEGER: 'http://www.w3.org/2001/XMLSchema#positiveInteger'
};
export const ACCEPTS_ANSWER_VALUE = 'http://onto.fel.cvut.cz/ontologies/form/accepts-answer-value';
export const HAS_DATATYPE = 'http://onto.fel.cvut.cz/ontologies/form/has-datatype';
export const HAS_LAYOUT_CLASS = 'http://onto.fel.cvut.cz/ontologies/form/has-layout-class';
export const HAS_POSSIBLE_VALUES_QUERY = 'http://onto.fel.cvut.cz/ontologies/form/has-possible-values-query';
export const HAS_REQUIRED_VALUE = 'http://onto.fel.cvut.cz/ontologies/form/has-required-value';
export const HAS_TESTED_QUESTION = 'http://onto.fel.cvut.cz/ontologies/form/has-tested-question';
export const HAS_UNIT = 'http://onto.fel.cvut.cz/ontologies/form/has-unit';
export const HAS_VALID_ANSWER = 'http://onto.fel.cvut.cz/ontologies/form/has-valid-answer';
export const IS_RELEVANT_IF = 'http://onto.fel.cvut.cz/ontologies/form/is-relevant-if';
export const ACCEPTS_VALIDATION_VALUE = 'http://onto.fel.cvut.cz/ontologies/form/accepts-validation-value';
export const HAS_VALIDATION_MESSAGE = 'http://onto.fel.cvut.cz/ontologies/form/has-validation-message';
export const NEGATIVE_CONDITION = 'http://onto.fel.cvut.cz/ontologies/form/negative-condition';
export const REQUIRES_ANSWER = 'http://onto.fel.cvut.cz/ontologies/form/requires-answer';
export const REQUIRES_ANSWER_DESCRIPTION_IF = 'http://onto.fel.cvut.cz/ontologies/form/requires-answer-description-if';
export const REQUIRES_ANSWER_IF = 'http://onto.fel.cvut.cz/ontologies/form/requires-answer-if';
export const REQUIRES_ANSWER_VALUE = 'http://onto.fel.cvut.cz/ontologies/form/requires-answer-value';
export const REQUIRES_DESCRIPTION = 'http://onto.fel.cvut.cz/ontologies/form/requires-description';
export const HAS_PRECEDING_QUESTION = 'http://onto.fel.cvut.cz/ontologies/form/has-preceding-question';
export const HAS_PRECEDING_VALUE = 'http://onto.fel.cvut.cz/ontologies/form/has-preceding-value';
export const HAS_MEDIA_CONTENT = 'http://onto.fel.cvut.cz/ontologies/form/has-media-content';
export const CONDITION = 'http://onto.fel.cvut.cz/ontologies/form/condition';
export const HAS_PATTERN = 'http://onto.fel.cvut.cz/ontologies/form-lt/has-pattern';
export const HAS_DECLARED_PREFIX = 'http://onto.fel.cvut.cz/ontologies/form-spin/has-declared-prefix';
export const PREFIX = 'http://www.w3.org/ns/shacl#prefix';
export const NAMESPACE = 'http://www.w3.org/ns/shacl#namespace';

export const RDFS_LABEL = JsonLdUtils.RDFS_LABEL;
export const RDFS_COMMENT = JsonLdUtils.RDFS_COMMENT;
export const DEFAULT_HAS_CHILD = JsonLdUtils.DEFAULT_HAS_CHILD;
