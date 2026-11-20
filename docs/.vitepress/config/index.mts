import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitepress'
import { paletteHeadScript } from '../theme/palette/head.mts'
import { en } from './en.mts'
import { fr } from './fr.mts'
import { search } from './search.mts'

/**
 * Site config. Split by concern:
 *   en.mts / fr.mts  per-locale nav, sidebar and UI strings
 *   sidebar.mts      single sidebar tree for every locale
 *   search.mts       local search (Ctrl K)
 *   icons.mts        sidebar icons
 */
export default defineConfig({
  base: '/Docs/',
  title: 'Shimera',
  description: 'Shimera Official Documentation',
  head: [
    // `head` links are not prefixed with `base`, hence the explicit /Docs/.
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/Docs/favicon.svg' }],
    // Applies the saved appearance before the first paint (no flash).
    ['script', {}, paletteHeadScript],
  ],
  vite: {
    resolve: {
      alias: [
        {
          // The appearance palette replaces the default light/dark switch
          // everywhere the theme uses it (nav bar, `⋯` menu, mobile menu).
          find: /^.*\/VPNavAppearance\.vue$/,
          replacement: fileURLToPath(new URL('../theme/components/PaletteAppearance.vue', import.meta.url)),
        },
      ],
    },
  },
  themeConfig: {
    // Green logo on dark backgrounds, black logo on light ones (Light, Sepia).
    // Empty alt: the site name is written right next to it.
    logo: { light: '/logo-light.svg', dark: '/logo-dark.svg', alt: '' },
    search,
    socialLinks: [
      { icon: 'github', link: 'https://github.com/ShimeraTeam/Shimera', ariaLabel: 'GitHub' },
    ],
  },
  locales: {
    root: en,
    fr,
  },
})
