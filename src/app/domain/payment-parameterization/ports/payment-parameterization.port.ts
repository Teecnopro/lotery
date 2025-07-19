import { PaymentParameterization } from '../models/payment-parameterization.entity'

export abstract class PaymentParameterizationServicePort {
  abstract create(data: PaymentParameterization): Promise<PaymentParameterization>;
  abstract update(uid: string, data: PaymentParameterization): Promise<PaymentParameterization>;
  abstract delete(uid: string): Promise<void>;
  abstract getAll(): Promise<PaymentParameterization[]>;
  abstract getByUid(uid: string): Promise<PaymentParameterization | null>;
  abstract getPaymentParameterizationByValue(
    amount: number | string | undefined,
    digits?: number | undefined,
    combined?: boolean | undefined
  ): Promise<PaymentParameterization | null>;
}