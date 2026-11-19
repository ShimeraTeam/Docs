// No imports here: this file is also loaded by the Node-side VitePress config.

export const STORAGE_KEY = 'shimera-palette'
export const VITEPRESS_APPEARANCE_KEY = 'vitepress-theme-appearance'

/**
 * Runs in <head> before the first paint. Mirrors `applyAttributes` + `syncDark`
 * from `palette.ts` and aligns VitePress' own storage key so its dark-mode
 * logic agrees with the palette.
 */
export const paletteHeadScript = `(function(){try{
var s=JSON.parse(localStorage.getItem('${STORAGE_KEY}')||'{}'),d=document.documentElement;
var p={'high-contrast':true,sepia:false};
var dark=s.preset in p?p[s.preset]:s.mode?s.mode!=='light':null;
if(dark!==null){d.classList.toggle('dark',dark);localStorage.setItem('${VITEPRESS_APPEARANCE_KEY}',dark?'dark':'light');}
if(s.mode==='amoled'&&!s.preset)d.setAttribute('data-amoled','');
if(s.accent&&!s.preset)d.setAttribute('data-accent',s.accent);
if(s.preset)d.setAttribute('data-preset',s.preset);
}catch(e){}})()`
