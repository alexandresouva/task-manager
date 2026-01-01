import { TestBed } from '@angular/core/testing';

import { LOCAL_STORAGE } from './local-storage.token';

describe('LOCAL_STORAGE token', () => {
  it('should resolve browser localStorage', () => {
    const storage = TestBed.inject(LOCAL_STORAGE);

    expect(storage).toBe(localStorage);
  });
});
