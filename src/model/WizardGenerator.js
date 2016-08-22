'use strict';

import jsonld from "jsonld";
import JsonLdUtils from "jsonld-utils";
import Configuration from "../model/Configuration";
import Constants from "../constants/Constants";
import DefaultFormGenerator from "./DefaultFormGenerator";
import FormUtils from "../util/FormUtils";
import GeneratedStep from "../components/GeneratedStep";
import Logger from "../util/Logger";

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
        jsonld.frame(structure, {}, function (err, framed) {
            if (err) {
                Logger.error(err);
            }
            try {
                var wizardProperties = {
                    steps: WizardGenerator._constructWizardSteps(framed),
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
        var form = structure['@graph'],
            formElements,
            item,
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
                steps.push({
                    name: JsonLdUtils.getLocalized(item[JsonLdUtils.RDFS_LABEL], Configuration.intl),
                    component: GeneratedStep,
                    data: item
                });
            } else {
                Logger.warn('Item is not a wizard step: ' + item);
            }
        }
        // TODO Temporary sorting
        steps.sort(function (a, b) {
            if (a.name < b.name) {
                return 1;
            } else if (a.name > b.name) {
                return -1;
            }
            return 0;
        });
        Configuration.wizardStore.initWizard({
            root: form
        }, steps.map((item) => {
            return item.data;
        }));
        return steps;
    }
}
