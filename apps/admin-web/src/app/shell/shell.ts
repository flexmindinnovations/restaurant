import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LayoutGrid, Moon, Sun } from 'lucide-static';
import { DosaThemeService } from '../core/dosa-theme';
import { DosaIcon } from '../ui/dosa-icon';

/**
 * Application frame only: glass top bar, sidebar and content area. No product screens live here
 * yet; navigation lists the single foundations check page.
 */
@Component({
  selector: 'app-shell',
  imports: [DosaIcon, MatButtonModule, MatListModule, MatSidenavModule, MatTooltipModule, RouterLink, RouterLinkActive],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class Shell {
  protected readonly themes = inject(DosaThemeService);
  protected readonly icons = { LayoutGrid, Moon, Sun };
}
