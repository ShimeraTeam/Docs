import type { DefaultTheme, LocaleSpecificConfig } from 'vitepress'
import { sidebar } from './sidebar.mts'

export const fr: LocaleSpecificConfig<DefaultTheme.Config> & { label: string } = {
  lang: 'fr',
  // Language names are shown in their own language.
  label: 'Français',
  themeConfig: {
    nav: [
      { text: 'Utilisateur', link: '/fr/user/' },
      { text: 'Contributeur', link: '/fr/contributor/' },
    ],
    sidebar: sidebar('fr'),

    // Default theme UI strings, so French pages contain no English text
    // (screen readers read them with the page language).
    outline: { label: 'Sur cette page' },
    docFooter: { prev: 'Page précédente', next: 'Page suivante' },
    returnToTopLabel: 'Retour en haut',
    sidebarMenuLabel: 'Menu',
    langMenuLabel: 'Changer de langue',
    navMenuLabel: 'Navigation',
    extraMenuLabel: "Plus d'options",
    skipToContentLabel: 'Aller au contenu',
    notFound: {
      title: 'PAGE INTROUVABLE',
      quote: "Cette page n'existe pas ou a été déplacée.",
      linkLabel: "Aller à l'accueil",
      linkText: "Retour à l'accueil",
    },
  },
}
