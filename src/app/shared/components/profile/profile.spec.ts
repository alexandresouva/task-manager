import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AuthFacade } from '@core/auth/services/auth-facade';
import { TestHelper } from '@testing/test-helper/test-helper';
import { MockComponent, MockService } from 'ng-mocks';
import { of } from 'rxjs';

import { Profile } from './profile';

@Component({
  selector: 'app-fake-login',
  template: '<div>Mock Login Component</div>',
})
class FakeLoginComponent {}

function setup() {
  const authFacadeMock = MockService(AuthFacade) as jest.Mocked<AuthFacade>;

  TestBed.configureTestingModule({
    imports: [Profile],
    providers: [
      { provide: AuthFacade, useValue: authFacadeMock },
      provideRouter([
        { path: 'login', component: MockComponent(FakeLoginComponent) },
      ]),
    ],
  }).compileComponents();

  const fixture = TestBed.createComponent(Profile);
  const component = fixture.componentInstance;
  fixture.detectChanges();
  const testHelper = new TestHelper(fixture);
  const location = TestBed.inject(Location);

  return { component, fixture, testHelper, authFacadeMock, location };
}

describe('Profile', () => {
  it('should create', () => {
    const { component } = setup();
    expect(component).toBeTruthy();
  });

  describe('when menu button is clicked', () => {
    it('should toggle menu visibility', () => {
      const { fixture, testHelper } = setup();

      let menu = testHelper.queries.query('profile-menu');
      expect(menu).toBeNull();

      testHelper.trigger.click('profile-menu-button');
      fixture.detectChanges();

      menu = testHelper.queries.query('profile-menu');
      expect(menu).toBeTruthy();
    });
  });

  describe('when clicking outside the component', () => {
    it('should close the menu', () => {
      const { fixture, testHelper } = setup();

      testHelper.trigger.click('profile-menu-button');
      fixture.detectChanges();

      let menu = testHelper.queries.query('profile-menu');
      expect(menu).toBeTruthy();

      testHelper.dispatch.clickAtViewportPoint(0, 0);
      fixture.detectChanges();

      menu = testHelper.queries.query('profile-menu');
      expect(menu).toBeNull();
    });
  });

  describe('when select the logout option', () => {
    it('should close the menu, start the logout process and redirect to the login page', fakeAsync(() => {
      const { fixture, testHelper, authFacadeMock, location } = setup();
      authFacadeMock.logout.mockReturnValue(of(void 0));

      testHelper.trigger.click('profile-menu-button');
      fixture.detectChanges();

      let menu = testHelper.queries.query('profile-menu');
      expect(menu).toBeTruthy();

      testHelper.dispatch.click('logout-option');
      fixture.detectChanges();
      tick();

      menu = testHelper.queries.query('profile-menu');

      expect(menu).toBeNull();
      expect(authFacadeMock.logout).toHaveBeenCalled();
      expect(location.path()).toBe('/login');
    }));
  });
});
