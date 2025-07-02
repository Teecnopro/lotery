import { InjectionToken } from '@angular/core';

import { BetsRepositoryPort } from './bets-repository.port';

export const BETS_REPOSITORY_SERVICE = new InjectionToken<BetsRepositoryPort>(
  'BetsRepositoryPort'
);
