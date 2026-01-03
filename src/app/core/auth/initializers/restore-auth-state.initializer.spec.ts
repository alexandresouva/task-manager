import { ApplicationInitStatus } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { MockService } from 'ng-mocks';

import { restoreAuthStateInitializer } from './restore-auth-state.initializer';
import { AuthFacade } from '../services/auth-facade';

describe('restoreAuthStateInitializer', () => {
  it('should call AuthFacade.restoreAuthState on app initialization', async () => {
    const authFacadeMock = MockService(AuthFacade) as jest.Mocked<AuthFacade>;

    TestBed.configureTestingModule({
      providers: [
        {
          provide: AuthFacade,
          useValue: authFacadeMock,
        },
        restoreAuthStateInitializer(),
      ],
    });

    await TestBed.inject(ApplicationInitStatus).donePromise;

    expect(authFacadeMock.restoreAuthState).toHaveBeenCalledTimes(1);
  });
});
