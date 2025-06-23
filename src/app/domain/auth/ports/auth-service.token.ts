import { InjectionToken } from '@angular/core';

import { AuthServicePort } from './auth-service.port';

export const AUTH_SERVICE = new InjectionToken<AuthServicePort>(
  'AuthServicePort'
);
