import { InjectionToken } from '@angular/core';
import { RegisterBetsServicePort } from './register-bets.port';

export const REGISTER_BETS_SERVICE = new InjectionToken<RegisterBetsServicePort>(
  'RegisterBetsServicePort'
);
