import JsonLdUtils from 'jsonld-utils';

export default class Constants {
  // Default bootstrap column count
  static COLUMN_COUNT = 12;
  static INPUT_LENGTH_THRESHOLD = 50;
  static DATETIME_NUMBER_FORMAT = 'x';

  /**
   * Contains mainly definition of constants used to parse the form declaration.
   */
  static FORM = 'http://onto.fel.cvut.cz/ontologies/documentation/form';
  static HAS_SUBQUESTION = 'http://onto.fel.cvut.cz/ontologies/documentation/has_related_question';
  static HAS_ANSWER = 'http://onto.fel.cvut.cz/ontologies/documentation/has_answer';
  static HAS_OPTION = 'http://onto.fel.cvut.cz/ontologies/form/has-possible-value';
  static HAS_OPTIONS_QUERY = 'http://onto.fel.cvut.cz/ontologies/form/has-possible-values-query';
  static HAS_VALUE_TYPE = 'http://onto.fel.cvut.cz/ontologies/form/has-value-type';
  static IS_DISABLED = 'http://onto.fel.cvut.cz/ontologies/aviation/form-376/is-disabled';
  static INPUT_MASK = 'http://onto.fel.cvut.cz/ontologies/form/has-input-mask';
  static LAYOUT_CLASS = 'http://onto.fel.cvut.cz/ontologies/form-layout/has-layout-class';
  static COMPOSITE_PATTERN = 'http://onto.fel.cvut.cz/ontologies/form/has-composite-pattern';
  static PATTERN = 'http://onto.fel.cvut.cz/ontologies/form/has-pattern';
  static COMPOSITE_VARIABLES = 'http://onto.fel.cvut.cz/ontologies/form/has-composite-variables';
  static SHOW_ADVANCED_QUESTION = 'http://onto.fel.cvut.cz/ontologies/form/show-advanced-question';
  static LAYOUT = {
    FORM: 'form',
    QUESTION_SECTION: 'section',
    WIZARD_STEP: 'wizard-step',
    DATE: 'date',
    TIME: 'time',
    DATETIME: 'datetime',
    TEXT: 'text',
    TEXTAREA: 'textarea',
    CHECKBOX: 'checkbox',
    QUESTION_TYPEAHEAD: 'type-ahead',
    MASKED_INPUT: 'masked-input',
    ANSWERABLE: 'answerable',
    SPARQL: 'sparql',
    TURTLE: 'ttl',
    DISABLED: 'disabled',
    HIDDEN: 'hidden',
    COLLAPSED: 'collapsed',
    EMPHASISED: 'emphasised',
    CATEGORY: ['category-1', 'category-2', 'category-3', 'category-4', 'category-5']
  };
  static VALUE_TYPE_CODE = 'code';
  static VALUE_TYPE_TEXT = 'text';
  static GENERATED_ROW_SIZE = 1;
  static HAS_QUESTION_ORIGIN = 'http://onto.fel.cvut.cz/ontologies/form/has-question-origin';
  static HAS_ANSWER_ORIGIN = 'http://onto.fel.cvut.cz/ontologies/form/has-answer-origin';
  static HAS_DATA_VALUE = 'http://onto.fel.cvut.cz/ontologies/documentation/has_data_value';
  static HAS_OBJECT_VALUE = 'http://onto.fel.cvut.cz/ontologies/documentation/has_object_value';
  static HELP_DESCRIPTION = 'http://purl.org/dc/elements/1.1/description';
  static XSD = {
    MAX_EXCLUSIVE: 'http://www.w3.org/2001/XMLSchema#maxExclusive',
    MAX_INCLUSIVE: 'http://www.w3.org/2001/XMLSchema#maxInclusive',
    MIN_EXCLUSIVE: 'http://www.w3.org/2001/XMLSchema#minExclusive',
    MIN_INCLUSIVE: 'http://www.w3.org/2001/XMLSchema#minInclusive',

    INT: 'http://www.w3.org/2001/XMLSchema#int',
    INTEGER: 'http://www.w3.org/2001/XMLSchema#integer',
    NEGATIVE_INTEGER: 'http://www.w3.org/2001/XMLSchema#negativeInteger',
    NON_NEGATIVE_INTEGER: 'http://www.w3.org/2001/XMLSchema#nonNegativeInteger',
    NON_POSITIVE_INTEGER: 'http://www.w3.org/2001/XMLSchema#nonPositiveInteger',
    POSITIVE_INTEGER: 'http://www.w3.org/2001/XMLSchema#positiveInteger',

    BOOLEAN: 'http://www.w3.org/2001/XMLSchema#boolean'
  };
  static ACCEPTS_ANSWER_VALUE = 'http://onto.fel.cvut.cz/ontologies/form/accepts-answer-value';
  static ACCEPTS = 'http://onto.fel.cvut.cz/ontologies/form/accepts';
  static HAS_DATATYPE = 'http://onto.fel.cvut.cz/ontologies/form/has-datatype';
  static HAS_LAYOUT_CLASS = 'http://onto.fel.cvut.cz/ontologies/form/has-layout-class';
  static HAS_POSSIBLE_VALUES_QUERY = 'http://onto.fel.cvut.cz/ontologies/form/has-possible-values-query';
  static HAS_REQUIRED_VALUE = 'http://onto.fel.cvut.cz/ontologies/form/has-required-value';
  static HAS_TESTED_QUESTION = 'http://onto.fel.cvut.cz/ontologies/form/has-tested-question';
  static HAS_TESTED_FORM = 'http://onto.fel.cvut.cz/ontologies/form/has-tested-form';
  static HAS_UNIT = 'http://onto.fel.cvut.cz/ontologies/form/has-unit';
  static HAS_VALID_ANSWER = 'http://onto.fel.cvut.cz/ontologies/form/has-valid-answer';
  static IS_RELEVANT_IF = 'http://onto.fel.cvut.cz/ontologies/form/is-relevant-if';
  static ACCEPTS_VALIDATION_VALUE = 'http://onto.fel.cvut.cz/ontologies/form/accepts-validation-value';
  static HAS_VALIDATION_MESSAGE = 'http://onto.fel.cvut.cz/ontologies/form/has-validation-message';
  static NEGATIVE_CONDITION = 'http://onto.fel.cvut.cz/ontologies/form/negative-condition';
  static REQUIRES_ANSWER = 'http://onto.fel.cvut.cz/ontologies/form/requires-answer';
  static REQUIRES_ANSWER_DESCRIPTION_IF = 'http://onto.fel.cvut.cz/ontologies/form/requires-answer-description-if';
  static REQUIRES_ANSWER_IF = 'http://onto.fel.cvut.cz/ontologies/form/requires-answer-if';
  static REQUIRES_ANSWER_VALUE = 'http://onto.fel.cvut.cz/ontologies/form/requires-answer-value';
  static REQUIRES_DESCRIPTION = 'http://onto.fel.cvut.cz/ontologies/form/requires-description';
  static HAS_PRECEDING_QUESTION = 'http://onto.fel.cvut.cz/ontologies/form/has-preceding-question';
  static HAS_PRECEDING_VALUE = 'http://onto.fel.cvut.cz/ontologies/form/has-preceding-value';
  static HAS_MEDIA_CONTENT = 'http://onto.fel.cvut.cz/ontologies/form/has-media-content';
  static CONDITION = 'http://onto.fel.cvut.cz/ontologies/form/condition';
  static OR_CONDITION = 'http://onto.fel.cvut.cz/ontologies/form/or-condition';
  static HAS_SUB_CONDITION = 'http://onto.fel.cvut.cz/ontologies/form/has-sub-condition';
  static HAS_PATTERN = 'http://onto.fel.cvut.cz/ontologies/form-lt/has-pattern';
  static HAS_DECLARED_PREFIX = 'http://onto.fel.cvut.cz/ontologies/form-spin/has-declared-prefix';
  static PREFIX = 'http://www.w3.org/ns/shacl#prefix';
  static NAMESPACE = 'http://www.w3.org/ns/shacl#namespace';

  static NOT_ANSWERED_QUESTION = 'http://onto.fel.cvut.cz/ontologies/form/not-answered-question';
  static ANSWERED_QUESTION = 'http://onto.fel.cvut.cz/ontologies/form/answered-question';

  static RDFS_LABEL = JsonLdUtils.RDFS_LABEL;
  static RDFS_COMMENT = JsonLdUtils.RDFS_COMMENT;
  static DEFAULT_HAS_CHILD = JsonLdUtils.DEFAULT_HAS_CHILD;
}
