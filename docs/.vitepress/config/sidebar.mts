import type { DefaultTheme } from 'vitepress'
import { chromaticAberrationIcon, vignetteIcon, withIcon } from './icons.mts'

/**
 * Single source for the sidebars of every locale: each entry has its icon,
 * its label per locale (a plain string when it is the same in all locales)
 * and its path relative to the section.
 *
 * Top-level groups are separated by a divider line; `collapsible` makes a
 * group foldable (open by default). In a `sorted` group, entries are listed
 * alphabetically in each locale, `pinned` entries (overviews) first.
 */

export type Locale = 'en' | 'fr'
type Label = string | Record<Locale, string>

interface Page {
  icon: string
  text: Label
  link: string
  pinned?: boolean
}

interface Group {
  icon: string
  text: Label
  collapsible?: boolean
  sorted?: boolean
  items: (Page | Group)[]
}

const overview: Label = { en: 'Overview', fr: "Vue d'ensemble" }

const user: Group[] = [
  {
    icon: '👤',
    text: { en: 'User', fr: 'Utilisateur' },
    items: [
      { icon: '📦', text: 'Installation', link: 'installation' },
      { icon: '💡', text: { en: 'Why Shimera', fr: 'Pourquoi Shimera' }, link: 'why_shimera' },
      { icon: '⚡', text: { en: 'Performance', fr: 'Performances' }, link: 'performance/benchmark' },
      { icon: '🧩', text: 'Effect Pipeline Builder', link: 'effect_pipeline_builder' },
    ],
  },
  {
    // Shader names are technical terms people search for in English.
    icon: '🖌️',
    text: 'Shaders',
    collapsible: true,
    sorted: true,
    items: [
      {
        icon: '🎞️',
        text: 'Post-processing',
        collapsible: true,
        sorted: true,
        items: [
          { icon: '📋', text: overview, link: 'shaders/index', pinned: true },
          { icon: '🌅', text: 'Atmospheric Scattering', link: 'shaders/atmospheric_scattering' },
          { icon: '✨', text: 'Bloom', link: 'shaders/bloom' },
          { icon: '🔆', text: 'Brightness', link: 'shaders/brightness' },
          { icon: chromaticAberrationIcon, text: 'Chromatic Aberration', link: 'shaders/chromatic_aberration' },
          { icon: '🎨', text: 'Color Tint', link: 'shaders/color_tint' },
          { icon: '🌗', text: 'Contrast', link: 'shaders/contrast' },
          { icon: '🌀', text: 'Distortion', link: 'shaders/distortion' },
          { icon: '🌫️', text: 'Gaussian Blur', link: 'shaders/gaussian_blur' },
          { icon: '👾', text: 'Pixelisation', link: 'shaders/pixelisation' },
          { icon: '🌈', text: 'Saturation', link: 'shaders/saturation' },
          { icon: vignetteIcon, text: 'Vignette', link: 'shaders/vignette' },
        ],
      },
      {
        icon: '🧱',
        text: { en: 'Materials', fr: 'Matériaux' },
        collapsible: true,
        sorted: true,
        items: [
          { icon: '📋', text: overview, link: 'materials/material_shaders', pinned: true },
          { icon: '💎', text: 'Fresnel', link: 'materials/fresnel' },
        ],
      },
    ],
  },
]

const contributor: Group[] = [
  {
    icon: '🤝',
    text: { en: 'Contributor', fr: 'Contributeur' },
    items: [
      { icon: '🌿', text: 'Git Workflow', link: 'git_workflow' },
      { icon: '🏛️', text: 'Architecture', link: 'architecture/technical_architecture' },
      { icon: '🗺️', text: { en: 'Architecture Diagram', fr: "Diagramme d'architecture" }, link: 'architecture/architecture_diagram' },
      { icon: '📏', text: { en: 'Code Standards', fr: 'Standards de code' }, link: 'code_standards' },
      { icon: '📄', text: { en: 'Technical Brief', fr: 'Brief Technique' }, link: 'technical_brief' },
      { icon: '🧭', text: 'Roadmap', link: 'roadmap' },
    ],
  },
  {
    icon: '🧪',
    text: { en: 'Testing', fr: 'Tests' },
    collapsible: true,
    items: [
      { icon: '📋', text: overview, link: 'testing/index' },
      { icon: '📖', text: { en: 'Testing Guide', fr: 'Guide de test' }, link: 'testing/testing_guide' },
    ],
  },
]

const label = (text: Label, locale: Locale) => (typeof text === 'string' ? text : text[locale])

const isGroup = (item: Page | Group): item is Group => 'items' in item

function sortItems(items: (Page | Group)[], locale: Locale) {
  const pinned = (item: Page | Group) => (!isGroup(item) && item.pinned ? 0 : 1)
  return [...items].sort(
    (a, b) => pinned(a) - pinned(b) || label(a.text, locale).localeCompare(label(b.text, locale), locale)
  )
}

function build(items: (Page | Group)[], base: string, locale: Locale): DefaultTheme.SidebarItem[] {
  return items.map((item) => {
    const text = withIcon(item.icon, label(item.text, locale))
    if (!isGroup(item)) return { text, link: `${base}${item.link}` }
    return {
      text,
      ...(item.collapsible ? { collapsed: false } : {}),
      items: build(item.sorted ? sortItems(item.items, locale) : item.items, base, locale),
    }
  })
}

export function sidebar(locale: Locale): DefaultTheme.Sidebar {
  const prefix = locale === 'en' ? '' : `/${locale}`
  return {
    [`${prefix}/user/`]: build(user, `${prefix}/user/`, locale),
    [`${prefix}/contributor/`]: build(contributor, `${prefix}/contributor/`, locale),
  }
}
