import * as React from 'react';
import { Modal } from 'react-bootstrap';

export interface SOptions {
  intl?: { locale: string }; // default 'en'
  i18n?: {
    'wizard.next': string; // default 'Next'
    'wizard.previous': string; // default 'Previous'
  };
  modalView?: boolean; // default false
  modalProps?: Modal;
  horizontalWizardNav?: boolean; // default true
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
  form: object;
  formData?: object;
  options?: SOptions;
  components?: SComponents;
  componentsOptions?: SComponentsOptions;
  fetchTypeAheadValues: (query: string) => Promise<object>;
  isFormValid?: (isFormValid: boolean) => void;
  loader?: React.ElementType; // default <div>Loading SForms...</div>
}

declare const SForms: React.ForwardRefExoticComponent<SFormsProps>;

export default SForms;
