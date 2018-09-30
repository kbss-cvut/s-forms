'use strict';

// Default bootstrap column count
const COLUMN_COUNT = 12;
const INPUT_LENGTH_THRESHOLD = 50;
const DATETIME_NUMBER_FORMAT = 'x';

const FORM = 'http://onto.fel.cvut.cz/ontologies/documentation/form',
    HAS_SUBQUESTION = 'http://onto.fel.cvut.cz/ontologies/documentation/has_related_question',
    HAS_ANSWER = 'http://onto.fel.cvut.cz/ontologies/documentation/has_answer',
    HAS_OPTION = 'http=//onto.fel.cvut.cz/ontologies/form/has-possible-value',
    HAS_OPTIONS_QUERY = 'http://onto.fel.cvut.cz/ontologies/form/has-possible-values-query',
    HAS_VALUE_TYPE = 'http://onto.fel.cvut.cz/ontologies/form/has-value-type',
    IS_DISABLED = 'http://onto.fel.cvut.cz/ontologies/aviation/form-376/is-disabled',
    INPUT_MASK = 'http://onto.fel.cvut.cz/ontologies/form/has-input-mask',
    LAYOUT_CLASS = 'http://onto.fel.cvut.cz/ontologies/form-layout/has-layout-class',
    LAYOUT = {
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
        TURTLE: "ttl"
    },
    VALUE_TYPE_CODE = 'code',
    VALUE_TYPE_TEXT = 'text',
    GENERATED_ROW_SIZE = 1,

    HAS_QUESTION_ORIGIN = 'http://onto.fel.cvut.cz/ontologies/form/has-question-origin',
    HAS_ANSWER_ORIGIN = 'http://onto.fel.cvut.cz/ontologies/form/has-answer-origin',

    HAS_DATA_VALUE = 'http://onto.fel.cvut.cz/ontologies/documentation/has_data_value',
    HAS_OBJECT_VALUE = 'http://onto.fel.cvut.cz/ontologies/documentation/has_object_value',

    HELP_DESCRIPTION = 'http://purl.org/dc/elements/1.1/description',

    XSD = {
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
    },

    ACCEPTS_ANSWER_VALUE = 'http://onto.fel.cvut.cz/ontologies/form/accepts-answer-value',

    HAS_DATATYPE = 'http://onto.fel.cvut.cz/ontologies/form/has-datatype',
    HAS_LAYOUT_CLASS = 'http://onto.fel.cvut.cz/ontologies/form/has-layout-class',
    HAS_POSSIBLE_VALUES_QUERY = 'http://onto.fel.cvut.cz/ontologies/form/has-possible-values-query',
    HAS_REQUIRED_VALUE = 'http://onto.fel.cvut.cz/ontologies/form/has-required-value',
    HAS_TESTED_QUESTION = 'http://onto.fel.cvut.cz/ontologies/form/has-tested-question',
    HAS_UNIT = 'http://onto.fel.cvut.cz/ontologies/form/has-unit',
    HAS_VALID_ANSWER = 'http://onto.fel.cvut.cz/ontologies/form/has-valid-answer',
    IS_RELEVANT_IF = 'http://onto.fel.cvut.cz/ontologies/form/is-relevant-if',
    ACCEPTS_VALIDATION_VALUE = 'http://onto.fel.cvut.cz/ontologies/form/accepts-validation-value',
    HAS_VALIDATION_MESSAGE = 'http://onto.fel.cvut.cz/ontologies/form/has-validation-message',
    NEGATIVE_CONDITION = 'http://onto.fel.cvut.cz/ontologies/form/negative-condition',
    REQUIRES_ANSWER = 'http://onto.fel.cvut.cz/ontologies/form/requires-answer',
    REQUIRES_ANSWER_DESCRIPTION_IF = 'http://onto.fel.cvut.cz/ontologies/form/requires-answer-description-if',
    REQUIRES_ANSWER_IF = 'http://onto.fel.cvut.cz/ontologies/form/requires-answer-if',
    REQUIRES_ANSWER_VALUE = 'http://onto.fel.cvut.cz/ontologies/form/requires-answer-value',
    REQUIRES_DESCRIPTION = 'http://onto.fel.cvut.cz/ontologies/form/requires-description',
    HAS_PRECEDING_QUESTION = 'http://onto.fel.cvut.cz/ontologies/form/has-preceding-question',
    HAS_PRECEDING_VALUE = 'http://onto.fel.cvut.cz/ontologies/form/has-preceding-value',

    CONDITION = 'http://onto.fel.cvut.cz/ontologies/form/condition',

    HAS_PATTERN = 'http://onto.fel.cvut.cz/ontologies/form-lt/has-pattern',

    HAS_DECLARED_PREFIX = 'http://onto.fel.cvut.cz/ontologies/form-spin/has-declared-prefix',
    PREFIX = "http://www.w3.org/ns/shacl#prefix",
    NAMESPACE = "http://www.w3.org/ns/shacl#namespace";
/**
 * Contains mainly definition of constants used to parse the form declaration.
 */
export default class Constants {
    static get COLUMN_COUNT() {
        return COLUMN_COUNT;
    }

    static get INPUT_LENGTH_THRESHOLD() {
        return INPUT_LENGTH_THRESHOLD;
    }

    static get DATETIME_NUMBER_FORMAT() {
        return DATETIME_NUMBER_FORMAT;
    }

    static get FORM() {
        return FORM;
    }

    static get HAS_SUBQUESTION() {
        return HAS_SUBQUESTION;
    }

    static get HAS_ANSWER() {
        return HAS_ANSWER;
    }

    static get HAS_OPTION() {
        return HAS_OPTION;
    }

    static get HAS_OPTIONS_QUERY() {
        return HAS_OPTIONS_QUERY;
    }

    static get HAS_VALUE_TYPE() {
        return HAS_VALUE_TYPE;
    }

    static get IS_RELEVANT_IF() {
        return IS_RELEVANT_IF;
    }

    static get IS_DISABLED() {
        return IS_DISABLED;
    }

    static get INPUT_MASK() {
        return INPUT_MASK;
    }

    static get HAS_DATATYPE() {
        return HAS_DATATYPE;
    }

    static get HAS_UNIT() {
        return HAS_UNIT;
    }

    static get LAYOUT_CLASS() {
        return LAYOUT_CLASS;
    }

    static get LAYOUT() {
        return LAYOUT;
    }

    static get VALUE_TYPE_CODE() {
        return VALUE_TYPE_CODE;
    }

    static get VALUE_TYPE_TEXT() {
        return VALUE_TYPE_TEXT;
    }

    static get GENERATED_ROW_SIZE() {
        return GENERATED_ROW_SIZE;
    }

    static get HAS_QUESTION_ORIGIN() {
        return HAS_QUESTION_ORIGIN;
    }

    static get HAS_ANSWER_ORIGIN() {
        return HAS_ANSWER_ORIGIN;
    }

    static get HAS_DATA_VALUE() {
        return HAS_DATA_VALUE;
    }

    static get HAS_OBJECT_VALUE() {
        return HAS_OBJECT_VALUE;
    }

    static get HELP_DESCRIPTION() {
        return HELP_DESCRIPTION;
    }

    static get XSD() {
        return XSD;
    }

    static get ACCEPTS_ANSWER_VALUE() {
        return ACCEPTS_ANSWER_VALUE;
    }

    static get HAS_DATATYPE() {
        return HAS_DATATYPE;
    }

    static get HAS_LAYOUT_CLASS() {
        return HAS_LAYOUT_CLASS;
    }

    static get HAS_POSSIBLE_VALUES_QUERY() {
        return HAS_POSSIBLE_VALUES_QUERY;
    }

    static get HAS_REQUIRED_VALUE() {
        return HAS_REQUIRED_VALUE;
    }

    static get HAS_TESTED_QUESTION() {
        return HAS_TESTED_QUESTION;
    }

    static get HAS_UNIT() {
        return HAS_UNIT;
    }

    static get HAS_VALID_ANSWER() {
        return HAS_VALID_ANSWER;
    }

    static get IS_RELEVANT_IF() {
        return IS_RELEVANT_IF;
    }

    static get ACCEPTS_VALIDATION_VALUE() {
        return ACCEPTS_VALIDATION_VALUE;
    }

    static get HAS_VALIDATION_MESSAGE() {
        return HAS_VALIDATION_MESSAGE;
    }

    static get NEGATIVE_CONDITION() {
        return NEGATIVE_CONDITION;
    }

    static get REQUIRES_ANSWER() {
        return REQUIRES_ANSWER;
    }

    static get REQUIRES_ANSWER_DESCRIPTION_IF() {
        return REQUIRES_ANSWER_DESCRIPTION_IF;
    }

    static get REQUIRES_ANSWER_IF() {
        return REQUIRES_ANSWER_IF;
    }

    static get REQUIRES_ANSWER_VALUE() {
        return REQUIRES_ANSWER_VALUE;
    }

    static get REQUIRES_DESCRIPTION() {
        return REQUIRES_DESCRIPTION;
    }

    static get HAS_PRECEDING_QUESTION() {
        return HAS_PRECEDING_QUESTION;
    }

    static get HAS_PRECEDING_VALUE() {
        return HAS_PRECEDING_VALUE;
    }

    static get CONDITION() {
        return CONDITION;
    }

    static get HAS_PATTERN() {
        return HAS_PATTERN;
    }

    static get HAS_DECLARED_PREFIX() {
        return HAS_DECLARED_PREFIX;
    }

    static get PREFIX() {
        return PREFIX;
    }

    static get NAMESPACE() {
        return NAMESPACE;
    }
}
