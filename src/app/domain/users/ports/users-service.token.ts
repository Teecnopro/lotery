import { InjectionToken } from '@angular/core';

import { UserServicePort } from './users-service.port';

export const USER_SERVICE = new InjectionToken<UserServicePort>(
  'UserServicePort'
);
