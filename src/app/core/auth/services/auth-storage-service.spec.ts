import { TestBed } from '@angular/core/testing';

import { LOCAL_STORAGE } from '@shared/tokens/local-storage.token';
import { MockProvider } from 'ng-mocks';

import { AuthStorageService } from './auth-storage-service';

function setup() {
  TestBed.configureTestingModule({
    providers: [
      MockProvider(LOCAL_STORAGE, {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      }),
    ],
  });
  const service = TestBed.inject(AuthStorageService);
  const storage = TestBed.inject(LOCAL_STORAGE);
  return { service, storage };
}

describe('AuthStorageService', () => {
  it('should be created', () => {
    const { service } = setup();
    expect(service).toBeTruthy();
  });

  it('should set token in localStorage', () => {
    const { service, storage } = setup();
    const fakeToken = 'fakeToken';

    service.setToken(fakeToken);
    expect(storage.setItem).toHaveBeenCalledWith('auth_token', fakeToken);
  });

  it('should get token from localStorage', () => {
    const { service, storage } = setup();
    const fakeToken = 'fakeToken';

    (storage.getItem as jest.Mock).mockReturnValue(fakeToken);
    const result = service.getToken();

    expect(storage.getItem).toHaveBeenCalledWith('auth_token');
    expect(result).toBe(fakeToken);
  });

  describe('when checking if token exists', () => {
    it('should return true if token is found', () => {
      const { service, storage } = setup();
      const fakeToken = 'fakeToken';

      (storage.getItem as jest.Mock).mockReturnValue(fakeToken);
      const result = service.hasToken();

      expect(storage.getItem).toHaveBeenCalledWith('auth_token');
      expect(result).toBe(true);
    });

    it('should return false if token is not found', () => {
      const { service, storage } = setup();

      (storage.getItem as jest.Mock).mockReturnValue(null);
      const result = service.hasToken();

      expect(storage.getItem).toHaveBeenCalledWith('auth_token');
      expect(result).toBe(false);
    });
  });

  it('should remove token from localStorage', () => {
    const { service, storage } = setup();
    service.clearToken();
    expect(storage.removeItem).toHaveBeenCalledWith('auth_token');
  });
});
