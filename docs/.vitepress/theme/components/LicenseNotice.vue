<script setup lang="ts">
/**
 * License notice at the bottom of every doc page. The default theme hides
 * `themeConfig.footer` on pages with a sidebar, so it is rendered through
 * the `doc-footer-before` slot instead (see Layout.vue).
 */
import { computed } from 'vue'
import { useData } from 'vitepress'

const { lang } = useData()
const fr = computed(() => lang.value.startsWith('fr'))

const ccUrl = computed(() =>
  fr.value ? 'https://creativecommons.org/licenses/by/4.0/deed.fr' : 'https://creativecommons.org/licenses/by/4.0/'
)
const gplUrl = 'https://github.com/ShimeraTeam/Shimera/blob/main/LICENSE'
</script>

<template>
  <p class="license-notice">
    <template v-if="fr">
      © 2025-2026 The Shimera Authors. Documentation sous licence <a :href="ccUrl">CC BY 4.0</a>.
      La librairie Shimera est sous licence <a :href="gplUrl">GPL-3.0-only</a>.
    </template>
    <template v-else>
      © 2025-2026 The Shimera Authors. Documentation licensed under <a :href="ccUrl">CC BY 4.0</a>.
      The Shimera library is licensed under <a :href="gplUrl">GPL-3.0-only</a>.
    </template>
  </p>
</template>

<style scoped>
.license-notice {
  margin-top: 2rem;
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
}

.license-notice a {
  color: var(--vp-c-brand-1);
  text-decoration: underline;
  text-underline-offset: 2px;
}
</style>
