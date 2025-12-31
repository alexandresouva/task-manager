import { Route } from '@angular/router';

import { getTaskByIdResolver } from '@pages/edit/resolvers/get-task-by-id-resolver';

export const appRoutes: Route[] = [
  { path: '', redirectTo: 'tasks', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: 'tasks',
    loadComponent: () => import('./pages/list/list').then((m) => m.List),
  },
  {
    path: 'tasks/:id/edit',
    loadComponent: () => import('./pages/edit/edit').then((m) => m.Edit),
    resolve: {
      task: getTaskByIdResolver,
    },
  },
];
