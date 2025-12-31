import { inject } from '@angular/core';
import { CanActivateFn, RedirectCommand, Router } from '@angular/router';

import { AuthStore } from '@shared/stores/auth-store';

export const isLoggedInGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  if (!authStore.isAuthenticated) {
    const loginTreeUrl = router.parseUrl('/login');
    return new RedirectCommand(loginTreeUrl);
  }

  return true;
};
