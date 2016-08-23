'use strict';

import FormUtils from "../../src/util/FormUtils";
import Constants from "../../src/constants/Constants";

describe('FormUtils', () => {

    describe('isForm', () => {
        it('returns true for a form element.', () => {
            var form = {
                '@type': Constants.FORM,
                'hasQuestion': [
                    {}, {}
                ]
            };
            form[Constants.LAYOUT_CLASS] = [Constants.LAYOUT.FORM];
            expect(FormUtils.isForm(form)).toBeTruthy();
        });

        it('returns false for non-form element.', () => {
            var question = {};
            question[Constants.LAYOUT_CLASS] = [Constants.LAYOUT.QUESTION_SECTION];
            expect(FormUtils.isForm(question)).toBeFalsy();
        });
    });

    describe('isWizardStep', () => {
        it('returns true for a wizard step question', () => {
            var question = {};
            question[Constants.LAYOUT_CLASS] = [Constants.LAYOUT.QUESTION_SECTION, Constants.LAYOUT.WIZARD_STEP];
            expect(FormUtils.isWizardStep(question)).toBeTruthy();
        });

        it('returns false for a section', () => {
            var question = {};
            question[Constants.LAYOUT_CLASS] = [Constants.LAYOUT.QUESTION_SECTION];
            expect(FormUtils.isWizardStep(question)).toBeFalsy();
        });
    });

    describe('isSection', () => {
        it('returns true for a section.', () => {
            var question = {};
            question[Constants.LAYOUT_CLASS] = [Constants.LAYOUT.QUESTION_SECTION];
            expect(FormUtils.isSection(question)).toBeTruthy();
        });

        it('returns false for a regular question.', () => {
            expect(FormUtils.isSection({})).toBeFalsy();
        });
    });

    describe('isTypeahead', () => {
        it('returns true for a typeahead question.', () => {
            var question = {};
            question[Constants.LAYOUT_CLASS] = [Constants.LAYOUT.QUESTION_TYPEAHEAD];
            expect(FormUtils.isTypeahead(question)).toBeTruthy();
        });

        it('returns false for a regular question.', () => {
            expect(FormUtils.isTypeahead({})).toBeFalsy();
        });
    });

    describe('isDisabled', () => {
        it('returns true for a disabled question.', () => {
            var question = {};
            question[Constants.LAYOUT_CLASS] = [Constants.LAYOUT.DISABLED];
            expect(FormUtils.isDisabled(question)).toBeTruthy();
        });

        it('returns false for enabled question.', () => {
            expect(FormUtils.isDisabled({})).toBeFalsy();
        });
    });

    describe('isHidden', () => {
        it('returns true for a hidden question.', () => {
            var question = {};
            question[Constants.LAYOUT_CLASS] = [Constants.LAYOUT.HIDDEN];
            expect(FormUtils.isHidden(question)).toBeTruthy();
        });

        it('returns false for a normal question', () => {
            expect(FormUtils.isHidden({})).toBeFalsy();
        });
    });

    describe('isCalendar', () => {
        it('returns true for a date question', () => {
            var question = {};
            question[Constants.LAYOUT_CLASS] = [Constants.LAYOUT.DATE];
            expect(FormUtils.isCalendar(question)).toBeTruthy();
        });

        it('returns false for a regular question', () => {
            var question = {};
            expect(FormUtils.isCalendar(question)).toBeFalsy();
        });
    });

    describe('isDate', () => {
        it('returns true for a date question', () => {
            var question = {};
            question[Constants.LAYOUT_CLASS] = [Constants.LAYOUT.DATE];
            expect(FormUtils.isCalendar(question)).toBeTruthy();
        });

        it('returns false for a regular question', () => {
            var question = {};
            expect(FormUtils.isCalendar(question)).toBeFalsy();
        });
    });

    describe('isTime', () => {
        it('returns true for a time question', () => {
            var question = {};
            question[Constants.LAYOUT_CLASS] = [Constants.LAYOUT.TIME];
            expect(FormUtils.isCalendar(question)).toBeTruthy();
        });

        it('returns false for a regular question', () => {
            var question = {};
            expect(FormUtils.isCalendar(question)).toBeFalsy();
        });
    });

    describe('isDateTime', () => {
        it('returns true for a datetime question', () => {
            var question = {};
            question[Constants.LAYOUT_CLASS] = [Constants.LAYOUT.DATETIME];
            expect(FormUtils.isCalendar(question)).toBeTruthy();
        });

        it('returns false for a regular question', () => {
            var question = {};
            expect(FormUtils.isCalendar(question)).toBeFalsy();
        });
    });

    describe('resolveValue', () => {
        it('returns null for no answer', () => {
            expect(FormUtils.resolveValue(null)).toBeNull();
        });

        it('returns identifier of code value answer', () => {
            var id = "http://onto.fel.cvut.cz/ontologies/eccairs/aviation-3.4.0.2/vl-a-431/v-100",
                answer = {
                    "@id": "http://onto.fel.cvut.cz/ontologies/eccairs/model/instance#instance-1495029633-a",
                    "@type": "http://onto.fel.cvut.cz/ontologies/documentation/answer",
                    "http://onto.fel.cvut.cz/ontologies/documentation/has_object_value": {
                        "@id": id
                    }
                };
            expect(FormUtils.resolveValue(answer)).toEqual(id);
        });

        it('returns value of data value answer', () => {
            var value = "2016-06-21",
                answer = {
                    "@id": "http://onto.fel.cvut.cz/ontologies/eccairs/model/instance#instance-2018758124-a",
                    "@type": "http://onto.fel.cvut.cz/ontologies/documentation/answer",
                    "http://onto.fel.cvut.cz/ontologies/documentation/has_data_value": {
                        "@language": "en",
                        "@value": value
                    }
                };
            expect(FormUtils.resolveValue(answer)).toEqual(value);
        });
    });
});
