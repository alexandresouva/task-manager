import {
  HttpClient,
  HttpInterceptorFn,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { MockService } from 'ng-mocks';

import { addAuthHeaderInterceptor } from './add-auth-header-interceptor';
import { AuthStorageService } from '../services/auth-storage-service';

function setup() {
  const authStorageMock = MockService(
    AuthStorageService,
  ) as jest.Mocked<AuthStorageService>;

  TestBed.configureTestingModule({
    providers: [
      provideHttpClient(withInterceptors([addAuthHeaderInterceptor])),
      provideHttpClientTesting(),
      { provide: AuthStorageService, useValue: authStorageMock },
    ],
  });

  const httpClient = TestBed.inject(HttpClient);
  const httpTestingController = TestBed.inject(HttpTestingController);

  return { authStorageMock, httpClient, httpTestingController };
}

describe('addAuthHeaderInterceptor', () => {
  const fakeEndpoint = '/fake-endpoint';

  it('should be created', () => {
    const interceptor: HttpInterceptorFn = (req, next) =>
      TestBed.runInInjectionContext(() => addAuthHeaderInterceptor(req, next));
    expect(interceptor).toBeTruthy();
  });

  describe('when a token is present', () => {
    it('should set token to "Authorization" header', () => {
      const { authStorageMock, httpClient, httpTestingController } = setup();
      const fakeToken = 'fake_jwt_token';

      authStorageMock.getToken.mockReturnValue(fakeToken);

      httpClient.get(fakeEndpoint).subscribe();
      const req = httpTestingController.expectOne(fakeEndpoint);

      expect(authStorageMock.getToken).toHaveBeenCalled();
      expect(req.request.headers.get('Authorization')).toBe(
        `Bearer ${fakeToken}`,
      );
    });
  });

  describe('when no token is present', () => {
    it('should not set "Authorization" header', () => {
      const { authStorageMock, httpClient, httpTestingController } = setup();

      authStorageMock.getToken.mockReturnValue(null);

      httpClient.get(fakeEndpoint).subscribe();
      const req = httpTestingController.expectOne(fakeEndpoint);

      expect(authStorageMock.getToken).toHaveBeenCalled();
      expect(req.request.headers.has('Authorization')).toBe(false);
    });
  });
});
