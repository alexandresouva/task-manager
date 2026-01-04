import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { AuthStore } from '@shared/stores/auth-store';
import { MockService } from 'ng-mocks';

import { Header } from './header';

type SetupParams = {
  isAuthenticated: boolean;
};

async function setup({ isAuthenticated = false }: Partial<SetupParams> = {}) {
  const authStoreMock = MockService(AuthStore) as jest.Mocked<AuthStore>;
  Object.defineProperty(authStoreMock, 'isAuthenticated', {
    value: signal(isAuthenticated),
  });

  // Configure the testing module
  TestBed.configureTestingModule({
    imports: [Header],
    providers: [{ provide: AuthStore, useValue: authStoreMock }],
  });
  // Compile the components (external templates and styles)
  await TestBed.compileComponents();

  const fixture = TestBed.createComponent(Header);
  const component = fixture.componentInstance;
  fixture.detectChanges();

  return { component, fixture, authStoreMock };
}

describe('Header', () => {
  it('should create', async () => {
    const { component } = await setup();
    expect(component).toBeTruthy();
  });

  it('should render title', async () => {
    const { fixture } = await setup();
    const h1DebugEl = fixture.debugElement.query(By.css('h1'));
    const h1Content = h1DebugEl.nativeElement.textContent;

    expect(h1Content).toBe('Task Manager');
  });

  describe('when user is authenticated', () => {
    it('should render profile component', async () => {
      const { fixture } = await setup({ isAuthenticated: true });

      const profileDebugEl = fixture.debugElement.query(By.css('app-profile'));
      expect(profileDebugEl).toBeTruthy();
    });
  });

  describe('when user is not authenticated', () => {
    it('should not render profile component', async () => {
      const { fixture } = await setup({ isAuthenticated: false });

      const profileDebugEl = fixture.debugElement.query(By.css('app-profile'));
      expect(profileDebugEl).toBeFalsy();
    });
  });
});
