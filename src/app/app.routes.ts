import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./pages/list/list').then((m) => m.List),
  },
];
