import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BellRing, ChefHat, CircleCheck, CircleX, Inbox, Search, Sparkles, Timer, TrendingDown, TrendingUp, Utensils } from 'lucide-static';
import { DosaThemeService } from '../core/dosa-theme';
import { DosaIcon } from '../ui/dosa-icon';

interface OrderState {
  readonly id: 'received' | 'accepted' | 'preparing' | 'ready' | 'served' | 'cancelled' | 'delayed';
  readonly label: string;
  readonly icon: string;
}

/**
 * Foundations check: Angular Material components rendered through the DOSA bridge, plus DOSA
 * surfaces, type and status patterns. It verifies the wiring; it is not a product screen.
 */
@Component({
  selector: 'app-foundations',
  imports: [DosaIcon, MatButtonModule, MatCheckboxModule, MatChipsModule, MatFormFieldModule, MatInputModule, MatSlideToggleModule],
  templateUrl: './foundations.html',
  styleUrl: './foundations.scss',
})
export class Foundations {
  private readonly themes = inject(DosaThemeService);
  protected readonly icons = { Search, Sparkles, TrendingDown, TrendingUp };
  protected readonly mode = computed(() => (this.themes.theme() === 'admin-light' ? 'light' : 'dark'));

  protected readonly orderStates: readonly OrderState[] = [
    { id: 'received', label: 'Received', icon: Inbox },
    { id: 'accepted', label: 'Accepted', icon: CircleCheck },
    { id: 'preparing', label: 'Preparing', icon: ChefHat },
    { id: 'ready', label: 'Ready', icon: BellRing },
    { id: 'served', label: 'Served', icon: Utensils },
    { id: 'cancelled', label: 'Cancelled', icon: CircleX },
    { id: 'delayed', label: 'Delayed 6 min', icon: Timer },
  ];

  // Sample values to exercise numeric type styles; there is no data source in this phase.
  protected readonly metrics = [
    { label: 'Covers', value: '1,284', delta: '+8.2%', up: true },
    { label: 'Average ticket', value: '₹ 642.50', delta: '+3.1%', up: true },
    { label: 'Kitchen time', value: '14:08', delta: '−0:42', up: true },
    { label: 'Cancellations', value: '1.9%', delta: '+0.4%', up: false },
  ];
}
