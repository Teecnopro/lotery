import { inject } from '@angular/core';

import { Observable } from 'rxjs';

import { ALERT_PARAMETERIZATION_SERVICE } from '../ports';
import { AlertParameterization } from '../models/alert-parameterization.entity';

export class AlertParameterizationUseCase {
  private alertParameterization = inject(ALERT_PARAMETERIZATION_SERVICE);
}