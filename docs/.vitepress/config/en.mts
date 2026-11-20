import type { DefaultTheme, LocaleSpecificConfig } from 'vitepress'
import { sidebar } from './sidebar.mts'

export const en: LocaleSpecificConfig<DefaultTheme.Config> & { label: string } = {
  lang: 'en-US',
  label: 'English',
  themeConfig: {
    nav: [
      { text: 'User', link: '/user/' },
      { text: 'Contributor', link: '/contributor/' },
    ],
    sidebar: sidebar('en'),
  },
}
