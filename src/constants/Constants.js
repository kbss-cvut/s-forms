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
    HAS_DATATYPE = 'http://onto.fel.cvut.cz/ontologies/form/has-datatype',
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
        MASKED_INPUT: 'masked-input'
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
    };

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

    static get IS_DISABLED() {
        return IS_DISABLED;
    }

    static get INPUT_MASK() {
        return INPUT_MASK;
    }

    static get HAS_DATATYPE() {
        return HAS_DATATYPE;
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
}
