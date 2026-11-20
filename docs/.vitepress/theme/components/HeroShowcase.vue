<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useData, withBase } from 'vitepress';

import distortionCA from '../../../res/shaders/distortion-chromaticAberration.gif';
import bloom from '../../../res/shaders/hdr-bloom.gif';
import pixelisation from '../../../res/shaders/pixelisation.gif';
import gaussianBlur from '../../../res/shaders/gaussian-blur.gif';
import colorShift from '../../../res/shaders/colorShift.gif';
import vignette from '../../../res/shaders/vignette.gif';

/** How long each shader stays on screen, in ms. */
const SLIDE_DURATION = 6000;

const slides = [
  { src: distortionCA, page: 'distortion', en: 'Distortion + Chromatic Aberration', fr: 'Distorsion + Aberration chromatique' },
  { src: bloom, page: 'bloom', en: 'Bloom', fr: 'Bloom' },
  { src: pixelisation, page: 'pixelisation', en: 'Pixelisation', fr: 'Pixelisation' },
  { src: gaussianBlur, page: 'gaussian_blur', en: 'Gaussian Blur', fr: 'Flou gaussien' },
  { src: colorShift, page: 'color_tint', en: 'Color Tint', fr: 'Teinte de couleur' },
  { src: vignette, page: 'vignette', en: 'Vignette', fr: 'Vignettage' },
];

const { lang } = useData();
const isFr = computed(() => lang.value.startsWith('fr'));
const label = (i: number) => (isFr.value ? slides[i].fr : slides[i].en);
const link = (i: number) => withBase(`${isFr.value ? '/fr' : ''}/user/shaders/${slides[i].page}`);

const current = ref(0);
// GIFs are several MB each: only mount an <img> once it has been asked for.
const requested = ref<boolean[]>(slides.map((_, i) => i === 0));
const loaded = new Set<number>([0]);

let timer: ReturnType<typeof setTimeout> | undefined;
let paused = false;

function preload(i: number): Promise<void> {
  if (loaded.has(i)) return Promise.resolve();
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = img.onerror = () => {
      loaded.add(i);
      resolve();
    };
    img.src = slides[i].src;
  });
}

async function goTo(i: number) {
  await preload(i);
  requested.value[i] = true;
  current.value = i;
  schedule();
}

function schedule() {
  clearTimeout(timer);
  const next = (current.value + 1) % slides.length;
  // Start fetching the next GIF early so the switch is instant.
  setTimeout(() => preload(next), SLIDE_DURATION / 3);
  timer = setTimeout(() => {
    if (paused || document.hidden) return schedule();
    goTo(next);
  }, SLIDE_DURATION);
}

const pause = () => (paused = true);
const resume = () => (paused = false);

onMounted(schedule);
onBeforeUnmount(() => clearTimeout(timer));
</script>

<template>
  <div class="hero-showcase" @mouseenter="pause" @mouseleave="resume" @focusin="pause" @focusout="resume">
    <div class="frame">
      <template v-for="(slide, i) in slides" :key="slide.page">
        <img
          v-if="requested[i]"
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
      <div :key="current" class="flash" aria-hidden="true" />

      <a class="label" :href="link(current)">
        <span class="dot" aria-hidden="true" />
        <Transition name="label" mode="out-in">
          <span :key="current">{{ label(current) }}</span>
        </Transition>
      </a>
    </div>

    <div class="pager" role="tablist" :aria-label="isFr ? 'Shaders' : 'Shaders'">
      <button
        v-for="(slide, i) in slides"
        :key="slide.page"
        type="button"
        role="tab"
        :aria-selected="i === current"
        :aria-label="label(i)"
        :class="{ active: i === current }"
        @click="goTo(i)"
      />
    </div>
  </div>
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
}

.slide {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
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
  background: rgba(5, 46, 22, 0.55);
  border: 1px solid rgba(110, 230, 139, 0.35);
  backdrop-filter: blur(8px);
  transition: background 0.2s;
}

.label:hover {
  background: rgba(5, 46, 22, 0.8);
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

.pager {
  /* Out of flow so the frame itself sits at the exact vertical center */
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 14px;
}

.pager button {
  width: 8px;
  height: 8px;
  padding: 0;
  border-radius: 999px;
  background: var(--vp-c-default-soft);
  border: 1px solid var(--vp-c-divider);
  cursor: pointer;
  transition: width 0.35s ease, background 0.35s ease;
}

.pager button.active {
  width: 26px;
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}

@media (prefers-reduced-motion: reduce) {
  .slide { transition: opacity 0.4s ease; transform: none; filter: none; }
  .flash { display: none; }
}
</style>
