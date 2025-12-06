import { Component, computed, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { Header } from '@shared/components/header/header';
import { LoadingBars } from '@shared/components/loading-bars/loading-bars';
import { ToastList } from '@shared/components/toast-list/toast-list';

@Component({
  imports: [RouterModule, Header, ToastList, LoadingBars],
  selector: 'app-root',
  templateUrl: './app.html',
})
export class App {
  private readonly router = inject(Router);

  readonly isNavigating = computed(() => !!this.router.currentNavigation());
}
