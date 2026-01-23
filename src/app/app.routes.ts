import { Route } from '@angular/router';

import { isLoggedInGuard } from '@core/auth/guards/is-logged-in-guard';
import { EditFacade } from '@features/edit/edit-facade';
import { getTaskByIdResolver } from '@features/edit/resolvers/get-task-by-id-resolver';
import { ListFacade } from '@features/list/list-facade';
import { ListStore } from '@features/list/list-store';

export const appRoutes: Route[] = [
  {
    path: 'login',
    loadComponent: () => import('./features/login/login').then((m) => m.Login),
  },
  {
    path: '',
    canActivateChild: [isLoggedInGuard],
    children: [
      { path: '', redirectTo: 'tasks', pathMatch: 'full' },
      {
        path: 'tasks',
        loadComponent: () => import('./features/list/list').then((m) => m.List),
        providers: [ListFacade, ListStore],
      },
      {
        path: 'tasks/:id/edit',
        loadComponent: () => import('./features/edit/edit').then((m) => m.Edit),
        resolve: {
          task: getTaskByIdResolver,
        },
        providers: [EditFacade],
      },
    ],
  },
];
