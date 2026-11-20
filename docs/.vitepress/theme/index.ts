import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import './styles/index.css'

/**
 * Theme layout:
 *   Layout.vue    default layout + Mermaid, license notice, home hero
 *   components/   HeroShowcase, LicenseNotice, PaletteAppearance
 *   palette/      appearance palette state + pre-paint script
 *   styles/       brand tokens, palette, sidebar icons, home layout
 */
export default {
  extends: DefaultTheme,
  Layout,
} satisfies Theme
