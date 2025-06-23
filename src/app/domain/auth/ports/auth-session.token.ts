import { InjectionToken } from '@angular/core';

import { AuthSessionPort } from './auth-session.port';

export const AUTH_SESSION = new InjectionToken<AuthSessionPort>(
  'AuthSessionPort'
);
