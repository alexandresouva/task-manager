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
    expect(service.isAuthenticated).toBeFalsy();
  });

  it('should set and get isAuthenticated correctly', () => {
    const { service } = setup();
    service.isAuthenticated = true;
    expect(service.isAuthenticated).toBeTruthy();
  });
});
