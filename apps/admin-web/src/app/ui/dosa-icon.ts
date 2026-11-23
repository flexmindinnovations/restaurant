import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

export type DosaIconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/**
 * Lucide icon (ASSET_GUIDELINES §4). Pass an SVG string from `lucide-static`, e.g.
 * `import { Moon } from 'lucide-static'`. Icons inherit `currentColor`; size and stroke come from
 * `size.icon.*` / `size.icon-stroke.*`. Decorative unless `label` is set.
 */
@Component({
  selector: 'dosa-icon',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[innerHTML]': 'markup()',
    '[class]': '"dosa-icon dosa-icon--" + size()',
    '[attr.role]': 'label() ? "img" : null',
    '[attr.aria-label]': 'label() ?? null',
    '[attr.aria-hidden]': 'label() ? null : "true"',
  },
  styles: `
    :host { display: inline-flex; flex: none; inline-size: var(--_size); block-size: var(--_size); --_size: var(--dosa-size-icon-md); --_stroke: var(--dosa-size-icon-stroke-default); }
    :host(.dosa-icon--xs) { --_size: var(--dosa-size-icon-xs); --_stroke: var(--dosa-size-icon-stroke-bold); }
    :host(.dosa-icon--sm) { --_size: var(--dosa-size-icon-sm); }
    :host(.dosa-icon--lg) { --_size: var(--dosa-size-icon-lg); }
    :host(.dosa-icon--xl) { --_size: var(--dosa-size-icon-xl); --_stroke: var(--dosa-size-icon-stroke-fine); }
    :host(.dosa-icon--2xl) { --_size: var(--dosa-size-icon-2xl); --_stroke: var(--dosa-size-icon-stroke-fine); }
    :host ::ng-deep svg { inline-size: 100%; block-size: 100%; stroke-width: var(--_stroke); }
  `,
})
export class DosaIcon {
  private readonly sanitizer = inject(DomSanitizer);
  /** Trusted SVG markup from the `lucide-static` package (never user input). */
  readonly svg = input.required<string>();
  readonly size = input<DosaIconSize>('md');
  readonly label = input<string>();
  protected readonly markup = computed(() => this.sanitizer.bypassSecurityTrustHtml(this.svg()));
}
