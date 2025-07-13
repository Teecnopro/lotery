import { InjectionToken } from '@angular/core';
import { DeleteBetsServicePort } from './delete-bets.port';

export const DELETE_BETS_SERVICE = new InjectionToken<DeleteBetsServicePort>(
  'DeleteBetsServicePort'
);
