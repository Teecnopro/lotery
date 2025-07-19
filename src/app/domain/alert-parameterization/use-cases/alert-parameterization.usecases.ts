import { inject } from '@angular/core';

import { ALERT_PARAMETERIZATION_SERVICE } from '../ports';
import { AlertParameterization } from '../models/alert-parameterization.entity';

export class AlertParameterizationUseCase {
  private alertParameterization = inject(ALERT_PARAMETERIZATION_SERVICE);

  createAlertParameterization(data: AlertParameterization): Promise<AlertParameterization> {
    return this.alertParameterization.createAlertParameterization(data);
  }
  updateAlertParameterization(id: string, data: AlertParameterization): Promise<AlertParameterization> {
    return this.alertParameterization.updateAlertParameterization(id, data);
  }
  deleteAlertParameterization(id: string): Promise<void> {
    return this.alertParameterization.deleteAlertParameterization(id);
  }
  getAlertParameterization(id: string): Promise<AlertParameterization | null> {
    return this.alertParameterization.getAlertParameterization(id);
  }
  listAlertParameterizations(): Promise<AlertParameterization[]> {
    return this.alertParameterization.listAlertParameterizations();
  }
  getAlertParameterizationsByValue(
    value: number | string  | undefined,
    digits?: number | undefined
  ): Promise<AlertParameterization | null> {
    return this.alertParameterization.getAlertParameterizationByValue(value, digits);
  }
}