import { NgOptimizedImage } from '@angular/common';
import { Component, ElementRef, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { AuthFacade } from '@core/auth/services/auth-facade';

@Component({
  selector: 'app-profile',
  imports: [NgOptimizedImage],
  templateUrl: './profile.html',
  host: {
    '(document:pointerdown)': 'closeMenuOnClickOutside($event)',
  },
})
export class Profile {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly authFacade = inject(AuthFacade);
  private readonly router = inject(Router);

  protected readonly isMenuOpen = signal(false);

  protected onLogout(): void {
    this.closeMenu();
    this.authFacade.logout().subscribe(() => {
      this.router.navigateByUrl('/login');
    });
  }

  /*
   * Ideally, the logic responsible for controlling the menu behavior should be
   * encapsulated in a directive or a reusable component.
   * Additionally, accessibility concerns and keyboard navigation should be
   * properly handled.
   *
   * There is clear room for refactoring and improvement here.
   */
  protected toggleMenu(): void {
    this.isMenuOpen.update((state) => !state);
  }

  protected closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  protected closeMenuOnClickOutside(event: MouseEvent): void {
    if (!this.host.nativeElement.contains(event.target)) {
      this.closeMenu();
    }
  }
}
