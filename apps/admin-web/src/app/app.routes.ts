import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'DOSA Admin · Foundations',
    loadComponent: () => import('./foundations/foundations').then((m) => m.Foundations),
  },
  { path: '**', redirectTo: '' },
];
