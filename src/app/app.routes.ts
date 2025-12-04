import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  { path: '', redirectTo: 'tasks', pathMatch: 'full' },
  {
    path: 'tasks',
    loadComponent: () => import('./pages/list/list').then((m) => m.List),
  },
  {
    path: 'tasks/:id/edit',
    loadComponent: () => import('./pages/edit/edit').then((m) => m.Edit),
  },
];
