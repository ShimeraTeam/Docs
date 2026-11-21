<script setup lang="ts">
/**
 * Default layout + Shimera additions:
 * - Mermaid diagrams, re-rendered with the matching theme when the page
 *   switches between a light and a dark background (palette included);
 * - license notice under every doc page and under the home feature cards
 *   (the home layout has no doc footer);
 * - rotating shader demos in place of a static home hero image.
 */
import { onMounted, watch } from 'vue'
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { createMermaidRenderer } from 'vitepress-mermaid-renderer'
import HeroShowcase from './components/HeroShowcase.vue'
import LicenseNotice from './components/LicenseNotice.vue'

const { isDark } = useData()

const initMermaid = () => {
  if (typeof window === 'undefined') return
  createMermaidRenderer({ theme: isDark.value ? 'dark' : 'default' })
}

onMounted(initMermaid)
watch(isDark, initMermaid, { flush: 'post' })
</script>

<template>
  <DefaultTheme.Layout>
    <template #doc-footer-before>
      <LicenseNotice />
    </template>
    <template #home-hero-image>
      <HeroShowcase />
    </template>
    <template #home-features-after>
      <div class="home-license">
        <LicenseNotice />
      </div>
    </template>
  </DefaultTheme.Layout>
</template>
