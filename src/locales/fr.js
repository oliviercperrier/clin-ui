import translations from './fr.json';

const fr = {
  global: {
    filters: {
      actions: {
        all: 'Sélectionner tout',
        none: 'Effacer',
        clear: 'Effacer',
        less: 'Voir -',
        more: 'De plus',
        apply: 'Appliquer',
      },
      messages: {
        empty: 'Aucune valeur trouvée pour cette requête',
      },
      checkbox: {
        placeholder: 'Recherche...',
      },
    },
  },
  ...translations,
};

export default fr;
