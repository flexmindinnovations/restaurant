// Theme switcher + live swatches read from computed CSS custom properties.
const SWATCHES = [
  'background-canvas', 'background-subtle', 'surface-primary', 'surface-secondary', 'surface-sunken', 'surface-inverse', 'surface-brand',
  'text-primary', 'text-secondary', 'text-tertiary', 'text-brand', 'border-subtle', 'border-default', 'focus-ring',
  'action-primary-bg', 'action-secondary-bg', 'action-destructive-bg', 'action-highlight-bg',
  'status-success-solid', 'status-warning-solid', 'status-error-solid', 'status-info-solid', 'status-live', 'status-critical',
  'order-received', 'order-accepted', 'order-preparing', 'order-ready', 'order-served', 'order-cancelled',
  'chart-categorical-1', 'chart-categorical-2', 'chart-categorical-3', 'chart-categorical-4', 'chart-categorical-5', 'chart-categorical-6',
];
const root = document.documentElement;
const host = document.getElementById('swatches');
function renderSwatches() {
  const cs = getComputedStyle(root);
  host.innerHTML = SWATCHES.map((n) => {
    const v = cs.getPropertyValue(`--dosa-color-${n}`).trim();
    return `<div class="spec-swatch"><i style="background:var(--dosa-color-${n})"></i><span>${n}<br>${v}</span></div>`;
  }).join('');
}
function setTheme(name) {
  root.dataset.dosaTheme = name;
  document.querySelectorAll('[data-theme]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.theme === name)));
  renderSwatches();
}
document.querySelectorAll('[data-theme]').forEach((b) => b.addEventListener('click', () => setTheme(b.dataset.theme)));
document.getElementById('glass-off').addEventListener('change', (e) => {
  document.getElementById('glass-stage').dataset.dosaGlass = e.target.checked ? 'off' : 'on';
});
const initial = new URLSearchParams(location.search).get('theme');
setTheme(initial || root.dataset.dosaTheme);
if (new URLSearchParams(location.search).get('glass') === 'off') {
  document.getElementById('glass-off').checked = true;
  document.getElementById('glass-stage').dataset.dosaGlass = 'off';
}
