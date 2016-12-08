'use strict';

import FormUtils from "../../src/util/FormUtils";
import Constants from "../../src/constants/Constants";
import JsonObjectMap from "../../src/util/JsonObjectMap";
import assign from "object-assign";

describe('FormUtils', () => {

    let question;

    beforeEach(() => {
        question = {};
    });

    describe('isForm', () => {
        it('returns true for a form element.', () => {
            const form = {
                '@type': Constants.FORM,
                'hasQuestion': [
                    {}, {}
                ]
            };
            form[Constants.LAYOUT_CLASS] = [Constants.LAYOUT.FORM];
            expect(FormUtils.isForm(form)).toBeTruthy();
        });

        it('returns false for non-form element.', () => {
            const question = {};
            question[Constants.LAYOUT_CLASS] = [Constants.LAYOUT.QUESTION_SECTION];
            expect(FormUtils.isForm(question)).toBeFalsy();
        });
    });

    describe('isWizardStep', () => {
        it('returns true for a wizard step question', () => {
            question[Constants.LAYOUT_CLASS] = [Constants.LAYOUT.QUESTION_SECTION, Constants.LAYOUT.WIZARD_STEP];
            expect(FormUtils.isWizardStep(question)).toBeTruthy();
        });

        it('returns false for a section', () => {
            question[Constants.LAYOUT_CLASS] = [Constants.LAYOUT.QUESTION_SECTION];
            expect(FormUtils.isWizardStep(question)).toBeFalsy();
        });
    });

    describe('isSection', () => {
        it('returns true for a section.', () => {
            question[Constants.LAYOUT_CLASS] = [Constants.LAYOUT.QUESTION_SECTION];
            expect(FormUtils.isSection(question)).toBeTruthy();
        });

        it('returns false for a regular question.', () => {
            expect(FormUtils.isSection({})).toBeFalsy();
        });
    });

    describe('isTypeahead', () => {
        it('returns true for a typeahead question.', () => {
            question[Constants.LAYOUT_CLASS] = [Constants.LAYOUT.QUESTION_TYPEAHEAD];
            expect(FormUtils.isTypeahead(question)).toBeTruthy();
        });

        it('returns false for a regular question.', () => {
            expect(FormUtils.isTypeahead({})).toBeFalsy();
        });
    });

    describe('isTextarea', () => {
        it('returns true for a data value longer than the input length threshold', () => {
            let dataValue = '';
            for (let i = 0; i < Constants.INPUT_LENGTH_THRESHOLD + 1; i++) {
                dataValue += i.toString();
            }
            expect(FormUtils.isTextarea(question, dataValue)).toBeTruthy();
        });

        it('returns false for a typeahead result with long value', () => {
            let dataValue = '';
            for (let i = 0; i < Constants.INPUT_LENGTH_THRESHOLD + 1; i++) {
                dataValue += i.toString();
            }
            question[Constants.LAYOUT_CLASS] = [Constants.LAYOUT.QUESTION_TYPEAHEAD];
            expect(FormUtils.isTextarea(question, dataValue)).toBeFalsy();
        });
    });

    describe('isDisabled', () => {
        it('returns true for a disabled question.', () => {
            question[Constants.LAYOUT_CLASS] = [Constants.LAYOUT.DISABLED];
            expect(FormUtils.isDisabled(question)).toBeTruthy();
        });

        it('returns false for enabled question.', () => {
            expect(FormUtils.isDisabled({})).toBeFalsy();
        });
    });

    describe('isHidden', () => {
        it('returns true for a hidden question.', () => {
            question[Constants.LAYOUT_CLASS] = [Constants.LAYOUT.HIDDEN];
            expect(FormUtils.isHidden(question)).toBeTruthy();
        });

        it('returns false for a normal question', () => {
            expect(FormUtils.isHidden({})).toBeFalsy();
        });
    });

    describe('isCalendar', () => {
        it('returns true for a date question', () => {
            question[Constants.LAYOUT_CLASS] = [Constants.LAYOUT.DATE];
            expect(FormUtils.isCalendar(question)).toBeTruthy();
        });

        it('returns false for a regular question', () => {
            const question = {};
            expect(FormUtils.isCalendar(question)).toBeFalsy();
        });
    });

    describe('isDate', () => {
        it('returns true for a date question', () => {
            question[Constants.LAYOUT_CLASS] = [Constants.LAYOUT.DATE];
            expect(FormUtils.isCalendar(question)).toBeTruthy();
        });

        it('returns false for a regular question', () => {
            expect(FormUtils.isCalendar(question)).toBeFalsy();
        });
    });

    describe('isTime', () => {
        it('returns true for a time question', () => {
            question[Constants.LAYOUT_CLASS] = [Constants.LAYOUT.TIME];
            expect(FormUtils.isCalendar(question)).toBeTruthy();
        });

        it('returns false for a regular question', () => {
            expect(FormUtils.isCalendar(question)).toBeFalsy();
        });
    });

    describe('isDateTime', () => {
        it('returns true for a datetime question', () => {
            question[Constants.LAYOUT_CLASS] = [Constants.LAYOUT.DATETIME];
            expect(FormUtils.isCalendar(question)).toBeTruthy();
        });

        it('returns false for a regular question', () => {
            expect(FormUtils.isCalendar(question)).toBeFalsy();
        });
    });

    describe('isCheckbox', () => {
        it('returns true for a checkbox question', () => {
            question[Constants.LAYOUT_CLASS] = [Constants.LAYOUT.CHECKBOX];
            expect(FormUtils.isCheckbox(question)).toBeTruthy();
        });
        it('returns false for a non-checkbox question', () => {
            question[Constants.LAYOUT_CLASS] = [];
            expect(FormUtils.isCheckbox(question)).toBeFalsy();
        });
    });

    describe('isAnswerable', () => {
        it('returns true for an answerable section-question', () => {
            question[Constants.LAYOUT_CLASS] = [Constants.LAYOUT.QUESTION_SECTION, Constants.LAYOUT.ANSWERABLE];
            expect(FormUtils.isAnswerable(question)).toBeTruthy();
        });
        it('returns false for a non-answerable section-question', () => {
            question[Constants.LAYOUT_CLASS] = [Constants.LAYOUT.QUESTION_SECTION];
            expect(FormUtils.isAnswerable(question)).toBeFalsy();
        });
    });

    describe('isMaskedInput', () => {
        it('returns true for a question with masked input layout class', () => {
            question[Constants.LAYOUT_CLASS] = [Constants.LAYOUT.MASKED_INPUT];
            expect(FormUtils.isMaskedInput(question)).toBeTruthy();
        });

        it('returns false for a non-masked question', () => {
            expect(FormUtils.isMaskedInput(question)).toBeFalsy();
        });
    });

    describe('resolveValue', () => {
        it('returns null for no answer', () => {
            expect(FormUtils.resolveValue(null)).toBeNull();
        });

        it('returns identifier of code value answer', () => {
            const id = "http://onto.fel.cvut.cz/ontologies/eccairs/aviation-3.4.0.2/vl-a-431/v-100",
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
            const value = "2016-06-21",
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

    describe('testCondition', () => {

        const condition = {
                "@type": ["http://onto.fel.cvut.cz/ontologies/form/condition"],
                "http://onto.fel.cvut.cz/ontologies/form/accepts-answer-value": [
                    {
                        "@id": "http://vfn.cz/ontologies/fss-form/follow-up-and-recurrence/current-status/dod"
                    },
                    {
                        "@id": "http://vfn.cz/ontologies/fss-form/follow-up-and-recurrence/current-status/doc"
                    }],
                "http://onto.fel.cvut.cz/ontologies/form/has-tested-question": [{
                    "@id": "http://vfn.cz/ontologies/fss-form/follow-up-and-recurrence/current-status"
                }]
            },
            question = {
                "@id": "http://vfn.cz/ontologies/fss-form/follow-up-and-recurrence/current-status",
                "@type": "http://onto.fel.cvut.cz/ontologies/documentation/question",
                "http://onto.fel.cvut.cz/ontologies/documentation/has_answer": {
                    "@type": "http://onto.fel.cvut.cz/ontologies/documentation/answer",
                    "http://onto.fel.cvut.cz/ontologies/documentation/has_object_value": {
                        "@id": "http://vfn.cz/ontologies/fss-form/follow-up-and-recurrence/current-status/dod"
                    }
                }
            };

        beforeEach(function () {
            spyOn(JsonObjectMap, "getObject").and.returnValue(question);
        });

        it('returns false in condition without answer values.', () => {

            const noAnswerCondition = assign({}, condition);
            delete noAnswerCondition["http://onto.fel.cvut.cz/ontologies/form/accepts-answer-value"];
            expect(FormUtils.testCondition(noAnswerCondition));

            expect(JsonObjectMap.getObject).not.toHaveBeenCalled();
        });


        it('return true if accepts value that exists in a question.', () => {

            expect(FormUtils.testCondition(condition)).toEqual(true);
        });

        it('return false if accepts value that does not exists in a question.', () => {

            const wrongAnswerQuestion = assign({}, question);
            wrongAnswerQuestion
                ["http://onto.fel.cvut.cz/ontologies/documentation/has_answer"]
                ["http://onto.fel.cvut.cz/ontologies/documentation/has_object_value"] = {
                "@id": "http://bad-value"
            };
            expect(FormUtils.testCondition(wrongAnswerQuestion)).toEqual(false);
        });


    });
});
