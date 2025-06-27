import { inject, Injectable } from '@angular/core';

import { AlertParameterizationServicePort } from '../../domain/alert-parameterization/ports/alert-parameterization.port';
import { AlertParameterization } from '../../domain/alert-parameterization/models/alert-parameterization.entity';

@Injectable({ providedIn: 'root' })
export class FirebaseAlertParameterizationAdapter implements AlertParameterizationServicePort {
    constructor() {}
    createAlertParameterization(data: AlertParameterization): Promise<AlertParameterization> {
        throw new Error('Method not implemented.');
    }
    updateAlertParameterization(id: string, data: AlertParameterization): Promise<AlertParameterization> {
        throw new Error('Method not implemented.');
    }
    deleteAlertParameterization(id: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
    getAlertParameterization(id: string): Promise<AlertParameterization | null> {
        throw new Error('Method not implemented.');
    }
    listAlertParameterizations(): Promise<AlertParameterization[]> {
        throw new Error('Method not implemented.');
    }
}