import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/Docs/',
  title: "Shimera",
  description: "Shimera Official Documentation",
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
              text: 'User',
              items: [
                { text: 'Installation', link: '/user/installation' },
                { text: 'Why Shimera', link: '/user/why_shimera' },
                { text: 'Performance', link: '/user/performance/benchmark'},
                { text: 'Effect Pipeline Builder', link: '/user/effect_pipeline_builder' },
                {
                  text: 'Materials',
                  items: [
                    { text: 'Index', link: '/user/materials/material_shaders' },
                    { text: 'Fresnel', link: '/user/materials/fresnel' }
                  ]
                },
                {
                  text: 'Shaders',
                  items: [
                    { text: 'Index', link: '/user/shaders/index' },
                    { text: 'Atmospheric Scattering', link: '/user/shaders/atmospheric_scattering' },
                    { text: 'Bloom', link: '/user/shaders/bloom' },
                    { text: 'Brightness', link: '/user/shaders/brightness' },
                    { text: 'Chromatic Aberration', link: '/user/shaders/chromatic_aberration' },
                    { text: 'Color Tint', link: '/user/shaders/color_tint' },
                    { text: 'Contrast', link: '/user/shaders/contrast' },
                    { text: 'Distortion', link: '/user/shaders/distortion' },
                    { text: 'Gaussian Blur', link: '/user/shaders/gaussian_blur' },
                    { text: 'Saturation', link: '/user/shaders/saturation' },
                    { text: 'Vignette', link: '/user/shaders/vignette' },
                    { text: 'Pixelisation', link: '/user/shaders/pixelisation' }
                  ]
                }
              ]
            }
          ],
          '/contributor/': [
            {
              text: 'Contributor',
              items: [
                { text: 'Git Workflow', link: '/contributor/git_workflow' },
                { text: 'Architecture', link: '/contributor/architecture/technical_architecture' },
                {
                  text: 'Testing',
                  items: [
                    { text: 'Index', link: '/contributor/testing/index' },
                    { text: 'Testing Guide', link:'/contributor/testing/testing_guide' }
                  ]
                },
                { text: 'Architecture Diagram', link: '/contributor/architecture/architecture_diagram' },
                { text: 'Code Standards', link: '/contributor/code_standards' },
                { text: 'Technical Brief', link: '/contributor/technical_brief'},
                { text: 'Roadmap', link: '/contributor/roadmap' },
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
              text: 'User',
              items: [
                { text: 'Installation', link: '/fr/user/installation' },
                { text: 'Pourquoi Shimera', link: '/fr/user/why_shimera' },
                { text: 'Performances', link: '/fr/user/performance/benchmark'},
                { text: 'Effect Pipeline Builder', link: '/fr/user/effect_pipeline_builder' },
                {
                  text: 'Matériaux',
                  items: [
                    { text: 'Index', link: '/fr/user/materials/material_shaders' },
                    { text: 'Fresnel', link: '/fr/user/materials/fresnel' }
                  ]
                },
                {
                  text: 'Shaders',
                  items: [
                    { text: 'Index', link: '/fr/user/shaders/index' },
                    { text: 'Atmospheric Scattering', link: '/fr/user/shaders/atmospheric_scattering' },
                    { text: 'Bloom', link: '/fr/user/shaders/bloom' },
                    { text: 'Brightness', link: '/fr/user/shaders/brightness' },
                    { text: 'Chromatic Aberration', link: '/fr/user/shaders/chromatic_aberration' },
                    { text: 'Color Tint', link: '/fr/user/shaders/color_tint' },
                    { text: 'Contrast', link: '/fr/user/shaders/contrast' },
                    { text: 'Distortion', link: '/fr/user/shaders/distortion' },
                    { text: 'Gaussian Blur', link: '/fr/user/shaders/gaussian_blur' },
                    { text: 'Saturation', link: '/fr/user/shaders/saturation' },
                    { text: 'Vignette', link: '/fr/user/shaders/vignette' },
                    { text: 'Pixelisation', link: '/fr/user/shaders/pixelisation' }
                  ]
                }
              ]
            }
          ],
          '/fr/contributor/': [
            {
              text: 'Contributeur',
              items: [
                { text: 'Git Workflow', link: '/fr/contributor/git_workflow' },
                { text: 'Architecture', link: '/fr/contributor/architecture/technical_architecture' },
                {
                  text: 'Tests',
                  items: [
                    { text: 'Index', link: '/fr/contributor/testing/index' },
                    { text: 'Guide de test', link:'/fr/contributor/testing/testing_guide' }
                  ]
                },
                { text: 'Diagramme d\'architecture', link: '/fr/contributor/architecture/architecture_diagram' },
                { text: 'Standards de code', link: '/fr/contributor/code_standards' },
                { text: 'Brief Technique', link: '/fr/contributor/technical_brief'},
                { text: 'Roadmap', link: '/fr/contributor/roadmap' },
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
