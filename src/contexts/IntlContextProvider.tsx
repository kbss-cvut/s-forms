import React, { ReactNode} from 'react';
import Constants from '../constants/Constants';
import cs from '../i18n/cs.json';
import en from '../i18n/en.json';
import { IntlProvider } from 'react-intl';

export const IntlContext = React.createContext({});

interface Props {
  children: ReactNode;
  locale: string;
}

const IntlContextProvider = ({ children, locale }: Props) => {
  let lang = en;
  if (locale === Constants.LANG.cs.locale) {
    lang = cs;
  }

  return (
    <IntlContext.Provider value={{ locale, lang }}>
      <IntlProvider locale={locale} messages={lang}>
        {children}
      </IntlProvider>
    </IntlContext.Provider>
  );
};

export default IntlContextProvider;
