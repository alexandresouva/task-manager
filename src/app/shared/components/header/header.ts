import { Component, inject } from '@angular/core';

import { AuthStore } from '@shared/stores/auth-store';

import { Profile } from '../profile/profile';

@Component({
  selector: 'app-header',
  imports: [Profile],
  templateUrl: './header.html',
})
export class Header {
  private readonly authStore = inject(AuthStore);

  protected readonly isAuthenticated = this.authStore.isAuthenticated;
}
