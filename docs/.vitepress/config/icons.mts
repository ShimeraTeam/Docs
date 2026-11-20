/**
 * Sidebar label with a decorative icon (emoji or inline SVG). The icon is
 * hidden from screen readers so they only announce the page name.
 */
export const withIcon = (icon: string, text: string) =>
  `<span class="sidebar-icon" aria-hidden="true">${icon}</span>${text}`

// Custom icons for effects without a fitting emoji. Fixed colors + a neutral
// outline so they stay visible on every background.

export const chromaticAberrationIcon =
  '<svg viewBox="0 0 24 24" focusable="false"><g stroke="#7f7f7f" stroke-width="0.8">' +
  '<circle cx="9" cy="10" r="6" fill="#ff3b30" fill-opacity="0.85"/>' +
  '<circle cx="15" cy="10" r="6" fill="#34c759" fill-opacity="0.85"/>' +
  '<circle cx="12" cy="15" r="6" fill="#0a84ff" fill-opacity="0.85"/></g></svg>'

export const vignetteIcon =
  '<svg viewBox="0 0 24 24" focusable="false"><defs>' +
  '<radialGradient id="shimera-vignette-icon" cx="50%" cy="50%" r="62%">' +
  '<stop offset="30%" stop-color="#fff4d6"/><stop offset="100%" stop-color="#1c1c1c"/>' +
  '</radialGradient></defs>' +
  '<rect x="2.5" y="4.5" width="19" height="15" rx="2.5" fill="url(#shimera-vignette-icon)" stroke="#7f7f7f" stroke-width="0.8"/></svg>'
