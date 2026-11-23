import { DOCUMENT, Injectable, effect, inject, signal } from '@angular/core';

/** Web themes for the admin app (packages/design-tokens/src/themes). */
export const ADMIN_THEMES = ['admin-light', 'admin-monitor'] as const;
export type AdminTheme = (typeof ADMIN_THEMES)[number];

const STORAGE_KEY = 'dosa.admin.theme';

/**
 * Applies a DOSA theme by setting `data-dosa-theme` on <html>. Every `--dosa-*` variable, and
 * through the Material bridge every `--mat-sys-*` variable, follows it at runtime.
 */
@Injectable({ providedIn: 'root' })
export class DosaThemeService {
  private readonly document = inject(DOCUMENT);
  readonly theme = signal<AdminTheme>(this.restore());

  constructor() {
    effect(() => {
      const theme = this.theme();
      this.document.documentElement.setAttribute('data-dosa-theme', theme);
      try {
        this.document.defaultView?.localStorage.setItem(STORAGE_KEY, theme);
      } catch {
        // Storage can be unavailable (private mode); the theme still applies for this session.
      }
    });
  }

  toggle(): void {
    this.theme.update((t) => (t === 'admin-light' ? 'admin-monitor' : 'admin-light'));
  }

  private restore(): AdminTheme {
    try {
      const saved = this.document.defaultView?.localStorage.getItem(STORAGE_KEY);
      if (saved && (ADMIN_THEMES as readonly string[]).includes(saved)) return saved as AdminTheme;
    } catch {
      // Fall through to the default theme.
    }
    return 'admin-light';
  }
}
