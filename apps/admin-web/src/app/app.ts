import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Shell } from './shell/shell';
import { DosaThemeService } from './core/dosa-theme';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Shell],
  template: `<app-shell><router-outlet /></app-shell>`,
})
export class App {
  // Instantiated at startup so the saved theme is applied before first paint of the shell.
  protected readonly theme = inject(DosaThemeService);
}
