import { InjectionToken } from '@angular/core';

import { AlertParameterizationServicePort } from './alert-parameterization.port';

export const ALERT_PARAMETERIZATION_SERVICE = new InjectionToken<AlertParameterizationServicePort>(
  'AlertParameterizationServicePort'
);