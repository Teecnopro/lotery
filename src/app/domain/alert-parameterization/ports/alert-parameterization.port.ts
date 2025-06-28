import { AlertParameterization } from '../models/alert-parameterization.entity'

export interface AlertParameterizationServicePort {
  createAlertParameterization(data: AlertParameterization): Promise<AlertParameterization>;
  updateAlertParameterization(id: string, data: AlertParameterization): Promise<AlertParameterization>;
  deleteAlertParameterization(id: string): Promise<void>;
  getAlertParameterization(id: string): Promise<AlertParameterization | null>;
  listAlertParameterizations(): Promise<AlertParameterization[]>;
  getAlertParameterizationByValue(value: number | string | undefined, digits?: number | undefined): Promise<AlertParameterization | null>;
}
