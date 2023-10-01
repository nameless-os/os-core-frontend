const useTranslation = () => {
  return {
    t: (x) => x,
    i18n: {
      changeLanguage: () => new Promise(() => {}),
    },
  };
};

const initReactI18next = {
  type: '3rdParty',
  init: jest.fn(),
};

export { useTranslation, initReactI18next };
