'use strict';

import jsonld from "jsonld";
import JsonLdUtils from "jsonld-utils";
import Configuration from "../model/Configuration";
import Constants from "../constants/Constants";
import DefaultFormGenerator from "./DefaultFormGenerator";
import FormUtils from "../util/FormUtils";
import GeneratedStep from "../components/GeneratedStep";
import Logger from "../util/Logger";
import JsonLdFramingUtils from "../util/JsonLdFramingUtils"
import JsonLdObjectUtils from "../util/JsonLdObjectUtils";

export default class WizardGenerator {

    /**
     * Generates a default, one-step wizard.
     *
     * @param data Optional, data for which the wizard should be generated (i.e. the root question)
     * @param title Optional, title of the wizard
     * @param callback Callback called with wizard steps definitions (an array of one element in this case)
     */
    static createDefaultWizard(data, title, callback) {
        var steps = WizardGenerator._constructWizardSteps(DefaultFormGenerator.generateForm(data));
        callback({
            steps: steps,
            title: title
        });
    }

    /**
     * Generates wizard steps from the specified data-enriched template.
     * @param structure The wizard structure in JSON-LD
     * @param data Optional, data for which the wizard will be generated (i.e. the root question)
     * @param title Optional, wizard title
     * @param callback Callback called with generated wizard step definitions when ready
     */
    static createWizard(structure, data, title, callback) {

        jsonld.flatten(structure, {}, null, function (err, flattened) {
            if (err) {
                Logger.error(err);
            }
            try {
                var wizardProperties = {
                    steps: WizardGenerator._constructWizardSteps(flattened),
                    title: title
                };
            } catch (e) {
                WizardGenerator.createDefaultWizard(data, title, callback);
                return;
            }
            callback(wizardProperties);
        });
    }

    static _constructWizardSteps(structure) {

        if (structure['@graph'][0]['@id'] !== undefined) {
            JsonLdFramingUtils.modifyStructure(structure); //TODO make as callback
        } else {
            console.warn("default form is constructed.");
        }

        var form = structure['@graph'],
            formElements,
            item,
            stepQuestions = [],
            steps = [],
            i, len;

        for (i = 0, len = form.length; i < len; i++) {
            item = form[i];
            if (FormUtils.isForm(item)) {
                form = item;
                break;
            }
        }
        formElements = form[Constants.HAS_SUBQUESTION];
        if (!formElements) {
            Logger.error('Could not find any wizard steps in the received data.');
            throw 'No wizard steps in form';
        }
        for (i = 0, len = formElements.length; i < len; i++) {
            item = formElements[i];
            if (FormUtils.isWizardStep(item) && !FormUtils.isHidden(item)) {
                stepQuestions.push(item);
            } else {
                Logger.warn('Item is not a wizard step: ' + item);
            }
        }

        // sort by label
        stepQuestions.sort(JsonLdObjectUtils.getCompareLocalizedLabelFunction(Configuration.intl));

        // sort by property
        JsonLdObjectUtils.orderPreservingToplogicalSort(stepQuestions, Constants.HAS_PRECEDING_QUESTION);


        steps = stepQuestions.map(
            (q) => {
                return {
                    name: JsonLdUtils.getLocalized(q[JsonLdUtils.RDFS_LABEL], Configuration.intl),
                    component: GeneratedStep,
                    data: q
                };
            });

        Configuration.wizardStore.initWizard({
            root: form
        }, steps.map((item) => {
            return item.data;
        }));
        return steps;
    }
}
