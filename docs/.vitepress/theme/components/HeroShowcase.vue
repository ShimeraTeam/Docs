<script setup lang="ts">
/**
 * Home hero: rotating shader demos (animated GIFs).
 *
 * Motion: rotation pauses while the pointer or keyboard focus is inside the
 * showcase. Users who ask for reduced motion get no rotation and a still
 * frame (the current GIF frame is frozen on a canvas); the dots still let
 * them switch demos.
 */
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useData, withBase } from 'vitepress'

import distortionCA from '../../../res/shaders/distortion-chromaticAberration.gif'
import bloom from '../../../res/shaders/hdr-bloom.gif'
import pixelisation from '../../../res/shaders/pixelisation.gif'
import gaussianBlur from '../../../res/shaders/gaussian-blur.gif'
import colorShift from '../../../res/shaders/colorShift.gif'
import vignette from '../../../res/shaders/vignette.gif'

/** How long each shader stays on screen, in ms. */
const SLIDE_DURATION = 6000

const slides = [
  { src: distortionCA, page: 'distortion', en: 'Distortion + Chromatic Aberration', fr: 'Distorsion + Aberration chromatique' },
  { src: bloom, page: 'bloom', en: 'Bloom', fr: 'Bloom' },
  { src: pixelisation, page: 'pixelisation', en: 'Pixelisation', fr: 'Pixelisation' },
  { src: gaussianBlur, page: 'gaussian_blur', en: 'Gaussian Blur', fr: 'Flou gaussien' },
  { src: colorShift, page: 'color_tint', en: 'Color Tint', fr: 'Teinte de couleur' },
  { src: vignette, page: 'vignette', en: 'Vignette', fr: 'Vignettage' },
]

const { lang } = useData()
const isFr = computed(() => lang.value.startsWith('fr'))
const t = computed(() =>
  isFr.value
    ? { region: 'Démos des shaders', show: 'Afficher' }
    : { region: 'Shader demos', show: 'Show' }
)
const label = (i: number) => (isFr.value ? slides[i].fr : slides[i].en)
const link = (i: number) => withBase(`${isFr.value ? '/fr' : ''}/user/shaders/${slides[i].page}`)

const current = ref(0)
// GIFs are several MB each: only mount an <img> once it has been asked for.
const requested = ref<boolean[]>(slides.map((_, i) => i === 0))
const loaded = new Set<number>([0])

/** Set when the user asks for reduced motion: no rotation, still frames. */
const paused = ref(false)
/** Temporarily paused while hovered or focused (rotation only). */
let hovering = false

const imgEls: (HTMLImageElement | null)[] = []
const freezeCanvas = ref<HTMLCanvasElement | null>(null)

let timer: ReturnType<typeof setTimeout> | undefined
let preloadTimer: ReturnType<typeof setTimeout> | undefined

function preload(i: number): Promise<void> {
  if (loaded.has(i)) return Promise.resolve()
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = img.onerror = () => {
      loaded.add(i)
      resolve()
    }
    img.src = slides[i].src
  })
}

/** Draws the current GIF frame on the canvas shown while paused. */
function freezeFrame() {
  const img = imgEls[current.value]
  const canvas = freezeCanvas.value
  if (!img || !canvas || !img.complete || !img.naturalWidth) return
  canvas.width = img.naturalWidth
  canvas.height = img.naturalHeight
  canvas.getContext('2d')?.drawImage(img, 0, 0)
}

async function goTo(i: number) {
  await preload(i)
  requested.value[i] = true
  current.value = i
  if (paused.value) {
    await nextTick()
    const img = imgEls[i]
    if (img && !img.complete) img.addEventListener('load', freezeFrame, { once: true })
    else freezeFrame()
  }
  schedule()
}

function schedule() {
  clearTimeout(timer)
  clearTimeout(preloadTimer)
  if (paused.value) return
  const next = (current.value + 1) % slides.length
  // Start fetching the next GIF early so the switch is instant.
  preloadTimer = setTimeout(() => preload(next), SLIDE_DURATION / 3)
  timer = setTimeout(() => {
    if (hovering || document.hidden) return schedule()
    goTo(next)
  }, SLIDE_DURATION)
}

const onEnter = () => (hovering = true)
const onLeave = () => (hovering = false)

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    paused.value = true
    const img = imgEls[0]
    if (img && !img.complete) img.addEventListener('load', freezeFrame, { once: true })
    else freezeFrame()
  }
  schedule()
})

onBeforeUnmount(() => {
  clearTimeout(timer)
  clearTimeout(preloadTimer)
})
</script>

<template>
  <section
    class="hero-showcase"
    :aria-label="t.region"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
    @focusin="onEnter"
    @focusout="onLeave"
  >
    <!-- Announce slide changes only when they come from the user. -->
    <div class="frame" :aria-live="paused ? 'polite' : 'off'">
      <template v-for="(slide, i) in slides" :key="slide.page">
        <img
          v-if="requested[i]"
          :ref="(el) => (imgEls[i] = el as HTMLImageElement | null)"
          class="slide"
          :class="{ active: i === current }"
          :src="slide.src"
          :alt="label(i)"
          width="426"
          height="240"
          decoding="async"
          :aria-hidden="i !== current"
        />
      </template>
      <canvas v-show="paused" ref="freezeCanvas" class="freeze" aria-hidden="true" />
      <div v-if="!paused" :key="current" class="flash" aria-hidden="true" />

      <!-- Click anywhere on the demo to open its shader page. Mouse-only
           duplicate of the label link below, hidden from keyboard and
           screen readers so the page is announced once. -->
      <a class="frame-link" :href="link(current)" tabindex="-1" aria-hidden="true" />

      <a class="label" :href="link(current)">
        <span class="dot" aria-hidden="true" />
        <Transition name="label" mode="out-in">
          <span :key="current">{{ label(current) }}</span>
        </Transition>
      </a>
    </div>

    <!-- Not named `.controls`: vitepress-mermaid-renderer styles that class globally. -->
    <div class="hero-pager">
      <button
        v-for="(slide, i) in slides"
        :key="slide.page"
        type="button"
        class="dot-button"
        :class="{ active: i === current }"
        :aria-label="`${t.show} ${label(i)}`"
        :aria-current="i === current ? 'true' : undefined"
        @click="goTo(i)"
      />
    </div>
  </section>
</template>

<style scoped>
.hero-showcase {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  max-width: calc(100vw - 48px);
}

@media (min-width: 640px) {
  .hero-showcase { width: 400px; }
}

@media (min-width: 960px) {
  .hero-showcase { width: 440px; }
}

.frame {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: 14px;
  border: 1px solid var(--vp-c-brand-soft);
  box-shadow: 0 20px 50px -20px rgba(22, 163, 74, 0.55), 0 0 0 4px var(--vp-c-brand-soft);
  background: #0b1210;
  /* easeOutCirc */
  --ease-out-circ: cubic-bezier(0, 0.55, 0.45, 1);
  transition:
    transform 0.45s var(--ease-out-circ),
    box-shadow 0.45s var(--ease-out-circ);
}

/* Hovering (or focusing the label) keeps the current demo and brings it
   forward: the rotation pauses (see onEnter) and the card lifts and grows. */
.frame:hover,
.frame:focus-within {
  transform: translateY(-4px) scale(1.04);
  box-shadow: 0 30px 60px -18px rgba(22, 163, 74, 0.7), 0 0 0 4px var(--vp-c-brand-soft);
}

.slide,
.freeze {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.slide {
  opacity: 0;
  transform: scale(1.08);
  filter: blur(14px) saturate(1.8) hue-rotate(40deg);
  transition:
    opacity 0.9s ease,
    transform 1.2s cubic-bezier(0.22, 1, 0.36, 1),
    filter 1s ease;
}

.slide.active {
  opacity: 1;
  transform: scale(1);
  filter: none;
  z-index: 1;
}

/* Frozen frame shown on top of the (still animating) GIF while paused. */
.freeze {
  z-index: 2;
}

/* Green light sweep across the frame on every switch */
.flash {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  background: linear-gradient(100deg, transparent 30%, rgba(110, 230, 139, 0.45) 50%, transparent 70%);
  transform: translateX(-120%);
  animation: sweep 1.1s ease-out forwards;
  mix-blend-mode: screen;
}

@keyframes sweep {
  to { transform: translateX(120%); }
}

/* Covers the whole frame, above the GIFs and the sweep, below the label. */
.frame-link {
  position: absolute;
  inset: 0;
  z-index: 3;
  cursor: pointer;
}

/* Opaque enough for white text to stay >= 4.5:1 over any GIF frame. */
.label {
  position: absolute;
  left: 10px;
  bottom: 10px;
  z-index: 3;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 5px 12px 5px 10px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  text-decoration: none;
  background: rgba(5, 46, 22, 0.85);
  border: 1px solid rgba(110, 230, 139, 0.35);
  backdrop-filter: blur(8px);
  transition: background 0.2s;
}

.label:hover {
  background: rgba(5, 46, 22, 0.95);
  text-decoration: underline;
}

.label .dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #6ee68b;
  box-shadow: 0 0 8px #6ee68b;
}

.label-enter-active,
.label-leave-active {
  transition: opacity 0.25s, transform 0.25s;
}

.label-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.label-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.hero-pager {
  /* Out of flow so the frame itself sits at the exact vertical center */
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  margin-top: 8px;
}

/* 24×24 hit area (WCAG 2.5.8) around a small visual dot. */
.dot-button {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 24px;
  min-width: 24px;
  padding: 0;
  cursor: pointer;
}

.dot-button::before {
  content: '';
  display: block;
  width: 8px;
  height: 8px;
  border-radius: 999px;
  /* >= 3:1 against the page so the control is visible (WCAG 1.4.11). */
  background: var(--vp-c-text-3);
  transition: width 0.35s ease, background 0.35s ease;
}

.dot-button.active::before {
  width: 26px;
  background: var(--vp-c-brand-1);
}

.dot-button:focus-visible,
.label:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .slide { transition: opacity 0.4s ease; transform: none; filter: none; }
  .flash { display: none; }
  .dot-button::before { transition: none; }
  /* Keep the hover highlight (glow) but drop the movement. */
  .frame:hover,
  .frame:focus-within { transform: none; }
}
</style>
