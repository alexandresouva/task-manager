import { TestBed } from '@angular/core/testing';

import { AuthStore } from './auth-store';

function setup() {
  TestBed.configureTestingModule({
    providers: [AuthStore],
  });
  const service = TestBed.inject(AuthStore);
  return { service };
}

describe('AuthStore', () => {
  it('should be created', () => {
    const { service } = setup();
    expect(service).toBeTruthy();
  });

  it('should return "false" for isAuthenticated by default', () => {
    const { service } = setup();
    expect(service.isAuthenticated()).toBeFalsy();
  });

  it('should set isAuthenticated when authenticate is called', () => {
    const { service } = setup();
    service.authenticate();
    expect(service.isAuthenticated()).toBeTruthy();
  });

  it('should set isAuthenticated to false when logout is called', () => {
    const { service } = setup();

    service.authenticate();
    service.logout();

    expect(service.isAuthenticated()).toBeFalsy();
  });
});
