import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitepress'
import { paletteHeadScript } from './theme/palette-head.mts'

/**
 * Sidebar label with a decorative icon. The icon is hidden from screen
 * readers so they only announce the page name.
 */
const icon = (glyph: string, text: string) =>
  `<span class="sidebar-icon" aria-hidden="true">${glyph}</span>${text}`

// Custom icons for effects without a fitting emoji. Fixed colors + a neutral
// outline so they stay visible on every background.
const chromaticAberrationIcon =
  '<svg viewBox="0 0 24 24" focusable="false"><g stroke="#7f7f7f" stroke-width="0.8">' +
  '<circle cx="9" cy="10" r="6" fill="#ff3b30" fill-opacity="0.85"/>' +
  '<circle cx="15" cy="10" r="6" fill="#34c759" fill-opacity="0.85"/>' +
  '<circle cx="12" cy="15" r="6" fill="#0a84ff" fill-opacity="0.85"/></g></svg>'

const vignetteIcon =
  '<svg viewBox="0 0 24 24" focusable="false"><defs>' +
  '<radialGradient id="shimera-vignette-icon" cx="50%" cy="50%" r="62%">' +
  '<stop offset="30%" stop-color="#fff4d6"/><stop offset="100%" stop-color="#1c1c1c"/>' +
  '</radialGradient></defs>' +
  '<rect x="2.5" y="4.5" width="19" height="15" rx="2.5" fill="url(#shimera-vignette-icon)" stroke="#7f7f7f" stroke-width="0.8"/></svg>'

export default defineConfig({
  base: '/Docs/',
  title: "Shimera",
  description: "Shimera Official Documentation",
  head: [['script', {}, paletteHeadScript]],
  vite: {
    resolve: {
      alias: [
        {
          // The palette replaces the default light/dark switch everywhere it is used.
          find: /^.*\/VPNavAppearance\.vue$/,
          replacement: fileURLToPath(new URL('./theme/components/PaletteAppearance.vue', import.meta.url))
        }
      ]
    }
  },
  themeConfig: {
    // Green logo on dark backgrounds, black logo on light ones (Light mode, Sepia).
    logo: { light: '/logo-light.svg', dark: '/logo-dark.svg', alt: '' },
    search: {
      provider: 'local',
      options: {
        locales: {
          fr: {
            translations: {
              button: {
                buttonText: 'Rechercher',
                buttonAriaLabel: 'Rechercher dans la documentation'
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
                  closeKeyAriaLabel: 'Échap'
                }
              }
            }
          }
        }
      }
    }
  },
  locales: {
    root: {
      lang: 'en-US',
      label: 'English',
      themeConfig: {
        nav: [
          { text: 'User', link: '/user/' },
          { text: 'Contributor', link: '/contributor/' }
        ],
        sidebar: {
          '/user/': [
            {
              text: icon('👤', 'User'),
              items: [
                { text: icon('📦', 'Installation'), link: '/user/installation' },
                { text: icon('💡', 'Why Shimera'), link: '/user/why_shimera' },
                { text: icon('⚡', 'Performance'), link: '/user/performance/benchmark'},
                { text: icon('🧩', 'Effect Pipeline Builder'), link: '/user/effect_pipeline_builder' }
              ]
            },
            // Top-level groups are separated by a divider line; `collapsed: false`
            // makes them foldable (open by default).
            {
              text: icon('🧱', 'Materials'),
              collapsed: false,
              items: [
                { text: icon('📋', 'Overview'), link: '/user/materials/material_shaders' },
                { text: icon('💎', 'Fresnel'), link: '/user/materials/fresnel' }
              ]
            },
            {
              text: icon('🖌️', 'Shaders'),
              collapsed: false,
              items: [
                { text: icon('📋', 'Overview'), link: '/user/shaders/index' },
                { text: icon('🌅', 'Atmospheric Scattering'), link: '/user/shaders/atmospheric_scattering' },
                { text: icon('✨', 'Bloom'), link: '/user/shaders/bloom' },
                { text: icon('🔆', 'Brightness'), link: '/user/shaders/brightness' },
                { text: icon(chromaticAberrationIcon, 'Chromatic Aberration'), link: '/user/shaders/chromatic_aberration' },
                { text: icon('🎨', 'Color Tint'), link: '/user/shaders/color_tint' },
                { text: icon('🌗', 'Contrast'), link: '/user/shaders/contrast' },
                { text: icon('🌀', 'Distortion'), link: '/user/shaders/distortion' },
                { text: icon('🌫️', 'Gaussian Blur'), link: '/user/shaders/gaussian_blur' },
                { text: icon('🌈', 'Saturation'), link: '/user/shaders/saturation' },
                { text: icon(vignetteIcon, 'Vignette'), link: '/user/shaders/vignette' },
                { text: icon('👾', 'Pixelisation'), link: '/user/shaders/pixelisation' }
              ]
            }
          ],
          '/contributor/': [
            {
              text: icon('🤝', 'Contributor'),
              items: [
                { text: icon('🌿', 'Git Workflow'), link: '/contributor/git_workflow' },
                { text: icon('🏛️', 'Architecture'), link: '/contributor/architecture/technical_architecture' },
                { text: icon('🗺️', 'Architecture Diagram'), link: '/contributor/architecture/architecture_diagram' },
                { text: icon('📏', 'Code Standards'), link: '/contributor/code_standards' },
                { text: icon('📄', 'Technical Brief'), link: '/contributor/technical_brief'},
                { text: icon('🧭', 'Roadmap'), link: '/contributor/roadmap' },
              ]
            },
            {
              text: icon('🧪', 'Testing'),
              collapsed: false,
              items: [
                { text: icon('📋', 'Overview'), link: '/contributor/testing/index' },
                { text: icon('📖', 'Testing Guide'), link:'/contributor/testing/testing_guide' }
              ]
            }
          ]
        },
        socialLinks: [
          { icon: 'github', link: 'https://github.com/ShimeraTeam/Shimera' }
        ]
      }
    },
    fr: {
      lang: 'fr',
      label: 'French',
      themeConfig: {
        nav: [
          { text: 'Utilisateur', link: '/fr/user/' },
          { text: 'Contributeur', link: '/fr/contributor/' }
        ],
        sidebar: {
          '/fr/user/': [
            {
              text: icon('👤', 'Utilisateur'),
              items: [
                { text: icon('📦', 'Installation'), link: '/fr/user/installation' },
                { text: icon('💡', 'Pourquoi Shimera'), link: '/fr/user/why_shimera' },
                { text: icon('⚡', 'Performances'), link: '/fr/user/performance/benchmark'},
                { text: icon('🧩', 'Effect Pipeline Builder'), link: '/fr/user/effect_pipeline_builder' }
              ]
            },
            {
              text: icon('🧱', 'Matériaux'),
              collapsed: false,
              items: [
                { text: icon('📋', 'Vue d\'ensemble'), link: '/fr/user/materials/material_shaders' },
                { text: icon('💎', 'Fresnel'), link: '/fr/user/materials/fresnel' }
              ]
            },
            {
              text: icon('🖌️', 'Shaders'),
              collapsed: false,
              items: [
                { text: icon('📋', 'Vue d\'ensemble'), link: '/fr/user/shaders/index' },
                { text: icon('🌅', 'Atmospheric Scattering'), link: '/fr/user/shaders/atmospheric_scattering' },
                { text: icon('✨', 'Bloom'), link: '/fr/user/shaders/bloom' },
                { text: icon('🔆', 'Brightness'), link: '/fr/user/shaders/brightness' },
                { text: icon(chromaticAberrationIcon, 'Chromatic Aberration'), link: '/fr/user/shaders/chromatic_aberration' },
                { text: icon('🎨', 'Color Tint'), link: '/fr/user/shaders/color_tint' },
                { text: icon('🌗', 'Contrast'), link: '/fr/user/shaders/contrast' },
                { text: icon('🌀', 'Distortion'), link: '/fr/user/shaders/distortion' },
                { text: icon('🌫️', 'Gaussian Blur'), link: '/fr/user/shaders/gaussian_blur' },
                { text: icon('🌈', 'Saturation'), link: '/fr/user/shaders/saturation' },
                { text: icon(vignetteIcon, 'Vignette'), link: '/fr/user/shaders/vignette' },
                { text: icon('👾', 'Pixelisation'), link: '/fr/user/shaders/pixelisation' }
              ]
            }
          ],
          '/fr/contributor/': [
            {
              text: icon('🤝', 'Contributeur'),
              items: [
                { text: icon('🌿', 'Git Workflow'), link: '/fr/contributor/git_workflow' },
                { text: icon('🏛️', 'Architecture'), link: '/fr/contributor/architecture/technical_architecture' },
                { text: icon('🗺️', 'Diagramme d\'architecture'), link: '/fr/contributor/architecture/architecture_diagram' },
                { text: icon('📏', 'Standards de code'), link: '/fr/contributor/code_standards' },
                { text: icon('📄', 'Brief Technique'), link: '/fr/contributor/technical_brief'},
                { text: icon('🧭', 'Roadmap'), link: '/fr/contributor/roadmap' },
              ]
            },
            {
              text: icon('🧪', 'Tests'),
              collapsed: false,
              items: [
                { text: icon('📋', 'Vue d\'ensemble'), link: '/fr/contributor/testing/index' },
                { text: icon('📖', 'Guide de test'), link:'/fr/contributor/testing/testing_guide' }
              ]
            }
          ]
        },
        socialLinks: [
          { icon: 'github', link: 'https://github.com/ShimeraTeam/Shimera' }
        ]
      }
    }
  }
})
