import {
  EnvironmentProviders,
  inject,
  provideAppInitializer,
} from '@angular/core';

import { AuthFacade } from '../services/auth-facade';

export function restoreAuthStateInitializer(): EnvironmentProviders {
  return provideAppInitializer(() => inject(AuthFacade).restoreAuthState());
}
