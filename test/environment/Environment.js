import Configuration from '../../src/model/Configuration';

export const mockIntl = () => {
  return (Configuration.intl = {
    locale: 'en'
  });
};
