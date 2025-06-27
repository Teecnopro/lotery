import { inject } from '@angular/core';

import { Observable, from } from 'rxjs';

import { ALERT_PARAMETERIZATION_SERVICE } from '../ports';
import { AlertParameterization } from '../models/alert-parameterization.entity';

export class AlertParameterizationUseCase {
  private alertParameterization = inject(ALERT_PARAMETERIZATION_SERVICE);

  createAlertParameterization(data: AlertParameterization): Observable<AlertParameterization> {
    return from(this.alertParameterization.createAlertParameterization(data));
  }
  updateAlertParameterization(id: string, data: AlertParameterization): Observable<AlertParameterization> {
    return from(this.alertParameterization.updateAlertParameterization(id, data));
  }
  deleteAlertParameterization(id: string): Observable<void> {
    return from(this.alertParameterization.deleteAlertParameterization(id));
  }
  getAlertParameterization(id: string): Observable<AlertParameterization | null> {
    return from(this.alertParameterization.getAlertParameterization(id));
  }
  listAlertParameterizations(): Observable<AlertParameterization[]> {
    return from(this.alertParameterization.listAlertParameterizations());
  }
}