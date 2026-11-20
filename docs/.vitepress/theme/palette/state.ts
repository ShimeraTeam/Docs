import { computed, reactive, watch } from 'vue'
import { useData } from 'vitepress'
import { STORAGE_KEY, VITEPRESS_APPEARANCE_KEY } from './head.mts'

/**
 * Appearance palette: replaces VitePress' light/dark switch.
 *
 * - `mode`   light / dark / AMOLED (pure black). Unset = follow the system.
 * - `accent` brand color used for links, active sidebar items, buttons.
 * - `preset` full theme (background + text + accent). Overrides mode and accent;
 *            picking a mode or an accent leaves the preset.
 *
 * The choice is persisted in localStorage. An inline script in the page head
 * (see `paletteHeadScript`) applies it before the first paint to avoid a flash.
 */

export type Mode = 'light' | 'dark' | 'amoled'
export type Accent = 'shimera' | 'indigo' | 'cyan' | 'amber' | 'rose' | 'violet'
export type Preset = 'high-contrast' | 'sepia'

export const MODES: Mode[] = ['light', 'dark', 'amoled']

/** Default accent: the Shimera logo green. */
export const DEFAULT_ACCENT: Accent = 'shimera'

/** Swatch = a mid shade of each accent, only used to draw the color button. */
export const ACCENTS: { id: Accent; swatch: string }[] = [
  { id: 'shimera', swatch: '#6ee68b' },
  { id: 'indigo', swatch: '#646cff' },
  { id: 'cyan', swatch: '#06b6d4' },
  { id: 'amber', swatch: '#f59e0b' },
  { id: 'rose', swatch: '#f43f5e' },
  { id: 'violet', swatch: '#8b5cf6' },
]

/** `dark` tells VitePress (and Mermaid) which base the preset is built on. */
export const PRESETS: { id: Preset; dark: boolean; bg: string; fg: string }[] = [
  { id: 'high-contrast', dark: true, bg: '#000000', fg: '#ffd60a' },
  { id: 'sepia', dark: false, bg: '#f4ecd8', fg: '#8a3f0d' },
]

interface StoredPalette {
  mode?: Mode
  accent?: Accent
  preset?: Preset | null
}

const state = reactive<StoredPalette>({})
let loaded = false

function load() {
  if (loaded || typeof window === 'undefined') return
  loaded = true
  try {
    Object.assign(state, JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'))
    // Drop an accent that no longer exists (e.g. the former "green").
    if (state.accent && !ACCENTS.some((a) => a.id === state.accent)) delete state.accent
  } catch {
    // Corrupted storage: start from the defaults.
  }
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Storage unavailable (private mode…): the choice lasts for this visit only.
  }
}

/** Dark base wanted by the user, or `null` when nothing was chosen (follow the system). */
function wantedDark(): boolean | null {
  if (state.preset) return PRESETS.find((p) => p.id === state.preset)!.dark
  if (state.mode) return state.mode !== 'light'
  return null
}

function applyAttributes() {
  const root = document.documentElement
  root.toggleAttribute('data-amoled', !state.preset && state.mode === 'amoled')
  // A preset carries its own accent, so the accent attribute is dropped meanwhile.
  if (state.accent && !state.preset) root.setAttribute('data-accent', state.accent)
  else root.removeAttribute('data-accent')
  if (state.preset) root.setAttribute('data-preset', state.preset)
  else root.removeAttribute('data-preset')
}

export function usePalette() {
  const { isDark } = useData()
  load()

  const syncDark = () => {
    const dark = wantedDark()
    if (dark !== null && isDark.value !== dark) isDark.value = dark
  }

  // Keep VitePress' dark class in line with the palette, even if the system
  // theme changes while the page is open.
  watch(isDark, syncDark)

  const commit = () => {
    save()
    applyAttributes()
    syncDark()
    const dark = wantedDark()
    if (dark !== null) {
      try {
        localStorage.setItem(VITEPRESS_APPEARANCE_KEY, dark ? 'dark' : 'light')
      } catch {}
    }
  }

  return {
    /** Mode shown as selected; follows the system until the user picks one. */
    mode: computed<Mode | null>(() =>
      state.preset ? null : state.mode ?? (isDark.value ? 'dark' : 'light')
    ),
    accent: computed<Accent | null>(() => (state.preset ? null : state.accent ?? DEFAULT_ACCENT)),
    preset: computed(() => state.preset ?? null),
    setMode(mode: Mode) {
      state.mode = mode
      state.preset = null
      commit()
    },
    setAccent(accent: Accent) {
      state.accent = accent
      state.preset = null
      commit()
    },
    setPreset(preset: Preset) {
      state.preset = preset
      commit()
    },
    /** Re-applies the stored choice (used once on mount). */
    restore() {
      applyAttributes()
      syncDark()
    },
  }
}
