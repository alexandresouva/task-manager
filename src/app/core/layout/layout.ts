import { Component, computed, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { Header } from '@shared/components/header/header';
import { LoadingBars } from '@shared/components/loading-bars/loading-bars';
import { ToastList } from '@shared/components/toast-list/toast-list';

@Component({
  selector: 'app-layout',
  imports: [Header, RouterModule, ToastList, LoadingBars],
  template: `
    <app-header />
    <router-outlet />

    <!-- Global utility components -->
    <app-toast-list />
    <app-loading-bars [loading]="isNavigating()" />
  `,
})
export class Layout {
  private readonly router = inject(Router);

  protected readonly isNavigating = computed(
    () => !!this.router.currentNavigation(),
  );
}
