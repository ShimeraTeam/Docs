import { defineComponent, h, onMounted, watch } from 'vue';
import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import { useData } from 'vitepress';
import { createMermaidRenderer } from 'vitepress-mermaid-renderer';

export default {
  extends: DefaultTheme,
  Layout: defineComponent({
     setup() {
       const { isDark, lang } = useData();

      // The default theme hides `themeConfig.footer` on pages with a sidebar,
      // so the license notice is also rendered at the bottom of every doc page.
      const licenseNotice = () => {
        const fr = lang.value.startsWith('fr');
        const cc = fr
          ? 'https://creativecommons.org/licenses/by/4.0/deed.fr'
          : 'https://creativecommons.org/licenses/by/4.0/';
        const gpl = 'https://github.com/ShimeraTeam/Shimera/blob/main/LICENSE';
        return h('p', {
          class: 'license-notice',
          style: 'margin-top: 2rem; font-size: 0.8rem; color: var(--vp-c-text-3);',
          innerHTML: fr
            ? `© 2025-2026 The Shimera Authors. Documentation sous licence <a href="${cc}">CC BY 4.0</a>. La librairie Shimera est sous licence <a href="${gpl}">GPL-3.0-only</a>.`
            : `© 2025-2026 The Shimera Authors. Documentation licensed under <a href="${cc}">CC BY 4.0</a>. The Shimera library is licensed under <a href="${gpl}">GPL-3.0-only</a>.`,
        });
      };

      const initMermaid = () => {
          if (typeof window === 'undefined') return;

      createMermaidRenderer({
           theme: isDark.value ? 'dark' : 'default',
         });
       };

    onMounted(initMermaid);
       watch(
         () => isDark.value,
         initMermaid,
         { flush: 'post' },
       );
       return () => h(DefaultTheme.Layout, null, {
         'doc-footer-before': licenseNotice,
       });
     },
   }),
} satisfies Theme;
