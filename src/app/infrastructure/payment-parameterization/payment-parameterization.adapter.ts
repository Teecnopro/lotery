import { inject, Injectable } from '@angular/core';

import { PaymentParameterizationServicePort } from '../../domain/payment-parameterization/ports/payment-parameterization.port';
import { PaymentParameterization } from '../../domain/payment-parameterization/models/payment-parameterization.entity';

@Injectable({ providedIn: 'root' })
export class FirebasePaymentParameterizationAdapter implements PaymentParameterizationServicePort {
    constructor() {}
    createPaymentParameterization(data: PaymentParameterization): Promise<PaymentParameterization> {
        throw new Error('Method not implemented.');
    }
    updatePaymentParameterization(id: string, data: PaymentParameterization): Promise<PaymentParameterization> {
        throw new Error('Method not implemented.');
    }
    deletePaymentParameterization(id: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
    getPaymentParameterization(id: string): Promise<PaymentParameterization | null> {
        throw new Error('Method not implemented.');
    }
    listPaymentParameterizations(): Promise<PaymentParameterization[]> {
        throw new Error('Method not implemented.');
    }
}