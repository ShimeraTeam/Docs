<script setup lang="ts">
/**
 * Replaces VitePress' `VPNavAppearance.vue` (see the alias in config.mts), so
 * the palette shows up everywhere the light/dark switch used to be:
 * - nav bar (`row` false): palette icon button + popover;
 * - `⋯` menu (`row`) and mobile nav screen (`row` + `screen`): inline panel.
 */
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId } from 'vue'
import { useData } from 'vitepress'
import { useNavOverflow } from 'vitepress/dist/client/theme-default/composables/nav-overflow.js'
import { ACCENTS, MODES, PRESETS, usePalette, type Accent, type Mode, type Preset } from '../palette'

const props = defineProps<{ row?: boolean; screen?: boolean }>()

const { lang } = useData()
const palette = usePalette()

// Only the bar button takes part in the nav overflow engine (like the original).
const overflow = props.row ? null : useNavOverflow()
const isCollapsed = computed(() => !!overflow && !overflow.state.appearance)

const fr = computed(() => lang.value.startsWith('fr'))
const t = computed(() =>
  fr.value
    ? {
        button: "Personnaliser l'apparence",
        appearance: 'Apparence',
        colors: 'Couleurs',
        presets: 'Préréglages',
        modes: { light: 'Clair', dark: 'Sombre', amoled: 'AMOLED' } as Record<Mode, string>,
        accents: { indigo: 'Indigo', cyan: 'Cyan', green: 'Vert', amber: 'Ambre', rose: 'Rose', violet: 'Violet' } as Record<Accent, string>,
        presetNames: { 'high-contrast': 'Haut contraste', sepia: 'Sépia' } as Record<Preset, string>,
      }
    : {
        button: 'Customize appearance',
        appearance: 'Appearance',
        colors: 'Color themes',
        presets: 'Theme presets',
        modes: { light: 'Light', dark: 'Dark', amoled: 'AMOLED' } as Record<Mode, string>,
        accents: { indigo: 'Indigo', cyan: 'Cyan', green: 'Green', amber: 'Amber', rose: 'Rose', violet: 'Violet' } as Record<Accent, string>,
        presetNames: { 'high-contrast': 'High contrast', sepia: 'Sepia' } as Record<Preset, string>,
      }
)

const open = ref(false)
const rootEl = ref<HTMLElement | null>(null)
const buttonEl = ref<HTMLButtonElement | null>(null)
const panelId = useId()
const ids = { appearance: useId(), colors: useId(), presets: useId() }

function toggle() {
  open.value = !open.value
  if (open.value) nextTick(() => rootEl.value?.querySelector<HTMLElement>('.panel button')?.focus())
}

function close(returnFocus = false) {
  if (!open.value) return
  open.value = false
  if (returnFocus) buttonEl.value?.focus()
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') close(true)
}

function onPointerDown(e: PointerEvent) {
  if (rootEl.value && !rootEl.value.contains(e.target as Node)) close()
}

function onFocusOut(e: FocusEvent) {
  const next = e.relatedTarget as Node | null
  if (next && rootEl.value && !rootEl.value.contains(next)) close()
}

onMounted(() => {
  palette.restore()
  document.addEventListener('pointerdown', onPointerDown)
})
onBeforeUnmount(() => document.removeEventListener('pointerdown', onPointerDown))

const setRoot = (el: unknown) => {
  rootEl.value = el as HTMLElement | null
  overflow?.setClusterEl('appearance', el as HTMLElement | null)
}
</script>

<template>
  <div
    :ref="setRoot"
    class="PaletteAppearance"
    :class="[row ? (screen ? 'is-screen' : 'is-menu') : 'is-bar VPNavBarAppearance', { collapsed: isCollapsed }]"
    @keydown="onKeydown"
    @focusout="onFocusOut"
  >
    <button
      v-if="!row"
      ref="buttonEl"
      type="button"
      class="trigger"
      :aria-label="t.button"
      :title="t.button"
      aria-haspopup="true"
      :aria-expanded="open"
      :aria-controls="panelId"
      @click="toggle"
    >
      <!-- Palette icon (Lucide "palette", ISC license) -->
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
        <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
        <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
        <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
        <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
      </svg>
    </button>

    <div v-show="row || open" :id="panelId" class="panel" :class="{ floating: !row }" role="group" :aria-label="t.button">
      <section :aria-labelledby="ids.appearance">
        <p :id="ids.appearance" class="title">{{ t.appearance }}</p>
        <div class="modes">
          <button
            v-for="m in MODES"
            :key="m"
            type="button"
            class="mode"
            :aria-pressed="palette.mode.value === m"
            @click="palette.setMode(m)"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
              <template v-if="m === 'light'">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
              </template>
              <path v-else-if="m === 'dark'" d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              <template v-else>
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                <path d="M19 3v4M21 5h-4" />
              </template>
            </svg>
            <span class="label">{{ t.modes[m] }}</span>
            <svg v-if="palette.mode.value === m" class="check" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </button>
        </div>
      </section>

      <section :aria-labelledby="ids.colors">
        <p :id="ids.colors" class="title">{{ t.colors }}</p>
        <div class="swatches">
          <button
            v-for="a in ACCENTS"
            :key="a.id"
            type="button"
            class="swatch"
            :style="{ '--swatch': a.swatch }"
            :aria-label="t.accents[a.id]"
            :title="t.accents[a.id]"
            :aria-pressed="palette.accent.value === a.id"
            @click="palette.setAccent(a.id)"
          >
            <svg v-if="palette.accent.value === a.id" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </button>
        </div>
      </section>

      <section :aria-labelledby="ids.presets">
        <p :id="ids.presets" class="title">{{ t.presets }}</p>
        <div class="presets">
          <button
            v-for="p in PRESETS"
            :key="p.id"
            type="button"
            class="preset"
            :aria-pressed="palette.preset.value === p.id"
            @click="palette.setPreset(p.id)"
          >
            <span class="preset-swatch" :style="{ '--bg': p.bg, '--fg': p.fg }" aria-hidden="true">Aa</span>
            <span class="label">{{ t.presetNames[p.id] }}</span>
            <svg v-if="palette.preset.value === p.id" class="check" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.PaletteAppearance {
  position: relative;
}

/* Bar variant: hidden on small screens, where the nav screen shows the panel. */
.is-bar {
  display: none;
}

@media (min-width: 48rem) {
  .is-bar {
    display: flex;
    align-items: center;
  }
}

.trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  color: var(--vp-c-text-2);
  transition: color 0.25s, background-color 0.25s;
}

.trigger:hover,
.trigger[aria-expanded='true'] {
  color: var(--vp-c-text-1);
  background-color: var(--vp-c-default-soft);
}

.panel.floating {
  position: absolute;
  top: calc(100% + 8px);
  inset-inline-end: 0;
  z-index: 100;
  width: 16rem;
  padding: 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background-color: var(--vp-c-bg-elv);
  box-shadow: var(--vp-shadow-3);
}

.is-menu .panel {
  min-width: 15rem;
  padding: 0 12px;
}

.is-screen .panel {
  padding: 12px 14px;
  border-radius: 8px;
  background-color: var(--vp-c-bg-soft);
}

section + section {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--vp-c-divider);
}

.title {
  margin: 0 0 6px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--vp-c-text-2);
}

.modes,
.presets {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.mode,
.preset {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 6px 8px;
  border-radius: 6px;
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--vp-c-text-1);
  text-align: start;
  transition: background-color 0.2s;
}

.mode:hover,
.preset:hover {
  background-color: var(--vp-c-default-soft);
}

.mode[aria-pressed='true'],
.preset[aria-pressed='true'] {
  color: var(--vp-c-brand-1);
  font-weight: 600;
}

.label {
  flex: 1;
}

.check {
  flex-shrink: 0;
}

.swatches {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.swatch {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: var(--swatch);
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.25);
  transition: transform 0.15s;
}

.swatch:hover {
  transform: scale(1.1);
}

.swatch[aria-pressed='true'] {
  outline: 2px solid var(--vp-c-text-1);
  outline-offset: 2px;
}

.preset-swatch {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 22px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--fg);
  background-color: var(--bg);
  box-shadow: inset 0 0 0 1px rgba(128, 128, 128, 0.6);
}

/* Always-visible focus ring for keyboard users. */
button:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}
</style>
