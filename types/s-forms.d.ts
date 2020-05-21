import { FunctionComponent, ReactElement } from 'react';

/* Temporary version */
export class WizardGenerator {
  /**
   * Generates a default, one-step wizard.
   *
   * @param data Optional, data for which the wizard should be generated (i.e. the root question)
   * @param title Optional, title of the wizard
   * @return Wizard steps definitions (an array of one element in this case) and form data
   */
  static createDefaultWizard(data, title): any;

  /**
   * Generates wizard steps from the specified data-enriched template.
   * @param structure The wizard structure in JSON-LD
   * @param data Optional, data for which the wizard will be generated (i.e. the root question)
   * @param title Optional, wizard title
   * @return Promise with generated wizard step definitions and form data
   */
  static createWizard(structure, data, title): any;
}

export class Configuration {
  static intl: any;
  static i18n: { [x: string]: any };
  static inputComponent: ReactElement;
  static dateFormat: string;
  static timeFormat: string;
  static dateTimeFormat: string;
  static readOnly: boolean;
  static fetchTypeAheadValues: { [x: string]: any };
  static horizontalWizardNav: boolean;
  static modalView: boolean;
}

export const WizardContainer: FunctionComponent<any, React.Ref>;
