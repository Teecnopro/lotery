import { PaymentParameterization } from '../models/payment-parameterization.entity'

export interface PaymentParameterizationServicePort {
  createPaymentParameterization(data: PaymentParameterization): Promise<PaymentParameterization>;
  updatePaymentParameterization(id: string, data: PaymentParameterization): Promise<PaymentParameterization>;
  deletePaymentParameterization(id: string): Promise<void>;
  getPaymentParameterization(id: string): Promise<PaymentParameterization | null>;
  listPaymentParameterizations(): Promise<PaymentParameterization[]>;
}