import type { DefaultTheme } from 'vitepress'

/** Built-in local search (Ctrl K / ⌘ K), indexed at build time, per locale. */
export const search: DefaultTheme.Config['search'] = {
  provider: 'local',
  options: {
    locales: {
      fr: {
        translations: {
          button: {
            buttonText: 'Rechercher',
            buttonAriaLabel: 'Rechercher dans la documentation',
          },
          modal: {
            displayDetails: 'Afficher la liste détaillée',
            resetButtonTitle: 'Effacer la recherche',
            backButtonTitle: 'Fermer la recherche',
            noResultsText: 'Aucun résultat pour',
            footer: {
              selectText: 'pour sélectionner',
              selectKeyAriaLabel: 'Entrée',
              navigateText: 'pour naviguer',
              navigateUpKeyAriaLabel: 'Flèche du haut',
              navigateDownKeyAriaLabel: 'Flèche du bas',
              closeText: 'pour fermer',
              closeKeyAriaLabel: 'Échap',
            },
          },
        },
      },
    },
  },
}
